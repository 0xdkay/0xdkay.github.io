---
title: "Getting Vulnerabilities Found by AI Scanners to Developers"
date: 2026-10-15 00:00:00 -0400
categories: [Blog]
tags: [ai, security, vulnerability, open-source, linux-kernel, aixcc, team-atlanta]
topics: [ai-security]
lang: en
ai_translated: true
translation_key: from-ai-found-bug-to-fix
description: "AI has made finding bugs easy. Filtering them, fixing them, and handing them to maintainers still takes a lot of work."
image:
  path: /assets/img/posts/from-ai-found-bug-to-fix.webp
  alt: "AI-generated illustration: an AI scanner pours out candidates, false positives get filtered out, the rest pass through a threat model and a prover, and a verified patch and PoC reach the developer before looping back into the patch cycle"
---

A lot more teams are using AI to find open source vulnerabilities these days. My team runs MDASH[^mdash] against the Linux kernel and other open source projects. Anthropic recently released OSS Scanner, which scans open source projects for free[^anthropic-oss-scanner]. And OpenAI started Patch the Planet with Trail of Bits, which finds vulnerabilities in open source and writes the patches too[^openai-patch-the-planet]. AI has clearly made finding bugs easier.

From what my team has been through, though, the part after finding is much harder. Many candidates are false positives (FP), and it takes a lot of human work to confirm a bug is real, reproduce it, write a patch, and get the maintainer to accept it.

Now that AI lets us find bugs cheaply, what does it take for those bugs to actually get fixed? In particular, how do we cut down false positives, and where do we get the context needed to decide whether a bug is real?

## The question AIxCC left behind

I first felt how much harder the part after finding is during AIxCC. I competed in the DARPA AI Cyber Challenge (AIxCC) with [Team Atlanta](/posts/team-atlanta-wins-darpa-aixcc/), where we built a system that finds and patches vulnerabilities with AI. In the finals, the 7 teams' systems analyzed 54 million lines of real open source code. Across the 63 challenges, they found 54 of the planted synthetic vulnerabilities and patched 43[^darpa-aixcc].

The competition had a clear rule for what counted as a real vulnerability: the PoC had to actually cause a crash. Because the competition ran in OSS-Fuzz form, sanitizers like AddressSanitizer running alongside the fuzzer acted as a clear oracle, so deciding whether something was a vulnerability wasn't hard. For patches, we only had to check that the PoC no longer crashed and that the functional tests passed, then submit.

Even then, you can't be sure a patch is actually correct. Plenty of open source projects have no functional tests at all, or tests that don't cover everything.

But if we hand crashes and patches like these to developers, is that really the end of it?

## From AI slop to real reports

Until early this year, most AI-generated security reports were treated as slop: needlessly long, dressed up in Markdown, full of plausible but unverified impact, and impossible to reproduce when you actually ran them. curl got so many of them that in January 2026 it shut down its bug bounty entirely[^curl-bug-bounty].

Within a few months, the mood shifted. Around March, people on the Linux kernel side started saying that real AI-found reports had gone up sharply[^register-kernel-ai-reports]. As models and tools improved, real bugs started arriving alongside the slop.

The problem is that the real and the fake arrive mixed together, and in huge numbers. AI can generate as many candidates as you like, but maintainers still have the same amount of time to check them. Even for the people finding the bugs, this volume is too much for humans to review. Anthropic, for one, normally has people review each open source vulnerability it finds before disclosure, but OSS Scanner reports skip that review and go out as soon as a scan finishes[^anthropic-oss-scanner]. The more real bugs come in, the more filtering out false positives matters.

## The Linux kernel's rules

So in May 2026, the Linux kernel added a section on AI to its document on reporting security bugs[^phoronix-kernel-ai-docs]. It's quite realistic.

