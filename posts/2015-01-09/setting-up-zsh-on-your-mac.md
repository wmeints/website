---
title: Setting up ZSH on your mac
category: Productivity
datePublished: '2015-01-09'
dateCreated: '2017-07-31'
---
<!--kg-card-begin: markdown--><p>A few years back I started using a Mac at home for general computing and<br>
editing my photographs. I didn't look back at my Windows computer. Windows 8 is sort of meh<br>
and the Mac hardware just works as opposed to my last PC that failed at least once every<br>
year.</p>
<p>Now that I've used my Mac for a few years I am discovering even more about it that's great.<br>
One of the things I've found that is also great about the Mac is that it has a unix shell.<br>
Unix shell implementations are the best around, no matter what you use on there. Windows took<br>
a very long time to catch up with Powershell. Even now I think bash and zsh are still the best<br>
around. Maybe not so much for their scripting languages which have a weird syntax, but more<br>
so because there's so much knowledge on the internet on how to use them.</p>
<p>The most recent discovery is the zsh shell. The Z-shell as it is officially called is a shell<br>
that looks like bash, but has some features that I personally like better than the same functionality<br>
in bash. It's personal, but hey it is my weblog, so why not try to convince you to use it too on your Mac?</p>
<!-- more -->
<h2 id="whatmakeszshsogreat">What makes ZSH so great</h2>
<p>ZSH has some really cool features, especially for the console junkies amongst us. Here's a few<br>
that I found very useful to work with that don't come with bash:</p>
<ol>
<li>
<p>The tab auto-complete is interactive. Enter a partial name of a directory and press tab<br>
to autocomplete it. Next, tab through all the items and press enter when the item you want is<br>
selected in the list. This saves keystrokes, in bash you need to manually type in the name once<br>
you've found it. Or be lucky enough that there's just one item that matches.</p>
</li>
<li>
<p>Path autocompletion. When enter <code>/u/l/b</code> and press tab, zsh will autocomplete this to<br>
<code>/usr/local/bin</code> automatically. Pretty neat, if you want to be really fast around the filesystem.</p>
</li>
<li>
<p>Git command completion. Working with Git from the commandline? Enter git in the zsh shell<br>
and press tab to autocomplete it. Bash doesn't that kind of stuff for you mister!</p>
</li>
<li>
<p>Extended aliasing. Not much used I think, but it is nice to have. Set an alias like this:<br>
<code>alias -s html=chrome</code> and when I enter index.html on the terminal it will start Chrome with<br>
the index.html file.</p>
</li>
</ol>
<h2 id="installingzshonyourmac">Installing ZSH on your Mac</h2>
<p>Well not so much installing, because it is already installed on your Mac. To use zsh simply<br>
start your terminal and type the following command:</p>
<pre><code>sudo chshl -s zsh
</code></pre>
<p>This will set the default shell to be zsh. Restart the terminal program to use the new shell.</p>
<h2 id="ohmyzshtheresmore">Oh my zsh, there's more!</h2>
<p>Once zsh is installed, you can upgrade the experience even more with oh-my-zsh. This is a program<br>
available on github that adds more cool stuff like themes and additional commands to your zsh shell.</p>
<p>zsh is really powerful, but the setup can be hard to do by hand. This is why Robby Russel created<br>
oh-my-zsh. This tools configures your shell to be a little more useful than the default.</p>
<p>To install the extension to the zsh shell go to the <a href="https://github.com/robbyrussell/oh-my-zsh">Oh-my-zsh github page </a><br>
and follow the instructions there.</p>
<p>Once installed you will be given a .oh-my-zsh folder in your home directory which contains everything<br>
from this tool. Oh-my-zsh also customizes your .zshrc file in the home directory to contain the necessary<br>
config data to enable this tool.</p>
<p>The power of zsh is in the custom themes, which allow you to display git information in the prompt of<br>
your shell, such as the branch and the status of that branch. It also contains a huge number (150+) plugins.<br>
Ranging from developer specific extensions to more general purpose things. Check out the the<br>
<code>~/.oh-my-zsh/plugins</code> folder to find out which plugins there are.</p>
<h2 id="tipsandtricks">Tips and tricks</h2>
<p>Zsh on its own is great, it gets better with the customizations that oh-my-zsh offers, but there are<br>
a few things that I've added myself to complete the setup for my computer.</p>
<p>One of the things that really bothered me is that Alt+Left and Alt+Right doesn't work in zsh.<br>
Normally you use these commands to move back and forth between words in the current command.<br>
But instead of doing that, the zsh shell prints ackward characters on the terminal.</p>
<p>To fix this, type in cat <enter>.<br>
Then type in Alt+Left <space> and then Alt+Right.</p>
<p>Remember these keystrokes for now. And add the following lines to your .zshrc file:</p>
<pre><code>bindkey &quot;&lt;alt+left&gt;&quot; backword-word
bindkey &quot;&lt;alt+right&gt;&quot; forward-word
</code></pre>
<p>Replace the keystrokes in this snippet with the actual keycodes that you've discovered with<br>
the cat command you entered earlier.</p>
<p>Apart from this hack I use a number of plugins coming from oh-my-zsh</p>
<ul>
<li><a href="http://github.com/robbyrussel/oh-my-zsh/wiki/Plugins#git">git</a> - Obviously, I use git a lot and this saves a lot of time entering all those commands</li>
<li><a href="http://github.com/robbyrussel/oh-my-zsh/wiki/Plugins#git-flow">git-flow</a> - A companion to the above plugin.<br>
This makes it easier to work with the git flow, a popular method of working with git repos</li>
<li><a href="http://github.com/robbyrussel/oh-my-zsh/wiki/Plugins#osx">osx</a> - Extras for OS X.<br>
Use this on your mac to enable commands like <code>trash</code> to move stuff to the trashcan instead of deleting it.</li>
<li><a href="http://github.com/robbyrussel/oh-my-zsh/wiki/Plugins#npm">npm</a> - NPM command completion</li>
<li><a href="http://github.com/robbyrussel/oh-my-zsh/wiki/Plugins#npm">node</a> - Node command completion</li>
</ul>
<p>As for themes, there's a 100 to choose from, some more useful than others. But that's what you get with 100 themes for one shell.<br>
I personally settled for the mh theme, but I might change it to something a little more pleasant to the eyes later on.</p>
<h2 id="conclusion">Conclusion</h2>
<p>Discovering ZSH and the oh-my-zsh stuff is one very big happy hackers delight.<br>
If you have any tips, themes I should try or plugins that I should be using, let me know!</p>
<!--kg-card-end: markdown-->
