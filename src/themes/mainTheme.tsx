import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const mainStyle = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  centerElement: {
    alignSelf: 'center',
  },
  titlesTopScreen: {
    top: 10,
    position: 'absolute',
    fontSize: 22,
    textAlign: 'justify',
    marginHorizontal: 6,
  },
  inputField: {
    height: moderateScale(55),
    borderColor: '#ffae3b',
    borderRadius: 10,
  },
});

export default mainStyle;
