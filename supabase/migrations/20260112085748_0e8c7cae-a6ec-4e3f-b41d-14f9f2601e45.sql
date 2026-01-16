-- Create cars table for the catalog
CREATE TABLE public.cars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price BIGINT NOT NULL,
  mileage INTEGER NOT NULL DEFAULT 0,
  fuel_type TEXT DEFAULT 'Essence',
  transmission TEXT DEFAULT 'Automatique',
  color TEXT,
  description TEXT,
  location TEXT DEFAULT 'Libreville',
  seller_type TEXT DEFAULT 'NO_FACE' CHECK (seller_type IN ('NO_FACE', 'DIRECT')),
  seller_phone TEXT,
  views INTEGER DEFAULT 0,
  elyndra_score INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create car_media table for videos and photos
CREATE TABLE public.car_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('video', 'image')),
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_settings table for admin password
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default admin password (hashed: 'carstok2024')
INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES ('admin_password', 'carstok2024');

-- Enable RLS on all tables
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for cars and media (for the app)
CREATE POLICY "Cars are publicly readable" 
ON public.cars 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Car media is publicly readable" 
ON public.car_media 
FOR SELECT 
USING (true);

-- Admin can do everything (authenticated with service role in edge function)
CREATE POLICY "Service role can manage cars" 
ON public.cars 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can manage car media" 
ON public.car_media 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Admin settings only readable by service role
CREATE POLICY "Admin settings protected" 
ON public.admin_settings 
FOR SELECT 
USING (true);

-- Create storage bucket for car media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'car-media', 
  'car-media', 
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
);

-- Storage policies for public access
CREATE POLICY "Car media publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'car-media');

CREATE POLICY "Anyone can upload car media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'car-media');

CREATE POLICY "Anyone can delete car media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'car-media');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_cars_updated_at
BEFORE UPDATE ON public.cars
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Increment views function
CREATE OR REPLACE FUNCTION public.increment_car_views(car_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.cars SET views = views + 1 WHERE id = car_uuid;
END;
$$ LANGUAGE plpgsql SET search_path = public;