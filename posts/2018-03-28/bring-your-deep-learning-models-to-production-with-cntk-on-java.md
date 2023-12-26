---
title: Bring your deep learning models to production with CNTK on Java
category: Machine Learning
datePublished: '2018-03-28'
dateCreated: '2018-03-28'
---
<!--kg-card-begin: markdown--><p>If you're looking to bring your deep learning to production you should definitely take a look at CNTK. It offers a great Python and Java API so you get the most out of your model.</p>
<p>In this article I will show you how you can build a neural network with Microsoft Cognitive Toolkit. Then I will also show you how to use it in a Java application.</p>
<h2 id="whyamishowingthisinthefirstplace">Why am I showing this in the first place?</h2>
<p>There’s a lot of talk about machine learning and deep learning. One of the things that struck me while talking about it, is that many people think it’s a data scientist only affair. But that’s not true.</p>
<p>Data scientists know a lot about data analysis, statistics and machine learning. Also, most of the data scientists I know don’t know a lot about unit-testing, program design or performance. Most concepts that we software engineers know very well elude them.</p>
<p>As software engineer you should know a little bit about machine learning. You need to help your fellow data scientist to bring his ideas into production.</p>
<p>Python is a wonderful tool for data scientists. But the performance of this language lacks when you push large amounts of traffic through it. Java and C# are much better at this.</p>
<p>For a neural network to move from Python to Java, you need a good format that is interchangeable between the two. And not a lot of frameworks support this yet.</p>
<p>I’ve found that CNTK is a good fit for building models in Python and running them in another language like Java or C#. Let me show you why.</p>
<h2 id="whatiscntk">What is CNTK?</h2>
<p>CTNK was a library going by the name Computational Network Toolkit. Today it goes by the name Cognitive Toolkit. Microsoft Research develops CNTK to enable researchers to build learning machines. Among these so-called learning machines they imagined building various kinds of neural networks.</p>
<p>So what does it mean to be a computational network. A computational network is a directed graph of variables and parameters. You can use learners to optimize the parameters in the graph. This is in essence what a neural network is. A directed graph of variables and parameters.</p>
<p>You can define yoru neural network in Python, C# or Java. The code is executed outside of these environments. As this is much faster. Usually a GPU is much faster at training a neural network, but you can't run Python on that.</p>
<h2 id="buildyourfirsteverneuralnetworkwithcntk">Build your first ever neural network with CNTK</h2>
<p>To build a neural network with CNTK in Python you need to install the CNTK module on your machine. Unlike regular Python packages, CNTK is not published in the python package directory. Instead you need to follow the instructions in the guide to install it.</p>
<p>You can find the installation guide here: <a href="https://docs.microsoft.com/en-us/cognitive-toolkit/Setup-CNTK-on-your-machine">https://docs.microsoft.com/en-us/cognitive-toolkit/Setup-CNTK-on-your-machine</a></p>
<p>After you’ve installed the package you can start to build your first neural network.</p>
<p>For the rest of this post I will use a sample that classifies hand written digits (who hasn’t seen these before?) using a basic feed forward network.</p>
<p>First things first though, let’s define our network.</p>
<pre><code class="language-python">features = C.input_variable(X.shape[1])
labels = C.input_variable(y.shape[1])

