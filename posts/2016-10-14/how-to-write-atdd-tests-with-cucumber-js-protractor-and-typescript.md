---
title: "How to write ATDD tests with cucumber-js, protractor and typescript"
category: Typescript
datePublished: "2016-10-14"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>ATDD (Acceptance Test Driven Development) has been around for a while now.<br>

I use it quite a lot on projects that I work on.<br>
It helps me and others translate requirements into automated tests with the minimum amount<br>
of ceremony. We can talk to users about what they want and write that down in a format that<br>
they understand and we can automate.</p>

<p>One of the ways in which I use ATDD is with AngularJS. There is an end-to-end testing<br>
tool for AngularJS called Protractor that supports writing ATDD tests using a testframework<br>
called cucumber-js. It works pretty well with just javascript, but since we use Typescript<br>
a lot more now I figured, why not use typescript for cucumber tests as well?</p>
<!-- more -->
<h2 id="whatiscucumberandwhyshouldicare">What is cucumber and why should I care?</h2>
<p>For those that don't know cucumber or ATDD for that matter. Cucumber is framework that allows<br>
you to write feature files. A feature file looks like this:</p>
<pre><code>Feature: Basic authentication
Scenario: Users can login using a username and password
  Given I have a user account willem with password somethingElse
  When I login with my username 'willem' and password 'somethingElse'
  Then I am redirected to my personal dashboard
</code></pre>
<p>The idea behind ATDD is that you define acceptance tests in a readable format and<br>
automate them using code so that you don't have to execute them manually everytime you<br>
want to validate the functionality of your application.</p>
<p>Using a readable format for your users helps you create a common understanding of what the<br>
application does for the user. Automating these specs into runnable tests closes the gap<br>
between the requirements and the tests. Often times people write specs and create a separate<br>
set of tests. The problem with this is that the tests tend to drift away from the original spec.<br>
This causes bugs that could easily be avoided if you make the specs the tests.</p>
<h2 id="settingupcucumberwithprotractor">Setting up cucumber with protractor</h2>
<p>In order to write acceptance tests for Angular 2 or AngularJS you need to use protractor.<br>
Protractor is a tool that links your tests to a webdriver which ultimately links your tests<br>
to a browser. This is useful since you can now navigate to a page in the application and<br>
communicate with the DOM. That way you can validate your app by querying if the right HTML<br>
elements were shown and much more.</p>
<p>To set protractor up you need to install the following NPM packages on your machine:</p>
<ul>
<li>webdriver-manager</li>
<li>protractor</li>
</ul>
<p>You can install these with the following command:</p>
<pre><code>npm install -g protractor webdriver-manager
</code></pre>
<p>Make sure that you update the webdriver-manager after you installed it by running</p>
<pre><code>webdriver-manager update
</code></pre>
<p>This will download the proper webdriver files for you so you can start running tests<br>
against the various supported browsers such as IE, Chrome and FireFox.</p>
<p>Next create a new protractor configuration file in your angular project.</p>
<pre><code class="language-javascript">exports.config = {
    baseUrl: 'http://localhost:9000',

    // Specify the patterns for test files
    // to include in the test run
    specs: [
        'features/**/*.feature'
    ],

    // Use this to exclude files from the test run.
    // In this case it's empty since we want all files
    // that are mentioned in the specs.
    exclude: [],

    // Use cucumber for the tests
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),

    // Contains additional settings for cucumber-js
    cucumberOpts: {

    },

    // These capabilities tell protractor about the browser
    // it should use for the tests. In this case chrome.
    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {

        }
    },

    // This setting tells protractor to wait for all apps
    // to load on the page instead of just the first.
    useAllAngular2AppRoots: true

}
</code></pre>

<p>The file should point to the feature files in your project. I put those in the <code>features</code><br>
folder, but you can place them somewhere else if you like. Next you need to set the framework<br>
to custom and point protractor to the cucumber-js framework using the frameworkPath setting.</p>
<p>Make sure that you install the protractor-cucumber-framework as part of your project<br>
using the following command:</p>
<pre><code>npm install protractor-cucumber-framework --save-dev
</code></pre>
<p>Check your configuration by executing <code>protractor protractor.conf.js</code>. If you have<br>
a feature file in your project you should see protractor spin up a browser and spit out<br>
a bunch of text on the console about your feature file. This usually should involve<br>
a couple of green and yellow lines of text. The green lines show steps in the feature<br>
files that were executed. The yellow lines show steps that aren't implemented yet.</p>
<h2 id="automatingfeaturefileswithtypescript">Automating feature files with typescript</h2>
<p>The cucumber-js framework is meant to be used with Javascript. In order to do this you<br>
need to write step definitions in javascript files that look like this:</p>
<pre><code class="language-javascript">module.exports = function() {
  this.Given(/^I have a user account (.*) with password (.*)$/, function(username, password) {
    //TODO: Do something useful
  });
};
</code></pre>
<p>You include them in the protractor config file by specifying a setting called <code>cucumberOpts</code><br>
that tells the cucumber framework to require your step definition javascript files.</p>
<pre><code class="language-javascript">cucumberOpts: {
  require: 'features/step_definitions/**/*.js'
}
</code></pre>
<p>I found that javascript is good, but quite annoying to work with since there's so much crap<br>
in the syntax to deal with. People do the weirdest things to their javascript code. Cucumber-js sadly<br>
isn't an exception to that rule.</p>
<p>Typescript offers a much better way of defining step definitions for cucumber-js. But you have to<br>
do a little work for it to function properly.</p>
<p>First you need to install the <code>ts-node</code> and <code>cucumber-tsflow</code> packages in your project<br>
using the following command:</p>
<pre><code>npm install --save-dev cucumber-tsflow ts-node
</code></pre>
<p>Next you need to modify the protractor configuration so that it includes the following<br>
<code>cucumberOpts</code> settings:</p>
<pre><code class="language-javascript">cucumberOpts: {
    require: ['features/step_definitions/**/*.ts'],
    compiler: 'ts:ts-node/register'
}
</code></pre>
<p>This configures cucumber so that it looks for step definitions in the <code>features/step_definitions</code><br>
folder and tries to load the typescript files directly from there. The problem is that it<br>
can't load typescript files under normal circumstances. However, you can specify a custom compiler<br>
for the cucumber framework. This is where <code>ts-node</code> comes in. When you configure cucumber-js to use<br>
the typescript interface from <code>ts-node</code> it is capable of loading the step definitions.</p>
<p>Time to write some step definitions in typescript:</p>
<pre><code class="language-javascript">import { binding, given, when, then } from 'cucumber-tsflow';

@binding()
class MyStepDefinitions {
@given(/^I have a user account (._) with password (._)$/)
givenIHaveAUserAccount(username:string, password:string): void {
//TODO: Do something useful
}
}

export = MyStepDefinitions;
</code></pre>

<p>This looks way easier to read and I can assure you it's much more ergonomic to write.<br>
And luckely it is not much work to set up in the end.</p>
<!--kg-card-end: markdown-->
