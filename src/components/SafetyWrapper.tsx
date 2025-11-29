
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

class SafetyWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('🚨 SafetyWrapper caught error:', error);
    
    // NEVER show error screen - always let the app continue normally
    console.log('🔄 Error caught but continuing normally - error screen disabled');
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('🚨 SafetyWrapper error details:', { error, errorInfo });
    this.setState({ errorInfo });
  }

  render() {
    // Never show error screen - always render children
    return this.props.children;
  }
}

export default SafetyWrapper;
