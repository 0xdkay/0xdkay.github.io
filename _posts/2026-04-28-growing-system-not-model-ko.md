---
title: "코딩 에이전트의 긴 세션, 끝나면 무엇이 남을까"
date: 2026-04-28 09:00:00 -0400
last_modified_at: 2026-10-18 09:00:00 -0400
categories: [Blog]
tags: [ai, agents, memory, context-engineering, harness-engineering]
lang: ko
translation_key: growing-system-not-model
description: "수십만 토큰을 쓴 세션이 끝나도 모델은 대개 그대로다. 그럼 세션에서 무엇을 골라 남기고, prompt, context, harness, loop 중 어디에 쌓아야 할지 생각해 봤다."
image:
  path: /assets/img/posts/growing-system-not-model.webp
  alt: "AI로 만든 그림: 세션이 context, harness, loop를 거쳐 시스템에 쌓이는 모습"
---

AI 에이전트와 긴 작업을 하다 보면 한 세션 안에서 꽤 많은 일이 일어난다. 문제를 인식하고, 개선 방법을 찾아보고, 시도하고, 아이디어를 발전시키고, 테스트하고, 피드백을 받는다. 그렇게 수십만 토큰을 쓰고 나면 다음 세션의 에이전트는 좀 더 똑똑해져 있을까?

대부분은 아니다. 지금 쓰는 모델은 대개 고정되어 있어서, 답변을 많이 생성한다고 모델 안의 학습 내용이 바뀌지는 않는다. 새 세션을 열면 에이전트는 그 시행착오를 모르는 상태로 다시 시작한다.

그렇다면 긴 세션의 시행착오는 그냥 버려지는 걸까? 나는 그렇지 않다고 생각한다. 모델이 배우지 않아도 모델을 둘러싼 시스템은 배울 수 있다. 요즘 자주 듣는 prompt engineering, context engineering, harness engineering도 결국 이 시스템의 어느 부분을 다듬느냐의 문제인 것 같다. 이 글은 그 시스템이 무엇을 남기고, 무엇을 버리고, 어디까지를 모델에 맡기는지에 대한 이야기다.

## 세션은 실험 기록이다

세션이 끝났을 때 최종 답변만 남기면 어떤 방법이 실패했는지, 어떤 가정이 틀렸는지, 왜 판단을 바꿨는지가 사라진다. 그렇다고 대화 전체를 다음 세션에 그대로 넣으면 이미 버린 아이디어와 그때만 유효했던 환경 정보까지 다시 들어간다.

그래서 세션은 경험 그 자체라기보다 실험 기록에 가깝다. 기록에서 다음에 쓸 만한 것을 골라내야 하는데, 골라낼 것도 한 종류가 아니다.

- **실패:** 무엇을 시도했고 왜 안 됐나?
- **결정:** 무엇을 골랐고 어떤 trade-off를 받아들였나?
- **지식:** 무엇을 확인했고, 근거와 유효 범위는 어디까지인가?
- **스킬:** 다음에도 반복할 절차와 그 검증 방법은 무엇인가?

이걸 구분하지 않으면 그때만 통했던 해결책이 일반 지식처럼 검색되거나, 이미 버린 판단이 다음 작업의 전제가 된다.

원본 세션을 보관하는 것과, 그중 일부를 다음 작업에서 실제로 꺼내 쓰는 memory(active memory)로 올리는 것은 따로 결정해야 한다. 원본은 나중에 다시 확인하려고 보관할 수 있지만, 실제로 검색되고 주입되는 memory에는 검증된 일부만 들어가야 한다.

## 저장보다 승격 규칙

한 번 성공한 방법을 곧바로 active memory에 넣으면 우연히 통한 것과 잘못된 자기평가가 함께 쌓인다. 그래서 최소한 이런 단계가 필요하다.

