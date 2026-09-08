# Bugbot

## Dependabot and bot PRs

If the pull request author is `dependabot[bot]`, or the head branch name starts with `dependabot/`:

- Do not review the PR.
- Do not leave comments, summaries, findings, or check annotations.
- Stop immediately.

These PRs are version bumps. Humans review them with the FMC `review-dependabot` skill (changelog triage and CI), not Bugbot.
