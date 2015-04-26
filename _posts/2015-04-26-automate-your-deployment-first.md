---
layout: post
title: "Automate Your Deployment First"
description: ""
category:
tags: []
---
{% include JB/setup %}

I'm sure this isn't news to anyone, but if you work for clients, then no matter what the project is you'll be delivering a set of files to them. And usually you'll do this over and over to fix bugs or make revisions. And while we take pains to make sure our code is DRY (which means "don't repeat yourself"), we sometimes fail to notice all the other things we do repeatedly. After a while, these small tasks can add up to hours or even days of effort. Any time you do something more than once, it makes sense to step back and ask yourself if the process can be automated.

With this in mind, the first thing I like to do when starting a project is to set up a place to host the project online, and write a script that bundles the project files and posts them online. While there are a lot of ways to approach this, the most important thing to do is to make sure that your process is reliable and repeatable, so that what gets posted to the server is always the most recent and complete version of the application. For me, the solution is to use Git and a NodeJS library called [Flightplan](https://github.com/pstadler/flightplan). For this to work, you have to have a server which supports SSH and has Git installed. I won't get into this here, but you need to set up SSH keys like you would for [Github](https://help.github.com/articles/generating-ssh-keys/). You will then have to copy your public key to your deployment server. As an example, here's how you would do this with a [Media Temple](http://kb.mediatemple.net/questions/1626/Using+SSH+keys+on+your+server) account.

Got that working? Great! If so, you should now be able to access your server by typing `ssh myuser@example.com`. If this is working, we're ready to set up the deployment.

First we need to install Flightplan. In terminal, type

    npm install flightplan -g

Next, we'll need to create a flightplan.js file. It doesn't need a lot of code, but the way it works is that it sets up "transports" such as "local" and "remote". We're going to use both.First, let's set up some configuration.

    var plan = require('flightplan');
    config = {
      host: 'example.com',
      username: 'alex',
      agent: process.env.SSH_AUTH_SOCK,
      webroot: '/var/www/path/to/remote/site',
      gitRepo: 'git@github.com:MyAccount/project.git'
    }
    plan.target('dev', config);

Now, the first thing I want to do is make sure that any time I deploy the application, I have the latest code. It's too easy to make assumptions about this and have a coworker make a change to something and then accidentally overwrite the file. Luckily, Flightplan can automate this for us. We'll have Flightplan pull the most recent commit, then commit your files and push those results to the repository.

    plan.local(function (local) {
        local.exec('git pull origin master');
        local.exec('git commit -am "deploy"');
        local.exec('git push origin master');
    });

Ok, so now we can see this part in action by simply typing in terminal

        fly dev

"Dev" is the name we gave our plan, and we can create multiple targets like this which will perform different tasks based on the destination. For instance, we could set up a target called "prod" which could restrict certain actions.

    plan.local(function (local) {
        if (plan.runtime.target == "prod") return;
        // let's just stop here before someone gets fired
        ...
    });

Ok, but there's still a flaw here. What happens when the work you've been doing has created a few new files (such as image files) and you've forgotten to add those to Git? Once you push your changes, you'll end up with a bunch of broken images. So you'll have to add the images and then repeat the process. And isn't the whole **point** of this to never repeat ourselves?

Let's add one more line to our list of commands.

    plan.local(function (local) {
        local.exec('git pull origin master');
        local.exec('git add .'); //Add in uncommitted files
        local.exec('git commit -am "deploy"');
        local.exec('git push origin master');
    });

The only thing remaining is to tell the remote server that there are new files to pull. You can do this with post-commit hooks, but Flightplan makes this easy as well once you have SSH access.

    plan.remote(function (remote) {
        remote.with("cd " + plan.runtime.hosts[0].webroot, function () {
            remote.exec("git pull origin master");
        })
    });

Now, when we type `fly dev` we'll see our local files committed and those changes updated on the server, all with a single command.

In the next lesson, we can expand on this and add some Gulp tasks to the process.
