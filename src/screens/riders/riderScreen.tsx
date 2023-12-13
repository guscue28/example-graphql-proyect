import { Text } from 'galio-framework';
import * as React from 'react';
import { View } from 'react-native';
import mainStyle from '../../themes/mainTheme';

export const RiderScreen = () => {
  return (
    <View style={mainStyle.mainContainer}>
      <Text style={mainStyle.centerElement}>Rider Sumary</Text>
    </View>
  );
};
