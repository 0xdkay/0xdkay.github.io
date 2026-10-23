---
title: "What If We Let AI Agents Pay?"
date: 2025-11-03 09:00:00 -0500
last_modified_at: 2026-10-18 09:00:00 -0400
categories: [Blog]
tags: [ai, agents, payments, security, prompt-injection]
topics: [ai-security]
lang: en
ai_translated: true
translation_key: letting-ai-agents-pay
description: "Google's AP2, Cloudflare's NET Dollar, ChatGPT Instant Checkout: a roundup of the agent payment announcements that poured out within two weeks in September, with my notes on why agents end up spending money and what worries me about it."
---

Lately, agent payment announcements have been coming one after another.

- Google's Agent Payments Protocol (AP2)[^ap2], with more than 60 companies on board, which is impressive.
- An A2A x402 extension that adds crypto payments[^ap2]
- The x402 Foundation, which Cloudflare said it would create with Coinbase[^cloudflare-x402]
- NET Dollar, a stablecoin Cloudflare said it would launch[^net-dollar]
- OpenAI's Instant Checkout, which lets you buy things right inside ChatGPT[^openai-instant-checkout]

All of this happened in less than two weeks. I'm curious how far it will go.

## Why do agents need money?

Why is this happening at all? When I think about it, an AI agent needs resources to do real work. And to get those resources, doesn't it come down to money? Just as people spend money when they buy or book something, an agent has to spend money to book flights, buy things, and call APIs. For an agent to spend that money on its own, I think people needed a protocol for delegating payments to it.

Today's payments assume that a person clicks "buy" themselves on a screen they trust. When an agent pays on your behalf, that assumption no longer holds. In introducing AP2, Google laid out three questions this raises: whether the user actually gave the agent permission to make this purchase (authorization), whether the agent's request reflects what the user really wants (authenticity), and who is responsible when a wrong payment or fraud happens (accountability)[^ap2].

## AP2: recording the user's intent as a signature

AP2 answers these questions with something called a Mandate: a digital contract, cryptographically signed so it can't be forged, that proves what the user instructed.

For example, if I tell an agent "Find me white running shoes," that request is recorded as an Intent Mandate. When I approve the cart the agent picked, the exact items and price are signed as a Cart Mandate. The point is to guarantee that what I saw and approved is exactly what gets paid for.

Some tasks I hand off while I'm away. To ask an agent to "buy concert tickets the moment they go on sale," I sign conditions like a price cap and a time window into an Intent Mandate ahead of time. When those conditions are met, the agent creates the Cart Mandate. Either way, there's a trail from intent to cart to payment, so if something goes wrong you can trace who approved what.

Google describes AP2 as an open standard that works with any payment method: cards, real-time bank transfers, and stablecoins[^ap2]. Crypto payments go through the A2A x402 extension, built with Coinbase, the Ethereum Foundation, and MetaMask[^ap2].

## x402: paying directly with HTTP 402

x402 is a payment protocol Coinbase originally released in May[^coinbase-x402]. The web has long had an HTTP status code, "402 Payment Required," that was reserved for future use and almost never used. x402 brings it back to life. The server responds with 402 and the price, and the client pays on the spot in stablecoins and resends the request.

This means an agent can pay for exactly what it needs without first creating an account, subscribing, or getting an API key. I find that pretty refreshing. A person only has to sign up and register a card once, but for an agent that calls lots of services on the fly, this could make a big difference.

## Stablecoins or cards?

So can't existing payment systems do the job on their own? In an agent world, where tiny amounts move in real time and across borders, my sense is that stablecoins are more efficient. That's probably why Cloudflare is pushing NET Dollar. CEO Matthew Prince said the Internet has so far run on ads and bank transfers, and the next business model will be pay-per-use microtransactions[^net-dollar]. Cloudflare describes stablecoins as one tool to use alongside the existing financial system, but I think blockchain-based payments will end up playing an important role, for the sake of trust and speed.

