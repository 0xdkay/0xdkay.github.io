---
title: "Random Thoughts on GenAI"
date: 2024-02-17 10:00:00 +0900
categories: [Blog]
tags: [ai, security, deepfake, red-teaming, jailbreak]
topics: [ai-security]
lang: en
translation_key: genai-thoughts
ai_translated: true
description: "If an AI learns from the same data as me, how do I prove which one is the real 'me'? Random thoughts on fake information and phishing getting more convincing with generative AI, why AI red teams need to look at safety too, and a study that jailbroke LLMs with low-resource languages."
thumbnail:
  path: /assets/img/hacker.webp
  alt: "AI-generated hacker wallpaper."
---

Not long ago, a friend asked me what GenAI actually is. The friend doesn't work in IT, and as I tried to explain, I realized that even though I work in cybersecurity, on the front line of IT, I didn't know much about it myself. Over the weekend I looked through all sorts of material and wrote down current issues, things to consider from a security point of view, and some random thoughts about AI.

## AI's Progress, and Proving the Digital 'Me'?

Generative AI (GenAI) is producing innovative results in many fields, from text and images to music and code. Large language models (LLMs) such as OpenAI's ChatGPT and Google's Gemini handle all kinds of language tasks, like translation, summarizing articles, and answering questions. Visual tools such as Midjourney make it possible to generate images and artwork.

Thinking about it, the way GenAI produces something new seems quite similar to how people are creative. As the saying goes, "imitation is the mother of creation": people create things by how they connect and combine the knowledge and information they already have. In a similar way, AI learns patterns by reinterpreting existing work from huge datasets, then combines those patterns probabilistically and organically to produce work that feels new and original to people. What matters in this process is the quantity and quality of the data and of the knowledge you can extract from it.

Some people argue that AI can't be creative in the true sense. Creativity comes from human subjective experience and emotion, they say, and AI can't fully imitate or understand that. But isn't AI's current limit rather that it can't fully imitate or understand the five human senses (sight, hearing, touch, taste, smell)? These senses deeply shape the cognitive process through which people take in data, so don't they end up shaping creativity too? Today's AI relies mostly on sight and hearing. But if AI gains the ability to imitate the five senses through various sensors, experience the world through them, build up data, and keep learning, I think it can go beyond simple imitation to a stage where it thinks as creatively as people, or more. Big tech companies, it turns out, are already researching how to build human senses into semiconductors.

