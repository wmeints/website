---
title: Building a custom Kubernetes operator in C#
category: .NET
datePublished: "2023-01-07"
dateCreated: "2023-01-07"
---

Setting up environments in Kubernetes can be done in quite a few ways. You can use Helm, plain manifests, Kustomize and
custom-built CLI tools. But what are you going to do after you’ve configured the environment? This is one of the
questions I had when I tried to set up an MLOps environment in Kubernetes with Prefect and Ray.

In this post I’m going to show you an experiment that I did building a custom operator to manage a machine-learning
environment in Kubernetes.

Before we dive into building an operator, let’s take a step back and look at how Kubernetes manages a cluster.

## How Kubernetes manages a cluster

Kubernetes uses persistent objects to define the state of a cluster. These objects are all stored in etcd, a key-value
store. Objects can describe a number of things, for example:

- Containerized applications using Pods, and Deployments.
- Network resources such as Services.
- Policies to manage how applications behave and who has access to objects.

Each of the objects in Kubernetes has three parts:

- Metadata, defines identifying information
- Spec, defines the desired configuration for the object
- Status, defines the current status of the object

When you’ve used Kubernetes before, you remember that you can define objects through YAML files. You can then upload
these files using `kubectl apply -f <filename>` to one of the master nodes to store them.

Whenever you define an object, you're telling Kubernetes about a desired state. It takes time for Kubernetes to realize
the desired state.

Kubernetes uses a controller pattern to manage the lifecycle of objects in the cluster. Each object in the cluster has
a controller attached to it. The controller gets notified when an object is created or updated. The controller will
then try to reconcile the cluster state with reality.

There are two ways to reconcile the desired state. A controller can talk to the API endpoint and create or modify other
resources. This is what happens when you create a deployment. It needs a set of pods and a replicaset. The deployment
controller doesn’t control pods directly.

Another way in which a controller can operate is to control resources. For example, when you create a pod, the scheduler
will directly control the container runtime to place pods.

## About custom controllers and operators

Let's say, you want to create your own controller. For example, you have a bunch of resources for a machine-learning
environment and you want to manage those resources without writing a ton of YAML.

You can create your own custom objects in Kubernetes and manage them using a controller. For this to happen you need to
write an operator.

An operator is an application that runs inside the cluster containing one or more controllers. Each of the controllers,
monitors objects that are defined using a custom resource definition.

Custom resource definitions are used to extend the API of Kubernetes with custom object types. You can define them using
YAML:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: workspaces.mlops.aigency.com
spec:
  group: mlops.aigency.com
  names:
    kind: Workspace
    listKind: WorkspaceList
    plural: workspaces
    singular: workspace
  scope: Namespaced
  versions:
    - name: v1alpha1
      schema:
        openAPIV3Schema:
          properties:
            spec:
              properties:
                workflows:
                  properties:
                    image:
                      type: string
                    agentPools:
                      items:
                        properties:
                          name:
                            type: string
                          image:
                            type: string
                          replicas:
                            format: int32
                            type: integer
                        type: object
                      minItems: 1
                      type: array
                    controllerReplicas:
                      exclusiveMinimum: false
                      format: int32
                      minimum: 1
                      type: integer
                    databaseReplicas:
                      exclusiveMinimum: false
                      format: int32
                      minimum: 1
                      type: integer
                  type: object
              type: object
          type: object
      served: true
      storage: true
```

The code above shows what a typical custom resource definition looks like. There are three parts that are important to
a custom resource definition:

- The group, you’ll need to define your unique group for the custom object
- The kind of object that the resource definition represents
- The schema for the custom object

You can create the schema for the custom object using OpenAPI. Most people will know OpenAPI as Swagger. You can check
[this site][OPENAPI_TUTORIAL] for a for a full tutorial on OpenAPI schemas.

Note that the custom resource definition lists a kind, and a plural/singular name as well. The plural name is used in
`kubectl get <plural-name>` to get a list of custom objects, while the singular name is used in commands like
`kubectl create <singular-name>` to create a single custom object.

When you use kubectl apply to submit the custom resource definition to the server, you can create instances of the
custom object. For example, I can submit the following YAML for a machine-learning workspace:

```yaml
apiVersion: mlops.aigency.com/v1alpha1
kind: Workspace
metadata:
  name: test-environment
