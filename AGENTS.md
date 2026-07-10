# Gephyra Markets Agent Workflow

Gephyra Markets is a B2B brokerage platform for high-value infrastructure assets.

Stack:
- Next.js
- TypeScript
- Tailwind CSS
- Vercel

Repository:
- GitHub: `Digital-Trapper/infrastructure-brokerage`
- Default branch: `main`

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes -- APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Non-Negotiable Rules

- Never code directly on `main`.
- Use one feature branch per PR.
- Keep PRs narrowly scoped.
- Builder and reviewer agents must use separate threads.
- Reviewer agents must not edit code.
- Read `PROJECT_STATE.md` before making changes.
- Do not silently change unrelated files.
- Run relevant tests before merge.
- Never claim tests passed unless they were actually run.
- Update `PROJECT_STATE.md` after meaningful merged progress, using a separate docs PR where appropriate.

## Standard Branch Workflow

1. Check out `main`.
2. Pull the latest changes.
3. Create a feature branch.
4. Implement the scoped change.
5. Run relevant tests or validation.
6. Run a separate reviewer-agent pass.
7. Commit only intended changes.
8. Push the feature branch.
9. Open a PR.
10. Merge after checks pass and review blockers are resolved.
11. Clean up the local and remote branch.

## Builder Agent Checklist

- Read `PROJECT_STATE.md`.
- Inspect files relevant to the task before editing.
- State the files expected to be modified.
- Implement only the scoped task.
- Run relevant validation.
- Show `git diff`, `git diff --stat`, or `git status --short` as appropriate.
- Do not commit or push until instructed, unless the task explicitly says to do so.

## Reviewer Agent Checklist

- Act as reviewer only.
- Do not edit files.
- Inspect the full diff, including untracked files.
- Check scope, tests, risk, security, accessibility, and CI impact.
- List findings by severity.
- Give a merge-readiness verdict.

## Review Comment Handling

- Feed reviewer findings back to the builder thread.
- Fix only the stated issues unless the user expands scope.
- Rerun relevant tests after fixes.
- Repeat the reviewer pass if needed.

## Documentation Update Workflow

- Use separate docs branches and PRs for `PROJECT_STATE.md` updates after meaningful progress.
- Docs-only PRs should not change app code, tests, CI, dependencies, or config.
- `PROJECT_STATE.md` should record completed or merged progress, current production state, known gaps, and next planned work.
- Do not mix documentation housekeeping into feature PRs unless directly required.
- Docs-only PRs should have a title and description that clearly say documentation only.
- With Playwright path filters, docs-only PRs should not normally trigger E2E tests.

## PR Checklist

- Use a clear PR title.
- Include a concise summary.
- List validation commands actually run.
- Note required environment variables or operational details, if any.
- Confirm whether `PROJECT_STATE.md` is intentionally included or excluded.

## Merge Checklist

- Confirm required checks are green.
- Review the preview deployment when relevant.
- Confirm there are no reviewer blockers.
- Merge the PR.
- Check out `main`.
- Pull the latest changes.
- Delete the local feature branch.
- Delete the remote feature branch.
- Run `git status`.

## Production Verification

For lead capture changes:
- Test the live form.
- Confirm the internal email arrives.
- Confirm the submitter confirmation email arrives.
- Confirm no secrets are exposed in the browser, logs, or repository.

## Useful Commands

Create a branch:

```sh
git checkout main
git pull origin main
git checkout -b docs/example-branch
```

Commit and push:

```sh
git status --short
git diff --stat
git add AGENTS.md
git commit -m "Add agent PR workflow documentation"
git push -u origin docs/example-branch
```

Create a PR with GitHub CLI, if available:

```sh
gh pr create --base main --head docs/example-branch --title "Add agent PR workflow documentation" --body "Summary:
- Add repeatable builder/reviewer workflow documentation

Validation:
- Documentation-only change"
```

Clean up after merge:

```sh
git checkout main
git pull origin main
git branch -d docs/example-branch
git push origin --delete docs/example-branch
git status --short
```
