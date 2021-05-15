---
layout: post
title: Sublime Text vs GitHub's Atom
tags: text-editors sublime-text atom github
---

If `vim` is too basic for you but IDEs feel too slow and sluggish, chances are you probably have been using Sublime Text as your preferred text editor. Now GitHub has an open source editor in town called `Atom` which might give competition to our beloved Sublime.

I took it out for a spin and used it as my default editor for a week and the following is my honest review of whether I think Atom can stand up to or even overcome the legacy <abbr title="Sublime Text">ST</abbr> has built for itself over the years.

<!--more-->

## Time

The biggest problem that has plagued Atom has been the issue of how slow it is to load. Given its bloated web-app like back-end, it is unsurprising how bad the load times can sometimes be.

<div class="message">
  "Atom is a desktop application built with HTML, JavaScript, CSS, and Node.js integration.
  It runs on Electron, a framework for building cross platform apps using web technologies."
  - the folks over at GitHub
</div>

I did a test with the Linux utility `time` to test how the loading time compares between Atom and ST2 while opening a moderate sized file and a "heavy" file. Please note that both of the files were loaded from the cache.

{% highlight bash %}
$ ls -l
-rw-rw-r-- 1 saurabh saurabh  48281 May  7 18:15 report.tex
-rw-rw-r-- 1 saurabh saurabh 1369118 May 16 12:49 civicrm_generated.mysql

$ time subl report.tex  // ~50 kb file

real	0m0.013s
user	0m0.009s
sys	0m0.004s

$ time atom-beta report.tex

real	0m0.023s
user	0m0.006s
sys	0m0.018s

$ time subl civicrm_generated.mysql  // ~1.5 Mb file

real	0m0.013s
user	0m0.008s
sys	0m0.004s

$ time atom-beta civicrm_generated.mysql

real	0m0.022s
user	0m0.002s
sys	0m0.021s

{% endhighlight %}

Now, if you're interested in finding out what these outputs mean, there's a rather nice StackOverflow answer <a href="https://stackoverflow.com/questions/556405/what-do-real-user-and-sys-mean-in-the-output-of-time1" target="_blank">here</a>.

If you would rather read the summary, **Real** is wall clock time - time from start to finish of the call, **User+Sys** will tell you how much actual CPU time your process used.

You can see how Sublime beats Atom hands down. On top of this, the Atom GUI takes much more time to load than the Sublime Text one; I could swear there have been times when I waited for more than 5 seconds for Atom to open a file when it was not loading from the cache.

## Hackability

Hold on there, I know the time statistics can be off putting and severely favor Sublime Text. However, GitHub has traded time constraints for a good enough reason.

As mentioned before, Atom is basically a web-app running on Electron. This makes it extremely easy to customize your editor the way you want and is the most exciting aspect of the product. I haven't done anything useful with it yet, however I did tinker around a bit and totally loved how flexible things are.

For example, for customizing your theme, all you need is some basic knowledge of CSS. I was running the Solarized: Light theme before the changes.

<img src="/public/atom/atom1.png" style="width: 100%; display: block;">

Output:

<img src="/public/atom/atom2.png" style="width: 100%; display: block;">

Also, you can hack into the `init script`, i.e. the script (written in CoffeeScript BTW) and have custom initializations when the editor starts.

<img src="/public/atom/atom3.png" style="width: 100%; display: block;">

Output:

<img src="/public/atom/atom4.png" style="width: 100%; display: block;">

## Conclusions

I could go on and on about how the two text editors vary ever so slightly in other aspects as well, but then <a href="https://atom.io/packages/unregistered" target="_blank">somebody would develop a package and prove me wrong</a>.

To sum it up, I loved how easy it was to experiment with Atom, but, I still love Sublime Text too much to use Atom in my regular coding sessions. The speed more than makes up for the slight lack of hackability.
