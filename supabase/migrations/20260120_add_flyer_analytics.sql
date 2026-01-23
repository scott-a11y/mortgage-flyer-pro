-- Create flyer analytics table for tracking page views
CREATE TABLE IF NOT EXISTS flyer_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  flyer_slug TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  notified BOOLEAN DEFAULT FALSE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_flyer_analytics_slug ON flyer_analytics(flyer_slug);
CREATE INDEX IF NOT EXISTS idx_flyer_analytics_created ON flyer_analytics(created_at DESC);

-- Enable RLS
ALTER TABLE flyer_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from anyone (for tracking)
CREATE POLICY "Allow public insert" ON flyer_analytics
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow reads for authenticated users only
CREATE POLICY "Allow authenticated read" ON flyer_analytics
  FOR SELECT
  USING (auth.role() = 'authenticated');
