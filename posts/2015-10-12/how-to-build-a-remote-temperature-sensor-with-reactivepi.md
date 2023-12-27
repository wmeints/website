---
title: How to build a remote temperature sensor with ReactivePI
category: Scala
datePublished: "2015-10-12"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>Working with hardware on any platform involves working with a low-level programming language<br>

and a huge amount of constants that have weird values. That's at least how I remember building my first<br>
hardware/software interface.</p>

<p>Today this isn't much better. I love the raspberry PI and the fact that I can run Java applications on it.<br>
But what I absolutely dislike is the fact that I still have to write C programs in order to access the hardware interfaces.<br>
If you want to use the I2C bus on your Raspberry PI you have two choices: Use the python programming language or resort<br>
to C and use the appropriate system calls.</p>
<p>I think we can do better. I'm a fan of the Scala and Java programming languages. I really don't want to go back to an environment<br>
where I have to think hard about memory allocation and pointers. So why not build a library that enables me to write my<br>
IoT application in Scala or Java? I took on this challenge and made a lbirary that makes it easier to talk<br>
to things like I2C on your Raspberry PI.</p>
<p>In this post I will show you how I made a temperature monitor with ReactivePI, Scala and Akka to demonstrate<br>
that using a higher level programming language with proper GC support makes life better when building an IoT application.</p>
<!-- more -->
<h2 id="whatcanyoudoonceyouhavethedrivers">What can you do once you have the drivers?</h2>
<p>With ReactivePI you can do some pretty cool things on your Raspberry PI.<br>
There's a ton of sensors available for a small amount of money that connect to I2C. Almost all of them<br>
are very well documented. ReactivePI is very generic in the sense that it only knows about sending and receiving bytes.<br>
This means that it is also very flexible. Most sensors come with a sample that require you to send and receive specific<br>
sequences of bytes from a sensor in C. Translate this to Scala or Java with the use of Reactive PI and you should have<br>
the same results in about the same time or less.</p>
<p>One of the things I built using ReactivePI is a small weather station. One of the components in the weather station<br>
is a temperature sensor. I used the Adafruit MCP9808 sensor which you can buy from their website for just under $5.</p>
<p>The application I've created is a small Scala application that runs two actors: The temperature monitor which is going<br>
to periodically ask for the temperature by sending a message to the temperature sensor. The temperature sensor will<br>
read the temperature from the Adafruit MCP9808 sensor and send a message back to monitor with the temperature.</p>
<p>To create the temperature monitor I've written an Actor class that looks like this:</p>
<pre><code class="language-scala">package nl.fizzylogic.reactivepi.samples.temperaturemonitor

import akka.actor.{ActorLogging, Props, ActorRef, Actor}

import scala.concurrent.ExecutionContext

object TemperatureMonitor {
case object GetCurrentTemperature

def props(sensor: ActorRef) = Props(new TemperatureMonitor(sensor))
}

class TemperatureMonitor(sensor: ActorRef) extends Actor with ActorLogging {

import TemperatureMonitor._
import scala.concurrent.duration._

implicit val ec:ExecutionContext = context.system.dispatcher

context.system.scheduler.schedule(0 seconds,
5 seconds,self, GetCurrentTemperature)

def receive = {
case GetCurrentTemperature =&gt; loadTemperatureData()
case TemperatureSensor.SensorData(temperature) =&gt;
displayTemperatureData(temperature)
}

private def loadTemperatureData() = {
sensor ! TemperatureSensor.GetActualTemperature
}

private def displayTemperatureData(temperature:Int) = {
log.info(s&quot;The current temperature is $temperature&quot;)
}
}
</code></pre>

<p>When the monitor is asked for the temperature it will send a message to the connected<br>
sensor asking it to measure the current temperature. When the sensor has the data<br>
available it will send a message back to the monitor.</p>
<p>I skipped the code for reporting the temperature and instead log the value.<br>
If you haven't done anything special to your log settings the log statements will be printed on the terminal.</p>
<p>When the monitor actor is created it will automatically start sending itself temperature requests<br>
every 5 seconds. This is done by the call to the <code>context.system.scheduler.schedule</code> method.</p>
<p>With the temperature monitor set up it's time to write the logic needed for the temperature sensor.<br>
The temperature sensor code is similar to the monitor code, but doesn't include the scheduling code.</p>
<pre><code class="language-scala">package nl.fizzylogic.reactivepi.samples.temperaturemonitor

