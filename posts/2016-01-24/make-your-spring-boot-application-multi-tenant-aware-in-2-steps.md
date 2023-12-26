---
title: Make your Spring Boot application multi-tenant aware in 2 steps
category: Java
datePublished: '2016-01-24'
dateCreated: '2017-07-31'
---
<!--kg-card-begin: markdown--><p>Building a micro service using Spring Boot is quite a lot better than building<br>
everything by hand. But when you want to do something different it's a bit like<br>
eating mcDonalds. It's fast and easy, but not very good for you :-)</p>
<p>I ran into this kind of situation when I tried to add multi-tenant support to my<br>
micro service that was build in Spring Boot.</p>
<p>Multi-tenant support is important to me. Our team runs <a href="http://www.isknownow.com/">knowNow</a> a knowledge management<br>
system that is a SaaS solution that allows companies to simplify the way they share knowledge<br>
among colleagues. We offer a subscription service so that the customer doesn't have to worry<br>
about configuring servers, backing up databases etc.</p>
<p>This means we have to run a configuration that is as simple as possible. We don't want<br>
to roll out a service per customer as it is too expensive and too complex to manage.<br>
Instead we allow all customers to access the same number of service instances so that<br>
we only have to worry about load balancing to ensure that everything stays up.</p>
<p>In this post I will show you how I managed to configure a typical microservice<br>
with a database into a multi-tenant version of the same service.</p>
<!-- more -->
<h2 id="step1enabletenantselection">Step 1: Enable tenant selection</h2>
<p>The service I'm going to show you is a basic order service with just one method right now.<br>
You can submit a new order through the REST interface. Depending on a HTTP header it will<br>
generate a new sample order in the correct  database for that tenant.</p>
<p>In the sample code I use a HTTP header to switch between tenants, but you should not do that!<br>
Instead you should identify the tenant using a field in the authentication token. If you<br>
use JSON web tokens to identify users you will need a new field to the token to identify the tenant.</p>
<p>You may wonder: &quot;Why should I do that?&quot; If you allow the user to switch between tenants using something<br>
simple like a HTTP header you provide too much control to the client. It can switch to whichever tenant it likes.<br>
You should not allow that to happen. Instead, you should control to which tenant the authenticated user belongs<br>
and use that information to switch to the right tenant.</p>
<p>For the sample though, it's not doable to implement that as well as I don't know how you are going to<br>
implement the authentication bits of your micro service.</p>
<p>In Spring Boot you typically use Spring MVC to implement the REST interface for your micro service.<br>
So in order to allow the selection of a tenant with a HTTP header you're going to need to modify the controllers<br>
in your micro service.</p>
<p>Originally it will look like this:</p>
<pre><code class="language-java">@Controller
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;

    @RequestMapping(path = &quot;/orders&quot;, method= RequestMethod.POST)
    public ResponseEntity&lt;?&gt; createSampleOrder() {
        Order newOrder = new Order(new Date(System.currentTimeMillis()));
        orderRepository.save(newOrder);

        return ResponseEntity.ok(newOrder);
    }
}
</code></pre>
<p>It uses a repository to store the order information and return the order object to the client when the operation is completed.<br>
Nothing special here as you might have expected already.</p>
<p>Now to modify this controller to allow for tenant selection through the <code>X-TenantID</code> HTTP header.</p>
<pre><code class="language-java">@Controller
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;

    @RequestMapping(path = &quot;/orders&quot;, method= RequestMethod.POST)
    public ResponseEntity&lt;?&gt; createSampleOrder(@RequestHeader(&quot;X-TenantID&quot;) String tenantName) {
        TenantContext.setCurrentTenant(tenantName);

        Order newOrder = new Order(new Date(System.currentTimeMillis()));
        orderRepository.save(newOrder);

        return ResponseEntity.ok(newOrder);
    }
}
</code></pre>
<p>All you need to do to allow for tenant selection is to get the tenant identifier from the HTTP request<br>
using the <code>GetRequestHeader</code> annotation combined with an extra parameter for the method.</p>
<p>After you got the information from the request you need to store it somewhere where the rest of the application<br>
has access to it. It is important to use something that doesn't confuse two requests! The tenant of Request A<br>
can be very different from the tenant of Request B. So don't store the TenantID in a static property.</p>
<p>Instead build a class that stores the tenant information in a <code>ThreadLocal&lt;T&gt;</code> storage container.<br>
This ensures that the data is stored as part of the current request thread. Since other requests are executed as a<br>
different thread in the service you won't confuse the tenant information between two requests.</p>
<pre><code class="language-java">public class TenantContext {
    private static ThreadLocal&lt;Object&gt; currentTenant = new ThreadLocal&lt;&gt;();

    public static void setCurrentTenant(Object tenant) {
        currentTenant.set(tenant);
    }

    public static Object getCurrentTenant() {
        return currentTenant.get();
    }
}
</code></pre>
<p>With these two components modified you're ready to convert the rest of the service.</p>
<h2 id="step2convertthedataaccesscomponents">Step 2: Convert the data access components</h2>
<p>The whole multi-tenant thing leans on the correct use of the TenantContext class.<br>
One of the hard things to get right is the data-access layer of your micro service.</p>
<p>There's a ton of ways in which you can switch between tenants. For example, you<br>
can include a column that will identify to which tenant a record belongs.<br>
Another option is to introduce a different schema in the database for each tenant.<br>
Finally you can use different databases for each tenant.</p>
<p>All of the solutions lean on the correct use of the <code>TenantContext</code>. Apart from that<br>
they are quite different.</p>
<p>I will show you a solution that uses different databases for each tenant. This provides<br>
the maximum level of isolation. You can backup and restore data per tenant and you<br>
don't have to worry about a query giving you the wrong result when you forget to include<br>
the tenant column in the filter criteria.</p>
<p>Don't think that you have a much safer solution though with separate databases.<br>
All of this breaks down as soon as you fail to use the TenantContext correctly.</p>
<p>Lets' move on to modifying the data-access layer to support our multi-tenant strategy.<br>
I'm assuming you use Spring Data JPA as the main technique to access the database.<br>
In order to make this multi-tenant you need to implement a custom data source that allows<br>
the application to switch between different databases.</p>
<pre><code class="language-java">public class MultitenantDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        return TenantContext.getCurrentTenant();
    }
}
</code></pre>
<p>Not much in there, now is there? It turns out Spring JDBC supports our scenario out of the box.<br>
But you need a bit of configuration to configure the data source correctly.</p>
<p>Right now it won't do anything as you haven't configured it as the data source for your application.<br>
For that you need to add a new configuration class:</p>
<pre><code class="language-java">@Configuration
public class MultitenantConfiguration {

