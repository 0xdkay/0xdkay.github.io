---
title: "Turning Prompts into Skills You Can Stack Like Blocks"
date: 2026-06-01 09:00:00 -0400
categories: [Blog]
tags: [ai, agents, skills, context-engineering, evaluation]
lang: en
ai_translated: true
translation_key: a-skill-is-a-prompt-with-an-eval
description: "Somewhere around the third time I paste the same prompt, I want to make it a skill. When to do that, what goes inside a skill, how to evaluate skills stacked like blocks and the seams between them, and which model to grade with."
image:
  path: /assets/img/posts/a-skill-is-a-prompt-with-an-eval.webp
  alt: "AI-generated illustration: prompts becoming skill blocks that pass through block, seam, and system evals in turn"
---

Somewhere around the third time I copy and paste the same prompt, I start wondering whether I should just make it a skill. In [my last post](/posts/growing-system-not-model/), I said that when a session ends, you should pick out the failures, decisions, knowledge, and skills worth keeping. A skill, in that list, is a procedure you'll repeat next time plus a way to check it. But should every prompt I reuse become a skill?

Not necessarily. When I'm still exploring and don't know exactly what the problem is, a one-off prompt is faster and costs less. Locking down an interface and an eval at that stage just means living with the wrong abstraction for a long time. It's the same point I made last time: something that worked once shouldn't go straight into memory.

The picture changes once the same task really does repeat and I can tell success from failure. That leaves three questions: when should a prompt become a skill, what goes inside it, and how do I know the skill actually works?

## When to make a skill

It's worth making one when several of these hold:

- The same kind of task really does repeat.
- The input and expected output have a fairly stable shape.
- You can separate success from failure with criteria you can check.
- You can draw clear boundaries around the tools and permissions it uses.
- Fixing things by hand every time is expensive, or failure is.

What you're weighing comes down to this inequality:

> Cost of making and maintaining the skill < Accumulated cost of repeating, fixing, and failing with the prompt

"Make it after the third use" is a fine starting point, but a count can't be the only criterion. A task can repeat ten times and still be hard to pin down as a skill if it hinges on human taste or its success criteria keep moving.

## A one-line prompt vs. a skill

Say I'm building a skill that reviews technical blog posts. The simplest prompt looks like this:

> Review this post and tell me what to improve.

That's enough for one use. To reuse it, you need to decide at least the following:

- **Goal:** Reduce factual errors and reader misunderstandings while keeping the core claim.
- **Input/Output:** It takes the draft, the list of sources, and who the post is for, because the same sentence trips up different readers in different places. It returns the problem passages, why each is a problem, and a suggested fix.
- **Tools/Permissions:** It reads only the allowed sources and never edits the post itself. It only suggests fixes.
- **Invariant:** It never adds unverified facts, and never makes up experiences for the author.
- **Stop/Escalation:** It stops when there are no significant problems, and asks a person when sources conflict.
- **Eval/Version:** It's evaluated on whether citations are actually supported, whether the core claim survives, and whether a non-expert can follow the post, and those criteria are versioned.

This list isn't there to make the document look thorough. It's where you decide whether to keep running when the input format changes, whether to quietly pick a side when sources conflict, and whether results stay comparable to earlier runs after the eval criteria change. If you only pass the prompt around, those boundaries live in someone's head. Turning a prompt into a skill means carrying over the interface and the verification method, not just the prompt text.

Output format works the same way. It isn't about looking nice. It's a contract that keeps meaning from getting lost between steps.

## What goes inside a skill

A skill doesn't have to do everything through written instructions. It can tell the agent to run a script you wrote separately, hand a particular step to a subagent, or include a whole workflow that runs several steps in a fixed order.

Here's how that plays out for the review skill:

- Checking whether links are alive, and whether a quoted sentence actually appears in the source, is done by running a **script** I wrote separately. Asking a model to do work that should give the same answer every time is expensive, and the results are all over the place.
- The non-expert review goes to a **subagent**. A model that has already heard all about the author's intent in earlier steps has a hard time noticing where the post gets difficult. A model that gets only the post, with no context, is better at finding where a reader gets stuck.
- Parts with a fixed order, like evidence check -> non-expert review -> compiling the fixes, are written down as a **workflow**, so the model doesn't re-decide the order every time.

