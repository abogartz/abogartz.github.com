---
layout: post
title: "Managing dependencies with Bower and Gulp"
description: ""
categories : [Programming]
tags: [Gulp, Bower, Build Tools]
---
{% include JB/setup %}

Here's a quick method of dealing with external libraries. [Bower](http://www.bower.io) makes it really easy to work with external libraries. For instance, loading jQuery into your project is as easy as typing `bower install jquery`.
 
 So what does this do? It downloads the jQuery repository to a folder called `query` in `bower_components`. From there, you can add your script tag like this.
 
`<script src="bower_components/jquery/dist/jquery.js"></script>`

However, when you add an additional library such as Greensock's Tweenmax, you end up stacking the dependencies.

    <script src="bower_components/jquery/dist/jquery.js"></script>
    <script src="bower_components/greensock/minified/TweenMax.min.js"></script>
    
After you download a dozen third party libraries, this can get out of hand. To make this easier, I've created a Gulp task that takes all of the Bower libraries and compiles them into a single JavaScript file. From there you just need to include the one file, and then whenever you add any additional libraries you will run the Gulp task again.

To learn more about Gulp, see their homepage. You need to install NodeJS and [Gulp](http://gulpjs.com) for this to work.

Here is my package.json file (this goes in the root of your project).

    {
      "name": "GulpBower",
      "version": "0.0.1",
      "devDependencies": {
        "gulp": "^3.8.11",
        "gulp-concat": "^2.5.2",
        "gulp-filelog": "^0.4.1",
        "gulp-load-plugins": "^0.10.0",
        "gulp-notify": "^2.2.0",
        "main-bower-files": "^2.6.2"
      }
    }
    
After this, you need to create a file called gulpfile.js.

    var gulp = require('gulp');
    var $ = require('gulp-load-plugins')({pattern: '*'});
    
    gulp.task('compileVendorJS', function () {
        return gulp.src($.mainBowerFiles({filter: "**/*.js"}))
            .pipe($.filelog())
            .pipe($.concat('vendor.js'))
            .pipe(gulp.dest('./lib'))
            .pipe($.notify({message: 'Vendor JS compiled!'}));
    });
    
And then simply run `gulp compileVendorJS` from the terminal to combine the libraries.    

