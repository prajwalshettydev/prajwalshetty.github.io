---
title: Deploying Unity Game Server Into Playfab Cloud
excerpt : "Deploying a Unity Linux game server on the Microsoft Azure PlayFab service is a great way to host your multiplayer game and manage player data. With Azure PlayFab, game developers can leverage cloud-based infrastructure and services to scale their games and provide an optimal experience for players. In this guide, we will take you through the steps involved in deploying your Unity Linux game server on the PlayFab service, all at no cost."
layout: single
share: true
header:
  teaser: "https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_627/v1676878048/Blogsite1/unity/deployingtocloud/image_0_ggiwyx.png" #this is the thumbnail of the page
comments: true
author_profile: true
tags: game unity server-build
categories: unity
#toc: true
#toc_sticky: true
#classes: wide
search: true #To enable site-wide search add
#permalink: /:collection/unity-game-server
---


Microsoft Azure PlayFab service is a great way to host your multiplayer game and manage player data. With Azure PlayFab, game developers can leverage cloud-based infrastructure and services to scale their games and provide an optimal experience for players. In this guide, I will take you through the steps involved in deploying your Unity Linux game server on the PlayFab service, all at no cost.

### Prerequisites:

* Supports both Mirror and Fishnet
* Server is set up in a Linux container.
* Dev machine: Windows 10/11
* Needs a [PlayFab Account](https://developer.playfab.com/en-US/sign-up) with payments setup (you wont be charged)

### Initial setup:
#### Machine and Project Setup: (Windows 10/11)

* Enable WSL2 and install Ubuntu distro. More info: [Set up your Windows development device - PlayFab \| Microsoft Docs](https://docs.microsoft.com/en-us/gaming/playfab/features/multiplayer/servers/deploying-linux-based-builds#set-up-your-windows-development-device)
* Install and setup Docker for wsl2 and make sure it’s running [Linux Containers](https://docs.docker.com/desktop/windows/#switch-between-windows-and-linux-containers)
* Add Linux Build support module to your Unity Engine Installation
* Access to the game’s [PlayFab developer account](https://developer.playfab.com/) and its docker **"Azure container registry"** credentials for a new build. 
* Make sure your project has [Unity C# SDKs for PlayFab](https://github.com/PlayFab/UnitySDK) and [UnityGsdk](https://github.com/PlayFab/gsdk/tree/main/UnityGsdk) (Playfab game server SDK for unity) setup and the api’s have already been integrated. (Sample [server script](https://github.com/PlayFab/MpsSamples/blob/main/UnityMirror/UnityServer/Assets/Server/Scripts/AgentListener.cs) & [client script](https://github.com/natepac/playfabmirrorgameexample/blob/master/Assets/Scripts/ClientStartUp.cs))
* Setup either [mirror](https://assetstore.unity.com/packages/tools/network/mirror-129321) or [fishnet](https://assetstore.unity.com/packages/tools/network/fish-net-networking-evolved-207815) in the project, and add their network managers into the scene

#### Network Manager Setup for Mirror:

* Create a new custom network manager as a inherited child class of mirrors network manager and add the KCP transport component into the same gameobject, which inturn uses UDP protocol

* Add a simple switch in the custom network manager like in the below image and set up all other necessary events like OnClientJoined etc in the script.

![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_627/v1676878048/Blogsite1/unity/deployingtocloud/image_0_ggiwyx.png){: .align-center}{: .text-nowrap}

* Add server and client listener scripts as child of the network manager gameobject

#### Network Manager Setup for Fishnet:

* Create a new custom network manager script, similar to the above mirror one.

* Add fishnet’s network manager as the child of the above gameobject along with it’s tugboat transport component

![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_240/v1676878048/Blogsite1/unity/deployingtocloud/image_1_co4xmc.png) ![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_240/v1676878048/Blogsite1/unity/deployingtocloud/image_2_mhaehy.png) ![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_240/v1676878047/Blogsite1/unity/deployingtocloud/image_3_d6mwtl.png){: .text-nowrap}

* Add server and client listener scripts for playfab as child of custom network manager gameobject

### Build and Deploy:
#### Building the headless server:
* Switch to `Dedicated-Server` Build mode and Select `Linux` as Target Platform
![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_450/v1676878048/Blogsite1/unity/deployingtocloud/image_4_z8g7w9.png){: .align-center}{: .text-nowrap}
* In Custom networkManager, switch Build type to **REMOTE_SERVER**
*(which in turn enables the agent-listener script)*
![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_450/v1676878048/Blogsite1/unity/deployingtocloud/image_5_lqulud.png){: .align-center}
* **Build** the game and once build complete, create **docker file** in the build’s **parent** directory 
[Create a Dockerfile - PlayFab \| Microsoft Docs](https://docs.microsoft.com/en-us/gaming/playfab/features/multiplayer/servers/deploying-linux-based-builds#create-a-dockerfile)
Directory and file should look something like the below image and the parent directory shouldn’t have any other files/directories except the dockerfile and game directory 
(Note: Exclude the *"ServerX_BurstDebugInformation_DoNotShip"* Directory before creating the docker image of build folder.)

![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_200/v1676878049/Blogsite1/unity/deployingtocloud/image_6_ca0unr.png)  ![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_500/v1676878049/Blogsite1/unity/deployingtocloud/image_7_ptlqzo.png)

#### Creating and Deploying the Docker Image:
* Copy the Docker Creds from [PlayFab developer account](https://developer.playfab.com/)
![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_350/v1676878047/Blogsite1/unity/deployingtocloud/image_8_zzs3sd.png) ![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_350/v1676878049/Blogsite1/unity/deployingtocloud/image_9_jbrowe.png)
* In your windows machine, open the ubuntu terminal (not windows cmd), 
* move to the directory which contains the previously created Dockerfile, 
```bash
cd mnt/c/Code/Test/battle-axes/Builds/server5/
```
* run the login command 
```bash
docker login -u <username_here> -p <password_here> <url_here>*
```
* run the build docker image command
```bash
docker build -t <url_here>/battleaxes_server:v1 .
```

**Note:** there is a `.` in the end of above command which means all files in the directory and increment `v1` (vX) based on previously uploaded version)*
{: .notice--warning}

* Now **before pushing** this image to the cloud, **test it locally** by following [these steps](#testing-locally-using-playfabs-mpslocalagent).
* run the `push` docker build to cloud command
```bash
docker push <url_here>/battleaxes_server:v1
```

### Testing the headless server:

#### Testing locally using playfab’s MpsLocalAgent:

* Download the localAgent that’s required for testing playfab builds locally.
  Url: [Releases · PlayFab/MpsAgent · GitHub](https://github.com/PlayFab/MpsAgent/releases)
* Setup the **MultiplayerSettings.json **file in the downloaded directory.
more_info: [Debug Container-based game servers using LocalMultiplayerAgent \| Microsoft Docs](https://docs.microsoft.com/en-us/gaming/playfab/features/multiplayer/servers/localmultiplayeragent/run-container-gameserver#configure-multiplayersettingsjson)

The file should look something like this in the end:

![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_500/v1676878048/Blogsite1/unity/deployingtocloud/image_10_nylant.png){: .align-center}

* Now open windows terminal in the downloaded directory and run command:
```bash
.\LocalMultiplayerAgent.exe -lcow
```

Note: `lcow` stands for Linux Containers On Windows
{: .notice--info}

* Once the local server goes to "active", connect a local client with `ip: 127.0.0.1 and port 56100`

#### Using SSH into running cloud server:

* Click on "Connect to Virtual Machine" in builds of playfab developer console
* Open your windows terminal and Run the ssh command
```bash
ssh <id_here>@<ip_here> -p <port_here>
```
* Run the Docker ps to get current running container info
```bash
sudo docker ps -a
```
* Get current server logs by cmd:
```bash
sudo docker logs <docker_container_id>
```

#### Testing locally using ParrelSync and three Unity editor instances:
* Setup ParrelSync in the project
  [GitHub - VeriorPies/ParrelSync: (Unity3D) Test multiplayer without building](https://github.com/VeriorPies/ParrelSync)
* Have three editor instance running, one will be playfab_server and the other two will be playfab_clients (not local clients), 
* Join the server from other clients using the default local host ip address (0.0.0.0) and default local port.

#### Common issues:

* If you get an error called: "You must set `PlayFabSettings.TitleId` before making API Calls." you can get the title id from playfab developer console. 

![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/v1676878046/Blogsite1/unity/deployingtocloud/image_11_mfdk0m.png){: .align-center}

* If you get this error "network playfab not found"![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/v1676878049/Blogsite1/unity/deployingtocloud/image_12_mpbdwj.png)
Open “**SetupLinuxContainersOnWindows.ps1**” in LocalMultiplayerAgentPublish you just downloaded and run this “docker network create playfab --driver bridge”  in your linux distribution .

### Connecting to our playfab game server as client:
#### Client Build Setup:
* Switch back to whatever target platform you were previously in from the dedicated server platform.
* In Custom networkManager, switch Build type to `PLAYFAB_CLIENT`
*(which in turn enables the client-startup script)*

![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_500/v1676878047/Blogsite1/unity/deployingtocloud/image_13_mtxtp3.png){: .align-center}

* In the playfab dashboard, click on the "request server", when you have standby servers, and then Get the **ip address**, **port** and **build id** from the playfab console on the website.

![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_300/v1676878049/Blogsite1/unity/deployingtocloud/image_14_wxur4r.png)![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_500/v1676878049/Blogsite1/unity/deployingtocloud/image_15_imu4ew.png)

* Make sure you have the right **build-id, ipAddress, port **and **region** set in the custom network manager or the network manager script and save scene for all clients

![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_500/v1676878049/Blogsite1/unity/deployingtocloud/image_16_fblvj2.png){: .align-center}

* Now with server already running, Click on **Start game** from **clients in UnityEditor**, and this should connect them all together.

![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_300/v1676878047/Blogsite1/unity/deployingtocloud/image_17_ddjguf.png){: .align-center}

* Now open a second client and click on "**Join Game**" button, enter the configuration you received above

![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/v1676878047/Blogsite1/unity/deployingtocloud/image_18_kc8i3q.png){: .align-center}

### Multiple instances:

#### Inspecting multiple instances in same VM:
* Containers use "playfab" network plugins, to inspect the instances in the machine run:
```bash
docker inspect network playfab
```
* More details: [Connecting clients to game servers - PlayFab \| Microsoft Learn](https://learn.microsoft.com/en-us/gaming/playfab/features/multiplayer/servers/connecting-clients-to-game-servers)

![image alt text](https://res.cloudinary.com/dwfkishzf/image/upload/v1676878049/Blogsite1/unity/deployingtocloud/image_19_rxypqg.png){: .align-center}