import React, { useState } from "react";
import { View, Input, IconButton } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useEstadoGlobal } from "../hooks/EstadoGlobal";
import { AdicionarTarefaProps } from "../interfaces/AdicionarTarefa.interface";
import { adicionarTarefaApi } from "../services/TarefaService"; // Importando o serviço

const AdicionarTarefa: React.FC<AdicionarTarefaProps> = ({ onAdicionarTarefa }) => {
  const [novaTarefa, setNovaTarefa] = useState("");
  const { adicionarTarefa } = useEstadoGlobal();

  const handleAdicionarTarefa = async () => {
    if (novaTarefa.trim() === "") return;

    try {
      await adicionarTarefaApi(novaTarefa); // Chamando a função do serviço para adicionar a tarefa

      // Se tudo deu certo, adicionar a tarefa no estado global
      adicionarTarefa(novaTarefa);
      setNovaTarefa(""); // Limpa o campo de input

      onAdicionarTarefa(); // Chama a função passada por prop para atualizar a lista
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  return (
    <View 
      style={{ 
        backgroundColor: '#402291', 
        paddingVertical: 20, 
        paddingHorizontal: 20, 
        paddingTop: 50 
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Input
            placeholder="Digite uma tarefa"
            placeholderTextColor="white"
            value={novaTarefa}
            onChangeText={setNovaTarefa}
            fontSize={18}
            color="white"
          />
        </View>
        <IconButton
          icon={<Ionicons name="add" size={24} color="#402291" />}
          colorScheme="light"
          onPress={handleAdicionarTarefa}
          style={{ borderRadius: 50, backgroundColor: 'gold' }}
        />
      </View>
    </View>
  );
};

export default AdicionarTarefa;