import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'reactstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Storage, translate } from 'react-jhipster';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import { IRootState } from 'app/shared/reducers';
import useEventListener from 'app/shared/util/use-event-listener';
import { handleInitializeListModal, handleCreateList, handleUpdateList, MyListAction, reset, ACTION_TYPES, handleGetGeneralSetting } from './my-list-modal.reducer';
import DynamicSearchConditionListComponent from 'app/shared/layout/dynamic-form/list/dynamic-search-condition-list';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { useDrop } from 'react-dnd';
import { FIELD_ITEM_TYPE_DND } from 'app/shared/layout/dynamic-form/constants';
import { MY_BUSINESS_CARD_MODES } from 'app/modules/businessCards/constants';
import { startExecuting } from 'app/shared/reducers/action-executing';
import { REQUEST } from 'app/shared/reducers/action-type.util';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { FIELD_BELONG } from 'app/config/constants';
import styled from 'styled-components';

const DropSearchCondition = styled.div`
  .drop-search-condition {
    min-height: 300px;
    width: 100%;
  }
`;

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search
}

// LIST TYPE
const SUB_LIST_TYPE = {
  MANUAL: "1",
  AUTO: "2"
};

// initial List
const initialList = {
  businessCardListName: '',
  businessCardListNameEnUs: '',
  businessCardListNameZhCn: '',
  listMode: SUB_LIST_TYPE.MANUAL,
  isOverWrite: 0,
};

interface IAddEditMyListModalDispatchProps {
  // reset Mode Modal
  reset;
  // handleInitializeListModal Initialize AddEditMyListModal
  handleInitializeListModal;
  // handleCreateList handle Create My list
  handleCreateList;
  // handleUpdateList handle Update My list
  handleUpdateList;

  handleGetGeneralSetting?;
}

interface IAddEditMyListModalStateProps {
  // tenant name sevice
  tenant;
  // modalAction action create, update
  modalAction: any;
  // cardList props Business card 
  cardList: any;
  // searchConditions search Conditions
  searchConditions: any;
  // errorValidates check Validates
  errorValidates: any;

  listUpdateTime?;

  errorMsg: any;
  successMessage: any;
  // list business card list
  listBusinessCardList;
}

interface IAddEditMyListModalOwnProps {

  // popout boolean check modal or popup
  popout?: boolean;
  // sideBarCurrentId Id selected
  sideBarCurrentId?: number;
  // myListModalMode check action create, edit
  myListModalMode: any;
  // onCloseAddEditMyList Close Add Edit My List
  onCloseAddEditMyList?: (isSubmitSuccess: boolean) => void;
  // customFieldsInfo list fields Info
  customFieldsInfo;
}

type IAddEditMyListModalProps = IAddEditMyListModalDispatchProps & IAddEditMyListModalStateProps & IAddEditMyListModalOwnProps;
/**
 * Component for Add Edit My List Modal
 * @param props 
 */
