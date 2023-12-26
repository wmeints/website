---
title: 'Adventures in AI Part 2: Which algorithm should I use?'
category: Machine Learning
datePublished: '2017-07-21'
dateCreated: '2017-07-31'
---
<!--kg-card-begin: markdown--><p>Choosing the right algorithm for your machine learning problem can be quite hard. I've had numerous questions about it during the machine learning course. Also I've seen many people struggle to find more information about it on the internet. There are of course plenty cheat sheets around. But all of them seem to be focused on the tools that the company behind the cheatsheet delivers.</p>
<p>In this second post of the series &quot;Adventures in AI&quot; I will show you how to pick the right algorithm for your machine learning problem.<br>
To make things easier on you I've put together a mind map with a comprehensive set of machine learning algorithms which I will update regularly.</p>
<p>To find out more about the series, check out the first post <a href="https://fizzylogic.nl/2017/05/26/adventures-in-ai-part-1-what-is-a-gradient-descent-algorithm/">Adventures in AI part 1 - What is a gradient descent algorithm?</a> for a table of contents.</p>
<h2 id="howtopickanalgorithm">How to pick an algorithm</h2>
<p>There are many cheatsheets available online. None of them very complete though, because they are focused on what a single product offers in terms of machine learning algorithms.<br>
After struggling myself I've decided to make my own map. In this map you can find the different kinds of algorithms that you can use for different problems.<br>
You start in the middle and follow the lines outwards towards the algorithms. I've added notes to various algorithms with tips and tricks for that algorithm.</p>
<iframe width="100%" height="400" frameborder="0" src="https://www.mindmeister.com/maps/public_map_shell/927441936/start?width=600&height=400&z=auto" scrolling="no" style="overflow: hidden; margin-bottom: 5px;">Your browser is not able to display frames. Please visit <a href="https://www.mindmeister.com/927441936/start" target="_blank">Start</a> on MindMeister.</iframe>
<p>The map is based on a set of cheatsheets from others that I've found on the internet:</p>
<ul>
<li>Scikit: <a href="http://scikit-learn.org/stable/tutorial/machine_learning_map/index.html">http://scikit-learn.org/stable/tutorial/machine_learning_map/index.html</a></li>
<li>Azure Machine Learning: <a href="https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-algorithm-cheat-sheet">https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-algorithm-cheat-sheet</a></li>
<li>SAS: <a href="http://blogs.sas.com/content/subconsciousmusings/2017/04/12/machine-learning-algorithm-use/">http://blogs.sas.com/content/subconsciousmusings/2017/04/12/machine-learning-algorithm-use/</a></li>
</ul>
<p>I've tried really hard to do justice to the hard work the people behind these maps have put into making their maps.<br>
It could be that sometimes I've put an algorithm in the wrong spot. So if you have any suggestions, please feel free to drop me a note.</p>
<h2 id="tipsandtricks">Tips and tricks</h2>
<p>Choosing an algorithm based on the map is a little easier than just picking at random, but you're not done yet.<br>
There are many algorithms for the same problem. That means that you need to follow a particular strategy to pick the right one.</p>
<p>For example, you want to predict a quantity. You may be tempted to go for accuracy, but I wouldn't do that myself. I would go for the fastest solution first.<br>
Run your data through the algorithm and train your model. Next evaluate how well it performs. Is it good enough? Then stop mucking about with it and go for it.</p>
<p>Only when you see that the fast algorithm isn't good enough you should go for the other algorithms.</p>
<p>If you really feel inclined for a round of benchmarking you could of course pick a number of algorithms from the same category and train models with them and evaluate those.<br>
This in the end usually gives the most accurate results. But it can be quite time consuming.</p>
<h2 id="wanttolearnmore">Want to learn more?</h2>
<p>The map is useful for picking the right algorithm for your problem. It is also great if you haven't got much experience with machine learning.<br>
Pick an algorithm from the map, find an open dataset and start experimenting. You will get a much better feel for the algorithm if you've tried it.</p>
<p>Enjoy!</p>
<!--kg-card-end: markdown-->
