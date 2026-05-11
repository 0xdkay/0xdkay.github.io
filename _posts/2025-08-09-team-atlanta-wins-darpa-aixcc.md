---
title: "Team Atlanta Wins DARPA AI Cyber Challenge (AIxCC)"
date: 2025-08-09 12:00:00 -0400
last_modified_at: 2025-12-14
categories: [Blog]
tags: [aixcc, darpa, team-atlanta, ai-security]
keywords: "ATLANTIS CRS-Multilang MLLA BCDA BGA context engineering exploit generation patch generation vulnerability discovery cyber reasoning system"
topics: [ai-security]
lang: en
translation_key: team-atlanta-wins-darpa-aixcc
pin: true
description: "Team Atlanta wins 1st place in DARPA's AI Cyber Challenge (AIxCC), demonstrating AI-driven vulnerability detection and patching."
thumbnail:
  path: /assets/img/aixcc/aixcc-first-place-announcement-preview.webp
  alt: "Team Atlanta announced as the 1st-place winner of DARPA AIxCC."
---

**Team Atlanta** won **1st place** in DARPA's AI Cyber Challenge (AIxCC). I worked on the CRS-Multilang effort behind ATLANTIS, our cyber reasoning system for automated vulnerability discovery and patching.

![Team Atlanta announced as the 1st-place winner of DARPA AIxCC](/assets/img/aixcc/aixcc-first-place-announcement-preview.webp){: w="700" }
_Team Atlanta announced as the 1st-place winner of DARPA AIxCC._

## About AIxCC

The [AI Cyber Challenge (AIxCC)](https://aicyberchallenge.com/) is DARPA's competition to develop AI systems that autonomously discover and patch vulnerabilities. We built **ATLANTIS**, a multi-agent system combining LLMs with program analysis techniques (symbolic execution, directed fuzzing, static analysis) to find and fix bugs at scale under competition constraints.

![AIxCC scoreboard breakdown](/assets/img/aixcc/aixcc-scoreboard.webp){: w="700" }
_AIxCC final scoreboard breakdown._

For more details, check out the [Team Atlanta website](https://team-atlanta.github.io/) and [media coverage](https://team-atlanta.github.io/news/). For technical details, see our paper: [ATLANTIS](https://arxiv.org/abs/2509.14589). All teams' source code is available at the [AIxCC Archive](https://archive.aicyberchallenge.com/).

## What I Worked On

I was part of the CRS-Multilang team, where we built [Atlantis-Multilang](https://team-atlanta.github.io/blog/post-crs-multilang/), an LLM-powered automatic bug finding system. In the finals, it contributed 69.2% of Team Atlanta's POV submissions.

Early on, we realized that traditional fuzzing and LLMs excel in very different domains: fuzzers are great at finding memory corruption, while LLMs can reason about logic errors. So instead of building one monolithic AI, we designed [MLLA (Multi-Language LLM Agent)](https://team-atlanta.github.io/blog/post-mlla-overview/), a team of specialized agents that collaborate like a security research team.

The first challenge was understanding the target. How do you navigate a massive codebase and figure out where bugs might hide? We built [code exploration agents](https://team-atlanta.github.io/blog/post-mlla-disc-agents/) that map function relationships, identify dangerous operations, and prioritize security-critical paths.

But finding crashes is not enough, as most are false alarms. We needed [BCDA, an investigation agent](https://team-atlanta.github.io/blog/post-mlla-bcda/) that performs multi-stage analysis to separate genuine vulnerabilities from noise.

The hardest problem was exploit generation. A single character error can break an entire exploit. The most effective design was to stop generating raw payloads directly and instead [teach LLMs to write Python scripts](https://team-atlanta.github.io/blog/post-mlla-bga/) that create exploits. This let us handle complex multi-layer formats like ZIP, XML, and binary structures.

Perhaps the biggest lesson: LLMs are powerful, but they need the right information presented the right way. In our evaluation, [context engineering techniques](https://team-atlanta.github.io/blog/post-context-engineering/) achieved a ~92% success rate by structuring prompts with top-down guidance and source code annotations.

If you want to hear the full story, I gave a talk at [ACM MaaSec, Maastricht University](/talks/) about the inside details of the AI Cyber Challenge.

## Future Research Opportunities

The techniques we developed (XML structuring, annotation systems, coverage feedback, domain knowledge integration) enabled real vulnerability discoveries during AIxCC. Many open questions remain:

- **Context Engineering at Scale**: Will context engineering remain important as models scale, or will larger context windows make it obsolete?
- **Integration with Pentesting Frameworks**: Due to competition rules, we could not leverage known vulnerabilities or CVE information in AIxCC. But what if we could? Integrating LLMs with existing pentesting frameworks like [Metasploit](https://github.com/rapid7/metasploit-framework), [sqlmap](https://github.com/sqlmapproject/sqlmap), or [OWASP ZAP](https://github.com/zaproxy/zaproxy) could enable retrieval of relevant vulnerability knowledge and exploitation patterns in real-time.
- **LLM-Friendly Representations**: Instead of feeding raw function code directly, can we use function summaries or other intermediate formats that are easier for LLMs to reason about?
- **Beyond Harnesses**: Can we build full exploit agents that work on CTF challenges or real-world vulnerabilities without pre-built harnesses? The AIxCC organizers used [Sherpa](https://github.com/AIxCyberChallenge/sherpa) for harness engineering using LLMs when creating competition challenges.
- **On-Premise Deployment**: Many critical infrastructures operate on isolated networks where cloud-based models cannot be used. Can smaller open models like [gpt-oss-20b](https://huggingface.co/OpenAI/gpt-oss-20b) running locally achieve similar results? If so, this opens doors for enterprise and government adoption. If not, organizations may simply rely on contracts with model providers that shift liability for data leaks.

From interacting with LLMs extensively during the competition, I learned that they can be treated much like working with people. The skills that matter when managing a team or delegating subtasks (clear communication, structured guidance, knowing what context to provide) turn out to be exactly what matters when working with LLMs. Delegating a task to an LLM can get you to a certain point, but you will hit a ceiling. If you are an expert in a domain, context engineering is how you bring the LLM's capability up to your boundary.

## What Comes Next

The result is a starting point, not a finish line. The purpose of AIxCC is to protect critical infrastructure by strengthening open source software security. Since most code today relies on open source, the security of open source directly affects the safety of our social infrastructure. Just as Google's OSS-Fuzz project continuously finds vulnerabilities in open source, I believe CRS systems should be widely deployed in real environments.

Led by Professor [Taesoo Kim](https://taesoo.kim/) at Georgia Tech, we are exploring ways to integrate CRS with Google's OSS-Fuzz infrastructure so that security researchers can continuously benefit from it. We are also preparing standard benchmarks for vulnerability verification and patching.

## Acknowledgments

I was fortunate to work alongside the talented colleagues of Team Atlanta. What makes this especially meaningful is that many of us were former CTF teammates who reunited from our respective positions to pursue a bigger goal together.

![Team Atlanta group photo at DEF CON 33](/assets/img/aixcc/team-atlanta-group.webp){: w="700" }
_Team Atlanta at DEF CON 33 after winning DARPA AIxCC._

One interesting observation: teammates who were initially skeptical of AI became much more positive about its potential over the course of the competition. This shift in perspective was fascinating to witness.

This achievement would not have been possible without the collaboration of all Team Atlanta members and the support from Georgia Tech.

![Me with the DARPA AIxCC first-place trophy and prize check](/assets/img/aixcc/aixcc-first-place-winner.webp){: w="700" }
_Me with the DARPA AIxCC first-place trophy and prize check._
