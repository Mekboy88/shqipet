// Conditional logging utility to reduce bundle size in production
export const logger = {
  log: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(message, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    console.error(message, ...args); // Always log errors
  },
  warn: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(message, ...args);
    }
  }
};