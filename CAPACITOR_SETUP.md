# Capacitor Native Device Detection Setup

This project now supports **true physical device detection** using Capacitor native APIs. The app can accurately identify real hardware devices (iPhone, Samsung Galaxy, iPad, etc.) instead of relying on browser fingerprinting.

## Features

✅ **Real Device Names**: Shows actual device model (e.g., "iPhone 15 Pro", "Samsung Galaxy S22")  
✅ **Hardware IDs**: Uses native device identifiers (stable across app reinstalls)  
✅ **Accurate Device Types**: Correctly identifies mobile, tablet, desktop, and laptop  
✅ **One Card Per Device**: Each physical device creates exactly one session card  
✅ **No Browser Duplicates**: Multiple browser tabs don't create duplicate devices  
✅ **Platform Detection**: Distinguishes between iOS app, Android app, and web browser  

## How It Works

### Web Browser (Current)
- Uses browser fingerprinting and localStorage for device identification
- Detects device type from User Agent string
- Works immediately without any setup

### Native Apps (After Setup)
- Uses Capacitor `Device.getId()` for stable hardware identifier
- Uses Capacitor `Device.getInfo()` for real device model, OS version, manufacturer
- Automatically detects mobile vs tablet based on device model
- Registers device on app launch and app resume

## Building Native Apps

To enable true device detection on iOS and Android:

### 1. Export Project to GitHub
Click "Export to GitHub" in Lovable and clone the repository locally.

### 2. Install Dependencies
```bash
npm install
```

### 3. Add Native Platforms
```bash
# For iOS (requires macOS with Xcode)
npx cap add ios

# For Android (requires Android Studio)
npx cap add android
```

### 4. Build the Web App
```bash
npm run build
```

### 5. Sync with Native Projects
```bash
npx cap sync
```

### 6. Run on Device/Emulator
```bash
# iOS (requires macOS + Xcode)
npx cap run ios

# Android (requires Android Studio)
npx cap run android
```

## Testing Device Detection

### Web Browser Testing
1. Open the app in your browser
2. Go to Settings → Manage Sessions
3. You'll see your browser session with device type detected from User Agent
4. Device ID is stored in localStorage and persists across sessions

### Native App Testing
1. Build and run the native app (iOS or Android)
2. Login to your account
3. Go to Settings → Manage Sessions
4. You'll see your device with:
   - Real device model name (e.g., "iPhone 15 Pro")
   - Platform type: "ios" or "android"
   - Stable hardware device ID
   - Accurate device type (mobile or tablet)

5. Open the web browser version on another device
6. Both devices will appear as separate cards in Manage Sessions

## Device Registration Flow

### Native Apps
1. App launches → `SessionBootstrapper` mounts
2. Calls `Device.getId()` → gets unique hardware identifier
3. Calls `Device.getInfo()` → gets model, platform, OS version
4. Registers session in database with real device info
5. On app resume → updates last activity timestamp
6. Creates exactly one card per physical device

### Web Browsers
1. Page loads → `SessionBootstrapper` mounts
2. Generates device fingerprint from browser properties
3. Creates/retrieves stable ID from localStorage
4. Detects device type from User Agent
5. Registers session in database with browser info
6. On page focus → updates last activity timestamp

## Database Fields

The `user_sessions` table stores:

- `device_stable_id`: Hardware ID (native) or localStorage ID (web)
- `device_name`: Real model name or browser-detected name
- `device_model`: Device model (native only)
- `device_type`: mobile, tablet, desktop, laptop
- `platform_type`: ios, android, web, pwa
- `operating_system`: iOS version, Android version, or browser OS
- `browser_info`: Browser name (web only) or "Native App"
- `ip_address`: Current IP address
- `city`, `country`, `country_code`: Geolocation data

## Troubleshooting

### Device not appearing in Manage Sessions
- Check browser console for registration errors
- Ensure user is logged in before device registration
- Verify SessionBootstrapper is mounted in App.tsx

### Same device showing multiple times
- Clear localStorage and cookies
- Logout and login again
- Check if device_stable_id is correctly persisted

### Native device detection not working
- Ensure Capacitor dependencies are installed
- Run `npx cap sync` after code changes
- Check native logs in Xcode/Android Studio

## Development Hot Reload

The `capacitor.config.ts` is configured with:
```typescript
server: {
  url: 'https://3aedd518-6e34-4079-bb8e-6e120ad05fdc.lovableproject.com?forceHideBadge=true',
  cleartext: true
}
```

This allows you to develop with hot reload - the native app loads from Lovable sandbox.

**Remove this configuration before publishing to App Store/Play Store!**

## Next Steps

1. Test current web version - device detection works in browser
2. Build native apps to enable true hardware detection
3. Test on multiple physical devices (iPhone, Android, tablet)
4. Verify each device creates exactly one session card
5. Test app resume/background behavior on mobile

## Support

For issues or questions about Capacitor integration, see:
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor Device API](https://capacitorjs.com/docs/apis/device)
- [Capacitor App API](https://capacitorjs.com/docs/apis/app)
