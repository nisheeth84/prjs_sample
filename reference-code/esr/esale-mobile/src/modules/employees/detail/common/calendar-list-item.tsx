import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Icon } from '../../../../shared/components/icon';
import { DetailTabBasicInformationStyles } from '../detail-style';
import { DetailScreenActions } from '../detail-screen-reducer';

interface Job {
  name: string;
  time: string;
}

interface CalendarItemProps {
  flag: boolean;
  day: string;
  data: Array<Job>;
  index: number;
}

/**
 * Component for calendar item for detail employee screen
 * @param flag
 * @param day
 * @param data
 * @param index
 */
export const CalendarItem: React.FC<CalendarItemProps> = React.memo(
  ({ flag, day, data, index }) => {
    const dispatch = useDispatch();

    /**
     * Tracking dropdown action
     */
    const handleDropDown = (index: number) => {
      dispatch(DetailScreenActions.changeStatusDropdown({ position: index }));
    };

    return (
      <View>
        <TouchableOpacity
          style={[
            DetailTabBasicInformationStyles.inforComponent,
            DetailTabBasicInformationStyles.inforTitle,
            DetailTabBasicInformationStyles.calendarBlock,
          ]}
          onPress={() => handleDropDown(index)}
        >
          <Text style={DetailTabBasicInformationStyles.title}>{day}</Text>
          <TouchableOpacity
            style={DetailTabBasicInformationStyles.iconArrowRight}
          >
            <Icon name={!flag ? 'arrowDown' : 'arrowUp'} />
          </TouchableOpacity>
        </TouchableOpacity>
        {flag && (
          <View style={DetailTabBasicInformationStyles.jobContent}>
            {data.map((item: Job, position: number) => {
              return (
                <View
                  style={[
                    DetailTabBasicInformationStyles.inforTitle,
                    DetailTabBasicInformationStyles.jobBlock,
                  ]}
                  key={position.toString()}
                >
                  <View>
                    <Icon name="human" />
                  </View>
                  <View>
                    <Text style={DetailTabBasicInformationStyles.title}>
                      {item.name}
                    </Text>
                    <Text>{item.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  }
);
