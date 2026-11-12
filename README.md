# NexForever — Official Studio Portfolio Website

> **Built for What's Next. Made to Last.**

A futuristic, interactive 3D creative technology studio portfolio built with **React**, **Vite**, **Three.js / React Three Fiber**, **GSAP**, **Lenis**, and **Lucide React**.

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server (http://localhost:5173)
npm run dev

# Build for production
npm run build
```

---

## Project Structure

```
NexForever/
├── index.html                        ← Vite entry HTML (Manrope + Syne fonts)
├── package.json                      ← Dependencies & scripts
├── vite.config.js                    ← Vite configuration
│
├── public/
│   └── images/
│       ├── nexforever-logo.png       ← Official transparent logo (replace here)
│       └── projects/                 ← Portfolio project images
│
├── src/
│   ├── components/
│   │   ├── assistant/
│   │   │   ├── RobotAssistant.jsx    ← Floating pearl-chrome robot mascot ("Nex")
│   │   │   ├── AssistantPanel.jsx    ← Glassmorphism local FAQ & navigation drawer
│   │   │   └── assistantData.js      ← Section prompts & guided studio Q&A data
│   │   ├── layout/
│   │   │   ├── Navbar.jsx            ← Floating glass navigation bar & mobile drawer
│   │   │   └── Footer.jsx            ← Dark minimal footer
│   │   ├── portfolio/
│   │   │   ├── ProjectGallery.jsx    ← Filterable grid & intentional empty state
│   │   │   ├── ProjectCard.jsx       ← 3D-tilt interactive project card
│   │   │   └── ProjectModal.jsx      ← Full-screen accessible project detail modal
│   │   ├── scene/
│   │   │   ├── SceneBackground.jsx   ← Fullscreen fixed WebGL canvas & fallback
│   │   │   ├── InfinityScene.jsx     ← Studio lighting, chrome material & animation
│   │   │   └── InfinityGeometry.jsx  ← Parametric 3D lemniscate TubeGeometry
│   │   ├── sections/
│   │   │   ├── Hero.jsx              ← Split hero, availability pill & marquee
│   │   │   ├── About.jsx             ← Editorial studio story & expandable values
│   │   │   ├── Services.jsx          ← Interactive capability cards & enquire routing
│   │   │   ├── Portfolio.jsx         ← Portfolio section controller
│   │   │   ├── Approach.jsx          ← Scroll-driven 4-stage interactive timeline
│   │   │   └── Contact.jsx           ← Editable details & validated enquiry form
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── GlassCard.jsx         ← Shared glass surface with pointer 3D tilt
│   │       └── SectionHeading.jsx
│   ├── data/
│   │   ├── config.js                 ← Brand, availability badge, contact & socials
│   │   ├── projects.js               ← Portfolio project entries & category list
│   │   └── services.js               ← Services deliverables & scope descriptions
│   ├── hooks/
│   │   └── useScrollProgress.js      ← Scroll indicator & back-to-top state
│   ├── styles/
│   │   ├── global.css                ← Design system, glassmorphism & logo sizing
│   │   └── responsive.css            ← Breakpoints (360px – 1920px)
│   ├── App.jsx                       ← Lenis smooth scroll + GSAP ScrollTrigger
│   └── main.jsx
```

---

## Customization Guide

### 1. Replace the Official Logo
Place your transparent white PNG logo at:
`public/images/nexforever-logo.png`

Adjust height via CSS custom properties in `src/styles/global.css`:
```css
--logo-nav-height: 32px;
--logo-footer-height: 28px;
```

### 2. Update Brand Availability, Contact Details & Social Links
Edit `src/data/config.js` to configure:
- `brand.availability` (live status badge in Hero)
- `contact.email`, `contact.whatsapp`, `contact.instagram`, `contact.location`
- `social.*` links

### 3. Update Services & Deliverables
Edit `src/data/services.js` to adjust service titles, tags, short descriptions, expandable `details`, and deliverable bullets.

### 4. Add Portfolio Projects
1. Add cover and gallery images to `public/images/projects/`.
2. Open `src/data/projects.js` and copy/uncomment the project template inside `projectsData`.
   Supported fields: `id`, `title`, `category`, `shortDescription`, `coverImage`, `images`, `technologies`, `overview`, `challenges`, `solutions`, `results`, `liveUrl`, `sourceUrl`.
3. Save — the gallery cards, category filters, and interactive modal view update automatically.
