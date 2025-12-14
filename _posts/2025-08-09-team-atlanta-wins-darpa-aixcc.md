---
title: "Team Atlanta Wins DARPA AI Cyber Challenge (AIxCC)"
date: 2025-08-09 12:00:00 -0400
last_modified_at: 2025-12-14
categories: [Blog]
tags: [aixcc, darpa, team-atlanta, ai-security]
pin: true
---

I am excited to share that **Team Atlanta** has won **1st Place** in DARPA's AI Cyber Challenge (AIxCC)!

## About AIxCC

The [AI Cyber Challenge (AIxCC)](https://aicyberchallenge.com/) is DARPA's competition to develop AI systems that autonomously discover and patch vulnerabilities. We built **ATLANTIS**, a multi-agent system combining LLMs with program analysis techniques (symbolic execution, directed fuzzing, static analysis) to find and fix bugs at scale. During the competition, we found the most real-world 0-day vulnerabilities among all participants.

For more details, check out the [Team Atlanta website](https://team-atlanta.github.io/) and [media coverage](https://team-atlanta.github.io/news/). For technical details, see our paper: [ATLANTIS](https://arxiv.org/abs/2509.14589). All teams' source code is available at the [AIxCC Archive](https://archive.aicyberchallenge.com/).

## What I Worked On

I was part of the CRS-Multilang team, where we built [Atlantis-Multilang](https://team-atlanta.github.io/blog/post-crs-multilang/), an LLM-powered automatic bug finding system that contributed 69.2% of all POV submissions in the finals.

Early on, we realized that traditional fuzzing and LLMs excel in very different domains: fuzzers are great at finding memory corruption, while LLMs can reason about logic errors. So instead of building one monolithic AI, we designed [MLLA (Multi-Language LLM Agent)](https://team-atlanta.github.io/blog/post-mlla-overview/), a team of specialized agents that collaborate like a security research team.

The first challenge was understanding the target. How do you navigate a massive codebase and figure out where bugs might hide? We built [code exploration agents](https://team-atlanta.github.io/blog/post-mlla-disc-agents/) that map function relationships, identify dangerous operations, and prioritize security-critical paths.

But finding crashes is not enough, as most are false alarms. We needed [BCDA, an AI detective](https://team-atlanta.github.io/blog/post-mlla-bcda/) that performs multi-stage investigation to separate genuine vulnerabilities from noise.

The hardest problem was exploit generation. A single character error can break an entire exploit. Our breakthrough came when we stopped trying to generate raw payloads and instead [taught LLMs to write Python scripts](https://team-atlanta.github.io/blog/post-mlla-bga/) that create exploits. This let us handle complex multi-layer formats like ZIP, XML, and binary structures.

Perhaps the biggest lesson: LLMs are powerful, but they need the right information presented the right way. We developed [context engineering techniques](https://team-atlanta.github.io/blog/post-context-engineering/) that achieved ~92% success rate by structuring prompts with top-down guidance and source code annotations.

If you want to hear the full story, I gave a talk at [ACM MaaSec, Maastricht University](/talks/) about the inside details of the AI Cyber Challenge.

## Future Research Opportunities

The techniques we developed (XML structuring, annotation systems, coverage feedback, domain knowledge integration) enabled real vulnerability discoveries during AIxCC. But this is just the beginning, and many open questions remain:

- **Context Engineering at Scale**: Will context engineering remain important as models scale, or will larger context windows make it obsolete?
- **Integration with Pentesting Frameworks**: Due to competition rules, we could not leverage known vulnerabilities or CVE information in AIxCC. But what if we could? Integrating LLMs with existing pentesting frameworks like [Metasploit](https://github.com/rapid7/metasploit-framework), [sqlmap](https://github.com/sqlmapproject/sqlmap), or [OWASP ZAP](https://github.com/zaproxy/zaproxy) could enable retrieval of relevant vulnerability knowledge and exploitation patterns in real-time.
- **LLM-Friendly Representations**: Instead of feeding raw function code directly, can we use function summaries or other intermediate formats that are easier for LLMs to reason about?
- **Beyond Harnesses**: Can we build full exploit agents that work on CTF challenges or real-world vulnerabilities without pre-built harnesses? The AIxCC organizers used [Sherpa](https://github.com/AIxCyberChallenge/sherpa) for harness engineering using LLMs when creating competition challenges.
- **On-Premise Deployment**: Many critical infrastructures operate on isolated networks where cloud-based models cannot be used. Can smaller open models like [gpt-oss-20b](https://huggingface.co/OpenAI/gpt-oss-20b) running locally achieve similar results? If so, this opens doors for enterprise and government adoption. If not, organizations may simply rely on contracts with model providers that shift liability for data leaks.

From interacting with LLMs extensively during the competition, I learned that they can be treated much like working with people. The skills that matter when managing a team or delegating subtasks (clear communication, structured guidance, knowing what context to provide) turn out to be exactly what matters when working with LLMs. Delegating a task to an LLM can get you to a certain point, but you will hit a ceiling. If you are an expert in a domain, context engineering is how you bring the LLM's capability up to your boundary.

## What is Next

For me, the competition results cannot just end here. The purpose of AIxCC itself is to protect critical infrastructure by strengthening open source software security. Since most code today relies on open source, the security of open source directly affects the safety of our social infrastructure. Just as Google's OSS-Fuzz project continuously finds vulnerabilities in open source, I believe CRS systems should be widely deployed in real environments.

This is a problem that security researchers must address. As the winning team with the strongest academic presence, we feel a responsibility to continue this work. Led by Professor [Taesoo Kim](https://taesoo.kim/) at Georgia Tech, we are exploring ways to integrate CRS with Google's OSS-Fuzz infrastructure so that security researchers can continuously benefit from it. We are also preparing standard benchmarks for vulnerability verification and patching, which we plan to release soon. Stay tuned!

## Acknowledgments

Winning alongside the talented colleagues of Team Atlanta has been an incredible fortune. What makes this especially meaningful is that many of us were former CTF teammates who have now reunited from our respective positions to pursue a bigger goal together.

One interesting observation: teammates who were initially quite skeptical of AI have now become positive about its potential, with some even thinking they might lose their jobs in a few years. This shift in perspective throughout the competition was fascinating to witness.

This achievement would not have been possible without the collaboration of all Team Atlanta members and the support from Georgia Tech.
