/* eslint-disable @typescript-eslint/no-use-before-define */
import { useNavigation, useRoute } from '@react-navigation/native';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TEXT_EMPTY, OBJECT_EMPTY } from '../../../config/constants/constants';
import {
  ControlType,
  DefineFieldType,
  FIELD_BELONG,
} from '../../../config/constants/enum';
import { FieldInfoItem } from '../../../config/constants/field-info-interface';
import { translate } from '../../../config/i18n';
import { DynamicControlField } from '../../../shared/components/dynamic-form/control-field/dynamic-control-field';
import { FieldSearchTextStyles } from '../../../shared/components/dynamic-form/control-field/search/field-search-styles';
import { Header } from '../../../shared/components/header';
import { ActivityIndicatorLoading } from '../../../shared/components/indicator-loading/activity-indicator-loading';
import StringUtils from '../../../shared/util/string-utils';
import {
  getFieldNameElastic,
  getFieldTypeSpecial,
} from '../search-detail-special/employee-special';
import {
  getFieldNameProduct,
  specialInfoProduct,
} from '../search-detail-special/product-special';
import { DataLayoutName, ExtensionName, ServiceName } from '../search-enum';
import { SearchActions } from '../search-reducer';
import {
  getDataLayout,
  getEmployeeLists,
  getFieldInfo,
  getFieldInfoPersonal,
  getProducts,
  getCustomers,
} from '../search-reponsitory';
import { fieldInfoPersonalsSelector } from '../search-selector';
import { getUrlLayout } from '../search-util';
import { messages } from './search-detail-messages';
import { DetailScreenStyle } from './search-detail-styles';
import { SettingModal } from './search-setting-modal';
import {
  specialInfoCustomer,
  getFieldNameCustomer,
  RenderIsDisplayChildField,
  displayChildCondition,
} from '../search-detail-special/customer-special';
import { specialInfoProductManage, RenderTradingContactField } from '../search-detail-special/product-manage-special';
import { getAdditionServiceId, getAdditionsServiceLayout } from './handle-addtion-service';

const typeNotInclude = [
  DefineFieldType.TAB,
  DefineFieldType.LOOKUP,
  DefineFieldType.TITLE,
];

