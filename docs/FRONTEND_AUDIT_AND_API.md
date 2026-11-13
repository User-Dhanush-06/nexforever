# NexForever — Phase 2 Frontend Audit, Feature Mapping & REST API Contracts

> **Status:** Phase 2 Specification & Implementation Reference  
> **Backend Stack:** Spring Boot `4.1.2` / Java `17` / MySQL `8.0` / Flyway / Spring Security / Spring Data JPA  
> **Frontend Stack:** React `18.3` / Vite `5.1` / Three.js + React Three Fiber / GSAP / Lenis

---

## 1. Complete Frontend Audit

Every existing React component, data file, hook, and stylesheet was inspected:

| Area / File | Current Implementation | Data Source | Persistence / Auth / Upload Gap | Visual / UX Findings |
|---|---|---|---|---|
| `src/App.jsx` | Single-page scroll layout (`Hero`, `About`, `Services`, `Portfolio`, `Approach`, `Contact`, `Footer`) with Lenis + GSAP ScrollTrigger + `RobotAssistant`. | Static imports + component state. | No SPA routing for `/admin` or `/admin/login`; public settings fetched once at app level needed for synced Navbar/Hero/Contact/Footer. | GSAP animations clear props cleanly; Lenis runs smoothly; spacing between sections benefits from slightly greater vertical rhythm (`clamp(5.75rem, 9.5vw, 9.25rem)`). |
| `src/components/layout/Navbar.jsx` | Sticky glass navbar, active scroll section detection, mobile menu overlay, brand logo fallback. | `siteConfig.brand` (static). | Should stay anchored cleanly on public page; `/admin` route renders clean workspace nav/exit back to `/`. | Solid layout; `.nav__links` responsive collapse at `900px` works cleanly. |
| `src/components/sections/Hero.jsx` | 2-column split grid (`55% / 45%`), status availability pill, mint-outlined headline (`What's Next.`), dual CTAs, moving capabilities marquee, Three.js infinity background. | `siteConfig.brand.availability` & local `marqueeItems`. | `availability` pill should pull from `GET /api/settings` so studio availability updates dynamically. | `.hero__grid` lacked explicit horizontal `gap`; `.hero__scroll-cue` needs extra clearance below `.hero__marquee` on ~768–860px height laptops; `.hero__nowrap` can risk overflow below `360px` viewport widths. |
| `src/components/sections/About.jsx` | Intro grid with studio synthesis card, lead + body copy, core pillars, target audience pills, and 3 expandable value cards (`Innovation`, `Creativity`, `Quality`). | Hardcoded studio narrative & values. | Purely brand narrative; appropriate to keep lightweight frontend editorial copy while giving spacing polish. | Slightly increase `.about__intro-grid` bottom margin and `.about__body` line-height/gap for improved readability. |
| `src/components/sections/Services.jsx` | 4 core service cards with expandable "How We Deliver" drawers, 2 Audience Solution tracks, and 3 customizable Package cards (`Launch`, `Grow`, `Elevate`) that pre-fill `Contact.jsx`. | `servicesData`, `audienceSolutionsData`, `packagesData` from `src/data/services.js`. | Core services should load dynamically from `GET /api/services` (preserving graceful fallback & loading state). | `.service-card__capabilities` should maintain bottom clearance above `.service-card__footer`; `.studio-subblock` top margin can be opened slightly for clearer hierarchy. |
| `src/components/sections/Portfolio.jsx`, `ProjectGallery.jsx`, `ProjectCard.jsx`, `ProjectModal.jsx` | Category filter pills with counts, horizontal drag/swipe/keyboard/dot carousel, multi-image detail modal overlay with challenge/solution/outcomes/tech tags. | `projectsData` (`[]`), `testimonialsData` (`[]`), `siteConfig.api.*Endpoint` (`''`). | Hardcoded empty static arrays + empty endpoint hooks; no loading skeleton, error retry state, or dynamic media; empty state copy referenced developer filename `src/data/projects.js`. Needs `GET /api/projects`, `GET /api/projects/{idOrSlug}`, `GET /api/testimonials`. | Project cards and modal are clean; add non-intrusive loading/error states and refine empty state copy for end users. |
| `src/components/sections/Approach.jsx` | Scroll-driven 4-stage horizontal/vertical timeline (`Discover`, `Strategize`, `Create`, `Deliver`) and "Before We Begin" FAQ accordion. | Hardcoded `steps` & `faqs` arrays. | FAQs should be loaded from `GET /api/faqs` (admin-manageable in MySQL) with loading/empty handling. | `.faq-item--open .faq-item__panel` hardcoded `max-height: 220px`, which clips longer FAQ answers on narrow viewports (`360px`–`430px`); switch to `grid-template-rows: 0fr -> 1fr`. |
| `src/components/sections/Contact.jsx` | Contact info column + 3-step Project Inquiry Wizard (`Service` -> `Planning` -> `Details`). | `siteConfig.contact`, `servicesData`, `packagesData`. | Displayed `"Setup required"` notice and triggered `mailto:` only; **no database persistence**, no server validation feedback, no rate-limit/honeypot spam defense. Needs `GET /api/settings` + `POST /api/enquiries`. | Wizard option pills & summary chips look great; add subtle honeypot field (visually hidden `aria-hidden`), clear server validation error banner, and real persisted submission confirmation with enquiry ID. |
| `src/components/layout/Footer.jsx` | 4-column footer with logo, tagline, socials, navigation links, contact details. | `siteConfig` static defaults. | Dynamic contact & social URLs from `GET /api/settings`, plus subtle `Studio Admin` link to `/admin`. | Empty social URLs rendered `<a href="#">`, causing unexpected scroll-to-top jumps when clicked; omit unconfigured links or render non-navigating buttons/hide inactive links cleanly. |
| `src/components/assistant/RobotAssistant.jsx`, `AssistantPanel.jsx`, `assistantData.js` | Floating chrome SVG CHITTI with cursor physics/gaze tracking, section-aware bubble, slide-up panel with clickable suggestion chips. | Local `assistantSuggestions` array (`setTimeout` typing delay). | No backend integration and no free-text input field. Should connect to `POST /api/chitti/chat` using hybrid backend architecture (`STRUCTURED_KNOWLEDGE` active, extensible `AiProviderAdapter` interface). | Keep exact CHITTI 3D pearl-chrome SVG, gaze physics, and welcome bubble intact; add a clean compact input bar inside `AssistantPanel` without breaking panel height limits on mobile. |
| Admin Interface *(Missing)* | Not present in baseline frontend. | N/A | Required by Phase 2 for admin login (`BCrypt`), dashboard stats, Projects & Media CRUD, Services CRUD, Testimonials CRUD, FAQs CRUD, Enquiries status/notes workflow, and Site Settings management. | Implement lazy-loaded `/admin/login` and `/admin` routes matching NexForever's dark obsidian + mint glassmorphism design system without altering `/`. |

