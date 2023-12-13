import * as React from 'react';
import { Image, ImageBackground, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Block, Text } from 'galio-framework';
import { moderateScale } from 'react-native-size-matters';

export class FinancingComponent extends React.Component<any, any> {
  public render() {
    return (
      <Block
        middle
        style={[this.props.index === 0 ? styles.sliderContainerLeft : this.props.index === this.props.total - 1 ? styles.sliderContainerRight : {}]}>
        <TouchableOpacity>
          <ImageBackground style={styles.container} source={require('../../assets/financingBackground.png')}>
            <Block>
              <Image source={this.props.item.image} resizeMode="contain" style={styles.avatar} />
              <Block style={styles.line} />
              <Text size={25} color="#ffae3b" style={styles.price}>
                $ {this.props.item.price}
              </Text>
              <Text size={10} color="white" style={styles.description}>
                30% flete y nacionalización y luego 3% de ganancia
              </Text>
              <Text size={10} color="#ffae3b" style={styles.financing}>
                Financiamiento de 3 años
              </Text>
            </Block>
          </ImageBackground>
        </TouchableOpacity>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddiVertical: moderateScale(25),
    paddingHorizontal: moderateScale(10),
    marginTop: moderateScale(15),
    marginHorizontal: moderateScale(5),
    width: moderateScale(150),
    height: moderateScale(200),
    overflow: 'hidden',
    borderRadius: Platform.OS === 'ios' ? 20 : 15,
  },
  avatar: {
    width: moderateScale(120),
    height: moderateScale(120),
  },
  line: {
    borderWidth: 0.5,
    borderColor: 'gray',
    width: moderateScale(120),
    marginTop: moderateScale(-15),
  },
  price: {
    paddingHorizontal: moderateScale(10),
    marginTop: moderateScale(10),
    fontWeight: '800',
  },
  description: {
    textAlign: 'center',
    marginTop: moderateScale(5),
  },
  financing: {
    fontWeight: '800',
    textAlign: 'center',
    marginTop: moderateScale(5),
  },
  sliderContainerLeft: {
    marginLeft: 15,
  },
  sliderContainerRight: {
    marginRight: 15,
  },
});
