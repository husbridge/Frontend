import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
  alias: [
    { find: "@assets", replacement: "/src/assets" },
    { find: "@components", replacement: "/src/components" },
    { find: "@pages", replacement: "/src/pages" },
    { find: "@type", replacement: "/src/types" },
    { find: "@utils", replacement: "/src/utils" },
    { find: "@hooks", replacement: "/src/hooks" },
    { find: "@contexts", replacement: "/src/contexts" },
    { find: "@services", replacement: "/src/services" },
    
  ],
  },
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://54.89.234.6:8084/api/', 
//         changeOrigin: true, 
//         selfHandleResponse: true,
//         ssl: false,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/api/, ''), 
//       },
//     },
// },
})

