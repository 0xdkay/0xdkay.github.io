---
title: "Can People and Agents Sync Their Understanding?"
date: 2026-07-08 09:00:00 -0400
last_modified_at: 2026-10-18 09:00:00 -0400
categories: [Blog]
tags: [ai, agents, context-engineering, cognitive-debt, human-in-the-loop]
lang: en
ai_translated: true
translation_key: understanding-cannot-be-outsourced
description: "The code and docs my agents produced were neatly organized, but that didn't mean I understood them. Starting from a line Karpathy quoted and the idea of cognitive debt, I look at how to bring what agents produce in line with what people actually understand."
image:
  path: /assets/img/posts/understanding-cannot-be-outsourced.webp
  alt: "AI-generated illustration: AI-made summaries and wikis leave cognitive debt behind; questions and retros lead to understanding built on explaining, predicting, and recovering"
---

I was watching a short talk with Andrej Karpathy, and one line he quoted near the end, from a tweet he said he'd seen recently, stuck with me[^karpathy-talk].

> You can outsource your thinking, but you can't outsource your understanding.

He added that even as agents take on more of the work, you still have to understand what you're building and why it's worth building. That understanding is what lets you direct the agents.

It landed because I'd been thinking along the same lines while building with agents. The code, docs, and work logs they produced piled up fast and were neatly organized. Yet a lot of the time I didn't really understand what was in them.

So how much of the thinking should I do myself, and how should I divide the work with AI? And how do I keep what the agents produce in sync with what I actually understand?

## Context is the new program

In the same talk, Karpathy compares the context window to a new kind of program, run by an interpreter called the LLM[^karpathy-talk]. We used to write exact code paths. Now we arrange instructions, examples, docs, memory, and tools in the context and let the model choose the next action. Which context you assemble, and when, starts to matter more than what the model knows.

This brings a new problem. Information gets scattered across chat sessions, each agent has its own context, and important decisions live only inside prompts. The code diff survives; the reason behind it doesn't. Once you can't keep track of several agents running in parallel, the neatly organized output and the team's shared understanding drift further apart. I'd call this context fragmentation.

Karpathy's LLM Wiki pattern is one way to reduce this fragmentation. Instead of searching the raw sources again for every question, the LLM reads the material and keeps a wiki of summaries and cross-references up to date[^llm-wiki].

