import { Block, Icon, Text } from 'galio-framework';
import moment from 'moment';
import * as React from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import PuntodeLlegada from '../../assets/from_to_icon.svg';
import { Modal as RnModal } from 'react-native';
import TimeIcon from '../../assets/icons/time.svg';
import DistanceIcon from '../../assets/icons/distance.svg';
import Dolar2Icon from '../../assets/icons/dolar2.svg';
import ExitIcon from '../../assets/icons/feather/exit.svg';
import { AirbnbRating } from 'react-native-ratings';
import { MapContext } from '../../services/map/context/mapContext';
import { AuthContext } from '../../services/auth/context/authContext';
import { CreateFavoriteDriverInput } from '../../services/auth/login.interface';
import { FavoriteDriver, UserRoles } from '../../services/user/user.interface';
import { Travel, TravelStatuses } from '../../interfaces/travel.interface';
import { getGraphqlError } from '../../helpers';
import { useFocusEffect } from '@react-navigation/native';
const width = Dimensions.get('window').width;

export const TravelScreen = ({ route, navigation }: any) => {
  const { createFavoriteDriver, deleteFavoriteDriver, hideTab, favoriteDrivers, user } = React.useContext(AuthContext);
  const { acceptScheduledTravel, markAsOnWayScheduledTravel, driverCancelScheduledTravel, cancelScheduledTravel } = React.useContext(MapContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [modal, setModal] = React.useState<boolean>(false);
  const travel: Travel = route.params.item;
  const userTravel = travel.driver || travel.client;
  const favoriteDriverExist = favoriteDrivers.some((el: FavoriteDriver) => el.driver._id === userTravel._id);
  const acceptTravel = async () => {
    try {
      setLoading(true);
      await acceptScheduledTravel(travel._id);
      setModal(true);
      setLoading(false);
    } catch (err) {
      console.log(err);
      getGraphqlError(err);
      setLoading(false);
    }
  };
  const markOnWay = async () => {
    try {
      setLoading(true);
      await markAsOnWayScheduledTravel(travel._id);
      setModal(true);
      setLoading(false);
    } catch (err) {
      console.log(err);
      getGraphqlError(err);
      setLoading(false);
    }
  };
  const cancelTravel = async () => {
    try {
      setLoading(true);
      user?.roles?.includes(UserRoles.DRIVER) ? await driverCancelScheduledTravel(travel._id) : await cancelScheduledTravel(travel._id);
      setModal(true);
      setLoading(false);
    } catch (err) {
      console.log(err);
      getGraphqlError(err);
      setLoading(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      if (navigation.isFocused) {
        hideTab(true);
      }
      return () => {
        hideTab(false);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  return (
    <ScrollView style={styles.container}>
      <>
        <Block style={styles.headerContainer}>
          <Block row space="between" middle>
            <Text color="#ffae3b" bold size={18}>
              Fecha: {moment(travel?.createdAt).format('DD/MM/YYYY')}
            </Text>
            <Text color="black" size={14}>
              Nº de viaje: <Text bold>{travel?._id.substring(travel?._id.length - 6).toUpperCase()}</Text>
            </Text>
          </Block>
          <Text color="black" size={14}>
            Hora: {moment(travel?.createdAt).format('hh:mm a')}
          </Text>
        </Block>
        <Block>
          <Image source={{ uri: travel ? travel.routePicture : '' }} style={styles.mapCard} />
        </Block>
        <Block style={{ marginHorizontal: 20, top: -20, backgroundColor: '#222222', borderRadius: 10, elevation: 5 }}>
          <Block row style={styles.originDestinationBox}>
            <PuntodeLlegada width={60} height={60} style={styles.arrivedPoint} />
            <Block>
              <Block style={styles.originDestinationBoxFirstRow}>
                <Text color="white" numberOfLines={1} size={12}>
                  {travel?.originString}
                </Text>
              </Block>
              <Block style={styles.originDestinationBoxSecondRow}>
                <Text color="white" numberOfLines={1} size={12}>
                  {travel?.destinationString}
                </Text>
              </Block>
            </Block>
          </Block>
          <Block row style={{ marginBottom: 2, justifyContent: 'flex-end', marginHorizontal: 20, alignItems: 'center' }}>
            <Block row>
              <DistanceIcon width={20} height={20} style={{ marginLeft: 10 }} />
              <Text style={{ marginLeft: 5 }} color="white" size={13}>
                {travel?.distance.toFixed(2)} km
              </Text>
            </Block>
            <Block row>
              <TimeIcon width={15} height={15} style={{ marginLeft: 10 }} />
              <Text style={{ marginLeft: 5 }} color="white" size={13}>
                {travel.finishDate
                  ? `${moment
                      .duration(moment(travel?.finishDate).diff(moment(travel?.startDate)))
                      .asMinutes()
                      .toFixed(2)} min`
                  : `${travel.estimatedTime.toFixed(2)} min`}
              </Text>
            </Block>
            <Block row>
              <Dolar2Icon width={15} height={15} style={{ marginLeft: 10 }} />
              <Text style={{ marginLeft: 5 }} color="white" size={13}>
                ${travel?.price.toFixed(2)}
              </Text>
            </Block>
          </Block>
          {travel.travelStatus === TravelStatuses.SCHEDULED_WITHOUT_DRIVER || travel.travelStatus === TravelStatuses.SCHEDULED_WITH_DRIVER ? (
            <Block row middle bottom style={{ paddingHorizontal: 20, marginVertical: 10, marginRight: 10 }}>
              <TimeIcon width={15} height={15} style={{ marginRight: 20, marginBottom: 5 }} />
              <Text color="white" size={13} style={{ marginRight: 20, marginBottom: 3 }}>
                Fecha: {moment(travel.scheduledDate).format('DD/MM/YYYY')}
              </Text>
              <Text color="white" size={13} style={{ marginRight: -10, marginBottom: 3 }}>
                Hora: {moment(travel.scheduledDate).format('hh:mm a')}
              </Text>
            </Block>
          ) : null}
        </Block>
        <Block row>
          <Block>
            <Image source={userTravel.picture !== null ? { uri: userTravel.picture } : require('../../assets/movyLogo.png')} style={styles.avatar} />
            {user?.roles?.includes(UserRoles.CLIENT) ? (
              <TouchableOpacity
                style={styles.starIcon}
                onPress={() => {
                  const payload: CreateFavoriteDriverInput = {
                    driver: userTravel._id,
                  };
                  favoriteDriverExist
                    ? deleteFavoriteDriver(favoriteDrivers.find((driver: FavoriteDriver) => driver.driver._id === userTravel._id)!._id)
                    : createFavoriteDriver(payload);
                }}>
                <Icon family="Ionicons" name={favoriteDriverExist ? 'star' : 'star-outline'} color="#ffae3b" size={30} />
              </TouchableOpacity>
            ) : null}
          </Block>
          <Block>
            <Block row>
              <Block style={{ marginRight: 20 }}>
                <Text color="black">Nombre</Text>
                <Text bold size={18} color="black" style={styles.textName}>
                  {userTravel.firstName}
                </Text>
              </Block>
              <Block>
                <Text color="black">Apellido</Text>
                <Text bold size={18} color="black" style={styles.textName}>
                  {userTravel.lastName}
                </Text>
              </Block>
            </Block>
            <Block style={{ marginVertical: 10 }} left>
              <Text size={13} color="black">
                Valoración
              </Text>
              <AirbnbRating
                count={5}
                size={16}
                showRating={false}
                defaultRating={travel && userTravel ? userTravel.ratingAverage : 0}
                isDisabled={true}
                selectedColor="#ffae3b"
                starContainerStyle={{
                  paddingVertical: 5,
                }}
              />
            </Block>
          </Block>
        </Block>
        {user?.roles?.includes(UserRoles.DRIVER) ? (
          travel.travelStatus === TravelStatuses.SCHEDULED_WITHOUT_DRIVER || travel.travelStatus === TravelStatuses.SCHEDULED_WITH_DRIVER ? (
            <Block middle style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
              <TouchableOpacity
                onPress={() => (travel.travelStatus === TravelStatuses.SCHEDULED_WITHOUT_DRIVER ? acceptTravel() : markOnWay())}
                style={styles.actionBtn}>
                {loading ? (
                  <Block style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="black" />
                  </Block>
                ) : (
                  <Text bold size={18} color="black" style={{ textAlign: 'center' }}>
                    {travel.travelStatus === TravelStatuses.SCHEDULED_WITHOUT_DRIVER ? 'Aceptar Viaje' : 'En vía'}
                  </Text>
                )}
              </TouchableOpacity>
              {travel.travelStatus === TravelStatuses.SCHEDULED_WITH_DRIVER ? (
                <TouchableOpacity onPress={() => cancelTravel()} style={styles.actionBtn}>
                  {loading ? (
                    <Block style={styles.loaderContainer}>
                      <ActivityIndicator size="large" color="black" />
                    </Block>
                  ) : (
                    <Text bold size={18} color="black" style={{ textAlign: 'center' }}>
                      Cancelar Viaje
                    </Text>
                  )}
                </TouchableOpacity>
              ) : null}
            </Block>
          ) : null
        ) : travel.travelStatus === TravelStatuses.SCHEDULED_WITHOUT_DRIVER || travel.travelStatus === TravelStatuses.SCHEDULED_WITH_DRIVER ? (
          <Block middle style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => cancelTravel()} style={styles.actionBtn}>
              {loading ? (
                <Block style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="black" />
                </Block>
              ) : (
                <Text bold size={18} color="black" style={{ textAlign: 'center' }}>
                  Cancelar Viaje
                </Text>
              )}
            </TouchableOpacity>
          </Block>
        ) : null}
      </>
      <RnModal visible={modal} nativeID="1" animationType="fade" transparent>
        <Block style={styles.modalContainerProceser}>
          <Block style={[styles.modalProcesserSubcontainer, { paddingVertical: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }]}>
            <TouchableOpacity
              style={{ position: 'absolute', right: 20, top: 20 }}
              onPress={async () => {
                setModal(false);
                navigation.goBack();
              }}>
              <ExitIcon color="black" />
            </TouchableOpacity>
            <Icon family="Feather" name="check-circle" color="#ffae3b" size={50} />
            <Text color="black" style={{ textAlign: 'center', marginTop: 10, paddingHorizontal: 30, fontWeight: '800' }} size={20}>
              {travel.travelStatus === TravelStatuses.SCHEDULED_WITHOUT_DRIVER ? 'El viaje ha sido aceptado correctamente' : 'Has indicado que vas en camino'}
            </Text>
          </Block>
        </Block>
      </RnModal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapCard: {
    width: moderateScale(width),
    height: moderateScale(150),
  },
  headerContainer: {
    margin: moderateScale(20),
  },
  buttonsContainer: {
    marginTop: 20,
    marginLeft: 20,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  originDestinationBox: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  originDestinationBoxFirstRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: '90%',
  },
  originDestinationBoxSecondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
    marginTop: 10,
  },
  arrivedPoint: {
    paddingHorizontal: 20,
    marginTop: 5,
  },
  textName: {
    marginTop: 10,
    marginRight: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  loaderContainer: {
    marginTop: moderateScale(10),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  starIcon: {
    position: 'absolute',
    top: moderateScale(-10),
    right: moderateScale(10),
  },
  actionBtn: {
    marginTop: 15,
    backgroundColor: '#ffae3b',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    elevation: 2,
  },
  modalContainerProceser: {
    flex: 1,
    backgroundColor: 'rgba(1,1,1, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalProcesserSubcontainer: {
    width: moderateScale(330),
    // height: moderateScale(600),
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: moderateScale(20),
  },
});
