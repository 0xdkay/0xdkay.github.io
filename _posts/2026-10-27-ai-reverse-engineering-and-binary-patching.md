---
title: "AI Reverse Engineering Can Copy Software, but Vulnerabilities Need an Exact Look"
date: 2026-10-27 00:00:00 -0400
categories: [Blog]
tags: [ai, security, vulnerability, reverse-engineering, binary-patching, obfuscation, patch-gap, agents, context-engineering]
topics: [ai-security, firmware-binary-analysis]
lang: en
ai_translated: true
translation_key: ai-reverse-engineering-and-binary-patching
description: "There's a lot of talk these days about copying commercial software with AI, but what AI reads out of a binary isn't the original. It's code with the blanks filled in plausibly. That may be enough for copying, but when you're looking for vulnerabilities, those blanks become the problem."
image:
  path: /assets/img/posts/ai-reverse-engineering-and-binary-patching.webp
  alt: "AI-generated illustration: on the left, the original binary with details lost in compilation and a real vulnerability inside; in the middle, a wall of compilers and obfuscation; on the right, an AI reconstruction filled in with guesses like a puzzle, with a bug missed in its gaps"
---

In April, an open-source project called REA (Reverse Engineer Anything) went up on GitHub. As of October 27 it has close to 400,000 stars[^rea-github]. It hooks analysis tools like Hopper, Ghidra, and IDA into coding agents such as Claude Code or Codex through MCP, and installs the analysis workflow as a skill. On Hacker News, someone even asked whether this is why so many Photoshop and Office clones are showing up lately[^hn-rea].

The README makes a pitch: when you see a feature you like in an app, have your agent look inside the app without its source code, explain how the feature works, and build the same feature in your own project[^rea-github]. The examples are pretty precise. The sound calculation function of the old game DX-Ball was rebuilt in C. That code returns the same values as the original x86 function on 3,205 inputs, and when recompiled it produces the same 63 bytes as the original[^rea-dx-ball].

So is what you build this way a copy of the feature, or a copy of the code? Can you clone software whole? And if the code AI reads out differs from the original, what goes wrong in vulnerability analysis or binary patching, where you need to see the original exactly?

## Programs copied by AI: is there an IP problem?

REA's DISCLAIMER draws a line. It says the project won't help copy proprietary software or reproduce protected code and assets, and that getting source-like output or an analysis report doesn't give you any rights to the original program[^rea-disclaimer]. On GitHub there's an open issue that points out copyright concerns with agents accessing original source code and asks for a stricter mode[^rea-issue-2120].

The README says rebuild the feature, and the DISCLAIMER says don't reproduce the code. The law mostly draws the line in the same place. Copyright protects expression, not ideas. Korean copyright law allows reverse analysis only when it's necessary for compatibility, and forbids using that information to make a program whose expression is substantially similar[^kr-copyright-101-4]. In the US, the 1992 Sega v. Accolade ruling held that disassembly to learn how something works was fair use, and in the 2021 Google v. Oracle case the Supreme Court cited that ruling as an example of fair use[^sega-accolade][^google-oracle].

That doesn't mean you're fine as long as you don't copy the code. In 2012 a US court held that Mino, a Tetris knockoff, infringed copyright even though it didn't copy the source code, because an ordinary user couldn't tell the two apart from the screen alone[^tetris-xio]. Korea's Supreme Court overturned an appellate ruling in 2019, saying Forest Mania felt like Farm Heroes Saga with only the characters changed[^farm-heroes], but this year, in the Dark and Darker case, it held that the two games weren't similar and found only trade secret infringement, not copyright infringement[^dark-and-darker]. I'm not a legal expert, but when even the same case, like Forest Mania, gets judged differently from court to court, where infringement begins still seems to be debated.