---

## 2. Frontend-to-Backend Feature Mapping

| # | Frontend Component | Current Behavior | Required Backend Functionality | API Endpoint(s) | Auth | Error / Loading Handling |
|---|---|---|---|---|---|---|
| 1 | `Services.jsx` & `Contact.jsx` | Reads static `servicesData` array | Fetch published services ordered by display order | `GET /api/services` | Public | Loading skeleton + fallback error notice with retry |
| 2 | `Portfolio.jsx`, `ProjectGallery.jsx`, `ProjectModal.jsx` | Empty `projectsData`; optional unused fetch | Fetch published projects with nested gallery media; fetch detail by ID/slug | `GET /api/projects`, `GET /api/projects/{idOrSlug}` | Public | Loading state, graceful architectural empty state when 0 projects exist, error retry banner |
| 3 | `Portfolio.jsx` (Testimonials strip) | Empty `testimonialsData` | Fetch approved + published testimonials only | `GET /api/testimonials` | Public | Section hidden seamlessly if empty or none published |
| 4 | `Approach.jsx` (FAQ list) | Hardcoded 4-item `faqs` array | Fetch published FAQs ordered by `displayOrder` | `GET /api/faqs` | Public | Loading placeholder, graceful empty omission if 0 FAQs |
| 5 | `Hero.jsx`, `Contact.jsx`, `Footer.jsx` | Hardcoded `siteConfig` placeholders | Serve public `site_settings` (`brand`, `contact`, `social`) | `GET /api/settings` | Public | Safe fallback defaults until settings are customized |
| 6 | `Contact.jsx` (Inquiry Wizard) | `mailto:` link or setup warning; no persistence | Validate request, check honeypot & per-IP rate limit, hash IP, persist enquiry in MySQL | `POST /api/enquiries` | Public (spam & rate-limited) | Field errors (`400`), rate-limit warning (`429`), network error retry (`5xx`), persisted confirmation (`201`) |
| 7 | `RobotAssistant.jsx` & `AssistantPanel.jsx` | Static chip answers after 420ms timer | Hybrid CHITTI endpoint: deterministic intent/FAQ matching + live studio data + modular AI provider boundary | `POST /api/chitti/chat` | Public | Typing animation while awaiting API, clean offline fallback message |
| 8 | `AdminLoginPage.jsx` | Does not exist | Authenticate against `admins` (BCrypt), establish HttpOnly session + CSRF token, rate-limit brute-force logins | `GET /api/admin/auth/csrf`, `POST /api/admin/auth/login`, `POST /api/admin/auth/logout`, `GET /api/admin/auth/me` | Public (login/csrf) / `ROLE_ADMIN` (`me`, `logout`) | Invalid credential error (`401`), account disabled (`403`), rate limit (`429`) |
| 9 | `AdminDashboardPage.jsx` | Does not exist | Aggregate DB counts, recent enquiries, full CRUD for Projects, Project Media, Services, Testimonials, FAQs, Enquiries, Media Uploads, Site Settings | `/api/admin/**` (see Section 3) | `ROLE_ADMIN` + `X-XSRF-TOKEN` CSRF | `401` redirects to `/admin/login`, field validation banner, delete confirmations |

