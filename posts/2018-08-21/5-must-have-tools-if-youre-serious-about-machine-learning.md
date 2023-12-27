---
title: 3 Must-have tools if you're serious about machine learning
category: Machine Learning
datePublished: "2018-08-21"
dateCreated: "2018-08-21"
---

<!--kg-card-begin: markdown--><p>When working on machine learning problems I find that productivity is sometimes somewhat low, because I have to spend a lot of time working on tedious bits that probably can be automated away. Over time I have found quite a few tools that help me get better results faster. Here's three of them.</p>
<h2 id="pandasprofiling">Pandas profiling</h2>
<p>Pandas is one of the most widely used libraries for loading and processing data in Python. It has a great set of features to perform various statistical operations on your data.</p>
<p>One of these methods is the <code>describe</code> method, which gives you a compact summary of your data on the terminal or inside your Python notebook.</p>
<p>This method is very basic, maybe a little too basic for anyone that's serious about machine learning.</p>
<p>There is an alternative, called Pandas profiling. This library generates a complete report for your dataset, which includes:</p>
<ul>
<li>Basic data type information (which columns contain what)</li>
<li>Descriptive statistics (mean, average, etc.)</li>
<li>Quantile statistics (tells you about how your data is distributed)</li>
<li>Histograms for your data (again, for visualizing distributions)</li>
<li>Correlations (Let's you see what's related)</li>
</ul>
<p>Using this library is simple:</p>
<pre><code class="language-python">import pandas as pd
import pandas_profiling

df = pd.read_csv('my_data.csv')
pandas_profiling.ProfileReport(df)
</code></pre>

<p>This outputs a bunch of HTML, containing all the information mentioned above.</p>
<p>For me, this tool saves a lot of time. Normally I spend quite a bit of time typing in all the commands to get the various statistics. Now I just need one to achieve the same results.</p>
<p>Download the tool here: <a href="https://github.com/pandas-profiling/pandas-profiling">https://github.com/pandas-profiling/pandas-profiling</a></p>
<h2 id="featuretools">FeatureTools</h2>
<p>Another thing that takes a lot of time when building a model is feature engineering. On an average project you will spend about 80% of your time extracting and transforming data into a proper machine learning dataset.</p>
<p>You can however reduce this time by quite a bit if you use the right tools for the job. One such tool is the <code>FeatureTools</code> library.</p>
<p>This tool automatically gathers up features from a bunch of tables and transforms these features into a proper machine learning dataset.</p>
<p>It works like this:</p>
<pre><code class="language-python">import featuretools as ft

entities = {
'customers': (customers_df, 'customer_id'),
'orders': (orders_df, 'order_id')
}

relationships = [
('customers','customer_id','orders','customer_id')
]

feature_matrix, feature_defs = ft.dfs(
entities=entities,
relationships=relationships,
target_entity='customers')
</code></pre>

<p>First we define the entities in our database, which in our case are customers and orders. Next we define how orders are related to customers. The customer is the parent entity (one) and orders is the child entity (many).</p>
<p>We then ask FeatureTools to build a dataset for us, where we choose customers as the target entity. This tells FeatureTools to produce a dataset with customer as the parent and engineer features from orders as observations related to each customer.</p>
<p>As you can see, FeatureTools is especially useful when you have a large database with many tables and you need to extract a machine learning dataset from that database. It also works great on temporal data.</p>
<p>The sample I've shown is rather basic, there's loads more you can do. You can specify exactly which feature engineering primitives the tool should use, such as sum, count, average, etc.</p>
<p>Please note that FeatureTools doesn't handle normalization, scaling and other operations that you would need to solve some of the common issues with data.</p>
<p>Still, it's a great tool that's quite extensible and saved me a lot of time.</p>
<p>You can download it here: <a href="https://www.featuretools.com/">https://www.featuretools.com/</a></p>
<h2 id="lime">LIME</h2>
<p>If you're an active machine learning engineer you may have noticed that more customers than ever ask how a model is coming to a specific decision. They no longer blindly trust the model.</p>
<p>This can be quite a challenge as most models are hard to explain to a customer. But there is a solution.</p>
<p>LIME (Local Interpretable Model Explainer) is a tool that allows you to explain a decision made by your classification model. This can either be a decision tree, random forest or even a neural network.</p>
<p>For example if you have a neural network that predicts a label for an image you can explain its functionality with the following code:</p>
<pre><code class="language-python">from lime.lime_image import LimeImageExplainer

explainer = LimeImageExplainer()

explanation = explainer.explain_instance(
image,
keras_model.predict,
top_labels=5,
hide_color=0
num_samples=1000)

from skimage.segmentationskimage import mark_boundaries

temp, mask = explanation.get_image_and_mask(
295,
positive_only=True,
num_features=5,
hide_rest=False)

plt.imshow(mark_boundaries(temp / 2 + 0.5, mask))
</code></pre>

<p>First we create a new explainer for our image classifier. Then we let it explain the classification for a specific image. This produces an explanation object that we can visualize.</p>
<p><img src="/content/images/2018/08/explainer.png" alt="Explainer output"></p>
<p>The visualization is done using matplotlib. Using the <code>mark_boundaries</code> method we can highlight the edges of the area that explains why our image was classified the way it is.</p>
<p>You can find more about LIME here: <a href="https://github.com/marcotcr/lime">https://github.com/marcotcr/lime</a></p>
<h2 id="giveashotandletmeknow">Give a shot and let me know!</h2>
<p>Python has such a wealth of tools that it is hard not to find a good package for your machine learning problem. Did you find the above list useful? Let me know!</p>
<!--kg-card-end: markdown-->
