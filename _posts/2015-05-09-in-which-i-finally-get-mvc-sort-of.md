---
layout: post
title: "In Which I Finally Get MVC (Sort Of)"
description: ""
category:
tags: []
---
{% include JB/setup %}

There is no design pattern that's gotten more attention than MVC, and virtually all of the biggest frameworks use it to some degree. Backbone.js, Angular, Laravel, CodeIgniter, all rely on the basic concept of models, views, and controllers. I've been using frameworks like these for years, but even using a framework and calling a script a "controller" or a "view" or a "model" is no guarantee that you'll actually realize *where your code should go* and put your code where it makes sense. And in the end, MVC frameworks are all about creating a predictable convention so that stuff goes where you think it should go. Well, back up. Really it's so stuff goes where the next developer who looks at your code thinks it should go.

So let me share my thoughts on why MVC isn't a panacea and where I put things to try and make sense out of something as complex as software.

One of the first frameworks I used was Backbone.js. Backbone doesn't really have a controller, but it has a view and a model. So in essence your view and your controller are sort of the same thing. But my mistake when writing with Backbone was thinking that a Backbone view should contain all of the code that related to the view. Well, all of the code that isn't a model. But the problem there is that this violates the single responsibility principle.

>In object-oriented programming, the single responsibility principle states that every class should have responsibility over a single part of the functionality provided by the software, and that responsibility should be entirely encapsulated by the class. All its services should be narrowly aligned with that responsibility.

Ok, so right away, I can see where I was going wrong. Having a Backbone view that does a little of everything violates the SRP. For instance, let's say I'm trying to be diligent and I write a `MenuView` class, which will handle everything in the header of the site. But what is a "menu"? And what should the `MenuView` do? Is it really apparent from the name? Well, no. Typically, a site menu will have some navigation. Maybe it will also have a flyout somewhere. But sometimes it also will have a login button. But hang on a second, a login system isn't a menu system. Those are two different things! In reality, we should have a `LoginView` that handles the login area. But what should this view do?

Well, we should be able to explain what it does in one sentence.

>The login view listens for a change in the login state. If the user is logged in, it displays a welcome message. If not, it displays a username and password field, plus a login button.

That's it. Now, that view file is really only doing one thing. SRP for the win, baby! But so now what? Where do I put the code to handle the button clicks?

This is where it gets tricky, because while in MVC convention we should put all user interaction in the controller and not the view, breaking everything up in separate file. But is that really always the right choice? Let's go back to what I wrote above.

>And in the end, MVC frameworks are all about creating a predictable convention so that stuff goes where you think it should go.

The real goal here is putting things in a place they make sense. Not only to you, but to anyone else looking at your code. And so if your application combines user interaction with display, that's ok. But it should still break things up into a single responsibility. So the LoginView *could* add a second responsibility, so long as every view combines the same responsibilities in the same predictable way. In our new version, the `LoginView` class would now be described like this.

>The login view listens for a change in the login state. If the user is logged in, it displays a welcome message. If not, it displays a username and password field, plus a login button. When the login button is clicked, it submits the form to the model and responds to the result.

This makes it so that we don't need a controller to communicate with our view, nor does a controller need to subscribe to events from the model. It can control the view directly, which can make the code simpler to follow.

Now is this precisely the MVC pattern? No, not exactly, but I'd say that's ok. In the end, MVC is only a way to get us to a place where our code makes sense to us after we write it. Part of that is keeping our code to a minimum. But it's also about not cluttering up the project with more files than we really need. Isn't that worth breaking a few rules here and there?

So how can I wrap this up? Here's how I see the SRP in relation to an MVC setup.

###Models.
These are where you store data that has to persist between views. This allows for a basic subscription to data changes. All the model does is store data and alert subscribers when it changes. But the key is to name the model for the domain it holds data for. And only one domain at a time. In my example, it only holds the login state. It says we're logged in if there's a `User` and if not, it returns null. That's it. Simple.

###Views.
These are only concerned with showing the state of their model. Ideally, these should have just one or two models to listen for. For instance, in my example, it should listen for logged in state, but maybe also a window resize. Maybe a scroll model is updated as well. Again, all it does is one thing. It reacts to stuff that affects the login section of the menu and that's all.

###Controllers.
This code can go in the view, or here in its own file. This code is concerned with users interacting with the application and how this affects the model. It tells the model that something should change and the model affects its subscribers. It doesn't tell the login view to change. Why? Because what if there are two views that need to react to login status? Now we've violated the another important rule, which is the Open/Closed Principle. Which is basically that once you write a class, it shouldn't change. We shouldn't edit that controller every time we want to add a new subscriber to the model. And going back to the idea of putting code where it's easy to understand later, if I'm a new developer and I'm looking for a listener in the login over in the sidebar, then having a class called `SidebarLoginView` seems pretty clear, doesn't it?

And in the end, MVC is about being clear. In the end, it's just a tool which urges us to write code that makes sense. That should be what we strive for above all else.
