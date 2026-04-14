import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 8081,
    host: true,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // SSE/流式传输必须关闭代理缓冲，否则所有数据会等请求完成后才一次性转发
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // 对于 SSE 响应，强制关闭缓冲
            if (proxyRes.headers['content-type']?.includes('text/event-stream')) {
              proxyRes.headers['cache-control'] = 'no-cache'
            }
          })
        }
      }
    }
  }
})
