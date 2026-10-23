---
title: "When I Hand Work to an Agent, Who Makes the Judgment Calls?"
date: 2026-06-03 09:00:00 -0400
last_modified_at: 2026-10-18 09:00:00 -0400
categories: [Blog]
tags: [ai, agents, evaluation, human-in-the-loop, code-review, security]
topics: [ai-security]
lang: en
ai_translated: true
translation_key: agent-delegation-and-code-review
description: "However carefully you write down what you want, it's hard for the person you hand the work to to follow your thinking 100%. Agents are no different. Here's what needs to be aligned up front, who should review the code an agent writes, how much to automate, and who owns the judgment that's still left after you automate."
image:
  path: /assets/img/posts/agent-delegation-and-code-review.webp
  alt: "AI-generated illustration: delegated work passing through mechanical checks, semantic review, and a threat model, then arriving at an empty judgment seat in front of the policy"
---

Working in a lab or at a company, I've come to feel that a professor, manager, or boss handing work to us isn't much different from us handing work to an agent. However detailed their list of what they want, it's hard to follow what's in their head 100%. I run into the same problem when I hand work to an agent.

Take one file. "Improve this code" and "reduce duplication without changing behavior" give the agent completely different room to change things. So beyond writing things down in detail, what else needs to be aligned? Agents now write far more code than people do, so who should look at that code, and how closely? And once checks and even approval are automated, who is actually making the judgment calls?

## What to align before delegating

Think about when someone gives you work. Some things need to be aligned before the request itself.

- **Goal:** What counts as success, and which trade-offs are acceptable. This is where "improve" and "keep behavior + remove duplication" part ways.
- **Knowledge:** A model knows a lot in general, but it doesn't know the current state of the repository, the team's recent decisions, or the context of this particular incident. You have to give it that.
- **Preference and judgment:** Standards that carry across many tasks, like design principles, testing criteria, and how much risk you're willing to take.
- **Capability record:** What it actually did well and what it missed on this kind of task. It might write good code but drop part of the requirements, or gather material quickly but not tell a strong source from a weak one. When the model changes, you have to build this record again.

Put all four into one prompt and long-standing preferences get mixed up with instructions meant only for this task. So it's better to keep what lasts across many tasks (preference and judgment, organizational knowledge like team decisions that stay in force, the capability record) separate from what applies only to this task (the goal, and current context like the state of the repository or this incident).

The hard one is the third: preference and judgment. As I said at the start, no list is long enough to capture it. This kind of implicit judgment shows up better in what was actually allowed and what was rolled back.

So instead of piling on rules, I give counterexamples and feedback. Rather than adding yet another rule like "always keep it short," I show an example that got shorter but still kept the counterarguments and evidence. The goal isn't to copy what's in someone's head. It's to reduce the uncertainty that comes with delegating.

This isn't a one-way street. The agent also has to say what it based its judgment on, where its confidence is low, what it actually ran, and why it needs a person's judgment right now (escalation).

Attaching explanations doesn't by itself make people rely on the system appropriately, though. In the hotel review classification experiment in Appropriate Reliance on AI Advice, explanations raised how often people accepted correct AI advice, but didn't significantly raise how often they rejected wrong advice[^appropriate-reliance]. It was a limited task, but it's a sign you can't stop at "we showed an explanation, so we're fine."

## So who should do code review?

Bring this delegation problem to code review and a question comes up. In a secure development process (SDL), should people keep reviewing all the code? And if an agent misses something, who should catch it?

As far as I can tell, there's no settled answer yet. NIST SP 800-218A supplements secure development practices for developing and integrating AI models. It treats AI-generated and human-written code the same and holds that all code should be evaluated before use, but it doesn't say who reviews it or how deeply[^nist-800-218a]. For now, each organization has to design that part itself.

When agents produce far more code than people, you can't read every change at the same depth. So teams often add a step where "a person looks at it at the end." That's reassuring, but having a person in the loop doesn't mean a critical review actually happened. Plausible-looking AI code and large diffs can even make human review looser.

Do Users Write More Insecure Code with AI Assistants? speaks to this worry. 47 people (mostly university students) solved short security problems across five tasks. The group with access to AI gave insecure answers more often on four of the five tasks, and was also more likely to believe its code was secure[^insecure-code-ai]. The study isn't about code review itself, so you can't generalize it to all of today's real-world review. Still, it's worth remembering that the quality of the output and people's confidence in it can drift apart.

