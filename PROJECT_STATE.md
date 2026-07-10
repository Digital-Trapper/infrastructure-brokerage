# Gephyra Markets — Project State

Last updated: 2026-07-10

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
- Production enquiry delivery via Resend is live
- Resend sending domain updates.gephyramarkets.com verified
- Vercel production environment variables configured: RESEND_API_KEY, ENQUIRY_FROM_EMAIL, ENQUIRY_TO_EMAIL
- Production enquiry form test completed successfully
- Enquiries now arrive at deals@gephyramarkets.com
- Automated confirmation email to enquiry submitters implemented
- Submitters receive a confirmation email after successful form submission
- Production confirmation email test completed successfully
- Lead capture is live
- Full lead capture flow is live end-to-end:
  - website form submission
  - internal lead email
  - submitter confirmation email
- Form accessibility and semantics reviewed
- Feature branch workflow introduced
- Separate Codex builder and reviewer workflow introduced
- Playwright E2E setup added
- Baseline Chromium homepage smoke coverage added
- GitHub Actions E2E workflow added for pull requests targeting main
- Playwright E2E + CI PR merged after checks passed, including Playwright E2E

## Current Engineering State

The enquiry form currently:
- delivers production enquiries via Resend
- sends enquiries to deals@gephyramarkets.com
- sends automated confirmation emails to submitters after successful form submission
- contains required fields
- has reviewed accessibility structure

Playwright E2E currently:
- uses the local Next.js app via webServer
- includes baseline Chromium homepage smoke coverage
- runs in GitHub Actions on pull requests targeting main

Currently not implemented:
- Backend enquiry persistence
- Supabase integration
- Enquiry idempotency

## Next Planned Feature

Outreach readiness:
- Privacy policy / basic legal trust layer
- Footer/contact email check
- First lead list
- Outreach copy

## Next PR

Outreach readiness

Goal:
Prepare the live site and operating materials for initial outbound lead generation.

Expected scope:
- Add privacy policy / basic legal trust layer
- Check footer and contact email details
- Prepare first lead list
- Draft initial outreach copy

## Planned Later Work

Likely sequence:

1. Outreach readiness
2. Supabase integration
3. Enquiry persistence
4. Idempotency protection
5. Further production hardening

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
