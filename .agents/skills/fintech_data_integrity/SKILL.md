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

## 3. Atomic State Updates

Never overwrite the user's active state partially. When writing to remote storage (Supabase or Vercel API):
- Create a deep copy of the next state: `const nextState = JSON.parse(JSON.stringify(currentState));`
- Apply mutations to `nextState`.
- Perform schema validation on `nextState`.
- Save locally first, then dispatch network update.
