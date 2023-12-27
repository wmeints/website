---
title: project.json is going away and it's a good thing
category: .NET
datePublished: "2016-05-11"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>During the last community standup of the ASP.NET core team Damien announced that<br>

project.json is going away. This spurred a discussion on twitter that<br>
left me with the feeling that this is a bad thing.</p>

<p>I think my fellow tweeps are wrong on this matter and here's why.</p>
<!-- more -->
<p>Damien announced during the community standup of may 10th<br>
that the project.json file is going away. Damien also explained why.</p>
<h2 id="whyistheprojectjsongoingaway">Why is the project.json going away?</h2>
<p>The project.json file is very different from what we are used to in .NET.<br>
The file contains everything you need to get dependencies from nuget. It also<br>
contains information on how to compile the application. It's a mix of packages<br>
and project settings if you will.</p>
<p>There are a couple of good things to this. You can edit it using a text editor<br>
and manipulate it using the commandline utilities provided by ASP.NET Core / .NET CLI.<br>
Also, it doesn't list every file in the project which makes things very easy to manage.<br>
It certainly is more compact than the csproj files we are used to today.</p>
<p>However, supporting the project.json file takes a lot of effort. All the tools that you<br>
are familiar with today use the MSBuild based build tooling and don't support project.json<br>
all that well. In fact Visual Studio uses xproj files as a stunt double for the project.json<br>
file. This is rather weird and I always thought that Microsoft is making it a little too<br>
hard for themselves doing this.</p>
<p>Damien didn't explicitly state that this was one of the problems they had. But from<br>
what I gather it is at least part of the problem. Because Microsoft is going to automatically<br>
convert that xproj file into a csproj file from RTM onward.</p>
<p>Another problem is that tools like Xamarin studio use MSBuild files instead of the project.json<br>
file. And frankly MSBuild is still a great tool and there are a lot of companies that have<br>
many hours and huge amounts of money invested in MSBuild. That would all be out the window when<br>
Microsoft forces everyone over to project.json</p>
<h2 id="butcsprojisevil">But csproj is evil!</h2>
<p>Yes, csproj files today are evil. I know, they list every single file in the project folder<br>
that needs to be compiled by MSBuild. Also, it is very bloated to a point where people don't<br>
even bother to read what's actually in the file.</p>
<p>Those two things are bad. project.json provided a solution to those two problems.<br>
Are they throwing that away? No, they don't!</p>
<p>MSBuild is actually perfectly capable of creating itemgroups that refer to files<br>
using so called globbing patterns. It's just that Visual Studio doesn't use this kind<br>
of solution to list the files in the project. So the problem is not with MSBuild or the csproj file.<br>
It is with Visual Studio and Damien promised that this will be fixed once they start to move<br>
from the project.json file to a csproj file.</p>
<p>Also, they are going to clean up the csproj file as a whole and remove all the additional stuff<br>
that is in there that you don't need. That should give us a file that is much more compact than<br>
it is today.</p>
<p>Finally they will also make sure that you can still edit the csproj file using the commandline<br>
utilities provided by ASP.NET Core and the .NET CLI. This should help everyone who is developing<br>
from Mac or Linux too.</p>
<p>The one thing that isn't going away of course is the fact that csproj files are XML files.<br>
I think this isn't necessarily a problem, but I guess we like JSON better these days.<br>
I would go as far to say that JSON is the new XML. And if you think about it in that way, it's<br>
actually not that bad at all.</p>
<h2 id="whenwillthishappen">When will this happen?</h2>
<p>The project.json file move is something that isn't going to happen in RC2. The RC2 release<br>
is almost completed, so there's no time to make this change. The team is planning to<br>
move from project.json to csproj files gradually.</p>
<p>The RTM release will have a csproj file and a project.json file. The project.json file<br>
will contain less stuff than it does now. Most of the project settings will have moved<br>
over to the csproj file. The nuget packages however will remain in the project.json file.</p>
<p>Visual Studio will automatically create the csproj file for you and move the stuff from<br>
the project.json file into this new project file. I don't know about the other tools, but<br>
I guess they are going to something similar from Visual Studio code.</p>
<p>From what I understand now is that they will probably rename the project.json file to something like<br>
nuget.json. But this is still open right now.</p>
<p>After the RTM release is done, the team will start to work on moving the dependencies away<br>
from project.json. Again, the exact migration path isn't clear at the moment.</p>
<p>The essence of all this is that the project.json will not be gone over night. Also, the tooling<br>
will help you ease the pain of moving from project.json to a csproj file.</p>
<h1 id="conclusion">Conclusion</h1>
<p>To make a long story short: project.json is going away, but we get back a<br>
csproj that is much better than it used to be.</p>
<p>With the new csproj you get a compact build file that you can extend yourself.<br>
You can still integrate grunt tasks into build, but this time you can even write more complex<br>
stuff than that using MSBuild targets and custom itemgroups.</p>
<p>I personally feel that the move from project.json to the new and improved csproj file is a good thing.<br>
And I hope you find that too after reading this post.</p>
<p>For those who would like to see the community standup. Find it right here: <a href="https://www.youtube.com/watch?v=P9HqMZviaMg">https://www.youtube.com/watch?v=P9HqMZviaMg</a></p>
<!--kg-card-end: markdown-->
