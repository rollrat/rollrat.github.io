# Claude Code - Source Architecture

## Overview

Claude Code는 Anthropic의 공식 CLI 도구로, **React + Ink 기반 터미널 UI**, **플러그인/스킬 시스템**, **MCP(Model Context Protocol) 통합**, **멀티 에이전트 협업** 등을 지원하는 대규모 TypeScript 프로젝트이다.

---

## 디렉토리 구조 요약

```
src/
├── entrypoints/       # 앱 진입점 (CLI, MCP, SDK)
├── bootstrap/         # 초기화 & 부트스트랩 상태
├── state/             # 중앙 상태 관리 (Zustand-like)
├── context/           # React Context 프로바이더
│
├── query.ts           # 핵심 쿼리 실행 루프
├── QueryEngine.ts     # 쿼리 엔진 (토큰 관리, 재시도)
├── query/             # 쿼리 설정, 의존성, 토큰 예산
│
├── Tool.ts            # 도구 타입 정의 & 인터페이스
├── tools.ts           # 도구 레지스트리 & 팩토리
├── tools/             # 44개 도구 구현체
│
├── commands.ts        # 명령어 레지스트리
├── commands/          # 50+ CLI 명령어 구현
│
├── components/        # React UI 컴포넌트 (100+)
├── ink/               # Ink 터미널 UI 프레임워크
├── screens/           # 전체화면 UI (Doctor, REPL, Resume)
│
├── services/          # 서비스 레이어 (20+ 모듈)
├── hooks/             # React 훅 (50+)
│
├── tasks/             # 백그라운드 태스크 실행
├── skills/            # 스킬 시스템
├── plugins/           # 플러그인 시스템
│
├── bridge/            # 원격 코드 실행 브릿지
├── remote/            # 원격 세션 관리
├── server/            # Direct Connect 서버
├── upstreamproxy/     # 업스트림 프록시
│
├── utils/             # 유틸리티 라이브러리 (298 파일)
├── types/             # TypeScript 타입 정의
├── constants/         # 설정 상수
├── schemas/           # 타입 스키마
│
├── keybindings/       # 키바인딩 시스템
├── vim/               # Vim 모드 지원
├── voice/             # 음성 모드 (feature-gated)
├── buddy/             # 컴패니언 스프라이트
├── coordinator/       # 에이전트 코디네이터
├── assistant/         # 어시스턴트 모드 (Kairos)
├── memdir/            # 영구 메모리 시스템
├── migrations/        # 데이터 마이그레이션
├── native-ts/         # 네이티브 바이너리 통합
├── outputStyles/      # 출력 스타일링
│
├── main.tsx           # 메인 엔트리 (800KB+)
├── setup.ts           # 초기 설정 루틴
├── history.ts         # 명령 히스토리
├── cost-tracker.ts    # API 비용 추적
└── context.ts         # 시스템/사용자 컨텍스트 빌더
```

---

## 핵심 모듈 상세

### 1. 진입점 & 부트스트랩

| 파일 | 역할 |
|------|------|
| `entrypoints/cli.tsx` | CLI 부트스트랩. `--version`, `--dump-system-prompt` 등 fast path 처리 후 `main.tsx` 로드 |
| `entrypoints/init.ts` | 텔레메트리, OAuth 갱신, MCP 서버 승인, LSP 초기화 |
| `entrypoints/mcp.ts` | MCP 서버 모드 진입 |
| `entrypoints/sdk/` | SDK/에이전트 모드 진입 |
| `main.tsx` | 전체 앱 로드 - 명령어, 도구, 스킬, 플러그인, 메시지 핸들러, API 클라이언트 초기화 |
| `bootstrap/state.ts` | 전역 부트스트랩 상태, 런타임 플래그 |

### 2. 쿼리 엔진 (핵심 루프)

| 파일 | 역할 |
|------|------|
| `query.ts` (46KB) | 메시지 핸들링, 컴팩트 전략, 도구 실행 오케스트레이션 |
| `QueryEngine.ts` (46KB) | 토큰 예산 관리, 메시지 큐 처리, API 에러 핸들링 & 재시도 |
| `query/config.ts` | 쿼리 설정 |
| `query/tokenBudget.ts` | 토큰 추적 |
| `query/deps.ts` | 쿼리 의존성 주입 |

### 3. 도구 시스템 (44개 도구)

