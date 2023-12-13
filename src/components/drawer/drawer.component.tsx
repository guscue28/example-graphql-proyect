import * as React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Block, Icon, Text } from 'galio-framework';
import { moderateScale } from 'react-native-size-matters';
// import { DrawerContentScrollView } from '@react-navigation/drawer';

export class DrawerComponent extends React.Component<any, any> {
  render() {
    return (
      <Pressable onPress={() => this.props.navigation.closeDrawer()} style={styles.container}>
        <Block style={styles.subContainer}>
          <Block row space="between" style={styles.textContainer}>
            <Text color="white" size={moderateScale(16)}>
              Mis favoritos
            </Text>
            <Icon family="Feather" name="chevron-right" size={18} color="#fbac3b" />
          </Block>
          <Block row space="between" style={styles.textContainer}>
            <Text color="white" size={moderateScale(16)}>
              A menos de 5 min.
            </Text>
            <Icon family="Feather" name="chevron-right" size={18} color="#fbac3b" />
          </Block>
          <Block row space="between" style={styles.textContainer}>
            <Text color="white" size={moderateScale(16)}>
              Con más de 5 estrellas
            </Text>
            <Icon family="Feather" name="chevron-right" size={18} color="#fbac3b" />
          </Block>
        </Block>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
  subContainer: {
    paddingHorizontal: 20,
    marginVertical: 60,
  },
  textContainer: {
    paddingVertical: 10,
  },
});
