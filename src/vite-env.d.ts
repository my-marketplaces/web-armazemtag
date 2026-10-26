/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
