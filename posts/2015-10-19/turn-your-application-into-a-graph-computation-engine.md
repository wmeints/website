---
title: Turn your application into a graph computation engine
category: Other
datePublished: "2015-10-19"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>Sometimes I come across a subject that doesn't really fancy my interest. Either because I absolutely don't see any<br>

application for a particular piece of technology or because I simply don't have enough time to take a closer look.</p>

<p>Graphs is one of of those things that just didn't grab my attention until a few weeks ago. But now that I have seen<br>
the amount of fuss around this subject I think I should have looked into it a bit earlier.</p>
<p>Like a lot of IT related things, graph computation isn't something new. I looked it up on Wikipedia and it's actually<br>
quite old. The theory <a href="https://en.wikipedia.org/wiki/Graph_theory">dates from 1736</a>. I'd say that's plenty old for something<br>
that is hot in 2015. But looking at a few more Wikipedia articles I've come to the conclusion that graph databases are not<br>
quite that old. Most of them were invented in the last few years.</p>
<!-- more -->
<h2 id="whydoweneedgraphs">Why do we need graphs?</h2>
<p>So why all the fuss? I think that we're finally reaching a point where we have found a problem that requires a graph.<br>
Tables are cool, but very limiting if you're trying to determine things based on the relationship between two objects.</p>
<p>For example, if you want to know the measure of similarity between users you're not talking about the users directly.<br>
Rather you're talking about a relationship between them. Also, if you want to calculate a measure of interest based<br>
on user actions, you're not talking about articles and users, you're talking about the connection between them.</p>
<p>A table oriented application can't tell you that. You can try to model a relation as an object, but ultimately the grammar you're<br>
using is limited to talking about objects. Our brain can get us very far in translating between relations and objects, but<br>
there is a limit. So if you're planning on doing something with a focus on relations you best grab something that lets you<br>
talk about relationships in a way that is natural.</p>
<p>It's not that you can't do things in SQL when you want to perform graph oriented computations, but it's quite a bit harder<br>
than doing the same thing in <a href="http://neo4j.com/developer/cypher-query-language/">Cypher</a> or <a href="http://tinkerpop.incubator.apache.org/docs/3.0.1-incubating/#_on_gremlin_language_variants">Gremlin</a>.</p>
<h2 id="gettingstartedwithgraphcomputation">Getting started with graph computation</h2>
<p>As I was looking around the web I discovered that there are quite a few tools out there that let you compute things in a graph.<br>
There's Neo4J, a commercial database and there's a lot of open-source out there too. One of them is TinkerPop.</p>
<p>Tinkerpop is a typical Apache Foundation project. Loads and loads (Did I mention there's a lot) of stuff available and as of the moment<br>
of writing not a whole lot of documentation that is easy to digest. But don't let that keep you back. It's great stuff once you know how<br>
to read the docs.</p>
<p>The easiest way to get started with graph computation using TinkerPop is by grabbing <a href="http://tinkerpop.incubator.apache.org/">the gremlin console</a>.<br>
This will let you work with graphs from the comfort of the terminal without having to learn a programming language.<br>
Well another programming language on top of Gremlin that is. As gremlin has its own syntax you are required to learn that.</p>
<p>The gremlin console is made up of several components of which the main ones are:</p>
<ul>
<li>
<p><strong>Gremlin: The query language to traverse the graph.</strong><br/> You can ask Gremlin things like &quot;Give me all the nodes that have certain properties, that are connected<br>
through a particular type of relationship to another that has a certain property.&quot;. The cool thing here is that there's a Gremlin implementation for C#, Java, Ruby, Python and Scala. All of them are strong-typed (more or less, depending on the implementation). And most of them follow the same syntax, which makes it easy to learn Gremlin in your<br>
favorite development environment.</p>
</li>
<li>
<p><strong>Pipes: A lower level API that translates the queries you write into an executable set of steps.</strong><br/><br>
This API uses a combination of a visitor and the steps to build a resultset. It basically takes the steps and executes them<br>
one by one against the current vertex or edge.</p>
</li>
<li>
<p><strong>Blueprints: The driver that knows how to talk to a graph database.</strong><br/><br>
This API knows only about vertices and edges. It doesn't know how to traverse them, but you can ask Blueprints for anything you like.<br>
Very low level, but a necessary part of the Graph computation engine.</p>
</li>
</ul>
<p>In practice you don't have to know all of these APIs to work with a graph, except for Gremlin. But I think it's good to know what to expect, should you<br>
have to drop down to a lower level to get the results you want.</p>
<p>To get a sense for what you can expect from Gremlin, let's start the console app. When you've downloaded the Gremlin console, extract it somewhere on disk.<br>
Open up a terminal and navigate to the folder where you extracted the Gremlin console and execute the following command:</p>
<pre><code>bin/gremlin.sh
</code></pre>
<p>This will fire up the console and show some fancy ASCII art. Once started you need something to work on.<br>
Normally if you want to start a graph computation you start by creating a new empty graph. To do this you need to<br>
query the graph like this:</p>
<pre><code>g = TinkerGraph.open()
</code></pre>
<p>With the empty graph in place you can start to add vertices and edges to it using the following commands:</p>
<pre><code>// Create a country to live in
netherlands = g.addVertex(&quot;The Netherlands&quot;)

// Create the medals that can be won
gold = g.addVertex(&quot;Gold&quot;)
silver = g.addVertex(&quot;Silver&quot;)
bronze = g.addVertex(&quot;Bronze&quot;)

// Create a few participants who won something
epke = g.addVertex(&quot;Epke Zonderland&quot;)
marianne = g.addVertex(&quot;Marianne Vos&quot;)
marit = g.addVertex(&quot;Marit Bouwmeester&quot;)

// All of the people live in the netherlands
epke.addEdge(&quot;lives&quot;, netherlands)
marianne.addEdge(&quot;lives&quot;, netherlands)
marit.addEdge(&quot;lives&quot;, netherlands)

// The participants won a few medals
epke.addEdge(&quot;won&quot;, gold)
marianne.addEdge(&quot;won&quot;, gold)
marit.addEdge(&quot;won&quot;, silver)
</code></pre>

<p>addVertex creates a new vertex with a label. You can attach properties to them using the <code>property(key,value)</code> method.<br>
To connect to nodes in the graph call the <code>addEdge method with a label and target vertex</code>. Edges can also have properties.</p>
<p>Now that you have some data, let's do something with it. Let's find out who won a medal:</p>
<pre><code>g.traversal().V().hasLabel(&quot;Gold&quot;,&quot;Silver&quot;,&quot;Bronze&quot;).in(&quot;won&quot;).label()
</code></pre>
<p>This returns all nodes that are connected through the won relationship to the nodes that have the label Gold, Silver or Bronze.<br>
Notice that I used the in() command to find the participant vertices in the graph. I'm using the in() command, because the edge is<br>
pointing from participant to medal instead of the other way around. Would I use out() here I wouldn't get anything back.</p>
<p>The results in itself is not very useful, because you don't know who won which medal. Let's see if we can make this better:</p>
<pre><code>g.traversal().V().hasLabel(&quot;Gold&quot;,&quot;Silver&quot;,&quot;Bronze&quot;).as(&quot;medal&quot;).in(&quot;won&quot;).as(&quot;participant&quot;).select(&quot;medal&quot;,&quot;participant&quot;)
</code></pre>
<p>The difference here is that we tell the graph traversal that we want to label the first set of vertices as medals and the last set of vertices as participants.<br>
Finally you can use the select step to select the labeled vertices to return them in the resultset.</p>
<p>Please note that while I use g.traversal() here I recommend that you call g.traversal() only once and save it in a variable.<br>
Calling the traversal() method is quite expensive (Thanks @twarko for pointing me in the right direction).</p>
<p>As you can see Gremlin can get complicated very quickly. But imagine doing this in SQL with a bigger graph that has properties on the edges and vertices.<br>
Something like the taxonomy of wikipedia, but with metadata.</p>
<h2 id="movingbeyondthegremlinterminal">Moving beyond the Gremlin terminal</h2>
<p>Building graphs in the Gremlin terminal is fun when you're trying something out, but you can't run any production system on that.<br>
For production use you need to have a backend that can store your data and scale beyond one machine.</p>
<p>You are in luck, there are quite a few options available to run a Graph in production. There's Neo4J which is a commercial product.<br>
It supports Tinkerpop3, but it also has its own Graph computation language called Cypher. I personally really like Cypher, so if you're<br>
going for Neo4J I suggest you try Cypher first.</p>
<p>However if you want an open-source option I suggest you take a look at TitanDB. It's a full implementation of Tinkerpop3 and if you use<br>
the TitanGraph API directly it supports even more. TitanDB supports storing and indexing graphs using several technologies.<br>
One combination that I found is very scalable is Cassandra and ElasticSearch. When you configure TitanDB to use this combination it will<br>
store the vertices and edges in Cassandra and index them in ElasticSearch. Both of these products can be scaled across several hundreds of nodes<br>
so you don't have to worry about that.</p>
<p>To give you an idea of what graph computation using TitanDB would look like, take a look at the following example:</p>
<pre><code>graph = TitanFactory.build()
        .set(&quot;storage.backend&quot;, &quot;cassandra&quot;)
        .set(&quot;storage.hostname&quot;,&quot;127.0.0.1&quot;)
        .set(&quot;index.search.hostname&quot;, &quot;127.0.0.1&quot;)
        .set(&quot;index.search.elasticsearch.client-only&quot;, &quot;true&quot;)
        .open();

Vertex epke = graph.addVertex(&quot;Epke Zonderland&quot;);
Vertex marianne = graph.addVertex(&quot;Marianne Vos&quot;);
Vertex marit = graph.addVertex(&quot;Marit Bouwmeester&quot;);

Vertex gold = graph.addVertex(&quot;Gold&quot;);
Vertex silver = graph.addVertex(&quot;Silver&quot;);
Vertex bronze = graph.addVertex(&quot;Bronze&quot;);

epke.addEdge(&quot;won&quot;, gold);
marianne.addEdge(&quot;won&quot;, gold);
marit.addEdge(&quot;won&quot;, silver);

GraphTraversal&lt;Vertex, Map&lt;String, Object&gt;&gt; medalsWonByParticipants =
graph.traversal().V().hasLabel(&quot;Gold&quot;, &quot;Silver&quot;, &quot;Bronze&quot;).as(&quot;medal&quot;)
.in(&quot;won&quot;).as(&quot;participant&quot;).select(&quot;medal&quot;, &quot;participant&quot;);
</code></pre>

<p>The first lines are especially interesting. Using the titan factory I created a new configuration<br>
that connects to Cassandra on localhost and ElasticSearch also running on my local machine.</p>
<p>With the connection made to the graph I can add vertices and edges. And finally I can run gremlin queries against the graph.<br>
The code is all Java. Gremlin isn't your average grammar. It is a set of patterns that a Gremlin implementation should follow.<br>
Because of that, the API in Ruby is the same as in Java, Scala and Python.</p>
<p>Keep this in mind when you are looking up things in the manual. All samples are actually portable to your own favorite programming<br>
language without much effort. The methods are the same and the kinds of resultsets are also equal across all programming languages.</p>
<h2 id="wnattolearnmore">Wnat to learn more?</h2>
<p>If you're interested in more please go grab TitanDB and give it a spin. You can find the software right here: <a href="http://thinkaurelius.github.io/titan/">http://thinkaurelius.github.io/titan/</a><br>
The documentation on the website is limited, but like I said before: The Gremlin API is the same as for all other TinkerPop implementations.<br>
For the Gremlin API description check the following website: <a href="http://tinkerpop.incubator.apache.org/docs/3.0.1-incubating/#traversal">http://tinkerpop.incubator.apache.org/docs/3.0.1-incubating/#traversal</a></p>
<!--kg-card-end: markdown-->
