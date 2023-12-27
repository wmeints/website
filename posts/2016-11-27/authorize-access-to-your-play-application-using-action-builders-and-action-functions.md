---
title: >-
  Authorize access to your Play application using action builders and action
  functions
category: Scala
datePublished: "2016-11-27"
dateCreated: "2017-07-31"
---

<!--kg-card-begin: markdown--><p>When you think about Scala web applications you’re probably thinking Play. This framework to me is the de facto standard for<br>

building web applications in Scala. It offers a great set of features that make it really easy to build web applications.</p>

<p>The framework looks very similar to Rails and ASP.NET Core. I think it has the great things of both and adds more on top of<br>
that by enabling Akka actors and a functional programming style that I find more logical to use these days.</p>
<p>One thing that ASP.NET Core and other frameworks have that Play doesn’t have is a proper set of authorization classes<br>
and interfaces. Sure there’s deadbolt and play-authenticate. But I found that deadbolt is a bit hard to use. There’s a<br>
lot of stuff you have to do to secure your app.</p>
<p>In this post I will show you how you can secure access to your app using a basic set of action builders and action filters.</p>
<!-- more -->
<h2 id="actionsinplay">Actions in Play</h2>
<p>Instead of regular methods Play uses so-called action builders. An action in Play is defined using the following code:</p>
<pre><code class="language-scala">class MyController extends Controller {
  def myAction = Action {
    Ok(&quot;Hello world&quot;)
  }
}
</code></pre>
<p>You basically tell the application that there’s a piece of code that it can use to complete a route that is defined in the routes file.</p>
<pre><code class="language-scala">GET /some-path    controller.MyController.myAction
</code></pre>
<p>The output of the action is the Result of action. This can be any HTTP status code with some content attached to it. What content that is,<br>
is entirely up to you. You can send JSON, HTML, XML or some other format if you like.</p>
<p>The term Action is a class that derives from the ActionBuilder class. A basic action doesn’t do much. When the HTTP request is handled by<br>
Play it will automatically invoke the block of code that follows the Action keyword in your code.</p>
<p>Implementing your own action builder<br>
You can do some pretty interesting things with ActionBuilders to extend the behavior of an action. For example, you can perform authorization<br>
checks before you allow the application to execute the block that you defined.</p>
<p>Before we dive into authorization let’s build a basic action builder that logs the current request. First you need to create a new class that<br>
derives from ActionBuilder. In the sample I’ve gone for the LoggedAction definition. But you can give it any name you want.</p>
<pre><code class="language-scala">import play.Logger;

object LoggedAction extends ActionBuilder[Request] {
override def invokeBlock[A](request: Request[A], block: (Request[A]) =&gt; Future[Result]): Future[Result] = {
Logger.debug(s&quot;Received request for ${request.path}&quot;)
block(request)
}
}
</code></pre>

<p>The action builder has a method called invokeBlock. It gets a block and the request. It should return a Future[Result].</p>
<p>The action builder implementation for a logged action is rather simple. Grab a logger and write a message to it.<br>
After we’ve done that, continue the execution of the original block.</p>
<p>To use the the ActionBuilder implementation you can add it to your controller or you could place it in a separate file. It depends on whether<br>
you want the action builder to be reusable across controllers. With the new action builder you can create a logged action like so:</p>
<pre><code class="language-scala">class MyController extends Controller {
  def myAction = LoggedAction {
    Ok(&quot;Hello world&quot;)
  }
}
</code></pre>
<h2 id="authorizingaccesstoaparticularaction">Authorizing access to a particular action</h2>
<p>Let’s make things a little more complex. Now that you’ve seen how you can build an action builder in Play I want to show you how you can<br>
create a reusable piece of authorization logic for your controllers.</p>
<p>The first step is to create a new trait with the name AuthorizationSupport so that we can say something like this:</p>
<pre><code class="language-scala">class MyController extends Controller with AuthorizationSupport {
  
}
</code></pre>
<p>This is a controller that has AuthorizationSupport. Which is nice, since now I know that my controller has actions that need authenticated users.<br>
I like this style since it tells you straight up what you can expect to see in your controller code.</p>
<p>Within this trait we’re going to define a custom action builder that requires users to be authenticated before they can execute an action:</p>
<pre><code class="language-scala">trait AuthorizationSupport extends Controller {
  object AuthenticatedAction extends ActionBuilder[RequestWithPrincipal] {
    override def invokeBlock[A](request: Request[A], block: (RequestWithPrincipal[A]) =&gt; Future[Result]): Future[Result] = ???
  }
}
</code></pre>
<p>The implementation of the action builder is as follows. When a principal can be found on the request the code in the provided block should be executed<br>
with a request object that provides access to the current user. If a user cannot be found, the result should be the login page.</p>
<pre><code class="language-scala">trait AuthorizationSupport extends Controller {
  def authorizationHandler: AuthorizationHandler

object AuthenticatedAction extends ActionBuilder[RequestWithPrincipal] {
override def invokeBlock[A](request: Request[A], block: (RequestWithPrincipal[A]) =&gt; Future[Result]): Future[Result] = {
def unauthorizedAction = authorizationHandler.unauthorized(RequestWithOptionalPrincipal(None, request))
def authorizedAction(principal: Principal) = block(RequestWithPrincipal(principal, request))

      authorizationHandler.principal(request).fold(unauthorizedAction)(authorizedAction)
    }

}
}
</code></pre>

