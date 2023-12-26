---
title: Building containerized apps with vagrant
category: Docker
datePublished: '2015-01-27'
dateCreated: '2017-07-31'
---
<!--kg-card-begin: markdown--><p>Building apps that use docker as a means to deploy different services for the<br>
application is somewhat weird. You have to type in a lot of docker commands<br>
to get everything up and running. That is not all, on top of having to<br>
execute a lot of commands you also have to deal with a the rather long commands.<br>
There's quite a few things you can configure and you have to specify all that<br>
on the commandline.</p>
<p>In this post I will show you a tip that will save you a lot of time when you<br>
work a lot with docker containers.</p>
<!-- more -->
<h2 id="usevagrantinsteadofrunningonyourhost">Use vagrant instead of running on your host</h2>
<p>Believe me, running docker on your machine will cause headaches. Docker leaves<br>
intermediate images behind and sooner or later you will run into errors because<br>
you forgot to delete that old container.</p>
<p>If you haven't done so already, install <a href="http://www.vagrantup.com">Vagrant</a>.<br>
You will quickly learn to love this tool.</p>
<p>After you have done that, come back here and follow the rest of this guide<br>
to get going quickly with docker on vagrant.</p>
<h2 id="usingdockerimagesontopofvagrant">Using docker images on top of Vagrant</h2>
<p>The easiest method of using docker in combination with Vagrant is to create<br>
a new Vagrantfile in your project directory with the following contents:</p>
<pre><code class="language-ruby">Vagrant.configure(2) do |config|
  config.vm.box = &quot;ubuntu/trusty64&quot;

  config.vm.provider &quot;virtualbox&quot; do |v|
    v.customize [&quot;modifyvm&quot;, :id, &quot;--memory&quot;, &quot;2048&quot;]
    v.customize [&quot;modifyvm&quot;, :id, &quot;--cpus&quot;, &quot;2&quot;]
  end

  config.vm.provision &quot;docker&quot; do |docker|
    # Configure docker images on your machine
  end
end
</code></pre>
<p>This vagrantfile uses the 14.04 version of ubuntu as a starting point.<br>
On top of that base box, it will automatically install the latest version of<br>
docker.</p>
<p>I've changed the settings for the box a bit, so that you can get a little bit<br>
more power out of it. Tweak these settings when you only have one CPU or<br>
rather want to use more CPU and memory.</p>
<p>To pull in images from the central docker repository, you change the<br>
<code>config.vm.provision &quot;docker&quot;</code> call to include pull_images statements.<br>
For example, the following piece of code pulls in the consul and registrator<br>
images.</p>
<pre><code class="language-ruby">config.vm.provision &quot;docker&quot; do |docker|
  docker.pull_images &quot;progrium/consul&quot;
  docker.pull_images &quot;progrium/registrator&quot;
end
</code></pre>
<p>To run these images add the following extra code to the provisioning block:</p>
<pre><code class="language-ruby">config.vm.provision &quot;docker&quot; do |docker|
  docker.run &quot;progrium/consul&quot;,
    args: &quot;-p 8500:8500&quot;,
    cmd: &quot;-server -bootstrap&quot;
end
</code></pre>
<p>The command starts with run, the first argument is the name of the image.<br>
Additionally you can provide extra arguments for the docker run command through<br>
the args parameter. The cmd parameter allows you to add a command after the image<br>
portion of the docker run command. So the docker run statement above translates<br>
into <code>docker run -p 8500:8500 progrium/consul -server -bootstrap</code></p>
<h2 id="buildingdockercontainers">Building docker containers</h2>
<p>Running existing images as containers in your Vagrant box is okay, but wouldn't<br>
it be nice to be able to build images from your sources and run that as a container<br>
in the vagrant box?</p>
<p>You can build a new image through the following piece of code:</p>
<pre><code class="language-ruby">config.vm.provision &quot;docker&quot; do |docker|
  docker.build_image &quot;/vagrant/my_app&quot;, args: &quot;--tag=my_app/container:latest&quot;
</code></pre>
<p>This code issues a docker build command in the directory /vagrant/my_app, which is<br>
the my_app subfolder of the folder where you have your Vagrantfile stored.<br>
The args parameter can be used to pass in things like the tag for your docker image.</p>
<p>Make sure you run this command before the run command, so you have images ready<br>
to run inside the vagrant box.</p>
<h2 id="finaltips">Final tips</h2>
<p>The docker provision of Vagrant makes it easy to build and run docker containers<br>
on any developer machine, without having to setup docker. Especially developers<br>
using Mac OS X will find the Vagrant setup a lot easier to workwith then boot2docker.</p>
<p>You can make things really easy by making sure you map the ports exposed by your<br>
docker containers to ports on your host. This enables you to access the application<br>
services in the docker containers from your host by going to <code>http://localhost:\&lt;port\&gt;/</code><br>
instead of messing around with SSH etc.</p>
<p>Need to reload the docker config? Use vagrant <code>destroy -f &amp;&amp; vagrant up</code> to completely<br>
wipe your setup or just use <code>vagrant provision</code> to do an incremental upgrade of your box<br>
with the latest docker images.</p>
<p>Enjoy!</p>
<!--kg-card-end: markdown-->
