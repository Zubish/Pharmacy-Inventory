import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

const app = read("src/App.tsx");
const api = read("src/api.ts");
const action = read("api/action.ts");
const shared = read("api/_shared.ts");
const reset = read("api/auth/request-password-reset.ts");
const types = read("src/types.ts");
const readme = read("README.md");
const blueprint = read("docs/APP_BLUEPRINT.md");
const modules = read("docs/PHARMACY_INVENTORY_MODULES.md");

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
assertAbsent(
  readme,
  /cashiers/i,
  "Pharmacy Inventory documentation should not list cashiers as a supported role.",
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
  /Retail Products|Add Product|activeView === "products"|\|\s*"products"|Product markup overrides|stockItemType|movementItemType|setStockItemType|setMovementItemType/,
  "Pharmacy Inventory must not expose a Mart/general retail module.",
);
assertPresent(
  action,
  /Mart\/general retail products are outside the Totalenergies Pharmacy Inventory scope/,
  "Retail product writes should be blocked server-side for the Totalenergies scope.",
);
assert.equal(
  existsSync(join(root, "docs/FREEZE_II_CARE_NETWORK_FIGMA_BLUEPRINT.md")),
  false,
  "HMO/Care Network documentation belongs to RxLedger, not Pharmacy Inventory.",
);
for (const source of [readme, blueprint, modules]) {
  assertPresent(
    source,
    /Clinical Pharmacy Inventory[\s\S]*Prescription Dispensing[\s\S]*Pending Medication[\s\S]*Patient Continuity/s,
    "Pharmacy Inventory documentation should preserve the Totalenergies module map.",
  );
  assertPresent(
    source,
    /POS sales[\s\S]*Mart\/general retail[\s\S]*HMO routing[\s\S]*Full EMR replacement/s,
    "Pharmacy Inventory documentation should explicitly exclude unsupported modules.",
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
  action,
  /matchedBranchId[\s\S]*availableElsewhereQuantity[\s\S]*matchedAt/,
  "Pending medication records should preserve alternate clinic-site stock matches without changing availability status.",
);
assertPresent(
  app,
  /pending-medication-available-\$\{latest\.branchId\}[\s\S]*pending-medication-elsewhere-\$\{latest\.branchId\}/,
  "Prescription Continuity alerts should be grouped by branch context instead of one alert per medicine line.",
);
assertPresent(
  app,
  /Available at another clinic site[\s\S]*Add as pending[\s\S]*Map/,
  "Unavailable prescription search should suggest alternate Totalenergies clinic sites with map guidance.",
);
assertPresent(
  app,
  /Pharmacist Safety Review/,
  "Pharmacy Inventory should expose explainable pharmacist safety review prompts inside Prescriptions.",
);
assertPresent(
  app,
  /buildPharmacistSafetyReview[\s\S]*why:/,
  "Pharmacy Inventory safety prompts should explain why they appeared.",
);
assertPresent(
  action,
  /pharmacistReviewOutcome[\s\S]*safetyReviewSummary/,
  "Pharmacy Inventory should persist pharmacist review outcome and prompt summary.",
);
assertPresent(
  app,
  /Allergies or reactions[\s\S]*Current\/chronic medicines/,
  "Pharmacy Inventory safety review should include allergy, chronic medicine, and controlled medicine context.",
);
assertPresent(
  app,
  /Controlled\/monitored medicine review/,
  "Pharmacy Inventory safety review should flag controlled or monitored medicine context.",
);
assertPresent(
  app,
  /transferred: "Transfer requested"[\s\S]*Request transfer/,
  "Pharmacy Inventory Prescription Continuity should support transfer-request status without marking local stock fulfilled.",
);
assertPresent(
  app,
  /\|\s*"continuity"[\s\S]*\{ id: "continuity", label: "Continuity"/,
  "Pharmacy Inventory should expose Prescription Continuity as a separate page.",
);
assertPresent(
  app,
  /activeView === "continuity"[\s\S]*<PendingMedicationRecords/,
  "The separate Continuity page should render Pending Medication records.",
);
assertPresent(
  action,
  /case "updatePatientProfile"[\s\S]*updatePatientProfile[\s\S]*Updated patient profile/,
  "Pharmacy Inventory should support audited patient profile corrections.",
);
assertPresent(
  app,
  /Edit profile/,
  "Pharmacy Inventory patient profiles should be editable from the Patients page.",
);
assertPresent(
  app,
  /updatePatientProfile[\s\S]*Patient profile updated/,
  "Pharmacy Inventory patient edit form should call the patient profile update action.",
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
assertAbsent(
  app,
  /function SettingsView[\s\S]*Save profile/,
  "Settings must not expose staff profile saving.",
);
assertPresent(
  app,
  /designation: event\.target\.value as Designation/,
  "Permanent admin should still be able to update designation from user management.",
);
assertPresent(
  app,
  /const canDispense =[\s\S]*isSuperAdmin\(db, currentUser\)[\s\S]*currentUser\.role === "pharmacist"/,
  "The Superintendent Pharmacist/permanent admin should be allowed to dispense even without branch pharmacist assignment.",
);
assertPresent(
  action,
  /function canCompleteSaleInBranch\([\s\S]*primaryAdminId[\s\S]*canAdmin\(actor, primaryAdminId\)[\s\S]*actor\.role === "pharmacist"/,
  "Backend dispensing permission should allow the permanent admin as the highest access user.",
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
