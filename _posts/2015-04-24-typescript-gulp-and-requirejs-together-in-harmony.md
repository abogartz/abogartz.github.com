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

Please see my earlier post about using [Bower and Gulp](/programming/2015/04/24/managing-dependencies-with-bower-and-gulp/) to manage dependencies.
First off, if you're reading this you probably already have Typescript installed, but if not, you'll need to install it plus a few other things.

* [NodeJS](https://nodejs.org/)
* [Typescript](http://www.typescriptlang.org)
* [Bower](http://bower.io/)
* [Gulp](http://gulpjs.com/)
* [Typescript Definition Manager](https://github.com/DefinitelyTyped/tsd)

###Problem 1

Compilation. The first thing I wanted to deal with is speeding up my compilation times. There are some wonderful tools which bundle assets very quickly, but they don't play nice with Typescript at the moment.

At first I tried out Browserify, with the "tsify" plugin, but although this worked, I didn't like that when I had any sort of compile-time error, Browserify wouldn't alert me to this. I'd have to check the terminal window to see it. Worse yet, sometimes after a compile-time error it would just stop watching for changes. Then I'd have to restart the watcher and try again. Sometimes it would just fail and not give me any output at all, and I had to comment out blocks of code to narrow down the cause. This is supposed to save me time, right?

Next up I tried Webpack, which again had super fast compile times and seemed to work. But the deal breaker was the source mapping. Webpack outputs sourcemaps with a location of `/.webpack`, which PhpStorm can't read. More on this a little later

In the end I went back to simple AMD, which is easy to output from Typescript using the flag.

    --module amd --sourcemap
    
For instance, to compile your main.ts file, you type

    tsc main.ts --module amd --sourcemap
    
This results in a main.js file, and a main.js.map file from the source file.

###Problem 2 

Debugging. As I mentioned earlier, Webpack and PhpStorm don't play nicely together. You can read more about that [here](https://github.com/webpack/webpack/issues/238). I really can't see myself using Chrome tools to work with breakpoints, considering how powerful PhpStorm's debugging tools are, so Webpack wasn't going to work. And Browserify would create sourcemaps, but compile time errors wouldn't alert me effectively. In the end, only AMD and RequireJS would give me reliable remote debugging and compile-time feedback. 

###Problem 3
Shims. One of my main gripes about working with RequireJS is the need for shims. For instance, on their site, they post the following code for using jQuery with Require.

     //require.config
     require.config({
         baseUrl: 'js/lib',
         paths: {
             // the left side is the module ID,
             // the right side is the path to
             // the jQuery file, relative to baseUrl.
             // Also, the path should NOT include
             // the '.js' file extension. This example
             // is using jQuery 1.9.0 located at
             // js/lib/jquery-1.9.0.js, relative to
             // the HTML page.
             jquery: 'jquery-1.9.0'
         }
     }); 

To me, this is *horrible*. This can totally spiral out of control and looks, well, smelly. Luckily, in Typescript you don't even need to shim anything. Instead, you create a simple file called JQuery.ts. But before doing this, we need to take advantage of the TSD tool.

    tsd install jquery
    tsd rebundle
    
Now, we can create our jQuery Typescript file and all it contains is this

    /// <reference path="./typings/tsd.d.ts"/>
    
    var jquery= jQuery;
    export = jquery;
    
 So let's say you put this in /lib/JQuery.ts. In your main.ts file, to use JQuery, you only need to add the following code at the top of your module
    
    import JQuery = require("./lib/JQuery");
    
 Now, Typescript will be happy, and you can use JQuery wherever you want.
    
###Problem 4
Loading the files. Remember in my earlier post about [dependencies](/programming/2015/04/24/managing-dependencies-with-bower-and-gulp/)? You just need to add RequireJS to the list and compile the vendor JS file again.
                    
     bower install requirejs
     gulp compileVendorJS
     tsd install require
     tsd rebundle
     
Now we can load our main.ts file. Let's suppose we put main.ts into a folder called `app`. So using the following script tag

    <script src="lib/vendor.js" data-main="app/main"></script>
    
We can load our application (remember that RequireJS is now bundled into our `vendor.js` file)

###Problem 5
Bundling. Ok, so this is all working pretty well. We can debug. The compile times are fast. We can load our AMD modules using RequireJS and use external libraries like JQuery.  But what about bundling? I don't know about you, but the RequireJS optimizer gave me problems because it needed the same list of external libraries and dependencies as the main application, and I thought the whole idea here was to avoid that mess and make it easier? Again, Gulp can help us.

Let's add a couple of new tasks here. 

    gulp.task('bundleAMD', function () {
        return gulp.src("html/js/**/*.js")
            .pipe($.amdOptimize('app/main'))
            .pipe($.concat('amd-bundle.js'))
            .pipe($.insert.append('require(["app/main"]);'))
            .pipe(gulp.dest('./dist'))
    });
    
    gulp.task('bundleCombine', function () {
        return gulp.src(["lib/vendor.js", "dist/amd-bundle.js"])
            .pipe($.concat('app.min.js', {
                newLine:';'
            }))
            .pipe($.uglify())
            .pipe(gulp.dest('./dist'))
    });

The first task takes the code from main.js and bundles everything up. It appends a small snippet of code `require(["app/main"]);` to make the app self-initiating. The second task simply combines the vendor.js file with the new bundled js file and then minifies it. The result is a file called `app.min.js`.  
  
Now we can change our script tag (or set the source conditionally with something like PHP) to 

    <script src="dist/app.min.js"></script>
    
The application will now run with a single minified JavaScript file.

I've created a [repository](https://github.com/abogartz/typescript-amd-gulp-example) with all of the working code for this. Take a look and let me know what you think!