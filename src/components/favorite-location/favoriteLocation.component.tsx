import * as React from 'react';
import { Block, Icon, Text } from 'galio-framework';
import { FavoriteLocation, LocationTypes } from '../../services/user/user.interface';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

export interface FavoriteLocationsProps {
  item: FavoriteLocation;
  total: number;
  index: number;
  delete: (id: string) => void;
  edit: (id: string) => void;
  setFavoriteToTravel: (item: FavoriteLocation) => void;
}

const width = Dimensions.get('window').width;

export class FavoriteLocationsComponent extends React.Component<FavoriteLocationsProps, any> {
  public render() {
    return (
      <>
        <TouchableOpacity onPress={() => this.props.setFavoriteToTravel(this.props.item)}>
          <Block row space="around" style={{ paddingHorizontal: 35, width }}>
            <Block top style={{ width: '10%' }}>
              <Icon
                family={this.props.item.type === LocationTypes.OFFICE ? 'Entypo' : 'Feather'}
                name={this.props.item.type === LocationTypes.HOME ? 'home' : this.props.item.type === LocationTypes.OFFICE ? 'briefcase' : 'heart'}
                color="#ffae3b"
                size={25}
              />
            </Block>
            <Block top style={{ width: '50%' }}>
              <Text bold numberOfLines={1} color="black" size={16}>
                {this.props.item.name}
              </Text>
              <Text numberOfLines={1} color="black" size={16}>
                {this.props.item.locationString}
              </Text>
            </Block>
            <Block bottom row style={{ marginLeft: 20, width: '20%' }}>
              <Icon family="Ionicons" name="edit" color="#ffae3b" size={25} />
              <TouchableOpacity onPress={() => this.props.delete(this.props.item._id)}>
                <Icon style={{ marginLeft: 10 }} family="AntDesign" name="delete" color="red" size={25} />
              </TouchableOpacity>
            </Block>
          </Block>
          <Block style={[this.props.index === this.props.total - 1 ? {} : styles.border]} />
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  border: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    marginHorizontal: 30,
    marginBottom: 10,
    marginTop: 10,
  },
});
