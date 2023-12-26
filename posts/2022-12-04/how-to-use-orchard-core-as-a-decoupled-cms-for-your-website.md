---
title: How-to use Orchard Core as a decoupled CMS for your website
category: Web development
datePublished: '2022-12-04'
dateCreated: '2022-12-04'
---
We've been using wordpress for the Aigency website since last year and it helped
us to quickly set up things for the company. However, we've found that wordpress
has a number of issues that just aren't fixable for us.

So instead of continuing to use Wordpress, we decided to look for something new.
There are a large number of options when it comes to building websites with a 
CMS but I personally would like something simple.

In this post we'll explore Orchard Core as a CMS and why I prefer to build our
website with it.

## Introduction to Orchard Core

Orchard Core is a framework to build modular multi-tenant applications with
ASP.NET Core. On top of this framework there's the CMS that provides modules
to manage content on the website.

Before Orchard Core there was Orchard, the same principles but for ASP.NET on
.NET Framework.

Orchard has been an old-time friend of mine. Joop Snijder and I started knowNow
a company that built knowledge management systems a couple of years ago. Our
product was based on this open source CMS. We heavily modified it up to a point
where we weren't exactly able to upgrade to the latest releases anymore. Which
was fine since by then we had changed so much it wasn't Orchard anymore.

I remember pushing out docs changes and code changes to Orchard from time to
time. It has a great community of people that are willing to help in a lot of
ways. 

When I needed to find an alternative to Wordpress, it was only logical to take
another peek at Orchard Core to see how it would do with my current use case.

## Three ways to build a website

Orchard Core offers four ways to build a website:

* Fully managed CMS
* Decoupled CMS
* Headless CMS
* Multi-tenant modular applications

First, you can configure your web application as a fully managed CMS. Orchard
takes care of managing the content and rendering that content. This is a mode
for developers who are looking to build just a CMS and need limited
customization.

A second method to build a website with Orchard is to use the backend of the CMS
but not the frontend. You are responsible for rendering the content on the
website. Orchard manages the content on the website through the backend admin
panel.

If you're building a single page application which needs content, you can also
use Orchard to manage content. In this case you would host Orchard as a separate
website without a frontend. Content is managed through the backend and served
via the REST or GraphQL API.

Finally, you can Orchard for modular multi-tenant applications without any CMS
functionality. In that case you're likely not managing any content.

## Our website

We opted to build our website with Orchard as a decoupled CMS. We have a couple
of reasons to go for this option:

* We have mostly content that doesn't change often but has a complex layout
* We have podcasts and blogs that we want to change regularly

The Aigency website is a marketing website that doesn't change weekly. So we
have a design that's pretty to look at and complex to build with the elements
that are offered in Orchard Core. I think we can build it fully in the CMS, but
in the end we would have to write a lot of the HTML ourselves.

However, we also have content that isn't that complicated. Blogposts and
Podcasts have a fixed layout that's pretty basic. 

For the podcasts we plan to use the Buzzsprout API to sync the episodes to the
website. 

For the blogposts we want Orchard to manage the content.

## Setting up Orchard as a decoupled CMS

To configure Orchard, you'll need an empty website project. You can create one
in Visual Studio or in the terminal with the following command:

```
dotnet new web -n MyWebsite
```

After setting up the website, add the following package to the project. 

```
dotnet add package OrchardCore.Application.Cms.Core.Targets
```

Then open the `Program.cs` file in the project and add the following code to it.

```csharp
using Microsoft.ApplicationInsights.Extensibility;
using Serilog;
using OrchardCore.Data.Migration;
using OrchardCore.Logging;
using Serilog.Events;
using Serilog.Sinks.ApplicationInsights.TelemetryConverters;
using Migrations = Aigency.Web.Migrations;

var builder = WebApplication.CreateBuilder(args);
    
builder.Services.AddOrchardCms();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseOrchardCore();

app.Run();
```

When you start the website you'll be greeted with a setup page. You can
configure the website using your favorite database.

## Getting rid of the setup page

While the setup page is convenient for local development, it's pretty annoying
when you first deploy the website to your production environment. I would like
to have the website configure itself automatically.

You can do this with Orchard Core. You'll need to modify the `Program.cs` file
so it includes the OrchardCore.AutoSetup feature during setup.

```csharp
builder.Services.AddOrchardCms().AddSetupFeatures("OrchardCore.AutoSetup");
```

