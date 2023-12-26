---
title: My python setup on Windows 10
category: Python
datePublished: '2018-01-10'
dateCreated: '2018-01-10'
---
<!--kg-card-begin: markdown--><p>Setting up a proper development environment for Python and Data Science projects can be hard on Windows. Python's origin isn't on Windows which shows, but you can get it to work with just a few tweaks. Here's how.</p>
<h2 id="useanaconda">Use anaconda</h2>
<p>For my work on AI projects I require tools like scipy, sklearn and tensorflow. These packages require native C math libraries. On Linux these math libraries are installed in your OS so you don't have to worry about them. On Windows however you need to install them yourself.</p>
<p>Intel offers <a href="https://software.intel.com/en-us/mkl">MKL</a> but it's quite a bit of work to get it installed and working with Python.</p>
<p>So instead of wrangling with MKL I download <a href="https://www.anaconda.com/download/">Anaconda</a> with Python 3.6 included.</p>
<p>Why Python 3.6? Well, most of the stuff that is written today is for Python 3. Also, Ptyhon 2.7 is the last version of Python in the 2.x series. So I moved on to Python 3 and didn't look back.</p>
<h2 id="includeanacondainyourpath">Include anaconda in your Path</h2>
<p>Now before you get click-happy and install Anaconda by clicking next as fast as you can. Please make sure you include Anaconda in your PATH variable. You can check this option in the installer.</p>
<p>I don't like having to start separate terminal sessions to access anaconda and then have to move back to my regular terminal to perform git operations or silliness similar to that.</p>
<p>That's why I include Anaconda in my PATH variable.</p>
<h2 id="useseparateanacondaenvironments">Use separate anaconda environments</h2>
<p>Once you have anaconda installed, don't mess up your installation with all sorts of packages. Make a separate environment for each project you have.</p>
<p>You can do this by executing the following command:</p>
<pre><code class="language-shell">conda create --prefix C:\virtualenvs\&lt;environment name&gt; python=3.5 pip
</code></pre>
<p>By using a prefix you get to locate the environment in a spot where you can find it on disk. I do this so that I can quickly clean things up if I break my setup.</p>
<p>Also note that I include a <code>python=...</code> parameter. This allows you to control the version of python you're running. Tensorflow for example requires python 3.5 instead of the python 3.6 that comes with the anaconda installation.</p>
<p>I also included pip as a parameter in the command. Both the python and pip parameters are names of packages you want included in your environment.</p>
<p>Anaconda has its own package manager that contains a lot of packages. Which is where the python and pip package are coming from.</p>
<p>But as any regular python developer will know, pip contains far more packages and is more up-to-date than the anaconda package system.</p>
<p>That is the reason why I always include pip in my anaconda environment.</p>
<p>To use the environment you need to execute the following command:</p>
<pre><code class="language-shell">activate C:\virtualenvs\&lt;environment name&gt;
</code></pre>
<p>Once active you can install packages in your environment and work with it like it's a regular python installation.</p>
<p>When you're done, you can deactivate the environment using the following command:</p>
<pre><code class="language-shell">deactivate
</code></pre>
<h2 id="fixpowershellinteractionwithanaconda">Fix Powershell interaction with Anaconda</h2>
<p>When you work on Windows 10 with Powershell you will quickly notice that you can't activate an anaconda environment. This comes from the fact that there's no support for Powershell in Anaconda yet.</p>
<p>You can fix this however by installing the the <code>pscondaenvs</code> package from <a href="https://github.com/BCSharp/PSCondaEnvs">this repository</a></p>
<p>In short it comes down to this command:</p>
<pre><code class="language-shell">conda install -n root -c pscondaenvs pscondaenvs
</code></pre>
<p>After that you can use the activate/deactivate commands as normal.</p>
<h2 id="happyhacking">Happy hacking!</h2>
<p>And that's it for my Python installation on Windows 10. If you're looking for editors to work on Python scripts I can recommend the following tools:</p>
<ul>
<li><a href="http://code.visualstudio.com/">Visual Studio Code</a></li>
<li><a href="https://www.jetbrains.com/pycharm/">Jetbrains PyCharm</a></li>
</ul>
<p>Happy hacking!</p>
<!--kg-card-end: markdown-->
