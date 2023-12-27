---
title: How to deploy Airflow with Kubernetes and GIT
category: Machine Learning
datePublished: "2022-09-08"
dateCreated: "2022-09-08"
---

When I started working on MLOps a couple of years ago I ran into Azure Machine
Learning first, because that's what the community around me was using. Turns
out, it's not the only product out there. I already knew this, but I Ignored other
products because we were happy with Azure ML at the time.

Now this may sound like I'm no longer happy with Azure ML and want to move away.
But that's not what this is about. I think you should always explore other
technology options from time to time.

In this post we're going to take a look at Apache Airflow. It's a tool for
building data pipelines that does an awesome job as a ML pipeline too.

We're going to look at how to set up Airflow on Kubernetes and link it up to GIT
so we can load pipelines from a repository instead of uploading them to the
server manually.

Let's dive right in!

## What is Apache Airflow?

In the introduction I mentioned that Apache Airflow is a tool to build data and
ML pipelines. That's not entirely true. You can build workflows that run tasks.
Each task can be a shell script, python program, or some other task that
executes logic.

You can use Apache Airflow for data processing but it's not a data processing
tool by itself. Rather, it makes sure that tasks get executed in the order you
specify on one machine or more machines if necessary. It uses a principle called
the asyclic directed graph (DAG). It's a dependency graph for tasks.

Apache Airflow a powerful tool because you have a good overview of what tasks are
executed in a workflow. It's flexible enough to allow for many types of tasks in a
single workflow.

You can't really flow data between tasks. You'll need to store the data
somewhere if you need it in the next task. Apache Airflow can flow metadata
however, so you can pass along the location where data is available.

Now that you've got a picture of what Apache Airflow can do, let's take a look
at deploying it on Kubernetes.

## Setting up Airflow on Kubernetes

You can run Apache Airflow locally using Python. This is a great for testing
workflows. However, you'll want a little more compute power for production
scenarios.

To run Apache Airflow in production you'll need to either set up multiple
virtual machines or use something like Kubernetes to host the tools.

For the purpose of this post I'm going to use Kubernetes as the hosting
platform.

Apache Airflow provides a helm chart to deploy the required components on
Kubernetes.

Helm is a package manager for Kubernetes. It allows you to install a diverse set
of applications on Kubernetes without having to manually install tens or
hundreds of manifests.

