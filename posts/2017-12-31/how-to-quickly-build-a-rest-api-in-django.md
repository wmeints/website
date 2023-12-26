---
title: How to quickly build a REST API in Django
category: Python
datePublished: '2017-12-31'
dateCreated: '2017-12-31'
---
<!--kg-card-begin: markdown--><p>Vacation time, an excellent time to learn something new, so I figured, why not build a recipe bot that recommends recipes? For that I needed a way to store recipes that the bot could retrieve. And I figured, why not try to build that in Python?</p>
<p>In this article I will show you a quick way to build a REST API in Python using the Django framework. I will also show you some of the things that I ran into while building the REST API so you don't have to get caught up in those kind of problems.</p>
<h2 id="gettingstarted">Getting started</h2>
<p>Django is a Python framework for building websites. It's a framework for perfectionists with deadlines, according to the website. That sounds promising.</p>
<p>To get started with Django you need the Django package installed on your computer alongside Python 3. I'm assuming you already have Python installed. To install Django execute the following command:</p>
<pre><code class="language-bash">pip install django
</code></pre>
<p>After you've installed Django, let's create a new project and get started with our REST API. To do that, you need to execute the command:</p>
<pre><code class="language-bash">django-admin startproject recipebot
</code></pre>
<p>Of course if you want to build something else, you can replace the name with whatever you're building.</p>
<p>A project has several files in it. The most important file is the <code>manage.py</code> file in the root of the project. This file is used to manage the different aspects of your project.</p>
<p>A Django project is built out of several apps, modules if you will. Each app contains a small set of related logic. You can use logic from different apps to build your project.</p>
<p>The project layout typically looks like this:</p>
<pre><code>recipebot
|-- recipebot
|--&lt;app&gt;
   |-- &lt;app files...&gt;
|--&lt;app&gt;
   |-- &lt;app files...&gt;
</code></pre>
<p>The project folder contains a folder with the name of the project directly underneath it. Each app in your project gets its own folder under the project root.</p>
<h2 id="createanewappindjango">Create a new app in Django</h2>
<p>To create a new app you use the manage.py file in the root of your project. Execute the following command to create a new app:</p>
<pre><code class="language-bash">python manage.py startapp api
</code></pre>
<p>When you execute this command you end up with a new folder within the project folder that contains the files for your app:</p>
<ul>
<li>models.py</li>
<li>views.py</li>
<li>admin.py</li>
<li>apps.py</li>
<li>tests.py</li>
<li>migrations/_<em>init</em>_.py</li>
</ul>
<p>An app typically has a few models in it and views that provide a way to render those models on the website. As with any good quality app there is support for tests. You can use migrations to create and/or upgrade your database. Finally there's even the possibility to create an admin page.</p>
<p>To use the app, you need to modify the <code>settings.py</code> file in the project so that it includes the app in the <code>INSTALLED_APP</code> setting.</p>
<pre><code class="language-python">INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'api',
]
</code></pre>
<p>As you can see, the <code>INSTALLED_APPS</code> setting defines several apps. There's the admin app, that automatically adds an admin section to your project and several apps that provide useful utilities.</p>
<p>A project not only has your own apps in it, but you can use apps from third parties as well. We'll use this later on when we turn our project into a REST API.</p>
<h2 id="createafewmodels">Create a few models</h2>
<p>As I mentioned, an app has several models. You can skip these if you don't want the default model behavior offered by Django. But I found these quite nice given that I have relational data.</p>
<p>Let's create a few models. In the models.py add a set of classes for our recipe bot:</p>
<pre><code class="language-python">from django.db import models

class Recipe(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField()
    cooking_instructions = models.TextField()
    slug = models.SlugField()
    preparation_time = models.IntegerField(help_text='Preparation time in minutes')
    cooking_time = models.IntegerField(help_text='Cooking time in minutes')
    created = models.DateTimeField()
    modified = models.DateTimeField()
    
class Ingredient(models.Model):
    name = models.CharField(max_length=150)
    amount = models.IntegerField()
    measurement = models.CharField(max_length=150)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE,
        related_name='ingredients')
