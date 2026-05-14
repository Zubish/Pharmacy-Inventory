# Pharmacy Inventory Web App

Operational inventory app for a single-branch pharmacy in Nigeria. It tracks medicines by batch, expiry date, barcode, supplier, and immutable stock ledger movements.

## What Is Included

- First-run workspace setup for the pharmacy and first administrator
- Staff access requests with no default demo accounts
- Admin-controlled role assignment and account activation/suspension
- Role-aware access for Admin, Pharmacist, Inventory Officer, and Viewer/Auditor
- Medicine catalog with SKU, barcode, manufacturer, NAFDAC number, reorder level, and active status
- Supplier register with contact, address, and license reference
- Goods receiving workflow with mandatory batch, expiry, quantity, unit cost, supplier, and invoice reference
- Stock issue workflow with FEFO allocation and expired-batch blocking
- Adjustments, supplier returns, customer returns, and write-offs with mandatory reasons
- Dashboard for stock value, low stock, near expiry, expired batches, access approvals, and daily movements
- Reports for stock on hand, stock movement ledger, expiry, and reorder needs
- CSV export and browser Print/PDF workflow
- Audit trail for critical create/update/post actions

## First Use

1. Open the deployed app.
2. Complete the first-run setup form.
3. The first user becomes the active Admin.
4. Other staff should use **Request access**.
5. Admin reviews requests in **Users**, assigns a role, then activates the account.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://127.0.0.1:5173/
```

## Validate

```bash
npm run lint
npm run build
```

## Production Note

This app currently persists data in browser storage. That is useful for a fast operational prototype, but a real multi-user pharmacy deployment needs a shared backend database and server-side authentication so staff on different devices see the same inventory and user approvals.