spec:
  workflows:
    controllerReplicas: 1
    databaseReplicas: 1
    agentPools:
      - name: default
        replicas: 1
```

Using kubectl apply to submit the custom resource does a number of things:

- It runs the OpenAPI validation against the object
- If you have custom webhooks defined for the object, those will get run
- It creates the custom object in the cluster

And that’s where the story ends, because Kubernetes doesn’t have a reconciliation process for the new custom object.

This is where a custom controller comes into play. The custom controller needs to monitor the custom object and make
sure that the cluster is updated to the desired state. Whenever an object is created, an event is raised in the cluster.
Custom controllers can subscribe to the event and perform reconciliation logic for the created or modified object.

Let’s take a look at building a custom controller in C# and see what the reconciliation logic looks like for custom
objects.

## Building a custom operator

Most operators for Kubernetes are written in Go, because Kubernetes is written in Go. There are advantages to using Go
to build a custom operator. For example, the schema definitions for the built-in objects in Kubernetes are available as
a Go module.

But I’m not a huge fan of Go. I’m more familiar with C#, so I decided to build the operator in C# using the KubeOps SDK.
The KubeOps SDK is an open source operator framework for C# that has a similar feel to the Go version of the Operator
SDK.

### Creating the operator project

Before we start building, we need to install the Operator SDK templates:

```shell
dotnet new --install KubeOps.Templates::*
```

After installing the templates, we can create a new project using the command:

```shell
dotnet new operator
```

Once the operator is created, open the project in your favorite IDE and let’s start building a custom resource
definition and the controller logic.

### Creating the custom resource definition

Inside the operator project you’ll find a folder called Entities, which contains a file called V1DemoEntity.cs. This is
a custom resource. For my operator I replaced this with V1Alpha1Workspace.cs with the following content:

```csharp
using System.Collections.ObjectModel;
using k8s.Models;
using KubeOps.Operator.Entities;
using KubeOps.Operator.Entities.Annotations;

namespace Cartographer.V1Alpha1.Entities;

/// <summary>
/// Defines a prefect environment for a project.
/// </summary>
[KubernetesEntity(Group = "mlops.aigency.com", ApiVersion = "v1alpha1", Kind = "Workspace")]
public class V1Alpha1Workspace : CustomKubernetesEntity<V1Alpha1Workspace.EnvironmentSpec>
{
    /// <summary>
    /// Specification for the prefect environment.
    /// </summary>
    public class EnvironmentSpec
    {
        /// <summary>
        /// Gets or sets the orion database desired configuration
        /// </summary>
        public WorkflowsSpec Workflows { get; set; } = new();
    }

    /// <summary>
    /// Describes the configuration of the orion database
    /// </summary>
    public class WorkflowsSpec
    {
        /// <summary>
        /// Gets or sets the image to use for the controller and agents.
        /// </summary>
        [Description("The docker image to use for the prefect orion server and agents")]
        public string Image { get; set; } = String.Empty;

        /// <summary>
        /// Gets or sets the number of agents to deploy.
        /// </summary>
        [Items(MinItems = 1, MaxItems = -1)]
        [Description("The pools to create for the workflow environment")]
        public Collection<AgentPoolSpec> AgentPools { get; set; } = new();

        /// <summary>
        /// Gets or sets the number of controllers to deploy.
        /// </summary>
        [RangeMinimum(Minimum = 1)]
        [Description("The number of orion server replicas to deploy")]
        public int ControllerReplicas { get; set; } = 1;

        /// <summary>
        /// Gets or sets the number of replicas to deploy for the database
        /// </summary>
        [RangeMinimum(Minimum = 1)]
        [Description("The number of replicas to deploy for the orion server database")]
        public int DatabaseReplicas { get; set; } = 1;