import akka.actor.{Actor, ActorLogging, ActorRef, Props}
import nl.fizzylogic.reactivepi.I2C
import nl.fizzylogic.reactivepi.i2c.Convert

object TemperatureSensor {

case object GetActualTemperature

case class SensorData(temperature: Int)

def props: Props = Props[TemperatureSensor]
}

class TemperatureSensor extends Actor with ActorLogging {

import TemperatureSensor.\_

// The adafruit MCP9808 sensor is configured to work on address 0x18.
// You can change this on the device itself by pulling one or more address pins to 3.3V
val sensor = I2C(1).device(0x18)

// The ambient temperature register can be read to retrieve the current temperature.
val MCP9808_REG_AMBIENT_TEMP: Byte = 0x05

var originalSender: ActorRef = null

def receive = idle

def waitingForSensorData: Receive = {
case I2C.Data(buffer) =&gt; sendSensorData(buffer)
}

def idle: Receive = {
case GetActualTemperature =&gt; loadTemperatureData()
}

private def loadTemperatureData() = {
log.info(&quot;Received request for the temperature&quot;)

    context.become(waitingForSensorData)

    originalSender = sender
    sensor ! I2C.Read(MCP9808_REG_AMBIENT_TEMP, 2)

}

private def sendSensorData(buffer: Array[Byte]) = {
originalSender ! SensorData(translateTemperature(buffer))
context.become(idle)
}

private def translateTemperature(buffer: Array[Byte]): Int = {
val wordData = Convert.wordToInt16(buffer)
val temperature = Math.round((wordData &amp; 0x0FFF) / 16.0).asInstanceOf[Int]

    if ((wordData &amp; 0x1000) != 0x00) {
      temperature - 256
    } else {
      temperature
    }

}
}
</code></pre>

<p>The temperature sensor accepts a <code>GetActualTemperature</code> message. When it receives this message<br>
it will load the temperature data from the MCP9808 sensor (Which is connected to the I2C bus).</p>
<p>To read data from the temperature sensor device the <code>TemperatureSensor</code> actor opens the first I2C bus<br>
and asks to communicate to the device connected on address 0x18 (The default address for the sensor).</p>
<p>Every time the sensor is asked for data we read 2 bytes and translate them into the actual temperature.<br>
The actual temperature is then send back to the monitor in the <code>sendSensorData</code> method.</p>
<p>Notice that the sensor is normally in idle mode. But when you send it a request for the temperature,<br>
it is switched to <code>waitingForSensorData</code> mode. This prevents problems where we get another request while<br>
waiting for a previous request to complete. You don't want to process two overlapping requests, since that would<br>
cause a problem on the I2C bus itself.</p>
<p><strong>Pro tip:</strong> You can improve this busy behavior by adding the <code>Stash</code> behavior extension to your actor.<br>
Stash all unexpected messages while in busy mode. Be sure to call <code>unstashAll()</code> when going back to idle<br>
mode so that all stashed messages become available again for processing.</p>
<p>Once the temperature data is retrieved the sensor is returned to its idle state.</p>
<p>To complete the application you need to write one more piece of code. The code that is going to connect the sensor<br>
to the monitor.</p>
<pre><code class="language-scala">class Program extends App {
  val actorSystem = ActorSystem(&quot;temperature-monitor&quot;)

val sensor = actorSystem.actorOf(TemperatureSensor.props, &quot;temperature-sensor&quot;)
val monitor = actorSystem.actorOf(TemperatureMonitor.props(sensor), &quot;temperature-monitor&quot;)  
}
</code></pre>

<p>When you compile this application on your Raspberry PI you will see temperature data<br>
scrolling slowly over your screen.</p>
<h2 id="addingakkaremoteactorstomakeitawesome">Adding Akka Remote Actors to make it awesome</h2>
<p>Getting the current temperature is kind of the thing that everyone does using Python. With ReactivePI and Akka though<br>
you can do something much nicer. How about monitoring the temperature data from your computer which talks to the temperature sensor actor on the Raspberry PI?</p>
<p>The scenario I will be showing you shortly works like this. The monitor actor instance will be running on your laptop/computer.<br>
The temperature sensor will be running on the Raspberry PI. To make this possible you first need to make sure you can run the application<br>
without actually starting any actor. Just make sure that the actor system is up and available across the network.</p>
<p>To do this I made use of a trick in the application startup logic:</p>
<pre><code class="language-scala">import akka.actor.ActorSystem