AI adds one more problem. If the model fills the parts it couldn't read from the binary with code it saw in training, the original's expression can end up in the output as is. Whether the clean room approach, rebuilding from a spec without looking at the original, works for AI too is also still unsettled[^reed-smith-clean-room]. A new version of chardet, rewritten from scratch with Claude, switched its license from LGPL to MIT and sparked a debate over whether it was really independent of the old code. Dan Blanchard, who wrote the new version, admitted that one original file had been in Claude's context in full and that the old code was in the training data too, so it was only an approximation of a clean room. Still, he argues it isn't a derivative work, since measuring similarity showed almost no overlap[^chardet-blanchard].

Either way, the responsibility for not crossing the line lies with the person using the tool. But how can you tell how much of the original is in the code the agent produced? To see that, you have to look at how much of the original comes back from a binary, and what the model fills the lost parts with.

## How much of the original can be recovered?

My first hunch went like this. You'll get something roughly similar, but no matter how good it gets, isn't getting code that's 100% identical to the original program impossible? Compilation throws away information like variable names, comments, macros, and code structure, and the model fills those blanks by inference.

The numbers say recovering lost information still doesn't work well. LLM4Decompile measures performance by re-executability, the share of decompiled code that recompiles and passes the original tests. In this paper, even the best model that produces source straight from the binary, without a decompiler, passed 68% of test functions on unoptimized `-O0` binaries, but dropped to 37-40% from `-O1` to `-O3`[^llm4decompile].

DecBench is run by the University of Georgia's Noelo Lab, which makes the Kuna decompiler. It measures how exactly decompiler output matches the original source in three ways: control flow structure, variable types, and byte match after recompiling. As of October 9, on the unoptimized dataset, even Kuna, in first place, was perfect on at least one of the three for only 51.4% of functions, barely over half, and Hex-Rays, IDA's decompiler, came in under half at 49.1%[^decbench]. On optimized binaries a Codex agent beat Kuna by a wide margin, but even that Codex got every type right in only 25.1% of functions[^decbench-data].

On the other hand, as the DX-Ball example showed, matching down to the byte is possible. That's matching decompilation: finding C code that compiles back to the same machine code as the original. But even with identical bytes, names and meaning have to be added separately. Chris Lewis matched the Nintendo 64 game Snowboard Kids 100% in 84 days, working with agents, but he thought that without help from community experts it would have stalled around 89-90%[^lewis-84-days].

The check that the bytes match can be wrong too. In REA's reconstruction of the Touhou Project games, a function with a wrong floating-point constant passed the byte-match check anyway. The checker only compared the addresses in the instructions and didn't check the values actually stored at those addresses. A second look found twelve more bad references in five functions that had already passed[^rea-touhou].

## The blanks get filled in plausibly

A result that looks perfect may not even come from the binary. DecBench's dataset is built from open-source projects like bzip2 and coreutils, so the DecBench maintainer also believes all of this code is in the models' training data. When the maintainer opened the run logs, Claude Code had pointed out, without being asked, that the target function was bzip2's `fallbackSort`. With no web search, it called objdump just three times and recalled the function from the assembly alone. One user reported that Claude produced code identical to the original, down to the comments and variable names. On the flip side, when Codex didn't recognize a function in an optimized binary, it wrote it differently from the original and lost structure points. The maintainer said that code was actually better than the original[^decbench-issue-43].

So in the output, where does recovery from the binary end, and where does the model's inference or memory begin? I looked for research that measures this split directly and couldn't find any. So far there are only indirect measures: re-executability, similarity to the original, and name and type accuracy. The gap between functions seen in training and new ones is a clue. DIRTY got types right 89.9% of the time for functions it had seen in training, but 56.4% for ones it hadn't[^dirty]. Most of the numbers above were measured on public code too, so they may be lower on commercial binaries the model has never seen. I think measuring recovery and inference separately would be an interesting research topic in itself.

