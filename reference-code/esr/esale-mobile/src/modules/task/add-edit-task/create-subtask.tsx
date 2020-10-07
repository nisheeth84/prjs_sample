import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import * as DocumentPicker from 'expo-document-picker';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { AppbarCommon } from '../../../shared/components/appbar/appbar-common';
import { appImages, theme } from '../../../config/constants';
import { Icon } from '../../../shared/components/icon';
import { messages } from './create-task-messages';
import { translate } from '../../../config/i18n';
import { MultiSelect } from '../../../shared/components/multiselect';

import {
  getSubTaskSelector,
  taskLayoutFieldInfoSelector,
} from './create-task-selector';

import { styles } from './create-task-style';
import {
  DUMMY_CUSTOMER,
  DUMMY_PRODUCT_TRADING,
  DUMY_MILESTONE,
} from './data-dumy';
import {
  DATA_TASK_CREATE_EMPTY,
  createTask,
  getTaskDetail,
  getTaskLayout,
  updateTaskDetail,
} from '../task-repository';
import { createTaskActions } from './create-task-reducer';
import { CommonStyles } from '../../../shared/common-style';
import { ModalOption } from '../../../shared/components/modal-option';
import { authorizationSelector } from '../../login/authorization/authorization-selector';
import { FieldInfoItem } from '../../../config/constants/field-info-interface';
import { DynamicControlField } from '../../../shared/components/dynamic-form/control-field/dynamic-control-field';
import {
  AvailableFlag,
  ControlType,
  DefineFieldType,
  IndexChoiceSuggestion,
  KeySearch,
  TypeSelectSuggest,
  ModifyFlag,
} from '../../../config/constants/enum';
import { EditTaskRouteProp } from '../../../config/constants/root-stack-param-list';
import { EnumFmDate } from '../../../config/constants/enum-fm-date';
import { TEXT_EMPTY } from '../../../config/constants/constants';

import { FormInput } from '../../../shared/components/form-input';
import { checkTaskAndSubTaskComplete } from '../utils';
import { EmployeeSuggestView } from '../../../shared/components/suggestions/employee/employee-suggest-view';
import { TYPE_MEMBER } from '../../../config/constants/query';
import StringUtils from '../../../shared/util/string-utils';
import { responseMessages } from '../../../shared/messages/response-messages';
import { CommonMessage } from '../../../shared/components/message/message';
import { TypeMessage } from '../../../config/constants/enum';

