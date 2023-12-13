import * as React from 'react';
import { Block, Text } from 'galio-framework';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import moment from 'moment';
import 'moment/locale/es';
import { Chat, UserChat } from '../../services/chats/chat.interface';
import { User, UserRoles } from '../../services/user/user.interface';

export interface MessageState {}

export interface MessageProps {
  navigation: any;
  item: Chat;
  user: User | null;
}

export class MessageComponent extends React.Component<MessageProps, MessageState> {
  constructor(props: any) {
    super(props);
  }
  render() {
    const subject =
      this.props.user &&
      this.props.item.participants.find((from: UserChat) =>
        this.props.user?.roles!.includes(UserRoles.CLIENT) ? from.roles!.includes(UserRoles.DRIVER) : from.roles!.includes(UserRoles.CLIENT),
      );
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigation.navigate('ChatScreen', {
            id: this.props.item._id,
            enable: this.props.item.enabled,
            participants: this.props.item.participants,
          });
        }}
        style={styles.messageContainer}>
        <Block row>
          <Block style={[styles.avatarSection]}>
            {/* <View style={[styles.notificationDot, { display: this.props.item.state === 'unread' ? 'flex' : 'none' }]} /> */}
            <Block>
              <Image source={subject && subject.picture ? { uri: subject.picture } : require('../../assets/movyLogo.png')} style={styles.leftAvatar} />
            </Block>
          </Block>
          <Block row space="between" style={styles.textSection}>
            <Block style={{ maxWidth: '90%' }}>
              <Text style={styles.notificationTitle}>{`${subject ? subject.firstName : ''} ${subject ? subject.lastName : ''}`}</Text>
              <Text
                bold={this.props.item.lastChatMessage && this.props.item.lastChatMessage.user === this.props.user?._id ? false : true}
                style={styles.notificationText}
                numberOfLines={2}
                ellipsizeMode="tail">
                {this.props.item.lastChatMessage && this.props.item.lastChatMessage.message
                  ? this.props.item.lastChatMessage.message
                  : 'Sea el primero en enviar un mensaje.'}
              </Text>
              <Text
                bold={this.props.item.lastChatMessage && this.props.item.lastChatMessage.user === this.props.user?._id ? false : true}
                color={this.props.item.lastChatMessage && this.props.item.lastChatMessage.user === this.props.user?._id ? 'lightgray' : 'gray'}
                style={styles.notificationDate}>
                {moment(this.props.item.updatedAt).fromNow()}
              </Text>
            </Block>
            <Block space="evenly" style={{ alignItems: 'center', marginBottom: 10 }}>
              {/* <Icon
                family="Feather"
                name={
                  this.props.item.lastChatMessage &&
                  this.props.item.lastChatMessage.readBy.includes(this.props.user?._id) &&
                  this.props.item.lastChatMessage.user === this.props.user?._id
                    ? 'check'
                    : 'info'
                }
                size={24}
                color={
                  this.props.item.lastChatMessage &&
                  this.props.item.lastChatMessage.readBy.includes(this.props.user?._id) &&
                  this.props.item.lastChatMessage.user === this.props.user?._id
                    ? 'green'
                    : '#ffae3b'
                }
              /> */}
              {this.props.item.lastChatMessage &&
              this.props.item.lastChatMessage.user !== this.props.user?._id &&
              this.props.item.unreaded &&
              this.props.item.unreaded > 0 ? (
                <Block middle style={{ backgroundColor: '#ffae3b', width: 20, height: 20, borderRadius: 10 }}>
                  <Text color="black" bold>
                    {this.props.item.unreaded}
                  </Text>
                </Block>
              ) : null}
            </Block>
          </Block>
        </Block>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: moderateScale(10),
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    width: moderateScale(350),
    flexWrap: 'wrap',
  },
  leftAvatar: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: 40,
    zIndex: 5,
    top: -5,
    marginLeft: moderateScale(20),
    // borderWidth: 4,
    borderColor: '#ffae3b',
  },
  notificationDot: {
    position: 'absolute',
    backgroundColor: '#ffae3b',
    top: moderateScale(10),
    left: moderateScale(10),
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: 40,
  },
  avatarSection: {
    paddingVertical: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    // marginRight: 5,
  },
  textSection: {
    padding: moderateScale(10),
    borderTopRightRadius: 19,
    width: moderateScale(260),
    borderBottomRightRadius: 19,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  notificationTitle: {
    marginLeft: moderateScale(10),
    fontSize: moderateScale(14),
    color: '#373737',
    fontWeight: '600',
  },
  notificationText: {
    fontSize: moderateScale(11),
    marginTop: moderateScale(5),
    marginHorizontal: moderateScale(10),
    alignSelf: 'flex-start',
    color: '#373737',
  },
  notificationDate: {
    marginRight: moderateScale(10),
    fontSize: moderateScale(12),
    marginHorizontal: moderateScale(10),
    marginTop: moderateScale(5),
    alignSelf: 'flex-start',
  },
});
