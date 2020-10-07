import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, PanResponder, Animated, ActivityIndicator, RefreshControl } from 'react-native';
import { translate } from '../../../../../config/i18n';
import { TypeSelectSuggest } from '../../../../../config/constants/enum';
import { Icon } from '../../../icon';
import { TEXT_EMPTY } from '../../../../../config/constants/constants';
import { MilestoneSuggest } from '../../interface/milestone-suggest-interface';
import MilestoneSuggestStyles from '../milestone-suggest-style';
import { messages } from '../milestone-suggest-messages';
import { getMilestoneSuggestions, saveSuggestionsChoice } from '../../repository/milestone-suggest-repositoty';
import { ISearchCondition } from '../milestone-search-detail/search-detail-interface';
import _ from 'lodash';
import { useDebounce } from '../../../../../config/utils/debounce';
import { MILESTONE_INDEX } from '../milestone-constant';

/**
 * Define MilestoneSuggestModal props
 */
export interface IMilestoneSuggestModalViewProps {
  typeSearch: number,
  fieldLabel: string,
  dataSelected: MilestoneSuggest[],
  isRelation?: boolean,
  isCloseDetailSearchModal: boolean,
  setConditions: (cond: ISearchCondition[]) => void;
  selectData: (Milestone: MilestoneSuggest, typeSearch: number) => void,
  closeModal: () => void,
  openDetailSearchModal: () => void
  exportError: (err: any) => void;
}


const LIMIT = 10;

/**
 * Component search Milestone suggestion
 * @param props IMilestoneSuggestModalViewProps
 */
