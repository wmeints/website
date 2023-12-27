---
title: "Machine learning ideas: Anomaly detection"
category: Machine Learning
datePublished: "2017-03-23"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>Machine Learning ideas: Anomaly detection using K-Means</p>
<p>From time to time I come across Machine Learning ideas.  As I come across them I like to explain them to you my reader and encourage you to try them out.<br>
In this post you will learn a method to detect abnormal transactions. I will show you how you can find weird transactions on your own bank account.</p>
<!-- more -->
<h2 id="kmeansasamethodtofindanomalies">K-Means as a method to find anomalies</h2>
<p>There are many ways to find anomalies in a dataset. One of which is K-Means clustering.</p>
<p>K-Means clustering helps to structure data. You create clusters of items that are similar.</p>
<p>You provide the number of clusters you want the items to group by. Next, the computer tries to move items together based on how close they are to other items.</p>
<p>After the computer made the clusters you asked for you have a model that you can use to detect anomalies.</p>
<p>When you create a Machine Learning model based on K-Means Clustering, you get groups of data. Some groups will contain many items, others less.</p>
<p>You can find anomalies in the small clusters in the model.</p>
<p>As a rule of thumb, you can find the anomalies in clusters that contain less than 5% of the population.</p>
<p>A more exact way to detect anomalies through is to use interquartile distance. It works like this:</p>
<p>Calculate the median for the cluster sizes in the model. Next calculate Q1, which is the median of the first half (left of the median). After that calculate Q3, which is median of the second half (right of the median). Now calculate the distance between Q3 and Q1. Any values outside of Q1 - 1.5<em>IQR or Q3 + 1.5</em>IQR are anomalies.</p>
<h2 id="howdoiapplythistomybankaccount">How do I apply this to my bank account?</h2>
<p>With the knowledge from the previous section you can detect anomalies on in your data.</p>
<p>To do this, take the transactions on your bank account. Apply K-Means to cluster them based on the amount transferred with each transaction.</p>
<p>Next, take the interquartile distance and determine the boundaries beyond which transactions are abnormal. In the case of bank transactions you will want to use Q1 - 1.5*IQR.</p>
<p>You will want to leave the largest groups of transactions alone. These groups, although beyond Q3 + 1.5*IQR are normal. Here's why: The largest group will contain the average transactions. And average is good in this case.</p>
<p>When you decide to use K-Means clustering there's one thing you must know. Training the model is the hardest. But after you have a model it is easy to detect anomalies in new transactions. You can take a single transaction and try to place that transaction in one of the clusters. If the cluster is within the range x &lt; Q1 - 1.5*IQR then the transaction is abnormal.</p>
<p>The fact that you can stream data and run the clustering operation on an item per item basis is useful. You can, for example, send an alert when a weird transaction comes along as it happens. Rather than letting the user know after it's too late.</p>
<p>Tools to help you build this idea</p>
<p>Now that you know how to detect anomalies in your bank transactions, let's look at some tools to build it.</p>
<p>You can use any tool you like, such as Apache Spark, AzureML or Apache Mahout. These tools offer standard implementations of K-Means clustering.</p>
<p>The most important choice is how you want to use the model you trained.</p>
<p>If you know Scala then Apache Spark is a good option. If you don't know how to program, then you're better off building the clustering model in AzureML. With zero programming required AzureML is the easiest way to get you going fast.</p>
<h2 id="somefinaltips">Some final tips</h2>
<p>I've showed you what K-Means can do for you to detect anomalies on your bank account. Here are a few final tips to get even more out of this machine learning idea:</p>
<ul>
<li>Fraudulent transactions are not always about large sums of money. Think about this and spend time exploring the data. See if you can find other ways in which a transaction could be wrong.</li>
<li>Remember, the model you're training will get it wrong. Spend some time to tweak the value for the point beyond which a transaction is considered wrong.</li>
</ul>
<p>Happy machine learning!</p>
<!--kg-card-end: markdown-->
