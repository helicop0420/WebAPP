-- Fixes issue where user_profile not created for user 
-- user_profiles created by database trigger on user table, but didn't run on already existing users, hence this is necessary
insert into public.user_profiles (user_id, email)
  select 
    users.id, users.email
  from auth.users users
  where not exists (
    select 1 from 
    user_profiles
    where user_profiles.user_id = users.id
  );