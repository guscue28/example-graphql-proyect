import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './Auth/auth.navigator';
import TabNavigator from './tab.navigator';
import DriverTabNavigator from './driver.navigator';
import { PermissionsContext } from '../services/auth/context/permissionsContext';
import { AuthContext } from '../services/auth/context/authContext';
import { LoadingScreen } from '../screens/loading/loadingScreen';
import { UserRoles } from '../services/user/user.interface';

export type AppStackParamList = {
  AuthStak: undefined;
  TabNavigaton: undefined;
  DriverTabNavigation: undefined;
  LoadingScreen: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();
// const Drawer = createDrawerNavigator();

export const MainNavigator = () => {
  const { permissions } = useContext(PermissionsContext);
  const { isAuth, loadingAuth, user } = useContext(AuthContext);

  if (loadingAuth) {
    return <LoadingScreen />;
  }
  // console.log('user', user!);
  return (
    <>
      <Stack.Navigator
        initialRouteName="AuthStak"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'white' },
        }}>
        {permissions.locationStatus === 'granted' && isAuth ? (
          user ? (
            user.roles!.includes(UserRoles.DRIVER) ? (
              <Stack.Screen name="DriverTabNavigation" component={DriverTabNavigator} />
            ) : (
              <Stack.Screen name="TabNavigaton" component={TabNavigator} />
            )
          ) : (
            <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
          )
        ) : (
          <Stack.Screen name="AuthStak" component={AuthNavigator} />
        )}
      </Stack.Navigator>
      {/* <Drawer.Navigator drawerContent={() => <DrawerComponent />}>
        <Drawer.Screen name="TabNavigaton" component={TabNavigator} />
      </Drawer.Navigator> */}
    </>
  );
};

export default MainNavigator;
