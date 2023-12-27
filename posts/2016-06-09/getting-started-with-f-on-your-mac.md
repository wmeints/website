---
title: Getting started with F# on your mac
category: .NET
datePublished: "2016-06-09"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>Functional programming is becoming a thing. More and more people are talking about it. I used to use Scala for a lot of projects, but always wondered about F#.</p>
<p>Last week I swallowed the blue pill and dived into this remarkable language. As with with all languages I tried to get F# up and running on my Macbook.</p>
<p>Here's what happened and what you need to know if you want to give F# a try on your own mac computer.</p>
<!-- more -->
<h2 id="myfirstbabystepsinf">My first babysteps in F#</h2>
<p>I started out with the idea that I could build a micro service that plans presentations for an audience. The idea is that this service will use the pipes and filters pattern. This pattern is something that works well when you use a functional programming language. So it would be an excellent choice for trying out F#.</p>
<p>At first I tried to run F# with a Makefile and the F# compiler. Boy, did that throw me back to 1998. You can do this, but it's evil. Don't do it if you can help it.</p>
<p>Then I moved on to Visual Studio 2015 on a virtual machine, just to get something working. It's annoying when tools don't work and Visual Studio is something I know that works for F#.</p>
<p>I got my first taste of F# and I have to say, it's a big difference from Scala that I use. I took me around three hours to get a good enough grasp of the language to write my first serious application.</p>
<p>If you're interested, I read the F# wiki book to learn the language. This book starts out with the basics that make up the F# language. It then moves on to more complex concepts. The book contains a lot of examples that help to clarify how certain things work in the language.</p>
<p>Once I had read a few chapters in the book I was able to produce something in Visual Studio without much effort.</p>
<h2 id="gettingpropertoolstomanageyourcode">Getting proper tools to manage your code</h2>
<p>Okay, so Visual Studio 2015 doesn't work on Mac. I don't like virtual machines so I had to make a move to get things going on my Mac.</p>
<p>After some more searching I found a tool called <a href="http://fsprojects.github.io/Projekt/">Projekt</a>. This tool is a must have if you are building F# projects.</p>
<p>It allows you to create .fsproj files. The project file format for F#. It also helps you manipulate the .fsproj file so that you can define what files to include and in what order.</p>
<p>As I learned from my first compile errors, order matters in F#. So a good tool that helps you define that order is a great help.</p>
<p>Another thing I can recommend is the ionide-fsharp plugin for Visual Studio Code. This editor is great for editing code. The plugin adds syntax highlighting and autocomplete for F# projects. As I'm used to having this sort of support this is a must have.</p>
<h2 id="managingdependencies">Managing dependencies</h2>
<p>The other tool that I found useful is <a href="https://fsprojects.github.io/Paket/">the paket tool</a>. This tool allows you to define dependencies in a paket.dependencies file. This is almost the same as Nuget. Except that paket supports more than just nuget.</p>
<p>You can define github dependencies and http dependencies as well. Since some libraries in F# aren't available on Nuget this tool is the way to go.</p>
<p>You can't do without a proper dependency management tool. So get this tool as well when you're downloading anyway ;-)</p>
<h2 id="testingyourcode">Testing your code</h2>
<p>I found that while developing my first F# project I needed a lot of help trying out new things. A good way to see if things work the way I want is to build a set of unittests for your project.</p>
<p>There are quite a few test frameworks available for F#, but I found that XUnit is something close to what I know. Maybe not the best framework, but it helps me enough to get started.</p>
<p>To run XUnit tests for your project I suggest you use <a href="http://fsharp.github.io/FAKE/apidocs/fake-testing-xunit.html">the FAKE tool</a> in combination with <a href="http://fsharp.github.io/FAKE/apidocs/fake-testing-xunit2.html">the xunit task</a>.</p>
<h2 id="buildingbiggerprojects">Building bigger projects</h2>
<p>As you can imagine when you start to add tests to your project it gets bigger and harder to manage. You need a separate .fsproj file for your test project since that code shouldn't go to production.</p>
<p>With the extra project for the tests you now have two projects. How are you going to compile them both and then run the tests?</p>
<p>FAKE is a F# build tool that lets you define a build process for your F# projects. It includes a lot of tasks for different jobs such as unittesting and deployment.</p>
<h2 id="readytogiveitashot">Ready to give it a shot?</h2>
<p>I hope this overview gives you a good idea of what it takes to get started with F#. Give it a shot and let me know what you think!</p>
<!--kg-card-end: markdown-->
