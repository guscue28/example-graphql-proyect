import React, { useContext, useState } from 'react';
// import {View} from 'react-native';
import { Block, Button, Icon, Text } from 'galio-framework';
import { Image, Modal, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Keyboard, ActivityIndicator } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { AirbnbRating } from 'react-native-ratings';
import { MapContext } from '../../services/map/context/mapContext';
import { AuthContext } from '../../services/auth/context/authContext';
import { FavoriteDriver, UserOnlineStatuses, UserRoles } from '../../services/user/user.interface';
import { RatingTypes } from '../../interfaces/travel.interface';
import moment from 'moment';
import { CreateFavoriteDriverInput } from '../../services/auth/login.interface';

export const FinishTravelScreen = ({ navigation, route }: any) => {
  // console.log(params);
  const { params: travel } = route;
  const { rateTravel } = useContext(MapContext);
  const { user, changeUserOnlineStatus, createFavoriteDriver, deleteFavoriteDriver, favoriteDrivers } = useContext(AuthContext);
  const [heightInput, setHeightInput] = useState<number>(55);
  const [modal, setModal] = useState<boolean>(false);
  const [modalError, setModalError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const scrollView = React.useRef<ScrollView>();
  const favoriteDriverExist = favoriteDrivers.some((el: FavoriteDriver) => el.driver._id === travel.driver._id);
  const sendRate = async () => {
    setLoading(true);
    const res = await rateTravel(travel._id, rating, comment, user?.roles?.includes(UserRoles.CLIENT) ? RatingTypes.TO_DRIVER : RatingTypes.TO_CLIENT);
    if (res) {
      setModalError(true);
      setErrorMsg(res);
      setLoading(false);
      return;
    }
    if (user?.roles?.includes(UserRoles.DRIVER)) {
      await changeUserOnlineStatus(UserOnlineStatuses.ONLINE);
    }
    setLoading(false);
    setModal(true);
  };
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      // setTimeout(() => {
      scrollView.current?.scrollToEnd({ animated: true }); // or some other action
      // }, 500);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      // setTimeout(() => {
      scrollView.current?.scrollToEnd({ animated: true }); // or some other action
      // }, 500);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <>
      <ScrollView style={{ marginHorizontal: 30, marginTop: 30 }} ref={() => scrollView}>
        <Block row style={{ marginTop: 10 }}>
          <Image
            source={
              user?.roles?.includes(UserRoles.CLIENT)
                ? travel.driver.picture
                  ? { uri: travel.driver.picture }
                  : require('../../assets/movyLogo.png')
                : travel.client.picture
                ? { uri: travel.client.picture }
                : require('../../assets/movyLogo.png')
            }
            style={styles.avatar}
          />
          {user?.roles?.includes(UserRoles.CLIENT) && (
            <TouchableOpacity
              style={styles.starIcon}
              onPress={() => {
                const payload: CreateFavoriteDriverInput = {
                  driver: travel.driver._id,
                };
                favoriteDriverExist
                  ? deleteFavoriteDriver(favoriteDrivers.find((driver: FavoriteDriver) => driver.driver._id === travel.driver._id)!._id)
                  : createFavoriteDriver(payload);
              }}>
              <Icon family="Ionicons" name={favoriteDriverExist ? 'star' : 'star-outline'} color="#ffae3b" size={25} />
            </TouchableOpacity>
          )}
          <Block style={{ marginHorizontal: 20 }}>
            <Text color="#222222">Nombres</Text>
            <Text color="#222222" bold>
              {user?.roles?.includes(UserRoles.CLIENT) ? travel.driver.firstName : travel.client.firstName}
            </Text>
          </Block>
          <Block style={{ marginHorizontal: 20 }}>
            <Text color="#222222">Apellidos</Text>
            <Text color="#222222" bold>
              {user?.roles?.includes(UserRoles.CLIENT) ? travel.driver.lastName : travel.client.lastName}
            </Text>
          </Block>
        </Block>
        <Block row space="between" style={{ marginTop: 20 }}>
          <Block style={{ marginRight: moderateScale(40) }}>
            <Text color="#222222">Distacia</Text>
            <Text color="#222222" bold>
              {travel.distance.toFixed(2)} km
            </Text>
          </Block>
          <Block style={{ marginRight: moderateScale(40) }}>
            <Text color="#222222">Duración</Text>
            <Text color="#222222" bold>
              {moment
                .duration(moment(travel.finishDate).diff(moment(travel.startDate)))
                .asMinutes()
                .toFixed(2)}{' '}
              min
            </Text>
          </Block>
          <Block style={{ marginRight: moderateScale(40) }}>
            <Text color="#222222">Monto</Text>
            <Text color="#222222" bold>
              ${travel.price.toFixed(2)}
            </Text>
          </Block>
        </Block>
        <Block style={{ marginVertical: 20 }}>
          <Image source={{ uri: travel.routePicture }} style={styles.mapImage} />
        </Block>
        <Block>
          <AirbnbRating
            count={5}
            size={32}
            showRating={false}
            defaultRating={rating}
            isDisabled={false}
            selectedColor="#ffae3b"
            starContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
            onFinishRating={(ratingVal: number) => setRating(ratingVal)}
          />
        </Block>
        <Block style={{ marginTop: 20, marginBottom: 10 }}>
          <Text color="#222222" style={{ marginBottom: 10 }}>
            Comentario
          </Text>
          <TextInput
            onPressIn={() => scrollView.current?.scrollToEnd({ animated: true })}
            placeholder="Dejanos saber tu opinión"
            style={[
              styles.inputText,
              {
                height: heightInput,
              },
            ]}
            autoCorrect
            allowFontScaling
            numberOfLines={5}
            onContentSizeChange={e => {
              if (e.nativeEvent.contentSize.height < 55 * 3) {
                setHeightInput(e.nativeEvent.contentSize.height);
              }
            }}
            value={comment}
            onChangeText={(e: string) => setComment(e)}
            editable
            scrollEnabled
            multiline
          />
        </Block>
        <Block>
          <Button
            disabled={loading || rating === 0 || comment === ''}
            onPress={() => sendRate()}
            color={loading || rating === 0 || comment === '' ? '#fff4e0' : '#ffae3b'}
            style={{ width: '100%', alignSelf: 'center' }}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text color="black" size={16}>
                Calificar
              </Text>
            )}
          </Button>
        </Block>
        <View style={{ height: 70 }} />
      </ScrollView>
      <Modal visible={modal} nativeID="1" animationType="fade" transparent>
        <Pressable onPress={() => setModal(false)} style={styles.modalContainer}>
          <Block style={[styles.modalSubcontainer, { paddingVertical: 10 }]}>
            <Text color="black" style={{ margin: 40, marginTop: 60 }}>
              Tu viaje ha sido calificado
            </Text>
            <TouchableOpacity
              style={{ padding: 15, alignSelf: 'flex-end' }}
              onPress={() => {
                setModal(false);
                navigation.navigate('MapScreen');
              }}>
              <Text color="black">Ok</Text>
            </TouchableOpacity>
          </Block>
        </Pressable>
      </Modal>
      <Modal visible={modalError} nativeID="1" animationType="fade" transparent>
        <Pressable onPress={() => setModalError(false)} style={styles.modalContainer}>
          <Block style={[styles.modalSubcontainer, { paddingVertical: 10 }]}>
            <Text color="black" style={{ margin: 40, marginTop: 60 }}>
              {errorMsg}
            </Text>
            <TouchableOpacity
              style={{ padding: 15, alignSelf: 'flex-end' }}
              onPress={() => {
                setModalError(false);
                // navigation.navigate('MapScreen');
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  mapImage: {
    borderRadius: 10,
    width: '100%',
    height: 160,
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
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: moderateScale(20),
  },
  inputText: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffae3b',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    overflow: 'hidden',
    fontSize: 16,
    width: '100%',
    color: 'black',
  },
  starIcon: {
    position: 'absolute',
    top: moderateScale(-12),
    left: moderateScale(35),
  },
});
