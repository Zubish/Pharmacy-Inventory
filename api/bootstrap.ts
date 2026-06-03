import {
  fail,
  loadRootState,
  loadTenantDatabase,
  requireMethod,
  sanitizeDatabase,
  saveRootState,
  TOTALENERGIES_ACCOUNT_NAME,
  TOTALENERGIES_COMPANY_SLUG,
} from "./_shared.js";
import type { HandlerRequest, HandlerResponse } from "./_shared.js";

export default async function handler(
  req: HandlerRequest,
  res: HandlerResponse,
) {
  if (!requireMethod(req, res, ["GET"])) return;
  try {
    const root = await loadRootState();
    await saveRootState(root);
    const tenant = root.tenants.find(
      (item) => item.slug === TOTALENERGIES_COMPANY_SLUG,
    );
    const db = tenant
      ? await loadTenantDatabase(TOTALENERGIES_COMPANY_SLUG)
      : null;
    res.status(200).json({
      hasUsers: Boolean(db && db.users.length > 0),
      tenantExists: Boolean(tenant),
      requestedSlug: TOTALENERGIES_COMPANY_SLUG,
      settings: db
        ? sanitizeDatabase(db).settings
        : {
            softwareName: "Totalenergies Pharmacy Inventory",
            accountName: TOTALENERGIES_ACCOUNT_NAME,
            pharmacyName: TOTALENERGIES_ACCOUNT_NAME,
            branchName: "Totalenergies Clinic",
            companySlug: TOTALENERGIES_COMPANY_SLUG,
            companyCode: "TOTAL-RX",
            businessLicense: "",
            mainBranchAddress: "",
            logoDataUrl: "",
            nearExpiryDays: 90,
            approvalThreshold: 25000,
          },
    });
  } catch (error) {
    fail(
      res,
      500,
      error instanceof Error
        ? error.message
        : "Unable to load application bootstrap",
    );
  }
}
