---
title: "Adventures in AI part 1: What is a gradient descent algorithm?"
category: Machine Learning
datePublished: "2017-05-26"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>When you start out with machine learning and AI you will learn very quickly that there's a lot of math involved.<br>

All this math is very hard to understand, especially if you have a background in software engineering rather than<br>
statistics. Most of the stuff you will find on the internet assumes that you know your statistics, which you probably don't.</p>

<p>In this series I will invite you along on my personal AI trip along some very cool algorithms and seriously hard topics.<br>
I will explain them as simple as I can so you too can start to use machine learning and deep learning in your daily work.</p>
<p>In this series I will address the following topics:</p>
<ul>
<li><a href="https://fizzylogic.nl/2017/05/26/Adventures-in-deep-learning-Part-1-Start-with-the-basics/">What is a gradient descent algorithm?</a></li>
<li><a href="https://fizzylogic.nl/2017/07/21/Adventures-in-AI-Part-2-Which-algorithm-should-I-use/">Which algorithm should I use for what?</a></li>
<li><a href="https://fizzylogic.nl/2018/01/22/adventures-in-ai-part-3-how-do-i-know-my-ml-model-is-any-good/">How do I know whether my ML model is any good?</a></li>
<li>What exactly is a neural network and why should I care?</li>
<li>I don't think I have enough data, what can I do?</li>
</ul>
<p>I will add more topics in the next months as we go along.</p>
<h2 id="introduction">Introduction</h2>
<p>One of the hardest things in machine learning I've found is how the computer actually learns when you apply a machine learning algorithm.<br>
There are gradient descent algorithms being thrown around like there's no tomorrow, but what are they?</p>
<p>In this post I will explain what a gradient descent algorithm is, by starting with a basic explanation of linear regression<br>
and then slowly working up to the gradient descent algorithm and what it does in relation to the linear regression algorithm.</p>
<h2 id="defineamodel">Define a model</h2>
<p>Most of the time we can define the output of a computer algorithm by implementing business rules for our problem space.<br>
These business rules include formulas and conditions under which these formulas work. However, sometimes that doesn't solve<br>
the problem. This is the case when we don't know the exact formula that correctly describes the solution for a problem.</p>
<p>For example, if you want to predict the price of a house you could define a formula yourself. But it will most likely<br>
not be very useful. That's because the price of a house is influenced by a lot of factors. Also, there's a hidden relationship between<br>
all of these factors that ultimately determine the price of a house.</p>
<p>The only way to make a sensible prediction is by letting the computer train itself to find the hidden relationship between features.<br>
Instead of defining the complete formula manually you define a model that the computer then can train.</p>
<p>To predict the price of a house you can define a function that takes in the features of a house and predicts a price by multiplying the values<br>
for the features with a set of weights that simulate the relationship between the features.</p>
<p>$$\hat{y}=w_1x_1+w_2x_2+w_3x_3+...+w_nx_n$$</p>
<p>$w_1...w_n1$ are unknown in this case since we're searching for the hidden relationship between the various variables.<br>
We're going to optimize the weights in such a way that the difference between our predictions and the actual price of a house is minimal as possible.</p>
<p>Typically when you want to model something like the predicted price of a house you use a model called linear regression.<br>
Linear regression is defined as a function of the form</p>
<p>$$y = b+wx$$</p>
<p>This can get more complicated, but for this post I will stick to the simple form. The variable x we know, this is the input.<br>
The variable y is the output we want to predict. The variables $b$ and $w$ are unknown. Typically we call the variable $b$ the bias<br>
and the variable $w$ the weight of the input.</p>
<h2 id="defineanobjective">Define an objective</h2>
<p>In order to find the ideal weight and bias we have to first define an objective for the algorithm. The objective is a function that calculates<br>
the error rate. Basically, how far off are we with a given set of weights. The goal is to minimize the output of this function.</p>
<p>For our function we want to know the difference between the real output and the predicted output.<br>
We want to use the average of these errors so that we learn how far off we are in general. So we could define the objective function (or loss function)<br>
as follows:</p>
<p>$$error=\frac{1}{N}\sum_{i=1}^Ny_i-\hat{y_i}$$</p>
<p>The variable $\hat{y}$ is the predicted price, the variable $y$ is the actual price of the house. We sum all the differences and multiply them by $\frac{1}{N}$<br>
to calculate the average error.</p>
<p>This looks okay, but there's a problem. When there's one input that predicted with an error of 5 and another with an error of -5 you get an error<br>
rate of exactly zero. Thus our weights are optimal, but that's not correct as you can see.</p>
<p>To account for this problem you can square the error values. This causes to all the price difference to be positive. It also punishes the computer<br>
for large differences between predictions and actual values.</p>
<p>$$error=\frac{1}{N}\sum_{i=1}^N(y_i-\hat{y_i})^2$$</p>
<p><strong>Note:</strong> Although we went over the loss function in great detail, you will often use standard loss functions that others have come up with before.<br>
The trick is to know which loss function to use. In the next posts in this series I will show you some more loss functions that are typically<br>
used.</p>
<h2 id="optimizingtheweights">Optimizing the weights</h2>
<p>The goal for the computer is to make the error rate as small as possible. You could argue that you can put in random numbers again and again to find the<br>
right solution since there's no way you know the actual values. But that would take an infinite number of hours. That's because you cannot know when you've<br>
reached the optimal value for the weights.</p>
<p>There is however a relationship between the value of the loss function and the weights. When you draw a graph of the weights related to the<br>
output of the loss function you will see that it has a typical shape.</p>
<p><img src="/content/images/2017/07/error_rate.png" alt="Error rate plot"></p>
<p>This gave the mathmeticians that came up with gradient descent an idea. The error rate is the function of the weights in relationship to the<br>
inputs that we know. You could, instead of random guessing use derived functions to find the rate of change to the weights at each point in the<br>
chart.</p>
<p>When you know the gradient of the weights you can iteratively modify them so that with every iteration you move closer to their optimal value.</p>
<p>Now that all sounds great, but how does it work? For this I need to introduce a bit more math than before.<br>
The first step in calculating the gradient is to create a partially derived function for each variable that we want the gradient for.</p>
<p>We need to find the gradient for a specific variable in our loss function. So instead of creating a regular derived function that you normally<br>
use to find a gradient in a line, we need to derive the loss function for the weights that we want the gradient of.</p>
<p>To keep things simple, let's try to find the gradients for the bias and weight in the following loss function:</p>
<p>$$error=\frac{1}{N}\sum_{i=1}^N{(y-(b + wx))^2}$$</p>
<p><strong>Note:</strong> I have replaced the predicted value $\hat{y}$ for the formula that calculates this value.</p>
<p>You can come up with the following partially derived functions:</p>
<p>$$\frac{\partial}{\partial{w}}=\frac{2}{N}\sum_{i=1}^N-x_i(y_i-(b + wx_i))$$</p>
<p>$$\frac{\partial}{\partial{b}}=\frac{2}{N}\sum_{i=1}^N-(y_i-(b + wx_i))$$</p>
<p>Let's go over the equations in more detail so you know what is going on. A partially derived function only calculates the gradient for one<br>
variable at a time. The rest is left as is. You can recognize this by the division at the left hand side of the equation. The denominator tells you<br>
it's a derived function. The divisor then says it's a derived function for a particular variable. The right hand side of the equation is the derived<br>
function.</p>
<p><strong>Note:</strong> I understand that if you don't have a background in math the above formulas are magic.<br>
Manually creating derived functions can be a fun excercise, but I wouldn't recommend it. Instead, let the computer<br>
fix this problem. Tools like tensorflow, Microsoft Cognitive Toolkit and Keras automatically create derived functions<br>
for loss functions you provide them. Much better right?</p>
<p>When you apply the derived functions in code , you will get a small piece of code that can iteratively determine the correct weights.<br>
Let's look at some code for this:</p>
<pre><code class="language-python">def step_gradient(x, y, weight, bias, learning_rate):
    temp_weight = 0
    temp_bias = 0

    N = float(x.shape[0])

    for j in range(x.shape[0]):
        temp_bias += - (2 / N) * (y[j] - ((weight * x[j]) + bias))
        temp_weight += -(2 / N) * x[j] * (y[j] - ((weight * x[j]) + bias))

    new_weight = weight - (learning_rate * temp_weight)
    new_bias = bias - (learning_rate * temp_bias)

    return new_weight, new_bias

