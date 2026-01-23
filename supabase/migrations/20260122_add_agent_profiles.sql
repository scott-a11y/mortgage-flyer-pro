-- Create agent_profiles table for self-registration
CREATE TABLE public.agent_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  phone TEXT,
  email TEXT,
  brokerage TEXT,
  website TEXT,
  headshot_url TEXT,
  color_primary TEXT DEFAULT '#000000',
  color_secondary TEXT DEFAULT '#FFFFFF',
  color_accent TEXT DEFAULT '#D4AF37',
  license_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can view agent profiles" 
ON public.agent_profiles 
FOR SELECT 
USING (true);

-- Allow public insert (registration)
CREATE POLICY "Anyone can register as an agent" 
ON public.agent_profiles 
FOR INSERT 
WITH CHECK (true);

-- Allow public update
CREATE POLICY "Anyone can update agent profiles" 
ON public.agent_profiles 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_agent_profiles_updated_at
BEFORE UPDATE ON public.agent_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
