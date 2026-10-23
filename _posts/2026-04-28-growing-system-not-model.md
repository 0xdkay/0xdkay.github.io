---
title: "What's Left After a Long Coding-Agent Session?"
date: 2026-04-28 09:00:00 -0400
last_modified_at: 2026-10-18 09:00:00 -0400
categories: [Blog]
tags: [ai, agents, memory, context-engineering, harness-engineering]
lang: en
translation_key: growing-system-not-model
ai_translated: true
description: "A session can burn through hundreds of thousands of tokens and the model usually comes out unchanged. So I thought about what to pick out of a session and keep, and where to build it up: prompt, context, harness, or loop."
image:
  path: /assets/img/posts/growing-system-not-model.webp
  alt: "AI-generated illustration: a session passing through context, harness, and loop and building up in the system"
---

A long task with an AI agent packs a lot into a single session. We spot a problem, look for ways to fix it, try things, develop the idea, test, and get feedback. After hundreds of thousands of tokens of that, is the agent in the next session any smarter?

Mostly, no. The models we use are usually frozen, so generating lots of output doesn't change what they've learned. Open a new session and the agent starts from scratch, with none of that trial and error.

So is the trial and error from a long session simply thrown away? I don't think so. The model may not learn, but the system around it can. Prompt engineering, context engineering, and harness engineering, terms I hear a lot these days, seem to come down to which part of that system you're refining. This post is about what that system keeps, what it throws away, and how much it leaves to the model.

## A session is an experiment log

If I keep only the final answer when a session ends, I lose which approaches failed, which assumptions were wrong, and why I changed my mind. If I feed the whole conversation into the next session instead, the ideas I already dropped and environment details that only held at the time come right back in.

So a session is closer to an experiment log than to experience itself. I need to pull out what's worth using next time, and there's more than one kind of thing to pull out:

- **Failures:** what I tried, and why it didn't work.
- **Decisions:** what I chose, and which trade-off I accepted.
- **Knowledge:** what I confirmed, what the evidence is, and where it holds.
- **Skills:** which procedure I'll repeat next time, and how to verify it.

Without that split, a fix that only worked once gets retrieved as if it were general knowledge, or a call I already abandoned becomes the premise for the next task.

Archiving the raw session and promoting part of it into active memory, the memory the next task actually pulls from, are two separate decisions. You can archive the original to check later, but only verified pieces should go into the memory that actually gets retrieved and injected.

## Promotion rules matter more than storage

Put a method that worked once straight into active memory, and lucky wins pile up alongside bad self-assessments. At a minimum, you need these steps:

1. **Extract:** Sort candidates into failures, decisions, knowledge, and skills.
2. **Link evidence:** Attach the raw session, test results, scope, and counterexamples.
3. **Verify:** Test again on a task different from the one in that session.
4. **Promote and update:** Use only what passes, and adjust its confidence or demote it again based on later results.

You could compare this to the brain sorting out memories during sleep. When I actually build it, though, it looks more like a data pipeline: collect, synthesize, try it in other domains, verify again. What matters isn't storage capacity but the rules for which candidates get promoted and which failures send them back down. Even a candidate that fails verification is worth keeping, along with the conditions it failed under, rather than deleting. That can cut the cost of repeating the same failure.

Research has similar ideas. Reflexion wrote down why an attempt failed and passed that to the next attempt[^reflexion], and Voyager built up executable code skills in Minecraft and reused them on new tasks[^voyager]. None of these studies validated the full promotion loop above; I'm only borrowing ideas from them.

Sessions also contain personal data, credentials, and confidential code. If memory grows without rules for what to collect, who can see it, how long to keep it, and how to delete it, you end up repeating mistakes and risks along with the experience.

## Where does that system live?

Over the last few years, the AI field has produced a steady stream of new "X engineering" terms. It started with prompt engineering: writing the question well. From mid-2025, context engineering caught on, and Anthropic sees it as the natural next step after prompt engineering[^anthropic-context-engineering]. The idea is that managing everything the model sees at each moment now matters more than a single prompt sentence.

In February 2026, OpenAI published a post on harness engineering[^openai-harness]. It describes an experiment where they built a product using only Codex, with no human writing code directly. According to the post, the engineers' job shifted from writing code to building the environment the agent works in, making intent clear, and setting up feedback loops. In the post's words: "Humans steer. Agents execute."

