-- Create storage bucket for agent headshots and property photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all files in the media bucket
CREATE POLICY "Public read access for media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Allow authenticated users to upload files
CREATE POLICY "Allow uploads to media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media');

-- Allow authenticated users to update their files
CREATE POLICY "Allow updates to media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'media');

-- Allow authenticated users to delete their files
CREATE POLICY "Allow deletes from media"
ON storage.objects FOR DELETE
USING (bucket_id = 'media');
