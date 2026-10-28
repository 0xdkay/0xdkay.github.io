---
title: "AI 리버싱으로 베낄 수는 있어도, 취약점은 정확히 봐야 한다"
date: 2026-10-27 00:00:00 -0400
categories: [Blog]
tags: [ai, security, vulnerability, reverse-engineering, binary-patching, patch-gap, agents, context-engineering]
topics: [ai-security, firmware-binary-analysis]
lang: ko
translation_key: ai-reverse-engineering-and-binary-patching
description: "요즘 AI로 상용 프로그램을 베꼈다는 얘기가 많지만, AI가 바이너리에서 읽어 낸 건 원본이 아니라 빈칸을 그럴듯하게 채운 코드다. 베끼기엔 그걸로 충분할지 몰라도, 취약점을 찾을 때는 그 빈칸이 문제가 된다."
image:
  path: /assets/img/posts/ai-reverse-engineering-and-binary-patching.webp
  alt: "AI로 만든 그림: 왼쪽에는 컴파일하면서 세부가 사라진 원본 바이너리와 그 안의 진짜 취약점이, 가운데에는 컴파일러와 난독화의 벽이, 오른쪽에는 AI가 퍼즐처럼 짐작으로 채운 재구성과 그 틈에서 놓친 버그가 있는 모습"
---

올해 4월 GitHub에 REA(Reverse Engineer Anything)라는 오픈소스가 올라왔다. 10월 27일 기준 star가 40만 개 가까이 된다[^rea-github]. Claude Code나 Codex 같은 coding agent에 MCP로 Hopper, Ghidra, IDA 같은 분석 도구를 붙이고, 분석 workflow를 skill로 깔아 주는 도구다. Hacker News에서는 요즘 쏟아지는 Photoshop, Office 클론이 이것 때문 아니냐는 얘기도 나왔다[^hn-rea].

README는 이렇게 권한다. 앱에서 마음에 드는 기능을 보면 에이전트에게 소스 코드 없이 그 앱을 들여다보게 하고, 기능이 어떻게 동작하는지 설명하게 하고, 내 프로젝트에 같은 기능을 만들게 하라고[^rea-github]. 예시도 꽤 정밀하다. 옛 게임 DX-Ball의 사운드 계산 함수를 C로 다시 만들었는데, 이 코드는 원래 x86 함수와 3,205개 입력에서 같은 값을 내고, 다시 컴파일하면 원본과 똑같은 63바이트가 나온다[^rea-dx-ball].

그렇다면 이렇게 만든 건 기능을 베낀 걸까, 코드를 베낀 걸까? 소프트웨어를 통째로 복제할 수는 있을까? 그리고 AI가 읽어 낸 코드가 원본과 다르다면, 원본을 정확히 봐야 하는 취약점 분석이나 바이너리 패칭에서는 어떤 문제가 생길까?

## AI가 베낀 프로그램, IP 문제는 없을까

REA의 DISCLAIMER는 선을 긋는다. 독점(proprietary) 소프트웨어를 복사하거나 보호받는 코드와 asset을 재현하는 일은 돕지 않고, 소스처럼 보이는 결과나 분석 보고서를 얻었다고 원본 프로그램에 대한 권리가 생기지는 않는다고 적었다[^rea-disclaimer]. GitHub에는 에이전트가 원본 소스에 접근하는 데 따른 저작권 문제를 지적하며 더 엄격한 모드를 요청하는 issue가 열려 있다[^rea-issue-2120].

README는 기능을 다시 만들라고 하고, DISCLAIMER는 코드를 재현하지는 말라고 한다. 법도 대체로 같은 곳에 선을 긋는다. 저작권은 아이디어가 아니라 표현을 보호한다. 한국 저작권법은 호환에 꼭 필요할 때만 역분석을 허용하고, 그 정보로 표현이 실질적으로 유사한 프로그램을 만드는 건 막는다[^kr-copyright-101-4]. 미국에서도 1992년 Sega v. Accolade 판결이 기능을 알아내려는 디스어셈블리를 공정이용으로 봤고, 2021년 Google v. Oracle에서 대법원도 이 판결을 공정이용의 예로 들었다[^sega-accolade][^google-oracle].