The names keep changing, but the direction looks about the same. Human attention is moving, one step at a time, from the sentences we hand the model to the structure around it. I'll follow that trend here and split an agent into four layers.

Say I ask an agent to "Fix the login failure bug." The four layers break down like this:

- **Prompt:** What I want. "Fix the login failure bug."
- **Context:** Which code, logs, tests, and past decisions the model sees right now.
- **Harness:** Which files and logs it can read, and which tools and permissions it can run with.
- **Loop:** How to verify, retry, roll back, or escalate to a person when the result is wrong.

The harness is what lets the agent read logs; context picks which of them the model sees. The prompt states the goal, and the loop looks at the result and decides whether to keep going or stop. Split up this way, some problems clearly can't be solved with a prompt. You can write "verify carefully" as many times as you like, but a model that can't run tests won't actually verify anything.

The promotion loop from earlier runs on these four layers too. Deciding what to promote into memory and show the model is a context problem; retesting it on other tasks is the job of the harness and the loop.

## What the model absorbs, and what stays outside

As models improve, part of the supporting structure we used to impose from outside, the scaffold, turns into something the model just does. Breaking work into small steps, picking the right tool for the situation, trying another approach after a failure: we used to get these with long planning prompts. Once the model does these things by default, you can try the same work at a lower reasoning effort. But lowering it isn't a goal in itself. It's an improvement when you get the same success rate and reliability for less cost.

Some things, though, have to stay outside the model for structural reasons:

- **Current state:** The current code, today's logs, and responses from external systems didn't exist when the model was trained.
- **Execution results:** Build logs and test output are facts you only get by actually running things. That's different from what a model confidently explains.
- **Permissions:** The organization decides which files and production actions are allowed, and who approves them.
- **Verification:** Whether a result is actually right has to be checked outside the model, by running tests or looking at the real environment, not by the model's own judgment. I covered how to design this boundary at the skill level in [the next post](/posts/a-skill-is-a-prompt-with-an-eval/).

Don't go by feel when deciding what has moved into the model. Keep the task, tools, and evaluation fixed, and remove supports like a planning prompt or self-check one at a time. If success rate, cost, latency, and human intervention don't change, you don't need that scaffold anymore, at least under those conditions. If removing current state, execution results, or permission checks makes things fail, that part still belongs to the outside system.

## A social network for bots

So far this has been about one agent learning from its own sessions. What if agents shared experience with each other?

In January 2026, a service called Moltbook launched[^moltbook]. It's a Reddit-style social network built for AI agents. Most of the agents there run on an open-source agent called OpenClaw. How autonomous they really are is up for debate, but a space where bots trade information with each other is interesting in its own right.

It got me thinking. If each agent has different information sources and tools, a network like this lets them find who knows what and quickly share the knowledge they need. Could feeding in information from all those different eyes and ears right away be the heart of a self-improvement loop, one where the system gets better on its own?

The catch is that errors spread just as fast. A false positive from one specific configuration gets summarized as "this whole library is vulnerable," other agents cite that without checking the original, and a conclusion with no evidence quickly becomes something everyone believes. Shared knowledge should carry, at minimum, where it came from, who verified it, how far it holds, and when it expires. Fast knowledge sharing is a fast improvement loop, and it's also a fast error-propagation loop.

## Closing thoughts

I think what grows isn't a single model but the whole system: prompt, context, harness, and loop together. A good system doesn't remember everything.

## Key takeaways

- A frozen model doesn't learn on its own, no matter how many sessions you run. What grows is the system outside it, which picks failures, decisions, knowledge, and skills out of sessions, verifies them, and promotes them into memory.
- As models improve, supports like planning and tool selection move into the model, but current state, execution results, permissions, and verification stay outside. To check what has moved in, remove supports one at a time and see what changes.
- When agents share knowledge, improvement speeds up, but errors spread just as fast. Shared knowledge needs to carry its source, verification, and scope.

## Update (October 2026)

A few months after I wrote this, the layer I called Loop got a name of its own, so here's an update.

