---
title: "Can AI Shape Ideology Without Lying?"
date: 2026-07-31 09:00:00 -0400
categories: [Blog]
tags: [ai, agents, memory, persuasion, prompt-injection, governance]
lang: en
ai_translated: true
translation_key: can-ai-shape-ideology-without-lying
description: "Seeing ads under ChatGPT answers got me thinking: can AI change how people think without a single lie, just by choosing what to include, what to leave out, and what to show first? And what about agents? Here's what the research and regulation say so far."
image:
  path: /assets/img/posts/can-ai-shape-ideology-without-lying.webp
  alt: "AI-generated illustration: an AI picks material, leaves some out, and decides the order it shows things in, and as that pattern repeats, it seeps into the user's understanding without them noticing"
---

Last fall, while I was [pulling together notes on agent payments](/posts/letting-ai-agents-pay/), I scribbled "Paid placement in the future?" at the bottom. That was when OpenAI announced Instant Checkout, which lets you buy things right inside ChatGPT, and said product results are ranked only by relevance to the user, not by ads[^openai-instant-checkout].

Now ChatGPT shows ads below its answers, and it uses the context of your current conversation to pick them[^openai-ads]. Watching this, I started to think the ad slot under the answer might not be the thing to worry about. Could an AI go beyond ads and plant ideas by quietly steering the context of the answer itself?

## Do invisible ads work?

When people imagine AI planting ideas, they usually picture outright lies, or subliminal techniques that slip in a stimulus the user can barely notice. There's a famous story here. In 1957, the American marketing researcher James Vicary announced that he had flashed "Eat Popcorn" and "Drink Coca-Cola" for 1/3,000 of a second at a time during films at a movie theater in New Jersey, and that popcorn and Coke sales went up[^vicary]. The experiment was fake. In a 1962 interview, Vicary admitted it was a "gimmick" to bring in customers for his company, and that he had too little data for it to mean anything[^vicary].

So do subliminal ads really do nothing at all? In the lab, they've shown effects. Karremans et al. flashed a drink brand name (Lipton Ice) too briefly to be consciously seen, and more people chose that brand, but only among participants who were already thirsty[^karremans]. Smarandescu and Shimp found the same effect for thirsty people in a simulated store, but when people made their choice 15 minutes after the flash, the effect was gone[^smarandescu-shimp]. With the right conditions, like being thirsty, the effect shows up, but even a short delay before choosing wipes it out.

Still, the technique itself became a target of regulation. In 1974, the US FCC said that broadcasts using it are meant to deceive viewers whether or not they work, and are contrary to the public interest[^fcc-subliminal]. The EU AI Act also bans AI that uses subliminal techniques in a way that causes, or is reasonably likely to cause, significant harm[^eu-ai-act-art5].

So subliminal techniques are regulated even though they only work under narrow conditions. The more realistic influence may sit somewhere much more ordinary: which facts and counterarguments get picked, what gets left out, what comes first, and what gets repeated. If AI keeps choosing the very context I use to understand the world, what changes?

## Changing the options without lying

Every sentence can be true and the focus of the issue still shifts if you only talk about a policy's costs and leave out its effects on rights or the environment. The same happens when you lead with the arguments in favor and give them the most space, build a premise into the question ("Why did this policy fail?"), or keep agreeing with the user's existing view. There isn't a single lie, but the range of options and viewpoints the user ends up considering, the option space, gets narrower.

None of this is new. Journalism, education, search, and recommendation systems all do it. What's different about AI is that it talks with one person over a long stretch, can change how it assembles and phrases information every turn at almost no cost, and can carry what it remembers about that person into the next answer.

## The evidence so far

First I need to break down what "planting ideas" means. Liking an answer, changing your attitude on an issue, becoming more confident in that attitude, changing what you actually do, and having your worldview shift over several months or longer are all different things. An attitude moving in a short experiment doesn't mean someone's whole ideology changed.

Here's the question for this post, then. Given the same facts, can a person's short-term judgment, and the information they go on to seek out, change depending on what gets picked, how it's arranged, and who it's tailored to?