Splitting it this way also makes evaluation easier. The parts that became scripts can be checked with ordinary tests, and you only need LLM grading where real judgment is involved.

## When skills pile up, picking one is work too

Make skills one or two at a time and you quickly end up with dozens, then hundreds. At that point, choosing which skill to use and when becomes its own problem. In the Agent Skills approach Anthropic described, the agent starts by reading only the name and short description of every installed skill, and opens the full body only for the skills it decides fit the current task[^anthropic-agent-skills]. With a handful of skills, that's enough. With hundreds, just reading the descriptions eats a fair amount of context, and skills with similar descriptions get confused with each other, so it's easy to pick the wrong one or miss the one you needed.

The first fix is to write good descriptions. I have a knowledge management tool I built for myself, called cortex because it's sort of a brain. In cortex, each skill description says not only when to use the skill but also when not to. The skill that finds past work sessions notes that it isn't knowledge base search, and the skill that gets several models to debate says not to use it for questions a test can answer. Still, once there are a lot of skills, descriptions alone won't be enough, and I think you'll need a step that narrows down the candidates before the model picks:

1. **Hard filter:** First filter on clear-cut conditions like activation keywords, file type, repository, and task stage. For example, if the request doesn't contain "review" or "PR", the review skill isn't a candidate. This is cheap and always gives the same result, but it misses anything phrased even slightly differently.
2. **Cheap model or search:** From what's left, pick a few skills close to the current request. This catches different phrasing, but it can be wrong too.
3. **Main model:** Read the descriptions of the shortlisted candidates and pick the skill to actually use.

## Good blocks don't add up to a good system

Think of each skill as a block. Like stacking Lego, you can chain several skills into a workflow, and as I mentioned, you can put that workflow back inside a single skill. Writing a post, for example, can be split into seven blocks: collecting material, verifying evidence, structuring the argument, drafting, expert review, non-expert review, and a one-page summary. Chain them in order and you get one bigger skill called "writing." It's convenient, because you can fix each block on its own and reuse it elsewhere.

The catch is that more blocks means more places to fail. Assume, simply, that each block independently succeeds 95% of the time and all of them must succeed. Then the seven blocks above give you about a 70% overall success rate. Real failures aren't independent, so this isn't a prediction, but it shows the direction: failures pile up as you add blocks.

The connections between blocks are failure points too, not just the blocks themselves. In this post I call those connections seams. Say the material-collection block passes along only a URL and a summary, and drops which part of the source the claim came from. The next block, evidence verification, now can't check the citation. Both blocks passed their own tests, and the connected system has already failed.

That's why it helps to split evaluation into three layers:

1. **Block eval:** Does a single skill do what it promised? Look at output format, accuracy, cost, and failures on edge cases.
2. **Seam eval:** When work moves to the next step, do sources, uncertainty, and assumptions come through intact? Check not just that the format matches, but that the earlier step actually guaranteed what the next step assumes. What happens on failure should also be decided up front: retry, take another path, or hand off to a person.
3. **System eval:** Did the whole thing achieve its real goal? Look at end-to-end success rate, cost, how often a person had to step in, whether it can be rolled back, and failures that made it all the way to production.

Skill picking belongs here too, since the link between a request and a skill is also a seam. If the wrong skill gets called, the goal fails no matter how well that skill does its own job. Block eval won't catch it; seam or system eval will. So you label a few dozen real requests with the right answer ("this request should use this skill") and count two cases separately: a skill that should have been called but wasn't, and a skill that was called but shouldn't have been. Then you can rerun it every time you change a filter or a skill description.

I've seen someone actually work this way: building skills as blocks, chaining them into workflows, and running evals on them. One colleague who works closely with our team works in an almost entirely AI-native way. I watched how they worked up close while we were building MDASH[^microsoft-mdash], the AI vulnerability detection and remediation system our team built, and a lot of the thinking in this post and the last one took shape in conversations with them. If you want to see this in practice, amplihack-rs, which they've open-sourced, is a good place to look. It's a workflow framework for coding agents. As of October 2026, the repository has over 200 SKILL.md files alone, plus plenty of eval-related files[^amplihack-rs].

## Can I just leave the grading to another model?

In my last post I said verification has to happen outside the model. What about handing the grading to a different model? For problems without a single right answer, like writing or design, reviews from several models really are useful. But adding models isn't the same as adding independent checks.

