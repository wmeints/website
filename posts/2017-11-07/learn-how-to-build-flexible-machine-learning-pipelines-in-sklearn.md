---
title: Learn how to build flexible machine learning pipelines in scikit-learn
category: Machine Learning
datePublished: '2017-11-07'
dateCreated: '2017-11-06'
---
<!--kg-card-begin: markdown--><p>Setting up a machine learning algorithm involves more than the algorithm itself. You need to preprocess the data in order for it to fit the algorithm. It's this preprocessing pipeline that often requires a lot of work. Building a flexible pipeline is key. Here's how you can build it in python.</p>
<h2 id="scikitlearnaveryclevertoolkit">scikit-learn, a very clever toolkit</h2>
<p>There are many machine learning packages for Python. One of the is <a href="http://scikit-learn.org">scikit-learn</a> otherwise known as sklearn on pip. This toolkit contains many machine learning algorithms and preprocessing tools.</p>
<p>sklearn is the goto toolkit when you've got something to do with machine learning. It contains a lot of useful things like:</p>
<ul>
<li>Feature extraction tools for turning raw data into features that can be learned from.</li>
<li>Preprocessing tools to clean up data or enrich it with additional information.</li>
<li>Supervised machine learning algorithms to predict values or classify data.</li>
<li>Unsupervised machine learning algorithms to structure data and find patterns.</li>
<li>Pipelines to combine the various tools together into a single piece of code.</li>
</ul>
<p>All of these tools are great for building machine learning applications. But in this post I want to spend some time specifically on the pipeline.</p>
<h2 id="whatisapipeline">What is a pipeline?</h2>
<p>A pipeline in sklearn is a set of chained algorithms to extract features, preprocess them and then train or use a machine learning algorithm.</p>
<p>This is how you create a pipeline in sklearn:</p>
<pre><code class="language-python">from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier
from sklearn.feature_extraction.text import CountVectorizer

pipeline = Pipeline(steps=[
  ('vectorize', CountVectorizer()),
  ('classify', DecisionTreeClassifier())
])
</code></pre>
<p>Each pipeline has a number of steps, which is defined as a list of tuples. The first element in the tuple is the name of the step in the pipeline. The second element of the tuple is the transformer.</p>
<p>The final step in the pipeline is the estimator. The estimator can be a classifier, regression algorithm, a neural network or even some unsupervised algorithm.</p>
<p>To train the estimator at the end of the pipeline you have to call the method fit on the pipeline and provide the data to train on.</p>
<pre><code class="language-python">raw_features = ['Hello world', 'Machine learning is awesome']
raw_labels = [0, 1]

pipeline.fit(raw_features, raw_labels)
</code></pre>
<p>Because you're using a pipeline you can put in raw data, which gets preprocessed automatically by the pipeline before running it through the estimator for training.</p>
<p>When you've trained the estimator in the pipeline you can use it to predict an outcome through the <code>predict</code> method.</p>
<pre><code class="language-python">sample_sentence = ['Hi world']

outcome = pipeline.predict(sample_sentence)
</code></pre>
<p>When predicting an outcome the pipeline preprocesses the data before running it through the estimator to predict the outcome.</p>
<p>That's the power of using a pipeline. You don't have to worry about differences in preprocessing between training and prediction. It is automatically done for you.</p>
<h2 id="buildingyourowncustomtransforms">Building your own custom transforms</h2>
<p>All components in sklearn can be used in a pipeline. However, it can be that you've got something that you want to use in the preprocessing pipeline that isn't already there.</p>
<p>No problem, you can build your own pipeline components:</p>
<pre><code class="language-python">from sklearn.base import TransformerMixin

class MyCustomStep(TransformerMixin):
  def transform(X, **kwargs):
    pass
    
  def fit(X, y=None, **kwargs):
    return self
