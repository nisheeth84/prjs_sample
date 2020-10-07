import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ModalPortal } from './modal-portal'
import { FirstLogin } from './first-login'
import { ProceedPortal } from './proceed-portal'
import { StartPortal } from './start-portal'
const Stack = createStackNavigator();

interface PortalNavigatorParams {
  onClose: (custom? : () => void) => void
}

export function PortalNavigator({
  onClose
}: PortalNavigatorParams) {
  return (
    <Stack.Navigator
      headerMode="none"
    >
        <Stack.Screen name="first-login" component={() => <FirstLogin onClose={onClose} />} />
        <Stack.Screen name="modal-portal" component={() => <ModalPortal onClose={onClose} />} />
        <Stack.Screen name="proceed-portal" component={ProceedPortal} />
        <Stack.Screen name="start-portal" component={StartPortal} />
    </Stack.Navigator>
  );
}
