-- ================================================================
-- AliviaFin · HARDENING DE SEGURIDAD (v71.0)
-- Ejecutar UNA vez en Supabase > SQL Editor (es idempotente y transaccional:
-- si algo falla, no se aplica nada).
-- ================================================================
BEGIN;

-- 1. Helper de admin ------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT COALESCE(
    auth.uid() = (SELECT id FROM auth.users
                  WHERE lower(email) = 'cesar.risso.f@gmail.com' LIMIT 1),
    false);
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2. user_subscriptions ---------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL UNIQUE,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'free',
  plan_type text DEFAULT 'free',
  price numeric(10,2) DEFAULT 0,
  trial_ends_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS expires_at timestamptz;
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DROP POLICY IF EXISTS "Usuario puede ver su suscripción" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Cualquiera puede insertar su registro inicial" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Usuario crea su fila free" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Solo admin puede editar todas las suscripciones" ON public.user_subscriptions;

CREATE POLICY "Usuario puede ver su suscripción" ON public.user_subscriptions
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()::text 
    OR LOWER(email) = LOWER(COALESCE(auth.jwt() ->> 'email', ''))
    OR public.is_admin()
  );

CREATE POLICY "Usuario crea su fila free" ON public.user_subscriptions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid()::text AND COALESCE(status,'free') = 'free');

CREATE POLICY "Solo admin puede editar todas las suscripciones" ON public.user_subscriptions
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Defensa en profundidad: trigger que impide auto-asignación de planes
CREATE OR REPLACE FUNCTION public.guard_user_subscriptions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF auth.role() = 'authenticated' AND NOT public.is_admin() THEN
    IF TG_OP = 'INSERT' THEN
      NEW.status := 'free';
      NEW.expires_at := NULL;
      NEW.plan_type := 'free';
      NEW.price := 0;
    ELSE
      NEW.user_id := OLD.user_id;
      NEW.status := OLD.status;
      NEW.expires_at := OLD.expires_at;
      NEW.plan_type := OLD.plan_type;
      NEW.price := OLD.price;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_user_subscriptions ON public.user_subscriptions;
CREATE TRIGGER trg_guard_user_subscriptions
  BEFORE INSERT OR UPDATE ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.guard_user_subscriptions();

-- 3. subscription_payments (solo admin) -----------------------------
CREATE TABLE IF NOT EXISTS public.subscription_payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  user_email text NOT NULL,
  amount numeric(10,2) NOT NULL,
  plan_type text NOT NULL,
  payment_method text DEFAULT 'yape_plin',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Solo admin gestiona pagos" ON public.subscription_payments;
CREATE POLICY "Solo admin gestiona pagos" ON public.subscription_payments
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. app_feedback ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text,
  user_email text,
  message text,
  type text DEFAULT 'feedback',
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.app_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cualquiera puede insertar feedback" ON public.app_feedback;
DROP POLICY IF EXISTS "Solo admin puede leer feedback" ON public.app_feedback;
DROP POLICY IF EXISTS "Admin gestiona feedback" ON public.app_feedback;

CREATE POLICY "Insertar feedback (acotado)" ON public.app_feedback
  FOR INSERT
  WITH CHECK (
    char_length(COALESCE(message, '')) <= 5000
    AND char_length(COALESCE(user_email, '')) <= 200
    AND (user_id IS NULL OR user_id = auth.uid()::text)
  );

CREATE POLICY "Admin gestiona feedback" ON public.app_feedback
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Anti-spam: máximo 20 mensajes no-heartbeat por hora y por usuario/correo
CREATE OR REPLACE FUNCTION public.limit_feedback_rate()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE n int;
BEGIN
  IF COALESCE(NEW.type, '') <> 'heartbeat' THEN
    SELECT count(*) INTO n FROM public.app_feedback
    WHERE COALESCE(type,'') <> 'heartbeat'
      AND created_at > now() - interval '1 hour'
      AND COALESCE(user_id, user_email, 'anon') = COALESCE(NEW.user_id, NEW.user_email, 'anon');
    IF n >= 20 THEN
      RAISE EXCEPTION 'Demasiados mensajes. Intenta más tarde.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_limit_feedback_rate ON public.app_feedback;
CREATE TRIGGER trg_limit_feedback_rate
  BEFORE INSERT ON public.app_feedback
  FOR EACH ROW EXECUTE FUNCTION public.limit_feedback_rate();

-- 5. app_reclamaciones ----------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_reclamaciones (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo text NOT NULL UNIQUE,
  consumidor_nombre text NOT NULL,
  consumidor_tipo_doc text NOT NULL DEFAULT 'DNI',
  consumidor_num_doc text NOT NULL,
  consumidor_email text NOT NULL,
  consumidor_telefono text,
  consumidor_domicilio text,
  tipo_servicio text NOT NULL DEFAULT 'Suscripción AliviaFin PRO',
  monto_reclamado numeric(10,2) DEFAULT 0,
  tipo text NOT NULL DEFAULT 'reclamo',
  detalle text NOT NULL,
  pedido text NOT NULL,
  estado text DEFAULT 'pendiente',
  respuesta_proveedor text,
  fecha_respuesta timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.app_reclamaciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cualquiera puede registrar un reclamo" ON public.app_reclamaciones;
DROP POLICY IF EXISTS "Solo admin puede ver y responder reclamos" ON public.app_reclamaciones;

CREATE POLICY "Cualquiera puede registrar un reclamo" ON public.app_reclamaciones
  FOR INSERT
  WITH CHECK (
    COALESCE(estado, 'pendiente') = 'pendiente'
    AND respuesta_proveedor IS NULL
    AND fecha_respuesta IS NULL
    AND char_length(detalle) <= 4000
    AND char_length(pedido) <= 2000
    AND char_length(consumidor_nombre) <= 200
    AND char_length(consumidor_email) <= 200
  );

CREATE POLICY "Solo admin puede ver y responder reclamos" ON public.app_reclamaciones
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.limit_reclamos_rate()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE n int;
BEGIN
  SELECT count(*) INTO n FROM public.app_reclamaciones
  WHERE lower(consumidor_email) = lower(NEW.consumidor_email)
    AND created_at > now() - interval '1 hour';
  IF n >= 5 THEN
    RAISE EXCEPTION 'Demasiados reclamos desde este correo. Intenta más tarde.';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_limit_reclamos_rate ON public.app_reclamaciones;
CREATE TRIGGER trg_limit_reclamos_rate
  BEFORE INSERT ON public.app_reclamaciones
  FOR EACH ROW EXECUTE FUNCTION public.limit_reclamos_rate();

-- 6. Funciones administrativas: no ejecutables por anónimos ----------
DO $$
BEGIN
  IF to_regprocedure('public.get_admin_subscribers()') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.get_admin_subscribers() FROM PUBLIC, anon;
    GRANT EXECUTE ON FUNCTION public.get_admin_subscribers() TO authenticated;
  END IF;
  IF to_regprocedure('public.delete_user_by_admin(text,text)') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.delete_user_by_admin(text,text) FROM PUBLIC, anon;
    GRANT EXECUTE ON FUNCTION public.delete_user_by_admin(text,text) TO authenticated;
  END IF;
END $$;

COMMIT;