        /// <summary>
        /// Gets the size of the storage to claim for the database
        /// </summary>
        [Description("The storage space to claim for the orion server database")]
        public ResourceQuantity StorageQuota { get; set; } = new("16Gi");
    }

    /// <summary>
    /// Defines what a pool of workflow agents looks like.
    /// </summary>
    public class AgentPoolSpec
    {
        /// <summary>
        /// Gets or sets the name of the agent pool.
        /// </summary>
        [Description("The name of the agent pool")]
        public string Name { get; set; } = String.Empty;

        /// <summary>
        /// Gets or sets the name of the docker image to use for the agents in the pool.
        /// </summary>
        [Description("The docker image to use for the agents in the pool")]
        public string Image { get; set; } = String.Empty;

        /// <summary>
        /// Gets or sets the number of agents to deploy for the pool.
        /// </summary>
        [Description("Number of agents to deploy for the pool")]
        public int Replicas { get; set; } = 1;
    }
}
```

The resource has a specification and a very basic status object. The specification defines a set of configuration
settings for the workflow component in the workspace.

We’ve talked about the structure of a custom object before. The resource definition class is marked with the
`KubernetesEntity` attribute that specifies the group, kind, and API version for the custom resource definition.

The schema for the custom resource is inferred from the class. You can extend the schema with more information using
[custom validation attributes][CUSTOM_VALIDATION].

With the custom resource definition in place, let’s take a look at the controller to manage the resource.

## Creating a controller for the resource

In the controller project, there’s another folder called Controllers. The Controllers folder contains the custom
controller class for the new resource. I’ve replaced this in my project with a V1Alpha1WorkspaceController class that
looks like this:

```csharp
using Cartographer.V1Alpha1.Entities;
using Cartographer.V1Alpha1.Reconcilers;
using k8s;
using k8s.Models;
using KubeOps.Operator.Controller;
using KubeOps.Operator.Controller.Results;
using KubeOps.Operator.Rbac;

namespace Cartographer.V1Alpha1.Controllers;

[EntityRbac(typeof(V1Alpha1Workspace), Verbs = RbacVerb.All)]
[EntityRbac(typeof(V1Deployment), Verbs = RbacVerb.All)]
[EntityRbac(typeof(V1Service), Verbs = RbacVerb.All)]
[EntityRbac(typeof(V1Secret), Verbs = RbacVerb.All)]
public class V1Alpha1WorkspaceController : IResourceController<V1Alpha1Workspace>
{
    private readonly ILogger<V1Alpha1WorkspaceController> _logger;
    private readonly OrionDatabaseReconciler _orionDatabaseReconciler;
    private readonly OrionServerReconciler _orionServerReconciler;
    private readonly EnvironmentSecretsReconciler _environmentSecretsReconciler;
    private readonly PrefectAgentReconciler _prefectAgentReconciler;

    public V1Alpha1WorkspaceController(ILogger<V1Alpha1WorkspaceController> logger, IKubernetes kubernetes)
    {
        _logger = logger;
        _orionDatabaseReconciler = new OrionDatabaseReconciler(kubernetes, logger);
        _orionServerReconciler = new OrionServerReconciler(kubernetes, logger);
        _environmentSecretsReconciler = new EnvironmentSecretsReconciler(kubernetes, logger);
        _prefectAgentReconciler = new PrefectAgentReconciler(kubernetes, logger);
    }

    public async Task<ResourceControllerResult?> ReconcileAsync(V1Alpha1Workspace entity)
    {
        _logger.LogInformation("Reconciling the workspace {EnvironmentName}", entity.Name());

        await _environmentSecretsReconciler.ReconcileAsync(entity);
        await _orionDatabaseReconciler.ReconcileAsync(entity);
        await _orionServerReconciler.ReconcileAsync(entity);
        await _prefectAgentReconciler.ReconcileAsync(entity);

        return null;
    }

    public Task StatusModifiedAsync(V1Alpha1Workspace entity)
    {
        _logger.LogInformation("entity {Name} called {StatusModifiedAsyncName}",
            entity.Name(), nameof(StatusModifiedAsync));

        return Task.CompletedTask;
    }

