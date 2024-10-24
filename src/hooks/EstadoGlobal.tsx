import AsyncStorage from '@react-native-community/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Interface que define a estrutura de uma tarefa
interface Tarefa {
  id: number;
  titulo: string;
}

// Interface que define o contexto global de estado
interface ContextoEstadoGlobal {
  tarefas: Tarefa[];
  carregarTarefas: () => void;
  adicionarTarefa: (titulo: string) => Promise<void>; // Modificado para ser async
  editarTarefa: (id: number, novoTitulo: string) => void;
  excluirTarefa: (id: number) => void;
  carregando: boolean;
}

// Cria o contexto global de estado
const ContextoEstadoGlobal = createContext<ContextoEstadoGlobal>({
  tarefas: [],
  carregarTarefas: () => {},
  adicionarTarefa: async () => {},
  editarTarefa: () => {},
  excluirTarefa: () => {},
  carregando: false,
});

// Hook para acessar o contexto global de estado
export const useEstadoGlobal = () => useContext(ContextoEstadoGlobal);

// Componente que fornece o contexto global de estado para seus filhos
export const ProvedorEstadoGlobal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  // Função para buscar tarefas do backend
  const carregarTarefas = async () => {
    setCarregando(true);
    try {
      const token = await AsyncStorage.getItem('token'); // Recupera o token do AsyncStorage
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch('http://localhost:3000/api/tarefas', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Insere o token JWT no cabeçalho
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar tarefas');
      }

      const dados = await response.json();
      setTarefas(dados);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const adicionarTarefa = async (titulo: string) => { // Modificado para ser async
    const token = await AsyncStorage.getItem('token'); // Recupera o token do AsyncStorage
    if (!token) throw new Error('Token não encontrado');

    try {
      const response = await fetch('http://localhost:3000/api/tarefas/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Adiciona o token ao cabeçalho
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tarefa: titulo }), // Envia a nova tarefa no formato JSON
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar tarefa');
      }

      const novaTarefa: Tarefa = {
        id: Date.now(), // Você pode querer ajustar isso conforme a resposta do servidor
        titulo,
      };

      setTarefas(prevTarefas => [...prevTarefas, novaTarefa]); // Adiciona a tarefa localmente
    } catch (error) {
      console.error(error);
    }
  };

  const editarTarefa = (id: number, novoTitulo: string) => {
    const novasTarefas = tarefas.map(tarefa =>
      tarefa.id === id ? { ...tarefa, titulo: novoTitulo } : tarefa
    );

    setTarefas(novasTarefas);
    salvarTarefas(novasTarefas);
  };

  const excluirTarefa = (id: number) => {
    const novasTarefas = tarefas.filter(tarefa => tarefa.id !== id);
    setTarefas(novasTarefas);
    salvarTarefas(novasTarefas);
  };

  const salvarTarefas = async (tarefas: Tarefa[]) => {
    try {
      await AsyncStorage.setItem('tarefas', JSON.stringify(tarefas));
    } catch (error) {
      console.error(error);
    }
  };

  // Carrega as tarefas salvas no AsyncStorage
  useEffect(() => {
    const carregarTarefasLocal = async () => {
      try {
        const tarefasArmazenadas = await AsyncStorage.getItem('tarefas');
        if (tarefasArmazenadas) {
          setTarefas(JSON.parse(tarefasArmazenadas));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };
    carregarTarefasLocal();
  }, []);

  return (
    <ContextoEstadoGlobal.Provider
      value={{ tarefas, carregarTarefas, adicionarTarefa, editarTarefa, excluirTarefa, carregando }}
    >
      {children}
    </ContextoEstadoGlobal.Provider>
  );
};
