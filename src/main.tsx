import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalRecoverBoundary } from './components/errors/GlobalRecoverBoundary';
import { LanguageProvider } from './contexts/LanguageContext'; 
import ViewSwitcher from './components/ViewSwitcher';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

// Global error listeners to catch JavaScript errors  
window.addEventListener('error', (event) => {
  console.error('🚨 Global JavaScript Error:', event.error);
  console.error('🚨 Error details:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled Promise Rejection:', event.reason);
});

// Get root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Create root and render
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <HelmetProvider>
      <GlobalRecoverBoundary>
        <LanguageProvider>
          <ViewSwitcher />
        </LanguageProvider>
      </GlobalRecoverBoundary>
    </HelmetProvider>
  </StrictMode>
);