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
-- ================================================================
-- TABLA SUSCRIPCIONES (Paywall / Trial / v68.0 Founder Hub)
-- ================================================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  user_id text PRIMARY KEY,
  email text,
  status text DEFAULT 'trial',
  trial_ends_at timestamp with time zone,
  plan_type text DEFAULT 'free',
  price numeric(10,2) DEFAULT 0.00,
  payment_method text DEFAULT 'yape_plin',
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Si la tabla ya existe, agregar nuevas columnas de forma segura e idempotente:
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'free';
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS price numeric(10,2) DEFAULT 0.00;
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'yape_plin';
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Activar RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Todos pueden leer su propia suscripción, pero solo admin puede editar y ver todo
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
  INSERT INTO public.user_subscriptions (user_id, email, status, plan_type)
  VALUES (new.id::text, new.email, 'free', 'free')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();

-- ================================================================
-- TABLA REGISTRO DE PAGOS / COBROS (FOUNDER AUDIT LOG)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.subscription_payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  user_email text NOT NULL,
  amount numeric(10,2) NOT NULL, -- 4.90 o 19.90
  plan_type text NOT NULL, -- 'pro_monthly' o 'pro_lifetime'
  payment_method text DEFAULT 'yape_plin', -- 'yape_plin', 'transfer', 'card'
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo admin gestiona pagos" ON public.subscription_payments
  FOR ALL
  USING (auth.email() = 'cesar.risso.f@gmail.com')
  WITH CHECK (auth.email() = 'cesar.risso.f@gmail.com');

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

-- ================================================================
-- FUNCIONES RPC ADMINISTRATIVAS (v68.2 Panel Master CEO)
-- Ejecutar en Supabase SQL Editor para enriquecer la telemetría:
-- ================================================================

