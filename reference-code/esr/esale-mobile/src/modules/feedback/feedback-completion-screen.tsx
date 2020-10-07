import * as React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { FeedbackCompletionStyles } from './feedback-style';
import { Header } from '../../shared/components/header';
import { messages } from './feedback-messages';
import { translate } from '../../config/i18n';
import { Icon } from '../../shared/components/icon';
import { ButtonColorHighlight } from '../../shared/components/button/button-color-highlight';
import { EnumButtonStatus, EnumButtonType } from '../../config/constants/enum';
import { theme } from '../../config/constants';

interface FeedbackCompletionScreenParams {
  onClose: (custom?: () => void) => void
}

export function FeedbackCompletionScreen({
  onClose
} : FeedbackCompletionScreenParams) {
  const navigation: any = useNavigation();
  let timeOut: any;
  React.useEffect(() => {
    timeOut = setTimeout(() => {
      close();
    }, 3000);
  }, []);

  const close = () => {
    if (timeOut) {
      clearTimeout(timeOut);
    }
    onClose(() => {
      navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{ name: "menu" }]
      }));
    })
  };

  return (
    <SafeAreaView style={FeedbackCompletionStyles.container}>
      <Header
        title={`${translate(messages.title)}`}
        onLeftPress={() => {
          close();
        }}
        titleSize={theme.fontSizes[4]}
      />
      <View style={FeedbackCompletionStyles.content}>
        <Icon name="checkDone" style={FeedbackCompletionStyles.icon} />
        <Text style={FeedbackCompletionStyles.text}>
          {`${translate(messages.completed)}`}
        </Text>
        <Text style={FeedbackCompletionStyles.textWait}>
          {`${translate(messages.wait)}`}
        </Text>
        <View style={FeedbackCompletionStyles.buttonClose}>
          <ButtonColorHighlight
            isShadow={false}
            status={EnumButtonStatus.normal}
            onPress={() => {
              close();
            }}
            title={`${translate(messages.close)}`}
            type={EnumButtonType.miniModal}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
