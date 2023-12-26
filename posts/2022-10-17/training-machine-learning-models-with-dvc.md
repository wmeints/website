---
title: Training machine-learning models with DVC
category: Machine Learning
datePublished: '2022-10-17'
dateCreated: '2022-10-17'
---
In [my previous post][PREV_POST] I showed how to use DVC to manage data for your
machine-learning project. Today it's time to take things to the next level.
Let's build a pipeline to train a machine-learning model with DVC.

## Quick reminder: What was DVC again?

DVC is a tool that helps version data used in a machine-learning project.
It removes the need to create separate folders for your models. Instead you
version the data using a storage account and your local GIT repository. You can
use a wide variety of remote storage accounts to keep your data safe.

## About the sample in this article

In this article I'm using a toy project that I've used over the past few months
to test various MLOps tools. It's a model that predicts waiting times for dutch
healthcare based on a [public dataset][DATASET].

The model uses the following features to predict the waiting time:

- TYPE_WACHTTIJD: The type of visit ('Behandeling', 'Diagnostiek', 'Polikliniekbezoek')
- SPECIALISME: The specialization we're predicting the waiting time for
- ROAZ_REGIO: The region in the Netherlands ('Brabant', 'Euregio', 'Limburg', 'Midden-NL', 'Noord-NL', 'Noordwest', 'Oost', 'SpzNet AMC', 'West', 'Zuidwest-NL', 'Zwolle')
- TYPE_ZORGINSTELLING: The type of healthcare provider we're predicting for (Kliniek, Ziekenhuis)

You can find the code for the sample on [Github][DEMO_CODE].

We use two scripts to train the model:

* `src/prepare.py` - Extracts the features from the raw dataset and cleans the data.
* `src/train.py` - Trains the model based on the extracted features and stores the trained model on disk.

It's not a overly complicated project, but enough to get a feel for how DVC works.
Make sure to download the sources if you want to follow along with the post.

## Building a pipeline to train a model

In the previous post we've used the basic commands available in DVC to manage
the data for a machine-learning project. That's nice, but most of us will have
a couple of steps that need to be performed before we have a working
machine-learning model.

This is where data pipelines come into play. DVC allows the use of stages to
combine several steps into a data pipeline. 

Each step is implemented as a shell command. For each step you can define
dependencies and outputs. When one step depends on the output of another step,
DVC will order the steps based on the dependencies of each step. When the
dependencies of a step haven't changed, the step is skipped.

Here's how to set up a pipeline.

### Adding the source dataset

Before we can add the stages to the pipeline, we need to make sure DVC knows
about the source data. Download the [sample dataset][DATASET] and save it as 
`data/raw/wachtijden.csv` in the project.

Next, run the following command to add the dataset to DVC:

```
dvc add data/raw
```

With the dataset stored in DVC, we can move on to the first stage of the data
pipeline.

### Building a data preparation step

For the first step in the pipeline we need to execute the following command:

```
dvc stage add prepare -d data/raw/wachttijden.csv -d src/prepare.py -o data/intermediate/wachttijden.csv python src/prepare.py data/raw/wachttijden.csv data/intermediate/wachttijden.csv
```

The `dvc stage add` command needs a set of dependencies specified with `-d`. 
We've provided the input dataset as a dependency. We also provide the the
prepare script as a dependency. When one of these files changes, we want
the stage to be invalidated.

The final argument for the stage command is the script command-line we use to
run the preparation script.

### Building a training step

With the preparation step in place, let's add another stage for the training script:

```
dvc stage add train -d data/intermediate/wachttijden.csv -d src/train.py -o models/classifier.bin -m metrics.json python src/prepare.py data/raw/wachttijden.csv data/intermediate/wachttijden.csv
```

This stage looks similar to the previous stage. We've added an additional
parameter: `-m metrics.json`. We use this to keep track of metrics generated
as part of the training script.

Note that the training script needs to store the metrics as a dictionary in 
`metrics.json` for DVC to pick the metrics up.

The following code demonstrates how to save the metrics:

```python
with open('metrics.json', 'w') as metrics_file:
    metrics_dict = {
        'r2': score
    }

    metrics_file.write(json.dumps(metrics_dict))
```

First, we open `metrics.json` to write text to it. Then, we store the score for
the model in a dictionary. Finally, we dump the dictionary to JSON and write
it to the metrics file.

## Running the experiment on your computer

With the pipeline completed, we can now run it. Use the following command
to run the pipeline:

```
dvc repro
```

DVC will first run the `src/prepare.py` script and then the `src/train.py` script.
The output is the trained model and a set of metrics.

Once the script is completed you can check the metrics using the following
command:

```
dvc exp show
```

Fun fact, DVC will version the generated model for you. So whenever you feel the need, you can go back to
a previous model that you've trained with the matching dataset version. 

## Summary

The pipeline feature in DVC just makes sense when you're building machine-learning models.

In my previous post I mentioned that the data versioning with GIT is awesome.
But it turns out that's not all. When you use pipelines you can version your models too.

It's nice to see that they've thought about reproducability. Whenever a step is unchanged, 
DVC skips that steps saving you time. 

So far, DVC has been a great pleasure to work with. Hope that you've enjoyed this
article too.

[PREV_POST]: https://fizzylogic.nl/2022/10/14/managing-machine-learning-datasets-with-dvc
[DATASET]: https://puc.overheid.nl/PUC/Handlers/DownloadDocument.ashx?identifier=PUC_656543_22&versienummer=1
[DEMO_CODE]: https://github.com/wmeints/dvc-demo
