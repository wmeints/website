---
title: 'How-to: Experiment with tensorflow in an interactive notebook'
category: Machine Learning
datePublished: '2016-12-03'
dateCreated: '2017-07-31'
---
<!--kg-card-begin: markdown--><p>I've always wanted to build something with tensorflow. I have one demo lying around with tensorflow, but never<br>
got around to develop something for real with this framework.</p>
<p>Although tensorflow has a lot of samples available and documentation to get you going, it's not that easy to build<br>
something real with it. To make it easier for me to experiment with it I've come up with a combination of tools<br>
that allow you to experiment with tensorflow using interactive python notebooks.</p>
<!-- more -->
<h2 id="step1installpythononyourmachine">Step 1: Install python on your machine</h2>
<p>The first step to get the experimentation setup is to install Python. I use python 3 for my experiments, so this<br>
guide will show you how to install that. If you want python 2, you install that version instead of 3.</p>
<p>On a mac you can install python through <a href="http://brew.sh/">homebrew</a>. Homebrew is a tool that is essence a package manager for Mac OS.<br>
You can install all kinds of software through this tool. Follow the manual on the website to install homebrew on your mac.</p>
<p>After you have homebrew installed you can enter the command <code>brew install python3</code>.</p>
<p>On Windows you can use either <a href="https://chocolatey.org/">chocolatey</a> or<br>
<a href="https://www.python.org/downloads/release/python-352/">install Python 3 using the official installer</a>.</p>
<h2 id="step2createavirtualenvironment">Step 2: Create a virtual environment</h2>
<p>After you installed python on your machine you can move on to install tensorflow and the other tools.<br>
But before you do that, I advice you to use a version manager for python. You can install python modules<br>
directly on your computer, but that pollutes your system.</p>
<p>With python you can have only one version of a module on your system. This means that if a program needs<br>
version 1 of a module and another program needs version 2 of a module you have a problem. It can happen<br>
that the program with version 1 does not work with version 2. This is not really what you want.</p>
<p>Virtualenv is a module that helps you manage the versioning problem in a very elegant way.<br>
You can create a virtual python environment in a folder with its own modules.</p>
<p>To install virtualenv you need to execute the following commands in a terminal:</p>
<pre><code>pip install pip --upgrade
pip install virtualenv
</code></pre>
<p>The first line upgrade the python package manager tool. The second line installs the virtualenv module.</p>
<p>After you installed virtualenv you can create a new virtual environment by executing the following<br>
command in a terminal window:</p>
<pre><code>virtualenv tensorflow
</code></pre>
<p>This creates a new folder underneath the current folder with the name tensorflow.<br>
The virtualenv module copies pip and the necessary system files to the new folder to turn it<br>
into a virtual python environment.</p>
<h2 id="step3installtensorflow">Step 3: Install tensorflow</h2>
<p>Step 3 after installing virtualenv is to activate the virtual environment and install tensorflow.<br>
Activate the virtual environment using the following command:</p>
<pre><code>cd tensorflow
bin/activate
</code></pre>
<p>The terminal prompt is prefixed with the name of the virtual environment.<br>
You can now install modules into the virtual environment:</p>
<pre><code>pip install tensorflow
</code></pre>
<h2 id="step4installipythonandjupyter">Step 4: Install ipython and jupyter</h2>
<p>The final step is to install ipython and jupyter. These two tools make it possible<br>
to run python code inside a browser window on your machine.</p>
<p>Install both these tools using the following commands:</p>
<pre><code>pip install ipython
pip install jupyter
</code></pre>
<h2 id="readytogo">Ready to go!</h2>
<p>jupyter is a webapplication that enables you to create notebooks. Notebooks are pages that can<br>
contain markdown, text and python code. You can write code and annotate it with markdown to describe<br>
what the code does.</p>
<p>All you need to do to start experimenting is to enter the following command in the terminal:</p>
<pre><code>jupyter notebook
</code></pre>
<p>Have fun!</p>
<!--kg-card-end: markdown-->
