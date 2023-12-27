---
title: Deploying resources on Azure with Terraform
category: Web development
datePublished: "2019-01-30"
dateCreated: "2019-01-30"
---

<p>In december we've built a chatbot on Azure. We're currently deploying it directly from Azure DevOps with great ease. The only problem, the infrastructure isn't managed at all. Hard problem? Not really if you use something like Terraform.</p><p>In this post I will show you how we converted our manually created Azure resources into a set of resources managed by Terraform in a matter of hours.</p><h1 id="what-is-terraform">What is terraform?</h1><p>Before we dive into the gory details of the bot infrastructure, let's talk about terraform and what it is.</p><p>Terraform is an application developed by Hashicorp. Its goal is to make it easy to build Azure and other cloud infrastructure as code. </p><p>In terraform you define what resources you want with their settings. Then you take this definition file and let terraform deploy it for you. Terraform will check if the resources are in the desired state and if not it will deploy/change or remove resources so they match the desired state described in your file.</p><p>Using a desired state configuration model instead of manual deployment makes it a lot easier to manage your cloud infrastructure. </p><p>Need to redeploy because of a disaster? No problem, just run the configuration file and copy the binaries of your application to the right instances.</p><p>Need to move the configuration from one subscription to another? You could move them in the Azure Portal but if you don't have access you're in a pickle. Instead, take the scripts and redeploy them on the other environment. </p><p>In my experience it takes only a few minutes to deploy about 30-40 resources to Azure using terraform. After you've tested the scripts on one environment you can be sure they work on another Azure environment too.</p><h2 id="how-does-terraform-work">How does terraform work?</h2><p>Working with terraform configurations is done in three steps:</p><ol><li>Create a configuration</li><li>Initialize the terraform state</li><li>Apply the configuration</li></ol><h3 id="step-1-create-a-configuration">Step 1: Create a configuration</h3><p>Creating a configuration in terraform is done by writing a new file with the extension <code>.tf</code>. It looks a little like this:</p><pre><code>provider "azurerm" {

}

resource "azurerm_resource_group" "my_resource_group" {
name = "test-group"
location = "West europe"
}</code></pre><p>The first four lines describe the configuration settings for the Azure Resource Manager provider which goes by the name of <code>azurerm</code> in terraform.</p><p>Then we create a new resource of type <code>azurerm_resource_group</code> with the name <code>my_resource_group</code>. It has a name and a location. In this case we're deploying to test-group in west europe.</p><h3 id="step-2-initialize-the-terraform-state">Step 2: Initialize the terraform state</h3><p>Before you can start to apply this configuration to your azure environment you need to invoke the following command in the folder where you stored your configuration file:</p><pre><code>terraform init</code></pre><p>This command downloads the required modules for your repository and setup any local files that terraform needs.</p><p>Note that you can run this command multiple times. It may raise errors but your original setup will remain untouched. Also, if you just cloned your sources on a fresh machine you should also run this command.</p><h3 id="step-3-apply-the-configuration">Step 3: Apply the configuration</h3><p>Once initialized it is time to apply your configuration to your azure environment. It's important to know that terraform uses credentials stored by the Azure CLI to access the Azure resource manager.</p><p>So before you can actually deploy, run the following commands:</p><pre><code>az login
az account set --subscription {subscriptionId}</code></pre><p>The first step will open up the devicelogin page so you can connect to your Azure environment. The second step configures the currently active subscription to deploy to.</p><p>You can find your subscription Id on the Azure Portal. Search for <code>Subscriptions</code> in the search bar at the top of the page. Now select the subscriptions item from the dropdown. Then search for the subscription you want to use and copy its subscription ID and use it in the second command to set the correct subscription.</p><p>Once authenticated, run the following command to apply your configuration:</p><pre><code>terraform apply</code></pre><p>This will first compile a new desired state for your environment. Then the changes are applied to the environment. Any new resources are created and existing resources are updated with new settings. Resources that you've removed from the configuration file are automatically destroyed by terraform.</p><h2 id="unleashing-the-power-of-terraform">Unleashing the power of terraform</h2><p>Deploying random resources isn't exactly exciting. However, when you are working in a complex environment you will find that terraform proves really powerful.</p><h3 id="referencing-other-resources">Referencing other resources</h3><p>For example, when I have a bunch of resources I want in the same resource group and in the same location I can use variables to connect resources together:</p><pre><code>resource "azurerm_resource_group" "my_resource_group" {
name = "test-group"
location = "West europe"
}

