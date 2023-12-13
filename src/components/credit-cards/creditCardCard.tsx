import * as React from 'react';
import { Dimensions, Image, StyleSheet } from 'react-native';
import { Block, Text } from 'galio-framework';
import { moderateScale } from 'react-native-size-matters';
import CheckBox from '@react-native-community/checkbox';

// type Props = {
//   dateOfCard: string;
//   typeOfCard: string;
//   numberOfCard: string;
// };
export interface CreditCardState {
  toggleCheckBox: boolean;
}
export interface CreditCardProps {
  mapScreen: boolean;
  item: any;
}
const { width } = Dimensions.get('window');

export class CreditCardComponent extends React.Component<CreditCardProps, CreditCardState> {
  constructor(props: any) {
    super(props);
    this.state = {
      toggleCheckBox: false,
    };
  }
  public render() {
    return (
      <Block>
        <Block style={this.props.mapScreen ? styles.mapContainer : styles.container}>
          <Block row space="between" style={{ paddingHorizontal: 10, width: '100%' }}>
            <Text color="black" size={14} numberOfLines={1} style={styles.textFont}>
              {this.props.item.expiry}
            </Text>
            <Image
              source={require('../../assets/paymentMethods/mastercard_no_letters_logo.png')}
              resizeMode="contain"
              style={{ width: moderateScale(40), height: moderateScale(20), marginLeft: moderateScale(170) }}
            />
            <Block>
              {!this.props.mapScreen && (
                <Text color="black" size={14} numberOfLines={1} style={[styles.textFont, { marginLeft: 10 }]}>
                  {this.props.item.nameRef}
                </Text>
              )}
            </Block>
          </Block>
          <Block row left style={styles.cardNumberContainer}>
            <Text color="black" size={this.props.mapScreen ? 15 : 20} style={this.props.mapScreen ? styles.cardNumberMapScreen : styles.cardNumber}>
              **** **** **** <Text bold>{this.props.item.number}</Text>
            </Text>
          </Block>
        </Block>
        {this.props.mapScreen && (
          <Block style={styles.checkBox}>
            <CheckBox
              disabled={false}
              value={this.props.item.default}
              boxType="circle"
              style={{
                width: moderateScale(10),
                height: moderateScale(10),
                marginTop: 5,
                marginRight: 10,
                padding: 10,
              }}
              onCheckColor="#ffab3b"
              onTintColor="#ffab3b"
              tintColor="#ffab3b"
              tintColors={{ true: '#ffab3b', false: '#ffab3b' }}
              onValueChange={() => {
                // this.props.defaultAddress(this.props.item._id);
                this.setState({ ...this.state, toggleCheckBox: true });
              }}
            />
          </Block>
        )}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  phoneAndId: {
    fontSize: 16,
    color: 'grey',
    fontWeight: '600',
  },

  bodyContent: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  container: {
    width: width / 1.12,
    marginVertical: moderateScale(10),
    marginHorizontal: moderateScale(20),
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: '#fff4e0',
    borderWidth: 0,
    elevation: 15,
    shadowColor: '#1955a7',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingVertical: moderateScale(20),
    paddingHorizontal: moderateScale(10),
    zIndex: 1,
  },
  cardNumberContainer: {
    marginTop: 10,
  },
  cardNumber: {
    marginLeft: 10,
    letterSpacing: 5,
  },
  textFont: {
    // width: '100%',
    alignSelf: 'center',
  },
  buttonsContainer: {
    zIndex: 2,
    marginTop: 3,
  },

  //styles map screen
  mapContainer: {
    width: moderateScale(280),
    marginVertical: moderateScale(10),
    // marginHorizontal: moderateScale(10),
    marginLeft: 25,
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: '#fff4e0',
    borderWidth: 0,
    elevation: 15,
    shadowColor: '#1955a7',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(5),
    zIndex: 1,
  },
  cardNumberMapScreen: {
    // fontFamily: 'Montserrat-Medium',
    marginLeft: 15,
    letterSpacing: 7,
  },
  checkBox: {
    position: 'absolute',
    left: 1,
    top: 30,
  },
});