1. **추출:** 실패, 결정, 지식, 스킬 후보를 나눈다.
2. **근거 연결:** 원본, 테스트 결과, 유효 범위와 반례를 붙인다.
3. **검증:** 그 세션과는 다른 과제에서 다시 시험한다.
4. **승격과 갱신:** 통과한 것만 쓰고, 이후 결과에 따라 신뢰도를 바꾸거나 다시 내린다.

잠자는 동안 뇌가 기억을 정리하는 것에 비유할 수도 있다. 다만 실제로 만들어 보면 모으고, 종합하고, 다른 영역에 적용해 보고, 다시 검증하는 데이터 파이프라인에 더 가깝다. 중요한 건 저장 용량이 아니라 어떤 후보를 올리고, 어떤 실패가 나왔을 때 다시 내리는지에 대한 규칙이다. 검증에 실패한 후보도 지우기보다 실패한 조건과 함께 남겨 두면 같은 실패를 반복하는 비용을 줄일 수 있다.

비슷한 아이디어는 연구에서도 찾을 수 있다. Reflexion은 실패한 이유를 글로 남겨 다음 시도에 넘겨줬고[^reflexion], Voyager는 Minecraft에서 실행 가능한 코드 스킬을 쌓아 새 과제에 다시 썼다[^voyager]. 위의 승격 루프 전체를 이 연구들이 검증한 것은 아니고, 여기서는 아이디어를 참고했다.

세션에는 개인정보, 자격 증명, 기밀 코드도 들어간다. 무엇을 모을지, 누가 볼 수 있는지, 얼마나 보관하고 어떻게 지울지를 정하지 않고 memory를 키우면 경험뿐 아니라 실수와 위험까지 반복된다.

## 그 시스템은 어디에 있을까

최근 몇 년 사이 AI 쪽에서는 "~ engineering"이라는 말이 계속 새로 나왔다. 처음에는 질문 문장을 잘 쓰는 prompt engineering이 중심이었다. 2025년 중반부터는 context engineering이라는 말이 많이 쓰였는데, Anthropic은 이걸 prompt engineering의 자연스러운 다음 단계로 본다[^anthropic-context-engineering]. 프롬프트 문장 하나보다 모델이 매 순간 보는 정보 전체를 관리하는 게 더 중요해졌다는 것이다.

2026년 2월에는 OpenAI가 harness engineering이라는 글을 냈다[^openai-harness]. 사람이 코드를 직접 쓰지 않고 Codex만으로 제품을 만든 실험인데, 이때 엔지니어의 일은 코드를 쓰는 게 아니라 에이전트가 일할 환경을 만들고, 의도를 명확히 하고, 피드백 루프를 만드는 쪽으로 바뀌었다고 한다. 글에 나온 표현을 빌리면 "Humans steer. Agents execute."다.

이름은 계속 바뀌지만 방향은 비슷해 보인다. 사람이 신경 쓰는 지점이 모델에게 주는 문장에서 모델 바깥의 구조로 한 칸씩 옮겨가고 있다. 이 글에서도 이 흐름을 따라 에이전트를 네 층으로 나눠 보려고 한다.

예를 들어 에이전트에게 "로그인 실패 버그를 고쳐줘"라고 요청하는 상황이라면 네 층은 이렇게 나뉜다.

- **Prompt:** 무엇을 원하는가. "로그인 실패 버그를 고쳐줘."
- **Context:** 어떤 코드, 로그, 테스트, 과거 결정을 지금 모델에게 보여줄 것인가.
- **Harness:** 어떤 파일과 로그를 읽고, 어떤 도구와 권한으로 실행할 수 있는가.
- **Loop:** 결과가 틀렸을 때 어떻게 검증하고, 다시 시도하고, 되돌리고, 사람에게 올릴 것인가.