</code></pre>
<p>There's quite a few things happening in this code, so let's go over them one by one.</p>
<h3 id="defineamodel">Define a model</h3>
<p>You define a model as a python class, which derives from <code>django.db.Model</code>. The model can have several properties. For example, name and description are properties on the model.</p>
<p>Django comes with <code>CharField</code>, <code>TextField</code> and <code>IntegerField</code> for example. These define standard behavior for database fields. For example, you can configure the maximum length of a <code>CharField</code> and a help text.</p>
<h3 id="definearelationship">Define a relationship</h3>
<p>As your data is typically relational, you need to define relationships between models. Django uses the <code>ForeignKey</code> for this. You add a property of the type <code>ForeignKey</code> and provide the model class it refers to.</p>
<p>You need to define <code>on_delete</code> behavior for each foreign key. You can either use <code>PROTECT</code> or <code>CASCADE</code> behavior for foreign keys. When you use <code>CASCADE</code> the child (Ingredient in my sample) gets deleted when the parent (the recipe) is deleted. When you use <code>PROTECT</code> the parent cannot be removed without the child being removed first.</p>
<p>Notice that I used <code>related_name</code> in the foreign key definition. This gives the reverse relation property a name. I defined the foreign key on <code>Ingredient</code>, but Django automatically defines <code>ingredients</code> as a property on <code>Recipe</code>, because I used the <code>related_name</code> setting.</p>
<h2 id="renderingmodels">Rendering models</h2>
<p>Now that you have serializers for the models, let's define a set of views for the models using those serializers.</p>
<p>In order to render any data over HTTP you need to define views in Django. Views render the data. Normally a view would look like this:</p>
<pre><code class="language-python">from django.http import JsonResponse
from . import models

def recipe_list(request):
    result = []
    
    for recipe in Recipe.objects.all():
        result.append({ 'name': recipe.name, 'slug': recipe.slug })
        
    return JsonResponse(result)
</code></pre>
<p>This function takes the incoming request as argument. It retrieves recipes, which it returns in a <code>JsonResponse</code>.</p>
<p>Django has so called manager objects attached to the model classes you create that allow you to execute SQL queries. The <code>all()</code> query returns all objects of a given type from the database.</p>
<p>To use the <code>recipe_list</code> view you need to include it in the <code>urls.py</code> of the project. You can do this by creating a new file <code>urls.py</code> within the app.</p>
<pre><code class="language-python">from django.urls import path

urlpatterns = [
    path('recipes', views.recipe_list)
]
</code></pre>
<p>Next include the urls from the <code>api</code> app in the main project using the following piece of code in the <code>urls.py</code> of the project:</p>
<pre><code class="language-python">from django.urls import path, include

