import React, { useState } from "react";
import { Box, Text, IconButton, Input, HStack, Button, Modal, Center } from 'native-base';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

interface TarefaItemProps {
  id: number;
  titulo: string;
  onUpdate: (id: number, tarefa: string) => void;
  onDelete: (id: number) => Promise<void>; // Atualize a assinatura para retornar uma Promise
}

const TarefaItem: React.FC<TarefaItemProps> = ({ id, titulo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTarefa, setNewTarefa] = useState(titulo);
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = async () => {
    await onUpdate(id, newTarefa);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await onDelete(id); // Aguarde a exclusão
    setIsOpen(false); // Feche o modal após a exclusão
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
      {isEditing ? (
        <HStack flex={3} alignItems="center">
          <Input
            value={newTarefa}
            onChangeText={setNewTarefa}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
          <IconButton icon={<AntDesign name="check" size={24} />} onPress={handleUpdate} />
        </HStack>
      ) : (
        <Text flex={3} fontSize={18}>{titulo}</Text>
      )}
      <HStack space={2}>
        <IconButton
          icon={<AntDesign name="edit" size={24} />}
          onPress={() => setIsEditing(!isEditing)}
        />
        <IconButton
          icon={<MaterialIcons name="delete" size={24} />}
          onPress={() => setIsOpen(true)} // Abre o modal de confirmação
        />
      </HStack>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Content>
          <Modal.Header>Excluir Tarefa</Modal.Header>
          <Modal.Body>
            Deseja realmente excluir esta tarefa?
          </Modal.Body>
          <Modal.Footer>
            <Button.Group>
              <Button colorScheme="coolGray" onPress={() => setIsOpen(false)}>
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