But even when it isn't identical to the original, it can feel "recovered" to the person using it. Human perception is more forgiving than we think. A celebrity look-alike only has to resemble the person in a few spots to look like them, and an impression on a comedy show sounds like the person once it catches a few habits of speech and intonation, even with a different voice. People told StyleGAN2 faces from real ones with 48.2% accuracy, about the same as guessing at random, and the AI-made faces were even rated more trustworthy[^ai-faces]. In about 80% of cases, an AI-cloned voice and the real voice were judged to belong to the same person[^voice-clones].

In games, these small differences sometimes matter. The SNES game Speedy Gonzales seems to run fine on any emulator at first glance, but if you play two to three hours without saving and reach stage 6-1, it freezes on emulators that don't reproduce a rare hardware behavior[^byuu-accuracy]. It looks the same at a glance, but the difference hides in paths people rarely take.

## Will obfuscation get more attention?

There are cases like Snowboard Kids that matched down to the byte, but that took 84 days and help from community experts. It may look similar, but cloning software whole and exactly with AI alone is hard. For people trying to prevent copying, that's a hint. If the model fills in the parts it couldn't read, won't obfuscation, which shrinks what can be read and throws the inference off, get more attention?

That shift is already visible. Promon, an app protection company, gave LLMs the ARM assembly of programs obfuscated with Obfuscator-LLVM and had them rewrite C code with the same functionality. Stacking three obfuscation techniques dropped the average success rate from 63.7% to 8.5%[^promon-2026q1]. It's an experiment by a company selling its own product, so take it with a grain of salt, but protecting apps and IP from AI has now become a sales pitch.

Obfuscator-LLVM is actually fairly simple obfuscation. In our BinKit study, which re-evaluated binary code similarity analysis, we also used it to build an obfuscated dataset, and a few simple features held up well against this obfuscation, which only changes the inside of functions[^binkit]. That LLM success rates still dropped this much may be because the input swelled with useless code. A person skips meaningless dummy code when they see it, but an LLM can't skip it the way a person does, so doesn't its context fill up with that junk?

Researchers are also looking for protection techniques LLMs can't easily break. A paper at this year's Workshop on Binary Analysis Research (BAR) had three LLM agents solve 24 CTF reverse engineering challenges and looked at where they failed. But at least one agent solved 88% of the 24 challenges, and for six of the eight challenges protected with a custom virtual machine (custom VM), the agents wrote their own bytecode emulator or disassembler and solved them. The authors argue that protection shouldn't stop at making code "hard to read"; it has to make the agent's analysis loop reliably fail. They also said, though, that defenses that break decompiler output have limits, because agents often reasoned from the assembly alone without a decompiler, and decompiler output sometimes confused the agents instead[^llm-resistant-protection].

Then should the obfuscation that human reversers find hard and the obfuscation LLMs find hard be different? The BAR paper pointed to weaknesses: agents lean on patterns they saw in training, and when observations pile up over a long run, they can't find clues they saw earlier. A preprint from this June gave LLMs the same obfuscation tasks that had been given to people. Reasoning models struggled in places similar to where people struggled, but where instruction and coder models got stuck had almost nothing to do with where people got stuck[^le-obfuscation-human-llm]. That experiment, though, had students read short Python and JavaScript code, and I haven't yet found a study that gives the same binary obfuscation to expert reversers and agents and compares them. I think this could be a new research topic too.

## Finding vulnerabilities means seeing the original exactly

Even without obfuscation, the code AI reads out still has blanks. If the goal is to rebuild a feature, similar behavior is enough, and being a little different on rarely taken paths may not be a big problem in practice. If the goal is to find vulnerabilities in the original, it's a different story. Vulnerabilities sometimes hide on exactly those paths. A bug found in the blanks the model filled in may be a bug in the code the model wrote, not in the original, and a bug in the original may vanish into those blanks. byuu, who made the SNES emulator bsnes, said accurate emulation reproduces even the original's "wrong" behavior[^byuu-accuracy]. That's the kind of accuracy vulnerability analysis needs.

