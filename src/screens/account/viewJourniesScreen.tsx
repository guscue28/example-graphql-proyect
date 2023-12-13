import { useFocusEffect } from '@react-navigation/native';
import { Block, Text } from 'galio-framework';
import * as React from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { MyTravelsComponent } from '../../components/myTravels/myTravels.component';
import { Travel, TravelStatuses } from '../../interfaces/travel.interface';
import { AuthContext } from '../../services/auth/context/authContext';
import { MapContext } from '../../services/map/context/mapContext';
const { height } = Dimensions.get('window');
export const ViewJourniesScreen = ({ navigation }: any) => {
  const { user } = React.useContext(AuthContext);
  const { getClientTravels, clientTravels } = React.useContext(MapContext);
  const [finished, setFinished] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);

  const allTravels = async () => {
    setLoading(true);
    await getClientTravels();
    setLoading(false);
  };
  useFocusEffect(
    React.useCallback(() => {
      allTravels();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const goToItem = (item: any) => {
    navigation.navigate('TravelScreen', { item });
  };
  return (
    <Block style={{ flex: 1 }}>
      <Block row middle style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => setFinished(true)}>
          <Text color={finished ? '#ffae3b' : 'gray'} bold size={16}>
            Terminados
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFinished(false)} style={{ marginLeft: 20 }}>
          <Text color={finished ? 'gray' : '#ffae3b'} bold size={16}>
            Programados
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
              data={clientTravels.travels.filter((el: Travel) =>
                finished
                  ? el.travelStatus === TravelStatuses.FINISHED || el.travelStatus === TravelStatuses.CANCELLED
                  : el.travelStatus === TravelStatuses.SCHEDULED_WITHOUT_DRIVER || el.travelStatus === TravelStatuses.SCHEDULED_WITH_DRIVER,
              )}
              renderItem={({ item }) => <MyTravelsComponent user={user} press={goToItem} item={item} />}
              ListEmptyComponent={() => (
                <Block style={styles.emptyContainer}>
                  <Text color="gray" size={16} style={styles.emptyText}>
                    Usted no ha ralizado ningún viaje.
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