urlpatterns = [
    path('api', include('api.urls'))
]
</code></pre>
<p>This tells the project to include all urls from the <code>api</code> app under the path <code>/api/</code>. Ultimately when you get an url like <code>/api/recipes</code> the <code>recipes_list</code> function gets called by Django to render the response.</p>
<p>Notice that the Django URL dispatcher doesn't distinguish between GET, POST or PUT when calling a function that is attached to a URL. You need to do that yourself.</p>
<p>This amounts to a lot of boilerplate code when trying to build a REST API with Django. Because one function has to handle POST and GET.</p>
<h2 id="convertthewebsiteintoarestapi">Convert the website into a REST API</h2>
<p>Django in its vanilla form doesn't really support REST endpoints. Because of the amount of boilerplate you need to build. It expects you to render either HTML or a very basic JSON response. It's quite hard to build a proper REST API in that way.</p>
<p>Luckely there's a framework that you can add to Django that makes building REST APIs with Django a breeze: <a href="http://www.django-rest-framework.org/">Django Rest Framework</a></p>
<h3 id="installthedjangorestframework">Install the Django Rest Framework</h3>
<p>To install the Django Rest Framework execute the following command:</p>
<pre><code class="language-bash">pip install djangorestframework
</code></pre>
<p>Next add the app <code>rest_framework</code> to the list of installed apps in the <code>settings.py</code> file of your project:</p>
<pre><code class="language-python">INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_extensions',
    'rest_framework',
    'api',
]
</code></pre>
<h3 id="addserializersforyourmodels">Add serializers for your models</h3>
<p>To render a model in a REST response you need to define a serializer for the model. The serializer reads data from your model instances and converts it to JSON. It also reads and validates incoming data before updating or creating model instances.</p>
<p>You can use the serializers to shape the data in requests and responses. So although your model has a certain shape, you can change that shape so that it better fits your REST interface.</p>
<p>Let's define serializers for our models. Add a new file to the <code>api</code> app with the name <code>serializers.py</code> and add the following content to it:</p>
<pre><code class="language-python">from rest_framework import serializers
from . import models

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Recipe
        fields = ('name', 'amount', 'measurement')

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True, read_only=True)
    class Meta:
        model = models.Recipe
        fields = ('slug', 'name', 'description', 'cooking_instructions',
            'cooking_time', 'preparation_time',
            'created', 'modified')
</code></pre>
<p>Derive your serializer from <code>ModelSerializer</code>. A serializer needs a nested class <code>Meta</code> which defines meta behavior for the serializer. The serializer needs to know about your model, so assign the property model with the name of the model that the serializer is for. Next define the fields that the serializer should serialize or deserialize.</p>
<p>When you use <code>ModelSerializer</code> with the right <code>Meta</code> class definition, you will get the definition of how each field in the model should be processed for free. In the <code>RecipeSerializer</code> however you need to define the ingredients property explicitly.</p>
<p>The <code>ingredients</code> property won't get serialized by default, because it's a reverse relation lookup of the foreign key in <code>Ingredient</code>. If you want the ingredients to be included in the recipe you need to tell the serializer that.</p>
<p>I defined the <code>ingredients</code> property using the IngredientSerializer with the setting <code>many=True</code> and <code>read_only=True</code>. Now when you request a recipe from the API you get the ingredients included in the response. However, because its a read-only serializer you are not able to include ingredients when you POST a new recipe to the API.</p>
<p>By using Serializers you remove the boilerplate code that is needed to read in data from incoming requests and serializing data to JSON. Thus removing some of the work you had to do in your views.</p>
<h3 id="createviewsetsforyourmodels">Create viewsets for your models</h3>
<p>The views itself in vanilla Django also contained a lot of boilerplate code. In the Django Rest Framework this is solved by creating viewsets. Let's define a couple for our recipe API in the <code>views.py</code> file of the <code>api</code> app.</p>
<pre><code class="language-python">from rest_framework import viewsets
from . import serializers
from . import models

class RecipeViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.RecipeSerializer
    queryset = models.Recipe.objects.all()
</code></pre>
<p>A viewset contains all logic required to handle POST, PUT, PATCH, DELETE and GET requests. You don't need to build all that boilerplate when you use a viewset.</p>
<p>Notice that I called the <code>all()</code> method on the Recipe manager object. The return type of this method is a lazy queryset. It doesn't really retrieve anything until I iterate over it. That's why you can call it here and assign its result to the queryset.</p>
<p>The <code>queryset</code> is used in the various request handling methods within the viewset. This works, because you can call create, save and destroy on the queryset to manipulate the data.</p>
<p>The <code>serializer_class</code> ensures that all incoming data is handled properly and that output data is correctly rendered.</p>
<h3 id="bindtheviewsettoaurl">Bind the viewset to a URL</h3>
<p>As you've seen before you need to connect views to a URL in order to use them. This is no different for the viewsets. However for the viewsets to work correctly you need to use a router.</p>
<p>Django Rest Framework uses routers to handle requests with viewsets. You can define a router in the <code>urls.py</code> file of the api app as follows:</p>
<pre><code class="language-python">from rest_framework import routers
from . import views

