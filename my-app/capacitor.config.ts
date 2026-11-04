import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jayjeong8.selah',
  appName: 'Selah',
  webDir: 'out',
  server: {
    url: 'https://selah-alpha.vercel.app',
    cleartext: false,
  },
};

export default config;
