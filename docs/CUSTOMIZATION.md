# Customization

## Brand System

Primary colors:

- Black: `#0B0B0D`
- Deep gray: `#141417`
- Gold: `#D6AF36`
- Soft gold: `#F5D879`
- Warm white: `#F5F2E8`

Visual direction:

- Luxury
- Cyberpunk
- Glassmorphism
- Developer dashboard
- Black and gold contrast
- Futuristic AI command center

## Portrait

No portrait image file was present in the attached files. The repository includes a transparent, gold-lit profile asset at `assets/profile.png` so the hero remains production-ready.

To use the final portrait:

1. Remove the background from the portrait.
2. Export it as a transparent PNG.
3. Add a soft gold outer glow and subtle rim light.
4. Save it as `assets/profile.png`.
5. Keep the canvas square so it sits correctly in the hero section.

Recommended export:

- Format: PNG
- Background: transparent
- Size: `512x512` or larger

## Banner

The hero banner is `assets/banner.png`.

Required size:

- Width: `1280`
- Height: `640`

The generated banner includes:

- `SAM CODEX`
- `AI AUTOMATION ENGINEER`
- `SAAS BUILDER`
- `OPEN SOURCE`
- `Build • Automate • Scale • Impact`
- circuit lines
- AI particles
- matrix-style code
- terminal and dashboard panels
- gold glow accents

## SVG Assets

Editable brand primitives:

- `assets/logo.svg`
- `assets/divider.svg`
- `assets/about-vscode.svg`
- `assets/animated-terminal.svg`
- `assets/animated-stats.svg`
- `assets/animated-quote.svg`
- `assets/animated-header.svg`
- `assets/animated-gradient.svg`
- `assets/animated-tech-icons.svg`
- `assets/animated-wave.svg`

Use the same black and gold palette when editing them.

## Components

Reusable README snippets live in `components/`:

- `hero.md`
- `typing.md`
- `social-links.md`
- `dashboard.md`
- `about.md`
- `tech-stack.md`
- `projects.md`
- `analytics.md`
- `snake.md`
- `content-dashboard.md`
- `youtube-feed.md`
- `instagram.md`
- `linkedin.md`
- `npm-packages.md`
- `blog-feed.md`
- `animations.md`
- `support.md`
- `footer.md`

GitHub does not automatically import Markdown partials into a profile README, so `README.md` remains the rendered source of truth.

## Dynamic Content

Dynamic sections are controlled by update markers in `README.md`.

Configuration files:

- `config/content-sources.json` - DEV.to, Hashnode, Medium, GitHub releases, npm packages, and external blog feeds.
- `config/youtube.json` - YouTube channel ID, channel URL, max videos, and optional API stats mode.
- `config/instagram.json` - Instagram profile URL, follower count, and six thumbnail/link entries.
- `config/linkedin.json` - LinkedIn profile card, followers, experience, skills, and manually curated posts.
- `config/npm.json` - npm package names for daily registry updates.
- `config/blog.json` - DEV.to, Hashnode, Medium, and custom RSS feeds.

Workflow files:

- `.github/workflows/snake.yml`
- `.github/workflows/metrics.yml`
- `.github/workflows/content.yml`
- `.github/workflows/youtube.yml`
- `.github/workflows/instagram.yml`
- `.github/workflows/linkedin.yml`
- `.github/workflows/npm.yml`
- `.github/workflows/blog.yml`
- `.github/workflows/github-stats.yml`
- `.github/workflows/readme-update.yml`

Instagram cannot be reliably scraped directly from GitHub Actions. Use `config/instagram.json` with thumbnail URLs generated from an approved Instagram API, CDN export, or manually curated image links.

## Social And Support Links

All profile and support links intentionally use `xxxxxxxxx`.

Replace them with final URLs only after the public accounts and payment links are ready.

## SEO

The README contains a hidden SEO comment at the top. Update it if the developer brand changes focus or adds new keywords.
