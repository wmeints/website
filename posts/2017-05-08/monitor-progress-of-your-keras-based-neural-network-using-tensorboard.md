---
title: Monitor progress of your Keras based neural network using Tensorboard
category: Machine Learning
datePublished: '2017-05-08'
dateCreated: '2017-07-31'
---
<!--kg-card-begin: markdown--><p>In the past few weeks I've been breaking my brain over a way to automatically answer questions<br>
using a neural network. I have a working version, but debugging a neural network is a nightmare.</p>
<p>Neural networks by their very nature are hard to reason about. You can't really find out how<br>
or why something happened in a neural network, because they are too complex for that. Also,<br>
there's a real art to selecting the right number of layers, the right number of neurons per layers<br>
and which optimizer you should use.</p>
<p>There is however a great tool, called Tensorboard that makes things a little easier and it works<br>
with Keras, a higher level neural network library that I happen to use.</p>
<h2 id="whatistensorboard">What is tensorboard?</h2>
<p>Tensorflow, the deep learning framework from Google comes with a great tool to debug<br>
algorithms that you created using the framework, called Tensorboard.</p>
<p><img src="/images/2017-05-08/tensorboard-01.png" alt="Tensorboard"></p>
<p>It hosts a website on your local machine in which you can monitor things like accuracy, cost functions<br>
and visualize the computational graph that Tensorflow is running based on what you defined in Keras.</p>
<h2 id="installingtensorboard">Installing Tensorboard</h2>
<p>Tensorboard is a separate tool you need to install on your computer.<br>
You can install Tensorboard using <code>pip</code> the python package manager:</p>
<pre><code>pip install Tensorboard
</code></pre>
<h2 id="collectingrundatafromyourkerasprogram">Collecting run data from your Keras program</h2>
<p>With Tensorboard installed you can start collecting data from your Keras program.<br>
For example, if you have the following network defined:</p>
<pre><code class="language-python">from keras.models import Sequential
from keras.layers import Dense, Activation

model = Sequential()

model.add(Dense(10, input_shape=(784,)))
model.add(Activation('softmax'))

model.compile(optimizer='sgd', loss='categorical_cross_entropy')

model.fit(x_train, y_train, verbose=1)
</code></pre>
<p>This neural network is compiled with a standard Gradient Descent optimizer and a Categorical Cross Entropy loss function.<br>
Finally the network is trained using a labelled dataset.</p>
<p>When you run this code you will find that nothing appears on screen and there's no way to know how well things are going.<br>
This can be problematic if you're spending multiple hours training a network and discover that it leads to nothing.</p>
<p>Tensorboard can help solve this problem. For this you need to modify your code a little bit:</p>
<pre><code class="language-python">from time import time

from keras.models import Sequential
from keras.layers import Dense, Activation
from keras.callbacks import TensorBoard

model = Sequential()

model.add(Dense(10, input_shape=(784,)))
model.add(Activation('softmax'))

model.compile(optimizer='sgd', loss='categorical_crossentropy')

tensorboard = TensorBoard(log_dir=&quot;logs/{}&quot;.format(time()))

model.fit(x_train, y_train, verbose=1, callbacks=[tensorboard])
</code></pre>
<p>You need to create a new <code>TensorBoard</code> instance and point it to a log directory where data should be collected.<br>
Next you need to modify the <code>fit</code> call so that it includes the tensorboard callback.</p>
<h2 id="monitoringprogress">Monitoring progress</h2>
<p>Now that you have a tensorboard instance hooked up you can start to monitor the program by executing<br>
the following command in a separate terminal:</p>
<pre><code>tensorboard --logdir=logs/
</code></pre>
<p>Notice that the logdir setting is pointing to the root of your log directory.<br>
I told the tensorboard callback to write to a subfolder based on a timestamp.<br>
Writing to a separate folder for each run is necessary, so you can compare different runs.<br>
When you point Tensorboard to the root of the log folder, it will automaticall pick up all the<br>
runs you perform. You can then select the runs you want to see on the website</p>
<p><img src="/images/2017-05-08/tensorboard-02.png" alt="Multiple runs in Tensorboard"></p>
<h2 id="wheretofindmoreinformation">Where to find more information</h2>
<p>This post covers the basics of adding tensorboard as a monitoring tool to your Keras program,<br>
for more information checkout these websites:</p>
<ul>
<li><a href="https://github.com/tensorflow/tensorflow/blob/r1.1/tensorflow/tensorboard/README.md">https://github.com/tensorflow/tensorflow/blob/r1.1/tensorflow/tensorboard/README.md</a></li>
<li><a href="https://keras.io/callbacks/#tensorboard">https://keras.io/callbacks/#tensorboard</a></li>
</ul>
<!--kg-card-end: markdown-->
