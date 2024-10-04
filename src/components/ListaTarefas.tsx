import React, { useEffect, useState } from "react";
import { FlatList, Text, Box, Spinner, ScrollView, AlertDialog, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-community/async-storage";
import TarefaItem from './TarefaItem'; // Importando o TarefaItem

const ListaTarefas: React.FC = () => {
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [tarefaIdToDelete, setTarefaIdToDelete] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const cancelRef = React.useRef(null);

  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.navigate("LoginScreen"); // Redireciona para a tela de login
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

    fetchTarefas();
  }, []);

  const handleUpdate = async (id: number, tarefa: string) => {
    //TODO: Implementar a atualização da tarefa
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
        // Remova a tarefa do estado se a exclusão for bem-sucedida
        setTarefas(prevTarefas => prevTarefas.filter(tarefa => tarefa.id !== id));
        setAlertMessage('Tarefa excluída com sucesso!'); // Mensagem de sucesso
      } else {
        const errorData = await response.json();
        console.error('Erro ao excluir a tarefa:', errorData);
        setAlertMessage('Não foi possível excluir a tarefa. Tente novamente.'); // Mensagem de erro
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setAlertMessage('Ocorreu um erro. Tente novamente.'); // Mensagem de erro
    } finally {
      setIsOpen(false); // Fecha o diálogo de confirmação
    }
  };

  const openDeleteDialog = (id: number) => {
    setTarefaIdToDelete(id);
    setIsOpen(true);
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
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#402291' }} style={{ height: '100vh' }}>
      <FlatList
        data={tarefas}
        renderItem={({ item }) => (
          <TarefaItem
            id={item.id}
            titulo={item.tarefa}
            onUpdate={handleUpdate}
            onDelete={openDeleteDialog} // Passando a função para abrir o dialogo de exclusão
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)} leastDestructiveRef={cancelRef}>
        <AlertDialog.Content>
          <AlertDialog.Header>Excluir Tarefa</AlertDialog.Header>
          <AlertDialog.Body>
            Deseja excluir esta tarefa?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group>
              <Button colorScheme="coolGray" onPress={() => setIsOpen(false)} ref={cancelRef}>
                Cancelar
              </Button>
              <Button colorScheme="danger" onPress={() => { if (tarefaIdToDelete) handleDelete(tarefaIdToDelete); }}>
                Excluir
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      {/* Diálogo para feedback de operação */}
      <AlertDialog isOpen={alertMessage !== null} onClose={() => setAlertMessage(null)}>
        <AlertDialog.Content>
          <AlertDialog.Header>Notificação</AlertDialog.Header>
          <AlertDialog.Body>
            {alertMessage}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button colorScheme="coolGray" onPress={() => setAlertMessage(null)}>
              Fechar
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </ScrollView>
  );
};

export default ListaTarefas;
