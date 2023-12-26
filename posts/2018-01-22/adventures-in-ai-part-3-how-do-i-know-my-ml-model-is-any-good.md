---
title: 'Adventures in AI part 3: How do I know my ML model is any good?'
category: Machine Learning
datePublished: '2018-01-22'
dateCreated: '2018-01-21'
---
<!--kg-card-begin: markdown--><p>You can train any model you like for your AI solution, but it is only as good as the data you feed it. But how do you measure the performance of a machine learning model? In this third part of the series on AI models I will show you how.</p>
<p>This post is part of a series on AI, you can find more information in the <a href="https://fizzylogic.nl/2017/05/26/adventures-in-ai-part-1-what-is-a-gradient-descent-algorithm/">first post of the series</a>.</p>
<h2 id="validationofmachinelearningmodelsisdifferent">Validation of machine learning models is different</h2>
<p>Machine models are a different kind of beast to work with. I've build regular software solutions for quite some time now and found that rule based solutions are way easier to validate.</p>
<p>Why is it so different to test a machine learning model then you ask? Well, a machine learning model is based on statistics, random factors and probabilistic approaches. This makes for a very volatile mixture. You can't look at an AI solution and pinpoint the exact problem as you would with a regular software solution.</p>
<p>Some developers would argue that it is impossible to test machine learning models. I think that there are some approaches that will give you the proper performance metrics that you need to be able to use your machine learning model with confidence.</p>
<p>There are two ways in which you can test machine learning models. First you can build unit-tests. But unit-tests for AI solutions don't test the actual performance of the model that you're using. It can only test whether data flows through the model correctly and that the model doesn't raise any exceptions.</p>
<p>To measure if the model predicting the correct output, you need a different test approach. In fact it is not so much a correctness test, but rather a performance test.</p>
<p>By using the validation techniques in this post you will be able to answer the question: How far off are we with our predictions?</p>
<h2 id="measuringperformance">Measuring performance</h2>
<p>There's not one method to measure the performance of your machine learning model. For each kind of model there's a different technique that will tell you how well your model performs.</p>
<p>I will talk you through some of the most used metrics there are in machine learning. These metrics work for regular machine learning as well as deep learning models.</p>
<h3 id="measuringperformanceofregressionmodels">Measuring performance of regression models</h3>
<p>For regression models for example you need to measure the distance between the predicted value and the actual value that the model was trained to predict.</p>
<p>To do this you usually use a score Mean Square Error (MSE). This expresses the average amount by which the model will be off.</p>
<p>The larger the output of the Mean Square Error formula, the worse the model performs.</p>
<p>For example, if you're predicting the value of a house in dollars, MSE will tell you how many dollars you will be off by on average (squared though, so values will be high).</p>
<p>You can find the exact definition of the formula over <a href="https://en.wikipedia.org/wiki/Mean_squared_error">on wikipedia</a>.</p>
<p>Another good measurement of how well the model does is the R-squared score. This score is a value between 0 and 1. The closer the score is to its maximum, the better the model fits the input data.</p>
<p>You can read more about this score <a href="https://en.wikipedia.org/wiki/Coefficient_of_determination">on wikipedia</a>.</p>
<p>Notice that you should both R-squared and MSE with care. If there are many outliers in the input data, will still be off by quite a big margin.</p>
<p>One shining example of where a model can go wrong is <a href="https://en.wikipedia.org/wiki/Anscombe%27s_quartet">Anscombe's quartet</a>. Both performance metrics that I've shown above will not help you when you have a situation as described in Anscombe's quartet.</p>
<p>To get the best results possible, follow these three steps:</p>
<ol>
<li>Check your data for outliers and drop them if you can</li>
<li>Visualize your data and check for signs that something's wrong.</li>
<li>Use the performance metrics I've shown you.</li>
</ol>
<h3 id="measuringperformanceofclassificationmodels">Measuring performance of classification models</h3>
<p>To validate a classification model you need to use different performance metrics. There's no relative measure of correctness. Instead you are either correct or not on a predicted label.</p>
<p>To measure the performance of a classifcation model you need to use a confusion matrix.</p>
<table>
    <tr>
        <td>&nbsp;</td>
        <td>Actual positive</td>
        <td>Actual negative</td>
    </tr>
    <tr>
        <td>Predicted positive</td>
        <td>True positive</td>
        <td>False positive</td>
    </tr>
    <tr>
        <td>Predicted negative</td>
        <td>False negative</td>
        <td>True negative</td>
    </tr>