    @Autowired
    private DataSourceProperties properties;

    /**
     * Defines the data source for the application
     * @return
     */
    @Bean
    @ConfigurationProperties(
            prefix = &quot;spring.datasource&quot;
    )
    public DataSource dataSource() {
        File[] files = Paths.get(&quot;tenants&quot;).toFile().listFiles();
        Map&lt;Object,Object&gt; resolvedDataSources = new HashMap&lt;&gt;();

        for(File propertyFile : files) {
            Properties tenantProperties = new Properties();
            DataSourceBuilder dataSourceBuilder = new DataSourceBuilder(this.getClass().getClassLoader());

            try {
                tenantProperties.load(new FileInputStream(propertyFile));

                String tenantId = tenantProperties.getProperty(&quot;name&quot;);

                // Assumption: The tenant database uses the same driver class
                // as the default database that you configure.
                dataSourceBuilder.driverClassName(properties.getDriverClassName())
                        .url(tenantProperties.getProperty(&quot;datasource.url&quot;))
                        .username(tenantProperties.getProperty(&quot;datasource.username&quot;))
                        .password(tenantProperties.getProperty(&quot;datasource.password&quot;));

                if(properties.getType() != null) {
                    dataSourceBuilder.type(properties.getType());
                }

                resolvedDataSources.put(tenantId, dataSourceBuilder.build());
            } catch (IOException e) {
                // Ooops, tenant could not be loaded. This is bad.
                // Stop the application!
                e.printStackTrace();
                return null;
            }
        }

        // Create the final multi-tenant source.
        // It needs a default database to connect to.
        // Make sure that the default database is actually an empty tenant database.
        // Don't use that for a regular tenant if you want things to be safe!
        MultitenantDataSource dataSource = new MultitenantDataSource();
        dataSource.setDefaultTargetDataSource(defaultDataSource());
        dataSource.setTargetDataSources(resolvedDataSources);

        // Call this to finalize the initialization of the data source.
        dataSource.afterPropertiesSet();

        return dataSource;
    }

    /**
     * Creates the default data source for the application
     * @return
     */
    private DataSource defaultDataSource() {
        DataSourceBuilder dataSourceBuilder = new DataSourceBuilder(this.getClass().getClassLoader())
                .driverClassName(properties.getDriverClassName())
                .url(properties.getUrl())
                .username(properties.getUsername())
                .password(properties.getPassword());

        if(properties.getType() != null) {
            dataSourceBuilder.type(properties.getType());
        }

        return dataSourceBuilder.build();
    }
}
</code></pre>
<p>There's a lot to take in here. In order to use the custom data source you need to create a method<br>
in the configuration class called <code>dataSource</code>. This method returns a new instance of the<br>
<code>MultitenantDataSource</code> configured using a set of properties files loaded from the tenants folder.</p>
<p>So if you need to add another tenant you create a new properties file in the tenants folder<br>
relative to the JAR file that contains the micro service. Restart the micro service and it will pick<br>
up the new tenant.</p>
<p><strong>Note:</strong> You are required to have a default tenant database. This database is NOT used to store<br>
runtime data. It is required so that the entity manager factory and other components in the application<br>
can pick up the correct settings for the query generator JPA uses.</p>
<p>The multi-tenant data source that is configured as the data source for the application and will<br>
use the data sources you create per tenant. This makes it very flexible to use. If you want to use<br>
the tenants from some other source you're welcome to do so.</p>
<p>One important thing to keep in mind here: You can't load them from a configuration database.<br>
This has to do with some odd behavior in Spring Boot. It will load ALL datasources before configuring the<br>
rest of the application. This means that the application will try to load the configuration database<br>
data source and the multi-tenant data source at the same time. The latter however will require the former.<br>
This essentially disables your application completely.</p>
<h2 id="finalthoughts">Final thoughts</h2>
<p>Although not very complex I think it's good to have a guide like this when you try to convert your<br>
Spring Boot based micro service into a multi-tenant version of that service.</p>
<p>If you're interested in the sources, you can find them here: <a href="https://github.com/wmeints/spring-multi-tenant-demo">https://github.com/wmeints/spring-multi-tenant-demo</a></p>
<!--kg-card-end: markdown-->
