# Totalenergies Pharmacy Inventory

Totalenergies Pharmacy Inventory is a dedicated clinic pharmacy file for tracking medicines received, stocked, dispensed, and costed for Totalenergies staff care.

The app is based on the newer RxLedger operating framework, but this repo is no longer positioned as a multi-tenant retail pharmacy product. It is scoped to one company pharmacy operation for Totalenergies.

## What It Does

- Tracks medicines by batch, expiry date, supplier, clinic site, and least sellable unit.
- Supports FEFO stock discipline when medicines are dispensed.
- Records prescription dispensing as a cost-tracking workflow, not a retail POS sale.
- Keeps staff/patient details, medication labels, therapy days, refill follow-up notes, and dispensing history.
- Maintains receiving review calculations for container packs, unit cost, markup, selling/cost price, and stock value.
- Provides reports for stock on hand, movement, expiry risk, dispensing cost, suppliers, and audit history.
- Supports role-based access for admins, pharmacists, pharmacy technicians, and viewers/auditors.

## Module Structure

The Totalenergies build is implemented as focused clinical pharmacy modules:

- **Clinical Pharmacy Inventory**: medicine catalog, batch stock, receiving, FEFO stock movement, expiry, and reorder alerts.
- **Prescription Dispensing**: pharmacist-led medicine dispensing, labels/counseling notes, supplied quantities, and dispensing history.
- **Pending Medication**: automatic records for prescription medicines saved with `0` supplied quantity because stock is unavailable.
- **Prescription Continuity / Patient Continuity**: editable patient lookup, medication history, refill follow-up, a separate Pending Medication continuity page, grouped continuity alerts, and branch-aware stock suggestions.
- **Clinical Safety Support**: future pharmacist-assistive review prompts for duplicate therapy, interaction cautions, repeated antibiotic use, and misuse-risk patterns.
- **Audit, Access, And Governance**: branch/site scope, super admin authority, viewer restrictions, reports, security events, and audit trail.

## Totalenergies Scope

Totalenergies already has an EMR, so this app does not try to replace clinical records. It fills the pharmacy model gap: medicines are received into pharmacy stock, dispensed against staff/patient needs, and recorded so the clinic can understand the cost of medicines issued.

The previous POS screen is now presented as **Prescriptions**. The workflow still uses the fast cart-style dispensing engine, but the business meaning has changed:

- items are medicines only;
- the record represents dispensed medicines;
- totals represent medicine cost/value tracked for the clinic;
- dispensing history supports patient continuity and pharmacy accountability.

The Mart section and public workspace/tenant selection flow are not part of this Totalenergies build.

The following modules are explicitly out of scope for Pharmacy Inventory:

- POS sales.
- Mart/general retail.
- Multi-tenant marketplace logic.
- HMO routing.
- Multi-pharmacy network.
- Patient app.
- Full EMR replacement.

See `docs/PHARMACY_INVENTORY_MODULES.md` and `docs/APP_BLUEPRINT.md` before planning major changes.

## Development

```bash
npm install
npm run lint
npm run build
npm run dev
```

For API-backed local development, use:

```bash
npm run dev:api
```

The API expects a Postgres connection through `DATABASE_URL`, `POSTGRES_URL`, or `POSTGRES_PRISMA_URL`.
