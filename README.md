# Selah

*"Pause. Reflect. Grow."*

**[한국어](README.ko.md)**

A collection of faith-based web services for biblical engagement, inspired by the medieval scriptorium tradition.

## Services

### Bible Scribe

A meditative scripture transcription tool — type the Word, one verse at a time.

- **Two modes**: Sequential (chapter-by-chapter) and Random (curated passages)
- **32 Bible translations** across 7 languages (Korean, English, Spanish, French, German, Chinese, Japanese)
- Dual data sources: [YouVersion](https://www.youversion.com/) API and [helloao.org](https://helloao.org/)
- Copyright attribution for licensed translations
- Progress tracking and bookmarks
- Language filter for quick translation selection
- Meditative typing sounds (correct, error, verse-done, chapter-done)
- Offline-capable with IndexedDB caching
- Dark mode
- Data export/import

## Tech Stack

- [Next.js](https://nextjs.org/) 16 / [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Radix UI](https://www.radix-ui.com/) / [Lucide](https://lucide.dev/) icons
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) via [idb](https://github.com/jakearchibald/idb)
- [Zod](https://zod.dev/) (schema validation)
- [Biome](https://biomejs.dev/) (lint & format)
- [Lefthook](https://github.com/evilmartians/lefthook) (git hooks)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Lint & format
pnpm lint:fix && pnpm format
```

## Project Structure

```
selah/
├── my-app/
│   └── src/
│       ├── app/
│       │   ├── (services)/
│       │   │   └── bible-scribe/
│       │   │       ├── _components/   # Service UI components
│       │   │       ├── _hooks/        # Custom hooks (API, DB, sound, typing)
│       │   │       └── _lib/          # API adapters, translations, types
│       │   ├── api/
│       │   │   └── youversion/        # YouVersion API proxy
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── components/                # Shared components
│       └── lib/                       # Shared utilities
└── docs/                              # Documentation & plans
```

## License

Private project.
