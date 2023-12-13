import * as React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Block, Text } from 'galio-framework';
import { moderateScale } from 'react-native-size-matters';

export class FavoriteRidersComponent extends React.Component<any, any> {
  public render() {
    return (
      <Block middle style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this.props.setItemSelected(this.props.item.driver);
            this.props.setShoModal(true);
          }}>
          <Image
            source={
              this.props.item.driver && this.props.item.driver.picture !== null ? { uri: this.props.item.driver.picture } : require('../../assets/movyLogo.png')
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text color="black">{`${this.props.item.driver.firstName} ${this.props.item.driver.lastName}`}</Text>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddiVertical: moderateScale(25),
    paddingHorizontal: moderateScale(10),
    marginTop: moderateScale(15),
  },
  avatar: {
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: 100,
    marginBottom: moderateScale(10),
  },
});
