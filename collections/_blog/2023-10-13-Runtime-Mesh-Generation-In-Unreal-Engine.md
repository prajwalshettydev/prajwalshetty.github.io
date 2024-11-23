---
title: Runtime mesh generation in Unreal Engine 5 - With LODs
excerpt : "Generating Runtime Mesh In Unreal Engine 5 using C++, generating the mesh buffers, subdividing the mesh into chunks, creating their LODs and collision."
layout: single-no-title
share: true
header:
  teaser: "https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_627/v1683140916/Traffic%20Tales/FvOcMeUWIAA8sSu_pnfhyh.png" #this is the thumbnail of the page
comments: true
author_profile: true
tags: game unity server-build
categories: UE5
#toc: true
#toc_sticky: true
#classes: wide
search: true #To enable site-wide search add
permalink: /UE5/Generating-Runtime-Mesh-In-Unreal-Engine/
---


# Runtime mesh generation in Unreal Engine 5 (C++) - With LODs

## Introduction
In this blog we will go through two major techniques to generate runtime meshes in Unreal Engine 5. We will also look at how to generate LODs for these meshes. Generating meshes at runtime is a very powerful tool to have in your arsenal. It can be used to create procedural levels, terrain, foliage, etc.

![image](https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_400/v1683140916/Traffic%20Tales/FvOcMeUWIAA8sSu_pnfhyh.png){: .align-center}

We will discuss two ways to generate runtime meshes in Unreal Engine 5. The first one is using the `Procedural Mesh Component`. The second one is using the `Runtime Mesh Component`. 

{% capture notice-text %}
* *ProceduralMeshComponent* does not support LODs
* Both methods do not support "runtime mesh distance field generation", which in-turn will effect the LUMEN in >=UE5.0
  {% endcapture %}

<div class="notice">
  <h4 class="no_toc">Current Limitations:</h4>
  {{ notice-text | markdownify }}
</div>

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
Add the `UProceduralMeshComponent` to your actor's header file, and then initialize it in the constructor, just like any other component.

Now let's assume you have a function setup to generate your runtime mesh's uv, vertices, triangles, normals, tangents, etc. Following is an example for such a function:

```cpp
void AThTerrain::GenerateMesh(const int LODMultiplier, const TArray<TArray<float>>& IslandHeightMap,
                           FThTerrainChunk& Chunk)
{
	// here y and x is used to calculate the vertex positions
	for (int32 y = -HalfLength.Y; y < Chunk.Length.Y - HalfLength.Y; y += LODMultiplier)
	{
		for (int32 x = -HalfLength.X; x < Chunk.Length.X - HalfLength.X; x += LODMultiplier)
		{
			int32 rangeX = Range.Min.X + x + HalfLength.X;
			int32 rangeY = Range.Min.Y + y + HalfLength.Y;

			const float Elevation = IslandHeightMap[rangeY][rangeX];
			FVector Vertex = FVector(x * IslandCellSize, y * IslandCellSize,
			                         Elevation * IslandCellSize * IslandHeightMultiplier);
			//setup vertex buffer
			VertexBuffer.Add(Vertex);

			// Calculate UV coordinates based on the world space position of the vertex 
			const float U = ((Vertex.X + HalfLength.X * IslandCellSize) 
			            / (Chunk.Length.X * IslandCellSize)) * TextureTiling;
			const float V = ((Vertex.Y + HalfLength.Y * IslandCellSize) 
			            / (Chunk.Length.Y * IslandCellSize)) * TextureTiling;
			UVs.Add(FVector2D(U, V)); //23ms
		}
	}
	
	LOG_TIME_ELAPSED(StartTime, TEXT("UV and Vertices gen"));
	
	// Create triangles
	// here y and x is used to calculate the indexes of the vertices
	for (int32 y = 0; y < Chunk.Length.Y - LODMultiplier; y += LODMultiplier)
	{
		for (int32 x = 0; x < Chunk.Length.X - LODMultiplier; x += LODMultiplier)
		{
			const int32 nx = x / LODMultiplier;
			const int32 ny = y / LODMultiplier;

			// this is the index of the vertex at the bottom left corner of the quad,
			// calculated from the x and y indexes, ny is the row, nx is the column, 
			// nx multiplied by ny is the number of vertices in the previous rows,
			// and ny is the number of vertices in the current row
			int32 Index00 = ny * nRowWidth + nx;

			//using 1 instead of LODMultiplier here because the vertex buffer is smaller,
			//and it already has the LODMultiplier applied while its formation
			int32 Index01 = ny * nRowWidth + nx + 1;
			int32 Index10 = (ny + 1) * nRowWidth + nx;
			int32 Index11 = (ny + 1) * nRowWidth + nx + 1;

			IndexBuffer.Add(Index01);
			IndexBuffer.Add(Index10);
			IndexBuffer.Add(Index11);
		
			IndexBuffer.Add(Index00);
			IndexBuffer.Add(Index10);
			IndexBuffer.Add(Index01);
		}
	}
}
```

Similarly, you can also generate the normals and tangents for the mesh. Once you have all the data ready, you can use the following function to create the mesh:

Once the mesh data is generated, you can use the following function from the `UProceduralMeshComponent` to create the mesh:
```cpp
void CreateMeshSection
(
    int32 SectionIndex,
    const TArray< FVector > & Vertices,
    const TArray< int32 > & Triangles,
    const TArray< FVector > & Normals,
    const TArray< FVector2D > & UV0,
    const TArray< FVector2D > & UV1,
    const TArray< FVector2D > & UV2,
    const TArray< FVector2D > & UV3,
    const TArray< FColor > & VertexColors,
    const TArray< FProcMeshTangent > & Tangents,
    bool bCreateCollision
)
```
*link to above code's official documentation: [here](https://docs.unrealengine.com/5.3/en-US/API/Plugins/ProceduralMeshComponent/UProceduralMeshComponent/CreateMeshSection/2/)*
{: .notice--success}

