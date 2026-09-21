# Comprehensive Refactoring Plan: Single Responsibility Principle (SRP) & Modularity across All Pages

Refactor all remaining application pages (`Create.jsx`, `Edit.jsx`, `Show.jsx`, `Dashboard.jsx`, and `Index.jsx`) in SIKATAR to adhere to the Single Responsibility Principle (SRP), modular UI extraction in `Partials/`, and custom state management hooks.

## User Review Required

> [!NOTE]
> All functional behavior, real-time live preview, wet signature background transparency extraction, school official stamp generation, auto-filling by NIP (permendagri 18 digits), and authorization gates remain 100% intact and verified.

---

## Completed Phases

### Phase 1: Shared Custom Hooks
- [x] [useAsyncTable.js](file:///c:/Kerja%20Praktik/SIKATAR/resources/js/Hooks/useAsyncTable.js): Debounced search, page transitions, and loading states without full-page refreshes.
- [x] [useEmployeeLookup.js](file:///c:/Kerja%20Praktik/SIKATAR/resources/js/Hooks/useEmployeeLookup.js): NIP sanitization, database auto-lookup, and remote API fallback.
- [x] [useApplicationSignatures.js](file:///c:/Kerja%20Praktik/SIKATAR/resources/js/Hooks/useApplicationSignatures.js): Dynamic wet signature and school stamp processing, camera integration, and transparent PNG extraction.

### Phase 2: Index Pages Refactoring (SRP & Promise/Async Table)
- [x] All 7 `Index.jsx` files refactored with `useAsyncTable` and modular table/filter partials:
  - `Admin/Applications/Index.jsx`
  - `Admin/Employees/Index.jsx`
  - `Admin/Schools/Index.jsx`
  - `Admin/DeletionRequests/Index.jsx`
  - `Operator/Applications/Index.jsx`
  - `Operator/Employees/Index.jsx`
  - `Operator/Employees/Archived.jsx`

### Phase 3: Employee Management Pages
- [x] Extracted shared partials:
  - `Partials/EmployeePersonalFields.jsx`
  - `Partials/EmployeeEmploymentFields.jsx`
  - `Partials/EmployeePhotoUpload.jsx`
  - `Partials/EditAuthorizationGate.jsx`
- [x] Refactored:
  - `Operator/Employees/Create.jsx`
  - `Admin/Employees/Create.jsx`
  - `Operator/Employees/Edit.jsx`
  - `Admin/Employees/Edit.jsx`
  - `Admin/Employees/Show.jsx`
  - `Operator/Employees/Show.jsx`

### Phase 4: School & Profile Management Pages
- [x] Extracted shared partials:
  - `Admin/Schools/Partials/SchoolProfileCard.jsx`
  - `Admin/Schools/Partials/SchoolOperatorAccountsTable.jsx`
  - `Operator/Profile/Partials/SchoolGeneralInfoForm.jsx`
  - `Operator/Profile/Partials/SchoolHeadmasterForm.jsx`
  - `Operator/Profile/Partials/SchoolOfficialAssetsForm.jsx`
- [x] Refactored:
  - `Admin/Schools/Show.jsx`
  - `Operator/Profile/Edit.jsx`

### Phase 5: Letter Application Lifecycle Pages (Show & Create)
- [x] Extracted partials:
  - `Admin/Applications/Partials/AdminDecisionPanel.jsx`
  - `Operator/Applications/Partials/RevisionNoticeBanner.jsx`
  - `Operator/Applications/Partials/ApplicationDetailForm.jsx`
  - `Operator/Applications/Partials/ClassificationTemplatePicker.jsx`
  - `Operator/Applications/Partials/ApplicantsMultiInput.jsx`
- [x] Refactored:
  - `Admin/Applications/Show.jsx`
  - `Operator/Applications/Show.jsx`
  - `Operator/Applications/Create.jsx` (down from 846 lines to clean orchestration)

### Phase 6: Dashboards (Admin & Operator)
- [x] Extracted partials:
  - `Admin/Partials/AdminStatCards.jsx`
  - `Admin/Partials/SchoolActivitySummary.jsx`
  - `Operator/Partials/OperatorStatCards.jsx`
  - `Operator/Partials/OperatorRecentDispatchesFeed.jsx`
  - `Operator/Partials/OperatorQuickActionsSidebar.jsx`
- [x] Refactored:
  - `Admin/Dashboard.jsx`
  - `Operator/Dashboard.jsx`

---

## Verification Plan

### Automated Build Verification
- [x] Run `npm run build` using Vite.
- Result: Build completed cleanly in 1.73s with 0 errors.

### Manual / Structural Inspection
- [x] Verify each component handles one and only one responsibility.
- [x] Verify state hooks are isolated from UI rendering.