z = C.layers.Dense(32, activation=C.ops.relu)(features)
z = C.layers.Dense(10, activation=C.ops.relu)(z)
</code></pre>
<p>A neural network in CNTK is a mathematical function, which it is in the real world too. CNTK isn’t taking that away from you. It does offer a few shortcuts to make things simpler. Instead of defining each layer in the neural network as a complex formula, CNTK lets me define a layer as Dense.</p>
<p>CNTK follows a functional approach whenever it can, which matches the mathmatical approach. So when you invoke Dense, you have to provide the parameters to define the layer. This gives back a function that accepts one parameter that is the input for the layer. The result of this function is the output of the dense layer connected to the provided input. Essentially, a graph.</p>
<p>I can chain the output of my first layer to the next layer by providing it as the input for the second layer. Again, I first construct the layer function by invoking Dense. Then I invoke the layer function with the output of the first layer. This creates a new graph, that connects the first graph to the new layer.</p>
<h2 id="optimizetheneuralnetwork">Optimize the neural network</h2>
<p>The goal of the neural network is to classify each of the digits you give it. For this to work, you need to specify a loss function that we’re going to optimize.</p>
<pre><code class="language-python">loss = C.losses.cross_entropy_with_softmax(z, labels)
accuracy = C.metrics.classification_error(z, labels)
</code></pre>
<p>The loss function for our classifier is a categorical cross entropy function. When the neural network classifies a digit correctly, the function returns a function close to zero. The loss function returns a value close to one when the digit is classified incorrectly.</p>
<p>Together with the loss function we also define an evaluation function. This function is used to evaluate how well the network is doing. We will not go into further detail on this here, but it is important to have it in place, because we will use this function later on to verify the neural network.</p>
<p>When we train the neural network we want to minimize this loss function. Remember, the closer to zero we are, the better the network.</p>
<p>Speaking of training, in order to train the network we need to specify a trainer. The trainer takes in the model, a combination of the loss and evaluation function and a learner used to optimize the parameters.</p>
<pre><code class="language-python">learners = [
    C.sgd(z.parameters, lr=0.0001)
]

trainer = C.train.Trainer(z, (loss, accuracy), learners)
</code></pre>
<p>Next step is to invoke the trainer with samples to optimize the neural network.</p>
<p>CNTK is strictly about deep learning, it doesn’t feature anything related to data. You have to use numpy and tools like scikit-learn for this.</p>
<p>Lucky for us, scikit-learn contains a standard dataset for labeled handwritten digits. We’re going to load this dataset and use that to train our model.</p>
<pre><code class="language-python">digits = datasets.load_digits()

X = digits.images.reshape((len(digits.images), -1)).astype(np.float32)

y = digits.target
y = np.eye(10)[y]
</code></pre>
<p>First we import the package for the datasets and grab the digits dataset. This dataset is in a format that doesn’t work directly with CNTK. So we have to modify it a little bit.</p>
<p>We take the images from the digits dataset and reshape it so that the pixels of each image are concatenated into one large feature vector. The number of rows in the dataset remains the same.</p>
<p>The labels are a bit more work. Each image in the digit dataset has a number associated with it. The number the image represents. Our neural network however can’t work with this. It needs to have a vector of 10 elements, where each element represents the digit that the input represents. So when you have the number three, the third element in the vector is set to one, while the others are set to zero.</p>
<p>We need to convert our numeric representation to a set of one-hot vectors that match the pattern we described before. For this we use a dirty trick. First we create an identity matrix. The identity matrix for our digits is 10 rows by 10 columns. The property of an identity matrix is that at the nth-row it has the nth-column set to 1 while the rest is set to 0. The effect is that you have ones running diagonally through the matrix.</p>
<p>From this identity matrix we select all the numbers that we have as the labels for our digits. Numpy will automatically map the numbers to the corresponding row from the matrix. Resulting in the correct one-hot vector to be selected that represents the number.</p>
<p>We need to do one more thing after we converted the data to correct representation. We need to make sure we have a training and test dataset. We use the training set to learn the neural network to recognize digits. We use the test set later on to check that the network also understands digits that it hasn't seen before.</p>
<pre><code class="language-python">X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y)
</code></pre>
<p>To split our dataset we apply the train_test_split function. Notice that the stratify parameter is set to the labels that we converted. We’re using a stratified split.</p>
<p>We use a stratified split so that the we have an even number of samples for each digit. We want each digit to be present in both the training and test set. This gives the neural network a good chance to actually learn each digit. And you make sure that you check that each digit recognized.</p>
<p>We prepared the data, let’s look at the training procedure.</p>
<p>When you run each training sample once through the network, it will not work very well. You need to run all the training samples through the network many times. Each time we do a full sweep of the dataset we perform a single epoch.</p>
<pre><code class="language-python">for n_epoch in range(num_epochs):
    for n_batch in range(num_batches):
        X_batch = X_train[n_batch*32:n_batch*32+32]
        y_batch = y_train[n_batch*32:n_batch*32+32]
        
        trainer.train_minibatch({ features: X_batch, labels: y_batch })