## Runtime Mesh Component

<a href="https://github.com/TriAxis-Games/RealtimeMeshComponent" class="btn btn--inverse">Github Link</a>

Runtime mesh component is an external plugin that can be used to generate meshes at runtime. It is a very powerful plugin that can be used to generate meshes with multiple materials and LODs. It is also very easy to use. But currently the documentation is not very good. So you will have to go through the source code to understand how to use it. The source code is very well documented and easy to understand.

The RuntimeMeshComponent or more commonly known as RMC, is a replacement to the ProceduralMeshComponent (aka PMC) found in UE4. The RMC is much more efficient, and carries many more features, while allowing for a much more fine-grained approach for advanced use cases, while being simple to use just like the PMC. It can handle any use case from simply loading models at runtime, to debug views, to modification of existing models all the way up to procedural generation of entire worlds!

The RMC has been around for 6+ years and has an active community of users from individuals, to schools, to Fortune 500 companies, with many released projects. You can also find active support in their Discord server here:  [https://discord.gg/KGvBBTv](https://discord.gg/KGvBBTv){:target="_blank"}

### Creating mesh using Runtime Mesh Component

To use this component, include the "RuntimeMeshComponent" path in the build.cs file of your project: 

```csharp
PublicDependencyModuleNames.Add("RealtimeMeshComponent");
```
Also make sure you add the `#include "RealtimeMeshSimple.h"` header file in your cpp file:



Let's assume you have a function setup to generate your runtime mesh's uv, vertices, triangles, normals, tangents, etc. similar to the one we used for the PMC. 

Once the mesh data is generated, you can use the following function from the `URuntimeMeshComponent` to create the mesh:
```cpp
URealtimeMeshSimple* GeneratedMesh = Chunk.MeshComponent->InitializeRealtimeMesh<URealtimeMeshSimple>();

FRealtimeMeshSimpleMeshData LODMeshData;
LODMeshData.Positions = VertexBuffer;
LODMeshData.Triangles = IndexBuffer;
LODMeshData.Normals = Normals;
LODMeshData.UV0 = UVs;
LODMeshData.Tangents = Tangents_vec;

// binary logarithm (log base 2), This will convert 1 to 0, 2 to 1, 4 to 2, 8 to 3, and 16 to 4.
FRealtimeMeshLODKey LODKey = FRealtimeMeshLODKey(std::log2(LODMultiplier));

Chunk.GeneratedRealtimeMesh->CreateMeshSection(
    LODKey, FRealtimeMeshSectionConfig(ERealtimeMeshSectionDrawType::Static, 0),
    LODMeshData, false);
```

### Generating LODs for Runtime Mesh Component

The RMC supports LODs. It can generate LODs for the mesh at runtime. It can also generate LODs for the mesh in the editor. The LODs are generated by setting the `FRealtimeMeshLODKey` while setting mesh section data. So if you want to generate LODs for your mesh, you will have to generate the mesh for each LOD. The LODs are generated using the following function:

```cpp

void AThTerrain::CreateMeshChunk(const TArray<TArray<float>>& IslandHeightMap, FThTerrainChunk& Chunk)
{
	URealtimeMeshSimple* GeneratedMesh = Chunk
	        .MeshComponent->InitializeRealtimeMesh<URealtimeMeshSimple>();
	Chunk.GeneratedRealtimeMesh = GeneratedMesh;
	
	Chunk.Stats.LODs.Empty();

	FIntPoint Length;
	Length.X = (Chunk.Length.X % 2 == 0) ? Chunk.Length.X : Chunk.Length.X - 1;
	Length.Y = (Chunk.Length.Y % 2 == 0) ? Chunk.Length.Y : Chunk.Length.Y - 1;
	
	const float IslandX = Chunk.Range.Min.X * IslandCellSize - Length.X / 2;
	const float IslandY = Chunk.Range.Min.Y * IslandCellSize - Length.Y / 2;

	Chunk.MeshComponent->SetRelativeLocation(
	        FVector(IslandX - IslandLocation.X, IslandY - IslandLocation.Y, 0));

	GeneratedMesh->UpdateLODConfig(FRealtimeMeshLODKey(0), FRealtimeMeshLODConfig(1));
	CreateLOD(1, IslandHeightMap, Chunk);

	GeneratedMesh->AddLOD(FRealtimeMeshLODConfig(0.9));
	CreateLOD(2, IslandHeightMap, Chunk);
	
	GeneratedMesh->AddLOD(FRealtimeMeshLODConfig(0.4));
	CreateLOD(4, IslandHeightMap, Chunk);
	
	//CreateLOD(8, IslandHeightMap, Chunk);
}
```

Here, `FRealtimeMeshLODConfig` set's the desired screensize for the LOD. The range of the variable is usually 0 to 1, for 1 being entire screen
Since LOD 0 already exists, we use `UpdateLODConfig` to set it's screen size (although optional, as it's visible by default), for rest of the LODs we use `AddLOD` to add them to the mesh.

Each RealtimeMeshComponent can have 1-8 Levels of Detail or LODs, each of which can have any number of section groups, each of which can have any number of sections. Each LOD is separate from the others, and so can have different numbers of sections and different materials bound to those sections.

Each LOD has a ScreenSize associated to it. This is the percent of the screen the bounding volume has to cover before this LOD is rendered.


