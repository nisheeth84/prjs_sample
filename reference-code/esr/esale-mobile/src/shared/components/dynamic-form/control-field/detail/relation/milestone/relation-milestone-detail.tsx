import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MilestoneLisStyles from './milestone-suggest-style';
import { Icon } from '../../../../../icon';
import { Milestone, RelationMilestoneProps } from './milestone-type';
import { useNavigation, StackActions } from '@react-navigation/native';
import { RelationDisplay, TypeRelationSuggest, DefineFieldType, FIELD_BELONG } from '../../../../../../../config/constants/enum';
import StringUtils from '../../../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../../../config/constants/constants';
import { authorizationSelector } from '../../../../../../../modules/login/authorization/authorization-selector';
import { useSelector } from 'react-redux';
import { extensionDataSelector } from '../../../../../common-tab/common-tab-selector';
import { getMilestones } from '../../../dynamic-control-repository';
// import { extensionDataSelector } from '../../../../../../../common-tab/common-tab-selector';
// import { useSelector } from 'react-redux';

/**
 * Component for searching text fields
 * @param props see RelationMilestoneProps
 */
export function RelationMilestonDetail(props: RelationMilestoneProps) {
  const [responseListMilestone, setResponseListMilestone] = useState<Milestone[]>([]);
  const { fieldInfo,belong } = props;
  const displayTab = fieldInfo.relationData ? fieldInfo.relationData.displayTab : 0;
  const typeSuggest = fieldInfo.relationData ? fieldInfo.relationData.format : 0;
  const authorizationState = useSelector(authorizationSelector);
  const languageCode = authorizationState?.languageCode ? authorizationState?.languageCode : TEXT_EMPTY;
  const title = StringUtils.getFieldLabel(props?.fieldInfo, FIELD_LABLE, languageCode);
  const extensionData = props?.extensionData ? props?.extensionData : useSelector(extensionDataSelector);
  const [relationDataIds, setRelationDataIds] = useState<any>();
  const navigation = useNavigation();

  /**
   * Handling after first render
   */
  useEffect(() => {
    if (displayTab === RelationDisplay.LIST || typeSuggest === TypeRelationSuggest.SINGLE) {
      handleGetRelationMilestoneList();
    } else if (displayTab === RelationDisplay.TAB && typeSuggest === TypeRelationSuggest.MULTI) {
      handleGetRelationMilestoneTab();
    }
  }, []);

 /**
 * Call api get relation milestone list
 */
const handleGetRelationMilestoneList = async () => {
  const milestoneData: any = extensionData.find((item: any) => (item.key === fieldInfo.fieldName && item.fieldType === DefineFieldType.RELATION));
  const milestoneIds: number[] = JSON.parse(milestoneData.value);
  if(milestoneIds) {
    setRelationDataIds(milestoneIds);
  }
}

  /**
  * Call api get relation milestone 
  */
 const handleGetRelationMilestoneTab = async () => {
  const milestoneData: any = extensionData.find((item: any) => (item?.fieldType === DefineFieldType.RELATION));
  const milestoneIds: number[] = JSON.parse(milestoneData.value);
  const resMilestones = await getMilestones({
    searchCondition: [],
    offset: 0
  });
  if (resMilestones.data) {
    resMilestones.data = resMilestones.data.filter((item:any) => milestoneIds.includes(item.milestoneId))
    setResponseListMilestone(resMilestones.data);
  }
}
  /**
  * Detail milestone
  * @param milestoneId
  */
  const detailMilestone = (milestoneId: any) => {
    if(belong === FIELD_BELONG.MILE_STONE) {
      navigation.dispatch(
        StackActions.push('milestone-detail', { milestoneId: milestoneId })
      );
    } else {
      navigation.navigate("milestone-detail", { milestoneId: milestoneId })
    }
  };

  /**
   * reader milestone tab
   */
  const renderMilestoneTab = () => {
    return (
      <View>
        <FlatList
          data={responseListMilestone}
          keyExtractor={(item) => item.milestoneId.toString()}
          renderItem={({ item }) =>
            <View>
              <TouchableOpacity style={responseListMilestone.length > 0 ? MilestoneLisStyles.touchableSelect : MilestoneLisStyles.touchableSelectNoData}
                onPress={() => detailMilestone(item.milestoneId)}>
                <View style={MilestoneLisStyles.suggestTouchable}>
                  <Text style={MilestoneLisStyles.suggestText}>( {item.parentCustomerName} - {item.customerName} )</Text>
                  <Text style={MilestoneLisStyles.suggestTextDate}>{item.milestoneName} ({item.finishDate})</Text>
                </View>
                <View style={MilestoneLisStyles.iconCheckView}>
                  <Icon name="iconArrowRight" style={MilestoneLisStyles.iconArrowRight} />
                </View>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    );
  };

  /**
   * reader milestone list
   */
  const renderMilestoneList = () => {
    return (
      <View>
        <Text style={MilestoneLisStyles.labelHeader}>{title}</Text>
        <View style={MilestoneLisStyles.mainContainer}>
          {
            relationDataIds &&
            relationDataIds?.map((milestoneId:any, index:number) =>
              <View style={MilestoneLisStyles.employeeContainer}>
                <TouchableOpacity onPress={() => detailMilestone(milestoneId)} >
                </TouchableOpacity>
                {
                  ++index !== relationDataIds?.length && 
                  relationDataIds?.length > 1 &&
                  <Text style={MilestoneLisStyles.employeeText}>,</Text>
                }
              </View>
            )
          }
        </View>
      </View>
    );
  };

  return (
    <View>
      {
        (displayTab === RelationDisplay.TAB && typeSuggest === TypeRelationSuggest.MULTI) && renderMilestoneTab()
      }
      {
        (displayTab === RelationDisplay.LIST || typeSuggest === TypeRelationSuggest.SINGLE) && renderMilestoneList()
      }
    </View>
  );

}