resource "azurerm_app_service_plan" "my_serviceplan" {
name = "my-service-plan"
resource_group_name = "${azurerm_resource_group.my_resource_group.name}"
    location = "${azurerm_resource_group.my_resource_group.location}"
kind = "Windows"

    sku {
        size = "S1"
        tier = "Standard"
    }

}

resource "azurerm_app_service "my_website" {
name = "my_website"
location = "${azurerm_resource_group.my_resource_group.location}"
    app_service_plan_id = "${azurerm_app_service_plan.my_serviceplan.id}"
resource_group_name = "${azurerm_resource_group.my_resource_group.name}"

    site_config {
        default_documents = ["index.html"]
    }

}</code></pre><p>I now have a resource group, service plan and app service configured to be in the same location. Change the location in one spot and everything moves accordingly.</p><h3 id="using-variables">Using variables</h3><p>Referencing other resources is not the only use for variables in your configuration. You can also define variables to parameterize the deployment. For example:</p><pre><code>variable "deployment_name" {
type = "string"
}

resource "azurerm_app_service "my_website" {
name = "${var.deployment_name}-my_website"
    location = "${azurerm_resource_group.my_resource_group.location}"
app_service_plan_id = "${azurerm_app_service_plan.my_serviceplan.id}"
    resource_group_name = "${azurerm_resource_group.my_resource_group.name}"

    site_config {
        default_documents = ["index.html"]
    }

}</code></pre><p>We've defined a variable <code>deployment_name</code> and used this variable to prefix the name of our website.</p><h3 id="using-randomly-generated-values">Using randomly generated values</h3><p>Sometimes, however, you don't want to use fixed names. For example, when you want the same configuration to be deployed under a different name. </p><p>To generate a random name in your configuration you can use the <code>random_id</code> resource:</p><pre><code>variable "deployment_name" {
type = "string"
}

resource "random_id" "website_name" {
keepers = {
deployment_name = "${var.deployment_name}"
}

    byte_length = 8

}

resource "azurerm_app_service "my_website" {
name = "${var.deployment_name}-${random_id.website_name.hex}"
location = "${azurerm_resource_group.my_resource_group.location}"
    app_service_plan_id = "${azurerm_app_service_plan.my_serviceplan.id}"
resource_group_name = "${azurerm_resource_group.my_resource_group.name}"

    site_config {
        default_documents = ["index.html"]
    }

}</code></pre><p>We've extended the configuration to include a <code>random_id</code> by the name <code>website_name</code>. The <code>keepers</code> section controls when the random data changes. We want our random name to change when we change the name of the deployment.</p><p>You can use the <code>random_id</code> in other resources to get a random string. For example, in the app service resource we generate the website name using the deployment name and a hex representation of <code>random_id</code> resource.</p><h2 id="using-configuration-from-terraform-in-other-tools">Using configuration from terraform in other tools</h2><p>Once you have a bunch of resources in Azure you want to know which URL to use in that one configuration file that your application has. But with all the random strings and variables it's quite hard to keep track of the name of that one server you deployed in Azure. </p><p>Fear not, you can get hold of configuration settings in terraform and extract them so you can use them in tools like MSDeploy to copy your ASP.NET application to the azure website you just created.</p><p>Change the configuration and include outputs to store information you want to extract from the configuration:</p><pre><code>output "siteUrl" {
value = "${azurerm_app_service.my_website.default_site_hostname}"
    depends_on = ["my_website"]
}</code></pre><p>We've defined an output with the name <code>siteUrl</code> and stored the default site hostname from our azure website in it. We only want this output to be defined when the <code>my_website</code> resource exists.</p><p>Now after we've applied our configuration with terraform we can extract the outputs using the following command:</p><pre><code>terraform output -json</code></pre><p>This gives us the outputs as JSON object data. You can store this in a file or if you're using Powershell you can use that to turn it into data that you can use to execute more tools:</p><pre><code>$DeploymentProperties = terraform output -json | ConvertFrom-Json
$siteUrl = $DeploymentProperties.siteUrl.value</code></pre><p>First we invoke the terraform output command and convert it from a JSON String into a Powershell hashtable. Then we create a new variable <code>$siteUrl</code> and store the value of the siteUrl configuration property.</p><p>Once you have the siteUrl property you can use it for all sorts of things in Powershell. </p><h2 id="give-it-a-shot-">Give it a shot!</h2><p>There are loads of desired state configuration tools out there, this is just one of them. Although I've found this is one of the easiest to manage. Give it a shot and let me know on Twitter what you think!</p>
