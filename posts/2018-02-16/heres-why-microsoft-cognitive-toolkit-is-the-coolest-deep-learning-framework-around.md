---
title: >-
  Here's why Microsoft Cognitive Toolkit is the coolest deep learning framework
  around
category: Machine Learning
datePublished: "2018-02-16"
dateCreated: "2018-02-15"
---

<!--kg-card-begin: markdown--><p>Microsoft cognitive toolkit supports loading and saving models in Open Neural Network Exchange) ONNX format, which enables you as a developer to run your trained network on Java and C# with much better overall performance than you can get with Python.</p>
<p>I personally feel that this is the way forward. Train your models in Python and use them from C# and Java.</p>
<p>Let's explore how this would work for a typical model.</p>
<h2 id="trainandvalidatethemodelinpython">Train and validate the model in python</h2>
<p>Let's start out with the most important step. The first step is to build a model. For this we're going to use Keras, which is a open source deep learning framework.</p>
<p>Keras makes it really simple to build a neural network. CNTK has a good API of its own, but Keras makes it even better.</p>
<pre><code class="language-python">model = Sequential()

model.add(Dense(hidden_size, input_dim=input_size, activation='relu'))
model.add(Dense(hidden_size, activation='relu'))
model.add(Dense(output_size, activation='softmax'))

model.compile(optimizer='rmsprop',
loss='categorical_crossentropy',
metrics=['accuracy'])
</code></pre>

<p>Once built, we train the model by executing the <code>fit</code> method on the model instance.</p>
<pre><code class="language-python">model.fit(features, labels)
</code></pre>
<p>Now that we have it trained we can run predictions using the <code>predict</code> method. It accepts a set of features (a list of floating point numbers) and outputs another list of floating point numbers representing the prediction of the network.</p>
<pre><code class="language-python">prediction = model.predict(sample_features)
</code></pre>
<p>As any data scientist knows, you want to make sure that your model works correctly. For this you can use the <code>evaluate</code> method:</p>
<pre><code class="language-python">loss, accuracy = model.evaluate(eval_features, eval_labels)
</code></pre>
<p>Once the model is working as expected we need to export it, so we can use it from C#. For this we're going to use the ONNX format.</p>
<h2 id="exportyourmodeltoonnx">Export your model to ONNX</h2>
<p>The ONNX format is a new file format to describe neural networks and other machine learning models. The ONNX format is meant as an intermediate representation format.</p>
<p>What does this mean? Models exported to ONNX coming from Tensorflow can be imported into CNTK. That's useful since that promotes the exchange of models between different companies, research facilities and developers in general. It doesn't matter what you use, as long as you and your coworker both use the ONNX format you can share your model with that person.</p>
<p>To export a model trained with Keras you need to write a small piece of code:</p>
<pre><code class="language-python">func = model.model.outputs[0]
func.save('model.onnx', format=C.ModelFormat.ONNX)
</code></pre>
<p>Remember we compiled the model earlier and trained it. The compile operation creates a graph in the <code>model</code> attribute. This graph has arguments, inputs and outputs. We need to grab the first output from the model attribute and save this as a function to disk.</p>
<p>Why the first output? Neural networks can have multiple output layers, which result in multiple outputs. We however have just one output in our model. The output in this case points to the previous layer, which in turn points to the previous layer, etc. Essentially, when you have the output you have the neural network as a function.</p>
<p>You can save this function to disk, using the <code>save</code> method. This method accepts a format argument with the value <code>C.ModelFormat.ONNX</code> so that the function is stored correctly.</p>
<h2 id="usingyourmodelfromc">Using your model from C#</h2>
<p>Now that you have the model in ONNX format, let's load it into a C# application and use it to generate predictions.</p>
<p>Microsoft made things easy in this area. There's a nuget package <code>CNTK.CPUOnly</code> that is the C# equivalent of the CNTK framework. It features both a training and evaluation API.</p>
<p>We are going to use the evaluation API to make some predictions.</p>
<p>First up, add a using statement for the CTNK package.</p>
<pre><code class="language-csharp">using CTNK;
</code></pre>
<p>Next load up the model from disk:</p>
<pre><code class="language-csharp">var function = Function.Load(&quot;model.onnx&quot;, _deviceDescriptor, ModelFormat.ONNX);
</code></pre>
<p>The Load method needs a device for the model to be evaluated on. I've left it out in this code for clarity reasons. You will find that in the full sample code at the end of this post there is a device descriptor.</p>
<p>You can use the following code to initialize the device descriptor:</p>
<pre><code class="language-csharp">_deviceDescriptor = DeviceDescriptor.CPUDevice;
</code></pre>
<p>This results in a model that looks very similar to the function object we had in the Python application. To use the function you call <code>function.Evaluate(inputs, outputs, deviceDescriptor)</code>. The <code>Evaluate</code> method accepts inputs, outputs and a device descriptor.</p>
<p>To obtain the inputs, you need to build a mapping between the input variables used by your model and values you want to provide for those variables.</p>
<pre><code class="language-csharp">var inputVariable = _function.Arguments.Single();
var inputs = new Dictionary&lt;Variable, Value&gt;();

