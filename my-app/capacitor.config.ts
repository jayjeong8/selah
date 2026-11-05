import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jayjeong8.selah',
  appName: 'Selah',
  webDir: 'out',
  ios: {
    // Page backgrounds extend under system UI; CSS env() insets protect content.
    contentInset: 'never',
  },
  server: {
    url: 'https://selah-alpha.vercel.app',
    cleartext: false,
  },
};

export default config;
