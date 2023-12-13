import * as React from 'react';
import { Block, Icon, Text } from 'galio-framework';
import { Dimensions, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import moment from 'moment';
import { AuthContext } from '../../services/auth/context/authContext';
const { width } = Dimensions.get('window');

export const RechargeWalletReceiptScreen = ({ route }: any) => {
  const { paymentData } = React.useContext(AuthContext);
  // React.useEffect(() => {
  //   console.log(paymentData);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  return (
    <Block middle style={styles.container}>
      <Block middle style={styles.body}>
        <Block middle style={{ width: '100%', backgroundColor: 'white', padding: 0 }}>
          <Icon family="Feather" name="check-circle" color="#ffae3b" size={50} />
          <Block middle style={{ paddingVertical: 10 }}>
            <Text size={18} bold color="black">
              ¡Recarga en proceso!
            </Text>
            <Text size={16} color="black" style={{ marginTop: 5 }}>
              {moment().format('DD/MM/YYYY h:mm a')}
            </Text>
          </Block>
        </Block>
        <Block middle style={{ paddingVertical: 10 }}>
          <Text size={16} color="black" style={{ marginTop: 5 }}>
            Monto enviado
          </Text>
          <Text size={18} bold color="black">
            {route.params.mount}
          </Text>
        </Block>
        <Block middle style={{ paddingVertical: 10 }}>
          <Text size={16} color="black" style={{ marginTop: 5 }}>
            De: <Text bold>{route.params.email}</Text>
          </Text>
          <Text size={16} color="black">
            A: <Text bold>movypagodirecto@gmail</Text>
          </Text>
        </Block>
        <Block middle style={{ paddingVertical: 10 }}>
          <Text size={16} color="black" style={{ marginTop: 5 }}>
            Concepto
          </Text>
          <Text size={18} bold color="black">
            Recarga saldo de wallet
          </Text>
        </Block>
        <Block middle style={{ paddingVertical: 20, paddigHorizontal: 10 }}>
          <Block middle style={styles.number}>
            <Text size={16} color="black" style={{ marginTop: 5 }}>
              Nº de recibo
            </Text>
            <Text size={18} bold color="black">
              {paymentData._id}
            </Text>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  body: {
    width: width / 1.12,
    marginVertical: moderateScale(10),
    marginHorizontal: moderateScale(20),
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 0,
    elevation: 15,
    shadowColor: '#1955a7',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 1,
  },
  number: {
    backgroundColor: '#ececec',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
