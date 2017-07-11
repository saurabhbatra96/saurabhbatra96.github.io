---
layout: post
title: A Human Learning Machine Learning
tags: ai tetris ml machine-learning genetic-programming
---

## Roll Camera

I have recently (read: since forever) been swamped by a lot stuff to do (read: procrastinate), which kind of explains (read: serves as a valid excuse) as to why I updated my blog after more than a year.

Many a projects lie unfinished, collecting dust in my Github as a random tumbleweed rolls past complaining about the lack of documentation and the tardiness of code updates.

*Quick, cue cool graphics before you stop reading.* ༼ つ ◕_◕ ༽つ

<img src="/public/machinelearning/output.gif" style="display: block;">

<!--more-->

## Tetris

Looking at the sparse expanse that my Github has become, I decided to get off my bum and make my computer play some Tetris for me.

The aim was to just fool around and see how different playing strategies impacted the performance of my bot. The results were, well, pretty much as expected... or not.

*Just a disambiguation before I begin, score refers to the score obtained in the game while the objective function is a separate construct.*

## Artificial Intelligence

<div class="message">Human stupidity beats artificial intelligence every time.</div>

Starting off, lets see how well does a random bot perform (places blocks at random positions with random rotations applied):

{% highlight json %}
    "Average score" : 166
    "Number of trials" : 6685
{% endhighlight %}

To compare, here's the performance statistics for a greedy bot (places blocks such that current score is maximized):

{% highlight json %}
    "Average score" : 210
    "Number of trials" : 10000
{% endhighlight %}

Comparable to the random bot, which kind of tells that greed might not be that good after all.

Moving to a more intuitive strategy: minimize average height of columns at every step, drastically improves these statistics:

{% highlight json %}
    "Average score" : 726
    "Number of trials" : 10049
{% endhighlight %}

Tinkering around a little more, I realized that minimizing the aggregate height of each block instead of column height was a better strategy (think about it, it penalizes increased height even more severely):

{% highlight json %}
    "Average score" : 2423
    "Number of trials" : 1001
{% endhighlight %}

*Drastic improvement!*

*Hi fives all around!*

However, this is pretty much a very simple bot, whose goal is to optimize an objective function depending on just one factor - minimize aggregate block height; we need to go deeper.

So, now I decided to make a simple addition to the objective function to reward line clears. Simply put, every time my bot clears a line of tetrominos, it gets +10 brownie points.

{% highlight json %}
    "Average score" : 1382
    "Number of trials" : 9281
{% endhighlight %}

<img src="/public/machinelearning/mildshock.gif" style="display: block;">

Surely, clearing a line is a good thing, how does awarding that lead to a worse average score? This is where the machine learning aspect comes in.

## Bot Goes To School - The Machine is Finally Learning

When you think of AI, machine learning is a phrase that automatically pops up in your mind; but they are not synonyms. AI can and does produce excellent results without the help of ML simply by considering all possible outcomes and following them through!

We achieved a perfectly average (it's tough being average at Tetris, believe me, I tried) bot without using a byte of data to tune our bot.

However, it is tough to judge according to what objective functions (rules) does the bot play better. Awarding line clears may seem intuitive to you, but maybe the bot is already doing that by rewarding minimum aggregate height!

Suppose we came up with an objective function of our own:
{% highlight python %}
f(aggrHeight, numLineClears, numHoles) =
  -heightMult*(aggrHeight) + lineMult*(numLineClears) - holeMult(numHoles)
{% endhighlight %}

Punish more aggregate height and more number of holes (empty regions which cannot be reduced), reward line clears.

Now our goal is to find optimum values for the coefficients so that the bot performs better (than what? read on) on average.

### Genetic Programming

The paradigm I chose to optimize my objective function is a little something called genetic programming. It behaves a lot like evolution, hence the name.

Let's call a triplet of values `(heightMult, lineMult, holeMult)` a *chromosome*.

* We start with 16 such chromosomes filled with random values between -10.0 to 10.0.

* We randomly select two chromosomes (triplets) and then make them compete in, say, a 100 games of Tetris. The one that performs better is kept while the loser is kept in a separate pile.

* After all such competitions, half of the losers are randomly discarded.

* Using the 8 winners that we have with us, we make 4 pairs and ahem, ahem... breed them together. During the breeding process we randomly (with 50-50 odds) select an attribute of one of the parents and keep it over the other parent's attribute, thus giving us 4 new hybrid chromosomes.

* We have our second generation of chromosomes with us (8 winners, 4 losers, 4 hybrids).

* We make them compete again and again till the competing chromosomes start achieving better average scores than we want.

* Then, we just select one lucky chromosome (just kidding, we select the best chromosome) to use for our bot!

<div class="message">This was a rather simplistic explanation of genetic programming, you can do a lot more with it, just Google it!</div>

## Testing Out The Lucky Chromosome

So how does the ML backed bot perform? Well, I don't know because I never ever got around to completing it.

I did write the boilerplate code for it but never got around to completing it. However, looking at the bright side of things, this does present an opportunity in case anyone wants to take up an introductory ML project (read: somebody please complete my code for me, I don't have the time).

## The Code

You can view the code over at my Github: <a href="https://github.com/saurabhbatra96/nextgen-tetris" target="_blank">NextGen-Tetris</a>

Or if you want to play around with it, just get it from the Go package manager.

{% highlight bash %}
$ go get github.com/saurabhbatra96/nextgen-tetris
{% endhighlight %}

Open your bin folder and run the `nextgen-tetris` binary with custom args: *height multiplier*, *line multiplier* and *hole mutiplier*.

{% highlight bash %}
$ ./nextgen-tetris -1.0 5.0 -2.5
{% endhighlight %}

Go through the `genetic-prog` directory to have a look at the boilerplate for the genetic algorithm.

The `tetris-data` directory has the statistics I stated above and the corresponding binaries that I used to compute the same. You can run them for yourself and corroborate my results.

<img src="/public/machinelearning/mleverywhere.jpg" style="width:100%;display: block;">