<p>The fragment above determines the current principal using an authorization handler implementation that you need to provide to the AuthorizationSupport trait.<br>
I’ve opted for this so that the logic to determine the current principal is not in the controller itself. Imagine that you have twenty controllers all<br>
duplicating this logic. That’s not very maintainable. I’ve done the same with the logic to show the login page when the user is not authenticated so that<br>
both pieces of logic are reusable across multiple controllers.</p>
<p>The code for the AuthorizationHandler trait looks like this:</p>
<pre><code class="language-scala">trait AuthorizationHandler {
  def unauthorized[A](request: RequestWithOptionalPrincipal[A]): Future[Result]
  def principal[A](request: Request[A]): Option[Principal]
}
</code></pre>
<p>The action builder invokes the original code block using a RequestWithPrincipal instance. I’ve done that because I want the principal to be available<br>
to you in the controller action. The RequestWithPrincipal class is a wrapped request that has all the original properties of the incoming request<br>
but with an additional principal property.</p>
<pre><code class="language-scala">import play.api.mvc.{Request, WrappedRequest}

object RequestWithPrincipal {
def apply[A](principal: Principal, request: Request[A]): RequestWithPrincipal[A] = {
new RequestWithPrincipal(principal, request)
}
}

class RequestWithPrincipal[A](val principal: Principal, request: Request[A]) extends WrappedRequest[A](request) {

}
</code></pre>

<p>You can use the action builder in your controller by calling the AuthenticatedAction action builder. The code block that comes directly after<br>
that is supplied with a RequestWithPrincipal instance so you can make use of the current principal.</p>
<pre><code class="language-scala">class MyController @Inject() (authorizationHandler: AuthorizationHandler) extends Controller with AuthorizationSupport {
  def myAction = AuthenticatedAction { implicit request =&gt;
    Ok(s&quot;Hello ${request.principal.identifier}&quot;)
  }
}
</code></pre>
<p>We’ve talked about externalizing some of the code for authorization to an external AuthorizationHandler. The handler can be implemented<br>
by creating a new class called ApplicationAuthorizationHandler that extends the AuthorizationHandler trait.</p>
<pre><code class="language-scala">class ApplicationAuthorizationHandler extends AuthorizationHandler {
  override def unauthorized[A](request: RequestWithOptionalPrincipal[A]): Future[Result] = {
    Future {
      Unauthorized(views.html.login())
    }
  }
}
</code></pre>
<p>You need to register this class with the application module so that Play is able to inject it automatically for you.</p>
<pre><code class="language-scala">class Module extends AbstractModule {
  override def configure() = {
    // ... Other bindings
    bind(classOf[AuthorizationHandler]).to(classOf[ApplicationAuthorizationHandler])
  }
}
</code></pre>
<p>With this you have a complete solution for authorizing access to authenticated users in your application. But that<br>
doesn’t make it a complete authorization solution if you ask me.</p>
<h2 id="refiningaccessusingactionfunctions">Refining access using action functions</h2>
<p>In any practical situation you need to have more than just action builders that allow only authenticated users.<br>
You need a way to restrict access to parts of your application based on claims, roles or permissions.</p>
<p>There’s a need trick that you can use to build a component that restricts access to a specific set of claims, roles or<br>
permissions. Play supports the use of action functions.</p>
<p>There are three kinds of action functions in Play:</p>
<ol>
<li>ActionFilter</li>
<li>ActionTransformer</li>
<li>ActionRefiner</li>
</ol>
<p>The ActionFilter can be used to stop an action from executing given that a certain condition is met. You need to implement<br>
the filter function that either returns Some(Result) or a None in case you want the action to be executed.</p>
<p>Alternatively you can use the ActionTransformer if you don’t need to filter an action, but you want to transform the request<br>
so that it contains extra information for the action. This trait contains the transform function that you need to implement.<br>
In this function you can transform the incoming request to another type of request.</p>
<p>The final and most powerful action function is the ActionRefiner. This action function can transform and filter actions based<br>
on your input. This trait contains the refine function that you need to implement in order to refine the action.</p>
<p>In case of our authorization operation you can use this function to do a couple of things. First you need to check if the<br>
incoming request meets the authorization conditions that you specify. If the user is not authorized the original action<br>
should not be executed. Instead the user should see an access denied page. In the other case where the user is authorized<br>
the original action should be executed.</p>
<p>An ActionRefiner implementation is a complex beast that requires some getting used to. So let’s implement one step-by-step.</p>
<pre><code class="language-scala">trait AuthorizationSupport {
  def authorizationHandler: AuthorizationHandler
  
  // ...

def authorizeUsingPolicy(policy: AuthorizationPolicy): ActionRefiner[RequestWithPrincipal, RequestWithPrincipal] =
new ActionRefiner[RequestWithPrincipal, RequestWithPrincipal] {
override protected def refine[A](request: RequestWithPrincipal[A]): Future[Either[Result, RequestWithPrincipal[A]]] = {
//TODO: Insert your code here.
}
}
}
</code></pre>

