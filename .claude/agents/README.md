# Claude Code Agent Teams 가이드

## 개요

이 폴더에는 Claude Code Agent Teams로 운영되는 전문 에이전트들의 역할 스펙이 정의되어 있습니다.

- **Agent Teams 활성화**: `settings.json`의 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- **마케팅팀 출력 경로**: `my-app/marketing/{service-name}.md`
- **기획팀 출력 경로**: `product-plans/{idea-name}.md`

---

## 등록된 에이전트

### 마케팅팀

| 파일 | 역할 | 담당 섹션 |
|------|------|-----------|
| `content-strategist.md` | 타겟 오디언스, 포지셔닝, 핵심 메시지 분석 | `## Positioning` |
| `copywriter.md` | 헤드라인, 제품 설명, CTA 작성 | `## Copy` |
| `social-media-manager.md` | Twitter/X · Instagram · LinkedIn 포스트 | `## Social Posts` |
| `seo-specialist.md` | 키워드, 메타 태그, 콘텐츠 구조 | `## SEO` |

### 제품 기획팀

| 파일 | 역할 | Phase | 담당 섹션 |
|------|------|-------|-----------|
| `market-analyst.md` | 유사 제품 조사, 시장 분석, 포지셔닝 | 1 | `## Market Analysis` |
| `product-ideator.md` | 아이디어 구체화, MVP 기능, 대안 제안 | 1 | `## Product Ideation` |
| `growth-hacker.md` | 바이럴 루프, 사용자 획득, 네트워크 효과 | 2 | `## Growth Strategy` |
| `retention-designer.md` | Hook Model, 습관 설계, 리텐션 전략 | 2 | `## Retention Strategy` |
| `ux-architect.md` | 핵심 사용자 흐름, IA, 마찰 제거 | 2 | `## UX Architecture` |
| `ui-concept-designer.md` | 시각 방향, 색상, 타이포, 레퍼런스 | 2 | `## UI Design Concept` |
| `pm-lead.md` | 전체 종합, 최종 제품 기획서 생성 | 3 | `## Executive Summary` + `## Action Items` |

### 유틸리티

| 파일 | 역할 | 담당 섹션 |
|------|------|-----------|
| `code-reviewer.md` | 코드 품질, 보안, 유지보수성 리뷰 | — |
| `testcase-writer.md` | QA 테스트 케이스 생성 | — |
| `pr-fixup.md` | PR 리뷰 반영 자동화 | — |
| `refactor-helper.md` | 리팩토링 방안 분석 | — |
| `pr-reviewer.md` | PR 리뷰 코멘트 분석 | — |
| `idea-generator.md` | 트렌드 리서치 기반 제품 아이디어 생성 및 검증 | `ideas/` |

---

## 마케팅팀 표준 소환 프롬프트

### 전체 서비스 마케팅 패키지 생성

```
마케팅팀 소환: void-timer 서비스 홍보 자료 만들어줘.
- content-strategist: 타겟 오디언스와 포지셔닝 분석
- copywriter: 카피 작성 (전략팀 결과 참조)
- social-media-manager: SNS 포스트 작성
- seo-specialist: SEO 최적화 작업
결과를 my-app/marketing/void-timer.md에 저장해줘
```

### 서비스별 단일 에이전트 호출

```
content-strategist 에이전트: tip-defender 서비스 타겟 오디언스와 포지셔닝 분석해줘.
결과를 my-app/marketing/tip-defender.md의 Positioning 섹션에 저장해줘.
```

```
seo-specialist 에이전트: umbrella-guardian 키워드 리서치하고
my-app/marketing/umbrella-guardian.md SEO 섹션 업데이트해줘.
기존 my-app/src/app/(services)/umbrella-guardian/page.tsx 메타데이터도 참조해줘.
```

### 제품 아이디어 생성

```
idea-generator 에이전트: "focus timer" 관련 제품 아이디어 리서치해줘
```

```
idea-generator 에이전트: 최신 트렌드 기반으로 새 서비스 아이디어 추천해줘
```

### 병렬 팀 작업 (Agent Teams 기능 활용)

```
마케팅팀 병렬 작업:
- content-strategist → lucky-cat 포지셔닝 분석 → my-app/marketing/lucky-cat.md
- seo-specialist → lucky-cat SEO 패키지 → 같은 파일

두 에이전트가 동시에 작업하되 서로 다른 섹션을 담당합니다.
copywriter는 content-strategist 완료 후 결과 참조해서 카피 작성.
```

