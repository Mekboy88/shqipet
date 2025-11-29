// Script to replace all toast calls with notificationManager calls
const fs = require('fs');
const path = require('path');

const toastReplacements = [
  // Basic toast patterns
  { from: /toast\.success\(([^,)]+)\);?/g, to: 'notificationManager.showNotification($1, { tag: "success" });\n      notificationManager.playSound("success");' },
  { from: /toast\.error\(([^,)]+)\);?/g, to: 'notificationManager.showNotification($1, { tag: "error" });\n      notificationManager.playSound("alert");' },
  { from: /toast\.info\(([^,)]+)\);?/g, to: 'notificationManager.showNotification($1, { tag: "info" });\n      notificationManager.playSound("default");' },
  { from: /toast\.warning\(([^,)]+)\);?/g, to: 'notificationManager.showNotification($1, { tag: "warning" });\n      notificationManager.playSound("warning");' },
  
  // Toast with options patterns
  { from: /toast\.success\(([^,]+),\s*{[^}]*}\);?/g, to: 'notificationManager.showNotification($1, { tag: "success" });\n      notificationManager.playSound("success");' },
  { from: /toast\.error\(([^,]+),\s*{[^}]*}\);?/g, to: 'notificationManager.showNotification($1, { tag: "error" });\n      notificationManager.playSound("alert");' },
];

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  for (const replacement of toastReplacements) {
    if (replacement.from.test(content)) {
      content = content.replace(replacement.from, replacement.to);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
}

// Files to process
const files = [
  'src/components/admin/notifications/AllNotificationsPage.tsx',
  'src/components/admin/notifications/CustomSoundUpload.tsx',
  'src/components/admin/notifications/MusicUploadZone.tsx',
  'src/components/admin/notifications/NotificationSettingsPanel.tsx',
  'src/components/admin/notifications/SoundLibrary.tsx'
];

files.forEach(replaceInFile);
console.log('Toast replacement complete!');