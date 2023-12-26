---
title: ASP.NET Core debugging tips for Visual Studio Code
category: .NET
datePublished: '2016-11-22'
dateCreated: '2017-07-31'
---
<!--kg-card-begin: markdown--><p>These days I run a Windows laptop with Visual Studio on it, but at home I<br>
still have a great Mac Machine purring away in my home office. I like that<br>
machine since it has a huge display (27 inches) and I find Mac OS still better<br>
to use then Windows.</p>
<p>From time to time I like to work on a side project on my Mac. These days I'm<br>
building a small web application to keep track of session proposals I sent out.<br>
I'm building this using ASP.NET Core and Visual Studio Code.</p>
<p>Visual Studio Code is a great editor for writing .NET core code in C#<br>
or F# for that matter. There are however a few little things that trip me up<br>
every time I try to debug my code.</p>
<!-- more -->
<h2 id="settingupyourprojectfordebugging">Setting up your project for debugging</h2>
<p>When you open a .NET Core project in Visual Studio Code, the editor will suggest<br>
you add configuration to run the project from the editor. I usually click yes to<br>
get it out of the way.</p>
<p>The editor will generate a <code>launch.json</code> file in the <code>.vscode</code> folder.<br>
This file contains the settings for Visual Studio Code that it needs to start<br>
your project in the debugger.</p>
<pre><code class="language-json">{
    &quot;version&quot;: &quot;0.2.0&quot;,
    &quot;configurations&quot;: [
        {
            &quot;name&quot;: &quot;.NET Core Launch (web)&quot;,
            &quot;type&quot;: &quot;coreclr&quot;,
            &quot;request&quot;: &quot;launch&quot;,
            &quot;preLaunchTask&quot;: &quot;build&quot;,
            &quot;program&quot;: &quot;${workspaceRoot}/src/Proposalkeeper/bin/Debug/netcoreapp1.0/Proposalkeeper.dll&quot;,
            &quot;args&quot;: [],
            &quot;cwd&quot;: &quot;${workspaceRoot}&quot;,
            &quot;stopAtEntry&quot;: false,
            &quot;internalConsoleOptions&quot;: &quot;openOnSessionStart&quot;,
            &quot;launchBrowser&quot;: {
                &quot;enabled&quot;: true,
                &quot;args&quot;: &quot;${auto-detect-url}&quot;,
                &quot;windows&quot;: {
                    &quot;command&quot;: &quot;cmd.exe&quot;,
                    &quot;args&quot;: &quot;/C start ${auto-detect-url}&quot;
                },
                &quot;osx&quot;: {
                    &quot;command&quot;: &quot;open&quot;
                },
                &quot;linux&quot;: {
                    &quot;command&quot;: &quot;xdg-open&quot;
                }
            },
            &quot;env&quot;: {
                &quot;ASPNETCORE_ENVIRONMENT&quot;: &quot;Development&quot;
            },
            &quot;sourceFileMap&quot;: {
                &quot;/Views&quot;: &quot;${workspaceRoot}/Views&quot;
            }
        },
        {
            &quot;name&quot;: &quot;.NET Core Attach&quot;,
            &quot;type&quot;: &quot;coreclr&quot;,
            &quot;request&quot;: &quot;attach&quot;,
            &quot;processId&quot;: &quot;${command.pickProcess}&quot;
        }
    ]
}
</code></pre>
<p>It's mostly stuff that Visual Studio Code needs, but there is one important setting<br>
that I need to point out here.</p>
<p>If you have a solution that has several subfolders for projects you will find<br>
that the launch configuration doesn't work the way you expect it to.</p>
<p>My solution layout is like this:</p>
<pre><code>|-- src
  |-- Proposalkeeper
    |-- Views
    |-- Controllers
    |-- Models
    |-- Data
|-- test
  |-- Proposalkeeper.UnitTests
</code></pre>
<p>In order for my app to run correctly I need to navigate to the <code>src/Proposalkeeper</code><br>
folder and execute <code>dotnet run</code> there. This is required since it will lookup the<br>
views folder relative to the current working folder.</p>
<p>When you start the application from Visual Studio Code without modifying the file<br>
ASP.NET Core web applications will be unable to find the views in your web app.</p>
<p>When you open the root of your solution, Visual Studio Code assumes that the workspace<br>
root and thus the <code>cwd</code> setting for debugging is the root of your solution.<br>
Now when you start to debug it will load your application code from the subfolder<br>
<code>src/SomeApp</code> with the solution root as its working folder. Your application code<br>
will then try to find views in <code>${workspaceroot}/Views</code> where of course it can't find<br>
them.</p>
<p>In order to make things work correctly you need to modify the <code>cwd</code> setting to point<br>
to the correct folder where your ASP.NET core project is located.</p>
<p>Now you can press <code>F5</code> and Visual Studio Code will correctly start the application.</p>
<h2 id="debuggingsymbols">Debugging Symbols</h2>
<p>The launch configuration is one thing that tripped me up, here's another. When I was<br>
able to run my application I was unable to actually break on a line because the debugger<br>
didn't load any debug symbols for my application.</p>
<p>The default setup of an ASP.NET Core application that is generated using Yeoman<br>
doesn't have debug symbols enabled. You need to explicitly enables this in<br>
your <code>project.json</code> file.</p>
<pre><code class="language-json">&quot;buildOptions&quot;: {
  &quot;debugType&quot;: &quot;portable&quot;,
  &quot;emitEntryPoint&quot;: true,
  &quot;preserveCompilationContext&quot;: true
},
</code></pre>
<p>Add the <code>debugType</code> setting and make sure that it is set to portable. This will<br>
generate a PDB file in the output folder of the project so that the debugger<br>
is able to break on breakpoints you configure.</p>
<p>Enjoy!</p>
<!--kg-card-end: markdown-->
