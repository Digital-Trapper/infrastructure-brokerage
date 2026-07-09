# Gephyra Markets — Project State

Last updated: 2026-07-09

## Product

Gephyra Markets is a B2B brokerage platform for high-value infrastructure assets.

Initial focus includes:
- BESS
- UPS systems
- Data-centre infrastructure
- Other high-value industrial assets

## Live Environment

Production:
https://gephyramarkets.com

Hosting:
Vercel

DNS:
Cloudflare

## Repository

GitHub:
Digital-Trapper/infrastructure-brokerage

Default branch:
main

## Current Stack

- Next.js
- TypeScript
- Tailwind CSS
- Vercel

## Completed

- Initial landing page built
- Production deployment completed
- Custom domain configured
- Cloudflare DNS configured
- Enquiry form UI added
- Enquiry form mailto flow added
- Form accessibility and semantics reviewed
- Feature branch workflow introduced
- Separate Codex builder and reviewer workflow introduced
- Playwright E2E setup added
- Baseline Chromium homepage smoke coverage added
- GitHub Actions E2E workflow added for pull requests targeting main
- Playwright E2E + CI PR merged after checks passed, including Playwright E2E

## Current Engineering State

The enquiry form currently:
- uses a mailto action
- uses method="post"
- uses encType="text/plain"
- contains required fields
- has reviewed accessibility structure

Playwright E2E currently:
- uses the local Next.js app via webServer
- includes baseline Chromium homepage smoke coverage
- runs in GitHub Actions on pull requests targeting main

Currently not implemented:
- Backend enquiry persistence
- Supabase integration
- Resend integration
- Enquiry idempotency

## Next PR

Supabase integration

Goal:
Introduce the backend foundation for persisted enquiries.

Expected scope:
- Add Supabase project configuration
- Prepare environment variable handling
- Define initial enquiry persistence path

## Planned Later Work

Likely sequence:

1. Supabase integration
2. Enquiry persistence
3. Idempotency protection
4. Confirmation state
5. Resend transactional email
6. Further production hardening

## Working Rules

- Never work directly on main
- One feature branch per PR
- One fresh ChatGPT chat per PR
- Separate Codex builder and reviewer threads
- Reviewer does not modify code
- Keep PRs narrow
- Run relevant tests before merge
- Never claim tests passed unless they were actually run
- Update this file after meaningful merged progress
- Prefer evidence over assumptions
- Clearly state uncertainty when something has not been verified
