import '@testing-library/jest-dom';

// Next.js polyfills for testing
if (typeof ReadableStream === 'undefined') {
  const { ReadableStream } = require('stream/web');
  global.ReadableStream = ReadableStream as any;
}

import React from 'react';

// Mock Recharts to avoid ResizeObserver and layout issues
jest.mock('recharts', () => {
  const OriginalRechartsModule = jest.requireActual('recharts');
  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ children }: any) => 
      React.createElement('div', { style: { width: '100%', height: '100%' } }, children),
  };
});
