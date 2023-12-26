---
title: A modern stack for data analysis in a microservice world
category: Machine Learning
datePublished: '2017-02-10'
dateCreated: '2017-07-31'
---
<!--kg-card-begin: markdown--><p>The face of enterprise solutions is changing rapidly. We are making smaller solutions at a larger scale by deploying microservice architectures. This brings many advantages to developers and customers because solutions become more flexible to change and scale better. Microservices also bring a number new of challenges. Especially for companies that want insight in how their business is doing.</p>
<p>Since data is no longer coming from one source, but from many sources and since data is no longer of a uniform shape you need a solution that is up to the challenge. Processing data in a microservice world requires a stack that can process streams, unstructured data and structured data. And it should do it fast.</p>
<p>In this post I will show what a modern data analysis stack looks like and how you can use open source tools to setup a modern data analysis solution in your company.</p>
<!-- more -->
<h2 id="rapidsriversandlakes">Rapids, rivers and lakes</h2>
<p>Data in a microservice environment basically comes in three types. Rapids, rivers and lakes.</p>
<p>The largest portion of data you will encounter is coming from events in the environment. These events come in two shapes. First there’s business events. These events come by quite frequently, but only go as fast as your business. Typically this means that a large company will have many business events and a a smaller company will have less.</p>
<p>The second kind of event data you will see within a business is actually coming from log sources. This is data that is logged when a system does it’s job. The amount of log events is an order of magnitude greater than data generated based on business events.</p>
<p>You can consider the log data within a microservice landscape a rapid. It produces a large flow of data that you can consider rather fluid. It has little value in the long run, but still useful to alert people of things as they happen.</p>
<p>Business events flow much slower. This kind of data is considered a river. This data is useful for longer. You can use it to alert people of important things that are happening in your company. But you can also use it to get a clear picture of what is happening over time in the company.</p>
<p>Analysing business events can help you get information about anomalies in orders. Business events are also useful for predictions. But they cannot be used for anything else.</p>
<p>Finally there’s a category of data that is considered stale. These bodies of data are typically kept for historical reasons. For example you keep old transaction records around because of government regulations. The data in a data lake is very useful for reporting over longer periods of time, for example to get trends over several years.</p>
<h2 id="makingsenseoftherapidsriversandlakes">Making sense of the rapids, rivers and lakes</h2>
<p>To make sense of data from the rapids, rivers and lakes in your company you need a solution that is capable of handling all three of these categories of data.</p>
<p>Let me give you two examples why I think that it is important that you learn how to use data from rapids (log streams), rivers (business events) and lakes (long term data storage).<br>
Data within a microservice landscape isn’t stored in one big database. Instead each service has its own store that contains the data it needs. Data is flowing between the services through the event bus. It means that there is a complete picture of what is going on in your business, but you need to listen to the event bus to get that picture.</p>
<p>In order to get an overview of the effect of your ad campaign on sales you need to gather up the business events related to sales and relate them to data gathered about products. This you can then aggregate in your data lake and use that to produce an overview of the effects of your ad campaign on sales.</p>
<p>Data in this scenario typically flows from your rapids (a log stream of the clicks on your websites) to your rivers (the business events related to completed business orders and products) to your lakes (the data lake).</p>
<p>Data can also be used in a reverse direction. Since you have data about orders/transactions in your data lake you can do some pretty interesting things. For example to be able to detect fraudulent transactions within your business you need to learn a model from data that you gathered in the past few years within your data lake. This stale data is actually quite valuable when you want to use machine learning.</p>
<p>After you learned a model based on the data in your data lake you can then use this model to predict whether an incoming transaction event is related to a fraudulent transaction. When you detect such a transaction you can then warn the right people within the company about the transaction and stop it real time.</p>
<h2 id="thetoolsofthetrade">The tools of the trade</h2>
<p>Both scenarios that I showed you in the previous section require that you have a solution that is capable of working with streams of data that flow rapidly and large bodies of data that don’t fit in the memory of a single server.</p>
<p>Luckily there are tools that provide just the right functionality for the job. Most of which are open source. For example, Apache Flink and Apache Storm are tools that are capable of processing large volumes of streaming data.</p>
<p>If you need something to process stale bodies of data you can use Apache Hadoop. This tool is slower, but since the data in your data lakes evolves at a slower pace you need something that isn’t necessarily fast, but does a great job at processing terabytes of data.</p>
<p>Flink, Storm and Hadoop are great tools. And when it comes to the motto “Do one thing and do it well” these are the tools to have. But you have to learn three tools to get the most out of your analytics data. There is an alternative that does all three of these things.</p>
<p>Apache Spark is a general purpose tool that is capable of reading data from streams, graphs, databases and data lakes without breaking a sweat. This tool is the thing to have if you want to get the most out of your logdata, business events and data lakes.</p>
<p>Let me explain why. As you have noticed, the problems that modern businesses need to solve require a combination of data coming from streams and data lakes. Building such a solution with three separate products is though.</p>
<p>A general purpose tool like Apache Spark makes it easier to combine several kinds of data sources because it provides a generalized engine that can connect to streams, graphs, general purpose databases and distributed file storage. The unified API it provides makes the life of developers a lot easier since they don’t need to learn new patterns to work with the different kinds of data sources.</p>
<h2 id="runitinthecloudifyoucan">Run it in the cloud if you can</h2>
<p>Of course you can run all of these tools on premise. But since you will be dealing with large amounts of data you’re going to need a cluster setup to keep things in check.</p>
<p>Data coming from a data lake doesn’t fit on one machine. So you need multiple machines to process all the data into a single usable model. This means you get to deal with clustering and the setup and management of multiple machines.</p>
<p>I know that most companies can do this kind of thing. We’ve gotten used to running multiple servers within our company. However is this really want you want to occupy your people with?</p>
<p>I think that it would be much more useful if you deploy your workload to the cloud so you can focus on what matters for your company.</p>
<p>Azure for example offers a complete set of tools that allow you to convert data from your rapids, streams and lakes into useful insights. For example, Azure Event Bus is a great tool to implement an event bus to transport log data and business events between microservices and your data analysis solution. HDInsight is actually Apache Spark in the cloud without the hassle of setting up a cluster manager. Finally you can use Azure Data Lake to store your long term data.</p>
<p>Because Microsoft spend so much time working on manageability of these solutions you can set up a data analysis solution in Microsoft Azure within ours rather than weeks when you run it on your own hardware.</p>
<h2 id="conclusionandmoreinformation">Conclusion and more information</h2>
<p>When you run microservices, spend some time thinking about analytics too and look for tools that can handle log streams, business events and data lakes.</p>
<p>Want to learn more about using tools like Apache Spark? Checkout these resources:</p>
<p>Apache Spark - <a href="http://spark.apache.org/">http://spark.apache.org/</a><br>
HDInsight - <a href="https://azure.microsoft.com/en-us/services/hdinsight/">https://azure.microsoft.com/en-us/services/hdinsight/</a></p>
<!--kg-card-end: markdown-->
