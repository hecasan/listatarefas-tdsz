import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListaTarefas from '../components/ListaTarefas';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      {/* Tela de Login */}
      <Stack.Screen 
        name="LoginScreen" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      {/* Tela Principal com Formulário de Tarefas e Lista de Tarefas */}
      <Stack.Screen 
        name="TarefasScreen" // Aqui estamos registrando como "TarefasScreen"
        component={MainScreen} 
        options={{ title: 'Tarefas' }} 
      />
    </Stack.Navigator>
  );
};

// Componente para a Tela Principal
const MainScreen = () => {
  return (
    <>
      <ListaTarefas />
    </>
  );
};

export default AppNavigator;