var inputValue = Value.CreateBatch(inputVariable.Shape,
InputVector(inputVariable.Shape[0]), \_deviceDescriptor);

inputs.Add(inputVariable, inputValue);
</code></pre>

<p>We grab the first argument that is available on the function. This is the original input layer that was generated by keras when we built the model.</p>
<p>To provide a value to the input layer, we need to create a dictionary of variables and corresponding value instances.</p>
<p>The input value we're using is generated with the following function:</p>
<pre><code class="language-csharp">IEnumerable&lt;float&gt; InputVector(int size)
{
    return Enumerable.Repeat(_random.NextDouble(), size).Select(x =&gt; (float)x);
}
</code></pre>
<p>In short, a list of random floating points. Normally this would be the input values for the neural networks encoded as floating points.</p>
<p>Now that we have the inputs, we need to describe the expected outputs as well.</p>
<pre><code class="language-csharp">var outputs = new Dictionary&lt;Variable, Value&gt;();
outputs.Add(_function.Output, null);
</code></pre>
<p>The outputs are described as a dictionary of variables and values. We provide the output layer of our neural network as variable, but don't assign a value to it. This is to be expected, we don't want to provide a value. We want a value back.</p>
<p>So we have inputs and ouputs for our network. Let's take a look at how to use them.</p>
<pre><code class="language-csharp">_function.Evaluate(inputs, outputs, _deviceDescriptor);
</code></pre>
<p>The <code>Evaluate</code> function automatically replaces the entry for the output variable with the output generated by the function.</p>
<p>To get access to the actual prediction we need to retrieve it from the output dictionary like so:</p>
<pre><code class="language-csharp">var prediction = outputs[_function.Output].GetDenseData&lt;float&gt;(_function.Output);
</code></pre>
<p>The prediction variable now contains a list of list of floats. Basically a 2D matrix where the rows represent the results for individual samples. The columns represent the values for the individual neurons in the output layer of our neural network.</p>
<h2 id="otherlanguagesaresupportedaswell">Other languages are supported as well</h2>
<p>The sample I've shown above is written in C#. However that is not the only language that is supported by CNTK. You can do the exact same thing in Java.</p>
<h2 id="theimportanceofonnxforprofessionalaisolutions">The importance of ONNX for professional AI solutions</h2>
<p>Why would you want to train your model in Python and use it in Java or C#?<br>
Python, as many know, is rather slow. C# and Java are much better for running things like web application.</p>
<p>Java and C# don't work for training the models. The tools provided in Python for working with data are much better.</p>
<p>I want to have the best experience for training and the best performance for serving the model. It makes for a much faster and higher quality solution.</p>
<p>Interested? Give it a spin and let me know how you fare!</p>
<!--kg-card-end: markdown-->
