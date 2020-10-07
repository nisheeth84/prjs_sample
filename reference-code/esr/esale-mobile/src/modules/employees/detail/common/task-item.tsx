import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../../shared/components/icon';
import { BusinessCardItemStyles, TaskItemStyles } from '../detail-style';
import { messages } from '../detail-messages';
import { translate } from '../../../../config/i18n';

interface TaskProps {
  name: string;
  deadline: string;
  customerName: string;
  productName: string;
  personInCharge: string;
}

/**
 * Component for task item for detail employee screen
 * @param name
 * @param deadline
 * @param customerName
 * @param productName
 * @param personInCharge
 */
export const TaskItem: React.FC<TaskProps> = ({
  name,
  deadline,
  customerName,
  productName,
  personInCharge,
}) => {
  return (
    <TouchableOpacity style={[BusinessCardItemStyles.inforEmployee]}>
      <View style={BusinessCardItemStyles.mainInforBlock}>
        <View style={BusinessCardItemStyles.name}>
          <Text style={TaskItemStyles.title}>{name}</Text>
          <View style={TaskItemStyles.subtitle}>
            <TouchableOpacity onPress={() => {}}>
              <Text style={TaskItemStyles.textGray}>
                {translate(messages.deadline)}:
              </Text>
            </TouchableOpacity>
            <Text style={TaskItemStyles.textGray}> {deadline}</Text>
          </View>
          <View style={TaskItemStyles.subtitle}>
            <TouchableOpacity onPress={() => {}}>
              <Text style={TaskItemStyles.textGray}>
                {translate(messages.customerName)}:
              </Text>
            </TouchableOpacity>
            <Text style={TaskItemStyles.textGray}> {customerName}</Text>
          </View>
          <View style={TaskItemStyles.subtitle}>
            <TouchableOpacity onPress={() => {}}>
              <Text style={TaskItemStyles.textGray}>
                {translate(messages.productName)}:
              </Text>
            </TouchableOpacity>
            <Text style={TaskItemStyles.textGray}> {productName}</Text>
          </View>
          <View style={TaskItemStyles.subtitle}>
            <TouchableOpacity onPress={() => {}}>
              <Text style={TaskItemStyles.textGray}>
                {translate(messages.personInCharge)}:
              </Text>
            </TouchableOpacity>
            <Text style={TaskItemStyles.textGray}> {personInCharge}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={BusinessCardItemStyles.iconArrowRight}>
        <Icon name="arrowRight" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
