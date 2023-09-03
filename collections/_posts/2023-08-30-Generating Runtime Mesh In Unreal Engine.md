---
title: Runtime mesh generation in Unreal Engine 5 - With LODs
excerpt : "Deploying a Unity Linux game server on the Microsoft Azure PlayFab service is a great way to host your multiplayer game and manage player data. With Azure PlayFab, game developers can leverage cloud-based infrastructure and services to scale their games and provide an optimal experience for players. In this guide, we will take you through the steps involved in deploying your Unity Linux game server on the PlayFab service, all at no cost."
layout: single-no-title
share: true
header:
  teaser: "https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_627/v1676878048/Blogsite1/unity/deployingtocloud/image_0_ggiwyx.png" #this is the thumbnail of the page
comments: true
author_profile: true
tags: game unreal-engine graphics
categories: UE5
#toc: true
#toc_sticky: true
#classes: wide
search: true #To enable site-wide search add
#permalink: /:collection/unity-game-server
---

# Runtime mesh generation in Unreal Engine 5 (C++) - With LODs

## Introduction
In this blog we will go through to major techniques to generate runtime meshes in Unreal Engine 5. We will also look at how to generate LODs for these meshes. Generating meshes at runtime is a very powerful tool to have in your arsenal. It can be used to create procedural levels, terrain, foliage, etc.

## Procedural Mesh Component
Using Unreal Engine's inbuilt mesh generation component is the easiest way to generate meshes at runtime. It is a component that can be added to any actor and can be used to generate meshes at runtime. It is also very easy to use. It has a few limitations though. It can only generate meshes with a single material. It also does not support LODs.

The official documentation for the Procedural Mesh Component can be found [here](https://docs.unrealengine.com/5.2/en-US/API/Plugins/ProceduralMeshComponent/UProceduralMeshComponent/). The documentation is very basic and does not cover all the functions. You can also go through the actual source code for more deep dive into the component.

### Creating a Procedural Mesh Component

To use this component, include the "ProceduralMeshComponent" path in the build.cs file of your project: 

```csharp
PublicDependencyModuleNames.AddRange(new string[] { 
    "Core", "CoreUObject", "Engine", "InputCore", "ProceduralMeshComponent" });
```

Also, after 4.27, plugins can now depend on other plugins, so in case you are working on a plugin instead of a project, you will have to add this to your .uplugin file:

Then include the header file in your cpp file:

```json
{
  "Modules": [
    {
      
    }
  ],
  "Plugins": [
    {
      "Name": "ProceduralMeshComponent",
      "Enabled": true
    }
  ]
}
```