export const CreateSubTask = () => {
  const authorization = useSelector(authorizationSelector);
  const [searchCustomer, setSearchCustomer] = React.useState(TEXT_EMPTY);
  const [mode, setMode] = React.useState(ControlType.ADD);
  const [isVisibleCustomer, setIsVisibleCustomer] = React.useState(false);
  const [taskDetail, setTaskDetail] = useState<any>({});
  const taskFieldInfoAdd = useSelector(taskLayoutFieldInfoSelector);
  const [taskFieldInfo, setTaskFieldInfo] = useState<any>([]);

  const [enableScrollViewScroll, setEnableScrollViewScroll] = React.useState(
    true
  );
  /**
   * message success
   */
  const textEmpty = {
    content: TEXT_EMPTY,
    type: TEXT_EMPTY,
  };

  const [message, setMessage] = useState([textEmpty]);

  const [suggestionsChoice] = useState({
    departments: [],
    employees: [
      {
        employeeId: authorization.employeeId,
        participantType: TYPE_MEMBER.OWNER,
      },
    ],
    groups: [],
  });
  const [searchTradingProduct, setSearchTradingProduct] = React.useState(
    TEXT_EMPTY
  );
  const [isVisibleTradingProduct, setVisibleTradingProduct] = React.useState(
    false
  );
  const [addMilestone, setAddMilestone] = React.useState(TEXT_EMPTY);
  const [isVisibleAddMilestone, setIsVisibleAddMilestone] = React.useState(
    false
  );
  const dispatch = useDispatch();
  const [params, setParams] = React.useState<any>(DATA_TASK_CREATE_EMPTY);
  const route = useRoute<EditTaskRouteProp>();
  const [openModal, setOpenModal] = useState(false);
  const [validateValue] = useState<Array<any>>([]);
  const [messError, setMessError] = useState([]);
  const dataSubTaskSelector = useSelector(getSubTaskSelector);
  const [onPressBtn] = useState(false);

  const handleChooseEmployee = (value: any) => {
    const newParams = { ...params };
    const newArray: any = [];
    if (value?.length > 0) {
      [...value].forEach((element: any) => {
        newArray.push({
          departmentId:
            element.indexChoice === IndexChoiceSuggestion.DEPARTMENT
              ? element.itemId
              : null,
          employeeId:
            element.indexChoice === IndexChoiceSuggestion.EMPLOYEE
              ? element.itemId
              : null,
          groupId:
            element.indexChoice === IndexChoiceSuggestion.GROUP
              ? element.itemId
              : null,
        });
      });
    }
    newParams.operators = newArray;
    setParams(newParams);
  };

  const getDataTaskDetail = async () => {
    const paramsGetDetail = {
      taskId: route?.params?.taskId,
    };
    const response = await getTaskDetail(paramsGetDetail, {});

    if (response?.status === 200 && response?.data) {
      // dispatch(createTaskActions.getTaskDetail(response.data));
      // setParams(response.data.dataInfo.task);
      setTaskFieldInfo(response?.data?.fieldInfo);

      setTaskDetail(response?.data?.dataInfo?.task);
    }
  };

  const getDataTaskLayout = async () => {
    const response = await getTaskLayout({});
    if (response?.status === 200 && response?.data) {
      dispatch(createTaskActions.getTaskLayout(response?.data));
      setTaskFieldInfo(taskFieldInfoAdd);
    }
  };

  useEffect(() => {
    !route?.params?.taskId || getDataTaskDetail();
  }, []);

  useEffect(() => {
    const getDataAdd = () => {
      getDataTaskLayout();
      setMode(ControlType.ADD);
    };

    const getDataEdit = () => {
      getDataTaskDetail();
      setMode(ControlType.EDIT);
    };

    const getDataCopy = () => {
      getDataTaskDetail();
      setMode(ControlType.COPY);
    };

    switch (route?.params?.type) {
      case ControlType.EDIT:
        getDataEdit();
        break;
      case ControlType.ADD:
        getDataAdd();
        break;
      case ControlType.COPY:
        getDataCopy();
        break;
      default:
        if (route?.params?.taskId) {
          getDataEdit();
        } else {
          getDataAdd();
        }
    }
  }, [route?.params?.taskId, route?.params?.type]);

  useEffect(() => {
    if (route?.params?.customerId && route?.params?.milestoneId) {
      const param = _.cloneDeep(params);
      param.customers = [
        {
          customerId: route?.params?.customerId,
          customerName: route?.params?.customerName,
        },
      ];
      param.milestoneId = route?.params?.milestoneId;
      param.milestoneName = route?.params?.milestoneName;

      setParams(param);
    }
  }, [route?.params?.customerId, route?.params?.milestoneId]);

  useEffect(() => {
    setParams({
      taskId: taskDetail.taskId || TEXT_EMPTY,
      taskName: taskDetail.taskName || TEXT_EMPTY,
      statusTaskId: taskDetail.statusTaskId || 1,
      customers: taskDetail.customers || [],
      startDate: taskDetail.startDate || null,
      finishDate: taskDetail.finishDate || null,
      memo: taskDetail.memo || null,
      isPublic: taskDetail.isPublic || 0,
      productTradingIds: taskDetail.productTradings || [],
      operators: taskDetail.operators || [
        {
          departmentId: null,
          employeeId: authorization.employeeId,
          groupId: null,
        },
      ],
      milestoneId: taskDetail.milestoneId || null,
      milestoneName: taskDetail.milestoneName || null,
      // taskData: taskDetail.taskData || [],
      taskData: [],
      parentTaskId: taskDetail.parentTaskId || null,
      updateFlg: null,
      updatedDate: taskDetail.refixDate || null,
    });
  }, [taskDetail]);

  const navigation = useNavigation();

  const chooseItemCustomer = (item: any) => {
    changeArrayProperty('customers', item);
    setIsVisibleCustomer(false);
    setEnableScrollViewScroll(true);
  };
  const chooseItemProductTrading = (item: any) => {
    changeArrayProperty('productTradingIds', item);
    setVisibleTradingProduct(false);
    setEnableScrollViewScroll(true);
  };
  const chooseItemMilestone = (item: any) => {
    changeMileStoneValue(item);
    setIsVisibleAddMilestone(false);
    setEnableScrollViewScroll(true);
  };

  const pickDocument = async () => {
    const result: any = await DocumentPicker.getDocumentAsync({});
    if (result?.name) {
      const item: any = {
        fileData: result.uri,
        fileName: result.name,
      };
      changeArrayProperty('files', item);
    }
  };

  const renderItemFile = (item: any) => {
    return (
      <View style={styles.containerItem}>
        <Text numberOfLines={1} style={styles.txtItem}>
          {item.item.fileName}
        </Text>
        <TouchableOpacity
          onPress={() => changeArrayProperty('files', item.item, item.index)}
          style={styles.btnItem}
        >
          <AntDesign name="closecircleo" size={18} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  const addTask = async (updateFlg: any = null) => {
    setMessError([]);
    if (!!updateFlg && checkTaskAndSubTaskComplete(params, false)) {
      setOpenModal(true);
    } else {
      const formData = new FormData();
      if (route?.params?.type === ControlType.ADD) {
        delete params.taskId;
      }
      delete params.files;
      delete params.milestoneFinishDate;
      // delete params.memo;
      delete params.subtasks;
      // TODO: status change api check web
      delete params.status;
      delete params.newValue;
      delete params.taskId;
      params.fileNameOlds = [];
      params.parentTaskId = null;
      params.updateFlg = null;
      params.updatedDate = null;

      formData.append('data', JSON.stringify(params));
      const responseCreateTask = await createTask(formData, {});

      if (responseCreateTask.status === 200) {
        params['taskId'] = responseCreateTask.data.taskId;
        const subTaskArr = [...dataSubTaskSelector, params];

        dispatch(createTaskActions.getSubTask(subTaskArr));

        setMessage([
          {
            content: translate(responseMessages.INF_COM_0004),
            type: TypeMessage.SUCCESS,
          },
        ]);
        setTimeout(() => {
          setMessage([textEmpty]);
          navigation.goBack();
        }, 2000);
      } else {
        // alert("Error!");
        setMessError(responseCreateTask?.data?.parameters?.extensions?.errors);
      }
    }
  };

  const updateSubTask = async (updateFlg: any = null) => {
    if (!!updateFlg && checkTaskAndSubTaskComplete(params, false)) {
      setOpenModal(true);
    } else {
      const formData = new FormData();

      if (route?.params?.type !== ControlType.EDIT) {
        delete params.taskId;
      }
      delete params.files;
      delete params.milestoneFinishDate;
      // delete params.memo;
      delete params.subtasks;
      delete params.newValue;
      delete params.taskAttachedFileId;
      params.subTasks = [];
      // delete params.taskName;

      params.fileNameOlds = [];
      // params.parentTaskId = null;
      // params.updateFlg = null;
      // params.updatedDate = null;
      formData.append('taskId', taskDetail.taskId);
      delete params.taskId;
      formData.append('data', JSON.stringify(params));
      const responseCreateTask = await updateTaskDetail(formData, {});

      if (responseCreateTask.status === 200) {
        // dispatch(createTaskActions.getSubTask(params));

        setMessage([
          {
            content: translate(responseMessages.INF_COM_0004),
            type: TypeMessage.SUCCESS,
          },
        ]);
        setTimeout(() => {
          setMessage([textEmpty]);
          navigation.goBack();
        }, 2000);
      } else {
        alert('Error!');
      }
    }
  };

  const changeArrayProperty = (
    fieldName: string,
    item: any,
    index?: number
  ) => {
    const newParams: any = { ...params };

    const newArray = newParams[fieldName] ? [...newParams[fieldName]] : [];
    if (index || index === 0) {
      newArray.splice(index, 1);
    } else {
      newArray.push(item);
    }

    changePropertyParams(fieldName, newArray, index);
  };

  const renderChooseCustomer = (item: any, index: any) => {
    return (
      <View style={styles.containerChooseCustomer}>
        <View style={styles.contentItemSelect}>
          <Text numberOfLines={1} style={styles.txtContentBtn}>
            {item.parentCustomerName}
          </Text>
          <TouchableOpacity
            onPress={() => {
              changeArrayProperty('customers', item, index);
              setIsVisibleCustomer(false);
            }}
          >
            <Icon name="close" />
          </TouchableOpacity>
        </View>
        <Text numberOfLines={1} style={styles.txtContentBtn}>
          {item.customerName}
        </Text>
        <Text numberOfLines={1} style={styles.txtContentBtn}>
          {item.customerAddress}
        </Text>
      </View>
    );
  };
  // const renderChooseMilestone = () => {
  //   const endDate = moment(params.milestoneFinishDate).format(
  //     EnumFmDate.YEAR_MONTH_DAY_NORMAL
  //   );
  //   return (
  //     <View style={styles.containerChooseMilestone}>
  //       <View style={styles.contentItemSelect}>
  //         <Text numberOfLines={1} style={styles.txtContentBtn}>
  //           {params.milestoneName}
  //         </Text>
  //         <TouchableOpacity
  //           onPress={() => changePropertyParams('milestoneId', null, 0)}
  //         >
  //           <Icon name="close" />
  //         </TouchableOpacity>
  //       </View>
  //       <Text numberOfLines={1} style={styles.txtContentBtn}>
  //         {endDate}
  //       </Text>
  //     </View>
  //   );
  // };
  const renderChooseProductTrading = (item: any, index: any) => {
    return (
      <View style={styles.containerChooseProductTrading}>
        <Image source={appImages.iconCart1} style={styles.imgProductTrading} />
        <View style={styles.flex205}>
          <View style={styles.contentItemSelect}>
            <Text style={styles.txtContentBtn}>{item.productName}</Text>
            <TouchableOpacity
              onPress={() => {
                changeArrayProperty('productTradingIds', item, index);
              }}
            >
              <Icon name="close" />
            </TouchableOpacity>
          </View>
          <Text style={styles.txtContentBtn}>{item.unitPrice}</Text>
          <Text style={styles.txtContentBtn}>{item.memo}</Text>
        </View>
      </View>
    );
  };
  const renderItemProductTrading = (item: any) => {
    return (
      <TouchableOpacity
        style={styles.btnProductTrading}
        onPress={() => chooseItemProductTrading(item)}
      >
        <Image source={appImages.iconCart1} style={styles.imgProductTrading} />
        <View style={styles.flex205}>
          <View style={CommonStyles.row}>
            {item.productCategories?.map((elm: any, idx: any) => {
              return (
                <Text style={styles.txtContentBtn}>
                  {elm.productCategoryName.ja_jp}{' '}
                  {item.productCategories.length - 1 !== idx && '- '}
                </Text>
              );
            })}
          </View>
          <Text style={styles.txtContentBtn}>{item.productName}</Text>
          <Text style={styles.txtContentBtn}>{item.unitPrice}</Text>
          <Text style={styles.txtContentBtn}>{item.memo}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const changePropertyParams = (
    propertyName: string,
    newValue: any,
    fieldItem: any
  ) => {
    const newParams: any = { ...params, newValue };
    if (!!route?.params?.taskId && (!taskDetail || taskDetail === {})) {
      return;
    }
    if (_.isEmpty(newValue) && fieldItem.modifyFlag > 1) {
      if (validateValue.indexOf(fieldItem.fieldName) < 0) {
        validateValue.push(fieldItem.fieldName);
      }
    } else {
      const index = validateValue.indexOf(fieldItem.fieldName);

      if (index > -1) {
        validateValue.splice(index, 1);
      }
    }

    switch (propertyName) {
      case 'status':
        newParams.statusTaskId = newValue;
        break;
      case 'taskName':
        newParams.taskName = newValue;
        break;
      case 'finishDate':
        // TODO: user tzToUtc -> Err
        newParams.finishDate = '2020-08-14T05:00:00.000Z';
        // newParams.finishDate = !newValue || tzToUtc(newValue + "00:00", authorization?.timezoneName || DEFAULT_TIMEZONE, authorization?.formatDate || FORMAT_DATE.YYYY_MM_DD);

        break;
      default:
        newParams[propertyName] = newValue;
        break;
    }

    setParams(newParams);
  };

  const changeMileStoneValue = (mileStone: any) => {
    const newParams: any = { ...params };
    newParams.milestoneId = mileStone.milestoneId;
    newParams.milestoneName = mileStone.milestoneName;
    newParams.milestoneFinishDate = mileStone.milestoneFinishDate;

    setParams(newParams);
  };

  const renderItemCustomer = (item: any) => {
    return (
      <TouchableOpacity
        style={CommonStyles.padding2}
        onPress={() => chooseItemCustomer(item)}
      >
        <Text style={styles.txtContentBtn}>{item.parentCustomerName}</Text>
        <Text style={styles.txtContentBtn}>{item.customerName}</Text>
        <Text style={styles.txtContentBtn}>{item.customerAddress}</Text>
      </TouchableOpacity>
    );
  };
  const renderItemMilestone = (item: any) => {
    const endDate = moment(item.milestoneFinishDate).format(
      EnumFmDate.YEAR_MONTH_DAY_NORMAL
    );
    return (
      <TouchableOpacity
        style={CommonStyles.padding2}
        onPress={() => chooseItemMilestone(item)}
      >
        <Text style={styles.txtContentBtn}>{item.milestoneName}</Text>
        <Text style={styles.txtContentBtn}>{endDate}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (!params?.milestoneId) {
      const newParams = { ...params };
      newParams.milestoneName = TEXT_EMPTY;

      setParams(newParams);
    }
  }, [params?.milestoneId]);

  const findExtensionItem = (fieldName: any, extensionData: any) => {
    if ((extensionData || []).length === 0) {
      return null;
    }
    const item = extensionData.find((el: any) => {
      return el.key === fieldName;
    });
    return item?.value || null;
  };

  const getElementStatus = (fieldItem: any) => {
    const data: any = _.cloneDeep(taskDetail);

    return {
      fieldValue: fieldItem.isDefault
        ? data[StringUtils.snakeCaseToCamelCase(fieldItem.fieldName)]
        : findExtensionItem(fieldItem.fieldName, data.taskData || []),
    };

    // return { fieldValue: data[camelCase(fieldItem.fieldName)] };
  };

  const renderFieldInfo = (fieldItem: FieldInfoItem) => {
    if (
      fieldItem.availableFlag === AvailableFlag.NOT_AVAILABLE ||
      fieldItem.fieldType?.toString() == DefineFieldType.LOOKUP ||
      fieldItem.modifyFlag === ModifyFlag.READ_ONLY
    ) {
      return;
    }

    if (fieldItem.fieldType === Number(DefineFieldType.OTHER)) {
      switch (fieldItem.fieldName) {
        case 'customer_name':
          return (
            <View style={styles.viewItemContent}>
              <Text style={styles.txtTitle}>
                {translate(messages.customerName)}
              </Text>
              <MultiSelect
                placeholder={translate(messages.inputCustomerName)}
                value={searchCustomer}
                isVisible={isVisibleCustomer}
                onChangeText={(text: string) => {
                  setSearchCustomer(text);
                  setIsVisibleCustomer(true);
                }}
                dataList={DUMMY_CUSTOMER.customers}
                renderItem={({ item }: any) => renderItemCustomer(item)}
                onTouchStart={() => setEnableScrollViewScroll(false)}
                onMomentumScrollEnd={() => setEnableScrollViewScroll(true)}
                onPressDelete={() => {
                  setSearchCustomer(TEXT_EMPTY);
                  setIsVisibleCustomer(false);
                  setEnableScrollViewScroll(true);
                }}
              />
              <FlatList
                data={params.customers}
                renderItem={({ item, index }) =>
                  renderChooseCustomer(item, index)
                }
                numColumns={2}
              />
            </View>
          );
        // co the param params.productTradings da bi backend thay doi thanh productTradingIds, ae lam sau neu bi crash chú ý ko quạo
        case 'product_name':
          return (
            <View style={styles.viewItemContent}>
              <Text style={styles.txtTitle}>
                {translate(messages.tradingProduct)}
              </Text>
              <MultiSelect
                placeholder={translate(messages.inputTradingProduct)}
                value={searchTradingProduct}
                isVisible={isVisibleTradingProduct}
                onChangeText={(text: string) => {
                  setSearchTradingProduct(text);
                  setVisibleTradingProduct(true);
                }}
                dataList={DUMMY_PRODUCT_TRADING.products}
                renderItem={({ item }: any) => renderItemProductTrading(item)}
                onTouchStart={() => setEnableScrollViewScroll(false)}
                onMomentumScrollEnd={() => setEnableScrollViewScroll(true)}
                onPressDelete={() => {
                  setSearchTradingProduct(TEXT_EMPTY);
                  setVisibleTradingProduct(false);
                  setEnableScrollViewScroll(true);
                }}
              />
              {params.productTradings?.map((elm: any, idx: any) => {
                return renderChooseProductTrading(elm, idx);
              })}
            </View>
          );
        default:
          return;
      }
    }

    if (fieldItem.fieldName == 'milestone_name') {
      return (
        <View style={styles.viewItemContent}>
          <Text style={styles.txtTitle}>{translate(messages.milestone)}</Text>
          <MultiSelect
            placeholder={translate(messages.addMilestone)}
            value={addMilestone}
            isVisible={isVisibleAddMilestone}
            onChangeText={(text: string) => {
              setAddMilestone(text);
              setIsVisibleAddMilestone(true);
            }}
            dataList={DUMY_MILESTONE.milestones}
            renderItem={({ item }: any) => renderItemMilestone(item)}
            onTouchStart={() => setEnableScrollViewScroll(false)}
            onMomentumScrollEnd={() => setEnableScrollViewScroll(true)}
            onPressDelete={() => {
              setAddMilestone(TEXT_EMPTY);
              setIsVisibleAddMilestone(false);
              setEnableScrollViewScroll(true);
            }}
          />
          {/* {params.milestoneId && renderChooseMilestone()} */}
        </View>
      );
    }

    if (fieldItem.fieldName == 'operator_id') {
      return (
        <View style={styles.viewItemContent}>
          <EmployeeSuggestView
            typeSearch={TypeSelectSuggest.MULTI}
            groupSearch={KeySearch.NONE}
            invisibleLabel={false}
            suggestionsChoice={suggestionsChoice}
            fieldLabel={JSON.parse(fieldItem?.fieldLabel || '').ja_jp || ''}
            updateStateElement={handleChooseEmployee}
          />
        </View>
      );
    }

    if (fieldItem.fieldType === Number(DefineFieldType.FILE)) {
      return (
        <View style={styles.viewItemContent}>
          <Text style={styles.txtTitle}>{translate(messages.addFile)}</Text>
          <TouchableOpacity style={styles.btnAddFile} onPress={pickDocument}>
            <Icon name="plusGray" />
            <Text style={styles.txtAddFile}>
              {translate(messages.clickOrDropFile)}
            </Text>
          </TouchableOpacity>
          <FlatList
            style={styles.listFile}
            data={params.files}
            extraData={params.files}
            renderItem={(item) => renderItemFile(item)}
          />
        </View>
      );
    }

    return (
      <View style={styles.viewItemContent}>
        <DynamicControlField
          listFieldInfo={taskFieldInfo}
          controlType={ControlType.ADD_EDIT}
          fieldInfo={fieldItem}
          isDisabled={fieldItem.modifyFlag == 0}
          extensionData={params.taskData}
          elementStatus={getElementStatus(fieldItem)}
          errorInfo={
            validateValue.includes(fieldItem.fieldName) && onPressBtn
              ? { errorMsg: 'error' }
              : {}
          }
          updateStateElement={(
            // keyElement: string | any,
            // type: string | any,
            objEditValue: string | any
          ) => {
            changePropertyParams(
              StringUtils.snakeCaseToCamelCase(fieldItem?.fieldName || ''),
              objEditValue,
              fieldItem
            );
          }}
        />
      </View>
    );
  };

  const returnContentErr = () => {
    let arr = '';
    {
      messError?.forEach((i: any) => {
        const mes =
          translate(responseMessages[i.errorCode]) ||
          translate(responseMessages.ERR_COM_0001);
        arr = arr ? arr + '\n' + '\n' + mes : mes;
      });
    }
    return arr;
  };

  const renderBottomElement = (title: string, value: string) => {
    return (
      <View>
        <Text style={{ marginHorizontal: 16, marginVertical: 5, fontWeight: 'bold', color: 'black' }}>
          {title}
        </Text>
        <Text style={{ marginHorizontal: 16, marginVertical: 5 }}>
          {value}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AppbarCommon
        title={translate(
          mode == ControlType.ADD ? messages.createTask : messages.editTask
        )}
        buttonText={translate(messages.registration)}
        styleTitle={styles.appbarTitle}
        containerStyle={styles.bgGray400}
        onPress={() => (mode == ControlType.ADD ? addTask() : updateSubTask())}
        buttonType="complete"
      />
      <ScrollView
        style={styles.container}
        scrollEnabled={enableScrollViewScroll}
        keyboardShouldPersistTaps="handled"
      >
        {!returnContentErr() || (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              marginVertical: 5,
            }}
          >
            <CommonMessage
              type={TypeMessage.ERROR}
              content={returnContentErr()}
            />
          </View>
        )}
        {/* <Text style={styles.txtMessRequired}>
        {translate(messages.thisRequiredItem)}
      </Text> */}
        {(route?.params?.type === ControlType.ADD || !_.isEmpty(taskDetail)) &&
          [...taskFieldInfo]
            ?.sort((a: any, b: any) => a.fieldOrder - b.fieldOrder)
            .map((fieldInfo) => {
              return renderFieldInfo(fieldInfo);
            })}
        <ModalOption
          visible={openModal}
          titleModal={translate(messages.confirm)}
          contentModal={translate(messages.completeTaskUnfinishSubtask)}
          contentBtnFirst={translate(messages.completeSubtask)}
          contentBtnSecond={translate(messages.convertSubTaskToTask)}
          txtCancel={translate(messages.cancel)}
          closeModal={() => {
            setOpenModal(false);
          }}
          onPressFirst={() => {
            addTask(3);
          }}
          onPressSecond={() => {
            addTask(4);
          }}
        />
        {taskDetail && (
          <>
            {renderBottomElement(translate(messages.registrationDate), taskDetail?.registDate)}
            {renderBottomElement(translate(messages.lastUpdate), taskDetail?.registPersonName)}
            {renderBottomElement(translate(messages.regisPerson), taskDetail?.refixDate)}
            {renderBottomElement(translate(messages.lastUpdateBy), taskDetail?.refixPersonName)}
          </>
        )}
      </ScrollView>
      {message[0].type == TypeMessage.SUCCESS && (
        <View style={styles.boxMessageSuccess}>
          <CommonMessage content={message[0].content} type={message[0].type} />
        </View>
      )}
    </View>
  );
};
