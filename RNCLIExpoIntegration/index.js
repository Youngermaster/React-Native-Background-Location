import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import {store} from './store';
import {setLocation} from './actions/locationActions';

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
    const {latitude, longitude} = data.locations[0].coords;
    store.dispatch(setLocation({latitude, longitude}));
  }
});

AppRegistry.registerComponent(appName, () => App);
