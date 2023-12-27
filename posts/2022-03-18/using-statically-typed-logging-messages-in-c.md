---
title: Using statically typed logging messages in C#
category: ASP.NET
datePublished: "2022-03-18"
dateCreated: "2022-03-18"
---

One of the critical things you’ll need in a cloud-native C# application is a good logging infrastructure. In this post, we’ll look at the source generator for logging methods and what it can do to make your life easier.

We’ll cover the following topics:

- Using source generators for your logging
- Logging exceptions with source generated logging methods
- Limitations of source generated logging

Let’s start by writing a source-generated logging class.

## Using source generators for your logging

You can create a source-generated logger using a special class construction with an attribute. The following example demonstrates a basic statically typed logger:

```csharp
public static partial class Log
{
    [LoggerMessage(
        EventId = 1001,
        Level = LogLevel.Warning,
        Message = "Product {ProductId} not found"
    )]
    public static partial void ProductNotFound(this ILogger logger, Guid productId);
}
```

First, we create a new static partial class. Within this class, we create a partial method with the LoggerMessage attribute. The LoggerMessage attribute has several properties to configure what’s logged to the application log:

- Message – The message to log is usually a template with placeholders.
- LogLevel – The log level for the message
- EventId – A number that identifies the event
- EventName – A string identifying the event

Most people use the LogLevel and Message properties in their applications. However, it’s nice to note that you can quickly add additional information to identify your log events. I like to use this because it makes it easier to filter log messages in systems like Application Insights or Azure Monitor.

You can use a template for the LogMessage property like you usually use when calling LogInformation, LogWarning, or LogError on an ILogger instance.
Note how we used camel-case parameter names in the log method while the properties in the LogMessage template are pascal-case. Automatic translation between camel-case and pascal-case is a nice touch that makes the source-generated logging methods great to use.

Once you’ve defined a logging method, you can use it in your application instead of a call to an ILogger instance like the following example demonstrates:

```csharp
ILogger<MyController> _logger;

[HttpDelete("{id}")]
public async Task<IActionResult> Delete(Guid id)
{
    try
    {
        // Omitted for brevity
    }
    catch (AggregateNotFoundException)
    {
        _logger.ProductNotFound(id);
        return NotFound();
    }
}
```

Notice how this kind of logging simplifies the business logic by reducing the amount of text you have to read. Let’s see what else we can do with the source-generated logging methods.

## Logging exceptions with source generated logging methods

In the previous section, we looked at using source-generated log methods. There’s more to the source-generated logging methods. For example, any exceptions that you log are automatically handled correctly by the source generator. Let’s look at an example:

```csharp
[LoggerMessage(
    EventId = 1002,
    Level = LogLevel.Error,
    Message = "Failed to connect to the database"
)]
public static partial void DatabaseConnectionFailed(this ILogger logger, Exception ex);
```

In the example, we provided an exception as one of the parameters. It doesn’t need to be the first parameter of your log method. When we call the logging method, it picks up the exception and logs it with a stack trace.

You can add additional exceptions, but you’ll have to add properties to the LogMessage template to see them. If you decide not to add the exceptions as properties, they’ll show up in the state of the log event.

## Limitations of source generated logging

While source generated logging is an excellent addition to the logging infrastructure of .NET, it has some limitations:

- Logging methods must be partial and static
- The name of a logging method can’t start with an underscore
- Parameters in the logging methods can’t start with an underscore
- Logging methods can’t be generic
- You can’t define Logging methods in a nested class

Remember that you’ll need a modern C# version to use the logging method source generator. At least version 9.0 is required.
You can configure the C# compiler version in your .csproj file like so:

```xml
<PropertyGroup>
  <LangVersion>10.0</LangVersion>
</PropertyGroup>
```

## Summary

With the addition of source generators, we’re seeing many lovely quality-of-life improvements. Source-generated logging methods are an excellent example of these quality-of-life improvements. Using source-generated logging methods in your application makes the business logic more readable while providing additional compile-time checks that you’ve provided the correct information to your logging infrastructure.

If you’re interested in more detailed information, I can highly recommend checking the docs on Microsoft.com: https://docs.microsoft.com/en-us/dotnet/core/extensions/logger-message-generator
