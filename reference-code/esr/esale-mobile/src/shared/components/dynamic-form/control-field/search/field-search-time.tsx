import DateTimePicker from '@react-native-community/datetimepicker';
import momment from 'moment';
import React, { useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { ChooseTimeSearch, DefineFieldType, PlatformOS, SearchType } from '../../../../../config/constants/enum';
import { FIELD_LABLE, TEXT_EMPTY, TIME_FORMAT } from '../../../../../config/constants/constants';
import { fieldSearchMessages, messages } from './field-search-messages';
import { FieldSearchTimeStyles } from './field-search-styles';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import {
  Image,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { translate } from '../../../../../config/i18n';

type IFieldSearchTimeProps = IDynamicFieldProps;

/**
 * Component for searching time fields
 * @param props see IDynamicFieldProps
 */
export function FieldSearchTime(props: IFieldSearchTimeProps) {
  const { fieldInfo, languageCode } = props;
  const selectedIcon = require("../../../../../../assets/icons/selected.png")
  const modalIcon = require("../../../../../../assets/icons/icon_modal.png");
  const [isSearchBlank, setIsSearchBlank] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(true);
  const [selectTimepiker, setSelectTimepiker] = useState(-1);
  const [date, setDate] = useState(new Date());
  const [viewTimeFrom, setViewTimeFrom] = useState(TEXT_EMPTY);
  const [viewTimeTo, setViewTimeTo] = useState(TEXT_EMPTY);
  const [saveValueSetting, setSaveValueSetting] = useState(TEXT_EMPTY);
  const [showTime, setShowTime] = useState(false);
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const DEFAULT_TIME_FROM = '00:00';
  const DEFAULT_TIME_TO = '23:59';
  /**
   * Event click checked option blank
   */
  const handlerClickSearchBlank = () => {
    setIsSearchBlank(true);
    setShowTime(false);
    if (!selectedOption) {
      setSelectedOption(true);
    }
  }

  /**
   * Event click checked option search by condition time 
   */
  const handlerClickSearchByTime = () => {
    setIsSearchBlank(false);
    setShowTime(false)
    if (!selectedOption) {
      setSelectedOption(true);
    }
  }

  /**
   * Set view time when change 
   */
  const onChangeTime = (_event: any, selectedTime: any) => {
    setShowTime(Platform.OS === PlatformOS.IOS);
    const currentTime = selectedTime;
    if (selectedTime) {
      setDate(currentTime);
      if (selectTimepiker === ChooseTimeSearch.TIME_FROM) {
        setViewTimeFrom(momment(currentTime).format(TIME_FORMAT));
      } else {
        setViewTimeTo(momment(currentTime).format(TIME_FORMAT));
      }
    }
  };

  /**
   * Event click to show timepicker
   * @param selectPicker 
   */
  const handlerClickTimePicker = (selectPicker: number) => {
    let currentDate = new Date();
    let chosenTime: any[] = [];
    setSelectTimepiker(selectPicker);
    setShowTime(true)
    if (selectPicker === ChooseTimeSearch.TIME_FROM
      && viewTimeFrom.length > 0) {
      chosenTime = viewTimeFrom.toString().split(':');
    } else if (selectPicker === ChooseTimeSearch.TIME_TO
      && viewTimeTo.length > 0) {
      chosenTime = viewTimeTo.toString().split(':');
    }
    if (chosenTime.length == 2) {
      currentDate.setHours(parseInt(chosenTime[0].toString()))
      currentDate.setMinutes(parseInt(chosenTime[1].toString()))
    }
    setDate(currentDate);
  };

  /**
   * Resolve when click button confirm
   */
  const confirmSearch = () => {
    setModalVisible(false)
    if (props.updateStateElement && !props.isDisabled) {
      const conditions: any = {};
      conditions['fieldId'] = fieldInfo.fieldId;
      conditions['fieldType'] = DefineFieldType.TIME;
      conditions['isDefault'] = fieldInfo.isDefault ? fieldInfo.isDefault : false;
      conditions['fieldName'] = fieldInfo.fieldName;
      conditions['fieldValue'] = [];
      conditions['savedFieldValue'] = [];
      conditions['searchType'] = SearchType.LIKE;
      if (viewTimeFrom?.length > 0 || viewTimeTo?.length > 0) {
        conditions['savedFieldValue'].push({ from: viewTimeFrom, to: viewTimeTo });
      }
      const searchFrom = viewTimeFrom && viewTimeFrom.length && `${viewTimeFrom}:00`;
      const searchTo = viewTimeTo && viewTimeTo.length && `${viewTimeTo}:00`;
      if ((searchFrom && searchFrom.length > 0) || (searchTo && searchTo.length > 0)) {
        conditions['fieldValue'].push({from: searchFrom || DEFAULT_TIME_FROM, to: searchTo || DEFAULT_TIME_TO});
      }
      conditions['isSearchBlank'] = isSearchBlank;
      if (props.updateStateElement) {
        props.updateStateElement(fieldInfo, DefineFieldType.TIME, conditions);
      }
    }
    let saveValueSettingData = "";
    if (!isSearchBlank) {
      if (viewTimeFrom?.length > 0 && viewTimeTo?.length > 0) {
        saveValueSettingData = viewTimeFrom + translate(fieldSearchMessages.lableSearchBeforeTime) + viewTimeTo + translate(fieldSearchMessages.lableSearchAfterTime);
      }
      if (viewTimeFrom?.length > 0 && viewTimeTo?.length === 0) {
        saveValueSettingData = viewTimeFrom + translate(fieldSearchMessages.lableSearchBeforeTime);
      }
      if (viewTimeFrom?.length === 0 && viewTimeTo?.length > 0) {
        saveValueSettingData = viewTimeTo + translate(fieldSearchMessages.lableSearchAfterTime);
      }
    } else {
      saveValueSettingData = translate(fieldSearchMessages.searchBlankTime);
    }
    setSaveValueSetting(saveValueSettingData);
  }

  /*
   * Render the time component in add-edit case
   */
  const renderSearchTime = () => {
    return (
      <View>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={FieldSearchTimeStyles.title}>{title}</Text>
          {
            saveValueSetting.length === 0 && (
              <Text style={FieldSearchTimeStyles.placeholderLabel}>
                {translate(messages.placeholderSearchTime)}</Text>
            )
          }
          {saveValueSetting.length > 0 && (
            <Text
              style={FieldSearchTimeStyles.textLabel}
            >{saveValueSetting}</Text>
          )
          }
        </TouchableOpacity>


        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={FieldSearchTimeStyles.modalContainer} >
            <TouchableOpacity
              style={FieldSearchTimeStyles.modalHeader}
              onPress={() => {
                setModalVisible(!modalVisible)
              }} />
              <Image style={FieldSearchTimeStyles.modalIcon} source={modalIcon} />
            <View style={[FieldSearchTimeStyles.modalContent]}>
              <ScrollView>
                <TouchableOpacity style={FieldSearchTimeStyles.modalOption} onPress={handlerClickSearchBlank}>
                  <Text style={FieldSearchTimeStyles.padding15}>{translate(fieldSearchMessages.searchBlankTime)}</Text>
                  {isSearchBlank && selectedOption &&
                    <Image style={FieldSearchTimeStyles.marginHorizontal15} source={selectedIcon} />
                  }
                </TouchableOpacity>
                <View style={FieldSearchTimeStyles.modalDivider} />
                <TouchableOpacity
                  style={FieldSearchTimeStyles.modalOption}
                  onPress={handlerClickSearchByTime}>
                  <Text style={FieldSearchTimeStyles.padding15}>{translate(fieldSearchMessages.searchRangeTime)}</Text>
                  {!isSearchBlank && selectedOption &&
                    <Image style={FieldSearchTimeStyles.marginHorizontal15} source={selectedIcon} />
                  }
                </TouchableOpacity>

                {!isSearchBlank && (
                  <View>
                    <View style={FieldSearchTimeStyles.modalSearchDetail}>
                      <View style={FieldSearchTimeStyles.modalOptionRange}>
                        <Text
                          onPress={() => handlerClickTimePicker(ChooseTimeSearch.TIME_FROM)}
                          style={[FieldSearchTimeStyles.modalTimeRangeFrom,
                          viewTimeFrom?.length > 0 ? FieldSearchTimeStyles.colorText : FieldSearchTimeStyles.colorPlaceholder]}>
                          {viewTimeFrom?.length > 0 ? viewTimeFrom : translate(fieldSearchMessages.placeholderTimeChoose)}</Text>
                        <Text style={FieldSearchTimeStyles.lableRange}>{translate(fieldSearchMessages.lableSearchBeforeTime)}</Text>
                      </View>
                      <View style={FieldSearchTimeStyles.modalOptionRange}>
                        <Text
                          onPress={() => handlerClickTimePicker(ChooseTimeSearch.TIME_TO)}
                          style={[FieldSearchTimeStyles.modalTimeRangeTo,
                          viewTimeTo?.length > 0 ? FieldSearchTimeStyles.colorText : FieldSearchTimeStyles.colorPlaceholder]}>
                          {viewTimeTo?.length > 0 ? viewTimeTo : translate(fieldSearchMessages.placeholderTimeChoose)}</Text>
                        <Text style={FieldSearchTimeStyles.lableRange}>{translate(fieldSearchMessages.lableSearchAfterTime)}</Text>
                      </View>
                    </View>
                    <View>
                      {showTime &&
                        <DateTimePicker
                          value={date}
                          mode="time"
                          display="default"
                          minuteInterval={5}
                          onChange={onChangeTime}
                        />
                      }
                    </View>
                  </View>
                )}
                <View style={FieldSearchTimeStyles.modalDivider} />
              </ScrollView>
              {
                selectedOption && (
                  <TouchableOpacity style={FieldSearchTimeStyles.modalButton} onPress={() => confirmSearch()}>
                    <Text style={FieldSearchTimeStyles.textButton}>{translate(fieldSearchMessages.searchConditionsConfirm)}</Text>
                  </TouchableOpacity>
                )
              }
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  /*
   * Render the time component 
   */
  const renderComponent = () => {
    return renderSearchTime();
  }

  return renderComponent();
}

