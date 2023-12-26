---
title: How to create multi-project SBT build files
category: Scala
datePublished: '2015-05-28'
dateCreated: '2017-07-31'
---
<!--kg-card-begin: markdown--><p>A while back I started programming Scala for the first time. It was also the first introduction to the scala build tool. The defacto standard build tool for compiling and packaging scala applications.</p>
<p>The first steps were easy, I had projects up and running in no time. But now I've come across a scenario where I need to create a piece of software that actually is composed of multiple<br>
projects. This presented me with an interesting problem. How can you build a project with SBT that depends on other projects that also use SBT.</p>
<p>It turns out that it's not too bad. But you need to know a few small tricks to get it working correctly.</p>
<p>In this post I will show you how you can get multi-project builds running in Scala in less time than you think.</p>
<!-- more -->
<h2 id="definingtheprojectstructure">Defining the project structure</h2>
<p>SBT uses a specific folder structure for its projects. It looks like this:</p>
<ul>
<li>build.sbt</li>
<li>project
<ul>
<li>build.properties</li>
<li>plugins.sbt</li>
</ul>
</li>
</ul>
<p>At the root of every project there's a build.sbt file which contains all the properties<br>
needed for your build. It doesn't normally contain any executable code. If you want<br>
to define executable code as part of your build you need to create a new .scala file<br>
inside the project folder. The SBT build will automatically include and compile the .scala<br>
file in the project folder when you start the SBT tool.</p>
<p>To create a folder structure for a piece of software that is split into separate projects<br>
you define the folder structure described above in the root folder. To add a child project<br>
you need to create a new folder for the child project under the root folder and place the same<br>
files in that folder.</p>
<h2 id="hookinguptheprojects">Hooking up the projects</h2>
<p>The next step is to create a new scala file to define the relationships between the child projects.<br>
Why use a scala file? We're actually going to define a piece of the build model, which should be<br>
executable so you need a new .scala file in the project file to do this. The name doesn't matter,<br>
as long as it is something that is recognizable for people later on.</p>
<p>Inside the file you define a new class which looks like this</p>
<pre><code class="language-scala">import sbt._
import Keys._

object MyBuild extends Build {
  lazy val root = Project(id = &quot;root&quot;, base = file(&quot;.&quot;))
}
</code></pre>
<p>Now to add a reference to the child projects. For now imagine that we have a<br>
core project which contains all the basic functionality of the project and a<br>
console project that contains a console interface for the project.</p>
<p>To define the described project structure you need to add more lazy values of type<br>
project to the scala file you just created.</p>
<pre><code class="language-scala">import sbt._
import Keys._

object MyBuild extends Build {
  lazy val root = Project(id = &quot;root&quot;, base = file(&quot;.&quot;))
  lazy val core = Project(id = &quot;core&quot;, base = file(&quot;core&quot;))
  lazy val console = Project(id = &quot;console&quot;, base = file(&quot;console&quot;))
}
</code></pre>
<p>Now if you start sbt right now and you enter the command projects it will<br>
display the root, core and console project. You can even switch between projects<br>
by entering <code>project [name]</code>. Run your regular commands after that just like you normally would.</p>
<h2 id="definingdependenciesbetweenprojects">Defining dependencies between projects</h2>
<p>It so happens that the console project is dependening upon the core project, because<br>
the console interface obviously needs to talk to the core to get access to your<br>
application's functionality. To make this work, you need to define that console<br>
depends on core in the build scala file you just created.</p>
<pre><code class="language-scala">import sbt._
import Keys._

object MyBuild extends Build {
  lazy val root = Project(id = &quot;root&quot;, base = file(&quot;.&quot;))
  lazy val core = Project(id = &quot;core&quot;, base = file(&quot;core&quot;))
  lazy val console = Project(id = &quot;console&quot;, base = file(&quot;console&quot;)) dependsOn &quot;core&quot;
}
</code></pre>
<p>Now that we have declared that console depends on core, the classes from core<br>
will be available to the project console. Also, when you run commands like compile<br>
on the console project, SBT will make sure that the core project is also compiled.</p>
<p>You can depend on multiple projects, too. Just add more projects, separated by a comma<br>
to the list of projects in the dependsOn call.</p>
<h2 id="compilingallprojectsatonce">Compiling all projects at once</h2>
<p>With the dependencies set up you may want to compile all projects in one go. To do<br>
this you specify an aggregation.</p>
<pre><code class="language-scala">import sbt._
import Keys._

object MyBuild extends Build {
  lazy val core = Project(id = &quot;core&quot;, base = file(&quot;core&quot;))
  lazy val console = Project(id = &quot;console&quot;, base = file(&quot;console&quot;)) dependsOn &quot;core&quot;

  lazy val root = Project(id = &quot;root&quot;, base = file(&quot;.&quot;)) aggregate &quot;core&quot;, &quot;console&quot;
}
</code></pre>
<p>Now when you start SBT you can invoke compile and it will compile the root, core and console projects<br>
all at once. All tasks you run in a project that is an aggregate of other projects will be run<br>
against all projects defined in the aggregate statement.</p>
<p>Here's another cool trick: You can define an empty project folder and use that as an aggregate<br>
for a subset of projects. This works, because SBT only requires a build.sbt file to be present<br>
in a directory to define a project. The build.sbt file in that directory can be empty, but you<br>
can of course define properties specific for that subset if you want.</p>
<h2 id="finalthoughts">Final thoughts</h2>
<p>As much as I think SBT is a little strange, once you know how to set up multi-project builds it works quite nice..</p>
<!--kg-card-end: markdown-->
