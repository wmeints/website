---
title: >-
  Github Copilot: What you need to know to get started with AI-assisted
  programming
category: Machine Learning
datePublished: "2023-02-16"
dateCreated: "2023-02-16"
---

We’re starting with a pilot to test Github Copilot at Info Support. This is awesome news for us because we can now learn how much copilot is going to help us with our code. In the past few months, I’ve been testing Github Copilot on my own projects and learned a ton about things like use cases and plugins for various IDEs.

In this post I’ll quickly go over the use cases and cover which plugins you need to get copilot working in your favorite editor/IDE.

## Why use Github copilot in the first place?

There are a number of reasons why I believe Github copilot can be a very powerful piece of technology. As many of my colleagues know, I’m working on a huge variety of languages and tools. And I have to be honest here: I don’t know every little tiny detail of every language and tool. Often, I find myself searching books and Google for information.

With Github Copilot I don’t have to start hunting for the manual right away. I can type in a comment with a description of what I want and Copilot can suggest how to solve the problem in the language I’m working with at that point.

Usually, Copilot will suggest a line of code or part of a line of code when you start typing pieces of recognizable syntax. However, when you type a comment with a problem statement, it will more likely suggest a function or even a full file.

Not many will know this, but Copilot can also be used to debug common mistakes in your code. I’ve been working on a computer vision solution and switched the axes of an operation around completely flipping an image. Copilot helped me fix the issue with a suggestion.

## Supported languages

“What languages does Copilot support? Does it do <insert language>?” This is a question I get a lot from colleagues and people who haven’t used Copilot before.

GitHub copilot is a tool that’s based on the OpenAI Codex model. This is a language model specifically build for programming languages. They’ve trained the model with over a dozen languages so it likely supports yours too.

So far, I’ve tested GitHub copilot with the following languages:

- Java
- Javascript/Typescript
- Scala
- C#
- Python
- Rust
- Go
- C++
- Kotlin

And I know for sure there are more languages out there that Copilot supports. The key here is to get a plugin for your favorite editor to collaborate with copilot. Let’s take a look.

## Supported editors and IDEs

During the preview Copilot was only available in Visual Studio Code. Nowadays it’s available in a lot more tools which is great news if you love Rider, IntelliJ or even vim!

As I mentioned, GitHub Copilot is currently available as a Visual Studio Code extension, which in turn supports a wide range of language like Rust, Go, C#, Java, Javascript, and many more.

[Download the VSCode plugin here.](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)

Speaking of Visual Studio, there's a plugin for that one too.

[Download the Visual Studio extension here.](https://marketplace.visualstudio.com/items?itemName=GitHub.copilotvs)

Additionally, it is also available as a plugin for JetBrains' PyCharm and IntelliJ IDEA, which are popular IDEs for Python and Java, respectively.

[Download the IntelliJ-based IDE plugin here.](https://plugins.jetbrains.com/plugin/17718-github-copilot)

I’m using vim these days as one of my tools because it offers tools to get around your code at lightning speeds. If you’re into this sort of thing, I can highly recommend checking out the plugin for that one too.

[Download the vim plugin here.](https://github.com/github/copilot.vim)

It's good to know that Copilot doesn't interfere with the autocomplete options provided by the editors. You can still use the refactoring functions in IntelliJ and Rider after installing Copilot so you can change things if Copilot doesn't name things quite right. Visual Studio 2022 is a great example to mention here as well. You have autocomplete in Visual Studio and IntelliCode which helps with AI-based refactorings. Copilot is a great addition to this!

## Getting the most out of Github Copilot

Many will be wondering what value Copilot brings to the table when they first open the IDE. It’s not Copilot will immediately start suggesting things. After all, it’s the Copilot, you’re the driver so it would be kind of annoying if it got in your way.

Here’s a few things to try the first time:

- Start typing in a method/function that you’re working on for your current project. You’ll quickly notice that it will start to suggest pieces of code. Next, make sure to press Alt + ] to try variations of the suggested code.
- Type in the name of a function, and on the first line in the function type in a comment with a description of the function content that you need. I think you’ll be surprised there.
- Finally, create a new file, and enter a description of something like a name of a method on a class you want to unit-test.

This is just the start of what Copilot can do for you. Here’s a few additional tips to get the most out of your new pair programmer:

- Be specific with your prompts: Copilot works best when given specific prompts that describe what you're trying to accomplish. For example, if you want to create a function that returns the sum of two numbers, use a prompt like "Create a function that returns the sum of two numbers."
- Review suggestions before using them: Copilot's suggestions are generated by machine learning algorithms and may not always be the best solution. Take the time to review the suggestions before using them to ensure they meet your needs.
- Refine your prompts: If Copilot is not providing the results you expect, refine your prompts to be more specific. For example, if you're trying to write a function that calculates the mean of an array, try using a prompt like "Create a function that calculates the mean of an array of numbers."
- Use Copilot in combination with your own knowledge: Copilot is a tool to assist you, not replace your own knowledge and expertise. Use Copilot's suggestions as a starting point and refine them based on your own understanding of the problem you're trying to solve.

## Summary

GitHub Copilot has changed my experience writing code for the better. It’s not perfect, and it will likely never be perfect. But that’s not the point. The point is to save time on the boring stuff so you can work on the interesting bits!

I hope you’re going to give GitHub Copilot a spin. Please let me know if you have any questions or comments. We’re super excited to learn more about what AI can bring to the table for developers.