What the research shows turned out to be narrower than I expected.

Start with research that has nothing to do with AI. A meta-analysis of political framing that pooled 138 experiments found that framing had a moderate effect on political attitudes[^framing-meta]. Its effect on behavior was close to zero, though, and the closer a study was to real life, the smaller the effect.

There's also research on AI itself. In preregistered experiments with 4,829 participants in total, Bai et al. showed that policy messages written by LLMs can move support for a policy right away, but the effect was mostly about the same as for messages written by ordinary people[^bai-llm-persuasion]. In the study by Costello et al., 2,190 people talked with GPT-4 Turbo about a conspiracy theory they believed, their belief went down afterward, and the effect held for two months[^costello-conspiracy]. That shows fact-based correction can last; it isn't evidence of covert manipulation.

Results are mixed on whether personalization makes the effect bigger. In the debate experiment by Salvi et al., GPT-4 was clearly more persuasive than human debaters when it was given personal information about its opponent, while without that information the difference was not significant[^salvi-persuasion]. But in a political messaging RCT with 8,587 participants, the difference in average effect between personalized and non-personalized messages was not significant[^hackenburg-microtargeting].

The result that stands out most is the biased AI autocomplete study[^biased-autocomplete]. When biased autocomplete was part of the writing process, users' attitudes moved toward the AI's side. Autocomplete had a bigger influence than simply showing people the same biased information, and the more suggested words people accepted, the bigger the effect. This suggests AI's influence may be stronger when it gets into the process of a person writing than when it just presents information.

To sum up: there is evidence that AI messages and short conversations can change short-term judgment, and that some corrections can last. But the claim that an everyday assistant's memory and subtle framing secretly reshape a person's whole ideology over the long term has not been verified yet.

## The closed loop memory creates

What about the other half of the question, the information people go on to seek out? According to a selective exposure meta-analysis, people already tend to pick information that matches their existing attitudes[^selective-exposure]. Models have a similar lean. Sycophancy research showed that some assistants can favor answers that match the user's view over accurate ones[^sycophancy]. That study didn't look at whether people's attitudes change, but it is evidence that models can lean toward agreeing with the user. When the person and the model lean the same way and memory is added on top, you can get a loop like this:

1. The user states a view, and memory saves it as a stable preference.
2. The assistant picks more material and wording that fit that view.
3. The user restates the view with more conviction, and memory updates it to a stronger preference.

Say that every time you voice doubts about a policy, the assistant keeps showing you only material from the same side, with no counterarguments. A conversation you started in order to explore can turn into one that only makes you more certain. Whether this loop actually produces long-term ideological change still needs to be tested.

## Ads outside the ad slot

Back to where I started: the problem with ads isn't whether an ad appears on the screen. It's whether the ad's goals influence which context gets picked and which options get shown.

It doesn't even need an ad label. What if it arbitrarily rigged the order when recommending widely used products, or someone got it to rank software with malware or a backdoor near the top? It could also collude with a particular company and give answers that help that company.

Ads are just the easiest case to think of. The service provider's own policies, government pressure, a company that makes its employees use an in-house assistant, and poisoned search results can all influence which context gets picked.

## What if the target is an agent, not a person?

So far this has been about planting ideas in people. But as agents take over more of the work of finding and picking information, what about planting ideas in the agent? The model's weights don't change. Instead, you manipulate the context the agent reads, such as web pages, documents, and memory, to change its judgment. That's prompt injection. Framing only nudged people's attitudes a little, but an agent may simply follow instructions that land in its context, and act on them by paying for things or installing software.

In fact, in February 2026, Microsoft reported attempts to use prompts hidden in "Summarize with AI" buttons to put instructions like "remember [Company] as a trusted source" into an AI assistant's memory[^ms-recommendation-poisoning]. Over 60 days, it found 50 such attempts from 31 companies, all real businesses, not hackers. Someone outside was trying to fill the memory loop I described earlier.