그렇다고 코드만 베끼지 않으면 되는 것도 아니다. 2012년 미국 법원은 소스 코드를 베끼지 않았더라도 화면만 봐서는 일반 사용자가 구별할 수 없다며, Tetris를 따라 만든 Mino가 저작권을 침해했다고 봤다[^tetris-xio]. 한국 대법원도 2019년 포레스트 매니아가 팜히어로사가에서 '캐릭터만 달라진 느낌'을 준다며 2심을 뒤집었지만[^farm-heroes], 올해 다크 앤 다커 사건에서는 두 게임이 유사하지 않다며 저작권이 아니라 영업비밀 침해만 인정했다[^dark-and-darker]. 법은 내 전문이 아니지만, 포레스트 매니아처럼 같은 사건도 법원에 따라 판단이 달라지는 걸 보면 어디까지가 침해인지는 아직 논쟁 중인 것 같다.

AI가 끼면 문제가 하나 더 생긴다. 모델이 바이너리에서 읽지 못한 부분을 학습 때 본 코드로 채우면 원본의 표현이 그대로 들어올 수 있다. 원본을 보지 않고 사양만 보고 다시 만드는 clean room 방식이 AI에게도 통하는지도 아직 정리되지 않았다[^reed-smith-clean-room]. Claude와 함께 처음부터 다시 쓴 chardet 새 버전은 라이선스를 LGPL에서 MIT로 바꾸면서 옛 코드와 정말 독립적인지 논란이 됐다. 새 버전을 쓴 Dan Blanchard도 원래 파일 하나가 통째로 Claude의 context에 들어가 있었고 학습 데이터에도 옛 코드가 있었다며, clean room의 근사였을 뿐이라고 인정했다. 그래도 유사도를 재 보니 겹치는 부분이 거의 없었다며 파생 저작물이 아니라고 주장한다[^chardet-blanchard].

어느 쪽이든 선을 넘지 않을 책임은 쓰는 사람에게 있다. 그런데 에이전트가 만든 코드에 원본이 얼마나 들어 있는지는 어떻게 알 수 있을까? 이걸 보려면 바이너리에서 원본이 얼마나 돌아오는지, 그리고 사라진 부분을 모델이 무엇으로 채우는지 봐야 한다.

## 원본은 얼마나 복구가 가능한가

처음에는 감으로 이렇게 생각했다. 대충 비슷한 데까지는 나오겠지만, 아무리 잘 되어 봤자 원본 프로그램과 100% 같은 코드를 얻는 건 불가능하지 않을까. 컴파일하면서 변수 이름, 주석, 매크로, 코드 구조 같은 정보가 사라지고, 그 빈 곳은 모델이 추론해서 채우기 때문이다.

숫자를 보면 사라진 정보를 되살리는 건 아직 잘 안 된다. LLM4Decompile은 디컴파일한 코드를 다시 컴파일해서 원래 테스트를 통과하는 비율(re-executability)로 성능을 잰다. 이 논문에서 디컴파일러 없이 바이너리에서 바로 소스를 만드는 모델 중 가장 좋은 모델로도, 최적화 없는 `-O0` 바이너리에서는 테스트 함수의 68%가 통과했지만, `-O1`부터 `-O3`까지는 37~40%로 떨어졌다[^llm4decompile].

DecBench는 디컴파일러 Kuna를 만든 University of Georgia의 Noelo Lab이 운영하는데, 디컴파일 결과가 원본 소스와 얼마나 정확히 같은지를 control flow 구조, 변수 type, 다시 컴파일했을 때의 바이트 일치 세 가지로 잰다. 10월 9일 기준 최적화 없는 데이터셋에서 1위인 Kuna도 셋 중 하나라도 완벽하게 맞힌 함수는 51.4%로 절반을 겨우 넘었고, IDA의 디컴파일러인 Hex-Rays는 49.1%로 절반에 못 미쳤다[^decbench]. 최적화된 바이너리에서는 Codex 에이전트가 Kuna를 크게 앞섰지만, 그 Codex도 type을 전부 맞힌 함수는 25.1%뿐이었다[^decbench-data].

반대로 앞의 DX-Ball 예시처럼 바이트까지 똑같이 맞추는 건 가능하다. 다시 컴파일했을 때 원본과 같은 기계어가 나오는 C 코드를 찾는 matching decompilation이다. 다만 바이트가 같아도 이름과 의미는 따로 붙여야 한다. Chris Lewis는 Nintendo 64 게임 Snowboard Kids를 에이전트와 함께 84일 만에 100% matching했지만, 커뮤니티 전문가의 도움이 없었다면 89~90%쯤에서 멈췄을 거라고 봤다[^lewis-84-days].

