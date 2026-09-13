-- ================================================================
-- SCHEMA SUPABASE - Makiados Finance v50
-- Multi-usuario: cada user tiene su propio row identificado por state_{user_id}
-- ================================================================

-- Tabla principal (ya existe, actualizar políticas)
CREATE TABLE IF NOT EXISTS finanzas_state (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- Activar RLS
ALTER TABLE finanzas_state ENABLE ROW LEVEL SECURITY;

-- ELIMINAR política anterior (era "acceso total")
DROP POLICY IF EXISTS "Acceso familia" ON finanzas_state;

-- NUEVA política v50: cada usuario solo puede leer/escribir sus propios datos
-- Los rows de estado tienen id = 'state_{user_id}'
-- Los backups tienen id = 'backup_{shortUserId}_{date}'
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

-- Activar Realtime (sincronización WebSocket)
ALTER PUBLICATION supabase_realtime ADD TABLE finanzas_state;

-- ================================================================
-- SUPABASE AUTH CONFIG (hacer desde el Dashboard, no SQL):
-- Authentication > Settings:
--   - "Enable email confirmations" → DESACTIVADO
--   - "Secure email change" → según preferencia
-- ================================================================
