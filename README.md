# DevHQ : Personal Portfolio Website

<div align="center">
  
  [![Live Portfolio](https://img.shields.io/badge/Portfolio-Live_Demo-7928CA?style=for-the-badge&logo=vercel&logoColor=white)](https://aakarsh-devhq.vercel.app/)
  [![Three.js](https://img.shields.io/badge/Three.js-r128-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
  [![GSAP](https://img.shields.io/badge/GSAP-3.12.2-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
  [![Schema.org](https://img.shields.io/badge/Schema.org-JSON--LD-blue?style=for-the-badge&logo=schema.org&logoColor=white)](https://schema.org/)
  [![LLMs.txt](https://img.shields.io/badge/GEO-LLMs.txt_Standard-purple?style=for-the-badge)](https://llmstxt.org/)
  [![Vercel](https://img.shields.io/badge/Vercel-Serverless-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
  [![Resend](https://img.shields.io/badge/Resend-Email_API-white?style=for-the-badge&logo=minutemailer&logoColor=black)](https://resend.com/)

  <p><strong>A high-performance personal portfolio featuring a 3D WebGL starfield, 60/120fps LERP momentum scroll animations, serverless contact pipeline, and a triple-layer SEO/GEO/AEO knowledge architecture.</strong></p>

</div>

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
  - [1. 3D WebGL Starfield Engine](#1-3d-webgl-starfield-engine)
  - [2. 60/120fps LERP Momentum Scroll Engine](#2-60120fps-lerp-momentum-scroll-engine)
  - [3. Triple-Layer Optimization (SEO, GEO & AEO)](#3-triple-layer-optimization-seo-geo--aeo)
  - [4. Secure Serverless Backend](#4-secure-serverless-backend)
- [Featured Projects](#featured-projects)
- [Tech Stack](#tech-stack)
- [Performance & Optimization](#performance--optimization)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Author](#author)

---

## Overview

**DevHQ** is the personal developer portfolio of **Aakarsh Bibhaw**, a Computer Science undergraduate at IIIT Kota and Software Development Engineer Intern. 

Built from the ground up with vanilla web technologies, the platform combines modern WebGL graphics, fluid physics-damped animation loops, accessible glassmorphism, and a secure serverless email pipeline. In addition to human visitors, DevHQ is optimized for machine intelligence—incorporating Schema.org multi-entity graphs, Google AI Overview FAQ schemas, and the modern `/llms.txt` standard for AI citation fidelity across ChatGPT, Perplexity, and Claude.

---

## Key Features

- **Interactive 3D WebGL Starfield:** 3,200 procedurally generated star particles with dynamic mouse parallax and depth perspective.
- **Physics-Damped LERP Timeline:** Liquid 60/120fps linear interpolation (`delta * 0.12`) on the experience timeline, eliminating layout thrashing and scroll stutter.
- **Triple-Engine Search Architecture:** Full-spectrum optimization spanning traditional **SEO**, Generative Engine Optimization (**GEO** via `/llms.txt`), and Answer Engine Optimization (**AEO** via structured `FAQPage` JSON-LD).
- **Cinematic Boot Sequence:** Sleek preloader sequence with progress telemetry and cycling developer taglines.
- **Interactive Project Mockups:** Custom browser mockup windows with live URL badges, hover overlays, tech stack chips, and single-line action buttons.
- **Synchronous Typewriter Contact Form:** Intelligent multi-field placeholder typing synchronized across Purpose, Name, Email, and Message, coupled with honeypot spam protection.
- **Glassmorphic Resume Modal:** Accessible, keyboard-trapped (`Escape` key support) PDF reader with circular frosted controls and download triggers.
- **Dual-Perspective About Section:** "Behind The Code" personal philosophy paired with a direct CTA bridging to the technical GitHub developer README.
- **Hardware-Accelerated Compositing:** Optimized with `will-change`, sub-pixel clipping masks (`background-clip: padding-box`), and CSS custom properties.

---

## System Architecture

### 1. 3D WebGL Starfield Engine
Implemented via Three.js (`3d_background.js`):
- **Particle System:** 3,200 geometry vertices styled with custom radial gradient alpha masks for authentic stellar glow.
- **Parallax Math:** Mouse tracking across X and Y axes creates subtle inertia and organic 3D depth.
- **Device Adaptation:** Viewport resizing hooks and device pixel ratio capping (`Math.min(window.devicePixelRatio, 2)`) prevent GPU overload on mobile screens.

### 2. 60/120fps LERP Momentum Scroll Engine
Eliminates browser transition conflicts on the Experience section vertical progress bar (`script.js` & `style.css`):
- Replaced clashing CSS height transitions with an active `requestAnimationFrame` animation loop.
- **Momentum Damping:** Uses linear interpolation:
  $$\text{currentProgress} \mathrel{+}= (\text{targetProgress} - \text{currentProgress}) \times 0.12$$
- **Reflow Elimination:** Milestone dots activate via cached offset math rather than continuous `getBoundingClientRect()` reads during scroll passes.

### 3. Triple-Layer Optimization (SEO, GEO & AEO)
Engineered for both human search and machine intelligence:
- **SEO (Traditional):** Open Graph (`og:type="profile"`), Twitter Summary Cards, verified 1200×630 asset previews, semantic headings with `<span class="sr-only">`, and Google image sitemaps ([sitemap.xml](sitemap.xml)).
- **GEO (Generative Engine Optimization):** Adopts the emerging [llmstxt.org](https://llmstxt.org) standard via root [llms.txt](llms.txt) for accurate LLM indexing (ChatGPT Search, Perplexity, Claude), alongside permissive AI crawler directives in [robots.txt](robots.txt).
- **AEO (Answer Engine Optimization):** Complete Schema.org `@graph` located at the base of `<body>` including `Person`, `WebSite`, `ItemList` (Software Applications), and `FAQPage` structured data to power Google AI Overviews and featured snippets.

### 4. Secure Serverless Backend
Located in `api/submit.js`:
- **Zero Client Key Exposure:** Form submissions dispatch a POST payload to the serverless endpoint `/api/submit`.
- **Node.js Native:** Communicates over native Node.js HTTPS with the [Resend API](https://resend.com/), dispatching clean, responsive HTML email notifications.
- **Honeypot & Rate Defense:** Silently traps automated spam bots through concealed validation triggers without degrading human UX.

---

## Featured Projects

| Project | Category | Tech Stack | Link |
| :--- | :--- | :--- | :--- |
| **Nyaya Saathi** | Legal Tech / AI Platform | React.js, FastAPI, Python, Gemini AI, TailwindCSS | [Live App](https://nyaayasaathi.vercel.app) \| [GitHub](https://github.com/arshbibhaw/Nyaya-Saathi) |
| **IIIT Kernel** | Official Club Platform | HTML5, CSS3, JavaScript, Vercel | [Live Website](https://iiit-kernel.vercel.app) \| [GitHub](https://github.com/arshbibhaw/IIIT-Kernel-2K25-Website) |
| **DevHQ** | 3D Interactive Portfolio | Three.js, GSAP 3, WebGL, Node.js, Resend API | [Live Portfolio](https://aakarsh-devhq.vercel.app/) \| [GitHub](https://github.com/arshbibhaw/DevHQ-Personal-Portfolio-Website) |
| **TruCheck** | Browser Security Extension | JavaScript, Chrome Extensions API, Safe Browsing, HIBP | [Docs](https://github.com/arshbibhaw/TruCheck-Browser-Security-Extension#readme) \| [GitHub](https://github.com/arshbibhaw/TruCheck-Browser-Security-Extension) |
| **Stealth Project** | Confidential Software | Under NDA | In Development |

---

## Tech Stack

### Frontend & Graphics
- **Core:** Semantic HTML5, Modern CSS3 (Grid, Flexbox, Custom Properties), Vanilla JavaScript (ES6+)
- **3D & Motion:** Three.js (r128), GSAP (3.12.2), GSAP ScrollTrigger
- **Typography & Icons:** Font Awesome 6.4.0, Devicon, Google Inter, VALORANT Display Font

### Backend & Cloud Infrastructure
- **Serverless Compute:** Vercel Serverless Functions (Node.js runtime)
- **Email Delivery:** Resend API
- **Analytics & Telemetry:** Vercel Web Analytics & Speed Insights

### Standards & Schema Protocols
- **Structured Data:** Schema.org JSON-LD (`Person`, `WebSite`, `ItemList`, `FAQPage`)
- **LLM Context:** `llms.txt` (llmstxt.org standard)
- **Robots Directives:** Custom crawler policies supporting `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`

---

## Performance & Optimization

- **Lighthouse Score:** 95+ across Performance, Accessibility, Best Practices, and SEO.
- **Steady 60/120fps Rendering:** GPU-accelerated canvas animations with pixel ratio bounds.
- **Minimal Asset Footprint:** Lightweight vanilla implementation without heavy frontend framework overhead.
- **Accessibility:** Screen-reader heading contexts, semantic ARIA attributes, and keyboard navigation support.

---

## Project Structure

```text
Portfolio_Website/
├── api/
│   └── submit.js              # Vercel Serverless Function (Resend Email Handler)
├── portfolio_assets/          # Optimized project mockups, icons, and resume PDF
│   ├── Aakarsh_Resume.pdf
│   ├── Aakarsh-DevHQ.png
│   ├── DevHQ_Favicon.jpg
│   ├── project_preview_devhq.png
│   ├── project_preview_iiit_kernel.png
│   ├── project_preview_nyaya_saathi.png
│   ├── project_preview_stealth.png
│   └── project_preview_truCheck.png
├── 3d_background.js           # Three.js starfield particle engine
├── index.html                 # Clean semantic markup + Schema.org graph
├── llms.txt                   # Machine-readable LLM context standard (GEO)
├── package.json               # Vercel analytics & scripts
├── robots.txt                 # Search & AI crawler permissions
├── script.js                  # LERP timeline, typewriter form, modal & navigation
├── sitemap.xml                # Canonical XML sitemap with image metadata
└── style.css                  # Modern glassmorphism, responsive styles & animations
```

---

## Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- Optional: [Vercel CLI](https://vercel.com/cli) (`npm i -g vercel`)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/arshbibhaw/DevHQ-Personal-Portfolio-Website.git
   cd DevHQ-Personal-Portfolio-Website
   ```

2. **Configure environment variables (for contact form):**
   Create a `.env` file in the root directory:
   ```env
   RESEND_API_KEY=your_resend_api_key_here
   ```

3. **Run locally:**
   Using any static server:
   ```bash
   npx http-server -p 3000
   ```
   Or using the Vercel CLI (to test the serverless function locally):
   ```bash
   vercel dev
   ```

4. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Author

**Aakarsh Bibhaw**  
*Computer Science Undergraduate (IIIT Kota) \| Software Development Engineer*

- **Portfolio:** [aakarsh-devhq.vercel.app](https://aakarsh-devhq.vercel.app/)
- **LinkedIn:** [linkedin.com/in/aakarsh-bibhaw](https://linkedin.com/in/aakarsh-bibhaw)
- **GitHub:** [github.com/arshbibhaw](https://github.com/arshbibhaw)
- **LeetCode:** [leetcode.com/arshbibhaw](https://leetcode.com/arshbibhaw)
- **HackerRank:** [hackerrank.com/arshbibhaw](https://hackerrank.com/arshbibhaw)
- **Email:** [cse.arsh@gmail.com](mailto:cse.arsh@gmail.com)

---

<div align="center">
  
  Made with passion by Aakarsh Bibhaw  
  © 2026 All Rights Reserved
  
</div>
