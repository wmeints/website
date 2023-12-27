---
title: Get started with Hexo on Github
category: Web development
datePublished: "2016-01-09"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>&quot;My weblog is getting pretty old&quot; was the first thing I thought when I tried to update it to the<br>

latest technology. And it's true, I've started my weblog on community server, moved it to wordpress,<br>
tried to run it on Ghost and finally made the move to static HTML with Octopress.</p>

<p>The final move to a static HTML website has provided me with the best experience<br>
so far. If you can afford to mess with HTML, Markdown and CSS than generating a weblog<br>
based on markdown and some templates is by far the most flexible and most performant way<br>
to run a weblog.</p>
<p>The downside for me is that octopress right now is very outdated on my machine. The buildscripts<br>
that I use are a few years old and lack the necessary bugfixes to run them on Windows. Which<br>
I still use at work.</p>
<p>After some searching however I found a good alternative to Octopress called Hexo. In this post<br>
I will take you through the basics steps to set up a Hexo blog with a theme and a few plugins<br>
to host the website on Github pages.</p>
<!-- more -->
<h2 id="step1downloadhexoandconfigureyourwebsite">Step 1: Download Hexo and configure your website</h2>
<p>The first step is to install Hexo on your machine. For this you need to install the <code>hexo-cli</code><br>
module using NPM:</p>
<pre><code class="language-bash">npm -g install hexo-cli
</code></pre>
<p>The Hexo CLI module is designed to give you the necessary commandline tools to create a new static<br>
website in a folder and generate the static HTML for that website among other utility functions that<br>
you normally need to maintain a website.</p>
<p>To create a new website, execute the following set of commands:</p>
<pre><code class="language-bash">hexo init [website]
cd [website]
npm install
</code></pre>
<p>The first command genrates a new folder with some basic configuration and templates.<br>
Since hexo is essentially a set of node modules you need to run <code>npm install</code> to get<br>
everything setup correctly.</p>
<p>After initializing the website you need to do some basic configuration for it.<br>
You can find the site configuration settings in the _config.yml file which is located<br>
in the root of the website.</p>
<p>In this file you need to specify the name and URL of the website and some basic information<br>
about you as the author of the website.</p>
<p>You can check the website by running the following set of commands</p>
<pre><code class="language-bash">hexo generate
hexo server
</code></pre>
<p>Open your browser and go to <code>http://localhost:4000/</code> to see the results.</p>
<h2 id="step2selectathemeforyourwebsite">Step 2: Select a theme for your website</h2>
<p>Hexo uses a set of templates to render the pages of your website. Templates for the<br>
website are normally located inside a theme that you configure in the _config.yml<br>
file.</p>
<p>The default theme is okay, but if you like to use something else, you can find quite a<br>
few good themes on <a href="http://hexo.io/themes">hexo.io</a>.</p>
<p>To switch themes you need to find a new theme, go to its github repository and clone it<br>
into the <code>themes</code> folder of your website. Once that is done you configure the new theme<br>
in <code>\_config.yml</code> and run <code>hexo generate</code> to generate the website with the new theme.</p>
<p>Hexo themes have some configuration that comes along with them, so check out the <code>\_config.yml</code><br>
file inside the theme for additional settings. Some themes come with sample configuration files<br>
that you may have to rename to configure the theme correclty.</p>
<p>Here's a tip for working with themes if you use GIT to store your website sources.<br>
Make sure you either fork the theme or remove the .git folder from the theme folder so that you<br>
manage the theme through the repository that holds the sources of your website.<br>
Otherwise you will lose configuration settings that are required to properly generate the website.</p>
<h2 id="step3installadditionalplugins">Step 3: Install additional plugins</h2>
<p>When you initialize a basic Hexo website it comes with very few plugins. Just a few basic ones<br>
that you need in order to make things look right in combination with the landscape theme.</p>
<p>I had to add a few plugins to make the website look right for my weblog. Here's a short list<br>
of my favorites:</p>
<h3 id="hexorenderermarked">hexo-renderer-marked</h3>
<p>All of my blogposts contain weird line breaks to make the thing look right on screen without<br>
me having to enable line wrapping in my favorite text editor. Hexo has the weird habit of rendering<br>
those linebreaks.</p>
<p>The hexo marked renderer is a markdown rendering engine that enables you to configure how your markdown<br>
should be processed. The module follows commonmark specs as much as possible.</p>
<p>My configuration for this module looks like this:</p>
<pre><code># Marked renderer
marked:
  gfm: true
  pedantic: false
  sanitize: false
  tables: true
  breaks: false
  smartLists: true
  smartypants: true
