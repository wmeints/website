---
title: Develop Kubernetes solutions on your own machine with Skaffold
category: Docker
datePublished: '2021-03-03'
dateCreated: '2021-03-03'
---
Developing cloud-native applications on Kubernetes is great for deployment on production. You don't need to worry about
machines and network connectivity. But for development on your local machine it's quite a different experience. It's hard
to run a Kubernetes solution on a local machine because you have to manage a lot of moving parts like manifests and building
docker images.

In this post we'll explore Skaffold, a that make managing a local Kubernetes environment a lot easier. We'll cover
the following topics:

* What is Skaffold?
* Setting up a Skaffold project
* Debugging containers that run with Skaffold

Let's start by taking a look at what Skaffold is.

## What is Skaffold?

Skaffold is a tool that helps you manage Kubernetes solutions in a development environment. The tool is based of a 
manifest file in your project folder called `skaffold.yml` that holds the project configuration.

You can specify a pipeline to define how to build, and deploy your solution in Kubernetes. There's support for a number
of different build tools and deployment tools that you can combine with Skaffold.

For example, you can build your docker images using the docker builder in Skaffold. After they've been built, you can
deploy them using a Helm chart. Or if you want, you can also deploy plain Kubernetes manifests directly.

Skaffold can also be used in a CI/CD environment to deploy the solution to a remote cluster. Although I don't think
you'll use it much for that. Especially if you have a Helm chart for your solution.

## Setting up a Skaffold project

Now that you know that Skaffold is, let's take a look at how to set up a project. 

### Installing Skaffold

