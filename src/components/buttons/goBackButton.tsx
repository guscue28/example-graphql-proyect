import { useNavigation } from '@react-navigation/native';
import { Button } from 'galio-framework';
import * as React from 'react';
import { View } from 'react-native';

export const GoBackButton = () => {
  const { goBack } = useNavigation();
  return (
    <View>
      <Button
        onlyIcon
        icon="swapleft"
        iconFamily="antdesign"
        iconSize={20}
        color="#262626"
        iconColor="#ffae3b"
        style={{ width: 30, height: 30 }}
        onPress={() => goBack()}
      />
    </View>
  );
};
