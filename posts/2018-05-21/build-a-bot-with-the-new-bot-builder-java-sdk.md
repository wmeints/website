---
title: Learn how to build a bot with the new Microsoft Bot Builder Java SDK
category: Chatbots
datePublished: '2018-05-21'
dateCreated: '2018-05-19'
---
<!--kg-card-begin: markdown--><p>Bot builder from Microsoft has been around for a couple of years now. During <a href="https://www.microsoft.com/en-us/build">Build 2018</a> a preview of version 4.0 was launched with support for more languages. Previously you could only build a bot in C# or Node. Now you can build one in Java or Python too.</p>
<p>In this post I will take you on a short tour through the Java version of this framework and show you how it works and what you can expect in the near future.</p>
<h2 id="gettingthelibraries">Getting the libraries</h2>
<p>As of the moment of writing, the Bot Builder SDK for Java is still in preview. And it is a really early preview. They published the bits on Maven Central, but something failed and you can't use it from that location.</p>
<p>To get the bits, there are a few steps that you have to perform on your machine.</p>
<p>First clone the repository to disk</p>
<pre><code class="language-bash">git clone https://github.com/Microsoft/botbuilder-java.git 
</code></pre>
<p>Next open up a terminal and navigate to the directory where the project is cloned. Then run the following command:</p>
<pre><code class="language-bash">mvn clean install
</code></pre>
<p>This will compile, test, package and publish the project to your local maven repository. Once you've done that, you can add the Bot Builder SDK to your Java project.</p>
<pre><code class="language-xml">&lt;dependency&gt;
    &lt;groupId&gt;com.microsoft.bot.connector&lt;/groupId&gt;
    &lt;artifactId&gt;bot-connector&lt;/artifactId&gt;
    &lt;version&gt;4.0.0-a0&lt;/version&gt;
&lt;/dependency&gt;
</code></pre>
<h2 id="buildyourbotinfrastructure">Build your bot infrastructure</h2>
<p>When you build a chatbot with Microsoft Bot Builder you are building a REST service. The REST service accepts incoming chat messages and handles them by sending replies to the user through the bot connector client.</p>
<p>The image below give you a short overview of the structure of what a typical bot looks like.</p>
<p><img src="/content/images/2018/05/BotSchematic.png" alt="Bot schematic"></p>
<p>There are many implementations of web frameworks in Java among which Spring Boot is a pretty big one. But today I'm not going to show you how to build your bot in Spring Boot. Instead I will show you a very basic bot on top of Tomcat a standard implementation of the Java Servlet API.</p>
<p>The first thing you need are the tomcat dependencies and something that can serialize/deserialize bot framework messages.</p>
<pre><code class="language-xml">&lt;dependency&gt;
    &lt;groupId&gt;org.apache.tomcat&lt;/groupId&gt;
    &lt;artifactId&gt;tomcat-api&lt;/artifactId&gt;
    &lt;version&gt;9.0.8&lt;/version&gt;
    &lt;scope&gt;provided&lt;/scope&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;com.fasterxml.jackson.core&lt;/groupId&gt;
    &lt;artifactId&gt;jackson-databind&lt;/artifactId&gt;
    &lt;version&gt;2.9.5&lt;/version&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;com.fasterxml.jackson.datatype&lt;/groupId&gt;
    &lt;artifactId&gt;jackson-datatype-joda&lt;/artifactId&gt;
    &lt;version&gt;2.9.5&lt;/version&gt;
