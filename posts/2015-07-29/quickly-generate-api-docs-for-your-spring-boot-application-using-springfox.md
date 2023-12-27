---
title: Quickly generate API docs for your Spring Boot application using Springfox
category: Java
datePublished: "2015-07-29"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>While working on one of the micro services that we're adding to knowNow I ran into an issue with documentation.<br>

In order for my teammates to quickly get up and going with the new service I needed some way to provide them<br>
with the documentation. Preferrably something that they can use to generate code from.</p>

<p>Since it's 2015 that means using <a href="http://swagger.io">Swagger</a>, a documentation format for REST services that describes the methods and<br>
models in your service in a JSON format. Together with Swagger UI you get a documentation format that is<br>
machine readable AND human readable. It also supports experimenting with the API, which is a big plus if you ask me.</p>
<p>Since I am building the micro service using Spring Boot, I had to find something that would integrate nicely with<br>
this toolset. After a short google run around the internet I found springfox. Springfox is a very very nice library<br>
that makes adding documentation to your spring boot application a breeze.</p>
<p>In this post I will show you how I did it and some of the weird things I ran into and how I solved them.</p>
<!-- more -->
<h2 id="theveryveryquickstartofspringfox">The very very quick start of Springfox</h2>
<p>Getting started with springfox is as simple as adding a class with some beans that need to be loaded<br>
by spring. To create this class you first need two dependencies in your project:</p>
<pre><code class="language-groovy">repositories {
  jcenter()
}

dependencies {
compile(&quot;io.springfox:springfox-swagger2:2.1.1&quot;)
compile(&quot;io.springfox:springfox-swagger-ui:2.1.1&quot;)  
}
</code></pre>

<p>For those of you that still use maven, check the docs here for information on <a href="http://springfox.github.io/springfox/docs/current/#dependencies">how to add the<br>
dependencies in Maven</a>.</p>
<p>After you have added the new dependencies to your project you need to add a new class<br>
to your application. This class will contain all the configuration needed for the API documentation.</p>
<pre><code class="language-java">import com.google.common.base.Predicate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.ApiSelectorBuilder;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger.web.UiConfiguration;

import static springfox.documentation.builders.PathSelectors.\*;

@Configuration
public class ApiDocumentationConfiguration {
@Bean
public Docket documentation() {
return new Docket()
.select()
.apis(RequestHandlerSelectors.any())
.paths(regex(&quot;/api/.\*&quot;))
.build()
.pathMapping(&quot;/&quot;)
.apiInfo(metadata());
}

    @Bean
    public UiConfiguration uiConfig() {
      return UiConfiguration.DEFAULT;
    }

    private ApiInfo metadata() {
      return new ApiInfoBuilder()
        .title(&quot;My awesome API&quot;)
        .description(&quot;Some description&quot;)
        .version(&quot;1.0&quot;)
        .contact(&quot;my-email@domain.org&quot;)
        .build();
    }

}
</code></pre>

