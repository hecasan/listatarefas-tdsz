import React, { useState } from "react";
import { Box, Text, IconButton, Input, HStack, Button, Modal, Center } from 'native-base';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

interface TarefaItemProps {
  id: number;
  titulo: string;
  onUpdate: (id: number, tarefa: string) => void;
  onDelete: (id: number) => Promise<void>;
}

const TarefaItem: React.FC<TarefaItemProps> = ({ id, titulo, onUpdate, onDelete }) => {
  const [isEditMode, setIsEditMode] = useState(false); // Nome mais descritivo
  const [newTarefa, setNewTarefa] = useState(titulo); // Guarda o novo valor da tarefa
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla a visibilidade do modal

  // Função para lidar com a atualização da tarefa
  const handleUpdate = async () => {
    if (newTarefa.trim() === "") return; // Validação simples para evitar título vazio
    await onUpdate(id, newTarefa); // Chama a função de atualização recebida via props
    setIsEditMode(false); // Sai do modo de edição e mostra o ícone de editar novamente
  };

  // Função para lidar com a exclusão da tarefa
  const handleDelete = async () => {
    await onDelete(id); // Aguarda a exclusão da tarefa
    setIsModalOpen(false); // Fecha o modal após a exclusão
  };

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      bg="gray.200"
      p={4}
      my={2}
      mx={2}
      borderRadius={8}
    >
      {isEditMode ? (
        // Modo de edição
        <HStack flex={3} alignItems="center">
          <Input
            value={newTarefa}
            onChangeText={setNewTarefa}
            autoFocus
          />
          <IconButton 
            icon={<AntDesign name="check" size={24} />} 
            onPress={handleUpdate} 
          />
        </HStack>
      ) : (
        // Exibe o título da tarefa se não estiver no modo de edição
        <Text flex={3} fontSize={18}>{titulo}</Text>
      )}
      
      {/* Botões de Editar e Excluir */}
      <HStack space={2}>
        {!isEditMode && ( // Só mostra o ícone de editar quando não estiver no modo de edição
          <IconButton
            icon={<AntDesign name="edit" size={24} />}
            onPress={() => setIsEditMode(true)} // Ativa o modo de edição
          />
        )}
        <IconButton
          icon={<MaterialIcons name="delete" size={24} />}
          onPress={() => setIsModalOpen(true)} // Abre o modal de confirmação para excluir
        />
      </HStack>

      {/* Modal de confirmação para exclusão */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Content>
          <Modal.Header>Excluir Tarefa</Modal.Header>
          <Modal.Body>
            Deseja realmente excluir esta tarefa?
          </Modal.Body>
          <Modal.Footer>
            <Button.Group>
              <Button colorScheme="coolGray" onPress={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="danger" onPress={handleDelete}>
                Excluir
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default TarefaItem;