If you haven't used Helm before, you can find a great getting-started guide on
[their website](https://helm.sh/docs/intro/quickstart/).

Before you can install Airflow with Helm, you'll need to tell Helm about the
Apache Airflow Helm repository. Use the following command to configure the right
Helm repository:

```shell
helm repo add apache-airflow https://airflow.apache.org
helm repo update
```

After configuring the Helm repository, you can install the Airflow components
using another command in the terminal:

```shell
helm upgrade airflow apache-airflow/airflow --namespace airflow
```

This command will install Airflow with a set of default configuration settings.
This is fine for development, but we'll want a little more for production.

## Getting Airflow ready for production

When you don't specify any settings you'll find that the passwords and secrets
are rather weak. So you'll want to add some configuration to your Airflow
installation.

Let's create a new file called `values-secrets.yml` and add the following
settings to it:

```yaml
webserverSecretKey: <random-string>
defaultUser.password: <your-password>
data:
  metadataConnection:
    user: postgres
    pass: <your-password>
```

We're configuring a set of secrets in this file:

- First, we configure the `webserverSecretKey` so that sessions are signed with
  unique signature. This prevents users from transferring a session between
  different installations of Airflow.
- Next, we configure the password for the default user `admin`. You'll want to
  set something strong here.
- Then, we configure the username and password for the database connection. The
  helm chart for Airflow configures a database server and the airflow server.
  Helm will automatically set the right password for the database server and the
  airflow server so it can connect.

After setting up the secrets, you can update the Airflow installation using the
following command:

```shell
helm upgrade airflow apache-airflow/airflow --namespace airflow \
    -f values-secrets.yml
```

Previously, we only specified the name of the installation and which package to
install. Now we've added a set of values to use that we've stored in the
`values-secrets.yml` file.

When you've installed Airflow in Kubernetes you can access it by forwarding the
port to the webserver using the following command:

```shell
kubectl port-forward -n airflow svc/airflow-webserver 8080:8080
```

Open up a webbrowser and login with the credentials you've stored in the secrets
file.

If everything went as expected, you should now see the user interface of
Airflow. Let's configure it to load some DAGs from a repository.

## Connecting a GIT repository to Airflow

Airflow stores DAGs in a folder called `dags`. You'll need to upload your DAG
files to this folder or sync them through some other means.

We're in luck here, because Airflow has an option to synchronize DAG files from
GIT into the right location for Airflow to run them.

We need to create another file called `values-sync.yml` and add the following
content to it:

```shell
dags:
    gitSync:
        repo: <repo-url>
        branch: main
        depth: 1
        enabled: true
        subPath: dags
        sshKeySecret: airflow-ssh-secret
extraSecrets:
  airflow-ssh-secret:
    data: |
      gitSshKey: '<your-key>'
```

You'll need to configure the URL to your GIT repository. I've used a Github
repository in the [sample code](https://github.com/wmeints/mlops-airflow-sample).

Next, you're going to have to tell Airflow where the DAG files are located in
the repository. I've stored them in a sub folder, but you can store them in the
root folder. If you're going to store the files in the root folder, you'll need
to clear out the value for `subPath`.

If you're using a private repository, you'll need to deploy a SSH public key to
the Github repo you want to link and store the private key in the `gitSshKey`
setting. Make sure you encode the private key as Base64, otherwise the sync
process can't read it.

After you've configured the settings for the GIT synchronization, you can update
the installation using the following command:

```shell
helm upgrade airflow apache-airflow/airflow --namespace airflow \
    -f values-secrets.yml -f values-override.yml
```

Once the installation is finished updating, you can commit your first DAG to
source control. Let's take a quick look at building a sample DAG for
completeness.

## Building a DAG for Apache Airflow

If you're already writing DAGs in Apache Airflow then this next bit is boring.
However, I think it's nice to take a short look at a DAG in case you haven't
seen one before.

Apache Airflow has two methods for building a workflow using a DAG. You can
build it entirely out of tasks that run on operators. You can also use the
Taskflow API.

I'm going to show off the Taskflow API because it's the quickest one to get
started with.

As an example, I've created a very basic DAG that's not going to do anything
specific. It's here to show you the basic principle of what a DAG looks like:

```python
from airflow.decorators import dag, task
import pendulum


@dag(
    schedule_interval=None,
    start_date=pendulum.datetime(2021, 1, 1, tz='UTC'),
    catchup=False,
    tags=['sample']
)
def sample_etl():
    @task()
    def extract():
        pass

    @task()
    def transform():
        pass

    @task()
    def load():
        pass

    extract() >> transform() >> load()

sample_dag = sample_etl()
```

We'll need two things to build a DAG. First, we need to create a function marked
with `@dag()` that will build the flow of tasks. Each task is a function marked
with `@task()`.

We're setting the `schedule_interval` to `None` so the DAG isn't executed
automatically. You can set the interval to daily, hourly or a custom setting.

The start date tells Airflow when the DAG should be first scheduled. We've set
this to a past date. But you can set this to a future date.

We've got three tasks, extract, transform, and load. These tasks have to be
executed in order. We can tell the runtime this by forwarding each of the tasks
to the next.

Note, we're calling the tasks here, but that doesn't execute them. It merely
tells the scheduler which task to execute when.

Finally, we invoke the DAG function to tell the runtime we have a new DAG to
load.

It looks like regular Python, but it's not. Each function gets packed up into a
Kubernetes pod and will be executed when the DAG is scheduled by Airflow.

When you commit the new DAG to the linked repository, it will be available a
minute after you've pushed the changes.

## Summary

I'm impressed by Apache Airflow. At first, I thought it wasn't all that great
because the user interface is not as fancy as the one provided by Microsoft.
However, the engine is lightning fast, and it's really easy to write a pipeline.

Another great feature is that it syncs with source control. That way, I know
what stuff is getting executed on an environment.

A good tip: It's useful to have a staging environment that reads from the main branch
and a production environment that reads from a release branch. No need to mess up
production if you ask me.

Interested in the code? You can [get it here](https://github.com/wmeints/mlops-airflow-sample) and try it out yourself 😊
