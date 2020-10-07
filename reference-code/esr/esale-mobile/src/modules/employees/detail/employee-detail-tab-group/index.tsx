import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { GroupItem } from '../common/group-item';
import { groupSelector } from '../detail-screen-selector';
import { DetailTabBasicInformationStyles } from '../detail-style';
import { Group } from '../../../../config/mock';

/**
 * Component for detail screen group tab
 */
export const GroupTabScreen: React.FC = () => {
  const groups = useSelector(groupSelector);
  return (
    <ScrollView
      style={[
        DetailTabBasicInformationStyles.marginTop15,
        DetailTabBasicInformationStyles.bgcGray,
      ]}
    >
      <View style={DetailTabBasicInformationStyles.groupContent}>
        {groups.map((group: Group, index: number) => {
          return (
            <GroupItem
              key={index.toString()}
              name={group.name}
              flagStar={group.flagStar}
              title={group.title}
              createDate={group.createDate}
              bgc={group.bgc}
              listMember={group.listMember}
              isJoin={group.isJoin}
              indexNumber={index}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};
