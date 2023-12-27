---
title: Get started with Azure IoT hub
category: Internet of Things
datePublished: "2016-01-11"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>Microsoft has launched a preview for Azure IoT hub a while back. I didn't have the time back then<br>

to check it out, but now that it has had some time to settle I think it's a good time to check things out.</p>

<p>This time however I'm not going to try the .NET API which is a first class language if you're working with<br>
Azure. Instead I'm going to see what it does when you try to use it from the Scala/Java perspective.</p>
<!-- more -->
<h2 id="whatisazureiothubandwhatdoesitofferyou">What is Azure IoT hub and what does it offer you?</h2>
<p>A typical IoT solution these days is made up of a couple of devices connected to some sort of control<br>
centre in a cloud.</p>
<p>Another property of such a solution is that the devices in a typical IoT solution will generate events<br>
that need to be handled by the central control centre in order to get value out of these events.</p>
<p>Depending on what you do, these events can generate quite a big stream of data. Take for example appliances<br>
like the fitbit. There are a lot of customers that have this device and each of these devices generates<br>
quite a few events for things like heartrate, steps etc.</p>
<p>How are you going to handle this type of load?</p>
<p>I don't know what fitbit is using, but you'd typically need something that scales beyond a single machine.<br>
It also needs to be async so that you can handle a huge load on a single machine to keep things cheap.</p>
<p>Microsoft offers a solution that does just that. Azure IoT Hub is an IoT oriented message hub that allows<br>
you to exchange messages between IoT devices and services using a number of protocols.<br>
Right now it supports HTTPS, MQTT and AMQPS. All of them secured using so-called Shared Access Keys. This<br>
means that the solution is secured, so you know that the measurements are coming from a trusted location.</p>
<h2 id="getthesoftware">Get the software</h2>
<p>To write a device application that connects to the Azure IoT hub you need the Azure IoT hub SDK for java.<br>
The SDK is hosted on <a href="https://github.com/Azure/azure-iot-sdks">Github</a>. As of the moment of writing there<br>
isn't a build available through maven so you have to make one yourself.</p>
<p>I used the following commands to get a build</p>
<pre><code class="language-bash">git clone https://github.com/Azure/azure-iot-sdks
cd azure-iot-sdks/java/device/iothub-java-client
mvn compile install -Dmaven.test.skip=true
</code></pre>
<p>After you compile and install the azure-iot-sdk locally in your maven repository you need to modify<br>
the build file for your Scala program to include the dependency:</p>
<pre><code class="language-scala">resolvers += Resolver.mavenLocal

libraryDependencies ++= Seq(
&quot;com.microsoft.azure.iothub-java-client&quot; % &quot;iothub-java-client&quot; % &quot;1.0.0-preview.8&quot;
)
</code></pre>