export function DetailSearch(props: {
  suggestService?: string;
  suggestClose?: () => void;
  suggestConfirm?: () => void;
}) {
  const route: any = useRoute();
  const dispatch = useDispatch<any>();
  const navigation = useNavigation();
  const fieldInfoService: any = useSelector(fieldInfoPersonalsSelector) || [];
  const [dataLayout, setDataLayout] = useState<any>([]);
  const [searchConditions, setSearchConditions] = useState<Array<any>>([]);
  const [searchConditionsRl, setSearchConditionsRl] = useState<Array<any>>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nameService, setNameService] = useState<string>();
  const [listIdSearchRelation, setListIdSearchRelation] = useState<any[]>([]);
  const [searchConditionsRelation, setSearchConditionsRelation] = useState<
    any[]
  >([]);
  const [listMapRelationId, setListMapRelationId] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisplayChild, setIsDisplayChild] = useState(false);
  const [specialValue, setSpecialValue] = useState<any>({});
  const [additionLayout, setAdditionLayout] = useState<any>({});
  const { suggestService, suggestClose, suggestConfirm } = props;
  const isSuggestSearch =
    suggestService !== null &&
    suggestService !== undefined &&
    suggestService !== TEXT_EMPTY;

  useEffect(() => {
    if (!modalVisible) {
      setIsLoading(true);
      getFieldInfoService();
      if (isSuggestSearch) {
        setNameService(suggestService);
      } else {
        setNameService(route?.params?.nameService);
      }
    }
  }, [route?.params?.nameService, isSuggestSearch, modalVisible]);

  useEffect(() => {
    return () => {
      dispatch(SearchActions.getFieldInfoService([]));
    };
  }, []);
  /**
   * get field belong for service
   */
  const handleField = () => {
    if (isSuggestSearch) {
      switch (suggestService) {
        case 'products':
          return FIELD_BELONG.PRODUCT;
        case 'employees':
          return FIELD_BELONG.EMPLOYEE;
        default:
          return FIELD_BELONG.EMPLOYEE;
      }
    } else {
      switch (route?.params?.nameService) {
        case 'products':
          return FIELD_BELONG.PRODUCT;
        case 'employees':
          return FIELD_BELONG.EMPLOYEE;
        case 'customers':
          return FIELD_BELONG.CUSTOMER;
        case 'productTrading':
          return FIELD_BELONG.PRODUCT_TRADING;
        default:
          return FIELD_BELONG.EMPLOYEE;
        
      }
    }
  };

  const getFieldInfoData = async (relationFieldId: any) => {
    let fieldBelong = handleField();
    if (fieldBelong) {
      const responseFieldInfo = await getFieldInfo(
        {
          fieldBelong: fieldBelong,
          fieldType: DefineFieldType.RELATION,
          fieldId: relationFieldId,
        },
        {}
      );
      return responseFieldInfo;
    }
  };

  /**
   * call api get field info personal service
   */
  const getFieldInfoService = async () => {
    Promise.all([
      getFieldInfoPersonal(
        {
          fieldBelong: handleField(),
          extensionBelong: 2,
          selectedTargetType: 0,
          selectedTargetId: 0,
        },
        {}
      ),
      getDataLayout(getUrlLayout(handleField()), {}, {}),
      getAdditionsServiceLayout(handleField())
    ]).then(
      async (values) => {
        if(JSON.stringify(values[2]) !== OBJECT_EMPTY){
          setAdditionLayout(values[2]);
        }
        const fieldInfoPersonals = values[0]?.data?.fieldInfoPersonals;
        fieldInfoPersonals.filter((item: FieldInfoItem) => {
          return !typeNotInclude.includes(item?.fieldType?.toString() || '');
        });
        if (values[0]?.status !== 200) {
          setIsLoading(false);
        }
        const listRelationId: any[] = [];
        fieldInfoPersonals.filter((itemRl: any) => {
          if (itemRl.relationFieldId) {
            listRelationId.push(itemRl.relationFieldId);
            if (!listMapRelationId.includes(itemRl.fieldId)) {
              listMapRelationId.push(itemRl.fieldId);
            }
          }
        });
        setListMapRelationId(listMapRelationId);

        let listUniqueRelationId = listRelationId.filter(function (
          elem: any,
          index: any,
          self: any
        ) {
          return index === self.indexOf(elem);
        });
        for (let index = 0; index < listUniqueRelationId.length; index++) {
          const relationFieldId = listUniqueRelationId[index];
          if (relationFieldId) {
            const fieldInfoRes = await getFieldInfoData(relationFieldId);
            if (fieldInfoRes) {
              fieldInfoPersonals.push(fieldInfoRes.data.fields[0]);
            }
          }
        }
        const fieldInfoPersonals1 = _.compact(fieldInfoPersonals)
        dispatch(SearchActions.getFieldInfoService(fieldInfoPersonals1));
        if (isSuggestSearch) {
          if (suggestService) {
            setDataLayout(values[1]?.data[DataLayoutName[suggestService]]);
          }
        } else {
          setDataLayout(
            values[1]?.data[DataLayoutName[route?.params?.nameService]]
          );
        }
        setIsLoading(false);
      },
      (reason) => {
        console.log('error', reason);
        setIsLoading(false);
      }
    );
  };

  function checkParams(searchRelations: any, fieldBelong: number) {
    const params = {
      searchLocal: '',
      limit: 5,
      isOnlyData: true,
    };
    const paramProducts = {
      searchConditions: searchRelations || [],
      orderBy: [],
      isOnlyData: true,
      filterConditions: [],
    };
    const paramEmployees = {
      orderBy: [],
      selectedTargetId: 0,
      selectedTargetType: 0,
      filterConditions: [],
      searchConditions: searchRelations || [],
      localSearchKeyword: '',
    };
    if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
      return paramEmployees;
    }
    if (fieldBelong === FIELD_BELONG.PRODUCT) {
      return paramProducts;
    }
    return params;
  }

  const renderFieldSpecial = (field: any) => {
    switch (handleField()) {
      case FIELD_BELONG.CUSTOMER:
        return (
          <RenderIsDisplayChildField
            isDisplayChild={isDisplayChild}
            onPressChoose={setIsDisplayChild}
            field={field}
          />
        );
      case FIELD_BELONG.PRODUCT_TRADING:
        return (
          <RenderTradingContactField
            days={specialValue?.fieldValue || ""}
            onPressChoose={(value:any)=>handleSpecialValue(field, value, "last_contact_date")}
            field={field}
          />
        );
      default:
        return <View />;
    }
  };

  const handleSpecialValue = (field: any, special: any, specialName?:string)=>{
    setSpecialValue({
        // fieldId: field.fieldId,
        fieldName: specialName || field.fieldName,
        fieldBelong: field.fieldBelong,
        fieldType: 99,
        fieldValue: parseInt(special),
        isDefault: field.isDefault,
        searchOption: 1,
        searchType: 1,
    
    })
  }

  const getRelationFieldName = (fieldName: any, fieldBelong: number) => {
    if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
      return `employee_data.${fieldName}`;
    }
    if (fieldBelong === FIELD_BELONG.PRODUCT) {
      return `product_data.${fieldName}`;
    }
    return `employee_data.${fieldName}`;
  };

  const getSearchRelationData = async (searchRelation: any) => {
    for (let index = 0; index < searchRelation.length; index++) {
      const conditionsRelation = searchRelation[index];
      const listFieldInfoSearch = conditionsRelation?.listFieldInfo;
      const relationFieldItem = fieldInfoService.find(
        (item: any) => item.fieldId === conditionsRelation?.fieldRelation
      );
      let pramSearch;
      switch (relationFieldItem?.relationData?.fieldBelong) {
        case FIELD_BELONG.PRODUCT:
          pramSearch = checkParams(
            customBuildSearchCondition(
              listFieldInfoSearch,
              FIELD_BELONG.PRODUCT
            ),
            FIELD_BELONG.PRODUCT
          );
          const responseProducts = await getProducts(pramSearch, {});

          if (responseProducts.status === 200) {
            let listProduct = responseProducts.data.dataInfo.products;
            let listProductId: any[] = [];
            for (let i = 0; i < listProduct.length; i++) {
              const product = listProduct[i];
              listIdSearchRelation.push(product.productId);
              listProductId.push(product.productId);
            }
            let valueSearch = listProductId.length > 0 ? listProductId : 0;
            searchConditionsRl.push({
              fieldId: relationFieldItem.fieldId,
              fieldName: getRelationFieldName(
                relationFieldItem.fieldName,
                handleField()
              ),
              fieldType: 17,
              fieldValue: '[' + valueSearch + ']',
              isDefault: false,
              searchOption: '1',
              searchType: '1',
            });
          }
          setListIdSearchRelation(listIdSearchRelation);
          setSearchConditionsRl(searchConditionsRl);
          break;
        case FIELD_BELONG.EMPLOYEE:
          pramSearch = checkParams(
            customBuildSearchCondition(
              listFieldInfoSearch,
              FIELD_BELONG.EMPLOYEE
            ),
            FIELD_BELONG.EMPLOYEE
          );
          const responsEmployees = await getEmployeeLists(pramSearch, {});
          if (responsEmployees.status === 200) {
            let listEmployeeId: any[] = [];
            let listEmployee = responsEmployees?.data?.employees;
            for (let i = 0; i < listEmployee.length; i++) {
              const employee = listEmployee[i];
              listIdSearchRelation.push(employee.employeeId);
              listEmployeeId.push(employee.employeeId);
            }
            let valueSearch = listEmployeeId.length > 0 ? listEmployeeId : 0;
            searchConditionsRl.push({
              fieldId: relationFieldItem.fieldId,
              fieldName: getRelationFieldName(
                relationFieldItem.fieldName,
                handleField()
              ),
              fieldType: 17,
              fieldValue: '[' + valueSearch + ']',
              isDefault: false,
              searchOption: '1',
              searchType: '1',
            });
          }
          setListIdSearchRelation(listIdSearchRelation);
          setSearchConditionsRl(searchConditionsRl);
          break;
        case FIELD_BELONG.CUSTOMER:
          getRelationCustomer(listFieldInfoSearch, relationFieldItem);
          break;
        default:
          break;
      }
    }
    return searchConditionsRl;
  };

  const getRelationCustomer = async (
    listFieldInfoSearch: any,
    relationFieldItem: any
  ) => {
    const pramSearch = checkParams(
      customBuildSearchCondition(listFieldInfoSearch, FIELD_BELONG.CUSTOMER),
      FIELD_BELONG.CUSTOMER
    );
    const responseCustomers = await getCustomers(pramSearch, {});
    if (responseCustomers.status === 200) {
      let listCustomerId: any[] = [];
      let listCustomers = responseCustomers?.data?.employees;
      for (let i = 0; i < listCustomers.length; i++) {
        const customer = listCustomers[i];
        listIdSearchRelation.push(customer.employeeId);
        listCustomerId.push(customer.employeeId);
      }
      let valueSearch = listCustomerId.length > 0 ? listCustomerId : 0;
      searchConditionsRl.push({
        fieldId: relationFieldItem.fieldId,
        fieldName: getRelationFieldName(
          relationFieldItem.fieldName,
          handleField()
        ),
        fieldType: 17,
        fieldValue: '[' + valueSearch + ']',
        isDefault: false,
        searchOption: '1',
        searchType: '1',
      });
    }
    setListIdSearchRelation(listIdSearchRelation);
    setSearchConditionsRl(searchConditionsRl);
  };
  /**
   * handle update fieldInfo
   * @param _key
   * @param _field
   * @param itemEdit
   */
  const handleUpdateElement = (key: any, _field: any, itemEdit: any) => {
    const search: Array<any> = [...searchConditions];
    const currentFieldId = itemEdit.fieldId;
    const indexSearch = search.findIndex((item: any) => {
      return item?.fieldId === currentFieldId;
    });
    itemEdit.fieldBelong = key.fieldBelong
    if (indexSearch < 0) {
      search.push(itemEdit);
    } else {
      search[indexSearch] = itemEdit;
    }
    setSearchConditions(search);
  };

  const customBuildSearchCondition = (
    searchRelationConditions: any,
    fieldBelong: number
  ) => {
    const conditions = [...searchRelationConditions];
    let trueConditions = [];
    for (let i = 0; i <= conditions.length - 1; i++) {
      const indexChoose = [...fieldInfoService].findIndex(
        (field: FieldInfoItem) => {
          return field.fieldId === conditions[i].fieldId;
        }
      );
      if (
        indexChoose >= 0 &&
        !checkEmptyValue(conditions[i].fieldValue, conditions[i].isSearchBlank)
      ) {
        const item: any = {};
        item.fieldId = conditions[i].fieldId;
        item.fieldName = StringUtils.camelCaseToSnakeCase(
          getFieldNameByServiceId(conditions[i], fieldBelong)
        );
        item.fieldType = conditions[i].fieldType;
        item.fieldValue = conditions[i].fieldValue;
        item.isDefault = conditions[i].isDefault;
        if (conditions[i].timeZoneOffset) {
          item.timeZoneOffset = conditions[i].timeZoneOffset;
        }
        if (
          conditions[i]?.fieldValue?.length > 0 &&
          (!!conditions[i]?.fieldValue[0]?.from ||
            conditions[i]?.fieldValue[0]?.from === TEXT_EMPTY)
        ) {
          item.fieldValue =
            typeof conditions[i].fieldValue[0] === 'string'
              ? conditions[i].fieldValue[0]
              : JSON.stringify(conditions[i].fieldValue[0]);
        } else if (typeof conditions[i].fieldValue === 'string') {
          item.fieldValue = conditions[i].fieldValue || '';
        } else {
          item.fieldValue = conditions[i].fieldValue
            ? JSON.stringify(conditions[i].fieldValue)
            : '';
        }
        if (conditions[i].searchOption) {
          item.searchOption = conditions[i].searchOption;
        } else {
          item.searchOption = 1;
        }
        if (conditions[i].searchType) {
          item.searchType = conditions[i].searchType;
        } else {
          item.searchType = 1;
        }
        if (conditions[i].isSearchBlank) {
          item.fieldValue = '';
        }
        trueConditions.push(item);
      }
    }
    return trueConditions;
  };

  /**
   * handle update fieldInfo
   * @param key
   * @param _field
   * @param itemEdit
   */
  const handleUpdateElementRelation = (
    fieldRelation: any,
    _field: any,
    fieldInfo: any
  ) => {
    const search = [...searchConditionsRelation];
    const currentFieldId = fieldRelation.relationFieldId;
    const indexSearch = search.findIndex(
      (item: any) => item?.fieldRelation === currentFieldId
    );
    if (indexSearch < 0) {
      search.push({
        fieldRelation: fieldRelation.relationFieldId,
        listFieldInfo: fieldInfo,
      });
    } else {
      search[indexSearch] = {
        fieldRelation: fieldRelation.relationFieldId,
        listFieldInfo: fieldInfo,
      };
    }
    setSearchConditionsRelation(search);
  };

  const checkEmptyValue = (value: any, isSearchBlank: boolean) => {
    return !isSearchBlank && _.isEmpty(value);
  };

  const buildSearchCondition = async () => {
    const conditions = [...searchConditions];
    let trueConditions:any = [];
    for (let i = 0; i <= conditions.length - 1; i++) {
      const indexChoose = [...fieldInfoService].findIndex(
        (field: FieldInfoItem) => {
          return field.fieldId === conditions[i].fieldId;
        }
      );
      if (
        indexChoose >= 0 &&
        !checkEmptyValue(conditions[i].fieldValue, conditions[i].isSearchBlank)
      ) {
        const item: any = {};
        item.fieldId = conditions[i].fieldId;
        item.fieldName = StringUtils.camelCaseToSnakeCase(
          getFieldName(conditions[i])
        );
        item.fieldType = conditions[i].fieldType;
        if (
          handleField() === FIELD_BELONG.PRODUCT_TRADING &&
          (item.fieldName === 'customer_id' ||
            item.fieldName === 'product_id' ||
            item.fieldName === 'employee_id' ||
            item.fieldName === 'created_user' ||
            item.fieldName === 'updated_user' ||
            item.fieldName === 'product_trading_progress_id')
        ) {
          item.fieldType = 99;
        }
        item.fieldValue = conditions[i].fieldValue;
        item.isDefault = conditions[i].isDefault;
        if (conditions[i].timeZoneOffset) {
          item.timeZoneOffset = conditions[i].timeZoneOffset;
        }
        if (
          conditions[i]?.fieldValue?.length > 0 &&
          (!!conditions[i]?.fieldValue[0]?.from ||
            conditions[i]?.fieldValue[0]?.from === TEXT_EMPTY)
        ) {
          item.fieldValue =
            typeof conditions[i].fieldValue[0] === 'string'
              ? conditions[i].fieldValue[0]
              : JSON.stringify(conditions[i].fieldValue[0]);
        } else if (typeof conditions[i].fieldValue === 'string') {
          item.fieldValue = conditions[i].fieldValue || '';
        } else {
          item.fieldValue = conditions[i].fieldValue
            ? JSON.stringify(conditions[i].fieldValue)
            : '';
        }
        if (conditions[i].searchOption) {
          item.searchOption = conditions[i].searchOption;
        } else {
          item.searchOption = 1;
        }
        if (conditions[i].searchType) {
          item.searchType = conditions[i].searchType;
        } else {
          item.searchType = 1;
        }
        if (conditions[i].isSearchBlank) {
          item.fieldValue = '';
        }
        item.fieldBelong = conditions[i].fieldBelong;
        trueConditions.push(item);
      }
    }
    if(isDisplayChild){
      const displayChildItem = fieldInfoService.find((el:any)=>{
        return el.fieldName === "is_display_child_customers"
      })
      trueConditions.push(displayChildCondition(displayChildItem))
    }
    if(JSON.stringify(specialValue) !== OBJECT_EMPTY){
      trueConditions.push(specialValue);
    }
    trueConditions = await getAdditionServiceId(trueConditions, handleField());
    return trueConditions;
  };

  const getFieldName = (field: FieldInfoItem) => {
    switch (nameService) {
      case ServiceName.employees:
        return getFieldNameElastic(
          field,
          ExtensionName[nameService || ServiceName.employees] || ''
        );
      case ServiceName.products:
        return getFieldNameProduct(field);
      default:
        return field.fieldName;
    }
  };

  const getFieldNameByServiceId = (
    field: FieldInfoItem,
    fieldBelong: number
  ) => {
    switch (fieldBelong) {
      case FIELD_BELONG.EMPLOYEE:
        return getFieldNameElastic(
          field,
          ExtensionName[nameService || ServiceName.employees] || ''
        );
      case FIELD_BELONG.PRODUCT:
        return getFieldNameProduct(field);
      case FIELD_BELONG.CUSTOMER:
        return getFieldNameCustomer(field);
      default:
        return field.fieldName;
    }
  };

  /**
   * convert fieldType 99
   * @param field
   */
  const convertFieldInfo = (field: FieldInfoItem, dataLayoutService?: any) => {
    const item = { ...field };
    switch (item.fieldBelong) {
      case FIELD_BELONG.EMPLOYEE:
        return getFieldTypeSpecial(item, dataLayoutService);
      case FIELD_BELONG.PRODUCT:
        return specialInfoProduct(item, dataLayoutService);
      case FIELD_BELONG.CUSTOMER:
        return specialInfoCustomer(item, dataLayoutService);
      case FIELD_BELONG.PRODUCT_TRADING:
        return specialInfoProductManage(item, dataLayoutService);
      default:
        return item;
    }
  };

  /**
   * convert fieldType 99
   * @param field
   */
  const convertFieldInfoCustom = (
    field: FieldInfoItem,
    fieldBelongCv: number,
    dataLayoutService?: any
  ) => {
    const item = { ...field };
    switch (fieldBelongCv) {
      case FIELD_BELONG.EMPLOYEE:
        return getFieldTypeSpecial(item, dataLayoutService);
      case FIELD_BELONG.PRODUCT:
        return specialInfoProduct(item, dataLayoutService);
      default:
        return item;
    }
  };

  const findExtensionData = (field: any) => {
    if (handleField() === FIELD_BELONG.PRODUCT) {
      return dataLayout?.dataInfo;
    }
    if (handleField() === FIELD_BELONG.PRODUCT_TRADING) {
      return dataLayout;
    }
    if (dataLayout?.length === 0) {
      return { ...field };
    }
    const itemLayout = [...dataLayout].find((item: any) => {
      return item.fieldName === field.fieldName;
    });
    return itemLayout || { ...field };
  };

  const handlePressSearch = async () => {
    let listId = await getSearchRelationData(searchConditionsRelation);
    let conditonDefault = await buildSearchCondition();
    if (listId[0]) {
      conditonDefault.push(listId[0]);
    }
    dispatch(SearchActions.getSearchConditions(conditonDefault));
    if (!isSuggestSearch) {
      navigation.goBack();
    } else {
      if (suggestConfirm) {
        suggestConfirm();
      }
    }
  };

  /**
   * render search modal
   */
  const renderSearch = () => {
    return (
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={FieldSearchTextStyles.modalContainer}>
          <TouchableOpacity
            style={FieldSearchTextStyles.modalHeader}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          />
          <View style={DetailScreenStyle.modalContainer}>
            <SettingModal
              fieldBelong={handleField()}
              onCloseModal={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={DetailScreenStyle.container}>
      {/* render header screen */}
      {isSuggestSearch ? (
        <Header
          title={translate(messages.screenTitle)}
          onLeftPress={suggestClose}
          onRightPress={handlePressSearch}
          nameButton={translate(messages.headerButton)}
        />
      ) : (
        <Header
          title={translate(messages.screenTitle)}
          onLeftPress={() => navigation.goBack()}
          onRightPress={handlePressSearch}
          nameButton={translate(messages.headerButton)}
        />
      )}
      <ScrollView style={DetailScreenStyle.content}>
        {/* render setting fieldInfo */}
        <View style={DetailScreenStyle.settingContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={DetailScreenStyle.settingButton}
          >
            <Text style={DetailScreenStyle.settingText}>
              {translate(messages.buttonSetting)}
            </Text>
          </TouchableOpacity>
        </View>
        {/* render list fieldInfo personal */}
        {fieldInfoService?.length > 0 && !isLoading ? (
          <FlatList
            data={fieldInfoService || []}
            extraData={fieldInfoService}
            renderItem={({ item }: any) => {
              let field  = convertFieldInfo(item, findExtensionData(item))
              if(item.fieldBelong !== handleField()){
                 field = convertFieldInfo(item, additionLayout[item.fieldBelong.toString()])
              }
              if (item?.fieldType?.toString() === DefineFieldType.RELATION) {
                const fieldInfoRelation = fieldInfoService.filter(
                  (itemRl: any) => {
                    if (
                      itemRl?.relationFieldId &&
                      item?.fieldId === itemRl?.relationFieldId
                    ) {
                      listIdSearchRelation.push(itemRl.fieldId);
                    }
                    return item?.fieldId === itemRl?.relationFieldId;
                  }
                );
                let fieldInfoRelationCV: any[] = [];
                for (let i = 0; i < fieldInfoRelation.length; i++) {
                  const fieldInfo = fieldInfoRelation[i];
                  if (fieldInfo) {
                    const fieldInfoCV = convertFieldInfoCustom(
                      fieldInfo,
                      fieldInfo?.fieldBelong,
                      findExtensionData(fieldInfo)
                    );
                    if (fieldInfoCV) {
                      fieldInfoRelationCV.push(fieldInfoCV);
                    }
                  }
                }
                setListIdSearchRelation(listIdSearchRelation);
                return !!field ? (
                  <View
                    key={item?.fieldId?.toString()}
                    style={DetailScreenStyle.itemDynamicReLation}
                  >
                    <DynamicControlField
                      controlType={ControlType.SEARCH}
                      fieldInfo={field}
                      updateStateElement={handleUpdateElementRelation}
                      listFieldInfo={fieldInfoRelationCV}
                    />
                  </View>
                ) : (
                  <></>
                );
              } else {
                let isRelationView = listMapRelationId.find((fieldId) => {
                  return fieldId.toString() === item?.fieldId.toString();
                });
                if (handleField() === FIELD_BELONG.CUSTOMER && item?.fieldName === 'is_display_child_customers') {
                  return (
                    <View
                      key={item?.fieldId?.toString()}
                      style={DetailScreenStyle.itemDynamic}
                    >
                      {renderFieldSpecial(item)}
                    </View>
                  );
                }
                if (
                  handleField() === FIELD_BELONG.PRODUCT_TRADING &&
                  item?.fieldBelong === FIELD_BELONG.ACTIVITY &&
                  item?.fieldName === 'contact_date'
                ) {
                  return (
                    <View
                      key={item?.fieldId?.toString()}
                      style={DetailScreenStyle.itemDynamic}
                    >
                      {renderFieldSpecial(item)}
                    </View>
                  );
                }
                return !!field && !isRelationView ? (
                  <View
                    key={item?.fieldId?.toString()}
                    style={DetailScreenStyle.itemDynamic}
                  >
                    <DynamicControlField
                      controlType={ControlType.SEARCH}
                      fieldInfo={field}
                      updateStateElement={handleUpdateElement}
                    />
                  </View>
                ) : (
                  <></>
                );
              }
            }}
          />
        ) : (
          <View style={{ flex: 1, paddingTop: '25%' }}>
            {isLoading ? ActivityIndicatorLoading(isLoading) : <View />}
          </View>
        )}
      </ScrollView>
      {renderSearch()}
    </SafeAreaView>
  );
}
