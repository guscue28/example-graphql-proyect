import * as React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Block, Text } from 'galio-framework';
import { AirbnbRating } from 'react-native-ratings';
import moment from 'moment';
import TimeIcon from '../../assets/icons/time.svg';
import { moderateScale } from 'react-native-size-matters';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Rating, RatingTypes, Travel, TravelStatuses } from '../../interfaces/travel.interface';

export interface MyTravelsProps {
  user: any;
  item: Travel;
  press: any;
}
export class MyTravelsComponent extends React.Component<MyTravelsProps, any> {
  public render() {
    const clientRating = this.props.item.ratings?.find((el: Rating) => el.client === this.props.user._id && el.type === RatingTypes.TO_CLIENT);
    // const driverRating = this.props.item.ratings!.find((el: Rating) => el.driver === this.props.user._id && el.type === RatingTypes.TO_DRIVER);
    // console.log('client', clientRating);
    // console.log('user', driverRating);

    return (
      <TouchableOpacity onPress={() => this.props.press(this.props.item)} style={styles.container}>
        <Image source={{ uri: this.props.item.routePicture }} style={styles.mapCard} />
        <Block style={styles.infoContainer}>
          <Text numberOfLines={1} color="black">
            <Text bold>Desde: </Text>
            {`${this.props.item.originString}`}
          </Text>
          <Text numberOfLines={1} color="black">
            <Text bold>Hasta: </Text> {`${this.props.item.destinationString}`}
          </Text>
          {this.props.item.travelStatus === TravelStatuses.FINISHED ? (
            <Block row middle space="between">
              <AirbnbRating
                size={moderateScale(10)}
                showRating={false}
                defaultRating={clientRating?.rating}
                isDisabled={true}
                selectedColor="#ffae3b"
                starContainerStyle={{
                  paddingVertical: 5,
                }}
                // onFinishRating={(ratingVal: number) => setRating(ratingVal)}
              />
              <Text color="black" size={11}>
                Fecha: {moment(this.props.item.createdAt).format('DD/MM/YYYY')}
              </Text>
              <Text color="black" size={11}>
                Duración:{' '}
                {`${moment
                  .duration(moment(this.props.item.finishDate).diff(moment(this.props.item.startDate)))
                  .asMinutes()
                  .toFixed(2)} min`}
              </Text>
            </Block>
          ) : this.props.item.travelStatus === TravelStatuses.CANCELLED ? (
            <Block row middle style={{ paddingHorizontal: 20 }}>
              <Text color="red" bold size={11}>
                {this.props.item.travelStatus}
              </Text>
            </Block>
          ) : this.props.item.travelStatus === TravelStatuses.SCHEDULED_WITHOUT_DRIVER ||
            this.props.item.travelStatus === TravelStatuses.SCHEDULED_WITH_DRIVER ? (
            <Block row middle bottom style={{ paddingHorizontal: 20 }}>
              <TimeIcon width={20} height={20} style={{ marginRight: 20, marginTop: 5 }} />
              <Text color="black" bold size={11} style={{ marginRight: 20, marginBottom: 3 }}>
                Fecha: {moment(this.props.item.scheduledDate).format('DD/MM/YYYY')}
              </Text>
              <Text color="black" bold size={11} style={{ marginRight: -10, marginBottom: 3 }}>
                Hora: {moment(this.props.item.scheduledDate).format('hh:mm a')}
              </Text>
            </Block>
          ) : null}
          {/* <Block row middle space="between">
            {this.props.item.finish ? (
              <AirbnbRating
                count={5}
                size={12}
                showRating={false}
                defaultRating={this.props.item.calification}
                isDisabled={false}
                selectedColor="#ffae3b"
                starContainerStyle={{
                  paddingVertical: 5,
                }}
                // onFinishRating={(ratingVal: number) => setRating(ratingVal)}
              />
            ) : (
              <TimeIcon width={20} height={20} />
            )}
            {this.props.item.finish ? (
              <Text color="black" size={11}>
                Fecha: {moment().format('DD/MM/YYYY')}
              </Text>
            ) : (
              <Text color="black" bold size={11}>
                Fecha: {moment(this.props.item.queue).format('DD/MM/YYYY')}
              </Text>
            )}
            {this.props.item.finish ? (
              <Text size={11}>Duración: {this.props.item.duration}</Text>
            ) : (
              <Text size={11}>Hora: {moment(this.props.item.queue).format('hh:mm a')}</Text>
            )}
          </Block> */}
        </Block>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    // borderTopRightRadius: 30,
    // borderTopLeftRadius: 30,
    marginTop: 20,
    marginHorizontal: 20,
  },
  mapCard: {
    width: moderateScale(330),
    height: moderateScale(150),
  },
  infoContainer: {
    backgroundColor: 'lightgray',
    padding: moderateScale(10),
  },
});
