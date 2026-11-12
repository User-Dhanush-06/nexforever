# NexForever — System Audit & Full-Stack Architecture

> **Status:** Phase 1 Complete (Audit & Foundation)  
> **Branch:** `feature/nexforever-full-stack`  
> **Tagline:** *"Built for What's Next. Made to Last."*

---

## 1. Phase 1 Project Audit Summary

### 1.1 Existing Frontend & Dependencies (`package.json`)
- **Framework:** React `^18.3.1`, React DOM `^18.3.1`, Vite `^5.1.4`, `@vitejs/plugin-react` `^4.2.1`.
- **3D Engine:** `three` `^0.160.0`, `@react-three/fiber` `^8.15.16`, `@react-three/drei` `^9.99.0`.
- **Motion & Icons:** `gsap` `^3.12.5` (with `ScrollTrigger`), `lenis` `^1.1.18`, `lucide-react` `^0.344.0`.
- **Routing Gap:** `react-router-dom` is not yet installed; navigation uses in-page anchors (`#home`, `#about`, `#services`, `#portfolio`, `#approach`, `#contact`). Phase 4–5 will introduce client-side routing for `/`, `/projects/:slug`, and protected `/admin/*` views while keeping `/` intact.

### 1.2 Three.js Scene Verification
- **[SceneBackground.jsx](file:///c:/Users/userd/OneDrive/Desktop/NexForever/src/components/scene/SceneBackground.jsx):** Implements `WebGLErrorBoundary`, `isWebGLAvailable()` hardware fallback, tab-visibility throttling (`frameloop={isPageHidden ? 'never' : 'always'}`), DPR clamping `[1, 2]`, ACES Filmic tone mapping, and `webglcontextlost` recovery logging.
- **[InfinityGeometry.jsx](file:///c:/Users/userd/OneDrive/Desktop/NexForever/src/components/scene/InfinityGeometry.jsx):** Procedural Bernoulli lemniscate `TubeGeometry` with proper `.dispose()` cleanup on unmount.
- **[InfinityScene.jsx](file:///c:/Users/userd/OneDrive/Desktop/NexForever/src/components/scene/InfinityScene.jsx):** Offline-safe procedural `CanvasTexture` PMREM studio reflections, deterministic `BufferGeometry` ambient particle cloud, smooth pointer parallax, scroll-linked rotation, adaptive mobile/tablet/laptop scale, and `prefers-reduced-motion` support. Must remain untouched as the visual centerpiece.

### 1.3 Duplication, Unused Files & Cleanup Items Found
- **Duplicate CSS rules fixed in Phase 1:** `.contact__status`, `.contact__status--success`, and `.contact__status--warning` appeared twice in `src/styles/global.css`; consolidated into a single definition.
- **Leftover CSS selector fixed in Phase 1:** `.portfolio__grid` remained inside `src/styles/responsive.css` after `ProjectGallery.jsx` transitioned to `.portfolio-carousel`; removed.
- **Duplicate logo asset:** `assets/images/nexforever-logo.png` (181,994 B) duplicates `public/images/nexforever-logo.png` (181,994 B). Vite serves from `public/`; `assets/` is retained per repository guidelines for archival brand assets.
- **Repeated UI logic (scheduled for incremental refactor in Phase 4–5):**
  - Logo load-error fallback (`logoMissing` state + `logo-placeholder`) is repeated in `Navbar.jsx` and `Footer.jsx` → candidate for shared `<BrandLogo />`.
  - Scroll listeners exist separately in `App.jsx` (Lenis + GSAP), `useScrollProgress.js`, `Navbar.jsx`, and `Approach.jsx`.
  - `dist/` is currently tracked in Git from baseline commits; Phase 8 deployment prep should decide whether CI builds `dist/` cleanly without committing bundle churn.

### 1.4 Hardcoded Business Information Inventory
All business content below will progressively become admin-manageable via Spring Boot + MySQL APIs in Phases 2–5:
- `src/data/config.js`: Contact placeholders (`[ADD YOUR EMAIL]`, `[ADD WHATSAPP NUMBER]`, `[ADD INSTAGRAM URL]`, `[ADD BUSINESS LOCATION]`), availability pill, social URLs, API endpoint hooks (`api.projectsEndpoint`, `api.testimonialsEndpoint`).
- `src/data/services.js`: Core service cards (`servicesData`), audience solution tracks (`audienceSolutionsData`), and customizable packages (`packagesData`: `Launch`, `Grow`, `Elevate`).
- `src/data/projects.js` & `src/data/testimonials.js`: Empty by default until studio entries or API sources are populated.
- Inline component copy: `Hero.jsx` (`marqueeItems`), `About.jsx` (`values`, `pillars`, `partnerSectors`), `Approach.jsx` (`steps`, `faqs`), `assistantData.js` (CHITTI Q&A prompts).

### 1.5 Performance Observations
- Initial JS bundle (`dist/assets/index-*.js` ~1.17 MB raw / ~336 kB gzip) bundles Three.js, R3F, GSAP, Lenis, and all sections together.
- Planned Phase 4–5 optimization: lazy-load `/admin/*` routes and `ProjectDetailPage` via `React.lazy` + configure `vite.config.js` `manualChunks` (`react-vendor`, `three-vendor`, `motion-vendor`) so public landing pages never ship admin bundle code.

### 1.6 Local Environment & Toolchain Audit
- **Node.js / npm:** Available natively.
- **Java 17:** Eclipse Adoptium OpenJDK `17.0.17` installed natively.
- **Maven (`mvn`):** Not installed on host PATH — Phase 2 will include Maven Wrapper (`mvnw` / `mvnw.cmd`) so backend builds remain self-contained.
- **MySQL 8:** Not installed natively on host PATH; **Docker CLI `29.6.2`** is installed for containerized MySQL 8 and full-stack orchestration via `infrastructure/`.

---

## 2. Target Full-Stack Architecture

```text
NexForever/
├── src/                  # React + Vite public studio experience & protected /admin SPA
├── public/               # Static served assets (official transparent logo, icons)
├── assets/               # Archival source visual assets
├── backend/              # Java 17 / Spring Boot 3.x REST API, Security, Flyway, S3 & Mail
├── infrastructure/       # Dockerfiles, docker-compose (MySQL 8 + API + S3 dev), .env templates
├── docs/                 # Architecture & API specification docs
├── README.md
└── .gitignore
```

### 2.1 Backend Architecture (`backend/` — Phase 2 & 3)
Spring Boot 3.x (Java 17, Maven Wrapper) following strict separation of concerns:
- `config/` — CORS, Jackson, S3 client, mail properties, OpenAPI/Swagger, rate-limiter & async setup.
- `security/` — Spring Security 6 filter chain, BCrypt (`PasswordEncoder`), HTTP-only cookie / CSRF-protected session or hardened token auth, initial admin bootstrap from env vars (zero public registration), admin role enforcement.
- `controller/` — Versioned `/api/v1/public/**` (published projects, published services, approved testimonials, FAQs, public settings, enquiry POST with rate limit, Chitti knowledge endpoint) and `/api/v1/admin/**` (full CRUD, drafts, media presign/upload, enquiry notes/status, admin auth/session).
- `service/` — Business workflows, slug generation, enquiry notification email dispatch, S3 presigned URLs/validation.
- `repository/` — Spring Data JPA interfaces with pagination (`Pageable`) & filtered queries.
- `entity/` & `mapper/` — JPA domain models mapped cleanly to request/response DTOs (entities never exposed directly on API boundaries).
- `exception/` & `validation/` — `@RestControllerAdvice` consistent `{ success, data, message, errors, timestamp }` envelope + Bean Validation (`@Valid`) and MIME/size upload guards.

### 2.2 Relational Database Schema (MySQL 8 + Flyway — Phase 2)
Planned versioned Flyway migrations under `backend/src/main/resources/db/migration/`:
1. `admins` — `id`, `email` (unique), `password_hash` (BCrypt), `full_name`, `role`, `active`, `last_login_at`, `created_at`, `updated_at`.
2. `projects` — `id`, `slug` (unique), `title`, `category`, `client_name`, `short_description`, `overview`, `challenges`, `solutions`, `results`, `cover_image_url`, `external_url`, `source_url`, `technologies_json` / join list, `status` (`DRAFT` | `PUBLISHED`), `featured`, `display_order`, `published_at`, `created_at`, `updated_at`.
3. `project_media` — `id`, `project_id` (FK -> `projects`), `media_type` (`IMAGE` | `VIDEO`), `url`, `storage_key`, `alt_text`, `caption`, `display_order`, `created_at`.
4. `services` — `id`, `service_number`, `slug`, `title`, `tag`, `description`, `details`, `deliverables_json`, `icon_key`, `published`, `display_order`, `created_at`, `updated_at`.
5. `enquiries` — `id`, `name`, `email`, `audience_profile`, `package_name`, `service_interest`, `budget_scope`, `planning_preference`, `message`, `status` (`NEW` | `REVIEWING` | `CONTACTED` | `ARCHIVED`), `internal_notes`, `source_ip_hash`, `created_at`, `updated_at`.
6. `testimonials` — `id`, `author_name`, `author_role`, `company_or_channel`, `quote`, `category`, `approved`, `published`, `display_order`, `created_at`, `updated_at`.
7. `faqs` — `id`, `question`, `answer`, `category`, `published`, `display_order`, `created_at`, `updated_at`.
8. `site_settings` — `id`, `setting_key` (unique), `setting_value`, `updated_at` (manages availability badge, contact email, WhatsApp, Instagram, social links, location).
- *(Optional future table)* `chitti_conversations` — deferred until Phase 6+ explicitly requires persistent AI transcript storage.

### 2.3 CHITTI Hybrid Assistant Architecture (Phase 6)
- Frontend CHITTI component preserves its floating pearl-chrome visual design, `requestAnimationFrame` mouse-follow physics, visor gaze tracking, and mobile responsiveness.
- Phase 6 connects CHITTI to deterministic studio knowledge served cleanly (with backend `/api/v1/public/assistant/knowledge` & modular `assistantClient.js` adapter) ready to route future AI queries strictly through `React CHITTI -> Spring Boot API -> AI Provider` without exposing provider keys client-side.

### 2.4 Cloud Storage & Deployment Readiness (Phase 7)
- **Frontend:** Vercel / AWS Amplify with `VITE_API_BASE_URL`.
- **Backend:** Multi-stage Docker build + `/actuator/health` + structured logging + AWS App Runner / container runtime.
- **Database:** Amazon RDS (MySQL 8) with Flyway automated schema evolution and scheduled backups.
- **Media:** S3-compatible object storage (Amazon S3 in prod; MinIO or local filesystem profile in dev) enforcing allowlisted MIME types and max upload sizes.
- **Email:** Configurable SMTP / Amazon SES for enquiry notifications without exposing credentials.