So instead of "Did a person look at it?", these questions are more useful:

- What failures was the review designed to find?
- Was there enough evidence and time to find errors?
- Was rejecting and fixing easier than approving?
- Was some other check covering what people would miss?

## Splitting up the review

"Code review" is one term covering several different questions: whether the syntax is right, whether the behavior is right, whether the security patterns are okay, whether the design makes sense, whether all the requirements are met, and whether to accept this risk. Rather than handing all of that to one reviewer, it's better to split it up by type of failure.

- **Mechanical checks:** compiler, type checker, tests, static analysis (SAST), dependency vulnerability analysis (SCA), fuzzing. These check fixed rules and runtime errors, over and over.
- **Semantic review:** A strong model or a domain expert reads the relationships across files and the design trade-offs.
- **Checking against the spec and threat model:** Compares against an external standard to find omissions that leave no trace in the code.
- **Human judgment:** Covers things whose answer isn't in the code: business context, user impact, legal obligations, and risk acceptance.

The third item, checking against the spec and the threat model, is there because of the question I asked earlier: if an agent leaves something out, who catches it? Review usually means reading the changed code, the diff. But code that was left out entirely never shows up in the diff. For example, if an admin feature has an authorization check that was implemented wrong, a reviewer can spot that line in the diff. If the check was never added, there's no line to look at. You only notice that kind of gap if you go in knowing "there should be an authorization check here." So I write down ahead of time, as statements that can be checked, what the requirements and threat model say must hold, and compare the code against that list:

- Every admin action must have an authorization check.
- External input must be normalized before being used as a file path.
- Secrets must not show up in logs.
- A failed payment must not be processed twice when retried.

## Strong models and small models

One idea is to set up review as a debate between several models. Our team's MDASH works this way. When a candidate vulnerability comes up, debater agents argue for and against whether it's really reachable and really exploitable. The strongest model does the heavy reasoning, cheaper distilled models handle the high-volume debate, and one more strong model is added to give an independent dissenting opinion. Disagreement between models is itself used as a signal[^mdash].

In MDASH, the small models are mainly there to cut cost. I wanted to use them a bit differently. cortex, the personal knowledge management tool I built for myself and mentioned briefly in [my last post](/posts/a-skill-is-a-prompt-with-an-eval/), can run a review as two separate panels. The strong-model panel reads deeply, like an expert. The small-model panel takes a second look with fresh eyes, the unbiased eyes of someone seeing it for the first time: it asks naive questions and scans broadly for confusing explanations or obvious bugs. The two panels' results aren't merged; they're written up separately so you can see side by side whether the fresh eyes caught something the experts missed, or the other way around.

The same setup could carry over to code review. It sounds reasonable, but I see it as a setup to test, not an answer yet. If the small model only repeats the strong model's errors, it just adds cost. If it finds simple missing requirements that the strong model overlooked while focused on complex code, it clearly earns a role.

To test this, you can build PRs that mix bugs from wrongly added code (commission) with bugs from missing handling (omission), then compare review by a single strong model against review by the two models combined. I'd measure recall and false positives per defect type, defects found by only one side, how often both models are wrong together (error correlation), and review time. The point isn't to rank the models. It's to see how well they divide up catching different failures.

## How much to hand over to automation

Once you've decided who reviews, the next question is how much the agent gets to run on its own. You don't have to set that scope all at once; you can widen it step by step: read only, recommend, run only actions a person approved, run automatically within a limited scope, and run autonomously under conditions. The criteria are whether the action can be rolled back and how far the damage spreads if it fails (blast radius). For work with a small blast radius that's easy to roll back, like doc or comment edits, or mechanical changes well covered by golden tests, it's fine to automate more.

Judging whether something can be rolled back is trickier than it sounds, though. Take respond actions in security, like locking an account or isolating a system after detecting an attack. These don't just change the system's state; they also tell the attacker "we see you." You can unlock the account, but you can't roll back the fact that they know they've been caught. So these actions need stronger evidence and approval.

The agent itself is an attack surface, too. The logs, issues, and docs it reads can contain text an attacker planted, so that text must never be treated as instructions. Keep observed data apart from instructions, and read permissions apart from write permissions. High-impact actions need least privilege, independent verification, a canary that applies to a subset of targets first, rollback, and rate limits.

