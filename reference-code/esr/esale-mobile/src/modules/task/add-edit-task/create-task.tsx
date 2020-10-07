import React, { useState, useEffect, useRef } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute, StackActions } from '@react-navigation/native';
import moment from 'moment';
import * as DocumentPicker from 'expo-document-picker';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { AppbarCommon } from '../../../shared/components/appbar/appbar-common';
import { Icon } from '../../../shared/components/icon';
import { messages } from './create-task-messages';
import { translate } from '../../../config/i18n';
import { responseMessages } from '../../../shared/messages/response-messages';
import Modal from 'react-native-modal';
import {
  getSubTaskSelector,
} from './create-task-selector';

import { styles } from './create-task-style';
import {
  DATA_TASK_CREATE_EMPTY,
  createTask,
  getTaskDetail,
  getTaskLayout,
  updateTaskDetail,
  removeTask,
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
  TypeShowResult,
} from '../../../config/constants/enum';
import { EditTaskRouteProp } from '../../../config/constants/root-stack-param-list';
import { EnumFmDate } from '../../../config/constants/enum-fm-date';
import { TEXT_EMPTY } from '../../../config/constants/constants';
import { ScreenName } from '../../../config/constants/screen-name';
import { checkTaskAndSubTaskComplete } from '../utils';
import { EmployeeSuggestView } from '../../../shared/components/suggestions/employee/employee-suggest-view';
import { TYPE_MEMBER } from '../../../config/constants/query';
import StringUtils from '../../../shared/util/string-utils';
import { ActivityIndicatorLoading } from '../../../shared/components/indicator-loading/activity-indicator-loading';
import { TypeMessage } from '../../../config/constants/enum';
import { CommonMessage } from '../../../shared/components/message/message';
import { ModalCancel } from '../../../shared/components/modal-cancel';
import { ModalDirtycheckButtonBack } from '../../../shared/components/modal/modal';
import { CustomerSuggestView } from '../../../shared/components/suggestions/customer/customer-suggest-view';
import { TradingProductSuggestView } from '../../../shared/components/suggestions/trading-product/trading-product-suggest-view';
import { MilestoneSuggestView } from '../../../shared/components/suggestions/milestone/milestone-suggest-view';
import { TYPE_SWICH_FORMAT, switchFormatDate } from '../../../shared/util/date-utils';

