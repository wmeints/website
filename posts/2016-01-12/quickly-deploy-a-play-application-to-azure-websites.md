---
title: Quickly deploy a Play application to Azure websites
category: Web development
datePublished: "2016-01-12"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>Coming from .NET I've always liked Azure for its simplicity. I takes no more<br>

than 5 minutes to run a ASP.NET web application on Azure.</p>

<p>I figured: Why isn't that possible for Java too? Turns out it is possible<br>
and not that hard to get up and running. And although I tried it with a Play<br>
application most of the steps are the same for other kinds of Java application.</p>
<p>So let's get started!</p>
<!-- more -->
<h2 id="gettingthebitsreadyfordeployment">Getting the bits ready for deployment</h2>
<p>To deploy a Java application in Azure websites you actually need a application<br>
to deploy. I choose to build a web application based on<br>
<a href="https://playframework.com/">Play with Scala</a>.</p>
<p>If you have another kind of application that you want to run, go ahead grab it.<br>
As long as it generates a war file you're good to go.</p>
<p>For my Play application I had to add a few things to the build file.<br>
First I needed to install the <a href="https://github.com/play2war/play2-war-plugin">Play2War plugin</a>. This plugin automatically<br>
generates a war for you when you run <code>activator war</code> or <code>sbt war</code>.</p>
<p>To use the plugin include it in the <code>plugins.sbt</code> file inside the <code>project/</code> folder<br>
of your project. Like so:</p>
<pre><code class="language-scala">addSbtPlugin(&quot;com.github.play2war&quot; % &quot;play2-war-plugin&quot; % &quot;1.4-beta1&quot;)
</code></pre>
<p>Make sure to check the github repo for information about which version to use.<br>
Various versions of Play need different versions of the plugin.</p>
<p>With the plugin in place, modify the <code>build.sbt</code> file to include a few settings<br>
for the plugin:</p>
<pre><code class="language-scala">import com.github.play2war.plugin._

name := &quot;frontend&quot;

version := &quot;1.0&quot;

lazy val `frontend` = (project in file(&quot;.&quot;)).enablePlugins(PlayScala)
.settings(Play2WarPlugin.play2WarSettings: \_\*)
.settings(Play2WarKeys.servletVersion := &quot;3.1&quot;)
</code></pre>

<p>Add the import for the plugin at the top and include the settings<br>
as part of the project definition.</p>
<p>You're now ready to deploy the web app to Azure. Run the following command to<br>
obtain the war file:</p>
<pre><code class="language-bash">sbt war
</code></pre>
<h2 id="createanewwebappinazure">Create a new Web App in Azure</h2>
<p>Now that you have something to deploy, let's create a new web app in azure.<br>
Navigate to the <a href="https://portal.azure.com">Azure Portal</a> and create a new Web App.</p>
<p>Give the Web App a proper name and configure it to run in a datacentre that is<br>
near you (nothing worse than a lot of latency!).</p>
<p><img src="/images/2016-01-12/azure-scala-web-app/azure-webapp-01.png" alt="Azure Web App Configuration"></p>
<p>After you create the Web App you need to change the configuration so it runs<br>
Java. Open up the details for the new Web App and click on the <code>All settings</code><br>
link. Now click on the <code>Application Settings</code> item and set the Java version to Java 8.<br>
Next set the minor Java version to newest and choose Tomcat 8.</p>
<p><img src="/images/2016-01-12/azure-scala-web-app/azure-webapp-02.png" alt="Java configuration"></p>
<p>There are a ton of web containers to choose from, I choose Tomcat simply because<br>
I used it quite extensively in the past and remember it to be a stable web container.</p>
<p>Feel the need to use something else? Go ahead, some web apps run better on Jetty<br>
or JBoss, but for Play applications Tomcat works great.</p>
<p>Be sure to save the settings and wait for Tomcat to spin up.</p>
<h2 id="deploythewebapplication">Deploy the web application</h2>
<p>With the application all set up it's time to deploy the website.<br>
There are quite a few options to choose from here and they are all up to your<br>
personal taste.</p>
<p>You can deploy manually using FTP. In this case you upload your war file to<br>
<code>site/wwwroot/webapps/</code> on the server. The web container will automatically pickup<br>
the war and deploy it in the container.</p>
<p><strong>Notice</strong> Java deployments aren't instant, so give it a minute before going<br>
to the website to view the application.</p>
<p>An alternative to FTP is the use of a GIT repository. Open up the web app<br>
configuration on the Azure portal, click the <code>all settings</code> link and select<br>
the option <code>Continuous deployment</code>. Set the deployment method to GIT and save the<br>
changes.</p>
<p>Clone the repository to your local harddrive. You can find the URL for the repository<br>
under <code>Properties</code> in the settings panel.</p>
<p>Add the war file to the GIT repository in the <code>webapps</code> folder,<br>
commit the changes and push them to Azure.</p>
<p>Once you've pushed the changes to Azure it will pick them up and deploy your war file<br>
to the Web App automatically. As with any deployment of a war file, give it a minute<br>
so that the web container has time to start the application.</p>
<p><img src="/images/2016-01-12/azure-scala-web-app/azure-webapp-03.png" alt="The final result"></p>
<p>If you are planning on running your web application as the root of the web container,<br>
make sure that you name the file ROOT.war, otherwise it will end up in a subfolder.</p>
<h2 id="finalthoughtsandafewtips">Final thoughts and a few tips</h2>
<p>Deploying a Java or Scala web application to Azure is not as hard as you might think.<br>
The deployment is actually pretty similar to that of a regular .NET application.</p>
<p>I did notice a few small glitches. Sometimes the web container doesn't pick up the<br>
war file correctly. You usually see the old website after a deployment, a failed deployment or in my case a 404 error. You can resolve this issue by restarting the web app in the management portal. After that it will pick up the new app deployment correctly.</p>
<p>Another thing that is quite important: Give the server some time. Starting Tomcat<br>
is really slow. It will take about a minute to get the server up and running.<br>
Don't be alarmed by any timeout errors you may see upon the first request. Just<br>
refresh the page and things will run smooth after that.</p>
<p>I haven't tested the performance of my Play application on Azure, but so far I<br>
haven't seen any performance issues. All requests are served well within 200ms.</p>
<p>So there you have it, a Java web application deployed on Azure without<br>
spinning up a Virtual Machine!</p>
<!--kg-card-end: markdown-->
