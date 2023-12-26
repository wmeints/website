---
title: Break open your machine learning model with plsexplain
category: Machine Learning
datePublished: '2021-07-01'
dateCreated: '2021-07-01'
---
While working with some of the popular explainable AI libraries out there I 
kept running into the fact that it's quite a lot of work to set up explainers
for your machine learning models. I figured: Why not ask the computer to come
up with some useful explanations on its own?

I built a new tool called `plsexplain` that asks the computer: Please explain?!
You feed it a model and a dataset and it will show a beautiful interactive
dashboard that explains various aspects of your model.

## Installing the dashboard

You can install the plsexplain tool by using the following command in your
favorite terminal:

```
pip install plsexplain
```

Make sure you have `scikit-learn` and `pandas` installed as well. I haven't
included those in the package requirements just yet.

After installing the package, you can start creating your dashboard.

## How the dashboard works

To create a explanation for your model, you can call the following command
in your terminal:

```
plsexplain <model> <dataset>
```

When you press <kbd>ENTER</kbd> the application will start to build the
dashboard for you. This usually takes up to 30 seconds depending on processor
speed and the size of the dataset you provided.

While building the dashboard the program will show a nice progressbar.

Once the dashboard is ready, a new browser window is opened and you'll see
a webpage similar to this:

![Performance metrics](/content/images/2021/07/01/dashboard-01.png)

You can immediately see the performance metrics and some information about
your model. When you click on the "Model" page, you'll get a different view.

![Model explanations](/content/images/2021/07/01/dashboard-02.png)

This page shows you the impact that each feature has on the outcome of your 
model. You can click on one of the features to zoom in and get more information
about the impact of individual values of the feature on the outcome of the model.

## Limitations and known issues

Right now, the dashboard functionality is limited to model-level explanations.
I'm working on building prediction level explanations into the dashboard as
well.

At the moment I'm recovering from an operation so it's slow going. However, I'll
finish the work on the prediction-level explanations once I'm back on my feet.

The dashboard supports `scikit-learn` based models. And it requires a CSV file
with a header and comma as the separator for the fields.

## Plans for the future

It's cool that you can have a basic model explanation with one command. To me
it looks promising and I'm planning to add some more things to it:

* Support for tensorflow and pytorch: I'm planning on supporting these models
  so you can get insights into those types of models as well.
* Support for more dataset types: CSV files are pretty limited. Once I'm going
  to work on the deep-learning models, I'm also going to add support for images
  so that you can explain computer vision models as well as tabular models.
* Support for live monitoring: The offline use of this dashboard is nice, but I
  think it will be even more powerful when you add support for live monitoring.
  The idea is that you can send samples to the dashboard through an API and they
  will get explained as they come in.

The list is longer than I'm showing here. I have loads more ideas, but I'm also
looking for feedback on this initial version of the dashboard.

Please let me know what you think!

## Contributing

If you're interested in adding new features or fixing bugs, please head on over
to Github: [https://github.com/wmeints/plsexplain](https://github.com/wmeints/plsexplain) and submit your issues
and pull requests there.