Even using only a decompiler, with no model filling blanks, you miss bugs in the original. In one study, decompiler output for nine C programs was fixed by hand and eight static analysis (SAST) tools were run on it; they found only 71% of the real bugs (true positives) they had found on the original source, and false alarms (false positives) went up 232% on average. Information lost in decompilation, like stack buffer sizes, was the cause[^asiaccs-convergence].

Decompiling with an LLM, or cleaning up decompiler output with one, can make it worse, because readable code and correct code are different things. In DecompileBench, when an LLM scored how readable the code was, LLM-based decompilation beat commercial decompilers, but the share that reached the same branch coverage as the original when run was 17.2-52.2% lower than Hex-Rays[^decompilebench]. In another preprint from this September, the LLM that raised the recompile rate the most actually lowered the share behaving exactly like the original. In functions with CVEs, up to one in ten disclosed vulnerabilities no longer caused a crash in the cleaned-up code[^recompile-more-preserve-less]. It compiles, so it looks right, but the original's vulnerability isn't reproduced.

So when analyzing vulnerabilities in the original code, I think improving the quality of the decompiler itself is very important. And that quality comes from reverse engineering domain knowledge. We saw this in the BinKit study too. How the binaries were compiled and how accurate the underlying analysis tools were changed the results a lot. For example, IDA Pro didn't properly handle MIPS binaries built by Clang as position-independent code (PIC)[^binkit]. In our research on phone baseband firmware, IDA Pro didn't support ARM scatter-loading, which moves code and data to places all over memory at boot, so we emulated that step ourselves, and we couldn't cover Qualcomm's Hexagon architecture because neither IDA Pro nor the binary analysis tool angr supported it. The per-firmware configuration files and per-vendor analysis modules had to be written by hand[^basespec][^basecomp]. Decompiling takes an understanding of compilers, and of the target architecture or embedded device.

## Where you have to fix things without source

There's one more job that needs precise analysis: binary patching. In my last post, [Vulnerabilities Are Pouring In. Will Patches Reach Users in Time?](/posts/patch-gap-and-blast-radius/), I asked whether, where patches can't be installed or never come, all we can do is contain systems so a breach doesn't spread, or replace the equipment. When the company goes bankrupt, the source code is restricted, or the product reaches EOL, patches stop coming. Critical systems like factories and hospitals are like that. In a 2020 Palo Alto Networks Unit 42 report, 83% of medical imaging devices were running an unsupported OS[^unit42-iot-2020]. And places like that usually don't hand out source code. All that's left is the binary.

Fixing a binary directly is work that needs 100% precision. A recent example shows how hard that is, even for a program whose source is public. On October 21, the security company Calif disclosed php2shell, a PHP runtime vulnerability that was exploitable even in default configurations, and unauthenticated remote code execution was confirmed in apps like WordPress, Drupal, and Joomla[^calif-php2shell]. The next day, pancake, the creator of radare2, posted how he patched Alpine's `mod_php` binary directly instead of waiting for distro updates[^pancake-patching].

This patch does lose some functionality, though. Instead of recovering when memory runs out, the worker now just exits, and he gave up the debugging backtrace too. He only suggested comparing the changed bytes; there are no functional test results. Where symbols were missing, he found the location from the upstream source diff, but on a system with no source at all, even that clue isn't there. Where to fix and what to give up is a call a skilled reverse engineer makes. pancake also wrote that he knows to look carefully at memory management when he sees a `sigsetjmp` call because he's a reverse engineer.

## Adding AI to automated patching

So could a machine make these calls instead of a person? In the finals of DEF CON CTF, a festival for hackers from all over the world, teams attack each other's services, and they also defend by patching vulnerabilities in their own[^nautilus-2025-rules]. In 2016, DARPA had machines play this kind of CTF against each other at DEF CON. In this Cyber Grand Challenge, machines saw bugs in never-before-seen software being exploited and fielded patches on their own[^darpa-cgc]. Scoring was based on functionality too. The 2014 qualifier rules multiplied a patched binary's score by the worse of retained functionality and performance[^cgc-cqe-scoring]. If a patch breaks functionality, the score breaks with it.