First, it says to treat AI-found bugs as public. Bugs found this way tend to be found by several researchers at almost the same time, sometimes on the same day. Since anyone can find them with AI anyway, there's little point in keeping them secret. The reproducer, however, should not be published; send it separately if the maintainer asks for it.

It's also specific about how to write a report:

- Keep it short and plain: lead with the key point, write it the way a person would, and skip the Markdown decoration.
- Stick to facts that can be checked, not imagined impact, and run the reproducer yourself to confirm it works.
- Propose and test a patch as well. The patch must follow the kernel's patch submission rules and carry a `Fixes:` tag pointing to the commit that introduced the bug.

That last item is a big ask. The person who found the bug has to bring a patch good enough for the maintainer to accept. A report used to be "there's a bug here." Now it's "there's a bug here, here's how to reproduce it, and here's how to fix it." The bar has gone up quite a bit.

The kernel also spelled out what counts as a security bug. According to the same document, most reports to the kernel security team are really ordinary bugs, misclassified as security bugs because the reporter doesn't know the kernel's threat model well[^kernel-security-bugs]. A security bug is one that, on a properly configured production system, lets an attacker gain privileges they couldn't otherwise have, and that can be easily exploited. The test is whether it actually crosses a trust boundary.

Whether a person or an AI found the bug, a maintainer still looks at every patch that goes into the kernel and decides. In October, the maintainers also agreed to drop the rule that AI tool use be disclosed with an Assisted-by tag, with Linus Torvalds saying what matters isn't which tools you used but whether you understand what you're doing[^register-assisted-by]. Still, some in the community remain wary of LLMs, so the reporting side has to show up with stronger evidence and a cleaner patch.

But could this higher bar end up discouraging reporting altogether, so that even good bugs get missed?

## How my team did it

My team reported bugs to the Linux kernel ourselves, and we wrote about it on the Microsoft blog[^microsoft-forge-lessons]. Running MDASH on the Linux kernel flagged thousands of suspicious locations. Reporting those as is would be textbook slop.

So we built a custom prover to verify the candidates MDASH produced that came with supporting evidence. For each of those candidates, it builds an input that actually triggers a crash, runs it, and drops candidates that don't reproduce. For the ones that did reproduce, team members analyzed them by hand to confirm the root cause, wrote patches, and reported them[^lore-forge-reports]. Even then, we went back and forth with maintainers over email several times to revise the patches.

Per the numbers in that post, there were 627 findings with supporting evidence, and building a PoC for each of the 182 confirmed crashes cost about $3.61 and took about 21.5 minutes on average[^microsoft-forge-lessons]. Those numbers don't include the time people spent analyzing bugs and writing patches.

Reporting also takes more work than you'd expect, because every project wants something different. Some insist on a patch with the report; others say they don't need one. Some take reports privately; others use public channels. Sometimes we and the maintainer disagree on whether something is a security issue or just a bug. Every report turns into a round of back-and-forth: matching the project's process, helping with reproduction, fixing the patch, and retesting.

We learned something else at an internal hackathon, where 50 people used MDASH to produce 39 reports across 6 projects[^microsoft-forge-lessons]. Beyond process, attitudes vary a lot from project to project and from developer to developer. Many people are hostile to AI, and AI slop is a sore point. And when the threat model we had in mind didn't match the project's, the reception often turned cold.

## How do we cut false positives?

In our experience, candidates got filtered out for more kinds of reasons than we expected: paths that aren't actually reachable, missing preconditions, wrong build configurations, inputs the attacker can't control enough, duplicates of bugs already found, and weak explanations of the root cause.

So it seems better to filter in several stages than all at once, and the order matters. The most reliable check is a prover that actually runs the candidate, but it's also the most expensive. You can't run it on thousands of candidates, so cheap filters cut the list down first and only what's left goes to the prover.