</table>
<p>Using this table you can calculate the accuracy of your model:</p>
<p>$$<br>
Accuracy = \frac{TP+TN}{TP+TN+FP+FN}<br>
$$</p>
<h3 id="measuringmulticlassclassificationmodels">Measuring multi-class classification models</h3>
<p>Accuracy is only useful for measuring performance of a binary classifier. If you have multiple labels in your data that you want to predict you need more precise tools.</p>
<p>Accuracy still works, but is rather crude. It only measures the overall number of cases that you predicted correctly. For a more accurate score you need to take a look at how well the classifier does for each label individually.</p>
<p>The best way to measure performance of a multi-class classifier is to measure accuracy per label.</p>
<p>This is a good metric for classification models if you return just one result to the user of your model. In the case of recommendations this doesn't work.</p>
<h3 id="measuringperformanceofrecommendationsystems">Measuring performance of recommendation systems</h3>
<p>Recommendations are a special case of classifcation model. You predict whether someone likes an item or not. You typically show a number of recommended items instead of just one. This begs the question, how good is my model in this case?</p>
<p>There are two more measures important here. Precision and Recall.<br>
Precision tells you how many of the items you show are actually relevant to the user.</p>
<p>$$<br>
Precision = \frac{TP}{TP+FP}<br>
$$</p>
<p>The second measure that is important for recommendations is Recall. How many of the relevant items from the whole dataset are ever shown to the user. For example, if in theory there are 10 relevant books in the database that are proven relevant. How many of those books are shown to the user?</p>
<p>$$<br>
Recall=\frac{TP}{FN+TP}<br>
$$</p>
<p>You cannot maximize precision and recall at the same time. You have to make a tradeoff in your model. Do you want to show many relevant items? You have to increase the total number of items displayed. Thus decreasing the precision. Want to show only relevant items? Decrease the number of items shown and decrease the recall again.</p>
<p>A good way to visualize this behavior is the area under the curve metric. This shows you just how well the recommendation system is working. For more information take a look at <a href="https://en.wikipedia.org/wiki/Receiver_operating_characteristic#Area_under_the_curve">this wikipedia article</a>.</p>
<h3 id="accountingforfalsepositivesandfalsenegatives">Accounting for false positives and false negatives</h3>
<p>Looking at absolute performance figures for classifiers is fine in general. But it doesn't account for some nasty scenarios. For example: When you predict fraud cases you want to minimize the amount of false positives. Or if you want to minimze the chance that you've missed fraud cases you may want to minimize the false negatives.</p>
<p>To account for this you need to make use of the F1 score. The basic formula for the F1 score is like this:</p>
<p>$$<br>
{F1-score} = \frac{precision*recall}{precision+recall}<br>
$$</p>
<p>It takes both precision and recall in account. Remember, recall is the measure of how many true positives are actually picked up by the classifier. In this case how many fraud cases it actually detects. The precision tells you how many of the cases that were presented as positive are true positives.</p>
<p>You can change this formula by including an additional factor. I call this the tuning factor.</p>
<p>$$<br>
{F1-score} = (1+\beta) \frac{precision*recall}{\beta * precision+recall}<br>
$$</p>
<p>You can tune the beta variable between 0 and 1. When you set the value to 1 you want to maximize recall. When you set the value of beta to 0.5 you focus on precision instead.</p>
<h2 id="thetestvalidationsplit">The test/validation split</h2>
<p>Now that you've seen the metrics for measuring performance, let's talk about the famous train/validation split. A lot of people will tell you it is important to split your data in a training and validation set. But why should you?</p>
<p>To understand why you should split your input data we have to go back to how a model learns.</p>
<p>A machine learning model learns by finding rules or parameters that best fit the training data. For example if you want to predict the price of a house you'd typically use a regression model that looks like this:</p>
<p>$$<br>
price = w_0 * rooms + w_1 * space_{living} + w_2 * space_{garden}<br>
$$</p>
<p>To get the best predictions possible you're going to need to find values for w1, w2 and w3 that fit the training data best.</p>
<p>There's two things that happen while you're trying to find the optimal weights in a model. First the model tries to memorize the optimal weights so that it best matches the training data. Second by learning the weights that fit the training data, rules are discovered that also work for similar but unseen data.</p>
<p>The memorization effect of a machine learning algorithm is rather unfortunate as this reduces the chance that it finds parameters that work for similar, but unseen data. This is called overfitting.</p>
<p>You want to balance between memorization and generalization in your model.<br>
So when you validate your model you will test for two things:</p>
<ul>
<li>Does the model learn properly from the training data</li>
<li>Is the final model general enough to fit similar, but unseen data</li>
</ul>
<p>For this you need to run the validation metrics for two sets of data. First you use the training data for learning the parameters. You can then run the performance metrics with the same data to get an initial performance measurement. This gives you a measure of how well the model learns. Second you need a separate set of data, that is not used for training, to see whether the model generalizes to a more usable solution. This is the validation set.</p>
<p>As a general rule of thumb you want to split the data in 80% training data and 20% validation data.</p>
<p>To perform this split you need to randomly select samples for both sets. Why random? If you pick the top 80% of your training samples without using randomness, you may be looking at a set that doesn't cover the whole range of possible input values for your model to learn from. So you should use random selection for splitting the data.</p>
<p>But be careful when you split your data. When you have a classification model you want to split the data so that there's a balanced set of classes represented in the training and the test data. Remember that when you provide a very limited set of samples for a single class, the model isn't going to be able to learn sufficiantly good rules to classify data for that class.</p>
<h2 id="modelselection">Model selection</h2>
<p>Notice that in contrast to common wisdom I haven't talked about train/validation/test sets. You will encounter this trio of datasets quite often on the internet. The reason is this.</p>
<p>Typically when you are working on a machine learning solution you are going through these three phases:</p>
<ol>
<li>Prepare the data for machine learning</li>
<li>Train different models and select the model that works best for your data</li>
<li>Perform a final validation on the model to make sure that it works in production</li>
</ol>
<p>I mentioned that you need to split your data in a training and validation set. This split is required to detect problems with overfitting. When you train a single model on the dataset that's enough and you shouldn't set apart a third set of samples for testing.</p>
<p>However, if you're training multiple models because you're unsure of what model will work. Then this third set of data becomes more important.</p>
<p>All models should be validated using the same samples to get a proper comparison of the performance of the different models you've trained.</p>
<p>To make this work, you need to first split your data in a 80% training set and 20% test set. For each model you train after this you can take the 80% training set and split randomly split it in 80% training and 20% validation data. The initial 20% is fixed.</p>
<p>Again, be careful how you split the data. Make sure that you have an equal amount of samples for each class you want to predict.</p>
<p>Additionally, I would not randomly split the initial dataset but spend some time picking the right test samples. You want to make sure that there's a particularly good spread in those test samples. This is, after all, the final quality measure for your model. Get this wrong and you maybe wondering why people complain about your AI solution.</p>
<h2 id="crossvalidationforevenbettermetrics">Cross validation for even better metrics</h2>
<p>The different validation techniques in this post will help you get started to validate your machine learning models. And the test/validation split will help you detect overfitting scenarios.</p>
<p>However, all of the performance measures are relative. The accuracy, precision, MSE and other metrics will vary across runs. That's because there's a random factor involved.</p>
<p>The random factor in machine learning comes from the very first step in the process of learning the rules for a model. Because you can't start with nothing you have to pick random values for the parameters in your model. This causes the model to go in a random direction when you perform the next step in the learning process.</p>
<p>Randomness isn't a big problem, because ultimately this is solved by providing enough training samples so a set of general rules emerge.</p>
<p>However for validating a model this means that you will see fluctuations in the performance.</p>
<p>Cross validation can counter-act this effect a little bit. By performing multiple training/validation runs on a single type of model with different sets of training/test data you generate enough metrics that allow you to come up with a mean value for the performance metrics of your model. This evens out the random effect quite a bit.</p>
<p>Note, this too isn't a 100% guarantuee that your model works. I would only use this if you have doubts about the performance of your model and want to make sure that the random factor doesn't play in your disadvantage.</p>
<h2 id="humanintheloop">Human in the loop</h2>
<p>Ultimately, your machine learning model isn't going to be a 100% effective. But by using proper validation techniques you can make sure that the results are as close to 100% as they can be.</p>
<p>There's one additional step that I want to mention here. Please, make sure you ask a human what he/she thinks of your model. User feedback is the ultimate test of how well your model is doing.</p>
<p>The people that use your solution know what to expect and are almost always better at picking the right label or setting the right output value for a set of inputs.</p>
<h2 id="conclusion">Conclusion</h2>
<p>With the right techniques in your toolbox you should now be able to test your AI solution and make sure that it meets user standards.</p>
<p>So in short, when you want to build an AI solution, follow these steps to measure its performance:</p>
<ol>
<li>Pick the right validation strategy: Ask yourself, will I be using model selection in my project? If so, use the appropriate data processing to get the right datasets for training, validation and testing.</li>
<li>Pick the right performance metrics: Ask yourself, what kind of model am I testing. Are false positives a bad thing? Or do I want to be as precise as possible?</li>
<li>Ask the people that use the model. User feedback is the most important performance metric of all.</li>
</ol>
<p>Happy hacking!</p>
<!--kg-card-end: markdown-->
