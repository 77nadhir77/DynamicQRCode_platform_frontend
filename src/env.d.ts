interface ImportMetaEnv {
  readonly VITE_APP_BACKEND_URL: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
