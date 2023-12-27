---
title: Why you should try F#
category: .NET
datePublished: "2016-06-26"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>A few weeks ago I gave F# a shot, I have my personal reasons for doing this. But I can imagine<br>

you are confused about this sudden move. Why should you even try this weird language? Almost nobody uses it!</p>

<p>You are right, not a lot of people use F# in their projects. But there are a few reasons why I<br>
think you should give it a shot for a hobby project.</p>
<!-- more -->
<h2 id="whenthefocusisonfunctionsusealanguagethatdoessotoo">When the focus is on functions, use a language that does so too</h2>
<p>Most of the applications you and I build are actually big data pipelines. We receive a HTTP<br>
request containing some data. We transform the incoming data into a database query. Then we transform the results of this query back into an object. And finally we transform this object into a HTTP response.</p>
<p>This doesn't sound interesting, since you do this all the time. But do yourself a favor,<br>
take a close look at the code you wrote. How many methods actually use instance variables<br>
from the class their defined in. And how many of those variables are actually about the state<br>
of the object?</p>
<p>I bet a lot of code you wrote actually isn't about object orientation. Most of the code will function without the class it is defined in. And when it does use private fields of the class it is not about managing state.</p>
<p>Most code in our web services you can split into two parts:</p>
<ul>
<li>Data transfer objects</li>
<li>Transformation methods</li>
</ul>
<p>You grab a HTTP request and transform it into an object. Usually a class that contains only fields. We call this a Data Transfer Object (DTO). You use DTOs and methods together to build a pipeline model for processing data.</p>
<p>You generally focus on the methods and not on object orientation. So why not use a language that helps you do that?</p>
<p>F# focuses on functions, but also has the ability to work with classes. So when you need to use object orientation you can still do so.</p>
<p>So next time you build a micro service, build one in F#. . You will be surprised how well things fit together.</p>
<h2 id="functionalprogrammingchangesyourperspective">Functional programming changes your perspective</h2>
<p>Functional programming in F# asks you to think differently about your code.</p>
<p>Functional programming is more about mathematics than anything else. Functions in mathematics provide<br>
a way to express complex constructions in a simpler format. In math you abstract complex formulas<br>
in functions so that the thing you are expressing is easier to understand.</p>
<p>F# and functional programming languages in general force you to think in this manner. They also force you to be more precise about what your function is going to express.</p>
<p>For example, when you build a validation function. What should it return?<br>
Should it raise an exception when a field is invalid? I guess not, it's not that exceptional.<br>
Yet that is what we tend to do in regular programs.</p>
<p>In all honesty, I think you should avoid exceptions in your code unless it's something<br>
that you can't possibly fix. In that case, raise the exception and quit the program altogether.</p>
<p>For proper validation you want a function that returns a validation error or a result. When I want to define this in C# I have to introduce an Either&lt;TLeft,TRight&gt; class and<br>
return Left<TLeft> or a Right<TRight> instance to tell the caller what happened.</p>
<p>This looks like this:</p>
<pre><code class="language-csharp">
abstract class Either&lt;TL,TR&gt;
{
  public abstract bool IsLeft { get; }
  public abstract bool IsRight { get; }
}

class Left&lt;TL,TR&gt;: Either&lt;TL,TR&gt;
{
public TL Value {get;}
public override bool IsLeft { get { return true; } }
public override bool IsRight { get { return false; } }
}

class Right&lt;TL,TR&gt;: Either&lt;TL,TR&gt;
{
public TR Value { get; }
public override bool IsLeft { get { return false; } }
public override bool IsRight { get { return true; } }
}

public Either&lt;Error,T&gt; Validate(T input, List&lt;Validator&lt;T&gt;&gt; validators)
{
foreach(var validator in validators)
{
if(!validator.Validate(input)) {
return new Left&lt;Error,T&gt;(new Error(validator.ErrorMessage));
}
}

return new Right&lt;Error,T&gt;(input);
}
</code></pre>

<p>This is a huge amount of code for something as simple as validation logic. On top of that if I want to discover whether I got an error or valid result I need to check for types using <code>if(result is Right&lt;Error,Person&gt;)</code> or<br>
similar constructions.</p>
<p>In F# the same is much simpler:</p>
<pre><code class="language-fsharp">type Either&lt;'L,'R&gt; = Left of 'L | Right of 'R

