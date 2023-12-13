import React, { useCallback, useRef, useState } from 'react';
import { Block, Button, Text } from 'galio-framework';
import { ActivityIndicator, FlatList, StyleSheet, TextInput } from 'react-native';
import { ConversationComponent } from '../../components/message/conversation.component';
import { MessageContext } from '../../services/chats/context/chatContext';
import { Chat, ChatMessages, PaginationInput } from '../../services/chats/chat.interface';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../services/auth/context/authContext';
import _ from 'lodash';
import { moderateScale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ChatScreen = ({ route, navigation }: any) => {
  const { user, hideTab } = React.useContext(AuthContext);
  const { getChatsMessages, getMoreChatsMessages, sendMessage, subscribeToChat, whoIsTyping, chatChanged, chatMessages, chatMessagesCount, chats } =
    React.useContext(MessageContext);
  const scrollViewRef = useRef<FlatList>(null);
  const [heightInput, setHeightInput] = useState<number>(100);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(true);
  const sendedIsWriting = React.useRef<boolean>(false);
  const enable = route.params.enable;
  const participants = route.params.participants;
  const pagination = React.useRef<PaginationInput>({
    itemsPerPage: 10,
    page: 1,
    searchKey: '',
  });
  const getData = async () => {
    setLoading(true);
    await AsyncStorage.removeItem(`@${route.params.id}`);
    await getChatsMessages(route.params.id, pagination.current);
    setLoading(false);
    scrollViewRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const findWhoIsWriting = (chatsToFind: Chat[], chatId: string, userId: string) => {
    if (chatsToFind.length > 0) {
      const chat = chatsToFind.find((c: Chat) => c._id === chatId);
      if (chat) {
        const parts = chat.participants;
        const whoIsWriting = chat.whoIsWriting;
        if (whoIsWriting.length > 0) {
          const participantsNotMe = parts.filter((participant: any) => participant._id !== userId);
          const WhoIsWrittingNotMe = whoIsWriting.find((wWriting: any) => wWriting !== userId);
          if (participantsNotMe && WhoIsWrittingNotMe) {
            const writter = participantsNotMe.find(p => p._id === WhoIsWrittingNotMe);
            if (writter) {
              return writter.firstName + ' ' + writter.lastName;
            }
            return null;
          }
        }
      }
    }
  };
  useFocusEffect(
    useCallback(() => {
      getData();
      if (navigation.isFocused) {
        hideTab(true);
      }
      return () => {
        hideTab(false);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  React.useEffect(() => {
    if (enable) {
      const subscribe = subscribeToChat(route.params.id);
      scrollViewRef?.current?.scrollToOffset({ animated: true, offset: 0 });
      return () => subscribe?.unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params.id]);

  React.useEffect(() => {
    if (enable) {
      const changeChatSubscription = chatChanged(route.params.id);
      return () => changeChatSubscription?.unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params.id]);

  return (
    <Block flex>
      <Block flex row>
        <Block style={{ paddingBottom: 10, paddingVertical: 10, flex: 1, alignSelf: 'center' }}>
          {loading ? (
            <Block style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="black" />
            </Block>
          ) : (
            <Block style={styles.notificationContainer}>
              {chatMessages && chatMessages.length ? (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  ref={scrollViewRef}
                  keyExtractor={(item: ChatMessages, i) => item._id + i}
                  data={chatMessages && chatMessages.length ? _.orderBy(chatMessages, 'createdAt', 'desc') : []}
                  renderItem={({ item, i }: any) => <ConversationComponent item={item} key={i} user={user!} participants={participants} />}
                  inverted
                  onEndReached={async () => {
                    if (chatMessages && chatMessages.length && chatMessages.length < chatMessagesCount) {
                      pagination.current.page = pagination.current.page + 1;
                      setLoadingMore(true);
                      await getMoreChatsMessages(route.params.id, pagination.current);
                      setLoadingMore(false);
                      return;
                    }
                    return;
                  }}
                  ListFooterComponent={() => (
                    <>
                      {chatMessages && chatMessages.length < chatMessagesCount ? (
                        <>
                          {loadingMore ? (
                            <Block style={styles.loaderContainer}>
                              <ActivityIndicator size="large" color="black" />
                            </Block>
                          ) : null}
                        </>
                      ) : null}
                    </>
                  )}
                />
              ) : (
                <Block middle>
                  <Text style={{ textAlign: 'center' }} bold size={18} color="lightgray">
                    Esta conversacion no posee ningún mensaje
                  </Text>
                </Block>
              )}
            </Block>
          )}
          {/* <View style={{ height: 60 }} /> */}
        </Block>
      </Block>
      {enable ? (
        <>
          <Block style={{ bottom: moderateScale(10), paddingHorizontal: 20, paddingTop: 10 }}>
            {findWhoIsWriting(chats, route.params.id, user!._id) && (
              <Text color="grey">{findWhoIsWriting(chats, route.params.id, user!._id)} esta escribiendo...</Text>
            )}
          </Block>
          <Block style={styles.containerTextInput} row>
            <TextInput
              placeholder="Mensaje"
              style={[
                styles.inputText,
                {
                  minHeight: 30,
                  maxHeight: heightInput,
                  // height: 60,
                },
              ]}
              autoCorrect
              allowFontScaling
              numberOfLines={5}
              onContentSizeChange={e => {
                if (e.nativeEvent.contentSize.height < 55 * 3) {
                  setHeightInput(e.nativeEvent.contentSize.height);
                  // scrollViewRef.current.scrollToEnd({ animated: true });
                }
              }}
              value={inputValue}
              onChangeText={async (e: string) => {
                setInputValue(e);
                if (e.length > 5 && !sendedIsWriting.current) {
                  //Mandar mutacion para que el usuario este escribiendo
                  sendedIsWriting.current = true;
                  await whoIsTyping(route.params.id, true, user!._id);
                } else if (e.length === 0 && sendedIsWriting.current) {
                  sendedIsWriting.current = false;
                  await whoIsTyping(route.params.id, false, user!._id);
                }
              }}
              editable={!loading}
              scrollEnabled
              multiline
            />
            <Button
              iconFamily={'Feather'}
              style={{ width: 40, height: 40, marginVertical: 0 }}
              icon={loading ? 'clock' : 'send'}
              disabled={loading}
              onlyIcon
              iconColor="black"
              color="#ffae3b"
              iconSize={18}
              onPress={async () => {
                if (inputValue === '') {
                  return;
                }
                setInputValue('');
                await sendMessage(inputValue, route.params.id);
                sendedIsWriting.current = false;
                await whoIsTyping(route.params.id, false, user!._id);
                scrollViewRef!.current!.scrollToOffset({ animated: true, offset: 0 });
              }}
            />
          </Block>
        </>
      ) : null}
    </Block>
  );
};

const styles = StyleSheet.create({
  containerTextInput: {
    display: 'flex',
    paddingHorizontal: 10,
    paddingVertical: 5,
    // paddingTop: 10,
    bottom: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  containerText: {
    display: 'flex',
    paddingHorizontal: 10,
    paddingTop: 10,
    bottom: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffae3b',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    overflow: 'hidden',
    fontSize: 16,
    width: '85%',
    marginLeft: 10,
    color: 'black',
  },
  containerIcon: {
    backgroundColor: '#222222',
    width: 30,
    height: 30,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginRight: 15,
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
  loaderContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(1,1,1, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubcontainer: {
    width: moderateScale(330),
    // height: moderateScale(600),
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingVertical: moderateScale(20),
    paddingHorizontal: moderateScale(10),
    borderRadius: 20,
  },
});