<p>Keep in mind the dependency can only be found in the local maven repository. So add the local<br>
maven repository to the resolvers in the build file. Without this you will get a build error.</p>
<h2 id="settingthingsup">Setting things up</h2>
<p>Before you can actually talk to the IoT hub on Azure you need to set one up. Thinglabs has<br>
<a href="http://thinglabs.io/rpi2/02/">an excellent guide to get you started</a>.</p>
<p>Once you have set up a new IoT hub in Azure and registered a device, save the Device Identifier and<br>
Device Key somewhere, you're going to need this in the application.</p>
<h2 id="programmingagainsttheiothub">Programming against the IoT Hub</h2>
<p>Azure IoT hub, as I mentioned in the beginning of this post, has a good API for .NET. It offers a Nuget<br>
package that you can download and use from C#. But how does it do in Java/Scala?</p>
<p>The foundations look pretty solid. Even from Scala the API is pretty easy to use. Setting up a client<br>
is pretty straightforward:</p>
<pre><code class="language-scala">val connectionString = &quot;HostName=[host];DeviceId=device01;SharedAccessKey=[key]&quot;
val connector = new DeviceClient(connectionString,IotHubClientProtocol.HTTPS)
</code></pre>
<p>It is important to keep in mind here is the hostname of your IoT hub instance in Azure and the device key<br>
which you need to enter as the SharedAccessKey. Please make sure that you enter a valid Base64 key.<br>
I ran into problems when trying things out, because I had an invalid key. It wasn't until I manually<br>
tried to decode the key that I discovered I actually had a copy-paste problem.</p>
<p>The documentation is quite limited for the Java software, so this sort of thing is quite easy to get wrong.</p>
<p>After I fixed my key problem it was quite easy to get messages delivered to the IoT hub. I wrote<br>
an actor using ReactivePI and connected it through a IotHubConnector actor.</p>
<pre><code class="language-scala">class EventHubConnector(connectionString: String, deviceIdentifier: String) extends Actor
with ActorLogging with IotHubProtocol {

import EventHubConnector.\_

val connector = new DeviceClient(connectionString,IotHubClientProtocol.HTTPS)

val eventCallback = new IotHubEventCallback {
override def execute(iotHubStatusCode: IotHubStatusCode, o: scala.Any) = {
// Make sure that the status is correct.
// Authorization errors should be raised as fatal as there's no way to recover from this scenario
// Everything else, retry and see if that fixes the problem.
iotHubStatusCode match {
case IotHubStatusCode.OK | IotHubStatusCode.OK*EMPTY =&gt; log.info(&quot;Delivered measurement&quot;)
case IotHubStatusCode.UNAUTHORIZED =&gt; throw new FatalHubException(&quot;Device key or identifier is invalid&quot;)
case * =&gt; throw new HubException(s&quot;Request failed: $iotHubStatusCode&quot;)
}
}
}

def receive = {
// Deliver incoming measurements to the IoT hub in azure.
case event:Measurement =&gt; sendEvent(event)
}

private def sendEvent(measurement: Measurement) = {
import spray.json.\_

    val msg = new Message(measurement.toJson.toString())

    connector.sendEventAsync(msg,eventCallback,null)

}

override def postStop() = {
connector.close()
}

override def preStart() = {
connector.open()
}

override def preRestart(reason: Throwable, message: Option[Any]) = {
// Reprocess the message when the original issue was caused by a delivery failure.
// If something else caused the problem, mark the message as unhandled and continue.
(reason,message) match {
case (_: HubException,Some(msg)) =&gt; self.tell(msg,sender)
case (_:Exception,Some(msg)) =&gt; unhandled(msg)
case (_,_) =&gt; // Do nothing in this case, nothing to be processed.
}
}

// Automatically restart for a maximum of 3 attempts when the delivery of a message failed.
// If something fatal happens, stop the process entirely and escalate the error.
override def supervisorStrategy: SupervisorStrategy = OneForOneStrategy(maxNrOfRetries = 3, withinTimeRange = 1 minute) {
case ex: FatalHubException =&gt;
log.error(ex,&quot;Failed to deliver event due to fatal error&quot;)
Escalate
case \_ =&gt;
log.error(&quot;Failed to deliver event due to temporary problem with connector&quot;)
Restart
}
}
</code></pre>

<p>The code in the sample is quite a bit to take in at once. So let's break it down bit by bit.<br>
The connector itself is an actor, this means it receives messages. Right now it receives<br>
only one message, a measurement. When it receives the measurement it will try to post it to<br>
the Azure IoT hub.</p>
<pre><code class="language-scala">def receive = {
  // Deliver incoming measurements to the IoT hub in azure.
  case event:Measurement =&gt; sendEvent(event)
}

private def sendEvent(measurement: Measurement) = {
import spray.json.\_

val msg = new Message(measurement.toJson.toString())

connector.sendEventAsync(msg,eventCallback,null)
}
</code></pre>