</code></pre>
<p>You can download this module by running <code>npm install hexo-renderer-marked --save</code></p>
<h3 id="hexogeneratorcategory">hexo-generator-category</h3>
<p>If you like, you can include a page for every category you use on your weblog.<br>
Add a property to your markdown files that specify in which category the post<br>
belongs and install this module to generate a page for that category.</p>
<p>You can install the module by running <code>npm install hexo-generator-category --save</code></p>
<h3 id="hexogeneratortag">hexo-generator-tag</h3>
<p>I don't have a tag page in my navigation, but you can select a tag and go to a page<br>
listing all the posts that are tagged with that particular tag. The hexo-generator-tag<br>
module is required for this functionality, so I suggest you install this if you like<br>
to enable people to browse your site by tag.</p>
<p>To install the module, you guessed it, use <code>npm install hexo-generator-tag --save</code></p>
<h3 id="hexogeneratorcname">hexo-generator-cname</h3>
<p>One of the interesting features of github pages is the fact that you can use a custom<br>
domain name for your github pages website. All you need to do is add a CNAME file with<br>
your custom domainname in it and link the Github IP-Address in your DNS registration<br>
to your domainname.</p>
<p>Hexo however, doesn't generate a CNAME file by default. So to get one, you need to<br>
add the hexo-generator-cname module to your website.</p>
<p>The module uses the URL setting from your website configuration to generate the CNAME file,<br>
so make sure that the URL corresponds to the custom domainname you have linked to the github<br>
pages IP-address.</p>
<h2 id="step4setupdeploymenttogithub">Step 4: Setup deployment to github</h2>
<p>With everything set up it's time to deploy your new website. For this you need to add<br>
one final plugin to Hexo. Install the hexo-deployer-git module using NPM and add the following<br>
bits of configuration to your _config.yml file to set it up:</p>
<pre><code class="language-yaml">deploy:
  type: git
  repository: https://github.com/[username]]/[username].github.io
  branch: master
</code></pre>
<p>Replace the <code>[username]</code> bits with your username and save the configuration.<br>
Now you can run the following set of commands to generate and deploy your website:</p>
<pre><code class="language-bash">hexo generate
hexo deploy
</code></pre>
<p>This will generate the HTML files and deploy them to the master branch of your personal github<br>
pages website. Notice that the deployer will use a force push to update the branch on github.<br>
If you plan on relying on the history of your master branch than I suggest you don't use this plugin<br>
but deploy everything manually. In most cases however I wouldn't worry about it, because the generated<br>
stuff matches what you've seen locally.</p>
<h2 id="finalstepmovingoveroldstuff">Final step: Moving over old stuff</h2>
<p>Now that you've seen what you need to do to set up a hexo based static website it's time to move over your old stuff.<br>
Since I was using octopress I had a relatively easy job. Copy over my markdown files to the <code>\_posts</code> folder and generate the website.</p>
<p>If you are coming from wordpress or some other blog platform you may want to take a look at the migrator plugins that are available.<br>
There's a plugin for blogger, wordpress, joomla and if that doesn't work you can always try to use the RSS migrator plugin which works<br>
well for the more obscure blog platforms.</p>
<p>If you haven't tried this stuff yet for yourself, please take 30 minutes and give it a shot! It may surprise you how easy it actually is.</p>
<!--kg-card-end: markdown-->