export const CreateTask = () => {
  // const dataTaskLayout = useSelector(getTaskLayoutSelector);
  const authorization = useSelector(authorizationSelector);
  // const taskDetail = useSelector(getTaskDetailSelector);
  const [taskFieldInfo, setTaskFieldInfo] = useState<any>([]);
  const [mode, setMode] = React.useState(ControlType.ADD);
  const [taskDetail, setTaskDetail] = useState<any>({});
  const [enableScrollViewScroll, setEnableScrollViewScroll] = React.useState(
    true
  );
  const [suggestionsChoice, setSuggestionChoice]: any = useState({
    departments: [],
    employees: [
      {
        employeeId: authorization.employeeId,
        participantType: TYPE_MEMBER.OWNER,
      },
    ],
    groups: [],
  });

  const dispatch = useDispatch();
  const [params, setParams] = React.useState<any>(DATA_TASK_CREATE_EMPTY);

  const route = useRoute<EditTaskRouteProp>();
  const dataSubTaskSelector = useSelector(getSubTaskSelector);

  const [openModal, setOpenModal] = useState(false);
  const [isLoading] = useState(false);
  const [messError, setMessError] = useState([]);
  const [validateValue] = useState<Array<any>>([]);
  const [onPressBtn, setOnPressBtn] = useState(false);
  const [isShowDirtycheck, setShowDirtycheck] = useState(false);
  const [dataFile, setDataFile] = useState([]);
  const [isVisibleDirtycheck, setIsVisibleDirtycheck] = useState(false);
  const firstUpdate = useRef(true);
  const [isSubTask, setIsSubTask] = useState(false);
  const [title, setTitle] = useState('');

  /**
   * message success
   */
  const textEmpty = {
    content: TEXT_EMPTY,
    type: TEXT_EMPTY,
  };

  const [message, setMessage] = useState([textEmpty]);

  useEffect(() => {
    if (isSubTask) {
      if (mode === ControlType.ADD) {
        setTitle(translate(messages.createSubTask))
      } else {
        setTitle(translate(messages.editSubTask))
      }
    } else {
      if (mode === ControlType.ADD) {
        setTitle(translate(messages.createTask))
      } else {
        setTitle(translate(messages.editTask))
      }
    }
  }, [mode, isSubTask])

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

  const handleChooseCustomer = (value: any) => {
    const newParams = _.cloneDeep(params)
    if (value && value.length > 0) {
      newParams.customers = [{ customerId: value[0].customerId, customerName: value[0].customerName }]
      setParams(newParams);
    }
  };

  const handleChooseTradingProduct = (value: any) => {
    const newParams = _.cloneDeep(params)
    if (value && value.length > 0) {
      newParams.productTradingIds = [value[0].productTradingId]
      setParams(newParams);
    }
  };

  const handleChooseMilestone = (value: any) => {
    const newParams = _.cloneDeep(params)
    if (value && value.length > 0) {
      newParams.milestoneId = value[0].milestoneId
      newParams.milestoneName = value[0].milestoneName
      setParams(newParams);
    }
  };

  // useEffect(() => {
  //   console.log('params xxxxxxx aaaaaaaaaaaaa', params)
  // }, [params])

  useEffect(() => {
    return function clear() {
      if (!isSubTask && !route?.params?.isSubTask) {
        dispatch(createTaskActions.clearData({}));
      }
    };
  }, [isSubTask])

  const getDataTaskDetail = async () => {
    const paramsGetDetail = {
      taskId: route?.params?.taskId,
    };
    const response = await getTaskDetail(paramsGetDetail, {});

    if (response?.status === 200) {
      const dataSubTask = response?.data?.dataInfo?.task?.subtasks;

      const suggestionsChoices = convertOperatorToSuggest(
        response?.data?.dataInfo?.task?.operators || { ...suggestionsChoice }
      );

      const isSub = response?.data?.dataInfo?.task?.parentTaskId;
      if (route?.params) {
        if ((route?.params?.type === ControlType.EDIT && isSub) || (route?.params?.type === ControlType.ADD && route?.params?.isSubTask)) {
          setIsSubTask(true)
        }
      }
      setSuggestionChoice(suggestionsChoices);
      setTaskDetail(response?.data?.dataInfo?.task);
      setTaskFieldInfo(response?.data?.fieldInfo);
      // setParams(response.data.dataInfo.task);

      if (dataSubTask?.length > 0) {
        dispatch(createTaskActions.getSubTask(dataSubTask));
      }
    }
  };

  const getDataTaskLayout = async () => {
    const response = await getTaskLayout({});
    if (response?.status === 200 && response?.data) {
      dispatch(createTaskActions.getTaskLayout(response?.data));
      setTaskFieldInfo(response?.data?.fieldInfo);
    }
  };

  const getDataAdd = () => {
    if (route?.params?.isSubTask) {
      setIsSubTask(true)
    }
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
  useEffect(() => {
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
        // if (route?.params?.taskId) {
        //   getDataEdit();
        // } else {
        //   getDataAdd();
        // }
        break;
    }

  }, [route?.params?.taskId, route?.params?.type]);

  const convertOperatorToSuggest = (operators: Array<any>) => {
    const operator = [...operators][0];
    const { departments = [], employees = [], groups = [] } = operator || {};
    const suggestEmployee: any = [];
    const suggestDepartment: any = [];
    const suggestGroup: any = [];

    if (departments?.length > 0) {
      departments.forEach((element: any) => {
        suggestDepartment.push({
          departmentId: element.departmentId,
          participantType: TYPE_MEMBER.OWNER,
        });
      });
    }
    if (employees?.length > 0) {
      employees.forEach((element: any) => {
        suggestEmployee.push({
          employeeId: element.employeeId,
          participantType: TYPE_MEMBER.OWNER,
        });
      });
    }
    if (groups?.length > 0) {
      groups.forEach((element: any) => {
        suggestGroup.push({
          groupId: element.groupId,
          participantType: TYPE_MEMBER.OWNER,
        });
      });
    }
    return {
      departments: suggestDepartment,
      employees: suggestEmployee,
      groups: suggestGroup,
    };
  };

  useEffect(() => {
    const taskParam = {
      taskId: taskDetail.taskId || TEXT_EMPTY,
      taskName: taskDetail.taskName || TEXT_EMPTY,
      statusTaskId: taskDetail.statusTaskId || 1,
      customers: taskDetail.customers || [{}],
      startDate: taskDetail.startDate ? switchFormatDate(taskDetail.startDate, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]", TYPE_SWICH_FORMAT.DEFAULT_TO_USER) : null,
      finishDate: taskDetail.finishDate ? switchFormatDate(taskDetail.finishDate, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]", TYPE_SWICH_FORMAT.DEFAULT_TO_USER) : null,
      memo: taskDetail.memo || null,
      subTasks: [],
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
      // taskData: taskDetail?.taskData?.filter((elm:any)=> elm.fieldType !== null) || [],
      taskData: [],
    }
    if (isSubTask && mode === ControlType.ADD) {
      setParams(DATA_TASK_CREATE_EMPTY);
    } else {
      setParams(taskParam);
    }
  }, [taskDetail]);

  useEffect(() => {
    if (!isSubTask && dataSubTaskSelector?.length > 0) {
      const newParams = _.cloneDeep(params);
      dataSubTaskSelector.map((elm: any) => {
        return newParams.subTasks.push({
          taskId: elm.taskId,
          statusTaskId: elm.statusTaskId,
          subtaskName: elm.taskName,
        });
      });

      setParams(newParams);
      if (firstUpdate.current) {
        firstUpdate.current = false;
      }
    } else {
      firstUpdate.current = false;
    }
  }, [dataSubTaskSelector]);

  const navigation = useNavigation();

  const pickDocument = async () => {
    const result: any = await DocumentPicker.getDocumentAsync({});

    const item: any = {
      fileData: result.uri,
      name: result.name,
      size: result.size,
    };
    const newDataFile: any = [...dataFile, item];

    setDataFile(newDataFile);
  };
  const removeFile = (item: any) => {
    const newFile = _.cloneDeep(dataFile).filter(
      (elm: any) => elm.fileData !== item.fileData
    );
    setDataFile(newFile);
  };

  const renderItemFile = (item: any) => {
    return (
      <View style={styles.containerItem}>
        <Text numberOfLines={1} style={styles.txtItem}>
          {item.fileName}
        </Text>
        <TouchableOpacity
          onPress={() => removeFile(item)}
          style={styles.btnItem}
        >
          <AntDesign name="closecircleo" size={18} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  const addTask = async (updateFlg: any = null) => {
    setOnPressBtn(true);
    setMessError([]);
    if (!!updateFlg && checkTaskAndSubTaskComplete(params, false)) {
      setOpenModal(true);
    } else {
      let formData = new FormData();
      if (isSubTask) {
        if (route?.params?.type === ControlType.ADD) {
          delete params.taskId;
        }
        delete params.files;
        delete params.milestoneFinishDate;
        delete params.milestoneId;
        delete params.milestoneName;
        delete params.memo;
        delete params.subtasks;
        delete params.newValue;
        params.subTasks = [];
        params.customers = [];
        params.productTradingIds = [];
        params.fileNameOlds = [];
        params.parentTaskId = null;
        params.updateFlg = null;
        params.updatedDate = null;
        formData.append('data', JSON.stringify(params));
      } else {
        if (route?.params?.type === ControlType.ADD) {
          delete params.taskId;
        }
        delete params.files;
        delete params.milestoneFinishDate;
        delete params.memo;
        delete params.subtasks;
        delete params.newValue;
        params.fileNameOlds = [];
        params.parentTaskId = null;
        params.updateFlg = null;
        params.updatedDate = null;
        formData.append('data', JSON.stringify(params));
        // console.log('taskDetail', taskDetail);

        // formData.append('files', dataFile.fileData);
        // formData.append('filesMap', `${taskDetail.taskId}.file_name.file0`);
      }

      console.log('params add aaaaaaaaaaaaa', params)
      const responseCreateTask = await createTask(formData, {});
      console.log('responseCreateTask aaaaaaaaaaaaa', responseCreateTask)
      // console.log('responseCreateTask', responseCreateTask);

      if (responseCreateTask.status === 200) {
        setMessage([
          {
            content: translate(responseMessages.INF_COM_0004),
            type: TypeMessage.SUCCESS,
          },
        ]);
        if (isSubTask) {
          params.taskId = responseCreateTask.data.taskId
          const subTasks = _.cloneDeep(dataSubTaskSelector)
          subTasks.push(params)
          dispatch(createTaskActions.getSubTask(subTasks));
        }
        setTimeout(() => {
          setMessage([textEmpty]);
          navigation.goBack();
        }, 2000);
      } else {
        const errArray = responseCreateTask.data.parameters.extensions.errors.map(
          (elm: any) => {
            return {
              content: translate(responseMessages[`${elm.errorCode}`]),
              type: elm.errorCode.slice(0, 3),
            };
          }
        );
        setMessage(errArray);
      }
    }
  };

  const updateTask = async (updateFlg: any = null) => {
    console.log('responseUpdateTask detail aaaaaaaaaaaaa', taskDetail)
    console.log('responseUpdateTask params aaaaaaaaaaaaa', params)
    if (!!updateFlg && checkTaskAndSubTaskComplete(params, false)) {
      setOpenModal(true);
    } else {
      const formData = new FormData();
      if (route?.params?.type !== ControlType.EDIT) {
        delete params.taskId;
      }
      params.deleteSubtaskIds = [];
      if (isSubTask) {
        params.parentTaskId = taskDetail.parentTaskId;
      } else {
        params.parentTaskId = null;
      }
      params.updateFlg = null;
      params.updatedDate = taskDetail.refixDate;
      params.processFlg = null;
      delete params.files;
      delete params.milestoneFinishDate;
      delete params.subtasks;
      delete params.newValue;

      params.fileNameOlds = [];

      // set customers
      const newParams = _.cloneDeep(params)
      if (newParams.customers && newParams.customers.length > 0) {
        params.customers = [{ customerId: newParams.customers[0].customerId, customerName: newParams.customers[0].customerName }]
      }

      formData.append('taskId', taskDetail.taskId);
      delete params.taskId;
      formData.append('data', JSON.stringify(params));
      console.log('responseUpdateTask params aaaaaaaaaaaaa', params)
      const responseUpdateTask = await updateTaskDetail(formData, {});
      console.log('responseUpdateTask aaaaaaaaaaaaa', responseUpdateTask)
      if (responseUpdateTask) {
        if (responseUpdateTask.status === 200) {
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
          return
        }
        if ((responseUpdateTask as any)?.data?.parameters?.extensions?.errors?.length > 0) {
          const dataErr: any = responseUpdateTask.data;
          setMessage(_.uniqWith(dataErr.parameters.extensions.errors.map((elm: any) => { return { content: translate(responseMessages[elm.errorCode]), type: elm.errorCode.slice(0, 3) } }), _.isEqual))
        }

      }
    }
  };

  const removeSubTask = async (processFlg: any, taskIdList: any) => {
    const paramRemove = {
      processFlg,
      taskIdList,
    };
    const removeResponse = await removeTask(paramRemove, {});

    if (removeResponse.status === 200) {
      const dataSubTaskNew = dataSubTaskSelector.filter(
        (elm: any) => elm.taskId !== removeResponse.data.taskIds[0]
      );
      dispatch(createTaskActions.getSubTask(dataSubTaskNew));
      return;
    }
    setMessage(removeResponse.data.parameters.extensions.errors.map((elm: any) => { return { content: translate(responseMessages[elm.errorCode]), type: elm.errorCode.slice(0, 3) } }))
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
      if (fieldName == 'subTasks') {
        const processFlg = 1;
        const taskIdList = [{ taskId: item.taskId }];
        removeSubTask(processFlg, taskIdList);
      }
    } else {
      newArray.push(item);
    }
    changePropertyParams(fieldName, newArray, index);
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
      case 'startDate':
        newParams.startDate = switchFormatDate(newValue, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]", TYPE_SWICH_FORMAT.DEFAULT_TO_USER)
        break;
      case 'finishDate':
        newParams.finishDate = switchFormatDate(newValue, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]", TYPE_SWICH_FORMAT.DEFAULT_TO_USER)
        break;
      default:
        newParams[propertyName] = newValue;
        break;
    }
    if (!firstUpdate.current) {
      setParams(_.cloneDeep(newParams));
    }
  };

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
    if (fieldItem.fieldName === 'status') {
      const value = data['statusTaskId']
      return {
        fieldValue: value
      }
    }
    if (fieldItem.fieldName === "is_public") {
      const value = fieldItem['fieldItems']?.map((item: any) => {
        return item.itemId
      })
      return {
        fieldValue: value
      }
    }

    return {
      fieldValue: fieldItem.isDefault
        ? data[StringUtils.snakeCaseToCamelCase(fieldItem.fieldName)]
        : findExtensionItem(fieldItem.fieldName, data.taskData || []),
    };

    // return { fieldValue: data[camelCase(fieldItem.fieldName)] };
  };

  const renderFieldInfo = (fieldItem: FieldInfoItem) => {
    // TODO LOOKUP is crash for dynamic. wait for fix
    if (
      fieldItem.availableFlag === AvailableFlag.NOT_AVAILABLE ||
      fieldItem.modifyFlag === ModifyFlag.READ_ONLY ||
      fieldItem.fieldType?.toString() === DefineFieldType.LOOKUP
    ) {
      return;
    }

    if (fieldItem.fieldType === Number(DefineFieldType.OTHER)) {
      switch (fieldItem.fieldName) {
        case 'customer_name':
          if (isSubTask) {
            return <View />
          }
          return (
            <View style={styles.viewItemContent}>
              <CustomerSuggestView
                initData={params.customers}
                typeSearch={TypeSelectSuggest.SINGLE}
                invisibleLabel={false}
                fieldLabel={JSON.parse(fieldItem?.fieldLabel || '').ja_jp || ''}
                updateStateElement={handleChooseCustomer}
              />
            </View>
          );
        case 'product_name':
          if (isSubTask) {
            return <View />
          }
          return (
            <View style={styles.viewItemContent}>
              <TradingProductSuggestView
                initData={params.productTradings}
                typeShowResult={TypeShowResult.LIST}
                typeSearch={TypeSelectSuggest.SINGLE}
                invisibleLabel={false}
                fieldLabel={JSON.parse(fieldItem?.fieldLabel || '').ja_jp || ''}
                updateStateElement={handleChooseTradingProduct}
              />
            </View>
          );
        case 'milestone_name':
          if (isSubTask) {
            return <View />
          }
          return (
            <View style={styles.viewItemContent}>
              <MilestoneSuggestView
                initData={params.milestoneId ? [{ milestoneId: params.milestoneId, milestoneName: params.milestoneName }] : []}
                typeSearch={TypeSelectSuggest.SINGLE}
                invisibleLabel={false}
                fieldLabel={JSON.parse(fieldItem?.fieldLabel || '').ja_jp || ''}
                updateStateElement={handleChooseMilestone}
              />
            </View>
          );
        case 'parent_id':
          if (isSubTask) {
            return <View />
          }
          return (
            <View style={styles.viewItemContent}>
              <Text style={styles.txtTitle}>{translate(messages.subTask)}</Text>
              <TouchableOpacity
                style={styles.btnAddStaff}
                onPress={() => {
                  navigation.dispatch(
                    StackActions.push(ScreenName.CREATE_TASK, { type: ControlType.ADD, isSubTask: true })
                  );
                }}
              >
                <Text style={styles.txtContentBtn}>
                  {translate(messages.addSubTask)}
                </Text>
              </TouchableOpacity>
              {dataSubTaskSelector.length > 0 &&
                dataSubTaskSelector.map((elm: any, idx: any) => {
                  return (
                    <View
                      key={idx}
                      style={[styles.viewSubTask, CommonStyles.flex1]}
                    >
                      <Text style={[styles.txtContentBtn, CommonStyles.flex1]}>
                        {`${elm.taskName}(${moment(elm.finishDate).format(
                          EnumFmDate.YEAR_MONTH_DAY_NORMAL_DASH
                        )})`}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          changeArrayProperty('subTasks', elm, idx)
                        }
                      >
                        <Icon name="delete" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
            </View>
          );
        default:
          return;
      }
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
            data={dataFile}
            extraData={params.files}
            renderItem={({ item }) => renderItemFile(item)}
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
            _keyElement,
            _type,
            objEditValue
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

  return isLoading ? (
    <View>{ActivityIndicatorLoading(isLoading)}</View>
  ) : (
      <View style={styles.container}>
        <Modal isVisible={isVisibleDirtycheck}>
          <ModalDirtycheckButtonBack
            onPress={() => { setIsVisibleDirtycheck(false) }}
            onPressBack={() => { navigation.goBack() }}
          />
        </Modal>
        <AppbarCommon
          title={title}
          leftIcon='close'
          handleLeftPress={() => {
            setIsVisibleDirtycheck(true);
            // navigation.goBack()
          }}
          buttonText={translate(messages.registration)}
          styleTitle={styles.appbarTitle}
          containerStyle={styles.bgGray400}
          onPress={() => (mode === ControlType.EDIT ? updateTask() : addTask())}
          buttonType="complete"
        />
        <ScrollView
          style={styles.container}
          scrollEnabled={enableScrollViewScroll}
          keyboardShouldPersistTaps="handled"
        >
          {message[0].type != TypeMessage.SUCCESS && message[0].type != TEXT_EMPTY && (
            <View style={styles.boxMessage}>
              {message.map((elm) => <CommonMessage content={elm.content} type={elm.type} />
              )}
            </View>
          )}
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

          {[...taskFieldInfo]
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
          {mode != ControlType.ADD && <>
            {renderBottomElement(translate(messages.registrationDate), taskDetail?.registDate)}
            {renderBottomElement(translate(messages.lastUpdate), taskDetail?.registPersonName)}
            {renderBottomElement(translate(messages.regisPerson), taskDetail?.refixDate)}
            {renderBottomElement(translate(messages.lastUpdateBy), taskDetail?.refixPersonName)}
          </>}

          <ModalCancel
            visible={isShowDirtycheck}
            titleModal={translate(responseMessages.WAR_COM_0007)}
            textBtnRight={translate(messages.ok)}
            textBtnLeft={translate(messages.cancel)}
            btnBlue
            onPress={() => navigation.goBack()}
            closeModal={() => setShowDirtycheck(!isShowDirtycheck)}
            contentModal={translate(responseMessages.WAR_COM_0005)}
            containerStyle={styles.boxConfirm}
            textStyle={styles.txtContent}
          />
        </ScrollView>
        {message[0].type == TypeMessage.SUCCESS && (
          <View style={styles.boxMessageSuccess}>
            <CommonMessage content={message[0].content} type={message[0].type} />
          </View>
        )}
      </View>
    );
};