First, you'll need to download the 
Skaffold tool and install it on your machine. You can find the instructions for this 
[on the Skaffold website](https://skaffold.dev/docs/install/).

For Windows, I can recommend [using chocolatey](https://chocolatey.org/) to install skaffold. It's a oneline to get it set up:

```
choco install -y skaffold
```

### Using Skaffold init
Once you have Skaffold installed you can run the following command to initialize the project:

```
skaffold init
```

This will automatically detect Kubernetes manifests and Dockerfiles in your project and ask you how to build the project.
When you follow the instructions you'll end up with a configured skaffold manifest in the root of your project directory. 

:::info
If you're using Helm like I usually do for my Kubernetes solutions, you'll find that skaffold init doesn't work. The 
init feature is in beta and gets regular updates. I expect `skaffold init` will work with Helm soon. In the meantime,
take a look at the [Helm deployer documentation](https://skaffold.dev/docs/pipeline-stages/deployers/helm/) 
to learn how to set it up yourself.
:::

### Exploring the structure of the skaffold manifest

Let's take a look at the Skaffold manifest and explore what it looks like.

The Skaffold manifest file has a couple of sections:

```
apiVersion: skaffold/v2beta5
kind: Config
metadata:
  name: feedrobot

build:
  local:
    push: false
  artifacts:
  - image: acrfeedrobotweu.azurecr.io/feedrobot/frontend
    context: src/frontends/feedrobot
    docker:
      dockerfile: Dockerfile

deploy:
  helm:
    releases:
    - name: feedrobot
      chartPath: charts/feedrobot
      valuesFiles:
        - values-dev.yml

profiles:
- name: dev
  activation:
    - kubeContext: docker-desktop
    - command: dev
```

The file starts with a metadata section. This describes what the project is about. Usually, you'll find the name of the
project here and a short description. 

In the next section `build`, you can find the build stage of the skaffold pipeline. This contains instructions on how
to build the docker images on your machine. Usually, you'll be using dockerfiles to build the images. You can find
more information about the different builders [in the skaffold documentation](https://skaffold.dev/docs/pipeline-stages/builders/).

The `deploy` section lists the deployer setup. If you've used `skaffold init` this section will list a set of manifests
that need to be deployed to the Kubernetes cluster. In case you're using a Helm chart, this is the place where you
list the Helm charts that you want to deploy. You can use value files to override settings in the Helm chart for your 
local environment. You can find more information about helm charts [in the documentation](https://skaffold.dev/docs/pipeline-stages/deployers/).

Finally, there's the profiles section. If you're using skaffold with more than one cluster, this is the place to configure those.
In the sample, I've setup a single profile called `dev`. This profile is automatically activated when I've set `kubectl` to use
the `docker-desktop` context. 

If you've setup more than one profile, you can switch between them using activation configurations for those profiles.
The activation configuration can take a `kubeContext` or a `command` or a combination of both. This makes it a lot easier
to select the right configuration for different jobs you're working on.

I haven't listed all the sections here. There's one more section that is of interest. The `test` section. This section
allows you to set up structure tests for your containers. These tests will be run before the containers are deployed so 
you know the container are working as expected. You can learn more about this [in the manual](https://skaffold.dev/docs/pipeline-stages/testers/).

Let's take a look at running an debugging containers next.

## Running and debugging containers

After you've set up your skaffold project you can start to run and debug your project. Let's first take a look at
running your project. 

### Running your project

You can start your project using the command

```
skaffold dev
```

The command `skaffold dev` does a couple of things:

* It builds your docker images locally
* It deploys the manifests for the images on your local Kubernetes cluster
* It watches the filesystem in your project directory for changes
* When files change, it updates the containers in the cluster with the new files and reloads the changed containers

In essence you get a build + deploy in a single step with live reload as the cherry on top. You'll find that this can
save a lot of time. In bigger solutions you're quickly managing 15 - 20 containers that you need to build and deploy.

:::info
Skaffold automatically detects whether images need to be updated. You'll find that the first run is a bit slow. After 
that Skaffold only builds the containers that are changed.
:::

Now let's take a look at debugging containers.

### Debugging containers

The main reason to spin up a complete environment on your local machine is to debug a complex issue in your code.
Otherwise, you could've just run a single service. How are you going to debug the containers?

Use the following command to start the solution in debug mode:

```
skaffold debug
```

In debug mode, the containers are still built and deployed on your local Kubernetes cluster. In debug, however, the 
livereload functionality is disabled. Instead a debugger is injected into the containers. Skaffold automatically detects
the sort of runtime your containers use and will inject the supporting debugger accordingly.

At the moment of writing, Skaffold supports debugging the following languages:

* Python 
* .NET Core/.NET 5
* Java and JVM related languages
* Node
* Go

For other languages you need to manually inject the debugger into your containers. 

:::info
Please make sure not to deploy a debugger in a production image. It opens up your application to a lot of problems.
You can take a look at [how Google does it](https://github.com/GoogleContainerTools/container-debug-support) to 
understand how to inject your own debugger safely.
:::

Now that you have a debugger available in the container you can attach to containers from your favorite IDE. I'm using
Visual Studio Code to debug .NET 5 containers, so I'll show that as an example.

To debug a .NET container, you'll need to add the following JSON to `.vscode/launch.json`:

```
{
    "name": "Skaffold Debug",
    "type": "coreclr",
    "request": "attach",
    "processId" : 1, 
    "justMyCode": true, // set to `true` in debug configuration and `false` in release configuration
    "pipeTransport": {
        "pipeProgram": "kubectl",
        "pipeArgs": [
            "exec",
            "-i",
            "<NAME OF YOUR POD>", // name of the pod you debug.
            "--"
        ],
        "pipeCwd": "${workspaceFolder}",
        "debuggerPath": "/dbg/netcore/vsdbg", // location where vsdbg binary installed.
        "quoteArgs": false
    },
    "sourceFileMap": {
        // Change this mapping if your app in not deployed in /src or /app in your docker image
        "/src": "${workspaceFolder}",
        "/app": "${workspaceFolder}"
    }
}
```

Make sure to updapte the `sourceFileMap` section with the correct locations of your sources and binaries in your 
Visual Studio Code workspace. 

In the `pipeTransport` there's a placeholder `<NAME OF YOUR POD>` you'll need to replace this with the name of the pod
you want to debug. You can find the pod by executing the following kubectl command in your terminal:

```
kubectl get pods
```

Copy and paste the name of the pod you want to debug into the `.vscode/launch.json` file you just created or modified.

After you've set up the launch configuration, you can go to the Debug tab in Visual Studio, select the new launch
configuration and start a debug session.

:::info
Note that you can have multiple debug configuration active at the same time. Just copy the launch configuration and
modify it to debug another pod. When you start this configuration as well, you can debug across containers.
:::

The debugging features of Skaffold are a life saver to me. Especially in cases where you need to debug multiple containers
in your application. I even managed to set up a mix of Python and .NET debug sessions to figure out a problem in my 
AI model that was caused by invalid data being sent from a .NET container. 

## Summary

If you have a smaller solution that fits on your local machine, you're going to find Skaffold to be a great tool for developing
your Kubernetes solution locally. You can work with the same helm charts or manifests that go to production. This completely
eliminates the difference between production and your local machine. 

The live reload feature is a nice touch that a lot of people will find very useful.

Skaffold solves a lot of issues that comes with developing cloud native applications on Kubernetes. Is it the perfect
solution? I don't think so. When I run my solution on my local computer I quickly need 40GB of memory due to the AI models
that I'm using. Not a big deal if you have 64GB of memory, but not everyone has this.

Personally, I think Skaffold is a great step forward. But I'm curious what you think. Let me know in the comments!