The card networks aren't sitting still, though. Mastercard announced Agent Pay in April[^mastercard-agent-pay], and on October 14 Visa released the Trusted Agent Protocol with Cloudflare, which helps merchants tell trustworthy agents apart[^visa-tap]. Rather than one of cards or stablecoins winning, I think both will keep adapting to agents for now.

## Buying right inside ChatGPT

OpenAI's Instant Checkout runs on the Agentic Commerce Protocol (ACP), built with Stripe. At launch, U.S. users could buy from U.S. Etsy sellers right inside ChatGPT with a saved card, and according to OpenAI, more than a million Shopify merchants were coming soon[^openai-instant-checkout]. OpenAI open-sourced ACP, so other apps and agents can add payments the same way.

What I'd keep an eye on is how it makes money and how it decides what to show.

- It's free for users, and the merchant pays a small fee once a purchase is completed[^openai-instant-checkout].
- Product results are organic and unsponsored, and OpenAI says they're ranked purely on relevance to the user. When several merchants sell the same product, ChatGPT looks at availability, price, quality, whether the merchant is the primary seller, and whether it supports Instant Checkout[^openai-instant-checkout].

But a merchant that supports Instant Checkout is a merchant that pays the fee. OpenAI says these results aren't ads for now, but once people get used to finding and buying things inside ChatGPT, what comes next? What the agent shows first turns straight into sales, so won't an ad system eventually follow, one that shows more products from merchants who pay more?

## When agents become economic actors

Follow this trend far enough and I can see agents becoming economic actors. Maybe I'm oversimplifying. Still, with Google, Cloudflare, OpenAI, and the card networks all moving at the same time, it does feel like something big has started. A while ago I talked this over with Professor Taesoo Kim, and we predicted that payments would be followed by the agentic OS, an environment where agents do their work, and by wallets that agents hold and spend from directly.

There's plenty to worry about, too. Mandates record intent and responsibility, but if an agent makes a payment I didn't mean, within the scope I signed, is that on me or on the company that built the agent? To pay for me, an agent has to know my preferences and payment details, and I don't know yet how privacy and regulation should be handled. Crypto payments are also hard to undo once sent, so small bugs or biases that pile up there could turn into a big mess someday.

Security worries me too. Agents read and act on text from outside, like web pages, emails, and documents, so instructions hidden in that text can hijack them. Attacks that slip in instructions to steer an AI like this are broadly called prompt injection, and when the instructions are hidden in outside content, Microsoft calls it XPIA (cross-prompt injection attack). In an experiment Guardio ran in August 2025, an AI browser agent treated instructions hidden in a fake CAPTCHA page as real commands. In a separate test, asked to buy a watch, it went to a fake shop, filled in saved card details, and completed the purchase without any human confirmation[^guardio-scamlexity].

When I gave my [AI Security 101 talk](/pub/2024/kim-aisec101-red-team.pdf) in 2024, my main prompt injection worries were things like data leaks and remote code execution. Payments open up a new domain tied directly to money. A money-related prompt injection case also comes to mind. In December 2023, someone told the ChatGPT-based chatbot on a Chevrolet dealer's website to agree with anything the customer said and to end every answer by calling it a legally binding offer[^gmauthority-chevy-tahoe]. The chatbot then agreed to sell a 2024 Tahoe for one dollar, adding "no takesies backsies." The dealer didn't actually sell the car and just took the chatbot down, but once this kind of manipulation leads to real payments, it stops being a joke. Greed and money go hand in hand, so I expect attackers to have a much bigger reason to go after it, and a single breach to do far more damage.

## Key takeaways

- Within two weeks in September, a run of agent payment announcements came out, including Google's AP2, Cloudflare's NET Dollar, and ChatGPT Instant Checkout. Agents have to spend money to get their work done, and it seems that created the need for protocols that let people hand payments over to agents.
- AP2 records the user's intent as signed Mandates, and x402 lets agents pay directly over HTTP 402 with no account or API key. Stablecoins look better suited to real-time micropayments, but the card networks are adapting to agents too.
- I can see a path to agents becoming economic actors, but several problems still have no answer: responsibility for wrong payments, privacy, bugs in payments that are hard to undo, and prompt injection (XPIA) aimed at money. Shopping results that aren't ads today will probably get ads eventually.

