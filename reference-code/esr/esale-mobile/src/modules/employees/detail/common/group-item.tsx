import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Icon } from '../../../../shared/components/icon';
import { messages } from '../detail-messages';
import { translate } from '../../../../config/i18n';
import {
  DetailTabBasicInformationStyles,
  GroupItemStyles,
} from '../detail-style';
import { DetailScreenActions, Employee } from '../detail-screen-reducer';

// import { employeeIdSelector } from '../detail-screen-selector';
// import {
//   QUERY_ADD_FAVORITE_TIMELINE_GROUP,
//   QUERY_REGISTER_GROUP,
// } from '../../../../config/constants/query';
// import {
//   addFavoriteTimelineGroup,
//   registerGroup,
// } from '../../employees-repository';

interface GroupProps {
  name: string;
  flagStar: boolean;
  title: string;
  createDate: string;
  bgc: string;
  listMember: Array<Employee>;
  isJoin: boolean;
  indexNumber: number;
}

/**
 * Component for group item for detail employee screen
 * @param name
 * @param flagStar
 * @param title
 * @param createDate
 * @param bgc
 * @param listMember
 * @param isJoin
 * @param indexNumber
 */
export const GroupItem: React.FC<GroupProps> = ({
  name,
  flagStar,
  title,
  createDate,
  bgc,
  listMember,
  isJoin,
  indexNumber,
}) => {
  const dispatch = useDispatch();

  /**
   * Change status when touch in star
   */
  const changeStarStatus = (index: number) => {
    dispatch(DetailScreenActions.changeStatusStar({ position: index }));
  };

  // get employeeId from redux
  // const employeeId = useSelector(employeeIdSelector);

  // call api add favorite group
  // const addFavorite = async () => {
  //   const response = await addFavoriteTimelineGroup(
  //     QUERY_ADD_FAVORITE_TIMELINE_GROUP(1, employeeId),
  //     {}
  //   );
  // };

  // call api delete favorite group
  // const deleteFavorite = async () => {
  //   const response = await addFavoriteTimelineGroup(
  //     QUERY_DELETE_FAVORITE_TIMELINE_GROUP(1, employeeId),
  //     {}
  //   );
  // };

  // call api register group
  // const registerGroup = async () => {
  //   const response = await registerGroup(QUERY_REGISTER_GROUP(15), {});
  // };

  return (
    <View>
      <View style={[GroupItemStyles.groupNameBlock, { backgroundColor: bgc }]}>
        <Text style={GroupItemStyles.groupNameText}>{name}</Text>
        <TouchableOpacity
          style={GroupItemStyles.star}
          onPress={() => changeStarStatus(indexNumber)}
        >
          <Icon name={flagStar ? 'yellowStar' : 'grayStar'} />
        </TouchableOpacity>
      </View>
      <View style={GroupItemStyles.groupItemBlock}>
        <View style={GroupItemStyles.postDate}>
          <TouchableOpacity onPress={() => {}}>
            <Text style={DetailTabBasicInformationStyles.title}>{title}</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row' }}>
            <Text style={DetailTabBasicInformationStyles.inforValue}>
              {translate(messages.posted)}
            </Text>
            <Text style={DetailTabBasicInformationStyles.inforValue}>
              {createDate}
            </Text>
          </View>
        </View>
        <View style={GroupItemStyles.imageList}>
          {listMember.map((mem: Employee, index: number) => {
            const uri = mem.linkAvatar;
            if (index < 2) {
              return (
                <Image
                  key={index.toString()}
                  source={uri}
                  style={{ marginRight: 7 }}
                />
              );
            }
            return <Text key={index.toString()} />;
          })}
          {listMember.length - 3 > 0 && (
            <View style={GroupItemStyles.numOfMember}>
              <View style={GroupItemStyles.flexRow}>
                <Text style={GroupItemStyles.textWhite}>+</Text>
                <Text style={GroupItemStyles.textWhite}>
                  {listMember.length - 3}
                </Text>
              </View>
            </View>
          )}
        </View>
        {isJoin ? (
          <TouchableOpacity style={GroupItemStyles.joinButton}>
            <Text style={GroupItemStyles.textAlignCenter}>
              {translate(messages.participate)}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={GroupItemStyles.notJoinButton}>
            <Text style={GroupItemStyles.textAlignCenter}>
              {translate(messages.participating)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
