# Kairos Landing Page

Kairos is a premium bridge between high-quality remote talent and serious global opportunities. This landing page is built to serve two primary audiences: **U.S. Businesses** looking to cut hiring costs and **Global Talent** seeking serious remote work.

## 🚀 Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & CSS Keyframes
- **Theming:** [next-themes](https://github.com/pacocoursey/next-themes) (System-aware Dark/Light mode)
- **Language:** TypeScript

## ✨ Key Features

### 1. Dual-Intent Landing Experience
The homepage dynamically switches between **"For Talent"** and **"For Companies"** views based on user selection.
- **Intent Provider:** Uses React Context (`IntentProvider`) to maintain the user's focus throughout the session.
- **Smart Redirection:** Switching intent on a sub-page (like Jobs) automatically brings the user back to the relevant home view.

### 2. High-Impact Messaging
- **Company View:** Focuses on 70% cost savings and access to pre-vetted experts.
- **Talent View:** Emphasizes structured career opportunities and a "capability-over-resume" approach.

### 3. Dynamic Job & Category Boards
- **Jobs Page:** A fully filterable job board for talent with category and job-type toggles.
- **Categories Page:** A domain-focused exploration page for companies to find specific expertise (Marketing, Web Dev, Video Editing, etc.).

### 4. Trust & Credibility (Marquee)
A dual-row, institutional trust section featuring partnerships and awards:
- **Strategic Partners:** Jobberman, PluralCode, TEDCO.
- **Awards:** Pava Innovation, Spark Impact, Howard University PNC.
- **Implementation:** Custom CSS marquee with grayscale-to-color hover effects and dark-mode optimized logo badges.

### 5. Structured Talent Flow
Integrated **Case Study** requirements into the application flow to reinforce quality control and ensure high-caliber matches.

## 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router pages
│   ├── jobs/             # Job board page
│   ├── categories/       # Expertise domains page
│   └── layout.tsx        # Root layout with Theme & Intent providers
├── components/
│   ├── layout/           # Global components (Header, Footer, TrustSection)
│   ├── providers/        # Context providers (Theme, Intent)
│   └── ui/               # Reusable UI elements (Modals, ScrollToTop)
├── lib/
│   ├── api.ts            # Mock API layer & demo data
│   └── utils.ts          # Tailwind merge & utility functions
└── styles/
    └── globals.css       # Global styles & custom animations
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install
```

### Development
```bash
# Start the development server
npm run dev
```

### Production
```bash
# Build the project
npm run build

# Start the production server
npm run start
```

## 🎨 Theming
The project uses a custom color palette:
- **Primary:** `#C2185B` (Kairos Pink)
- **Background:** `#FFF8FB` (Light) / `#000000` (Dark)
- **Accent:** `zinc` palette for neutral elements.

## 📄 Documentation Notes
- **API Simulation:** All data is currently served through [api.ts](src/lib/api.ts) using async functions to simulate real API calls.
- **Responsiveness:** Built with a mobile-first approach using Tailwind's responsive utilities (`sm`, `md`, `lg`, etc.).
