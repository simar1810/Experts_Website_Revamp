# Partner Landing Architecture

## Purpose

This module renders the tenant/partner homepage for subdomain routes such as
`<partner>.localhost` and `<partner>.zeefit.in`.

## Routing Entry

- Partner detection: `lib/tenant/resolve-partner.js`
- Root rendering decision: `app/layout.jsx`
- Root partner page: `features/partner-landing/pages/PartnerLandingPage.jsx`

## Folder Structure

- `features/partner-landing/pages`
  - Route-level page containers.
- `features/partner-landing/components`
  - Visual sections and fallback UI blocks.
- `features/partner-landing/services`
  - Class-based API access layer.
- `features/partner-landing/presenters`
  - Class-based view-model mappers for card rendering.
- `features/partner-landing/domain`
  - Shared defaults and design tokens.
- `features/partner-landing/context`
  - Branding context alias for migration compatibility.

## Data Flow

1. `resolvePartner()` resolves partner slug from host.
2. `PartnerLandingPage` loads partner config via `PartnerConfigService`.
3. `PartnerLandingPresenter` normalizes config into a UI model.
4. Backend `header/footer` HTML is rendered when present.
5. Local fallback header/footer components are used otherwise.
6. Experts and product cards are fetched client-side via SWR and class services:
   - `ExpertsListingService`
   - `ProgramsListingService`
7. Presenters map raw API payloads to stable UI card fields:
   - `ExpertCardPresenter`
   - `ProductCardPresenter`

## Compatibility Notes

- Old resolver import path remains compatible through a re-export:
  `features/experts-landing/helpers/resolve-partner.js`
- Old partner landing import path remains compatible through a re-export:
  `features/experts-landing/components/index.jsx`

This allows gradual migration of existing imports without breaking runtime behavior.
