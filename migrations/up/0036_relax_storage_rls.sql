drop policy "users can manage their own folder 1iv6gyx_2" on storage.objects;
drop policy "users can manage their own folder 1iv6gyx_1" on storage.objects;
drop policy "users can manage their own folder 1iv6gyx_0" on storage.objects;

CREATE POLICY "auth users have full access" ON "storage"."objects"
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

