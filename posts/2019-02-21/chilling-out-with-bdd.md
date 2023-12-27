---
title: Chilling out with BDD
category: Web development
datePublished: "2019-02-21"
dateCreated: "2019-02-21"
---

<p>We all know how hard it is to write understandable and maintainable tests for our code. It's always nice to have a little help from a testing framework. ChillBDD is a tool that helps you structure your tests to follow BDD practices.</p><p>Last week I finished up on my book and figured I've got time on my hands to do software development for a change. I'm in the middle of writing an ASP.NET Core website that <em>might</em> replace the ghost blog that I'm running right now. As part of my efforts to write this website I decided to give ChillBDD a shot. Here's how it went.</p><h2 id="what-is-chill">What is Chill?</h2><p>Chill is a testing framework that is aimed at supporting behavior driven development. In behavior driven development (BDD) you write automated specifications that define the behavior of your code. You then write your regular production code to implement this behavior. </p><p>Tests that use a BDD approach have a distinct style:</p><pre><code>public class WhenSomethingHappensToMyTestSubject
{
    public WhenSomethingHappensToMyTestSubject()
	{
		// Given
		// When
	}
	
	[Fact]
	public void ThenSomeFactIsTrue()
	{
		// Your assertion
	}
}</code></pre><p>Typically you write a test class per scenario that you want to test. In this scenario you provide a given state for the test and execute some behavior on the component your testing. You then use separate test methods to verify the behavior. Typically, you'll use a single assertion per test method.</p><p>Frameworks like XUnit already make it pretty straight forward to follow this style of automated testing. But they are pretty free format. You can move away from the BDD style pretty easily.</p><p>Don't get me wrong, there's nothing wrong with moving away from BDD once in a while if your code calls for it. But I also feel that having a free style testing framework doesn't help you if you want to learn how to properly use BDD style tests.</p><p>Chill approach is different in that it forces you to use BDD style testing code. It has a set of helper methods and a base class that make it easier to use BDD style testing.</p><h2 id="writing-a-chill-test">Writing a Chill test</h2><p>To use Chill you need to add the <code>Chill</code> package to your .NET test project. As far as I know it only supports using XUnit, so be sure to use that test framework as the basis for your test project. </p><p>I used the following set of commands to quickly generate a test project with Chill:</p><pre><code>dotnet new xunit -o test/ApplicationTests
dotnet add test/ApplicationTests package Chill</code></pre><p>Once you have a test project you can create a new test class using the GivenWhenThen base class that comes with Chill:</p><pre><code>using Chill;
using Xunit;

public class WhenADraftPostIsCreated: GivenWhenThen&lt;Post&gt;
{
public WhenSomethingHappensToMyTestSubject()
{
Given(() =&gt;
{
// Configure the state
});

        When(() =&gt; Post.CreateDraft("Some title", "Some description"));
    }

    [Fact]
    public void ThenThePostHasATitle()
    {
        Assert.Equal("Some title", Result.Title);
    }

}</code></pre><h2 id="working-with-a-test-subject">Working with a test subject</h2><p>The <code>GivenWhenThen</code> base class doesn't specify a test subject. This kind of test is great to test things like factory methods and static functions. Most of us will be writing test logic for object oriented programs though. </p><p>This is where the <code>GivenSubject</code> base class comes in. </p><pre><code>using Chill;
using Xunit;

public class WhenADraftPostIsCreated: GivenSubject&lt;PostManager&gt;
{
public WhenSomethingHappensToMyTestSubject()
{
Given(() =&gt;
{

        });

        When(() =&gt; Subject.Create("Some title"));
    }

    [Fact]
    public void ThenThePostHasATitle()
    {
        Assert.Equal("Some title", Result.Title);
    }

}</code></pre><p>With the <code>GivenSubject</code> base class you can create a test that has a subject. The Chill framework automatically creates the subject using the default constructor so you don't have to worry about it.</p><p>Now you may be wondering, what about objects without a default constructor? You can create those to by adding an additional instruction to the test:</p><pre><code>using Chill;
using Xunit;

public class WhenADraftPostIsCreated: GivenSubject&lt;PostManager&gt;
{
public WhenSomethingHappensToMyTestSubject()
{
Given(() =&gt;
{
WithSubject(provider =&gt; PostManagerFactory.Create());
});

        When(() =&gt; Subject.Create("Some title"));
    }

    // ...

}</code></pre><p>Using the method <code>WithSubject</code> you can control how your test subject is created. I've used this quite extensively when testing objects that needed to be constructed in a particular state.</p><h2 id="working-with-dependencies">Working with dependencies</h2><p>Often times you'll need to inject dependencies into to your test subject. You'll usually use a mock version of your dependencies because that enables you to control the situation a bit better.</p><p>Chill supports the use of mocks through its <code>UseThe</code> function. You can use this in your <code>Given</code> lambda to provide a stunt-double for a dependency.</p><pre><code>using Chill;
using Xunit;
using NSubstitute;

public class WhenADraftPostIsCreated: GivenSubject&lt;PostManager&gt;
{
public WhenSomethingHappensToMyTestSubject()
{
Given(() =&gt;
{
UseThe(Substitute.For&lt;IPostRepository&gt;());

    		The&lt;IPostRepository&gt;()
                    .InsertAsync(Arg.Any&lt;Post&gt;)
                    .Returns(new Post());
        });

        When(() =&gt; Subject.Create("Some title"));
    }

    // ...

}</code></pre><p>I'm using <code>NSubstitute</code> here because it interoperates well with Chill. But you're free to use any mocking framework you like. </p><p>Note that you can access any components that you configured with <code>UseThe</code> in your test using the <code>The</code> method. It returns the object you want so you can, for example, set up a mock call.</p><h2 id="give-this-one-a-try-">Give this one a try!</h2><p>I've been using Chill for a week now and I feel it has helped me structure my tests a little bit better. It's highly recommended if you haven't got much experience in programming yet. But it's also a great tool for experienced developers.</p><p>Give it a shot! You can check out sample code using Chill here: <a href="https://github.com/wmeints/fizzylogic/">https://github.com/wmeints/fizzylogic/</a></p><p> </p>
