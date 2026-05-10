---
title: "The Accelerating Gap Between Attack and Defense in the Age of AI"
date: 2026-03-06 00:00:00 -0500
categories: [Blog]
tags: [ai, security, vulnerability, patch-gap]
lang: en
translation_key: ai-accelerating-attack-defense-gap
description: "The time from vulnerability disclosure to exploit has shrunk from 2.3 years to 1.6 days. AI is widening the gap between attack and defense."
---

The time from vulnerability disclosure to working exploit code has reportedly shrunk from 2.3 years to [1.6 days](https://zerodayclock.com/).

![From Vulnerability to Exploitation](/assets/img/from_vuln_to_exploit.webp){: w="700" }
_Source: [zerodayclock.com](https://zerodayclock.com/)_

Tasks like AI-powered vulnerability analysis, exploit writing, and large-scale scanning are getting faster every day. Setting aside whether AI is smarter than humans, in terms of speed, it already seems beyond what humans can keep up with.

So can defense keep up with this speed?

Even when a patch exists, there is always a physical time gap, a "patch gap," before it is actually deployed to systems. From what I heard during previous research, even after patching a smartphone vulnerability, it can take at least 6 months to reach end-user devices through hundreds of carriers worldwide.

These gaps are gradually shrinking, but can patching ever keep pace with the speed of attacks? On top of that, users do not always update immediately. For these reasons, attacks exploiting the patch gap could actually grow.

AI has already reached the stage of finding vulnerabilities at scale. AI security startup AISLE found [12 CVEs in OpenSSL](https://aisle.com/blog/aisle-discovered-12-out-of-12-openssl-vulnerabilities), and model companies like [Anthropic](https://red.anthropic.com/2026/zero-days/) and [OpenAI Aardvark](https://openai.com/index/introducing-aardvark/) are also conducting AI-based vulnerability analysis.

If LLMs can find vulnerabilities with high accuracy and even suggest patches, and if this can be adopted in the development stage, where does the role of the pentester shift to?

What should vulnerability assessors focus on going forward?

Before, the question was: "Does this code have a vulnerability?" Now, the questions are a bit different. "What attack paths can this vulnerability actually create?" "Even if this system is compromised, how far can the impact reach?"

Is it realistic to completely eliminate vulnerabilities? Instead, designing structures that limit the damage scope even when vulnerabilities exist, i.e., reducing the blast radius, may become the more important problem. Google's recent [acquisition of Wiz](https://cloud.google.com/blog/products/identity-security/google-announces-agreement-acquire-wiz), a company specializing in Attack Path Analysis and Simulation, seems related to this trend. Analyzing what attack paths a vulnerability can actually create is becoming more important than just finding the vulnerability itself.

Simply finding vulnerabilities in given code may not be sufficient on its own. Understanding the **context of the entire system** across multiple domains (operational environment configurations, permission structures, interconnections with other systems, actual service flows) may become the more critical problem.

There are some interesting attempts as well. Meta has shown an approach of not viewing code simply as tokens or words, but modeling the flow of code execution and state changes with their [Code World Model](https://ai.meta.com/research/publications/cwm-an-open-weights-llm-for-research-on-code-generation-with-world-models/).

This is still experimental research, but if such approaches are applied to the security domain, it may become possible to go beyond simply finding code vulnerabilities to understanding how and in what context a system can fail.

Flexible response capabilities, the ability to shift thinking quickly, will become increasingly important going forward.