바이트가 같다는 검증도 틀릴 수 있다. REA의 동방 프로젝트(Touhou) 재구성에서는 부동소수점 상수를 잘못 쓴 함수가 바이트 일치 검사를 그대로 통과했다. 검사기가 명령어에 들어 있는 주소만 맞춰 보고, 그 주소에 실제로 든 값은 확인하지 않았기 때문이다. 다시 점검해 보니 이미 통과한 함수 다섯 개에서 잘못된 참조가 열두 개 더 나왔다[^rea-touhou].

## 빈칸은 그럴듯하게 채워진다

완벽해 보이는 결과가 바이너리에서 온 게 아닐 수도 있다. DecBench의 데이터셋은 bzip2, coreutils 같은 오픈소스여서, DecBench 관리자도 이 코드가 모두 모델의 학습 데이터에 들어 있다고 봤다. 관리자가 실행 기록을 열어 보니, Claude Code는 시키지도 않았는데 대상 함수가 bzip2의 `fallbackSort`라고 짚었다. 인터넷 검색 없이 objdump만 세 번 부르고, assembly만 보고 기억해 낸 것이다. 한 사용자는 Claude가 주석과 변수 이름까지 원본과 똑같은 코드를 냈다고 보고했다. 반대로 Codex는 최적화된 바이너리에서 함수를 못 알아보면 원본과 다르게 써서 구조 점수를 잃었다. 관리자는 그 코드가 원본보다 오히려 낫다고 했다[^decbench-issue-43].

그럼 결과물 중 어디까지가 바이너리에서 복원한 것이고, 어디부터가 모델이 추론하거나 기억해서 채운 걸까? 이 비율을 직접 잰 연구가 있는지 찾아봤는데, 찾은 범위에서는 없었다. 지금까지는 re-executability, 원본과의 유사도, 이름과 type 정확도 같은 간접 지표뿐이다. 학습 때 본 함수와 처음 본 함수의 차이가 단서가 된다. DIRTY는 학습 때 본 함수에서는 type을 89.9% 맞혔지만 처음 본 함수에서는 56.4%였다[^dirty]. 앞에서 본 숫자도 대부분 공개된 코드로 잰 것이라, 모델이 처음 보는 상용 바이너리에서는 더 낮을 수 있다. 복원과 추론을 나눠서 재는 건 그 자체로 재밌는 연구 주제일 것 같다.

그런데 원본과 똑같지 않아도, 쓰는 사람에게는 '복구됐다'고 느껴질 수 있다. 사람의 감각은 생각보다 너그럽다. 연예인 닮은꼴은 얼굴 몇 군데만 닮아도 그 사람처럼 보이고, 코미디 프로그램의 성대모사는 목소리가 달라도 말투와 억양 몇 가지만 잡으면 그 사람처럼 들린다. StyleGAN2가 만든 얼굴과 진짜 얼굴을 구별한 정확도는 48.2%로 아무렇게나 고르는 것과 비슷했고, 오히려 AI가 만든 얼굴이 더 믿을 만하다는 평가를 받았다[^ai-faces]. AI로 복제한 목소리는 약 80%의 경우 진짜 목소리와 같은 사람으로 판단됐다[^voice-clones].

게임에서는 이런 작은 차이가 문제가 되기도 한다. SNES 게임 Speedy Gonzales는 언뜻 보면 어느 에뮬레이터에서나 잘 돌지만, 세이브 없이 2~3시간을 달려 6-1 스테이지에 가면 드문 하드웨어 동작을 재현하지 않은 에뮬레이터에서는 멈춘다[^byuu-accuracy]. 잠깐 봐서는 같은데, 차이는 잘 가지 않는 길에 숨어 있다.

## 난독화가 더 주목받게 될까

Snowboard Kids처럼 바이트까지 맞춘 사례도 있지만, 84일과 커뮤니티 전문가의 도움이 필요했다. 보기에는 비슷해도, AI만으로 소프트웨어를 통째로 똑같이 복제하기는 어렵다. 복제를 막으려는 쪽에서 보면 이건 힌트다. 모델이 읽지 못한 부분을 채우는 거라면, 읽을 수 있는 부분을 줄이고 추론을 빗나가게 하는 난독화(obfuscation)가 더 주목받게 되지 않을까?

