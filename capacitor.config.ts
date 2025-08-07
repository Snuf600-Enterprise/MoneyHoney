import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.honeymoney.app",
  appName: "HoneyMoney",
  webDir: "dist",
  server: {
    url: "https://9c3d947a-df18-42cd-b773-926776b621b2.lovableproject.com?forceHideBadge=true",
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FCD34D",
      showSpinner: false,
    },
  },
};

export default config;
