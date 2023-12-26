---
title: Why I like Angular more than I like React.JS
category: Web development
datePublished: '2015-06-10'
dateCreated: '2017-07-31'
---
<!--kg-card-begin: markdown--><p>Last week Lieke Boon (@Lieke2208) on twitter asked what people liked best, Angular or React. Good question, which deserved an honest answer from my side.</p>
<!-- more -->
<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr"><a  href="https://twitter.com/Lieke2208">@Lieke2208</a> weird, but I like <a href="https://twitter.com/hashtag/angularjs?src=hash">#angularjs</a> better. Mixing html and js is weird and wrong if you ask me. It gets messy.</p>&mdash; Willem Meints (@willem_meints) <a href="https://twitter.com/willem_meints/status/608191127074820096">June 9, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
<p>It's a bit like asking someone for their favorite music or color. It's a very personal thing. You can expect some pretty heated responses on the subject, which I of course got very soon after I told Lieke that I like Angular.</p>
<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/willem_meints">@willem_meints</a> <a href="https://twitter.com/Lieke2208">@Lieke2208</a> that&#39;s the first though for every developer that is accustomed to MVC and starts with <a href="https://twitter.com/hashtag/reactjs?src=hash">#reactjs</a></p>&mdash; Wim Mostmans (@Sitebase) <a href="https://twitter.com/Sitebase/status/608543917231996928">June 10, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
<p>He might be right, I am a person that is very accustomed to MVC. It's too bad that 140 characters guarantuees one thing:<br>
Miscommunication. Wim probably doesn't want me to think that I am wrong for using MVC. Also I am pretty sure that<br>
I didn't mean I haven't tried it and am just shouting messy, because it looks like that in hello world demo code.</p>
<p>The tweets call for a better explanation in more words. So here it goes on my weblog.</p>
<h2 id="whatisreactjs">What is React.JS?</h2>
<p>You may or may not know about React.JS, so let's explore that first. React.JS is a framework that offers a way to build<br>
user interface components using Javascript. It offers functionality for building view related things only according to the website.</p>
<p>Which means, you don't get any help building controllers and models. You have to find another framework for that.<br>
Or you could use plain javascript classes and jQuery to talk to the backend. Which is plenty for most things if you ask me.</p>
<p>In order to build a component in ReactJS you define a new class like in the sample below</p>
<pre><code>var PeopleList = React.createClass({
    componentDidMount: function() {
      var self = this;

      myService.getPeople().then(function(data) {
        self.setState({
          people: data
        });
      });
    },
    render: function() {
        var people = [];

        for(var i = 0; i &lt; this.state.people.length; i++) {
          people.push(&lt;li&gt;{this.state.people[i].name}&lt;/li&gt;);
        }

        return (
          &lt;ul&gt;
            {people}
          &lt;/ul&gt;
        );
    }
});
</code></pre>
<p>You can render this component on the page, by invoking the following code:</p>
<pre><code>React.render(&lt;PeopleList/&gt;, document.findElementById(&quot;my-placeholder&quot;));
</code></pre>
<p>This piece of code does the following. First it finds a placeholder element on the page.<br>
After that React will instantiate the peoplelist component and insert it into the placeholder<br>
DOM element.</p>
<p>Once instantiated the componentDidMount function is called which loads<br>
the data. In the sample above, the data is loaded using a service class that I created myself.<br>
It returns a promise. In the then function I will call setState to update the state of my component.</p>
<p>Set state updates the state of the component and automatically asks for a render. Which is<br>
implemented using the render method. The render method is responsible for transforming data into DOM elements.</p>
<p>Properties on React.JS are set only once and cannot be updated after the component is rendered.<br>
State however can be updated and is used to work with dynamic data.</p>
<p>React.JS unlike Angular doesn't support two-way bindings in the normal sense of the word.<br>
It does however offer events, which bind to functions on the component in which you can call setState<br>
to update the state of the component. This allows you to create two-way bindings yourself. But with<br>
full control over those bindings.</p>
<p>Other than the features I just described there's not a whole lot more about React.JS.<br>
Which makes it a pretty compact and easy to learn framework.</p>
<h2 id="niceandcompact">Nice and compact</h2>
<p>I like the fact that the framework is very small in terms of features. It does one job very well.<br>
Concentrating on the user interface is a good move which I think more frameworks should make.<br>
Communicating with REST services is rather easy as it is with jQuery and doesn't need a lot more.<br>
The user interface on the other hand is riddled with weird stuff in jQuery which gets easier when<br>
you use something like React.JS</p>
<p>Another thing that works really well is the fact that data goes one way in the React.JS components.<br>
As there are no data binding options you can only flow data from your server to the user interface.<br>
Sure you can bind events and get data from a textbox and put it back in the state of the control.<br>
But when you set the state of the control, it still flows from your code to the user interface and<br>
you control where the data goes.</p>
<p>React.JS also doesn't require a lot of boilerplate code to get things up and running. You determine<br>
where and when to start rendering controls, so you get to set up the bootstrapping process and<br>
determine when to load data.</p>
<h2 id="jsxaworkingsolutionbutitneedsmorework">JSX: A working solution, but it needs more work</h2>
<p>As you might have noticed in the sample at the start of this post, there's HTML code in the javascript.<br>
When you build a React.JS component you get the best result when you start using a language called JSX.<br>
The JSX language is a mix of regular javascript and HTML-like syntax. The render method requires you to<br>
return a DOM element to render. You can build that DOM element, but it is way easier to do that by just<br>
typing the HTML elements you want and run the JSX compiler to convert the thing into runnable javascript.</p>
<p>It looks like you are mixing HTML and Javascript when working with JSX. But once you compile it down<br>
to javascript you will get syntax that looks like this:</p>
<pre><code>var PeopleList = React.createClass({
    componentDidMount: function() {
      var self = this;

      myService.getPeople().then(function(data) {
        self.setState({
          people: data
        });
      });
    },
    render: function() {
        var people = [];

        for(var i = 0; i &lt; this.state.people.length; i++) {
          people.push(React.createElement(&quot;li&quot;,null,this.state.people[i].name));
        }

        return react.createElement(&quot;ul&quot;,null,people);
    }
});
</code></pre>
<p>JSX is a good find when you think of the amount of work you need to do to build DOM elements by hand.<br>
But there are a few things that I definitely don't like about this approach.</p>
<p>First there are no editors that support the syntax well. Most editors break or don't over any syntax highlighting<br>
when you start working with JSX files. I use Atom a lot. It has a plugin for the JSX syntax, but so far I haven't<br>
had a really good experience with the plugin. I know this will get better, but right now it's a mess :(</p>
<p>Another thing I don't really like about the JSX syntax is the fact that it is HTML-like. Some attributes are different<br>
from what you expect them to be. You cannot type in class but have to use className instead. Copy any of your old<br>
HTML code and you will find that it is frustrating to convert existing code to React. Same goes for things like the for<br>
attribute which is htmlFor in JSX.</p>
<p>It feels like typing HTML with one hand tied to your back, lazely hanging so you<br>
feel like you can reach, where in fact you can't reach the keyboard.</p>
<p>This all has to do with the fact that JSX translates into React.createElement calls, but I think they could<br>
have done a better job at translating the various HTML attributes. There's no good reason why they made it<br>
the way it is right now if you ask me.</p>
<p>JSX is good for solving the problem of having to manually manufacture DOM elements, but it does so in a weird<br>
way.</p>
<p>Also, when you start to build bigger components things tend to get messy with JSX. Too much of the HTML goo<br>
and you cannot read what you're doing. It's very easy to fall in this hole, so a warning is in order here.</p>
<h2 id="sometipsforpeoplewhostarttoworkwithreactjs">Some tips for people who start to work with React.JS</h2>
<p>When you start to build JSX components you have to think very hard about how you structure your components.<br>
Try to split the user interface into components as small as possible. Then compose those components into<br>
a working user interface.</p>
<p>This sounds easy, just throw together lots of small components. In reality it isn't that easy. You will<br>
learn very quickly that it takes experience and skill to make the right trade-off between reusable components<br>
and components that can only be used once in a very specific situation.</p>
<p>I think the documentation needs a little more explanation on how to do this, to help first-time component<br>
builders do the right thing.</p>
<h2 id="sowhydoilikeangularbetter">So why do I like Angular better?</h2>
<p>After writing everything down I think it comes down to a 51% vs 49% desision.<br>
Angular works with strict separation of markup and behavior. Which works really well, because it prevents<br>
people from creating a big mess in a file that regularly contains complex logic to control the user interface.</p>
<p>On the other hand, having a compact framework for just one job is great. It gives me a lot more freedom<br>
to build everything else in the way I need it to be without having to bend myself over backwards to get it<br>
going, because a framework tells me it should work in a certain way.</p>
<p>I think you should try React.JS out and tell me what you think. Also I am curious about things like performance,<br>
so if anyone out there has a rough idea about that, let me know!</p>
<!--kg-card-end: markdown-->
