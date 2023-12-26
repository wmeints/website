---
title: Upgrade your validation logic in ASP.NET Core with FluentValidation
category: ASP.NET
datePublished: '2020-12-18'
dateCreated: '2020-12-18'
---
<p>Every web application or micro-service that you build will have some form of validation. I've been using the standard validation attributes in ASP.NET core for ages. And I've also been cursing at them for ages. Luckily, there's a better way!</p><p>In this post we're going to explore FluentValidation. A validation library that you can use in .NET Core and .NET 5 for validating the input for your application.</p><p>We'll cover the following topics:</p><ul><li>Installing FluentValidation in your web app</li><li>Building a basic validator</li><li>Advanced validation scenarios</li></ul><p>Let's get started by installing FluentValidation.</p><h2 id="installing-fluentvalidation-in-your-web-app">Installing FluentValidation in your web app</h2><p>Although FluentValidation works with every type of .NET project, We're going to focus on using it in ASP.NET Core. </p><p>FluentValidation has a number of different packages, here are the most important ones you should know about:</p><ul><li>FluentValidation - The core package that you can use anywhere</li><li>FluentValidation.AspNetCore - The package for ASP.NET Core</li></ul><p>You can install FluentValidation as a NuGet package in your project. There's different options for installing nuget packages. For this post we'll use the command-line tooling of .NET.</p><p>Execute the following command in the folder where your ASP.NET Core project is located:</p><figure class="kg-card kg-code-card"><pre><code>dotnet add package FluentValidation.AspNetCore</code></pre><figcaption>The command to install FluentValidation in an ASP.NET Core application.</figcaption></figure><p>After installing the package, we have to open up the Startup.cs file and add the following code to the <code>ConfigureServices</code> method:</p><figure class="kg-card kg-code-card"><pre><code>public class Startup
{
  public void ConfigureServices(IServiceCollection services)
  {
    services
      .AddControllers()
      .AddFluentValidation(x =&gt;
      {
          x.RegisterValidatorsFromAssembly(typeof(Startup).Assembly);
      });
  }
  
  // ...
}</code></pre><figcaption>Code to add in Startup.cs</figcaption></figure><p>This registers  the controllers functionality in our application and sets up the fluent validation logic. We're using <code>RegisterValidatorsFromAssembly</code> to automatically register any validators that we may have in the application.</p><p><strong>Note: </strong>Although we're using <code>AddControllers</code>, the same registration of fluent validation also works in combination with <code>AddRazorPages</code> and <code>AddControllersWithViews</code>.</p><p>Now that we have set up FluentValidation, let's take a look at building a basic validator.</p><h2 id="building-a-basic-validator">Building a basic validator</h2><p>FluentValidation is based on a class called the Validator. The Validator class encapsulates the validation logic of a single object that we want to validate. </p><p>Before we can start building a validator, we need to have something to validate. Let's build a basic controller with some input that we need to validate.</p><figure class="kg-card kg-code-card"><pre><code>[ApiController]
[Route("/api/cakes")]
public class CakesController: ControllerBase    
{
    private readonly IProductCatalogService _productCatalogService;
    
    [HttpPost]
    [Route("")]
    public async Task&lt;ActionResult&lt;Cake&gt;&gt; CreateAsync(CreateCakeCommand cmd)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var result = await _productCatalogService.CreateCake(cmd);

        return Ok(result.Cake);
    }
}

