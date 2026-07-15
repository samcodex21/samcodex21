# Customization

## Brand System

Primary colors:

- Black: `#0B0B0D`
- Deep gray: `#141417`
- Gold: `#D6AF36`
- Soft gold: `#F5D879`
- Warm white: `#F5F2E8`

Visual direction:

- Minimal
- Luxury
- Cyberpunk
- Glassmorphism
- Developer dashboard
- Black and gold contrast

## Portrait

The attached request asks for an uploaded portrait, but no portrait file was present with the provided text attachment.

To use the final portrait:

1. Remove the background from the portrait.
2. Export it as a transparent PNG.
3. Add a soft gold outer glow and subtle rim light.
4. Save it as `assets/profile.png`.
5. Keep the canvas near square so it sits correctly in the hero section.

Recommended export:

- Format: PNG
- Background: transparent
- Size: `512x512` or larger

## Banner

The banner is `assets/banner.png`.

Required size:

- Width: `1280`
- Height: `640`

The generated banner already includes:

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

## README Cards

Project cards are in the **Current Projects** section of `README.md`.

For each project, update:

- status badge
- description
- progress percentage
- technology tags

## Featured Repositories

Replace the featured repository links and `repo=` query values in the **Featured Repository** section.

Example:

```md
repo=ultimate-rag-agent
```

## Social Buttons

All profile links intentionally use `xxxxxxxxx`.

Replace them with final URLs only after the public accounts are ready.

## Workflow Timing

Automation schedules use UTC cron.

Adjust the cron values in:

- `.github/workflows/snake.yml`
- `.github/workflows/metrics.yml`
- `.github/workflows/blog.yml`
- `.github/workflows/youtube.yml`
- `.github/workflows/README_UPDATE.yml`

## SEO

The README contains a hidden SEO comment at the top. Update it if the developer brand changes focus or adds new keywords.
