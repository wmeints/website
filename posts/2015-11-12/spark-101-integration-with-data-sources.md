---
title: Spark 101 - Integration with data sources
category: Scala
datePublished: '2015-11-12'
dateCreated: '2017-07-31'
---
<!--kg-card-begin: markdown--><p>In the previous post I showed you how to build basic Spark programs. Building a basic<br>
Spark application is the hello world scenario of Spark. Normally you'd use something<br>
like a database to feed your algorithm in Spark and output the results of the<br>
algorithm somewhere else.</p>
<p>But what can you connect to Spark and where do you leave the outputs of your program?</p>
<p>In this post I will show you some of the options you have to integrate your<br>
Spark program with data sources. Hopefully you will slowly start to see where<br>
Spark fits in your solution.</p>
<!-- more -->
<p><strong>Please note</strong> I'm using Scala for the sample code in this post.<br>
So things my differ a bit in other languages or may not work at all *grin*.</p>
<h2 id="loadingdataforbatchjobs">Loading data for batch jobs</h2>
<p>So the first and probably most well-known and well understood way to work with data<br>
is by loading a bunch of rows from a database and processing them as a batch.</p>
<p>Something like <code>SELECT * FROM customers</code> is understood very well by most people.<br>
In Spark you can do run batch oriented programs in a number of ways.</p>
<p>First there's the Spark SQL classes that you can use. One of the things you can<br>
do with Spark SQL is to connect to a database through JDBC. You can connect to any<br>
database from Spark SQL as long as there's a JDBC driver for it. For example,<br>
you can use Microsoft SQL server or MySQL as a data source for your program.</p>
<p>To use the Spark SQL components you need to add a new dependency to your SBT file.</p>
<pre><code class="language-scala">libraryDependencies += &quot;org.apache.spark&quot; %% &quot;spark-sql&quot; % &quot;1.5.1&quot;
</code></pre>
<p>After importing the new dependency you get access to a class called<br>
<code>SQLContext</code> which provides access to a bunch of different data sources all of<br>
them oriented towards working with batches of data.</p>
<p>It currently supports things like Parquet, JSON, Apache Hive and JDBC databases.<br>
In this post I will keep it simple and connect to a MySQL database so be sure to<br>
check out the documentation on how to connect to the other data source types.</p>
<p>Our sample program is going to load customers from a table and extract people<br>
called Mike from that table. In order to do that you first need to create the<br>
SparkContext and SQLContext.</p>
<pre><code class="language-scala">val config = new SparkConf()
  .setAppName(&quot;sample-app-sql-jdbc&quot;)
  .setMaster(&quot;local[2]&quot;)

val sc = new SparkContext(config)
val sqlContext = new SQLContext(sc)
</code></pre>
<p>The only thing you need to put into the SQL context is the SparkContext. This context<br>
is used for coordination purposes.</p>
<p>After you created the SQL context you can start to load data. This looks like this:</p>
<pre><code class="language-scala">val config: SparkConf = new SparkConf()
.setAppName(&quot;sample-app-sql-jdbc&quot;)
.setMaster(&quot;local[2]&quot;)

val sc = new SparkContext(config)
val sqlContext = new SQLContext(sc)

