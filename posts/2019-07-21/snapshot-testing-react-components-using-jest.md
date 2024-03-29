---
title: Snapshot testing react components using Jest
category: Web development
datePublished: "2019-07-21"
dateCreated: "2019-07-21"
---

<p>Testing a single page application can be quite hard when it comes to validating the HTML that is generated by your components. Snapshot testing can be quite helpful, especially in larger applications. Here's a short guide on how to use it in your React application!</p><h2 id="what-is-snapshot-testing-and-why-should-i-use-it">What is snapshot testing and why should I use it?</h2><p>Snapshot testing in React is a test method where we run a test and store a snapshot of the rendered HTML. Next time we run the test, we can verify that the HTML output of the component hasn't changed compared to the last time we ran the test.</p><p>The purpose of snapshot testing is to make sure you didn't break the layout of your component when you change behavior. Snapshot testing is great as an addon if you're already writing behavior driven tests.</p><p>Now that you understand what snapshot testing is, let's look at how you can implement it in Jest, a testing framework for React.</p><h2 id="how-does-snapshot-testing-work">How does snapshot testing work?</h2><p>In React, you can use Jest as a testing framework for writing unit-tests, integration tests and even end-to-end tests. Here's an example test written in Jest:</p><pre><code>import React from 'react';
import App from './App';

describe('App', () =&gt; {
test('loads without error', () =&gt; {
let element = &lt;App/&gt;;

    	expect(element).toBeTruthy();
    });

});</code></pre><p>This test loads up React and the App component. It then runs a test case to check whether the App component loads as expected. Not very fancy, but great for demonstration purposes.</p><p>Let's say you want to check whether the HTML generated by the app component changes when you change behavior. You can write the following additional test case for this:</p><pre><code>import React from 'react';
import renderer from 'react-test-renderer';

import App from './App';

describe('App', () =&gt; {
test('render matches snapshot', () =&gt; {
const component = renderer.create(&lt;App/&gt;);
const tree = component.toJSON();

        expect(tree).toMatchSnapshot();
    });

});
</code></pre><p>First, this test case creates a new test renderer for the App component. Next, it renders the component tree to JSON. Finally, it uses the <code>toMatchSnapshot</code> matcher to verify the generated HTML against the stored snapshot.</p><p>The first time you run the test using the command <code>jest</code>, a snapshot is stored on disk. Rendering the test green in the process, because there's no snapshot to validate against. </p><p>The next time you run the test, the component is rendered again, but this time it is checked against a snapshot stored in the <code>**snapshots**</code> folder.</p><p>When the generated tree matches the snapshot, the test is flagged green. If it doesn't it will get flagged red. </p><p>It may very well happen that you've changed the HTML your component generates. That's fine, run <code>jest --updateSnapshot</code> to update the snapshot and commit the <code>**snapshots**</code> folder to git so you'll have an updated snapshot to work with the next time you run your tests.</p><h2 id="want-to-learn-more">Want to learn more?</h2><p>That's it for using snapshot tests in Jest. It's a very powerful mechanism, especially if you're building larger web applications in React or other single-page-application frameworks. </p><p>You can learn more about it in the Jest manual here: <a href="https://jestjs.io/docs/en/snapshot-testing">https://jestjs.io/docs/en/snapshot-testing</a></p>
