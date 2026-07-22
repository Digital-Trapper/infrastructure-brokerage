# Gephyra Markets — Project State

Last updated: 2026-07-22

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
- Generator market-focus section added beneath the homepage hero
- Generator positioning covers used, ex-rental and surplus diesel generators, initially focused on 400–550 kVA equipment for UK and export markets
- Generator market-focus CTA links to the contact enquiry section
- Generators added as an enquiry form option, with server validation and email-label support
- Unit and Playwright coverage added for generator selection, validation and mocked email delivery
- Generator market-focus feature independently reviewed with no blocking findings
- Generator market-focus pre-merge validation completed successfully:
  - `npm run test:unit` — 9/9 passed
  - `npm run lint` — passed
  - `npm run build` — passed
  - `npm run test:e2e` — 12/12 passed
  - `git diff --check` — passed

## Current Engineering State

The enquiry form currently:
- delivers production enquiries via Resend
- sends enquiries to deals@gephyramarkets.com
- sends automated confirmation emails to submitters after successful form submission
- offers Generators as an equipment type, supported by server validation and email labels
- contains required fields
- has reviewed accessibility structure

The homepage currently:
- includes a current-market-focus section beneath the hero
- positions used, ex-rental and surplus diesel generators, initially focused on 400–550 kVA equipment for UK and export markets
- links the generator CTA to the contact enquiry section

Playwright E2E currently:
- uses the local Next.js app via webServer
- includes baseline Chromium homepage smoke coverage
- covers generator selection, validation and mocked email delivery
- runs in GitHub Actions on pull requests targeting main

Outstanding follow-up:
- Production deployment of the generator market-focus feature has not been recorded as verified
- Live generator enquiry delivery and confirmation email delivery have not been recorded as verified
- Low priority: click the generator CTA in Playwright and verify navigation to the contact section, beyond checking `href="#contact"`
- Low priority: assert the generator confirmation-email label precisely enough to prevent regression to the BESS label

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
