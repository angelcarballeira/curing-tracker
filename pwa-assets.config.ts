import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  // A ready-made list of sizes: 64, 192, 512, a "maskable" 512 for Android,
  // an Apple touch icon (180) and a favicon.
  preset: minimal2023Preset,
  images: ['public/icon.svg'],
})