import React, { useEffect, useState } from "react";
import { FlatList, Text, Box, Spinner, ScrollView, Toast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import TarefaItem from './TarefaItem';
import AsyncStorage from "@react-native-community/async-storage";
import AdicionarTarefa from './AdicionarTarefa'; // Importar o componente AdicionarTarefa

interface Tarefa {
  id: number;
  tarefa: string;
}

const ListaTarefas: React.FC = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  const fetchTarefas = async () => {
    try {
      setLoading(true); // Inicia o loading quando recarrega
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('LoginScreen');
        return;
      }

      const response = await fetch('http://localhost:3000/api/tarefas', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar tarefas');
      }

      const data = await response.json();
      setTarefas(data);
    } catch (error) {
      setError("Erro ao buscar tarefas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTarefas();
  }, []);

  const handleAdicionarTarefa = () => {
    fetchTarefas(); // Atualiza a lista quando uma nova tarefa é adicionada
  };

  const handleDelete = async (id: number) => {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      console.error('Token não encontrado!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/tarefas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTarefas(prevTarefas => prevTarefas.filter(tarefa => tarefa.id !== id));
        Toast.show({
          description: 'Tarefa excluída com sucesso!',
          bgColor: "green.500"
        });
      } else {
        const errorData = await response.json();
        console.error('Erro ao excluir a tarefa:', errorData);
        Toast.show({
          description: 'Não foi possível excluir a tarefa. Tente novamente.',
          bgColor: "red.500"
        });
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      Toast.show({
        description: 'Ocorreu um erro. Tente novamente.',
        bgColor: "red.500"
      });
    }
  };

  const handleUpdate = async (id: number, novoTitulo: string) => {
    try {
      // Obtém o token de autenticação do AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.error('Token não encontrado!');
        Toast.show({
          description: 'Erro de autenticação. Faça login novamente.',
          bgColor: "red.500",
        });
        navigation.navigate('LoginScreen');
        return;
      }

      // Faz a requisição PUT para atualizar a tarefa
      const response = await fetch(`http://localhost:3000/api/tarefas/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tarefa: novoTitulo }), // Enviando o novo título no formato esperado
      });

      // Verifica a resposta da API
      if (response.ok) {
        setTarefas(prevTarefas =>
          prevTarefas.map(tarefa =>
            tarefa.id === id ? { ...tarefa, tarefa: novoTitulo } : tarefa
          )
        );
        Toast.show({
          description: 'Tarefa atualizada com sucesso!',
          bgColor: "green.500",
        });
      } else {
        const errorData = await response.json();
        console.error('Erro ao atualizar a tarefa:', errorData);
        Toast.show({
          description: 'Erro ao atualizar a tarefa. Verifique os dados e tente novamente.',
          bgColor: "red.500",
        });
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
      Toast.show({
        description: 'Erro ao se comunicar com o servidor. Tente novamente.',
        bgColor: "red.500",
      });
    }
  };

  if (loading) {
    return <Spinner color="blue.500" />;
  }

  if (error) {
    return (
      <Box padding={4}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </Box>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <AdicionarTarefa onAdicionarTarefa={handleAdicionarTarefa} />
      <FlatList
        data={tarefas}
        renderItem={({ item }) => (
          <TarefaItem
            id={item.id}
            titulo={item.tarefa}
            onUpdate={(id, novoTitulo) => handleUpdate(id, novoTitulo)}
            onDelete={handleDelete}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </ScrollView>
  );
};

export default ListaTarefas;
