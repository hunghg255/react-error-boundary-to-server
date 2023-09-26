import React, { forwardRef, useCallback } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { logErrorAndLogToServer } from './logger';

interface Props {
  boundaryTag: string;
  children: React.ReactNode;
}

// helper for HOC
function getDisplayName(WrappedComponent: React.ComponentType<any>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const WithErrorBoundary = ({ boundaryTag, children }: Props) => {
  // useCallback w/ react-hooks so we don't pass a brand new function every time this re-renders
  const FallbackComponent = useCallback(
    () => (
      <div
        style={{ display: 'none' }}
        data-component-boundary-error={`Error while rendering the component ${
          boundaryTag ? `([${boundaryTag}])` : ''
        }`}
      />
    ),
    [boundaryTag],
  );
  const onError = useCallback(
    () => (error: Error) => {
      const errorMessage = `An error has occurred while rendering component contained with WithErrorBoundary: ${error.toString()}`;
      logErrorAndLogToServer(`${boundaryTag ? `[${boundaryTag}]: ` : ''}${errorMessage}`);
    },
    [boundaryTag],
  );

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent} onError={onError}>
      {children}
    </ErrorBoundary>
  );
};

export const withErrorBoundary = <Props extends object>(
  boundaryTag: string,
  Component: React.ComponentType<Props>,
) => {
  const WrappedComponent = forwardRef<React.ReactNode, Props>((props, ref) => (
    <WithErrorBoundary boundaryTag={boundaryTag}>
      <Component ref={ref} {...props} />
    </WithErrorBoundary>
  ));
  WrappedComponent.displayName = `${getDisplayName(Component)}ErrorBoundary`;

  return WrappedComponent;
};