그런 움직임은 이미 보인다. 앱 보호 솔루션 회사 Promon은 Obfuscator-LLVM으로 난독화한 프로그램의 ARM assembly를 LLM들에게 주고 같은 기능의 C 코드를 다시 쓰게 했다. 난독화 기법 세 가지를 겹치자 평균 성공률이 63.7%에서 8.5%로 떨어졌다[^promon-2026q1]. 자기 제품을 파는 회사의 실험이라 걸러 들어야 하지만, AI로부터 앱과 IP를 지키라는 말이 이제 판매 문구가 됐다.

Obfuscator-LLVM은 사실 꽤 간단한 난독화다. 바이너리 유사도 분석을 다시 평가한 우리 BinKit 연구에서도 이걸로 난독화 데이터셋을 만들었는데, 단순한 특징 몇 가지는 함수 안쪽만 바꾸는 이 난독화에도 잘 버텼다[^binkit]. 그런데도 LLM의 성공률이 이만큼 떨어진 건, 쓸데없는 코드로 입력이 불어났기 때문일 수도 있다. 사람은 의미 없는 더미 코드를 보면 건너뛰지만, LLM은 사람처럼 건너뛸 수 없으니 context가 그런 값으로 채워지는 것 아닐까?

학계에서도 LLM이 쉽게 풀지 못하는 보호 기법을 찾고 있다. 올해 바이너리 분석 연구 워크숍(BAR)에 나온 한 논문은 LLM 에이전트 세 개에게 CTF reverse engineering 문제 24개를 풀게 하고, 어디서 실패하는지를 봤다. 그런데 24문제 중 88%는 적어도 한 에이전트가 풀었고, 직접 만든 가상 머신(custom VM)으로 보호한 문제 8개 중 6개는 에이전트가 바이트코드 에뮬레이터나 디스어셈블러를 직접 짜서 풀었다. 저자들은 보호 기법이 코드를 '읽기 어렵게' 만드는 데서 그치면 안 되고, 에이전트의 분석 루프가 확실히 실패하게 해야 한다고 본다. 다만 디컴파일 결과를 망가뜨리는 방어에는 한계가 있다고 했다. 에이전트는 디컴파일러 없이 assembly만 보고도 추론하는 경우가 많았고, 디컴파일 결과가 오히려 에이전트를 헷갈리게 한 경우도 있었기 때문이다[^llm-resistant-protection].

그렇다면 사람 리버서가 어려워하는 난독화와 LLM이 어려워하는 난독화는 달라야 할까? BAR 논문은 에이전트가 학습 때 본 패턴에 기대고, 관찰이 길게 쌓이면 앞서 본 단서를 다시 찾지 못한다는 약점을 꼽았다. 올해 6월에 나온 한 preprint는 사람에게 냈던 난독화 과제를 그대로 LLM에 줘 봤다. reasoning 모델은 사람이 어려워한 곳에서 비슷하게 어려워했지만, instruction 모델과 coder 모델이 막힌 곳은 사람과 거의 상관이 없었다[^le-obfuscation-human-llm]. 그런데 이 실험은 학생들이 짧은 Python·JavaScript 코드를 읽은 것이고, 전문 리버서와 에이전트에게 같은 바이너리 난독화를 주고 비교한 연구는 아직 찾지 못했다. 이것도 새로운 연구 주제가 될 것 같다.

## 취약점을 찾으려면 원본을 정확히 봐야 한다

난독화가 없어도 AI가 읽어 낸 코드에는 빈칸이 남는다. 기능을 다시 만드는 게 목적이라면 동작만 비슷해도 되고, 잘 가지 않는 길에서 조금 달라도 쓰는 데는 큰 문제가 없을 수 있다. 원본의 취약점을 찾는 게 목적이라면 얘기가 다르다. 취약점은 그런 길에 숨어 있기도 하다. 모델이 채운 빈칸에서 찾은 버그는 원본이 아니라 모델이 쓴 코드의 버그일 수 있고, 반대로 원본의 버그가 그 빈칸 속에서 사라질 수도 있다. SNES 에뮬레이터 bsnes를 만든 byuu는 정확한 에뮬레이션이 원본의 '틀린' 동작까지 그대로 낸다고 했다[^byuu-accuracy]. 취약점 분석에 필요한 정확함은 이런 것이다.