Apple's Correlated LLM Evaluation Panels study took 9 judge models from 7 model families and had them grade natural language inference (NLI) tasks and a pairwise preference task. The information those 9 judges produced was worth only about 2.0 to 2.5 independent judgments[^apple-correlated-judges]. In other words, the models tended to get the same items wrong together. The result is limited to the tasks they tested, and the study doesn't establish whether shared training data is the cause.

So I put checks that fail differently from models first: unit tests and property tests, parsers and type checkers, actually running the code, explicit invariants, and holdout sets a person built separately. When I do use model reviews, I check whether each point holds up against the source and the logic, not whether "several models agreed."

For LLM grading, I think the first thing that matters is what you ask. Ask for a single score like "Is this post good?" and you can't tell why the score came out the way it did. Break the eval criteria from earlier into questions that can be answered by pointing at evidence, like "Does this quote actually support the claim?" or "Did the core claim change?", so a person can check the result afterward.

Grading models have their own habits. The LLM-as-a-Judge study reported that LLM judges are swayed by the order answers appear in, their length, and whether an answer is their own[^llm-as-a-judge], and another study found that LLMs tend to recognize their own writing and score it higher[^self-preference]. That's why you shouldn't let the model that wrote the text grade it.

## Which model should do the grading?

Grading has to be rerun every time the skill changes, so the cost adds up fast. So is it better to run a cheap model a lot, or an expensive model a little? MDASH, which I mentioned earlier, splits models by stage: frontier models for the hard reasoning, cheap distilled models for the high-volume debate stage, and another frontier model as an independent check[^microsoft-mdash].

I ran into the same tradeoff myself. Cortex has a step where one model checks whether the claims another model pulled from a text are backed by the source. That's a kind of grading, so I compared a few models for it.

The most expensive frontier model was too strict. It rejected about twice as many claims as a mid-tier model from a different company than the one whose model extracted the claims, and some of what it threw out was properly supported. At the other extreme, a model from the same company as the extractor rejected only 14% of the claims, which made it basically a rubber stamp. The mid-tier model was both more accurate and cheaper. After I refined the grading prompt and ran the comparison again, the frontier model stopped over-rejecting too. With the frontier and mid-tier models now giving the same results, I kept the cheap mid-tier model. The sample was small, though, so the results could differ on harder problems.

So I think the right move is to pick a grading model by comparing candidates on a small set where you already know the right answers. If a cheap one is accurate enough, run it broadly and escalate only the ambiguous cases to an expensive model or a person.

## Closing thoughts

I don't think the value of a skill is in storing a long prompt. It's in separating what can be repeated from what needs fresh judgment every time, and in letting you trace which block or seam a failure came from. A skill you can't evaluate or maintain is less a reusable capability than an abstraction that will cause trouble later.

## Key takeaways

- Make a skill when the input and output are stable and success is measurable, and carry over the permissions, stop conditions, and eval criteria along with the prompt.
- When skills pile up, narrow the candidates before picking one, and evaluate chained skills in three layers: block, seam, and system.
- Adding more model graders doesn't add independent verification in proportion, so put tests first, and choose a grading model by comparing candidates on a small set where you know the right answers.

## References

* References
{:footnotes}

[^anthropic-agent-skills]: [Anthropic, Equipping agents for the real world with Agent Skills (2025-10-16)](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
[^microsoft-mdash]: [Microsoft, Defense at AI speed: Microsoft's new multi-model agentic security system tops leading industry benchmark (2026-05-12)](https://www.microsoft.com/en-us/security/blog/2026/05/12/defense-at-ai-speed-microsofts-new-multi-model-agentic-security-system-tops-leading-industry-benchmark/)
[^amplihack-rs]: [rysweet, amplihack-rs](https://github.com/rysweet/amplihack-rs)
[^apple-correlated-judges]: [Apple, Nine Judges, Two Effective Votes: Correlated Errors Undermine LLM Evaluation Panels (2026-06-23)](https://machinelearning.apple.com/research/correlated-llm-evaluation-panels)
[^llm-as-a-judge]: [Zheng et al., Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (arXiv, 2023-06)](https://arxiv.org/abs/2306.05685)
[^self-preference]: [Panickssery et al., LLM Evaluators Recognize and Favor Their Own Generations (arXiv, 2024-04)](https://arxiv.org/abs/2404.13076)
