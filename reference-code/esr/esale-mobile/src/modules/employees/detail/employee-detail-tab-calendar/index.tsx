import * as React from 'react';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { DetailTabBasicInformationStyles } from '../detail-style';
import { CalendarItem } from '../common/calendar-list-item';
import { calendarsSelector } from '../detail-screen-selector';

import { Calendar } from '../../../../config/mock';

/**
 * Component for show tab calendar
 */
export const CalendarTabScreen: React.FC = () => {
  const calendars = useSelector(calendarsSelector);
  return (
    <ScrollView style={DetailTabBasicInformationStyles.marginTop15}>
      {calendars.map((c: Calendar, index: number) => {
        return (
          <CalendarItem
            key={index.toString()}
            flag={c.flag}
            day={c.day}
            data={c.data}
            index={index}
          />
        );
      })}
    </ScrollView>
  );
};
