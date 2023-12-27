---
title: >-
  Add a search function to your application with ElasticSearch in under 10
  minutes
category: Elastic Search
datePublished: "2015-09-12"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>I personally think that one of the most important, yet underrated features of any<br>

enterprise web application is search. Most people think about it, but then go ahead<br>
and use things like SQL full-text search or some other form of search that isn't<br>
really a search engine.</p>

<p>This is sad, since there's so much more to get for your users than a complex search<br>
form that requires them to enter data in 5 fields and get nothing in return.</p>
<p>I think that if you add proper search you can easily shave of minutes of any workflow<br>
in your application, because people have a better time finding stuff in your application.</p>
<p>In this post I will talk you through the process of installing ElasticSearch and<br>
getting your first data indexed so it can be searched for. As a bonus, you can find<br>
links to get even more out of your search functionality, so here it goes.</p>
<!-- more -->
<h2 id="gettingthingsreadyforsearch">Getting things ready for search</h2>
<p>Before you can start to index data and search for it, you need to have<br>
ElasticSearch installed. You can download ElasticSearch from the their website.<br>
Extract it somewhere on disk to get started.</p>
<p>Before you fire up ElasticSearch I recommend that you perform one edit in the<br>
configuration file (config/ElasticSearch.yml). Please, pretty please, change the<br>
cluster.name setting to something else then 'ElasticSearch'.</p>
<p>Why you say? Well, because if someone else is also running his cluster without<br>
proper configuration in the same network, you end up joining the same cluster causing<br>
all sorts of interesting problems for you and the other person.</p>
<p>Afer you have properly configured ElasticSearch, fire it up by executing <code>bin/ElasticSearch</code>.</p>
<h2 id="indexingdatainyourwebsite">Indexing data in your website</h2>
<p>With ElasticSearch up and running you can move on to indexing data in your website.<br>
This largely depends on what kind of data, but the general idea is like this:</p>
<p>When someone creates or updates data you need to index that data in ElasticSearch.<br>
For this you need to modify your controllers to invoke the indexing operation.</p>
<p>Before you can do that though, you need to define how your data is indexed.<br>
This is done by sending a mapping specification to the ElasticSearch server.</p>
<p>You can skip this part, but I suggest you take a minute and define the mapping<br>
for your index. This will save you a headache later. The mapping determines how<br>
well you can find the data later.</p>
<p>For this post I'm demonstrating how you could build a search function for a weblog,<br>
so the mapping request will look like this:</p>
<pre><code>POST /weblog
{
    &quot;mappings&quot;: {
        &quot;post&quot;: {
            &quot;properties&quot;: {
                &quot;title&quot;: {
                    &quot;type&quot;: &quot;string&quot;,
                    &quot;index&quot;: &quot;analyzed&quot;
                },
                &quot;body&quot;: {
                    &quot;type&quot;: &quot;string&quot;,
                    &quot;index&quot;: &quot;analyzed&quot;
                },
                &quot;tags&quot;: {
                    &quot;type&quot;: &quot;string&quot;,
                    &quot;index&quot;: &quot;not_analyzed&quot;
                }
            }
        }
    }
}
</code></pre>
<p>This request will create the index weblog and a type within that index with the name post.<br>
The post will have a title,body and tags. Title and body are analyzed, while the tags are not.<br>
Analyzing a field means, you can enter a search query for that field and the search engine<br>
will find hits even if the text doesn't match 100%. When it does find a match that isn't<br>
100%, it will sort the results according to how well they match to your search query.</p>
<p>For tags in this case, I choose not to analyze them, so that I can match them exactly. This<br>
is useful when you want to get all posts from the search index for a specific tag.</p>
<p>After defining a mapping you can start to write the indexing code.<br>
To do this you can use the <code>Nest</code> Nuget package. To install this package<br>
execute the following command:</p>
<pre><code class="language-bash">dnu install Nest
</code></pre>
<p>The Nest package is the official API offered by Elastic to use ElasticSearch<br>
from C#. This package easy to use and provides most of the basic stuff you need<br>
to talk to ElasticSearch. If, in the odd case, something isn't available through<br>
the Nest library you can always drop back to the ElasticSearch.NET library on which<br>
the Nest library is based. So in short, the Nest library is the library to have<br>
when working with ElasticSearch from C#.</p>
<p>With the package installed you can go ahead and build the indexing.<br>
The indexing code is rather simple, but it's worth some explaining.</p>
<pre><code class="language-csharp">using System;
using System.Threading.Tasks;
using Weblog.Models;
using Nest;
using Polly;

namespace Weblog.Services
{
public class PostIndexer: IPostIndexer
{
private ElasticClient \_client;

