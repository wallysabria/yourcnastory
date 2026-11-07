import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir:'./tests', timeout:30000, fullyParallel:true,
  reporter:[['list'],['json',{outputFile:'test-results/foundation-results.json'}]],
  use:{baseURL:process.env.TEST_BASE_URL||'http://127.0.0.1:3101',trace:'retain-on-failure'},
  projects:[{name:'unit',testMatch:'routing.spec.ts'},{name:'chromium',testMatch:'layout.spec.ts',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1000}}}],
  webServer: process.env.TEST_BASE_URL ? undefined : {command:'npm run start',url:'http://127.0.0.1:3101',reuseExistingServer:!process.env.CI,timeout:60000},
});
