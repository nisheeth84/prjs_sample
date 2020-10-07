/* eslint-disable @typescript-eslint/no-use-before-define */
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { theme } from '../../../config/constants';
import { TEXT_EMPTY } from '../../../config/constants/constants';
import {
  DefineFieldType,
  EnumButtonStatus,
  EnumButtonType,
  FIELD_BELONG,
  URLType,
  FIELD_NAME,
} from '../../../config/constants/enum';
import { FieldInfoItem } from '../../../config/constants/field-info-interface';
import { translate } from '../../../config/i18n';
import { ButtonColorHighlight } from '../../../shared/components/button/button-color-highlight';
import { CheckBox } from '../../../shared/components/checkbox';
import { Icon } from '../../../shared/components/icon/icon';
import { InputWithIcon } from '../../../shared/components/search-input-with-icon';
import StringUtils from '../../../shared/util/string-utils';
import { authorizationSelector } from '../../login/authorization/authorization-selector';
import { SearchActions } from '../search-reducer';
import {
  getCustomFieldInfo,
  updateFieldInfoPersonals,
} from '../search-reponsitory';
import {
  customFieldInfoSelector,
  fieldInfoPersonalsSelector,
} from '../search-selector';
import { messages } from './search-detail-messages';
import { ModalSettingStyle } from './search-detail-styles';
import { ServicesWithOther, ServiceNotDisplay } from '../search-enum';
import { getAdditionsService } from './handle-addtion-service';
import { ServiceFavoriteSelector, ServiceInfoSelector } from '../../menu/menu-feature-selector';
import { apiUrl } from '../../../config/constants/api';
import { SvgCssUri } from 'react-native-svg';


