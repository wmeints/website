---
title: >-
  How-to: run Microsoft Cognitive Toolkit based application inside a Docker
  image
category: Machine Learning
datePublished: "2017-12-07"
dateCreated: "2017-12-06"
---

<!--kg-card-begin: markdown--><p>As part of a Community Hack at Microsoft Denmark people can hack together basic AI models with CNTK. Two fellow MVPs asked me if they could use Docker to work on CNTK applications.</p>
<p>Sure you can work with a Docker image on CNTK stuff. Microsoft has a Docker image for CNTK. I've created an image on top that includes some additional configuration to make things even easier. You can download it right here: <a href="https://github.com/wmeints/ai-community-hack/archive/master.zip">ai-community-hack image</a></p>
<h2 id="howdoesitwork">How does it work</h2>
<p>Microsoft has kindly created a Docker image that includes the Cognitive Toolkit bits preinstalled. They provide both a CPU version and GPU version of it. I have used the CPU version, but you could easily transform that image into a GPU version if you wanted.</p>
<p>To use the <a href="https://hub.docker.com/r/microsoft/cntk/">microsoft/cntk</a> you need to base your own image on top of it. Basically like this:</p>
<pre><code>FROM microsoft/cntk:2.3-cpu-python3.5

....
</code></pre>

<p>You then add a CMD line to your own Dockerfile and execute your Python code with that. The format for the CMD line however is somewhat different than normal.</p>
<p>You have to first activate the CNTK environment in the docker image and then run your python command like so:</p>
<pre><code>CMD [&quot;/bin/bash&quot;,&quot;-c&quot;,&quot;source /cntk/activate-cntk &amp;&amp; python &lt;your-script-path&gt;&quot;]
</code></pre>
<p>Instead of executing just a Python program I opted to run the python notebook server. This enables you to edit python code from the browser.</p>
<p>Check out the contents of the <a href="https://github.com/wmeints/ai-community-hack/blob/master/Dockerfile">Dockerfile</a> to get a sense of what that looks like.</p>
<h2 id="howcanyouusethisforproduction">How can you use this for production</h2>
<p>In any normal production scenario you'd execute python code that starts a service or trains a model and stores that model somewhere on disk or on a server.</p>
<p>Python notebooks aren't very useful in this situation. I usually follow this pattern to build a model that I want to use on production later:</p>
<ol>
<li>Build, train and validate the experiment in a Python notebook</li>
<li>Setup a proper python project with a _<em>main_</em>.py</li>
<li>Copy-paste the code blocks from my experiment to python files</li>
<li>Write a bunch of unit-tests and refactor the code to properly structure it</li>
<li>Create a new dockerfile that includes my Python program</li>
<li>Build and publish my Docker image to a server</li>
</ol>
<h2 id="thoughtsandorideas">Thoughts and/or ideas?</h2>
<p>Hope you find the docker image useful. If you have any thoughts or ideas, let me know in the comments below!</p>
<!--kg-card-end: markdown-->
