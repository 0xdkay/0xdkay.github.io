---
layout: post
title: "First Setup Octopress"
date: 2014-07-21 16:01:17 -0700
comments: false
categories:
  - Web
---
I just set up my new homepage with octopress themed by whitespace.
`http://insino.github.io`

<!-- more -->

## <a id="setup"></a>Setup Octopress

Setting up Octopress is quite easy. The instructions are all in the given [url](http://octopress.org/docs/setup): `http://octopress.org/docs/setup/`.

Before startup, I'd recommend you to make your own io repository on [github](https://github.com). Making github io page is free, and what you have to do is only add an repository as
`http://github.com/your_github_id/your_github_id.github.io`. In my case, `http://github.com/insino/insino.github.io`. Then, download the source via [git](https://github.com/imathis/octopress)
``` sh
git clone git://github.com/imathis/octopress.git octopress
cd octopress
```

Next, install dependencies.
``` sh
gem install bundler
rbenv rehash    # If you use rbenv, rehash to be able to run the bundle command
bundle install
```

Now, setting up the blog!
``` sh
rake install   #installing default blog page
```

Really easy, huh?

## <a id="branch"></a>Branch Definition

Actually, there are two branches in Octopress.
``` sh
➜  octopress git:(source) ✗ git branch -v
  master c977b91 Merge pull request #1609 from alindeman/patch-1
  * source 732c061 add twitter, github, facebook settings ini config.yml
```

You are going to work in `source` branch, in which you can do whatever you want. After you finish your work and you want to see what's going on try:
``` sh
rake generate   # Generates posts and pages into the public directory
rake watch      # Watches source/ and sass/ for changes and regenerates
rake preview    # Watches, and mounts a webserver at http://localhost:4000
```

Octopress's preview webserver is [Sinatra](http://www.sinatrarb.com/) which is really nice simple webserver. I already used this to make challenge pages for [`KAIST GoN`](http://gon.kaist.ac.kr).
Anyway, if your hompage looks good, then make your actual output!
``` sh
rake deploy     # make your pages in '_deploy/' directory, push request on your master's branch
```

Done! Now enjoy your page at `http://your_github_id.github.io`.





