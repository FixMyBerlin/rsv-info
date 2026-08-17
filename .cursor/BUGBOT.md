# Bugbot

## Dependabot and bot PRs

If the pull request author is `dependabot[bot]`, or the head branch name starts with `dependabot/`:

- Do **not** review the PR.
- Do **not** leave comments, summaries, findings, or check annotations.
- Stop immediately; spend no review budget on dependency bumps.

These PRs are mechanical version updates. Humans review them with the FMC `review-dependabot` workflow (changelog + CI), not Bugbot.
