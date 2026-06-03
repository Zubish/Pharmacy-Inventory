import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

const app = read("src/App.tsx");
const api = read("src/api.ts");
const action = read("api/action.ts");
const shared = read("api/_shared.ts");
const reset = read("api/auth/request-password-reset.ts");
const types = read("src/types.ts");

function assertAbsent(source, pattern, message) {
  assert.equal(pattern.test(source), false, message);
}

function assertPresent(source, pattern, message) {
  assert.equal(pattern.test(source), true, message);
}

assertAbsent(
  types,
  /type Role = .*cashier/i,
  "Pharmacy Inventory must not expose cashier as a live role.",
);
assertAbsent(
  app,
  /roleLabels[\s\S]*cashier/i,
  "The live role label map must not contain cashier.",
);
assertPresent(
  shared,
  /role\?\: unknown[\s\S]*role\) === "cashier"/,
  "Legacy cashier users should be detected and dropped during normalization.",
);

for (const source of [app, action, shared, types]) {
  assertAbsent(
    source,
    /savePosDraft|clearPosDraft|posDrafts|PosDraft|bookingCode/,
    "Prescription draft logic must stay removed from Pharmacy Inventory.",
  );
  assertAbsent(
    source,
    /cashierUserId|cashierDiscountLimitPercent|Only cashiers can complete sales/i,
    "Current Pharmacy Inventory code must not retain cashier role trails.",
  );
}

assertAbsent(
  app,
  /Mark available/,
  "Pending Medication availability should not be manually marked from the UI.",
);
assertPresent(
  action,
  /Pending medication can become available only after matching stock exists in this branch/,
  "Manual availability updates must be blocked unless matching branch stock exists.",
);
assertPresent(
  action,
  /flagPendingMedicationsAvailable[\s\S]*batch\.branchId/,
  "Positive stock movement should automatically check pending medication availability.",
);

assertPresent(
  app,
  /canViewPatientPhone=\{currentUser\.role !== "viewer"\}/,
  "Viewer/audit users should not receive direct patient phone access in pending medication records.",
);
assertPresent(
  app,
  /phone restricted/,
  "The UI should make restricted patient phone visibility explicit.",
);

assertPresent(
  action,
  /Staff designation is admin-managed/,
  "Staff should not be able to self-edit designation from Settings.",
);
assertAbsent(app, /Save profile/, "Settings must not expose profile saving.");
assertPresent(
  app,
  /designation: event\.target\.value as Designation/,
  "Permanent admin should still be able to update designation from user management.",
);
assertAbsent(
  app,
  /Software name\s*<input/,
  "Settings must not expose generic software name editing.",
);
assertPresent(
  action,
  /softwareName: db\.settings\.softwareName/,
  "Settings updates should preserve the internal software name instead of accepting customer-facing edits.",
);
assertPresent(
  app,
  /<strong>\{db\.settings\.accountName\}<\/strong>[\s\S]*Company file/,
  "The side panel should prioritize the Totalenergies company file name.",
);
assertPresent(
  app,
  /function getLowStockMedicines[\s\S]*medicine\.reorderLevel > 0[\s\S]*\(totals\.get\(medicine\.id\) \?\? 0\) <= medicine\.reorderLevel/,
  "Low-stock logic must include zero-stock medicines at or below reorder level.",
);
assertPresent(
  app,
  /const outOfStock = lowStock\.filter/,
  "Out-of-stock alerts should be derived from low-stock medicines so zero stock is flagged.",
);

assertAbsent(
  api,
  /Authorization.+Bearer/,
  "Client API requests should not send stored bearer tokens.",
);
assertPresent(
  shared,
  /HttpOnly; SameSite=Lax/,
  "Session cookies should be HttpOnly and SameSite=Lax.",
);
assertPresent(
  reset,
  /randomInt\(100000, 1000000\)/,
  "Password reset codes should use cryptographically secure randomInt.",
);

console.log("Rule regression tests passed.");
