---
title: "A quick lap around Algorithmia, the online algorithm marketplace"
category: Machine Learning
datePublished: "2016-04-20"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>elling algorithms is becoming a thing on the internet. A number of big companies<br>

have started to sell access to their algorithms. It's an interesting business model.<br>
If you haven't got the smarts to implement an intelligent algorithm yourself, then buying<br>
one from Microsoft or Google looks like a really smart plan.</p>

<p>I'm not going to say that you will end up with a great solution. You still need to spend<br>
time to tune and integrate everything into a working solution, but it's a great start.</p>
<p>Talking about selling algorithms, a while back I found Algorithmia, a website which<br>
provides an online marketplace for people to buy and sell algorithms of the kind that<br>
Microsoft and Google are providing through their own cloud.</p>
<p>It is an interesting service, which deserves another look.</p>
<!-- more -->
<h2 id="whatisalgorithmia">What is algorithmia?</h2>
<p>According to the website Algorithmia allows you to implement any algorithm<br>
in 5 lines of code (Approximately of course).</p>
<blockquote>
<p>Bring [algorithm] to your app with less than 5 lines of code.</p>
</blockquote>
<p>Algorithmia provides hosting for people to publish their algorithms. All algorithms<br>
implement the same interface so that you can access them through the algorithmia API client.</p>
<p>To get started you create a new account on algorithmia, which gives you access to the algorithms.<br>
You get an API key from the website which you can use to call the various algorithms available.<br>
The next step is to write a few lines of code to invoke the algorithm of your choice:</p>
<pre><code class="language-java">import com.algorithmia.*;
import com.algorithmia.algo.*;

String input = &quot;\&quot;YOUR_NAME\&quot;&quot;;
AlgorithmiaClient client = Algorithmia.client(&quot;YOUR_API_KEY&quot;);
Algorithm algo = client.algo(&quot;algo://demo/Hello/0.1.1&quot;);
AlgoResponse result = algo.pipeJson(input);
System.out.println(result.asJsonString());
</code></pre>

<p>This looks easy enough to get going. By the way, Java isn't the only language supported<br>
by the website. You can use Python, Scala, Javascript and many other languages.<br>
The Algorithmia client API is a wrapper around a HTTP POST call to the website.<br>
So if your framework supports HTTP (which all frameworks/programming environments do these days)<br>
then you are set to use Algorithmia.</p>
<p>Please be aware, algorithmia is not free. You have to pay for every call you make.<br>
You get 5K credits for free to get you started, but after that you have to pay.<br>
10K credits cost you 1 dollar.</p>
<p>You pay a minimum of one credit per call + 1 credit per second it takes for the call to complete.<br>
Which means that large volume applications that use slow algorithms are more expensive.</p>
<h2 id="whataboutpublishingalgorithmsonalgorithmia">What about publishing algorithms on Algorithmia?</h2>
<p>Of course a marketplace needs both buyers and sellers. You can publish your own algorithms on<br>
Algorithmia.</p>
<p>When you publish an algorithm on the website you can ask a royalty fee or provide access<br>
to your algorithm for free. The user has to pay the one credit fee to algorithmia, the royalties<br>
are for you to keep. The website pays you through paypal secure payout.</p>
<p>The fact that you can ask money for the algorithm you wrote makes it interesting for businesses.<br>
Don't expect to make a mountain of money though, because on average people ask about 2-4 credits<br>
in royalties. Which comes down to 0.0002 - 0.0004 cents per request. Not very interesting if your<br>
algorithm is used by only 5 people to 10 people once a week.</p>
<p>However if you write a good algorithm, which is used by 100 applications and receives about 2.5 milion<br>
calls per month then it becomes interesting. There are algorithms on the marketplace that generate an interesting<br>
amount of traffic to them.</p>
<h2 id="takingacloserlookhowtopublishanalgorithm">Taking a closer look, how to publish an algorithm</h2>
<p>So how does this work in practice? When you want to publish an algorithm, you select the <code>Add algorithm</code><br>
button on the profile dropdown. Next you give the algorithm a name and enter some other metadata.</p>
<p><img src="/images/2016-04-20/algorithmia-create-algorithm.PNG" alt="Create a new algorithm on Algorithmia"></p>
<p>When you click the create button you get an online IDE in which you can write your algorithm in one<br>
of the supported languages. Right now Scala, Java and Python are supported.</p>
<p>It is important to note that you can edit your algorithm in the online editor only!<br>
This means a couple of things:</p>
<p>If you have an existing algorithm, you will need to port it to Algorithmia.<br>
Not an easy task if your algorithm contains a few thousands lines of code.</p>
<p>Also, there's limited control over how and where your algorithm runs. To give you an idea why this is a problem:<br>
the autotagger algorithm in knowNow is optimized to run very fast, because we cache certain models we use.<br>
You have no way to control this behavior in Algorithmia, which leads to loss of performance.</p>
<p>Right now the online editor only supports a single file. In practice this means that when you want<br>
to write your algorithm in Java you need to work with inner classes. You cannot have multiple classes<br>
in a single Java file. In Scala and Python this becomes less of a problem, since both languages support<br>
multiple classes per file.</p>
<blockquote>
<p><strong>A quick heads up!</strong> It turns out that the editor does support multiple files.<br>
But it is sort of a hidden feature. There's a slight bulge on the left of the page. Click that to get the file<br>
explorer. I was told by Diego Oppenheimer from Algorithmia that the usability problem with the file explorer being fixed ASAP. So if you can't find it,<br>
don't worry you will in the near future!</p>
</blockquote>
<p><img src="/images/2016-04-20/algorithmia-edit-algorithm.PNG" alt="Edit your algorithm in the online editor"></p>
<p>Because you can only use one file, you will find that writing a more complex algorithm becomes rather hard.<br>
It's not very maintainable. The only solution left is to write a separate library, publish it on maven and<br>
use that from the Algorithmia editor instead through the dependencies.</p>
<p>Finally there's one other thing that I think is worth mentioning. If you use machine learning than you will<br>
find that algorithmia is even less friendly. The runtime does not scale to handle large volumes of data quickly.<br>
Yes you can train a model and store it in the data collection of the user, but, the bigger the data, the longer<br>
it will take. It's not like you have a Spark cluster available, so things will take a while.</p>
<h2 id="inshortthegoodthebadandtheugly">In short, the good, the bad and the ugly</h2>
<p>In conclusion, Algorithmia is a neat idea. There is a need for ready-made algorithms that you can<br>
buy and use within minutes. The website provides a great solution for users of algorithms.</p>
<p>The website does leave a lot to be desired for creators of algorithms. The editor basically sucks. Writing a complex algorithm on Algorithmia<br>
is a real pain since the editor forces you to write unmaintainable code. It's something I simply can't live with anymore in 2016.</p>
<p>I think it would be a lot better if they provided git repositories and an integrated build service. This<br>
enables developers to write more complex and better algorithms. Also, it would be great to have more control<br>
over how the algorithm runs within the runtime.</p>
<p>So should you use it? Yes, if you are searching for commonly available algorithms.<br>
I would hold off for now if you're a developer until they provide a better solution for editing algorithms.<br>
The team is working on GIT support, so the issue with writing algorithms will be solved. So keep calm and copy + paste.</p>
<h2 id="resources">Resources</h2>
<p>Want to try Algorithmia yourself? Here's a few useful links to get you started.</p>
<ul>
<li><a href="http://algorithmia.com">Official website</a></li>
<li><a href="https://algorithmia.com/getting-started">Getting started guide</a></li>
</ul>
<!--kg-card-end: markdown-->
