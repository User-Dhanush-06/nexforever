# NexForever — Official Studio Portfolio Website

> **Built for What's Next. Made to Last.**

A futuristic, interactive 3D creative technology studio portfolio built with **React**, **Vite**, **Three.js / React Three Fiber**, **GSAP**, and **Lenis**.

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
├── index.html                        ← Vite entry HTML
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
│   │   ├── layout/
│   │   │   ├── Navbar.jsx            ← Floating glass navigation bar & mobile drawer
│   │   │   └── Footer.jsx            ← Dark minimal footer
│   │   ├── scene/
│   │   │   ├── SceneBackground.jsx   ← Fullscreen fixed WebGL canvas & fallback
│   │   │   ├── InfinityScene.jsx     ← Studio lighting, chrome material & animation
│   │   │   └── InfinityGeometry.jsx  ← Parametric 3D lemniscate TubeGeometry
│   │   ├── sections/
│   │   │   ├── Hero.jsx              ← Full-viewport hero composition
│   │   │   ├── About.jsx             ← Studio overview & core values
│   │   │   ├── Services.jsx          ← 4 core capability cards
│   │   │   ├── Portfolio.jsx         ← Filterable project gallery & empty state
│   │   │   ├── Approach.jsx          ← 4-step interactive process timeline
│   │   │   └── Contact.jsx           ← Editable details & validated form
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── GlassCard.jsx
│   │       └── SectionHeading.jsx
│   ├── data/
│   │   ├── config.js                 ← Edit contact email, WhatsApp, socials & brand
│   │   ├── projects.js               ← Edit/add portfolio projects
│   │   └── services.js               ← Edit service cards & capabilities
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

### 2. Update Contact Information & Social Links
Edit `src/data/config.js` to set your `email`, `whatsapp`, `instagram`, `location`, and `social` links.

### 3. Add Portfolio Projects
1. Add project images to `public/images/projects/`.
2. Edit `src/data/projects.js` and add entries to `projectsData` matching one of the categories:
   - `Web Development`
   - `Video Production`
   - `Creative Design`
   - `Digital Marketing`
