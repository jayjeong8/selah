# selah

## 프로젝트 개요
성경/기독교 관련 웹 서비스 모음 프로젝트.

## 새 서비스 구현 시 규칙
### plan 파일 경로
`../docs/plans/{service-name}`

### 라우팅 규칙
- Next.js App Router 폴더 라우트로 경로를 분리할 것
- 예: `app/(services)/서비스명/page.tsx`
- 다른 라우트에 영향을 주지 않도록 서비스별 경로를 명확히 분리할 것
- 새 서비스 추가 시 루트 `app/page.tsx` 홈 화면에 해당 서비스 카드(링크)를 추가할 것

### UI/디자인 가이드
- frontend-design skill 사용할 것
- 다른 경로에 스타일 영향을 주지 않도록 독립적인 스타일로 구현할 것
- `globals.css` 또는 Tailwind 전체 theme 설정 변경 금지
- 모바일 퍼스트(Mobile-First) 원칙을 적용하여 모바일에 적합한 UI를 구현할 것
- 모든 UI 요소는 모바일 화면 하나에 담길 수 있도록 구성할 것
- 모바일에서도 가독성 있는 글자 크기를 사용할 것 (본문 최소 16px, 보조 텍스트 최소 14px)
- UI 텍스트는 영어만 사용
- 서비스별 디자인 컨셉은 `../docs/design-concepts/{service-name}.md` 참조 (없으면 frontend-design skill이 인터뷰를 통해 생성)
- 서비스별 컨셉에 맞는 SVG 파비콘을 `app/(services)/서비스명/icon.svg`에 추가할 것 (Next.js 자동 감지 컨벤션 사용)

### 파일 구조 규칙
- 서비스별로 독립적인 파일 구조를 유지할 것
- 특정 서비스에서만 사용하는 컴포넌트, 훅, 유틸리티 함수 등은 해당 서비스 폴더 내에 위치시킬 것
- 예: `app/(services)/서비스명/_components/`, `app/(services)/서비스명/_hooks/`, `app/(services)/서비스명/_lib/`
- 여러 서비스에서 공용으로 사용하는 코드는 최상위 `components`, `hooks`, `lib` 폴더에 위치시킬 것

### 전역(Global) 코드 규칙
- **루트 `app/layout.tsx` 및 `app/page.tsx`**:
    - 서비스 특정 로직, 컴포넌트, 스타일을 포함하지 않고 깨끗하게 유지해야 합니다.
    - 루트 레이아웃은 `ThemeProvider`와 같은 전역 프로바이더와, 사이트 전반의 기본 폰트(`Inter`, `JetBrains Mono`) 로딩만을 담당합니다.
    - 루트 페이지는 모든 서비스를 나열하고 링크하는 간단한 메뉴 역할만 합니다.
- **`globals.css`**:
    - Tailwind 레이어, 전체 테마(CSS 변수) 등, 이름 그대로 전역적인 스타일만 포함해야 합니다.
    - 특정 서비스에만 사용되는 스타일이나 애니메이션은 절대 추가해서는 안 됩니다.

### 폰트 및 스타일 가이드
- **폰트 (Fonts)**:
    - 각 서비스는 필요한 커스텀 폰트를 자체 `layout.tsx` 파일 내에서 `next/font`를 사용하여 로드해야 합니다.
    - 이를 통해 다른 서비스에 불필요한 폰트가 로드되는 것을 막아 성능을 최적화합니다.
- **스타일 (Styles)**:
    - 서비스에만 종속되는 CSS(애니메이션 포함)는 해당 서비스 폴더 내의 별도 CSS 파일(예: `app/(services)/서비스명/style.css`)에 작성해야 합니다.
    - 이 파일은 해당 서비스의 `layout.tsx`나 `page.tsx`에서 import하여 사용합니다.