const AddEditMyListModal: React.FC<IAddEditMyListModalProps> = props => {
  const [conditionSearch, setConditionSearch] = useState([]);

  const [first, setFirst] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [showCustomField, setShowCustomField] = useState(false);
  const [saveConditionSearch, setSaveConditionSearch] = useState([]);
  const [listFieldSearch, setListFieldSearch] = useState([]);
  const [oldListFieldSearch, setOldListFieldSearch] = useState(null);
  const [customFieldsInfo, setCustomFieldsInfo] = useState([]);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [modalMode, setModalMode] = useState(props.myListModalMode);
  const [listType, setListType] = useState(1);
  const [listMode, setListMode] = useState(SUB_LIST_TYPE.MANUAL);
  const [fields, setFields] = useState([]);
  const [updatedDate, setUpdatedDate] = useState(null);
  const [listId, setListId] = useState(null);
  const [initialListData, setInitialListData] = useState(initialList);
  const [errorValidates, setErrorValidates] = useState(props.errorValidates);
  const [listUpdateTime, setListUpdateTime] = useState('');
  const [ownerList, setOwnerList] = useState([]);
  const [viewerList, setViewerList] = useState([]);
  const [isOverWrite, setIsOverWrite] = useState(0);
  const [listOfBusinessCardId, setListOfBusinessCardId] = useState([]);
  const [businessCardListName, setBusinessCardListName] = useState('');
  const [businessCardListNameEnUs, setBusinessCardListNameEnUs] = useState('');
  const [businessCardListNameZhCn, setBusinessCardListNameZhCn] = useState('');
  const [validateName, setValidateName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessageInModal, setErrorMessageInModal] = useState(props.errorMsg);
  const [successMessage, setSuccessMessage] = useState(null);
  const txtInputFocus = useRef(null);

  /**
   * set List Field Search
   */
  const changeListFieldChosen = (fieldList: any) => {
    console.log({ fieldList });

    setListFieldSearch(fieldList);
  };

  /**
    * updateStateSession when open new popup
    */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(AddEditMyListModal.name, {
        conditionSearch,
        first,
        showCustomField,
        saveConditionSearch,
        listFieldSearch,
        oldListFieldSearch,
        fields,
        customFieldsInfo,
        listType,
        businessCardListName,
        businessCardListNameEnUs,
        businessCardListNameZhCn,
        listMode,
        modalMode,
        isOverWrite,
        updatedDate,
        listId,
        initialListData,
        errorValidates,
        isSubmitted,
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(AddEditMyListModal.name);
      if (saveObj) {
        setConditionSearch(saveObj.conditionSearch);
        setFirst(saveObj.first);
        setShowCustomField(saveObj.showCustomField);
        if (saveObj.saveConditionSearch && saveObj.saveConditionSearch.length > 0) {
          setSaveConditionSearch(saveObj.saveConditionSearch);
        } else {
          setSaveConditionSearch(saveObj.conditionSearch);
        }
        setListFieldSearch(saveObj.listFieldSearch);
        setFields(saveObj.fields);
        setCustomFieldsInfo(saveObj.customFieldsInfo);
        setListType(saveObj.listType);
        setBusinessCardListName(saveObj.businessCardListName);
        setBusinessCardListNameEnUs(saveObj.businessCardListNameEnUs);
        setBusinessCardListNameZhCn(saveObj.businessCardListNameZhCn);
        setListMode(saveObj.listMode);
        setModalMode(saveObj.modalMode);
        setIsOverWrite(saveObj.isOverWrite);
        setUpdatedDate(saveObj.updatedDate);
        setListId(saveObj.listId);
        setInitialListData(saveObj.initialListData);
        setErrorValidates(saveObj.errorValidates);
        setIsSubmitted(saveObj.isSubmitted);
        setOldListFieldSearch(saveObj.oldListFieldSearch);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(AddEditMyListModal.name);
    }
  };

  /**
   * Set drop area
   */
  const [, dropBody] = useDrop({
    accept: FIELD_ITEM_TYPE_DND.ADD_CARD,
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true })
    })
  });

  /**
   * Check validate FiedName
   */
  const getErrorInfo = fieldName => {
    if (!errorValidates) return null;
    let errorInfo = null;
    errorValidates.forEach(elem => {
      if (elem.item === fieldName) {
        const errorTmp = {};
        errorTmp['rowId'] = elem.rowId;
        errorTmp['item'] = elem.item;
        errorTmp['errorCode'] = elem.errorCode;
        errorTmp['params'] = elem.params ? elem.params : null;
        errorInfo = errorTmp;
      }
    });
    return errorInfo;
  };

  /**
  * Check Change Search Condition
  */
  const checkChangeSearchCondition = (defaultSC, currentSC) => {
    let isChange = false;
    if (listMode === SUB_LIST_TYPE.AUTO) {
      if (!defaultSC && !currentSC) {
        return;
      }
      if (!defaultSC && currentSC) {
        isChange = true;
        return;
      }
      if (defaultSC.length !== currentSC.length) {
        isChange = true;
      } else {
        defaultSC.map(item => {
          let curentSCCheck = currentSC.find(df => df.fieldId === item.fieldId);
          if (!curentSCCheck) {
            isChange = true;
            return;
          } else {
            if (_.isArray(curentSCCheck.fieldValue)) {
              curentSCCheck = { ...curentSCCheck, fieldValue: JSON.stringify(curentSCCheck.fieldValue) }
            }
            if (item?.searchValue !== curentSCCheck?.fieldValue
              || item?.searchType?.toString() !== curentSCCheck?.searchType?.toString()
              || item?.searchOption?.toString() !== curentSCCheck?.searchOption?.toString()
              || (item.searchValue && curentSCCheck.isSearchBlank)
            ) {
              isChange = true;
              return;
            }
          }
        })
      }
    }
    return isChange;
  }

  /**
   * Parse Search Conditions
   */
  const parseSearchConditions = (data, isDirty = false, isInit = false) => {
    if (!data || !data.length) return [];
    const tmpConditions = [];

    data.map(item => {
      let result;
      if (Array.isArray(item.fieldValue)) {
        const val = [];
        item.fieldValue.forEach((element, idx) => {
          if (element['from']) {
            val.push({ from: element.from, to: element.to });
            // val.push({ key: 'to', value: element.to });
          } else {
            val.push(element);
          }
        });
        result = {
          businessCardListSearchConditionId: item.businessCardListSearchId,
          updatedDate: item.updatedDate,
          fieldId: parseInt(item.fieldId, 0),
          searchType: parseInt(item.searchType, 0),
          searchOption: parseInt(item.searchOption, 0),
          searchValue: JSON.stringify(val)
        };
      } else {
        result = {
          businessCardListSearchConditionId: item.businessCardListSearchId,
          updatedDate: item.updatedDate,
          fieldId: parseInt(item.fieldId, 0),
          searchType: parseInt(item.searchType, 0),
          searchOption: parseInt(item.searchOption, 0),
          searchValue: item.fieldValue
        }
      }
      tmpConditions.push(result);
    });
    return tmpConditions;
  };

  /**
  * check change Input Edit
  */
  const isChangeInputEdit = () => {
    if (modalMode !== MY_BUSINESS_CARD_MODES.MODE_CREATE_MY_BUSINESS_CARD) {
      if (
        businessCardListName !== initialListData.businessCardListName ||
        listMode.toString() !== initialListData.listMode.toString() ||
        isOverWrite !== initialListData.isOverWrite
      ) {
        return true;
      }
      if (props.cardList.searchConditions && props.cardList.searchConditions.length !== saveConditionSearch.length) return true;

      if (checkChangeSearchCondition(props.cardList.searchConditions, saveConditionSearch)) {
        return true;
      }
      return false;
    } else {
      if (businessCardListName || saveConditionSearch.length > 0 || listMode === SUB_LIST_TYPE.AUTO) {
        return true;
      }
    }
    return false;
  };

  /**
   * Execute Dirty Check
   */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (isChangeInputEdit()) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  };

  /**
   * Close Popup
   */
  const handleClosePopup = () => {
    executeDirtyCheck(() => {
      setShowCustomField(false);
      setListFieldSearch([]);
      if (props.onCloseAddEditMyList) {
        props.onCloseAddEditMyList(false);
      }
    });
  };

  /**
   * Back Popup
   */
  const handleBackPopup = () => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.SetSession);
      setForceCloseWindow(true);
    } else {
      handleClosePopup();
    }
  };

  /**
   * Display Setting Field
   */
  const handleDisplaySetting = () => {
    setOldListFieldSearch(_.cloneDeep(listFieldSearch));
    setShowCustomField(true);
  };
  /**
   * Update Setting Field
   */
  const handleUpdateSettingField = () => {
    setShowCustomField(false);
    if (!listFieldSearch || listFieldSearch.length <= 0) {
      return;
    }
    const objParams = [];
    listFieldSearch.forEach((el, idx) => {
      const obj = _.cloneDeep(el);
      obj.fieldOrder = idx + 1;
      objParams.push(obj);
    });
    setOldListFieldSearch(_.cloneDeep(listFieldSearch));
    setSaveConditionSearch(objParams);
  };

  useEffect(() => {
    if (props.successMessage !== null) {
      setSuccessMessage(props.successMessage);
      setTimeout(() => setSuccessMessage(null), 5000)
    }
  }, [props.successMessage])

  /**
  * Render Component toast meessage success 
  */
  const renderToastMessage = () => {
    if (successMessage === null) {
      return <></>;
    }
    return (
      <BoxMessage
        messageType={MessageType.Success}
        message={successMessage}
        className="message-area-bottom position-absolute"
      />
    )
  }
  /**
   * Close Setting Field
   */
  const handleCloseSettingField = () => {
    console.log({ oldListFieldSearch });

    setShowCustomField(false);
    setListFieldSearch(_.cloneDeep(oldListFieldSearch));
  };

  /**
   * open new popup
   */
  const openNewWindow = () => {
    setShowModal(false);
    updateStateSession(FSActionTypeScreen.SetSession);
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    const newWindow = window.open(`${props.tenant}/add-edit-my-list`, '', style.toString());
    newWindow.onbeforeunload = () => {
      props.onCloseAddEditMyList(false)
    }
    // props.onCloseAddEditMyList(true)
    // handleBackPopup();
  };

  /**
   * Update State Field
   * @param item 
   * @param type 
   * @param val 
   */
  const updateStateField = (item, type, val) => {
    if (val === '') {
      return;
    }
    if (_.isArray(val.fieldValue) && val.fieldValue.length === 0) {
      val = { ...val, fieldValue: "" }
    }

    if (val.fieldType === 6 || val.fieldType === 7) {
      val = { ...val, searchType: val.searchModeDate }
    }
    const valueUpdate = _.cloneDeep(val);
    valueUpdate['fieldLabel'] = item.fieldLabel;
    valueUpdate['fieldItems'] = item.fieldItems;
    if (saveConditionSearch) {
      const indexField = saveConditionSearch.findIndex(e => e.fieldId.toString() === item.fieldId.toString());
      if (indexField < 0) {
        saveConditionSearch.push(valueUpdate);
      } else {
        saveConditionSearch[indexField] = valueUpdate;
      }
    } else {
      const newObject = [];
      newObject.push(valueUpdate);
      setSaveConditionSearch(newObject);
    }
  };

  /**
   * parse Json To Obj
   */
  const parseJsonToObj = (str) => {
    let jsonStr = '';
    try {
      jsonStr = JSON.parse(str);
    } catch (e) {
      return str;
    }
    return jsonStr;
  }

  /**
   * Get Data Status Control
   */
  const getDataStatusControl = item => {
    console.log("dsgahdhgsadghsahdchsacdsahgdhsad", { saveConditionSearch, listFieldSearch });
    if (saveConditionSearch && saveConditionSearch.length > 0) {
      const saveConditionSearchCopy = _.cloneDeep(saveConditionSearch);
      const dataStatus = saveConditionSearchCopy.filter(e => e.fieldId.toString() === item.fieldId.toString());

      if (modalMode !== MY_BUSINESS_CARD_MODES.MODE_CREATE_MY_BUSINESS_CARD) {
        if (dataStatus && dataStatus.length > 0) {
          const fieldValueJson = parseJsonToObj(dataStatus[0].fieldValue);
          const fFieldValue = fieldValueJson ? fieldValueJson : dataStatus[0].fieldValue;
          if (dataStatus[0].fieldType === 6 || dataStatus[0].fieldType === 7) {
            if (Array.isArray(fFieldValue) && fFieldValue.length > 0) {
              dataStatus[0]['dateFrom'] = fFieldValue[0] && fFieldValue[0].from;
              dataStatus[0]['dateTo'] = fFieldValue[0] && fFieldValue[0].to;
              dataStatus[0].searchValue = fFieldValue[0];
              return dataStatus[0];
            } else {
              dataStatus[0]['dateFrom'] = fFieldValue && fFieldValue.from ? fFieldValue.from : null;
              dataStatus[0]['dateTo'] = fFieldValue && fFieldValue.to ? fFieldValue.to : null;
              return dataStatus[0];
            }
          }
          if (Array.isArray(fFieldValue) && fFieldValue.length > 0) {
            dataStatus[0].fieldValue = fFieldValue;
          } else if (fFieldValue && fFieldValue.length > 0 && fFieldValue.value) {
            dataStatus[0].fieldValue = fFieldValue.value;
          } else if (fFieldValue && typeof fFieldValue === 'object') {
            dataStatus[0].fieldValue = _.size(fFieldValue) > 0 ? fFieldValue : '';
          }
        }
        return dataStatus[0];
      }
    }
    return item;
  };

  /**
   * Move Field Search
   */
  const onMoveField = (fieldDropId, fieldDragId) => {
    const objectFieldInfos = _.cloneDeep(listFieldSearch);
    const dropIndex = objectFieldInfos.findIndex(e => JSON.stringify(e.fieldId) === JSON.stringify(fieldDropId.fieldId));
    const dropItem = objectFieldInfos.find(e => JSON.stringify(e.fieldId) === JSON.stringify(fieldDropId.fieldId));
    const dragIndex = objectFieldInfos.findIndex(e => JSON.stringify(e.fieldId) === JSON.stringify(fieldDragId.fieldId));

    if (dropIndex >= 0 && dragIndex >= 0) {
      if (dropIndex > dragIndex) {
        objectFieldInfos.splice(dragIndex, 0, dropItem);
        objectFieldInfos.splice(dropIndex + 1, 1)
      } else {
        objectFieldInfos.splice(dragIndex + 1, 0, dropItem);
        objectFieldInfos.splice(dropIndex, 1)
      }
      setSaveConditionSearch(objectFieldInfos);
      setListFieldSearch(objectFieldInfos);
    }
  };

  /**
   *  Before Unload
   */
  const onBeforeUnload = ev => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, 'forceCloseWindow': false, 'keepOpen': true }, window.location.origin);
    }
  };

  /**
   * Close Add Edit MyList
   * @param ev 
   */
  const onReceiveMessage = ev => {
    if (!props.popout) {
      if (ev.data.forceCloseWindow) {
        props.onCloseAddEditMyList(true);
      } else {
        // props.onCloseAddEditMyList(false);
      }
    }
  };

  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  /**
   * check Option Change ListMode
   * @param event 
   */
  const handleOptionChange = event => {
    setListMode(event.target.value);
  };

  /**
   * Action Submit From
   */
  const handleSubmit = () => {
    const maxLength = 255;
    setIsSubmitted(true);
    if (!businessCardListName) {
      setValidateName(translate("messages.ERR_COM_0013"));
      setErrorValidates([]);
      setErrorMessageInModal([]);
      return
    }
    if (businessCardListName.length > 255) {
      setValidateName(translate("messages.ERR_COM_0025", { 0: maxLength }));
      setErrorValidates([]);
      setErrorMessageInModal([]);
      return
    }
    let submitConditions = [];
    saveConditionSearch.forEach(item => {
      if (item.isSearchBlank) {
        submitConditions = submitConditions.concat({ ...item, fieldValue: "" });
      }
      else if (item.fieldValue && item.fieldValue.length > 0) {
        submitConditions = submitConditions.concat(item);
      }
    });
    const listNameBusiness = businessCardListName
    if (modalMode === MY_BUSINESS_CARD_MODES.MODE_CREATE_MY_BUSINESS_CARD || modalMode === MY_BUSINESS_CARD_MODES.MODE_COPY_MY_BUSINESS_CARD) {
      startExecuting(REQUEST(ACTION_TYPES.CREATE_LIST));
      props.handleCreateList(
        listNameBusiness,
        listType,
        listMode,
        ownerList,
        viewerList,
        isOverWrite,
        parseSearchConditions(submitConditions),
        listOfBusinessCardId
      );
    } else {
      startExecuting(REQUEST(ACTION_TYPES.UPDATE_LIST));
      props.handleUpdateList(
        listId,
        listNameBusiness,
        listType,
        listMode,
        isOverWrite,
        updatedDate,
        parseSearchConditions(submitConditions)
      );
    }
  };

  /**
   * Force Close Window
   */
  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        handleClosePopup();
      }
    }
  }, [forceCloseWindow]);

  useEffect(() => {
    if (props.listUpdateTime) {
      setListUpdateTime(props.listUpdateTime)
    }
  }, [props.listUpdateTime])

  useEffect(() => {
    if (props.modalAction === MyListAction.Success) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.Search, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        updateStateSession(FSActionTypeScreen.RemoveSession);
        props.onCloseAddEditMyList(true);
      }
    }
  }, [props.modalAction]);

  useEffect(() => {
    if (props.customFieldsInfo) {
      setCustomFieldsInfo(props.customFieldsInfo);
    } else {
      setCustomFieldsInfo([]);
    }
  }, [props.customFieldsInfo]);

  useEffect(() => {
    if (listMode === SUB_LIST_TYPE.AUTO) {
      if ((modalMode === MY_BUSINESS_CARD_MODES.MODE_CREATE_MY_BUSINESS_CARD) || ((modalMode === MY_BUSINESS_CARD_MODES.MODE_COPY_MY_BUSINESS_CARD || modalMode === MY_BUSINESS_CARD_MODES.MODE_EDIT_MY_BUSINESS_CARD) && (isOverWrite === null || isOverWrite === 0))) {
        setIsOverWrite(1);
      }
    } else {
      setIsOverWrite(0);
    }
  }, [listMode]);

  useEffect(() => {
    if (props.searchConditions && props.customFieldsInfo) {
      const conditions = [];
      props.searchConditions.forEach(e => {
        const filters = props.customFieldsInfo.filter(item => item.fieldId.toString() === e.fieldId.toString());
        if (filters.length > 0) {
          const tmp = {
            fieldName: filters[0].fieldName,
            fieldLabel: filters[0].fieldLabel,
            fieldType: filters[0].fieldType,
            fieldItems: filters[0].fieldItems,
            fieldValue: e.searchValue,
            searchOption: e.searchOption.toString(),
            searchType: e.searchType.toString()
          };
          e = { ...e, ...tmp };
          conditions.push(e);
        }
      });
      setConditionSearch(conditions);
      setSaveConditionSearch(_.cloneDeep(conditions));
    }
  }, [props.searchConditions, props.customFieldsInfo]);

  useEffect(() => {
    if ((modalMode === MY_BUSINESS_CARD_MODES.MODE_EDIT_MY_BUSINESS_CARD || modalMode === MY_BUSINESS_CARD_MODES.MODE_COPY_MY_BUSINESS_CARD) && props.cardList) {

      let bcListname = props.cardList.businessCardListName;
      if (modalMode === MY_BUSINESS_CARD_MODES.MODE_COPY_MY_BUSINESS_CARD) {
        const listCopy = props.listBusinessCardList.filter(item => {
          return item.listName
            && item.listName.slice(props.cardList.businessCardListName.length, item.listName.length).includes(translate('businesscards.mylist.duplicate-check'))
            && item.listName.includes(props.cardList.businessCardListName)
        })
        if (listCopy.length > 0) {
          const listCheck = Array.from(Array(listCopy.length), (x, i) => i + 1)
          _.forEach(listCheck, (index) => {
            if (!listCopy.find(item => item.listName.includes(translate('businesscards.mylist.duplicate', { n: index })))) {
              bcListname = props.cardList.businessCardListName + translate('businesscards.mylist.duplicate', { n: index });
              return false;
            }
            bcListname = props.cardList.businessCardListName + translate('businesscards.mylist.duplicate', { n: listCopy.length + 1 });
          })
        }
        else {
          bcListname = props.cardList.businessCardListName + translate('businesscards.mylist.duplicate', { n: 1 });
        }
      }

      setBusinessCardListName(bcListname);
      setBusinessCardListNameEnUs(bcListname);
      setBusinessCardListNameZhCn(bcListname);
      setListMode(props.cardList.listMode?.toString());
      setIsOverWrite(props.cardList.isOverWrite);
      setUpdatedDate(props.cardList.updatedDate);
      const newSaveConditionSearch = props.cardList.searchConditions.map(item => {
        const field = props.customFieldsInfo.find(x => x.fieldId === item.fieldId);
        field.fieldValue = item.searchValue;
        field.searchType = item.searchType;
        field.businessCardListSearchId = item.businessCardListSearchId;
        field.updatedDate = item.updatedDate;
        return field
      })
      setSaveConditionSearch(newSaveConditionSearch);
      setListFieldSearch(props.cardList.searchConditions.map(item1 => {
        const field = props.customFieldsInfo.find(x => x.fieldId === item1.fieldId);
        field.fieldValue = item1.searchValue;
        field.searchType = item1.searchType;
        field.isSearchBlank = item1.isSearchBlank;
        return field;
      }));
      setInitialListData({
        businessCardListName: bcListname,
        businessCardListNameEnUs: bcListname,
        businessCardListNameZhCn: bcListname,
        listMode: props.cardList.listMode,
        isOverWrite: props.cardList.isOverWrite
      });
    }
  }, [props.cardList]);


  useEffect(() => {
    if (props.errorValidates) {
      const errorList = [];
      props.errorValidates.forEach(item => {
        if (item.errorCode === "ERR_COM_0060") {
          errorList.push({ ...item, params: businessCardListName })
        } else {
          errorList.push({ ...item })
        }
      })
      setErrorValidates(errorList);
      setErrorMessageInModal(errorList);
    }
  }, [props.errorValidates]);

  useEffect(() => {
    if (businessCardListName) {
      setIsSubmitted(false);
    }
  }, [props.errorValidates, businessCardListName, isSubmitted]);

  useEffect(() => {
    document.body.className = "wrap-card";
    if (props.popout) {
      document.body.className = 'wrap-card modal-open';
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
    } else {
      setFirst(true);
      setShowModal(true);
      setShowCustomField(false);
      setModalMode(props.myListModalMode);
      if (props.myListModalMode !== MY_BUSINESS_CARD_MODES.MODE_CREATE_MY_BUSINESS_CARD && props.sideBarCurrentId) {
        setListId(props.sideBarCurrentId);
        props.handleInitializeListModal(props.sideBarCurrentId, false, false);
      } else {
        setIsOverWrite(0);
        setListMode(SUB_LIST_TYPE.MANUAL);
        setViewerList([]);
        setOwnerList([]);
        setListOfBusinessCardId([]);
        setConditionSearch([]);
      }
      props.handleGetGeneralSetting();
    }
    txtInputFocus && txtInputFocus.current && txtInputFocus.current.focus();
    return () => {
      document.body.className = document.body.className.replace('modal-open', '');
      setFirst(false);
      updateStateSession(FSActionTypeScreen.RemoveSession);
      props.reset();
    };
  }, []);

  /**
   * Parse Validate Error
   */
  const parseValidateError = () => {
    const errorMsg = [];
    if (errorMessageInModal) {
      const errorMessage = errorMessageInModal.filter((v, i) => errorMessageInModal.indexOf(v) === i);
      errorMessage.forEach(element => {
        if (element.errorCode === "ERR_COM_0060") {
          errorMsg.push(translate('messages.' + element.errorCode, { 0: element.params }))
        } else {
          errorMsg.push(translate('messages.' + element.errorCode));
        }
      });
    }

    return errorMsg;
  }
  useEffect(() => {
    if (props.successMessage !== null) {
      setSuccessMessage(props.successMessage)
    }
  }, [props.successMessage])
  useEffect(() => {
    if (successMessage !== null) {
      setTimeout(() => setSuccessMessage(null), 5000)
    }
  }, [successMessage])

  /**
   * render Component Input Search Manual
   */
  const renderComponentInputSearchManual = () => {
    return (<div className="popup-esr2 popup-esr3 popup-employee-height-auto">
      <div className="popup-esr2-content">
        <div className="modal-header">
          <div className="left">
            <div className="popup-button-back">
              <a className="icon-small-primary icon-return-small disable" />
              <span className="text">
                <img className="icon-popup-big" src="../../content/images/ic-sidebar-business-card.svg" />
                {modalMode === MY_BUSINESS_CARD_MODES.MODE_EDIT_MY_BUSINESS_CARD
                  ? translate('businesscards.mylist.edit-title')
                  : translate('businesscards.mylist.title')}
              </span>
            </div>
          </div>
          {showModal && (
            <div className="right">
              <button className="icon-small-primary icon-link-small" onClick={openNewWindow} />
              <button className="icon-small-primary icon-close-up-small line" onClick={handleClosePopup} />
            </div>
          )}
        </div>
        <div className="popup-esr2-body">
          {(errorMessageInModal && errorMessageInModal.length > 0) &&
            <BoxMessage messageType={MessageType.Error}
              messages={parseValidateError()}
              className="mw-100 mb-3"
            />}

          <div className="row">
            {
              (listUpdateTime && listMode === SUB_LIST_TYPE.AUTO) &&
              <div className="col-lg-12 form-group">
                <label>{translate('businesscards.mylist.list-update-time', { 0: listUpdateTime })}</label>
              </div>
            }
            <div className="col-lg-6 form-group break-line common">
              <label>
                {translate('businesscards.mylist.my-title')}
                <a className="label-red ml-15" >{translate('businesscards.mylist.required')}</a>
              </label>
              <div className={isSubmitted && getErrorInfo('businessCardListName') ? "input-common-wrap error" : "input-common-wrap"}>
                <input
                  className={"input-normal" + (validateName ? " error mb-1" : "")}
                  type="text"
                  ref={txtInputFocus}
                  value={businessCardListName}
                  placeholder={translate('businesscards.mylist.mylist-name-placeholder')}
                  onBlur={() => { setBusinessCardListName(businessCardListName.trim()) }}
                  onChange={(e) => { setBusinessCardListName(e.target.value); setValidateName("") }}
                />
                {validateName && (
                  <span className="messenger error-validate-msg font-size-14" >{validateName}</span>
                )}
              </div>
            </div>
            <div className="col-lg-6 form-group common">
              <label>{translate('businesscards.mylist.mylist-radio-manual')}</label>
              <div className="wrap-check-radio d-flex version2">
                <p className="radio-item">
                  <input
                    type="radio"
                    id="radio106"
                    name="radio-group6"
                    value={SUB_LIST_TYPE.MANUAL}
                    checked={listMode === SUB_LIST_TYPE.MANUAL}
                    onChange={handleOptionChange}
                  />
                  <label htmlFor="radio106">{translate('businesscards.mylist.radio-manual')}</label>
                </p>
                <p className="radio-item">
                  <input
                    type="radio"
                    id="radio107"
                    name="radio-group6"
                    value={SUB_LIST_TYPE.AUTO}
                    checked={listMode === SUB_LIST_TYPE.AUTO}
                    onChange={handleOptionChange}
                  />
                  <label htmlFor="radio107">{translate('businesscards.mylist.radio-auto')}</label>
                </p>
              </div>
            </div>
          </div>

        </div>
        {renderToastMessage()}

        <div className="user-popup-form-bottom">
          <button className="button-blue button-form-register" onClick={(event) => {
            if (event.target instanceof HTMLElement) {
              event.target.blur();
            }
            handleSubmit()
          }}>
            {modalMode === MY_BUSINESS_CARD_MODES.MODE_EDIT_MY_BUSINESS_CARD
              ? translate('businesscards.mylist.button-edit')
              : translate('businesscards.mylist.button-create')
            }
          </button>
        </div>
      </div>
    </div>)
  }

  /**
   * Render Component Input Search Manual Poppout
   */
  const renderComponentInputSearchManualPoppout = () => {
    return (<div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
      <div className={showModal ? "modal-dialog form-popup" : "form-popup"}>
        <div className="modal-content">
          <div className="modal-header">
            <div className="left">
              <div className="popup-button-back">

                <a className="icon-small-primary icon-return-small disable" />
                <span className="text">
                  <img className="icon-group-user" src="../../content/images/ic-sidebar-business-card.svg" />
                  {modalMode === MY_BUSINESS_CARD_MODES.MODE_EDIT_MY_BUSINESS_CARD
                    ? translate('businesscards.mylist.edit-title')
                    : translate('businesscards.mylist.title')}
                </span>
              </div>
            </div>
            {showModal && (
              <div className="right">
                <button className="icon-small-primary icon-link-small" onClick={openNewWindow} />
                <button className="icon-small-primary icon-close-up-small line" onClick={handleClosePopup} />
              </div>
            )}
          </div>
          <div className="modal-body style-3">
            <div className="popup-content max-height-auto style-3">
              <div className="user-popup-form">
                {(errorMessageInModal && errorMessageInModal.length > 0) &&
                  <BoxMessage messageType={MessageType.Error}
                    messages={parseValidateError()}
                    className="mw-100 mb-3"
                  />}
                <form>
                  <div className="row">
                    {
                      (listUpdateTime && listMode === SUB_LIST_TYPE.AUTO) &&
                      <div className="col-lg-12 form-group">
                        <label>{translate('businesscards.mylist.list-update-time', { 0: listUpdateTime })}</label>
                      </div>
                    }
                    <div className="col-lg-6 form-group break-line common">
                      <label>
                        {translate('businesscards.mylist.my-title')}
                        <a className="label-red ml-15" >{translate('businesscards.mylist.required')}</a>
                      </label>
                      <div className={isSubmitted && getErrorInfo('businessCardListName') ? "input-common-wrap error" : "input-common-wrap"}>
                        <input
                          className={"input-normal" + (validateName ? " error mb-1" : "")}
                          type="text"
                          value={businessCardListName}
                          placeholder={translate('businesscards.mylist.mylist-name-placeholder')}
                          onChange={(e) => { setBusinessCardListName(e.target.value); setValidateName("") }}
                          onBlur={() => { setBusinessCardListName(businessCardListName.trim()) }}
                          autoFocus
                        />
                        {validateName && (
                          <span className="messenger error-validate-msg font-size-14" >{validateName}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6 form-group">
                      <label>{translate('businesscards.mylist.mylist-type')}</label>
                      <div className="wrap-check-radio version2">
                        <p className="radio-item">
                          <input
                            type="radio"
                            id="radio106"
                            name="radio-group6"
                            value={SUB_LIST_TYPE.MANUAL}
                            checked={listMode === SUB_LIST_TYPE.MANUAL}
                            onChange={handleOptionChange}
                          />
                          <label htmlFor="radio106">{translate('businesscards.mylist.radio-manual')}</label>
                        </p>
                        <p className="radio-item">
                          <input
                            type="radio"
                            id="radio107"
                            name="radio-group6"
                            value={SUB_LIST_TYPE.AUTO}
                            checked={listMode === SUB_LIST_TYPE.AUTO}
                            onChange={handleOptionChange}
                          />
                          <label htmlFor="radio107">{translate('businesscards.mylist.radio-auto')}</label>
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="user-popup-form-bottom">
            <button className="button-blue button-form-register" onClick={(event) => { (event.target as HTMLTextAreaElement).blur(); handleSubmit() }}>
              {modalMode === MY_BUSINESS_CARD_MODES.MODE_EDIT_MY_BUSINESS_CARD
                ? translate('businesscards.mylist.button-edit')
                : translate('businesscards.mylist.button-create')
              }
            </button>
          </div>
        </div>
      </div>
    </div>)
  }

  /**
   * Render Component Input Search
   */

  const renderComponentInputSearch = () => {
    return (
      <>
        {listMode === SUB_LIST_TYPE.MANUAL && !props.popout && (
          renderComponentInputSearchManual()
        )}

        {listMode === SUB_LIST_TYPE.MANUAL && props.popout && (
          renderComponentInputSearchManualPoppout()
        )}

        {listMode === SUB_LIST_TYPE.AUTO && (
          <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
            <div className={showModal ? "modal-dialog form-popup" : "form-popup"}>
              <div className="modal-content">
                <div className="modal-header">
                  <div className="left">
                    <div className="popup-button-back">
                      <a className="icon-small-primary icon-return-small disable" />
                      <span className="text">
                        <img className="icon-group-user" src="../../content/images/ic-sidebar-business-card.svg" />
                        {modalMode === MY_BUSINESS_CARD_MODES.MODE_EDIT_MY_BUSINESS_CARD
                          ? translate('businesscards.mylist.edit-title')
                          : translate('businesscards.mylist.title')}
                      </span>
                    </div>
                  </div>
                  {showModal && (
                    <div className="right">
                      <button className="icon-small-primary icon-link-small" onClick={openNewWindow} />
                      <button className="icon-small-primary icon-close-up-small line" onClick={handleClosePopup} />
                    </div>
                  )}
                </div>
                <div className="modal-body style-3">
                  <div className="popup-content max-height-auto style-3">
                    <div className="user-popup-form">
                      {(errorMessageInModal && errorMessageInModal.length > 0) &&
                        <BoxMessage messageType={MessageType.Error}
                          messages={parseValidateError()}
                          className="mw-100 mb-3"
                        />}
                      <form>
                        <div className="row">
                          {
                            (listUpdateTime && listMode === SUB_LIST_TYPE.AUTO) &&
                            <div className="col-lg-12 form-group">
                              <label>{translate('businesscards.mylist.list-update-time', { 0: listUpdateTime })}</label>
                            </div>
                          }
                          <div className="col-lg-6 form-group break-line common">
                            <label>
                              {translate('businesscards.mylist.my-title')}
                              <a className="label-red ml-15" >{translate('businesscards.mylist.required')}</a>
                            </label>
                            <div className={isSubmitted && getErrorInfo('businessCardListName') ? "input-common-wrap error" : "input-common-wrap"}>
                              <input
                                className={"input-normal" + (validateName ? " error mb-1" : "")}
                                type="text"
                                value={businessCardListName}
                                placeholder={translate('businesscards.mylist.mylist-name-placeholder')}
                                onChange={(e) => { setBusinessCardListName(e.target.value); setValidateName("") }}
                                onBlur={() => { setBusinessCardListName(businessCardListName.trim()) }}
                                autoFocus
                              />
                              {validateName && (
                                <span className="messenger error-validate-msg font-size-14" >{validateName}</span>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-6 form-group">
                            <label>{translate('businesscards.mylist.mylist-type')}</label>
                            <div className="wrap-check-radio version2">
                              <p className="radio-item">
                                <input
                                  type="radio"
                                  id="radio132"
                                  name="radio-group10"
                                  value={SUB_LIST_TYPE.MANUAL}
                                  checked={listMode === SUB_LIST_TYPE.MANUAL}
                                  onChange={handleOptionChange}
                                />
                                <label htmlFor="radio132">{translate('businesscards.mylist.radio-manual')}</label>
                              </p>
                              <p className="radio-item">
                                <input
                                  type="radio"
                                  id="radio131"
                                  name="radio-group10"
                                  value={SUB_LIST_TYPE.AUTO}
                                  checked={listMode === SUB_LIST_TYPE.AUTO}
                                  onChange={handleOptionChange}
                                />
                                <label htmlFor="radio131">{translate('businesscards.mylist.radio-auto')}</label>
                              </p>
                            </div>
                          </div>
                          {listMode === SUB_LIST_TYPE.AUTO && (
                            <div className="col-lg-6 break-line form-group">
                              <div className="setting-search-conditions">
                                <label htmlFor="input-common">
                                  {translate('businesscards.mylist.auto-group-condition-search-title')}
                                </label>
                                <button onClick={handleDisplaySetting} className="button-primary button-activity-registration">
                                  {translate('businesscards.mylist.setting-search-condition')}
                                </button>
                              </div>
                              <div ref={dropBody}>
                                <div className="search-conditions">
                                  {/* <div className="search-conditions"> */}
                                  <p className="check-box-item">
                                    <label className="icon-check">
                                      <input
                                        type="checkbox"
                                        name="isOverWrite"
                                        checked={isOverWrite === 1}
                                        onChange={() => setIsOverWrite(isOverWrite === 1 ? 0 : 1)}
                                      />
                                      <i /> {translate('businesscards.mylist.is-overwrite')}
                                    </label>
                                  </p>
                                  {listFieldSearch &&
                                    listFieldSearch.map((item, index) => (
                                      <DynamicControlField
                                        key={index}
                                        isFocus={index === 0 && first}
                                        belong={FIELD_BELONG.BUSINESS_CARD}
                                        elementStatus={modalMode !== MY_BUSINESS_CARD_MODES.MODE_CREATE_MY_BUSINESS_CARD && getDataStatusControl(item)}
                                        fieldInfo={item}
                                        isDnDAddField={showCustomField}
                                        isDnDMoveField={showCustomField}
                                        updateStateElement={updateStateField}
                                        errorInfo={getErrorInfo(item.fieldName)}
                                        moveFieldCard={onMoveField}
                                      />
                                    ))}
                                </div>
                                <DropSearchCondition>
                                  <div className="drop-search-condition"></div>
                                </DropSearchCondition>
                              </div>
                            </div>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="user-popup-form-bottom">
                  <button className="button-blue button-form-register" onClick={(event: any) => { event.target.blur(); handleSubmit() }}>
                    {modalMode === MY_BUSINESS_CARD_MODES.MODE_EDIT_MY_BUSINESS_CARD
                      ? translate('businesscards.mylist.button-edit')
                      : translate('businesscards.mylist.button-create')
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="modal-backdrop show" />
      </>
    );
  };

  /**
   * Render Component Setting Search
   */

  const renderComponentSettingSearch = () => {
    return (
      <>
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
          <div className={showModal ? "modal-dialog form-popup" : "form-popup"}>
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    <button
                      className={props.popout ? 'icon-small-primary icon-return-small' : 'icon-small-primary icon-return-small disable'}
                      onClick={props.popout ? handleBackPopup : e => e.preventDefault()}
                    />
                    <span className="text">
                      <img className="icon-group-user" src="../../content/images/ic-sidebar-business-card.svg" />
                      {modalMode === MY_BUSINESS_CARD_MODES.MODE_EDIT_MY_BUSINESS_CARD
                        ? translate('businesscards.mylist.edit-title')
                        : translate('businesscards.mylist.title')}
                    </span>
                  </div>
                </div>
                {showModal && (
                  <div className="right">
                    <button className="icon-small-primary icon-link-small" onClick={openNewWindow} />
                    <button className="icon-small-primary icon-close-up-small line" onClick={handleClosePopup} />
                  </div>
                )}
              </div>

              <div className="modal-body style-3">
                <div className="popup-content max-height-auto style-3">
                  <div className="user-popup-form">
                    <form className="add-popup">
                      <div className="row">
                        {
                          (listUpdateTime && listMode === SUB_LIST_TYPE.AUTO) &&
                          <div className="col-lg-12 form-group">
                            <label>{translate('businesscards.mylist.list-update-time', { 0: listUpdateTime })}</label>
                          </div>
                        }
                        <div className="col-lg-8 form-group">
                          <label>
                            {translate('businesscards.mylist.my-title')}
                            <a className="label-red ml-15">{translate('businesscards.mylist.required')}</a>
                          </label>
                          <div className={isSubmitted && getErrorInfo('businessCardListName') ? "input-common-wrap error" : "input-common-wrap"}>
                            <input
                              className={"input-normal disable" + (validateName ? " error mb-1" : "")}
                              type="text"
                              value={businessCardListName}
                              placeholder={translate('businesscards.mylist.mylist-name-placeholder')}
                              onChange={(e) => { setBusinessCardListName(e.target.value); setValidateName("") }}
                              onBlur={() => { setBusinessCardListName(businessCardListName.trim()) }}
                              autoFocus
                              disabled
                            />
                            {validateName && (
                              <span className="messenger error-validate-msg font-size-14" >{validateName}</span>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 form-group">
                          <label>{translate('businesscards.mylist.mylist-type')}</label>
                          <div className="wrap-check-radio version2">
                            <p className="radio-item">
                              <input type="radio" id="radio132" name="radio-group10" disabled />
                              <label htmlFor="radio132">{translate('businesscards.mylist.radio-manual')}</label>
                            </p>
                            <p className="radio-item">
                              <input type="radio" id="radio131" name="radio-group10" defaultChecked disabled />
                              <label htmlFor="radio131">{translate('businesscards.mylist.radio-auto')}</label>
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-8 break-line form-group">
                          <div className="setting-search-conditions">
                            <label htmlFor="input-common">
                              {translate('businesscards.mylist.auto-group-condition-search-title')}
                            </label>
                            <a className="button-primary button-activity-registration disable">
                              {translate('businesscards.mylist.setting-search-condition')}
                            </a>
                          </div>
                          <div ref={dropBody}>
                            <div className="search-conditions">
                              {/* <div className="search-conditions"> */}
                              <p className="check-box-item">
                                <label className="icon-check">
                                  <input
                                    type="checkbox"
                                    name="isOverWrite"
                                    checked={isOverWrite === 1}
                                    disabled
                                    onChange={() => setIsOverWrite(isOverWrite === 1 ? 0 : 1)}
                                  />
                                  <i /> {translate('businesscards.mylist.is-overwrite')}
                                </label>
                              </p>
                              {listFieldSearch &&
                                listFieldSearch.map((item, index) => (
                                  <DynamicControlField
                                    key={index}
                                    className={'form-group'}
                                    belong={FIELD_BELONG.BUSINESS_CARD}
                                    fieldInfo={item}
                                    isDisabled={true}
                                    isDnDAddField={showCustomField}
                                    isDnDMoveField={showCustomField}
                                    moveFieldCard={onMoveField}
                                  />
                                ))}
                            </div>
                            <DropSearchCondition>
                              <div className="drop-search-condition"></div>
                            </DropSearchCondition>
                          </div>
                        </div>
                      </div>

                    </form>
                  </div>
                </div>
                <DynamicSearchConditionListComponent
                  handleCloseSettingField={handleCloseSettingField}
                  handleUpdateSettingField={handleUpdateSettingField}
                  changeListFieldChosen={changeListFieldChosen}
                  customFieldsInfo={customFieldsInfo}
                  fieldBelong={FIELD_BELONG.BUSINESS_CARD}
                  listFieldSearch={listFieldSearch}
                  searchConditionInputPlaceholder={translate('businesscards.mylist.search-condition-input-placeholder')}
                  iconFunction={'ic-sidebar-business-card.svg'}
                />
              </div>
              <div className="user-popup-form-bottom">
                <button className="button-blue button-form-register disable" disabled onClick={(event: any) => { event.target.blur(); handleSubmit() }}>
                  {modalMode === MY_BUSINESS_CARD_MODES.MODE_EDIT_MY_BUSINESS_CARD
                    ? translate('businesscards.mylist.button-edit')
                    : translate('businesscards.mylist.button-create')
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show" />
      </>
    );
  };

  if (props.sideBarCurrentId && !props.cardList) return <></>;

  if (showModal) {
    return (
      <div className="wrap-card">
        <Modal isOpen fade toggle={() => { }} backdrop id="popup-field-search" autoFocus zIndex="auto">
          {!showCustomField && renderComponentInputSearch()}
          {showCustomField && renderComponentSettingSearch()}
        </Modal>
      </div>
    );
  } else {
    if (props.popout) {
      return (
        <div className="wrap-card">
          {!showCustomField && renderComponentInputSearch()}
          {showCustomField && renderComponentSettingSearch()}
        </div>
      );
    } else {
      return <></>;
    }
  }
};

/**
 * Map State To Props
 * @param param0 
 */
const mapStateToProps = ({ applicationProfile, myListModalState, businessCardList }: IRootState) => ({
  tenant: applicationProfile.tenant,
  modalAction: myListModalState.modalAction,
  cardList: myListModalState.cardList,
  searchConditions: myListModalState.searchConditions,
  errorValidates: myListModalState.errorItems,
  errorMsg: myListModalState.errorMsg,
  successMessage: myListModalState.successMessage,
  listUpdateTime: myListModalState.listUpdateTime,
  listBusinessCardList: businessCardList.listBusinessCardList
});

/**
 * Map Dispatch To Props
 */
const mapDispatchToProps = {
  reset,
  handleInitializeListModal,
  handleCreateList,
  handleUpdateList,
  startExecuting,
  handleGetGeneralSetting
};

export default connect<IAddEditMyListModalStateProps, IAddEditMyListModalDispatchProps, IAddEditMyListModalOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(AddEditMyListModal);