I wrote about growing this kind of outer system in [What's Left After a Long Coding-Agent Session?](/posts/growing-system-not-model/). Here I want to look at the next step. A better-organized wiki makes search and linking better, but it doesn't guarantee that people can explain the system's purpose, how its design fits together, or how it fails.

## Debt that builds up even in clean code

In her post Cognitive Debt, Margaret-Anne Storey separates two kinds of debt[^storey-cognitive-debt]. Technical debt lives in the code and design. Cognitive debt lives in what developers and teams understand.

AI-written code can be clean and work well, and you can still be piling up cognitive debt if nobody can answer questions like these:

- What was this system built to do?
- Why were this structure and these dependencies chosen?
- Which invariants must always hold?
- How far does a small change reach?
- If it breaks, who can debug and recover it?

In his 1985 essay Programming as Theory Building, Peter Naur argued that a program isn't just its source code but a theory in the developers' heads: their understanding of its purpose and how the design fits together[^naur]. AI can write code quickly, but that theory doesn't appear in the team by itself.

## What does the research say?

I've been saying cognitive debt builds up, but it hasn't yet been established that AI coding causes long-term debt in teams. Most of the evidence so far comes from short, small studies. Still, several results point the same way.

First, how it feels and what actually happens can differ. In the 24-person Expectation vs. Experience study, participants preferred Copilot, but their task time and success rate didn't clearly improve, and they struggled to understand and fix the generated code[^vaithilingam]. In METR's experiment, 16 experienced open-source developers did 246 tasks on their own projects, which they'd worked on for 5 years on average. With AI allowed, they took 19% longer. Even after the experiment, they believed AI had made them 20% faster[^metr].

Understanding of the code can drop too. In Anthropic's study, 52 developers learned an unfamiliar Python library. The AI group averaged 50% on a quiz right after the task, versus 67% for the group that coded by hand, and the biggest gap was on debugging questions. The AI group wasn't statistically significantly faster either[^anthropic-skills].

## How you used it made the difference

The interesting part is that results split even with the same AI. In the Anthropic study, people who handed nearly all the coding or debugging to AI averaged under 40% on the quiz. People who asked conceptual questions, asked for explanations along with the code, or followed up after getting code to check their own understanding scored 65% or higher[^anthropic-skills]. That last group worked almost exactly like the hand-it-all-off group, taking the code and pasting it in. The one difference was that they checked whether they understood it. Each group had only a handful of people, so this is hard to call causal. Still, it's worth remembering: same tool, same order of steps, and the results depended on whether people tried to understand.

Another experiment, with 78 people, added a step where participants had to explain AI-generated code before adding it. Compared with a group that used AI without that step, the features were just as complete, but in a later 30-minute maintenance task without AI, the failure rate was 77% for the group without the explanation step versus 39% for the group with it[^sankaranarayanan].

What matters seems to be less whether the tool is there and more which thinking it replaces, which thinking it asks of you, and whether you try to understand. That said, apart from METR's experiment, most of these studies look at students or junior developers learning something new. There's still little evidence on experienced people doing work they already know well.

## What to delegate and what to understand

None of this means handing memory and implementation to AI is bad in itself. Karpathy makes the same point: an agent can remember the exact names in a tensor API, but you should understand basic concepts like storage, view, and copy[^karpathy-talk].

What matters is what you hand off.

- **Fine to delegate:** API names and options, repetitive boilerplate, searching docs, formatting, implementation details that are easy to verify
- **Must understand yourself:** the product's purpose, the spec, system invariants, the threat model, important design trade-offs, failure modes and rollback, and the criteria for judging whether a result is right

Forgetting an API name is fine. Not being able to explain why you chose a structure and where it fails is dangerous. I'm not saying someone has to read every line of code. But for any high-impact change, at least one person should be able to explain it, predict how far it will spread, and recover when it breaks.

## Docs before code

A lot of tools now have you write docs and specs before code. Like the long-standing practice of document-driven development, you first write down what you're building and why, then implement against that document.

GitHub's Spec Kit says to settle the what and why before the how[^spec-kit]. OpenSpec similarly records, for each change, why it's being made, the requirements and scenarios, the design, and a task list[^openspec].

This fits the problem I've been describing. Decisions live in documents in the repo instead of only inside prompts, so later, a person or an agent can read the same documents and see why things were built the way they were. It effectively builds the work of pulling scattered context back together into the development process.

The same trap is here too, though. The OpenSpec README says, "Your AI writes these; you review the plan before any code is written"[^openspec]. So the AI writes the spec as well, and people only review it. If people skim the spec and move on, the thing getting waved through just shifts from code to spec docs, and the cognitive debt in the team's understanding stays exactly where it was. The code also keeps changing while the spec sits still, so the two can drift apart. For a spec to actually hold understanding, shouldn't people at least write the purpose, invariants, and success criteria themselves, or be able to explain them on their own?

## How do you know you understood?

Not by counting the sources piled up in a wiki or the tokens an agent used. Look at these instead:

- **Explanation:** whether you can actually explain it and debug it, regardless of whether you feel you "get it"
- **Prediction:** how well you can guess, before a change, which modules, tests, and behaviors it will affect
- **Recovery:** whether you can find the cause of a failure and roll back safely without the agent that wrote the code

While writing this post, rather than just rereading the material I'd collected, I checked what the strongest counterargument was, whether the sources I cite actually support my claims, which assumptions break when the idea moves to another field, and whether I could explain the core points without looking at the draft. The collected material was input to my judgment, not the judgment itself.

In software work, a simple place to start is predicting the blast radius and failure modes before you look at the agent's answer. Whether habits like this actually reduce cognitive debt would need its own experiment, but at least they let you test the assumption that "the code runs, so I understand it well enough."

## Is a one-page report enough?

Back to the question I started with: how do I keep what agents produce in sync with what's in my head?

My first idea was a one-page report. When I worked at Samsung Security Center, there was always a separate document for executives, apart from the detailed vulnerability report. It was always one page, with almost no technical detail. As someone doing the hands-on work, I honestly had plenty of complaints about it: "Once you've cut out this much context, what's the point?"

Looking back, that document wasn't short for lack of information. An organization already has too much information, and if people spend their energy reading and interpreting all of it, the decisions that matter get delayed. The one-page report let the person who had to decide spend their energy on deciding instead of on reading and interpreting every detail. It showed the current state at a glance and let you drill down into the details if you wanted.

Wouldn't getting a whole day of an agent's output in that form cut the cost of loading it into my head a lot? On second thought, what it really cuts is the cost of making a decision. A decision is finished the moment you read the report. A sync has to still be in my head next week, when I run into a similar problem.

Cranor's human-in-the-loop framework breaks the path from a security message reaching a person to that person acting on it into stages: noticing the message, understanding it, remembering it when it's needed, and applying it to a new situation[^cranor]. A one-page report and a drill-down view help with the first two. The last two, remembering and applying, need their own attention.

## Syncing with my brain

That raises the question of how anything stays in a person's memory at all. It's a rat study, but Tse et al.'s experiment shows that new information settles faster when it attaches to a framework (a schema) you already have[^tse-schemas].

Learning research is more direct about what makes memories stick. In Dunlosky et al.'s review of 10 learning techniques, the ones with the clearest benefit were practice testing (recalling things yourself, as on a test) and spaced practice (spreading practice out over time). Rereading and underlining were less effective[^dunlosky]. In Roediger and Karpicke's experiment, students who reread a passage several times did better on a test 5 minutes later. But 2 days or a week later, students who read it and then practiced recalling it remembered much more, even though the rereaders felt more confident[^roediger-karpicke]. Predicting before you see the answer also helps. Citing early evidence, Brod's review suggests that the surprise of a wrong prediction makes you pay more attention to the right answer and fixes it more firmly in memory[^brod].

Reading an AI-written summary seems a lot like rereading. While you read, you feel like you know it all, but that feeling doesn't mean you'll remember it a week later. So when I sync with agents, I'm going to try these instead of reading summaries:

- **Predict first:** before looking at the result, write down what changed and where it might break. The same prediction I described as a way to check understanding becomes a way to build memory here.
- **Recall:** instead of rereading the summary, quiz myself with the answers hidden and see what I actually remember.
- **Space it out:** don't look once and move on. Ask myself again a few days later and a few weeks later.
- **Connect it to what I know:** look at new results alongside past decisions or similar past incidents.

## Putting myself in the loop

So what am I actually doing about this today? In [the post about what remains after a long session](/posts/growing-system-not-model/), I described a self-improving loop: pick out verified experience, build it into the system, and let the system get better on its own. cortex, the personal knowledge management tool I introduced [in the post about skills](/posts/a-skill-is-a-prompt-with-an-eval/), has a loop like that too. But when I go back over sessions, I see my mistakes as often as the agent's. I was the one who gave a vague goal or left out context it needed.

So what I want from cortex isn't a self-evolving loop where only the agent improves. I want a loop with me inside it: a self-improvement loop where I look at how my prompts went wrong and fix that in the next session. Here's what I've built and use today:

- **Session recap:** pulls sessions from several coding agents (Copilot, Claude Code, Codex) into one place. When I end a session, it records what I did, what I decided, and what's next; when I start a new one, it feeds that record in as a briefing.
- **Session retro:** finds blockers that keep coming up across recent sessions: places where tools kept failing, places where I told the agent to redo something or changed direction, sessions where I went around in circles for a long time. Having to tell the agent to redo something is also a sign that my first instruction wasn't good enough.
- **Weekly reflection:** once a week, I go over that week's sessions and look for what to fix in my own habits and prompting patterns. The tool fills in facts like short notes I left that week, threads I worked on, and blockers the session retros found, but I deliberately don't let AI write the reflection itself. If I hand that off, I skip the very thinking the reflection is supposed to produce.
- **Knowledge briefing:** collects RSS feeds and papers in security and AI, builds a daily trend briefing around topics I've listed as interests, and gives a daily summary of what's been added to the knowledge base.

Looking across many sessions also shows habits I can't see in any single one. I often kept one session going for days, and the context ballooned. So I set a baseline from the length of my past sessions and had the tool tell me to wrap up and start fresh when a session runs past it. What the loop fixed there wasn't the agent. It was my habit.

Getting a briefing every day, though, I started to wonder how this differs from reading security news through an RSS reader. The knowledge briefing does start from RSS feeds. It merges coverage of the same event into one item, ranks things by my interests, and attaches supporting quotes from the source. Still, if all I do is read it, it's not much more than a well-curated news clipping.

Thinking it over, the biggest difference seems to be less in the tool than in what I do with it. Skim the briefing and it's a news clipping. Read it, then try to recall it and connect it to my own work, and it becomes study. Session recaps and retros work the same way: if I just read them, they're no better than RSS.

The problem is that the will to do that is weaker than you'd expect. If something is convenient, you keep using it even when you don't understand it, and I doubt I'm any different.

## Putting information in vs. understanding

Could I skip the willpower and just load it straight into my head? Sync seems to go in two directions. Bringing the agent up to speed with me is relatively easy: put records of past sessions into the new session's context. Bringing me up to speed with the agent doesn't work that way. There's nowhere in my head to paste context.

So what if we just built a place to paste it? Something like Neuralink comes to mind: connect the brain directly, plug it in like an external hard drive, and the sync is done. Like the scene in The Matrix where a program gets loaded into Neo's head and he immediately says, "I know kung fu." Of course, writing knowledge into the brain is still a long way off.

But even if it became possible, would putting information in be the same as understanding it? Human memory isn't done the moment something is written into it.

The theory Naur described doesn't fully transfer through reading documents either. It forms when you build, fix, and fail yourself. Plugging in an external drive might add memory without giving you the judgment to use it. Or will there be a day when plugging in is enough to understand, too?

## Closing thoughts

I can delegate implementation details. I can live with my ability to type out code myself getting a bit rusty. But if you also hand off the team's shared theory, the thing that lets you explain purpose and risk and recover when something breaks, you end up with a system that runs fine and nobody who can take responsibility for it. However good the summary screen is, if you don't know the system's purpose and invariants, approving or rejecting is just a formality. In the end, how much thinking I do myself, and what I split with AI, seems to come down to who holds this understanding.

## Key takeaways

- Even when AI-written code works, if no one can explain why it was built that way, cognitive debt builds up in the team's understanding. With the same AI, what made the difference was whether people tried to understand.
- You can delegate API names and repetitive implementation, but you need to understand the purpose, spec, invariants, and risks yourself. Check your understanding by whether you can explain, predict, and recover.
- An agent syncs once you put past records into its context, but a person doesn't retain much from reading a summary. It sticks when you predict first, recall it yourself, and come back to it after some time has passed.

## Update (October 2026)

Earlier I said that, apart from METR's experiment, most of these studies involve students or junior developers learning something unfamiliar, so there's little evidence on experienced people working on things they already know. In October, an example from the experienced side came along. It's one person's experience, not a study, and no one timed it the way METR did. In METR's experiment, experienced developers got slower with AI; this time, an experienced developer says he used an LLM to solve a problem that three earlier attempts hadn't.

Linus Torvalds published, in his git tree, a series of 10 Linux kernel patches he made with help from an LLM[^torvalds-refcount]. The patches deal with what happens when many CPUs read the same file at once. Every read bumps the page's reference count up and down, and all the CPUs end up fighting over that one value. Torvalds wrote his own first draft of a fix in 2024 and kept using that incomplete version on his own machine for a year and a half, until other people pointed out its problems. Two other developers tried to fix it after that, and both attempts still had problems. One of the big topics at this year's kernel maintainer summit was using LLMs in kernel development, so this time, he says, he decided to actually solve the problem with an LLM.

In an artificial benchmark, reads per second went up about 23 times. He said himself that the effect under real load will be much smaller[^torvalds-refcount].

At the same summit, the maintainers agreed to drop the rule that anyone using AI tools should say so with an Assisted-by tag in the commit message[^register-assisted-by]. Some developers objected, and Torvalds replied: "The kind of expectations *I* have is that people do their best and I expect people to understand what they are doing. But that understanding has very little to do with what tools they use."

Torvalds's point is the same one this post was trying to make. But his patches came from someone using an LLM on a problem he had been dealing with himself for over two years, knowing why the earlier attempts didn't work. The understanding came first, and the LLM came after. When people use the tool before they understand, I think the studies above are still closer to what happens.

## References

* References
{:footnotes}

[^karpathy-talk]: [Andrej Karpathy, From Vibe Coding to Agentic Engineering (Sequoia AI Ascent 2026)](https://www.youtube.com/watch?v=96jN2OCOfLs)
[^llm-wiki]: [Andrej Karpathy, LLM Wiki Pattern (2026-04-04)](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
[^storey-cognitive-debt]: [Margaret-Anne Storey, How Generative and Agentic AI Shift Concern from Technical Debt to Cognitive Debt (2026-02-09)](https://margaretstorey.com/blog/2026/02/09/cognitive-debt/)
[^naur]: [Peter Naur, Programming as Theory Building (Microprocessing and Microprogramming, 1985)](https://doi.org/10.1016/0165-6074(85)90032-8)
[^vaithilingam]: [Vaithilingam et al., Expectation vs. Experience: Evaluating the Usability of Code Generation Tools Powered by Large Language Models (CHI 2022 Late-Breaking Work)](https://doi.org/10.1145/3491101.3519665)
[^metr]: [Becker et al., Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity (METR, 2025)](https://arxiv.org/abs/2507.09089)
[^anthropic-skills]: [Anthropic, How AI Assistance Impacts the Formation of Coding Skills (2026-01-29)](https://www.anthropic.com/research/AI-assistance-coding-skills)
[^sankaranarayanan]: [Sankaranarayanan, Mitigating "Epistemic Debt" in Generative AI-Scaffolded Novice Programming using Metacognitive Scripts (2026)](https://arxiv.org/abs/2602.20206)
[^spec-kit]: [GitHub, Spec Kit](https://github.com/github/spec-kit)
[^openspec]: [Fission AI, OpenSpec](https://github.com/Fission-AI/OpenSpec)
[^cranor]: [Lorrie Faith Cranor, A Framework for Reasoning About the Human in the Loop (UPSEC 2008)](https://www.usenix.org/legacy/events/upsec08/tech/full_papers/cranor/cranor.pdf)
[^tse-schemas]: [Tse et al., Schemas and Memory Consolidation (Science, 2007)](https://doi.org/10.1126/science.1135935)
[^dunlosky]: [Dunlosky et al., Improving Students' Learning With Effective Learning Techniques (Psychological Science in the Public Interest, 2013)](https://doi.org/10.1177/1529100612453266)
[^roediger-karpicke]: [Roediger & Karpicke, Test-Enhanced Learning (Psychological Science, 2006)](https://doi.org/10.1111/j.1467-9280.2006.01693.x)
[^brod]: [Brod, Predicting as a Learning Strategy (Psychonomic Bulletin & Review, 2021)](https://doi.org/10.3758/s13423-021-01904-1)
[^torvalds-refcount]: [Linus Torvalds, Improve Page Refcount Scalability (Linux kernel mailing list, 2026-10-13)](https://lwn.net/ml/all/CAHk-=wjLjgfwgSZ1RDk4YdNFcV0ntosMO5AmBoHD76Zb3HFY7Q@mail.gmail.com/)
[^register-assisted-by]: [The Register, Linux Kernel Devs Drop Obligatory Confession of AI Tool Usage (2026-10-14)](https://www.theregister.com/ai-and-ml/2026/10/14/linux-kernel-devs-drop-obligatory-confession-of-ai-tool-usage/5303140)