Changes that are hard to hand over to automation go to a person:

- Changes that touch security boundaries like authentication, authorization, cryptography, and payments
- Cases where mechanical checks or spec comparison flag a violation
- Cases where reviewers reach different conclusions
- Patterns never seen before, or changes that are hard to roll back
- Cases where a failure would cause widespread damage

When you do escalate, don't ask the person to "please look at the whole thing again." Narrow the question: "Will we accept this risk?", "Does the spec match what we actually intend?", "If it fails, how far does it spread?" The idea isn't to make people the final checkbox on every line. It's to spend their time, as in the split above, on judgments whose answer isn't in the code.

Narrow the question all the way and only one is left: "Apply this patch?" The screen gets very short too. For example, if a security tool's agent found a crash in a developer's code and made a patch, that developer would see just this:

```text
[ok] crashing input reproduced
[ok] bounds check added
[ok] existing tests passed

[Accept] [Edit] [Ignore]
```

Existing security tools usually give feedback like "This code is CWE-XXX," "This is a security risk," or "Read this document." That kind of feedback often doesn't land, not because developers don't know security, but because the explanation breaks their flow. People also tend to get defensive the moment they're handed an explanation. A screen like the one above leaves little to argue about and doesn't push an interpretation on anyone.

When I first came up with this structure, my principle was: show the developer only facts, with no interpretation (fact-only). The system makes the judgment, and the developer only chooses whether to apply it, apply it with edits, or skip it for now.

## But did the judgment really go away?

At this point I thought it was a pretty clean principle. Reading it again, I started to doubt that human judgment had really gone away.

Statements like "crash on this input" or "tests passed" are closer to evidence than interpretation. But why this crash is shown and not other failures, which set of tests was considered enough, and who drew the line between a bug and acceptable behavior: all of that is already judgment. The same goes for what I handed to mechanical checks earlier. Removing the explanation doesn't remove the interpretation; it just moves it into policies and pipelines where you can't see it.

So I think "fact-first" is a more accurate term than "fact-only." Show the observable evidence first, along with confidence and what the check covered, and when needed, let people drill down to the reasoning, the raw source, and even who set the policy and which version it is.

So who is making those judgments behind the policies and pipelines? Even after automation, there are still people making judgments. Whoever writes the rules decides what counts as risky. Whoever writes the tests decides how much checking is enough. The platform team decides which actions to allow, and the risk owner decides which exceptions to approve. So a policy should record who decided it and why, where it applies, which tests and thresholds it uses, its version and expiration date, and how to roll it back. The more judgment you take off the developer's plate, the more the accountability and records on the policy side matter.

## Accept, Edit, Ignore

Each click on Accept, Edit, or Ignore on that screen leaves a record, and that record is what you use to check whether the policy is right and to fix it.

Accept means taking the system's patch and evidence as they are. If the change is low risk and easy to roll back, it might even be a candidate for applying automatically.

Edit is important feedback. A record of a developer adding context or fixing a patch shows counterexamples the policy missed. Earlier I said examples beat rule lists, and a person's hand edits are exactly those examples. So don't look only at how accurate the automation is. Also look at what was wrongly passed and what was wrongly blocked, what happened after a person reversed the result (override), and whether changing the policy broke something elsewhere (regression).

Ignore shouldn't be free. Record a reason, an owner, and an expiration date, add extra review for high-risk exceptions, and check the outcome later. But if you just keep raising the cost, developers will route around the security path entirely. The goal isn't punishment. It's making exceptions temporary, visible, and reviewable later.

## How general should a policy be?

Seen this way, I think how you set the policy is the core of the whole thing. And the policy runs into trouble whether it's too general or too specific.

A policy that's too general works anywhere but doesn't know the context. I said earlier that changes touching security boundaries go to a person. Turn that directly into a rule, and in a project like an authentication service, where almost every change touches a security boundary, every change goes to a person. Meanwhile, in some projects a single ordinary-looking config file decides permissions, and a general rule can't recognize that risk.

A policy that's too specific fails the opposite way. Add an exception every time an Edit or Ignore comes up, and it fits the current code and team well, but it breaks when the code, the people, or the model change. Eventually it turns into a long list where nobody can explain why any given rule is there.

