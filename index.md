---
layout: page
title: A blog about small victories in the battle to master web development
comments: true

---

#Latest Post
<div class="blog-index">  
  {% assign post = site.posts.first %}
  {% assign content = post.content %}
  {% include post_detail.html %}
</div>

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

