/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  test: {
    // o teste roda no Node, que não tem document nem window: o jsdom
    // simula o navegador pra que o React consiga renderizar de verdade
    environment: 'jsdom',
    // describe, it e expect disponíveis sem precisar importar em cada arquivo
    globals: true,
    // roda antes de cada arquivo de teste
    setupFiles: './src/setupTests.ts',
    // cada teste começa sem lembrar as chamadas feitas nos anteriores
    clearMocks: true,
  },
})
