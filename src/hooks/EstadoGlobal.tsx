import React, { createContext, useContext, useState } from 'react';

interface Tarefa {
  id: number;
  titulo: string;
}

interface ContextoEstadoGlobal {
  tarefas: Tarefa[];
  adicionarTarefa: (titulo: string) => void;
}

const ContextoEstadoGlobal = createContext<ContextoEstadoGlobal>({
  tarefas: [],
  adicionarTarefa: () => {},
});

export const useEstadoGlobal = () => useContext(ContextoEstadoGlobal);

export const ProvedorEstadoGlobal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  const adicionarTarefa = (titulo: string) => {
    const novaTarefa: Tarefa = {
      id: Date.now(),
      titulo,
    };
    setTarefas([...tarefas, novaTarefa]);
  };
  return (
    <ContextoEstadoGlobal.Provider value={{ tarefas, adicionarTarefa }}>
      {children}
    </ContextoEstadoGlobal.Provider>
  );
};