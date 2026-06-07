# Pharmacy Inventory Modules

This document keeps the Totalenergies build modular without expanding it into the full RxLedger ecosystem.

## 1. Clinical Pharmacy Inventory

Purpose: maintain a reliable medicine stock file for Totalenergies clinic pharmacy operations.

Includes:

- Medicine catalog.
- Batch, expiry, supplier, and clinic site tracking.
- FEFO stock movement.
- Receiving review and cost/value calculations.
- Low-stock, out-of-stock, near-expiry, and expired-stock alerts.

Does not include Mart or general retail products.

## 2. Prescription Dispensing

Purpose: help pharmacists record medicine dispensing against staff/patient needs.

Includes:

- Medicine-only prescription basket.
- Patient name and phone capture.
- Supplied quantity and therapy-day capture.
- Label/counseling notes.
- Dispensing history and reconciliation.
- Stock deduction only when dispensing is actually recorded.

This is not a retail POS module.

## 3. Pending Medication

Purpose: remember medicines that could not be supplied because stock was unavailable.

Includes:

- Automatic record creation from prescription lines saved with `0` supplied quantity.
- Patient, medicine, quantity needed, branch/site, staff, note, and linked product context.
- Status flow for pending, available, contacted, fulfilled, cancelled, expired, not picked up, and not interested.
- Automatic availability flagging when matching stock is received in the same branch/site.

Does not include manual backorder entry.

## 4. Patient Continuity

Purpose: help pharmacy staff remember medication journeys without replacing Totalenergies EMR.

Includes:

- Patient lookup by name, phone, or receipt/reference.
- Medication history from dispensing records.
- Refill/follow-up reminders.
- Pending Medication records inside the patient page.
- Controlled phone visibility for viewer/audit users.

## 5. Clinical Safety Support

Purpose: assist pharmacy professionals with issues humans can miss.

Possible future checks:

- Duplicate therapy.
- Repeated antibiotic use.
- Refill timing concerns.
- Drug-food or drug-drug interaction prompts.
- Misuse-pattern prompts for pharmacist review.

This module must present review prompts, not diagnoses or autonomous dispensing decisions.

## 6. Audit, Access, And Governance

Purpose: keep Totalenergies pharmacy operations accountable.

Includes:

- Staff approval and designation management.
- Branch/site assignment and branch-scoped write access.
- Super admin global authority.
- Viewer/auditor restrictions.
- Security events.
- Audit trail.
- Reports and exports.

## Excluded Modules

These do not belong in Pharmacy Inventory:

- POS sales.
- Mart/general retail.
- Multi-tenant marketplace logic.
- HMO routing.
- Multi-pharmacy network.
- Patient app.
- Full EMR replacement.
