import React from 'react';
import { Image, View, Text } from 'react-native';
import { Images } from '../../../config';
import { translate } from '../../../../../config/i18n';
import { messages } from '../../../calendar-list-messages';
/**
 * Render Loading Component
 */
export const NoDataComponent = React.memo(() => {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        marginTop: '20%',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Image
        style={{ width: 35, height: 35 }}
        source={Images.schedule.no_data}
      />
      <Text>{translate(messages.noData)}</Text>
    </View>
  );
});
