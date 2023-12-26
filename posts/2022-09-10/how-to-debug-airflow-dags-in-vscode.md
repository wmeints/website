---
title: How to debug Airflow DAGs in VSCode
category: Machine Learning
datePublished: '2022-09-10'
dateCreated: '2022-09-10'
---
After last week's success setting up Apache Airflow I figured it would be nice to
have a development setup so I can debug my own stuff.

In this post, we'll look at how you can use VSCode to setup debugging for your
Airflow DAGs.

We'll cover the following topics in this post:

- Configuring Airflow for local development
- Launching a DAG from VSCode

Let's get started setting up Airflow for local development.

## Configuring Airflow for local development

To set up Airflow for local development, you're going to need to have Airflow
installed on your machine. I prefer a virtual environment or conda environment.

You can create a new Anaconda environment with the following command:

```shell
conda create -n mlops python=3.7
```

After creating the environment, add airflow using the following command:

```shell
pip install apache-airflow
```

Note that I'm using Python 3.7 so it matches my environment. I've ran into quite
a bit of trouble because of a mismatch in Python version. Some functions aren't
available in the older Python versions. When you do use them, your DAG won't
run on the server but runs normally on your computer.

Once you're done installing airflow, we can start setting up VSCode to debug a DAG.

## Launching a DAG from VSCode

One of the great qualities of Apache Airflow is the fact that you can run DAGs
on your local machine. Combine this with VSCode and you've got the ultimate dev
setup.

To debug a DAG, create a new file `.vscode/launch.json` and add the following
content to it:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name":"prepare_dataset",
            "type":"python",
            "request":"launch",
            "program":"/home/wme/anaconda3/envs/mlopsdemo/bin/airflow",
            "preLaunchTask": "import-airflow-variables",
            "console": "integratedTerminal",
            "env": {
                "AIRFLOW_HOME": "${workspaceFolder}",
                "AIRFLOW__CORE__LOAD_EXAMPLES": "False",
                "AIRFLOW__CORE__DAGS_FOLDER": "${workspaceFolder}/src/pipelines",
                "AIRFLOW__CORE__EXECUTOR": "SequentialExecutor"
            },
            "args":[
                "dags",
                "test",
                "prepare_dataset",
                "2022-09-10"
            ]
        }
    ]
}
```

There are a few properties worth mentioning here:

* `name` - You can use anything you like. I prefer the name of the DAG.
* `program` - This property should match the path to the airflow executable on your system.
* `args` - This should have the name of your DAG as the first item in the list of arguments.
  The final argument is the start date, you can choose anything you like here. It
  doesn't matter.
  * `env` - This configures a number of environment variables needed to point airflow at the project directory.

In addition to the launch configuration, you'll also need a couple of tasks to prepare the airflow installation for debugging. 

Create a new file `.vscode//tasks.json` and add the following content:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "clean-airflow-database",
            "command": "rm -rf airflow.db",
            "type":"shell"
        },
        {
            "label": "update-airflow-database",
            "command": "airflow db init",
            "dependsOn": "clean-airflow-database",
            "type":"shell",
            "options": {
                "env": {
                    "AIRFLOW_HOME": "${workspaceFolder}"
                }
            }
        },
        {
            "label": "create-airflow-user",
            "command": "airflow users create --username admin --firstname admin --lastname admin --password admin --role Admin --email admin@example.org",
            "dependsOn": "update-airflow-database",
            "type": "shell",
            "options": {
                "env": {
                    "AIRFLOW_HOME": "${workspaceFolder}"
                }
            }
        },
        {
            "label": "import-airflow-variables",
            "command": "if [ -f \"${workspaceFolder}/variables/dev/all.json\" ]; then airflow variables import ${workspaceFolder}/variables/dev/all.json; fi",
            "type": "shell",
            "dependsOn": "create-airflow-user",
            "options":{
                "env": {
                    "AIRFLOW_HOME": "${workspaceFolder}"
                }
            }
        },
        {
            "label": "import-airflow-connections",
            "command": "if [ -f \"${workspaceFolder}/connections/dev/all.json\" ]; then airflow connections import ${workspaceFolder}/connections/dev/all.json; fi",
            "type": "shell",
            "dependsOn": "import-airflow-variables",
            "options":{
                "env": {
                    "AIRFLOW_HOME": "${workspaceFolder}"
                }
            }
        }
    ]
}
```

The tasks take care of a couple of steps:

* First, we clear out the existing `airflow.db` file in the project folder.
* Next, we initialize a new database
* Then, we create a new admin user
* After that, we import any variables you've defined
* Finallly, we import connections that you've stored in the project.

You can store variables in `variables/dev/all.json` in the following format:

```json
{
    "<key>": "<value>"
}
```

You can store connections in the folder `connections/dev/all.json`. To create a connection, follow these steps:

* Start airflow with the command `airflow standalone`
* Create a connection under Admin > Connections
* Execute `airflow connections export --file-format json connections/dev/all.json`

The tasks account for missing connections and variables files to make them optional.

Once you've set up the launch configuration and the tasks. Navigate to the Debug tab in VSCode
and launch the DAG.  

You can set breakpoints as you normally would in your code. The airflow executable
will pause at the breakpoints. 

## Summary

Debugging ETL pipelines and machine-learning pipelines can be really hard.
Especially if the company that made the tool only supports running notebooks
or something silly like that. 

I think being able to debug a DAG in Apache Airflow is what makes this tool a
bit more awesome than other tools that don't support this.

Enjoy!
