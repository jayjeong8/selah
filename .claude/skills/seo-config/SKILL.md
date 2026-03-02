---
name: seo-config
description: 프로젝트의 경로별 서비스에 맞는 SEO 설정을 자동 구성합니다. 메타데이터, Open Graph, JSON-LD, sitemap, robots.txt, llms.txt 등을 생성합니다. "SEO 설정", "SEO 추가", "검색 최적화" 등의 요청 시 사용합니다.
---

# SEO 설정 스킬

프로젝트의 각 경로(route)를 분석하여 검색엔진 및 AI 웹검색에 최적화된 SEO 설정을 구성합니다.

## 실행 절차

### 1단계: 프로젝트 분석
1. `src/app/**/page.tsx` 및 `src/app/**/layout.tsx` 파일을 모두 탐색
2. 각 페이지의 목적과 콘텐츠를 파악
3. 기존 metadata export가 있는지 확인
4. `next.config.ts` 설정 확인

### 2단계: 루트 레이아웃 기본 SEO 설정
`src/app/layout.tsx`에 전역 metadata를 구성합니다.

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  // 기본 메타데이터
  title: {
    template: "%s | 사이트명",
    default: "사이트명 - 핵심 설명",
  },
  description: "사이트 전체를 설명하는 150자 이내의 문장",
  keywords: ["키워드1", "키워드2", "키워드3"],

  // 크롤링 설정
  metadataBase: new URL("https://도메인"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph (소셜 공유)
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "사이트명",
    title: "사이트명 - 핵심 설명",
    description: "사이트 설명",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "사이트명",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "사이트명 - 핵심 설명",
    description: "사이트 설명",
    images: ["/og-image.png"],
  },

  // 기타
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "구글서치콘솔-인증코드",
  },
};
```

### 3단계: 경로별 페이지 metadata 설정
각 `page.tsx`에 해당 서비스에 맞는 metadata를 export합니다.

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스명", // template에 의해 "서비스명 | 사이트명"으로 렌더링
  description: "이 서비스가 무엇을 하는지 구체적으로 설명 (150자 이내)",
  keywords: ["서비스 관련 키워드"],
  alternates: {
    canonical: "/서비스-경로",
  },
  openGraph: {
    title: "서비스명",
    description: "서비스 설명",
    url: "/서비스-경로",
    images: [{ url: "/og-서비스명.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "서비스명",
    description: "서비스 설명",
  },
};
```

### 4단계: JSON-LD 구조화 데이터
각 페이지에 검색엔진이 콘텐츠를 이해할 수 있도록 JSON-LD를 추가합니다.

```typescript
// 페이지 컴포넌트 내부에 삽입
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication", // 서비스 유형에 맞게 변경
      name: "서비스명",
      description: "서비스 설명",
      url: "https://도메인/서비스-경로",
      applicationCategory: "카테고리",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    }),
  }}
/>
```

서비스 유형별 권장 `@type`:
- 웹 도구/앱: `WebApplication`
- 블로그/콘텐츠: `Article` 또는 `BlogPosting`
- FAQ: `FAQPage`
- 제품: `Product`
- 조직 소개: `Organization`
- 랜딩 페이지: `WebSite`

### 5단계: sitemap.ts 생성
`src/app/sitemap.ts` 파일을 생성합니다.

```typescript
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://도메인";

  // 정적 페이지 목록 (탐색된 모든 경로 포함)
  const routes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    // 각 서비스 경로 추가
  ];

  return routes;
}
```

### 6단계: robots.ts 생성
`src/app/robots.ts` 파일을 생성합니다.

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://도메인";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

### 7단계: llms.txt 생성 (AI 검색 최적화)
`public/llms.txt` 파일을 생성하여 AI 크롤러에게 사이트 정보를 제공합니다.

```
# 사이트명

> 사이트 한 줄 설명

## 서비스 목록

- [서비스1](https://도메인/서비스1): 서비스1 설명
- [서비스2](https://도메인/서비스2): 서비스2 설명

## 기술 스택

- Next.js 기반 웹 애플리케이션
- 주요 기능 나열
```

추가로 `public/llms-full.txt`에 더 상세한 정보를 포함할 수 있습니다.

### 8단계: AI 검색 최적화 추가 설정
`src/app/layout.tsx`의 metadata에 AI 크롤러 관련 설정을 추가합니다.

```typescript
// metadata 객체에 추가
other: {
  "ai-content-declarations": "none",
},
```

## SEO 작성 가이드라인

### title 작성법
- 형식: `핵심키워드 - 부가설명`
- 60자 이내 권장
- 가장 중요한 키워드를 앞에 배치
- openGraph/twitter title에 `| 사이트명` 접미사를 붙이지 않음 (루트 레이아웃의 title template이 자동으로 처리)

### description 작성법
- 150자 이내
- 사용자가 클릭하고 싶게 만드는 행동 유도 문구 포함
- 핵심 키워드 자연스럽게 포함
- "~하세요", "지금 바로" 등 CTA 활용

### 키워드 전략
- 각 페이지마다 고유한 주요 키워드 1-2개 선정
- 롱테일 키워드 활용 (예: "무료 온라인 이미지 변환기")
- 경쟁 페이지와 키워드 중복 방지

### AI 검색 최적화 팁
- 명확하고 구조화된 콘텐츠 작성 (heading 계층 활용)
- 질문-답변 형식의 콘텐츠 포함 (FAQ)
- 구체적인 수치와 사실 기반 정보 제공
- 자연어로 읽히는 설명 작성

## 주의사항
- `metadataBase` URL은 실제 배포 도메인으로 설정 (환경변수 활용 권장)
- OG 이미지가 없으면 placeholder 경로로 설정하고 TODO 주석 추가
- 동적 라우트(`[slug]` 등)는 `generateMetadata` 함수 사용
- 기존 metadata가 있으면 덮어쓰지 말고 병합
- 각 단계 완료 후 빌드 에러 없는지 확인
