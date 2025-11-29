# Global Switch Toast Notifications

This file provides colored toast notifications that match switch states across the entire website.

## Usage

```typescript
import { useSwitchToast } from '@/hooks/use-switch-toast';

const YourComponent = () => {
  const { showSwitchToast } = useSwitchToast();

  const handleSwitchToggle = (checked: boolean) => {
    // Your switch logic here
    setSomeState(checked);
    
    // Show colored toast notification
    showSwitchToast(`Feature ${checked ? 'enabled' : 'disabled'}`, checked);
  };

  return (
    <Switch 
      checked={someState}
      onCheckedChange={handleSwitchToggle}
    />
  );
};
```

## Colors

- **Green**: Light green background (`#dcfce7`) when switch is ON
- **Red**: Light red background (`#fef2f2`) when switch is OFF

## Automatic Integration

If you're using the global `updateSetting` function with boolean values, colored toasts are automatically applied. No need to manually call `showSwitchToast`!

```typescript
// This will automatically show colored toast
updateSetting('yourBooleanSetting', true);
```