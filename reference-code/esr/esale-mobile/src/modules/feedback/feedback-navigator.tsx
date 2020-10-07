import React from 'react';
// import { Dimensions } from 'react-native';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from '../../config/constants';
import { FeedbackCompletionScreen } from './feedback-completion-screen';
import { FeedbackScreen } from './feedback-screen';

const Stack = createStackNavigator();

interface FeedbackStackParams {
  onClose: (custom? : () => void) => void
}

export function FeedbackStack({
  onClose
} : FeedbackStackParams) {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{ cardStyle: { backgroundColor: theme.colors.white100 } }}
    >
      <Stack.Screen name="feed-back" component={() => <FeedbackScreen onClose={onClose} />} />
      <Stack.Screen name="feedback-completion" component={() => <FeedbackCompletionScreen onClose={onClose} />} />
    </Stack.Navigator>
  );
}
