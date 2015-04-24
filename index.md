---
layout: page
title: Welcome!
comments: true

---
{% include JB/setup %}

I've decided to dive into the world of blogging about my work. It's mainly because I think my friends and family are thoroughly bored with my incoherent babbling about some new Yeoman task I wrote or why I think Typescript is so cool. But also because I hope to post some things which will help people who are dealing with the same problems and frustrations I deal with every day.

And with that, I'll see you guys in the comments section.

###Recent posts
<ul class="posts">  
	{% for post in site.posts limit:20 %}  
	   <li>  
		   <span>{{ post.date | date_to_string }}</span> &raquo;  
		   <a href="{{ BASE_PATH }}{{ post.url }}">  
		   {{ post.title }}</a>  
	   </li>  
	{% endfor %}  
</ul>

{% include JB/comments %}

