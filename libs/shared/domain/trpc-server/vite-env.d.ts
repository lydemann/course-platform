/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_DEBUG: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
