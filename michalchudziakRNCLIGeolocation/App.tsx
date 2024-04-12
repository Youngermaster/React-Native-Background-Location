import React from 'react';

import * as Screens from './src/screens';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Screens.HomeScreen} />
        <Stack.Screen name="Examples" component={Screens.ExamplesScreen} />
        <Stack.Screen name="TestCases" component={Screens.TestCasesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
