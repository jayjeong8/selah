# Selah

*"멈추다. 묵상하다. 성장하다."*

**[English](README.md)**

중세 스크립토리움 전통에서 영감을 받은, 성경 묵상을 위한 웹 서비스 모음입니다.

## 서비스

### Bible Scribe (성경 필사)

묵상적 성경 필사 도구 — 한 구절씩 말씀을 타이핑하세요.

- **두 가지 모드**: 순차 모드 (장별 진행)와 랜덤 모드 (큐레이션된 구절)
- **7개 언어, 11개 성경 번역본** (한국어, 영어, 스페인어, 프랑스어, 독일어, 중국어, 일본어)
- 진행 상황 추적 및 북마크
- 묵상적 타이핑 사운드
- 오프라인 지원 (IndexedDB)
- 다크 모드
- 데이터 내보내기/가져오기

## 기술 스택

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) via [idb](https://github.com/jakearchibald/idb)
- [Biome](https://biomejs.dev/) (린트 & 포맷)

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build
```

## 프로젝트 구조

```
selah/
├── my-app/
│   └── src/
│       ├── app/
│       │   ├── (services)/
│       │   │   └── bible-scribe/   # 성경 필사 서비스
│       │   ├── layout.tsx           # 루트 레이아웃
│       │   └── page.tsx             # 홈 페이지
│       ├── components/              # 공유 컴포넌트
│       └── lib/                     # 공유 유틸리티
└── docs/                            # 문서 및 계획
```

## 라이선스

비공개 프로젝트입니다.
