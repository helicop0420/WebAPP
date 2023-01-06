-- Add the public storage bucket
insert into storage.buckets (id, name, owner, created_at, updated_at, public)
values ('public', 'public', null, '2022-10-28 18:09:33.139552+00', '2022-10-28 18:09:33.139552+00', true);

CREATE POLICY "users can manage their own folder 1iv6gyx_0" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'public' and (storage.foldername(name))[1] = 'users' and (storage.foldername(name))[2] = auth.uid()::text);

CREATE POLICY "users can manage their own folder 1iv6gyx_1" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'public' and (storage.foldername(name))[1] = 'users' and (storage.foldername(name))[2] = auth.uid()::text);

CREATE POLICY "users can manage their own folder 1iv6gyx_2" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'public' and (storage.foldername(name))[1] = 'users' and (storage.foldername(name))[2] = auth.uid()::text);