val ds = sqlContext.read.format(&quot;jdbc&quot;).options(
  Map(
    &quot;url&quot; -&gt; &quot;jdbc:mysql://localhost:3306/mydb&quot;,
    &quot;dbtable&quot; -&gt; &quot;customers&quot;,
    &quot;partitionColumn&quot; -&gt; &quot;country&quot;,
    &quot;driver&quot; -&gt; &quot;com.mysql.jdbc.Driver&quot;
  )
).load()
</code></pre>
<p>The <code>SQLContext</code> is asked to read data in the JDBC format. As input for this method<br>
you need to provide a map containing a JDBC URL and driver name. This is used to<br>
set up the connection with the database. You also need to provide the name of the table<br>
you want to read from. Finally you specify the name of the partition column.</p>
<p>The partition column needs to be numeric and is used to split the data into manageable<br>
chunks that are spread over the available Spark nodes in the cluster.</p>
<p>Notice that you cannot write SQL queries to get the data. The idea is that all data<br>
in the table is loaded into Spark and processed. So if you need to filter out rows<br>
before they go into Spark you better remove them from the table you're going to process.<br>
Better yet, create a dedicated table for Spark jobs if you want certain rows of data<br>
to be included in a job.</p>
<p><strong>Note</strong> I'm using an external JDBC driver, in order to use it you need to modify<br>
a script file in the bin directory of every Spark node called <code>compute_classpath.sh</code><br>
and include the path to the JAR file containing the JDBC driver. Without this change<br>
your Spark application doesn't work!</p>
<p>After you loaded the data into a data source you can start to work with it.<br>
For example use a filter to filter out rows from the source table.</p>
<pre><code class="language-scala">val numberOfMikesInTheWorld = ds.select(&quot;id&quot;,&quot;name&quot;,&quot;address&quot;,&quot;zipcode&quot;,&quot;city&quot;)
  .map(row =&gt; row.getAs[String](&quot;name&quot;))
  .filter(name =&gt; name.startsWith(&quot;Mike&quot;))
  .count()
</code></pre>
<p>The first line selects a number of columns from the datasource to work with.<br>
After that I can start to map the rows from the datasource to return just the<br>
name of the customer. Finally I use a filter statement to filter out people<br>
that aren't called mike.</p>
<p>So once you have a data source that loads data from JDBC you can work with it<br>
like with any other RDD (Resilient Distributed Datasource).</p>
<p>JSON and Parquet work just like this. In the case of JSON and Parquet however you<br>
need to specify a path to a file. You can load the files from disk, but I'd suggest<br>
you don't do this. Loading files from disk means that the file has to be available<br>
to every possible Spark node, since you don't know where the Job gets scheduled.</p>
<p>If you do need to read JSON files, load them from HDFS so that<br>
you have a central point to get access to them.</p>
<h2 id="loadingdataforstreamingsparkapplications">Loading data for streaming Spark applications</h2>
<p>While batch jobs are the easiest to build, streaming is probably the use case<br>
that you are going to need the most often.</p>
<p>When you are working with 1 terabyte of data it's not very wise to reload that data<br>
every time you want to process just one new item in that set.</p>
<p>So instead of doing you could go for a method where you send the one single item<br>
to Spark and let Spark process that single item in the context of the whole set.</p>
<p>This works great for a lot of scenarios like process mining, updating a streaming<br>
linear regression model, etc. In fact I think that apart from these kind of scenarios<br>
you can apply streaming also for things that are not related to machine learning at all.</p>
<p>For example, anomaly detection is also a use case where this works. You don't need<br>
old events for detecting anomalies in a new event.</p>
<p>To use streaming Spark you're going to need two things, an external source that<br>
pushes data into Spark and the Spark streaming context.</p>
<p>In order to get the Spark streaming context you need to add the spark-streaming<br>
dependency to your SBT file:</p>
<pre><code class="language-scala">libraryDependencies ++= Seq(
  &quot;org.apache.spark&quot; %% &quot;spark-streaming&quot; % &quot;1.5.1&quot;,
  &quot;org.apache.spark&quot; %% &quot;spark-streaming-kafka&quot; % &quot;1.5.1&quot;
)
</code></pre>
<p>On top of the regular spark-streaming dependency I added the Kafka streaming<br>
implementation as well. Kafka is a messaging framework that is really fast and<br>
because of that it is very suitable to use in combination with Spark.</p>
<p>After you have this dependency in place you can initialize a<br>
new streaming context like this:</p>
<pre><code class="language-scala">val config = new SparkConf()
  .setAppName(&quot;streaming-sample-app&quot;)
  .setMaster(&quot;local[2]&quot;)

