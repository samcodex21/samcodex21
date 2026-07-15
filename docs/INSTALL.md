# Installation

This repository is designed as a premium GitHub profile repository for the developer brand **Sam Codex**.

## 1. Create the Profile Repository

1. Create a new GitHub repository named exactly like your GitHub username.
2. Keep it public.
3. Copy every file from this `github-profile` folder into that repository.
4. Commit and push the files.

GitHub will render `README.md` as the profile landing page.

## 2. Confirm Repository Structure

The production profile package contains:

```text
.github/
assets/
components/
docs/
README.md
```

The README is written in GitHub-safe HTML and Markdown.

## 3. Replace Social Links

Replace every `xxxxxxxxx` value in `README.md` with the final public URL for:

- GitHub
- LinkedIn
- YouTube
- Instagram
- Twitter/X
- Website
- Email

## 4. Set the GitHub Username

Search the repository for `samcodex` and replace it with the exact GitHub username if it differs from the final account name.

Files to update:

- `README.md`
- `.github/workflows/*.yml`

## 5. Enable Workflow Permissions

Open the repository settings:

1. Go to **Settings**.
2. Open **Actions**.
3. Open **General**.
4. Under **Workflow permissions**, choose **Read and write permissions**.
5. Save the setting.

## 6. Configure Dynamic Feeds

Edit these files before the first scheduled workflow run:

- `config/content-sources.json`
- `config/youtube.json`
- `config/instagram.json`
- `config/linkedin.json`
- `config/npm.json`
- `config/blog.json`

For YouTube view counts, add a repository secret named `YOUTUBE_API_KEY`. Without that secret, the YouTube workflow still updates thumbnails, titles, links, and published dates from RSS.

## 7. Run Workflows

From the GitHub Actions tab, run:

- `Generate Contribution Snake`
- `Generate GitHub Metrics`
- `Update Latest Content Dashboard`
- `Update YouTube Feed`
- `Update Instagram Section`
- `Update LinkedIn Dashboard`
- `Update npm Packages`
- `Update Blog Feed`
- `Update GitHub Stats`
- `README Update`

Schedules:

- Contribution snake updates daily.
- GitHub metrics update daily.
- Latest content updates every six hours.
- YouTube updates every six hours.
- Instagram config section updates daily.
- LinkedIn config section updates daily.
- npm package cards update daily.
- Blog cards update daily.
- GitHub stats update daily.
- README refresh marker updates daily.

## 8. Replace the Portrait

No portrait image file was present in the attached files. The current `assets/profile.png` is a transparent, gold-lit profile asset so the hero can render cleanly until the final portrait is available.

To use the final portrait:

1. Remove the portrait background.
2. Add a soft gold rim light.
3. Export as transparent PNG.
4. Save over `assets/profile.png`.

## 9. Verify Hero Assets

Required assets:

- `assets/banner.png` at `1280x640`
- `assets/profile.png` with transparent background
- `assets/logo.svg`
- `assets/divider.svg`

The profile is ready after the README and assets are pushed to the public profile repository.
