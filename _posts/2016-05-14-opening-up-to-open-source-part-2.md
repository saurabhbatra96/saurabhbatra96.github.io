---
layout: post
title: Opening up to Open Source - Part 2
tags: open-source civicrm git github
---

I highly recommend that you read [part 1](/2016/05/12/opening-up-to-open-source-part-1/) of this series if you haven't yet.

## Writing Your First _Real_ Patch

So let's get started with how to write a simple patch for your organization. Although keep in mind I'll be writing this patch for [CiviCRM](http://civicrm.org/) and the exact procedure that your organization recommends might differ slightly.

### Finding a Worthy Issue

One way to go about finding a bug to fix is to prowl their bug trackers, search for issues tagged as `starter` or `trivial` and comment that you want that issue to be assigned to you. However, most issues tagged `trivial` are only **_trivial_** for developers that have considerable experience working with that code-base.

Instead I'd recommend that you ask your mentor to assign you an issue and provide you with a brief summary of how to go about fixing it.

<!--more-->

### What Next?

Okay, I'll assume you've found a nice issue for yourself. I myself found a rather simple one for this tutorial:

<img src="/public/opentoopen/opentoopen2.png" style="width: 100%; display: block;">

As you can see (or maybe not, but you'll learn to see) the issue requires us to make a change in a certain table. CiviCRM uses upgrade scripts for this purpose. I Googled "upgrade scripts civicrm" and got <a href="https://wiki.civicrm.org/confluence/display/CRMDOC/Upgrade+Reference" target="_blank">this</a> result. Have a look through that page if you wish to, or you can <a href="https://www.psychologytoday.com/blog/close-encounters/201407/can-you-really-trust-the-people-you-meet-online" target="_blank">blindly trust my word</a> that it contains everything we need to solve our issue. :+1:

### Working With Version Control

I'm assuming that you have some basic knowledge of working with version control. If not, <a href="https://git-scm.com/docs/gittutorial" target="_blank">this tutorial</a> hosted by Git should have you up and running Git within half an hour or so of reading.


Let's make a new branch where we'll solve the issue. I'll just name the branch **CRM-18537** to represent the issue id.

{% highlight bash %}
$ git checkout upstream/master -b CRM-18537
{% endhighlight %}

### Change the Required Code

This is the part where I'll mostly fast forward and just show you the required changes.
<div class="message">This is something you have to figure out on your own, you will not find a blog telling you how to fix every bug you face.</div>

<img src="/public/opentoopen/opentoopen2-1.png" style="width: 100%; display: block;">

We'll just add this simple SQL query to delete the corresponding field.

<img src="/public/opentoopen/opentoopen2-2.png" style="width: 100%; display: block;">
<img src="/public/opentoopen/opentoopen2-3.png" style="width: 100%; display: block;">

And delete the corresponding values in these two files. (<a href="https://wiki.civicrm.org/confluence/display/CRMDOC/Upgrade+Reference" target="_blank">How did I know what to do?</a>)

### Committing Your Changes

Great! You've successfully made your first change to the code-base. How to go about converting this into a patch?

Let's start by committing your changes and pushing them to your forked repository.

{% highlight bash %}
$ git commit -a -m "CRM-18537 Remove Brazilian state."
$ git push https://github.com/username/civicrm-core.git CRM-18537
{% endhighlight %}

Enter your GitHub username and password and head on over to <a href="https://www.github.com" target="_blank">GitHub</a>.

On your GitHub dashboard, you'll find a notification telling you that you pushed some code to a new branch `CRM-18537`. Click on the green create a pull request button, add a brief description, review your changes one last time (not really the last time) and finish up.

<img src="/public/opentoopen/opentoopen2-4.png" style="width: 100%; display: block;">

Congratulations! You have your first PR ready to be merged (or closed)! :grin:

How to make changes to your PRs, what is testing, rebasing and the wonderful utility called grep. Continued in part 3.
