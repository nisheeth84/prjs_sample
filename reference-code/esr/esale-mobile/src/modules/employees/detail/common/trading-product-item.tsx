import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import NumberFormat from 'react-number-format';
import { Icon } from '../../../../shared/components/icon';
import { BusinessCardItemStyles, TaskItemStyles } from '../detail-style';
import { messages } from '../detail-messages';
import { translate } from '../../../../config/i18n';

interface TaskProps {
  name: string;
  completeDate: string;
  progress: string;
  amount: number;
}

/**
 * Component for trading product item for detail employee screen
 * @param name
 * @param completeDate
 * @param progress
 * @param amount
 */
export const TradingProductItem: React.FC<TaskProps> = ({
  name,
  completeDate,
  progress,
  amount,
}) => {
  return (
    <View style={BusinessCardItemStyles.inforEmployee}>
      <View style={BusinessCardItemStyles.mainInforBlock}>
        <View style={BusinessCardItemStyles.name}>
          <TouchableOpacity onPress={() => {}}>
            <Text style={TaskItemStyles.title}>{name}</Text>
          </TouchableOpacity>
          <View style={[TaskItemStyles.subtitle, { marginTop: 10 }]}>
            <Text style={TaskItemStyles.textGray}>
              {translate(messages.completionDate)}:
            </Text>
            <Text style={TaskItemStyles.textGray}> {completeDate}</Text>
          </View>
          <View style={TaskItemStyles.subtitle}>
            <Text style={TaskItemStyles.textGray}>
              {translate(messages.progress)}:
            </Text>
            <Text style={TaskItemStyles.textGray}> {progress}</Text>
          </View>
          <View style={TaskItemStyles.subtitle}>
            <Text style={TaskItemStyles.textGray}>
              {translate(messages.amountOfMoney)}:
            </Text>
            <NumberFormat
              value={amount}
              displayType="text"
              thousandSeparator
              suffix="円"
              renderText={(amount) => (
                <Text style={TaskItemStyles.textGray}> {amount}</Text>
              )}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity style={BusinessCardItemStyles.iconArrowRight}>
        <Icon name="arrowRight" />
      </TouchableOpacity>
    </View>
  );
};
