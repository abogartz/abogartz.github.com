---
layout: post
title: "Visual Studio Code Could Be Great For Typescript"
description: ""
category:
tags: []
---
{% include JB/setup %}

Microsoft has just released a new code editor titled, unfortunately, [Visual Studio Code](https://code.visualstudio.com/). Why unfortunately? Imagine doing a Google search for "Visual Studio Code" and getting a 45 million results, of which only a handful are about the editor. I think a more unique name could have made it easier to learn about the editor, and get some momentum going with the community. That being said, the editor itself is pretty promising. I've seen a lot of people complaining that we don't need another editor when we have Vim, or Sublime Text, Atom (with which I'm writing this post). That's true, but for me, I'm still looking for an editor that can handle Typescript correctly, and my expectation is that Microsoft will make that its priority with this new editor.

<iframe width="100%" height="400" src="https://www.youtube.com/embed/lEI9mxYpcS8" frameborder="0" allowfullscreen></iframe>



##The Good

So let me talk about what I love about VS Code.

1. First of all, it's built on a fork of the Atom editor. Atom has a brilliant Typescript [plugin](https://atom.io/packages/atom-typescript), but as of now that plugin lacks the ability to really drill down into Typescript classes. For instance, if I'm working in a class which references another class, mousing over any of the external functions doesn't give me a way to simply cmd-click my way into the other file. But VS Code does this extremely well. I can mouse over the reference and hold the cmd key, and I see a preview of the class. It's really nice.
![](/assets/images/vs-code-classes.png)

2. VS Code also feels very responsive and the code hinting is pretty much immediate. I've been using Phpstorm for my production code and for some reason their Typescript support has taken a step backwards. They haven't been keeping up with the language spec so often times perfectly valid Typescript will generate red squigglies.

3. It's very hackable. For instance, you can update the keybindings however you like, and even assign multiple actions to a single key. So if you want to run a build task on every file save, you can edit the keybindings.json file and type:
``{ "key": "cmd+s",           "command": "workbench.action.tasks.build" }`` and voilà, your build tool runs on every save. Pretty neat!

##The Bad
1. Well, this is a little unfair because this is only a preview release, but the editor is still pretty raw. While they talk about the cmd+. lightbulb option in the video above, this doesn't work in Tyepscript.

2. No debugger for client-side code in the browser. This is in their longterm plan, but lack of a proper debugger for website developement means that Phpstorm is still the tool to use for me.

3. No plugins. Part of what makes the Phpstorm, Atom, and Sublime community so vibrant is that they allow for third party plugins to fill the gaps that the core developers don't have the resources to address. All of these editors have a rich plugin ecosystem and chances are that whatever you're trying to accomplish has been at least attempted by someone else. Again, this is on the roadmap but this just further demonstrates that VS Code is still very green.

All in all I have high hopes for VS Code. It looks and feels great, and once it really matures and offers the basic features available in other IDEs, I'll be looking to switch. Until then, I recommend giving it a look and [vote up](http://visualstudio.uservoice.com/forums/293070-visual-studio-code) features you think will be useful.
