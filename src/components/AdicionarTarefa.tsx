// Importa os hooks React useState e useEffect
import React, { useState } from "react";

// Importa os componentes View, Input e IconButton da biblioteca NativeBase
import { View, Input, IconButton } from 'native-base';

// Importa o ícone "add" da biblioteca Ionicons
import { Ionicons } from '@expo/vector-icons';

// Importa o hook useEstadoGlobal do arquivo ../hooks/EstadoGlobal.tsx
import { useEstadoGlobal } from "../hooks/EstadoGlobal";

// Função componente "AdicionarTarefa"
const AdicionarTarefa: React.FC = () => {

  // **useState** - Define o estado local "novaTarefa" para armazenar o título da nova tarefa
  // O estado inicial é uma string vazia ""
  const [novaTarefa, setNovaTarefa] = useState("");

  // **useEstadoGlobal** - Acessa o contexto global de estado e obtém a função "adicionarTarefa"
  // Essa função permite adicionar novas tarefas à lista global
  const { adicionarTarefa } = useEstadoGlobal();

  // **Função handleAdicionarTarefa** - Chamada ao clicar no botão de adicionar tarefa
  const handleAdicionarTarefa = () => {

    // **Verificação** - Se o campo de nova tarefa não estiver vazio (trim() remove espaços em branco)
    if (novaTarefa.trim() !== "") {

      // **Adicionar Tarefa** - Chama a função "adicionarTarefa" do contexto global
      // Passa o título da nova tarefa como parâmetro
      adicionarTarefa(novaTarefa);

      // **Limpar campo** - Após adicionar a tarefa, limpa o campo de nova tarefa
      setNovaTarefa("");
    }
  };

  // **Retorno** - Estrutura da tela para adicionar tarefas
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
          {/* Campo de entrada para o usuário digitar o título da nova tarefa */}
          <Input
            placeholder="Digite uma tarefa"
            placeholderTextColor="white"
            value={novaTarefa} // Valor do campo é a variável "novaTarefa"
            onChangeText={setNovaTarefa} // Função para atualizar o valor de "novaTarefa"
            fontSize={18} // Tamanho da fonte do adicionar tarefa
            color="white" // Cor do texto do adicionar tarefa
          />
        </View>
        {/* Botão de adicionar tarefa */}
        <IconButton
          icon={<Ionicons name="add" size={24} color="#402291" />}
          colorScheme="light"
          onPress={handleAdicionarTarefa} // Chama a função "handleAdicionarTarefa" ao clicar no botão
          style={{ borderRadius: 50, backgroundColor: 'gold' }}
        />
      </View>
    </View>
  );
};

// Exporta o componente "AdicionarTarefa" para ser usado em outros arquivos
export default AdicionarTarefa;