    public Task DeletedAsync(V1Alpha1Workspace entity)
    {
        _logger.LogInformation("entity {Name} called {DeletedAsyncName}", entity.Name(), nameof(DeletedAsync));

        return Task.CompletedTask;
    }
}
```

The controller has a couple of methods:

- `ReconcileAsync`, this method performs the reconciliation of the custom object
- `StatusModifiedAsync`, this performs logic when the status of the custom object changes
- `DeletedAsync`, this performs logic after the custom object is deleted

We’re going to focus on the ReconcileAsync operation as this is the core of what a controller does. In the
`ReconcileAsync` method we need to make sure that the state of the cluster matches the desired state
for the workspace. Because our workspace has a number of objects, I split the reconciliation logic into several parts.

For example, we call `await _orionDatabaseReconciler.ReconcileAsync(entity);` which leads to the
`ReconcileAsync` operation in the `OrionDatabaseReconciler` class. The `OrionDatabaseReconciler` class is responsible
for reconciling the database related objects. It uses the following code to reconcile the database deployment:

```csharp
var deploymentLabels = new Dictionary<string, string>
{
    ["mlops.aigency.com/environment"] = entity.Name(),
    ["mlops.aigency.com/component"] = "orion-database"
};

var existingDeployment = await _kubernetes.ListNamespacedDeploymentAsync(
    entity.Namespace(), labelSelector: deploymentLabels.AsLabelSelector());