**파일 조작**: `FileReadTool`, `FileWriteTool`, `FileEditTool`, `GlobTool`
**코드 도구**: `LSPTool`, `GrepTool`, `SkillTool`
**시스템**: `BashTool`, `PowerShellTool`, `REPLTool`
**에이전트**: `AgentTool`, `TaskCreateTool`, `TaskUpdateTool`, `TaskListTool`, `TaskGetTool`, `TaskOutputTool`, `TaskStopTool`
**통합**: `MCPTool`, `WebSearchTool`, `WebFetchTool`, `RemoteTriggerTool`
**메타**: `SendMessageTool`, `AskUserQuestionTool`, `ConfigTool`

### 4. 서비스 레이어

| 서비스 | 역할 |
|--------|------|
| `services/api/` | Anthropic API 클라이언트 (claude.ts, withRetry.ts) |
| `services/oauth/` | OAuth 인증 |
| `services/mcp/` | MCP 클라이언트, 서버 레지스트리, 도구 브릿지 |
| `services/compact/` | 메시지 컴팩션/자동 압축 |
| `services/SessionMemory/` | 세션 메모리 |
| `services/extractMemories/` | 메모리 추출 |
| `services/analytics/` | GrowthBook 피처 플래그, 이벤트 로깅 |
| `services/lsp/` | Language Server Protocol |
| `services/plugins/` | 플러그인 관리 |
| `services/remoteManagedSettings/` | 원격 설정 동기화 |
| `services/teamMemorySync/` | 팀 메모리 동기화 |

### 5. UI 시스템

- **Ink 프레임워크** (`ink/`): 터미널 렌더링 엔진. Box, Text, Button, Spinner 등 터미널 컴포넌트 제공
- **디자인 시스템** (`components/design-system/`): ThemedBox, ThemedText, Dialog, ProgressBar 등
- **컴포넌트** (`components/`): 100+ React 컴포넌트 (메시지, 승인 다이얼로그, 설정 등)
- **스크린** (`screens/`): Doctor(진단), REPL(인터랙티브), ResumeConversation

### 6. 태스크 시스템

| 태스크 타입 | 역할 |
|-------------|------|
| `LocalMainSessionTask` | 메인 세션 태스크 |
| `LocalAgentTask` | 에이전트 실행 |
| `LocalShellTask` | 셸 명령 실행 |
| `RemoteAgentTask` | 원격 에이전트 조정 |
| `InProcessTeammateTask` | 팀원 에이전트 |
| `DreamTask` | 비동기 백그라운드 태스크 |

### 7. 원격 & 브릿지

| 모듈 | 역할 |
|------|------|
| `bridge/` | 원격 코드 실행 브릿지 (메시징, API, UI, 디버그) |
| `remote/` | 원격 세션 매니저, WebSocket, SDK 메시지 어댑터 |
| `server/` | Direct Connect 세션 생성 & 관리 |
| `upstreamproxy/` | 업스트림 프록시 & 메시지 릴레이 |

---

## 아키텍처 패턴

1. **중앙 상태 관리**: Zustand-like 스토어 (`AppState.tsx` + `AppStateStore.ts`)
2. **서비스 레이어 분리**: 외부 통합(API, OAuth, MCP, 분석)은 `/services/`에 격리
3. **다형성 도구 시스템**: 도구별 독립 구현 + 퍼미션 브릿지
4. **Hook 기반 UI 로직**: 50+ 커스텀 React 훅
5. **모듈러 명령어**: 50+ CLI 명령어를 개별 모듈로 분리
6. **메모리 시스템**: 영구 메모리 + 관련성 검색
7. **태스크 스케줄링**: 에이전트/셸/워크플로우 백그라운드 실행
8. **피처 게이트**: 조건부 컴파일 (KAIROS, BRIDGE_MODE, VOICE_MODE 등)
9. **React + Ink 터미널 UI**: 컴포넌트 기반 터미널 렌더링
10. **MCP 통합**: Model Context Protocol로 외부 도구/리소스 브릿지
11. **멀티 퍼미션 모델**: interactive, coordinator, swarm 모드

---

## 시작 흐름

```
cli.tsx (fast path 체크)
  → main.tsx (전체 임포트 & 초기화)
    → init.ts (텔레메트리, OAuth, MCP, LSP)
      → setup.ts (초기 설정)
        → AppState + QueryEngine (상태 + 쿼리 루프)
          → Tool Registry + Commands (도구/명령어 등록)
            → Ink Render (터미널 UI 렌더링)
```