Just as I kept long-term preferences separate from this task's context when delegating, I'd split policy into layers too: principles shared across projects, project-specific parts like that project's threat model and invariants, and exceptions that apply only to this task. Then decide which layer something belongs in by looking at the examples as they build up. Counterexamples that repeat across projects move up to the shared principles, ones that repeat within one project move up to that project's policy, and a one-off exception gets an expiration date. Isn't finding the right balance, neither too general nor too specific, the job of whoever sets the policy?

## So who makes the judgment calls?

In real development, escalating to a person becomes a bottleneck of its own, more so when the policy is too general. The agent could move on to the next step right away, but work stops while it waits for a person to confirm. I think that from the moment we delegate work to agents, we also need to work out how to cut down how much a person has to keep judging. If we want an agent to keep heading in the right direction without someone checking every single step, my guess is we need to give it clearer goals and verification criteria from the start.

In the end, I don't think delegation is a setting you configure once and forget. It isn't when a professor or manager hands work to us, either. And as we saw above, judgment doesn't disappear even in the automated parts. What's left to choose is whether to leave that judgment somewhere invisible or bring it out into policies you can audit and screens you can verify. So the question I think we need to keep asking is this: who makes the judgment in our place, and who is responsible when that judgment is wrong?

## Key takeaways

- A rule list alone isn't enough when you hand work to an agent. Judgment gets aligned only as examples of what was actually allowed, edited, or rolled back build up.
- Set up code review so that mechanical checks, models, specs, and people each catch different failures. Decide how much to automate by whether the action can be rolled back and how far the damage spreads on failure, and have people judge "Will we accept this risk?" on high-risk changes.
- Automation doesn't make judgment go away; it moves it into policy. Policies need an owner, a rationale, and an expiration date, and they have to keep being refined from accumulated examples so they're neither too general nor too specific.

## Update (October 2026)

With human confirmation turning into a bottleneck, my sense is that the industry's attention is moving toward long-horizon tasks where an agent works alone for a long time without a person stepping in. In fact, OpenAI's harness engineering post already says it's common for a single Codex run to work on one task for more than 6 hours, often while people are asleep[^openai-harness].

That raises the question of how this should carry over to the whole development process. If you have one repo under development, how do you build the environment around it so that many people and many agents can collaborate and test together? Following that thread, I end up at DevOps.

Anthropic's recent post on redesigning source control looks like it's coming from the same place. According to the post, with merges passing 30,000 a day within a few months, the bottleneck is no longer writing code but development infrastructure built for human scale, like source control, builds, and CI. So instead of git, they built their own version control system, Scion[^anthropic-scion].

The post says the engineer's role changed too. Engineers still reviewed every change, but looked at its intent instead of reading every line, and spent a lot of time saying "no" when an agent tried to break the system's core constraints. Approval rules also separated comment-only changes from sensitive logic changes, so human reviewers could focus on the changes that matter most[^anthropic-scion]. That's close to what I described in this post: concentrating people's judgment on the risky changes.

People seem to be moving toward setting goals and verifying results rather than stepping in along the way. If verifying results gets handed to agents too, will people end up only as the input, the source of new ideas?

## References

* References
{:footnotes}

[^appropriate-reliance]: [Schemmer et al., Appropriate Reliance on AI Advice: Conceptualization and the Effect of Explanations (arXiv, 2023-02)](https://arxiv.org/abs/2302.02187)
[^nist-800-218a]: [NIST, SP 800-218A: Secure Software Development Practices for Generative AI and Dual-Use Foundation Models (2024-07-26)](https://csrc.nist.gov/pubs/sp/800/218/a/final)
[^insecure-code-ai]: [Perry et al., Do Users Write More Insecure Code with AI Assistants? (arXiv, 2022-11)](https://arxiv.org/abs/2211.03622)
[^mdash]: [Microsoft, Defense at AI speed: Microsoft's new multi-model agentic security system tops leading industry benchmark (2026-05-12)](https://www.microsoft.com/en-us/security/blog/2026/05/12/defense-at-ai-speed-microsofts-new-multi-model-agentic-security-system-tops-leading-industry-benchmark/)
[^openai-harness]: [OpenAI, Harness Engineering: Leveraging Codex in an Agent-First World (2026-02-11)](https://openai.com/index/harness-engineering/)
[^anthropic-scion]: [Anthropic, Redesigning Source Control at Anthropic (2026-10-13)](https://www.anthropic.com/engineering/redesigning-source-control)
