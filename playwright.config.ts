import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  /* Se prueba el export estático servido con las reglas del .htaccess, que es
     exactamente lo que Hostinger va a entregar. Requiere `npm run build`
     previo: el servidor sirve `out/`, no compila. */
  webServer: {
    command: `node tests/static-server.mjs ${PORT}`,
    url: `http://localhost:${PORT}/es/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
