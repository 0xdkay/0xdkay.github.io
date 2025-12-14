---
title: "My First Ransomware Experience: eCh0raix"
date: 2022-11-29 10:00:00 +0900
categories: [Blog]
tags: [ransomware, incident-response]
---

A friend's company got hit by eCh0raix ransomware, and I had the opportunity to analyze it indirectly. Here is my experience covering ransomware information, recovery company business models, the victim company's perspective, and community debates.

## TL;DR

- A friend's company got hit by eCh0raix ransomware; I analyzed it indirectly.
- Recovery companies sometimes negotiate directly with hackers to recover files, and this negotiation cost is included in their quote.
- Many sectors still do not (or cannot) pay attention to security. (There seem to be many opportunities for profit using security technology.)

About a month ago, I got a call from a friend saying their company's NAS server appeared to be infected with ransomware. The company has nothing to do with IT, but it is a reasonably large company in its field (design-related).

I went to the company immediately, but the recovery company that the CEO had already called had taken the NAS server, so I could not examine the actual malware sample or server. However, I was able to get one encrypted file that my friend had downloaded beforehand and the readme file left by the hacker. I also had a brief conversation with the recovery company representative on-site, and since this ransomware is well-known, I could gather information through online searches.

## What Ransomware Is This?

- It is called eCh0raix, primarily targeting NAS servers (QNAP, Synology) used for file sharing.
- It exploits known vulnerabilities in these NAS servers to attack and encrypt files inside.
- The initial version appeared in early 2019, and a variant emerged in 2021. This incident involved the 2021 variant.
- There are already many analysis articles available:
  - [2019 version analysis](https://www.anomali.com/blog/threat-actors-utilizing-ech0raix-ransomware-change-nas-targeting) by Anomali
  - [2021 version analysis](https://unit42.paloaltonetworks.com/ech0raix-ransomware-soho/) by Unit 42

## How the Ransomware Works

I found a publicly available malware sample and analyzed it (Go Lang, no obfuscation):

1. Receives the encryption key, readme file, and Bitcoin wallet address from the hacker's server (C2, SOCKS5 proxy + onion URL).
2. Encrypts files with specific extensions (.doc, .xls, .pdf, etc., over 500 types) using AES-256 CFB and appends ".encrypted" to filenames.
3. Leaves a text file with the hacker's instructions ("README_FOR_DECRYPT.txtt").
4. The instructions contain the hacker's website address (Tor onion URL, may differ per victim).
5. The URL shows the Bitcoin amount to send (0.07 BTC for my friend's company) and wallet address (different per victim), along with a live chat feature and status window ("waiting payment...").

The URL shows "eCh0raix" and the malware contains that string, which is presumably how it got its name.

## Solutions

1. If malware or logs remain on the server, analyze them to obtain the C2 URL and directly access it to get the decryption key. (I confirmed the URL from the public sample.) However, since each victim has a different address, you need to extract it from the actual malware.

2. Pay the hacker directly and receive the decryption program. These days, hackers often recover files after receiving payment to build trust relationships. There are community posts saying eCh0raix hackers provided recovery programs after payment.

## Timeline

- **Oct 17**: Friend's company NAS server infected with ransomware.
- **Oct 18**: Received call from friend. Got one encrypted file and readme file. Recovery company took the NAS server.
- **Oct 19**: Recovery company requested a quote and started work.
- **Oct 23**: Checked the hacker's website directly - status changed to "paid" and decryption program was available for download. Downloaded the program, extracted the key, and confirmed the sample file could be recovered. Price had changed from 0.07 BTC to 0.056 BTC.
- **Oct 26**: Still no contact from the recovery company.
- **Oct 27**: Recovery company recovered the original files. However, they provided them on a separate hard drive and returned the NAS server still encrypted. (Should they not have recovered the NAS too?)

## What I Learned

### 1. Ransomware Business Model

- Since the goal is to obtain money by spreading ransomware, rather than using 0-days, they simply create exploits using easily accessible known vulnerabilities and CVEs to attack PCs and servers and encrypt files.
- They can use different encryption keys, wallet addresses, and URIs for each victim.
- They sometimes demand different amounts based on the victim company's size, and there is some room for negotiation.
  - According to the recovery company representative, a previous victim was asked for 1 billion won.
  - In this case, I confirmed the price changed from 0.07 BTC to 0.056 BTC.
- When victims pay, they provide recovery methods or share decryption programs.
- While there is a possibility of scamming, they sometimes recover files to build trust relationships and develop a sustainable business model.
- With Ransomware as a Service (RaaS) being active, anyone with basic knowledge could probably set this up easily.

### 2. Recovery Company Business Model

- They recover files using the solutions mentioned above. They sometimes negotiate directly with hackers to reduce the price, and this negotiation cost is included in the quote.
- If the recovery company can recover files without paying the hacker (by analyzing the malware or obtaining keys from logs), they can reduce costs and generate more profit.
- Despite the recovery company's effort, time, and cost, they cannot receive payment if the hacker scams them or recovery fails, so they always carry risk.
- The recovery company representative said they offer prepayment and postpayment options. Since postpayment carries risk, they prefer prepayment and offer discounts for it. They said this is something they think about a lot, and these risks make the quote quite expensive.
- Since recovery is their main business, they often do not pay attention to post-incident handling to prevent recurrence.
- There are quite a few advertisement posts from recovery companies on Naver blogs.

In this case, the original demand of 0.07 BTC was reduced to 0.056 BTC, and the status changed to "paid," so it appears the company negotiated directly. (Of course, there was no reduction in the initial quote presented to my friend's company.)

### 3. Victim Company Perspective and Importance of Post-Incident Handling

- From the attacked company's perspective, considering the trade-off between paying money or giving up data is very difficult.
- They must consider various scenarios like whether the hacker will scam them or whether recovery will work properly after payment, but statistics to base decisions on are not easily available.
- Victims usually lack security knowledge, so they will not update software or block network access, and will inevitably fall victim to the same attack again.
  - The recovery company representative said there was a case where the same victim got hit by the same attack about 6 months later.
- My friend's company was just planning to use it again after the recovery company fixed it.

I informed my friend about the need for the basic firewall and network blocking supported by NAS servers, resetting admin accounts, and updating firmware and software.

## Community Debates

### 1. Does Ransomware Only Have Negative Effects?

Ransomware is an "attack" that extorts money from others. But does ransomware only have negative functions?

Could it raise overall security levels by forcing security-unaware people to become security-conscious after being hit? From a certain perspective, could it be seen as an indirect bug bounty effect? If appropriate rewards and social mechanisms were established, could these hackers be brought into the open and utilized to check overall social security?

This might be too optimistic of a view...

### 2. Does Sharing Ransomware Analysis Always Benefit the Community?

Some posts argue that if ransomware is analyzed in detail and shared, hackers also monitor those communities and will continuously improve their ransomware while learning.

Some view sharing negatively because the endless attack-defense relay will lead to more difficult and complex ransomware in the future, making analysis harder.

For eCh0raix, the 2019 version created encryption keys locally, but the 2021 version was redesigned to receive encryption keys from C2 servers.

There is a counter-argument that even without sharing analysis, hackers will evolve on their own and create more complex and difficult ransomware.

### 3. Could Hackers and Recovery Companies Cooperate?

As recovery companies resolve cases for multiple victims and continuously negotiate with hackers, could their interests align and they might work together informally?

It is probably rare, but there could be cases where recovery company = hacker.

## Conclusion

- Like IoT botnets, ransomware businesses using known vulnerabilities seem to be quite widespread.
- Many sectors still do not (or cannot) pay attention to security. (There seem to be many opportunities for profit using security technology.)
- I would like to experience working with law enforcement agencies that catch ransomware organizations someday, but it might involve threats to life, and I have great respect for those working in threat intelligence.
