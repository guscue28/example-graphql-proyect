import { ApolloClient, HttpLink, split } from '@apollo/client';
// import {setContext} from '@apollo/client/link/context';
import { InMemoryCache } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Platform, NativeModules } from 'react-native';
import Config from 'react-native-config';
const uri = `${Config.API_URL}/graphql`;
console.log('uri', uri);

const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier;

const makeApolloClient = (token?: string) => {
  const httpLink = new HttpLink({
    uri: uri,
    headers: token
      ? {
          authorization: `Bearer ${token}`,
          'x-custom-lang': deviceLanguage,
        }
      : {
          'x-custom-lang': deviceLanguage,
        },
  });
  const wsLink = new WebSocketLink({
    uri: `${Config.API_WS_URL}/graphql`,
    options: {
      reconnect: true,
      connectionParams: {
        headers: token
          ? {
              authorization: `Bearer ${token}`,
              'x-custom-lang': deviceLanguage,
            }
          : {
              'x-custom-lang': deviceLanguage,
            },
      },
    },
  });
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink,
  );
  const cache = new InMemoryCache();
  const client = new ApolloClient({
    link: splitLink,
    cache,
  });
  return client;
};

export default makeApolloClient;
