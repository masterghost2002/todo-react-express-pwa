

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from "vite-plugin-pwa";
const manifestForPlugIn = {
  includeAssests: ['favicon.ico', "apple-touc-icon.png", "Logo.png"],
  manifest: {
    "theme_color": "#FFFFFF",
    "background_color": "#FFFFFF",
    "display": "standalone",
    "scope": "/",
    "start_url": "/",
    "name": "Todo",
    "description": "A basic todo app build over NextJS",
    "short_name": "Todo",
    includeAssets: [
      "**/*",
    ],
    "icons": [
      {
        "src": "/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/Logo.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/icon-256x256.png",
        "sizes": "256x256",
        "type": "image/png"
      },
      {
        "src": "/icon-384x384.png",
        "sizes": "384x384",
        "type": "image/png"
      },
      {
        "src": "/Logo.png",
        "sizes": "384x384",
        "type": "image/png"
      },
      {
        "src": "/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }]
  }

}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
})