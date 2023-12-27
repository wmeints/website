---
title: Spark 101 - Writing your first Spark app
category: Apache Spark
datePublished: "2015-11-10"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>Recently I've started exploring Apache Spark as a way to process large amounts<br>

of data coming from things like sensors. The kind of things that happen in<br>
a typical IoT solution.</p>

<p>One of the things I noticed is that the hello world scenario for Spark looks<br>
cool on the website, but in practice there are quite a few things you need<br>
to be aware of if you want to use Spark in a real world scenario.</p>
<p>In this post I will show you how you can set up a basic Spark application.<br>
This is going to be a series of posts exploring Spark and explaining<br>
to process data coming from IoT devices.</p>
<!-- more -->
<h2 id="averyshortintroductionintospark">A very short introduction into Spark</h2>
<p>Before going ahead to show you some code, let me first explain what Spark is.<br>
Spark in essence is a distributed computation engine. You can create a cluster<br>
of Spark nodes to run programs that have the typical map/filter/reduce kind of<br>
setup.</p>
<p>There are of course alternatives like Hadoop. The big difference between Hadoop<br>
and Spark is that Hadoop is rather slow as it runs mostly on stored datasets.<br>
Spark on the other hand has a slew of optimizations that make it run mostly from<br>
memory. Also, the programming model of Spark is a lot less complex as you will<br>
see in the samples later on.</p>
<p>So what is Spark good for? Most people will tell you it's good at processing<br>
big data. They are right, but there's more to it. Put the buzzword aside and you<br>
end up with something that can split workloads across multiple machines.</p>
<p>Basically, if your workload cannot be processed in a reasonable amount of time<br>
on one machine you have the option of using Spark. Spark let's you divide the workload<br>
across multiple machines making the execution time much shorter.</p>
<h2 id="buildingapplicationsforspark">Building applications for Spark</h2>
<p>How does this work? Let me show you through a sample.<br>
To build an application for Spark you can use R, Scala, Java, C# or Python.<br>
Some languages have a better Spark API than others. Scala has the most complete API<br>
at this point, so I will show the code in Scala throughout my post series.</p>
<p>The first step you need to take when you want to write an application for Spark<br>
is to set up the build file for your project. For this, create a new folder and drop<br>
a new file with the name <code>build.sbt</code> in there with the following content:</p>
<pre><code class="language-scala">scalaVersion := &quot;2.10.6&quot;

version := &quot;0.0.1&quot;

libraryDependencies += &quot;org.apache.spark&quot; %% &quot;spark-core&quot; % &quot;1.5.1&quot;
</code></pre>

<p>To make a Spark application you need just one dependency, the spark-core library.</p>
<p>With this library in place let's write a bit of code. Create a new folder<br>
called <code>src/main/scala/example</code> and create a file called <code>Program.scala</code> in that<br>
folder.</p>
<p>In the Program.scala we're going to write the Spark program.</p>
<pre><code class="language-scala">object Program {
  def main(args: Array[String]) = {

}
}
</code></pre>

<p>Normally you would let <code>Program</code> extend from <code>scala.App</code>, but not in the case<br>
of Spark. This has to do with the way Spark tries to run your application and<br>
the way Scala generates code when you base your main class on <code>scala.App</code>.</p>
<p>You can build the class and run it, but instead let's add the basics to<br>
work with the Spark API.</p>
<pre><code class="language-scala">import org.apache.spark.{SparkConf, SparkContext}

object Program {
def main(args: Array[String]) = {
val conf = new SparkConf()
.setAppName(&quot;my-app&quot;)
.setMaster(&quot;local&quot;)

    val sc = new SparkContext(conf)

}
}
</code></pre>

<p>I've imported the <code>SparkContext</code> and <code>SparkConf</code> class from the <code>org.apache.spark</code><br>
package to get access to the main components provided by Spark.</p>
<p>The SparkContext is the place to be when you want to access data<br>
from things like Cassandra, Hadoop, etc.</p>
<p>One of the things you can do with the Spark context is ask it to create a<br>
resilient distributed datasource (RDD). The RDD is the other main component<br>
you're going to use from Spark. RDDs provide access to the data that your<br>
Spark program is going to process.</p>
<p>An RDD can contain any object you like, in a later post I will show you<br>
how to work with Cassandra, but for now let's create a basic RDD containing some<br>
sample data.</p>
<pre><code class="language-scala">import org.apache.spark.{SparkConf, SparkContext}

