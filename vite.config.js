import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],

  // Electron serves the renderer straight off the filesystem in production
  // (`mainWindow.loadFile('build/index.html')`), so assets need relative URLs.
  base: './',

  build: {
    // Kept as `build` so `loadFile('build/index.html')` keeps resolving.
    outDir: 'build',
    // The renderer only ever runs inside the bundled Electron 43 (Chromium 150),
    // so there is nothing to transpile down for older browsers.
    target: 'chrome150'
  },

  server: {
    // `electron.js` loads http://localhost:3000 in dev and the start script
    // waits on that same port.
    port: 3000,
    strictPort: true
  },

  // JSX lives in `.js` files here, and 798 imports spell out the `.js`
  // extension, so the files are parsed as JSX instead of being renamed.
  esbuild: {
    include: /src\/.*\.js$/,
    // Vite's esbuild plugin defaults to `exclude: /\.js$/`, which would cancel
    // out the include above.
    exclude: [],
    loader: 'jsx'
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {'.js': 'jsx'}
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        // Lets `@use "src/App/variables"` resolve from the project root, the way
        // webpack's sass-loader used to resolve it.
        loadPaths: [projectRoot]
      }
    }
  }
})
