import { createClient } from '@supabase/supabase-js';

export const supbaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);
