-- SUPABASE DATABASE SETUP FOR MORTGAGE FLYER PRO
-- Copy and paste this into your Supabase SQL Editor

-- 1. Create the flyer_templates table
CREATE TABLE IF NOT EXISTS flyer_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_by UUID DEFAULT auth.uid() REFERENCES auth.users(id)
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_flyer_templates_slug ON flyer_templates(slug);
CREATE INDEX IF NOT EXISTS idx_flyer_templates_published ON flyer_templates(is_published);
CREATE INDEX IF NOT EXISTS idx_flyer_templates_created_by ON flyer_templates(created_by);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE flyer_templates ENABLE ROW LEVEL SECURITY;

-- 4. Set up RLS Policies

-- Public: Anyone can view a published flyer
CREATE POLICY "Public can view published flyers" 
  ON flyer_templates FOR SELECT 
  TO anon, authenticated
  USING (is_published = true);

-- Authenticated: Agents can create their own flyers
CREATE POLICY "Agents can create their own flyers" 
  ON flyer_templates FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = created_by);

-- Authenticated: Agents can view all their own flyers (including unpublished)
CREATE POLICY "Agents can view their own flyers" 
  ON flyer_templates FOR SELECT 
  TO authenticated 
  USING (auth.uid() = created_by);

-- Authenticated: Agents can update their own flyers
CREATE POLICY "Agents can update their own flyers" 
  ON flyer_templates FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Authenticated: Agents can delete their own flyers
CREATE POLICY "Agents can delete their own flyers" 
  ON flyer_templates FOR DELETE 
  TO authenticated 
  USING (auth.uid() = created_by);

-- 5. Automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_flyer_templates_updated_at
    BEFORE UPDATE ON flyer_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Setup for Edge Functions (Wait for deployment)
-- Grant necessary permissions to the Edge Functions (service_role handles this)
GRANT ALL ON TABLE flyer_templates TO service_role;
GRANT SELECT ON TABLE flyer_templates TO anon;
