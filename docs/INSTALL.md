# Installation

This repository is designed to be used as a GitHub profile repository for the developer brand **Sam Codex**.

## 1. Create the Profile Repository

1. Create a new GitHub repository named exactly like your GitHub username.
2. Keep it public.
3. Copy every file from this `github-profile` folder into that repository.
4. Commit and push the files.

GitHub will render `README.md` as the profile landing page.

## 2. Replace Brand Links

Replace every `xxxxxxxxx` value in `README.md` with the final public URL for:

- GitHub
- LinkedIn
- YouTube
- Instagram
- Twitter/X
- Website
- Email
- DEV.to
- Hashnode

## 3. Set the GitHub Username

Search the repository for `samcodex` and replace it with the exact GitHub username if it differs from the final account name.

Files to update:

- `README.md`
- `.github/workflows/*.yml` only if you hardcode profile URLs

## 4. Enable Workflow Permissions

Open the repository settings:

1. Go to **Settings**.
2. Open **Actions**.
3. Open **General**.
4. Under **Workflow permissions**, choose **Read and write permissions**.
5. Save the setting.

## 5. Configure Metrics Token

The metrics workflow works best with a personal access token.

1. Create a GitHub token with read access to public profile data.
2. Add it as a repository secret named `METRICS_TOKEN`.
3. Run **Generate GitHub Metrics** manually from the Actions tab.

If you skip this step, the workflow falls back to `GITHUB_TOKEN`, but some metrics may be limited.

## 6. Configure Blog Feeds

Open `.github/workflows/blog.yml` and replace:

```yml
feed_list: "xxxxxxxxx, xxxxxxxxx, xxxxxxxxx"
```

Use RSS feed URLs for DEV.to, Hashnode, and Medium.

## 7. Configure YouTube Feed

Open `.github/workflows/youtube.yml` and replace:

```yml
feed_list: "xxxxxxxxx"
```

Use the channel RSS feed URL.

## 8. Confirm Featured Repositories

The README ships with featured repository cards for:

- `ultimate-rag-agent`
- `personal-ide`

Update the repository names and links if the final repositories use different names.

## 9. Run Automation

From the GitHub Actions tab, run:

- `Generate Contribution Snake`
- `Generate GitHub Metrics`
- `Update Latest Articles`
- `Update Latest Videos`
- `README Refresh`

The profile is ready after the first successful workflow pass.
