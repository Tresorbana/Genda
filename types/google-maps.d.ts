// Google Maps type declarations for web
declare global {
  interface Window {
    google: typeof google;
  }
}

// This ensures the file is treated as a module
export {};