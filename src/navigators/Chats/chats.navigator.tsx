import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatsScreen } from '../../screens/chats/chats';
import { ChatScreen } from '../../screens/chats/chat';
import { Block, Button, Text } from 'galio-framework';
import { StyleSheet } from 'react-native';
import { UserChat } from '../../services/chats/chat.interface';
import { UserRoles } from '../../services/user/user.interface';
import { AuthContext } from '../../services/auth/context/authContext';

export type MessagesStackParamList = {
  ChatsScreen: undefined;
  ChatScreen: undefined;
};

const MessagesStackNavigator = createStackNavigator<MessagesStackParamList>();

export const MessagesStack = () => {
  const { user } = React.useContext(AuthContext);
  return (
    <MessagesStackNavigator.Navigator
      initialRouteName="ChatsScreen"
      screenOptions={{
        headerShown: true,
        cardStyle: { backgroundColor: 'white' },
      }}>
      <MessagesStackNavigator.Screen
        options={{
          header: ({ navigation }: any) => (
            <Block style={styles.notificationTitle} row>
              <Button
                icon="chevron-left"
                style={{ width: 30, height: 30 }}
                iconFamily="Feather"
                iconSize={24}
                onlyIcon
                iconColor="gray"
                color="#222222"
                onPress={() => navigation.goBack()}
              />
              <Text size={25} bold color="black">
                Mensajes
              </Text>
            </Block>
          ),
        }}
        name="ChatsScreen"
        component={ChatsScreen}
      />
      <MessagesStackNavigator.Screen
        options={{
          header: ({ navigation, route }: any) => {
            const subject = route.params.participants.find((from: UserChat) =>
              user!.roles!.includes(UserRoles.CLIENT) ? from.roles!.includes(UserRoles.DRIVER) : from.roles!.includes(UserRoles.CLIENT),
            );
            return (
              <Block row style={styles.notificationTitle}>
                <Button
                  icon="chevron-left"
                  style={{ width: 30, height: 30 }}
                  iconFamily="Feather"
                  iconSize={24}
                  onlyIcon
                  iconColor="gray"
                  color="#222222"
                  onPress={() => navigation.goBack()}
                />
                <Text size={25} bold color="black">
                  {subject.firstName} {subject.lastName}
                </Text>
              </Block>
            );
          },
        }}
        name="ChatScreen"
        component={ChatScreen}
      />
    </MessagesStackNavigator.Navigator>
  );
};

const styles = StyleSheet.create({
  containerIcon: {
    backgroundColor: '#222222',
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  notificationTitle: {
    marginTop: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  notificationContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  separationContainer: {
    marginTop: 30,
  },
  separationBar: {
    backgroundColor: 'lightgray',
    height: 0.5,
    width: '38%',
  },
});
