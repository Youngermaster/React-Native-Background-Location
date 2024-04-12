import React from 'react';
import GetCurrentLocation from './GetCurrentLocation';
import WatchPosition from './WatchPosition';

export default [
  {
    id: 'getCurrentPosition',
    title: 'getCurrentPosition()',
    description: 'Asynchronously load and observe location',
    render() {
      return <GetCurrentLocation />;
    },
  },
  {
    id: 'watchPosition',
    title: 'watchPosition() / clearWatch()',
    description: 'Start / stop watching location changes',
    render() {
      return <WatchPosition />;
    },
  },
];
