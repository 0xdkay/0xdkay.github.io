---
title: "[Korean] AI로 가속화되는 공격과 방어의 갭"
date: 2026-03-06 00:00:00 -0500
categories: [Blog]
tags: [ai, security, vulnerability, patch-gap]
lang: ko
---

*Read this post in [[English]](/posts/ai-accelerating-attack-defense-gap/).*

"취약점 공개 → 실제 공격 코드 등장"까지 걸리는 시간이 2.3년에서 [1.6일](https://zerodayclock.com/)로 줄어들었다고 한다.

![From Vulnerability to Exploitation](/assets/img/from_vuln_to_exploit.png){: w="700" }
_Source: [zerodayclock.com](https://zerodayclock.com/)_

AI를 활용한 취약점 분석, exploit 작성, 대규모 스캐닝 같은 작업들이 점점 더 빠르게 이루어지고 있다. AI가 사람보다 더 똑똑한가 하는 문제를 떠나서, 속도 측면에서는 이미 사람이 따라가기 어려운 수준까지 온 것처럼 보인다.

그렇다면 방어는 이 속도를 따라갈 수 있을까.

패치가 존재하더라도 실제 시스템에 배포되기까지는 항상 물리적인 시간 차이, 즉 patch gap이 존재한다. 예전에 연구할 때 들은 이야기로는 스마트폰 취약점을 패치하더라도 전 세계 수백 개의 통신사를 거쳐 사용자 단말에 배포되기까지 최소 6개월 이상 걸릴 수 있다고 한다.

이런 갭들은 점점 줄어들고 있지만, 패치가 공격의 속도를 따라갈 수 있을까. 게다가 사용자들이 항상 즉시 업데이트를 하는 것도 아니다. 이런 이유로 patch gap을 활용한 공격은 오히려 더 커질 수도 있다.

이미 AI는 취약점을 대량으로 찾는 단계에 도달하고 있다. AI 보안 스타트업 AISLE은 OpenSSL에서 [CVE 12개를 찾았고](https://aisle.com/blog/aisle-discovered-12-out-of-12-openssl-vulnerabilities), [Anthropic](https://red.anthropic.com/2026/zero-days/), [OpenAI Aardvark](https://openai.com/index/introducing-aardvark/) 등 모델 회사들도 AI 기반 취약점 분석을 진행하고 있다.

만약 LLM이 높은 성능으로 취약점을 찾고 패치까지 제안할 수 있다면, 개발 단계에서 이것을 도입해 사용할 수 있다면, pentester의 역할은 어디로 이동하게 될까.

취약점 점검을 하는 사람들은 앞으로 무엇을 봐야 할까.

예전에는 "이 코드에 취약점이 있는가?" 라는 질문을 했다면, 요즘은 조금 다른 질문을 하게 된다. "이 취약점이 실제로 어떤 공격 경로를 만들 수 있는가?" "이 시스템이 침해되더라도 어디까지 영향을 줄 수 있는가?"

취약점을 완전히 제거하는 접근이 현실적으로 가능할까. 오히려 취약점이 존재하더라도 피해 범위를 제한하는 구조, 즉 blast radius를 줄이는 설계가 더 중요한 문제가 될 수도 있다. 최근 Google이 Attack Path Analysis / Simulation을 하는 회사인 [Wiz를 인수](https://cloud.google.com/blog/products/identity-security/google-announces-agreement-acquire-wiz)한 것도 이런 흐름과 무관하지 않아 보인다. 취약점을 찾는 것보다, 취약점이 실제로 어떤 공격 경로를 만들 수 있는지 분석하는 문제가 점점 더 중요해지고 있기 때문이다.

단순히 주어진 코드의 취약점을 찾는 것만으로는 너무 한정적일 수 있다. 운영 환경의 설정, 권한 구조, 다른 시스템과의 연계, 실제 서비스 흐름 등 여러 도메인을 넘나들며 **시스템 전체의 맥락(context)**을 이해하는 문제가 더 중요해질 수도 있다.

재밌는 시도도 있다. Meta는 코드를 단순히 토큰이나 단어 단위로 보는 것이 아니라, 코드 실행의 흐름과 상태 변화를 모델링하려는 접근을 보였다.

[Code World Model](https://ai.meta.com/research/publications/cwm-an-open-weights-llm-for-research-on-code-generation-with-world-models/)

아직은 실험적인 연구지만, 이런 접근이 보안 영역에도 적용된다면 단순히 코드 취약점을 찾는 수준을 넘어 시스템이 어떤 맥락에서 어떻게 실패할 수 있는지를 이해하는 분석이 가능해질지도 모른다.

앞으로는 더 빠른 사고 전환이 가능한 유연한 대응 능력이 점점 더 중요해질 것 같다.
