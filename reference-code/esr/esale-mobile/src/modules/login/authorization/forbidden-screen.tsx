import React from 'react';
import { TrialExpiredStyles } from './authorization-styles';
import { Image, Text, View } from 'react-native';
import { messages } from './authorization-messages';
import { translate } from '../../../config/i18n';
import { RouteProp, useRoute } from '@react-navigation/native';

/**
 * Component for forbidden screen
 */
export function ForbiddenScreen() {
  type ParamPropType = {
    errorType: { errorType: string };
  };
  type GetParamProp = RouteProp<ParamPropType, "errorType">;
  const route = useRoute<GetParamProp>();
  const error: { errorType: string } = route.params;
  const iconEsm = require("../../../../assets/icon.png");
  const icon403 = require("../../../../assets/icons/icon403.png");
  const icon404 = require("../../../../assets/icons/icon404.png");

  /**
   * Render component for forbidden screen
   */
  return (
    <View style={TrialExpiredStyles.container}>
      <View style={TrialExpiredStyles.topContainer}>
        <View style={TrialExpiredStyles.logoWrapper}>
          <Image source={iconEsm} style={TrialExpiredStyles.logo} />
        </View>
        <View style={TrialExpiredStyles.textResetWrapper}>
          {error.errorType === "403" ?
            (<Image source={icon403} />)
            : (<Image source={icon404} />)
          }
        </View>
        <View style={TrialExpiredStyles.messageWrapper}>
          <Text style={TrialExpiredStyles.textMessage}>
            {error.errorType === "403" ?
              translate(messages.login_110001_forbiddenMessage)
              : translate(messages.login_110001_notFound)
            }
          </Text>
        </View>
      </View>
      <View style={{ marginVertical: 15 }}>
        <Text style={{ textAlign: 'center' }}>©SOFTBRAIN Co.,Ltd.</Text>
      </View>
    </View>
  );
}