로그를 읽을 수 있게 해주는 건 harness이고, 그중 무엇을 모델에 보여줄지는 context가 고른다. Prompt는 목표를 말하고, loop는 결과를 보고 다음 행동을 할지 멈출지 정한다. 이렇게 나눠 보면 프롬프트로는 풀 수 없는 문제가 보인다. 테스트를 실행할 수 없는 모델에게 "꼼꼼히 검증하라"고 아무리 써도 실제 검증은 일어나지 않는다.

앞에서 말한 승격 루프도 이 네 층 위에서 돈다. 무엇을 기억으로 올려서 보여줄지는 context의 문제이고, 그걸 다른 과제에서 다시 시험하는 건 harness와 loop의 일이다.

## 모델이 가져가는 것, 밖에 남는 것

모델이 좋아지면 예전에 밖에서 강제하던 보조 구조, 즉 scaffold의 일부는 모델의 기본 능력이 된다. 작업을 작은 단계로 나누기, 상황에 맞는 도구 고르기, 실패하면 다른 방법을 시도하기처럼 예전에는 긴 planning prompt로 시키던 것들이다. 모델이 이런 일을 기본으로 해내게 되면, 같은 작업을 더 낮은 reasoning effort로 해 볼 수도 있다. 다만 낮추는 것 자체가 목표는 아니고, 같은 성공률과 신뢰성을 더 낮은 비용으로 낼 때 개선이라고 할 수 있다.

반대로 구조적으로 모델 밖에 남을 수밖에 없는 것도 있다.

- **최신 상태:** 지금의 코드, 오늘 나온 로그, 외부 시스템의 응답은 모델이 학습할 때 존재하지 않았다.
- **실행 결과:** build log, test 출력처럼 실제로 돌려 봐야 나오는 사실이다. 모델이 자신 있게 설명하는 것과는 다르다.
- **권한:** 어떤 파일과 production 동작을 허용할지, 누가 승인할지는 조직이 정한다.
- **검증:** 결과가 실제로 맞는지는 모델의 자기 판단이 아니라, 테스트를 돌리거나 실제 환경을 확인하는 것처럼 모델 밖에서 확인해야 한다. 이 경계를 skill 단위로 어떻게 설계할지는 [다음 글](/posts/a-skill-is-a-prompt-with-an-eval-ko/)에서 다뤘다.

무엇이 모델 안으로 들어갔는지는 느낌으로 판단하지 않는 게 좋다. 같은 작업, 같은 도구, 같은 평가를 두고 planning prompt나 self-check 같은 보조를 하나씩 빼 본다. 성공률, 비용, 지연, 사람 개입이 그대로라면 적어도 그 조건에서는 그 scaffold가 더 필요 없다. 반대로 최신 상태나 실행 결과, 권한 검사를 뺐을 때 실패한다면 그건 여전히 바깥 시스템이 맡아야 하는 부분이다.

## 봇들의 SNS

지금까지는 에이전트 하나가 자기 세션에서 배우는 이야기였다. 에이전트끼리 경험을 나누면 어떨까?

2026년 1월에 Moltbook이라는 서비스가 나왔다[^moltbook]. AI 에이전트를 위해 만든, Reddit 같은 SNS다. 여기 모이는 에이전트는 대부분 OpenClaw라는 오픈소스 에이전트로 돌아간다. 실제로 얼마나 자율적으로 움직이는지는 논란이 있지만, 봇들끼리 정보를 주고받는 공간이 생겼다는 것 자체가 재밌다.

이걸 보면서 든 생각은 이렇다. 에이전트마다 다른 정보원과 도구를 쓴다면, 이런 SNS에서 누가 무엇을 아는지 찾고 필요한 지식을 빠르게 나눌 수 있다. 다양한 눈과 귀로 들어온 정보를 바로 주입받는 것이 시스템이 스스로 나아지는 자가발전 루프의 핵심이 될 수 있지 않을까?

