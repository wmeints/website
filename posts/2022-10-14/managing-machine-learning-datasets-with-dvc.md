---
title: Managing machine-learning datasets with DVC
category: Machine Learning
datePublished: '2022-10-14'
dateCreated: '2022-10-14'
---
Managing machine-learning projects is just a little more complex than regular software projects. You have to manage
the code, the dataset that you use for training, and the model that you've trained to get a properly versioned program.

I've found that most of the current MLOps tools that are around today offer some support for versioning data, models, 
and code, but they aren't great for data scientist with a more code-oriented workflow.

A couple of colleagues pointed me towards DVC, a data versioning tool that is supposed to make versioning data for
machine-learning projects a lot easier. I've tried it and in this post I'm going to take you along a tour around DVC and
how it helps version data for machine-learning projects.

## What is DVC?

One of the challenges with machine-learning is that your program doesn't just use code to do its job. It needs a
combination of data and code to build part of the application. The data and the code create a representation of reality
that is then used by the rest of the application to do its job.

Most of us are used to version their code using GIT or some other version control system. This ensures that when we 
are searching for specific information about the code, we can get it back. 

In a machine learning project you want the same thing. You may want to grab a specific version of the code to reproduce
a bug or add a feature. But as we talked about before, you need a specific version of the data too to reproduce the
state of your project.

This is where DVC comes in. DVC is a data version control system that borrows much of its functionality from GIT. Since
GIT is really good at storing small files, but not good at storing large files, DVC avoids storing the data in GIT. It
tracks version and configuration in GIT. The data itself is not stored in GIT but in a big file storage such as an
Azure Storage Account or Amazon S3.

You can push data to remote storage and pull it back later. Just like you would with GIT. So for a data scientist, the
process of managing data is very similar to managing regular source files.

Let's take a look at how you can install and use DVC in your project.

## Installing DVC

To install DVC on Windows you can use a tool like Winget. Or you can use PIP to install DVC as a python package.
You can also install DVC on Linux and Mac with similar tools. For the sake of this article, we'll install DVC as a 
Python package using the following command:

```
pip install dvc
```

After you've installed DVC, you can set up your project to use DVC.

## Adding your first dataset to DVC

Before you can add data to DVC, you'll need to initialize DVC in your project. Run the following command in your project
directory to initialize DVC:

```shell
dvc init
```

Commit the changes to GIT after setting up DVC using the following command:

```shell
git commit -am "Initialize DVC"
```

The beauty of DVC is that you can start with a local copy of your dataset. As an example, you can have a folder
structure that looks like this:

```text
- data
  - train
  - test
```

To store the dataset in DVC you can run the following command:

```shell
dvc add data
dvc commit -m "Add dataset"
```

This generates a new set of changes that you'll need to commit to GIT. After committing to GIT you have your dataset
versioned with your code. Now we need to make sure that we have a remote copy so team members can use the dataset too.

## Storing data remotely

DVC allows remote storage of datasets in cloud storage or on a file server. As an exmaple, we'll store the data in an
Azure Storage Account.

You can add a new remote storage account using the following command:

```shell
dvc remote add -d origin azure://datasets/my-project
dvc remote modify origin account_name 'myaccount'
```

Make sure you have a storage account with a blob container named `datasets`. The code above assumes that you're logging
in with the Azure CLI before pushing the data to the storage account. As an alternative you can configure a SAS token
or access key. We recommend sticking to the Azure CLI method on your work station as it's a safer alternative.

You can find more information about configuring remotes in 
[the documentation](https://dvc.org/doc/command-reference/remote/modify)

After configuring the remote, commit the changes to GIT and run the following command to push the files to the
storage account:

```shell
dvc push
```

The push operation can take a while, depending on how large your dataset is. Once you've pushed the files it's time
to take a peek at how you can get the data back when on a different machine.

## Getting the data back

Working with DVC is much like working with GIT when it comes to pushing to remote storage accounts and pulling data
from remote storage accounts. To get remote data into your working directory, you can run the following command:

```shell
dvc pull
```

Please note that getting data to your workstation can take a while depending on the size of the dataset.
After you've pulled the data, you can work with it as normal. 

Now let's move on to managing versions and branches.

## Managing versions and branches

Many data scientists are used to creating directories like `data/model_v1_tree` and `data/model_v2_binarized` etc. This
works as long as you're alone. By using DVC we can get rid of the many directories and manual dataset versioning tricks.

Instead, you've now codified the versions of the dataset in the GIT history alongside the changes you've made to your
code. This means that you've now got a proper journal of your work.

Let's look at some useful commands that you're going to need while working with DVC and GIT.

### Committing changes to datasets

As you're working on your project you're going to be changing data. These changes aren't automatically stored in DVC.
You'll need to run `dvc commit -m "<message>"` to store the changes in the cache and prepare them for remote storage.

### Switching branches

When you clone a repo or switch a branch in GIT you'll need to run `dvc checkout` to ensure you have the right metadata
before running `dvc pull` to update the local storage of your dataset files.

### Removing data

There are two options to remove data from DVC. You can either delete the files from disk and then run `dvc add` to 
track the changes. Or you can run `dvc remove <path>` to remove files. The `dvc remove` command leaves the files on
disk but removes them from version history.

### Automating DVC with git hooks

Managing data with DVC is not a lot of work but it's easy to forget a step when checking out a new branch or cloning
a repo to disk. There's a helpful command `dvc install` that installs GIT hooks which automate `dvc checkout` and
`dvc commit`. 

## Summary

If you're planning on starting a new ML project, even for local experimentation, make sure you version your code and 
dataset. DVC makes it a lot more pleasant so you don't have to create multiple data directories and worry about data
loss. 

I can highly recommend using DVC. And I hope you find it as much fun as I did.
