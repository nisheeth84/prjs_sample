import { AntDesign } from '@expo/vector-icons';
import _ from 'lodash';
import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator, FlatList,
  Image,
  Modal,
  RefreshControl, Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  PanResponder
} from 'react-native';
import { theme } from '../../../../../config/constants';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { DefineFieldType, ModifyFlag } from '../../../../../config/constants/enum';
import { translate } from '../../../../../config/i18n';
import StringUtils from '../../../../util/string-utils';
import { AddressesPayload, getAddressesFromZipCode } from '../dynamic-control-repository';
import { isEmpty,cloneDeep } from 'lodash';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { fieldAddEditMessages } from './field-add-edit-messages';
import { FieldAddEditAddressStyles } from './field-add-edit-styles';
import { useDebounce } from '../../../../../config/utils/debounce';
import { AddressInfo } from '../interface/dynamic-field-interface';

// Define value props of FieldAddEditAddress component
type IFieldAddEditAddressProps = IDynamicFieldProps;

/**
 * Component for inputing address fields
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditAddress(props: IFieldAddEditAddressProps) {
  const { fieldInfo, languageCode } = props;
  const [errorMessage, setErrorMessage] = useState(TEXT_EMPTY);
  const [isShowSuggestion, setShowSuggestion] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState(TEXT_EMPTY);
  const [refreshData, setRefreshData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [footerIndicator, setFooterIndicator] = useState(true);
  const limitData = 10;
  const [offset, setOffset] = useState(0);
  const [isNoData, setIsNoData] = useState(false);
  const [valueAddress, setValueAddress] = useState({
    zipCode: TEXT_EMPTY,
    addressName: TEXT_EMPTY,
    buildingName: TEXT_EMPTY
  });
  const [responseApiAddress, setResponseApiAddress] = useState<AddressInfo[]>([]);
  const searchIcon = require("../../../../../../assets/icons/search.png");
  const modalIcon = require("../../../../../../assets/icons/icon_modal.png");
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const debounceSearch = useDebounce(searchValue, 500);
  const [y, setY] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;
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
   * Get modal flex
   */
  const getFlexNumber = () => {
    if (y < 0) {
      return 20;
    } else {
      return 4;
    }
  }
  /**
   * Init default value 
   */
  const initialize = () => {
    if (props.elementStatus?.fieldValue && !isEditing) {
      const objectValue = JSON.parse(props.elementStatus.fieldValue);

      if (!_.isEqual(objectValue, valueAddress)) {
        setValueAddress(objectValue);
      }
    }
  };

  /**
   * Update default value 
   */
  const updateValueAddress = (val: any) => {
    const valueCopy = _.cloneDeep(valueAddress);
    const mergeObject = { ...valueCopy, ...val };
    setValueAddress(mergeObject);
  }


  /**
   * handle click icon clear text input
   */
  const handleClearSearch = () => {
    setSearchValue(TEXT_EMPTY);
    setResponseApiAddress([]);
    setIsNoData(false);
  }

  /**
 * Render ActivityIndicator
 * @param animating 
 */
  const renderActivityIndicator = (animating: boolean) => {
    if (!animating) return null;
    return (
      <ActivityIndicator style={{ padding: 5 }} animating={animating} size="large" />
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
   * handle selected address item in list suggestion
   * @param itemAddress selected
   */
  const handleClickAddressItem = (itemAddress: AddressInfo) => {
    let addressName = `${itemAddress.prefectureName}${itemAddress.cityName}${itemAddress.areaName}`;
    //update data selected
    updateValueAddress({ zipCode: itemAddress.zipCode, addressName: addressName });
    // clear data response from api
    setResponseApiAddress([]);
    // close modal
    setModalVisible(false);
    //clear data search
    setSearchValue(TEXT_EMPTY);
  }

  /**
   * handle text input to show suggestion
   * @param inputAddress text from input
   */
  const handleSearchAddress = async (inputAddress: string) => {
    setIsNoData(false);
    setResponseApiAddress([]);
    responseApiAddress.splice(0, responseApiAddress.length);
    setSearchValue(inputAddress);
    setShowSuggestion(true);
    setErrorMessage(TEXT_EMPTY);
    if (inputAddress !== TEXT_EMPTY) {
      handleAddressFromZipCode(inputAddress, 0);
    } else {
      setRefreshData(false);
      setFooterIndicator(false);
    }
  }

  const handleAddressFromZipCode = async (inputAddress: string, numberOffset: number) => {
    const payload: AddressesPayload = {
      zipCode: inputAddress,
      offset: numberOffset,
      limit: limitData,
    }
    const resAddresses = await getAddressesFromZipCode(payload);
    if (resAddresses.status === 200 && resAddresses.data) {
      if (isEmpty(resAddresses.data)) {
        setIsNoData(true);
      }
      setResponseApiAddress(cloneDeep(responseApiAddress).concat(resAddresses.data));
      setErrorMessage(TEXT_EMPTY);
    } else {
      responseApiAddress.splice(0, responseApiAddress.length);
      setResponseApiAddress([]);
      setErrorMessage(translate(fieldAddEditMessages.errorCallAPI));
      setIsNoData(true);
    }
    setRefreshData(false);
    setFooterIndicator(false);
  }
  /**
 * Handling after each rendering
 */
  useEffect(() => {
    initialize();
  }, [props.elementStatus]);

  /**
   * Handling after update address
   */
  useEffect(() => {
    const valueCopy = _.cloneDeep(valueAddress);
    if (props.updateStateElement) {
      const updateVal = {
        "zip_code": valueCopy.zipCode,
        "building_name": valueCopy.buildingName,
        "address_name": valueCopy.addressName,
      }
      let valueReturn = !!updateVal ? JSON.stringify(updateVal) : ""
      if (!valueCopy.zipCode  && !valueCopy.buildingName && !valueCopy.addressName) {
        valueReturn = "";
      }
      const addressObj = valueReturn;
      props.updateStateElement(fieldInfo, DefineFieldType.ADDRESS, addressObj);
    }
  }, [valueAddress]);

  /**
 * Change value search
 */
  useEffect(() => {
    if (debounceSearch) {
      handleSearchAddress(searchValue);
    } else {
      setResponseApiAddress([]);
    }
  }, [debounceSearch]);

  /**
   * Render the adrdress component in add-edit case
   */
  const renderAddEditAdrdress = () => {
    return (
      <View
        style={FieldAddEditAddressStyles.container}>
        <View style={FieldAddEditAddressStyles.titleContainer}>
          <Text style={FieldAddEditAddressStyles.title}>{title}</Text>
          {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
            <View style={FieldAddEditAddressStyles.requiredContainer}>
              <Text style={FieldAddEditAddressStyles.textRequired}>{translate(fieldAddEditMessages.inputRequired)}</Text>
            </View>
          )}
        </View>
        <View style={FieldAddEditAddressStyles.viewInput}>
          {/* View zip code */}
          <View style={FieldAddEditAddressStyles.postalCode}>
            <TouchableOpacity onPress={() => { setModalVisible(true); }} disabled={props.isDisabled}>
              <View style={FieldAddEditAddressStyles.titleContainer}>
              <Text style={FieldAddEditAddressStyles.titleSub}>{translate(fieldAddEditMessages.titlePostalCode)}</Text>
              </View>
              <Text style={valueAddress.zipCode?.length > 0 ? FieldAddEditAddressStyles.textColorDefault : FieldAddEditAddressStyles.textColorGray}>
                {valueAddress.zipCode?.length > 0 ? valueAddress.zipCode : `${translate(fieldAddEditMessages.titlePostalCode)}${translate(fieldAddEditMessages.textPlaceholder)}`}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={FieldAddEditAddressStyles.divider} />
          {/* View address name */}
          <View style={FieldAddEditAddressStyles.addressName}>
            <View style={FieldAddEditAddressStyles.titleContainer}>
              <Text style={FieldAddEditAddressStyles.titleSub}>{translate(fieldAddEditMessages.titleAddressName)}</Text>
            </View>
            <TextInput
              editable={!props.isDisabled}
              maxLength={450}
              value={valueAddress.addressName}
              placeholder={`${translate(fieldAddEditMessages.titleAddressName)}${translate(fieldAddEditMessages.textPlaceholder)}`}
              placeholderTextColor={theme.colors.gray}
              onChangeText={(text) => updateValueAddress({ addressName: text })}
              onFocus={() => setIsEditing(true)}
            />
          </View>
          <View style={FieldAddEditAddressStyles.divider} />
          {/* View building name */}
          <View style={FieldAddEditAddressStyles.buildingName}>
            <View style={FieldAddEditAddressStyles.titleContainer}>
              <Text style={FieldAddEditAddressStyles.titleSub}>{translate(fieldAddEditMessages.titleBuildingName)}</Text>
            </View>
            <TextInput
              editable={!props.isDisabled}
              maxLength={450}
              value={valueAddress.buildingName}
              placeholder={`${translate(fieldAddEditMessages.titleBuildingName)}${translate(fieldAddEditMessages.textPlaceholder)}`}
              placeholderTextColor={theme.colors.gray}
              onChangeText={(text) => updateValueAddress({ buildingName: text })}
              onFocus={() => setIsEditing(true)} />

          </View>
        </View>
        {/* Modal Suggestion */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={FieldAddEditAddressStyles.modalContainer}>
            <Animated.View
              style={{ flex: 3, justifyContent: 'flex-end' }}
              {...panResponder.panHandlers}
            >
              <TouchableOpacity
                style={FieldAddEditAddressStyles.modalTouchable}
                onPress={() => { setModalVisible(false) }} >
                <View>
                  <Image style={FieldAddEditAddressStyles.modalIcon} source={modalIcon} />
                </View>
              </TouchableOpacity>
            </Animated.View>
            <View style={[FieldAddEditAddressStyles.modalContent, { flex: getFlexNumber() }]}>
              <View style={FieldAddEditAddressStyles.inputContainer}>
                {searchValue.length <= 0 && (
                  <View style={FieldAddEditAddressStyles.iconCheckView}>
                    <Image style={FieldAddEditAddressStyles.iconCheck} source={searchIcon} />
                  </View>
                )}
                <TextInput style={searchValue.length > 0 ? FieldAddEditAddressStyles.inputSearchTextData : FieldAddEditAddressStyles.inputSearchText}
                  placeholder={`${translate(fieldAddEditMessages.titlePostalCode)}${translate(fieldAddEditMessages.textPlaceholder)}`}
                  value={searchValue}
                  maxLength={8}
                  onChangeText={(text) => handleSearchAddress(text)}
                />
                <View style={FieldAddEditAddressStyles.textSearchContainer}>
                  {searchValue.length > 0 && (
                    <TouchableOpacity onPress={handleClearSearch}>
                      <AntDesign name="closecircle" style={FieldAddEditAddressStyles.iconDelete} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={FieldAddEditAddressStyles.dividerContainer} />
              {
                errorMessage !== TEXT_EMPTY && (
                  <Text style={FieldAddEditAddressStyles.errorMessage}>{errorMessage}</Text>
                )
              }
              {isShowSuggestion &&
                <View style={[responseApiAddress?.length > 0 ? FieldAddEditAddressStyles.suggestionContainer : FieldAddEditAddressStyles.suggestionContainerNoData]}>
                  <FlatList
                    data={responseApiAddress}
                    keyExtractor={item => item.zipCode.toString()}
                    onEndReached={() => {
                      if (!isNoData) {
                        setFooterIndicator(true);
                        handleAddressFromZipCode(searchValue, offset + 10);
                        setOffset(offset + 10);
                      }
                    }}
                    onEndReachedThreshold={0.00000001}
                    ListFooterComponent={renderActivityIndicator(footerIndicator)}
                    ItemSeparatorComponent={renderItemSeparator}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshData}
                        onRefresh={() => {
                          setOffset(0);
                         
                          setRefreshData(true);
                          handleSearchAddress(searchValue);
                        }}
                      />
                    }
                    renderItem={({ item }) =>
                      <TouchableOpacity style={responseApiAddress?.length > 0 ? FieldAddEditAddressStyles.touchableSelect : FieldAddEditAddressStyles.touchableSelectNoData}
                        onPress={() => {
                          handleClickAddressItem(item);
                        }}>
                        <View style={FieldAddEditAddressStyles.suggestTouchable}>
                          <Text style={FieldAddEditAddressStyles.suggestText}>{`${translate(fieldAddEditMessages.itemAddress)}${item.zipCode}${item.prefectureName}${item.cityName}${item.areaName}`}</Text>
                        </View>
                      </TouchableOpacity>
                    }
                  />
                </View>}
            </View>
          </View>
        </Modal >
      </View>
    );
  }

  return renderAddEditAdrdress();
}