        public PostIndexer()
        {
            var node = new Uri(&quot;http://localhost:9200&quot;);
            var settings = new ConnectionSettings(node);

            _client = new ElasticClient(settings);
        }

        public async Task IndexAsync(Post post)
        {
            // Indexes the content in ElasticSearch
            // in the weblog index. Uses the post type
            // mapping defined earlier.
            await _client.IndexAsync(post,
                (indexSelector) =&gt; indexSelector
                    .Index(&quot;weblog&quot;).Type(&quot;post&quot;));
        }
    }

}
</code></pre>

<p>To talk to ElasticSearch you have to create a new instance of the ElasticClient class.<br>
This class requires a set of connection settings. These settings define the server<br>
you want to connect to the server and some basic options for communicating with the server.</p>
<p>With the ElasticClient instantiated you can start to index information. For this<br>
you can use the method IndexAsync on the client. I've wrapped this in a public method<br>
on the indexer class to make access to this method more straightforward.</p>
<p>In the IndexAsync method call you specify what should be indexed and how. The first<br>
parameter is the data to be indexed. The second parameter tells the client that it should<br>
index the content in the Weblog index. The type specified here maps directly on the the<br>
mapping specified earlier.</p>
<p>You can specify a lot more when indexing content, but the index and type is all that you<br>
need for basic indexing operations. Important to remember when trying to index content<br>
is to make sure that you have the index created and type mapping configured ahead of time.<br>
This will save you from all sorts of weird search problems later. Also, make sure that the<br>
object you are indexing can be serialized as JSON. As this is what the ElasticClient is<br>
doing when you invoke IndexAsync.</p>
<h2 id="searchingfordataonyourwebsite">Searching for data on your website</h2>
<p>With the data indexed you can move on to the search functionality. I think everyone<br>
that has done ASP.NET development before is capable of producing a working controller,<br>
so let's focus on building the search functionality itself.</p>
<p>The idea is to allow the user to search for content using a set of terms he/she entered<br>
in the search box on the page. Search results should be returned in a paged manner, so<br>
that users can browse through the results. Not using a paged resultset will cause your<br>
website to die, so it's not only something you do to make things easier to understand<br>
for the user. Retrieving results in a paged manner keeps the performance high as well.</p>
<p>The search code looks like this:</p>
<pre><code class="language-csharp">public class PostSearcher: IPostSearcher
{
	private static Policy CircuitBreaker = Policy
		.Handle&lt;Exception&gt;()
		.CircuitBreakerAsync(3, TimeSpan.FromSeconds(60));

    private ElasticClient _client;

    public PostSearcher()
    {
    	var node = new Uri(&quot;http://localhost:9200&quot;);
    	var settings = new ConnectionSettings(node);

    	_client = new ElasticClient(settings);
    }

    public async Task&lt;PagedResult&lt;IndexedPost&gt;&gt; FindPostsAsync(string query, int pageIndex)
    {
    	// Use a circuit breaker to make the indexer operation more resistent against problems.
    	// When this operation fails three times, we stop for a minute before trying again.
    	return await CircuitBreaker.ExecuteAsync(async () =&gt; {
    		// Important: For easy search, stick to the query_string operator.
    		// This will automatically convert your query string into terms and search for them.
    		// Doing this manually is possible, but a more difficult to do.
    		var results = await _client.SearchAsync&lt;IndexedPost&gt;(searchRequest =&gt; searchRequest

.Index(&quot;weblog&quot;)
.Type(&quot;post&quot;)
.From(pageIndex \* 30)
.Take(30)
.Query(querySpec =&gt; querySpec.QueryString(
queryString =&gt; queryString.DefaultField(post =&gt; post.Body).Query(query))));

    		return new PagedResult&lt;IndexedPost&gt; {
    			Items = results.Documents,
    			PageSize = 30,
    			PageIndex = pageIndex,
    			Total = results.Total
    		};
    	});

    }

}
</code></pre>

<p>Again you will start out with a basic ElasticClient setup. After that you can start<br>
to search for content using the SearchAsync method. This method accepts a generic argument<br>
which tells the ElasticClient class how the search results <code>_source</code> property should be deserialized. When you search for content in ElasticSearch it will return a set of basic<br>
properties for a document and a <code>_source</code> property. This <code>_source</code> property contains<br>
the data that was serialized in the IndexAsync method earlier. So a top tip: Use the same<br>
type in the SearchAsync method as you used in the IndexAsync method.</p>
<p>The SearchAsync method needs to be configured with an Index and type settings, which<br>
is done by invoking the corresponding methods.</p>
<p>To page the results you invoke the From method with the offset in the resultset to<br>
get. After that invoke the Take method with the amount of results you want to get.<br>
Finally, you need to specify the search query.</p>
<p>The search query is the <code>query_string</code> operator. This search operator takes a<br>
string of text and a default field. ElasticSearch will automatically convert<br>
your search string using a default analyzer into terms that can be matched.</p>
<p>The query_string operator is one of the easiest query operators to use,<br>
it is also the most limited operator. I would invest in writing proper query parsing<br>
logic if you're going to use ElasticSearch for something more than just basic search.<br>
But if you want to build a quick search function, this is the way to go.</p>
<p>I've added the PagedResult conversion in this method to make the search results<br>
easier to render on the page. With this conversion added you're done integrating<br>
search in your website.</p>
<h2 id="finalthoughts">Final thoughts</h2>
<p>Adding search is so simple, I am pretty sure that most developers with a little skill<br>
in C# are going to be able to get this running properly.</p>
<p>If you're interested in more information I can recommend<br>
<a href="https://www.elastic.co/guide/en/elasticsearch/guide/current/index.html">the ElasticSearch book</a><br>
on the Elastic website.</p>
<p>More important though: Experiment, try it out. You will love it!</p>
<!--kg-card-end: markdown-->