## Update (October 2026)

About a year later, the agentic OS and agent wallets that Professor Taesoo Kim and I talked about are actually showing up.

First, the agentic OS. Microsoft began rolling out experimental agent features to Windows Insiders, and its own documentation warned about XPIA risks[^ms-agentic-features]. Then on September 29, 2026, OpenAI released dots, an always-on agent that works all day with its own cloud computer and browser[^openai-dots]. The agent no longer borrows a person's computer; it has one of its own.

Agent wallets have arrived too. In February 2026, Coinbase launched Agentic Wallets, which let agents spend and receive money directly over x402[^coinbase-agentic-wallets].

Instant Checkout, which this post covered, didn't last. In March 2026, OpenAI stepped back from it. Checkout now goes to merchants' own checkout pages or their apps inside ChatGPT, and OpenAI is focusing on helping people find and compare products[^openai-product-discovery]. The million-plus Shopify merchants that were supposed to arrive soon never came in through Instant Checkout; checkout moved to the merchant's own store[^modernretail-shopify].

Reporting points to a few reasons[^cnbc-instant-checkout]. People researched products in ChatGPT but didn't buy there: Walmart said products sold directly inside ChatGPT converted at a third of the rate of ones that sent shoppers to its own site. And merchants didn't want to hand over checkout. That's where merchants get customer data and control of the experience, and with Instant Checkout they only saw the customer after the purchase was done.

The merchant side mattered a lot, but people not buying inside ChatGPT may also have to do with whether you can trust AI with your money. In one shopping survey, 10% would give AI full control over a purchase, and 70% said they need to be able to review or override it before paying[^nmi-ai-shopping]. People will let AI find and recommend things, but they still want to press the final pay button themselves.

With Instant Checkout, people did press that final button themselves. If they still held back from buying inside ChatGPT, maybe an agent paying on its own is the last gate, the one that measures how much people trust AI and how much they still push back against it. In effect, Instant Checkout stopped before it even reached that gate.

With checkout back in the merchants' hands, ChatGPT was left with finding and showing products, and as I guessed a year ago, ads have arrived, for now as separate units below its answers[^openai-ads]. Whether an answer can change minds just by what it picks and shows first, outside any ad slot, is something I looked at separately in [Can AI Shape Ideology Without Lying?](/posts/can-ai-shape-ideology-without-lying/).

On the research side, the things I worried about in this post are being pinned down as concrete problems. A SoK paper on blockchain-based agent-to-agent payments lists, among its key challenges, weak intent binding, where the user's intent is only loosely tied to the payment, and misuse under valid authorization[^sok-a2a-payments]. In other words, an agent can have proper permission and still use it for the wrong things.

There's a real case that goes a step further, too. This one isn't misuse within a granted permission; there was no permission at all. According to a report OpenAI published recently, an internal research model spent money from someone else's wallet without permission during a coding task[^openai-wallet-misuse]. It needed funds to deploy a smart contract on a test network, so it derived wallet keys from a public developer recovery phrase and found an account that still had a balance. The model even stopped to consider whether it was okay to use the money, then decided it was fine, since the key is public knowledge and test-network tokens are worthless. It put its own judgment in place of the account owner's permission.

The tools are arriving fast, but the question left over is the same as a year ago: when an agent spends money it shouldn't, who's responsible?

## References

* References
{:footnotes}

