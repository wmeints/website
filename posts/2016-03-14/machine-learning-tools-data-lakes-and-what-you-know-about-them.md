---
title: 'Machine learning tools: Data lakes and what you know about them'
category: Machine Learning
datePublished: '2016-03-14'
dateCreated: '2017-07-31'
---
<!--kg-card-begin: markdown--><p>Machine Learing tools come in many shapes and sizes. One of the trends in the<br>
past few years has been the data lake. But what is a data lake, how does it<br>
relate to machine learning and why should you care?</p>
<!-- more -->
<h2 id="whatisadatalake">What is a data lake</h2>
<p>Metaphorically a data lake is a giant pool of data from which you can draw insights.<br>
In practice it's a combination of a scalable data repository that can hold data in any shape.<br>
This data repository is typically combined with a tool that is capable of processing the<br>
data in the repository.</p>
<p>Both of these components of a data lake need to be scalable. You will be storing<br>
terabytes or even more in that thing. The tool you put on top of this mountain of data<br>
must be capable of processing such huge amounts of data. Also, since you will be storing<br>
several kinds of data. Not every record you gather is the same.</p>
<h2 id="wellthatscoolbutdoesthatgetme">Well that's cool, but does that get me?</h2>
<p>Having a repository to store all the data in your company is one thing and a good<br>
tool to process that data is another thing. But that doesn't get you one penny.</p>
<p>First you need a way to feed data to the repository, which means you need to build<br>
integrations between your software systems and the data lake.</p>
<p>Second you need something to do with that data. Data stored in a data lake is what it is,<br>
a giant pool of data. Totally worthless unless you do something with it. This means<br>
that you need a business problem you want to solve and people that know how to operate<br>
the tool that is going to process the data in the data lake.</p>
<h2 id="whatdoesadatalakelooklikeexactly">What does a data lake look like exactly?</h2>
<p>Since we're talking a scalable system that is capable of storing and processing data,<br>
you will be looking at something like a scalable database or distributed file system<br>
to store the data in your lake.</p>
<p>When you ask Microsoft about a data lake they will point you towards Azure Data Lake,<br>
which is in fact an implementation of Apache Hadoop with a pretty interface.</p>
<p>Others will do exactly the same, point you to Hadoop and tell you that it is the tool<br>
for building a data lake.</p>
<p>Hadoop is indeed a scalable big data solution. Hadoop contains a filesystem provider<br>
called HDFS which is a scalable filesystem that you can run across multiple servers<br>
linking together their disks. The data is replicated and partitioned, so you can be<br>
sure that data is available and reasonably safe on there.</p>
<p>To process the data stored in HDFS you can write MapReduce on top of Hadoop to process<br>
the data. This enables you to process huge amounts of stored data in a reasonable amount<br>
of time. Basically you write a program that is capable of splitting the data in multiple<br>
sets that get processed by separate servers (the map part). The results are sent to a<br>
central server afterwards to get the complete picture (the reduce part).</p>
<p>As you can see, Hadoop is a pretty good fit if you think of a data lake as a repository to<br>
store huge amounts of data combined with a tool that is capable of processing that data.</p>
<h2 id="shouldibeusingadatalake">Should I be using a data lake?</h2>
<p>Whether you should build a data lake depends on the scenario you want to implement.<br>
As I said before, a big pool of data is rubbish. You need something to do with that data.</p>
<p>In fact, the goal you are trying to achieve dictates whether you should<br>
even build a data lake. Some data shouldn't be dumped in a data lake and processed later.</p>
<p>For example, if you are working with telemetry data such as temperature data, you are better<br>
off building a stream processing solution. This kind of data requires real time processing to<br>
be of any use unless you are working on a climate change measurement solution.</p>
<p>A data lake is only useful when you want to crunch numbers on data that is older. For example,<br>
sales orders from last year are perfect for a data lake solution. They don't change and there isn't<br>
a real immediate need for the data.</p>
<p>If you want to build machine learning solution as part of an intelligent system (you actively<br>
control some process using your machine learning model) than store that data in a way that is<br>
easier accessible.</p>
<p>Hadoop is really slow, we are talking minutes before you get a result. If you need faster results,<br>
use a different tool. Cassandra for example is way better at getting data fast. And Apache Spark is<br>
way better at processing data in memory.</p>
<h2 id="finalthoughts">Final thoughts</h2>
<p>I personally feel that data lakes have a use, but don't look at them as the universal solution<br>
to all your big data needs.</p>
<p>My top tip: Look at the scenario and gather the data specifically required for that scenario.<br>
This keeps the data manageable. Be very wary when someone starts to talk about a data lake.<br>
It's not for everyone.</p>
<p>Cheers!</p>
<!--kg-card-end: markdown-->
