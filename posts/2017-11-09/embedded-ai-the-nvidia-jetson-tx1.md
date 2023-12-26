---
title: 'Embedded AI: The Nvidia Jetson TX1 - Part 1'
category: Machine Learning
datePublished: '2017-11-09'
dateCreated: '2017-11-09'
---
<!--kg-card-begin: markdown--><p>Every once in a while you run across something that you just have to have. I bumped into a cool little device, the Nvidia Jetson TX1. This is a creditcard size AI computer that looks to be fun. So I had to try it.</p>
<h2 id="firstlooksmaybedeceiving">First looks may be deceiving</h2>
<p>I ordered the kit online throug the Nvidia developer program, because they offered a one time discount on the developer kit. It makes it a little easier on the wallet. It costs 250 euro with the discount, 600 without.</p>
<p>When I received the package it was a brown box that was quite a bit bigger and heavier than the creditcard sized computer I expected.</p>
<p>It turns out that the developer kit is more than just the Jetson TX1 computer. It is the TX1 mounted on a developer board that has quite a few things on it:</p>
<ul>
<li>One USB port to connect your keyboard and mouse</li>
<li>One HDMI port for display</li>
<li>Ethernet port for connectivity</li>
<li>Bluetooth</li>
<li>Wifi</li>
<li>Two GPIO headers for connecting sensors</li>
<li>SD card slot for a regular SD card</li>
<li>SATA connector and power for a harddrive</li>
</ul>
<h2 id="whatsonthemachine">What's on the machine</h2>
<p>The device itself comes with Ubuntu 14.04 LTS. Which is outdated if you ask me, but it gets you started, so I shouldn't complain too hard about it.</p>
<p>I used a USB hub to connect the keyboard and mouse, connected the monitor and fired up the machine.</p>
<p>First time you get a terminal screen with a login prompt. According to the manual you should be able to login with nvidia/nvidia as the username and password, but that doesn't work. You can login using ubuntu/ubuntu as the username and password.</p>
<p>You can then finish the installation by running the installer.sh from the NVIDIA-INSTALL folder inside the home folder.</p>
<p>This will give you a graphical desktop, just like the one you're used to on Ubuntu. You get the CUDA toolkit version 8 preinstalled with all the libraries to access the hardware. Also included are some tools to compile and debug code.</p>
<h2 id="upgradingtheos">Upgrading the OS</h2>
<p>The defaults are nice to start with, but I want to run Tensorflow on this thing. And possible <a href="https://cntk.ai">CNTK</a> if I can get it compiled.</p>
<p>So I started looking for ways to upgrade to a higher version of Ubuntu.</p>
<p>Luckely Nvidia has a fix for that. The Jetson TX1 can be upgraded by downloading the <a href="https://developer.nvidia.com/embedded/dlc/jetpack-l4t-3_1">Jetpack</a> tools from the Nvidia developer website.</p>
<p>This gets you an installer that you can use to remotely debug the Jetson TX1 and upgrade its OS by flashing a new image onto the machine.</p>
<p>When you install the Jetpack tooling you automatically get a prompt to upgrade the OS on your Jetson device. Simply follow the instructions and the new OS will be on there in a few minutes.</p>
<p>Please note that the regular procedure of upgrading the OS on your Jetson TX1 only works on Ubuntu 16.04 which I didn't have.</p>
<p>I had a problem. Currently I don't have a linux machine available to me, so here's what I did.</p>
<p>I made a new Linux VM inside VMWare Fushion on my iMac. Then I put my Jetson TX1 into recovery mode and made sure that the USB connection was forwarded to the VM. I then flashed the new OS onto the device through my VM. Works like a charm.</p>
<p>After flashing the OS, Jetpack will install CUDA on the Jetson device and setup additional tooling that you need to do machine learning and other things.</p>
<h2 id="turningitintoaplayground">Turning it into a playground</h2>
<p>Once I had the new OS on there, it was time to turn the device into a playing ground for machine learning.</p>
<p>The idea here is to install the following tools:</p>
<ul>
<li>Python 3</li>
<li>Jupyter notebooks</li>
<li>Tensorflow</li>
<li>Keras</li>
</ul>
<p>I wanted to use Tensorflow to get some neural networks going. These days I don't use Tensorflow directly, but rather Keras an abstraction on top of Tensorflow.</p>
<p>The jupyter notebooks allow me to edit python code from a browser over a SSH connection.</p>
<p>To install the jupyter notebooks you first need to have python 3.5 installed, you can do this by executing the following commands:</p>
<pre><code class="language-bash">sudo apt install python3-pip python3-dev
</code></pre>
<p>Then install the jupyter notebooks using the command <code>pip3 install jupyter</code></p>
<p>Tensorflow is interesting in this case. Since there's no binary available for the Jetson TX1 from Google you have to either compile it  yourself... Or get it from the people over at JetsonHacks.</p>
<p>The people at JetsonHacks have a github repo that has precompiled Tensorflow binaries for this device. A lot easier than compiling the code from scratch I can assure you.</p>
<p>You can find the binaries here: <a href="https://github.com/jetsonhacks/installTensorFlowJetsonTX/tree/master/TX1">https://github.com/jetsonhacks/installTensorFlowJetsonTX/tree/master/TX1</a></p>
<p>Download the whl file you need for your python version and install it on the device. To use Keras you need to perform a few more additional steps:</p>
<pre><code class="language-bash">sudo apt-get install libopenblas-dev
pip install scipy
pip install keras
</code></pre>
<p>You need to install openblas yourself in order for Keras and scipy to work. The commands above fix the issue quite nicely.</p>
<p>Once you have it installed you can get started with editing notebooks.</p>
<p><img src="/content/images/2017/11/Screen-Shot-2017-11-09-at-21.39.13.png" alt="Screen-Shot-2017-11-09-at-21.39.13"></p>
<p>To do this, first launch Jupyter</p>
<pre><code class="language-bash">jupyter notebook --no-browser --port=8080
</code></pre>
<p>Then open up a SSH connection to your device:</p>
<pre><code class="language-bash">ssh -N -L 8080:localhost:8080 ubuntu@&lt;device-ip&gt;
</code></pre>
<p>And then open the notebook in your favorite browser by navigating to <code>http://&lt;device-ip&gt;:8080/</code></p>
<h2 id="initialthoughts">Initial thoughts</h2>
<p>I haven't had much time to experiment, but I can see why this is a good device for machine learning. The GPU is pretty much why you want the Jetson TX1. The developer board is great, since you can add a SATA drive to store your datasets. And it is necessary, because the storage on chip is only 16GB. Not enough for a good size dataset.</p>
<p>The setup process is pretty well thought out, I had no problems setting things up. It all works the first time.</p>
<p>All in all I think it's a fun device, can't wait to give it a spin with some real data.</p>
<!--kg-card-end: markdown-->
