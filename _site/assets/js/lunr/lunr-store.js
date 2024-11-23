var store = [{
        "title": "Deploying Unity Game Server Into Playfab Cloud",
        "excerpt":"Deploying Unity Game Server Into Playfab Cloud Microsoft Azure PlayFab service is a great way to host your multiplayer game and manage player data. With Azure PlayFab, game developers can leverage cloud-based infrastructure and services to scale their games and provide an optimal experience for players. In this guide, I...","categories": ["unity"],
        "tags": ["game","unity","server-build"],
        "url": "/Unity/Deploying-Unity-Game-Server-Into-Playfab-Cloud/",
        "teaser": "https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_627/v1676878048/Blogsite1/unity/deployingtocloud/image_0_ggiwyx.png"
      },{
        "title": "Runtime mesh generation in Unreal Engine 5 - With LODs",
        "excerpt":"Runtime mesh generation in Unreal Engine 5 (C++) - With LODs Introduction In this blog we will go through two major techniques to generate runtime meshes in Unreal Engine 5. We will also look at how to generate LODs for these meshes. Generating meshes at runtime is a very powerful...","categories": ["unity"],
        "tags": ["game","unity","server-build"],
        "url": "/UE5/Generating-Runtime-Mesh-In-Unreal-Engine/",
        "teaser": "https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_627/v1683140916/Traffic%20Tales/FvOcMeUWIAA8sSu_pnfhyh.png"
      },{
        "title": "Compilation of the best Unreal Engine C++ resources for learning threading, networking, and more",
        "excerpt":"Here’s a compilation of all the must-have Unreal Engine links for quick reference. This is a collection I’ve curated throughout my Unreal journey, covering those tricky C++ quirks, multiplayer setup, multithreading, performance optimization, and more. The official Unreal docs often fall short on these advanced topics, and these links have...","categories": ["UE5"],
        "tags": ["game","unity","unreal"],
        "url": "/UE5/Useful-Unreal-Links",
        "teaser": "https://res.cloudinary.com/dwfkishzf/image/upload/c_crop,q_80,w_314,h_240/v1724631627/Blogsite1/Unreal/5075c831-ad9a-4610-9213-e9bf88250279.webp"
      },,{
    "title": "About this site",
    "excerpt":"Welcome to my personal blog! My name is Prajwal Shetty, and I’m a game developer with 5 years of experience in the industry. I specialize in game programming and 3D math, with expertise in Unity, Unreal Engine 5, and Blender Python API. I have a particular interest in open-world games...","url": "http://localhost:4000/About-this-site"
  },{
    "title": null,
    "excerpt":"     404     Page not found :(    The requested page could not be found.   ","url": "http://localhost:4000/404.html"
  },{
    "title": "",
    "excerpt":" ","url": "http://localhost:4000/blog/"
  },{
    "title": "Posts by Category",
    "excerpt":" ","url": "http://localhost:4000/categories/"
  },{
    "title": null,
    "excerpt":" ","url": "http://localhost:4000/contact"
  },{
    "title": null,
    "excerpt":"","url": "http://localhost:4000/collections/"
  },{
    "title": "Posts by Tag",
    "excerpt":"","url": "http://localhost:4000/tags/"
  },{
    "title": null,
    "excerpt":"🌟🌌💻🛸🪂🍺🌍🦕 Deploying Unity Builds To Playfab With Azure PlayFab, game developers can leverage cloud-based infrastructure and services to scale their games and provide an optimal experience for players. Read More Runtime Mesh Generation in Unreal Engine 5 Generating Runtime Mesh In Unreal Engine 5 using C++, generating the mesh buffers,...","url": "http://localhost:4000/"
  },{
    "title": null,
    "excerpt":"var idx = lunr(function () { this.field('title') this.field('excerpt') this.field('categories') this.field('tags') this.ref('id') this.pipeline.remove(lunr.trimmer) for (var item in store) { this.add({ title: store[item].title, excerpt: store[item].excerpt, categories: store[item].categories, tags: store[item].tags, id: item }) } }); $(document).ready(function() { $('input#search').on('keyup', function () { var resultdiv = $('#results'); var query = $(this).val().toLowerCase(); var result = idx.query(function...","url": "http://localhost:4000/assets/js/lunr/lunr-en.js"
  },{
    "title": null,
    "excerpt":"step1list = new Array(); step1list[\"ΦΑΓΙΑ\"] = \"ΦΑ\"; step1list[\"ΦΑΓΙΟΥ\"] = \"ΦΑ\"; step1list[\"ΦΑΓΙΩΝ\"] = \"ΦΑ\"; step1list[\"ΣΚΑΓΙΑ\"] = \"ΣΚΑ\"; step1list[\"ΣΚΑΓΙΟΥ\"] = \"ΣΚΑ\"; step1list[\"ΣΚΑΓΙΩΝ\"] = \"ΣΚΑ\"; step1list[\"ΟΛΟΓΙΟΥ\"] = \"ΟΛΟ\"; step1list[\"ΟΛΟΓΙΑ\"] = \"ΟΛΟ\"; step1list[\"ΟΛΟΓΙΩΝ\"] = \"ΟΛΟ\"; step1list[\"ΣΟΓΙΟΥ\"] = \"ΣΟ\"; step1list[\"ΣΟΓΙΑ\"] = \"ΣΟ\"; step1list[\"ΣΟΓΙΩΝ\"] = \"ΣΟ\"; step1list[\"ΤΑΤΟΓΙΑ\"] = \"ΤΑΤΟ\"; step1list[\"ΤΑΤΟΓΙΟΥ\"] = \"ΤΑΤΟ\"; step1list[\"ΤΑΤΟΓΙΩΝ\"] = \"ΤΑΤΟ\"; step1list[\"ΚΡΕΑΣ\"]...","url": "http://localhost:4000/assets/js/lunr/lunr-gr.js"
  },{
    "title": null,
    "excerpt":"var store = [ {%- for c in site.collections -%} {%- if forloop.last -%} {%- assign l = true -%} {%- endif -%} {%- assign docs = c.docs | where_exp:'doc','doc.search != false' -%} {%- for doc in docs -%} {%- if doc.header.teaser -%} {%- capture teaser -%}{{ doc.header.teaser }}{%- endcapture...","url": "http://localhost:4000/assets/js/lunr/lunr-store.js"
  },{
    "title": "Looks like you're offline",
    "excerpt":"It appears that you've lost your network connection and this document doesn't exist on your device.  Try either returning to the previous page, using the navigation to find your way back, or restore your network connection. ","url": "http://localhost:4000/offline/"
  },{
    "title": "Prajwal Shetty's Portfolio",
    "excerpt":"Welcome to my portfolio! Resume{:target=\"_blank\"} Github{:target=\"_blank\"} Linkedin{:target=\"_blank\"} [//]: # ( Github{:target=\"_blank\"}) ## Professional Projects: ### Animalia Card Game - Kevuru Games Animalia is an independent f2p online NFT trading card game featuring crypto-inspired meme creatures. I worked on both client and server sides, with a .NET backend in the server...","url": "http://localhost:4000/portfolio"
  },{
    "title": "Privacy Policy",
    "excerpt":"Last updated: November 22, 2024 This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You. We use Your Personal data to provide and improve the...","url": "http://localhost:4000/privacy-policy"
  },{
    "title": "Posts by Tag",
    "excerpt":"","url": "http://localhost:4000/tags/"
  },{
    "title": "Terms and Conditions",
    "excerpt":"Last updated: February 21, 2023 Please read these terms and conditions carefully before using Our Service. # Interpretation and Definitions ## Interpretation The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they...","url": "http://localhost:4000/terms"
  },{
    "title": null,
    "excerpt":"{}","url": "http://localhost:4000/redirects.json"
  },{
    "title": null,
    "excerpt":"{% if page.xsl %}{% endif %}Jekyll{{ site.time | date_to_xmlschema }}{{ page.url | absolute_url | xml_escape }}{% assign title = site.title | default: site.name %}{% if page.collection != \"posts\" %}{% assign collection = page.collection | capitalize %}{% assign title = title | append: \" | \" | append: collection %}{% endif...","url": "http://localhost:4000/feed.xml"
  },{
    "title": null,
    "excerpt":"{% if page.xsl %} {% endif %} {% assign collections = site.collections | where_exp:'collection','collection.output != false' %}{% for collection in collections %}{% assign docs = collection.docs | where_exp:'doc','doc.sitemap != false' %}{% for doc in docs %} {{ doc.url | replace:'/index.html','/' | absolute_url | xml_escape }} {% if doc.last_modified_at or doc.date...","url": "http://localhost:4000/sitemap.xml"
  },{
    "title": null,
    "excerpt":"Sitemap: {{ \"sitemap.xml\" | absolute_url }} ","url": "http://localhost:4000/robots.txt"
  }]
