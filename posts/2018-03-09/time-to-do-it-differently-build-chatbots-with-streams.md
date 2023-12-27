---
title: "Time to do it differently, build chatbots with streams"
category: Chatbots
datePublished: "2018-03-09"
dateCreated: "2018-03-09"
---

<!--kg-card-begin: markdown--><p>Currently when you want to build a chat bot in Microsoft Bot Builder you have to deal with the rather complicated dialog system. I really don't like it, but there isn't a very good alternative yet. I do think however that there are a few ways in which we can do a better job. For example, can you build a chatbot using streams and actors?</p>
<p>In this post I will show you how I made a chatbot library with Akka.NET that uses streams and actors to model the chatbot.</p>
<h2 id="whystreams">Why streams</h2>
<p>So why streams? When I look at chatbots, I think of an application that can send and receive messages. So initially, I built a chatbot that used the actor model to shape conversations.</p>
<p>Each conversation in this bot is an actor. In front of the conversation actor there's a dispatcher that routes incoming activities to the right conversation.</p>
<p>This idea works really well, but is it the best way? I don't know.</p>
<p>So I discussed my idea with the Bot Builder team at Microsoft and we came up with another idea. When you look at the problem of building a chatbot from a different perspective you could conclude it is a stream of activities towards the chatbot that results in a stream of activities flowing back to the user.</p>
<p>Which works best is up for debate, but I had to try it.</p>
<h2 id="meetgadget">Meet Gadget</h2>
<p>Your bot framework isn't any good if it doesn't have a good name. Meet Gadget, the bot framework that allows you to build conversations as streams.</p>
<p><img src="/content/images/2018/03/architecture-1.png" alt="Architecture"></p>
<p>There are three layers to this:</p>
<ul>
<li>At the bottom there's the dialog stream. The user provides the flows, Gadget links a source (the incoming activity) and a sink (the target to send the outgoing replies to).</li>
<li>In the middle there's the stream adapter. This connects the ASP.NET Core middleware to the stream and the sink to the bot connector client.</li>
<li>The top layer is formed by the ASP.NET Core middleware, that accepts HTTP requests containing incoming activity data coming from the bot builder channel. It also contains the bot connector client from the Bot Builder SDK to send outgoing activities over the bot builder channel.</li>
</ul>
<p>Gadget is based on the Bot Builder SDK v4, which currently is in alpha stage. This new version of the Bot Builder SDK is quite different. You can now choose to use only the transport layer of the Bot Builder SDK. This provides a schema for the activities and other data sent/received by your bot. Also, it contains the <code>ConnectorClient</code> class that allows you to communicate.</p>
<p>The Bot Builder SDK v4 provides abstractions on top of the transport layer that make it easier to build a bot using ASP.NET Core and WebApi, but I don't use that in my library, since I provide my own abstractions to build a bot.</p>
<p>Currently, the Bot Builder SDK v4 doesn't offer something like dialogs. But that's not a problem, since I'm not using them anyway.</p>
<h2 id="buildthebot">Build the bot</h2>
<p>In order to build a bot with Gadget you need to create an empty ASP.NET Core project. You can do this with the following command:</p>
<pre><code class="language-shell">dotnet new web --name MyBot
</code></pre>
<p>This creates a new C# project with just the ASP.NET Core dependencies set up. Now you need to write up Gadget in the project.</p>
<p>First, modify the Startup.cs file and include one additional line in the <code>ConfigureServices</code> method:</p>
<pre><code class="language-csharp">services.AddGadgetBot&lt;EchoFlowProvider&gt;()
    .UseCredentialProvider(new ConfigurationCredentialProvider(Configuration));
</code></pre>
<p>This adds the necessary services for the GadgetBot library. I will use the EchoFlowProvider, which we'll implement later on. Finally I provide a credential provider that uses my application configuration.</p>
<p>The credential provider will provide the AppId and AppSecret for the Bot on Azure. You need this to communicate with the bot through things like Facebook or a WebChat client.</p>
<p>The final step to configure the bot, you need to add one line of code to the <code>Configure</code> method:</p>
<pre><code class="language-csharp">app.UseGadgetBot();
</code></pre>
<p>With the bot setup, let's build the dialog flow. The <code>EchoDialogFlowProvider</code> needs to provide a <code>Flow&lt;IActivity, IEnumerable&lt;IActivity&gt;&gt;</code> instance that is going to connect the source of the stream with the sink of the stream.</p>
<p>To make a simple echo dialog flow the <code>EchoDialogFlowProvider</code> returns a flow that simply copies the input text to the reply activity.</p>
<pre><code class="language-csharp">public class EchoFlowProvider : IDialogFlowProvider
{
    public Flow&lt;IActivity, IEnumerable&lt;IActivity&gt;, NotUsed&gt; GetDialogFlow()
    {
        return Flow.Create&lt;IActivity&gt;()
            .Where(activity =&gt; activity.Type == ActivityTypes.Message)
            .Select(activity =&gt; (Activity)activity)
            .Select(activity =&gt; new IActivity[] { activity.CreateReply(activity.Text) })
            .Select(activities =&gt; (IEnumerable&lt;IActivity&gt;)activities);
    }
}
</code></pre>
<p>The dialog flow provider works like this. It first creates a new flow element. A flow element accepts one input and one output. In our case, we accept one incoming activity and produce a set outgoing activities.</p>
<p>To implement this we first filter out all activities except for messages. Next, we convert the type and create a reply to it, by copying the text from the original activities. Last, but not least, we convert the output type to the expected type for the flow.</p>
<p>As you can see, you can use Linq statements to work with the conversation data. Which is quite a nice touch if you ask me.</p>
<p>Other than that, the dialog flow is pretty fast and scalable, because it is based on Akka.NET, which ensures optimal usage of hardware.</p>
<h2 id="isthistheperfectbotsystem">Is this the perfect bot system</h2>
<p>Although the idea is cool, I'm not sure yet if this is the best solution to build a chatbot. Do give it a try and let me know. The code is up on Github:</p>
<p><a href="https://github.com/wmeints/gadget">https://github.com/wmeints/gadget</a></p>
<!--kg-card-end: markdown-->
