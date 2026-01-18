# Achievements

## 2026-01-16: Portfolio Codebase Cleanup

Completed a comprehensive code review and cleanup of the portfolio website.

### What was fixed:

**Critical Issues:**
- Replaced placeholder text in `loading.js` with a proper spinner
- Added `rel="noopener noreferrer"` to external links for security

**Important Fixes:**
- Fixed 9 typos in `projectsData.js` (visible to recruiters!)
- Fixed package.json name: `porfolio` -> `portfolio`
- Replaced magic numbers (1, 2, 3) with a `SECTIONS` constant and TypeScript types
- Fixed `useIsOnPhone` hook: typo in type name, missing useEffect dependency, added type safety
- Fixed React keys using array index - now using unique identifiers

**Improvements:**
- Created shared `Project` type in `src/types/project.ts`
- Added aria-labels to social links for accessibility
- All navigation components now use proper TypeScript types

### Files Modified:
- `src/app/loading.js`
- `src/components/About.tsx`
- `src/components/Work.tsx`
- `src/components/Content.tsx`
- `src/components/SideNav.tsx`
- `src/components/SmallNav.tsx`
- `src/components/Cv.tsx`
- `src/data/projectsData.js`
- `src/hooks/useIsOnPhone.ts`
- `package.json`
- `src/types/project.ts` (new file)

### Skills Practiced:
- TypeScript: union types, const assertions, type exports
- React: proper key usage, security best practices
- Accessibility: aria-labels
- Code organization: shared types file

---

## 2026-01-16: Portfolio Redesign - Grayscale + Glassmorphism

Completed a full redesign of the portfolio with a striking black & white theme combining gritty textures with liquid glass aesthetics.

### What was built:

**Design System:**
- Created grayscale color palette with CSS variables
- Implemented glass card utility classes with backdrop-blur
- Added grain/noise texture overlay
- Built responsive glassmorphism components

**New Components:**
- `Hero.tsx` - Full-screen hero with LiquidChrome WebGL background, GlitchText and BlurText animations
- `Navigation.tsx` - macOS-style Dock navigation with magnification effect
- `Footer.tsx` - Glass card contact section with social links
- `Experience.tsx` - Timeline-based glass card CV section

**React Bits UI Components (from scratch):**
- `LiquidChrome.tsx` - WebGL shader for liquid chrome effect
- `Aurora.tsx` - WebGL aurora animation background
- `Dock.tsx` - Animated dock with hover magnification
- `GlitchText.tsx` - CSS-based glitch text effect
- `BlurText.tsx` - Word-by-word blur reveal animation

**Architecture Changes:**
- Converted from section-switching to scroll-based single-page layout
- Replaced old navigation (SideNav, SmallNav) with Dock
- Integrated framer-motion animations throughout
- Added WebGL backgrounds using ogl library

### Files Created:
- `src/components/Hero.tsx`
- `src/components/Navigation.tsx`
- `src/components/Footer.tsx`
- `src/components/Experience.tsx`
- `src/components/ui/LiquidChrome.tsx`
- `src/components/ui/Aurora.tsx`
- `src/components/ui/Dock.tsx`
- `src/components/ui/GlitchText.tsx`
- `src/components/ui/BlurText.tsx`

### Files Modified:
- `tailwind.config.js` - Added grayscale color palette
- `src/app/globals.css` - Complete rewrite with design system
- `src/app/page.js` - New scroll-based layout
- `src/app/layout.js` - Updated to use new bg color
- `src/app/loading.js` - On-brand loading spinner
- `src/components/About.tsx` - Rewritten as glass card
- `src/components/Work.tsx` - Rewritten with Aurora background

### Files Deleted (cleanup):
- `src/components/Content.tsx`
- `src/components/SideNav.tsx`
- `src/components/SmallNav.tsx`
- `src/components/NavItem.tsx`
- `src/components/LoopingHeader.tsx`
- `src/components/ProjectCard.tsx`
- `src/components/Cv.tsx`
- `src/components/CvPicture.tsx`
- `src/components/Card.tsx`
- `src/components/CardDescription.tsx`
- `src/components/CardImage.tsx`
- `src/hooks/useIsOnPhone.ts`

### Dependencies Added:
- `ogl` - WebGL library for shader effects

### Skills Practiced:
- WebGL: Creating custom shaders with GLSL
- React: Building reusable UI components
- CSS: Glassmorphism, backdrop-filter, CSS variables
- TypeScript: Component props interfaces
- Animation: Framer Motion animations, intersection observers
- Design systems: Creating cohesive visual language

---

## 2026-01-18: Scroll Snapping + Waves Background + Work Carousel

Added polish and interactivity to the portfolio with scroll snapping, a new animated background, and a project carousel.

### What was built:

**Scroll Snapping:**
- Added CSS `scroll-snap-type: y mandatory` to html element
- Each section now snaps into place with `scroll-snap-align: start`
- Creates a "magnetic" feel when scrolling between sections

**Waves Background (from reactbits.dev):**
- Created `Waves.tsx` - Canvas-based animated wave lines using Perlin noise
- Interactive: waves respond to mouse/touch movement
- Configured with subtle white lines on dark background
- Replaced LiquidChrome as the fixed background

**Work Section Carousel:**
- Installed `embla-carousel-react` for smooth carousel functionality
- One project card visible at a time (full width)
- Navigation: drag/swipe, arrow buttons, dot indicators
- Arrow buttons use GlassSurface component for consistent glass styling
- Buttons positioned outside the carousel for clean look

### Files Created:
- `src/components/ui/Waves.tsx`

### Files Modified:
- `src/app/globals.css` - Added scroll-snap styles, Waves CSS, Embla CSS
- `src/components/FixedBackground.tsx` - Swapped LiquidChrome for Waves
- `src/components/Work.tsx` - Converted to Embla carousel with GlassSurface buttons

### Dependencies Added:
- `embla-carousel-react` - Lightweight carousel library

### Skills Practiced:
- CSS: scroll-snap properties for section locking
- Canvas API: Perlin noise animation
- React: Embla carousel hooks (useEmblaCarousel, callbacks)
- Component reuse: Using GlassSurface for consistent styling
- Debugging: Spotted and fixed button positioning bug
