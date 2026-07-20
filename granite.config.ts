import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'summer-afterimage',
  brand: {
    displayName: '여름잔상',
    primaryColor: '#3182F6',
    icon: 'https://static.toss.im/icons/png/4x/icon-sun-fill.png',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite --port 5173',
      build: 'vite build',
    },
  },
  webViewProps: {
    type: 'partner',
    pullToRefreshEnabled: false,
  },
  navigationBar: {
    withBackButton: true,
    withHomeButton: false,
  },
  permissions: [],
  outdir: 'dist',
});