Later, DARPA's Assured Micropatching (AMP) took on legacy binaries in mission-critical systems with neither source nor build environment. The goal was to fix them quickly with micropatches that change as few bytes as possible, and even to prove that the original functionality is preserved afterward[^darpa-amp]. For embedded devices that can't be rebooted, such as medical devices and industrial controllers, there's also research on hotpatching, which fixes software while it keeps running[^rapidpatch].

If we combine existing methods for fixing binaries without source with AI used as a tool, couldn't more detailed ways to analyze them emerge? Recent results show the potential, but there's little evidence yet. SCRIBE, accepted at EuroS&P 2026, fixes decompiler output to fit the binary and recompiles it, and patched 13 of 14 real-world CVEs without source. But the targets were publicly known CVEs in well-known open-source tools like Coreutils and Binutils, and the patches were ported into the decompiled code from the public source diffs. Even at the function level, it's still far from 100%. After SCRIBE's fixes, 84.1% of Hex-Rays functions and 49.4% of Ghidra functions recompiled, and of the functions that compiled but failed tests, SCRIBE fixed 80.9% and 53.3%, respectively. And whether a patch was correct was judged by running tests[^scribe].

There's no guarantee that a patch that passes tests is a correct patch. That's true even with source. When we checked coding agents' patches on vulnerabilities in the open-source projects used in the AIxCC finals, the semantic correctness of patches that blocked the vulnerability and passed every unit test was only 60-80%. The rest only stopped the crash while adding new bugs or changing functionality[^team-atlanta-patch-2026].

CGC tried to check that a patch doesn't break functionality with tests, and AMP with proofs. Add the condition we saw earlier, that the system can't be stopped or rebooted, and checking a patch gets even harder. So the question that remains is this: is there a way to do hotpatching while keeping robustness? Patching only the vulnerable part without damaging functionality.

## Accuracy comes from domain knowledge built into tools

Finding vulnerabilities without missing them and fixing a binary without breaking functionality both depend on how accurate the underlying analysis is. In binary analysis, especially for work tied to tooling and accuracy, I find myself thinking of AI more as a tool. That's because the tooling we have is the accumulated result of the field's best domain knowledge.

AI-side tools are heading the same way. REA itself isn't a new model; as we saw earlier, it's a harness on top of existing analysis tools. REA's skill tells the agent to separate what it observed, what it inferred, and what it doesn't know in every conclusion[^rea-skill]. In effect, it bakes where recovery ends and inference begins into a workflow rule. REA's docs also state plainly that the pseudocode from the Kuna decompiler mentioned earlier is only a reconstruction, not the original source[^rea-kuna-provider]. Microsoft's Project Ire also has an LLM call decompilers and analysis tools, and a case where it misread one function as anti-debugging was fixed by changing decompiler rules[^ms-project-ire].

A post on the REA blog, "Does reverse engineering need a bigger model?", says something similar. While matching Touhou's bytes, some cases could only be solved once you knew fine-grained compiler details a general model probably wouldn't know, and feeding in the compiler knowledge collected in the repository through retrieval improves the agent's starting point without retraining the model. So the post proposes comparing a bigger model against a smaller model with good retrieval[^rea-models].

Of course the model matters too. Unlike the numbers above, SRE-Bench measures with binaries that experts built from scratch so models couldn't have seen them in training. It's a benchmark for figuring out what a binary does, not for recovering its source, and even with the same standard RE tools, results split widely by model. Optimization and linking were barely a problem for the four strongest models, while weaker models lost much of their score when symbols were stripped[^sre-bench]. Still, these are all results with tools, so I don't think it means a strong model gets the same results without tools.

