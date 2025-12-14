---
title: "Thoughts on GenAI (4/4): AI Speculation"
date: 2024-02-17 10:03:00 +0900
categories: [Blog]
tags: [ai, genai]
---

This is the fourth of four posts on GenAI:
- [Part 1: AI Development and Proof of Digital Identity](/posts/genai-thoughts-1-digital-identity/)
- [Part 2: Fake Information, Scams, and Phishing](/posts/genai-thoughts-2-misinformation/)
- [Part 3: Safe, Secure AI](/posts/genai-thoughts-3-safe-secure-ai/)
- **Part 4: AI Speculation** (this post)

---

NVIDIA CEO Jensen Huang mentioned in a [recent interview](https://youtu.be/0t8RovnvRsI?si=imOtQtDFd1wj1oVS) the arrival of the AI era and the possibility that everyone can become a programmer, while emphasizing the importance of studying biology. Hearing this made me think that AI development is closely connected to the human desire to create an entity identical to humans.

If large language models (LLMs) like ChatGPT and Gemini have reached their current level thanks to vast amounts of data about the languages we speak and program code, perhaps he emphasized the importance of biology because fields like biological maps and DNA sequences have relatively less information and need more research.

Speaking more about the amount of training data, it is known that when using LLM models, results are better when asking questions in languages with abundant training data. For example, ChatGPT's training data is mostly in English sentences. You can confirm that asking questions in English instead of Korean, receiving the answer, and then translating the answer back to Korean produces cleaner results. Of course, there may be other variables besides training data; for example, the model itself may have a structure specialized for English. But ultimately, English is used most and has the most training data, so they likely built the model based on it.

A [recent study](https://neurips.cc/virtual/2023/78913) noted that the amount of training data can significantly affect results, and as a reverse approach, presented a method to jailbreak LLM models using languages with less training data. For example, languages like Zulu and Hmong do not actually have much training data, and inputting prompts translated into these languages can easily bypass LLM model constraints.

What I found interesting in this research result was that attack success rates varied by specific categories (conversation topics). Even in languages with less training data, there were categories where constraints were strongly applied (attacks failed) or categories where constraints could be easily bypassed (attacks succeeded).

Attack failure means that even without much training data, there are strong negative elements about that category. Could this be about important things that are commonly recorded and shared in writing across all cultures? Easy attack success means negative elements about that category were not included in the training data. Could this be because it is information considered "natural" universally in that culture, so it is passed down orally rather than written?

While we cannot exclude the possibility of bias due to too little training data, seeing this made me think that anthropology, linguistics, and similar fields could help in understanding and utilizing AI behavior. Separately, the gaslighting attempted for jailbreaking is also similar to fraud methods that stimulate and deceive human psychology. It is ultimately connected to human psychology as well.

Current AI can provide appropriate responses if you inject knowledge step by step and guide it, much like slowly teaching a new master's student or undergraduate intern who just joined the lab. I thought this process is not much different from guiding people. This is probably because AI is an entity created by imitating humans. If so, knowledge from fields like organizational management could help in this process.

I do not have much experience with AI yet, but ultimately, to understand AI more deeply and utilize it well, we need a multifaceted approach that crosses the boundaries between technology and humanities.