object Program {
def main(args: Array[String]) = {
val conf = new SparkConf()
.setAppName(&quot;my-app&quot;)
.setMaster(&quot;local[2]&quot;)

    val sc = new SparkContext(conf)

    val dataSource = sc.makeRDD(List(
      Person(&quot;Mike&quot;,28),
      Person(&quot;Adam&quot;, 31),
      Person(&quot;John&quot;, 30)))

    val output = dataSource.filter(person =&gt; person.age &gt; 30)

}
}
</code></pre>

<p>In this sample we now create a new RDD from a set of people and get everyone<br>
with the age above 30.</p>
<p>When you run this application, you get nothing. It runs really really fast.<br>
Not only because you have just three people, but also because it does nothing<br>
with those people.</p>
<p>RDDs are lazy. When you call an operation on the RDD, most of the time, you<br>
get back a new RDD with operation applied to it. Once you call methods like <code>collect()</code><br>
then the operations are applied to the items returned by the RDD.</p>
<p>The RDDs are lazy, because the contents of the RDD are split across the nodes<br>
in the Spark cluster. When you call a method like <code>collect()</code> you schedule<br>
a job on the Spark cluster. The master who gets the job will split up the work<br>
depending on the operations you applied on the RDD, execute that work on the nodes<br>
and gather the results on the master.</p>
<p>Although RDDs are lazy and work is split up, you won't notice it very much in<br>
your program. There is however two things that you shouldn't do.</p>
<p>Don't create two spark contexts. There should be just one, create it<br>
in the main method and pass it around if you must, but don't attempt to create<br>
multiple instances. It breaks.</p>
<p>Also, access one RDD at a time. Code like the following sample is bad:</p>
<pre><code>matrix = nodes
  .flatMap(node1 =&gt; nodes.map(node2 =&gt; (node1,node2)))
  .map({ case (n1,n2) =&gt; (n1,n2,distance(n1,n2)) })
</code></pre>
<p>This code tries to perform an operation on an RDD inside the operation that<br>
is performed on another RDD. If you do this, you will end up with an exception.<br>
Why can't you do this? Spark doesn't know how to map such a construction so it<br>
simply raises an exception instead of giving you weird results.</p>
<p>The proper way to create a construction like the one above, you can use the<br>
zip operation:</p>
<pre><code class="language-scala">val matrix = nodes.zip(nodes)
  .map({ case (n1,n2) =&gt; (n1,n2,distance(n1,n2)) })
</code></pre>
<p>Other than these two rules you build the application in any way you like.<br>
Most probably it will involve building a lot of map, flatMap etc. calls.</p>
<h2 id="testingyourapplication">Testing your application</h2>
<p>When you have an application build on top of Spark you will probably wonder,<br>
does it work? Do I get the results I want?</p>
<p>You can write unit-tests for your Spark program using your favorite<br>
test framework. I happen to like scalatest, so I will show you how you can<br>
test the program I showed before using scalatest.</p>
<p>For this I need to modify the application a little bit, so that the<br>
logic is separated from the main entrypoint.</p>
<pre><code class="language-scala">class CalculatePeopleAboveThirty(sc: SparkContext) {
  def calculate() = {
    val dataSource = sc.makeRDD(List(
      Person(&quot;Mike&quot;,28),
      Person(&quot;Adam&quot;, 31),
      Person(&quot;John&quot;, 30)))

    dataSource.filter(person =&gt; person.age &gt; 30)

}
}
</code></pre>

<p>The above class contains the same logic as before, but now I can inject<br>
the spark context into the class and I get the results back so that I can<br>
validate them.</p>
<p>To work with this class I need to modify the <code>Program</code> class as well.</p>
<pre><code class="language-scala">import org.apache.spark.{SparkConf, SparkContext}

