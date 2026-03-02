-- Create flyer_templates table
CREATE TABLE IF NOT EXISTS flyer_templates (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  data JSONB NOT NULL
);

-- Enable RLS
ALTER TABLE flyer_templates ENABLE ROW LEVEL SECURITY;

-- Allow public access for now (or authenticated if preferred, currently the app doesn't enforce auth everywhere for agents)
CREATE POLICY "Allow public select" ON flyer_templates
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert" ON flyer_templates
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public delete" ON flyer_templates
  FOR DELETE
  USING (true);

CREATE POLICY "Allow public update" ON flyer_templates
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Grant access
GRANT ALL ON TABLE flyer_templates TO anon, authenticated, service_role;
