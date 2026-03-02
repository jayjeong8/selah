# Selah

*"Pause. Reflect. Grow."*

**[한국어](README.ko.md)**

A collection of faith-based web services for biblical engagement, inspired by the medieval scriptorium tradition.

## Services

### Bible Scribe

A meditative scripture transcription tool — type the Word, one verse at a time.

- **Two modes**: Sequential (chapter-by-chapter) and Random (curated passages)
- **11 Bible translations** across 7 languages (Korean, English, Spanish, French, German, Chinese, Japanese)
- Progress tracking and bookmarks
- Meditative typing sounds
- Offline-capable (IndexedDB)
- Dark mode
- Data export/import

## Tech Stack

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) via [idb](https://github.com/jakearchibald/idb)
- [Biome](https://biomejs.dev/) (lint & format)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Project Structure

```
selah/
├── my-app/
│   └── src/
│       ├── app/
│       │   ├── (services)/
│       │   │   └── bible-scribe/   # Bible Scribe service
│       │   ├── layout.tsx           # Root layout
│       │   └── page.tsx             # Home page
│       ├── components/              # Shared components
│       └── lib/                     # Shared utilities
└── docs/                            # Documentation & plans
```

## License

Private project.