export function MilestoneSuggestSearchModalView(props: IMilestoneSuggestModalViewProps) {
  const [searchValue, setSearchValue] = useState(TEXT_EMPTY);
  const [isShowSuggestion, setShowSuggestion] = useState(false);
  const [errorMessage, setErrorMessage] = useState(TEXT_EMPTY);
  const [responseApiMilestone, setResponseApiMilestone] = useState<any[]>([]);
  const pan = useRef(new Animated.ValueXY()).current;
  const debounceSearch = useDebounce(searchValue, 500);
  const [isNoData] = useState(false);
  const [offset, setOffset] = useState(0);
  const [y, setY] = useState(0);
  const [footerIndicator, setFooterIndicator] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_event, gestureState) => {
        setY(gestureState.dy);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      }
    })
  ).current;

  /**
    * Change value search
    */
  useEffect(() => {
    if (debounceSearch) {
      handleSearch(searchValue, 0);
    } else {
      handleSearch(TEXT_EMPTY, 0);
    }
  }, [debounceSearch]);

  /**
   * handle text input to show suggestion
   * @param text text from input
   */
  const handleSearch = async (text: string, _offset: number) => {
    setSearchValue(text);
    setOffset(_offset);
    setShowSuggestion(true);
    setErrorMessage(TEXT_EMPTY);
    getDataFromAPI(_offset)
  }

  /**
   * get data by API depends on input from Search-Detail-Screen
   * @param offset 
   */
  const getDataFromAPI = async (
    //searchValue: string, 
    _offset: number
    ) => {
    const res = await getMilestoneSuggestions({
      // searchValue: "searchValue",
      // limit: LIMIT_RESULT_SEARCH,
      // offset: _offset,
      // listIdChoice: props.dataSelected.map(milestone => milestone.milestoneId)
      searchValue: searchValue,
      listIdChoice: [],
      limit: 10,
      offset: 0
    });

    if (res.status === 200) {
      if (res.data) {
        setResponseApiMilestone(res.data.milestoneData);
      } else {
        setResponseApiMilestone([]);
      }
    } else {
      setErrorMessage(translate(messages.errorCallAPI));
      setShowSuggestion(false);
      setResponseApiMilestone([])
    }
  }


  /**
   * event click choose Milestone item in lits
   * @param Milestone Milestone
   */
  const handleClickMilestoneItem = (Milestone: MilestoneSuggest) => {
    props.selectData(Milestone, props.typeSearch);
    if (!props.isRelation) {
      handleSaveSuggestionsChoice(Milestone);
    }
  }

  /**
   * save suggestions choice
   * @param itemSelected 
   */
  const handleSaveSuggestionsChoice = (selected: MilestoneSuggest) => {
    saveSuggestionsChoice({
      sugggestionsChoice: [
        {
          index: MILESTONE_INDEX,
          idResult: selected.milestoneId
        }
      ]
    });
  }

  /**
   * Get modal flex
   */
  const getFlexNumber = () => {
    if (responseApiMilestone?.length === 0) {
      return 1;
    } else if (y < 0) {
      return 10;
    } else {
      return 2;
    }
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

  return (
    <View style={MilestoneSuggestStyles.modalContainer}>
      <Animated.View
        style={{ flex: responseApiMilestone?.length > 0 ? 1 : 4, justifyContent: 'flex-end' }}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={MilestoneSuggestStyles.modalTouchable}
          onPress={() => props.closeModal()}
        >
          <View>
            <Icon style={MilestoneSuggestStyles.modalIcon} name="iconModal" />
          </View>
        </TouchableOpacity>
      </Animated.View>
      <View style={[MilestoneSuggestStyles.colorStyle, { flex: getFlexNumber() }]}>
        <View style={MilestoneSuggestStyles.inputContainer}>
          <View style={MilestoneSuggestStyles.inputContent}>
            <TextInput style={MilestoneSuggestStyles.inputSearchTextData} placeholder=
              {props.typeSearch == TypeSelectSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
                : props.fieldLabel + translate(messages.placeholderMultiChoose)}
              value={searchValue}
              onChangeText={(text) => setSearchValue(text)}
            />
            <View style={MilestoneSuggestStyles.textSearchContainer}>
              <TouchableOpacity
                onPress={() => {
                  props.closeModal();
                  props.openDetailSearchModal();
                }}
              >
                <Icon name="searchOption" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={MilestoneSuggestStyles.cancel}
            onPress={() => {
              if (!_.isEmpty(searchValue)) {
                setRefreshData(true);
              }
              setSearchValue(TEXT_EMPTY);
            }}
          >
            <Text style={MilestoneSuggestStyles.cancelText}>{translate(messages.cancelText)}</Text>
          </TouchableOpacity>
        </View>

        <View style={MilestoneSuggestStyles.dividerContainer} />
        {
          errorMessage !== TEXT_EMPTY && (
            <Text style={MilestoneSuggestStyles.errorMessage}>{errorMessage}</Text>
          )
        }
        {isShowSuggestion &&
          <View style={[responseApiMilestone?.length > 0 ? MilestoneSuggestStyles.suggestionContainer : MilestoneSuggestStyles.suggestionContainerNoData]}>
            <FlatList
              data={responseApiMilestone}
              keyExtractor={item => item.milestoneId.toString()}
              onEndReached={() => {
                if (!isNoData) {
                  setFooterIndicator(true);
                  handleSearch(searchValue, offset + LIMIT);
                }
              }}
              onEndReachedThreshold={responseApiMilestone?.length > 5 ? 0.0000001 : 1}
              ListFooterComponent={renderActivityIndicator(footerIndicator)}
              ItemSeparatorComponent={renderItemSeparator}
              refreshControl={
                <RefreshControl
                  refreshing={refreshData}
                  onRefresh={() => {
                    setFooterIndicator(true);
                    setRefreshData(true);
                    // handleSearch(searchValue, 0);
                    setTimeout(() => {
                      setRefreshData(false);
                    }, 3000);
                  }}
                />
              }
              renderItem={({ item }) =>
                <View>
                  <TouchableOpacity style={responseApiMilestone?.length > 0 ? MilestoneSuggestStyles.touchableSelect : MilestoneSuggestStyles.touchableSelectNoData}
                    onPress={() => {
                      handleClickMilestoneItem(item);
                      props.closeModal();
                    }}>
                    <View style={MilestoneSuggestStyles.suggestTouchable}>
                      <Text numberOfLines={1} style={MilestoneSuggestStyles.suggestText}>{`${item.parentCustomerName} - ${item.customerName}`}</Text>
                      <Text numberOfLines={1} style={MilestoneSuggestStyles.suggestMilestoneText}>{`${item.milestoneName} (${item.finishDate})`}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        }
      </View>
      <TouchableOpacity onPress={() => alert('Open add Milestone screen')} style={MilestoneSuggestStyles.fab}>
        <Text style={MilestoneSuggestStyles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  )
}