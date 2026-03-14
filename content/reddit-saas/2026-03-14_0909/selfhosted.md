---
title: "r/selfhosted 정리 - 2026-03-14 09:09"
subreddit: "selfhosted"
date_saved: "2026-03-14 09:09"
posts_count: 10
tags:
  - reddit
  - saas
  - selfhosted
  - digest
---

# r/selfhosted 정리 - 2026-03-14 09:09

## 1. 💀 "할 일이 없다" 밈 (⬆7386, 💬355)
[Nothing to do](https://www.reddit.com/r/selfhosted/comments/1rs5wze/nothing_to_do/)

이미지 밈 포스트. 셀프호스팅 취미의 "완벽하게 세팅했는데 이제 뭐하지" 감정을 건드려 7,386 업보트. r/selfhosted 역대급 반응.

---

## 2. 🔧 50개 라즈베리파이 노드로 분산 스크래핑 인프라 구축 (⬆606, 💬117)
[Fully self-hosted distributed scraping infrastructure — 50 nodes, local NAS, zero cloud, 3.9M records](https://www.reddit.com/r/selfhosted/comments/1rsflyj/fully_selfhosted_distributed_scraping/)

| 항목 | 내용 |
|------|------|
| 규모 | 50 Raspberry Pi + Selenium + VPN 개별 할당 |
| 데이터 | 2년간 3.9M 레코드 |
| 저장소 | 로컬 NAS + 셀프호스팅 Supabase |
| 자동 복구 | IoT 스마트 전원 스트립으로 장애 노드 자동 재시작 |
| 비용 | 클라우드 비용 $0 |

💡 **인상적**: IoT 전원 스트립으로 장애 노드를 스크립트가 자동 전원 차단/복구. 완전 자동화.

---

## 3. ⚠️ AI 생성 포스트에 질렸다 (⬆510, 💬148)
[[Rant] So sick of every other post being blatantly written by AI](https://www.reddit.com/r/selfhosted/comments/1rsyb28/rant_so_sick_of_every_other_post_being_blatantly/)

| 항목 | 내용 |
|------|------|
| 핵심 | 바이브코딩 앱이 아닌 *포스트 자체*가 AI로 작성 |
| 불만 | "Reddit 포스트를 왜 AI로 생성하나?" |
| 대안 | 프라이빗 커뮤니티? → 새 참여자 유입 차단이 문제 |

---

## 4. 🔧 TapMap: 내 컴퓨터 접속 위치를 세계지도로 표시 (⬆382, 💬37)
[TapMap: see where your computer connects on a world map](https://www.reddit.com/r/selfhosted/comments/1rsuib2/tapmap_see_where_your_computer_connects_on_a/)

| 항목 | 내용 |
|------|------|
| 기능 | 로컬 소켓 연결 → MaxMind GeoLite2 IP → Plotly 시각화 |
| 특징 | 로컬 실행, 텔레메트리 없음, 오픈소스 |
| GitHub | github.com/olalie/tapmap |

---

## 5. 🔧 Fetcharr: 인간이 개발한 Huntarr 대체제 (⬆360, 💬125)
[Fetcharr - a human-developed Huntarr replacement](https://www.reddit.com/r/selfhosted/comments/1rstvef/fetcharr_a_humandeveloped_huntarr_replacement/)

| 항목 | 내용 |
|------|------|
| 배경 | Huntarr 사태 이후 대안 필요 |
| 특징 | 웹 UI 없음, 환경변수로 설정 (Unpackerr 방식) |
| 성능 | 다른 대안들이 놓친 미디어를 즉시 발견 (가중치 기반 검색) |
| AI 사용 | 일부 웹 UI에만 ChatGPT 사용, 문서화됨 |

💡 **"human-developed"를 제목에 명시** — AI 코드에 대한 커뮤니티 불신을 역이용.

---

## 6. 📢 셀프호스팅 북 서비스 목록 (⬆202, 💬155)
[List of self hosted book services](https://www.reddit.com/r/selfhosted/comments/1rslu16/list_of_self_hosted_book_services/)

| 서비스 | 용도 |
|--------|------|
| Kavita | 전자책 서버 |
| Komga | 만화/코믹스 서버 |
| Audiobookshelf | 오디오북 서버 |
| Calibre-Web | Calibre 웹 인터페이스 |
| Calibre-Web-Automated | 자동화된 Calibre 웹 |
| Stump | 전자책/만화 서버 |
| BookHaven | 책 관리 |

배경: Booklore 사태 이후 대안 정리.

---

## 7. ⚠️ TrueNAS 공개 빌드 저장소 폐기 (⬆72, 💬26)
[TrueNAS Deprecates Public Build Repository](https://www.reddit.com/r/selfhosted/comments/1rt0elb/truenas_deprecates_public_build_repository_and/)

| 항목 | 내용 |
|------|------|
| 이슈 | 빌드 시스템을 내부로 이동 → 오픈소스 이탈 우려 |
| 반응 | "enshittification의 시작" |
| 질문 | 최고의 FOSS NAS 대안은? |

---

## 8. 📢 AI 프로젝트에 AI.md 파일 필수화 요청 (⬆29, 💬45)
[[Request to Mods] AI content](https://www.reddit.com/r/selfhosted/comments/1rszw35/request_to_mods_ai_content/)

| 제안 | 내용 |
|------|------|
| AI.md | AI 사용 여부, 어디에 사용, 정확한 모델명 기록 |
| 목적 | 보안/품질 투명성 확보 |

---

## 9~10. 커뮤니티 관리
- 규칙 업데이트: New Project Friday, 3개월 미만 프로젝트는 금요일만 포스팅
- AI 콘텐츠 정책: 모든 AI 관련 포스트 허용, 유형 4가지 분류

---

## 🔍 메타 분석: r/selfhosted 커뮤니티 현재 트렌드

### 1. AI 피로감 폭발
AI 생성 포스트 불만(⬆510), AI.md 필수화 요청(⬆29), "human-developed" 제목 명시(⬆360). 커뮤니티가 AI 코드/콘텐츠의 품질과 신뢰에 심각한 우려.

### 2. 하드코어 셀프호스팅의 부활
50개 라즈베리파이 분산 스크래핑(⬆606)이 큰 호응. "제로 클라우드, 완전 로컬" 철학 건재.

### 3. 오픈소스 enshittification 경계
TrueNAS 빌드 저장소 폐기에 즉각 반응. 오픈소스 → 클로즈드 전환에 매우 민감.

---

## 🔗 언급된 도구 & 서비스
- [TapMap](https://github.com/olalie/tapmap) - 네트워크 연결 세계지도 시각화
- [Fetcharr](https://github.com/egg82/fetcharr) - 미디어 검색/다운로드 자동화
- [Kavita](https://www.kavitareader.com) - 전자책 서버
- [Audiobookshelf](https://www.audiobookshelf.org) - 오디오북 서버
- [Calibre-Web-Automated](https://github.com/crocodilestick/Calibre-Web-Automated) - 자동화된 Calibre