let validate item validators =
let collectValidationErrors validator item errors =
match (validator item) with
| Some(error) -&gt; error :: errors
| None -&gt; errors

    let rec validateRecursive results item validators =
        match validators with
        | [] -&gt; results
        | validator :: remainingValidators -&gt; validateRecursive (collectValidationErrors validator item results) item remainingValidators

    let results = validateRecursive [] item validators

    match results with
    | [] -&gt; Right(item)
    | _ -&gt; Left(results)

</code></pre>

<p>First I define that there's an either type that has a Left of my defined type<br>
and a Right for another type. This is a union type. In C# this is equal to a base class with two subclasses.</p>
<p>Next I define a function called validate. This function I can feed an item to validate and a set of validations that need to be performed on the specified item.</p>
<p>Within the validate function I define a collectValidationErrors function. When this function finds an error this error gets added to the list of existing validation errors. A validator can return a <code>Some(error)</code><br>
or simply nothing. I can perform pattern matching on this to get the right results back.</p>
<p>The validation error collection function is used by the recursive validation function. The recursive validation function works like this. First I grab the last of validators. If it's empty I'm done and return the collected errors collection. However when it contains a validator followed by a list of other validators I want to continue validation with the next validator. I use the collector function here so that the error found by the validator is added to the results collection. The function is recursive. I call it again using the results of the current validator action and the remaining validators</p>
<p>The recursive validation function here is tail recursive, I added the recursive call last. F# is smart enough to make the code so that it doesn't cause a stack overflow exception. It skips stackframes so that the algorithm runs in constant memory space.</p>
<p>The rest of the validate function is a call to the recursive function and a pattern<br>
match on the results. The results in this case is either a Left containing validation errors<br>
or a Right containing the data itself.</p>
<p>Because of the pattern match syntax and things like union types F# allows you to build much more precise code. It forces you to think about what you actually meant to do. This reduces the amount of bugs you produce.</p>
<p>The fact that I must be more precise in F# forced me to rethink my C# code. I now look through<br>
different eyes when reading my own C# code. I ask myself constantly: What did I mean to say with<br>
this method? Should it raise an exception? Maybe not, so why not use a different construction<br>
to let the caller know he did something wrong?</p>
<p>I think that once you've learned F# you too will think differently about your code.</p>
<h2 id="itsstillgoodoldnet">It's still good old .NET</h2>
<p>Thinking differently about your program comes at a price when you start to learn F#. The syntax is very different from what you're used to in C#. I still think it's a good idea<br>
to learn it.</p>
<p>And I can assure that things will be easier when you have a good book. Speaking of which, there's a free book that you can read to learn proper F#:</p>
<p><a href="https://en.wikibooks.org/wiki/F_Sharp_Programming">https://en.wikibooks.org/wiki/F_Sharp_Programming</a></p>
<p>Read it from start to end and you will discover that functional programming is easier than you think.</p>
<p>On top of that, it's good to know that you're on familiar grounds. The .NET framework is accessible<br>
to you from F# and works just as before. Building something like a web application is different in F#<br>
but not that different.</p>
<p>F# uses the .NET framework and adds a few things to it. In some ways this makes F# better than C#. For example, F# features a native implementation of the actor model. Something that I find a necessary<br>
thing if you're working on concurrent software.</p>
<h2 id="shouldiusefforproductionthen">Should I use F# for production then?</h2>
<p>Although F# runs on .NET and you can use it for a lot of good things I don't think you should use it on production. F# is only used in 0.2% of the projects on Github. It means that there isn't much support<br>
if you run into problems. Also, Microsoft provides no templates for this language other than<br>
basic console application stuff. If you have a lot of experience building web applications you<br>
can manually set things up. But when you don't have a lot of experience in ASP.NET you will find it harder to work in F#.</p>
<p>I think that you should try F# because I think you will learn something about that C# program you have been building. When you should apply functional thinking when working on pure data transformations. And when to apply functional types to make it more explicit about what a caller can expect.</p>
<h2 id="giveitatry">Give it a try!</h2>
<p>Go ahead, take a few hours, learn the language and give it a shot. F# is available in Visual Studio 2015 and you can read <a href="http://fizzylogic.nl/2016/06/09/Getting-started-with-F-on-your-mac/">my guide to get started on a Mac</a>.</p>
<!--kg-card-end: markdown-->