def gradient_descent(x, y, bias, weight, learning_rate, iterations):
for i in range(0, iterations):
new_weight, new_bias = step_gradient(x, y, weight, bias, learning_rate)

        weight = new_weight
        bias = new_bias

    return weight, bias

</code></pre>

<p>The gradient descent algorithm in this sample has two functions. First there's the <code>gradient_step</code> function<br>
and second there's the <code>gradient_descent</code> function. The <code>gradient_descent</code> function iteratively calls the<br>
<code>gradient_step</code> function with the current weights and inputs. The <code>gradient_step</code> function takes the original<br>
weights and inputs. It then calculates the gradients for all the points in the dataset <code>x</code> and uses these<br>
gradients to update the bias and weight.</p>
<p>By running this algorithm a number of times you will see that the weights decrease until they reach their optimal value.</p>
<p><img src="/content/images/2017/07/gradient_descent.png" alt="Gradient descent"></p>
<p>At first the the gradient is very steep, this means that we're learning fast. Near the end of the iterations you will notice that the gradient is not so steep anymore. This means we're near our goal. When it reaches the optimal value isn't something that you can know up front.</p>
<p>You have to decide for how long you want to gradient descent algorithm to run. Typically you run the algorithm for about 1000 to 10000 iterations to<br>
ensure that you've reached the optimum values.</p>
<h2 id="whatdoesthelearningratehavetodowiththisalgorithm">What does the learning rate have to do with this algorithm?</h2>
<p>You could argue that updating the gradient with the delta should get you there faster than updating it in small steps using the learning rate.<br>
Remember, we're walking a gradient. If you use big steps you will get down fast. But the line in the error rate chart also goes up after we've reached the<br>
optimum value. This is the point beyond which there's no use in updating the weights, since we're only getting worse.</p>
<p>A small learning rate prevents your optimization from overshooting its goal. However, if you make the learning rate too small you<br>
will not reach your goal in time. Typically you will have a learning rate between 0.01 and 0.001.</p>
<p>Balancing the learning rate is also something that the computer does not do for you. You have to experiment and find the right learning rate<br>
for the function you're trying to optimize.</p>
<h2 id="summary">Summary</h2>
<p>The gradient descent algorithm is method that uses the gradients of unknown variables to change them iteratively so that we have<br>
a guarantueed method of reaching the optimal values for a set of unknown variables in a function.</p>
<p>As you can imagine, machine learning involves mostly finding optimal values for unknown factors in equations.<br>
Because that is basically what you want the computer to find out when you want to predict something based on<br>
input that you've seen before.</p>
<p>The process of learning to predict an output, whether that is a class (positive, negative) for a set of inputs or a continuous value<br>
such as the predicted price of a house, it all works like this:</p>
<ol>
<li>Define a model</li>
<li>Define a loss function</li>
<li>Minimize the loss function using gradient descent</li>
</ol>
<p>In the next posts you will learn that this trick is used practically everywhere even in neural networks which are<br>
quite a bit harder than linear regression.</p>
<p>I hope you liked this post. Leave a comment if you have any questions or comments.</p>
<!--kg-card-end: markdown-->
