import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text, Button} from '@rneui/themed';
import * as TaskManager from 'expo-task-manager';
import * as ExpoLocation from 'expo-location';

const TASK_NAME = 'location-tracking';

var l1;
var l2;

function App(): React.JSX.Element {
  return (
    <View>
      <Text>React Native Background Location</Text>
    </View>
  );
}

export default App;