---

## 3. REST API Contract Specification

All responses share a uniform envelope (`ApiResponse<T>`):

```json
{
  "success": true,
  "message": "Optional human-readable summary",
  "data": {},
  "errors": null,
  "timestamp": "2026-11-12T17:00:00Z"
}
```

### 3.1 Public Endpoints (`/api/...`)
- `GET /api/services` -> `ServiceDto[]`
- `GET /api/projects?category=...&search=...` -> `ProjectDto[]` (status = `PUBLISHED` only)
- `GET /api/projects/{idOrSlug}` -> `ProjectDto` (status = `PUBLISHED` only, `404` otherwise)
- `GET /api/testimonials` -> `TestimonialDto[]` (`approved = true && published = true`)
- `GET /api/faqs` -> `FaqDto[]` (`published = true`)
- `GET /api/settings` -> `PublicSettingsDto` (`brand`, `contact`, `social`)
- `POST /api/enquiries` -> Request: `{ name, email, audienceProfile, packageName, serviceInterest, budgetScope, planningPreference, message, website }` -> Response `201`: `{ id, referenceCode, status, createdAt }`
- `POST /api/chitti/chat` -> Request: `{ message, questionId, activeSection }` -> Response `200`: `{ reply, actionLabel, actionTarget, matchedTopic, mode, aiConfigured, suggestions }`
- `GET /api/media/files/{storageKey}` -> Binary image/video stream with validated `Content-Type` and `X-Content-Type-Options: nosniff`

### 3.2 Protected Admin Endpoints (`/api/admin/...`)
Every route below (except `/api/admin/auth/csrf` and `/api/admin/auth/login`) requires authenticated `ROLE_ADMIN` session cookie + `X-XSRF-TOKEN` header on mutations:
- **Auth:** `GET /api/admin/auth/csrf`, `POST /api/admin/auth/login`, `POST /api/admin/auth/logout`, `GET /api/admin/auth/me`
- **Dashboard:** `GET /api/admin/dashboard`
- **Projects:** `GET /api/admin/projects`, `GET /api/admin/projects/{id}`, `POST /api/admin/projects`, `PUT /api/admin/projects/{id}`, `PATCH /api/admin/projects/{id}/status`, `DELETE /api/admin/projects/{id}`
- **Services:** `GET /api/admin/services`, `POST /api/admin/services`, `PUT /api/admin/services/{id}`, `DELETE /api/admin/services/{id}`
- **Testimonials:** `GET /api/admin/testimonials`, `POST /api/admin/testimonials`, `PUT /api/admin/testimonials/{id}`, `DELETE /api/admin/testimonials/{id}`
- **FAQs:** `GET /api/admin/faqs`, `POST /api/admin/faqs`, `PUT /api/admin/faqs/{id}`, `DELETE /api/admin/faqs/{id}`
- **Enquiries:** `GET /api/admin/enquiries?status=...`, `GET /api/admin/enquiries/{id}`, `PATCH /api/admin/enquiries/{id}`, `DELETE /api/admin/enquiries/{id}`
- **Media:** `GET /api/admin/media`, `POST /api/admin/media` (`multipart/form-data` `file` + optional `altText`), `DELETE /api/admin/media/{id}`
- **Settings:** `GET /api/admin/settings`, `PUT /api/admin/settings`

