import React, { useState } from "react";
import { View, Input, IconButton, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

interface AdicionarTarefaProps {
  onAdicionarTarefa: (tarefa: string) => void;
}

const AdicionarTarefa: React.FC<AdicionarTarefaProps> = ({ onAdicionarTarefa }) => {
  const [tarefa, setTarefa] = useState("");

  const adicionarTarefa = () => {
    if (tarefa.trim() !== "") {
      onAdicionarTarefa(tarefa);
      setTarefa("");
    }
  };

  return (
    <View style={{ backgroundColor: '#402291', paddingVertical: 20, paddingHorizontal: 20, paddingTop: 50 }}>
      <Text fontSize="xl" color="white" mb={4}>Lista de Tarefas Hete Caetano</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Input
            placeholder="Digite uma tarefa"
            placeholderTextColor="white"
            value={tarefa}
            onChangeText={(texto) => setTarefa(texto)}
            fontSize={14}
            color="white"
          />
        </View>
        <IconButton
          icon={<Ionicons name="add" size={24} color="#402291" />}
          colorScheme="light"
          onPress={adicionarTarefa}
          style={{ borderRadius: 50, backgroundColor: 'gold' }}
        />
      </View>
    </View>
  );
};

export default AdicionarTarefa;