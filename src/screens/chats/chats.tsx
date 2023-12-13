import React, { useCallback } from 'react';
import { Block, Text } from 'galio-framework';
import { MessageComponent } from '../../components/message/message.component';
import { ActivityIndicator, StyleSheet, FlatList } from 'react-native';
// import { AuthContext } from '../../services/auth/context/authContext';
import { MessageContext } from '../../services/chats/context/chatContext';
import { Chat, PaginationInput } from '../../services/chats/chat.interface';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MessagesStackParamList } from '../../navigators/Chats/chats.navigator';
import { AuthContext } from '../../services/auth/context/authContext';
import _ from 'lodash';
// import { UserRoles } from '../../services/user/user.interface';

export const ChatsScreen = (navigation: StackNavigationProp<MessagesStackParamList, 'ChatsScreen'>) => {
  const { user } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { getMyChats, chats } = React.useContext(MessageContext);

  const pagination: PaginationInput = {
    itemsPerPage: 10,
    page: 1,
    searchKey: '',
  };

  const allChats = async () => {
    setLoading(true);
    await getMyChats(pagination);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      allChats();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <Block flex row>
      <Block style={{ paddingBottom: 20, paddingVertical: 10, flex: 1, alignSelf: 'center' }}>
        {loading ? (
          <Block style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="black" />
          </Block>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item: Chat, i) => item._id + i}
            data={chats && chats.length ? _.orderBy(chats, 'updatedAt', 'desc') : []}
            renderItem={({ item, i }: any) => <MessageComponent user={user} key={i} item={item} navigation={navigation} />}
            ListEmptyComponent={() => (
              <Block middle>
                <Text style={{ textAlign: 'center' }} bold size={18} color="lightgray">
                  Usted no posee ningun chat.
                </Text>
              </Block>
            )}
          />
        )}
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: 'red',
  },
  loaderContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
