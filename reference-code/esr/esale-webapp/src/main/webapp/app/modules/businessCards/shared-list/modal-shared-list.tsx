import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'reactstrap';
import FocusTrap from 'focus-trap-react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { translate, Storage } from 'react-jhipster';
import { IRootState } from '../../../shared/reducers';
import { useDrop } from 'react-dnd';
import { FIELD_ITEM_TYPE_DND } from 'app/shared/layout/dynamic-form/constants'
import { decodeUserLogin } from 'app/shared/util/string-utils';
import {
  handleInitListModal,
  handleSubmitListInfos,
  reset,
  resetError,
  SharedListAction,
  getEmployees,
  handleGetGeneralSetting,
  ACTION_TYPES
} from './shared-list.reducer';
import {
  SHARE_LISTS_MODES,
  LIST_TYPES,
} from '../constants'
import DynamicControlField from '../../../shared/layout/dynamic-form/control-field/dynamic-control-field';
import RadioBoxSwichMode from './radio-box-swich-mode'
import BoxMessage, { MessageType } from '../../../shared/layout/common/box-message'
import DynamicSearchConditionListComponent from '../../../shared/layout/dynamic-form/list/dynamic-search-condition-list';
import { TagAutoCompleteMode, TagAutoCompleteType } from 'app/shared/layout/common/suggestion/constants';
import { FIELD_BELONG } from 'app/config/constants';
import TagAutoComplete from '../../../shared/layout/common/suggestion/tag-auto-complete';
import StringUtils from 'app/shared/util/string-utils';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import SelectButtonBox from './select-button-box';
import { startExecuting } from 'app/shared/reducers/action-executing';
import { REQUEST } from 'app/shared/reducers/action-type.util';
import styled from 'styled-components';
import { parseJsonB } from 'app/modules/setting/utils.ts';
import { USER_ICON_PATH } from 'app/config/constants';

const DropSearchCondition = styled.div`
  .drop-search-condition {
    min-height: 300px;
    width: 100%;
  }
`;
// import { parseJson } from 'app/modules/businessCards/util';

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  CreatUpdateSuccess
}
const PULL_DOWN_MEMBER_GROUP_PERMISSION = [
  {
    itemId: 1,
    itemLabel: 'businesscards.sharelist.permision.viewer'
  },
  {
    itemId: 2,
    itemLabel: 'businesscards.sharelist.permision.owner'
  }
];


interface IModalSharedGorupDispatchProps {
  // get business card list
  handleInitListModal,

  // submit create or update
  handleSubmitListInfos,

  // reset error
  resetError,

  // handle get general setting
  handleGetGeneralSetting,

  // reset
  reset,

  // get employees
  getEmployees,

  // start modal
  startExecuting
}

interface IModalSharedGorupStateProps {
  // list field search
  listFieldSearch,

  // group participants
  groupParticipants: any[],

  // action
  action,

  // Error Validates
  errorValidates,

  // Error Message In Modal
  errorMessageInModal,

  // List Update Time
  listUpdateTime,

  // get tenant
  tenant,

  // shared list
  list,

  // List Row id
  rowIds,

  // list employees
  employees,

  // Owner List
  ownerList,

  // Viewer List
  viewerList,

  // Error Message
  errorMessage,

  // List Business Card List
  listBusinessCardList,

  isOverwriteInput
}

interface IModalSharedListOwnProps {
  iconFunction?: string,
  conditionSearch?: { fieldId, fieldType, isDefault, fieldName, fieldValue, searchType, searchOption, isSearchBlank }[],
  onCloseModal?: (isUpdate, saveCondition?: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[]) => void,
  onSubmit?: (saveCondition: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[]) => void,
  popout?: boolean,
  popoutParams?: any,
  groupMode?: number,
  groupId?: number,
  isOwnerGroup?: boolean,
  isAutoGroup?: boolean,
  groupMembers?: any,
  customFieldsInfo
}

type IModalSharedGorupProps = IModalSharedGorupDispatchProps & IModalSharedGorupStateProps & IModalSharedListOwnProps;

