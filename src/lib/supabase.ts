import { supabase } from "@/integrations/supabase/client";

export { supabase };

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/car-media`;
