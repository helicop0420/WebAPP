CREATE OR REPLACE FUNCTION public.update_user_profile_on_user_change()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF SECURITY DEFINER
AS $BODY$
begin
  update public.user_profiles
  set 
    email = NEW.email
  WHERE 
    user_id = NEW.id;

  return new;
end;
$BODY$;

ALTER FUNCTION public.update_user_profile_on_user_change()
    OWNER TO supabase_admin;

GRANT EXECUTE ON FUNCTION public.update_user_profile_on_user_change() TO anon;

GRANT EXECUTE ON FUNCTION public.update_user_profile_on_user_change() TO postgres;

GRANT EXECUTE ON FUNCTION public.update_user_profile_on_user_change() TO supabase_admin;

GRANT EXECUTE ON FUNCTION public.update_user_profile_on_user_change() TO authenticated;

GRANT EXECUTE ON FUNCTION public.update_user_profile_on_user_change() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.update_user_profile_on_user_change() TO service_role;

create trigger user_profiles_update_from_user
  after update on auth.users
  for each row execute procedure public.update_user_profile_on_user_change();