<p>To post a new measurement to the IoT hub the connector needs an actual connection.<br>
Connecting to an IoT hub is done by creating a new instance of the DeviceClient class.</p>
<pre><code class="language-scala">val connector = new DeviceClient(connectionString,IotHubClientProtocol.HTTPS)
</code></pre>
<p>The DeviceClient class supports multiple kinds of transports. Namely AMQPS, HTTPS and MQTT.<br>
The first one is actually a queueing protocol implemented by quite a few products such as RabbitMQ<br>
and Azure EventBus. HTTPS is the good old secure HTTP protocol that we know and love.<br>
MQTT is also a queueing protocol, but mostly used in IoT devices that don't have a lot of processing power.</p>
<p>I have tried all of them, but found that AMQPS and MQTT don't seem to work right now. MQTT gives a null reference error. The AMQPS seems to be unable to connect. So if you plan on using the preview use the HTTP<br>
transport for the device client.</p>
<p>One of the important things to get right in a connector like the one I built is that it is capable<br>
of retrying failed deliveries. You don't want to miss events due to connection problems.</p>
<p>Luckily it's not that hard to build a retry mechanism in akka, so I extended the actor<br>
with a retry policy.</p>
<pre><code class="language-scala">// Automatically restart for a maximum of 3 attempts when the delivery of a message failed.
// If something fatal happens, stop the process entirely and escalate the error.
override def supervisorStrategy: SupervisorStrategy = OneForOneStrategy(maxNrOfRetries = 3, withinTimeRange = 1 minute) {
  case ex: FatalHubException =&gt;
    log.error(ex,&quot;Failed to deliver event due to fatal error&quot;)
    Escalate
  case _ =&gt;
    log.error(&quot;Failed to deliver event due to temporary problem with connector&quot;)
    Restart
}
</code></pre>
<p>The actor will generate a <code>HubException</code> when a delivery fails or a <code>FatalHubException</code> when<br>
something is really wrong with the actor. In case of a regular <code>HubException</code> we try to restart<br>
the actor. In the case of a <code>FatalHubException</code> we stop the actor since there's no way the problem<br>
will resolve itself.</p>
<p>Upon restart we want to retry the message. You can make the actor reprocess a message by overriding<br>
the preRestart method of the actor. In this method you get the original error that caused the restart<br>
and the original message that wasn't processed.</p>
<pre><code class="language-scala">override def preRestart(reason: Throwable, message: Option[Any]) = {
  // Reprocess the message when the original issue was caused by a delivery failure.
  // If something else caused the problem, mark the message as unhandled and continue.
  (reason,message) match {
    case (_: HubException,Some(msg)) =&gt; self.tell(msg,sender)
    case (_:Exception,Some(msg)) =&gt; unhandled(msg)
    case (_,_) =&gt; // Do nothing in this case, nothing to be processed.
  }
}
</code></pre>
<p>I used pattern matching to find out what happened and how to handle the situation.</p>
<p>In case we get a HubException (the delivery failed) and we got a message to process, repost the<br>
message to the actor using the original sender.</p>
<p>In case we get an exception but have a message, we don't repost the message as its clearly problematic<br>
to process the message. Instead we mark it as unhandled. Unhandled message get posted to the deadletter queue<br>
in akka. If you want to handle this situation you need to write some logic to receive messages from<br>
the deadletter queue and alert an admin or something.</p>
<p>In all other cases we don't do anything and accept the fact that there's something unknown and<br>
there's no message we need to process in the actor.</p>
<p>The only thing left to do after implementing the IoT hub connector is to send some measurements to it.<br>
For that I modified the<br>
<a href="https://github.com/ReactivePI/samples/tree/master/temperature-monitor">temperature-sensor</a><br>
project a bit so that it posts the temperature measurements to the connector.</p>
<pre><code>connector ! IotHubConnector.Measurement(&quot;temperature&quot;, currentTemperature)
</code></pre>
<p>The connector itself is initialized using the following piece of code:</p>
<pre><code class="language-scala">val hubConnector = system.actorOf(EventHubConnector.props(connectionString, &quot;device03&quot;), &quot;hub-connector&quot;)
</code></pre>
<p>I like to give my actors a proper name so that I can easily debug things if something doesn't go the way<br>
I want it to go.</p>
<h2 id="finalthoughts">Final thoughts</h2>
<p>Talking to Azure IoT hub from Scala right now is a bit difficult to set up, but I didn't expect anything<br>
else from a technical preview. I think with a few more pull requests and a bit more help from Microsoft<br>
it could actually be quite useful in combination with libraries like <a href="https://github.com/reactivepi">ReactivePI</a>.</p>
<p>It's definitely worth a shot if you ask me.</p>
<!--kg-card-end: markdown-->