문제는 오류도 같은 속도로 퍼진다는 것이다. 특정 설정에서만 나온 false positive가 "이 라이브러리 전체에 취약점이 있다"로 요약되고, 다른 에이전트가 원본을 확인하지 않고 그걸 다시 인용하면 근거 없는 결론이 빠르게 다들 믿는 사실이 되어버린다. 그래서 공유되는 지식에는 적어도 원본이 어디인지, 누가 검증했는지, 어디까지 유효한지, 언제 만료되는지가 같이 있어야 한다. 빠른 지식 공유는 빠른 개선 루프이면서 동시에 빠른 오류 전파 루프다.

## 마치며

결국 성장하는 건 모델 하나가 아니라 prompt, context, harness, loop가 함께 있는 시스템인 것 같다. 좋은 시스템은 모든 기록을 기억하지 않는다.

## 3줄요약

- 고정된 모델은 세션을 아무리 많이 해도 스스로 배우지 않는다. 대신 세션에서 실패, 결정, 지식, 스킬을 골라 검증한 뒤 memory로 올리는 바깥 시스템이 성장한다.
- 모델이 좋아지면 계획이나 도구 선택 같은 보조 구조는 모델 안으로 들어가지만 최신 상태, 실행 결과, 권한, 검증은 밖에 남는다. 무엇이 들어갔는지는 하나씩 빼 보는 실험으로 확인한다.
- 에이전트끼리 지식을 나누면 개선도 빨라지지만 오류도 같은 속도로 퍼진다. 공유되는 지식에는 출처, 검증, 유효 범위가 붙어 있어야 한다.

## 덧붙임 (2026년 10월)

이 글을 쓰고 몇 달 뒤에, 여기서 Loop라고 부른 층이 따로 이름을 얻어서 덧붙인다.

2026년 6월쯤부터 loop engineering이라는 말이 쓰이기 시작했다[^osmani-loop-engineering]. 위에서 이야기한 OpenClaw를 만든 Peter Steinberger는 이제 코딩 에이전트에게 직접 프롬프트를 쓰지 말고, 에이전트에게 줄 프롬프트를 쓰는 루프를 설계해야 한다고 했다(Addy Osmani의 정리[^osmani-loop-engineering]).

구조는 대략 이렇다. 정해진 시간이나 저장소 이벤트에 에이전트를 실행하고, 기계가 확인할 수 있는 조건이 맞으면 멈추고, 진행 상황은 대화 밖의 파일에 남기고, 결과는 다른 sub-agent가 검증하고, 안 되는 건 사람에게 넘긴다. 8월에 나온 loop engineering 논문도 잘 만든 루프의 구성 요소를 거의 이렇게 정리한다[^loop-engineering-paper].

나도 요즘 루프를 많이 쓴다. 에이전트가 중간에 멈추거나 내 답을 기다리고 있으면 다시 일을 시키는 auto nudge가 필요해서, scheduled prompt나 cron job을 걸어 두고 에이전트를 주기적으로 돌리는 방식을 쓰고 있었다. 이름이 붙기 전부터 비슷한 걸 하고 있었던 셈인데, 막상 돌려 보면 언제 멈추게 할지, 무엇을 기록으로 남길지, 어떤 결과를 믿고 넘어갈지가 계속 문제가 된다. 루프를 어떻게 잘 만들지는 앞으로 더 고민해봐야겠다.

8월에는 Jeff Dean이 구글을 나와 Discovery Loop라는 회사를 세웠다[^techcrunch-jeff-dean]. 같이 창업한 Sanjay Ghemawat, Quoc Le, Oriol Vinyals도 모두 구글 출신이라고 하는데, 솔직히 나는 이 중에 Jeff Dean밖에 몰랐다. 1999년부터 27년 가까이 구글에서 일한 그 Jeff Dean이 회사를 나와서 실험 루프를 자동화하겠다고 하니까 좀 흠칫했다.

