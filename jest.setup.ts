import '@testing-library/jest-dom';

// Next.js polyfills for testing
if (typeof ReadableStream === 'undefined') {
  const { ReadableStream } = require('stream/web');
  global.ReadableStream = ReadableStream as any;
}
if (typeof fetch === 'undefined') {
  global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
          Promise.resolve({
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: { name: 'Mock' },
                geometry: {
                  type: 'Polygon',
                  coordinates: [[[0,0], [1,1], [0,1], [0,0]]]
                }
              }
            ]
          }),
    })
  ) as jest.Mock;
}

// Mock Canvas for ParticleField and others
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  })) as any;
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
