import * as React from 'react';
import { Block } from 'galio-framework';
import { Image, StyleSheet, Text, View } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import moment from 'moment';
import 'moment/locale/es';
export interface NotificationState {}
export class NotificationComponent extends React.Component<any, NotificationState> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <Block row style={{ marginTop: 30, borderRadius: 20, opacity: this.props.opacity, marginHorizontal: 20 }}>
        <Block style={[styles.avatarSection, { backgroundColor: this.props.item.type === 'message' ? 'black' : '#ffae3b' }]}>
          <View style={[styles.notificationDot, { backgroundColor: this.props.item.type === 'message' ? '#ffae3b' : 'white' }]} />
          <Block>
            <Image source={{ uri: 'https://picsum.photos/200/200' }} style={styles.leftAvatar} />
            <View style={[styles.triangle, styles.triangleRight, { borderBottomColor: this.props.item.type === 'message' ? 'black' : '#ffae3b' }]} />
          </Block>
        </Block>
        <Block style={styles.textSection}>
          <Text style={styles.notificationTitle} numberOfLines={1} ellipsizeMode="tail">
            {this.props.item.title}
          </Text>
          <Text style={styles.notificationText} numberOfLines={2} ellipsizeMode="tail">
            {this.props.item.text}
          </Text>
          <Text style={styles.notificationSecondaryText} numberOfLines={1} ellipsizeMode="tail">
            {this.props.item.secondaryText}
          </Text>
          <Text style={styles.notificationDate}>{moment(this.props.item.date).fromNow()}</Text>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  leftAvatar: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: 40,
    zIndex: 5,
    // borderWidth: 4,
    borderColor: '#ffae3b',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: 40,
  },
  avatarSection: {
    height: moderateScale(100),
    width: '30%',
    borderTopLeftRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderBottomLeftRadius: 19,
    // marginRight: 5,
  },
  textSection: {
    padding: 10,
    width: '70%',
    backgroundColor: '#f1f1f1',
    height: moderateScale(100),
    borderTopRightRadius: 19,
    borderBottomRightRadius: 19,
  },
  notificationTitle: {
    marginLeft: 10,
    fontSize: 14,
    alignSelf: 'flex-start',
    color: '#373737',
    fontWeight: '600',
  },
  notificationText: {
    fontSize: 12,
    width: '95%',
    marginHorizontal: 10,
    alignSelf: 'flex-start',
    color: '#373737',
  },
  notificationSecondaryText: {
    fontSize: 12,
    marginHorizontal: 10,
    alignSelf: 'flex-start',
    color: '#ffae3b',
  },
  notificationDate: {
    marginRight: 10,
    fontSize: 12,
    marginHorizontal: 10,
    marginTop: 5,
    alignSelf: 'flex-start',
    color: 'lightgray',
  },
  triangle: {
    width: 0,
    position: 'absolute',
    right: moderateScale(-28),
    top: moderateScale(27),
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 10,
    borderBottomWidth: 13,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  triangleRight: {
    transform: [{ rotate: '90deg' }],
  },
});
