import React, { useState, useEffect, } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import MilestoneSuggestResultSearchStyle from './milestone-suggest-result-search-style';
import { TypeSelectSuggest } from '../../../../../config/constants/enum';
import { TEXT_EMPTY, LIMIT } from '../../../../../config/constants/constants';
import { translate } from '../../../../../config/i18n';
import {
  map, isNil, cloneDeep,
} from 'lodash';
import { Icon } from '../../../icon';
import { responseMessages } from '../../../../messages/response-messages';
import { IResultSearchProps, MilestoneSuggest } from '../../interface/milestone-suggest-interface';
import { AppbarStyles } from '../milestone-search-detail/search-detail-style';
import { messages } from '../milestone-suggest-messages';
import { saveSuggestionsChoice, getMilestones } from '../../repository/milestone-suggest-repositoty';
import { MILESTONE_INDEX, MILESTONE_LABEL, LIMIT_DETAIL_RESULT_SEARCH } from '../milestone-constant';


/**
 * Result Search View
 * @param props 
 */
export function MilestoneSuggestResultSearchView(props: IResultSearchProps) {
  const [statusSelectedItem, setStatusSelectedItem] = useState(new Map());
  const [stateMilestoneBefore, setStateMilestoneBefore] = useState(TEXT_EMPTY);
  const [dataSelected, setDataSelected] = useState<MilestoneSuggest[]>([]);
  const [viewDataSelect, setViewDataSelect] = useState<MilestoneSuggest[]>([]);
  const [offset, setOffset] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [footerIndicator, setFooterIndicator] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [loadMoreFlag] = useState(false);
  /**
   * get data by API depends on input from Search-Detail-Screen
   * @param offset 
   */
  const getDataFromAPI = async (_offset: number) => {
    const res = await getMilestones({
      searchConditions: [],
      limit: LIMIT,
      offset: offset
    })
    if (!isNil(res.data.dataInfo)) {
      setViewDataSelect(cloneDeep(viewDataSelect).concat(res.data.dataInfo.products));
      setTotalRecords(res.data.totalCount);
    }
  }



  /**
   * Loadmore data everytime offset is changed
   */
  useEffect(() => {
    getDataFromAPI(offset);
  }, [offset]
  )

  /** 
   * set map state check view checkbox
   * @param Milestone 
   */
  const handleViewCheckbox = (Milestone: MilestoneSuggest) => {
    const newStateCheck = new Map(statusSelectedItem);
    let keyMap = `${Milestone.milestoneId}`;
    newStateCheck.set(keyMap, !statusSelectedItem.get(keyMap));

    if (TypeSelectSuggest.SINGLE == props.typeSearch) {
      if (stateMilestoneBefore.length > 0) {
        newStateCheck.set(stateMilestoneBefore, !statusSelectedItem.get(stateMilestoneBefore));
      }
    }
    if (keyMap === stateMilestoneBefore) {
      setStateMilestoneBefore(TEXT_EMPTY);
    } else {
      setStateMilestoneBefore(keyMap);
    }
    setStatusSelectedItem(newStateCheck);
  }
  /**
   * handle add Milestone to list
   * @param milestone 
   * @param typeSearch 
   */
  const handleMilestoneSelected = (milestone: MilestoneSuggest, typeSearch: number) => {
    const isExistMilestone = dataSelected.filter(item => (item.milestoneId === milestone.milestoneId));
    if (typeSearch === TypeSelectSuggest.SINGLE) {
      dataSelected.pop();
      if (isExistMilestone?.length <= 0) {
        dataSelected.push(milestone);
      }
      setDataSelected(dataSelected);
    } else {
      if (isExistMilestone?.length > 0) {
        let listDataSelected = dataSelected.filter(item => (item.milestoneId !== milestone.milestoneId))
        setDataSelected(listDataSelected);
      } else {
        dataSelected.push(milestone);
        setDataSelected(dataSelected);
      }
    }
  }
  /**
   * call API saveMilestoneSuggestionsChoice
   * @param dataSelected
   */
  const callsaveMilestoneSuggestionsChoiceAPI = (dataSelected: MilestoneSuggest[]) => {
    saveSuggestionsChoice({
      sugggestionsChoice: map(dataSelected, item => {
        return {
          index: MILESTONE_INDEX,
          idResult: item.milestoneId
        }
      })
    })
  }

  /**
   * Render ActivityIndicator
   * @param animating 
   */
  const renderActivityIndicator = (animating: boolean) => {
    if (!animating) return null;
    return (
      <ActivityIndicator style={{ padding: 5 }} animating={animating} size="small" />
    )
  }

  /**
   * Render separator flatlist
   */
  const renderItemSeparator = () => {
    return (
      <View
        style={{ height: 1, backgroundColor: '#E5E5E5' }}
      />
    )
  }

  /**
   * handle click Milestone in list
   * @param Milestone
   */
  const handleClickMilestoneItem = (Milestone: MilestoneSuggest) => {
    handleViewCheckbox(Milestone);
    handleMilestoneSelected(Milestone, props.typeSearch);
  }

  /**
   * back to Result Selected Screen
   */
  const applyPress = () => {
    props.updateStateElement(dataSelected);
    props.closeModal();
    if (!props.isRelation) {
      callsaveMilestoneSuggestionsChoiceAPI(dataSelected);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={[AppbarStyles.barContainer, AppbarStyles.block]}>
        <TouchableOpacity
          style={AppbarStyles.iconButton}
          onPress={props.closeModal}
        >
          <Icon name="close" />
        </TouchableOpacity>
        <View style={AppbarStyles.titleWrapper}>
          <Text style={AppbarStyles.title}>{translate(messages.functionText)}</Text>
        </View>
        <TouchableOpacity
          style={dataSelected.length > 0
            ? AppbarStyles.applyButton
            : [AppbarStyles.applyButton, AppbarStyles.disableButton]}
          disabled={dataSelected.length === 0}
          onPress={applyPress}
        >
          <Text style={AppbarStyles.applyText}>{translate(messages.choiceText)}</Text>
        </TouchableOpacity>
      </View>
      <Text style={MilestoneSuggestResultSearchStyle.SumLabelStyle}>
        {translate(messages.totalRecordStartText).concat(totalRecords.toString()).concat(translate(messages.totalRecordEndText))}
      </Text>
      <View style={MilestoneSuggestResultSearchStyle.Underline}></View>
      <View style={{ flex: 1 }}>
        {
          dataSelected.length > 0 ? (
            <FlatList
              onEndReachedThreshold={dataSelected.length > 7 ? 0.0001 : 1}
              onEndReached={() => {
                if (loadMoreFlag) {
                  setOffset(offset + LIMIT_DETAIL_RESULT_SEARCH);
                  setFooterIndicator(true);
                }

              }}
              data={dataSelected}
              keyExtractor={item => item.milestoneId.toString()}
              ListFooterComponent={renderActivityIndicator(footerIndicator)}
              ItemSeparatorComponent={renderItemSeparator}
              refreshControl={
                <RefreshControl
                  refreshing={refreshData}
                  onRefresh={() => {
                    setRefreshData(true);
                    getDataFromAPI(0);
                    setRefreshData(false);
                  }}
                />
              }
              renderItem={({ item }) => <View>
                <TouchableOpacity
                  onPress={() => {
                    handleClickMilestoneItem(item);
                  }}
                  style={MilestoneSuggestResultSearchStyle.dataModalStyle}>
                  <View style={MilestoneSuggestResultSearchStyle.dataSelectedStyle}>
                    <Text numberOfLines={1} style={MilestoneSuggestResultSearchStyle.suggestText}>{`${item.parentCustomerName} - ${item.customerName}`}</Text>
                    <Text numberOfLines={1} style={MilestoneSuggestResultSearchStyle.suggestMilestoneText}>{`${item.milestoneName} (${item.finishDate})`}</Text>
                  </View>
                  <View style={MilestoneSuggestResultSearchStyle.iconCheckView}>
                    {
                      statusSelectedItem.get(`${item.milestoneId}`) ?
                        <Icon style={MilestoneSuggestResultSearchStyle.iconCheck} name='selected' /> : < Icon style={MilestoneSuggestResultSearchStyle.iconCheck} name='unchecked' />
                    }
                  </View>
                </TouchableOpacity>
              </View>
              }
            />
          ) : <View style={{ marginTop: 10, alignItems: 'center' }}><Text>{translate(responseMessages.ERR_COM_0019).replace('{0}', MILESTONE_LABEL)}</Text></View>
        }
      </View>
    </View >
  );
}

// const DUMMY_DATA: MilestoneSuggest[] = [
//   {
//     milestoneId: 12323,// data mapping response
//     milestoneName: "milestoneName#1",// data mapping response
//     parentCustomerName: "parentCustomerName#1",// data mapping response
//     customerName: "customerName#1",// data mapping response
//     productName: "productName#1", // data mapping response
//     finishDate: "07/13/2020" // data mapping response
//   },
//   {
//     milestoneId: 2,// data mapping response
//     milestoneName: "milestoneName#2",// data mapping response
//     parentCustomerName: "parentCustomerName#2",// data mapping response
//     customerName: "customerName#2",// data mapping response
//     productName: "productName#2", // data mapping response
//     finishDate: "07/23/2020" // data mapping response
//   },
//   {
//     milestoneId: 3,// data mapping response
//     milestoneName: "milestoneName#3",// data mapping response
//     parentCustomerName: "parentCustomerName#3",// data mapping response
//     customerName: "customerName#3",// data mapping response
//     productName: "productName#3", // data mapping response
//     finishDate: "07/33/3030" // data mapping response
//   },
//   {
//     milestoneId: 34,// data mapping response
//     milestoneName: "milestoneName#454",// data mapping response
//     parentCustomerName: "parentCustomerName#345",// data mapping response
//     customerName: "customerName#3654",// data mapping response
//     productName: "productName#3654", // data mapping response
//     finishDate: "07/33/30320" // data mapping response
//   },
//   {
//     milestoneId: 4,// data mapping response
//     milestoneName: "milestoneName#4",// data mapping response
//     parentCustomerName: "parentCustomerName#4",// data mapping response
//     customerName: "customerName#4",// data mapping response
//     productName: "productName#4", // data mapping response
//     finishDate: "07/44/4040" // data mapping response
//   },
//   {
//     milestoneId: 5,// data mapping response
//     milestoneName: "milestoneName#5",// data mapping response
//     parentCustomerName: "parentCustomerName#5",// data mapping response
//     customerName: "customerName#5",// data mapping response
//     productName: "productName#5", // data mapping response
//     finishDate: "07/55/5050" // data mapping response
//   },
//   {
//     milestoneId: 6,// data mapping response
//     milestoneName: "milestoneName#6",// data mapping response
//     parentCustomerName: "parentCustomerName#6",// data mapping response
//     customerName: "customerName#6",// data mapping response
//     productName: "productName#6", // data mapping response
//     finishDate: "07/66/6060" // data mapping response
//   },
//   {
//     milestoneId: 7,// data mapping response
//     milestoneName: "milestoneName#7",// data mapping response
//     parentCustomerName: "parentCustomerName#7",// data mapping response
//     customerName: "customerName#7",// data mapping response
//     productName: "productName#7", // data mapping response
//     finishDate: "07/77/7070" // data mapping response
//   },
// ]