object Program extends App {
val parser = new scopt.OptionParser[StartupOptions]("temperature-monitor") {
head(&quot;monitor&quot;, &quot;0.1&quot;)

    // Specify a run mode (client or server)
    opt[String]('m',&quot;mode&quot;) action { (x,c) =&gt;
      // Copy the settings and set the client/server mode based on the provided option
      c.copy(sensor = x.equalsIgnoreCase(&quot;sensor&quot;), monitor = x.equalsIgnoreCase(&quot;monitor&quot;))
    } text(&quot;Application mode&quot;)

    checkConfig(opts =&gt; {
      if(!opts.sensor &amp;&amp; !opts.monitor) {
        failure(&quot;Invalid application mode. Allowed values: sensor or monitor&quot;)
      } else {
        success
      }
    })

}

parser.parse(args, StartupOptions()) match {
case Some(options) =&gt;
val actorSystem = ActorSystem(&quot;temperature-monitor&quot;)

      // When the application is run in monitor mode, it will try to access the
      // temperature sensor on the raspberry PI.
      if(options.monitor) {
        val sensor = actorSystem.actorOf(TemperatureSensor.props, &quot;temperature-sensor&quot;)
        val monitor = actorSystem.actorOf(TemperatureMonitor.props(sensor), &quot;temperature-monitor&quot;)
      }
    case None =&gt;

}
}
</code></pre>

<p>I added a commandline option parser. The parser itself is a whole different story, but for this application it adds the possibility to pass in the -m option.<br>
This sets the application either in sensor or monitor mode. In sensor mode only the actor system is started. When the application is started in monitor mode,<br>
the monitor as well as the sensor are started.</p>
<p>Sounds weird, starting the sensor on the computer that is going to work as the monitor. But it really isn't. The final piece of the puzzle is in the configuration<br>
of the sensor and monitor version of the application. When you start the application in sensor mode you have to make sure that the following content is available<br>
in the <code>application.conf</code> file of the application:</p>
<pre><code>akka {
  actor {
    provider = &quot;akka.remote.RemoteActorRefProvider&quot;
  }
  remote {
    enabled-transports = [&quot;akka.remote.netty.tcp&quot;]
    netty.tcp {
      hostname = &quot;127.0.0.1&quot;
      port = 2552
    }
 }
}
</code></pre>
<p>This enables Akka remoting, setting the listen port to 2552 and the published IP-address to 127.0.0.1.<br>
When you start the application in sensor mode on your Raspberry PI you will notice that it will start to listen on port 2552<br>
and go idle after that.</p>
<p>The monitor application config is a bit more complicated:</p>
<pre><code>akka {
  actor {
    provider = &quot;akka.remote.RemoteActorRefProvider&quot;
    deployment {
      /temperature-sensor {
        remote = &quot;akka.tcp://temperature-monitor@&lt;remote-ip&gt;:2552&quot;
      }
    }
  }
  remote {
    enabled-transports = [&quot;akka.remote.netty.tcp&quot;]
    netty.tcp {
      hostname = &quot;127.0.0.1&quot;
      port = 2552
    }
 }
}
</code></pre>
<p>When you start the application in monitor mode on your computer, it creates a new actor with the name <code>temperature-sensor</code>.<br>
Instead of starting the actor locally Akka will automatically<br>
deploy the actor to the actor system running in sensor mode on your Raspberry PI.</p>
<h2 id="tryitoutyourself">Try it out yourself!</h2>
<p>With the config in place and the startup logic modified you can now run your temperature monitor anywhere you like.<br>
In fact you can even add multiple sensors by starting multiple actors configured to be deployed to different Raspberry PI systems<br>
running in sensor mode.</p>
<p>Want to try this yourself? Check out the demo code at <a href="https://github.com/reactivepi/samples/">https://github.com/reactivepi/samples/</a></p>
<!--kg-card-end: markdown-->
