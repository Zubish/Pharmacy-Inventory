# Totalenergies Pharmacy Inventory Blueprint

This blueprint is the working guide for future Pharmacy Inventory changes. Read it before changing layout, navigation, prescription dispensing, patient workflow, branch access, reporting, or clinical safety behavior.

Pharmacy Inventory is a dedicated Totalenergies clinical pharmacy file. It is not the broad RxLedger community pharmacy product, not a retail POS, not an HMO routing layer, and not an EMR replacement.

## Product Shape

The authenticated workspace should feel calm, dense, clinical, and built for repeated pharmacy work inside Totalenergies clinic operations.

The core promise is:

- Clinical pharmacy stock control by medicine, batch, expiry, supplier, and clinic site.
- Pharmacist-led prescription dispensing and patient medication history.
- Pharmacy technician inventory management.
- Automatic Pending Medication records when prescribed medicines cannot be supplied.
- Audit-friendly reports and operational traceability.
- Role and branch access that preserves Totalenergies internal authority.

## Module Map

Pharmacy Inventory should be implemented as focused modules:

1. **Clinical Pharmacy Inventory**
   Medicine catalog, batch stock, suppliers, receiving, FEFO stock-out, expiry, reorder alerts, and stock value.

2. **Prescription Dispensing**
   Pharmacist-facing prescription basket, supplied quantities, labels/counseling notes, dispensing history, and cost tracking.

3. **Pending Medication**
   Automatic records from prescription lines saved with `0` supplied quantity because stock is unavailable. This module must not become a manual retail backorder tool.

4. **Patient Continuity**
   Patient lookup, medication history, refill timing, follow-up notes, and Pending Medication records inside the patient page.

5. **Clinical Safety Support**
   Future pharmacist-assistive checks such as duplicate therapy, repeated antibiotic use, drug interaction prompts, and counseling reminders. This should support professional review, not diagnose or replace clinical judgment.

6. **Audit, Access, And Governance**
   Users, branch/site access, viewer restrictions, security events, audit history, reports, and settings.

## Explicitly Out Of Scope

Do not implement these in Pharmacy Inventory:

- POS sales.
- Mart/general retail.
- Multi-tenant marketplace logic.
- HMO routing.
- Multi-pharmacy network.
- Patient app.
- Full EMR replacement.

Totalenergies already has an EMR. Pharmacy Inventory may support export or handoff later, but it must not try to become the clinical record system.

## Role Rules

- The clinical designations are **Pharmacist** and **Pharmacy Technician**.
- A Superintendent Pharmacist designation may exist for global authority/profile display.
- Pharmacists own prescription dispensing.
- Pharmacy Technicians own inventory management.
- Viewers/auditors can inspect permitted operational information but should not receive direct clinical phone access by default.
- The permanent/global admin can override access roles internally.
- Staff assigned to a branch/site can affect change only in that branch/site.
- Only the super admin can affect change across all branches/sites.
- Legacy cashier users should be removed during normalization, not migrated.

## Page Map

- Dashboard: metrics, assigned branch strip, branch summaries, operational alerts, and stock snapshot.
- Pharmacy: medicine catalog, requisition cart, batch/stock context, and fulfillment context.
- Suppliers: supplier records and supplied stock history.
- Receive: medicine stock receiving into the active clinic site.
- Prescriptions: medicine-only dispensing basket, patient fields, supplied quantities, labels, and dispensing history.
- Patients: patient lookup, medication history, refill reminders, follow-up messages, and Pending Medication records.
- Issue Stock: branch/site stock issue workflow.
- Adjustments: write-off, returns, and correction posting.
- Reports: medicine stock on hand, movement ledger, expiry, reorder, dispensing cost, suppliers, CSV/print output.
- Team Chat: internal staff coordination.
- Notifications: scoped operational alerts.
- Audit: activity history.
- Users: staff approval, designations, access roles, and security events.
- Branches: clinic site records and staff access.
- Guide: beta workflow guide.
- Settings: company file identity, logo, profile display, thresholds, and governance controls.

## Prescription And Pending Medication Rules

- Prescriptions are medicine-only records.
- Dispensing deducts stock from non-expired batches.
- If a pharmacist saves a prescribed medicine with `0` supplied quantity because stock is unavailable, the app creates a Pending Medication record automatically.
- Pending Medication records should live with the patient workflow and preserve useful clinical/pharmacy context.
- Manual `Mark available` should not exist. Availability should be triggered by matching received stock in the correct branch/site.
- Fulfillment still needs actual dispensing through Prescriptions so stock deduction remains accurate.

## Design Rules

- Use semantic labels, accessible controls, visible validation, and mobile-safe layouts.
- Use Material Design 3 ideas carefully: clear sections, status chips, restrained colors, obvious actions, and low cognitive load.
- Keep authenticated pages dense but readable.
- Use cards for repeated records, modals, and framed tools only.
- Buttons should describe concrete actions. Icon buttons need titles or accessible labels.
- Text must fit its container on mobile and desktop.

## Verification Checklist

For UI or workflow changes:

- Run `npm test`.
- Run `npm run lint`.
- Run `npm run build`.
- Check the app shell locally when layout or routing changes.
- Verify branch/site scope, viewer restrictions, and pharmacist/technician access if permissions are touched.
- Verify Pending Medication is automatic from unavailable prescription lines, not manual.

For deployment changes:

- Commit with a focused message.
- Push `master`.
- Confirm Vercel deployment is `READY`.
- Confirm production returns the new bundle.
