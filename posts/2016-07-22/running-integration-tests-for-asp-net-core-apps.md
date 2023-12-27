---
title: Running integration tests for ASP.NET Core apps
category: .NET
datePublished: "2016-07-22"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>One of the things I really disliked about the previous versions of ASP.NET is that<br>

there's no real good way to run integration tests on your web application. You basically<br>
have to set up a full webserver to run integration tests.</p>

<p>Of course if you use Web API 2 or MVC 5 you have the official testhost. It solves a lot<br>
of problems, but the API is a mess to work with and very inflexible.</p>
<p>The story for ASP.NET Core is quite different. You can now do a lot more in your testcode<br>
and it's a lot easier to set up. Let's take a look at what integration testing in ASP.NET core looks like.</p>
<!-- more -->
<h2 id="settingthingsup">Setting things up</h2>
<p>Setting up an integration test for ASP.NET core starts by creating a new project.<br>
You can do that from Visual Studio, but I like the commandline better for setting up test projects.</p>
<p>When you run <code>dotnet new -t xunittest</code> you get a fully configured Xunit project with a sample test.<br>
If you set up your project in Visual Studio you have to do the same set up by hand. That's why I like<br>
the commandline better at the moment.</p>
<p>The project.json looks allright, but when you try to restore your packages you well get a few warnings.<br>
This is to be expected, because the .NET Core test runner for Xunit is still in preview.<br>
Update the <code>dotnet-test-xunit</code> and <code>xunit</code> packages to get rid of the warnings.</p>
<p>To write an integration test you need the <code>Microsoft.AspNetCore.TestHost</code> package. Add this to your project.json<br>
and run <code>dotnet restore</code> or wait for Visual Studio to download the package for you.</p>
<h2 id="writeyourfirsttest">Write your first test</h2>
<p>Now that the project is set up you can write your first integration test.<br>
The structure of an ASP.NET Core integration test looks like this:</p>
<pre><code class="language-csharp">[Fact]
public async Task MyFirstIntegrationTest()
{
    var webHostBuilder = new WebHostBuilder()
        .UseStartup&lt;Startup&gt;();

    using (var host = new TestServer(webHostBuilder))
    {
        using (var client = host.CreateClient())
        {
            var requestData = new { name = &quot;Mike&quot; };
            var content = new StringContent(JsonConvert.SerializeObject(requestData), Encoding.UTF8, &quot;applicaiton/json&quot;);

            var response = await client.PostAsync(&quot;api/myendpoint&quot;, content);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }

}
</code></pre>

<p>First you need to create a new <code>TestServer</code> instance. It needs access to a <code>ç</code>,<br>
which is pretty much the same thing as you will find in your <code>Program.cs</code> file.</p>
<p>The <code>WebHostBuilder</code> is responsible for configuring your application. You can call<br>
various methods on it to configure your web app. The simplest thing is to call<br>
<code>UseStartup</code> on it and supply your <code>Startup</code> class.</p>
<p>Once you have a test server you can start to perform requests. For this you<br>
first call <code>CreateClient</code> which returns a new <code>HttpClient</code> instance that is<br>
configured to talk to your test server.</p>
<p>Now that you have a test client you can send requests to the server<br>
and verify the results coming back from the server.</p>
<h2 id="mockingstuffout">Mocking stuff out</h2>
<p>The current setup fires up the whole API/Web application that you're testing.<br>
This may or may not be what you want. Sometimes it can be useful to mock out<br>
a few things in your test.</p>
<p>For example if you are talking to WCF services you may want to mock out the agents<br>
for them. You could spin up your WCF services, but that would make the test rather large.</p>
<p>Instead you can modify the services of your application by adding additional lines<br>
to the web host builder.</p>
<pre><code class="language-csharp">var webHostBuilder = new WebHostBuilder()
    .UseStartup&lt;Startup&gt;()
    .ConfigureServices(services =&gt;
    {
        services.AddScoped&lt;IMyWcfAgent&gt;(serviceProvider =&gt; agentMock.Object);
    });
</code></pre>
<p>When you invoke <code>ConfigureServices</code> you can configure custom services for your application.<br>
Within the action or method that you provide it, you can replace services or add additional services.</p>
<p>In the sample above I registered a mock using <code>Moq</code> instead of my regular WCF agent.</p>
<p><strong>Notice:</strong> Services that you provide here are added before the services that are configured in your startup class.</p>
<p>In order to make the mocks functional you do need to change your <code>ConfigureServices</code> method in the startup class.<br>
Instead of calling <code>AddScoped</code>, <code>AddInstance</code>, <code>Add</code> or <code>AddTransient</code> you need to call the <code>TryAdd...</code> variant of<br>
the class that you want to replace in your tests.</p>
<p>Calling the <code>TryAdd...</code> methods instead of the regular registration methods doesn't change anything at runtime.<br>
It just means that when a service was registered before it won't be replaced by the one you add it again.<br>
If you use the regular <code>Add...</code> methods you will overwrite your test services.</p>
<p>The <code>ConfigureServices</code> in the startup for the sample above will look like this:</p>
<pre><code class="language-csharp">public void ConfigureServices(IServiceCollection services)
{
    services.TryAddScoped&lt;IMyWcfAgent&gt;(serviceProvider =&gt; new MyWcfAgent(Configuration[&quot;Agents:MyServiceUrl&quot;]));
}
</code></pre>
<h2 id="customsettings">Custom settings</h2>
<p>The <code>WebHostBuilder</code> class can do other stuff besides replacing services as well.<br>
One very cool feature is that you can supply custom configuration for your application.</p>
<p>In order to configure custom settings you need to invoke the <code>UseSetting</code> method.<br>
To use the method you need to supply a key and a value for your setting.</p>
<pre><code class="language-csharp">var webHostBuilder = new WebHostBuilder()
    .UseStartup&lt;Startup&gt;()
    .UseSetting(&quot;Agents:MyServiceUrl&quot;, &quot;http://localhost:9200/myservice.svc&quot;);
</code></pre>
<p>The custom settings are applied after the standard ones. This means that when you specify<br>
a setting in your test it will override the ones loaded by the <code>Startup</code> class.</p>
<h2 id="andtheresloadsmore">And there's loads more</h2>
<p>Since the <code>TestServer</code> class uses the <code>WebHostBuilder</code> to construct your web application<br>
it's quite flexible in what you can do. All the normal stuff that you'd normally do in your<br>
Program.cs file can be done in your test as well.</p>
<p>This means that there's a lot more you can do in your integration test than what I've<br>
written down here. So get out there and explore your options and have fun!</p>
<!--kg-card-end: markdown-->