router = routers.DefaultRouter()

router.register('recipes', views.RecipeViewSet)

urlpatterns = [
    path('', include(router.urls))
]
</code></pre>
<p>First you create a new instance of <code>DefaultRouter</code> and register the recipes path with it using the <code>RecipeViewSet</code>.</p>
<p>After you've setup the router you can include its urls in the urlpatterns with the <code>include</code> statement that we've used before to include the <code>api</code> urls in the project urlpatterns.</p>
<h2 id="runyourapplication">Run your application</h2>
<p>When you have defined models, serializers and viewsets you can run your project and check if things work the way you expect. To do this you need to invoke the following command:</p>
<pre><code class="language-bash">python manage.py runserver
</code></pre>
<p>This will start the server on <a href="http://localhost:8000/">http://localhost:8000/</a>, you can open a webbrowser to view your project. Navigate to <a href="http://localhost:8000/api/recipes">http://localhost:8000/api/recipes</a> to get the recipes in your application. You will be greeted with a page that looks like this:</p>
<p><img src="/content/images/2017/12/django_rest_framework.png" alt="django_rest_framework"></p>
<p>One of the neat things about the Django Rest Framework is that it not only makes building REST APIs easier, it also includes nice little things like the HTML interface to try the API from the browser.</p>
<h2 id="tipsandtricks">Tips and tricks</h2>
<p>There were a few gotchas that I ran into while building my recipebot API:</p>
<ul>
<li>How does one show a different set of fields in a list of recipes versus the details of a single recipe?</li>
<li>How do you use the slug in the URL instead of a technical ID?</li>
</ul>
<h3 id="showingdifferentfieldsfordifferentactions">Showing different fields for different actions</h3>
<p>I wanted to return a short summary of each recipe when the user requests <code>/api/recipes/</code> url, but a full recipe when the user requests <code>/api/recipes/1</code>.</p>
<p>It turns out to be quite easy to show a summary in a list versus the full model in a details action.</p>
<p>Remember, the viewset has a property serializer_class. We used it earlier to setup a serializer for the viewset. You can also use the get_serializer_class method instead. In this method you can simply ask for the action that is being executed and return a different serializer:</p>
<pre><code class="language-python">from rest_framework import viewsets 

from . import views
from . import models


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = models.Recipe.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.RecipeSummarySerializer

        return serializers.RecipeSerializer
</code></pre>
<h3 id="howtouseasluginsteadoftechnicalidforlookups">How to use a slug instead of technical ID for lookups</h3>
<p>Technical IDs are perfect for uniquely identifying objects in the database. They are a nightmare when you're building something that needs to be used by humans.</p>
<p>To solve the problem you can inslude a <code>SlugField</code> in your model and use that as a lookup field in the viewset. Notice that I had one in my <code>Recipe</code> model already.</p>
<p>Now to use it in a viewset, simply set the <code>lookup_field</code> property on the viewset:</p>
<pre><code class="language-python">from rest_framework import viewsets 

from . import views
from . import models


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = models.Recipe.objects.all()
    serializer_class = serializers.RecipeSerializer
    lookup_field = 'slug'
</code></pre>
<p>This extra step makes the API much more friendly towards humans. While still keeping the technical ID in the database.</p>
<h2 id="finalthoughts">Final thoughts</h2>
<p>Django with the Django Rest Framework is a great combination for building REST APIs, they've put quite a bit of effort into reducing the amount of boilerplate.</p>
<p>Do keep in mind though that although I've shown a pretty complete sample of what you can expect there's quite a bit more to it.</p>
<p>If you're interested in the code I'm working on, it's on Github: <a href="https://github.com/wmeints/recipebot">https://github.com/wmeints/recipebot</a></p>
<!--kg-card-end: markdown-->
