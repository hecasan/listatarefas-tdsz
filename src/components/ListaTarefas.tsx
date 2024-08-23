import React from "react";
import { FlatList, Text, Box } from 'native-base'; // Importando Box para facilitar o estilo

interface ListaTarefasProps {
  tarefas: string[];
}

const ListaTarefas: React.FC<ListaTarefasProps> = ({ tarefas }) => {
  return (
    <FlatList
      data={tarefas}
      renderItem={({ item }) => (
        <Box
          bg="gray.200" // Define a cor de fundo como cinza
          p={4} // Adiciona um padding interno de 4
          alignItems="flex-start" // Alinha o texto à esquerda
          my={2} // Adiciona uma margem vertical de 2
          mx={2} // Adiciona uma margem horizontal de 2
        >
          <Text>{item}</Text>
        </Box>
      )}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ flexGrow: 1 }} // Removido o estilo de alinhamento
    />
  );
};

export default ListaTarefas;