- **Argue against it:** For each candidate, MDASH has different agents debate for and against whether it's really reachable and really exploitable[^mdash].
- **Group duplicates:** Group the same bug with deterministic methods such as the AST. In an internal project, this cut the duplicates from scanning the same code multiple times by about 45%, which also reduced PoC generation and human triage load[^microsoft-forge-lessons].
- **Filter by threat model:** Many candidates involve input the attacker can't control, or don't cross a trust boundary. Filter those out before the prover and send them as ordinary bugs, not security reports.
- **Actually run it:** Only candidates that survive this far go to the prover. The strongest evidence is an input that causes a crash. If it reproduces, keep it; if not, be suspicious.

Filtering too early can throw away real bugs, though, so you have to track how much you saved and how much you missed together.

It's also important to keep the reasons each candidate was filtered out instead of throwing them away. Those reasons become rules for the next scan and keep us from repeating the same mistakes. It's the same idea as the failure records I described in [What's Left After a Long Coding-Agent Session?](/posts/growing-system-not-model/).

## How do we build a prover?

In AIxCC, the build environment and sanitizers were already set up in OSS-Fuzz form. In real projects, the prover has to build that environment first. Surprisingly, I think the hardest part of building a prover isn't the AI at all. It's this environment.

To reproduce a crash, a prover has to build and run the code under the same conditions as the real thing. That means the right binary, symbols, configuration, harness, and runtime conditions. Change a single build option or dependency version, and the bug might not reproduce, or a bug that doesn't really exist might show up. And you have to build and run the code again for every candidate and every patch revision, so the cost keeps adding up.

Is Docker alone enough? For ordinary libraries and user space programs, Docker gets you pretty far. But containers share the host's kernel, so kernel bugs have to run on a separate kernel in a VM or an emulator like QEMU. Code that needs specific hardware, like drivers or firmware, is even harder. You end up having to emulate, and making the emulation close enough to the real thing is a big problem of its own.

Back when I worked on [FirmAE](/pub/2020/kim-acsac2020.pdf), we were emulating firmware for each IoT device, and some cases were hard to emulate because we didn't have the actual hardware. Running firmware somewhere other than its original hardware, called firmware re-hosting, is a whole field of its own[^sok-rehosting].

Web services, where many systems are tangled together, are a different story again. A required login, or a component that only runs connected to external systems, makes proving anything difficult.

Since every target needs a different environment, you have to decide whether to make the prover general-purpose or specialize it for each target. A general-purpose prover works across many projects but struggles to prove deep bugs. A specialized prover is powerful but has to be rebuilt for each target. On the specialized side, the Windows team says it runs candidates confirmed by MDASH through a Windows-specific proving pipeline once more to filter out the remaining false positives[^windows-vuln-management].

But can you really build a specialized custom prover like that for every system? Whether it's the kernel, firmware, or a web service, I honestly don't think there's a clear answer yet for how to build these environments well.

## Why is a threat model hard to build?

Reproducing a crash doesn't make it a security bug. You need to know which inputs in the project are in the attacker's hands, what's out of scope, and what counts as serious. That's the threat model, and few projects have written it down the way the kernel has. Usually it lives only in the maintainer's head.

That's understandable, because building a threat model systematically is really hard. You have to know every feature of the target and see how they combine across the whole system, then recheck it whenever a feature changes. Many open source projects have no dedicated security team, so writing a threat model in the first place is hard, and keeping it current is harder.

Sometimes you can't judge properly from a single repository. apple/containerization[^apple-containerization] and apple/container[^apple-container], which I analyzed, are an example. containerization is a Swift library for running Linux containers on macOS, and container is the actual program built on that library. Each repository can look fine on its own, yet problems show up once you combine the library with the way the program actually uses it. If the library's threat model and the program's threat model are worked out separately, issues that fall between them get caught by neither side.

The reverse happens too. Some libraries, like crypto libraries, leave input validation (sanitizing) to the caller, so a vulnerability found by looking at the library alone may have no impact in the real system, because the input is already filtered upstream. A threat model doesn't stop at one repository. You have to judge it as a whole, looking at how repositories connect to each other and how they're used across the system.

## Who should write the threat model?

So where does the reporting side learn the threat model? For open source, I usually start with SECURITY.md. Some projects don't have one, though, and many that do only say where to report, not what counts as a security bug. Electron's SECURITY.md[^electron-security-md], for example, only covers how to report and the process. What's Electron's responsibility versus the app developer's is laid out separately in the security documentation[^electron-security-docs] on the Electron website, which is hard to find unless you follow the link at the very bottom of SECURITY.md.

Closed source makes this information even harder to get. When we scan a customer's closed source code with a service like MDASH, the code never leaves that customer's isolated cloud environment (tenant) and is only analyzed inside it, so we can't look at it ahead of time to understand the threat model. Corporate security teams and pentesters often have no code at all. Then the only option is to build the threat model by analyzing and understanding the system yourself and imagining where it could be attacked.

On the open source side, I find OSS Scanner's approach to the threat-model-in-the-maintainer's-head problem interesting. Open source projects that sign up get periodic free scans with Anthropic's strongest model. You sign up by opening a PR on its GitHub repository[^oss-scanner-pulls], and only the project's core maintainers can do it. The PR includes a Dockerfile that builds the project, and Anthropic strongly recommends adding a threat model file too.

The scanner works without a threat model file, but then it reportedly guesses at the ambiguous parts. At the time of writing, a week after the repository opened, more than 600 registration PRs had come in, and more than half of the 82 projects registered so far included a `threat_model.md`[^oss-scanner-pulls].

Real products like scanners face the same pull between generalization and specialization as the prover. One general-purpose scanner can't cover every project well, and we can't build the threat model and environment for every project ourselves either. Anthropic had developers supply that part. The engine stays general, and the specialized context, the environment and the threat model, comes from the people who know the project best. It seems like a smart way to get developers directly involved.

My team had actually been considering this kind of approach since May, but for various reasons we never put it into practice, which is a bit of a shame.

## How do we gather human effort and context?

It all comes down to context. Maintainers know most of it: how to build the project, which inputs are dangerous, and what's in scope as a security issue. But maintainers are already busy, and asking them to write it down costs their time too.

As AI-found reports grow, the reporting side has to take on the messy work of matching each project's process, helping with reproduction, and revising patches. If that burden lands on maintainers, open source security research can't keep going. I think this is the same human sign-off bottleneck I wrote about in [When I Hand Work to an Agent, Who Makes the Judgment Calls?](/posts/agent-delegation-and-code-review/). Inside a company, the people signing off are my team. In open source, it's the maintainer.

Patch the Planet from OpenAI and Trail of Bits takes exactly this approach, with the reporting side absorbing the complexity. Trail of Bits security engineers find bugs with OpenAI's security-focused models, and before anything reaches a maintainer, they review and validate every finding, group duplicates, and re-rate severity[^openai-patch-the-planet]. They don't stop at the report either; they bring patches and tests. In the first week after the June launch alone, they opened 64 PRs, and 37 of them have already been merged[^trailofbits-ptp].

Akrites, which the Linux Foundation launched in June, is heading in the same direction[^akrites-launch]. Companies like AWS, Anthropic, Google, Microsoft, and OpenAI pool the vulnerabilities they find into a joint security incident response team (SIRT), which merges duplicates, verifies severity, and coordinates disclosure timing. Instead of getting the same bug from five people with five different descriptions, the maintainer deals with one organized channel, and fixes still go in on the maintainer's terms.

Back to Patch the Planet: one interesting point in Trail of Bits' write-up is that what helped most in cutting false positives was a threat model and severity criteria written by the project itself, like PyCA's security documentation[^pyca-security]. According to Trail of Bits, without that kind of guidance, models rate almost everything as critical[^trailofbits-ptp]. Here too, the context comes from the maintainer.

That's why giving maintainers reasons to take part matters too. Anthropic offers maintainers free scans and Claude subscriptions[^anthropic-oss-scanner], and Patch the Planet gives participating projects ChatGPT Pro and API credits[^openai-patch-the-planet].

Plenty of questions remain. Not everyone can offer a clear reward like free scans. Without that kind of reward, how do we make writing a threat model a benefit for maintainers rather than a burden? How can we collect the bits of context that many different people hold and feed them into provers and scanners? I think the next challenge is getting people to take part in the security process naturally.

## Block the slop, or take it all?

Looking at the kernel rules earlier, I asked whether the higher bar might end up blocking even good bugs. So what should the receiving side do? Right now the mood leans toward blocking. Some, like curl as mentioned earlier, have ended their bug bounties entirely, and in March HackerOne's Internet Bug Bounty stopped taking new reports, saying open source fixes couldn't keep up with AI-found reports[^securityweek-oss-vrp]. At the end of April, Chrome changed its rewards to favor short reports with solid evidence that the bug exists. The message: if you want a bounty, show the effort[^google-vrp-ai-era]. Starting October 1, Google also temporarily stopped accepting product vulnerability reports for its OSS VRP, because automatically generated reports had surged and most of them were invalid[^securityweek-oss-vrp].

I also find myself thinking the other way. With a good verification system in place, wouldn't it be better to accept everything that comes in, slop included? The incoming data could be a big asset in itself. And couldn't the verification system just run hooked into the development environment? For the people finding vulnerabilities, setting up the build environment is the hardest part, but developers already have the build environment and CI. Reports could even serve as a kind of seed for finding similar bugs or other vulnerabilities.

Earlier I said the reporting side has to take on the complexity, but from the receiving side it looks different. If it were up to me, I really would accept everything. As a developer on the project, I'd have the most context, I'd already have the build environment, and I'd know that code better than anyone. Rather than blocking outside reports, I think it would be much better to verify them myself with my own domain knowledge. Why not use the verified results as a useful data pipeline, give feedback to the reporters, and work out together how to improve things? What my team wrote on the Microsoft blog points the same way: scan results should be treated not as a simple list of findings but as data for training the next model, and verification results should flow back into CI/CD and the development process[^microsoft-forge-lessons].

Accepting everything costs resources, of course. You need priorities so you don't burn tokens and CI time on useless reports, and you need mechanisms like paying bounties only for reports that show effort. There are probably many ways to go. Is crowdsourcing bugs really over, or does the way we receive reports just need to change?

## Verify everything first, or fix fast and fix again?

Once reports come in, there also seem to be two directions for how to apply patches.

One is the current approach: go through every verification step, then apply the patch carefully. It's safe but slow. The other treats AI as already smart enough: give it the context it needs to write the patch, check patch quality systematically with tests and review, and if something still goes wrong, apply the next patch right away. The idea is to make the patch cycle itself as short as possible.

Anthropic is building systems that let agents develop fast. As Claude wrote more of the code and daily merges grew from about 2,500 in May to more than 30,000 in September, Anthropic rebuilt its source control from scratch[^anthropic-source-control]. Instead of a merge queue sized for humans, it invested more in automated testing after merge and before deployment, and Anthropic says that when changes conflict, Claude often fixes it before anyone notices. It wasn't built for security patches, but my guess is that a system like this would make the second approach workable too.

There's an example on the review side too. In the Linux kernel, Sashiko[^sashiko], an AI review tool that Google built and donated to the Linux Foundation, is reportedly running on almost every kernel patch[^register-kernel-ai-reports]. It's close to the second approach's idea of checking patch quality systematically through review.

## If it passes the tests, is it the right patch?

The second approach checks patch quality with tests. After AIxCC, we checked at Team Atlanta whether a patch that passes the tests is really the right one. We had 10 coding agent configurations, as of February this year, patch the same 63 vulnerabilities from the finals, and people reviewed all 630 resulting patches[^team-atlanta-patch-2026]. The best configuration correctly fixed about 45, clearly better than the 33 that Claude Code (Claude 3.7 Sonnet) fixed when evaluated the same way last year. But even among patches that passed the build, the existing tests, and crash reproduction, about 20% for the best configuration, and up to 40% for the others, were actually wrong. Many changed normal functionality, blocked only the spot that crashed while leaving the root cause in place (like making a buffer bigger instead of fixing an off-by-one calculation), or used check conditions that were too loose. Tests don't catch these failures; you only find them when a person reads the patch. That said, putting 3 patches from different agents side by side and having an agent pick one did as well as or better than the best single agent. My guess is that comparing different patches makes the one that fixed the root cause stand out.

These results reflect the models of that time, given no proper context. Still, a usable patch needs more than blocking the vulnerability and passing the functional tests. I think it also has to fit the repository's code quality, performance, and style, the decisions made so far and the reasons behind them, and the direction the community has agreed on. Using this kind of information to produce precise patches is an interesting research topic in its own right.

The second approach only works if the patch cycle system is really good at checking all of this. How can we build that? Large open source communities are working toward it, but I'm not sure yet how far they've gotten. And I suspect small projects run by a handful of maintainers will have a hard time keeping up.

## Closing thoughts

Now that AI has made finding bugs cheaper, proving, fixing, and explaining them seem to matter more. Finding a bug, on its own, fixes nothing. Then isn't what fills that gap still people, along with the provers and patches they build, the context they share, and a patch cycle that quickly sends fixes back?

## Key takeaways

- AI has made finding vulnerability candidates much cheaper, but real bugs and false positives now pour in mixed together, so the burden of reproducing, analyzing, patching, and reporting has grown. A patch that passes the tests isn't guaranteed to be correct.
- Cut candidates down first with cheap filters like counterarguments, duplicate grouping, and the threat model, and check only what's left with the expensive prover. The hardest part of a prover isn't the AI; it's a build and runtime environment that matches the real thing.
- A threat model has to be judged across the whole connected system, not one repository, and that context comes from maintainers. The reporting side has to take on the complexity, but from the receiving side, wouldn't it be better to accept everything, even slop, and verify it inside CI/CD?

## References

* References
{:footnotes}

[^mdash]: [Microsoft, Defense at AI Speed: MDASH (2026-05-12)](https://www.microsoft.com/en-us/security/blog/2026/05/12/defense-at-ai-speed-microsofts-new-multi-model-agentic-security-system-tops-leading-industry-benchmark/)
[^anthropic-oss-scanner]: [Anthropic, OSS Scanner](https://red.anthropic.com/oss-scanner/)
[^openai-patch-the-planet]: [OpenAI, Patch the Planet: A Daybreak Initiative to Support Open Source Maintainers (2026-06-22)](https://openai.com/index/patch-the-planet/)
[^darpa-aixcc]: [DARPA, AIxCC Final Competition (2025-08-08)](https://www.darpa.mil/news/2025/aixcc-results)
[^curl-bug-bounty]: [Daniel Stenberg, The End of the curl Bug-Bounty (2026-01-26)](https://daniel.haxx.se/blog/2026/01/26/the-end-of-the-curl-bug-bounty/)
[^register-kernel-ai-reports]: [The Register, AI Bug Reports Went from Junk to Legit Overnight (2026-03-26)](https://www.theregister.com/software/2026/03/26/linux-kernel-czar-says-ai-bug-reports-arent-slop-anymore/5226256)
[^phoronix-kernel-ai-docs]: [Phoronix, Linux Kernel Adds Documentation for What Qualifies as a Security Bug, Responsible AI Use (2026-05-15)](https://www.phoronix.com/news/Linux-7.1-Kernel-Docs-AI-Bugs)
[^kernel-security-bugs]: [Linux Kernel Documentation, Security Bugs](https://docs.kernel.org/process/security-bugs.html)
[^register-assisted-by]: [The Register, Linux Kernel Devs Drop Obligatory Confession of AI Tool Usage (2026-10-14)](https://www.theregister.com/ai-and-ml/2026/10/14/linux-kernel-devs-drop-obligatory-confession-of-ai-tool-usage/5303140)
[^microsoft-forge-lessons]: [Microsoft, 3 Lessons from Frontier AI Vulnerability Research (2026-10-07)](https://www.microsoft.com/en-us/security/blog/2026/10/07/3-lessons-from-frontier-ai-vulnerability-research/)
[^lore-forge-reports]: [Our team's Linux kernel reports (lore.kernel.org)](https://lore.kernel.org/all/?q=%28%28f%3Ablbllhy%40gmail.com+OR+f%3Acenzhang%40linux.microsoft.com+OR+f%3A%22Xiang+Mei+%28Microsoft%29%22%29+NOT+s%3A%22Re%3A%22%29+OR+mid%3A20260725233930.2957317-1-xmei5%40asu.edu+OR+mid%3A20260720223400.1939998-1-xmei5%40asu.edu)
[^sok-rehosting]: [SoK: Enabling Security Analyses of Embedded Systems via Rehosting (AsiaCCS 2021)](https://doi.org/10.1145/3433210.3453093)
[^windows-vuln-management]: [Windows, Evolving Windows Vulnerability Management to Meet the Speed of AI-Powered Discovery (2026-07-09)](https://blogs.windows.com/windowsexperience/2026/07/09/evolving-windows-vulnerability-management-to-meet-the-speed-of-ai-powered-discovery/)
[^apple-containerization]: [apple/containerization](https://github.com/apple/containerization)
[^apple-container]: [apple/container](https://github.com/apple/container)
[^electron-security-md]: [Electron, SECURITY.md](https://github.com/electron/electron/blob/main/SECURITY.md)
[^electron-security-docs]: [Electron, Security](https://www.electronjs.org/docs/latest/tutorial/security)
[^oss-scanner-pulls]: [Anthropic, OSS Scanner pull requests](https://github.com/anthropics/oss-scanner/pulls)
[^trailofbits-ptp]: [Trail of Bits, Introducing Patch the Planet (2026-06-22)](https://blog.trailofbits.com/2026/06/22/introducing-patch-the-planet/)
[^akrites-launch]: [Linux Foundation, Linux Foundation and Industry Leaders Launch Akrites to Defend Critical Open Source Software Against AI-Enabled Cyber Threats (2026-06-25)](https://akrites.org/linux-foundation-and-industry-leaders-launch-akrites-to-defend-critical-open-source-software-against-ai-enabled-cyber-threats/)
[^pyca-security]: [PyCA cryptography, Security](https://cryptography.io/en/latest/security/)
[^securityweek-oss-vrp]: [SecurityWeek, Google Narrows Open Source Bug Bounty Amid Wave of Invalid Automated Reports (2026-10-05)](https://www.securityweek.com/google-narrows-open-source-bug-bounty-amid-wave-of-invalid-automated-reports/)
[^google-vrp-ai-era]: [Google Bug Hunters, Evolving the Android & Chrome VRPs for the AI Era (2026-04-30)](https://bughunters.google.com/blog/evolving-the-android-chrome-vrps-for-the-ai-era)
[^anthropic-source-control]: [Anthropic, Redesigning Source Control at Anthropic (2026-10-13)](https://www.anthropic.com/engineering/redesigning-source-control)
[^sashiko]: [Sashiko, Agentic Review of Linux Kernel Changes](https://sashiko.dev/)
[^team-atlanta-patch-2026]: [Team Atlanta, Patching Vulnerabilities with Coding Agents in 2026 (2026-03-11)](https://team-atlanta.github.io/blog/post-patch-2026-ensemble/)