-- 1. Obtener suscriptores con última conexión real desde auth.users
CREATE OR REPLACE FUNCTION public.get_admin_subscribers()
RETURNS TABLE (
  user_id text,
  email text,
  status text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  last_active_at timestamptz,
  full_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF (auth.jwt() ->> 'email') IS DISTINCT FROM 'cesar.risso.f@gmail.com' THEN
    RAISE EXCEPTION 'Acceso denegado: solo para el fundador';
  END IF;

  RETURN QUERY
  SELECT 
    s.user_id,
    s.email,
    COALESCE(s.status, 'free')::text as status,
    COALESCE(s.created_at, u.created_at) as created_at,
    u.last_sign_in_at,
    GREATEST(
      f.updated_at,
      (SELECT max(h.created_at) FROM public.app_feedback h
        WHERE h.type = 'heartbeat'
          AND (h.user_id = u.id::text OR lower(h.user_email) = lower(u.email))),
      (SELECT max(b.updated_at) FROM public.finanzas_state b
        WHERE b.id LIKE ('backup_' || left(u.id::text, 8) || '%'))
    ) as last_active_at,
    NULLIF(u.raw_user_meta_data ->> 'full_name', '')::text as full_name
  FROM public.user_subscriptions s
  LEFT JOIN auth.users u ON u.id::text = s.user_id
  LEFT JOIN public.finanzas_state f ON f.id = ('state_' || s.user_id)
  ORDER BY COALESCE(u.last_sign_in_at, f.updated_at, s.created_at) DESC NULLS LAST;
END;
$$;

-- 2. Eliminación integral y permanente de usuarios de prueba
CREATE OR REPLACE FUNCTION public.delete_user_by_admin(target_user_id text, target_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF auth.email() != 'cesar.risso.f@gmail.com' THEN
    RAISE EXCEPTION 'Acceso denegado: solo para el fundador';
  END IF;

  -- 1. Eliminar datos de estado financiero
  IF target_user_id IS NOT NULL AND target_user_id != '' THEN
    DELETE FROM public.finanzas_state WHERE id = ('state_' || target_user_id);
    DELETE FROM public.finanzas_state WHERE id LIKE ('backup_' || left(target_user_id, 8) || '%');
  END IF;

  -- 2. Eliminar suscripción
  IF target_user_id IS NOT NULL AND target_user_id != '' THEN
    DELETE FROM public.user_subscriptions WHERE user_id = target_user_id;
  END IF;
  IF target_email IS NOT NULL AND target_email != '' THEN
    DELETE FROM public.user_subscriptions WHERE email = target_email;
  END IF;

  -- 3. Eliminar feedback
  IF target_user_id IS NOT NULL AND target_user_id != '' THEN
    DELETE FROM public.app_feedback WHERE user_id = target_user_id;
  END IF;

  -- 4. Eliminar cuenta de auth.users si es un UUID válido
  IF target_user_id IS NOT NULL AND target_user_id ~ '^[0-9a-fA-F-]{36}$' THEN
    DELETE FROM auth.users WHERE id = target_user_id::uuid;
  END IF;

  RETURN true;
END;
$$;

-- ================================================================
-- ÍNDICES DE ESCALABILIDAD (Anti-Cuellos de Botella v69.5)
-- Previenen Full Table Scans en Supabase al filtrar o consultar en vivo
-- ================================================================

-- 1. Optimización para telemetría y última sincronización
CREATE INDEX IF NOT EXISTS idx_finanzas_state_updated ON public.finanzas_state(updated_at DESC);

-- 2. Optimización para consultas de suscripciones por email, plan y estado
CREATE INDEX IF NOT EXISTS idx_user_subs_email ON public.user_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_user_subs_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subs_created ON public.user_subscriptions(created_at DESC);

-- 3. Optimización para filtrado de pings y heartbeats en app_feedback
CREATE INDEX IF NOT EXISTS idx_feedback_type_created ON public.app_feedback(type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_user_email ON public.app_feedback(user_email);

-- ================================================================
-- TABLA LIBRO DE RECLAMACIONES VIRTUAL (Ley N° 29571 / D.S. 011-2011-PCM)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.app_reclamaciones (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo text NOT NULL UNIQUE,
  consumidor_nombre text NOT NULL,
  consumidor_tipo_doc text NOT NULL DEFAULT 'DNI', -- 'DNI', 'CE', 'Pasaporte'
  consumidor_num_doc text NOT NULL,
  consumidor_email text NOT NULL,
  consumidor_telefono text,
  consumidor_domicilio text,
  tipo_servicio text NOT NULL DEFAULT 'Suscripción AliviaFin PRO',
  monto_reclamado numeric(10,2) DEFAULT 0,
  tipo text NOT NULL DEFAULT 'reclamo', -- 'reclamo' (producto/servicio) o 'queja' (atención)
  detalle text NOT NULL,
  pedido text NOT NULL,
  estado text DEFAULT 'pendiente', -- 'pendiente', 'en_revision', 'atendido', 'archivado'
  respuesta_proveedor text,
  fecha_respuesta timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.app_reclamaciones ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario (incluso anónimo o no logueado) puede registrar una reclamación conforme a Indecopi
DROP POLICY IF EXISTS "Cualquiera puede registrar un reclamo" ON public.app_reclamaciones;
CREATE POLICY "Cualquiera puede registrar un reclamo" ON public.app_reclamaciones
  FOR INSERT
  WITH CHECK (true);

-- Solo el administrador/fundador puede ver y gestionar las reclamaciones
DROP POLICY IF EXISTS "Solo admin puede ver y responder reclamos" ON public.app_reclamaciones;
CREATE POLICY "Solo admin puede ver y responder reclamos" ON public.app_reclamaciones
  FOR ALL
  USING (auth.email() = 'cesar.risso.f@gmail.com')
  WITH CHECK (auth.email() = 'cesar.risso.f@gmail.com');

CREATE INDEX IF NOT EXISTS idx_reclamaciones_codigo ON public.app_reclamaciones(codigo);
CREATE INDEX IF NOT EXISTS idx_reclamaciones_created ON public.app_reclamaciones(created_at DESC);

