// src/components/LoginScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, Button, Text, ImageBackground, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import AsyncStorage from '@react-native-community/async-storage';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          role: 'user'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer login');
      }

      const { token } = await response.json();
      await AsyncStorage.setItem('token', token);
      setError(null);
      navigation.navigate('TarefasScreen');
    } catch (error) {
      setError('Erro de autenticação. Verifique suas credenciais.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/bg-tela-login.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo!</Text>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button title="Login" onPress={handleLogin} />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ajusta a imagem para cobrir a tela inteira
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fundo branco com transparência
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default LoginScreen;
