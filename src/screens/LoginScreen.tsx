// src/components/LoginScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types'; // Importe o tipo
import AsyncStorage from '@react-native-community/async-storage';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState(''); // Altera email para username
  const [password, setPassword] = useState(''); // Altera senha para password
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Utilize o tipo

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username, // Envie o username
          password, // Envie a password
          role: 'user' // Adicione role como user por padrão
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer login');
      }

      const { token } = await response.json();
      await AsyncStorage.setItem('token', token); // Armazena o token no AsyncStorage
      setError(null); // Limpa qualquer erro
      navigation.navigate('TarefasScreen'); // Navega para a tela de tarefas
    } catch (error) {
      setError('Erro de autenticação. Verifique suas credenciais.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username" // Altere o placeholder para Username
        value={username}
        onChangeText={setUsername}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        placeholder="Senha"
        value={password} // Altere para password
        onChangeText={setPassword} // Altere para setPassword
        secureTextEntry
        style={{ marginBottom: 10 }}
      />
      <Button title="Login" onPress={handleLogin} />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
};

export default LoginScreen;
