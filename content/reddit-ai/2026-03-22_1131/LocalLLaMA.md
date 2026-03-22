---
title: "r/LocalLLaMA AI 정리 - 2026-03-22 11:31"
subreddit: "LocalLLaMA"
date_saved: "2026-03-22 11:31"
posts_count: 9
tags:
  - reddit
  - ai
  - llm
  - local-llm
  - digest
---

# r/LocalLLaMA AI 정리 - 2026-03-22 11:31

## 1. 🏢 Qwen, 싱가포르 창이공항에 대형 광고 게재 (⬆1591, 💬139)
[Qwen wants you to know… (photo of Alibaba Cloud advertising in Changi airport Singapore)](https://www.reddit.com/r/LocalLLaMA/comments/1rzeonn/)

| 항목 | 내용 |
|------|------|
| 핵심 | 알리바바 클라우드가 싱가포르 창이공항에 Qwen 브랜드 대형 광고를 설치, 오픈소스 LLM의 기업 마케팅 본격화 |
| 의미 | 오픈소스 모델이 단순 기술 프로젝트를 넘어 글로벌 상업 브랜드로 자리잡고 있음을 시사 |
| 배경 | Qwen 시리즈는 최근 코딩·수학·멀티모달 벤치마크에서 최상위권 성과를 내며 커뮤니티 인정을 받아왔음 |

댓글 핵심:
- "실제로 그럴 자격이 있다"라는 반응이 최다 추천(⬆486) — 커뮤니티가 Qwen 성능을 높이 평가
- 중국 내에서는 Qwen이 배달 주문에도 활용될 정도로 실생활 침투
- 핵심 연구원 해고 소식에 대한 우려 — 장기 경쟁력에 물음표
- Gemma 진영에서 소형 모델 오픈소스 요청 목소리도 등장

---

## 2. 📜 Moonshot, Cursor Composer에 대한 공식 라이선스 인정 발표 (⬆490, 💬50)
[Moonshot says Cursor Composer was authorized](https://www.reddit.com/r/LocalLLaMA/comments/1rzqg06/)

| 항목 | 내용 |
|------|------|
| 핵심 | Cursor가 Fireworks AI를 통해 Moonshot(Kimi)의 모델을 라이선스 받아 사용했다고 Moonshot이 공식 해명 |
| 경위 | Fireworks AI가 중간 리셀러 역할 → Cursor가 Composer 기능에 Kimi 모델 활용 → 무단 사용 논란 발생 → Moonshot이 사후 공식 인정 |
| 쟁점 | 리셀러 조항(reseller clause)의 범위가 핵심 — 모델 도용이 아닌 라이선스 해석 문제 |

댓글 핵심:
- 논란이 터진 뒤에야 공식 입장을 낸 점에 의문 제기 — "사전 합의였다면 왜 축하 메시지가 없었나"(⬆79)
- "드라마의 본질은 도용이 아니라 리셀러 조항 해석"이라는 냉정한 시각(⬆57)
- 라이선스 스크린샷이 증거로 공유되며 사실관계 확인 진행

---

## 3. ⚖️ 변호사의 256GB VRAM 로컬 LLM 클러스터 구축기 (⬆363, 💬202)
[Feedback on my 256gb VRAM local setup and cluster plans. Lawyer keeping it local.](https://www.reddit.com/r/LocalLLaMA/comments/1rzg33q/)

| 항목 | 내용 |
|------|------|
| 하드웨어 | V100 32GB SXM × 8장 (총 256GB VRAM), AMD Threadripper 기반 |
| 목적 | 10년간 축적된 법률 업무 데이터에 대한 로컬 RAG 파이프라인 구축 |
| 동기 | 변호사-의뢰인 비밀유지 의무(attorney-client privilege)로 클라우드 API 사용 불가 |

댓글 핵심:
- **컨테이너화 권장**: Windows 대신 전용 서버 + Docker로 격리해야 클러스터 확장에 유리(⬆113)
- **V100 EOL 경고**: NVIDIA가 V100에 대한 CUDA 지원 종료 예고, DDR4 메모리 병목도 문제(⬆61)
- **유머**: "변호사니까 돈은 있잖아"(⬆71), "Minimax가 운동 가라고 했다"(⬆103)
- 법률 분야 로컬 LLM 활용 사례로서 커뮤니티의 높은 관심 (댓글 202개)

---

## 4. 🚀 Nemotron Cascade 2: 소형 MoE로 코딩 벤치마크 압도 (⬆218, 💬90)
[Don't sleep on the new Nemotron Cascade](https://www.reddit.com/r/LocalLLaMA/comments/1rzud2z/)

| 항목 | 내용 |
|------|------|
| 모델 | Nemotron Cascade 2 30B-A3B (30B 파라미터 중 3B만 활성화하는 MoE 구조) |
| 양자화 | IQ4_XS quant 사용 |
| 성능 | HumanEval 97.6%, ClassEval 88% — 활성 파라미터 대비 파격적 성능 |
| 의미 | 소형 디바이스에서도 고성능 코딩 어시스턴트 구동 가능성 입증 |

댓글 핵심:
- MoE의 효율성에 감탄하는 반응 다수 — 3B 활성으로 이 성능은 놀라움
- 실제 코딩 작업에서의 체감 품질에 대한 토론 활발
- NVIDIA의 오픈소스 전략이 Qwen/DeepSeek과 경쟁하는 양상

---

## 5. ⚡ Qwen 3.5에 Multi-Token Prediction(MTP) 지원 — mlx-lm (⬆125, 💬24)
[Multi-Token Prediction (MTP) for qwen-3.5 coming to mlx-lm](https://www.reddit.com/r/LocalLLaMA/comments/1rzntv5/)

| 항목 | 내용 |
|------|------|
| 기술 | Multi-Token Prediction — 한 번의 추론으로 여러 토큰을 동시 예측 |
| 성능 향상 | 15.3 → 23.3 tok/s (약 1.52배 처리량 증가) |
| 수락률 | 80.6% acceptance rate |
| 테스트 환경 | Apple M4 Pro + mlx-lm 프레임워크 |
| 의미 | Apple Silicon 사용자들의 로컬 추론 속도를 실질적으로 끌어올리는 최적화 |

댓글 핵심:
- Mac 사용자들에게 실용적 가치가 매우 높다는 평가
- MTP가 speculative decoding과 어떻게 다른지에 대한 기술 토론
- mlx 생태계의 빠른 발전에 대한 긍정적 반응

---

## 6. 📊 Llama 8B가 구조화 프롬프팅만으로 70B 수준 달성 (⬆87, 💬9)
[Llama 8B matching 70B on multi-hop QA with structured prompting, no fine-tuning](https://www.reddit.com/r/LocalLLaMA/comments/1s05thz/)

| 항목 | 내용 |
|------|------|
| 논문 | KET-RAG (arxiv:2603.14045) |
| 방법 | 구조화된 Chain-of-Thought + 60% 컨텍스트 압축 |
| 결과 | Llama 8B가 파인튜닝 없이 multi-hop QA에서 70B과 동등한 성능 |
| 의미 | 모델 크기가 아닌 프롬프트 설계와 RAG 파이프라인이 성능의 핵심 변수임을 재확인 |

댓글 핵심:
- "모델을 키우는 것보다 잘 쓰는 게 먼저"라는 관점에 동의하는 반응
- 60% 컨텍스트 압축의 실용성에 주목

---

## 7. 🔬 DeepSeek 핵심 연구원 Daya Guo 퇴사 루머 (⬆74, 💬19)
[DeepSeek Core Researcher Daya Guo Rumored to Have Resigned](https://www.reddit.com/r/LocalLLaMA/comments/1rzu7rc/)

| 항목 | 내용 |
|------|------|
| 인물 | Daya Guo — 중산대학(Sun Yat-sen Univ.) 2023년 박사 졸업 |
| 기여 | DeepSeek-R1, V3, Math 등 핵심 논문의 주요 저자 |
| 행선지 추측 | Baidu 또는 ByteDance로 이직 루머 |
| 맥락 | Qwen 핵심 연구원 해고 소식(1번 포스트 댓글)과 맞물려 중국 AI 인재 유동성에 대한 관심 증가 |

댓글 핵심:
- 중국 AI 기업 간 인재 쟁탈전이 격화되고 있다는 분석
- DeepSeek의 후속 모델 개발에 미칠 영향에 대한 우려
- 연구원 개인의 기여도와 조직 역량의 관계에 대한 토론

---

## 8. 🔧 ik_llama.cpp: Qwen 3.5 27B에서 26배 빠른 프롬프트 처리 (⬆35, 💬28)
[ik_llama.cpp gives 26x faster prompt processing on Qwen 3.5 27B](https://www.reddit.com/r/LocalLLaMA/comments/1s07ysr/)

| 항목 | 내용 |
|------|------|
| 하드웨어 | RTX PRO 4000 Blackwell 24GB |
| 프롬프트 처리 속도 | 43 → 1,122 tok/s (약 26배 향상) |
| 생성 속도 | 7.5 → 26 tok/s (약 3.5배 향상) |
| 핵심 기술 | Fused GDN(Grouped Dense Network) 커널 최적화 |
| 의미 | llama.cpp 포크가 Blackwell 아키텍처의 성능을 극한까지 끌어올리는 사례 |

댓글 핵심:
- Blackwell GPU의 잠재력을 보여주는 인상적인 결과라는 평가
- 기존 llama.cpp 대비 커널 최적화의 효과가 극적
- 다른 모델/GPU 조합에서의 재현 가능성에 대한 질문

---

## 9. ❓ 오픈소스 공개 여부 추측 (⬆7, 💬2)
[Will they or won't they? (speculation about open source release)](https://www.reddit.com/r/LocalLLaMA/comments/1s06q6g/)

| 항목 | 내용 |
|------|------|
| 핵심 | 특정 모델/기업의 오픈소스 공개 여부에 대한 커뮤니티 추측 |
| 반응 | 낮은 참여도(⬆7, 💬2)로 아직 구체적 정보 없음 |

---

## 🔍 메타 분석: r/LocalLLaMA 커뮤니티 현재 트렌드

### 1. 중국 AI 기업의 양면성
Qwen의 글로벌 마케팅 공세(1591 추천)와 동시에 핵심 인재 이탈(Qwen 해고, DeepSeek Daya Guo 퇴사 루머)이 공존. 기술력은 인정하지만 조직 안정성에 대한 의구심이 커지고 있다.

### 2. 효율성의 시대 — "작은 모델을 잘 쓰자"
- Nemotron Cascade 2: 3B 활성 파라미터로 97.6% HumanEval
- KET-RAG: 8B 모델이 구조화 프롬프팅만으로 70B 수준
- MTP: 모델 변경 없이 1.5배 속도 향상
커뮤니티의 관심이 "더 큰 모델"에서 "같은 모델을 더 잘 쓰는 법"으로 이동 중.

### 3. 하드웨어 최적화 경쟁
ik_llama.cpp의 26배 프롬프트 처리 속도 향상은 소프트웨어 최적화만으로도 극적인 성능 차이를 만들 수 있음을 증명. Blackwell 아키텍처에 특화된 커널 개발이 활발해지는 추세.

### 4. 전문직의 로컬 LLM 도입
변호사가 비밀유지 의무 때문에 256GB VRAM 클러스터를 직접 구축하는 사례는 "프라이버시 > 편의성"이라는 전문직 시장의 니즈를 보여준다. V100 EOL 문제 등 실무적 허들도 함께 논의됨.

### 5. 라이선스와 모델 유통 생태계
Moonshot-Cursor-Fireworks 삼각관계는 AI 모델의 유통 구조가 복잡해지면서 라이선스 분쟁이 새로운 이슈로 부상하고 있음을 시사.

---

## 🔗 언급된 도구 & 프로젝트

| 이름 | 설명 | 관련 포스트 |
|------|------|-------------|
| **Qwen 3.5** | 알리바바의 오픈소스 LLM 시리즈 | #1, #5, #8 |
| **Nemotron Cascade 2** | NVIDIA의 30B-A3B MoE 모델 | #4 |
| **mlx-lm** | Apple Silicon 최적화 LLM 추론 프레임워크 | #5 |
| **KET-RAG** | 구조화 프롬프팅 + 컨텍스트 압축 RAG 기법 (arxiv:2603.14045) | #6 |
| **ik_llama.cpp** | llama.cpp 포크, Fused GDN 커널 최적화 | #8 |
| **Cursor Composer** | AI 코딩 도구, Moonshot/Kimi 모델 활용 논란 | #2 |
| **Fireworks AI** | 모델 서빙/리셀링 플랫폼 | #2 |
| **DeepSeek** | 중국 AI 연구소 (R1, V3, Math) | #7 |
| **Gemma** | Google의 오픈소스 LLM | #1 댓글 |
| **V100 32GB SXM** | NVIDIA 서버용 GPU (CUDA EOL 예고) | #3 |