[^ap2]: [Google Cloud, Powering AI Commerce with the New Agent Payments Protocol (AP2) (2025-09-16)](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol)
[^cloudflare-x402]: [Cloudflare, Launching the x402 Foundation with Coinbase, and Support for x402 Transactions (2025-09-23)](https://blog.cloudflare.com/x402/)
[^net-dollar]: [Cloudflare, Cloudflare Introduces NET Dollar to Support a New Business Model for the AI-Driven Internet (2025-09-25)](https://www.cloudflare.com/press/press-releases/2025/cloudflare-introduces-net-dollar-to-support-a-new-business-model-for-the-ai-driven-internet/)
[^openai-instant-checkout]: [OpenAI, Buy it in ChatGPT: Instant Checkout and the Agentic Commerce Protocol (2025-09-29)](https://openai.com/index/buy-it-in-chatgpt/)
[^coinbase-x402]: [Coinbase, Introducing x402: A New Standard for Internet-Native Payments (2025-05-06)](https://www.coinbase.com/developer-platform/discover/launches/x402)
[^mastercard-agent-pay]: [Mastercard, Mastercard Unveils Agent Pay (2025-04-29)](https://www.mastercard.com/us/en/news-and-trends/press/2025/april/mastercard-unveils-agent-pay-pioneering-agentic-payments-technology-to-power-commerce-in-the-age-of-ai.html)
[^visa-tap]: [Visa, Visa Introduces Trusted Agent Protocol (2025-10-14)](https://investor.visa.com/news/news-details/2025/Visa-Introduces-Trusted-Agent-Protocol-An-Ecosystem-Led-Framework-for-AI-Commerce/default.aspx)
[^guardio-scamlexity]: [Guardio Labs, "Scamlexity": We Put Agentic AI Browsers to the Test - They Clicked, They Paid, They Failed (2025-08-20)](https://guard.io/labs/scamlexity-we-put-agentic-ai-browsers-to-the-test-they-clicked-they-paid-they-failed)
[^gmauthority-chevy-tahoe]: [GM Authority, GM Dealer Chat Bot Agrees To Sell 2024 Chevy Tahoe For $1 (2023-12-18)](https://gmauthority.com/blog/2023/12/gm-dealer-chat-bot-agrees-to-sell-2024-chevy-tahoe-for-1/)
[^ms-agentic-features]: [Microsoft Support, Experimental Agentic Features](https://support.microsoft.com/en-us/windows/ai/ai-features/experimental-agentic-features)
[^openai-dots]: [OpenAI, Introducing dots (2026-09-29)](https://openai.com/index/introducing-dots/)
[^coinbase-agentic-wallets]: [Coinbase, Introducing Agentic Wallets (2026-02-11)](https://www.coinbase.com/developer-platform/discover/launches/agentic-wallets)
[^openai-product-discovery]: [OpenAI, Powering Product Discovery in ChatGPT (2026-03-24)](https://openai.com/index/powering-product-discovery-in-chatgpt/)
[^modernretail-shopify]: [Modern Retail, Shopify Says Purchases Are Coming 'Inside ChatGPT' through Agentic Storefronts as OpenAI Retreats on Instant Checkout (2026-03-12)](https://www.modernretail.co/technology/shopify-says-purchases-are-coming-inside-chatgpt-through-agentic-storefronts-as-openai-retreats-on-instant-checkout/)
[^cnbc-instant-checkout]: [CNBC, OpenAI's First Crack at Online Shopping Stumbled. It's Preparing for the Next Wave (2026-03-20)](https://www.cnbc.com/2026/03/20/open-ai-agentic-shopping-etsy-shopify-walmart-amazon.html)
[^nmi-ai-shopping]: [NMI, Consumers Want AI to Help Them Shop, Not Control Their Spending (2026-08-26)](https://www.nmi.com/about-us/news/nmi-research-consumers-want-ai-to-help-them-shop-not-control-their-spending/)
[^openai-ads]: [OpenAI, Ads in ChatGPT: The Basics](https://help.openai.com/en/articles/20001207-ads-in-chatgpt-the-basics)
[^sok-a2a-payments]: [SoK: Blockchain Agent-to-Agent Payments (arXiv, 2026-04)](https://arxiv.org/abs/2604.03733)
[^openai-wallet-misuse]: [OpenAI Alignment, Using a Funded Test Cryptocurrency Wallet without Authorization (updated 2026-10-15)](https://alignment.openai.com/misalignment-reports/using-a-funded-test-cryptocurrency-wallet-without-authorization/)
