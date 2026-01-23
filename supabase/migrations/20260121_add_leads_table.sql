-- Create leads table for capturing seller pre-approval requests
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  moving_to_state TEXT NOT NULL,
  referral_type TEXT NOT NULL, -- 'local' or 'referral'
  lead_source_flyer_slug TEXT,
  metadata JSONB
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert leads (public lead capture)
CREATE POLICY "Allow public lead insertion" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to view leads
CREATE POLICY "Allow authenticated to view leads" ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Grant permissions
GRANT ALL ON TABLE leads TO service_role;
GRANT INSERT ON TABLE leads TO anon;
