import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProfileScreen } from '../../screens/account/userProfileScreen';
import { UpdateProfileScreen } from '../../screens/account/updateProfileScreen';
import { UpdatePasswordScreen } from '../../screens/account/updatePasswordScreen';
import { ViewJourniesScreen } from '../../screens/account/viewJourniesScreen';
import { ViewFavoritesRidersScreen } from '../../screens/account/viewFavoritesRidersScreen';
import { ViewMyLocationsScreen } from '../../screens/account/viewMyLocationsScreen';
import { Block, Button, Text } from 'galio-framework';
import { AuthContext } from '../../services/auth/context/authContext';
import { UserRoles } from '../../services/user/user.interface';
import { TravelScreen } from '../../screens/account/travelScreen';
import { MembershipScreen } from '../../screens/account/membershipScreen';
import { MyWalletScreen } from '../../screens/account/myWalletScreen';
import { TermsAndConditionsScreen } from '../../screens/account/termsAndConditionsScreen';
import { RechargeWalletReceiptScreen } from '../../screens/account/rechargeWalletReceipt';

export type MyProfileParamList = {
  MyProfileScreen: undefined;
  UpdateProfileScreen: undefined;
  UpdatePasswordScreen: undefined;
  ViewFavoritesRidersScreen: undefined;
  ViewJourniesScreen: undefined;
  ViewMyLocationsScreen: undefined;
  TravelScreen: undefined;
  MembershipScreen: undefined;
  MyWalletScreen: undefined;
  TermsAndConditionsScreen: undefined;
  RechargeWalletReceipt: {
    mount: number;
    countOwner: string;
    email: string;
    description: string;
  };
};

const MyProfileNavigator = createStackNavigator<MyProfileParamList>();

export const MyProfileStack = () => {
  const { user } = React.useContext(AuthContext);

  return (
    <MyProfileNavigator.Navigator
      initialRouteName="MyProfileScreen"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}>
      {user && user.roles!.some((rol: UserRoles) => rol === 'CLIENT') ? (
        <>
          <MyProfileNavigator.Screen name="MyProfileScreen" component={UserProfileScreen} />
          <MyProfileNavigator.Screen
            name="UpdateProfileScreen"
            component={UpdateProfileScreen}
            options={{
              headerShown: true,
              header: ({ navigation }: any) => (
                <Block
                  style={{
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                  }}
                  row>
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
                    Editar Perfil
                  </Text>
                </Block>
              ),
            }}
          />
          <MyProfileNavigator.Screen name="UpdatePasswordScreen" component={UpdatePasswordScreen} />
          <MyProfileNavigator.Screen
            name="ViewFavoritesRidersScreen"
            component={ViewFavoritesRidersScreen}
            options={{
              headerShown: true,
              header: ({ navigation }: any) => (
                <Block
                  style={{
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                  }}
                  row>
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
                    Mis Favoritos
                  </Text>
                </Block>
              ),
            }}
          />
          <MyProfileNavigator.Screen
            name="ViewJourniesScreen"
            component={ViewJourniesScreen}
            options={{
              headerShown: true,
              header: ({ navigation }: any) => (
                <Block
                  style={{
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                  }}
                  row>
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
                    Tus Viajes
                  </Text>
                </Block>
              ),
            }}
          />
          <MyProfileNavigator.Screen
            name="TravelScreen"
            component={TravelScreen}
            options={{
              headerShown: true,
              header: ({ navigation }: any) => (
                <Block
                  style={{
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                  }}
                  row>
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
                </Block>
              ),
            }}
          />
          <MyProfileNavigator.Screen
            name="ViewMyLocationsScreen"
            component={ViewMyLocationsScreen}
            options={{
              headerShown: true,
              header: ({ navigation }: any) => (
                <Block
                  style={{
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                  }}
                  row>
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
                    Tus Direcciones
                  </Text>
                </Block>
              ),
            }}
          />
          <MyProfileNavigator.Screen
            name="MembershipScreen"
            component={MembershipScreen}
            options={{
              headerShown: true,
              header: ({ navigation }: any) => (
                <Block
                  style={{
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                  }}
                  row>
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
                  {user.userMembership ? (
                    <>
                      <Text color="black" size={20} style={{ fontWeight: '800' }}>
                        Mi membresía
                      </Text>
                    </>
                  ) : (
                    <Block>
                      <Text color="black" size={20} style={{ fontWeight: '800' }}>
                        Planes de membresía de movy
                      </Text>
                    </Block>
                  )}
                </Block>
              ),
            }}
          />

          <MyProfileNavigator.Screen
            name="MyWalletScreen"
            component={MyWalletScreen}
            options={{
              headerShown: true,
              header: ({ navigation }: any) => (
                <Block
                  style={{
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                  }}
                  row>
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
                    Mi Wallet
                  </Text>
                </Block>
              ),
            }}
          />
          <MyProfileNavigator.Screen
            name="TermsAndConditionsScreen"
            component={TermsAndConditionsScreen}
            options={{
              headerShown: true,
              header: ({ navigation }: any) => (
                <Block
                  style={{
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                  }}
                  row>
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
                </Block>
              ),
            }}
          />
          <MyProfileNavigator.Screen
            name="RechargeWalletReceipt"
            component={RechargeWalletReceiptScreen}
            options={{
              headerShown: true,
              header: ({ navigation }: any) => (
                <Block
                  style={{
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                  }}
                  row>
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
                </Block>
              ),
            }}
          />
        </>
      ) : (
        <>
          <MyProfileNavigator.Screen name="MyProfileScreen" component={UserProfileScreen} />
          <MyProfileNavigator.Screen
            name="UpdateProfileScreen"
            component={UpdateProfileScreen}
            options={{
              headerShown: true,
              header: ({ navigation }: any) => (
                <Block
                  style={{
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                  }}
                  row>
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
                    Editar Perfil
                  </Text>
                </Block>
              ),
            }}
          />
          <MyProfileNavigator.Screen name="UpdatePasswordScreen" component={UpdatePasswordScreen} />
          <MyProfileNavigator.Screen
            name="ViewJourniesScreen"
            component={ViewJourniesScreen}
            options={{
              headerShown: true,
              header: ({ navigation }: any) => (
                <Block
                  style={{
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                  }}
                  row>
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
                    Tus Viajes
                  </Text>
                </Block>
              ),
            }}
          />
          <MyProfileNavigator.Screen
            name="TravelScreen"
            component={TravelScreen}
            options={{
              headerShown: true,
              header: ({ navigation }: any) => (
                <Block
                  style={{
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                  }}
                  row>
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
                </Block>
              ),
            }}
          />
          <MyProfileNavigator.Screen
            name="MembershipScreen"
            component={MembershipScreen}
            options={{
              headerShown: true,
              header: ({ navigation }: any) => (
                <Block
                  style={{
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                  }}
                  row>
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
                </Block>
              ),
            }}
          />
          <MyProfileNavigator.Screen
            name="MyWalletScreen"
            component={MyWalletScreen}
            options={{
              headerShown: true,
              header: ({ navigation }: any) => (
                <Block
                  style={{
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                  }}
                  row>
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
                    Mi Wallet
                  </Text>
                </Block>
              ),
            }}
          />
          <MyProfileNavigator.Screen
            name="TermsAndConditionsScreen"
            component={TermsAndConditionsScreen}
            options={{
              headerShown: true,
              header: ({ navigation }: any) => (
                <Block
                  style={{
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: 'center',
                  }}
                  row>
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
                </Block>
              ),
            }}
          />
        </>
      )}
    </MyProfileNavigator.Navigator>
  );
};
