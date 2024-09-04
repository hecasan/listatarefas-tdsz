import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

// Interface que define a estrutura de uma tarefa
interface Tarefa {
  id: number;
  titulo: string;
}

// Interface que define o contexto global de estado
interface ContextoEstadoGlobal {
  tarefas: Tarefa[];
  adicionarTarefa: (titulo: string) => void;
  editarTarefa: (id: number, novoTitulo: string) => void;
  excluirTarefa: (id: number) => void;
}

// Cria o contexto global de estado
const ContextoEstadoGlobal = createContext<ContextoEstadoGlobal>({
  tarefas: [],
  adicionarTarefa: () => {},
  editarTarefa: () => {},
  excluirTarefa: () => {},
});

// Hook para acessar o contexto global de estado
export const useEstadoGlobal = () => useContext(ContextoEstadoGlobal);

// Componente que fornece o contexto global de estado para seus filhos
export const ProvedorEstadoGlobal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Define o estado inicial das tarefas
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  // Flag para controlar a recarga da tela
  const [isRecarregandoTela, setIsRecarregandoTela] = useState(true);

  // Função para adicionar uma nova tarefa
  const adicionarTarefa = (titulo: string) => {
    // Cria uma nova tarefa com um ID único
    const novaTarefa: Tarefa = {
      id: Date.now(),
      titulo,
    };

    // Atualiza o estado das tarefas com a nova tarefa
    setTarefas([...tarefas, novaTarefa]);

    // Salva as tarefas no AsyncStorage
    salvarTarefas(tarefas);
  };

  // Função para editar o título de uma tarefa
  const editarTarefa = (id: number, novoTitulo: string) => {
    // Cria uma cópia das tarefas
    const novasTarefas = tarefas.map(tarefa =>
      tarefa.id === id ? { ...tarefa, titulo: novoTitulo } : tarefa
    );

    // Atualiza o estado das tarefas com as novas tarefas
    setTarefas(novasTarefas);

    // Salva as tarefas no AsyncStorage
    salvarTarefas(novasTarefas);
  };

  // Função para excluir uma tarefa
  const excluirTarefa = (id: number) => {
    // Cria uma cópia das tarefas
    const novasTarefas = tarefas.filter(tarefa => tarefa.id !== id);

    // Atualiza o estado das tarefas com as novas tarefas
    setTarefas(novasTarefas);

    // Salva as tarefas no AsyncStorage
    salvarTarefas(novasTarefas);
  };

  // Carrega as tarefas do AsyncStorage na inicialização
  useEffect(() => {
    const carregarTarefas = async () => {
      try {
        const tarefasArmazenadas = await AsyncStorage.getItem('tarefas');
        if (tarefasArmazenadas) {
          setTarefas(JSON.parse(tarefasArmazenadas));
        }
      } catch (error) {
        console.error(error);
      }

      setIsRecarregandoTela(false); // Define a tela como carregada
    };
    carregarTarefas();
  }, []);

  // Salva as tarefas no AsyncStorage antes da recarga da tela
  useEffect(() => {
    salvarTarefas(tarefas);
  }, [tarefas]);

  // Função para salvar as tarefas no AsyncStorage
  const salvarTarefas = async (tarefas: Tarefa[]) => {
    if (!isRecarregandoTela) {
      try {
        await AsyncStorage.setItem('tarefas', JSON.stringify(tarefas));
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Retorna o contexto global de estado com as funções para manipular as tarefas
  return (
    <ContextoEstadoGlobal.Provider value={{ tarefas, adicionarTarefa, editarTarefa, excluirTarefa }}>
      {children}
    </ContextoEstadoGlobal.Provider>
  );
};