const ModalSharedList: React.FC<IModalSharedGorupProps> = (props) => {

  const ref = useRef(null);
  // const [first, setFirst] = useState(false);
  const [groupMode, setGroupMode] = useState(props.groupMode ? props.groupMode : props.popoutParams.groupMode);
  const [showCustomField, setShowCustomField] = useState(false);
  const [customFieldsInfo, setCustomFieldsInfo] = useState([props.customFieldsInfo]);
  const [listName, setListName] = useState("");
  const [listUpdateTime, setListUpdateTime] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAutoGroup, setIsAutoGroup] = useState(props.isAutoGroup);
  const [isOverWrite, setIsOverWrite] = useState(null);
  const [listFieldSetting, setListFieldSetting] = useState([]);
  const [msgError, setMsgError] = useState("");
  const [msgSuccess, setMsgSuccess] = useState("");
  const [fields, setFields] = useState([]);
  const [listFieldSearch, setListFieldSearch] = useState([]);
  const [saveConditionSearch, setSaveConditionSearch] = useState(props.conditionSearch ? _.cloneDeep(props.conditionSearch) : []);
  const [groupParticipants, setGroupParticipants] = useState([]);
  const [errorValidates, setErrorValidates] = useState(props.errorValidates);
  const [errorMessageInModal, setErorMessageInModal] = useState(props.errorMessageInModal);
  const [lstGroupMembers, setLstGroupMembers] = useState(props.groupMembers);
  const [tags, setTags] = useState([]);
  const [isSuccess] = useState(false);
  const [oldListFieldSearch, setOldListFieldSearch] = useState(null);
  const [disableChange, setDisableChange] = useState(false);
  const [group, setGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState(props.groupMembers);
  const [groupId, setGroupId] = useState(props.groupId);
  const [showValidateName, setShowValidateName] = useState("");
  const [showValidateTag, setShowValidateTag] = useState();
  const [updatedDate, setUpdatedDate] = useState(null);
  const txtInputFocus = useRef(null);
  const [isHover, changeIsHover] = useState(false);

  useEffect(() => {
    txtInputFocus && txtInputFocus.current && txtInputFocus.current.focus();
    return () => {
      props.reset();
    }
  }, []);

  const [, dropBody] = useDrop({
    accept: FIELD_ITEM_TYPE_DND.ADD_CARD,
    drop(item, monitor) {
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  })

  /**
   * get Permissions
   */
  const getPermissions = () => {
    const items = [];
    PULL_DOWN_MEMBER_GROUP_PERMISSION.forEach((permison) => {
      const labelText = translate(permison.itemLabel);
      items.push({ value: permison.itemId, text: labelText });
    }
    )
    return items;
  }

  /**
   * Action Select Tag
   */
  const onActionSelectTag = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    const tmpListTags = listTag.map(el => {
      if (el.participantType) {
        return el;
      }
      return ({ ...el, participantType: 2 })
    });
    ref.current.setTags(tmpListTags);
    setTags(tmpListTags);
  }

  /**
   * Delete Tag
   */
  const onDeleteTag = (idx) => {
    ref.current.deleteTag(idx);
  }

  /**
   * Get List Action
   */
  const getListAction = () => {
    const tmpPullDownMemberGroupPermission = [];
    PULL_DOWN_MEMBER_GROUP_PERMISSION.forEach((e, idx) => {
      tmpPullDownMemberGroupPermission.push({ id: e.itemId, name: translate(e.itemLabel) });
    });
    return tmpPullDownMemberGroupPermission;
  }

  // Get List Owner
  const getOwnerList = (paticipant) => {
    let result = [];

    const ownerPaticipant = paticipant.filter(y => y.participantType === 2)
    if (ownerPaticipant.length > 0) {
      ownerPaticipant.map(op => {
        if (op.groupId && op.employeesGroups.length > 0) {
          op.employeesGroups.map(eg => {
            if (eg.employeeId) {
              result = result.concat(eg.employeeId.toString());
            }
          })
        } else if (op.employeeId) {
          result = result.concat(op.employeeId.toString())
        }
      })
    }
    result = result.filter((item, index) => result.indexOf(item) === index);
    return result;
  }

  // Get List Viewer
  const getViewerList = (paticipant) => {
    let result = [];
    const viewerPaticipant = paticipant.filter(y => y.participantType === 1)
    if (viewerPaticipant.length > 0) {
      viewerPaticipant.map(vp => {
        if (vp.employeeId) {
          result = result.concat(vp.employeeId.toString());
        }
        if (vp.groupId && vp.employeesGroups?.length > 0) {
          vp.employeesGroups.map(empDer => {
            if (empDer.employeeId) {
              result = result.concat(empDer.employeeId.toString());
            }
          })
        } else if (vp.employeesGroups?.length > 0 && vp.employeesGroups[0].employeeId) {
          result = result.concat(vp.employeesGroups[0].employeeId.toString())
        }
      })
    }
    result = result.filter((item, index) => result.indexOf(item) === index);
    return result;
  }

  /**
  * Check Change Search Condition
  */
  const checkChangeSearchCondition = (defaultSC, currentSC) => {
    let isChange = false;
    if (isAutoGroup) {
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
  * Change Input Edit
  */
  const isChangeInputEdit = () => {
    switch (groupMode) {
      case SHARE_LISTS_MODES.MODE_CREATE_GROUP:
      case SHARE_LISTS_MODES.MODE_CREATE_GROUP_LOCAL:
      case SHARE_LISTS_MODES.MODE_COPY_GROUP:
        return listName || groupParticipants && groupParticipants.length > 0 || isAutoGroup
      case SHARE_LISTS_MODES.MODE_EDIT_GROUP:
        if (props.isAutoGroup) {
          return listName !== props.list.businessCardListName
            || checkChangeSearchCondition(props.list.searchConditions, saveConditionSearch)
            || !isAutoGroup
            || JSON.stringify(tags) !== JSON.stringify(props.groupParticipants)
        } else {
          return listName !== props.list.businessCardListName
            || checkChangeSearchCondition(props.list.searchConditions, saveConditionSearch)
            || isAutoGroup
            || JSON.stringify(tags) !== JSON.stringify(props.groupParticipants)
        }
      case SHARE_LISTS_MODES.MODE_SWICH_GROUP_TYPE:
        return groupParticipants && groupParticipants.length > 0;
      default:
        return false;
    }
  }

  /**
   * Execute Dirty Check
   */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    const isChange = isChangeInputEdit();
    if (isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  }

  /**
   * Get Init List Params
   */
  const getInitGroupParams = (grpMode) => {
    let listMode: number
    if (isAutoGroup) {
      listMode = 2
    } else {
      listMode = 1
    }
    const overWrite = isOverWrite ? 1 : 0
    const paticipant = tags;
    const groudIdParam = _.cloneDeep(groupId);
    switch (grpMode) {
      case SHARE_LISTS_MODES.MODE_CREATE_GROUP:
      case SHARE_LISTS_MODES.MODE_CREATE_GROUP_LOCAL:
      case SHARE_LISTS_MODES.MODE_COPY_GROUP: {
        const ownerList = getOwnerList(paticipant);
        const viewerList = getViewerList(paticipant);
        return {
          listName: listName === undefined ? "" : listName,
          groupType: LIST_TYPES.SHARED_LIST,
          listMode,
          overWrite,
          groupMembers: lstGroupMembers,
          ownerList,
          viewerList,
          searchConditions: []
        };
      }
      case SHARE_LISTS_MODES.MODE_EDIT_GROUP:
      case SHARE_LISTS_MODES.MODE_SWICH_GROUP_TYPE: {
        const ownerList1 = getOwnerList(paticipant);
        const viewerList1 = getViewerList(paticipant);
        return {
          groupId: groudIdParam,
          listName: listName === undefined ? "" : listName,
          listMode,
          groupType: LIST_TYPES.SHARED_LIST,
          overWrite,
          groupMembers: lstGroupMembers,
          ownerList: ownerList1,
          viewerList: viewerList1,
          updatedDate2: updatedDate,
          searchConditions: []
        };
      }
      default:
        return null;
    }
  }

  /**
* Update State Session
*/
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      const saveObj = {
        listName,
        groupMode,
        isAutoGroup,
        isOverWrite,
        listFieldSearch,
        msgError,
        msgSuccess,
        fields,
        groupParticipants,
        errorValidates,
        errorMessageInModal,
        customFieldsInfo,
        lstGroupMembers,
        groupMembers,
        tags,
        listFieldSetting,
        group,
        groupId,
        oldListFieldSearch,
        showCustomField,
        disableChange,
        updatedDate
      };
      Storage.local.set(ModalSharedList.name, _.cloneDeep(saveObj));
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = _.cloneDeep(Storage.local.get(ModalSharedList.name));
      if (saveObj) {
        setListName(saveObj.listName);
        setGroupMode(saveObj.groupMode);
        setIsAutoGroup(saveObj.isAutoGroup);
        setIsOverWrite(saveObj.isOverWrite);
        setListFieldSearch(saveObj.listFieldSearch);
        setMsgError(saveObj.msgError);
        setMsgSuccess(saveObj.msgSuccess);
        setFields(saveObj.fields);
        setGroupParticipants(saveObj.groupParticipants);
        setErrorValidates(saveObj.errorValidates);
        setErorMessageInModal(saveObj.errorMessageInModal);
        setCustomFieldsInfo(saveObj.customFieldsInfo);
        setLstGroupMembers(saveObj.lstGroupMembers);
        setGroupMembers(saveObj.groupMembers);
        setTags(saveObj.tags);
        setListFieldSetting(saveObj.listFieldSetting);
        setGroup(saveObj.group);
        setGroupId(saveObj.groupId);
        setOldListFieldSearch(saveObj.oldListFieldSearch);
        setShowCustomField(saveObj.showCustomField);
        setUpdatedDate(saveObj.updatedDate);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(ModalSharedList.name);
    }
  }

  /**
  * Close Modal
  */
  const closeModal = (isUpdate?) => {
    props.resetError();
    props.onCloseModal(isUpdate);
    setShowCustomField(false);
    setListFieldSetting([]);
  }

  /**
  * Handle Close Modal
  */
  const handleCloseModal = () => {
    if (isChangeInputEdit()) executeDirtyCheck(() => closeModal());
    else closeModal();
  }

  useEffect(() => {
    if (props.action === SharedListAction.CreateUpdateGroupSuccess) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CreatUpdateSuccess, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        updateStateSession(FSActionTypeScreen.RemoveSession);
        closeModal(true);
      }
    }
  }, [props.action]);

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, 'forceCloseWindow': true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        closeModal();
      }
    }
  }, [forceCloseWindow]);

  useEffect(() => {
    if (props.listFieldSearch && props.listFieldSearch.length > 0) {
      const lstFieldSearch = props.listFieldSearch;
      lstFieldSearch.forEach(item => {
        item.fieldType = props.customFieldsInfo.find(x => x.fieldId === item.fieldId)?.fieldType;
      })
      setListFieldSearch(lstFieldSearch);
    }
    if (props.isOverwriteInput !== null) {
      setIsOverWrite(props.isOverwriteInput);
    } else {
      setIsOverWrite(true);
    }
  }, [props.listFieldSearch]);

  useEffect(() => {
    if (props.isOverwriteInput !== null) {
      setIsOverWrite(props.isOverwriteInput);
    } else {
      setIsOverWrite(true);
    }
  }, [props.isOverwriteInput]);

  useEffect(() => {
    if (props.list) {
      setGroup(props.list);
      let bcListname = props.list.businessCardListName;
      if (groupMode === SHARE_LISTS_MODES.MODE_COPY_GROUP) {
        const listCopy = props.listBusinessCardList.filter(item => {
          return item.listName
            && item.listName.slice(props.list.businessCardListName.length, item.listName.length).includes(translate('businesscards.mylist.duplicate-check'))
            && item.listName.includes(props.list.businessCardListName)
        })
        if (listCopy.length > 0) {
          const listCheck = Array.from(Array(listCopy.length), (x, i) => i + 1)
          _.forEach(listCheck, (index) => {
            if (!listCopy.find(item => item.list.includes(translate('businesscards.mylist.duplicate', { n: index })))) {
              bcListname = props.list.businessCardListName + translate('businesscards.mylist.duplicate', { n: index });
              return false;
            }
            bcListname = props.list.businessCardListName + translate('businesscards.mylist.duplicate', { n: listCopy.length + 1 });
          })
        }
        else {
          bcListname = props.list.businessCardListName + translate('businesscards.mylist.duplicate', { n: 1 });
        }
      }
      setListName(bcListname);
      setUpdatedDate(props.list.updatedDate);
    }
  }, [props.list]);

  useEffect(() => {
    if (props.listUpdateTime) {
      setListUpdateTime(props.listUpdateTime);
    }
  }, [props.listUpdateTime])

  useEffect(() => {
    if (props.errorValidates && props.errorValidates.length > 0) {
      setErrorValidates(props.errorValidates);
    }
  }, [props.errorValidates]);

  useEffect(() => {
    if (props.errorMessageInModal && props.errorMessageInModal.length > 0) {
      setErorMessageInModal(_.cloneDeep(props.errorMessageInModal));
    }
  }, [props.errorMessageInModal]);

  useEffect(() => {
    if (props.customFieldsInfo && props.customFieldsInfo.length > 0) {
      setCustomFieldsInfo(props.customFieldsInfo);
    }
  }, [props.customFieldsInfo]);

  useEffect(() => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setShouldRender(true);
      setForceCloseWindow(false);
      updateStateSession(FSActionTypeScreen.RemoveSession);
      document.body.className = "wrap-card modal-open";
    } else {
      const infoUserLogin = decodeUserLogin();
      const photoFileUrl = Storage.session.get(USER_ICON_PATH, 'default icon')

      const ownerUser = {
        employeeId: infoUserLogin['custom:employee_id'],
        employeeName: infoUserLogin['custom:employee_surname'],
        employeeSurname: infoUserLogin['custom:employee_surname'],
        participantType: 2,
        employeeIcon: { fileUrl: photoFileUrl }
      }
      setShowModal(true);
      setShowCustomField(false);
      setShouldRender(true);
      setSaveConditionSearch(props.conditionSearch);
      setTags([...tags, ownerUser]);
      // ref.current.setTags([...tags, ownerUser]);
      props.handleGetGeneralSetting();
    }
    return () => {
      document.body.className = document.body.className.replace('modal-open', '');
    }
  }, []);

  useEffect(() => {
    if (!props.popout && props.groupId) {

      props.handleInitListModal(props.groupId, props.isOwnerGroup, true);
    }
    return () => { props.reset() }
  }, []);

  useEffect(() => {
    if (errorMessageInModal && errorMessageInModal.length > 0) {
      setMsgError(errorMessageInModal);
    }
  }, [errorMessageInModal]);

  /**
  * Handle Submit Modal
  */
  const handleSubmitModal = () => {

    const initParam = getInitGroupParams(groupMode);
    const groupIdIn = initParam.groupId;
    const businessCardListName = initParam.listName;
    const listType = initParam.groupType;
    const listMode = initParam.listMode;
    const overWrite = initParam.overWrite;
    const groupMembersIn = initParam.groupMembers;
    const ownerList = initParam.ownerList;
    const viewerList = initParam.viewerList;
    let searchConditionsIn = initParam.searchConditions;
    const updatedDate2 = initParam.updatedDate2;
    let tmpConditions = [];

    if (!listName) {
      setShowValidateName(translate("messages.ERR_COM_0013"))
    } else if (listName.length > 255) {
      setShowValidateName(translate("messages.ERR_COM_0025", { 0: 255 }))
    } else {
      setShowValidateName('');
    }

    if (ownerList.length <= 0 && viewerList.length <= 0) {
      setShowValidateTag(translate("messages.ERR_COM_0013"));
    } else if (ownerList.length <= 0 && viewerList.length >= 1) {
      setShowValidateTag(translate("messages.ERR_COM_0061"));
    } else {
      setShowValidateTag(undefined);
    }

    if (listName && listName.length < 255 && ownerList.length > 0) {
      if (saveConditionSearch && listFieldSearch && saveConditionSearch.length > 0 && listFieldSearch.length > 0 && isAutoGroup) {
        const conditionSearchCheck = saveConditionSearch.map(item => {
          if (item.isSearchBlank) {
            return { ...item, fieldValue: "" }
          }
          return item
        })
        conditionSearchCheck.forEach(e => {
          const filters = listFieldSearch.filter(item => {
            if (e.isSearchBlank) {
              return { ...item };
            }
            return item.fieldId.toString() === e.fieldId.toString() && e.fieldValue;
          });
          if (filters.length > 0) {
            const isArray = Array.isArray(e.fieldValue);
            let val;
            if (isArray) {
              val = [];
              e.fieldValue.forEach((element, idx) => {
                if (element['from']) {
                  val.push({ from: element.from, to: element.to });
                  // val.push({ to: element.to });
                } else {
                  val.push(element);
                }
              });
              val = val.length > 0 ? JSON.stringify(val) : "";
            } else {
              val = e.fieldValue;
            }

            tmpConditions.push({
              businessCardListSearchConditionId: filters[0].businessCardListSearchId,
              fieldId: e.fieldId,
              fieldType: parseInt(e.fieldType, 10),
              searchType: parseInt(e.searchType, 10),
              searchOption: parseInt(e.searchOption, 10),
              searchValue: val,
              updatedDate: filters[0].updatedDate,
            });
          }
        });
      } else {
        tmpConditions = [];
      }
      if (groupMode !== SHARE_LISTS_MODES.MODE_SWICH_GROUP_TYPE) {
        searchConditionsIn = tmpConditions;
      }
      if (searchConditionsIn === undefined) {
        searchConditionsIn = [];
      }

      switch (groupMode) {
        case SHARE_LISTS_MODES.MODE_CREATE_GROUP:
        case SHARE_LISTS_MODES.MODE_CREATE_GROUP_LOCAL:
        case SHARE_LISTS_MODES.MODE_COPY_GROUP:
          props.startExecuting(REQUEST(ACTION_TYPES.SHARED_LIST_CREATE));
          break;
        case SHARE_LISTS_MODES.MODE_EDIT_GROUP:
        case SHARE_LISTS_MODES.MODE_SWICH_GROUP_TYPE:
          props.startExecuting(REQUEST(ACTION_TYPES.SHARED_LIST_UPDATE));
          break;
        default:
          break;
      }
      setErorMessageInModal([]);
      setErrorValidates([]);
      searchConditionsIn.forEach(x => delete x.fieldType);

      props.handleSubmitListInfos(groupIdIn, businessCardListName, listType, listMode, ownerList, viewerList, overWrite, searchConditionsIn, groupMembersIn, updatedDate2, groupMode);
    }
  }

  /**
   * Get Count Member Local Add
   */
  const getCountMemberLocalAdd = () => {
    return (groupMembers && groupMembers.length > 0) ? groupMembers.length : 0;
  }

  /**
   * Handle Close Setting Field
   */
  const handleCloseSettingField = () => {
    setShowCustomField(false);
    setListFieldSetting([]);
    setDisableChange(false);
    setListFieldSearch(_.cloneDeep(oldListFieldSearch));
  }

  /**
  * Handle Display Setting
  */
  const handleDisplaySetting = () => {
    setOldListFieldSearch(_.cloneDeep(listFieldSearch));
    setShowCustomField(true);
    setDisableChange(true);
  }

  /**
  * Handle Back Popup
  */
  const handleBackPopup = () => {
    if (showCustomField) {
      handleCloseSettingField();
    }
  }

  // #endregion

  /**
  * Open New Window
  */
  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.8;
    const width = screen.width * 0.8;
    const left = screen.width * 0.3;
    const top = screen.height * 0.3;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    const newWindow = window.open(`${props.tenant}/shared-list/${props.groupMode}`, '', style.toString());
    newWindow.onbeforeunload = () => {
      closeModal();
    }
  }

  // #region my code

  /**
  * Handle Swich Add Mode
  */
  const handleSwichAddMode = (value) => {
    setIsAutoGroup(value.toString() === SHARE_LISTS_MODES.ADD_CONDITION_SEARCH_AUTO.toString())
  }

  /**
  * Handle Check Overide
  */
  const handleCheckOveride = (event) => {
    setIsOverWrite(event.target.checked);
  }

  /**
  * Handle Update Setting Field
  */
  const handleUpdateSettingField = () => {
    setShowCustomField(false);
    if (!listFieldSearch || listFieldSearch.length <= 0) {
      setDisableChange(false);
      return;
    }
    const objParams = [];
    listFieldSearch.forEach((el, idx) => {
      const obj = _.cloneDeep(el);
      obj.fieldOrder = idx + 1;
      objParams.push(obj);
    });
    setFields(objParams);
    setDisableChange(false);
  };

  /**
  * Change List Field Chosen
  */
  const changeListFieldChosen = (lstFieldSearch) => {
    setListFieldSearch(lstFieldSearch);
  }

  /**
  * Get Modal Name
  */
  const getModalName = () => {
    switch (groupMode) {
      case SHARE_LISTS_MODES.MODE_SWICH_GROUP_TYPE:
        return translate('businesscards.sharelist.lbSwitchShareType');
      case SHARE_LISTS_MODES.MODE_COPY_GROUP:
      case SHARE_LISTS_MODES.MODE_CREATE_GROUP:
      case SHARE_LISTS_MODES.MODE_CREATE_GROUP_LOCAL:
        return translate('businesscards.sharelist.lbCreateShare');
      default:
        return translate('businesscards.sharelist.lbEditShare');
    }
  }

  /**
  * Update State Field
  */
  const updateStateField = (item, type, val) => {
    if (val === "") {
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
  }

  /**
  * get Text Button Submit
  */
  const getTextButtomSubmit = () => {
    if (groupMode.toString() === SHARE_LISTS_MODES.MODE_EDIT_GROUP.toString() || groupMode.toString() === SHARE_LISTS_MODES.MODE_SWICH_GROUP_TYPE.toString()) {
      return translate('businesscards.sharelist.btnUpdate');
    } else {
      return translate('businesscards.sharelist.btnCreate');
    }
  }

  const baseUrl = window.location.origin.toString();

  /**
  * Get Icon Function
  */
  const getIconFunction = () => {
    if (!props.iconFunction) {
      return <></>
    } else {
      return <img src={baseUrl + `/content/images/${props.iconFunction}`} alt="" />
    }
  }

  const radioGroupTypeData = {
    fieldName: 'radio',
    fieldLabel: translate('businesscards.sharelist.lbGroupType'),
    fieldItems: [
      {
        itemId: '1',
        itemLabel: translate('businesscards.sharelist.radManual'),
        itemOrder: '1',
        isDefault: false
      },
      {
        itemId: '2',
        itemLabel: translate('businesscards.sharelist.radAuto'),
        itemOrder: '2',
        isDefault: true
      }
    ]
  };

  /**
   * Parse Json To Obj
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
    if (listFieldSearch && listFieldSearch.length > 0) {
      const listFieldSearchCopy = _.cloneDeep(listFieldSearch);
      const dataStatus = listFieldSearchCopy.filter(e => e.fieldId.toString() === item.fieldId.toString());
      if (groupMode !== SHARE_LISTS_MODES.MODE_CREATE_GROUP) {
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
  * Move Field
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

      setListFieldSearch(objectFieldInfos);
    }
  }

  let styleError = '';
  if (!isSuccess) {
    styleError = 'input-common-wrap error';
  }

  /**
   * Parse Validate Error
   */
  const parseValidateError = () => {
    const errorMsg = [];
    if (errorMessageInModal) {
      const errorMessage = errorMessageInModal.filter((v, i) => errorMessageInModal.indexOf(v) === i);
      errorMessage.forEach(element => {
        errorMsg.push(translate('messages.' + element))
      });
    }
    return errorMsg;
  }


  /**
  * set List Participants Type
  */
  const setListParticipantsType = (tagSelected, type) => {
    const tmpParticipantsType = _.cloneDeep(tags);
    tmpParticipantsType.forEach(tag => {
      if (tag.employeeId && tagSelected.employeeId && tag.employeeId === tagSelected.employeeId) {
        tag.participantType = type;
      } else if (
        (tag.groupId && tagSelected.groupId && tag.groupId === tagSelected.groupId) ||
        (tag.departmentId && tagSelected.departmentId && tag.departmentId === tagSelected.departmentId)
      ) {
        tag.participantType = type;
      }
      // else if (tag.departmentId && tagSelected.departmentId && tag.departmentId === tagSelected.departmentId) {
      //   tag.participantType = type;
      // }
    });
    setTags(tmpParticipantsType);
    // ref.current.setTags(tmpParticipantsType);
  }

  /**
  * validate Search
  */
  const validateSearch = (rowIndex) => {
    props.errorValidates.map(
      (e, idx) => {
        if (e === "searchValue" && props.rowIds[idx] === rowIndex) {
          const errorInfo = {
            rowId: e.rowId,
            item: e.item,
            errorCode: errorMessageInModal[idx],
            errorMsg: translate('messages.' + props.errorMessageInModal[idx]),
            params: null
          };
          return errorInfo;
        }
      }
    );
    return null;
  }

  /**
  * render Paticipant List
  */
  const renderPaticipantList = () => {
    return (
      tags && tags.map((member, index) => {
        let tagName1 = "";
        let tagName2 = "";
        let tagName3 = "";
        let tagAvata;
        if (member.employeeIcon) {
          tagAvata = member.employeeIcon.fileUrl;
        } else if (member.employeePhoto && member.employeePhoto.filePath) {
          tagAvata = member.employeePhoto.filePath
        }
        if (member.employeeId) {
          if (member["employeeDepartments"] && member["employeeDepartments"].length > 0) {
            const employeeName = member["employeeName"] ? member["employeeName"] : "";
            const employeeSurname = member["employeeSurname"] ? member["employeeSurname"] : "";
            tagName2 = `${employeeName} ${employeeSurname}`;
            tagName3 = member["employeeDepartments"].map(function (ep) { return StringUtils.getValuePropStr(ep, "positionName"); }).join(" ");
            tagName1 = member["employeeDepartments"].map(function (ep) { return StringUtils.getValuePropStr(ep, "departmentName"); }).join(" ");
            tagName3 = parseJsonB(tagName3) ? parseJsonB(tagName3) : "";
            tagName1 = parseJsonB(tagName1) ? parseJsonB(tagName1) : "";
          } else {
            tagName2 = `${member["employeeName"]} ${member["employeeSurname"]}`;
          }
          if (member["departments"] && Array.isArray(member["departments"])) {
            tagName3 = member["departments"].map(function (ep) { return StringUtils.getValuePropStr(ep, "positionName"); }).join(" ");
            tagName1 = member["departments"].map(function (ep) { return StringUtils.getValuePropStr(ep, "departmentName"); }).join(" ");

            tagName3 = parseJsonB(tagName3) ? parseJsonB(tagName3) : "";
            tagName1 = parseJsonB(tagName1) ? parseJsonB(tagName1) : "";
          }
        }
        else if (member.groupId) {
          tagName1 = member["groupName"];
          if (member["employeesGroups"] && Array.isArray(member["employeesGroups"])) {
            tagName3 = member["employeesGroups"].map(function (ep) {
              return `${ep.employeeName ? StringUtils.getValuePropStr(ep, "employeeName") : ""} ${ep.employeeSurname ? StringUtils.getValuePropStr(ep, "employeeSurname") : ""}`;
            }).join(" ");
            tagName3 = parseJsonB(tagName3) ? parseJsonB(tagName3) : "";
            tagName1 = parseJsonB(tagName1) ? parseJsonB(tagName1) : "";
          }
        }

        return (
          <div className={"business-card-share-list-item show-wrap2 show-wrap-employee col-6 mw-xxl-50 position-relative w-auto"} key={index}>
            <div className="item business-card-share-list-suggestion flex-100 mb-0 mt-8" >
              {
                tagAvata ? <img className="rounded-circle mr-2" width={32} height={32} src={tagAvata} alt="" />
                  :
                  // (<div className="name light-orange">{translate('businesscards.sharelist.icCompany')}</div>)
                  <div className="name green">{tagName2.trim().slice(0, 1)}</div>
              }
              <div className="content">
                <div className="text text1 text-break">{tagName1}</div>
                <div className="text text2 text-break mw-100" >{`${tagName2} ${tagName3}`}</div>
                <span className={disableChange ? "close disable" : "close"}><img src={baseUrl + `/content/images/ic-close.svg`} alt="" title=""
                  onClick={!disableChange ? () => onDeleteTag(index) : null} /></span>
              </div>
              <div className="business-card-share-list-more-action flex-shrink-0">
                <SelectButtonBox
                  disableChange={disableChange}
                  items={getPermissions()}
                  selectedValue={member["participantType"]}
                  handleChooseComponent={(val) => setListParticipantsType(index, val)}
                />
              </div>
            </div>
            <div className="col-12" >
              <div className="business-card-share-list-tooltip-hover z-index-99 unset-height" style={{ left: index % 2 === 0 && '0', right: index % 2 !== 0 && '0', minHeight: "60px" }}>
                <div className="d-flex item">
                  <div className="business-card-share-list-avata name light-orange">
                    {
                      tagAvata ? <img src={tagAvata} alt="" />
                        // : <>{translate('businesscards.sharelist.icCompany')}</>
                        : <div className="name green">{tagName2.trim().slice(0, 1)}</div>
                    }
                  </div>
                  <div className="content flex-100-2">
                    <div className="text text1 text-break">{tagName1}</div>
                    <div className="text text2 text-break font-weight-bold overflow-visible unset-display unset-webkit">{`${tagName2} ${tagName3}`}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
      )
    )
  }

  useEffect(() => {
    if (props.groupParticipants.length > 0) {
      setTags([...props.groupParticipants]);
      ref.current.setTags([...props.groupParticipants])
    }
  }, [props.groupParticipants]);

  useEffect(() => {
    setShowValidateTag(null);
    ref.current.setTags(tags);
  }, [tags]);

  useEffect(() => {
    if (props.employees && props.employees.employees.length > 0) {
      const array = props.employees.employees
      array.map((element, idx) => {

        const newElement = {};
        for (const prop in element) {
          if (Object.prototype.hasOwnProperty.call(element, prop) && prop !== 'businessCardsData') {
            newElement[StringUtils.snakeCaseToCamelCase(prop)] = element[prop] ? element[prop] : null;
          }
        }
        array[idx] = newElement;
        if (props.ownerList.includes(element.employee_id.toString())) {
          array[idx]["participantType"] = 1

        } else if (props.viewerList.includes(element.employee_id.toString())) {
          array[idx]["participantType"] = 2
        }
      });

      setGroupParticipants(_.cloneDeep(array));
      setTags(_.cloneDeep(array));
      ref.current.setTags(_.cloneDeep(array));
    }
  }, [props.employees]);

  /**
  * render Modal Default
  */
  const renderModalDefault = () => {
    return (
      <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
        <div className={showModal ? "modal-dialog form-popup" : "form-popup"}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <a title="" className="modal-heading-title" onClick={showCustomField ? handleBackPopup : e => { e.preventDefault() }}>
                    <i className={showCustomField ? "icon-small-primary icon-return-small" : "icon-small-primary icon-return-small disable"}></i>
                    <span className="text">{getIconFunction()} {getModalName()}</span>
                  </a>
                </div>
              </div>
              <div className="right">
                {showModal && <button className="icon-small-primary icon-link-small" onClick={(event: any) => { event.target.blur(); openNewWindow(); }}></button>}
                {showModal && <button onClick={(event: any) => { event.target.blur(); handleCloseModal(); }} className="icon-small-primary icon-close-up-small line"></button>}
              </div>
            </div>

            <div className="modal-body style-3">
              <div className="popup-content max-height-auto style-3">
                <div className="user-popup-form">
                  {!showValidateTag && !showValidateName && (props.errorMessageInModal && props.errorMessageInModal.length > 0 && parseValidateError().length > 0) &&
                    <BoxMessage messageType={MessageType.Error}
                      messages={parseValidateError()}
                      className="mw-100 mb-3"
                    />}
                  {!showValidateTag && !showValidateName && props.errorMessage && props.errorMessage.length > 0 &&
                    <BoxMessage messageType={MessageType.Error}
                      messages={props.errorMessage}
                      className="mw-100 mb-3"
                    />}
                  <form>
                    <div className="row break-row">
                      {groupMode.toString() === SHARE_LISTS_MODES.MODE_CREATE_GROUP_LOCAL.toString() &&
                        <>
                          <div className="col-lg-6 form-group break-line color-707070">
                            {translate('businesscards.sharelist.lbCreateShare')}
                          </div>
                          <div className="col-lg-6 mgb-1000" ></div>
                          <div className="col-lg-6 form-group break-line">
                            <div className="block-feedback block-feedback-blue">
                              {getCountMemberLocalAdd()} {translate('businesscards.sharelist.lbCreateShareWith')}
                            </div>
                          </div>
                          <div className="col-lg-6 mgb-1000" ></div>
                        </>
                      }
                      {
                        (listUpdateTime && isAutoGroup) &&
                        <div className="col-lg-12 form-group">
                          <label>{translate('businesscards.mylist.list-update-time', { 0: listUpdateTime })}</label>
                        </div>
                      }
                      <div className="col-lg-6 form-group">
                        <label>{translate('businesscards.sharelist.lbShareName')}<span className="label-red ml-2">{translate('businesscards.sharelist.lbRequire')}</span></label>
                        <div className={`${(errorValidates.includes("groupName")) ? styleError : null} input-common-wrap normal-error`} onMouseEnter={() => changeIsHover(true)} onMouseLeave={() => changeIsHover(false)} >
                          <input
                            className={showValidateName ? "input-normal error" : "input-normal"}
                            type="text" placeholder={translate('businesscards.sharelist.hintShareName')} value={listName}
                            onBlur={() => { setListName(listName.trim()) }}
                            onChange={(event) => { setListName(event.target.value); setShowValidateName("") }} ref={txtInputFocus} ></input>
                          {showValidateName && <div className="messenger error-validate-msg">{showValidateName}</div>}
                        </div>

                      </div>
                      {(groupMode.toString() === SHARE_LISTS_MODES.MODE_CREATE_GROUP.toString()
                        || groupMode.toString() === SHARE_LISTS_MODES.MODE_EDIT_GROUP.toString()
                        || groupMode.toString() === SHARE_LISTS_MODES.MODE_COPY_GROUP.toString()
                      ) ?
                        <div className="col-lg-6 form-group">
                          <RadioBoxSwichMode itemDataField={radioGroupTypeData} handleSeclectValue={handleSwichAddMode} isAutoGroup={isAutoGroup} isDisabled={disableChange} />
                        </div>
                        : <div className="col-lg-6 mgb-1000" ></div>

                      }

                      <div className="col-lg-6 break-line form-group">
                        <div className="form-group">
                          <label>{translate('businesscards.sharelist.lbListParticipants')}<span className="label-red ml-2">{translate('businesscards.sharelist.lbRequire')}</span></label>
                          <TagAutoComplete
                            id="paticipant"
                            type={TagAutoCompleteType.Employee}
                            modeSelect={TagAutoCompleteMode.Multi}
                            ref={ref}
                            onActionSelectTag={onActionSelectTag}
                            placeholder={translate('businesscards.sharelist.hintListParticipants')}
                            listActionOption={getListAction()}
                            onActionOptionTag={setListParticipantsType}
                            elementTags={(groupMode.toString() === SHARE_LISTS_MODES.MODE_CREATE_GROUP.toString() || groupMode.toString() === SHARE_LISTS_MODES.MODE_CREATE_GROUP_LOCAL.toString())
                              ? null : groupParticipants}
                            validMsg={showValidateTag}
                            onlyShowEmployees={true}
                            isDisabled={disableChange}
                            inputClass={disableChange ? "input-normal input-common2 disable" : "input-normal input-common2"}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 break-line form-group">
                        {/* <div className="row mb-4">
                          {renderPaticipantList()}
                        </div> */}
                        {isAutoGroup &&
                          <>
                            <div className="setting-search-conditions relative">
                              <label htmlFor="input-common">{translate('businesscards.sharelist.lbSearchCondition')}</label>
                              <span className={!disableChange ? "button-primary button-activity-registration" : "button-primary button-activity-registration disable"} onClick={!disableChange && handleDisplaySetting}>{translate('businesscards.sharelist.lbSettingSearch')}</span>
                            </div>
                            <div ref={dropBody}>
                              <div className="search-conditions" >
                                {/* <div className="search-conditions"> */}
                                <p className="check-box-item">
                                  <label className="icon-check">
                                    <input type="checkbox" name="" checked={isOverWrite} onChange={!disableChange && handleCheckOveride} disabled={disableChange} /><i></i>
                                    {translate('businesscards.sharelist.lbNoteForCheckBox')}</label>
                                </p>

                                {shouldRender && listFieldSearch.length > 0 && listFieldSearch.map((item, index) => {
                                  item.defaultValue = item.searchValue;
                                  return (
                                    <>
                                      <DynamicControlField key={index}
                                        elementStatus={getDataStatusControl(item)}
                                        fieldInfo={item}
                                        belong={FIELD_BELONG.BUSINESS_CARD}
                                        updateStateElement={updateStateField}
                                        // isDnDAddField={true} isDnDMoveField={true}
                                        isDnDAddField={disableChange} isDnDMoveField={disableChange}
                                        errorInfo={validateSearch(index)}
                                        isDisabled={showCustomField}
                                        className={"s"}
                                        moveFieldCard={onMoveField}
                                      />
                                    </>
                                  )
                                }

                                )}
                              </div>
                              <DropSearchCondition>
                                <div className="drop-search-condition"></div>
                              </DropSearchCondition>
                            </div>
                          </>
                        }
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {/* ---------- divider setting mode ---------- */}
              {showCustomField &&
                <DynamicSearchConditionListComponent
                  handleCloseSettingField={handleCloseSettingField}
                  handleUpdateSettingField={handleUpdateSettingField}
                  changeListFieldChosen={changeListFieldChosen}
                  customFieldsInfo={customFieldsInfo}
                  listFieldSearch={listFieldSearch}
                  searchConditionInputPlaceholder={translate('businesscards.mylist.search-condition-input-placeholder')}
                  fieldBelong={FIELD_BELONG.BUSINESS_CARD}
                  iconFunction={'ic-sidebar-business-card.svg'}
                />
              }
            </div>
            <div className="user-popup-form-bottom">
              {disableChange && <button className="button-blue button-form-register disable cursor-df">{getTextButtomSubmit()} </button>}
              {!disableChange && <button onClick={(event) => { (event.target as HTMLTextAreaElement).blur(); handleSubmitModal(); }} className="button-blue button-form-register ">{getTextButtomSubmit()}</button>}
            </div>
          </div>
        </div>
      </div >
    )
  }

  /**
  * render Modal In Swich List Type Mode
  */
  const renderModalInSwichListTypeMode = () => {
    return (
      <>
        <div className="popup-esr2 popup-esr3 popup-employee-height-auto">
          <div className="popup-esr2-content">
            <button type="button" className="close" data-dismiss="modal"><span className="la-icon"><i className="la la-close" /></span></button>
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <a title="" className="modal-heading-title" onClick={props.popout || showCustomField ? handleBackPopup : e => { e.preventDefault() }}>
                    <i className={props.popout || showCustomField ? "icon-small-primary icon-return-small" : "icon-small-primary icon-return-small disable"}></i>
                    <span className="text">{getIconFunction()} {getModalName()}</span>
                  </a>
                </div>
              </div>
              <div className="right">
                {showModal && <a className="icon-small-primary icon-link-small" onClick={() => openNewWindow()}></a>}
                {showModal && <a onClick={handleCloseModal} className="icon-small-primary icon-close-up-small line"></a>}
              </div>
            </div>
            <div className="popup-esr2-body">
              {(props.errorValidates.length > 0 && parseValidateError().length > 0) &&
                <BoxMessage messageType={MessageType.Error}
                  messages={parseValidateError()}
                  className="mw-100 mb-3"
                />}
              <div className="form-group">
                <label>{translate('businesscards.sharelist.lbListParticipants')}
                  <span className="label-red ml-15" >{translate('businesscards.sharelist.lbRequire')}</span>
                </label>
                <TagAutoComplete id="paticipant" type={TagAutoCompleteType.Employee} modeSelect={TagAutoCompleteMode.Multi} ref={ref}
                  onActionSelectTag={onActionSelectTag} placeholder={translate('businesscards.sharelist.hintListParticipants')}
                  listActionOption={getListAction()}
                  tagSearch={true}
                  onlyShowEmployees={true}
                  isHideResult={true}
                  elementTags={groupMode.toString() === SHARE_LISTS_MODES.MODE_CREATE_GROUP.toString() ? null : groupParticipants}
                  validMsg={showValidateTag}
                />
                <>
                  {renderPaticipantList()}
                </>
              </div>
            </div>
          </div>
          <div className="align-center">
            {disableChange && <a className="button-blue button-form-register ">{getTextButtomSubmit()} </a>}
            {!disableChange && <a onClick={() => { handleSubmitModal(); }} className="button-blue button-form-register ">{getTextButtomSubmit()}</a>}
          </div>
          <br /><br />
        </div>
      </>
    );
  }

  /**
  * render Component Input Search
  */
  const renderComponentInputSearch = () => {
    if (groupMode.toString() === SHARE_LISTS_MODES.MODE_CREATE_GROUP.toString()
      || groupMode.toString() === SHARE_LISTS_MODES.MODE_CREATE_GROUP_LOCAL.toString()
      || groupMode.toString() === SHARE_LISTS_MODES.MODE_EDIT_GROUP.toString()
      || groupMode.toString() === SHARE_LISTS_MODES.MODE_COPY_GROUP.toString()) {
      return renderModalDefault();
    } else if (groupMode.toString() === SHARE_LISTS_MODES.MODE_SWICH_GROUP_TYPE.toString()) {
      return renderModalInSwichListTypeMode();
    }
    return <></>;
  }

  // #endregion mycode

  if (showModal) {
    return (
      <>
        <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
          <Modal isOpen fade toggle={() => { }} backdrop id="popup-field-search" autoFocus zIndex="auto">
            {renderComponentInputSearch()}
          </Modal>
        </FocusTrap>
      </>
    );
  } else {
    if (props.popout) {
      return (
        <>
          <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
            <Modal isOpen fade toggle={() => { }} backdrop id="popup-field-search" autoFocus zIndex="auto">
              {renderComponentInputSearch()}
            </Modal>
          </FocusTrap>
        </>
      )
    } else {
      return <></>;
    }
  }
}

const mapStateToProps = ({ sharedList, applicationProfile, businessCardList }: IRootState) => ({
  tenant: applicationProfile.tenant,
  listFieldSearch: sharedList.listFieldSearch,
  groupParticipants: sharedList.groupParticipants,
  action: sharedList.action,
  errorValidates: sharedList.errorItems,
  errorMessageInModal: sharedList.errorMessageInModal,
  list: sharedList.group,
  isSuccess: sharedList.isSuccess,
  rowIds: sharedList.rowIds,
  employees: sharedList.employees,
  ownerList: sharedList.ownerList,
  viewerList: sharedList.viewerList,
  errorMessage: sharedList.errorMessage,
  listUpdateTime: sharedList.listUpdateTime,
  listBusinessCardList: businessCardList.listBusinessCardList,
  isOverwriteInput: sharedList.isOverwrite
});

const mapDispatchToProps = {
  handleInitListModal,
  handleSubmitListInfos,
  resetError,
  reset,
  getEmployees,
  startExecuting,
  handleGetGeneralSetting
};

export default connect<IModalSharedGorupStateProps, IModalSharedGorupDispatchProps, IModalSharedListOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ModalSharedList);
