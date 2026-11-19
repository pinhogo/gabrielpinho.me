import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { geminiDevProxyPlugin } from './server/geminiDevProxy.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    geminiDevProxyPlugin(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})
