---
name: fintech_data_integrity
description: >-
  Use this skill when calculating balances, expenses, incomes, or totals, manipulating database.json,
  verifying floating-point arithmetic precision, or performing state migrations.
---

# Fintech Data Integrity & Calculation Precision

Standards for ensuring 100% calculation accuracy, zero data loss, and safe state manipulation in the financial application.

---

## 1. Floating-Point Arithmetic Rules in JavaScript

IEEE 754 floating-point math causes known precision bugs (e.g. `0.1 + 0.2 === 0.30000000000000004`), which can corrupt balance reconciliation or show false differences in savings.

### Safe Rounding Utility
Always normalize currency amounts before storing or displaying:
```javascript
function roundCurrency(amount) {
  return Math.round((Number(amount) + Number.EPSILON) * 100) / 100;
}
```

### Sum Accumulation Pattern
When reducing an array of transaction amounts:
```javascript
const totalExpenses = expenses.reduce((acc, curr) => {
  return roundCurrency(acc + (Number(curr.amount) || 0));
}, 0);
```

---

## 2. Safe Database Manipulation Workflow

When editing or updating `database.json` or user state snapshots:

1. **Verify Immutable Backup:**
   Check that `database_user_immutable_backup.json` exists and is intact before performing schema refactoring.
2. **Schema Validation:**
   Ensure mandatory fields exist on new expense/income objects:
   - `name` (string, trimmed)
   - `amount` (finite positive number)
   - `category` (valid category key)
   - `date` (ISO or standard format)
   - `paid` (boolean)
3. **Double-Entry Balance Reconciliation:**
   The calculated balance formula must hold true:
   $$\text{Saldo Final} = \text{Saldo Inicial} + \sum \text{Ingresos} - \sum \text{Gastos}$$

---

## 3. Atomic State Updates & Multi-Device Sync Invariants

Never overwrite the user's active state partially, and never allow a newly opened device to overwrite newer cloud state:
1. **`loadLocalState()` Read-Only Invariant:** `loadLocalState()` must NEVER call `applyDataMigrations()` or set `state._lastSaved = Date.now()`. Migrations run exclusively on authoritative cloud data inside `loadStateFromServer()` and `applyRemoteState()`.
2. **Explicit Dirty Tracking (`markLocalMutationDirty`):** Every user-initiated mutation (`saveState()`, `applyReconciliationAdjustment()`, `saveNewLoan()`, `markLoanSettled()`, `reopenLoan()`, `deleteLoan()`) MUST call `markLocalMutationDirty()` before `saveLocalState()` / `flushSyncToServer()`. Calling `saveLocalState()` + `flushSyncToServer()` without `markLocalMutationDirty()` is a critical bug because `flushSyncToServer()` checks `syncPending` and `_lastSaved > lastAckedWriteTs`.
3. **4-Layer Instant Backup Vault:**
   - Primary local cache: `finanzas_v50_<uid>`
   - Immutable local vault (only written when `countTotalTransactions(state) > 0`): `finanzas_v50_<uid>_vault`
   - Cloud daily + rolling verified snapshots in `finanzas_state`: `backup_<id8>_YYYY-MM-DD` and `backup_<id8>_latest_verified`
   - JWT-protected founder backup endpoint: `/api/founder-backup`
