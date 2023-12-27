---
title: How to generate PDF documents in ASP.NET Core
category: ASP.NET
datePublished: "2017-08-03"
dateCreated: "2017-08-03"
---

<!--kg-card-begin: markdown--><p>A customer I work for wants to generate a set of attachments for an e-mail we need to send to the clients of that customer. We're using .NET Core and I figured: &quot;That can't be hard, or at least it shouldn't be hard&quot;. Turns out it is more work than expected, but also more fun than expected. We ended up using DinkToPdf with the ASP.NET Core Razor Template Engine to build a PDF generation microservice.</p>
<p>In this post I will show you how we made the microservice to generate PDF attachments with DinkToPdf.</p>
<h2 id="thefirststepapdfgenerationlibrary">The first step: A PDF generation library</h2>
<p>One of the first things that we needed to solve is the fact that we run our ASP.NET Core applications on top of Docker. This means we're running on Linux. Development however happens on our Windows machines outside of Docker.</p>
<p>So while we don't actually need a cross platform PDF generation solution for our production environment we do want a cross platform solution because of developer ergonomics. I don't want our developers to struggle on their machine. Also I don't want to have a big difference between our development machines and production.</p>
<p>There isn't a lot of choice for PDF generation libraries on .NET Core at the moment. But there is one that is pretty nice. <a href="https://github.com/rdvojmoc/DinkToPdf">DinkToPdf</a> is a cross-platform wrapper around the Webkit HTML to PDF library <code>libwkhtmltox</code>.</p>
<p>DinkToPdf requires that you first generate HTML and then run it through DinkToPdf. The library will then &quot;print&quot; the HTML page to a PDF document with the settings that you choose.</p>
<p>To use the library you first install it in your project either through the package manager in Visual Studio. Or through the terminal</p>
<pre><code class="language-bash">dotnet add package DinkToPdf
</code></pre>
<p>The DinkToPdf library requires the <code>libwkhtmltox.so</code> and <code>libwkhtmltox.dll</code> file in the root of your project if you want to run on Linux and Windows. There's also a <code>libwkhtmltox.dylib</code> file for Mac if you need it.</p>
<p>Also, make sure that you have <code>libgdiplus</code> installed in your Docker image or on your Linux machine. The <code>libwkhtmltox.so</code> library depends on it.</p>
<p>Next you have to write a small piece of code for the PDF generation process:</p>
<pre><code class="language-csharp">string documentContent = &quot;...&quot;;

var output = \_pdfConverter.Convert(new HtmlToPdfDocument()
{
Objects =
{
new ObjectSettings()
{
HtmlContent = documentContent
}
}
});
</code></pre>

<p>The output is the rendered PDF bytes. You can send this to the user from a ASP.NET Core controller using the following logic:</p>
<pre><code class="language-csharp">[HttpGet]
[Route(&quot;/api/some-document&quot;)]
public IActionResult GenerateSomeDocument()
{
    var output = GeneratePdf();
    return File(output, &quot;application/pdf&quot;);
}
</code></pre>
<h2 id="thesecondstepgeneratehtmlcontentforthepdf">The second step: Generate HTML content for the PDF</h2>
<p>So how do you get the HTML content for the PDF generator? Sure you can do that entirely by hand or by using a StringBuilder. But that is not very easy in my opinion. So instead of generating the HTML content for the PDF that way, I decided to use the Razor template engine from Microsoft.</p>
<p>For this I had to make it possible to render Razor templates to a string instead of returning them as a view to the user.</p>
<p>I made a TemplateService class for this purpose. This template service embeds the razor engine and is capable of rendering any view that you have in your application with a custom ViewModel. That way you can write your PDF content with intellisense in either VSCode or Visual Studio 2017 and have it generated to a string.</p>
<p>For your convinience I've added the code to a Github gist.</p>
<script src="https://gist.github.com/wmeints/c547209b69128e4ee537cb8f35c3a6dc.js"></script>
<p>The <code>TemplateService</code> uses the Razor view engine and wires it up with a fake action, view and request context. We don't actually want to render a response to a HTTP request. We want to render a piece of content for a PDF document.</p>
<p><strong>Note:</strong> This also means that you can't use request related variables in your PDF content. This may or may not be what you want. So please modify the code as needed.</p>
<p>The final code for the PDF generation looks like this:</p>
<pre><code class="language-csharp">string documentContent = await _templateService.RenderTemplateAsync(
    &quot;Templates/MyDocument&quot;, vm);

var output = \_pdfConverter.Convert(new HtmlToPdfDocument()
{
Objects =
{
new ObjectSettings()
{
HtmlContent = documentContent
}
}
});
</code></pre>

<h2 id="linksandresources">Links and resources</h2>
<p>Want to know more about DinkToPdf? You can find the project over on Github: <a href="https://github.com/rdvojmoc/DinkToPdf">https://github.com/rdvojmoc/DinkToPdf</a></p>
<!--kg-card-end: markdown-->
