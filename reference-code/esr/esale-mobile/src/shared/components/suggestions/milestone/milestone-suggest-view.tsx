
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { TypeSelectSuggest } from '../../../../config/constants/enum';
import { translate } from '../../../../config/i18n';
import { map, cloneDeep } from 'lodash'
import { Icon } from '../../icon';
import { IMilestoneSuggestionsProps, MilestoneSuggest } from '../interface/milestone-suggest-interface';
import MilestoneSuggestStyles from './milestone-suggest-style';
import { messages } from './milestone-suggest-messages';
import SearchDetailScreen from './milestone-search-detail/search-detail-screen';
import { ISearchCondition } from './milestone-search-detail/search-detail-interface';
import { MilestoneSuggestResultSearchView } from './milestone-suggest-result-search/milestone-suggest-result-search-view';
import { MilestoneSuggestSearchModalView } from './milestone-suggest-search-modal/milestone-suggest-search-modal';
import _ from 'lodash';
import { LIMIT_VIEW_SELECTED_MILESTONE } from './milestone-constant';

/**
 * Component for searching text fields
 * @param props see IMileStoneSuggestProps
 */
export function MilestoneSuggestView(props: IMilestoneSuggestionsProps) {
  const [viewAll, setViewAll] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSelected, setDataSelected] = useState<MilestoneSuggest[]>(props.initData ? props.initData : []);
  const [isVisibleDetailSearchModal, setIsVisibleDetailSearchModal] = useState(false);
  const [conditions, setConditions] = useState<ISearchCondition[]>([]);
  const [isVisibleResultSearchModal, setIsVisibleResultSearchModal] = useState(false);
  const [reRender, SetReRender] = useState(false);
  const arrayIndex: any = [];


  useEffect(() => {
    dataSelected.length > LIMIT_VIEW_SELECTED_MILESTONE ? setViewAll(false) : setViewAll(true)
  }, [reRender])
  /**
   * add MileStone selected in popup
   *  @param item selected
   */
  const handleAddNewSuggestions = (item: MilestoneSuggest, typeSearch: number) => {
    const isExistMilestone = dataSelected.find(itemMileStone => (itemMileStone.milestoneId === item.milestoneId))
    if (typeSearch === TypeSelectSuggest.SINGLE) {
      if (!isExistMilestone) {
        dataSelected.pop();
        dataSelected.push(item);
      }
    } else {
      if (!isExistMilestone) {
        dataSelected.push(item);
      }
    }
    setDataSelected(dataSelected);
    props.updateStateElement(dataSelected)
    if (dataSelected.length > LIMIT_VIEW_SELECTED_MILESTONE) {
      setViewAll(false);
    }
  }
  /**
     * event click choose employee item in list
     * @param employee
     */
  const handleRemoveMileStoneSetting = (MileStone: MilestoneSuggest) => {
    const employeeSelected = dataSelected.filter(itemDto => itemDto.milestoneId !== MileStone.milestoneId);
    setDataSelected(employeeSelected);
    props.updateStateElement(employeeSelected);
  }

  const setMilestoneSelected = (data: MilestoneSuggest[]) => {
    switch (props.typeSearch) {
      case TypeSelectSuggest.SINGLE:
        setDataSelected(data);
        props.updateStateElement(dataSelected);
        break;
      case TypeSelectSuggest.MULTI:
        data.forEach(item => {
          if (dataSelected.findIndex(_item => item.milestoneId === _item.milestoneId) === -1) {
            arrayIndex.push(item);
          }
        })
        setDataSelected(cloneDeep(dataSelected).concat(arrayIndex));
        props.updateStateElement(dataSelected);
        break;
      default:
        break;
    }

  }

  /**
 * Render label
 */
  const renderLabel = () => {
    if (props?.invisibleLabel) {
      return null;
    } else {
      return (
        <View style={MilestoneSuggestStyles.labelName}>
          <Text style={MilestoneSuggestStyles.labelText}>
            {props.fieldLabel}
          </Text>
          {props.isRequire &&
            <View style={MilestoneSuggestStyles.labelHighlight}>
              <Text style={MilestoneSuggestStyles.labelTextHighlight}>
                {translate(messages.requireText)}
              </Text>
            </View>
          }
        </View>
      )
    }
  }

  /**
  * Close modal
  */
  const handleCloseModal = () => {
    if (isVisibleResultSearchModal) {
      setIsVisibleResultSearchModal(false);
    } else if (isVisibleDetailSearchModal) {
      setIsVisibleDetailSearchModal(false);
    } else {
      setModalVisible(false);
    }
  }

  /*
      * Render the text component in add-edit case
      */
  return (
    <View style={MilestoneSuggestStyles.stretchView}>
      <View>
        {renderLabel()}
        <TouchableOpacity
          style={props.isError && MilestoneSuggestStyles.errorContent}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text style={MilestoneSuggestStyles.labelInput}>{props.typeSearch == TypeSelectSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
            : props.fieldLabel + translate(messages.placeholderMultiChoose)}</Text>
        </TouchableOpacity>
        {!props.hiddenSelectedData &&
          map(viewAll ? dataSelected : dataSelected.slice(0, LIMIT_VIEW_SELECTED_MILESTONE), item => {
            return (
              <View style={MilestoneSuggestStyles.selectedItem}>
                <View
                  style={MilestoneSuggestStyles.suggestTouchable}>
                  <Text numberOfLines={1} style={MilestoneSuggestStyles.suggestText}>{`${item.parentCustomerName} - ${item.customerName}`}</Text>
                  <Text numberOfLines={1} style={MilestoneSuggestStyles.suggestMilestoneText}>{`${item.milestoneName} (${item.finishDate})`}</Text>
                </View>
                <TouchableOpacity
                  style={MilestoneSuggestStyles.iconCheckView}
                  onPress={() => {
                    handleRemoveMileStoneSetting(item);
                  }}>
                  <Icon style={MilestoneSuggestStyles.iconListDelete} name="delete" />
                </TouchableOpacity>
              </View>
            )
          })
        }
        {
          !props.hiddenSelectedData && !viewAll &&
          <TouchableOpacity onPress={() => setViewAll(true)}>
            <Text style={MilestoneSuggestStyles.buttonViewAll}>{`${translate(messages.labelViewMore1)}${(dataSelected.length - LIMIT_VIEW_SELECTED_MILESTONE)}${translate(messages.labelViewMore2)}`}</Text>
          </TouchableOpacity>
        }
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible || isVisibleDetailSearchModal || isVisibleResultSearchModal}
        onRequestClose={() => handleCloseModal()}
      >
        {modalVisible &&
          <View style={MilestoneSuggestStyles.modalContentStyle}>
            <MilestoneSuggestSearchModalView
              typeSearch={props.typeSearch}
              fieldLabel={props.fieldLabel}
              dataSelected={dataSelected}
              isRelation={props.isRelation}
              isCloseDetailSearchModal={isVisibleDetailSearchModal}
              selectData={handleAddNewSuggestions}
              setConditions={(cond) => setConditions(cond)}
              openDetailSearchModal={() => setIsVisibleDetailSearchModal(true)}
              closeModal={() => setModalVisible(false)}
              exportError={(error) => !_.isNil(props.exportError) && props.exportError(error)}
            />
          </View>
        }
        {isVisibleDetailSearchModal &&
          <View style={MilestoneSuggestStyles.detailSearchContent}>
            <SearchDetailScreen
              updateStateElement={(cond: ISearchCondition[]) => setConditions(cond)}
              closeDetaiSearchModal={() => setIsVisibleDetailSearchModal(false)}
              openResultSearchModal={() => setIsVisibleResultSearchModal(true)}
            />
          </View>
        }
        {isVisibleResultSearchModal &&
          <View style={MilestoneSuggestStyles.detailSearchContent}>
            <MilestoneSuggestResultSearchView
              updateStateElement={(listMilesstone: MilestoneSuggest[]) => {
                setMilestoneSelected(listMilesstone);
                setIsVisibleDetailSearchModal(false);
                //ReRender to set viewAll 1 time
                SetReRender(reRender === false)
              }}
              isRelation={props.isRelation}
              typeSearch={props.typeSearch}
              searchConditions={conditions}
              closeModal={() => {
                setModalVisible(false);
                setIsVisibleResultSearchModal(false)
              }}
              exportError={(error) => !_.isNil(props.exportError) && props.exportError(error)}
            />
          </View>
        }
      </Modal>
    </View>
  );
}
