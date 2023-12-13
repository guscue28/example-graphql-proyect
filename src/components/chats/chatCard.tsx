import { Block } from 'galio-framework';
import * as React from 'react';
import { Image, StyleSheet, Text } from 'react-native';

export const ChatCard = () => {
  return (
    <Block style={{ marginTop: 10, borderRadius: 20, marginBottom: 20 }} width={350} height={50}>
      <Block row>
        <Block row>
          <Block style={styles.avatarSection}>
            <Image source={{ uri: 'https://picsum.photos/200/200' }} style={styles.leftAvatar} />
          </Block>
          <Block style={styles.textSection}>
            <Text
              style={{
                marginLeft: 10,
                fontSize: 14,
                alignSelf: 'flex-start',
                color: '#373737',
                fontWeight: '600',
              }}>
              Moby
            </Text>
            <Text
              style={{
                fontSize: 12,
                marginHorizontal: 10,
                alignSelf: 'flex-start',
                color: '#373737',
              }}
              numberOfLines={2}
              ellipsizeMode="tail">
              lorem ipsum dolor sit amet consectetur adipisicing elit.
            </Text>
            <Text
              style={{
                fontSize: 10,
                alignSelf: 'flex-start',
                color: '#373737',
                marginLeft: 10,
              }}>
              Justo Ahora
            </Text>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  leftAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    alignSelf: 'center',
    marginTop: 5,
    borderColor: 'green',
  },
  avatarSection: {
    height: 70,
    width: 90,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 19,
    backgroundColor: '#f1f1f1',
  },
  textSection: {
    backgroundColor: '#f1f1f1',
    width: 268,
    height: 70,
    borderTopRightRadius: 19,
    borderBottomRightRadius: 19,
  },
});
