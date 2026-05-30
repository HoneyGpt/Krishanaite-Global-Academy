import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 8080,
    host: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        aboutUs: resolve(__dirname, 'about-us.html'),
        admissionsPortal: resolve(__dirname, 'admissions-portal.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        feesStructure: resolve(__dirname, 'fees-structure.html'),
        fellowship: resolve(__dirname, 'fellowship.html'),
        howYouLearn: resolve(__dirname, 'how-you-learn.html'),
        sovereignForge: resolve(__dirname, 'sovereign-forge.html'),
        vanguardLaunchpad: resolve(__dirname, 'vanguard-launchpad.html'),
        sovereignManifest: resolve(__dirname, 'sovereign-manifest.html'),
        vanguardManifest: resolve(__dirname, 'vanguard-manifest.html')
      }
    }
  }
});