모델이 빈칸을 채우지 않고 디컴파일러만 써도 원본의 버그를 놓친다. 한 연구에서 C 프로그램 9개의 디컴파일 결과를 손으로 고친 뒤 정적 분석 도구(SAST) 8개를 돌려 보니, 원본 소스에서 찾았던 진짜 버그(true positive)는 71%만 다시 찾았고 잘못된 경고(false positive)는 평균 232% 늘었다. 디컴파일 과정에서 사라진 스택 버퍼 크기 같은 정보가 원인이었다[^asiaccs-convergence].

LLM으로 디컴파일하거나 그 결과를 다듬으면 더 나빠질 수 있다. 읽기 좋은 코드와 맞는 코드가 다르기 때문이다. DecompileBench에서 코드가 얼마나 읽기 쉬운지를 LLM으로 채점했을 때는 LLM 기반 디컴파일이 상용 디컴파일러를 앞섰지만, 실행했을 때 원본과 같은 분기 커버리지를 낸 비율은 Hex-Rays보다 17.2~52.2% 낮았다[^decompilebench]. 올해 9월에 나온 또 다른 preprint에서는 다시 컴파일되는 비율을 가장 크게 끌어올린 LLM이, 원본과 똑같이 동작하는 비율은 오히려 떨어뜨렸다. CVE가 있는 함수에서는 공개된 취약점의 최대 10분의 1이 다듬은 코드에서 더는 crash를 내지 않았다[^recompile-more-preserve-less]. 컴파일이 되니 맞아 보이지만, 원본의 취약점은 재현되지 않은 것이다.

그래서 원본 코드의 취약점을 분석할 때는 디컴파일러 자체의 품질을 높이는 게 매우 중요하다고 생각한다. 그리고 그 품질은 reverse engineering 도메인 지식에서 나온다. 앞의 BinKit 연구에서도 그랬다. 바이너리를 어떻게 컴파일했는지와 밑에 깔린 분석 도구가 얼마나 정확한지가 결과를 크게 바꿨다. 예를 들어 Clang에서 위치 독립 코드(PIC)로 빌드한 MIPS 바이너리는 IDA Pro가 제대로 처리하지 못했다[^binkit]. 휴대폰 baseband firmware를 분석한 연구에서는 부팅 때 코드와 데이터를 메모리 곳곳에 옮겨 놓는 ARM scatter-loading을 IDA Pro가 지원하지 않아 그 과정을 직접 에뮬레이션했고, Qualcomm의 Hexagon 아키텍처는 IDA Pro와 바이너리 분석 도구 angr가 지원하지 않아 다루지 못했다. 펌웨어별 설정 파일과 벤더별 분석 모듈은 사람이 직접 썼다[^basespec][^basecomp]. 디컴파일에는 컴파일러에 대한 이해, 그리고 대상 아키텍처나 임베디드 기기에 대한 이해가 필요하다.

## 소스 없이 고쳐야 하는 곳

정확한 분석이 필요한 일이 하나 더 있다. 바이너리 패칭이다. 지난 글인 [취약점이 쏟아지는 시대, 패치는 사용자에게 제때 도착할까?](/posts/patch-gap-and-blast-radius-ko/)에서는 패치를 깔 수 없거나 아예 오지 않는 곳이라면, 뚫려도 피해가 번지지 않게 가두거나 장비를 바꾸는 것밖에 없는지 물었다. 회사가 파산하거나, 소스 코드에 제한이 걸려 있거나, EOL이 되면 패치는 오지 않는다. 공장이나 병원 같은 critical system이 그렇다. 2020년 Palo Alto Networks Unit 42 보고서에서는 의료 영상 장비의 83%가 지원이 끝난 OS를 쓰고 있었다[^unit42-iot-2020]. 그리고 저런 곳은 보통 소스 코드를 주지 않는다. 남는 건 바이너리뿐이다.