</code></pre>
<p>We run all samples through the neural network in batches. We do this, to speed up the training process and to keep memory usage at an acceptable level.</p>
<p>The batches are generated by taking a slice of data from the X and y numpy arrays. They are then fed to the trainer by invoking the train_minibatch method.</p>
<h2 id="checktrainingprogress">Check training progress</h2>
<p>When you execute the training code, you will see nothing. Trust me, there is a trained network at the end of the training process that can classify digits. But there’s not much to see.</p>
<p>To monitor training progress you need to modify the trainer so that it included progress writers.</p>
<p>So what are progress writers? Progress writers are components that are invoked upon completion of each minibatch. When a minibatch is completed, metrics for loss and error rate are logged.</p>
<p>There are some progress writers you can use. For example, there’s one that writes to the console. But there’s also a progress writer for Tensorboard. A tool that can visualize your model and show graphs of the various model metrics.</p>
<p>Let’s take a look at how you can use a progress writer to report training progress.</p>
<pre><code class="language-python">progress_printer = C.logging.progress_print.ProgressPrinter(first=0, freq=5)

logging_callbacks = [
    progress_printer
]

trainer = C.train.Trainer(z, (loss, accuracy), learners, progress_writers=logging_callbacks)
</code></pre>
<p>First create a new instance of ProgressPrinter and specify the frequency at which the progress should be reported. Next, build a list of progress_writers that you want to add to your trainer.</p>
<p>Finally, modify the trainer so that it includes the list of progress writers to use.</p>
<p>Now when you run the training logic again, you will see output on the console that looks similar to this:</p>
<pre><code class="language-shell">Learning rate per minibatch: 0.0001
 Minibatch[   1-   5]: loss = 2.348842 * 160, metric = 93.75% * 160;
 Minibatch[   6-  10]: loss = 2.353378 * 160, metric = 91.25% * 160;
 Minibatch[  11-  15]: loss = 2.350477 * 160, metric = 90.62% * 160;
 Minibatch[  16-  20]: loss = 2.343993 * 160, metric = 91.25% * 160;
 Minibatch[  21-  25]: loss = 2.361834 * 160, metric = 91.88% * 160;
 Minibatch[  26-  30]: loss = 2.350307 * 160, metric = 91.25% * 160;
 Minibatch[  31-  35]: loss = 2.354828 * 160, metric = 91.25% * 160;
 Minibatch[  36-  40]: loss = 2.347044 * 160, metric = 91.25% * 160;
 Minibatch[  41-  45]: loss = 2.320874 * 157, metric = 88.54% * 157;
 Minibatch[  46-  50]: loss = 2.347072 * 160, metric = 93.12% * 160;
 Minibatch[  51-  55]: loss = 2.352391 * 160, metric = 91.25% * 160;
 Minibatch[  56-  60]: loss = 2.348755 * 160, metric = 90.62% * 160;
 Minibatch[  61-  65]: loss = 2.343674 * 160, metric = 91.25% * 160;
 Minibatch[  66-  70]: loss = 2.360355 * 160, metric = 91.88% * 160;
 Minibatch[  71-  75]: loss = 2.349451 * 160, metric = 90.62% * 160;
 Minibatch[  76-  80]: loss = 2.354141 * 160, metric = 91.25% * 160;
 Minibatch[  81-  85]: loss = 2.346149 * 160, metric = 91.25% * 160;
</code></pre>
<p>So what can you do with this logging information? First of all, you can see what the computer is doing. Which is great on its own. But more importantly, you can spot problems early on.</p>
<p>For example, when the loss doesn’t decrease, your network isn’t getting better. Also, it does lower, but too slow, you know it is time to increase the number of epochs or try different settings for the learner.</p>
<h2 id="testtheneuralnetwork">Test the neural network</h2>
<p>Now that you have a trained neural network, let’s take a look at how to verify the neural network using the test set. This step is important, as now we can get a sense of how well we’re actually doing.</p>
<p>Remember, the neural network should not only learn to reproduce the samples that we’ve shown during training. It should also generalize. By generalization we mean that the network should be able to classify samples of digits that it has never seen before.</p>
<p>Let’s run the test set through our network and measure its performance.</p>
<pre><code class="language-python">scores = []