val sc = new SparkContext(config)
val ssc = new StreamingContext(sc, Seconds(1))
</code></pre>
<p>The first parameter for the <code>StreamingContext</code> constructor is the <code>SparkContext</code><br>
to use. The second parameter determines the duration for the batch.</p>
<p>What happens in Spark streaming is that the program listens for events on a stream<br>
converting those events into a batch. In the sample it listens for events for 1 second<br>
and turns the set of events received in that time window into a single batch to be<br>
processed.</p>
<p>Converting a stream into a batch is necessary, because Spark at its core still is a<br>
batch oriented program. By using the streaming API you effectively decrease the amount<br>
of data that goes into a batch.</p>
<p><strong>A word of advice</strong> If you need true streaming processing you have two options.<br>
Either you go with Spark and hope that you end up with batches of just one item.<br>
Or you switch to something like Apache Storm which is build for this sort of thing.<br>
I'd go with the second option, but that's just me :-)</p>
<p>Now that you have a streaming context you can create a receiver for incoming events.<br>
Spark supports things like file streams and event TCP streams, but I'm not going to use<br>
that. Instead I'm going to connect Spark to Apache Kafka.</p>
<p>Apache Kafka is a blazingly fast messaging system that supports clustering<br>
just like Apache Spark. Which means its highly scalable too. Just the sort of<br>
thing you need for building semi-streaming big data appliances.</p>
<pre><code class="language-scala">val kafkaStream = KafkaUtils.createStream(ssc,
  &quot;local01,local02,local03&quot;, &quot;my-spark-app&quot;,
  Map(&quot;events&quot; -&gt; 1))

val counter = kafkaStream.map({ case(key,message) =&gt; Person.fromMessage(message) })
  .filter(person =&gt; person.name.startsWith(&quot;Mike&quot;))
  .count()
</code></pre>
<p>In the sample code you first create a new Kafka stream instance to read from.<br>
I specified three Kafka server hosts to connect to. This is something you can do<br>
when you want to make sure that the connection between Kafka and Spark stays available<br>
to the application. Kafka requires the application to identify itself as a consumer group.<br>
In this case this is the &quot;my-spark-app&quot; consumer group. When you connect multiple<br>
applications with the same consumer group a message gets delivered to just one instance<br>
of the consumer group. Additionally you need to specify the topic you want to read from.</p>
<p>Notice that I added the value one in the map for the topics. This is the number of threads<br>
or partitions that the application is reading from. This doesn't influence the amount<br>
of partitions Spark is going to use to process the incoming events.</p>
<p>Balancing the amount of Kafka and Spark partitions is not a topic in this post, but<br>
I suggest you run a load test to determine the best combination for your solution.</p>
<p>Once you have a stream in the app, you can work with in the same way as you would<br>
with normal RDDs, mapping, filtering and sorting data.</p>
<h2 id="sowhatdoyoudowiththeresults">So what do you do with the results?</h2>
<p>I've written a lot about getting data into Spark, but what do you do once you have<br>
the results of your computation?</p>
<p>Spark allows you to not only load data from SQL or Streams,<br>
but it also allows you to store data in SQL or Streams.  Depending on<br>
your use case you use either one of these.</p>
<p>For example, if you need to alert another system based on your computations you<br>
are better off using something like Kafka to deliver the alert to that system.</p>
<p>If you want to query the results from some other part of your solution you can<br>
store the results of your computation in something like Cassandra.</p>
<p>You will need to write a separate REST service on top of the output data source<br>
to allow clients to query the results. Spark itself doesn't offer a way to do this<br>
and frankly you shouldn't do that sort of thing with Spark. Spark is only a computational<br>
engine to use in big data scenarios.</p>
<h2 id="wheretofindmoreinformation">Where to find more information</h2>
<p>If you want to know more about connecting SQL data sources and streams to Spark<br>
I suggest you take a look at the following websites:</p>
<ul>
<li><a href="http://spark.apache.org/docs/latest/streaming-kafka-integration.html">Kafka integration guide for Spark</a></li>
<li><a href="https://github.com/datastax/spark-cassandra-connector">Spark Cassandra Connector</a></li>
<li><a href="http://spark.apache.org/docs/latest/sql-programming-guide.html#jdbc-to-other-databases">Spark SQL JDBC connections</a></li>
</ul>
<!--kg-card-end: markdown-->
