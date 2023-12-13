import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

interface Props {
  onChange?: () => void;
  style?: StyleProp<ViewStyle>;
  apiKey: string;
}

export const SearchBarMap = ({ onChange, style = {}, apiKey }: Props) => {
  return (
    <View style={{ ...(style as any) }}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        currentLocation={true}
        fetchDetails={true}
        enablePoweredByContainer={false}
        renderDescription={row => row.description}
        onPress={(data, details = null) => {
          // console.log(data);
          // console.log(details);
        }}
        currentLocationLabel="Current location"
        query={{
          key: apiKey,
          language: 'es',
          components: 'country:ve',
        }}
        disableScroll={true}
        styles={{
          textInput: {
            marginTop: 20,
            marginLeft: 20,
            marginRight: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#e6e6e6',
            padding: 10,
            fontSize: 14,
            backgroundColor: '#222222',
            color: 'gray',
            width: '100%',
          },
          listView: {
            marginTop: 20,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: '#e6e6e6',
            fontSize: 14,
            color: '#222222',
            // height: 50,
            // position: 'absolute',
            // top: 50,
            // left: 20,
            // right: 20,
          },
          description: {
            fontSize: 14,
            color: 'white',
          },
          row: {
            padding: 10,
            backgroundColor: '#222222',
            width: '100%',
            height: 50,
          },
          separator: {
            height: 0.5,
            width: '100%',
            backgroundColor: 'gray',
          },
          loader: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            height: 20,
          },
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        // filterTypes={['(cities)']}
      />
    </View>
  );
};