<p>The configuration class contains one bean for the actual API documentation.<br>
The Docklet instance created contains some bits that make the swagger documentation tick.</p>
<p>The first thing you want to do is to filter the API endpoints being document using the  <code>select()</code> operation.<br>
This method returns an <code>ApiSelectorBuilder</code> which you can use to filter the controllers<br>
and methods being document by path using String predicates. You can also filter<br>
the controllers and methods using RequestHandlerSelectors. You can, for example,<br>
choose to only document controllers that have a certain annotation or name.</p>
<p>The above sample shows the endpoints filtered the endpoints based on the fact<br>
that they should start with <code>/api</code>. This filters out the health and metrics<br>
endpoints which are not part of the public API in my application and should not be documented.</p>
<p>I suggest you use the same pattern to separate your own API endpoints from the regular<br>
actuator endpoints exposed by Spring Boot. You don't want your customers poke around<br>
in there let alone know about them.</p>
<p>After building the selector you need to map the API to the root of the website<br>
using the <code>pathMapping(&quot;/&quot;)</code> operation. This does not have any effect on the actual endpoints<br>
served by the application. It serves as a base URL for the paths displayed in the documentation.</p>
<p>Finally you can append some metadata in the shape of ApiInfo, which contains things<br>
like the contact address, title and description of the API.</p>
<p>When you run the application with the configuration in place you will get some<br>
pretty decent API documentation without much effort. It doesn't look 100% right though.</p>
<h2 id="addingoperationmetadata">Adding operation metadata</h2>
<p>When I first ran my application with the configuration mentioned before,<br>
I discovered that according to my docs I was returning <code>*/*</code> as the mimetype<br>
for all operations on the API. That is not true, I am serving application/json, but<br>
my documentation apparently didn't know that.</p>
<p>To fix the issue I had to add the property <code>produces</code> to my <code>@RequestMapping</code> annotation<br>
with the value of <code>application/json</code>. Once I had that in place everything was working<br>
quite nicely.</p>
<p>While you are at it, fixing that, you should also add another annotation<br>
to your operations that will make the docs even better.</p>
<p>With the <code>@ApiOperation</code> annotation you can specify things like the default<br>
status code and the response type being returned when the operation completes<br>
successfully.</p>
<pre><code class="language-java">@ApiOperation(value = &quot;doStuff&quot;, nickname = &quot;doStuff&quot;, response = DoStuffResult.class)
@RequestMapping(method = RequestMethod.GET, produces = &quot;application/json&quot;)
public ResponseEntity&lt;?&gt; doStuff(@RequestBody DoStuffCommand command) {
    // Stuff
}
</code></pre>
<p>The <code>@ApiOperation</code> annotation offers not only a way to give an operation a proper<br>
name and response type when using Generic response types, you can also provide<br>
documentation for other responses than the regular HTTP 200 OK.</p>
<pre><code class="language-java">@ApiOperation(value = &quot;doStuff&quot;, nickname = &quot;doStuff&quot;, response = DoStuffResult.class)
@Responses({
    @ApiResponse(code =  404, message =&quot;Not found&quot;, response = GenericError.class),
    @ApiResponse(code =  400, message =&quot;Invalid input&quot;, response = GenericError.class)
})
@RequestMapping(method = RequestMethod.GET, produces = &quot;application/json&quot;)
public ResponseEntity&lt;?&gt; doStuff(@RequestBody DoStuffCommand command) {
    // Stuff
}
</code></pre>
<p>Take the time to document these additional responses, because when people generate<br>
code from your swagger spec, they will get the proper error handling for these<br>
error responses. They will be very thankful that you helped them improve their client!</p>
<h2 id="addingmodelmetadata">Adding model metadata</h2>
<p>Since we're talking developer convenience here, I have one more trick to add.<br>
By default springfox is able to document your request data and response data<br>
when you provide the annotations I described before. You will notice however<br>
that every attribute on every model posted to the API and returned by the API is optional.</p>
<p>This is probably not what you meant to tell the developer using your API.<br>
Some attributes will be required, others will not.</p>
<p>There is a way to add this information to the documentation.<br>
When you add the <code>@ApiModelProperty</code> annotation to field in a model class of your<br>
API, the springfox library will pick it up and enrich the swagger documentation<br>
with this information.</p>
<pre><code class="language-java">public class Article {
    @JsonProperty(required = true)
    @ApiModelProperty(notes = &quot;The title of the article&quot;, required = true)
    private String title;
}
</code></pre>
<p>For example, when you add the required property to the <code>@ApiModelProperty</code> annotation<br>
you will let the user of your API know it is required.</p>
<p>You can also add other properties like notes and example to help the user better<br>
understand what value he/she should enter in a specific attribute.</p>
<h2 id="makeyourapidocumentationvisible">Make your API documentation visible</h2>
<p>Now that you have properly documented your API you're probably wondering: How is my<br>
user going to read that documentation?</p>
<p>When you navigate to <code>/swagger-ui.html</code> you can see the documentation of your API.<br>
Don't want this on every micro service? Just remove the swagger-ui dependency and<br>
the UiConfiguration bean and you got rid of it.</p>
<p>You can point users that want to generate code based on your swagger spec to /v2/api-docs.<br>
When you don't like what you're seeing, don't worry, this can be changed too.<br>
Add the property <code>springfox.documentation.swagger.v2.path</code> to the <code>application.properties</code> file of your application and<br>
set its value to any path you'd like the docs to be available on.</p>
<p>Please be aware: Changing this property will break swagger-ui. This seems to be a bug<br>
in the springfox code. So do this at your own risk :-)</p>
<!--kg-card-end: markdown-->