public class CreateCakeCommand
{
    public string Name { get; set; }
    public string Description { get; set; }
}</code></pre><figcaption>The application code that we're going to work on.</figcaption></figure><p>The controller has a method <code>CreateAsync</code> that accepts a <code>CreateCakeCommand</code>. Before doing anything with the input, it makes sure that the <code>ModelState</code> is valid. If it's invalid we'll let the user know. Otherwise, we're creating the new cake in the catalog.</p><p>We're assuming here that validation happens automatically. This is the case for validation attributes that come with ASP.NET Core. However, since we've registered FluentValidation, the same is true for the validators introduced by FluentValidation.</p><p>Let's take a look at a basic validator for the <code>CreateCakeCommand</code>.</p><figure class="kg-card kg-code-card"><pre><code class="language-csharp">public class CreateCakeCommandValidator: AbstractValidator&lt;CreateCakeCommand&gt;
{
    public CreateCakeCommandValidator()
    {
        RuleFor(x =&gt; x.Name).NotEmpty();
        RuleFor(x =&gt; x.Description).NotEmpty();
    }
}</code></pre><figcaption>The basic implementation of the validator.</figcaption></figure><p>A validator derives from the <code>AbstractValidator&lt;T&gt;</code> class. It needs a generic argument which is the class that you want to validate: <code>CreateCakeCommand</code>.</p><p>In the constructor of the class we can specify one or more rules for properties. As an example we've setup rules for the <code>Name</code> and <code>Description</code> property.</p><p><strong>Note: </strong>There are a number of default rules available. You can find them in the documentation: <a href="https://docs.fluentvalidation.net/en/latest/built-in-validators.html">https://docs.fluentvalidation.net/en/latest/built-in-validators.html</a></p><p>Once we have your validator class ready, we're done. When data comes into the application, the validator is automatically called and the results are mapped to the <code>ModelState</code> property. </p><p>Now that we have basic validation set up, let's take a look at some of the more advanced validation scenarios that you may run into.</p><h2 id="advanced-validation-scenarios">Advanced validation scenarios</h2><p>There are quite a few interesting scenarios that FluentValidation supports. Here are a couple of interesting ones:</p><ul><li>Custom validations that require a database or service</li><li>Validation rules that depend on other validation rules</li><li>Validation of child collections</li></ul><p>Let's take a look at each of these scenarios and discover how they're handled.</p><h3 id="custom-validations-that-require-a-database-or-service">Custom validations that require a database or service</h3><p>Sometimes we want to make sure that a particular value in the input is or isn't in the database. For example, if we let the user specify a category for a cake in the sample application, we want to make sure that the category exists.</p><p>Let's extend the validator to support this:</p><figure class="kg-card kg-code-card"><pre><code>public class CreateCakeCommandValidator: AbstractValidator&lt;CreateCakeCommand&gt;
{
	private readonly ICategoryRepository _categoryRepository;

    public CreateCakeCommandValidator(ICategoryRepository categoryRepository)
    {
    	_categoryRepository = categoryRepository;
    
        RuleFor(x =&gt; x.Name).NotEmpty();
        RuleFor(x =&gt; x.Description).NotEmpty();
        RuleFor(x =&gt; x.CategoryId)
            .Must(BeExistingCategory)
            .WithMessage("Invalid category specified.");
    }
    
    private bool BeExistingCategory(int categoryId)
    {
    	return _categoryRepository.CategoryExists(categoryId);
    }
}</code></pre><figcaption>Extended implementation for custom validations.</figcaption></figure><p>Instead of using one of the standard rules, we're specifying a custom validation method. This method accepts the value of the property and returns a boolean.</p><p>We can now use other components such as a <code>ICategoryRepository</code> to call into our database to make sure that the data is valid.</p><p>But what if we wanted to make sure that the categoryId is at least higher than zero before we call into the database? We can do that too, using dependent validation rules.</p><h3 id="validation-rules-that-depend-on-other-validation-rules">Validation rules that depend on other validation rules</h3><p>We can make validation rules depend on other validation rules in two ways. First, we can use the <code>DependendRules</code>:</p><figure class="kg-card kg-code-card"><pre><code>public class CreateCakeCommandValidator: AbstractValidator&lt;CreateCakeCommand&gt;
{
    private readonly ICategoryRepository _categoryRepository;

    public CreateCakeCommandValidator(ICategoryRepository categoryRepository)
    {
    	_categoryRepository = categoryRepository;
    
        RuleFor(x =&gt; x.Name).NotEmpty();
        RuleFor(x =&gt; x.Description).NotEmpty();
        RuleFor(x =&gt; x.CategoryId)
            .GreaterThan(0).DependendRules(() =&gt; {
                RuleFor(x =&gt; x.CategoryId)
                  .Must(BeExistingCategory)
                  .WithMessage("Invalid category specified.");
            });
    }
    
    private bool BeExistingCategory(int categoryId)
    {
    	return _categoryRepository.CategoryExists(categoryId);
    }
}</code></pre><figcaption>Extended implementation for dependent rules.</figcaption></figure><p>Notice how we changed the rules for <code>CategoryId</code> so that we first validate that the value is greater than zero. If that's the case, we can then validate that it exists.</p><p>This works great for basic scenarios, but it gets pretty messy if you have more rules that you need to cascade.</p><p>We can solve this problem in another way, using the <code>When</code> method. We can use the <code>When</code> method to specify a condition for a validation rule.</p><figure class="kg-card kg-code-card"><pre><code>public class CreateCakeCommandValidator: AbstractValidator&lt;CreateCakeCommand&gt;
{
    private readonly ICategoryRepository _categoryRepository;

    public CreateCakeCommandValidator(ICategoryRepository categoryRepository)
    {
    	_categoryRepository = categoryRepository;
    
        RuleFor(x =&gt; x.Name).NotEmpty();
        RuleFor(x =&gt; x.Description).NotEmpty();
        RuleFor(x =&gt; x.CategoryId).GreaterThan(0);
        RuleFor(x =&gt; x.CategoryId)
            .Must(BeExistingCategory)
            .When(x =&gt; x.CategoryId &gt; 0);
    }
    
    private bool BeExistingCategory(int categoryId)
    {
    	return _categoryRepository.CategoryExists(categoryId);
    }
}</code></pre><figcaption>Extended implementation for conditional rules.</figcaption></figure><p>We end up with a much cleaner Validator by using conditions on validation rules. </p><p><strong>Note: </strong>Personally, I think it's fine to use the dependent rules in scenarios that aren't too complicated. The use of <code>When</code> may sometimes be even less unreadable. The meaning of dependent rules can be quite different from the conditional <code>When</code>.</p><p>Now that we've seen how to chain rules and make them conditional, let's see what we can do for validating child collections.</p><h3 id="validation-of-child-collections">Validation of child collections</h3><p>Sometimes we have a collection of child elements in an input class. We can validate these too using child rules or a separate validator. Let's start by looking at using child rules.</p><p>As an example we'll modify the input command so that it has a collection of ingredients. We're assuming that an ingredient has a relative weight and a name.</p><p>We need to extend the validator in order for us to validate the new ingredients collection like so:</p><figure class="kg-card kg-code-card"><pre><code>public class CreateCakeCommandValidator: AbstractValidator&lt;CreateCakeCommand&gt;
{
    private readonly ICategoryRepository _categoryRepository;

    public CreateCakeCommandValidator(ICategoryRepository categoryRepository)
    {
    	_categoryRepository = categoryRepository;
    
        RuleFor(x =&gt; x.Name).NotEmpty();
        RuleFor(x =&gt; x.Description).NotEmpty();
        RuleFor(x =&gt; x.CategoryId).GreaterThan(0);
        RuleFor(x =&gt; x.CategoryId)
            .Must(BeExistingCategory)
            .When(x =&gt; x.CategoryId &gt; 0);
            
        RuleForEach(x =&gt; x.Ingredients)
            .ChildRules(x =&gt; 
            {
                x.RuleFor(x =&gt; x.Name).NotEmpty();
                x.RuleFor(x =&gt; x.RelativeWeight).GreaterThan(0.0);
            });
    }
    
    private bool BeExistingCategory(int categoryId)
    {
    	return _categoryRepository.CategoryExists(categoryId);
    }
}</code></pre><figcaption>Extended implementation for validating collections.</figcaption></figure><p>Note the new <code>RuleForEach</code> method call in the validator. We tell the validator to check the <code>Ingredients</code> property using a set of rules. We then call the <code>ChildRules</code> method to specify the rules for each ingredient.</p><p>While this is great for some basic set of rules, it can be quite tricky to make this work for a more complex scenario. </p><p>Instead of using <code>ChildRules</code> we can also call <code>SetValidator</code> which allows us to specify a separate validator class that is focused on the type of object that is contained in the collection. </p><figure class="kg-card kg-code-card"><pre><code>public class CreateCakeCommandValidator: AbstractValidator&lt;CreateCakeCommand&gt;
{
    private readonly ICategoryRepository _categoryRepository;

    public CreateCakeCommandValidator(ICategoryRepository categoryRepository)
    {
    	_categoryRepository = categoryRepository;
    
        RuleFor(x =&gt; x.Name).NotEmpty();
        RuleFor(x =&gt; x.Description).NotEmpty();
        RuleFor(x =&gt; x.CategoryId).GreaterThan(0);
        RuleFor(x =&gt; x.CategoryId)
            .Must(BeExistingCategory)
            .When(x =&gt; x.CategoryId &gt; 0);
            
        RuleForEach(x =&gt; x.Ingredients)
            .SetValidator(new IngredientValidator());
    }
    
    private bool BeExistingCategory(int categoryId)
    {
    	return _categoryRepository.CategoryExists(categoryId);
    }
}

public class IngredientValidator: AbstractValidator&lt;Ingredient&gt;
{
    public IngredientValidator()
    {
        RuleFor(x =&gt; x.Name).NotEmpty();
        RuleFor(x =&gt; x.RelativeWeight).GreaterThan(0.0);
    }
}</code></pre><figcaption>Extended implementation for validating collections with a separate validator.</figcaption></figure><p>The validator that we specify in the <code>SetValidator</code> method is implemented in the same way as the validator of the root object.</p><p>Depending on the scenario you may want to choose <code>ChildRules</code> over the <code>SetValidator</code> technique. I personally think the former is easier for smaller objects, while the latter is easier with more complex objects.</p><p>There's a lot more to cover in the library, but I think you'll get the gist of what this library is capable of.</p><h2 id="summary-and-resources">Summary and resources</h2><p>In this article we've covered how to set up FluentValidation in ASP.NET Core and how to build a basic validator. We then looked at building more complicated validators using custom validation rules, conditional rules, and collection rules.</p><p>If you're interested in learning more, I can highly recommend reading <a href="https://docs.fluentvalidation.net/en/latest/installation.html">the documentation</a>. It contains a very detailed explanation of what you can do with FluentValidation.</p><p>Have fun!</p>
