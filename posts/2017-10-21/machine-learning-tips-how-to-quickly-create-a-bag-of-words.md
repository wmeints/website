---
title: 'Machine learning tips: How to quickly generate a bag of words'
category: Machine Learning
datePublished: '2017-10-21'
dateCreated: '2017-10-20'
---
<!--kg-card-begin: markdown--><p>Natural language processing is all about text. But it doesn't use the text itself. You need vectors of numbers, for example a bag of words. This can be easily built with a dictionary and some for loops. But there is an easier way.</p>
<h2 id="nlpisaboutnumbers">NLP is about numbers</h2>
<p>For those who haven't done anything with natural language processing it may sound weird that when you want to classify a piece of text you need vectors of numbers to do so. This has to do with the fact that machine learning is a mathematical concept and not a linguistic concept.</p>
<p>You could of course parse the sentence by applying rules. But that is tedious work and much more imperfect as doing the same thing with a machine learning algorithm.</p>
<p>When you apply machine learning to text you're not really looking at words, you're trying to understand a pattern in the text. So in order to do that you need to express properties of the text as numbers. Like how often the words appear in a sentence, the position within that sentence or other properties that may proof useful to recognize patterns.</p>
<p>There are a couple of ways you can use to turn sentences into a representation suitable for machine learning:</p>
<ul>
<li>Bag of Words (BoW)</li>
<li>Global Vectors for Word Representation (GloVe)</li>
<li>Word2Vec</li>
</ul>
<p>Bag of Words uses word counts to create a kind of signature of the input text to classify. The other two methods use complex vector representations that use things like distance to other words to express a pattern.</p>
<h2 id="turntextintoabagofwords">Turn text into a bag of words</h2>
<p>The bag of words algorithm uses word counts to represent the input text for your machine learning algorithm. It works like this:</p>
<p>Create a bucket for each unique word you want represented (the vocabulary). Next go over the text and put a token in the right buckets for the words you encounter.</p>
<p>You can build this with plain python, but as I mentioned before it is not the most efficient method.</p>
<p>As with many things in IT, the problem has been solved before. The python package <code>scikit-learn</code> contains several tools for machine learning. Among them a set of so-called vectorizers.</p>
<pre><code class="language-python">from sklearn.feature_extraction.text import CountVectorizer

input_vectorizer = CountVectorizer(input='content')
input_vectorizer.fit([..., ...])
</code></pre>
<p>The sample above shows the <code>CountVectorizer</code> class. This class uses the bucketing principle. It assigns a bucket to every unique word when you call fit.</p>
<p>After you've trained the vectorizer you can transform texts</p>
<pre><code class="language-python">vector_output = input_vectorizer.transform([...])
</code></pre>
<p>The <code>transform</code> method accepts a list of strings you want converted into vectors. The output is a matrix containing the results, one sentence per row.</p>
<h2 id="watchoutfortheinputsetting">Watch out for the input setting</h2>
<p>The CountVectorizer can be initialized with three values for the input argument: <em>file</em>, <em>input</em> and <em>filename</em>. This has an effect on how the fit and transform calls work. For example, when you use <em>filename</em> as the <code>input</code> argument you are required to specify filenames for both <code>fit</code> and <code>transform</code>. I've found that this limits the usability somewhat.</p>
<p>The <em>filename</em> input setting is useful for training, but not for actually using the vectorizer. So I fixed the problem by initializing the vectorizer with the input setting <em>content</em> and then using the function below to specify the input for the call to the <code>fit</code> method.</p>
<pre><code class="language-python">def input_documents(filenames):
    for filename in filenames:
        with open(filename, 'r') as input_file:
            while True:
                line = input_file.readline()
    
                if len(line) == 0:
                    break
    
                yield line
</code></pre>
<p>This results in the following training logic:</p>
<pre><code class="language-python">from sklearn.feature_extraction.text import CountVectorizer

input_vectorizer = CountVectorizer(input='content')
input_vectorizer.fit(input_documents(['data/file1.txt', 'data/file2.txt']))
</code></pre>
<p>This frees you from having to write single user sentences to file before you can transform them.</p>
<h2 id="finalthoughts">Final thoughts</h2>
<p>The vectorizers make life much easier. Don't forget to checkout the documentation of <a href="http://scikit-learn.org/stable/documentation.html">scikit-learn</a> to discover more!</p>
<p>Cheers!</p>
<!--kg-card-end: markdown-->