---

## 마케팅 패키지 파일 구조

`my-app/marketing/{service-name}.md` 파일은 다음 4개 섹션으로 구성됩니다:

```markdown
# [Service Name] Marketing Package

## Positioning (Content Strategist)
- Target Audience (Primary / Secondary)
- Key Messages (3가지)
- Competitive Angle

## Copy (Copywriter)
- Headline + Subheadline
- Product Description (100자 이내)
- CTA Variants (3가지)

## Social Posts (Social Media Manager)
### Twitter/X (3 posts)
### Instagram (3 captions + hashtags)
### LinkedIn (1 post)

## SEO (SEO Specialist)
- Primary Keywords (5개) + 검색 의도
- Meta Title & Description
- Content Outline (H1-H3)
- Internal Linking Opportunities
```

---

## 기획팀 표준 소환 프롬프트

### 전체 기획팀 소환

```
기획팀 소환: {아이디어 설명}

Phase 1 (병렬):
- market-analyst → 경쟁 분석
- product-ideator → 아이디어 구체화
결과를 product-plans/{idea-name}.md에 저장

Phase 2 (Phase 1 완료 후, 병렬):
- growth-hacker → 바이럴 전략
- retention-designer → 리텐션 전략
- ux-architect → UX 설계
- ui-concept-designer → UI 컨셉
같은 파일에 이어서 저장

Phase 3:
- pm-lead → 전체 종합 리포트
같은 파일에 저장
```

### 기획팀 단일 에이전트 호출

```
product-ideator 에이전트: {아이디어} 구체화해줘.
결과를 product-plans/{idea-name}.md의 Product Ideation 섹션에 저장.
```

```
ux-architect 에이전트: {아이디어}의 사용자 흐름 설계해줘.
product-plans/{idea-name}.md의 기존 Phase 1 결과를 참조해서
UX Architecture 섹션에 저장.
```

---

## 기획팀 파이프라인 구조

```
Phase 1 (병렬)              Phase 2 (병렬, Phase 1 참조)        Phase 3
┌────────────────┐        ┌────────────────────┐              ┌──────────┐
│ market-analyst │        │ growth-hacker      │              │ pm-lead  │
│ product-ideator│   ──▶  │ retention-designer │         ──▶  │ 종합 리포트│
└────────────────┘        │ ux-architect       │              └──────────┘
                          │ ui-concept-designer│
                          └────────────────────┘
```

## 기획팀 출력 파일 구조

`product-plans/{idea-name}.md` 파일은 다음 섹션으로 구성됩니다:

```markdown
# Product Plan: {Idea Name}

## Market Analysis (Market Analyst)
### Competitive Landscape
### Market Positioning
### Market Risks

## Product Ideation (Product Ideator)
### Idea Summary
### Core Features (MVP)
### Alternative Ideas

## Growth Strategy (Growth Hacker)
### Viral Loops
### Acquisition Channels
### Network Effects
### Growth Metrics

## Retention Strategy (Retention Designer)
### Hook Model
### Daily Engagement Loop
### Re-engagement Strategy
### Retention Metrics

## UX Architecture (UX Architect)
### Critical User Path
### Time-to-Value Optimization
### Information Architecture
### Friction Reduction

## UI Design Concept (UI Concept Designer)
### Visual Direction
### Color Palette
### Typography
### Tone & Voice

## Executive Summary (PM Lead)
### Vision & Core Value
### MVP Scope (Final)
### Go-to-Market Strategy
### Key Risks & Mitigations

## Action Items (PM Lead)
[우선순위별 10개 실행 항목]
```

---

## 지원 서비스 목록

| 서비스 | URL | 마케팅 파일 |
|--------|-----|-------------|
| Void Timer | `/void-timer` | `my-app/marketing/void-timer.md` |
| Tip Defender | `/tip-defender` | `my-app/marketing/tip-defender.md` |
| Umbrella Guardian | `/umbrella-guardian` | `my-app/marketing/umbrella-guardian.md` |
| Lucky Cat | `/lucky-cat` | `my-app/marketing/lucky-cat.md` |

---

## Agent Teams vs Subagents

| 항목 | Subagents (Task 도구) | Agent Teams (실험적) |
|------|----------------------|----------------------|
| 실행 방식 | 순차적 | 병렬 |
| 통신 | 오케스트레이터에게만 | 팀원 간 직접 |
| 토큰 비용 | 낮음 | 높음 |
| 설정 | 없음 (기본 제공) | `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` |
