---
layout: post
title: drive-sync - The Idea, Application and Node.
tags: google drive google-api nodejs javascript cli
---

If you'd rather not read the intro and jump to the application directly, visit the <a href="https://github.com/saurabhbatra96/drive-sync" target="_blank">Github page for drive-sync</a>. Most of the information you'd need is in the README file itself.

## The Idea
I've been using Ubuntu for quite some time now (more than a year) and the thing I love most about it is the flexibility its command line offers to its users. The learning curve might be steep but it pays off to delve into bash.
<div class="message">
Inspired by this, I thought: "Wouldn't it be cool if I could access my files on the cloud using a <abbr title="Command Line Interface">cli</abbr>?"
</div>

I wanted to develop a CLI application to control my Facebook. However, as it unfortunately turns out, the Facebook API does not expose enough data for me to be able to build the app flexible enough to my liking. What the Facebook API does support fully though, are applications which can predict _which celebrity do you look like the most_. :neutral_face:
<!--more-->

## The Application

If you're running Linux, you might wanna head on over now to <a href="https://github.com/saurabhbatra96/drive-sync" target="_blank">the drive-sync repository</a> and follow the instructions in this section.

Let's get you set up, it's really easy. If you do not have `node` and `npm` set up on your machine, you might want to install them by following the simple tutorial <a href="https://docs.npmjs.com/getting-started/installing-node" target="_blank">here</a> if you don't have them already.

Either clone the repository using git or you can use the zipped beta version from <a href="https://github.com/saurabhbatra96/drive-sync/releases/tag/v1.0-beta" target="_blank">here</a>. After you have the code stored in a directory navigate to it and use the `npm link` command to use `drive-sync` from your terminal.

{% highlight bash %}
$ git clone https://github.com/saurabhbatra96/drive-sync.git
$ cd drive-sync
$ npm link
$ drive-sync pwd
{% endhighlight %}

When you enter the `drive-sync pwd` command, you'll be given a link by Google to navigate to. Open it up in your browser of choice, allow access to `drive-sync` and copy the code you see there to your terminal (paste using Ctrl+Shift+v FYI). Don't worry, this is only a one time thing, you will not need to authenticate again!

<img src="/public/drivesync/drive1.png" style="width: 100%; display: block;">

If you're successful, you'll be notified of some details of your main Google Drive folder. If you're not, either reach out to me [![on gitter](https://badges.gitter.im/saurabhbatra96/drive-sync.svg)](https://gitter.im/saurabhbatra96/drive-sync?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge), file an <a href="https://github.com/saurabhbatra96/drive-sync/issues" target="_blank">issue on Github</a> or leave a comment here!

<img src="/public/drivesync/drive2.png" style="width: 100%; display: block;">

Now all the commands which you can use are listed on the GitHub repository itself, however I'll give you a small demo. Let's say that I want to download all the files in a certain folder called "Drive Sync Test" from my Drive. What's more, the said folder contains files of different kinds, there are images, pdfs, zipped files and also a Google Doc and a Google Spreadsheet.

I'll navigate to the said folder, and then all it takes is one command to do it all!

{% highlight bash %}
$ drive-sync cd "Drive Sync Test"
Directory changed
$ drive-sync down all
{% endhighlight %}

Hey presto! All the files you needed are now downloaded/downloading to the folder you were currently in! What's more, you'll notice that the Google Docs have automatically been converted to a format that your PC can read (.doc for Docs and .xls for Sheet).

But wait a moment, suppose you want the Google Doc in the form of a PDF rather than in Word format. Easy! All you have to do is use the export command!

{% highlight bash %}
$ drive-sync export testdoc pdf
{% endhighlight %}

Now the Google Doc `testdoc` will be downloaded in the form of a pdf! To view the complete list of formats supported, head on over to the Github page, it's all in the <a href="https://github.com/saurabhbatra96/drive-sync#usage" target="_blank">README</a>!

## The Learnings: NodeJS

I'll start off with admitting that NodeJS was perhaps not the best of choices for this project. The major reason being, JavaScript in its inherent nature is **asynchronous** in nature while CLI applications in general wait for user input to occur before processing (duh). JavaScript is perhaps the first _dynamic_ language that I learned to use, and this is something I did not know until I made drive-sync, so do not feel shy to ask what does it mean?

<div class="message">
JavaScript in its inherent nature is <b>asynchronous</b> in nature.
</div>

I'll illustrate the concept of asynchronicity below, but if you're interested to read more in depth, I found <a href="https://blog.jcoglan.com/2013/03/30/callbacks-are-imperative-promises-are-functional-nodes-biggest-missed-opportunity/" target="_blank">this article</a> instructive about the basic concepts of functional programming.

### Callbacks

Suppose I have a file named `readme.json` with the following contents:

{% highlight json %}
{
  "dummy": "value"
}
{% endhighlight %}

Now I'll make a file `test.js` with the following contents. It should be easy to follow what it does by reading the comments.

{% highlight javascript %}
// test.js

// Let's include the default file system module from the Node library.
var fs = require('fs');

var jsondata = {"dummy": "value2"};

fs.readFile('readme.json', function(err,data) {
  if (err) throw err;
  jsondata = JSON.parse(data);
  console.log(jsondata.dummy);
});
{% endhighlight %}

I know that something looks fishy here, patience though! Running the program gives the output you would expect.

{% highlight bash %}
$ node test.js
value
{% endhighlight %}

I'll just add another console.log after the readFile method of fs to double check:

{% highlight javascript %}
// test.js

// Let's include the default file system module from the Node library.
var fs = require('fs');

var jsondata = {"dummy": "value2"};

fs.readFile('readme.json', function(err,data) {
  if (err) throw err;
  jsondata = JSON.parse(data);
  console.log(jsondata.dummy);
});

console.log(jsondata.dummy);
{% endhighlight %}

The output:

{% highlight bash %}
$ node test.js
value2
value
{% endhighlight %}

But... But... How is this possible? Nothing makes sense here! Clearly `jsondata.dummy` should be set as `value`? Then why is the output so?

<div class="message">
The (not so) simple answer lies in the asynchronous nature of JavaScript. JavaScript tends to run in a single thread.
</div>

The function which we passed to `fs.readFile`, which sets `jsondata.dummy` to `value` is called a _callback function_. What it implies is that once `fs.readFile` returns a marker that the file has been read, this function will be _called back_. All this while, the thread is left for other processes, i.e. the `console.log(jsondata.dummy)` statement at the end. So, in spite of being written after the readFile method, this line returns the old value of `jsondata` because the function before has not been processed yet!

Whew! You might want to read that again **or** you could wait till your head stops spinning when you realize that sequential programming is no more. Kidding.

There are ways to make such asynchronous functions synchronous. The one which I found easiest to use was the `deasync` module. More on it later. For now, take `drive-sync` out for a spin and leave your feedback and suggestions down below in the comments section.

## Contributing

Before I finish off, I'd like to state that I'm more than happy to provide direction if people want to help me add functionality to the project. I already have some ideas I will be working on, and I also listed them in the issues section on the Github repository. Feel free to add more to the list and help me implement them!

PS: If you want me to do a blog explaining the working code of `drive-sync` do not forget to leave a comment!