바이너리를 직접 고치는 건 precision 100%가 필요한 일이다. 소스가 공개된 프로그램에서도 그게 얼마나 어려운지 보여 주는 예가 최근에 있었다. 10월 21일 보안 회사 Calif가 공개한 PHP 런타임 취약점 php2shell은 기본 설정에서도 악용할 수 있었고, WordPress, Drupal, Joomla 같은 앱에서 인증 없는 원격 코드 실행이 확인됐다[^calif-php2shell]. 다음 날 radare2를 만든 pancake가 배포판 업데이트를 기다리지 않고 Alpine의 `mod_php` 바이너리를 직접 고치는 글을 올렸다[^pancake-patching].

다만 이 패치로 잃는 기능이 있다. 메모리가 부족할 때 복구하는 대신 worker를 그냥 종료하게 바꿨고, 디버깅용 backtrace도 포기했다. 바뀐 바이트를 비교해 보라고 했을 뿐 기능 테스트 결과는 없다. symbol이 없는 부분은 upstream 소스의 diff로 위치를 찾았는데, 소스가 아예 없는 시스템이라면 이 단서도 없다. 어디를 고치고 무엇을 포기할지는 숙련된 reverse engineer가 판단한다. pancake도 `sigsetjmp` 호출이 보이면 메모리 관리를 조심해서 봐야 한다는 걸 reverse engineer라서 안다고 썼다.

## 자동 패칭에 AI를 더하면

그럼 이런 판단을 사람 대신 기계가 할 수는 없을까? 전 세계 해커들의 축제인 DEF CON CTF 결선에서는 팀끼리 서로의 서비스를 공격하는데, 자기 서비스의 취약점을 패치해서 방어하기도 한다[^nautilus-2025-rules]. 2016년에는 DARPA가 DEF CON에서 이런 CTF를 기계끼리 치르게 했다. 이 Cyber Grand Challenge에서 기계들은 처음 보는 소프트웨어의 버그가 악용되는 걸 보고 직접 패치를 내보냈다[^darpa-cgc]. 점수도 기능을 기준으로 매겼다. 2014년 예선 규칙은 패치한 바이너리의 점수에 기능 유지와 성능 중 더 나쁜 쪽을 곱했다[^cgc-cqe-scoring]. 패치가 기능을 깨면 점수도 깨진다.

이후 DARPA의 Assured Micropatching(AMP)은 소스도 빌드 환경도 없는 mission-critical 시스템의 legacy 바이너리를 다뤘다. 바이트를 최소한으로만 바꾸는 micropatch로 빠르게 고치고, 고친 뒤에도 원래 기능이 유지된다는 걸 증명하는 것까지가 목표였다[^darpa-amp]. 의료기기나 산업 제어기처럼 재부팅할 수 없는 임베디드 기기를 위해, 멈추지 않고 실행 중에 고치는 hotpatching 연구도 있다[^rapidpatch].

소스 없이 바이너리를 고치는 기존 방법에 AI를 툴로 써서 합치면, 좀 더 디테일하게 분석하는 방법이 나타나지 않을까? 최근 결과는 그 가능성을 보여 주지만, 아직 근거가 적다. EuroS&P 2026에 채택된 SCRIBE는 디컴파일 결과를 바이너리에 맞게 고쳐 다시 컴파일하는 방식으로, 소스 없이 실제 CVE 14개 중 13개를 패치했다. 하지만 대상은 Coreutils, Binutils 같은 잘 알려진 오픈소스의 공개된 CVE였고, 패치도 공개된 소스 diff를 참고해 디컴파일 코드에 옮긴 것이다. 함수 단위로 봐도 아직 100%와는 거리가 멀다. SCRIBE로 고친 뒤 다시 컴파일된 함수는 Hex-Rays 결과의 84.1%, Ghidra 결과의 49.4%였고, 컴파일은 됐지만 테스트에 실패한 함수 중 SCRIBE가 고친 건 각각 80.9%, 53.3%였다. 그리고 패치가 맞는지는 테스트로 판단했다[^scribe].

테스트를 통과한 패치가 맞는 패치라는 보장은 없다. 소스가 있어도 그렇다. 우리가 AIxCC 결선에 쓰인 오픈소스 프로젝트의 취약점으로 coding agent의 패치를 확인했을 때, 취약점을 막고 유닛 테스트까지 모두 통과한 패치의 semantic correctness가 60~80%에 그쳤다. 나머지는 crash만 막고 새 버그를 만들거나 기능을 바꾼 패치였다[^team-atlanta-patch-2026].