<p>The above code demonstrates the basic structure of the authorizeUsingPolicy action refiner. I’ve defined it as a method<br>
so that I can inject an authorization policy which is going to perform the actual access check.</p>
<p>The action refiner returns a Future of either a Result or a Request. If you return a Left(Result) this means that the action should<br>
not be executed. Instead the result you created should be sent to the client. If you return Right(SomeRequest) the action gets executed<br>
with the specified request.</p>
<p>In order to apply this to our authorization check we need to make sure that when the authorization policy returns False, the user<br>
gets the access denied page.</p>
<pre><code class="language-scala">trait AuthorizationSupport {
  def authorizationHandler: AuthorizationHandler
  
  // ...

def authorizeUsingPolicy(policy: AuthorizationPolicy): ActionRefiner[RequestWithPrincipal, RequestWithPrincipal] =
new ActionRefiner[RequestWithPrincipal, RequestWithPrincipal] {
override protected def refine[A](request: RequestWithPrincipal[A]): Future[Either[Result, RequestWithPrincipal[A]]] = {
if(!policy.allowed(request)) {
authorizationHandler.denied(request).map(Left(\_))
} else {
//TODO: Allow action to continue
}
}
}
}
</code></pre>

<p>I’m using the AuthorizationHandler implementation from earlier to achieve the desired effect. Remember, this is to make the code<br>
more reusable across my controllers.</p>
<p>If authorization policy check was successful we need to return Right(SomeRequest) so that the original action is executed.</p>
<pre><code class="language-scala">trait AuthorizationSupport {
  def authorizationHandler: AuthorizationHandler
  
  // ...

def authorizeUsingPolicy(policy: AuthorizationPolicy): ActionRefiner[RequestWithPrincipal, RequestWithPrincipal] =
new ActionRefiner[RequestWithPrincipal, RequestWithPrincipal] {
override protected def refine[A](request: RequestWithPrincipal[A]): Future[Either[Result, RequestWithPrincipal[A]]] = {
if(!policy.allowed(request)) {
authorizationHandler.denied(request).map(Left(\_))
} else {
Future.successful(Right(request))
}
}
}
}
</code></pre>

<p>You can combine the authorizeUsingPolicy action function with the AuthenticatedAction action builder to complete the authorization pipeline:</p>
<pre><code class="language-scala">class MyController @Inject() (val authorizationHandler: AuthorizationHandler, myPolicy: CustomPolicy) extends Controller with AuthorizationSupport {
  def myAction = (AuthenticatedAction andThen authorizeUsingPolicy(myPolicy)) { implicit request =&gt;
    Ok(s&quot;Hello ${request.principal.identifier}&quot;)
  }
}
</code></pre>
<h2 id="finalthoughtsandresources">Final thoughts and resources</h2>
<p>Action builders and action filters allow for some pretty powerful request pipeline in Play. Authorization is just one of the ways in which<br>
you can modify requests before controller logic is executed.</p>
<p>You can combine multiple types of action builders together with a mix of action functions to a complex pipeline of logic that is reusable<br>
across your application controllers. You can, for example , combine logging with authorization and other functionality without writing a lot of code.</p>
<p>If you’re interested in the code, it’s up on <a href="https://github.com/wmeints/padlock">Github</a>. Feel free to drop me a pull request<br>
if you think something can be done differently or have a feature to add :-)</p>
<!--kg-card-end: markdown-->
