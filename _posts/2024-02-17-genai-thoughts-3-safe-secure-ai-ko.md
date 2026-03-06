---
title: "[Korean] GenAI에 대한 잡생각 (3/4): Safe, Secure AI"
date: 2024-02-17 10:02:00 +0900
categories: [Blog]
tags: [ai, genai]
lang: ko
---

*Read this post in [[English]](/posts/genai-thoughts-3-safe-secure-ai/).*

이 글은 4개 구성으로 나뉘어 있다.
- [1. AI의 발전, 디지털화된 '나'의 증명?](/posts/genai-thoughts-1-digital-identity-ko/)
- [2. 가짜 정보, 사기, 피싱](/posts/genai-thoughts-2-misinformation-ko/)
- **3. Safe, Secure AI** (이 글)
- [4. AI 뇌피셜](/posts/genai-thoughts-4-speculation-ko/)

---

사실 보안 전문가들은 아마도 AI의 안정성(safety)보다 보안성(security)에 더 관심을 가질 것 같다. 작년 10월, 미국 바이든 대통령의 ["Safe, secure AI"에 관한 행정명령](https://bidenwhitehouse.archives.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/)에는 "AI 시스템을 안전(safe and secure)하고 신뢰(trustworthy)할 수 있도록 하는 표준, 도구, 테스트의 개발"과 "중요 소프트웨어의 취약점을 찾고 고칠 수 있도록 하는 AI 툴을 개발하는 진보된 cybersecurity 프로그램"의 필요성을 강조한다.

이러한 노력의 일환으로, 미국 방위고등연구계획국(DARPA)은 작년 DEFCON에서 AIxCC 대회를 공개하였다. [AIxCC](https://aicyberchallenge.com/)는 AI를 활용해 프로그램의 취약점을 찾고, 공격하고, 패치하는 과정을 자동화하는 대회로, 이미 전 세계 최고 수준의 팀들이 참여하고 있다.

이러한 대회 뿐만 아니라, MS, 구글, 엔비디아와 같은 빅테크 회사들은 AI 서비스를 안전하게 만들기 위하여 자체적으로 AI 서비스를 점검할 수 있는 AI Red Team을 조직하고 있다. 특히, MS와 구글의 경우 자사 AI 서비스를 사용하는 기업들이 그들 자체적으로도 AI Red Team을 구성하도록 장려하고 있다.

- [Microsoft AI Red Team](https://www.microsoft.com/en-us/security/blog/2023/08/07/microsoft-ai-red-team-building-future-of-safer-ai/)
- [Google AI Red Team](https://blog.google/technology/safety-security/googles-ai-red-team-the-ethical-hackers-making-ai-safer/)

과거 연구실에서 드론과 자율주행차의 보안에 대해 공부하면서, 진정한 보안은 단순히 보안성(security)에만 집중하는 것이 아니라 안정성과 보안을 함께 고려해야한다(safety + security)는 것을 배웠다. 드론이나 자율주행차의 경우 센서 데이터를 측정하고 분석해서 동작에 반영하는 실시간성이 매우 중요하며 여기에 문제가 생길 경우 추락, 충돌 등 중대한 문제를 발생시킬 수 있기 때문이다. 따라서, 실시간성을 중요시 하는 시스템에서 보안은 safety를 깨는 관점도 고려가 되어야 한다.

이와 유사하게, AI 서비스를 점검할 때도 AI 모델의 safety까지 고려가 되어야 하지 않을까? 이런 관점에서 위의 마소에서 설명한 자료에도 AI Red Team은 더욱 포괄적인(more expansive) 역할을 언급하고 있다.

> The practice of AI red teaming has evolved to take on a more expanded meaning: it not only covers probing for security vulnerabilities, but also includes probing for other system failures, such as the generation of potentially harmful content.

구글 또한 AI Red Team에 관해 이와 유사한 관점을 공유하고 있다.

> Traditional red teams are a good starting point, but attacks on AI systems quickly become complex, and will benefit from AI subject matter expertise.

> Addressing red team findings can be challenging, and some attacks may not have simple fixes...

요새 보안 회사들은 AI의 프롬프트 입력값이 safety관점을 위배하는 지 여부를 탐지하는 솔루션을 개발하고 있다. 솔루션을 활용하여 사용자의 프롬프트를 먼저 검증하고, 검증된 안전한 프롬프트만 모델에 입력하는 식이다. 과연 어디를 어떻게 검증할 것인가에 대해서 다양한 고민거리가 생길 수 있다.

삼성은 작년 말부터 자체 AI 서비스 개발을 시작하여 도입하고 있다. 이 과정에서 몇몇 AI 서비스에 대한 보안 점검을 수행할 기회가 있었는데, 내부에서도 safety에 대한 관점은 논쟁거리이다. 이와 별개로, 실제 점검 과정에서 느낀 점은 기술이 급속도로 발전함에 따라 이러한 기술을 적용한 서비스의 보안을 위해서는 취약점을 찾기 위한 특정 기술에 대한 지식뿐만 아니라, 산업과 과학기술 전반에 걸친 광범위한 지식이 필요하다는 점이다. 새로운 유형의 취약점, 서비스 개발자와 보안 엔지니어 사이의 관점 차이, 런칭 스케줄에 맞춰 협력하는 과정 등 외부에서는 경험하기 어려운 경험을 할 수 있었는데, 기회가 된다면 이러한 경험을 공유해보고 싶다.
