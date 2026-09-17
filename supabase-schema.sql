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
-- TABLA FEEDBACK Y BUGS (Buzón de sugerencias)
-- ================================================================
CREATE TABLE IF NOT EXISTS app_feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text,
  user_email text,
  type text,
  message text,
  app_version text,
  created_at timestamp with time zone DEFAULT now()
);

-- Activar Seguridad RLS
ALTER TABLE app_feedback ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede enviar feedback (insertar)
CREATE POLICY "Cualquiera puede insertar feedback" ON app_feedback
  FOR INSERT
  WITH CHECK (true);

-- SOLO César puede leer la bandeja de feedback
CREATE POLICY "Solo admin puede leer feedback" ON app_feedback
  FOR SELECT
  USING (auth.email() = 'cesar.risso.f@gmail.com');


-- ================================================================
-- TABLA SUSCRIPCIONES (Paywall / Trial)
-- ================================================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  user_id text PRIMARY KEY,
  email text,
  status text DEFAULT 'trial',
  trial_ends_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Activar RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Todos pueden leer su propia suscripción, pero solo admin puede editar
CREATE POLICY "Usuario puede ver su suscripción" ON user_subscriptions
  FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Cualquiera puede insertar su registro inicial" ON user_subscriptions
  FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Solo admin puede editar todas las suscripciones" ON user_subscriptions
  FOR ALL
  USING (auth.email() = 'cesar.risso.f@gmail.com')
  WITH CHECK (auth.email() = 'cesar.risso.f@gmail.com');

-- ================================================================
-- TRIGGER AUTOMÁTICO: CREAR FILA EN user_subscriptions AL REGISTRARSE
-- ================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, email, status)
  VALUES (new.id::text, new.email, 'free')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();

-- ================================================================
-- SQL PARA PASAR A UN USUARIO A PREMIUM MANUALMENTE:
-- Ejemplo con Karla Marques:
-- INSERT INTO public.user_subscriptions (user_id, email, status)
-- VALUES ('95b726be-8495-45a6-b7af-388e6c5c3b65', 'karlamqq28@gmail.com', 'premium')
-- ON CONFLICT (user_id) DO UPDATE SET status = 'premium';
-- ================================================================

-- ================================================================
-- SUPABASE AUTH CONFIG (hacer desde el Dashboard, no SQL):
-- Authentication > Settings:
--   - "Enable email confirmations" → DESACTIVADO
--   - "Secure email change" → según preferencia
-- ================================================================