if (existingDeployment.Items.Count == 0)
{
    var deployment = new V1Deployment
    {
        Metadata = new V1ObjectMeta
        {
            Name = $"{entity.Name()}-orion-database",
            Labels = deploymentLabels
        },
        Spec = new V1DeploymentSpec
        {
            Replicas = entity.Spec.Workflows.DatabaseReplicas,
            Selector = new V1LabelSelector
            {
                MatchLabels = deploymentLabels
            },
            Template = new V1PodTemplateSpec
            {
                Metadata = new V1ObjectMeta
                {
                    Labels = deploymentLabels,
                    Name = $"{entity.Name()}-orion-database"
                },
                Spec = new V1PodSpec
                {
                    Containers = new Collection<V1Container>
                    {
                        new V1Container
                        {
                            Name = "postgres",
                            Image = "postgres:14",
                            Ports = new Collection<V1ContainerPort>
                            {
                                new V1ContainerPort(containerPort: 5432, name: "tcp-postgres")
                            },
                        }
                    },
                }
            }
        }
    };

    await _kubernetes.CreateNamespacedDeploymentAsync(
        deployment.WithOwnerReference(entity),
        entity.Namespace());
}
```

Please note that this is not the complete code, but a snippet of what the method looks like.
You can get the full code [in the source repository][RECONCILER_CODE].

We need to take the desired state that’s defined in the V1Alpha1Workspace object that we get in the controller and make sure the cluster
state matches the desired state.

First, we get the current database deployment based on labels that we attached. If we can't find the deployment, we'll
create a new one with a set of labels so we can find it later.

To submit the new deployment, we use the Kubernetes Client. Note that we submit the new resource with an owner reference
by calling `deployment.WithOwnerReference(entity)`. This is needed so that the deployment is deleted when the workspace
is deleted.

Whenever you create related objects for your custom object, you’ll want to set the owner reference so that the object
get cleaned up when the root object is removed. Objects in Kubernetes get removed without the approval of your custom
controller, so it’s important to manage the garbage you leave behind.

There are ways to perform additional clean up before your object is deleted. You’ll need to write a finalizer for your
object. You can learn more about this [in the manual][FINALIZER_DOCS].

### Managing permissions

Access to objects in Kubernetes is controlled by RBAC rules. As a custom operator you’ll need a role with the right
permissions inside the cluster to manage objects. You can define RBAC rules in your code using custom attributes. The
controller has a couple defined.

```csharp
[EntityRbac(typeof(V1Alpha1Workspace), Verbs = RbacVerb.All)]
[EntityRbac(typeof(V1StatefulSet), Verbs = RbacVerb.All)]
[EntityRbac(typeof(V1Deployment), Verbs = RbacVerb.All)]
[EntityRbac(typeof(V1Service), Verbs = RbacVerb.All)]
[EntityRbac(typeof(V1Secret), Verbs = RbacVerb.All)]
public class V1Alpha1WorkspaceController : IResourceController<V1Alpha1Workspace>
{
    // Other code
}
```

I’ve gone ahead and asked for all permissions on Deployments, Services, Secrets, and StatefulSets. However, I recommend
that you take a good look at the permissions and request as little as possible to increase the safety of your operator.
Now that we’ve explored the implementation of a custom controller, let’s take a look at deploying the custom operator
to a cluster.

## Deploying the custom operator

Before deploying the operator to a Kubernetes cluster, it’s a good idea to test it. You’ll need to set up a Kubernetes
cluster to test the operator. I’m using Kind for this. You can run a Kind cluster with the following command:

```shell
kind create cluster
```

After the command is finished, you can install the custom resource definition with the following command from your
project directory:

```shell
dotnet run – install
```

This command generates the yaml files needed to install the custom resource definition and it will automatically install
it for you in the cluster.

After you’ve installed the custom resource definition, use the following command to run the operator:

```shell
dotnet run
```

Operators can run inside the cluster, which is the preferred method for production use. But they can also run outside
the cluster. You can, for example, press F5 in Visual Studio to debug the operator.

When you’re ready to deploy the operator, you’ll need to perform a couple of tasks. First we’ll need to create a docker
image for the controller. In the case of my operator we need to run the following command from the project directory:

```shell
docker build -t wmeints/cartographer:latest .
```

Make sure to replace the image name with the one you want to use.

After building the docker image, go into config/install/kustomize.yaml and update the image name there too so it matches
the chosen image name.

Now that we have everything ready, let’s install the operator. Run the following command from the project directory in
your favorite terminal:

```shell
kubectl apply -k config/install
```

The operator is now deployed in its own namespace with the correct permissions, etc.
Let’s take a look at uninstallation next so we can clean up after ourselves.

## Uninstalling the custom operator

When you no longer need the custom operator you can install it by executing the following command from the project
directory in your favorite terminal:

```
kubectl delete -k config/install
```

After a few seconds, the operator will be removed and the custom resource definition will no longer be available.
Note that all related objects are removed as well!

## Summary

It takes a bit of work to build a custom operator for Kubernetes. And if you’re not interested in the day-2 operations
of your project or you don’t really want to write code to manage objects in Kubernetes then building a custom operator
is not something for you.

For me, building a custom operator made things way easier to manage even with the limited functionality that I currently
have in my operator. And that’s all due to the fact that I don’t have to write a ton of brittle YAML.

The operator will make sure that:

- I stick to the naming convention that I came up with on day 1
- I can quickly scale and replace workflow agent pools in my workspaces
- Everything connects together without a lot of debugging

Another thing I learned from this experiment is that C# operator SDK is a great tool. Of course, the Go Operator SDK
has a ton more features, but if you’re not a Go developer this is a great alternative.

I haven’t covered all the features here, for example:

- How to use webhooks to perform additional validation
- Sending events from the custom controller
- Extending the status of the custom object

You can find a lot of these topics on the website for the C# Operator SDK.
I hope you enjoyed this one and make sure to check out [the sources](https://github.com/wmeints/cartographer).

[OPENAPI_TUTORIAL]: https://support.smartbear.com/swaggerhub/docs/tutorials/openapi-3-tutorial.html
[CUSTOM_VALIDATION]: https://buehler.github.io/dotnet-operator-sdk/docs/entities.html#validation
[RECONCILER_CODE]: https://github.com/wmeints/cartographer/blob/main/src/Cartographer/V1Alpha1/Reconcilers/OrionDatabaseReconciler.cs
[FINALIZER_DOCS]: https://buehler.github.io/dotnet-operator-sdk/docs/finalizer.html