for n_batch in range(num_test_batches):
    X_batch = X_train[n_batch*32:n_batch*32+32]
    y_batch = y_train[n_batch*32:n_batch*32+32]
    
    score = trainer.test_minibatch({ features: X_batch, labels: y_batch })
    
    scores.append(score)

final_score = np.mean(scores)

print(final_score)
</code></pre>
<p>The sample code uses minibatches, just like the training procedure. Remember, not all of our images fit into memory easily. So we have to run the test procedure in mini batches.</p>
<p>Because we use minibatches we have to record all the evaluation scores in a list and calculate the mean to get the final score.</p>
<p>Remember that evaluation function we plugged into our trainer? This evaluation function is used when you invoke test_minibatch and returns a single scalar value between zero and one to indicate the accuracy of our model.</p>
<p>The accuracy is measured by looking at how many samples were predicted correctly. In a binary classifier this is the only way to measure the effectiveness of your model. You only have one class or the other. In a multi-class classification like we are dealing with here, it is still a good idea to measure the overall accuracy but you should also measure the accuracy per class. It could well be that there are digits that don’t get predicted at all.</p>
<p>We’re going to leave this exercise up to you, dear reader, but as you can imagine, it looks very much like the test procedure that we use here. The difference is that you run separate batches per class.</p>
<h2 id="usethemodelinyourproductioncode">Use the model in your production code</h2>
<p>From the measurements done in the test procedure we learn that our model performs at around 92% percent accuracy. Not bad at all, so let’s try to use it in production code.</p>
<p>For this we’re going to switch languages to Java. But before we do that, let’s save the model first so we can import it in Java at a later point.</p>
<pre><code class="language-python">z.save('model.onnx', format=C.ModelFormat.ONNX)
</code></pre>
<p>In the code sample we invoke the save method on the model with the ONNX format flag set.</p>
<p>ONNX is an open format for neural networks and other machine learning models. It is an intermediate language for models, just like bytecode is an intermediate language for JVM based programs.</p>
<p>There are many other libraries to build machine learning algorithms, but none are compatible with other libraries. This is a problem in the long run, because frameworks are in constant flux. What’s cool today is very uncool next week.</p>
<p>ONNX solves the problem of incompatible libraries by providing a standardized way of describing machine learning models. It uses protobuf as the underlying format, which is well understood by almost any programming language. On top of that, ONNX and protobuf are open formats. Which means that you can be sure that stuff will work ten years from now.</p>
<p>Let’s move over to Java and see how we can import our model into a microservice application.</p>
<p>For this example, I’ve created a basic spring boot 2.0 application that will host the model behind a REST interface.</p>
<pre><code class="language-java">@RestController
public class ClassifyImageController {
    private final ImageDecoder decoder;
    private final DigitClassifier classifier;

    @Autowired
    public ClassifyImageController(ImageDecoder decoder, DigitClassifier classifier) {
        this.decoder = decoder;
        this.classifier = classifier;
    }

