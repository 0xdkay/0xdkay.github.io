---
title: "The Accelerating Gap Between Attack and Defense in the Age of AI"
date: 2026-03-06 12:00:00 -0400
categories: [Blog]
tags: [ai, security, vulnerability, patch-gap]
---

*Read this post in [[Korean]](/posts/ai-accelerating-attack-defense-gap-ko/).*

I have been thinking a lot lately about the accelerating gap between attack and defense driven by AI.

Tasks like vulnerability analysis, exploit writing, and large-scale scanning are getting faster every day. In fact, the time from vulnerability disclosure to working exploit code has reportedly shrunk from 2.3 years to [1.6 days](https://zerodayclock.com/).

![From Vulnerability to Exploitation](/assets/img/from_vuln_to_exploit.png){: w="700" }
_Source: [zerodayclock.com](https://zerodayclock.com/)_

Setting aside whether AI is smarter than humans, in terms of speed, it already seems beyond what humans can keep up with. Through automation and engineering, attacker velocity is being dramatically accelerated.

So can defense keep up with this speed?

Even when a patch exists, there is always a physical time gap, a "patch gap," before it is actually deployed to systems. From what I heard during previous research, even after patching a smartphone vulnerability, it can take at least 6 months to reach end-user devices through hundreds of carriers worldwide.

These gaps are gradually shrinking, but can patching ever keep pace with the speed of attacks? On top of that, users do not always update immediately. For these reasons, attacks exploiting the patch gap could actually grow.

AI has already reached the stage of finding vulnerabilities at scale. Security startup AISLE claimed to have found [12 CVEs in OpenSSL](https://aisle.com/blog/aisle-discovered-12-out-of-12-openssl-vulnerabilities) and over [100 OpenClaw vulnerabilities](https://aisle.com/blog/aisle-tops-openclaw-disclosures). Model companies like [Anthropic](https://red.anthropic.com/2026/zero-days/) and [OpenAI (Aardvark)](https://openai.com/index/introducing-aardvark/) are also conducting AI-based vulnerability analysis.

If LLMs can find vulnerabilities with high accuracy and even suggest patches, where does the role of the pentester shift to?

Perhaps that is why the questions have changed.

Before, the question was:

> "Does this code have a vulnerability?"

Now, the questions are a bit different:

> "What attack paths can this vulnerability actually create?"
>
> "Even if this system is compromised, how far can the impact reach?"

Is it realistic to completely eliminate vulnerabilities? Instead, designing structures that limit the damage scope even when vulnerabilities exist, i.e., reducing the blast radius, may become the more important problem.

Ultimately, the issue may not be the existence of vulnerabilities, but the speed at which vulnerabilities become actual attack paths.

Google's recent [acquisition of Wiz](https://cloud.google.com/blog/products/identity-security/google-announces-agreement-acquire-wiz), a company specializing in Attack Path Analysis and Simulation, seems related to this trend. Analyzing what attack paths a vulnerability can actually create is becoming more important than just finding the vulnerability itself.

So what should vulnerability assessors focus on going forward?

Simply finding vulnerabilities in given code may not be sufficient on its own. Understanding the **context of the entire system** across multiple domains (operational environment configurations, permission structures, interconnections with other systems, actual service flows) may become the more critical problem.

In the end, will interaction with the real world become the more important problem?

Yann LeCun's World Model emphasizes the ability to understand context through interaction with the real world. Meta has shown attempts to apply this approach to the code domain as well with their [Code World Model](https://ai.meta.com/research/publications/cwm-an-open-weights-llm-for-research-on-code-generation-with-world-models/), not viewing code simply as tokens or words, but modeling the flow of code execution and state changes.

This is still experimental research, but if such approaches are applied to the security domain, it may become possible to go beyond simply finding code vulnerabilities to understanding how and in what context a system can fail.

Perhaps this is not an entirely new story. It may be the process of problems we already knew about becoming reality at a much faster pace.

That is perhaps why flexible response capabilities, the ability to shift thinking quickly, will become increasingly important going forward.
