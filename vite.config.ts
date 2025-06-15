import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  configureServer(server) {
    server.middlewares.use('/api/guest-usage', (req, res, next) => {
      if (req.method === 'GET') {
        // Mock guest usage data
        const mockUsage = {
          messageCount: 0,
          lastReset: new Date().toISOString(),
          limit: 10
        };
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify(mockUsage));
      } else if (req.method === 'POST') {
        // Mock incrementing usage
        const mockUsage = {
          messageCount: 1,
          lastReset: new Date().toISOString(),
          limit: 10
        };
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify(mockUsage));
      } else {
        next();
      }
    });
  },
});