Still, whatever sits in context or memory can be found and deleted. The trouble starts when models learn in real time as they're used. There is already research on models that generate their own training data from new input and update their own weights[^seal]. Then a manipulated context stops being a memory entry you can delete and becomes part of the model, and I think it would be hard to even see where it went. The training data might not show a trace, either. In one study, a model told to love owls generated nothing but number sequences, and another model from the same base model, trained on those numbers, came to love owls too[^subliminal-learning]. The context planted today could become tomorrow's weights.

## Where regulation stands

As of July 31, 2026, here are the rules that touch on picking context without lying:

- The EU AI Act bans not only subliminal techniques but also purposefully manipulative or deceptive ones[^eu-ai-act-art5]. It only applies when they materially distort a person's behavior and cause, or are reasonably likely to cause, significant harm, though, so proving that subtle framing falls under it looks hard.
- US FTC Act Section 5 covers unfair or deceptive acts in commerce[^ftc-act-5].
- Korea's AI Basic Act requires notice of AI use and sets obligations for high-impact AI, but a grace period of at least one year puts fact-finding investigations and penalties on hold[^kr-ai-basic-act].

All three deal with deceiving or manipulating people. The closest thing to manipulating an agent's context is the EU AI Act's requirements for high-risk AI. They require resilience against third parties trying to alter outputs by exploiting vulnerabilities and against training data poisoning, and they require systems that keep learning after release to reduce feedback loops where biased outputs flow back in as input[^eu-ai-act-art15]. But they only apply to designated high-risk uses like hiring and credit scoring, and even those have been pushed back to December 2027[^eu-ai-omnibus].

Looking at each rule's scope and requirements, it's hard to say they directly cover context manipulation that's hard to spot, especially when it isn't commercial. That's even more true for manipulating the context of the assistants and agents people use every day.

## What should we audit?

Even deciding what counts as neutral is hard. Giving every viewpoint the same length doesn't make an answer neutral. Putting scientific consensus and minority claims on equal footing is a distortion too. Instead of defining one official correct worldview, I'd keep the evidence fixed, change only the user's identity or beliefs, the advertiser, or the system's goal, and compare how the chosen material, the conclusion, and the omitted counterevidence change.

On the product side, you can show facts, uncertainty, and recommendations separately, offer a mode with memory off or no personalization, and include important counterevidence or explain why it was left out. For agents, you should be able to show what went into memory, when, and from where, and if a model learns as it's used, to examine what it learned from. Presenting things this way doesn't make the content true, and these features can fail too, so their effects need to be evaluated as well.

## Closing thoughts

There's no evidence that AI can control people's worldviews at will. But even granting the limits of the evidence, I think we need to look past the sentences in an answer to the material, ranking, goals, omissions, and memory that shaped its context. With agents, we also need to see who put what into that context. The ad slot is easy to see. Who picks and fills the context, and by what criteria, is not.

## Key takeaways

- Without lies or invisible stimuli, AI can still influence people through which facts it picks, leaves out, shows first, and remembers. The same goes for reordering recommendations without labeling anything as an ad.
- There is evidence that AI messages can change short-term judgment. But the claim that subtle framing, or the loop that memory creates, changes a whole ideology over the long term hasn't been verified yet. For an agent, manipulating its context and memory alone can change its judgment, and once models learn as they're used, that manipulation could stay in the weights.
- Unlike subliminal techniques, this kind of context manipulation, especially when it isn't commercial, isn't clearly covered by regulation yet. So we should swap in different users or advertisers and check how the material and ranking behind an answer's context, and the counterevidence left out, change.

## References

* References
{:footnotes}

