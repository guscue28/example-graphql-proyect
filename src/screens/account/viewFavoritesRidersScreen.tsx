import * as React from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Block, Text } from 'galio-framework';
import { FavoriteRidersComponent } from '../../components/favorite-riders/favoriteRiders.component';
import { moderateScale } from 'react-native-size-matters';
import { AirbnbRating } from 'react-native-ratings';
import { AuthContext } from '../../services/auth/context/authContext';
import { MyFavoritDriver } from '../../services/user/user.interface';
import { Pagination } from '../../interfaces/pagination.interface';
import { useFocusEffect } from '@react-navigation/native';
import { UserOnlineStatuses } from '../../services/user/user.interface';

export const ViewFavoritesRidersScreen = () => {
  const { getMyFavoriteDrivers, favoriteDrivers } = React.useContext(AuthContext);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  // const [loading, setLoading] = React.useState<boolean>(false);
  const [itemSelected, setItemSelected] = React.useState<MyFavoritDriver>({
    _id: '',
    firstName: '',
    lastName: '',
    ratingAverage: 0,
    picture: '',
    onlineStatus: undefined,
    vehicle: {
      _id: '',
      brand: '',
      color: '',
      createdAt: new Date(),
      description: '',
      licensePlate: '',
      luggage: 0,
      model: '',
      seats: 0,
      owner: '',
    },
  });
  const allDrivers = async () => {
    const pagination: Pagination = {
      itemsPerPage: 5,
      page: 1,
      searchKey: '',
    };
    // setLoading(true);
    await getMyFavoriteDrivers(pagination);
    // setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      allDrivers();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <Block style={{ flex: 1 }}>
      <Block style={styles.container}>
        <FlatList
          numColumns={3}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `key-${index}`}
          data={favoriteDrivers}
          renderItem={({ item }) => <FavoriteRidersComponent item={item} setShoModal={setShowModal} setItemSelected={setItemSelected} />}
          ListEmptyComponent={() => (
            <Block style={styles.emptyContainer}>
              <Text color="gray" size={16} style={styles.emptyText}>
                Usted no ha ralizado ningún viaje.
              </Text>
            </Block>
          )}
        />
      </Block>
      <Modal animationType="slide" nativeID="1" transparent visible={showModal}>
        <Pressable onPress={() => setShowModal(false)} style={styles.modalContainer}>
          <Block style={styles.modalSubcontainer}>
            <Block
              style={{
                backgroundColor: itemSelected.onlineStatus === UserOnlineStatuses.ONLINE ? '#0ebe03' : 'gray',
                borderRadius: 100,
                width: 10,
                height: 10,
                position: 'absolute',
                top: moderateScale(10),
                right: 10,
              }}
            />
            <Block row space="around" style={{ paddingVertical: 20 }}>
              <Block>
                <Image
                  source={itemSelected && itemSelected.picture !== null ? { uri: itemSelected.picture } : require('../../assets/movyLogo.png')}
                  style={styles.avatar}
                />
              </Block>
              <Block>
                <Block row style={{ marginLeft: -20 }}>
                  <Block>
                    <Text color="black">Nombre</Text>
                    <Text bold size={18} color="black" style={styles.textName}>
                      {itemSelected.firstName}
                    </Text>
                  </Block>
                  <Block style={{ marginLeft: 20 }}>
                    <Text color="black">Apellido</Text>
                    <Text bold size={18} color="black" style={styles.textName}>
                      {itemSelected.lastName}
                    </Text>
                  </Block>
                </Block>
                <Block style={{ marginLeft: -100, marginTop: 20 }}>
                  <Text size={13} style={{ marginLeft: 70 }} color="black">
                    Valoración
                  </Text>
                  <AirbnbRating
                    count={5}
                    size={16}
                    showRating={false}
                    defaultRating={itemSelected.ratingAverage}
                    isDisabled={false}
                    selectedColor="#ffae3b"
                    starContainerStyle={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                    }}
                    // onFinishRating={(ratingVal: number) => setRating(ratingVal)}
                  />
                </Block>
              </Block>
            </Block>
            <Block style={{ paddingHorizontal: 20, marginBottom: 10 }}>
              <Text color="black">Vehículo</Text>
              <Text bold color="black" size={16} style={{ marginTop: 5 }}>
                {itemSelected.vehicle?.description}
              </Text>
            </Block>
            <Block style={{ paddingHorizontal: 20, marginBottom: 10 }}>
              <Text color="black">Placa</Text>

              <Text bold color="black" size={16} style={{ marginTop: 5, letterSpacing: 2 }}>
                {itemSelected.vehicle?.licensePlate}
              </Text>
            </Block>
            <Block middle>
              <TouchableOpacity onPress={() => {}} style={styles.updateBtn}>
                <Text color="black" bold size={16}>
                  Iniciar Viaje
                </Text>
              </TouchableOpacity>
            </Block>
          </Block>
        </Pressable>
      </Modal>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: moderateScale(20),
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 20,
    marginLeft: -20,
  },
  textName: {
    marginTop: 10,
    marginLeft: 10,
  },
  updateBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: 60,
    marginTop: 20,
    backgroundColor: '#ffae3b',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  emptyContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