&lt;/dependency&gt;
</code></pre>
<p>The tomcat dependencies are provided by Tomcat so I don't need to package them with my web application. That's why I used the <code>&lt;scope&gt;provided&lt;/scope&gt;</code> for that dependency.</p>
<p>The other dependency you need is the jackson object mapper. Jackson is the go-to library for working with Json in Java. Because bot framework sends date values you need to include the joda time module for Jackson as well.</p>
<p>You implement the bot interface as a HTTP servlet. This servlet will provide the gateway between the incoming channel and the bot.</p>
<pre><code class="language-java">public final class ChatBotServlet extends HttpServlet {
    private static Logger logger = Logger.getLogger(ChatBotServlet.class.getName());

    private final ObjectMapper objectMapper;
    private final CredentialProvider credentialProvider;
    private final ServiceClientCredentials clientCredentials;
    private final ChatBot bot;

    /**
     * Initializes new instance of {@link ChatBotServlet}
     */
    public ChatBotServlet() {
        this.credentialProvider = new CredentialProviderImpl(getAppId(), getKey());
        this.objectMapper = ObjectMapperFactory.createObjectMapper();
        this.clientCredentials = new MicrosoftAppCredentials(getAppId(), getKey());
        this.bot = new ChatBotImpl();
    }

    /**
     * Handles HTTP POST requests
     *
     * @param request  Incoming HTTP request
     * @param response Outgoing HTTP response
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
        try {
            String authorizationHeader = request.getHeader(&quot;Authorization&quot;);
            Activity activity = deserializeActivity(request);

            // Make sure that the request has a proper authorization header
            // If not, this raises an authentication exception.
            JwtTokenValidation.assertValidActivity(activity, authorizationHeader, credentialProvider);

            // The outgoing messages are not sent as a reply to the incoming HTTP request.
            // Instead you create a separate channel for them.
            ConnectorClient connectorInstance = new ConnectorClientImpl(activity.serviceUrl(), clientCredentials);
            ConversationContext context = new ConversationContextImpl(connectorInstance, activity);

            bot.handle(context);

            // Always send a HTTP 202 notifying the bot framework channel that we've handled the incoming request.
            response.setStatus(202);
            response.setContentLength(0);
        } catch (AuthenticationException ex) {
            logger.log(Level.WARNING, &quot;User is not authenticated&quot;, ex);
            writeJsonResponse(response, 401, new ApplicationError(&quot;Unauthenticated request&quot;));
        } catch (Exception ex) {
            logger.log(Level.SEVERE, &quot;Failed to process incoming activity&quot;, ex);
            writeJsonResponse(response, 500, new ApplicationError(&quot;Failed to process request&quot;));
        }
    }

    /**
     * Writes a JSON response
     *
     * @param response   Response object to write to
     * @param statusCode Status code for the request
     * @param value      Value to write
     */
    private void writeJsonResponse(HttpServletResponse response, int statusCode, Object value) {
        response.setContentType(&quot;application/json&quot;);
        response.setStatus(statusCode);

        try (PrintWriter writer = response.getWriter()) {
            objectMapper.writeValue(writer, value);
        } catch (IOException ex) {
            logger.log(Level.SEVERE, &quot;Failed to serialize object to output stream&quot;, ex);
        }
    }

    /**
     * Deserializes the request body to a chatbot activity
     *
     * @param request Request object to read from
     * @return Returns the deserialized request
     * @throws IOException Gets thrown when the activity could not be deserialized
     */
    private Activity deserializeActivity(HttpServletRequest request) throws IOException {
        return objectMapper.readValue(request.getReader(), Activity.class);
    }

    /**
     * Gets the bot app ID
     *
     * @return The bot app ID
     */
    private String getAppId() {
        String appId = System.getenv(&quot;BOT_APPID&quot;);

        if (appId == null) {
            return &quot;&quot;;
        }

        return appId;
    }

    /**
     * Gets the bot password
     *
     * @return The bot password
     */
    private String getKey() {
        String key = System.getenv(&quot;BOT_KEY&quot;);

        if (key == null) {
            return &quot;&quot;;
        }

        return key;
    }
}
</code></pre>
<p>Despite the fact that the HTTP servlet performs a basic task, it still contains a lot of code to go through. So let's break it down, step by step.</p>
<p>The class itself derives from <code>HttpServlet</code> a standard class that any web application on a Java web server needs to derive from.</p>
<p>Incoming chat activities are sent to the bot using POST requests. So you need to override the <code>doPost</code> method. This method has a request and response object.</p>
<p>In the <code>doPost</code> method you then need to deserialize the incoming data from the request and validate that the sender of the request has a valid Json Web Token in the authorization header of the request.</p>
<p>The authentication check is done entirely by the Bot Builder by calling <code>JwtTokenValidation.assertValidActivity(...)</code>. You don't want to build any of the JWT stuff yourself.</p>
<p>When the token is valid, you can send the activity to the bot implementation. I advise you to do the implementation of the actual bot outside of the HTTP servlet. It makes things a lot clearer for your future self.</p>
<p>Note that you need a <code>BotConnectorClient</code> instance in order to send any responses to incoming messages.</p>
<p>In my bot I've created a <code>ConversationContext</code> that holds the connector for outgoing messages and the incoming message. This makes it easier for me to perform basic bot operations.</p>
<p>Note that right now you have to build this class yourself, but in a future release of Bot Builder for Java, a standard one is included and will probably be called <code>TurnContext</code> instead.</p>
<h2 id="handlingmessages">Handling messages</h2>
<p>As I mentioned before, it's a good idea to keep the message handling separate from the HTTP interface of your bot.</p>
<p>A very simple form of message handling is a bot that echoes the user input:</p>
<pre><code class="language-java">/**
 * Defines the structure of a chatbot
 */
