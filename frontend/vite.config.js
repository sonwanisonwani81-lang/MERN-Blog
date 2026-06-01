// ============================================
// FILE: vite.config.js
// PURPOSE: Vite build tool configuration
// DESCRIPTION: Configures Vite with React plugin
//              and Tailwind CSS for styling
// ============================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),        // React plugin for JSX support
    tailwindcss(),  // Tailwind CSS plugin for utility classes
  ],
})
