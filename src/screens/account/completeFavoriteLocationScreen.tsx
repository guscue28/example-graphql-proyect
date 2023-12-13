import { Block, Button, Input, Text } from 'galio-framework';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const CompleteFavoriteLocation = ({ navigation, route }: any) => {
  const { location, address } = route.params;
  const [addressState, setAddressState] = useState<string>(address);
  const [name, setName] = useState<string>('');
  const [modal, setModal] = useState<boolean>(false);
  return (
    <>
      <Block style={styles.container}>
        <Text color="black" size={16}>
          Dirección
        </Text>
        <Input
          placeholder="Dirección"
          placeholderTextColor="lightgray"
          type="default"
          onChangeText={(val: string) => setAddressState(val)}
          value={addressState}
          style={styles.inputField}
          color="#595657"
          autoCapitalize="none"
        />
        <Text color="black" size={16}>
          Nombre
        </Text>
        <Input
          placeholder="Nombre"
          placeholderTextColor="lightgray"
          type="default"
          onChangeText={(val: string) => setName(val)}
          value={name}
          style={styles.inputField}
          color="#595657"
          autoCapitalize="none"
        />
        <Block style={styles.location}>
          <Text color="black" size={16}>
            Latitud: {location.latitude}
          </Text>
          <Text color="black" size={16}>
            Longitud: {location.longitude}
          </Text>
        </Block>
      </Block>
      <Button onPress={() => setModal(true)} color="#ffae3b" style={styles.button}>
        <Text color="black" size={16}>
          Guardar
        </Text>
      </Button>
      <Modal visible={modal} nativeID="1" animationType="fade" transparent>
        <Pressable onPress={() => setModal(false)} style={styles.modalContainer}>
          <Block style={styles.modalSubcontainer}>
            <Text color="black" style={styles.modalText}>
              Dirección guardada con exito
            </Text>
            <TouchableOpacity
              style={styles.buttonCloseModal}
              onPress={() => {
                setModal(false);
                navigation.navigate('MapScreen');
              }}>
              <Text color="black">Ok</Text>
            </TouchableOpacity>
          </Block>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  location: {
    marginTop: 20,
  },
  button: {
    width: '90%',
    position: 'absolute',
    bottom: 55,
    alignSelf: 'center',
  },
  inputField: {
    borderColor: '#ffae3b',
    borderRadius: 10,
    height: moderateScale(55),
    // marginHorizontal: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(1,1,1, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubcontainer: {
    width: moderateScale(330),
    // height: moderateScale(600),
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    marginTop: moderateScale(20),
  },
  modalText: {
    margin: 40,
    marginTop: 60,
  },
  buttonCloseModal: {
    padding: 15,
    alignSelf: 'flex-end',
  },
});
