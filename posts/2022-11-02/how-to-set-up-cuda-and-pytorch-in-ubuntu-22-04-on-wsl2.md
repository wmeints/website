---
title: How to set up CUDA and PyTorch in Ubuntu 22.04 on WSL2
category: Machine Learning
datePublished: '2022-11-02'
dateCreated: '2022-11-02'
---
Working with machine-learning code in Windows can be quite a hassle. Often I run into problems with my tools not working properly on Windows. Recently, I even decided to convert my laptop to Ubuntu 22.04 for the time being. Which is really nice for data sciency stuff, but not great for my Powerpoint and Excel since LibreOffice sucks big time. Needless to say, I needed another solution. Especially for my deep learning setup.

In this quick post I'll show you how I configured my Ubuntu 22.04 installation on Windows 11 to run CUDA and PyTorch. 

## Configuring Ubuntu with WSLg on Windows 11

The key to running deep learning frameworks like PyTorch on Windows 11 is the WSLg extension. This extension allows WSL2 to use your GPU. This works for Intel, AMD, and Nvidia GPUs. It's still in preview so  it may contain bugs. So far though I haven't experienced anything blocking to be honest.

To install the WSLg extension, you can follow the instructions in the [WSLg repository on Github](https://github.com/microsoft/wslg). 
After installing WSLg, you can go ahead and install Ubuntu 22.04 from the [Windows store](https://www.microsoft.com/store/productId/9PDXGNCFSCZV).

With WSL configured and Ubuntu installed, let's move on to installing the CUDA toolkit

## Installing CUDA on Ubuntu 22.04 in WSL2

You maybe tempted to head on over to the Nvidia developer site and download CUDA directly. If you do that, I can assure you that you will have to reinstall Ubuntu. I've broken my installation with this trick.
The key here is to get the right CUDA installation.

WSLg maps your GPU driver from Windows in the Ubuntu installation. There's a specific libcuda version installed in the OS that routes all commands to the GPU in your host system. If you install the regular CUDA toolkit in Ubuntu on WSL2 you'll overwrite the libcuda file with one that isn't routed. That'll break the installation.

The correct way to install CUDA on WSL can be found in the [Nvidia manual](https://docs.nvidia.com/cuda/wsl-user-guide/index.html). 

I'm using PyTorch 1.13 which needs CUDA 11.7, so I downloaded the [CUDA toolkit for WSL-Ubuntu](https://developer.nvidia.com/cuda-11-7-1-download-archive?target_os=Linux&target_arch=x86_64&Distribution=WSL-Ubuntu&target_version=2.0&target_type=deb_local) from the developer site. The website provides neat instructions on how to install the toolkit. It takes, depending on your connection, a few minutes to download all the files.

After installing the CUDA toolkit, you can now download PyTorch.

## Installing PyTorch

There are several ways to install PyTorch. I've found that Anaconda is rather broken these days, so I prefer to install PyTorch using pip. 

A clean installation of Ubuntu 22.04 doesn't have Python 3.x installed yet. You'll need to install it using the following command:

```
sudo apt install -y python3
sudo apt install -y python3-pip
```

After you've configured python and pip, you can install pytorch using the following command:

```
pip3 install torch torchvision torchaudio
```

If all went well, you should have a working PyTorch installation.

## Testing your installation

To verify your pytorch installation, you can run the following script in python:

```
import torch
print(torch.cuda.is_available())
```

This should print `true` to the terminal and exit normally. You should see no error messages.

## Summary

Installing CUDA and Pytorch tools in WSL2 turns out to be perfectly viable. I'm quite happy to have this working as I can now combine my normal Windows workload with all the goodness that comes with Linux for my data science work.

Enjoy!
