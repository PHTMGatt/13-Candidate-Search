// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   envDir: './environment',
//   plugins: [react()],
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  envDir: './environment',
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to 0.0.0.0 so Render can access the server           // Use Render's PORT or fallback to 3000 locally
  },
});