패치가 기능을 깨지 않는지를 CGC는 테스트로, AMP는 증명으로 확인하려 했다. 여기에 앞에서 본 것처럼 멈추거나 재부팅할 수 없다는 조건까지 더해지면, 패치를 확인하는 일은 더 어려워진다. 그래서 남는 질문은 이거다. robustness를 가져가면서 hotpatching이 가능한 방법이 있을까? 기능은 손상하지 않으면서 취약점 부분만 패치하는 것.

## 정확함은 도구에 쌓인 도메인 지식에서 나온다

취약점을 놓치지 않고 찾는 일이나, 기능을 깨지 않고 바이너리를 고치는 일이나 밑바탕의 분석이 얼마나 정확한지에 달려 있다. 바이너리 분석 쪽으로 가면, 특히 툴링이나 정확도와 연관된 일에서는 AI가 도구라는 생각이 좀 더 든다. 지금까지의 툴링은 그 분야 최고 수준의 도메인 지식이 쌓인 결과물이기 때문이다.

AI 쪽 도구도 같은 방향으로 가고 있다. REA 자체가 새 모델이 아니라, 앞에서 본 것처럼 기존 분석 도구 위에 얹은 harness다. REA의 skill은 모든 결론에서 관찰한 것, 추론한 것, 모르는 것을 구분하라고 에이전트에게 요구한다[^rea-skill]. 어디까지가 복원이고 어디부터가 추론인지를 workflow 규칙으로 박아 둔 셈이다. REA 문서는 앞의 디컴파일러 Kuna가 내는 pseudocode도 재구성일 뿐 원본 소스가 아니라고 분명히 적는다[^rea-kuna-provider]. Microsoft의 Project Ire도 LLM이 디컴파일러와 분석 도구를 불러 쓰는 구조이고, 함수 하나를 anti-debugging으로 잘못 본 문제는 디컴파일러 규칙을 고쳐서 해결했다[^ms-project-ire].

REA 블로그의 'reverse engineering에 더 큰 모델이 필요한가'라는 글도 비슷한 얘기를 한다. Touhou의 바이트를 맞추다 보니 일반 모델은 모를 법한 세세한 컴파일러 특성을 알아야 풀리는 경우가 있었고, 저장소에 정리해 둔 컴파일러 지식을 retrieval로 넣어 주면 모델을 다시 학습하지 않아도 에이전트의 출발점이 좋아진다는 것이다. 그래서 더 큰 모델과 retrieval을 잘 붙인 작은 모델을 비교해 보자고 제안한다[^rea-models].

물론 모델도 중요하다. 앞의 숫자들과 달리 SRE-Bench는 모델이 학습 때 보지 못하게 전문가들이 새로 만든 바이너리로 잰다. 소스를 복원하는 게 아니라 바이너리가 하는 일을 알아내는 benchmark인데, 같은 표준 RE 도구를 줘도 모델에 따라 결과가 크게 갈렸다. 가장 강한 모델 네 개에게는 최적화와 linking이 거의 문제가 되지 않았지만, 약한 모델은 심볼을 지우면 점수가 크게 떨어졌다[^sre-bench]. 다만 모두 도구를 쓴 결과라, 강한 모델이 도구 없이도 같은 결과를 낸다는 뜻은 아닌 것 같다.

그렇다면 agent harnessing을 할 때도 결국 이런 도메인 지식을 어떻게 축적시키느냐가 핵심이 될 것 같다. 툴, prompt, context, harness가 모두 축적된 도메인 지식이 된다. skill을 깎고 RAG로 필요할 때 꺼내 쓰게 하는 것처럼, 도메인 지식을 agent에 어떻게 잘 녹여내고 agent가 그 지식에 어떻게 잘 접근하게 할지가 앞으로의 일이 되지 않을까? [AIxCC 회고](/posts/team-atlanta-wins-darpa-aixcc/)에서 쓴 것처럼, 도메인 전문가에게 context engineering은 LLM의 능력을 전문가 자신의 수준까지 끌어올리는 방법이다. 지금은 이렇게 바깥에서 넣어 주지만, 최종적으로는 그 지식이 모델 안에 탑재되는 데까지 가지 않을까?

## 마치며

