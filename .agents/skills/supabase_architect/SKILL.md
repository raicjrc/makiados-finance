---
name: supabase_architect
description: >-
  Use this skill when designing, reviewing, or writing Supabase schemas, PostgreSQL migrations,
  Row Level Security (RLS) policies, Realtime subscription channels, or authentication logic for multi-user finance apps.
---

# Supabase Architecture & Database Design Standards

Guidelines, patterns, and runbooks for managing PostgreSQL schemas, RLS policies, and Supabase client interactions in the **Finanzas César & Gaby** application.

---

## 1. Multi-User Architecture Model

The app uses a hybrid JSONB document store pattern in PostgreSQL (`finanzas_state`) combined with relational audit and auxiliary tables:

- **State Rows:** `id = 'state_{user_id}'` stores the complete financial state of a user.
- **Backup Rows:** `id = 'backup_{shortUserId}_{timestamp}'` stores snapshot rollbacks.
- **RLS Principle:** Users must strictly access only their own rows unless explicit administrative roles apply.

### Standard RLS Policy Pattern
```sql
ALTER TABLE finanzas_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario solo ve sus propios datos" ON finanzas_state
  FOR ALL
  USING (
    id = concat('state_', auth.uid()::text)
    OR id LIKE concat('backup_', left(auth.uid()::text, 8), '%')
  )
  WITH CHECK (
    id = concat('state_', auth.uid()::text)
    OR id LIKE concat('backup_', left(auth.uid()::text, 8), '%')
  );
```

---

## 2. Supabase Realtime Channels Best Practices

1. **Explicit Channel Subscriptions:**
   Always filter Realtime changes by row ID to prevent receiving unnecessary payloads across users:
   ```javascript
   const channel = supabase
     .channel(`public:finanzas_state:state_${userId}`)
     .on(
       'postgres_changes',
       {
         event: '*',
         schema: 'public',
         table: 'finanzas_state',
         filter: `id=eq.state_${userId}`
       },
       (payload) => {
         handleRemoteStateUpdate(payload.new.data);
       }
     )
     .subscribe();
   ```

2. **Clean Teardown:**
   Always unsubscribe when user switches account or page unloads:
   ```javascript
   if (activeChannel) {
     supabase.removeChannel(activeChannel);
   }
   ```

3. **Loopback Suppression:**
   When saving locally and sending to Supabase, tag local changes with a `client_revision` or timestamp to avoid re-triggering a local overwrite when the Realtime WebSocket broadcasts back the update that the current client just made.

---

## 3. Schema Migrations Checklist

Before applying any SQL change in [supabase-schema.sql](file:///Users/cesarrisso/Desktop/Finanzas/supabase-schema.sql):

- [ ] Does it include `IF NOT EXISTS` on new tables or columns?
- [ ] Is RLS explicitly enabled on every newly created table (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)?
- [ ] Are indices added for any column frequently used in `WHERE`, `ORDER BY`, or `JOIN`?
- [ ] Is there an immutable backup of the existing data before running destructive operations (`ALTER TABLE DROP ...`)?
- [ ] Are sensitive tables (feedback, subscriptions, admin controls) restricted to admin email (`cesar.risso.f@gmail.com`)?