실험을 제안하고, 구현해서 돌리고, 결과를 보고, 다시 고치는 과정을 AI로 수천 개씩 병렬로 돌리겠다고 한다[^discovery-loop]. 이 글 처음에 적은 흐름과 거의 같은 루프다. 재밌는 건 Discovery Loop도 자기들이 풀 수 있는 대상을 "측정 가능한 결과가 있는 학습 루프"라고 설명한다는 점이다[^discovery-loop]. 루프를 자동으로 돌리려면 결국 무엇이 성공인지 모델의 판단이 아니라 측정으로, 밖에서 확인할 수 있어야 한다. 이건 이 글에서 말한 '검증은 모델 밖에서 해야 한다'는 이야기와 같은 것 같다.

9월에 나온 Dream-RSI 논문은 이런 루프를 더 싸게 돌리는 방법을 보여 준다[^dream-rsi]. 에이전트의 시도는 어떤 시도에서 어떤 시도가 갈라져 나왔는지를 보여 주는 discovery tree로 쌓이고, 어느 가지에서 이어서 시도할지는 탐색 전략이라는 코드가 고른다. 이 discovery tree에 시도마다의 결과까지 남겨 두고, 새 탐색 전략을 매번 실제로 돌려 보는 대신 이 기록 위에서 먼저 시험해 본다. 논문은 이걸 꿈꾸기(dreaming)라고 부른다. 바뀌는 건 탐색 전략 코드뿐이고 모델과 평가기는 그대로인데, 몇몇 과제에서는 결과를 비슷하게 유지하거나 더 좋게 만들면서 비용을 크게 줄였다. 앞에서 기억을 정리하는 걸 잠자는 동안의 뇌에 비유했는데, 정말로 지난 기록 위에서 꿈을 꾸게 한 셈이다. 실패한 시도까지 남겨 둔 기록이 다음 탐색을 고치는 재료가 되고, 모델은 그대로 두고 바깥 시스템이 나아진다.

다만 Dream-RSI도 결과에 점수를 매기는 평가기가 있어야 돈다. 그렇다면 결과를 측정하기 어려운 문제에서는 이런 루프를 어떻게 돌릴 수 있을까?

## 참고 자료

* 참고 자료
{:footnotes}

[^reflexion]: [Shinn et al., Reflexion: Language Agents with Verbal Reinforcement Learning (arXiv, 2023-03)](https://arxiv.org/abs/2303.11366)
[^voyager]: [Wang et al., Voyager: An Open-Ended Embodied Agent with Large Language Models (arXiv, 2023-05)](https://arxiv.org/abs/2305.16291)
[^anthropic-context-engineering]: [Anthropic, Effective Context Engineering for AI Agents (2025-09-29)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
[^openai-harness]: [OpenAI, Harness Engineering: Leveraging Codex in an Agent-First World (2026-02-11)](https://openai.com/index/harness-engineering/)
[^moltbook]: [Wikipedia, Moltbook](https://en.wikipedia.org/wiki/Moltbook)
[^osmani-loop-engineering]: [Addy Osmani, Loop Engineering (2026-06-07)](https://addyosmani.com/blog/loop-engineering/)
[^loop-engineering-paper]: [Lulla et al., Loop Engineering: Building Blocks, Adoption, and Impact (arXiv, 2026-08)](https://arxiv.org/abs/2608.21884)
[^techcrunch-jeff-dean]: [TechCrunch, Jeff Dean and Other Top AI Researchers Are Leaving Google to Launch Their Own Startup (2026-08-05)](https://techcrunch.com/2026/08/05/jeff-dean-and-other-top-ai-researchers-are-leaving-google-to-launch-their-own-startup/)
[^discovery-loop]: [Discovery Loop, Continuous Exploration](https://www.discoveryloop.com/)
[^dream-rsi]: [Zheng et al., Dream-RSI: Recursive Self-Improvement through Evolving Worlds (arXiv, 2026-09)](https://arxiv.org/abs/2609.14858)
