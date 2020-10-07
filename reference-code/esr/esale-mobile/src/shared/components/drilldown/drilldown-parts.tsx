import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from '../icon';
import { DrilldownStyles } from './drilldown-styles';

export interface PartsItem {
  title: string;
}

export interface DrilldownPartsProps {
  title: string;
  titleBack: string;
  data: string[] | null;
  positionDrilldown: number;
  onChangePosition: (index: number) => void;
}

/**
 * Drilldown part common component
 * @param title
 * @param titleBack
 * @param data
 * @param positionDrilldown
 * @function onChangePosition
 */
export const DrilldownParts: React.FunctionComponent<DrilldownPartsProps> = ({
  title,
  titleBack,
  data,
  positionDrilldown,
  onChangePosition,
}) => {
  const onDrilldownUp = () => {
    onChangePosition(positionDrilldown + 1);
  };
  const onDrilldownDown = () => {
    onChangePosition(positionDrilldown - 1);
  };
  return (
    <View style={DrilldownStyles.container}>
      {title && (
        <View style={DrilldownStyles.wrapTitle}>
          <Text>{title}</Text>
        </View>
      )}
      {titleBack && (
        <TouchableOpacity
          style={DrilldownStyles.formBack}
          onPress={onDrilldownDown}
        >
          <Icon name="arrowBack" style={DrilldownStyles.iconBack} />
          <Text>{titleBack}</Text>
        </TouchableOpacity>
      )}
      {data &&
        data.map((item, index: number) => (
          <TouchableOpacity
            key={index.toString()}
            style={DrilldownStyles.wrapItem}
            onPress={onDrilldownUp}
          >
            <Text style={DrilldownStyles.itemTitle}>{item}</Text>
            <Icon name="arrowRight" />
          </TouchableOpacity>
        ))}
    </View>
  );
};
