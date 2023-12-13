import { useFocusEffect } from '@react-navigation/native';
import { Block, Text } from 'galio-framework';
import * as React from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { MyTravelsComponent } from '../../components/myTravels/myTravels.component';
import { useLocation } from '../../hooks/useLocation';
import { Travel, TravelStatuses } from '../../interfaces/travel.interface';
import { AuthContext } from '../../services/auth/context/authContext';
import { PaginationInput } from '../../services/chats/chat.interface';
import { MapContext } from '../../services/map/context/mapContext';
const { height } = Dimensions.get('window');
export const RiderTravelsScreen = ({ navigation }: any) => {
  const { user } = React.useContext(AuthContext);
  const { getScheduledTravels, scheduledTravels, getMyAcceptedScheduledTravels, myAcceptedScheduledTravels } = React.useContext(MapContext);
  const { userLocation } = useLocation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [finished, setFinished] = React.useState<boolean>(true);
  const [search, setSearch] = React.useState<boolean>(false);
  const pagination = React.useRef<PaginationInput>({
    itemsPerPage: 10,
    page: 1,
    searchKey: '',
  });
  const paginationMyAcceptedTravels = React.useRef<PaginationInput>({
    itemsPerPage: 10,
    page: 1,
    searchKey: '',
  });
  const allTravels = async () => {
    setLoading(true);
    await getScheduledTravels(userLocation.latitude, userLocation.longitude, pagination.current);
    await getMyAcceptedScheduledTravels(paginationMyAcceptedTravels.current);
    setLoading(false);
    setSearch(true);
  };
  useFocusEffect(
    React.useCallback(() => {
      if (navigation.isFocused) {
        if (userLocation.latitude !== 0 && userLocation.longitude !== 0 && search === false) {
          allTravels();
        }
      }
      return () => {
        setSearch(false);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLocation]),
  );

  const goToItem = (item: any) => {
    navigation.navigate('TravelSheduleScreen', { item });
  };
  return (
    <Block style={{ flex: 1 }}>
      <Block row middle style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => setFinished(true)}>
          <Text color={finished ? '#ffae3b' : 'gray'} bold size={16}>
            Disponibles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFinished(false)} style={{ marginLeft: 20 }}>
          <Text color={finished ? 'gray' : '#ffae3b'} bold size={16}>
            Aceptados
          </Text>
        </TouchableOpacity>
      </Block>
      <Block style={{ paddingBottom: moderateScale(100) }}>
        {loading ? (
          <Block style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="black" />
          </Block>
        ) : (
          <>
            <FlatList
              data={
                finished
                  ? scheduledTravels.travels.filter((el: Travel) => el.travelStatus === TravelStatuses.SCHEDULED_WITHOUT_DRIVER)
                  : myAcceptedScheduledTravels.travels.filter((el: Travel) => el.travelStatus === TravelStatuses.SCHEDULED_WITH_DRIVER)
              }
              renderItem={({ item }) => <MyTravelsComponent user={user} press={goToItem} item={item} />}
              ListEmptyComponent={() => (
                <Block style={styles.emptyContainer}>
                  <Text color="gray" size={16} style={styles.emptyText}>
                    No hay viajes programados disponibles.
                  </Text>
                </Block>
              )}
            />
          </>
        )}
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    marginTop: 20,
    marginLeft: 20,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    // justifyContent: 'center',
  },
  loaderContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: height / 1.3,
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
