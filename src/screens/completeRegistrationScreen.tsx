import React, { useState } from 'react';
import { Alert, StatusBar, Text, View } from 'react-native';

import { Input, Button } from 'galio-framework';
import { useForm } from '../hooks/useForms';

import { Picker } from 'react-native-woodpicker';
import type { PickerItem } from 'react-native-woodpicker';

import mainStyle from '../themes/mainTheme';
import { useNavigation } from '@react-navigation/native';
import { MapStackParamList } from '../navigators/Map/map.navigator';
import { StackNavigationProp } from '@react-navigation/stack';

type completeRegistrationScreenProps = StackNavigationProp<MapStackParamList, 'MapScreen'>;

// type complateRgistrationData = {
//   name: string;
//   lastName: string;
//   city: PickerItem | undefined;
// };

export const CompleteRegistrationScreen = () => {
  const navigation = useNavigation<completeRegistrationScreenProps>();

  const { form, onChange } = useForm({
    name: '',
    lastName: '',
  });
  const [pickedData, setPickedData] = useState<PickerItem>();

  const validateData = () => {
    let { name, lastName } = form;
    let value = pickedData?.value!;

    if (name === '') {
      Alert.alert('Ingrese su nombre');
      return false;
    }

    if (lastName === '') {
      Alert.alert('Ingrese su apellido');
      return false;
    }

    if (value !== 0) {
      Alert.alert('Seleccione una Ciudad');
      return false;
    }

    return true;
  };

  const data: Array<PickerItem> = [
    { label: 'Seleccionar', value: 0 },
    { label: 'Caracas', value: 1 },
    { label: 'Los Teques', value: 2 },
    { label: 'San Antonio', value: 3 },
    { label: 'Maracay', value: 4 },
    { label: 'La Victoria', value: 5 },
  ];

  const saveAdditionalData = async () => {
    if (validateData()) {
      return navigation.replace('MapScreen');
    }
  };

  return (
    <View style={mainStyle.mainContainer}>
      <StatusBar backgroundColor={'white'} />
      <Text style={{ fontSize: 22, alignSelf: 'center', marginBottom: 50 }}>Completa tu Informacion</Text>
      <View style={{ width: 320, alignSelf: 'center' }}>
        <Input placeholder="Nombre" onChangeText={value => onChange(value, 'name')} style={mainStyle.inputField} color="#595657" />
        <Input placeholder="Apellido" onChangeText={value => onChange(value, 'lastName')} style={mainStyle.inputField} color="#595657" />
        <Picker
          item={pickedData}
          items={data}
          onItemChange={setPickedData}
          title="Seleccionar Ciudad"
          placeholder="Ciudad"
          isNullable={false}
          //backdropAnimation={{ opacity: 0 }}
          //mode="dropdown"
          //isNullable
          //disable
          style={{
            height: 50,
            borderRadius: 7,
            borderWidth: 1,
            borderColor: '#ffae3b',
          }}
          textInputStyle={{ color: 'grey', fontSize: 16, marginLeft: 14 }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'baseline',
          flex: 1,
          marginTop: 450,
          marginLeft: 15,
        }}>
        <Button color="#fdcd89" onPress={() => navigation.replace('MapScreen')}>
          Saltar
        </Button>
        <Button color="#ffae3b" onPress={saveAdditionalData}>
          Guardar
        </Button>
      </View>
    </View>
  );
};
