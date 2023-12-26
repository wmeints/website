---
title: Using WCF in combination with .NET Core SDK
category: .NET
datePublished: '2016-07-19'
dateCreated: '2017-07-31'
---
<!--kg-card-begin: markdown--><p>At my current project we're working hard to get a new REST API running on top of ASP.NET Core.<br>
One of the things we need to do is communicate with a set of existing WCF Services in the back office of the company.</p>
<p>This means we need WCF clients inside our ASP.NET Core project. Something that isn't very simple as it turns out.</p>
<!-- more -->
<p>In this article I will show you some of the options you have for building and connecting to WCF services.<br>
I will also show you which problems you may run into while building or connecting to WCF services.</p>
<h2 id="buildingwcfservicesusingthenetcoresdk">Building WCF services using the .NET Core SDK</h2>
<p>Before you start to think about building WCF services on top of .NET Core framework it's important to know that<br>
only the client part of WCF is supported.</p>
<p>If you want to build WCF services you need to change your project.json so that<br>
you run on top of the full .NET Framework.</p>
<pre><code class="language-json">{
  &quot;version&quot;: &quot;1.0.0-*&quot;,
  &quot;dependencies&quot;: {},
  &quot;frameworks&quot;: {
    &quot;net461&quot;: {
      &quot;frameworkAssemblies&quot;: {
        &quot;System.Runtime.Serialization&quot;: &quot;4.0.0.0&quot;,
        &quot;System.ServiceModel&quot;: &quot;4.0.0&quot;
      }
    }
  }
}
</code></pre>
<p>When you build WCF services with the .NET Core SDK in combination with the full .NET Framework<br>
you need to know that you are limited to running on Windows. WCF isn't fully<br>
supported by Mono and .NET Core framework only supports clients.<br>
Other than that it's perfectly fine to build WCF services with the .NET Core SDK.</p>
<p>Right now there's only one way to host your WCF service when you use the .NET Core SDK.<br>
Normally you'd make a .svc file with a servicehost directive to host on IIS. Applications<br>
build with the .NET Core SDK however don't seem to support this.</p>
<p>The only way to host a WCF service is to create a self-hosting application.</p>
<pre><code class="language-csharp">using (ServiceHost host = new ServiceHost(typeof(HelloWorldService), baseAddress))
{
    ServiceMetadataBehavior smb = new ServiceMetadataBehavior();
    smb.HttpGetEnabled = true;
    smb.MetadataExporter.PolicyVersion = PolicyVersion.Policy15;

    host.Description.Behaviors.Add(smb);

    host.Open();

    Console.WriteLine(&quot;The service is ready at {0}&quot;, baseAddress);
    Console.WriteLine(&quot;Press &lt;Enter&gt; to stop the service.&quot;);
    Console.ReadLine();

    host.Close();
}
</code></pre>
<p>This is fine when you don't mind running console applications for each of your services.<br>
It does however present problems for companies that want to host several services in a single<br>
host process. So before you jump in and start building WCF services make sure that you think about the hosting model.</p>
<h2 id="buildingwcfclientsusingthenetcoresdk">Building WCF clients using the .NET Core SDK</h2>
<p>While WCF services aren't supported with the .NET Core framework but can be build using the SDK it's good to know<br>
that WCF clients are supported in the .NET core framework.</p>
<p>In order to generate a client for a WCF service you need an extension in<br>
Visual Studio 2015 called <a href="https://visualstudiogallery.msdn.microsoft.com/c3b3666e-a928-4136-9346-22e30c949c08">the WCF connected service</a>.<br>
This extension makes it possible to add a WCF connected service to your project.<br>
Notice that it only works for Visual Studio 2015 right now. Support for Mac and Linux<br>
is being developed, but not available yet.</p>
<p>The good thing with the connected service code is that while you can only generate it in Visual Studio, you<br>
can use the code on your Mac or Linux machines. Once a WCF client is generated there's no need for<br>
the Visual Studio extension.</p>
<p>The current version of WCF Core supports only a limited set of bindings and transports.<br>
For example WS-* support is missing. Also, you can't use Windows Authentication on Mac and Linux.</p>
<p>If you need this kind of support you need to use the full .NET framework. Which means that you<br>
are required to run on Windows. Since Mono does not support all scenarios for WCF right now.</p>
<p>If you set your project.json to full framework and include the <code>System.ServiceModel</code> and <code>System.Serialization</code><br>
assemblies you can then generate clients using the good old svcutil commandline utility. Provided that you<br>
work on Windows of course.</p>
<p>For our project I created a custom powershell script that does just that. It takes some settings<br>
and generates a WCF client for me.</p>
<pre><code class="language-powershell">$svcutil = &quot;C:\Program Files (x86)\Microsoft SDKs\Windows\v10.0A\bin\NETFX 4.6.1 Tools\SvcUtil.exe&quot;
function Generate-WcfClient {
	param([string] $wsdlPath, [string] $namespace, [string] $outputPath)
	$languageParam = &quot;/language:C#&quot;
	$outputParam = &quot;/out:&quot; + $outputPath
	$namespaceParam = &quot;/n:*,&quot; + $namespace
	$svcutilParams = $wsdlPath, $languageParam,$namespaceParam,$outputParam
	&amp; $svcutil $svcutilParams | Out-Null
}

Generate-WcfClient -wsdlPath &quot;../../Metadata/WSDL/MyService.V1.wsdl&quot; -namespace &quot;MyProject.Agents.MyService&quot; -outputPath &quot;./Agents/MyService.cs&quot;
</code></pre>
<p>You can extend this to generate several clients if you need to. To integrate it into the build you need<br>
modify your <code>project.json</code> file and add the script to it.</p>
<pre><code class="language-json">{
  &quot;version&quot;: &quot;1.0.0-*&quot;,
  &quot;buildOptions&quot;: {
    &quot;debugType&quot;: &quot;portable&quot;
  },
  &quot;dependencies&quot;: {},
  &quot;frameworks&quot;: {
    &quot;net461&quot;: {
      &quot;frameworkAssemblies&quot;: {
        &quot;System.Runtime.Serialization&quot;: &quot;4.0.0.0&quot;,
        &quot;System.ServiceModel&quot;: &quot;4.0.0&quot;
      }
    }
  },
  &quot;scripts&quot;: {
    &quot;precompile&quot;: [
      &quot;powershell ./generateagents.ps1&quot;
    ]
  }
}
</code></pre>
<p>Every time you run a build the agents get generated automatically. Keep in mind though that because you<br>
have a precompile script the build no longer uses incremental compiles. It means things will be slower.<br>
I personally feel that this is not a problem for me, but your situation could be different.</p>
<h2 id="conclusion">Conclusion</h2>
<p>So yes you can use WCF from .NET Core SDK projects, but you will have to spend some time to make a trade-off between<br>
cross platform support and the requirements of the WCF services you connect to.</p>
<p>If you don't need to use WS-* extensions and Windows authentication I suggest you change the bindings of your<br>
WCF services and use .NET Core framework. If you can't then it's good to know you can still work with your<br>
existing WCF services by running on the full .NET Framework on Windows.</p>
<!--kg-card-end: markdown-->
