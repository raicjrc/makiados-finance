---
name: playwright_testing
description: Automated end-to-end testing, bug detection, layout verification, and UX regression testing for AliviaFin using Playwright.
---

# 🎭 Playwright Automated Testing & UX Verification

This skill guides automated testing, bug discovery, and visual regression checks for AliviaFin using Playwright.

---

## 1. Principles for AliviaFin Testing

1. **Zero Framework Bloat:** AliviaFin is a pure vanilla ES6+ web application. Tests must execute via standalone node scripts with Playwright (`npx -y playwright` or a lightweight test harness) without requiring heavy dependencies in the production bundle.
2. **Data Integrity First (Golden Rule):** Never execute tests that overwrite production rows in Supabase without mock or isolated user IDs.
3. **Multi-Platform Focus:** Always test both Desktop (Mac/PC 1280x800) and Mobile Viewport (iPhone 14 / Android 390x844).

---

## 2. Core Test Suites

### Suite A: Onboarding Wizard Resilience
* **Backdrop Click Immunity:** Clicking outside `#onboardingWizardModal` must NOT close the modal nor wipe user inputs.
* **3-Step Navigation Flow:**
  * Step 1: Ingresos (Salary + Payday)
  * Step 2: Gastos Fijos (Limit of 11 in Free tier, CSV import/export)
  * Step 3: Metas (Initial Goal)
* **Free Tier Cap Enforcement:** Adding more than 11 expenses must be gracefully blocked with a notification, preventing unauthorized state corruption.
* **Non-Destructive Completion:** Completing the wizard must NEVER wipe existing `appState.transactions[curMonth]`.

### Suite B: Salary & Income Editing
* Clicking the "Ingresos ✏️" cluster pill on the dashboard opens `#editSalaryModal`.
* Modifying salary in Ajustes updates `appState.salary` and the salary income row without modifying any expense transaction.

### Suite C: Symmetrical Dashboard Verification
* When `upcomingBills` has active items, `#desktopCategoryDistributionCard` moves dynamically to `#desktopCategorySlotLeft`.
* When `upcomingBills` is in zen mode (0 pending), it moves back to `#desktopCategorySlotRight`.

---

## 3. How to Execute Playwright Tests

Run automated test scripts using Node.js:

```bash
# Ejecución autónoma con npx (sin instalar paquetes permanentes)
npx -y playwright test tests/
```

Or run standalone verification scripts located in `tests/`:

```bash
node tests/verify_onboarding.js
```
