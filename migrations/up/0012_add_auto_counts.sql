-- 
-- Add count columns
-- 

ALTER TABLE IF EXISTS public.deals
    ADD COLUMN interest_count bigint DEFAULT '0'::bigint;

ALTER TABLE IF EXISTS public.user_profiles
    ADD COLUMN connections_count bigint DEFAULT '0'::bigint;

ALTER TABLE IF EXISTS public.user_profiles
    ADD COLUMN work_family_connections_count bigint DEFAULT '0'::bigint;

-- 
-- Add functions
-- 
CREATE OR REPLACE FUNCTION public.set_connections_count()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF SECURITY DEFINER
    SET search_path=public
AS $BODY$
begin
  update user_profiles
  set 
    connections_count = (
      select count(*)
      from connections
      where connections.from_user_id = NEW.from_user_id or connections.to_user_id = NEW.from_user_id
    ),
    work_family_connections_count = (
      select count(*)
      from connections
      where 
        (connections.from_user_id = NEW.from_user_id or connections.to_user_id = NEW.from_user_id)
        and connections.is_in_work_family = true
    )
  WHERE 
    user_id = NEW.from_user_id;

  update user_profiles
  set 
    connections_count = (
      select count(*)
      from connections
      where connections.from_user_id = NEW.to_user_id or connections.to_user_id = NEW.to_user_id
    ),
    work_family_connections_count = (
      select count(*)
      from connections
      where 
        (connections.from_user_id = NEW.to_user_id or connections.to_user_id = NEW.to_user_id)
        and connections.is_in_work_family = true
    )
  WHERE 
    user_id = NEW.to_user_id;

  return new;
end;
$BODY$;

ALTER FUNCTION public.set_connections_count()
    OWNER TO supabase_admin;

GRANT EXECUTE ON FUNCTION public.set_connections_count() TO anon;

GRANT EXECUTE ON FUNCTION public.set_connections_count() TO postgres;

GRANT EXECUTE ON FUNCTION public.set_connections_count() TO supabase_admin;

GRANT EXECUTE ON FUNCTION public.set_connections_count() TO authenticated;

GRANT EXECUTE ON FUNCTION public.set_connections_count() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.set_connections_count() TO service_role;

CREATE OR REPLACE FUNCTION public.set_deal_interest_count()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF SECURITY DEFINER
    SET search_path=public
AS $BODY$
begin
  update deals
  set 
    interest_count = (
      select count(*)
      from deal_interest
      where deal_id = NEW.deal_id
    )
  WHERE 
    id = NEW.deal_id;

  return new;
end;
$BODY$;

ALTER FUNCTION public.set_deal_interest_count()
    OWNER TO supabase_admin;

GRANT EXECUTE ON FUNCTION public.set_deal_interest_count() TO anon;

GRANT EXECUTE ON FUNCTION public.set_deal_interest_count() TO postgres;

GRANT EXECUTE ON FUNCTION public.set_deal_interest_count() TO supabase_admin;

GRANT EXECUTE ON FUNCTION public.set_deal_interest_count() TO authenticated;

GRANT EXECUTE ON FUNCTION public.set_deal_interest_count() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.set_deal_interest_count() TO service_role;

-- 
-- Add triggers
-- 

CREATE TRIGGER set_deal_interest_count
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.deal_interest
    FOR EACH ROW
    EXECUTE FUNCTION public.set_deal_interest_count();


CREATE TRIGGER user_profiles_set_connections
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.connections
    FOR EACH ROW
    EXECUTE FUNCTION public.set_connections_count();