    @RequestMapping(value = &quot;/api/predict&quot;, method = RequestMethod.POST)
    public ResponseEntity&lt;Object&gt; classifyImage(@RequestParam(&quot;file&quot;) MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new GenericError(&quot;Please upload a valid image.&quot;));
        }

        try {
            byte[] pixels = decoder.decode(file.getInputStream());
            int digit = classifier.predict(pixels);

            return ResponseEntity.ok(new ClassificationResult(digit));
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new GenericError(&quot;Failed to process image.&quot;));
        }
    }
}
</code></pre>
<p>The REST controller in this case is rather basic. It accepts an image upload over HTTP. The incoming JPEG file is automatically decoded by an image decoder component. The result of this decoding operation is fed to our model.</p>
<p>The image decoding component loads the JPEG file, resizes and crops the picture to the right dimensions that we expect in our model and then concatenates all pixels to a single feature vector. Just like we did in python.</p>
<p>The interesting bit is in the DigitClassifier component that we use. We’re going to use the CNTK bindings for Java to load our model and use it to predict digits from images uploaded by the user. The classifier has a static method called create, which looks like this:</p>
<pre><code class="language-java">public static DigitClassifierImpl create() {
    DeviceDescriptor device = DeviceDescriptor.getCPUDevice();
    Function modelFunction = Function.load(&quot;model.onnx&quot;, device, ModelFormat.ONNX);

    return new DigitClassifierImpl(modelFunction, device);
}
</code></pre>
<p>The first line in the create method creates a new device descriptor for the function that is loaded on the second line. We use the CPU for predictions instead of the GPU. We could of course use the GPU to make predictions. But it is not necessary as the CPU is fast enough for predicting classes.</p>
<p>The result of the create method is a new DigitClassifierImpl instance with the device descriptor and function preloaded.</p>
<p>Let’s look at how the classifier actually makes a prediction:</p>
<pre><code class="language-java">public int predict(byte[] pixels) {
    Variable features = modelFunction.getArguments().get(0);
    Variable predictedDigit = modelFunction.getOutputs().get(0);

    FloatVectorVector batch = new FloatVectorVector();
    batch.add(translateInput(pixels));

    Value inputValue = Value.createDenseFloat(features.getShape(), batch, device);

    UnorderedMapVariableValuePtr inputMap = new UnorderedMapVariableValuePtr();
    UnorderedMapVariableValuePtr outputMap = new UnorderedMapVariableValuePtr();

    inputMap.add(features, inputValue);
    outputMap.add(predictedDigit, null);

    modelFunction.evaluate(inputMap, outputMap, device);

    FloatVectorVector outputBuffer = new FloatVectorVector();
    outputMap.getitem(predictedDigit).copyVariableValueToFloat(predictedDigit, outputBuffer);

    FloatVector outputRecord = outputBuffer.get(0);
    float[] scores = getValuesFromVector(outputRecord);

    return argMax(scores);
}
</code></pre>
<p>The method for making a prediction is rather long. Let’s go through it step by step.</p>
<p>The first two lines extract the input and output variable of our neural network. These are symbolic, you have to look at these as pure pointers. Keep in mind, CNTK is a native library with layers around it for Python, Java and C#. You only work with pointers towards the data. Everything else happens out of view.</p>
<p>The three next lines deals with creating a batch of data. CNTK uses FloatVector to build a single row of data and FloatVectorVector to combine multiple FloatVector instances into a matrix or table.</p>
<p>For our prediction we create a single row of pixels from the image and combine that into a FloatVectorVector.</p>
<p>In order to feed our batch of data into the neural network we need to create a dense-vector value object. This copies our floating points from the FloatVectorVector to native memory so that the GPU and CPU can access it faster.</p>
<p>Now that we have a value, let’s create an input mapping for the neural network. It contains the input variable as key which points to the value we just created.</p>
<p>We also need to tell CNTK where to store the output of our network. We do this by creating another variable mapping, but this time we use the key for the output variable with a null-pointer as value. This tells CNTK that we don’t have a value for the output variable yet.</p>
<p>Now it is time to invoke the modelFunction instance with our input and output mappings. This will execute the function and produce a value for the output variable.</p>
<p>We can get the value for the output variable by copying floating points from native memory back to managed memory in Java.</p>
<p>The output value is a matrix with 1 row and 10 columns. We decode the vector to a real number by grabbing the index of the highest value in the vector.</p>
<p>For example, the following image:</p>
<p><img src="/content/images/2018/03/number-six.png" alt="Sample input"></p>
<p>Will result in a prediction of the value 6. Which is accurate, but because we’re dealing with machine learning it can get it wrong. Sometimes you’re really unlucky and get a 9 for a drawing of a 2.</p>
<p>You could of course improve this by building a different neural network or by changing some of the parameters in the network. This is entirely up to you.</p>
<h2 id="conclusion">Conclusion</h2>
<p>Building a neural network without knowing a lot about deep learning can be a daunting task. My goal for this article is not to show you exactly how it works and what math is involved. Rather I want to show you how much work it is for a data scientist to build and train a model.</p>
<p>For a data scientist, building a model isn’t a big deal. He typically for something simple as the digit dataset that we used in this article, it would take only about an hour to come up with something that works reasonably well.</p>
<p>Thanks to the open neural network format ONNX it is quite easy to move from Python to Java. Although I have to admit that the CNTK version for Java is still a bit rough, because of the low level wrapper around the native code of CTNK.</p>
<p>I hope you enjoyed the tour through CNTK and have a better grasp of what it takes to build a neural network for production use.</p>
<!--kg-card-end: markdown-->
