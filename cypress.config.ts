import { defineConfig } from 'cypress';

export default defineConfig({
  fileServerFolder: 'test/public',
  experimentalWebKitSupport: true,
  defaultCommandTimeout: 30000,
  e2e: {
    supportFile: false,
    watchForFileChanges: false
  }
});
