---
title: Build the ideal python development environment in 2021
category: Machine Learning
datePublished: '2021-07-23'
dateCreated: '2021-07-23'
---
So you want to start building a python project, what should you use? I've talked about this before numerous times. Many things have changed for me over the past few years. Here's my recommendation for 2021.

## What I use Python for
Before we dive into the tooling I'm using, let's talk about some of the stuff I use Python for. I frequently build data engineering and machine learning projects for customers. I sometimes build websites too in Python, although only when I need to.

I'm talking about all the tools for building machine learning and data projects, as that's what I'm doing daily.  I primarily work on Windows 10, but all the tools in this post should work on Linux and Mac.

Let's get started by exploring some of the tools I use.

## Managing Python environments
Python has the habit of allowing a single version of every package in its installation base. If you've done serious Python development, you know that this is a rather annoying limitation. Often, your older projects will use older versions of libraries, and upgrading them isn't always a good idea.

Therefore, I recommend you use a virtual environment manager with Python. The most basic one is virtualenv. It makes it easier to set up different python interpreter versions and different sets of packages. 

A more comprehensive option that I use personally is the poetry package manager. It's similar to tools like NPM. It uses a manifest file (pyproject.toml) that documents your project, the dependencies, and the interpreter version. While NPM can only manage project dependencies and scripts, Poetry also manages a virtual python environment for your project. 

You can learn more about Poetry on their website: [https://python-poetry.org](https://python-poetry.org)

## Editing Python files
I've used quite a few different tools to edit Python files in the past. However, I've settled on [Visual Studio Code](https://code.visualstudio.com) for now as it has some of the best add-ons for editing Python files.

You may think I'm using all sorts of fancy add-ons, but I'm not. I'm using the standard [Python add-on](https://marketplace.visualstudio.com/items?itemName=ms-python.python) for Visual Studio Code. 

The Python add-on has an excellent IntelliSense option that I frequently use. You can integrate your favorite code formatter with it, so the code looks the same everywhere. And finally, it has an excellent linting integration as well. Linters helps you find problems like forgotten imports, lines that are too long, and other issues with your code.

On top of the Python add-on, I'm using Github Copilot. I was skeptical at first, but I'm addicted to it now. It saves me a ton of time editing my Python code.

It's good to know that Visual Studio Code works with Poetry. It automatically detects the Python interpreter for your project, so you can be sure that you're using the correct package versions, etc.

## Testing Python code
Whenever I'm writing code, I'm looking to write a set of automated tests to verify the code I wrote. There are a couple of options for testing your code. I like to use [pytest](https://docs.pytest.org/en/6.2.x/) for a couple of reasons:

* Setting up tests is very basic.
* Pytest has excellent support for fixtures, mocks, and data-driven tests, which I use a lot.
* There's support for testing with Pytest inside Visual Studio Code.

You can enable pytest support in Visual Studio Code under *Settings > Python > Testing > Pytest Enabled*. When you open a test file, you'll notice that it has two hyperlinks above each test method that allow you to run and debug the test method.

If you're looking for test coverage, I can highly recommend checking pytest-cov. This package makes it easy to check the code coverage for your code. 

In addition to pytest-cov, I can also recommend trying out mutmut. The mutmut package is a mutation testing framework for Python. It allows you to verify that your tests are testing your code correctly. There's a great blog post on the subject here: [https://opensource.com/article/20/7/mutmut-python](https://opensource.com/article/20/7/mutmut-python)

## Linting tools
Aside from tests, I always include a linting tool in my toolset. My personal favorite is [flake8](https://flake8.pycqa.org/en/latest/). It's a free code linting tool that checks your code for common mistakes. It works in the local editor and as a command-line tool in a CI/CD pipeline.

There are quite a few more options for linting your Python code:

* [flake8](https://flake8.pycqa.org/en/latest/)
* [Pylint](https://www.pylint.org/)
* [Prospector](http://prospector.landscape.io/en/master/)
* [Pycodestyle](https://pypi.org/project/pycodestyle/)
* [Pylama](https://github.com/klen/pylama)
 
I settled on flake8, because of it's command-line usage, and because it worked the first time around. I've also tested pylint but found it harder to use because it kept interfering with my code formatting settings.

If you're going to use a linter, I recommend using the same linter in your build and the editor. It saves you a ton of time going back and forth between a red build and your code editor.

## Code formatting tools
Next to linting tools, I like to use a code formatter to ease the burden of adequately formatting my code. I prefer to use [YAPF](https://github.com/google/yapf). It nicely aligns with flake8, so I don't have to change things after formatting my code manually.

I used to use Black as the formatter for my Python code, but I found that it messed with the linting settings I use, and it was frankly too difficult to configure. I find code style essential but not that important that I'm willing to spend hours fixing my tooling for it.

Did I mention that YAPF works in Visual Studio Code too? You can configure it under *Settings > Python > Formatting: Provider*. Just make sure you have it in your Python environment.

## Data science tools
In previous sections, I've shown you the available Python tools that I use. Let's take a look at some more specific tools next. As I'm using Python for data science and machine learning, I've got some specific tools that  I like to use.

The list is pretty much what you may expect from someone working on data and machine learning:

* [Pandas](https://pandas.pydata.org/) for managing data frames
* [Numpy](https://numpy.org/) for processing numeric data
* [Scipy](https://www.scipy.org/) for various scientific calculations
* [Scikit-learn](https://scikit-learn.org/stable/) for machine learning
* [Pytorch](https://pytorch.org/) for deep learning
* [Dalex](https://dalex.drwhy.ai)/[interpretml](https://interpretml.org)/[SHAP](https://github.com/slundberg/shap)/[LIME](https://github.com/marcotcr/lime) for explaining my models
* [Matplotlib](https://matplotlib.org/)/[plotly](https://plotly.com)/[seaborn](https://seaborn.pydata.org/) for plotting visualizations
* [Spacy](https://spacy.io/)/[nltk](https://www.nltk.org/) for NLP processing logic
* [Pillow](https://pillow.readthedocs.io/en/stable/)/[OpenCV](https://opencv.org/) for processing images

I prefer to write my production machine-learning code in Python files rather than using the well-known [jupyter notebooks](https://jupyter.org/). Notebooks are great for experimenting with code, but they tend to get very messy. That's why I haven't included the jupyter notebooks package in the list.

## Other useful tools
Here's the other stuff that I use for my development work to round off my development tooling.

* [Powershell](https://docs.microsoft.com/en-us/powershell/) – I was not fond of this shell all that much, but I've grown to like it over time. I use this sometimes on Linux as well. And I've seen it work on Mac as well. 
* [Windows Terminal](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701?activetab=pivot:overviewtab) – This is a powerful new terminal program for Windows 10 that can work with multiple tabs and panes. I started using it since the early dev previews and never stopped since that time.
* [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) – Sometimes, I come across programs that don't work on Windows. I use WSL2 with Ubuntu 20.04 for these occasions. The toolset remains the same, however.
* [GIT](https://git-scm.com/) – I haven't seen other source control tools in a very long time. Everybody seems to use GIT these days.
* [Oh-my-posh](https://github.com/JanDeDobbeleer/oh-my-posh) – This add-on for Powershell is similar to oh-my-bash and oh-my-zsh. It provides nice-looking themes for the shell and includes some valuable add-ons for working with GIT and Python, such as tab autocompletion.

## Conclusion
So there it is my complete development setup for Python, Data Science, and machine-learning projects. I hope you like it. Would you mind leaving a comment if you have any suggestions?
