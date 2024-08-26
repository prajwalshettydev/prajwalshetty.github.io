---
title: How to switch from a full time Unity C# developer to Unreal Engine 5 C++ in 4 hours
excerpt : "Deploying a Unity Linux game server on the Microsoft Azure PlayFab service is a great way to host your multiplayer game and manage player data. With Azure PlayFab, game developers can leverage cloud-based infrastructure and services to scale their games and provide an optimal experience for players. In this guide, we will take you through the steps involved in deploying your Unity Linux game server on the PlayFab service, all at no cost."
layout: single
share: true
header:
  teaser: "https://res.cloudinary.com/dwfkishzf/image/upload/c_scale,w_627/v1676878048/Blogsite1/unity/deployingtocloud/image_0_ggiwyx.png" #this is the thumbnail of the page
comments: true
author_profile: true
tags: game unity unreal
categories: unreal
feature_image: "https://picsum.photos/2560/600?image=872"
#toc: true
#toc_sticky: true
#classes: wide
search: true #To enable site-wide search add
#permalink: /:collection/unity-game-server
---

First of all, whom am I kidding, it obviously takes months of practice to master unreal c++, with all of it's anomalies, coding standards and terminologies. But I strongly believe, our expertise are usually beyond game engines, and a switch like this should never stop a game developer from exploring whatever tool they want to try, and also whatever kind of game they want to build. So if you already are a rockstar c# Unity developer, who understands the engine in and out, techinically it shouldnt take you much time start coding in Unreal c++ straight away. But keep in mind, coding using an engine vs mastering it are two compeltly different things, the later will obviosuly take more time, but the former can be instant, and it hits right at home when you compile that first character walk script and start building your game using unreal c++.

##### Prerequisites:
* Understands Unity/C# in and out
* Understands basic c# concepts like async, linq, threading, templates, IEnumerators, 
* Good with Unity Mirror or Fishnet like multiplayer packages (optional)
* Game code, game terminologies, architecture, oop, game math and other basics
* UE5 downloaded and installed

##### What this blog will not make you in 2 hours:
* 5 years experienced senior unreal engine c++ developer
* a fully built and depolyed AAA game in steam
* explain how AAA games architecure works
* show you how the amazing Bend studio build that horde mechanism in unreal for Days Gone ❤️‍🔥

##### What this blog will do in 4 hours:
* you will be able to start coding in unreal c++ 🔥
* you will stop missing unity
* you will never hate c++ again
* you will know the terminlogies and where/who of things to port your mini unity games to c#
* you can also use this doc as a reference point for future learning. 

##### Disclaimer
* im not a great writer for beginners tbh, so if you just started coding or started coding with unity, then this is obvisouly not the right blog for you.
* I wont be comparing which engine or programming language is better or why you should just build your own game engine or etc ridiculous arguements, I think it always depends on context, to each their own. 
* the tone of this blog-site is intentionally casual to better mask the obvious difficulties of the switch 🥲

Ok, our time starts now. 

### Let's Dive Right F'ing In:

I would assume you have Unreal Engine 5 downloaded and setup already, with a dummy empty project open with starter content. Let's call the project "OneLastSignal". 




### Tech stack used to build this site:

* [Jekyll](https://jekyllrb.com/){:target="_blank"} 
<!-- {:target="_blank"} opens the link in a new tab -->
* [Github pages](https://pages.github.com/){:target="_blank"}
* [Cloudinary](https://cloudinary.com/){:target="_blank"}
* [Giscus.app](https://giscus.app/){:target="_blank"}
* [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes){:target="_blank"}
* [ChatGpt](https://openai.com/blog/chatgpt/){:target="_blank"} (Approx 10% of site's content)
* [Google Domains](https://domains.google/){:target="_blank"}

### Tools used:

* [Adobe Express](https://www.adobe.com/express/){:target="_blank"}
* [Fotor.com](https://www.fotor.com/){:target="_blank"}
* [Realfavicongenerator.net](https://realfavicongenerator.net/){:target="_blank"}
* [Privacypolicies.com](https://www.privacypolicies.com/)
  
### Third party integrations

* [Google Analytics](https://analytics.google.com/analytics/web/){:target="_blank"}

### Dev Environment

- OS:
  * Windows 11
  * WSL2

- IDE:
  * JetBrains Rider
  * VS Code
  * Visual Studio 19/22

