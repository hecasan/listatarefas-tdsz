// src/screens/TarefasScreen.tsx

import React from 'react';
import { View } from 'native-base';
import AdicionarTarefa from '../components/AdicionarTarefa';
import ListaTarefas from '../components/ListaTarefas';

const TarefasScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#402291' }}>
      <ListaTarefas />
    </View>
  );
};

export default TarefasScreen;