Next you'll need to add some configuration settings to the `appsettings.json`
file in the web project:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "OrchardCore": {
    "OrchardCore_AutoSetup": {
      "AutoSetupPath": "",
      "Tenants": [
        {
          "ShellName": "Default",
          "SiteName": "MyWebsite",
          "SiteTimeZone": "Europe/Amsterdam",
          "AdminUsername": "admin",
          "AdminEmail": "admin@domain.org",
          "AdminPassword": "<your-password>",
          "DatabaseProvider": "Sqlite",
          "DatabaseConnectionString": "",
          "DatabaseTablePrefix": "",
          "RecipeName": "Blank"
        }
      ]
    },
  }
}
```

When you start the application, it will skip the setup page and configure itself
using the settings provided in the `appsettings.json` file.

For production I recommend using environment variables or configuration settings
in Azure Web Apps to configure the username, password, and the connection string.

With the website started, you can go to `/admin` and login with your admin
credentials to manage the website.

Now that we've setup the basics, it's time to have a little fun creating some
content on the website.

## Creating content types

Orchard Core has a nice feature called Data Migrations. With Data Migrations you
can create content types, content parts, and fields. You can also use the same
migrations to create plain database tables.

Let's create a blogpost content-type for the website using migrations.

First, we need to create a new migration class:

```csharp
public class Migrations : DataMigration
{
    private readonly IContentDefinitionManager _contentDefinitionManager;

    public Migrations(IContentDefinitionManager contentDefinitionManager)
    {
        _contentDefinitionManager = contentDefinitionManager;
    }

    public int Create()
    {
        _contentDefinitionManager.AlterPartDefinition("SocialMetadata", part =>
        {
            part.WithDisplayName("Social media metadata");

            part.WithField("Excerpt", field => field
                .OfType(nameof(TextField))
                .WithDisplayName("Excerpt")
                .WithEditor("TextArea"));

            part.WithField("CoverImage", field => field
                .OfType(nameof(MediaField))
                .WithDisplayName("Cover image"));
        });

        _contentDefinitionManager.AlterTypeDefinition("Post", type =>
        {
            type.Draftable();
            type.Creatable();

            type.WithPart(nameof(PublishLaterPart));
            type.WithPart(nameof(TitlePart));
            type.WithPart("SocialMetadata").WithDescription("Metadata used to render social media cards");
            type.WithPart(nameof(HtmlBodyPart), part => part.WithEditor("Trumbowyg"));
        });

        return 1;
    }
}
```

The migration class contains the following pieces:

* First, we need to create a class called Migrations that derives from DataMigration
* Next, we create a method `Create` that returns the version `1`
* Then, we define a new content part `SocialMetadata` with a couple of fields
* After that, we create a new content-type `Post` with a title, body, and the social metadata that we created earlier

If you're interested in the details of migrations I recommend reading the
following two articles:

* [Data Migrations](https://docs.orchardcore.net/en/latest/docs/reference/modules/Migrations/)
* [Content Type Migrations](https://docs.orchardcore.net/en/latest/docs/reference/modules/ContentTypes/#migrations)

After adding the migration class we need to explain to Orchard Core how to run
the migrations. Modify the `Program.cs` to include the following code:

```csharp
builder.Services
    .AddOrchardCms()
    .AddSetupFeatures("OrchardCore.AutoSetup")
    .EnableFeature("OrchardCore.Contents")
    .EnableFeature("OrchardCore.ContentTypes")
    .EnableFeature("OrchardCore.Media")
    .ConfigureServices(services => 
    { 
        services.AddDataMigration<Migrations>(); 
    });
```

First, we need to enable additional features for the tenant so we can manage content.
Then, we can configure tenant services. In the `ConfigureServices` method call we
need to add the data migration.

When you boot the website, it will now automatically configure itself and create
the content-type that we defined in the migration.

We can now render the content in a Razor Page or a MVC controller view.

## Rendering content

When we configured Orchard Core, we automatically got support for Controllers
with views and Razor Pages. To render content we can add a new Razor Page
by creating a file `Pages/Index.cshtml`.

In this file we're going to make a really basic content page that loads the
5 latest published posts and render the title of those posts.

In the Razor Page, add the following content:

```razor
@page
@using OrchardCore
@inject IOrchardHelper Orchard;
@{
    ViewBag.Title = "Home";

    var latestPosts = await Orchard.GetRecentContentItemsByContentTypeAsync("Post", 5);
}
<ul>
    @foreach(var post in latestPosts)
    {
        <li>@post.As<TitlePart>().Title</li>
    }
</ul>
```

This code performs a couple of steps:

* First, we inject the `IOrchardHelper` so we can interact with the CMS part
* Next, we load the latest posts from the database
* Finally, we loop over the posts and render the title part

This is obviously very basic, but it demonstrates quite well how you can combine
artisanal HTML with content coming from the CMS.

## Where to next

I hope you've got a sense of what OrchardCore can offer as a decoupled CMS. 
If you're interested in learning more, I can highly recommend checking out
the documentation on [the Orchard Core website](https://orchardcore.net/).

Enjoy!
