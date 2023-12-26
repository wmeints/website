---
title: TypeScript internal vs external modules
category: Typescript
datePublished: '2016-02-07'
dateCreated: '2017-07-31'
---
<!--kg-card-begin: markdown--><p>Last week we started to build our first component in Typescript. We have done Javascript development for quite a few years and we are quite proficient at it as a team.<br>
Still there is room for improvement. We really dislike the syntax of the revealing module pattern and we love strongly typed languages for the compile time checks it provides.</p>
<p>Typescript feels as a language that can offers quite a few things. There is however one thing that I had a hard time with: Modules.</p>
<p>It looks simple at first, but when you look carefully you will see that it is easy to get wrong.</p>
<p>In this post I will show you what I mean and give a few tips on how to use Typescript modules correctly in your own applications.</p>
<!-- more -->
<h2 id="internalmodules">Internal modules</h2>
<p>Typescript supports two modes in which you can apply modules. The first one is internal modules. Typescript allows you to define modules within your typescript files.<br>
The syntax is very similar to namespaces in Java and .NET and looks like this:</p>
<pre><code class="language-typescript">module MyInternalModule {
  export class MyClass { }
}
</code></pre>
<p>Internal modules are as they are labeled, internal, this means that it is different from what you are used to in NodeJS. When you compile your typescript files your modules<br>
are converted into variables that nest as necessary to form namespace-like objects. Notice that the class defined within the module is neatly isolated using an IIFE (Immediately Invoked Function Expression).<br>
This is the normal way for Javascript to isolate things within its own scope.</p>
<pre><code class="language-javascript">var MyInternalModule;
(function (MyInternalModule) {
    var MyClass = (function () {
        function MyClass() {
        }
        return MyClass;
    })();
    MyInternalModule.MyClass = MyClass;
})(MyInternalModule || (MyInternalModule = {}));
var x = new MyInternalModule.MyClass();
</code></pre>
<p>Things that are exported from a module, like the class you see in the sample above, are exposed as public properties of the module object when compiled.<br>
It's a bit like the public classes in a namespace in Java or .NET, except that in Typescript you cannot import classes from a module into the local scope<br>
like you would in C# or Java. Instead you define what's called a shortcut to types in module.</p>
<pre><code class="language-typescript">module MyInternalModule.Helpers {
  export class MyClass {

  }
}

import Helpers = MyInternalModule.Helpers;

var x = new Helpers.MyClass();
</code></pre>
<p>You can define internal modules in a single file or multiple files. When you write file1.ts and add a module A, you can define it again in file2.ts<br>
When you compile both files they will try to merge the exported objects into the existing namespace or define the namespace when it doesn't exist yet.</p>
<p>Actually, when you are running Typescript 1.6 or later you can replace the module syntax with the namespace syntax that is supported by the new Ecmascript 6 standard.<br>
I personally found this both good and bad. I understand that the team had to maintain backwards compatibility for internal modules. But I also wanted the team<br>
to remove the internal module support to make things more clear. I guess this is the life of a young programming language.</p>
<h2 id="externalmodules">External modules</h2>
<p>Internal modules are useful when you like to work with namespaces. And they have their uses as you will see later. External modules can also be used when you build<br>
a program using typescript. The use for external modules is however quite different from internal modules.</p>
<p>While internal modules can be seen as namespaces for your code, external modules must be viewed as ... well modules.</p>
<p>NodeJS uses modules to keep groups of classes together and while it is tempting to view them as namespaces they are in comparison to C# and Java a very different beast.</p>
<p>External modules are meant to be loaded by a module loader. RequireJS for example is a module loader. Alternatives are System and the commonJS module loader employed by NodeJS.<br>
They all have one thing in common. A single javascript file is a module when you work with NodeJS, RequireJS or System.</p>
<p>The way you define external modules is also very different from the internal module syntax. You don't use the module syntax. Instead you define things in your file<br>
that you want to export.</p>
<pre><code class="language-typescript">export class MyClass {

}

export var x:MyClass instance = new MyClass();
</code></pre>
<p>This does not do a lot, you need to use <code>tsc --module commonjs myfile.ts</code> to compile the file in such a way that it is compatible with the NodeJS module syntax.<br>
If you want to use RequireJS you have to use yet another syntax to compile the file <code>tsc --module amd myfile.ts</code> so that a different syntax is generated that is<br>
compatible with RequireJS.</p>
<p>The script above compiles down to the following javascript when you compile it with the commonjs syntax:</p>
<pre><code class="language-javascript">var MyClass = (function () {
    function MyClass() {
    }
    return MyClass;
})();
exports.MyClass = MyClass;
exports.x = new MyClass();
</code></pre>
<p>External modules can be imported using the <code>var mymodule = require('./mymodule')</code> syntax. This is very similar to what NodeJS uses natively.<br>
When you use RequireJS you will see that the require statement gets translated to the correct syntax for that type of module loader. The same goes for the System module loader.</p>
<h2 id="twoflavorstwodifferentgoals">Two flavors, two different goals</h2>
<p>So Typescript provides two different kinds of modules and the naming is kind of confusing when you haven't used Typescript before.<br>
This begs the question, what should you use when? Well, it really depends on what you want. And you can even combine the two together if you like.</p>
<p>I think you should keep things simple for yourself, otherwise you will run into big trouble at some point in the future.</p>
<p>Internal modules are really namespaces, which is model that is most often applied in the browser. There's a big need for namespaces in a web application<br>
since everything naturally gets loaded into the window scope. The window scope can turn into a massive pile of variables if you don't manage your scripts<br>
carefully. This is where internal modules or namespaces really shine.</p>
<p>On the other hand if you're building a NodeJS application you have to work with modules in the traditional sense. Every file is its own module and<br>
there is no global scope to worry about. When you import a module you automatically assign it to a well known variable. It's logical to use external modules for this scenario.</p>
<p>You can use internal modules in NodeJS applications, but it complicates things greatly. This kind of unnecessary complexity could kill productivity and maintainability in no time.<br>
Same goes for using external modules in the browser.</p>
<p>RequireJS is invented to be used from the browser, but quite hard to get right. First you have to tell requireJS where to find the main script in a script tag that looks like this:</p>
<pre><code class="language-html">&lt;script src=&quot;require.js&quot; data-main=&quot;app.js&quot;&gt;&lt;/script&gt;
</code></pre>
<p>What this does is download the app.js file separately from the server. This incurs an extra HTTP request you really don't need to get everything going.<br>
The best and probably the best way to get your application scripts fast and easy is by using Grunt or Gulp to concatenate and minify the application scripts.<br>
That way the download time is shorter and you perform just one HTTP request to get all the scripts you need. The website is more suitable for mobile when you<br>
do this and you have far fewer problems debugging the thing (That is if you use a sourcemap to get to the original sources for debugging).</p>
<h2 id="whichwaytogofromhere">Which way to go from here?</h2>
<p>Where to from here? I think that if you use Typescript you should learn to use the namespace syntax instead of the module syntax to separate clearly between internal and external modules.<br>
Because internal modules are namespaces and external modules are just modules.</p>
<p>Don't mix and match module types, it will make your code very hard to read for beginner developers and may lead to questions with more experienced developers as well.</p>
<p>As they like to say these days: &quot;This is Bill, he uses modules in NodeJS apps and namespaces in web apps. Bill is Smart. Be like Bill.&quot;</p>
<!--kg-card-end: markdown-->
