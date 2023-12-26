---
title: How to build scalable workflows with Prefect and Ray
category: Machine Learning
datePublished: '2022-12-23'
dateCreated: '2022-12-23'
---
In the past weeks we've been working on a new computer vision project at Aigency.
As part of the project we have to process images using OpenCV image filters. This
is a rather tedious process that takes a lot of time, so we made a nice workflow
for it. In this blog post I'll show you how we used Prefect and Ray to build a
scalable image processing workflow.

## What is Prefect?

As many will know, machine-learning and data engineering projects often use pipelines,
workflows or DAGS to process large amounts of data. There are plethora of tools out there
to perform machine learning and data processing tasks.

At Aigency we've used a number of different tools like Azure Synapse, Spark, and 
Airflow. Azure Synapse and Spark are on the large end of the spectrum and quite
expensive. Airflow can be used for large projects, but we used it mostly for smaller
things.

There is however, a new kid on the block: Prefect. A workflow engine that allows
you to build workflows completely in Python. A very basic workflow for Prefect
looks like this:

```python
from prefect import task, flow

@task
def calculate_numbers(a, b):
    return a + b

@flow
def process_all_the_numbers():
    result = calculate_numbers(100, 200)

if __name__ == "__main__":
    process_all_the_numbers()
```

A workflow in Prefect starts with a method decorated with `@flow`. This method
chains together multiple tasks. Tasks are written as python methods decorated
with `@task`.

To run a workflow, you can run it from the command line using python. It will then
run on your local machine of course. 

When you're happy with the workflow, you can deploy it to a Prefect server.
This allows the workflow to be scheduled.

Prefect is available as a Python package, and can be installed like so:

```
pip install prefect
```

Now that you have a basic understanding of what Prefect is, let's dive a little
deeper into our use case.

## Processing data in parallel with Prefect

For our solution we need to tune the parameters of the OpenCV pipeline. We use a
basic hyper parameter search algorithm for this that works like this:

1. First, we collect the images that we want to process
2. Next, we generate a collection of randomly choosen hyper parameters
3. Then, we use the collection of images, and the collection of parameters to run experiments
4. After the experiments are completed, we combine the output of the experiments into a report

You can build such a workflow with the following code:

```python
from prefect import flow, task

@task
def find_images(input_folder: str) -> List[str]:
    return [path.join(input_folder,filename) for filename in listdir(input_folder)]

@task
def process_images(image_files: List[str], settings: RunSettings) -> ProcessingResult:
    # Perform processing on the image files
    result = ProcessingResult(data=x)

@task
def generate_run_settings(num_experiments: int, space: SearchSpace) -> List[RunSettings]:
    return [SearchSpace.random() for _ in range(num_experiments)]

@task
def collect_results(results: List[ProcessingResult]) -> None:
    # Collect the results, and write to a metrics file.

@flow
def tune_pipeline(input_folder: str) -> None:
    image_files = find_images(input_folder)
    run_settings = generate_run_settings(num_experiments, space)
    
    image_files = [image_files for _ in range(num_experiments)]

    results = process_images.map(image_files, run_settings)

    collect_results(results)

if __name__ == "__main__":
    tune_pipeline("data/raw")
```

There are a couple of highlights in this code:

First, notice that we parameterized the workflow with the input folder. We provide
a default value for it in the script. However, when you deploy the workflow to the
Prefect server, you can specify it in configuration.

Next, In the `tune_pipeline` we call the method `map` on the `process_images` function 
as if it were an object. We can do this because the `@task` decorator turned it 
into a `Task` that we can manipulate. The `map` method will iterate over lists
of parameters and call the underlying method with the values in the lists.

The `map` method returns a list of futures that you can collect. When you do this directly
in the flow it's quite hard to work with. However, if you give the list of results to another
task, in this case `collect_results`, Prefect will automatically wait for all the results
to arrive and unwrap them for you.

When you run the workflow code without any additional configuration, you'll notice
that it is trying to paralellize the `process_images` task. It sort of works, 
but isn't very ideal.

It's time to something about that.

## What is Ray?

Prefect uses a task runner to run each of the tasks in a flow. By default it uses a `ConcurrentTaskRunner`. 
It works, but not for huge amounts of tasks. It sometimes fails for unclear reasons.
You have options to use other task runners, like Ray.

Ray is a distributed runtime for Python often used in machine learning projects because it's
capable of training models in a distributed fashion too. 

Ray has two primitives: Tasks, and Actors. A task is a stateless function, can accept input and can produce output.
An actor is a class with state running on a Ray node.

Since you can schedule python functions on Ray, it's a great candidate for running workflow tasks.

## Using ray to run tasks

To use ray, you'll need to install two packages using pip:

```
pip install ray prefect-ray
```

Next, you'll need to modify the workflow code, so it looks like this:

```python
from prefect_ray import RayTaskRunner

@flow(task_runner=RayTaskRunner)
def tune_pipeline(input_folder: str) -> None:
    # Other code
    pass
```

And that's it, you can run it as you would before, by starting the script
from the commandline.

If you're deploying the workflow to a Prefect server, you'll need to add one
more piece of configuration, the address of your Ray cluster.

```python
from prefect_ray import RayTaskRunner

@flow(task_runner=RayTaskRunner("my-ray-server:6379"))
def tune_pipeline(input_folder: str) -> None:
    # Other code
    pass
```

You can create a Ray cluster using the instructions [in the manual](https://docs.ray.io/en/latest/cluster/getting-started.html).
Fun fact, it runs on Kubernetes, or on a set of VMs. Even a single VM works.

It takes a bit of work to configure everything, but the experience is great.

## Tips and tricks

There are a few things that we found are important to keep in mind when
working with Ray and Prefect.

### Exchange small pieces of data between tasks

Tasks can return any python object you like. However, if you pass a lot of data
and you're running on Ray, you'll find that it generates a ton of network traffic.

If you have to work with large amounts of data, we recommend storing it on disk
and pass along a filename. We also recommend keeping tasks together that
require the same large dataset so you don't have to shuffle data around as much.

###  Write unit-tests

Yes, that's a thing, I know a lot of data scientists never hear of these :P
Since you can run the workflow locally, you can write unit-tests for your
workflow code. It will save you a lot of time.

### Skip the Sqlite database

Prefect uses a database to store workflow runs and task runs. By default it
creates a sqlite database in a hidden folder in your user home folder.

Sqlite can't handle parallel calls. So, when you start using Ray you'll quickly
run into database problems.

We replaced the local database with a docker container running postgres. Yes,
it's more work to configure, but it will save you a lot of trouble.

You can find how to set up a proper database for Prefect [in the manual](https://docs.prefect.io/concepts/database/).

## Conclusion

In this post we've covered how to build workflows to process data in parallel with Prefect.
We've covered how to supercharge the task runner with Ray so you can run tasks
on a cluster. Finally, we've covered a few handy tips to make the most out
of the setup.

Hope you enjoyed this one!
