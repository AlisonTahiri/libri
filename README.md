# Libri 📖

Libri is a modern, bilingual reading application designed to help users learn languages through immersive reading. It supports both cloud-based curated books and local EPUB file parsing, offering seamless sentence-by-sentence translations on tap.

## ✨ Features

- **Bilingual Reading Experience:** Tap any sentence to instantly see its translation in your preferred language (e.g., Albanian or English).
- **Dynamic Language Switching:** Seamlessly switch between different translation languages on the fly.
- **EPUB Support:** Upload and read your own DRM-free `.epub` books directly in the browser with full pagination and chapter navigation support.
- **Customizable Reader:** Adjust text size, font family, line height, margins, and themes (Light, Dark, Sepia) for a comfortable reading experience.
- **Progress Tracking:** Automatically saves your reading progress (scroll position and current chapter) locally using IndexedDB.
- **Offline Capable:** Local EPUB books and reading settings are cached in the browser for offline access.

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** CSS Modules / Vanilla CSS (Modern CSS features)
- **Database / Backend:** [Supabase](https://supabase.com/) (PostgreSQL)
- **EPUB Parsing:** [epubjs](https://github.com/futurepress/epub.js/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Storage:** Dexie.js (IndexedDB wrapper for local storage)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/libri.git
   cd libri
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or yarn / pnpm / bun install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 🗄️ Database Setup (Supabase)

The cloud library relies on a PostgreSQL database. To set up the required schema and initial data:

1. Open your Supabase project's SQL Editor.
2. Run the schema migration found in `supabase/migrations/001_create_libri_schema.sql`.
3. Run the schema update found in `supabase/migrations/002_add_english_translations.sql`.
4. Run the seed files located in the `supabase/` directory to populate the library with initial books.

### 💻 Development Server

Start the Vite development server:

```bash
npm run dev
# or bun dev
```

The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```text
src/
├── components/      # React components (Reader, Library, Settings, etc.)
├── hooks/           # Custom React hooks (useLanguage, useFullscreen, etc.)
├── lib/             # Utility functions and Supabase client config
├── services/        # External services (IndexedDB, epubParser)
├── types/           # TypeScript interfaces and type definitions
└── App.tsx          # Main application routing and state
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
