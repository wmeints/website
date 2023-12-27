---
title: It's easier than ever to add machine learning to your C# program. Use ML.NET!
category: Machine Learning
datePublished: "2018-10-07"
dateCreated: "2018-10-07"
---

<p>In the past machine learning was something exclusively for the pythonistas or data scientists that knew how to use Python or R and had studied statistics. Not anymore, it has become a lot easier for developers to use machine learning. This also goes for .NET developers.</p><p>In april this year Microsoft launched the new ML.NET library. A library with classic machine learning algorithms implemented in C#. This means if you are programming C# you now have access to a large group of machine learning algorithms that you can use in your application.</p><h2 id="what-makes-ml-net-so-interesting">What makes ML.NET so interesting?</h2><p>Typically when you want to use machine learning in your application you have to build something in Python or R. But that means if you are writing C# you need to switch to another language to build your machine learning application.</p><p>I personally love the idea of using just one language in a project. It makes it easier for developers on the team to take on any job that we throw at them. Also, switching languages all the time is hard and annoying. I do this a lot and I can assure you, you have to retrain your muscle memory everytime you do this.</p><p>ML.NET may be young, but has a full set of machine learning algorithms. Even cooler, if you have someone on the team that made a deep learning model in Tensorflow, you can load that into ML.NET as well. </p><p>You still need to learn about different machine learning problems and how to approach them. But at least you can do it from C#.</p><h2 id="getting-started-with-ml-net">Getting started with ML.NET</h2><p>So how do you start? ML.NET is available as a nuget package. You can add this package to your project in two ways:</p><pre><code>dotnet add package Microsoft.ML</code></pre><p>Or right click your project, choose <code>Manage nuget packages</code> and search for <code>Microsoft.ML</code>. Once added you can start building your machine learning pipeline.</p><p>ML.NET uses the pipeline pattern as a way to express the process of training a model. When you build a machine learning solution you typically have these steps in your program:</p><ol><li>Load data from a data source</li><li>Preprocess the data so that it is in a format the algorithm understands</li><li>Use the preprocessed data to train the model</li></ol><p>This looks like a pipeline and that's the reason why ML.NET uses this pattern. Let's take a look at how to build a training pipeline.</p><p>First step is to build a data source for the pipeline. There are a number of loaders you can use, one of them the TextLoader. </p><pre><code>var env = new LocalEnvironment();

var reader = TextLoader.CreateReader(env,
ctx =&gt; (
lotArea: ctx.LoadFloat(4),
type: ctx.LoadText(15),
style: ctx.LoadText(16),
quality: ctx.LoadFloat(17),
condition: ctx.LoadFloat(18),
price: ctx.LoadFloat(80)),
new MultiFileSource("data/train.csv"), hasHeader: true, separator: ',');</code></pre><p>When you call <code>CreateReader</code> you need to provide a lambda that will tell the loader how to get data from the CSV file into a C# type. You can go strongly typed, or just use C# 7 tuples like in the sample above.</p><p>Once you have a data source, you need to convert the data so that it fits the algorithm. </p><p>Most machine learning algorithms need floating points. Which we don't have at this point in the code. So we need to extend the pipeline.</p><pre><code>var estimator = reader.MakeNewEstimator()
.Append(row =&gt; (
price: row.price,
style: row.style.OneHotEncoding(),
condition: row.condition,
quality: row.quality,
lotArea: row.lotArea,
type: row.style.OneHotEncoding()
));</code></pre><p>We take the reader and append a new pipeline component to it. This pipeline component takes the incoming data from the reader and transform it.</p><p>Some properties you simply need to copy as they already have the right format. Others you have to change. </p><p>For example, take a look at the style property. In my dataset this is encoded as a string representing different styles of homes. But the machine learning algorithm expects a number. So we tell the pipeline we want our `style` property to be one-hot encoded. The output now contains numbers representing the different values I have in my dataset.</p><p>Now that we have the values encoded, we need to make sure we have a target value to train on and a set of features to feed into the machine learning algorithm. For this you need another step in the pipeline:</p><pre><code>estimator.Append(row =&gt; (
price: row.price,
features: row.condition.ConcatWith(
row.quality, row.style, row.type, row.lotArea).Normalize()
)
)</code></pre><p>The price is copied to the output of the pipeline step. The features however are made by concatenating the different properties from the input into a single vector. Each column in the output vector <code>features</code> represents a property we loaded earlier.</p><p>Now on to the final step, let's add the step that predicts the price of a house. </p><pre><code>var regressionContext = new RegressionContext(env);

