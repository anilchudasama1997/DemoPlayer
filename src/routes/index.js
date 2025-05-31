import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PlaylistSelector from '../screens/PlaylistSelector';

const Stack = createStackNavigator();

const AppContainer = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'PlaylistSelector'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="PlaylistSelector" component={PlaylistSelector} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppContainer;