export function SettingModal({
  onCloseModal = () => {},
  fieldBelong = 0,
}: any) {
  const dispatch = useDispatch<any>();
  const customFieldInfo: Array<any> = useSelector(customFieldInfoSelector);
  const serviceFavorite = useSelector(ServiceFavoriteSelector) || [];
  const serviceInfo = useSelector(ServiceInfoSelector) || [];
  const fieldInfoService = useSelector(fieldInfoPersonalsSelector) || [];
  const [customRelationFields, setCustomRelationFields] = useState<any[]>([]);
  const [relationService, setRelationService] = useState<any>();
  const [customFields, setCustomFields] = useState<any>([]);
  const [chooseFields, setChooseFields] = useState<any>(fieldInfoService);
  const [chooseFieldsRelation, setchooseFieldsRelation] = useState<any>([]);
  const [clickRelation, setClickRelation] = useState<any>();
  const [searchService, setSearchService] = useState("");


  const typeNotInclude = [
    DefineFieldType.TAB,
    DefineFieldType.LOOKUP,
    DefineFieldType.TITLE,
  ];

  const typeNotIncludeRelation = [
    DefineFieldType.TAB,
    DefineFieldType.LOOKUP,
    DefineFieldType.TITLE,
    DefineFieldType.RELATION,
    DefineFieldType.LINK,
  ];
  useEffect(() => {
    getFieldInfoService();
    setChooseFields(convertChooseFields(fieldInfoService));
    convertChooseFieldsRelation(fieldInfoService);
  }, [fieldBelong]);

  useEffect(() => {
    setCustomFields(customFieldInfo);
  }, [customFieldInfo]);

  const getIconService =(serviceId: number)=>{
    const allService = [...serviceInfo, ...serviceFavorite]
    const item = allService.find((service:any)=>{
      return service.serviceId === serviceId
    })
    return `${apiUrl}${item?.iconPath}`
  }

  /**
   * call api get list custom fieldInfos
   */
  const getFieldInfoServiceByService = async (fieldItem: any) => {
    const fieldBelongRelation = fieldItem?.relationData?.fieldBelong;
    if (fieldBelongRelation) {
      const responseFieldInfo = await getCustomFieldInfo(
        {
          fieldBelongRelation,
        },
        {}
      );
      return responseFieldInfo;
    }
  };

  const getFieldInfoService = async () => {
    const responseFieldInfo = await getCustomFieldInfo(
      {
        fieldBelong,
      },
      {}
    );
    const customFieldsinfoArray = responseFieldInfo?.data?.customFieldsInfo;
    const customFieldInfoFilter = customFieldsinfoArray?.filter((item: any) => {
      return (
        (!typeNotInclude.includes(item?.fieldType?.toString() || '') &&
          item?.fieldName !== FIELD_NAME.employeeIcon &&
          item?.fieldName !== FIELD_NAME.timezoneId &&
          item?.fieldName !== FIELD_NAME.languageId &&
          item?.fieldType?.toString() !== DefineFieldType.LINK) ||
        (item?.fieldType?.toString() === DefineFieldType.LINK &&
          item?.urlType !== URLType.URL_STATIC)
      );
    });

    // get relation data
    const customFieldInfoFilterRelation = customFieldsinfoArray?.filter(
      (item: any) => {
        return item?.fieldType?.toString() === DefineFieldType.RELATION;
      }
    );

    if (
      customFieldInfoFilterRelation &&
      customFieldInfoFilterRelation.length > 0
    ) {
      for (
        let index = 0;
        index < customFieldInfoFilterRelation.length;
        index++
      ) {
        const fieldItem = customFieldInfoFilterRelation[index];
        if (fieldItem.relationData) {
          if (fieldItem.relationData?.fieldBelong) {
            let response = await getFieldInfoServiceByService(fieldItem);
            if (response) {
              const fieldsInfo = response?.data?.customFieldsInfo;
              const fieldInfoFilter = fieldsInfo?.filter((item: any) => {
                return !typeNotIncludeRelation.includes(
                  item?.fieldType?.toString() || ''
                );
              });
              customRelationFields.push({
                fieldInfor: fieldItem,
                customField: fieldInfoFilter,
              });
            }
          }
        }
      }
      const customRelationFieldsc = _.cloneDeep(customRelationFields);
      setCustomRelationFields(customRelationFieldsc);
    }
    if (ServicesWithOther.includes(fieldBelong)) {
      handleAdditionService(customFieldInfoFilter);
    }
    dispatch(SearchActions.getCustomFieldInfoServices(await handleAdditionService(customFieldInfoFilter)));
  };

  const handleAdditionService = (customFieldInfoFilter: any) => {
    return getAdditionsService(
      fieldBelong.toString(),
      customFieldInfoFilter
    );
  };

  /**
   * check if item was selected
   * @param item
   */
  const convertChooseFields = (fieldItems: FieldInfoItem[]) => {
    const fieldArray = [...fieldItems];
    const newFieldArray: any[] = [];
    const relationArray = fieldArray?.filter((itemRl: any) => {
      return itemRl?.fieldType?.toString() === DefineFieldType.RELATION;
    });

    for (let index = 0; index < relationArray.length; index++) {
      const fieldItem = fieldArray[index];
      if (fieldItem) {
        const relationList = fieldArray?.filter((itemRl: any) => {
          return fieldItem?.fieldId === itemRl?.relationFieldId;
        });
        chooseFieldsRelation.push({
          fieldItem: fieldItem,
          chooseFields: relationList,
        });
      }
    }
    setchooseFieldsRelation(chooseFieldsRelation);
    for (let index = 0; index < fieldArray.length; index++) {
      const fieldItem = fieldArray[index];
      if (!fieldItem.relationFieldId) {
        newFieldArray.push(fieldItem);
      }
    }
    return newFieldArray;
  };

  interface SelectedRelation {
    relationFieldId: number;
    relationItemFieldId: number[];
  }

  const [selectedRelationValue, setSelectedRelationValue] = useState<
    SelectedRelation[]
  >([]);

  const checkItemSelectedRelation = () => {
    for (let index = 0; index < selectedRelationValue.length; index++) {
      const item = selectedRelationValue[index];
      if (item?.relationItemFieldId?.length > 0) {
        return true;
      }
    }
    return false;
  };

  /**
   * check if item was selected
   * @param item
   */
  const convertChooseFieldsRelation = (fieldItems: FieldInfoItem[]) => {
    const fieldArray = [...fieldItems];
    const relationArray = fieldArray?.filter((itemRl: any) => {
      return itemRl?.fieldType?.toString() === DefineFieldType.RELATION;
    });

    let selectedRelation: SelectedRelation[] = [];
    customFieldInfo.forEach((item) => {
      if (item.fieldType == DefineFieldType.RELATION) {
        selectedRelation.push({
          relationFieldId: item.fieldId,
          relationItemFieldId: [],
        });
      }
    });
    relationArray.forEach((relationItem) => {
      fieldItems.forEach((fieldItem) => {
        const selected = selectedRelation.find(
          (x) => x.relationFieldId === relationItem.fieldId
        );
        if (fieldItem.relationFieldId === relationItem.fieldId) {
          if (selected) {
            selected.relationItemFieldId.push(fieldItem.fieldId);
          }
        }
      });
    });
    setSelectedRelationValue(_.cloneDeep(selectedRelation));
  };

  const checkItemExistRelation = (itemId: number, relationItemId: number) => {
    for (let index = 0; index < selectedRelationValue.length; index++) {
      const item = selectedRelationValue[index];
      if (item.relationFieldId === relationItemId) {
        if (item.relationItemFieldId.includes(itemId)) {
          return true;
        }
      }
    }
    return false;
  };

  const handlePressRelationItem = (itemId: number, relationItemId: number) => {
    const tmp = _.cloneDeep(selectedRelationValue);
    for (let index = 0; index < tmp.length; index++) {
      const item = tmp[index];
      if (item.relationFieldId === relationItemId) {
        if (item.relationItemFieldId.includes(itemId)) {
          item.relationItemFieldId = item.relationItemFieldId.filter(
            (e) => e != itemId
          );
        } else {
          item.relationItemFieldId.push(itemId);
        }
      }
    }
    setSelectedRelationValue(tmp);
  };

  /**
   * check if item was selected
   * @param item
   */
  const checkItemExist = (item: FieldInfoItem) => {
    const fieldArray = [...chooseFields];
    const fieldIndex = fieldArray.findIndex((field) => {
      return item.fieldId === field.fieldId;
    });
    return fieldIndex;
  };

  /**
   * handle change fieldValue item
   * @param item
   */
  const handlePressItem = (item: FieldInfoItem) => {
    let fieldArray = [...chooseFields];
    if (checkItemExist(item) >= 0) {
      fieldArray.splice(checkItemExist(item), 1);
    } else {
      fieldArray.push(item);
    }
    fieldArray.sort((a: any, b: any) => {
      return a.fieldOrder - b.fieldOrder;
    });
    setChooseFields(fieldArray);
  };

  /**
   * handle change fieldValue item
   * @param item
   */
  const handlePressRelation = (item: any) => {
    if (selectedRelationValue?.length === 0) {
      convertChooseFieldsRelation(fieldInfoService);
    }
    if (clickRelation?.fieldId == item?.fieldId) {
      setClickRelation([]);
    } else {
      setClickRelation(item);
    }
    let customFieldsRl = customRelationFields.find(
      (itemRelation: any) => itemRelation?.fieldInfor.fieldId == item?.fieldId
    );
    let customFieldsRls = customFieldsRl?.customField;
    if (customFieldsRls?.length > 0) {
      setRelationService(customFieldsRls);
    }
  };

  useEffect(()=>{
    if (searchService.trim() === TEXT_EMPTY) {
      setCustomFields(
        [...customFieldInfo]
      );
      return;
    }
    const customFieldArray = [...customFieldInfo].filter((item: FieldInfoItem) => {
      const fieldLabel = JSON.parse(item?.fieldLabel || TEXT_EMPTY) || {};
      const label = fieldLabel['ja_jp'] || TEXT_EMPTY;
      return label.includes(searchService);
    });
    setCustomFields(customFieldArray);
  },[searchService])

  /**
   * handle press icon search
   * @param searchValue
   */
  const handlePressSearchIcon = (searchValue: string) => {
    setSearchService(searchValue);
  };

  /**
   * handle press confirm choose field
   */
  const handlePressConfirm = async () => {
    const tmp = _.cloneDeep(chooseFields);
    let fieldInfos = [...tmp]
      .filter((item: any) => item.fieldType != DefineFieldType.RELATION)
      .map((item) => {
        return {
          fieldId: item.fieldId,
          fieldOrder: item.fieldOrder,
          relationFieldId: item?.relationFieldId || null,
        };
      });

    let relationField: {
      fieldId: any;
      fieldOrder: any;
      relationFieldId: any;
    }[] = [];
    if (relationService) {
      selectedRelationValue.forEach((item) => {
        item.relationItemFieldId.forEach((e) => {
          const tmpField = relationService.find((el: any) => el.fieldId === e);
          if (tmpField) {
            const field = {
              fieldId: e,
              fieldOrder: tmpField.fieldOrder,
              relationFieldId: item.relationFieldId,
            };
            relationField.push(field);
          }
        });
      });
    }
    fieldInfos.push(...relationField);
    const responseUpdateFieldInfo = await updateFieldInfoPersonals(
      {
        fieldBelong: fieldBelong,
        extensionBelong: 2,
        fieldInfos,
        selectedTargetType: 0,
        selectedTargetId: 0,
      },
      {}
    );
    if (responseUpdateFieldInfo.status === 200) {
      onCloseModal();
      dispatch(SearchActions.getFieldInfoService(chooseFields));
    }
  };

  /**
   * handle press reverse fieldInfos
   */
  const reverseSelected = () => {
    const newArray = [];
    for (let i = 0; i <= customFieldInfo.length - 1; i++) {
      const indexChoose = chooseFields.findIndex((item: any) => {
        return item.fieldId === customFieldInfo[i].fieldId;
      });
      if (indexChoose < 0) {
        newArray.push(customFieldInfo[i]);
      }
    }
    setChooseFields(newArray);
  };

  const getFieldBelongName = (type: number) => {
    switch (type) {
      case FIELD_BELONG.EMPLOYEE:
        return translate(messages.searchEmployee);
      case FIELD_BELONG.PRODUCT:
        return translate(messages.searchProduct);
      case FIELD_BELONG.CUSTOMER:
        return translate(messages.searchCustomer);
      default:
        return '';
    }
  };

  const length = [...customFields].length;
  const authorizationState = useSelector(authorizationSelector);
  const languageCode = authorizationState?.languageCode ?? TEXT_EMPTY;
  return (
    <View style={ModalSettingStyle.modalContent}>
      {/* render header input */}
      <InputWithIcon
        onPressSearch={handlePressSearchIcon}
        placeHolder={translate(messages.placeHolderSearch)}
        searchText={searchService}
        handleChangeText={handlePressSearchIcon}
      />
      <ScrollView>
        <View style={ModalSettingStyle.spaceView} />
        {/* render top button */}
        <View style={ModalSettingStyle.topButtonContainer}>
          <ButtonColorHighlight
            title={translate(messages.selectAll)}
            onPress={() => setChooseFields(customFields)}
            status={EnumButtonStatus.inactive}
            type={EnumButtonType.dialog}
          />
          <ButtonColorHighlight
            title={translate(messages.unSelectAll)}
            onPress={() => setChooseFields([])}
            status={
              chooseFields.length
                ? EnumButtonStatus.inactive
                : EnumButtonStatus.disable
            }
            type={EnumButtonType.dialog}
          />
          <ButtonColorHighlight
            title={translate(messages.reverseSelect)}
            onPress={reverseSelected}
            status={
              chooseFields.length
                ? EnumButtonStatus.inactive
                : EnumButtonStatus.disable
            }
            type={EnumButtonType.dialog}
          />
        </View>
        {/* render list checkbox custom fieldInfo */}
        {Array.isArray(customFields) &&
          customFields
            .map((item: any, index: number) => {
              if (item?.fieldType?.toString() === DefineFieldType.RELATION) {
                return (
                  <View>
                    <TouchableOpacity
                      onPress={() => handlePressRelation(item)}
                      style={ModalSettingStyle.fieldChooseItemRelation}
                    >
                      <Icon
                        name={
                          clickRelation?.fieldId == item?.fieldId
                            ? 'arrowUp'
                            : 'arrowDown'
                        }
                      />
                      <Text style={ModalSettingStyle.itemIconName}>
                        {getFieldBelongName(
                          item?.relationData?.fieldBelong ??
                            FIELD_BELONG.EMPLOYEE
                        )}
                        {`(${StringUtils.getFieldLabel(
                          item,
                          'fieldLabel',
                          languageCode
                        )})`}
                      </Text>
                    </TouchableOpacity>
                    {relationService &&
                      clickRelation?.fieldId == item?.fieldId &&
                      relationService?.map((item2: any, index2: number) => {
                        const fieldBelongId = item?.relationData?.fieldBelong;
                        return (
                          <View>
                            <TouchableOpacity
                              onPress={() =>
                                handlePressRelationItem(
                                  item2.fieldId,
                                  item?.fieldId
                                )
                              }
                              style={ModalSettingStyle.fieldChooseItemRelation}
                            >
                              <SvgCssUri
                                uri={getIconService(fieldBelongId)}
                                style={ModalSettingStyle.itemIconRelationSize}
                              />
                              <Text
                                numberOfLines={1}
                                style={ModalSettingStyle.itemIconName}
                              >
                                {StringUtils.getFieldLabel(
                                  item2,
                                  'fieldLabel',
                                  languageCode
                                )}
                              </Text>
                              <View style={ModalSettingStyle.itemIconCheck}>
                                <CheckBox
                                  onChange={() =>
                                    handlePressRelationItem(
                                      item2.fieldId,
                                      item?.fieldId
                                    )
                                  }
                                  checkBoxStyle={[
                                    {
                                      borderColor: theme.colors.gray100,
                                    },
                                  ]}
                                  checked={checkItemExistRelation(
                                    item2.fieldId,
                                    item?.fieldId
                                  )}
                                  square={false}
                                />
                              </View>
                            </TouchableOpacity>
                            {length === index2 + 1 && (
                              <View style={ModalSettingStyle.space}></View>
                            )}
                          </View>
                        );
                      })}
                  </View>
                );
              } else {
                const fieldNotDisplays = ServiceNotDisplay[item.fieldBelong.toString()]
                if(fieldNotDisplays.includes(item.fieldName)){
                  return <View/>
                }
                return (
                  <View>
                    <TouchableOpacity
                      onPress={() => handlePressItem(item)}
                      style={ModalSettingStyle.fieldChooseItem}
                    >
                        <SvgCssUri
                          uri={getIconService(item.fieldBelong)}
                          style={ModalSettingStyle.itemIconRelationSize}
                        />
                      <Text
                        numberOfLines={1}
                        style={ModalSettingStyle.itemIconName}
                      >
                        {StringUtils.getFieldLabel(
                          item,
                          'fieldLabel',
                          languageCode
                        )}
                      </Text>
                      <View>
                        <CheckBox
                          onChange={() => handlePressItem(item)}
                          checkBoxStyle={[
                            {
                              borderColor: theme.colors.gray100,
                            },
                          ]}
                          checked={checkItemExist(item) >= 0}
                          square={false}
                        />
                      </View>
                    </TouchableOpacity>
                    {length === index + 1 && (
                      <View style={ModalSettingStyle.space}></View>
                    )}
                  </View>
                );
              }
            })}
      </ScrollView>
      {/* render bottom button */}
      <View style={ModalSettingStyle.bottomButton}>
        <ButtonColorHighlight
          title={translate(messages.closeModal)}
          onPress={() => onCloseModal()}
          status={EnumButtonStatus.inactive}
          type={EnumButtonType.miniModal}
        />
        <ButtonColorHighlight
          title={translate(messages.confirmModal)}
          onPress={handlePressConfirm}
          status={
            chooseFields.length || checkItemSelectedRelation()
              ? EnumButtonStatus.normal
              : EnumButtonStatus.disable
          }
          type={EnumButtonType.miniModal}
        />
      </View>
    </View>
  );
}
