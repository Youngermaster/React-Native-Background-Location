import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({data, error}) => {
  console.log('LOCATION_TRACKING task fired!', data, error);
  if (error) {
    console.error('LOCATION_TRACKING task ERROR:', error);
    return;
  }
  if (data) {
    const {locations} = data;
    console.log('Received new locations', locations);
  }
});

AppRegistry.registerComponent(appName, () => App);
