import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

//https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     https: {
//       key: fs.readFileSync('certs/127.0.0.1+1-key.pem'),
//       cert: fs.readFileSync('certs/127.0.0.1+1.pem'),
//     },
//     host: '127.0.0.1',
//     port: 5173,
//   },
// });
