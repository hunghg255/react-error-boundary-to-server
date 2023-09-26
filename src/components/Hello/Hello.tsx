/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';

import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

const Hello = () => {
  const [count, setcount] = useState(1);

  useEffect(() => {
    // @ts-ignore
  }, []);

  return (
    <ErrorBoundary boundaryTag='Hello'>
      <h1>Hello Hello</h1>

      <button
        onClick={() => {
          setcount(count + 1);
        }}
      >
        Click {count}
      </button>
    </ErrorBoundary>
  );
};

export default Hello;
