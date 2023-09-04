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
https://nerivec.github.io/old-ue4-wiki/pages/procedural-mesh-component-in-cgetting-started.html
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

```cpp
	/**
	*	Create/replace a section for this procedural mesh component.
	*	@param	SectionIndex		Index of the section to create or replace.
	*	@param	Vertices			Vertex buffer of all vertex positions to use for this mesh section.
	*	@param	Triangles			Index buffer indicating which vertices make up each triangle. Length must be a multiple of 3.
	*	@param	Normals				Optional array of normal vectors for each vertex. If supplied, must be same length as Vertices array.
	*	@param	UV0					Optional array of texture co-ordinates for each vertex. If supplied, must be same length as Vertices array.
	*	@param	VertexColors		Optional array of colors for each vertex. If supplied, must be same length as Vertices array.
	*	@param	Tangents			Optional array of tangent vector for each vertex. If supplied, must be same length as Vertices array.
	*	@param	bCreateCollision	Indicates whether collision should be created for this section. This adds significant cost.
	*/

// '''Don't use this function'''. It is deprecated. Use LinearColor version.
void CreateMeshSection(int32 SectionIndex, const TArray<FVector>& Vertices, const TArray<int32>& Triangles, const TArray<FVector>& Normals, const TArray<FVector2D>& UV0, const TArray<FColor>& VertexColors, const TArray<FProcMeshTangent>& Tangents, bool bCreateCollision);
```

```cpp
void AMyActor::CreateTriangle()
{
	TArray<FVector> vertices;
	vertices.Add(FVector(0, 0, 0));
	vertices.Add(FVector(0, 100, 0));
	vertices.Add(FVector(0, 0, 100));

	TArray<int32> Triangles;
	Triangles.Add(0);
	Triangles.Add(1);
	Triangles.Add(2);

	TArray<FVector> normals;
	normals.Add(FVector(1, 0, 0));
	normals.Add(FVector(1, 0, 0));
	normals.Add(FVector(1, 0, 0));

	TArray<FVector2D> UV0;
	UV0.Add(FVector2D(0, 0));
	UV0.Add(FVector2D(10, 0));
	UV0.Add(FVector2D(0, 10));
	

	TArray<FProcMeshTangent> tangents;
	tangents.Add(FProcMeshTangent(0, 1, 0));
	tangents.Add(FProcMeshTangent(0, 1, 0));
	tangents.Add(FProcMeshTangent(0, 1, 0));

	TArray<FLinearColor> vertexColors;
	vertexColors.Add(FLinearColor(0.75, 0.75, 0.75, 1.0));
	vertexColors.Add(FLinearColor(0.75, 0.75, 0.75, 1.0));
	vertexColors.Add(FLinearColor(0.75, 0.75, 0.75, 1.0));

	mesh->CreateMeshSection_LinearColor(0, vertices, Triangles, normals, UV0, vertexColors, tangents, true);
        
        // Enable collision data
	mesh->ContainsPhysicsTriMeshData(true);
}
```




