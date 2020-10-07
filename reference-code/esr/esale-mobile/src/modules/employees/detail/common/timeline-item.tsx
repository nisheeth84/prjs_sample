import React from 'react';
import { Image, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { TimelineStyles } from '../detail-style';

const defaultCircleSize = 16;
const defaultCircleColor = '#007AFF';
const defaultLineWidth = 2;
const defaultLineColor = '#007AFF';

interface TimelineProps {
  renderDetail?: any;
  renderCircle?: any;
  data: any;
  rowContainerStyle?: any;
  isAllowFontScaling?: any;
  lineWidth: any;
  renderFullLine?: any;
  lineColor?: any;
  descriptionStyle?: any;
  eventContainerStyle?: any;
  onEventPress?: any;
  detailContainerStyle?: any;
  eventDetailStyle?: any;
  titleStyle?: any;
  circleSize?: any;
  circleColor?: any;
  dotSize?: any;
  style?: any;
  listViewStyle?: any;
}

/**
 * Component for timeline item for detail employee screen
 * @param data
 * @param rowContainer
 * @param isAllowFontScaling
 * @param lineWidth
 * @param renderFullLine
 * @param descriptionStyle
 * @param onEventPress
 * @param detailContainerStyle
 * @param eventDetailStyle
 * @param titleStyle
 * @param circleSize
 * @param dotSize
 * @param style
 * @param listViewStyle
 */
export const Timeline: React.FC<TimelineProps> = ({
  data,
  rowContainerStyle,
  isAllowFontScaling,
  lineWidth,
  renderFullLine,
  descriptionStyle,
  onEventPress,
  detailContainerStyle,
  eventDetailStyle,
  titleStyle,
  circleSize,
  dotSize,
  style,
  listViewStyle,
}) => {
  /**
   * Catch render detail form in event data
   */
  const renderDetail = (rowData: any) => {
    let description;
    if (typeof rowData.actionName === 'string') {
      description = (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 15,
            }}
          >
            <Image source={rowData.createdUserImage} />
            <Text style={TimelineStyles.marginHorizontal10}>
              {rowData.createdUserName}
            </Text>
          </View>
          <View style={TimelineStyles.paddingleft15}>
            <Text
              style={[
                TimelineStyles.actionName,
                descriptionStyle,
                rowData.descriptionStyle,
              ]}
              allowFontScaling={isAllowFontScaling}
            >
              {rowData.actionName}
            </Text>
            {rowData.actionDescription.map((data: any, index: number) => {
              return (
                <View
                  key={index.toString()}
                  style={TimelineStyles.actionDesBlock}
                >
                  <Text
                    style={[
                      TimelineStyles.actionDes,
                      descriptionStyle,
                      rowData.descriptionStyle,
                    ]}
                    allowFontScaling={isAllowFontScaling}
                  >
                    {data.name}
                  </Text>
                  {data.content && (
                    <Text
                      style={[
                        TimelineStyles.actionSubDes,
                        TimelineStyles.actionDes,
                        descriptionStyle,
                        rowData.descriptionStyle,
                      ]}
                      allowFontScaling={isAllowFontScaling}
                    >
                      {data.content}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      );
    } else if (typeof rowData.description === 'object') {
      description = rowData.description;
    }

    return (
      <View style={TimelineStyles.container}>
        <Text
          style={[TimelineStyles.title, titleStyle, rowData.titleStyle]}
          allowFontScaling={isAllowFontScaling}
        >
          {rowData.createdDate}
        </Text>
        {description}
      </View>
    );
  };

  /**
   * Catch render each event following by data input
   * @param rowData
   */
  const renderEvent = (rowData: any) => {
    // Check event is lastest
    const isLast = renderFullLine
      ? !renderFullLine
      : data.slice(-1)[0] === rowData;
    // Change color for last event
    const lineColor = isLast
      ? 'rgba(0,0,0,0)'
      : rowData.lineColor
        ? rowData.lineColor
        : '#E5E5E5';
    const opStyle = {
      borderColor: lineColor,
      borderLeftWidth: lineWidth,
      borderRightWidth: 0,
      paddingLeft: 30,
    };

    return (
      <View style={[TimelineStyles.details, opStyle]}>
        <TouchableOpacity
          disabled={onEventPress == null}
          style={[detailContainerStyle]}
          onPress={() => (onEventPress ? onEventPress(rowData) : null)}
        >
          <View style={[TimelineStyles.detail, eventDetailStyle]}>
            {renderDetail(rowData)}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * Catch render dot (circle) timeline for each event
   * @param rowData
   */
  const renderCircle = (rowData: any) => {
    const circleSizes = rowData.circleSize
      ? rowData.circleSize
      : circleSize
        ? circleSize
        : defaultCircleSize;

    const circleStyle = {
      top: 2,
      left: 13,
    };

    const dotSizes = dotSize ? dotSize : circleSizes / 2;
    const dotStyle = {
      height: dotSizes,
      width: dotSizes,
    };
    const innerCircle = <View style={[TimelineStyles.dot, dotStyle]} />;
    return (
      <View style={[TimelineStyles.circle, circleStyle, circleStyle]}>
        {innerCircle}
      </View>
    );
  };

  /**
   * Catch render each item from form data
   * @param param0
   */
  const renderItem = ({ item, index }: any) => {
    const content = (
      <View style={[TimelineStyles.rowContainer, rowContainerStyle]}>
        {renderEvent(item)}
        {renderCircle(item)}
      </View>
    );
    return <View key={index.toString()}>{content}</View>;
  };

  return (
    <ScrollView style={[TimelineStyles.container, style]}>
      <View style={[TimelineStyles.listview, listViewStyle]}>
        {data.map((item: any, index: number) => {
          return renderItem({ item, index });
        })}
      </View>
    </ScrollView>
  );
};

/**
 * set default value for props
 */
Timeline.defaultProps = {
  circleSize: defaultCircleSize,
  circleColor: defaultCircleColor,
  lineWidth: defaultLineWidth,
  lineColor: defaultLineColor,
  isAllowFontScaling: true,
};
