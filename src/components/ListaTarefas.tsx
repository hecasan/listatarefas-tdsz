// Importa o hook React useState
import React from "react";

// Importa os componentes FlatList, Text, Box, e Input da biblioteca NativeBase
import { FlatList, Text, Box, Input } from 'native-base';

// Importa o hook useEstadoGlobal do arquivo ../hooks/EstadoGlobal.tsx
import { useEstadoGlobal } from "../hooks/EstadoGlobal";

// Interface que define os props do componente TarefaItem
interface TarefaItemProps {
  id: number; // Identificador único da tarefa
  titulo: string; // Título da tarefa
}

// Componente "TarefaItem" - Representa um item individual na lista de tarefas
const TarefaItem: React.FC<TarefaItemProps> = ({ id, titulo }) => {

  // **useState** - Define o estado local "editando" para controlar o modo de edição do item
  // O estado inicial é "false" (modo de exibição)
  const [editando, setEditando] = React.useState(false);

  // **useState** - Define o estado local "novoTitulo" para armazenar o novo título durante a edição
  // O estado inicial é o título original da tarefa ("titulo")
  const [novoTitulo, setNovoTitulo] = React.useState(titulo);

  // **Retorno** - Estrutura do componente "TarefaItem"
  return (
    <Box
      flexDirection="row" // Layout em linha
      justifyContent="space-between" // Alinhamento à direita
      alignItems="center" // Alinhamento vertical
      bg="gray.200" // Cor de fundo
      p={4} // Padding interno
      my={2} // Margem vertical
      mx={2} // Margem horizontal
      borderRadius={8} // Borda arredondada
    >
      {/* Modo de exibição */}
      <Text flex={3} fontSize={18}>{titulo}</Text> {/* Exibe o título da tarefa */}
    </Box>
  );
};

// Componente "ListaTarefas" - Exibe a lista completa de tarefas
const ListaTarefas: React.FC = () => {

  // **useEstadoGlobal** - Acessa o contexto global de estado e obtém a lista de tarefas "tarefas"
  const { tarefas } = useEstadoGlobal();

  // **Retorno** - Estrutura do componente "ListaTarefas"
  return (
    <FlatList
      data={tarefas} // Lista de tarefas a serem renderizadas
      renderItem={({ item }) => <TarefaItem id={item.id} titulo={item.titulo}  />} // Renderiza cada item da lista com TarefaItem
      keyExtractor={(item) => item.id.toString()} // Chave única para cada item (ID da tarefa)
      contentContainerStyle={{ flexGrow: 1 }} // Permite que a lista cresça para preencher o espaço disponível
      style={{ width: '100%', backgroundColor: '#402291' }} // Largura da lista
    />
  );
};

// Exporta o componente "ListaTarefas" para ser usado em outros arquivos
export default ListaTarefas;
