// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TarefasScreen from '../components/ListaTarefas';
import { RootStackParamList } from './types';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="TarefasScreen" component={TarefasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