public interface ChatBot {
    /**
     * Handles incoming chatbot activities
     *
     * @param context Conversation context for the current incoming activity
     */
    void handle(ConversationContext context);
}

/**
 * Chatbot implementation
 */
public final class ChatBotImpl implements ChatBot {

    /**
     * Handles incoming chatbot activities
     *
     * @param context Context for the current conversation
     */
    @Override
    public void handle(ConversationContext context) {
        if (context.activity().type().equals(ActivityTypes.MESSAGE)) {
            Activity reply = ActivityFactory.createReply(context.activity(), context.activity().text());
            context.sendActivity(reply);
        }
    }
}
</code></pre>
<p>When the bot receives an activity that is a message, it will take that message and create a reply for it. It then copies the user message into the reply and sends it using the bot connector client.</p>
<p>Notice that right now, Bot Builder for Java doesn't have the right convinience methods for creating replies to incoming messages. So I took the liberty of looking at the C# source code and created my own <code>ActivityFactory</code> to solve the problem.</p>
<pre><code class="language-java">/**
 * Factory class to produce various activities
 */
public final class ActivityFactory {
    /**
     * Creates a new instance of {@link ActivityFactory}
     */
    private ActivityFactory() {

    }

    /**
     * Creates a reply for an activity
     *
     * @param activity Activity to create a reply for
     * @param text     Text for the reply
     * @return Returns the new activity
     */
    public static Activity createReply(Activity activity, String text) {
        Activity reply = new Activity();

        reply.withFrom(activity.recipient())
             .withRecipient(activity.from())
             .withConversation(activity.conversation())
             .withChannelId(activity.channelId())
             .withReplyToId(activity.id())
             .withServiceUrl(activity.serviceUrl())
             .withTimestamp(new DateTime())
             .withType(ActivityTypes.MESSAGE);

        if (text != null &amp;&amp; !text.isEmpty()) {
            reply.withText(text);
        }

        return reply;
    }
}
</code></pre>
<p>When you want to send an activity, you need to create one based on the one you received earlier. The incoming activity always contains a <code>serviceUrl</code> property that contains the URL to send any outgoing activities to.</p>
<p>Also, when you create a reply, you need to specify to which conversation and user you want to send the reply. In my implementation I simply switch the <code>from</code> and <code>recipient</code> property.</p>
<p>Once you created a reply, you can send it through the bot connector client. To make things easy, the <code>ConversationContext</code> contains a convinience method that handles sending activities.</p>
<p>The <code>sendActivity</code> method looks like this:</p>
<pre><code class="language-java">public void sendActivity(Activity activity) {
    try {
        connector.conversations().sendToConversation(activity.conversation().id(), activity);
    } catch(ErrorResponseException ex) {
        logger.log(Level.SEVERE, &quot;Failed to deliver activity to channel&quot;, ex);
    }
}
</code></pre>
<h2 id="theresmoretocome">There's more to come</h2>
<p>As you can see, it doesn't take a mountain of code to build a bot with the current preview version of Bot Builder for Java. But there are quite a few things missing still.</p>
<p>You could build a complete bot with the bits that are available. The connector bits are easy enough to handle. You can focus on the conversation structure.</p>
<p>In the next few months, Microsoft will keep working on adding more features to the Bot Builder for Java SDK. For example, in C# you can already build simple dialogs. This will come to Java as well.</p>
<p>Also, there's no easy way to perform intent detection. This will also be added in a future preview. Right now you can use a basic HTTP client implementation in Java <a href="https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-get-started-java-get-intent">o cess LUIS (Language Understanding Intelligence Service)</a> as a REST service. I expect that there will be a proper client for it soon.</p>
<h2 id="wheredoifindthebits">Where do I find the bits?</h2>
<p>You can find the sample code for this post on Github: <a href="https://github.com/wmeints/qna-bot">https://github.com/wmeints/qna-bot</a></p>
<p>If you're interested in Bot Builder for Java, it's open source. Also on Github: <a href="https://github.com/microsoft/botbuilder-java/">https://github.com/microsoft/botbuilder-java/</a></p>
<!--kg-card-end: markdown-->
