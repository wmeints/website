---
title: >-
  Did you know DVC doesn't handle large datasets? Neither did we and here's how
  we fixed it
category: Machine Learning
datePublished: "2023-01-13"
dateCreated: "2023-01-13"
---

We hit a nice roadblock yesterday while working on a dataset with 5 million samples.
It took us 8 hours to upload the dataset and 11 hours to download and unpack it.
We learned some valuable lessons there that I’ll discuss in this post so you don’t
have to run into the same issues.

## What happened?

It’s truly a three part fairy tale if I’m honest. We started a new computer
vision project for a company in the Netherlands with a smallish dataset containing
just 2500 photos. So we figured, why not go light and use DVC to manage the dataset?

DVC (Data Version Control) is a tool that stores your data in a remote storage
and versions said data in GIT. It hashes the data and stores the hash with some
other metadata in source control. The real data is then transferred to a matching
folder in remote storage. We use Azure data lake storage for this.

With 2500 samples it was going really well. Pushing and pulling data was a
breeze and versioning was working as expected. We could easily tell what version
of our code was using what version of the data. We even stored metrics in DVC
so we could track the model-performance figures for our application.

While working on our project we noticed that our dataset was unbalanced and we
didn’t have enough training data for some classes. So we decided to synthesize
some more data.

We generated 5 million synthetic data samples to improve the class balance in
our dataset. The synthetic dataset was stored as small jpegs on disk resulting
in 66GB of data. A sizable dataset.

When we added the dataset to DVC with dvc add, it went okay. It takes a while
to hash 66GB of data but that’s expected. However, when we invoked dvc push we
ran into a disaster. It took 8 hours to upload the files to Azure.

The next morning, I figured, let’s pull in the data and train the model. I
invoked dvc pull and got presented with a timer that said 7:50:00 as the
expected time before the dataset was completely downloaded. It took the rest of
the workday to download the dataset. Because I ran into a disconnect, I had to
resume the download the next morning for another 1.5 hours.

After the download was complete, DVC had to check out the files which took
another 1.5 hours.

Conclusion, we have a huge performance issue. But it’s not what you think!

## What really happened?

My first thought was: DVC is rubbish, it’s super slow checking out the files
and it’s probably doing something horrible to my storage account.

After checking in on the DVC Discord I was partially confirmed in my assessment.
DVC doesn’t handle large datasets with more than 200K files. But not for the
reason I thought.

DVC has to check every file to make sure it’s the right one. That takes time
of course and can be inefficiently programmed. The developers confirmed that
this was the case.

But there’s more to it. When you transfer small files from Azure to your machine
or from your machine to Azure there’s overhead involved. It takes time to set
things up before data is transferred. Security checks, validation, you name it.
And that’s why it is slow.

On top of the overhead per request, there’s another problem that we ran into.
It costs a lot of money to fire 5 million requests against the storage account.
It’s not super bad luckily, but we could have done better.

And finally, there’s yet another problem here. Your computer doesn’t like small
files either. The virusscanner is going to act up. The disk doesn’t get up to
speed and your processor needs to perform a lot of work to process each file
request.

All things considered, we made quite the oopsy here.

## How we solved the performance problems

Now how do you solve this kind of problem? There are a couple of options:

- We can zip the files into a tarball or a zip-file and version that.
- We can turn the images into arrays and store those in a tabular format like parquet

The first option sounds nice and easy. Just zip it and the transfer is still
large but a single request. Effectively eliminating the overhead because it’s
almost nothing next to the 66GB compressed archive.

However, when you want to work with the data you need to unpack the archive.
This creates 5 million files and thus increases the overhead on the local
machine again. Not ideal.

We came up with another option: Turn the images into tabular data. Which sounds
weird, because it’s binary. Let me explain.

Every image can be presented as matrix. We use numpy arrays to process the
images in our application. The first dimension is the height of the image, the
second dimension is the width and the final dimension represents each of the
colors at a given location.

We can reshape the 3-dimensional array to a 1-dimensional array without loss.
Later when we want to use the image, we can turn it back into the 3-dimensional
array.

Parquet is really good at storing arrays and can combine arrays with other data
types. By using parquet, we can store the label of an image with the original
data in a second column.

Another benefit of parquet files is that we can partition the data. This is a
benefit because:

- We can split the work across GPU/CPU cores making the problem smaller
- We can split the download so we have to redownload less data if something fails

Finally, parquet is great because it supports streaming records rather than
having to unpack them.

We turned our dataset into 16 parquet files since we have machines with 16 cores.
We can then use DVC as described in the manual and no longer run into issues
with our datasets.

## Summary

We ran into huge problems when trying to store millions of files because we
didn’t pay enough attention to the overhead that would cause. It turns out that
it’s better to create bigger files and stream them.

If you’re going to build a dataset this large, make sure that you optimize the
storage for the compute to save even more on performance. We certainly gained a
lot from this.

DVC is a great tool for versioning data, metrics, models, and parameters.
But you'll need to make sure that you create the right type of data to manage.

Thanks to the people at Iterative.ai we were able to quickly diagnose the issue
and come up with a better solution.

Have a great day and happy machine-learning!