- [Electronic nose](https://www.chosun.com/economy/science/2023/10/19/A5XW46KB3RGXTJVTX3M4HYRKZU/)

OpenAI's recently released [Sora](https://web.archive.org/web/20240217235945/https://openai.com/sora) shows that AI has reached the point where it can generate video from just a prompt. The way OpenAI describes Sora is interesting:

> We're teaching AI to understand and simulate the physical world in motion, with the goal of training models that help people solve problems that require real-world interaction.

Reading this and watching the videos the model generated, I wondered: earlier AI stopped at text or images that capture a single scene. By capturing how scenes interact across continuous moments, hasn't video-generating AI opened a way to imitate how people interact with the physical world?

Google recently grew the number of input tokens Gemini can take exponentially, up to 1M. Doesn't that open up even more ways for AI to interact?

- [Google's Gemini announcement](https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024/)

Could these advances lead AI toward learning by experiencing the human senses indirectly (even without direct sensors)?

I have a feeling that an AI identical to 'me' isn't far off. If AI's sensory system is completed, its ability to keep learning improves, and an AI that can interact is given the same data as 'me', it will be able to act like me and make the same judgments. That means the ways we have used to tell 'me' and 'the AI' apart may become meaningless. Proof based on past experience would no longer work, so (beyond biometric authentication) how could we tell the digital 'me' from the real 'me'?

## Fake Information, Scams, and Phishing

AI's progress matters for cybersecurity too. In particular, the way phishing has evolved reflects how AI has evolved. What started as fooling people with text and photos is moving to advanced techniques that use voice (DeepVoice) or video (DeepFake). A few days ago, someone used DeepFake to impersonate a company's CFO and pulled off a large financial fraud over a video conference call, which shows this concern is becoming real.

- [CNN: DeepFake CFO scam](https://edition.cnn.com/2024/02/04/asia/deepfake-cfo-scam-hong-kong-intl-hnk/index.html)

In the same way, I think the mass production of fake information with DeepFake and similar tools needs to be taken seriously. 2024 is a year of major elections in many countries, including Korea and the US, and the chance of political attacks using fake information has gone up a lot. Information manipulated with technology can affect election results, so I think we urgently need countermeasures.

Was it to deal with this problem? The executive order on "Safe, Secure AI" that US President Biden issued last October includes measures to protect Americans from AI-enabled fraud and deception. The order aims to set standards and best practices for detecting AI-generated content and authenticating official content.

- [Infosecurity Magazine: Biden's executive order](https://www.infosecurity-magazine.com/news/biden-issues-executive-order-on/)

Following this, since last year US big tech companies such as MS, Google, and Meta have been moving to respond with steps like attaching watermarks to the GenAI output their products generate.

- [The Register: Microsoft and Meta on elections](https://www.theregister.com/2023/11/08/microsoft_meta_election_disinformation/)

So the important questions are whether watermarking GenAI output is enough, what other methods it could evolve into, and how to respond to direct attacks that use open-source or self-built models. Don't we need to discuss them?

When OpenAI announced Sora, it spelled out the model's safety on the main page, which suggests this kind of effort is under way. A quick look at the [Sora safety section](https://web.archive.org/web/20240217235945/https://openai.com/sora) gives the sense that they are thinking about model safety from many angles.

> We'll be taking several important safety steps ahead of making Sora available in OpenAI's products.

> We are working with red teamers - domain experts in areas like misinformation, hateful content, and bias - who will be adversarially testing the model.

> We're also building tools to help detect misleading content such as a detection classifier that can tell when a video was generated by Sora.

> We're leveraging the existing safety methods ... applicable to Sora as well.

> Our text classifier will check and reject text input prompts that are in violation of our usage policies, like those that request extreme violence, sexual content, hateful imagery, celebrity likeness, or the IP of others.

> Robust image classifiers that are used to review the frames of every video generated to help ensure that it adheres to our usage policies, before it's shown to the user.

> We'll be engaging policymakers, educators and artists around the world to understand their concerns and to identify positive use cases for this new technology.

Google is also working through these questions, with an emphasis on responsibility in AI models. [AI Principles](https://ai.google/principles/):

> We will not design or deploy AI in the following application areas:

> Technologies that cause or are likely to cause overall harm. ... will incorporate appropriate safety constraints.

> Weapons or other technologies whose principal purpose or implementation is to cause or directly facilitate injury to people.

> Technologies that gather or use information for surveillance violating internationally accepted norms.

> Technologies whose purpose contravenes widely accepted principles of international law and human rights.

Despite these safety measures, ways to make videos without restrictions will appear, for example by turning an existing AI model into a state where it answers anything without limits (e.g., GPT's [DAN (Do Anything Now) mode](https://flowgpt.com/p/dan-120-semi-patched)). Compared with producing text or images without restrictions, couldn't video cause more serious problems? What if someone put Sora into DAN mode and made illegal videos?

This goes beyond a technical problem. It's a complex one that includes social and ethical questions, and I think it will take many different stakeholders working together.

## Safe, Secure AI

Actually, I think security professionals are probably more interested in AI security than in AI safety. Last October, US President Biden's [executive order on "Safe, secure AI"](https://bidenwhitehouse.archives.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/) stresses the need for developing standards, tools, and tests that make AI systems safe, secure, and trustworthy, and for an advanced cybersecurity program that develops AI tools to find and fix vulnerabilities in critical software.

As part of this effort, the US Defense Advanced Research Projects Agency (DARPA) announced the AIxCC competition at DEF CON last year. [AIxCC](https://aicyberchallenge.com/) is a competition to automate finding, exploiting, and patching vulnerabilities in programs with AI, and some of the best teams in the world are already taking part.

Beyond competitions like this, big tech companies such as MS, Google, and NVIDIA are setting up their own AI Red Teams to test their AI services and make them safe. MS and Google in particular encourage the companies that use their AI services to build their own AI Red Teams too.

- [Microsoft AI Red Team](https://www.microsoft.com/en-us/security/blog/2023/08/07/microsoft-ai-red-team-building-future-of-safer-ai/)
- [Google AI Red Team](https://blog.google/technology/safety-security/googles-ai-red-team-the-ethical-hackers-making-ai-safer/)

When I studied drone and self-driving car security in the lab, I learned that real security means looking at safety and security together (safety + security), not security alone. For drones and self-driving cars, working in real time, measuring and analyzing sensor data and acting on it, is critical, and if something goes wrong there, it can cause serious failures like crashes or collisions. So in systems where real-time behavior matters, security also has to consider attacks that break safety.

In the same way, shouldn't testing an AI service also take the AI model's safety into account? From this point of view, the Microsoft post above also describes a more expansive role for the AI Red Team.

> The practice of AI red teaming has evolved to take on a more expanded meaning: it not only covers probing for security vulnerabilities, but also includes probing for other system failures, such as the generation of potentially harmful content.

Google shares a similar view of the AI Red Team.

> Traditional red teams are a good starting point, but attacks on AI systems quickly become complex, and will benefit from AI subject matter expertise.

> Addressing red team findings can be challenging, and some attacks may not have simple fixes...

These days, security companies are building solutions that detect whether an AI prompt violates safety. The solution checks the user's prompt first, and only prompts verified as safe go into the model. This can raise plenty of questions about what exactly to check and how.

Samsung started developing its own AI services late last year and is rolling them out. Along the way I had the chance to do security reviews of several AI services, and even internally, how to treat safety is a point of debate. Separately, what I felt during the actual reviews is that as technology moves this fast, securing services built on it takes not only knowledge of specific techniques for finding vulnerabilities but broad knowledge across industry, science, and technology. I had experiences that are hard to get from the outside, like new kinds of vulnerabilities, the gap in perspective between service developers and security engineers, and working together to meet launch schedules. I'd like to share them if I get the chance.

## Half-Baked Theories About AI

In a recent [interview](https://youtu.be/0t8RovnvRsI?si=imOtQtDFd1wj1oVS), NVIDIA CEO Jensen Huang talked about the arrival of the AI era and the possibility that everyone can become a programmer, and stressed how important it now is to study biology. Hearing this and thinking it over, it struck me that AI's progress is closely tied to the human desire to create something identical to ourselves. LLMs like ChatGPT and Gemini got this far thanks to huge amounts of data on the languages we speak and on program code. Could he have stressed biology because fields like biological maps and DNA sequences have relatively little data by comparison, so they need more research?

To say a bit more about the amount of training data: LLMs are known to give better results when you ask in a language with plenty of training data. For example, most of ChatGPT's training data is English text, and you can see that asking in English instead of Korean, then translating the answer back into Korean, gives cleaner results. Of course, there may be other factors besides training data. For example, the model itself might have an architecture tuned for English. But in the end, wouldn't they have built the model on English, since it's the most used language and has the most training data?

A recent [study](https://neurips.cc/virtual/2023/78913) started from the point that the amount of training data can strongly affect results and turned it around: it showed a way to jailbreak LLMs using languages with little training data. For example, languages like Zulu and Hmong don't have much real training data, and if you enter a prompt translated into one of them, you can bypass the LLM's restrictions simply and easily.

What I actually found interesting in this study is that the attack success rate differed by category (conversation topic). Even in languages with little training data, some categories had strong restrictions (= the attack failed), and in others the restrictions were easy to bypass (= the attack succeeded).

A failed attack means that even without much training data, the data carries strong negative signals about that category. Could that be about important things that every culture writes down and shares? An easy success means the training data had no negative signals about that category. Could that be because, in that culture, the information is generally seen as 'obvious', so it gets passed on by word of mouth instead of being written down?

I can't rule out bias from having so little training data, but seeing this, couldn't fields like anthropology and linguistics help us understand how AI behaves and how to use it? Separately, the gaslighting people try in order to jailbreak a model is similar to scams that play on and deceive human psychology. Isn't that tied to human psychology too?

With today's AI, I could get good answers by feeding it knowledge step by step and guiding it, much like slowly teaching a new master's student or an undergrad intern in the lab. It struck me that this isn't very different from guiding a person. Could that be because AI is built by imitating humans? If so, wouldn't knowledge from fields like organizational management help with this process?

I don't have much experience with AI yet, but to understand AI more deeply and use it well, don't we need a multi-angle approach that crosses the line between technology and the humanities?

---

Since GenAI services came along, they seem to help a lot with organizing my thoughts and with writing.

The image below was generated with this prompt:

> draw me an artistic wallpaper. a hacker is in the center. left half of the wallpaper is for whitehat hacker. right half of the wallpaper is for blackhat hacker. also, it should be modern, digital, AI.

![AI-generated hacker wallpaper](/assets/img/hacker.webp){: w="700" h="400" }