object Program {
def main(args: Array[String]) = {
val conf = new SparkConf()
.setAppName(&quot;my-app&quot;)
.setMaster(&quot;local[2]&quot;)

    val sc = new SparkContext(conf)

    val algorithm = new CalculatePeopleAboveThirty(sc)
    val output = algorithm.calculate()

}
}
</code></pre>

<p>The program now only sets up the configuration and spark context and<br>
calls a separate algorithm to perform the calculation.</p>
<p>Now that we have the separate class we can write a unit-test to validate<br>
that class independent of our Spark cluster.</p>
<pre><code class="language-scala">class PeopleProgramSpec extends WordSpec
with Matchers with ShouldVerb with BeforeAndAfter {
  val conf = new SparkConf()
    .setAppName(&quot;people-test&quot;)
    .setMaster(&quot;local[2]&quot;)

val sc = new SparkContext(conf)

&quot;People Algorithm&quot; when {
val algorithm = new CalculatePeopleAboveThirty(sc)

    &quot;asked to get people above 30&quot; should {
      &quot;filter out people that are below 30&quot; in {
        val output = algorithm.calculate()

        output.count() should equal(2)
      }
    }

}

override def after(fun: =&gt; Any) = {
sc.stop()
}
}
</code></pre>

<p>This test spins up a spark context configured to run locally. You can do this<br>
by setting the master to &quot;local&quot; providing the number of partitions to use<br>
between angle brackets.</p>
<p>After you set up the SparkContext instance you can start to test the code.<br>
Invoke the algorithm and grab the results. Remember, at this point you don't<br>
actually have any data.</p>
<p>By calling <code>count()</code> you load the data, execute the filter and return the<br>
number of records that are remaining after the filter.</p>
<p>One important thing to remember: Close the SparkContext instance after you're<br>
done testing your code. This cleans up everything that Spark left behind.</p>
<h2 id="runningtheapplicationforreal">Running the application for real</h2>
<p>Now that you have build and tested your code you can run it in Spark by invoking the<br>
command <code>submit-spark</code> which looks like this:</p>
<pre><code class="language-bash">spark-submit --class Program --master local[2] &lt;path-to-jar&gt;
</code></pre>
<p>The spark submit command expects the class it needs to run, the master it<br>
needs to run that class on and finally you specify the path to the jar containing<br>
the compiled sources.</p>
<p>Your JAR file is uploaded to Spark and the class is submitted as a job to Spark.<br>
A cool detail here is that you can observe the job by going to<br>
<code>http://localhost:4040/</code> in your favorite browser.</p>
<p>If you plan on using external libraries in your Spark program you need to know<br>
about one more thing. External libraries need to be packaged with your main jar<br>
if you want to have it easy.</p>
<p>For this you have to include the assembly plugin in the SBT build.<br>
Check out the documentation of the plugin to find out how.</p>
<p>After you have added this plugin change the SBT file by adding the<br>
<code>provided</code> scope to the Spark dependencies.</p>
<p>Finally run the <code>sbt assembly</code> command in the terminal to get the assembled jar file.<br>
This assembled jar can then be submitted using the spark-submit command.</p>
<p>Don't feel like using the assembly plugin? Don't worry, you can also make use<br>
of the <code>--packages</code> option and the <code>--repositories</code> option. The first option<br>
lets you specify maven coordinates for external dependencies. The second option<br>
lets you specify any extra repository that you want to get the dependencies from.</p>
<p>Be aware though, the commandline option is brittle because a typo is easily made<br>
and you need to maintain another piece of code that could get out of sync.</p>
<h2 id="wheretogofromhere">Where to go from here?</h2>
<p>The sample in this post is obviously very simple. Spark features more than<br>
just the basic <code>RDDs</code> and the <code>SparkContext</code>. I suggest you check out the<br>
documentation if you want to know all the gory details.</p>
<p>Also, if you're interested in doing more, make sure that you check out MLLib<br>
and GraphX to learn more about machine learning and graph computations using Spark.</p>
<p>In the next post I will show you how to integrate Spark applications with other<br>
applications in order to build an analysis pipeline.</p>
<p>Until then, have fun exploring Spark!</p>
<!--kg-card-end: markdown-->
