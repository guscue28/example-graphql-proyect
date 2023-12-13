import * as React from 'react';
import { Block, Icon, Text } from 'galio-framework';
import { StyleSheet } from 'react-native';
import moment from 'moment';
import 'moment/locale/es';
import { ChatMessages } from '../../services/chats/chat.interface';
import { User } from '../../services/user/user.interface';
import { moderateScale } from 'react-native-size-matters';

export interface ConversationState {}

export interface ConversationProps {
  navigation?: any;
  item: ChatMessages;
  user: User;
  participants: User[];
}

export class ConversationComponent extends React.Component<ConversationProps, ConversationState> {
  constructor(props: any) {
    super(props);
  }
  render() {
    const validateReaders = () => {
      const participants: any = [];
      this.props.participants.map((participant: User) => {
        return participants.push(participant._id);
      });
      const readBy = this.props.item.readBy;
      const readers = readBy.slice().sort();
      const validate =
        participants.length === readers.length &&
        participants
          .slice()
          .sort()
          .every(function (value: any, index: any) {
            return value === readers[index];
          });
      return validate;
    };
    // const reader = this.props.participants.find((from: User) =>
    //   this.props.user!.roles!.includes(UserRoles.CLIENT) ? from.roles!.includes(UserRoles.DRIVER) : from.roles!.includes(UserRoles.CLIENT),
    // );
    // const readedBy = reader ? this.props.item.readBy.includes(reader._id) : false;

    return (
      <Block>
        {this.props.item.type === 'SYSTEM' ? (
          <Block row middle style={styles.systemMessage}>
            <Text style={{ textAlign: 'center' }} color="#e99011">
              {this.props.item.message}
            </Text>
          </Block>
        ) : (
          <Block style={[styles.messageContainer, { justifyContent: this.props.item.user === this.props.user._id ? 'flex-end' : 'flex-start' }]}>
            <Block style={[styles.textSection, { backgroundColor: this.props.item.user === this.props.user._id ? '#222222' : '#ffae3b' }]}>
              <Text color={this.props.item.user === this.props.user._id ? 'white' : 'black'} style={styles.notificationText}>
                {this.props.item.message}
              </Text>
              {this.props.item.user === this.props.user._id ? (
                <Block row right bottom>
                  <Text color={this.props.item.user === this.props.user._id ? 'lightgray' : '#444444'} style={styles.notificationDate}>
                    {moment(this.props.item.createdAt).format('hh:mm a')}
                  </Text>
                  <Block row>
                    <Icon
                      style={{ marginRight: !this.props.item.sended ? 0 : -10 }}
                      family="Feather"
                      name={!this.props.item.sended ? 'clock' : 'check'}
                      size={14}
                      color={validateReaders() ? 'green' : 'gray'}
                    />
                    {this.props.item.readBy && this.props.item.readBy.length ? (
                      <Icon family="Feather" name="check" size={14} color={validateReaders() ? 'green' : 'gray'} />
                    ) : null}
                  </Block>
                </Block>
              ) : (
                <Block row left bottom>
                  <Text color={this.props.item.user === this.props.user._id ? 'lightgray' : '#444444'} style={styles.notificationDate}>
                    {moment(this.props.item.createdAt).format('hh:mm a')}
                  </Text>
                </Block>
              )}
            </Block>
          </Block>
        )}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  textSection: {
    padding: 10,
    borderRadius: 20,
    textAlign: 'right',
  },
  notificationText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
    marginHorizontal: 10,
    alignSelf: 'flex-start',
  },
  notificationDate: {
    marginRight: 10,
    fontSize: 12,
    marginHorizontal: 10,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  systemMessage: {
    backgroundColor: '#fff4e0',
    padding: 6,
    borderRadius: 10,
    textAlign: 'center',
    marginHorizontal: moderateScale(40),
    marginVertical: moderateScale(5),
  },
});
