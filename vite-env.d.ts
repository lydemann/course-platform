/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_DEBUG: boolean;
  readonly AC_ORIGIN: string;
  readonly AC_API_TOKEN: string;
  readonly VITE_SUPABASE_URL: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly DATABASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
