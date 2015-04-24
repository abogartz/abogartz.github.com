---
layout: post
title: "Typescript, Gulp, and RequireJS Together in Harmony"
description: ""
categories : [Programming]
tags: [Typescript, Gulp, RequireJS, Build Tools]
---
{% include JB/setup %}

I really like Typescript. I like the syntax and the way the code stays very readable. But unlike vanilla JavaScript, there's a compile step involved, and in larger projects this compilation can start to really slow things down. I found this out while working on a WebGL project, and with the added strain on my laptop of running the app, my compilation times were between 5 and 10 seconds just to see a small change. I needed to explore some other options.

My first step was to try a different IDE. I use PhpStorm, which is just so cool and chock full of features, but it can be a little bloated, so I checked out of a few alternatives and found the Atom editor from GitHub. I'll cut the story short and just say that this lead me to experiment with using AMD modules and RequireJS to reduce my compile times. Let me run you through the problems and the solutions I found. I'm curious if any of you have some better ideas.

###Prerequisites

First off, if you're reading this you probably already have Typescript installed, but if not, you'll need to install it plus a few other things.

* [NodeJS](https://nodejs.org/)
* [Typescript](http://www.typescriptlang.org)
* [Bower](http://bower.io/)
* [Gulp](http://gulpjs.com/)
* [Typescript Definition Manager](https://github.com/DefinitelyTyped/tsd)

###Problem 1

Compilation. The first thing I wanted to deal with is speeding up my compilation times. There are some wonderful tools which handle this, but they don't play nice with Typescript at the moment.

At first I tried out Browserify, with the "tsify" plugin, but although this worked, I didn't like that when I had any sort of compile-time error, Browserify wouldn't alert me to this. I'd have to check the terminal window to see it. Worse yet, sometimes after a compile-time error it would just stop watching for changes. Then I'd have to restart the watcher and try again. Sometimes it would just fail and not give me any output at all, and I had to comment out blocks of code to narrow down the cause. This is supposed to save me time, right?

Next up I tried Webpack, which again had super fast compile times and seemed to work. But the deal breaker was the source mapping. Webpack outputs sourcemaps with a location of /.webpack, which PhpStorm can't read. So as of this writing, Webpack is out until Jetbrains or the Webpack team figures this out.

So I went back to simple AMD. AMD is easy to output from Typescript using the flag

```--module amd --sourcemap```
This results in a .js file, and a .js.map file for each Typescript source.
