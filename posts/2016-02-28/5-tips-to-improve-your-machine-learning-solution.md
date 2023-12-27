---
title: 5 tips to improve your machine learning solution
category: Machine Learning
datePublished: "2016-02-28"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>Last week I teached a group of colleagues about machine learning. The goal for<br>

the training was to remove the black box and learn more about what you can do<br>
with machine learning. We also covered some discussions that arise when you start<br>
to use machine learning.</p>

<p>There's a lot of things you need to think about when you start to apply machine<br>
learning. Although it's not impossibly hard, there's still a lot of stuff you need<br>
to think about.</p>
<p>In this post I will discuss 5 tips that can help to improve your machine learning<br>
solution.</p>
<!-- more -->
<h2 id="tip1visualizebeforeyoustart">Tip 1: Visualize before you start</h2>
<p>When you start to work on a new piece of software that uses machine learning<br>
you typically focus on the problem and a fitting algorithm to learn a model<br>
that will solve your problem.</p>
<p>It is pretty easy to get lost in finding the right algorithm and model for your<br>
problem.</p>
<p>It may sound easy: Use a binary classifier when you want you have a problem where you have to predict whether something is positive or negative.</p>
<p>But before you dive into training the classifier, consider the data. Visualize<br>
the data first and check what it looks like.</p>
<p>Is the data good enough to train a binary classifier with the algorithm you think<br>
that might be useful? Do you have enough data, questions like that are important.</p>
<p>Using the wrong data makes a model, that is essentially wrong even worse. So before you start to program, check your data!</p>
<h2 id="tip2usethesimplestmodelpossible">Tip 2: Use the simplest model possible</h2>
<p>When you have the right data and you know what you can do with it to build a<br>
model for your problem there's the challenge of picking a model that is<br>
simple, yet good enough to fit the problem you're trying to solve.</p>
<p>Almost every machine learning problem can be represented using a neural network,<br>
but it doesn't mean that you should do that. Neural networks are hard to train<br>
and maintain. Most of the time a simpler model is better.</p>
<p>So when you work on a machine learning, pick a model that is simple to understand<br>
and work with. But beware, don't make it too simple or you will be jumping to the<br>
wrong conclusions.</p>
<h2 id="tip3prefermultiplemodelsoveronebigmodel">Tip 3: Prefer multiple models over one big model</h2>
<p>A simple model is the best when you want to solve a problem. But sometimes you<br>
need a more complex model.</p>
<p>Some problems cannot be expressed in a single model. When you get to this point,<br>
you are still better off using simple models.</p>
<p>However, instead of one model, try to split the problem into multiple separate<br>
subproblems and use multiple models to build a solution for those problems.</p>
<p>Usually simpler models are easier to tune and when one model is wrong you can replace it with another model to improve the situation.</p>
<p>Problems in a solution with multiple machine learning algorithms are easier to<br>
isolate and solve, because there are less factors involved.</p>
<h2 id="tip4whenitcomestovalidationmathisgoodbutexperimentationisbetter">Tip 4: When it comes to validation math is good, but experimentation is better</h2>
<p>Validation of machine learning models is usually done by applying math. You can get quite far with this strategy. But it is not the end goal.</p>
<p>Make sure that when you have a model for your problem, you check the predictions of your model with real people.</p>
<p>Are you getting the results you expected to get? Are users of your solution happy with the predictions?</p>
<p>Math gives you a good sense of direction, but the final check should always be a human. It is too easy to get the outcome wrong even with a good validation method.</p>
<p>Because there's so many directions to go in with machine learning that at the beginning of the design process there's no real way to know if it's a good solution you are working on. The math can be quite right in this situation, but the users of your solution will be the only one that catches a wrong direction in the solution.</p>
<h2 id="tip5allmodelsarewrongbutsomeareuseful">Tip 5: All models are wrong, but some are useful</h2>
<p>Remember, all models are wrong, but some are useful. And because all models are wrong you can never be sure that your software is doing the right thing.</p>
<p>Make your model more useful. Spend some time to think about how wrong is acceptable for you. Sometimes, it's perfectly acceptable that your binary classifier has a high precision and low recall. Even if the theory says that you want a 50/50 balance between precision and recall.</p>
<p>Talk to your customer. Explain what the options are and what you think he/she should do. This will be the most important thing when you design a machine learning solution.</p>
<!--kg-card-end: markdown-->