estimator.Append(row =&gt; (
price:row.price,
predictedPrice: regressionContext.Trainers.Sdca(
row.price,
row.features,
loss: new SquaredLoss())
));</code></pre><p>To predict the price of a house we use a regression context. The regression context contains logic to build machine learning models that are used for regression purposes.</p><p>The predictedPrice is set by the Sdca algorithm that you initialize in this step. Additionally you need to copy the original price as well. To train the model you feed in the expected price and the features from the previous step. Additionally you need to provide a loss function. This loss function is used in the optimization of the machine learning model.</p><p>To be able to evaluate the model you need to return the expected value and the predicted value in this step. We'll get back to this later on.</p><p>Because now that you have a pipeline you can train it using the <code>Fit</code> method.</p><pre><code>var data = reader.Read(new MultiFileSource("data/train.csv"));
var model = estimator.Fit(data);</code></pre><p>First load the data using the reader. Feed this data into the estimator pipeline we built earlier. This produces a trained model.</p><p>If you want to know how well the model performs, you need to use the evaluation logic provided by the regression context.</p><pre><code>var metrics = regressionContext.Evaluate(model.Transform(data),
row =&gt; row.price, row =&gt; row.predictedPrice);</code></pre><p>The <code>Evaluate</code> method needs the real price and predicted price. You can provide this information by calling <code>Transform</code> method on your estimator pipeline. Next you need to provide the field for the real value and the predicted value.</p><p>The output of the <code>Evaluate</code> method is a set of metrics. This contains the error rate for your model and other relevant metrics.</p><p>Once a model is trained you can use it to make predictions. When making a prediction you still need to use the preprocessing stops earlier. The data doesn't come from a data source like a text file, but rather from your application.</p><pre><code>class House
{
public float condition;
public float quality;
public string style;
public string type;
public float lotArea;
public float price;
}

class PredictedPrice
{
public float predictedPrice;
}

var predictor = model.AsDynamic.MakePredictionFunction&lt;House, PredictedPrice&gt;(env);</code></pre><p>You can create a prediction function by calling <code>AsDynamic</code> and then <code>MakePredictionFunction</code> with the type information for the input and the output.</p><p>The properties on both of these types should match the fields you are using in your pipeline. In my case, I need to provide all the properties I used to train the model. Additionally, I created a <code>PredictedPrice</code> class with a <code>predictedPrice</code> property that matches the <code>predictedPrice</code> property that I created at the end of the pipeline.</p><p>The predictor can now be used to make a prediction:</p><pre><code>var prediction = predictor.Predict(new House
{
lotArea = 8450,
type = "1Fam",
style = "2Story",
quality = 7,
condition = 5
});

Console.WriteLine($"Predicted price: {prediction.predictedPrice}");</code></pre><p>That's it, a strongly typed machine learning pipeline to predict housing prices. </p><h2 id="get-adventuring-try-it-out-">Get adventuring, try it out!</h2><p>This is the part where I have to warn you about the state of ML.NET. It is still in preview, version 0.6 is up on nuget at the moment. Which means you can use it, but things will change and break.</p><p>Probably not for your next production project. But great for experiments and projects that are starting out today.</p><p>So get adventuring and try it out!</p><p></p>