</code></pre>
<p>A pipeline component is defined as a <code>TransformerMixin</code> derived class with three important methods:</p>
<ul>
<li>fit - Uses the input data to train the transformer</li>
<li>transform - Takes the input features and transforms them</li>
</ul>
<p>The fit method is used to train the transformer. This method is used by components such as the <code>CountVectorizer</code> to setup the internal mappings for words to vector elmeents. It gets both the features and the expected output.</p>
<p>The transform method only gets the features that need to be transformed. It returns the transformed features.</p>
<p><strong>Note</strong> The transformers in the pipeline are not allowed to remove or add records to the input dataset. If you need such a feature you should build your own transformations outside the pipeline.</p>
<h2 id="domorewiththepipelineusinggridsearch">Do more with the pipeline using grid search</h2>
<p>The pipeline is a useful construction for building machine learning software. And with the custom components you can extend its functionality well beyond what's included in the sklearn package.</p>
<p>There's one more cool trick that I want to show you. You can use the pipeline to perform, what's called, a grid search. With a grid search algorithm you can let the computer automatically discover the optimum hyperparameters for your algorithm.</p>
<p>Hyperparameters are the parameters that you set before training a model. For example, the learning rate for a gradient descent algorithm or the number of neurons in a neural network layer.</p>
<p>With grid search you can specify several variations of these parameters and let the computer train models for these parameter sets to come up with the best options for your algorithm.</p>
<p>Here's what a grid search looks like in sklearn:</p>
<pre><code class="language-python">param_grid = [
    { 'classify__max_depth': [5,10,15,20] }
]

grid_search = GridSearchCV(pipeline, param_grid=param_grid)
grid_search.fit(features, labels)
</code></pre>
<p>First you need to define a set of parameters that you want to try out with the grid search. The parameters are defined as follows. You prefix each parameter with the name of the step in the pipeline. You can append two underscores and then name the parameter on the component you want to modify. Finally you add a list of values that you want to test.</p>
<p>Notice that the <code>param_grid</code> is a list of dictionaries. You can test more than one scenario with different parametersets if you want.</p>
<p>After you've define the parameters for the grid search you feed those together with the pipeline to a new instance of the <code>GridSearchCV</code> class.</p>
<p>When you call <code>fit</code> on <code>grid_search</code> it will kick off the search process. After this is done you can look at the results by retrieving the property <code>cv_results_</code> on the <code>grid_search</code> object.</p>
<p>The <code>cv_results_</code> property contains a dictionary with the following interesting members:</p>
<ul>
<li>rank_test_score - Contains the ranking for each model in the order that they were executed. The index of the model with rank 1 is the best model.</li>
<li>params - Contains the parameters used for each model in the order that they were executed. If you know the best model you can find the parameters for the pipeline at the same index.</li>
<li>mean_test_score - Contains the test scores for each model in the order that they were executed. You can take a look here to find out how well the models did.</li>
</ul>
<p>Please note that if you've build your own transformer components you need to implement one additional method to support the grid search algorithm:</p>
<pre><code class="language-python">from sklearn.base import TransformerMixin

class MyCustomStep(TransformerMixin):
  def transform(X, **kwargs):
    pass
    
  def fit(X, y=None, **kwargs):
    return self
    
  def get_params(**kwargs):
    return { }
</code></pre>
<p>The <code>get_params</code> method returns the trainable parameters for your pipeline component. If you have any parameters that you want to be modified by the grid search, this is the place to add them.</p>
<h2 id="conclusion">Conclusion</h2>
<p>I think you will agree with me that the grid search functionality is a nice addon and a must if you're trying to find ways to make your machine learning models better.</p>
<p>The pipeline in sklearn provides an important construction when it comes to using the machine learning algorithms from this package in an ergonomical fashion.</p>
<p>If you haven't done so you should definitely take a look at sklearn/scikit-learn. I can especially recommend the pipeline functionality since it makes building machine learning code a lot more straightforward.</p>
<!--kg-card-end: markdown-->
