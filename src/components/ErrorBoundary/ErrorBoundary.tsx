import React from 'react';

import { logErrorAndLogToServer } from './logger';

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false } as any;
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    // @ts-ignore
    const { boundaryTag } = this.props as any;
    // You can also log the error to an error reporting service
    const errorMessage = `An error has occurred while rendering component contained with WithErrorBoundary: ${error.toString()}`;
    logErrorAndLogToServer(`${boundaryTag ? `[${boundaryTag}]: ` : ''}${errorMessage}`);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
