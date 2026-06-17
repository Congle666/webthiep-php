import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
  // Import "*.svg?react" -> React component (đổi màu qua fill="currentColor")
  plugins: [react(), svgr({ include: '**/*.svg?react' })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
