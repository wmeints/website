---
title: Using Akka.NET from your ASP.NET core application
category: .NET
datePublished: "2016-05-22"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>ASP.NET Core is a great web framework. Now that RC2 is out I can recommend you take a look at it. The tooling is much more solid now and the API is looking stable as well.</p>
<p>One of the things I've been meaning to try for weeks now is to use actors in my ASP.NET Core application. So here it goes.</p>
<!-- more -->
<h2 id="whatisakkanet">What is Akka.NET?</h2>
<p>Akka.NET offers a way to build your application using actors. The framework solves a typical concurrency problem.</p>
<p>In a regular application if you want concurrency you're have to use things like locks and signals. These constructs allow you to synchronize parts of the application that access shared resources.</p>
<p>Concurrency is hard to get right. It opens the way to all sorts of weird problems that are hard to solve.</p>
<p>Akka.NET tries to solve this problem by using Actors. Actors are isolated components that you talk to by sending a message to its mailbox. Actors can talk to other actors by sending messages to their mailboxes. They can't and<br>
shouldn't access code in other actors directly.</p>
<p>The inside of an actor is single threaded, but the message delivery is not. Akka.NET takes care of message delivery so you can build your components as if there's no concurrency. Pretty cool stuff since this makes concurrency a lot easier.</p>
<p>As you can imagine the concurrency isn't completely gone. You still have to think about which message goes<br>
where and what messages you need in order to continue performing a task. But this is much simpler to think<br>
about than trying to work with mutex objects directly.</p>
<p>So what does an actor look like? It is a component that has a Receive handler. In this receive handler you define which type of message you handle and how you want to handle it.</p>
<pre><code class="language-csharp">public class MyActor: ReceiveActor
{
    public MyActor()
    {
        Receive&lt;string&gt;(msg =&gt; Sender.Tell(msg));
    }
}
</code></pre>
<p>In the sample I've written an actor that receives a message and sends back a reply immediately. The basic hello world stuff. In normal circumstances you would do complex processing in here. So a good tip is to invoke a<br>
method from within your receive handler to let it do the actual processing. This makes the actor code much<br>
more readable.</p>
<h1 id="runningactorsinyouraspnetcoreapplication">Running actors in your ASP.NET core application</h1>
<p>To use the actor we just built you need to add an actor system to your ASP.NET core application.</p>
<p>If you've worked with ASP.NET core before you know that it has a startup class. In this class you define services and middleware for your application.</p>
<p>Akka.NET uses an actor system to run the actor instances. This actor system needs to be available in your web application. So first we need to create a new actor system for our actors to run in. After that we register it with the service collection.</p>
<pre><code class="language-csharp">public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        var actorSystem = ActorSystem.Create(&quot;my-actor-system&quot;);
        services.AddSingleton(typeof(ActorSystem), (serviceProvider) =&gt; actorSystem);
    }

    // ... The rest of your startup class

}
</code></pre>

<h2 id="theactorlifecycleinawebapplication">The actor lifecycle in a web application</h2>
<p>Once you have an actor system you can start a new actor by asking for a specific actor based on a set of properties.</p>
<pre><code class="language-csharp">public class HomeController: Controller
{
    private ActorSystem _actorSystem;

    public HomeController(ActorSystem actorSystem)
    {
        _actorSystem = actorSystem;
    }

    [HttpGet(&quot;api/greet&quot;)]
    public async Task&lt;object&gt; GetData(string name)
    {
        var actorRef = _actorSystem.ActorOf(Props.Create&lt;MyActor&gt;());
        return await actorRef.Ask&lt;string&gt;(name);
    }

}
</code></pre>

<p>In the sample above I've loaded the actor system in my controller and create a new actor instance every time I receive a request.</p>
<p>This means you get a new actor per request. It is simple, but can be quite memory intensive depending on what your actor does.</p>
<p>To make the most of Akka.NET it is best to use its routing and scaling capabilities.</p>
<p>Instead of creating a new actor every time you receive a request it is best to create a single actor at the start of the application. You can scale this at a later time if the need arises.</p>
<p>Now there's one little problem with this. In ASP.NET core there's no way to ask for named dependencies. So when you register your actor with the service collection it will overwrite any existing actors.</p>
<p>You can fix this by writing a custom class that wraps the actor reference. This custom class is then registered as singleton so that I have a single actor wrapped in it.</p>
<pre><code class="language-csharp">public interface IMyActorInstance
{
    Task&lt;string&gt; GreetAsync(string name);
}

public class MyActorInstance: IMyActorInstance
{
private IActorRef \_actor;

    public MyActorInstance(ActorSystem actorSystem)
    {
        _actor = actorSystem.ActorOf(Props.Create&lt;MyActor&gt;(), &quot;my-actor&quot;);
    }

    public async Task&lt;string&gt; GreetAsync(string name)
    {
        return await _actor.Ask&lt;string&gt;(name);
    }

}
</code></pre>

<p>Now that you have a proper wrapper you can register that wrapper with the service collection and use that instead. One other advantage over using actor references directly is that you can manage the message interface much better.</p>
<p>To use the wrapper reference it in the controller and call the provided methods to send a message to your actor.</p>
<h2 id="scalingtheactor">Scaling the actor</h2>
<p>Now that you have a proper wrapper for the actor you can scale it by modifying the construction logic a bit.</p>
<pre><code class="language-csharp">var actorProps = Props.Create&lt;MyActor&gt;()
    .WithRouter(new RoundRobinPool(5));

\_actor = actorSystem.ActorOf(actorProps,&quot;my-actor&quot;);
</code></pre>

<p>This code tells Akka.NET we want a custom router with the actor. The <code>RoundRobinPool</code> router uses a round robin distribution algorithm to distribute the messages over the actor instances.</p>
<p>The round robin pool router isn't the only router available to you. You can also use the Broadcast router for scenarios where you need many actors to respond to a message. There's also routers that allow you to pin a series of messages to the same actor instance.</p>
<p>You can use the router setup in the sample as a means to scale. But you that is not the only scenario that routers in Akka.NET support. So I suggest you spend a little time to explore routing when you start to look at Akka.NET.</p>
<h2 id="finalthoughts">Final thoughts</h2>
<p>The combination Akka.NET with ASP.NET core is a good one if you want your logic to scale easily. I personally feel that the Akka.NET API is easier to use than regular tasks with async/await. So when you have to scale<br>
logic in your application across multiple CPU cores I suggest you take a look at Akka.NET.</p>
<p>Give it a shot and let me know what you think!</p>
<!--kg-card-end: markdown-->
