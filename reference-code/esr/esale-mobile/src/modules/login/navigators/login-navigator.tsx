import React from 'react';
import { AddConnectionScreen } from '../connection/connection-add-connection-screen';
import { ChangePasswordScreen } from '../login-relation/change-password-screen';
import { ChangePasswordSuccessScreen } from '../login-relation/change-password-success-screen';
import { createStackNavigator } from '@react-navigation/stack';
import { EditConnectionScreen } from '../connection/connection-edit-connection-screen';
import { ForbiddenScreen } from '../authorization/forbidden-screen';
import { ForgotPasswordScreen } from '../login-relation/forgot-password-screen';
import { LoginScreen } from '../authorization/login-screen';
import { PickConnectionScreen } from '../connection/connection-pick-connection-screen';
import { SendMailSuccessScreen } from '../login-relation/send-mail-success-screen';
import { theme } from '../../../config/constants';
import { TrialExpiredScreen } from '../authorization/trial-expired-screen';
import { UrlExpiredScreen } from '../login-relation/url-expired-screen';

const Stack = createStackNavigator();

export function LoginNavigator() {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{ cardStyle: { backgroundColor: theme.colors.white100 } }}
    >
      <>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="trial-expired" component={TrialExpiredScreen} />
        <Stack.Screen name="forbidden" component={ForbiddenScreen} />
        <Stack.Screen name="change-password" component={ChangePasswordScreen} />
        <Stack.Screen name="change-password-success" component={ChangePasswordSuccessScreen} />
        <Stack.Screen name="url-expired" component={UrlExpiredScreen} />
        <Stack.Screen name="forgot-password" component={ForgotPasswordScreen} />
        <Stack.Screen name="send-email-success" component={SendMailSuccessScreen} />
        <Stack.Screen name="pick-connection" component={PickConnectionScreen} />
        <Stack.Screen name="add-connection" component={AddConnectionScreen} />
        <Stack.Screen name="edit-connection" component={EditConnectionScreen} />
      </>
    </Stack.Navigator>
  );
}
