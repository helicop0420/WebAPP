create trigger user_profiles_create
  after insert on auth.users
  for each row execute procedure public.create_user_profile_on_user_creation();