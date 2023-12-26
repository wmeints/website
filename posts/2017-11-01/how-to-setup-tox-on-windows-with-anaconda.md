---
title: How to setup tox on Windows with Anaconda
category: Python
datePublished: '2017-11-01'
dateCreated: '2017-11-01'
---
<!--kg-card-begin: markdown--><p>When you are developing packages for Python you need some way to test whether your package works on someone else's computer. Tox is a great tool for this, but doesn't work well with Anaconda. With some basic steps however you can have your code tested on tox without much trouble.</p>
<p>In this post I will show you how to configure Anaconda correctly for use with Tox on Windows 10.</p>
<h2 id="whatistox">What is tox?</h2>
<p>Tox is a tool that makes it possible to execute tests in an isolated environment. Running python tests in an isolated environment useful for a number of reasons:</p>
<ul>
<li>Different versions of python have different requirements, if you want your package to work for a specific version you have to test it with that version.</li>
<li>Your development environment has packages installed, which you may have forgotten to include as a dependency in your package. When someone tries to use your package he/she may run into problems because he/she is missing packages.</li>
<li>You may require some additional preparation in the form of scripts before you can execute tests against your package. Doing this manually is hard to get right.</li>
</ul>
<p>Tox makes these three things easy, so I like to use it for testing Python code whenever I can.</p>
<h2 id="whywouldyouuseanaconda">Why would you use Anaconda?</h2>
<p>Okay, so Tox is a useful tool if you worry about quality. But what about Anaconda? There's an official Python release which works great, so why bother using something else?</p>
<p>Anaconda is a specialized version of Python optimized for statistics and data science. It contains special versions of certain packages that aren't easily obtained for the official Python release. This is especially true on Windows.</p>
<p>Keras for example uses the scipy package that is not available on Windows through pip. Instead you need to get a proper version from <a href="https://www.lfd.uci.edu/~gohlke/pythonlibs/">some university website</a>. It works, but it is a pain in the behind to get working on Windows.</p>
<p>Installing Anaconda is easy, you can have it up and running in minutes without having to manually download all sorts of packages.</p>
<p>That's the reason why I recently moved over to Anaconda. There are downsides to Anaconda as well as you can see from this post, but I think the advantages make up for that.</p>
<h2 id="step1installanaconda">Step 1: Install anaconda</h2>
<p>So given that you want Anaconda, because you're doing Data science and you want to build quality packages, let's get started by installing Anaconda. If you haven't done so of course.</p>
<p>You can install <a href="https://www.anaconda.com/download/">Anaconda</a> from their website. Make sure that you add the anaconda binaries to your <code>PATH</code> variable. This is an option that you can select in their installer while you're running the installation.</p>
<h2 id="step2installthebasicpackages">Step 2: Install the basic packages</h2>
<p>With Anaconda installed you need to install a few additional packages:</p>
<ul>
<li><code>conda install virtualenv</code></li>
<li><code>pip install tox</code></li>
</ul>
<p>You need to install <code>virtualenv</code> with <code>conda</code>, since the other version that comes from pypi.org doesn't work properly within Anaconda.</p>
<h2 id="step3setupthetestenvironmentsfortox">Step 3: Setup the test environments for tox</h2>
<p>The third step in the configuration process is to setup the right python environments for tox to use. This step depends on what versions of python you want to use with Tox.</p>
<p>Tox allows you to specify which versions of python your code should be tested against. You can specify this in a <code>tox.ini</code> file in the root of your project. The file looks like this:</p>
<pre><code class="language-ini">[tox]
envlist=py27,py35

[testenv]

deps=
    pytest
    pytest-cov
    pytest-mock
    coverage

commands=
    python -c 'import nltk; nltk.download(&quot;punkt&quot;)'
    py.test
</code></pre>
<p>The <code>tox</code> section specifies overall options for the tests. Here you specify the python versions you want to test against. Each python version is prefixed with the letter py and the major and minor version number.</p>
<p>The <code>testenv</code> section specifies how to control the test environment (in the versions of python you specified in the <code>tox</code> section). For example, you can specify additional dependencies that should be installed in the environment.</p>
<p>Also in the <code>testenv</code> section you will find the commands option. This option specifies which test commands should be run. For example, I need the nltk module to be installed and updated. Afterwards I want the unit-tests to be executed using <code>pytest</code>.</p>
<p>If you specify py35 and py27 in tox you will need to make sure that these versions can be discovered by the tox runtime. On Linux you don't need to do anything special. On Windows however you need to setup the python versions manually.</p>
<p>To install the right python versions for tox you need to execute the following command in powershell/cmd:</p>
<pre><code class="language-bash">conda create -p C:\Python35 python=3.5
</code></pre>
<p>The path parameter points to <code>C:\\Python35</code> which is a well-known location that tox resolves automatically. The parameter <code>python=3.5</code> tells Anaconda to create a Python 3.5 environment.</p>
<p>If you want a different version you need to change the version number in both the path and the python parameter of the <code>conda create</code> command.</p>
<p>So if you want python 2.7 you execute:</p>
<pre><code class="language-bash">conda create -p C:\Python27 python=2.7
</code></pre>
<h2 id="step4executetests">Step 4: Execute tests</h2>
<p>Now that you have all necessary environments for tox you can navigate to the root of your project and execute <code>tox</code> to run the tests.</p>
<p>When you run <code>tox</code> it will package your code using the <code>setuptools</code> package and execute the following steps for each python environment:</p>
<ul>
<li>Create a new environment for the python version</li>
<li>Install the package in the test environment</li>
<li>Install the additional dependencies in the test environment</li>
<li>Execute the test commands specified in the <code>tox.ini</code> file.</li>
</ul>
<p>The results are collected in the terminal.</p>
<h2 id="step5happytesting">Step 5: Happy testing</h2>
<p>Tox is a really useful tool for testing code. The test environments are isolated so that you simulate installation of your code on a clean machine. That way you know for sure that your package works on someone else's machine.</p>
<p>Also, because you have separate environments you can check that your package works on different versions of Python. Another problem that many Python developers hit.</p>
<p>Finally, tox makes it easy to script any setup steps that you need to perform before executing tests. This eliminates human error.</p>
<p>Happy testing!</p>
<!--kg-card-end: markdown-->
