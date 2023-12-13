import { useFocusEffect } from '@react-navigation/native';
import { Block, Text } from 'galio-framework';
import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Pagination } from '../../interfaces/pagination.interface';
import { AuthContext } from '../../services/auth/context/authContext';
export interface favoriteLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}
export const ViewMyLocationsScreen = () => {
  const { getMyFavoriteLocations } = React.useContext(AuthContext);
  const allLocations = async () => {
    // setLoading(true);
    const pagination: Pagination = {
      itemsPerPage: 10,
      page: 1,
      searchKey: '',
    };
    await getMyFavoriteLocations(pagination);
    // setLoading(false);
  };
  useFocusEffect(
    React.useCallback(() => {
      allLocations();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  const data: favoriteLocation[] = [
    {
      id: '1',
      name: 'Casa',
      address: 'Calle 1 # 1-1',
      latitude: 4.63745,
      longitude: -74.06945,
    },
    {
      id: '2',
      name: 'Trabajo',
      address: 'Calle 2 # 2-2',
      latitude: 4.63745,
      longitude: -74.06945,
    },
  ];
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <Block key={item.id} style={styles.item}>
          <Text color={'black'}>{item.name}</Text>
        </Block>
      )}
      bounces={false}
      keyExtractor={(item: favoriteLocation) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    paddingVertical: 20,
    borderBottomWidth: 0.3,
    paddingHorizontal: 20,
  },
});