Then for agent harnessing too, I think it will ultimately come down to how we accumulate this kind of domain knowledge. Tools, prompts, context, and the harness all become accumulated domain knowledge. Won't the work ahead be figuring out how to work domain knowledge into agents and how to help them reach it, the way we refine agent skills and use RAG to pull knowledge in when it's needed? As I wrote in my [AIxCC retrospective](/posts/team-atlanta-wins-darpa-aixcc/), for a domain expert, context engineering is a way to lift an LLM's ability up to the expert's own level. For now we feed it in from the outside like this, but won't it eventually go as far as building that knowledge into the model itself?

## Closing thoughts

This post kept coming back to one question. In the code AI produces, where does the part that came from the binary end, and where does the part the model filled in begin? For the side that copies, it's a question of how much of the original leaked in; for the side that hunts vulnerabilities, whether a bug is real and whether anything was missed; for the side that fixes, whether the patch can be trusted. There isn't even a good way to measure this boundary yet. Whether it's getting an agent to mark this boundary on its own or trusting that mark enough to hand it the binaries of factories and hospitals, it all seems to come down to how well we understand the target.

## Key takeaways

- Tools like REA, where agents read binaries and rebuild features, are taking off, but the code AI reads out isn't the original. The model fills in the missing names, types, and structure by inference or from memory, so cloning software whole is hard, and obfuscation may get more attention. Still, original code the model reproduces from memory, or screens that look the same, can become an IP problem.
- When looking for vulnerabilities in the original, these blanks can make you miss real bugs or find bugs that aren't in the original. That's why decompiler quality and domain knowledge of compilers and architectures matter.
- Factory and hospital systems without source need their binaries fixed directly without breaking functionality, and here AI can help when it's attached to existing binary tools and verification. In the end, I think the key will be putting domain knowledge into tools, skills, and context so the agent can draw on it, and eventually going as far as building it into the model.

## References

* References
{:footnotes}

