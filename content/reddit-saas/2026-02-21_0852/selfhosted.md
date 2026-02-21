---
title: 'r/selfhosted 정리 - 2026-02-21 08:52'
subreddit: selfhosted
date_saved: '2026-02-21 08:52'
posts_count: 10
tags:
  - reddit
  - saas
  - digest
---
# r/selfhosted 정리 - 2026-02-21 08:52

## 1. 🧒 BrainRotGuard — 자녀 유튜브 승인 시스템 셀프호스팅 (⬆939, 💬251)
[BrainRotGuard - self-hosted YouTube approval system](https://www.reddit.com/r/selfhosted/comments/1r9u2x4/)

| 항목 | 내용 |
|------|------|
| 문제 | 유튜브 알고리즘 → 자녀가 원치 않는 영상에 빠짐 |
| 해결책 | 자녀 검색 → 부모 Telegram 알림 → 승인/거부 → 승인된 영상만 재생 |
| 스택 | Python/FastAPI, yt-dlp, Telegram Bot API, SQLite |
| 특징 | YouTube API 키 불필요 (yt-dlp 활용), DNS 차단(AdGuard/Pi-hole)과 조합 |
| 오픈소스 | 첫 오픈소스 프로젝트 — 피드백 환영 |

댓글 핵심:
- 939 업보트 — 이 서브레딧 최고 반응 게시물
- 부모 커뮤니티에서 강한 공감. "드디어 이런 게 나왔다"는 반응 다수
- "DNS 차단과 조합해야 우회 방지 가능" 실용적 피드백

---

## 2. 🎵 MusicGrabber v2.0.4 — Tidal 무손실 포함 멀티소스 음악 다운로더 (⬆603, 💬117)
[MusicGrabber - V2.0.4 released](https://www.reddit.com/r/selfhosted/comments/1r9s2rn/)

| 항목 | 내용 |
|------|------|
| 기능 | Tidal 무손실·SoundCloud·YouTube·Spotify·Amazon Music 플레이리스트 가져오기 |
| 특징 | 단일 트랙 빠른 다운로드, 동적 플레이리스트 워치(일간/주간/월간) |
| 개발 방식 | "Claude를 사이드킥으로 활용" — AI 보조 개발 명시 |
| 비고 | Lidarr의 단일 트랙 다운로드 불편을 해소하기 위해 제작 |

댓글 핵심:
- "Tidal 무손실 직접 다운로드는 실제로 동작하냐?" 기술적 질문 다수
- 큰 커뮤니티 수요 확인됨

---

## 3. 📄 스캔 문서 자동 이름 붙이는 도구 (⬆285, 💬60)
[I got tired of naming my scanned documents so I built this!](https://www.reddit.com/r/selfhosted/comments/1ra0m17/)

| 항목 | 내용 |
|------|------|
| 기능 | FTP로 스캐너 문서 수신 → Vision AI 분석 → 스마트 파일명 생성 → WebDAV 업로드 |
| 특징 | 완전 오프라인 (AI 포함), Docker 지원, 오픈소스 무료 |
| 반응 | "실제 문제를 해결하는 실용적 도구"로 높은 평가 |

댓글 핵심:
- "Paperless-ngx와 통합되냐?" 질문 다수
- 완전 오프라인 AI 처리에 대한 기술적 관심 높음

---

## 4. 🔬 Betterlytics — 셀프호스팅 Google Analytics 대안 (⬆123, 💬6)
[Betterlytics - Self-hosted Google Analytics alternative with uptime monitoring](https://www.reddit.com/r/selfhosted/comments/1r9y3zf/)

| 항목 | 내용 |
|------|------|
| 스택 | Rust 백엔드 + ClickHouse OLAP DB |
| 특징 | 고처리량 이벤트 수집, 업타임 모니터링 포함, Docker 배포 |
| 팀 | 3인 풀타임 팀 |
| 비고 | ClickHouse는 가볍지 않음 — 소규모 서버엔 과할 수 있음 |

---

## 5. 🖥️ Dispatch — 로컬 할일·저널 앱 (MCP 서버 포함) (⬆133, 💬25)
[Dispatch - A Local To-Do and Journaling App](https://www.reddit.com/r/selfhosted/comments/1ra257e/)

| 항목 | 내용 |
|------|------|
| 기능 | 할일·저널, 공개 API, **MCP 서버**, Web UI, DB 암호화 선택 |
| AI | BYO 토큰 방식 AI 어시스턴트 (로컬 모델 포함) |
| 특징 | MCP 서버 제공 — Claude Code 같은 AI 도구와 직접 연동 가능 |
| 상태 | Docker화, 모바일 지원 예정 |

댓글 핵심:
- MCP 서버 제공에 대한 관심이 높음
- "암호화 선택 옵션이 좋다"는 반응

---

## 6. ⚠️ OpenClaw 보안 취약점 2026 총정리 (⬆30, 💬17)
[If you're self-hosting OpenClaw, here's every documented security incident in 2026](https://www.reddit.com/r/selfhosted/comments/1r9yrw1/)

| 항목 | 내용 |
|------|------|
| 내용 | CVE 6개 (RCE 포함), 악성 스킬 824개+, 노출 인스턴스 42,000+ |
| 심각도 | 로컬호스트에서도 작동하는 원클릭 RCE 체인 존재 |
| 권장 조치 | Docker 샌드박싱, 루프백 바인딩, 방화벽 규칙, 격리 VM |
| 주의 | 정보 자체는 실용적이나 외부 블로그 링크로 이어짐 — 출처 검증 필요 |

---

## 7. 🔵 Vibe Code Friday 모드 공지 (⬆2060, 💬270)
[MOD ANNOUNCEMENT: Introducing Vibe Code Friday](https://www.reddit.com/r/selfhosted/comments/1qfp2t0/)

| 항목 | 내용 |
|------|------|
| 내용 | AI 보조·바이브코딩 프로젝트는 금요일에만 게시 가능 |
| 배경 | AI 생성 게시물 증가로 커뮤니티 분위기 악화 |
| 평가 | 서브레딧의 품질 유지를 위한 합리적 조치 |

---

## 🔍 메타 분석: r/selfhosted 커뮤니티 현재 트렌드

### 1. AI 보조 개발과 순수 셀프호스팅의 긴장
"Vibe Code Friday" 정책이 보여주듯 AI 보조 프로젝트가 대거 유입되며 기존 셀프호스팅 커뮤니티와 마찰. BrainRotGuard처럼 실생활 문제를 해결하는 프로젝트는 939 업보트를 받는 반면, 저품질 AI 코딩 결과물은 배척당함.

### 2. 가족 프라이버시·자녀 보호 수요 강함
BrainRotGuard 939 업보트는 이 커뮤니티에서 이례적 수치. 자녀의 인터넷 사용을 통제하고 싶지만 기존 상용 솔루션에 만족하지 못하는 부모들의 수요가 크게 존재함.

### 3. MCP 통합이 새로운 차별화 포인트
Dispatch처럼 MCP 서버를 제공하는 셀프호스팅 앱이 등장. AI 에이전트 도구와의 통합이 셀프호스팅 생태계에서도 중요해지는 신호.

### 4. 보안 경고: OpenClaw 인스턴스 42,000개 이상 노출
셀프호스팅 AI 도구의 보안 위험이 현실화됨. 운영 중이라면 즉시 샌드박싱 조치 필요.

---

## 🔗 언급된 도구 & 서비스
- [BrainRotGuard](https://github.com) - 유튜브 부모 승인 시스템 (오픈소스)
- [MusicGrabber](https://github.com/archiekane/musicgrabber) - 멀티소스 음악 다운로더
- [Betterlytics](https://betterlytics.io) - Rust+ClickHouse 기반 분석 도구
- [Dispatch](https://github.com/nkasco/DispatchTodoApp) - MCP 서버 포함 로컬 할일앱
- [TrailBase](https://github.com/trailbaseio/trailbase) - Rust+SQLite Firebase 대안 (지오스패셜 지원)
