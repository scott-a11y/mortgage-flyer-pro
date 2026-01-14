-- Add a unique slug column to flyer_templates for shareable URLs
ALTER TABLE public.flyer_templates 
ADD COLUMN slug TEXT UNIQUE;

-- Create index for fast slug lookups
CREATE INDEX idx_flyer_templates_slug ON public.flyer_templates(slug);

-- Add is_published column to control visibility
ALTER TABLE public.flyer_templates 
ADD COLUMN is_published BOOLEAN DEFAULT true;