[^rea-github]: [morluto/rea](https://github.com/morluto/rea)
[^hn-rea]: [Hacker News, REA: Reverse Engineer Anything (2026-10-10)](https://news.ycombinator.com/item?id=50028275)
[^rea-dx-ball]: [REA, DX-Ball Showcase](https://rea.tools/showcase/dx-ball/)
[^rea-disclaimer]: [morluto/rea, DISCLAIMER.md](https://github.com/morluto/rea/blob/main/DISCLAIMER.md)
[^rea-issue-2120]: [morluto/rea, Copyright Compliance Concerns Regarding Agent Access to Original Source Code (Issue #2120, 2026-10-12)](https://github.com/morluto/rea/issues/2120)
[^kr-copyright-101-4]: [National Law Information Center, Copyright Act Article 101-4, Reverse Analysis of Program Code (effective 2026-08-11)](https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=04&joNo=0101&lsiSeq=283335&urlMode=lsScJoRltInfoR)
[^sega-accolade]: [Sega Enterprises v. Accolade, 977 F.2d 1510 (9th Cir., 1992-10-20)](https://law.resource.org/pub/us/case/reporter/F2/977/977.F2d.1510.92-15655.html)
[^google-oracle]: [Google LLC v. Oracle America, 593 U.S. 1 (U.S. Supreme Court, 2021-04-05)](https://www.supremecourt.gov/opinions/20pdf/18-956_d18f.pdf)
[^tetris-xio]: [Tetris Holding v. Xio Interactive, 863 F. Supp. 2d 394 (D.N.J., 2012-05-30)](https://www.govinfo.gov/content/pkg/USCOURTS-njd-3_09-cv-06115/pdf/USCOURTS-njd-3_09-cv-06115-0.pdf)
[^farm-heroes]: [Supreme Court of Korea, Ruling on Criteria for Creativity and Substantial Similarity in Mobile Games (Forest Mania Case) (2017Da212095, 2019-06-27)](https://www.scourt.go.kr/portal/news/NewsViewAction.work?gubun=4&searchOption=&searchWord=&seqnum=6713&type=5)
[^dark-and-darker]: [Supreme Court of Korea, Press Release on Trade Secret Infringement Injunction Case (2026Da200492, 2026-04-30)](https://www.scourt.go.kr/supreme/news/NewsViewAction2.work?gubun=702&searchOption=&searchWord=&seqnum=1739)
[^reed-smith-clean-room]: [Reed Smith, Clean room coding in the age of AI: who owns the code? (2026-07-10)](https://www.reedsmith.com/our-insights/blogs/technology-law-dispatch/102nbig/clean-room-coding-in-the-age-of-ai-who-owns-the-code/)
[^chardet-blanchard]: [Dan Blanchard, Everything Claude Saw: A Transparent Account of the Chardet v7 Rewrite (2026-03-29)](https://dan-blanchard.github.io/blog/chardet-rewrite-controversy/)
[^llm4decompile]: [Tan et al., LLM4Decompile: Decompiling Binary Code with Large Language Models (EMNLP, 2024)](https://arxiv.org/abs/2403.05286)
[^decbench]: [Noelo Lab, DecBench](https://decbench.com/leaderboard/)
[^decbench-data]: [Noelo Lab, DecBench Scoreboard Data (2026-10-09)](https://decbench.com/data/aggregates.json)
[^lewis-84-days]: [Chris Lewis, Decompiling a Nintendo 64 Game in 84 Days (2026-08-26)](https://blog.chrislewis.au/decompiling-a-nintendo-64-game-in-84-days)
[^rea-touhou]: [REA, The Industrial Revolution in Reverse Engineering (2026-10-10)](https://rea.tools/blog/touhou-reconstruction/)
[^decbench-issue-43]: [Noelo-Lab/decbench, Potential LLM Bias (Issue #43, 2026-07-24)](https://github.com/Noelo-Lab/decbench/issues/43)
[^dirty]: [Chen et al., Augmenting Decompiler Output with Learned Variable Names and Types (USENIX Security, 2022)](https://www.usenix.org/conference/usenixsecurity22/presentation/chen-qibin)
[^ai-faces]: [Nightingale and Farid, AI-synthesized faces are indistinguishable from real faces and more trustworthy (PNAS, 2022)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8872790/)
[^voice-clones]: [Barrington et al., People are poorly equipped to detect AI-powered voice clones (Scientific Reports, 2025)](https://www.nature.com/articles/s41598-025-94170-3)
[^byuu-accuracy]: [byuu, Accuracy takes power: one man's 3GHz quest to build a perfect SNES emulator (Ars Technica, 2011-08-09)](https://arstechnica.com/gaming/2011/08/accuracy-takes-power-one-mans-3ghz-quest-to-build-a-perfect-snes-emulator/)
[^promon-2026q1]: [Promon, App Threat Report 2026 Q1: The State of Code Obfuscation Against AI (2026-03-26)](https://promon.io/security-news/app-threat-report-2026-q1-the-state-of-code-obfuscation-against-ai)
[^binkit]: [Kim et al., Revisiting Binary Code Similarity Analysis using Interpretable Feature Engineering and Lessons Learned (IEEE TSE, 2022)](https://0xdkay.me/pub/2022/kim-tse22-binkit.pdf)
[^llm-resistant-protection]: [Nishizaka et al., Towards LLM-Resistant Software Protection: Agent Failure Patterns in CTF Reverse Engineering (BAR, 2026)](https://www.ndss-symposium.org/wp-content/uploads/bar2026-58.pdf)
[^le-obfuscation-human-llm]: [Le et al., Do Machines Struggle Where Humans Do? LLM and Human Comprehension of Obfuscated Code (arXiv, 2026-06)](https://arxiv.org/abs/2606.31725)
[^asiaccs-convergence]: [Mantovani et al., The Convergence of Source Code and Binary Vulnerability Discovery: A Case Study (AsiaCCS, 2022)](https://www.eurecom.fr/publication/6732)
[^decompilebench]: [Gao et al., DecompileBench: A Comprehensive Benchmark for Evaluating Decompilers in Real-World Scenarios (Findings of ACL, 2025)](https://aclanthology.org/2025.findings-acl.1194/)
[^recompile-more-preserve-less]: [When LLM Decompilers Recompile More and Preserve Less (arXiv, 2026-09)](https://arxiv.org/abs/2609.05370)
[^basespec]: [Kim et al., BaseSpec: Comparative Analysis of Baseband Software and Cellular Specifications for L3 Protocols (NDSS, 2021)](https://0xdkay.me/pub/2021/kim-ndss2021.pdf)
[^basecomp]: [Kim et al., BaseComp: A Comparative Analysis for Integrity Protection in Cellular Baseband Software (USENIX Security, 2023)](https://0xdkay.me/pub/2023/kim-sec23-basecomp.pdf)
[^unit42-iot-2020]: [Palo Alto Networks Unit 42, 2020 Unit 42 IoT Threat Report (2020-03-10)](https://unit42.paloaltonetworks.com/iot-threat-report-2020/)
[^calif-php2shell]: [Calif, php2shell (2026-10-21)](https://calif.io/php2shell/)
[^pancake-patching]: [pancake, Security Through Binary Patching (2026-10-22)](https://trufae.substack.com/p/security-through-binary-patching)
[^nautilus-2025-rules]: [Nautilus Institute, Welcome to the DEF CON 33 Capture the Flag Final! (2025)](https://nautilus.institute/files/rules-2025-100.pdf)
[^darpa-cgc]: [DARPA, DARPA Celebrates Cyber Grand Challenge Winners (2016-08-05)](https://www.darpa.mil/news/2016/cyber-grand-challenge-winners)
[^cgc-cqe-scoring]: [DARPA, Cyber Grand Challenge CQE Scoring Document (2014-07-07)](https://archive.ll.mit.edu/cgc/cgc-corpus/static/CQE%20Scoring.pdf)
[^darpa-amp]: [DARPA, Assured Micropatching (AMP)](https://www.darpa.mil/research/programs/assured-micropatching)
[^rapidpatch]: [RapidPatch: Firmware Hotpatching for Real-Time Embedded Devices (USENIX Security, 2022)](https://www.usenix.org/conference/usenixsecurity22/presentation/he-yi)
[^scribe]: [Dai et al., SCRIBE: Practical Static Binary Patching via Binary-Aware Recompilation of Decompiled Code (EuroS&P, 2026)](https://arxiv.org/abs/2605.02121)
[^team-atlanta-patch-2026]: [Team Atlanta, Patching Vulnerabilities with Coding Agents in 2026 (2026-03-11)](https://team-atlanta.github.io/blog/post-patch-2026-ensemble/)
[^rea-skill]: [morluto/rea, reverse-engineer-anything SKILL.md](https://github.com/morluto/rea/blob/main/.agents/skills/reverse-engineer-anything/SKILL.md)
[^rea-kuna-provider]: [morluto/rea, Kuna Provider](https://github.com/morluto/rea/blob/main/docs/kuna-provider.md)
[^ms-project-ire]: [Microsoft Research, Project Ire Autonomously Identifies Malware at Scale (2025-08-05)](https://www.microsoft.com/en-us/research/blog/project-ire-autonomously-identifies-malware-at-scale/)
[^rea-models]: [REA, Does Reverse Engineering Need a Bigger Model? (2026-10-13)](https://rea.tools/blog/reverse-engineering-models/)
[^sre-bench]: [Spence et al., The Next Challenge for Agentic Cybersecurity: A Realistic, Contamination-Free Reverse Engineering Benchmark (arXiv, 2026-08)](https://arxiv.org/abs/2608.11469)
