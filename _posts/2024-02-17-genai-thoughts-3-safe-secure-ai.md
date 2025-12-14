---
title: "Thoughts on GenAI (3/4): Safe, Secure AI"
date: 2024-02-17 10:02:00 +0900
categories: [Blog]
tags: [ai, genai]
---

This is the third of four posts on GenAI:
- [Part 1: AI Development and Proof of Digital Identity](/posts/genai-thoughts-1-digital-identity/)
- [Part 2: Fake Information, Scams, and Phishing](/posts/genai-thoughts-2-misinformation/)
- **Part 3: Safe, Secure AI** (this post)
- [Part 4: AI Speculation](/posts/genai-thoughts-4-speculation/)

---

Security experts are probably more interested in AI security than AI safety. In October last year, US President Biden's [executive order on "Safe, Secure AI"](https://bidenwhitehouse.archives.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/) emphasized the need for "developing standards, tools, and tests to ensure AI systems are safe, secure, and trustworthy" and "advanced cybersecurity programs to develop AI tools that can find and fix vulnerabilities in critical software."

As part of these efforts, the Defense Advanced Research Projects Agency (DARPA) announced the AIxCC competition at DEFCON last year. [AIxCC](https://aicyberchallenge.com/) is a competition to automate the process of finding vulnerabilities in programs, attacking them, and patching them using AI. Top-level teams from around the world are already participating.

Beyond such competitions, big tech companies like MS, Google, and NVIDIA are organizing AI Red Teams to internally review their AI services and make them secure. In particular, MS and Google are encouraging companies that use their AI services to also form their own AI Red Teams.

- [Microsoft AI Red Team](https://www.microsoft.com/en-us/security/blog/2023/08/07/microsoft-ai-red-team-building-future-of-safer-ai/)
- [Google AI Red Team](https://blog.google/technology/safety-security/googles-ai-red-team-the-ethical-hackers-making-ai-safer/)

While studying drone and autonomous vehicle security in the research lab in the past, I learned that true security is not just about focusing on security alone, but must consider both safety and security together (safety + security). For drones and autonomous vehicles, real-time measurement and analysis of sensor data and reflecting it in operations is critical. Problems here can cause serious issues like crashes and collisions. Therefore, in systems where real-time performance is important, security must also consider attacks that compromise safety.

Similarly, AI model safety should also be considered when reviewing AI services. From this perspective, the Microsoft material above mentions a more expansive role for AI Red Teams:

> The practice of AI red teaming has evolved to take on a more expanded meaning: it not only covers probing for security vulnerabilities, but also includes probing for other system failures, such as the generation of potentially harmful content.

Google also shares a similar perspective on AI Red Teams:

> Traditional red teams are a good starting point, but attacks on AI systems quickly become complex, and will benefit from AI subject matter expertise.

> Addressing red team findings can be challenging, and some attacks may not have simple fixes...

These days, security companies are developing solutions to detect whether AI prompt inputs violate safety guidelines. The approach is to first verify user prompts using the solution, and only input verified safe prompts to the model. Various considerations can arise about where and how to verify.

Samsung started developing and introducing its own AI services since the end of last year. During this process, I had the opportunity to perform security reviews on several AI services, and even internally, the safety perspective is a subject of debate.

Separately, what I felt during the actual review process is that as technology develops rapidly, securing services that apply such technology requires not only knowledge of specific techniques for finding vulnerabilities, but also broad knowledge spanning industry and science and technology as a whole. I was able to gain experiences that are difficult to have externally: new types of vulnerabilities, differences in perspective between service developers and security engineers, and the process of collaborating according to launch schedules. If I get the chance, I would like to share these experiences.
