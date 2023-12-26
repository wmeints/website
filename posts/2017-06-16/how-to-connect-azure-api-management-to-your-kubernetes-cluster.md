---
title: How to connect Azure API management to your Kubernetes cluster
category: Docker
datePublished: '2017-06-16'
dateCreated: '2017-07-31'
---
<!--kg-card-begin: markdown--><p>For a customer I'm working on a new cloud architecture that will help them move to production quicker.<br>
The goal for our team is to setup a working product, but at the same time we're learning the customer how to build<br>
cloud applications using DevOps and continuous delivery.</p>
<p>Because this project is completely new, we use .NET core. Because stuff I would say. But also, because we think<br>
it is the way forward. To make things easier to deploy we package every service up as a docker container and deploy<br>
it in a Kubernetes cluster on Azure.</p>
<p>This setup is saving us tons of time. We have a runtime and development environment that is modern and suited for continuous<br>
deployment. Also, we can scale our application much easier than before. All we need to do is to tell kubernetes to scale a deployment<br>
to a specific number of pods.</p>
<p>One thing we were working on last week is the connection from the frontend to our services. We don't want people to access the services<br>
that we wrote in .NET core directly. We need a way to limit who can access our services and make sure that they aren't abusing our<br>
services by sending too many requests.</p>
<p>We use Azure API management as an API gateway. This tool provides us with a way to expose our REST services in a central location.<br>
Also it has things like rate limiting and all sorts of policies that you can apply to your services. For example, you can secure<br>
access using access tokens through a single policy for all your REST services. Pretty sweet.</p>
<h2 id="alliswellbutnotveryaccessiblesadly">All is well, but not very accessible sadly</h2>
<p>There is a problem with the setup we choose for our API gateway.</p>
<p>Kubernetes has this system where docker containers get virtual IP addresses that aren't directly accessible from outside<br>
the Kubernetes cluster or even from other docker containers.</p>
<p>To use a REST service that is deployed on Kubernetes, you need to define a service. You have several kinds<br>
of services on Kubernetes. One of the types that is supported is the ClusterIP service.<br>
It can be used to assign a virtual name and address to your deployment that<br>
is accessible within the Kubernetes cluster. For services that you want to access from the internet<br>
you can define a LoadBalancer service. This makes your deployment available from the internet.</p>
<p>If you want someone to access your only through an API gateway you typically expose your REST services as ClusterIP services and only expose the API Gateway through as a LoadBalancer service. That connects the API gateway to the<br>
internet while keeping the rest private, but accessible by the API gateway.</p>
<p>Azure API managemnt however is not part of your Kubernetes cluster. So the setup that I just described does not work.<br>
You could of course expose all your REST services as LoadBalancer service within Kubernetes and then hook them up to<br>
Azure API management. But that makes it less secure.</p>
<h2 id="connectazureapimanagementtoyourkubernetescluster">Connect Azure API management to your Kubernetes Cluster</h2>
<p>You can fix the problem however through a few clever tricks. The first step is to connect API management to your Kubernetes virtual network.</p>
<p>If you've setup Kubernetes on Azure using Azure Container Services, you have a virtual network for your Kubernetes cluster.<br>
Within this network there are a number of machines, one master and a few agents. Also, there's a load balancer for the public<br>
service registrations.</p>
<p>You can connect Azure API management to this subnet. Which ultimately gives it access to the services within your Kubernetes<br>
cluster. There are however some particular details you need to be aware of.</p>
<p>To connect your Azure API management instance, first create a new subnet within the virtual network that your Kubernetes nodes<br>
are located in. You can set it up as with an address range like <code>10.0.0.0/29</code>. It is a very small subnet. But that's the idea.</p>
<p>You cannot connect Azure API management to a subnet that contains other devices. It just doesn't like that. So we create a new<br>
subnet within our virtual network.</p>
<p><img src="/content/images/2017/07/subnet-configuration.png" alt="Subnet configuration"></p>
<p>Move over to your API management instance and select the item <em>Virtual network</em> from the left side of the configuration panel.<br>
From the list of locations displayed in this panel, select the region that you want to connect.</p>
<p><img src="/content/images/2017/07/virtual-network-config.png" alt="Virtual network configuration"></p>
<p>Then select the virtual network of your Kubernetes cluster and the new subnet you created earlier.</p>
<p><img src="/content/images/2017/07/connection-props.png" alt="Connection properties"></p>
<p>Save the changes and wait for 15 - 45 minutes. Just enough time for a cup of coffee :-)</p>
<h2 id="exposeyourcontainersinthecorrectway">Expose your containers in the correct way</h2>
<p>Earlier I talked about two types of services, ClusterIP and LoadBalancer services. The ClusterIP services only work within the Kubernetes<br>
cluster. They DO NOT work in the virtual network you expanded with the API gateway subnet.</p>
<p>You can still get your API gateway to connect to your REST services however. But you need a different kind of service.<br>
You need to define your service as a NodePort service.</p>
<pre><code class="language-yaml">kind: Service
apiVersion: v1
metadata:
  name: coolservice
  labels:
    app: my-app
spec:
  type: NodePort 
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 5000
      targetPort: 5000
</code></pre>
<p>When you define a service within Kubernetes as NodePort, Kubernetes will open a port on the agent nodes and route it to your docker container defined using the <code>ports</code> section of the spec. This means that to use the service from the network rather than another<br>
container in the Kubernetes cluster, you will need to use the routed port rather than the port you defined.</p>
<h2 id="configureyourrestservicesinazureapimanagement">Configure your REST services in Azure API management</h2>
<p>Now that you have a service listening within the virtual network there is only last hurdle to take. You can configure your REST services through the Azure portal in your Azure API management instance.</p>
<p>You can either define your API by hand or import it using a swagger file. On our team we use swagger, generated by a library<br>
called Swashbuckle. It analyzes your ASP.NET core app and automatically infers what should be the swagger spec.</p>
<p>To import the swagger spec in Azure API management, you normally provide the URL and Azure API management will import it without<br>
problems. But that's different in this specific case. Your REST service cannot be reached from the Azure management portal and therefor<br>
cannot be imported.</p>
<p>So instead, save the swagger spec on disk and upload it to the portal. But before you do, make sure that you modify it a little bit.<br>
The management portal expects a hostname and a set of schemes in the swagger spec. Both of these are invalid or missing, depending<br>
on how you generated the swagger spec.</p>
<p>To fill them with correct values, make sure that your json looks like this:</p>
<pre><code class="language-json">{ 
    ....
    &quot;host&quot;: &quot;&lt;agent-ip&gt;:&lt;agent-port&gt;&quot;,
    &quot;schemes&quot;: [ &quot;http&quot; ]
    ....
}
</code></pre>
<p>The agent IP is the IP-address of the Kubernetes agent that contains your NodePort service that you just created.<br>
The NodePort is the port of the service. You can find this by looking at the services in the Kubernetes UI.</p>
<p><img src="/content/images/2017/07/service-config-1.png" alt="Service configuration"></p>
<p>A NodePort service has two ports exposed. One is the port you specified in the service spec. The other port is the public port<br>
on the Kubernetes agent that routes to the port you specified. This port is within the 30.000 range. Use that port in your JSON.</p>
<p>For the agent IP you have to look at your Azure Portal. Usually the first agent has address <em>10.240.0.4</em>.</p>
<p>When you've configured these settings, save the file and import it into your API gateway.</p>
<p>And that's it. You're good to go!</p>
<!--kg-card-end: markdown-->
