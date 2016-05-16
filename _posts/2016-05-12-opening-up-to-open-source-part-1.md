---
layout: post
title: Opening up to Open Source - Part 1
tags: open-source civicrm git github
---

### What this series of blogs is about:

- My experience of volunteering for an open source organization;
- Things I wish I knew before I started my open source journey as a student;
- Tutorials about how to go about creating your first patch.


### What this series of blogs is NOT about:
- A general introduction to the open source world. There already exist definitive and well-written guides out there on the internet concerning the same. If that is what you're looking for, here is the link to <a href="https://guides.github.com/activities/contributing-to-open-source/" target="_blank">GitHub's guide on contributing to open source projects</a> which I found to be particularly short, sweet and to the point;
- Unicorns.

## The Beginning

The toughest part of contributing to open source projects is getting the ball rolling; it's not easy for a newbie to build software from source and to get accustomed to large and abstracted codebases that accompany.

<!--more-->

I remember how excited I was when I first downloaded the source code for Mozilla Firefox and also how frustrated I was after a couple of hours when I couldn't even figure out where the code for a simple menu was located (yes I was naive and grepping for stuff was a foreign concept *sigh*).

<div class="message">My point being, it's only natural that instead of sprinting, you start your journey stumbling.</div>

Once you've found an organization that catches your interest, start off with joining their **mailing lists and IRC channel**. However, I've noticed that people (including me) have this tendency to try and not make a fool out of themselves on public fora and therefore just prowl IRC rather than ask newbie stuff on it. Moreover, it's rather not uncommon for people to get replies some 12 hours after they initially posted their question because of timezone differences and not a lot of people stick around for that long.

<div class="message">The most important piece of advice I have is that you find someone from the "core" team of the organization to email personally.</div>
**I cannot stress on this point enough.** You need someone to hold your hand in this initial phase. If you have any doubt on how to build the software, how to deal with an issue/bug, how to rebase the 2945 commits you accidentally inherited when you forgot to change your branch before making the <abbr title="Pull Request on GitHub">PR</abbr>, you email your mentor. If you're lucky and the people running the organization are helpful, your life will be made extremely easy.

## Exploring the Code-base

I remember the first patch I made was a patch which _fixed_ the comments for a couple of modules: stuff which did not involve heavy lifting and guaranteed no real harm to the working of the modules.

<img src="/public/opentoopen/opentoopen1.png" style="width: 100%; display: block;">

The beauty of starting with patches such as these is that:

**a)** you get used to the preferred coding style of your organization, and

**b)** you get to explore various classes/modules and their functionalities.

The added incentive being, you're improving your organization's documentation and protecting it from grammatical errors. :wink:

Head over to [part 2](/2016/05/14/opening-up-to-open-source-part-2/) for **writing your first _real_ patch**.