이번 글에서 계속 다룬 질문은 하나였다. AI가 낸 코드 중 어디까지가 바이너리에서 왔고, 어디부터가 모델이 채운 걸까? 베끼는 쪽에서는 원본이 얼마나 새어 들어왔는지의 문제고, 취약점을 찾는 쪽에서는 버그가 진짜인지, 놓친 건 없는지의 문제고, 고치는 쪽에서는 패치를 믿을 수 있는지의 문제다. 아직은 이 경계를 재는 방법도 마땅하지 않다. agent가 이 경계를 스스로 표시하게 만드는 것도, 그 표시를 믿고 공장과 병원의 바이너리를 맡기는 것도, 결국 내가 그 대상을 얼마나 잘 아느냐에 달린 것 같다.

## 3줄요약

- REA처럼 에이전트가 바이너리를 읽고 기능을 다시 만드는 도구가 뜨지만, AI가 읽어 낸 코드는 원본이 아니다. 사라진 이름, type, 구조를 모델이 추론하거나 기억으로 채우니 통째로 복제하기는 어렵고, 난독화가 더 주목받을 수 있다. 다만 기억으로 들어온 원본 코드나 똑같아 보이는 화면은 IP 문제가 될 수 있다.
- 원본의 취약점을 찾을 때는 이 빈칸 때문에 진짜 버그를 놓치거나, 원본에 없는 버그를 찾을 수 있다. 그래서 디컴파일러 품질과 컴파일러, 아키텍처에 대한 도메인 지식이 중요하다.
- 소스 없는 공장과 병원 시스템은 기능을 깨지 않으면서 바이너리를 직접 고쳐야 하는데, 여기서 AI는 기존 바이너리 도구와 검증에 붙을 때 도움이 될 수 있다. 결국 도메인 지식을 도구, skill, context에 잘 넣어 agent가 꺼내 쓰게 하고, 최종적으로는 모델에 탑재하는 데까지 가는 게 핵심이 될 것 같다.

## 참고 자료

* 참고 자료
{:footnotes}

[^rea-github]: [morluto/rea](https://github.com/morluto/rea)
[^hn-rea]: [Hacker News, REA: Reverse Engineer Anything (2026-10-10)](https://news.ycombinator.com/item?id=50028275)
[^rea-dx-ball]: [REA, DX-Ball Showcase](https://rea.tools/showcase/dx-ball/)
[^rea-disclaimer]: [morluto/rea, DISCLAIMER.md](https://github.com/morluto/rea/blob/main/DISCLAIMER.md)
[^rea-issue-2120]: [morluto/rea, Copyright Compliance Concerns Regarding Agent Access to Original Source Code (Issue #2120, 2026-10-12)](https://github.com/morluto/rea/issues/2120)
[^kr-copyright-101-4]: [국가법령정보센터, 저작권법 제101조의4 프로그램코드역분석 (시행 2026-08-11)](https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=04&joNo=0101&lsiSeq=283335&urlMode=lsScJoRltInfoR)
[^sega-accolade]: [Sega Enterprises v. Accolade, 977 F.2d 1510 (9th Cir., 1992-10-20)](https://law.resource.org/pub/us/case/reporter/F2/977/977.F2d.1510.92-15655.html)
[^google-oracle]: [Google LLC v. Oracle America, 593 U.S. 1 (U.S. Supreme Court, 2021-04-05)](https://www.supremecourt.gov/opinions/20pdf/18-956_d18f.pdf)
[^tetris-xio]: [Tetris Holding v. Xio Interactive, 863 F. Supp. 2d 394 (D.N.J., 2012-05-30)](https://www.govinfo.gov/content/pkg/USCOURTS-njd-3_09-cv-06115/pdf/USCOURTS-njd-3_09-cv-06115-0.pdf)
[^farm-heroes]: [대법원, 모바일 게임물의 창작성 및 실질적 유사성 판단기준에 관한 판결(포레스트 매니아 사건) (2017다212095, 2019-06-27)](https://www.scourt.go.kr/portal/news/NewsViewAction.work?gubun=4&searchOption=&searchWord=&seqnum=6713&type=5)
[^dark-and-darker]: [대법원, 영업비밀침해금지 등 사건 보도자료 (2026다200492, 2026-04-30)](https://www.scourt.go.kr/supreme/news/NewsViewAction2.work?gubun=702&searchOption=&searchWord=&seqnum=1739)
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
