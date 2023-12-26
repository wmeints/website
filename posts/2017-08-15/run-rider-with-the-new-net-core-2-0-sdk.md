---
title: Run Rider even with the new .NET Core 2.0 SDK
category: .NET
datePublished: '2017-08-15'
dateCreated: '2017-08-15'
---
<!--kg-card-begin: markdown--><p>This week .NET Core 2.0 alongside with ASP.NET Core 2.0 was released. A lot of improvements were made to the runtime and the size of the standard libraries has increased significantly. More and more .NET APIs are available to you.</p>
<p>Also, Rider was released a new IDE specifically for .NET development in C# and F#. It currently supports only .NET Core 1.x. You can of course run .NET Core 2.0, but it will warn you that not everything works as expected.</p>
<p>You can of course use Rider even with these limitations. But if you're working on an existing project and can't upgrade it's better to have it running on the 1.x SDK.</p>
<p>Luckely there's a good tool for that. The .NET Core SDK switcher: <a href="https://github.com/faniereynders/dotnet-sdk-helpers">https://github.com/faniereynders/dotnet-sdk-helpers</a></p>
<p>When you follow the instructions in the Github repository you can run the following command to switch to the older SDK</p>
<pre><code>dotnet sdk 1.0.4
</code></pre>
<p>Now when you run Rider it will automatically use the older SDK.</p>
<p>If you want to switch back, run the following command:</p>
<pre><code>dotnet sdk 2.0.0
</code></pre>
<p>Easy as that! Happy hacking :-)</p>
<!--kg-card-end: markdown-->