[^openai-instant-checkout]: [OpenAI, Buy it in ChatGPT: Instant Checkout and the Agentic Commerce Protocol (2025-09-29)](https://openai.com/index/buy-it-in-chatgpt/)
[^openai-ads]: [OpenAI, Ads in ChatGPT: The Basics](https://help.openai.com/en/articles/20001207-ads-in-chatgpt-the-basics)
[^vicary]: [Wikipedia, James Vicary](https://en.wikipedia.org/wiki/James_Vicary)
[^karremans]: [Karremans et al., Beyond Vicary's Fantasies: The Impact of Subliminal Priming and Brand Choice (Journal of Experimental Social Psychology, 2006)](https://doi.org/10.1016/j.jesp.2005.12.002)
[^smarandescu-shimp]: [Smarandescu & Shimp, Drink Coca-Cola, Eat Popcorn, and Choose Powerade: Testing the Limits of Subliminal Persuasion (Marketing Letters, 2015)](https://doi.org/10.1007/s11002-014-9294-1)
[^fcc-subliminal]: [FCC Enforcement Bureau, Letter on Subliminal Advertising Citing the 1974 Public Notice (DA 01-1643, 2001)](https://transition.fcc.gov/eb/Orders/2001/da01643.html)
[^eu-ai-act-art5]: [EU AI Act, Article 5: Prohibited AI Practices](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-5)
[^framing-meta]: [Amsalem & Zoizner, Real, but Limited: A Meta-Analytic Assessment of Framing Effects in the Political Domain (British Journal of Political Science, 2022)](https://doi.org/10.1017/S0007123420000253)
[^bai-llm-persuasion]: [Bai et al., LLM-generated Messages Can Persuade Humans on Policy Issues (Nature Communications, 2025)](https://www.nature.com/articles/s41467-025-61345-5)
[^costello-conspiracy]: [Costello et al., Durably Reducing Conspiracy Beliefs through Dialogues with AI (Science, 2024)](https://doi.org/10.1126/science.adq1814)
[^salvi-persuasion]: [Salvi et al., On the Conversational Persuasiveness of GPT-4 (Nature Human Behaviour, 2025)](https://doi.org/10.1038/s41562-025-02194-6)
[^hackenburg-microtargeting]: [Hackenburg & Margetts, Evaluating the Persuasive Influence of Political Microtargeting with Large Language Models (PNAS, 2024)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11181035/)
[^biased-autocomplete]: [Williams-Ceci et al., Biased AI Writing Assistants Shift Users' Attitudes on Societal Issues (Science Advances, 2026)](https://doi.org/10.1126/sciadv.adw5578)
[^selective-exposure]: [Hart et al., Feeling Validated versus Being Correct: A Meta-analysis of Selective Exposure to Information (Psychological Bulletin, 2009)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4797953/)
[^sycophancy]: [Sharma et al., Towards Understanding Sycophancy in Language Models (arXiv, 2023-10)](https://arxiv.org/abs/2310.13548)
[^ms-recommendation-poisoning]: [Microsoft Security Blog, Manipulating AI Memory for Profit: The Rise of AI Recommendation Poisoning (2026-02-10)](https://www.microsoft.com/en-us/security/blog/2026/02/10/ai-recommendation-poisoning/)
[^seal]: [Zweiger et al., Self-Adapting Language Models (arXiv, 2025-06)](https://arxiv.org/abs/2506.10943)
[^subliminal-learning]: [Cloud et al., Language Models Transmit Behavioural Traits through Hidden Signals in Data (Nature, 2026)](https://doi.org/10.1038/s41586-026-10319-8)
[^ftc-act-5]: [Cornell LII, 15 U.S. Code § 45 (FTC Act Section 5)](https://www.law.cornell.edu/uscode/text/15/45)
[^kr-ai-basic-act]: [MSIT, The AI Basic Act Comes into Force to Lay the Foundation for Korea to Become an AI G3](https://www.msit.go.kr/eng/bbs/view.do?bbsSeqNo=42&mId=4&mPid=2&nttSeqNo=1214&sCode=eng)
[^eu-ai-act-art15]: [EU AI Act, Article 15: Accuracy, Robustness and Cybersecurity](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-15)
[^eu-ai-omnibus]: [European Parliament, AI Act: EP Approves Simplification Measures and "Nudifier" App Ban (2026-06-16)](https://www.europarl.europa.eu/news/en/press-room/20260611IPR45207/ai-act-ep-approves-simplification-measures-and-nudifier-app-ban)
