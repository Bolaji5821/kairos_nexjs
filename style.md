# Kairos Nexus - Design System Style Guide (Next.js)

---

## Table of Contents
1. [Brand Overview](#brand-overview)
2. [Tech Stack](#tech-stack)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [Components](#components)
6. [Layout Patterns](#layout-patterns)
7. [Animations](#animations)
8. [Project Structure](#project-structure)
9. [Implementation Guidelines](#implementation-guidelines)

---

## Brand Overview

### Mission
The premium bridge between strong remote talent and serious global opportunities.

### Tagline
**Kairos.**

### Dual Intent Experience
The platform supports two distinct user journeys:
- **Talent**: For job seekers finding remote work
- **Company**: For businesses hiring vetted experts

---

## Tech Stack

### Core Framework
- **Next.js**: 16.2.4 (App Router)
- **React**: 19.2.4
- **TypeScript**: 5.x

### UI & Styling
- **Tailwind CSS**: 4.x (@tailwindcss/postcss)
- **next-themes**: Theme management
- **clsx** + **tailwind-merge**: Class utility
- **lucide-react**: Icons

### Animations
- **framer-motion**: 12.38.0

---

## Color Palette

### Primary Brand Color
| Purpose | Value | Usage |
|---------|-------|-------|
| Primary (Pink) | `#C2185B` | CTAs, icons, accents, badges |
| Primary Hover | `#A3154D` | Button hover state |
| Primary Light BG | `bg-pink-50` / `bg-pink-100` | Light pink backgrounds |
| Primary Dark BG | `bg-pink-900/30` / `bg-pink-950/10` | Dark theme pink accents |

### Neutral Colors
| Color | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| Background | `#FFF8FB` | `#000000` | Page background |
| Surface | `#FFFFFF` | `#1A1A1A` / `#18141C` | Cards, containers |
| Surface Elevated | `bg-zinc-50` | `bg-zinc-900` | Secondary cards |
| Text Primary | `#171717` | `#ffffff` | Headings, body text |
| Text Secondary | `text-gray-600` | `text-zinc-400` | Subtext, captions |
| Text Muted | `text-zinc-500` | `text-zinc-500` | Labels, metadata |
| Borders | `border-zinc-100` | `border-zinc-800` | Card borders |

### Gradients
```css
/* From CSS file */
.bg-gradient-to-b from-white to-[#C2185B]/10
/* Dark mode: from-zinc-900 to-zinc-950 */
```

---

## Typography

### Font Family
- **Sans**: Geist (via `next/font/google`)
- **Mono**: Geist Mono (via `next/font/google`)

### Font Sizes (Tailwind Classes)
| Class | Usage |
|-------|-------|
| `text-xs` | Badges, labels, tiny text |
| `text-sm` | Body text, links, captions |
| `text-base` | Standard body text |
| `text-lg` | Lead text, subheadings |
| `text-xl` | Card titles |
| `text-2xl` | Section subheadings |
| `text-3xl` | Section headings (mobile) |
| `text-4xl` | Section headings |
| `text-5xl` | Large headings |
| `text-6xl` | Hero headings (tablet) |
| `text-7xl` | Hero headings (desktop) |

### Font Weights
- `font-normal`: 400
- `font-medium`: 500
- `font-semibold`: 600
- `font-bold`: 700

### Text Styles
```tsx
// Uppercase tracking
tracking-wider  // Badges
tracking-widest // Section labels

// Line heights
leading-[1.1]   // Hero headings
leading-tight   // Section headings
leading-relaxed // Body text
```

---

## Components

### Buttons

#### Primary CTA Button
```tsx
<button className="bg-[#C2185B] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#A3154D] transition-colors cursor-pointer">
  {text}
</button>
```

#### Large Button
```tsx
<button className="bg-[#C2185B] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#A3154D] transition-colors shadow-lg shadow-pink-500/20 cursor-pointer">
  {text}
</button>
```

#### Button with Icon
```tsx
<button className="bg-[#C2185B] text-white p-4 rounded-2xl hover:bg-[#A3154D] transition-colors cursor-pointer">
  <ArrowRight className="w-5 h-5" />
</button>
```

### Cards

#### Category Card
```tsx
<div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-shadow group cursor-pointer">
  <div className="flex justify-between items-start mb-6">
    <div className="w-12 h-12 bg-pink-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
      <Icon className="w-6 h-6 text-[#C2185B]" />
    </div>
    <span className="px-2 py-1 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 text-[10px] font-bold rounded-md uppercase tracking-wider border border-zinc-100 dark:border-zinc-700">
      {tag}
    </span>
  </div>
  <h3 className="text-xl font-bold mb-2 dark:text-white">{title}</h3>
  <p className="text-sm text-zinc-500 mb-8 leading-relaxed">{desc}</p>
  <div className="flex justify-between items-center mt-auto pt-6 border-t border-zinc-50 dark:border-zinc-800">
    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{count}</span>
    <button className="bg-[#C2185B] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-[#A3154D] cursor-pointer">
      Hire talent
    </button>
  </div>
</div>
```

#### Feature Card (Gradient)
```tsx
<div className="p-8 rounded-[2.5rem] bg-gradient-to-b from-white to-[#C2185B]/10 dark:from-zinc-900 dark:to-zinc-950 border border-white dark:border-zinc-800 shadow-sm transition-transform hover:-translate-y-1">
  <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl mb-8 shadow-sm flex items-center justify-center">
    <Icon className="w-6 h-6 text-[#C2185B]" />
  </div>
  <h3 className="font-bold text-lg mb-4 dark:text-white">{title}</h3>
  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{desc}</p>
</div>
```

#### Role Card
```tsx
<div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-shadow group cursor-pointer">
  <div className="flex justify-between items-start mb-6">
    <div className="w-12 h-12 bg-pink-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
      <Icon className="w-6 h-6 text-[#C2185B]" />
    </div>
  </div>
  <h3 className="text-xl font-bold mb-1 dark:text-white">{title}</h3>
  <p className="text-sm text-zinc-500 mb-6">{company} • {location}</p>
  <div className="flex justify-between items-center mt-auto">
    <span className="font-bold text-sm dark:text-white">{pay}</span>
    <button className="bg-[#C2185B] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-[#A3154D] cursor-pointer">
      Apply now
    </button>
  </div>
</div>
```

### Header

#### Fixed Header with Scroll Effect
```tsx
<header className={cn(
  "fixed top-0 z-50 w-full transition-all duration-300",
  isScrolled 
    ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800" 
    : "bg-transparent"
)}>
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1 cursor-pointer">
        <img src="/logo.png" alt="Kairos Logo" className="w-10 h-10 object-contain" />
        <span className="text-xl font-bold dark:text-white">Kairos<span className="text-[#C2185B]">.</span></span>
      </Link>
      
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8">
        {/* Nav links */}
      </nav>
      
      {/* Actions */}
      <div className="hidden md:flex items-center gap-4">
        <ThemeToggle />
        <Link href="#">Sign In</Link>
        <button className="bg-[#C2185B] text-white px-5 py-2 rounded-full text-sm font-medium">
          {ctaText}
        </button>
      </div>
    </div>
  </div>
</header>
```

### Search Bar Card

#### Hero Search Card
```tsx
<div className="max-w-2xl mx-auto lg:mx-0 bg-white rounded-[2rem] p-6 shadow-2xl shadow-pink-500/10 border border-zinc-100 relative z-20">
  <div className="flex items-center gap-2 p-1 border border-zinc-100 rounded-2xl mb-4">
    <div className="flex-1 flex items-center gap-3 pl-4">
      <Search className="w-5 h-5 text-zinc-400" />
      <input 
        type="text" 
        placeholder="Search..."
        className="w-full bg-transparent border-none focus:ring-0 text-zinc-900 placeholder:text-zinc-400 py-3"
      />
    </div>
    <button className="bg-[#C2185B] text-white p-4 rounded-2xl hover:bg-[#A3154D] transition-colors cursor-pointer">
      <ArrowRight className="w-5 h-5" />
    </button>
  </div>
  
  <div className="flex flex-wrap gap-2">
    {tags.map(tag => (
      <span key={tag} className="px-4 py-2 rounded-full bg-pink-50 text-xs font-bold text-zinc-900 cursor-pointer hover:bg-pink-100 transition-colors">
        {tag}
      </span>
    ))}
  </div>
</div>
```

### Section Header

#### Standard Section Header
```tsx
<div className="max-w-3xl mb-16">
  <span className="text-[#C2185B] font-bold text-xs uppercase tracking-widest mb-2 block">{label}</span>
  <h2 className="text-4xl lg:text-5xl font-bold dark:text-white leading-tight">{title}</h2>
  <p className="text-lg text-zinc-500 dark:text-zinc-400 mt-4">{description}</p>
</div>
```

### Footer

#### Multi-Column Footer
```tsx
<footer className="bg-transparent pt-16 pb-8">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
      {/* Brand column */}
      <div className="lg:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <img src="/logo.png" alt="Kairos Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold dark:text-white">Kairos</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-xs leading-relaxed">
          {brandText}
        </p>
      </div>
      
      {/* Link columns */}
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="text-xs font-bold tracking-widest text-gray-900 dark:text-white mb-6 uppercase">
            {section.title}
          </h3>
          <ul className="space-y-4">
            {section.links.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    
    <div className="pt-8 text-center md:text-left">
      <p className="text-xs text-gray-500 dark:text-gray-500">
        © {new Date().getFullYear()} Kairos. All rights reserved.
      </p>
    </div>
  </div>
</footer>
```

---

## Layout Patterns

### Container
```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {content}
</div>
```

### Section Padding
```tsx
<section className="py-24">
  {content}
</section>

// Or with background
<section className="py-24 bg-[var(--background)]">
  {content}
</section>
```

### Grid Layouts
```tsx
// 2 columns
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {items}
</div>

// 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items}
</div>

// 4 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {items}
</div>
```

### Hero Layout (Two Column)
```tsx
<section className="relative pt-20 pb-12 lg:pt-40 lg:pb-5 overflow-hidden">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="relative z-10">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex-1 max-w-[60%] lg:max-w-xl text-left">
          <span className="inline-block px-4 py-2 rounded-full bg-[#1A1A1A] text-xs font-bold text-zinc-400 mb-6 uppercase tracking-wider">
            {badge}
          </span>
          <h1 className="text-2xl sm:text-5xl lg:text-7xl font-bold dark:text-white leading-[1.1] mb-4">
            {heading}
          </h1>
          <p className="text-[12px] sm:text-base lg:text-xl text-zinc-400 mb-0 leading-relaxed">
            {subtext}
          </p>
        </div>
        
        <div className="flex-1 max-w-[50%] lg:max-w-lg">
          <img src={imageSrc} alt={imageAlt} className="w-full h-auto object-contain" />
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## Animations

### Marquee Animation
```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 30s linear infinite;
}

.animate-marquee-reverse {
  display: flex;
  width: max-content;
  animation: marquee 35s linear infinite reverse;
}

.marquee-container {
  overflow: hidden;
  position: relative;
  width: 100%;
}

.marquee-container::before,
.marquee-container::after {
  content: "";
  position: absolute;
  top: 0;
  width: 100px;
  height: 100%;
  z-index: 2;
}

.marquee-container::before {
  left: 0;
  background: linear-gradient(to right, var(--background), transparent);
}

.marquee-container::after {
  right: 0;
  background: linear-gradient(to left, var(--background), transparent);
}
```

### Transitions
```tsx
// Color transition
transition-colors

// Transform + shadow
transition-shadow
transition-transform hover:-translate-y-1

// All properties
transition-all

// Duration
duration-300
```

### Framer Motion
- Available for advanced animations (imported but not heavily used yet)
- Can be used for staggered animations, scroll reveals, etc.

---

## Project Structure

```
kairos_landing_page/
├── public/
│   ├── logo.png
│   ├── company_hero.png
│   ├── talent_hero.png
│   ├── Jubelo.jpeg
│   ├── Ayorinde.jfif
│   └── [partner logos]
├── src/
│   ├── app/
│   │   ├── about/
│   │   ├── case-studies/
│   │   ├── categories/
│   │   ├── contact/
│   │   ├── for-business/
│   │   ├── hire-talent/
│   │   ├── how-it-works/
│   │   ├── jobs/
│   │   ├── privacy-policy/
│   │   ├── security/
│   │   ├── terms-of-service/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── client-layout.tsx
│   │   │   ├── company-landing.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── header.tsx
│   │   │   ├── job-landing.tsx
│   │   │   └── trust-section.tsx
│   │   ├── providers/
│   │   │   ├── intent-provider.tsx
│   │   │   └── theme-provider.tsx
│   │   └── ui/
│   │       ├── intent-modal.tsx
│   │       ├── scroll-to-top.tsx
│   │       └── theme-toggle.tsx
│   └── lib/
│       ├── api.ts
│       └── utils.ts
├── package.json
├── tsconfig.json
├── tailwind.config (implicit via @tailwindcss/postcss)
├── postcss.config.mjs
├── next.config.ts
└── eslint.config.mjs
```

### Key Files

#### `src/app/layout.tsx`
- Root layout with Geist fonts
- ThemeProvider from `next-themes`
- ClientLayout wrapper
- Metadata configuration

#### `src/app/page.tsx`
- Home page with intent-based routing
- Renders either `JobLanding` or `CompanyLanding`

#### `src/app/globals.css`
- Tailwind imports
- CSS custom properties for colors
- Marquee animation keyframes
- Global styles

#### `src/lib/utils.ts`
- `cn()` utility function (clsx + tailwind-merge)

---

## Implementation Guidelines

### 1. Intent-Based Architecture
The platform uses a dual-intent system:
```tsx
// intent-provider.tsx manages:
type Intent = "talent" | "company";
```
- Home page switches between `JobLanding` and `CompanyLanding`
- Header provides intent switch button
- Use `useIntent()` hook to access/set intent

### 2. Theming
- Uses `next-themes` with `attribute="class"`
- Default: system theme
- Toggle via `ThemeToggle` component
- Dark mode: `.dark` class
- Always use `dark:` prefix for dark mode styles

### 3. Icons
- Use `lucide-react` exclusively
- Icon sizes: `w-5 h-5`, `w-6 h-6`
- Color: `text-[#C2185B]` for primary icons

### 4. Border Radius Scale
| Class | Usage |
|-------|-------|
| `rounded-md` | Small components |
| `rounded-lg` | Buttons |
| `rounded-xl` | Icons, small cards |
| `rounded-2xl` | Cards, containers |
| `rounded-[2rem]` / `rounded-[2.5rem]` / `rounded-[3rem]` | Large cards, sections |
| `rounded-full` | Pills, badges, circular buttons |

### 5. Typography Best Practices
- Hero: `text-7xl lg:text-7xl font-bold leading-[1.1]`
- Section headings: `text-4xl lg:text-5xl font-bold leading-tight`
- Body text: `text-sm leading-relaxed`
- Badges/labels: `text-xs font-bold uppercase tracking-widest`

### 6. Color Best Practices
- Never hardcode `#C2185B` - use the literal for now (no CSS var in TW)
- Always provide dark mode alternatives with `dark:` prefix
- Use semantic colors: `bg-white dark:bg-zinc-900`
- Pink accents only for CTAs and highlights

### 7. Accessibility
- Use semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`)
- Add `cursor-pointer` to interactive elements
- Provide hover states for all interactive elements
- Use `transition-colors` for smooth theme switching
- Images should have `alt` text

### 8. Performance
- Images: use `object-contain` or `object-cover`
- Lazy loading where appropriate
- Smooth scroll: `scroll-behavior: smooth` (already in globals.css)

### 9. Code Style
- Use Tailwind utility classes exclusively
- Extract components for repeated patterns
- Use `cn()` for conditional classes
- Keep components simple and focused
- Type all props with TypeScript

### 10. Component Naming
- PascalCase for components: `CompanyLanding`, `Header`, `Footer`
- camelCase for hooks and functions: `useIntent`, `handleClick`
- UPPER_SNAKE_CASE for constants
- kebab-case for files: `company-landing.tsx`

---

## Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run typecheck # Type check with TypeScript
```

---

## Key Patterns Recap

### Create a New Page
1. Create directory in `src/app/[page-name]/`
2. Create `page.tsx` (and optional `[PageName]Client.tsx` for client components)
3. Export default component

### Add a New Section
1. Use container + section padding
2. Add section header pattern
3. Use grid layout for cards
4. Apply hover effects

### Theme Toggle
```tsx
// Already provided in components/ui/theme-toggle.tsx
<ThemeToggle />
```

---

*Last Updated: May 2026*
*Version: 1.0*
*Project: Kairos Landing Page (Next.js)*
