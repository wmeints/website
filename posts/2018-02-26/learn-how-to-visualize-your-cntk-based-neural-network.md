---
title: Learn how to visualize your CNTK based neural network
category: Machine Learning
datePublished: "2018-02-26"
dateCreated: "2018-02-25"
---

<!--kg-card-begin: markdown--><p>When you're building complex neural networks you often want to visualize them. Visualization offers a great way to debug things like performance bottlenecks, because parts of your network get duplicated by CNTK. Luckely, it is quite easy to visualize a neural network in CNTK.</p>
<p>In this post I will show you how you can visualize complex neural networks in CNTK so that you get insights in how the layers of your network are connected.</p>
<h2 id="onceuponatimetherewasaneuralnetwork">Once upon a time there was a neural network</h2>
<p>As part of an experiment I'm working on a neural network for counting people in the crowd. The neural network I use is <a href="https://arxiv.org/abs/1512.03385">a residual network</a>. This kind of neural network is good at recognizing patterns in images.</p>
<p>It's a rather complex neural network. And to make matters worse, I've chosen to perform multiple tasks at once in my neural network. In short, it means that I have a neural network that has multiple output layers connected to the same set of hidden layers.</p>
<p>I know it should have a structure like this:</p>
<pre><code>&lt;input-layer&gt;
&lt;residual-block&gt;
&lt;residual-block&gt;
&lt;residual-block&gt;
&lt;pooling-layer&gt;
&lt;output 1&gt;&lt;output 2&gt;&lt;output 3&gt;
</code></pre>
<p>I use the following python code to write my neural network.</p>
<pre><code class="language-python">input_var = C.input_variable((3,320,240), name='input')

def ResidualBlock(filter_size, num_filters):
def generate_residual_block(input_layer): # The first bit of a residual block is a set of convolution filters. # We use padding here to keep the shape intact.
conv_block = For(range(2), lambda: [
BatchNormalization(),
Convolution(filter_size, num_filters, pad=True, activation=None)
])(input_layer)

        # the output of a residual block is the sum of the convolution filter and the input layer.
        # a ReLU activation function is used for this part of the block.
        output = conv_block + input_layer
        output = relu(output)

        return output

    return generate_residual_block

# The core module with residual blocks

core_module = Sequential([
Convolution((5,5), 64, activation=None, pad=True),
For(range(3), lambda: [
ResidualBlock((5,5), 64)
]),
])

# Pooling layer

intermediate_results = MaxPooling((3,3))(core_module)

# Output 1

people_count = Sequential([
Dense(64),
Dense(1, activation=relu)
])(intermediate_results)

# Output 2

violence = Sequential([
Dense(64),
Dense(2, activation=softmax)
])(intermediate_results)

# Output 3

density_level = Sequential([
Dense(64),
Dense(1, activation=relu)
])(intermediate_results)

# The final model

model = combine([density_level, people_count, violence])(input_var)
</code></pre>

<p>That's a lot of code, with a high risk of generating a crappy network. Especially the connection from the hidden layers to the output layers is rather complex.</p>
<p>If I get the connection between the intermediate_results layer and the rest of the outputs wrong, the Microsoft Cognitive Toolkit (CNTK) library will generate duplicate layers. Resulting not only in slower training times, but also generating bad results.</p>
<h2 id="visualizeit">Visualize it</h2>
<p>So how do you know that all layers connect in the right way and CNTK doesn't duplicate any of my layers? You need to visualize it.</p>
<p>CNTK includes a graph plot function in the logging package that you can use to visualize models. It is based on Graphviz. A free graph visualization tool.</p>
<p>Before you can visualize your model, make sure you have Graphviz installed. You can download a version here: <a href="https://graphviz.gitlab.io/_pages/Download/Download_windows.html">https://graphviz.gitlab.io/_pages/Download/Download_windows.html</a></p>
<p>Next add the binaries folder in the Graphviz installation folder to your <code>PATH</code> variable. Mine is installed in <code>C:\Program Files (x86)\Graphviz2.38\bin</code> so I add that to my path.</p>
<p>Now you can visualize your model. For this you need to use the following code:</p>
<pre><code class="language-python">import cntk as C

C.logging.graph.plot(model, 'model.png')
</code></pre>

<p>First import the cntk package and then call the <code>logging.graph.plot</code> function with the instance of your model and a filename.</p>
<p>This generates a picture that looks like this:</p>
<p><a href="/content/images/2018/02/model.png"><img src="/content/images/2018/02/model.png" alt="model"></a></p>
<p>Now you can check the neural network for any bad connections or weird names.<br>
As you can see in the picture, my neural network looks as expected. Except there are a few naming issues with the output layers.</p>
<h2 id="tryityourself">Try it yourself</h2>
<p>The visualization logger of CNTK makes it easier to see what your neural network looks like. But that is not all. You can also use this to generate pretty pictures to explain the network to your colleagues or other people.</p>
<p>Give it a spin and let me know what you think!</p>
<!--kg-card-end: markdown-->