The term loop engineering started showing up around June 2026[^osmani-loop-engineering]. Peter Steinberger, who built OpenClaw (mentioned above), said you should stop writing prompts for coding agents directly and instead design loops that write the prompts for them (Addy Osmani's summary[^osmani-loop-engineering]).

The structure goes roughly like this: run the agent on a schedule or on a repository event, stop when a machine-checkable condition is met, record progress in files outside the conversation, have another sub-agent verify the results, and hand off what doesn't work to a person. The loop engineering paper from August lists almost the same building blocks for a well-built loop[^loop-engineering-paper].

I use loops a lot these days too. I needed an auto nudge to put the agent back to work whenever it stalled midway or sat waiting for my reply, so I'd been running agents periodically with scheduled prompts and cron jobs. I was doing something like this before it had a name. Once it's running, though, the same problems keep coming up: when to make it stop, what to keep as a record, and which results to trust and move on from. I still need to think harder about how to build loops well.

In August, Jeff Dean left Google and founded a company called Discovery Loop[^techcrunch-jeff-dean]. His co-founders, Sanjay Ghemawat, Quoc Le, and Oriol Vinyals, are reportedly all ex-Google as well, though I'll admit Jeff Dean was the only name I recognized. Seeing that Jeff Dean, who had worked at Google for nearly 27 years since 1999, leave to automate the experiment loop made me do a double take.

They want AI to propose experiments, implement and run them, look at the results, and revise, running thousands of these loops in parallel[^discovery-loop]. That's almost exactly the loop I described at the start of this post. Interestingly, Discovery Loop also describes what it can tackle as "any learning loop with measurable outcomes"[^discovery-loop]. Running a loop automatically means you have to be able to check what counts as success from outside, by measurement rather than the model's own judgment. I think that's the same point this post made: verification has to happen outside the model.

The Dream-RSI paper from September shows a way to run loops like this more cheaply[^dream-rsi]. The agent's attempts build up as a discovery tree of which attempt branched off from which, and a piece of code called the exploration strategy picks which branch to continue from. The tree also keeps how each attempt turned out, and instead of actually running every new exploration strategy, a new strategy is first tested against that record. The paper calls this dreaming. Only the exploration strategy code changes; the model and the evaluator stay the same. On some tasks it kept results about the same or better while cutting the cost a lot. Earlier in this post I compared consolidating memory to the brain during sleep, and this literally makes the system dream over its past records. The record, failed attempts included, becomes material for improving the next round of exploration, and the outer system gets better while the model stays as is.

Dream-RSI still needs an evaluator that scores the results, though. So how could you run a loop like this on problems where the results are hard to measure?

## References

* References
{:footnotes}

[^reflexion]: [Shinn et al., Reflexion: Language Agents with Verbal Reinforcement Learning (arXiv, 2023-03)](https://arxiv.org/abs/2303.11366)
[^voyager]: [Wang et al., Voyager: An Open-Ended Embodied Agent with Large Language Models (arXiv, 2023-05)](https://arxiv.org/abs/2305.16291)
[^anthropic-context-engineering]: [Anthropic, Effective Context Engineering for AI Agents (2025-09-29)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
[^openai-harness]: [OpenAI, Harness Engineering: Leveraging Codex in an Agent-First World (2026-02-11)](https://openai.com/index/harness-engineering/)
[^moltbook]: [Wikipedia, Moltbook](https://en.wikipedia.org/wiki/Moltbook)
[^osmani-loop-engineering]: [Addy Osmani, Loop Engineering (2026-06-07)](https://addyosmani.com/blog/loop-engineering/)
[^loop-engineering-paper]: [Lulla et al., Loop Engineering: Building Blocks, Adoption, and Impact (arXiv, 2026-08)](https://arxiv.org/abs/2608.21884)
[^techcrunch-jeff-dean]: [TechCrunch, Jeff Dean and Other Top AI Researchers Are Leaving Google to Launch Their Own Startup (2026-08-05)](https://techcrunch.com/2026/08/05/jeff-dean-and-other-top-ai-researchers-are-leaving-google-to-launch-their-own-startup/)
[^discovery-loop]: [Discovery Loop, Continuous Exploration](https://www.discoveryloop.com/)
[^dream-rsi]: [Zheng et al., Dream-RSI: Recursive Self-Improvement through Evolving Worlds (arXiv, 2026-09)](https://arxiv.org/abs/2609.14858)
