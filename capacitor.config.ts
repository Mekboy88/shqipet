import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3aedd5186e344079bb8e6e120ad05fdc',
  appName: 'shqipet-1',
  webDir: 'dist',
  server: {
    url: 'https://3aedd518-6e34-4079-bb8e-6e120ad05fdc.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
