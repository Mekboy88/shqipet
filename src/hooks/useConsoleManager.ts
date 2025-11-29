
import { useEffect, useRef } from 'react';

interface ConsoleFunction {
  name: string;
  fn: Function;
  component: string;
}

class ConsoleManager {
  private static instance: ConsoleManager;
  private functions: Map<string, ConsoleFunction> = new Map();
  private isSetup = false;

  static getInstance(): ConsoleManager {
    if (!ConsoleManager.instance) {
      ConsoleManager.instance = new ConsoleManager();
    }
    return ConsoleManager.instance;
  }

  registerFunction(name: string, fn: Function, component: string) {
    this.functions.set(name, { name, fn, component });
    this.setupWindow();
  }

  unregisterFunction(name: string) {
    this.functions.delete(name);
    if (typeof window !== 'undefined' && window[name as keyof Window]) {
      delete (window as any)[name];
    }
  }

  unregisterComponent(component: string) {
    const toDelete: string[] = [];
    this.functions.forEach((fn, name) => {
      if (fn.component === component) {
        toDelete.push(name);
      }
    });
    toDelete.forEach(name => this.unregisterFunction(name));
  }

  private setupWindow() {
    if (typeof window === 'undefined') return;

    this.functions.forEach((fn) => {
      (window as any)[fn.name] = fn.fn;
    });

    if (!this.isSetup) {
      console.log('🎮 Console Manager initialized with persistent functions');
      this.isSetup = true;
    }
  }

  logAvailableFunctions() {
    if (this.functions.size === 0) {
      console.log('ℹ️ No console functions currently registered');
      return;
    }

    console.log('🎮 Available Console Functions:');
    const byComponent = new Map<string, string[]>();
    
    this.functions.forEach((fn) => {
      if (!byComponent.has(fn.component)) {
        byComponent.set(fn.component, []);
      }
      byComponent.get(fn.component)!.push(fn.name);
    });

    byComponent.forEach((functions, component) => {
      console.log(`\n📱 ${component}:`);
      functions.forEach(fn => console.log(`  - ${fn}()`));
    });
    
    console.log('\n💡 Type any function name followed by () to use it');
  }
}

export const useConsoleManager = (component: string) => {
  const managerRef = useRef(ConsoleManager.getInstance());
  const registeredFunctions = useRef<Set<string>>(new Set());

  const registerFunction = (name: string, fn: Function) => {
    managerRef.current.registerFunction(name, fn, component);
    registeredFunctions.current.add(name);
  };

  const logFunctions = () => {
    managerRef.current.logAvailableFunctions();
  };

  useEffect(() => {
    // Setup global helper function
    if (typeof window !== 'undefined') {
      (window as any).listConsoleFunctions = () => {
        managerRef.current.logAvailableFunctions();
      };
    }

    return () => {
      // Cleanup all functions registered by this component
      managerRef.current.unregisterComponent(component);
      registeredFunctions.current.clear();
    };
  }, [component]);

  return { registerFunction, logFunctions };
};
