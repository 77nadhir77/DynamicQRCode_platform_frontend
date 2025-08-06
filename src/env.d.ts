interface ImportMetaEnv {
  readonly VITE_APP_BACKEND_URL: string;
  readonly VITE_APP_QRCODE_LINK: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
