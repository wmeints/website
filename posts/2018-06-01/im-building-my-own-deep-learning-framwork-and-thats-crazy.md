---
title: I'm building my own deep learning framework and that's crazy
category: Machine Learning
datePublished: '2018-06-01'
dateCreated: '2018-06-01'
---
<!--kg-card-begin: markdown--><p>I've embarked on my hardest and most fun adventure ever. I'm going to implement my own deep learning framework. I know most people will call me crazy. But I think this is a challenge that was long coming and I finally got around to it. Wonder why? Read on.</p>
<h2 id="waitwhatwhy">Wait, what, why?!</h2>
<p>So why on earth would I implement my own deep learning framework? There are plenty of good frameworks available in Python and even in C# there are implementations that work good enough. For one thing, Keras is an awesome framework that you simply can't replicate in a few days.</p>
<p>There are two reasons why I want to do this:</p>
<ol>
<li>Existing frameworks aren't very usable in C#, due to the fact they are ported from other languages such as Python.</li>
<li>I want to learn the internals of neural networks, because I think it's fun and a challenge.</li>
</ol>
<p>After two days of thinking, breaking code and putting together designs I must say that it is indeed a challenge. A very hard challenge even. One of the toughest things I've ever done on a computer.</p>
<h2 id="whatstheplan">What's the plan</h2>
<p>One of the reasons that it's hard is because I have a very specific design in mind for my library. Basically, I want you as a developer to be able to build neural networks like this:</p>
<pre><code class="language-csharp">var network = new Sequential()
  .Dense(20, Activations.Sigmoid)
  .Dense(10, Activations.Sigmoid())
  .Loss(Losses.RMSE)
  .Optimizer(Optimizers.Adam);
  
network.Train(features,labels);

float[][] output = network.Predict(sample);
</code></pre>
<p>Sounds simple enough. But there are a few constraints that I have put in place:</p>
<ul>
<li>I want to use CNTK and Tensorflow to implement the internals of the neural network. Simply because they've done all the work with GPU access and what-not.</li>
<li>I want to be able to switch between CNTK and Tensorflow.</li>
</ul>
<p>These constraints require me to use the following architecture:</p>
<p><img src="/content/images/2018/06/Neuromatic-Architecture.png" alt="Neuromatic architecture"></p>
<p>You build the neural network as a symbolic graph with layers, losses, optimizers and metrics. The library than takes your definition and compiles it for CNTK or Tensorflow as needed.</p>
<p>The goal here is that you don't have to worry about the fact that it is running on either of these libraries. You can experiment freely with your neural network to find the optimal solution. Neuromatic will take care of any stuff that needs to be done under the covers.</p>
<p>This sounds much like what Keras does for Python and I'm heavily inspired by them to be honest. I think Keras is awesome because of the freedom to choose a backend and the speed at which you can experiment.</p>
<h2 id="howisitgoingtoworkunderthecovers">How is it going to work under the covers?</h2>
<p>Basically Neuromatic works internally with a model compiler. This compiler will take all the layers and compile them down to instructions in Tensorflow right now. I used the visitor pattern to compile each of the layers.</p>
<p>When you call the <code>Compile</code> method on your model with a specific backend, the backend is fed with various instructions to build a syntax tree.</p>
<p>To the model, the instructions are the same for both CNTK and Tensorflow. The backends however provide specific implementations of these instructions that they understand.</p>
<p>I've made sure to make the instructions the same for all backends, so that I can build procedures such as back propagation just once while leaving the execution up to the backends.</p>
<p>It's harder, because I need to spend more time planning the instructions and the way they are handled. In the long run however I think it's a good investment, as the whole library becomes more extensible.</p>
<p>So far, my plan works out. It's a lot of work to implement the first layer type, the Dense layer. But now that I have some ground work done, things are speeding up rapidly.</p>
<h2 id="theplanforthenextweek">The plan for the next week</h2>
<p>This week I'm planning on building a very basic version of one layer (the Dense layer) and complete an initial version of the back propagation algorithm with Stochastic Gradient Descent. That way I can verify that my architecture works and that the backend implementation is solid enough.</p>
<p>The week after that I want to spend some time on completing the end-to-end scenario for feed forward networks. Which is still a lot of work.</p>
<p>After that I want to move on to convolutional networks and refine some of the engine bits and take a look at the performance of my code. It shouldn't be too bad, but I don't know for sure until I profile it.</p>
<h2 id="getinontheaction">Get in on the action!</h2>
<p>Want a sneek peak at some very geeky stuff? Check out my github repository: <a href="https://github.com/wmeints/Neuromatic">https://github.com/wmeints/Neuromatic</a></p>
<p>There's even a wiki on there with some initial documentation.</p>
<!--kg-card-end: markdown-->
