import React, { useEffect, useState, useMemo, useRef } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import { translate, Storage } from 'react-jhipster';
import PaginationList from 'app/shared/layout/paging/pagination-list';
import { RECORD_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import { BUSINESS_CARD_LIST_ID, NETWORK_MAP_MODE, isViewAsModal, isViewAsTab, SHOW_MESSAGE_SUCCESS } from '../constants';
import { ActionListHeader } from 'app/shared/layout/dynamic-form/constants';
import AddDepartment from './add-department';
import {
  handleInitializeNetworkMap,
  handleSaveNetworkMap,
  resetNetworkMapModalTable,
  handleGetDepartmentsByCustomerId,
  handleGetBusinessCardMapTable,
  handleSaveDepartment,
  NetworkMapAction,
  onOEditEditBusinessCard,
  handleRemoveBusinessCard
} from './add-edit-network-map.reducer';
import { startExecuting } from 'app/shared/reducers/action-executing';
import CreateEditBusinessCard from '../../businessCards/create-edit-business-card/create-edit-business-card';
import BoxMessage, { MessageType } from '../../../shared/layout/common/box-message';
import { BUSINESS_CARD_ACTION_TYPES, BUSINESS_CARD_VIEW_MODES } from 'app/modules/businessCards/constants';
import { path } from 'ramda';
import { getFirstCharacter, isMouseOnRef } from 'app/shared/util/utils';
import _ from 'lodash';
import { findDepartmenIndexById, getDepartmentId } from '../helpers';
import BusinessCardDetail from 'app/modules/businessCards/business-card-detail/business-card-detail';
import { getFullName, getFieldLabel } from 'app/shared/util/string-utils';
import { utcToTz, DATE_TIME_FORMAT } from 'app/shared/util/date-utils';
import useEventListener from 'app/shared/util/use-event-listener';
import Popover from 'app/shared/layout/common/Popover';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { TIMEOUT_TOAST_MESSAGE } from 'app/config/constants';
import PopupEmployeeDetail from 'app/modules/employees/popup-detail/popup-employee-detail';
import ActivityDetail from 'app/modules/activity/detail/activity-modal-detail';
import * as R from 'ramda';
import TooltipBusinessCard from './tooltip-business-card';
import { handleShowDetail } from 'app/modules/activity/list/activity-list-reducer';
import { TYPE_DETAIL_MODAL } from 'app/modules/activity/constants';

const enum CHECK_ALL_STATUS {
  UNCHECK,
  CHECK,
  CHECK_ALL
}

const fixStyleCheckAll: React.CSSProperties = {
  position: 'relative',
  left: '-7px'
}
const styleColumn: React.CSSProperties = {
  maxWidth: '250px',
  whiteSpace: 'nowrap'
}

export interface INetworkMapProps extends StateProps, DispatchProps {
  customerId: number
  onCloseModal?: () => void
  viewType: number;
  changeNetworkMapMode?: (mode) => void;
  onOpenModal?: () => void;
  iconFunction?: any;
}
/**
 * Add and edit network map (mode table)
 * @param props
 */
export const AddEditNetworkMapModeTable = (props: INetworkMapProps) => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(RECORD_PER_PAGE_OPTIONS[1]);
  const { businessCardDatas, employeeDatas, departments, motivationDatas, standDatas, errorItems } = props;
  const [openAddDepartmentPopup, setOpenAddDepartmentPopup] = useState(false);
  const [openAddBusinessCardPopup, setOpenAddBusinessCardPopup] = useState(false);
  const [businessCardList, setBusinessCardList] = useState([]);
  const [savedDepartments, setSavedDepartments] = useState(departments ? [...departments] : []);
  const [businessCardsRemove, setBusinessCardsRemove] = useState([]);
  const lang = Storage.session.get('locale', 'ja_jp');
  const [businessCardIdDetail, setBusinessCardIdDetail] = useState(null);
  const [checkAllStatus, setCheckAllStatus] = useState(CHECK_ALL_STATUS.UNCHECK);
  const [isOpenMenuCheckBox, setIsOpenMenuCheckBox] = useState(false);
  const menuSelectCheckboxRef = useRef(null);
  const [listCardsOnAPage, setListCardsOnAPage] = useState([]);
  const [msgSuccess, setMsgSuccess] = useState(SHOW_MESSAGE_SUCCESS.NONE);
  const [openPopupActivityDetail, setOpenPopupActivityDetail] = useState(false);
  const [activityIdSelected, setActivityIdSelected] = useState(null);
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const refMenu = useRef(null);

  const handleClickOutside = (e) => {
    if (refMenu.current && !refMenu.current.contains(e.target)) {
      setTooltipIndex(null);
    }
  }

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    }
  }, [])

  useEffect(() => {
    const classNameBody = document.body.className;
    if(businessCardIdDetail){
      document.body.className = classNameBody + " " + "wrap-card";
    }else{
      document.body.className = classNameBody.replace('wrap-card', '');
    }
  }, [businessCardIdDetail])

  const fieldInfo = useMemo(() => {
    return [
      {
        fieldId: 1,
        fieldOrder: 1,
        fieldName: 'businessCardImagePath',
        fieldType: 99,
        fieldLabel: translate('customers.field-info-network.business-card-image')
      },
      {
        fieldId: 2,
        fieldOrder: 2,
        fieldName: 'departmentName',
        fieldType: 9,
        fieldLabel: translate('customers.field-info-network.department')
      },
      {
        fieldId: 3,
        fieldOrder: 3,
        fieldName: 'position',
        fieldType: 9,
        fieldLabel: translate('customers.field-info-network.position')
      },
      {
        fieldId: 4,
        fieldOrder: 4,
        fieldName: 'businessCardName',
        fieldType: 99,
        fieldLabel: translate('customers.field-info-network.business-card-name')
      },
      {
        fieldId: 5,
        fieldOrder: 5,
        fieldName: 'email',
        fieldType: 15,
        fieldLabel: translate('customers.field-info-network.mail-address')
      },
      {
        fieldId: 6,
        fieldOrder: 6,
        fieldName: 'phoneNumber',
        fieldType: 13,
        fieldLabel: translate('customers.field-info-network.phone-number')
      },
      {
        fieldId: 7,
        fieldOrder: 7,
        fieldName: 'lastContactDate',
        fieldType: 6,
        fieldLabel: translate('customers.field-info-network.last-contact-date')
      },
      {
        fieldId: 8,
        fieldOrder: 8,
        fieldName: 'businessCardReceives',
        fieldType: 99,
        fieldLabel: translate('customers.field-info-network.company-personnel')
      },
      {
        fieldId: 9,
        fieldOrder: 9,
        fieldName: 'receiveDate',
        fieldType: 6,
        fieldLabel: translate('customers.field-info-network.date-of-receipt')
      },
      {
        fieldId: 10,
        fieldOrder: 10,
        fieldName: 'motivation',
        fieldType: 9,
        fieldLabel: translate('customers.field-info-network.motivation')
      },
      {
        fieldId: 11,
        fieldOrder: 11,
        fieldName: 'stand',
        fieldType: 9,
        fieldLabel: translate('customers.field-info-network.stand')
      },
      {
        fieldId: 12,
        fieldOrder: 12,
        fieldName: 'comment',
        fieldType: 9,
        fieldLabel: translate('customers.field-info-network.memo')
      },
    ]
  }, [])
  const personInChargeRef = useRef(null);
  const [isShowAllPersonInCharge, setIsShowAllPersonInCharge] = useState(false);
  const [taskIdShowPersonInCharge, setTaskIdShowPersonInCharge] = useState(null);

  /**
   * Start modal
   */
  useEffect(() => {
    if (document.body.classList.contains('body-full-width')) {
      document.body.className = "body-full-width wrap-customer modal-open";
    } else {
      document.body.className = "wrap-customer modal-open";
    }
    props.handleInitializeNetworkMap(props.customerId, false, null);
    return () => {
      props.resetNetworkMapModalTable();
    }
  }, []);

  const baseUrl = window.location.origin.toString();
  const getIconFunction = () => {
    if (props.iconFunction) {
      return <img className="icon-group-user" src={baseUrl + `/content/images/${props.iconFunction}`} alt="" />
    }
    return <></>
  }

  /**
   * Get networkStand via departmentName and businessCardId
   * @param departmentName departmentName
   * @param businessCardId businessCardId
   */
  const getNetworkStand = (departmentName, businessCardId) => {
    let networkStand = null;
    const department = departments.find(dep => dep.departmentName === departmentName);
    if (department && department.networkStands) {
      networkStand = department.networkStands.find(sta => sta.businessCardId === businessCardId);
    }
    return networkStand;
  }

  /**
   * Get motivationName via networkStand which found by departmentName and businessCardId
   * @param networkStand networkStand
   */
  const getMotivationName = (networkStand) => {
    let motivationName = null;
    if (networkStand && networkStand.stands && motivationDatas && motivationDatas.length > 0) {
      const motivationId = path(['stands', 'motivationId'], networkStand);
      const motivation = motivationDatas.find(moti => moti.motivationId === motivationId);
      if (motivation) {
        try {
          motivationName = JSON.parse(motivation.motivationName)[lang];
        } catch (error) {
          motivationName = '';
        }
      }
    }
    return motivationName;
  }

  /**
   * Get standPointName via networkStand which found by departmentName and businessCardId
   * @param networkStand networkStand
   */
  const getMasterStandName = (networkStand) => {
    let masterStandName = null;
    if (networkStand && standDatas && standDatas.length > 0) {
      const standId = path(['stands', 'masterStandId'], networkStand);
      const masterStand = standDatas.find(spt => spt.masterStandId === standId);
      if (masterStand) {
        try {
          masterStandName = JSON.parse(masterStand.masterStandName)[lang];
        } catch (error) {
          masterStandName = '';
        }
      }
    }
    return masterStandName;
  }

  /**
   * Create businessCard list to the table
   */
  useEffect(() => {
    if (businessCardDatas) {
      const list = businessCardDatas.map(card => {
        const networkStand = getNetworkStand(card.departmentName, card.businessCardId);
        return {
          isChecked: false,
          activityId: card.activityId,
          businessCardId: card.businessCardId,
          businessCardImagePath: {
            'fileName': card.businessCardImageName,
            'filePath': card.businessCardImagePath
          },
          departmentId: card.departmentId,
          departmentName: card.departmentName,
          position: card.position,
          businessCardName: getFullName(card.firstName, card.lastName),
          email: card.emailAddress,
          phoneNumber: card.phoneNumber,
          lastContactDate: card.lastContactDate && card.lastContactDate !== 'null' ? card.lastContactDate : '',
          employeeIds: card.employeeIds,
          motivation: getMotivationName(networkStand),
          stand: getMasterStandName(networkStand),
          comment: networkStand && networkStand.stands ? networkStand.stands.comment : '',
          businessCardReceives: card.businessCardReceives,
          receiveDate: card.businessCardReceives
        }
      });
      setBusinessCardList(_.reverse(_.sortBy(list, ['lastContactDate'])));
    }
  }, [businessCardDatas]);

  /**
   * reload page when change limit record
   * @param offsetRecord offsetRecord
   * @param limitRecord limitRecord
   */
  const onPageChange = (offsetRecord, limitRecord) => {
    setOffset(offsetRecord);
    setLimit(limitRecord);
  }

  /**
   * Check dirty and show popup dirtyCheck
   * @param action action
   * @param cancel cancel
   */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void, partern?: any) => {
    if (!props.isEnableSaving) {
      action();
    } else {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: partern });
    }
  };

  useEffect(() => {
    if (businessCardList) {
      setListCardsOnAPage(_.slice(businessCardList, offset, (offset + limit < businessCardList.length) ? (offset + limit) : businessCardList.length));
      const checkList = businessCardList.filter(e => e.isChecked);
      if (checkList && checkList.length > 0) {
        if (checkList.length === businessCardList.length) {
          setCheckAllStatus(CHECK_ALL_STATUS.CHECK_ALL);
        } else {
          setCheckAllStatus(CHECK_ALL_STATUS.CHECK);
        }
      } else {
        setCheckAllStatus(CHECK_ALL_STATUS.UNCHECK);
      }
    }
  }, [businessCardList, offset, limit])

  /**
   * Close AddEditNetworkMapModeTable modal
   */
  const handleClosePopup = (partern) => {
    executeDirtyCheck(() => {
      props.resetNetworkMapModalTable();
      props.onCloseModal();
    }, () => { }, partern);
  }

  const handleChangeMode = () => {
    if (props.changeNetworkMapMode) {
      props.changeNetworkMapMode(NETWORK_MAP_MODE.TREE);
    }
  }

  /**
   * Save a new department
   * @param department
   */
  const onSaveDepartment = (department) => {
    props.handleSaveDepartment(props.customerId, department);
    
  }

  /**
   * Remove businessCards
   */
  const removeBusinessCards = async () => {
    const list = businessCardList.filter(card => !card.isChecked);
    const removedList = businessCardList.filter(card => card.isChecked);
    const messageConfirm = removedList.length === 1 ? translate("messages.WAR_COM_0001", { itemName: removedList[0].businessCardName }) : translate("messages.WAR_COM_0002", { 0: removedList.length })
    const result = await ConfirmDialog({
      title: (<>{translate('products.top.dialog.title-delete-products')}</>),
      message: messageConfirm,
      confirmText: translate('products.top.dialog.confirm-delete-products'),
      confirmClass: "button-red",
      cancelText: translate('products.top.dialog.cancel-text'),
      cancelClass: "button-cancel",
      zIndex: "9999"
    });
    if (result) {
      props.onOEditEditBusinessCard();
      setBusinessCardsRemove(removedList.map(e => e.businessCardId));
      setBusinessCardList(list);
      const jointDepartmentBusinessCard = removedList.map(card => {
        return {
          department: departments.find(dep => dep.departmentId === card.departmentId),
          businessCard: card
        }
      })
      props.handleRemoveBusinessCard(jointDepartmentBusinessCard);
    }
  }

  /**
   * Call API saveNetworkMap
   */
  const onSaveNetworkMap = () => {
    props.handleSaveNetworkMap(props.stateAddEditNetworkMap);
  }

  /**
   * Open addBusinessCard popup
   */
  const onOpenAddBusinessCardPopup = () => {
    setOpenAddBusinessCardPopup(true);
  };

  const getBusinessCardNew = () => {
    if (props.businessCardNewMapTable && businessCardList.findIndex(b => b.businessCardId === props.businessCardNewMapTable.businessCardId) < 0) {
      const networkStand = getNetworkStand(props.businessCardNewMapTable.departmentName, props.businessCardNewMapTable.businessCardId);
      const businessCardNew = {
        isChecked: false,
        activityId: props.businessCardNewMapTable.activityId,
        businessCardId: props.businessCardNewMapTable.businessCardId,
        businessCardImagePath: {
          'fileName': props.businessCardNewMapTable.businessCardImageName,
          'filePath': props.businessCardNewMapTable.businessCardImagePath
        },
        departmentId: props.businessCardNewMapTable.departmentId,
        departmentName: props.businessCardNewMapTable.departmentName,
        position: props.businessCardNewMapTable.position,
        businessCardName: getFullName(props.businessCardNewMapTable.firstName, props.businessCardNewMapTable.lastName),
        email: props.businessCardNewMapTable.emailAddress,
        phoneNumber: props.businessCardNewMapTable.phoneNumber,
        lastContactDate: props.businessCardNewMapTable.lastContactDate && props.businessCardNewMapTable.lastContactDate !== 'null' ? props.businessCardNewMapTable.lastContactDate : '',
        employeeIds: props.businessCardNewMapTable.employeeIds,
        motivation: getMotivationName(networkStand),
        stand: getMasterStandName(networkStand),
        businessCardReceives: props.businessCardNewMapTable.businessCardReceives,
        comment: networkStand && networkStand.stands ? networkStand.stands.comment : '',
        receiveDate: props.businessCardNewMapTable.businessCardReceives,
      }
      const list = [...businessCardList];
      list.push(businessCardNew);
      setBusinessCardList(_.reverse(_.sortBy(list, ['lastContactDate'])));
    }
  }

  /**
   * Render toast message
   */
  const renderToastMessage = () => {
    if (msgSuccess !== SHOW_MESSAGE_SUCCESS.NONE) {
      let msgInfoSuccess = '';
      if (msgSuccess === SHOW_MESSAGE_SUCCESS.CREATE) {
        msgInfoSuccess = `${translate("messages.INF_COM_0003")}`;
      } else if (msgSuccess === SHOW_MESSAGE_SUCCESS.UPDATE) {
        msgInfoSuccess = `${translate("messages.INF_COM_0004")}`;
      } else if (msgSuccess === SHOW_MESSAGE_SUCCESS.DELETE) {
        msgInfoSuccess = `${translate("messages.INF_COM_0005")}`;
      }
      return (
        <div className="message-area message-area-bottom position-absolute">
          <BoxMessage messageType={MessageType.Success}
            message={msgInfoSuccess}
            styleClassMessage="block-feedback block-feedback-green text-left"
            className="mb-1 " />
        </div>
      )
    }
  }

  /**
   * Show toast message in timeout
   * @param msgSuccessParam
   */
  const checkBoxMesSuccess = (msgSuccessParam) => {
    if (msgSuccessParam && msgSuccessParam.successId !== SHOW_MESSAGE_SUCCESS.NONE) {
      setMsgSuccess(msgSuccessParam.successId);
      setTimeout(function () {
        setMsgSuccess(SHOW_MESSAGE_SUCCESS.NONE);
      }, TIMEOUT_TOAST_MESSAGE);
    }
  }

  useEffect(() => {
    checkBoxMesSuccess(props.msgSuccess);
    if (openAddDepartmentPopup && props.msgSuccess.successId === SHOW_MESSAGE_SUCCESS.CREATE) {
      setOpenAddDepartmentPopup(false);
    }
  }, [props.msgSuccess])

  useEffect(() => {
    if (props.actionType === NetworkMapAction.SuccessSaveDepartment) {
      props.handleGetDepartmentsByCustomerId(props.customerId);
    } else if (props.actionType === NetworkMapAction.SuccessGetBusinessCardMapTable) {
      getBusinessCardNew();
    }
  }, [props.actionType]);

  useEffect(() => {
    if (props.departmentListMapTable) {
      const departmentNews = [];
      props.departmentListMapTable.forEach(d => {
        if (findDepartmenIndexById(getDepartmentId(d), savedDepartments) < 0) {
          departmentNews.push(d);
        }
      });
      setSavedDepartments([...savedDepartments, ...departmentNews]);
    }
  }, [props.departmentListMapTable]);

  useEffect(() => {
    getBusinessCardNew();
  }, props.businessCardNewMapTable)

  const onClosePopupEdit = (businessCard) => {
    document.body.className = "wrap-customer modal-open";
    if (businessCard?.businessCardId) {
      props.handleGetBusinessCardMapTable(businessCard.businessCardId);
    }
    setOpenAddBusinessCardPopup(false);
  }

  /**
   * Change check status of an item
   * @param card
   * @param value
   */
  const changeCheckStatus = (card, value) => {
    const cardTmp = _.cloneDeep(card);
    cardTmp['isChecked'] = value;
    return cardTmp;
  }

  /**
   * Change check status of items
   * @param id businessCardId
   */
  const onChangeCheckBox = (id) => {
    const list = [...businessCardList].map(card => {
      if (card.businessCardId === id) {
        return changeCheckStatus(card, !card.isChecked);
      }
      return card;
    });
    setBusinessCardList(list);
  }

  /**
   * Check all
   */
  const handleCheckAll = () => {
    switch (checkAllStatus) {
      case CHECK_ALL_STATUS.UNCHECK:
        setCheckAllStatus(CHECK_ALL_STATUS.CHECK_ALL);
        setBusinessCardList(businessCardList.map(card => changeCheckStatus(card, true)));
        break;
      case CHECK_ALL_STATUS.CHECK:
      case CHECK_ALL_STATUS.CHECK_ALL:
        setCheckAllStatus(CHECK_ALL_STATUS.UNCHECK);
        setBusinessCardList(businessCardList.map(card => changeCheckStatus(card, false)));
        break;
      default:
        break;
    }
  }

  /**
   * Get class CSS to 'checkAll' checkbox
   */
  const getClassCheckAll = useMemo(() => {
    let classNameCheckHeader = "icon-check";
    if (checkAllStatus === CHECK_ALL_STATUS.CHECK_ALL) {
      classNameCheckHeader = "icon-check icon-check-all";
    }
    if (checkAllStatus === CHECK_ALL_STATUS.CHECK) {
      classNameCheckHeader = "icon-check icon-check-horizontal"
    }
    return classNameCheckHeader;
  }, [checkAllStatus])

  /**
   * Mousedown event handle
   */
  const handleMouseDown = e => {
    if (menuSelectCheckboxRef && !isMouseOnRef(menuSelectCheckboxRef, e)) {
      setIsOpenMenuCheckBox(false);
    }
    if (personInChargeRef && !isMouseOnRef(personInChargeRef, e)) {
      setIsShowAllPersonInCharge(false);
    }
  };
  useEventListener('mousedown', handleMouseDown);

  const handleOpenActivity = (id) => {
    if (id) {
      setActivityIdSelected(id);
      setOpenPopupActivityDetail(true);
    }
  }

  const handleCloseActivity = () => {
    setOpenPopupActivityDetail(false)
  }

  const handleOpenEmployeeDetail = (idEmployee) => {
    props.handleShowDetail(idEmployee, TYPE_DETAIL_MODAL.EMPLOYEE, `Customer_${props.customerId}`)
  }

  /**
   * Render special content (fieldType 99)
   * @param field fieldInfo
   * @param rowData row data
   */
  const customContentField = (field, rowData) => {
    if (field.fieldName === 'businessCardImagePath') {
      return <img className="img-table-default" src={path(['filePath'], rowData[field.fieldName])} alt="" />
    } else if (field.fieldName === 'businessCardReceives') {
      return (
        <TooltipBusinessCard
          rowData={rowData}
          tenant={props.tenant}
          fieldName={'businessCardReceives'}
          openPopupDetail={handleOpenEmployeeDetail}
        />
      )
    } else if (field.fieldName === 'businessCardName') {
      return (
        <Popover x={-20} y={25}>
          <a onClick={() => setBusinessCardIdDetail(rowData['businessCardId'])}>{rowData[field.fieldName]}</a>
        </Popover>
      )
    } else if (field.fieldName === 'email') {
      return (
        <Popover x={-20} y={25}>
          <a href={`mailto:${rowData[field.fieldName]}`}>{rowData[field.fieldName]}</a>
        </Popover>
      )
    } else if (field.fieldName === 'lastContactDate') {
      return (
        <>
          <Popover x={-20} y={25}>
            <a
              onClick={() => { if (field.fieldName === 'lastContactDate') handleOpenActivity(rowData['activityId']) }}
            >{rowData[field.fieldName] && utcToTz(rowData[field.fieldName], DATE_TIME_FORMAT.User).split(' ')[0]}</a>
          </Popover>
        </>
      )
    } else if (field.fieldName === 'receiveDate') {
      return (
        <div className="align-items-center">
          <div className="d-flex flex-wrap">
            {rowData.receiveDate.map((employee) => {
              return <>
                <p className={`receive-date-item${rowData.receiveDate.length > 1 ? ' w100 pb-1' : ''}`}>
                  {employee.receiveDate?.date ? utcToTz(employee.receiveDate.date, DATE_TIME_FORMAT.User) : utcToTz(employee.receiveDate, DATE_TIME_FORMAT.User)}
                </p>
              </>
            })}
          </div>
        </div>
      )
    } else {
      return (
        <div className="color-333">
          <Popover x={-20} y={25}>
            {rowData[field.fieldName]}
          </Popover>
        </div>
      )
    }
  }

  /**
   * Action on header
   * @param action action
   */
  const onHeaderAction = (action) => {
    if (action === ActionListHeader.SELECT_ALL) {
      setCheckAllStatus(CHECK_ALL_STATUS.CHECK_ALL);
      setBusinessCardList(businessCardList.map(card => changeCheckStatus(card, true)));
    } else if (action === ActionListHeader.UNSELECT_ALL) {
      setCheckAllStatus(CHECK_ALL_STATUS.UNCHECK);
      setBusinessCardList(businessCardList.map(card => changeCheckStatus(card, false)));
    } else if (action === ActionListHeader.SELECT_INSIDE || action === ActionListHeader.UNSELECT_INSIDE) {
      const list = businessCardList.map((card, idx) => {
        if (idx >= offset && idx < (limit + offset)) {
          return changeCheckStatus(card, action === ActionListHeader.SELECT_INSIDE);
        }
        return card;
      })
      setBusinessCardList(list);
    }
  }

  /**
   * renderMenuCheckBox
   */
  const renderMenuCheckBox = () => {
    return (
      <>
        {isOpenMenuCheckBox && (
          <div
            className="table-tooltip-box z-index-99 max-width-content"
            ref={menuSelectCheckboxRef}
          >
            <div className="table-tooltip-box-body">
              <ul>
                <li>
                  <a onClick={() => onHeaderAction(ActionListHeader.SELECT_ALL)}>
                    {translate('global.menu-context.select-all')}
                  </a>
                </li>
                <li>
                  <a onClick={() => onHeaderAction(ActionListHeader.UNSELECT_ALL)}>
                    {translate('global.menu-context.deselect-all')}
                  </a>
                </li>
                <li>
                  <a onClick={() => onHeaderAction(ActionListHeader.SELECT_INSIDE)}>
                    {translate('global.menu-context.select-all-in-page')}
                  </a>
                </li>
                <li>
                  <a onClick={() => onHeaderAction(ActionListHeader.UNSELECT_INSIDE)}>
                    {translate('global.menu-context.deselect-all-in-page')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </>
    )
  }

  const renderBodyModal = () => {
    return (
      <div className={`popup-content overflow-hidden ${isViewAsModal(props.viewType) ? 'pt-14' : 'h-100'} d-flex flex-column`}>
        <div className="position-relative">
          {isViewAsModal(props.viewType) &&
            <>
              {departments && departments.length > 0
                ? (<a className="button-primary button-add-new btn-add mr-10 middle"
                  onClick={() => { setOpenAddDepartmentPopup(true) }}>
                  {translate('customers.network-map.mode-table.btn-add-department')}
                </a>)
                : (
                  <a className="button-primary button-add-new btn-add mr-10 middle disable">
                    {translate('customers.network-map.mode-table.btn-add-department')}
                  </a>
                )}
              <a className="button-primary button-add-new btn-add mr-10 middle"
                onClick={onOpenAddBusinessCardPopup}>
                {translate('customers.network-map.mode-table.btn-add-business-card')}
              </a>
              {businessCardList.filter(e => e.isChecked)?.length > 0 &&
                <a className="icon-small-primary icon-erase-small middle" onClick={removeBusinessCards} />
              }
            </>
          }
          <div className={`${isViewAsTab(props.viewType) ? 'align-right' : 'float-right'}`}>
            <a title="" className="icon-primary icon-group" onClick={() => executeDirtyCheck(() => handleChangeMode(), () => { }, DIRTYCHECK_PARTTERN.PARTTERN1)}></a>
            {isViewAsTab(props.viewType) &&
              <a title="" className="button-primary btn-add w-auto middle margin-left-4" onClick={props.onOpenModal}>
                {translate('customers.network-map.btn-edit-network-map')}
              </a>
            }
          </div>
        </div>
        {businessCardList && businessCardList.length > 0 ?
          (
            <>
              <div className="pagination-top d-flex mt-22">
                {businessCardList && <PaginationList offset={offset} limit={limit} totalRecords={businessCardList.length} onPageChange={onPageChange} />}
              </div>
              <div className="style-3 mt-22 position-relative overflow-auto h-100 flex-fill">
                <table className="table-list table-customer">
                  <thead>
                    <tr>
                      {isViewAsModal(props.viewType) &&
                        <th className="w-60">
                          <div className={`button-pull-down-check-wrap ${checkAllStatus !== CHECK_ALL_STATUS.UNCHECK ? 'active' : ''}`} style={fixStyleCheckAll}>
                            <div className="button-pull-down-check">
                              <label className={getClassCheckAll}>
                                <input className="hidden" type="checkbox" checked={checkAllStatus !== CHECK_ALL_STATUS.UNCHECK} onClick={handleCheckAll} /><i></i>
                              </label>
                            </div>
                            <div className="button-pull-down-check option" onClick={() => setIsOpenMenuCheckBox(true)} >
                              <i className="fas fa-chevron-down"></i>
                            </div>
                          </div>
                        </th>
                      }
                      {fieldInfo.map((e, idx) => {
                        return <th key={idx} style={styleColumn}>{getFieldLabel(e, 'fieldLabel')}</th>
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {listCardsOnAPage.map((card, iCard) => {
                      return (
                        <tr key={iCard}>
                          {isViewAsModal(props.viewType) &&
                            <td>
                              <label className="icon-check">
                                <input type="checkbox" name="" checked={card['isChecked']} onChange={() => onChangeCheckBox(card.businessCardId)} /><i></i>
                              </label>
                            </td>
                          }
                          {fieldInfo.map((field, iField) => {
                            return <td key={iField} style={styleColumn} className="map-table-business-card">{customContentField(field, card)}</td>
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {renderMenuCheckBox()}
              </div>
            </>
          ) : (
            <div className="list-table pt-2 images-group-middle h-100 w-100">
              <div className="position-relative h-100">
                <div className="align-center images-group-content" >
                  <img className="images-group-16" src="../../../content/images/ic-sidebar-business-card.svg" alt="" />
                  <div>{translate('messages.INF_COM_0020', { 0: (translate('common.business-card')) })}</div>
                </div>
              </div>
            </div>
          )
        }
        {renderToastMessage()}
        {openPopupActivityDetail && <ActivityDetail
          canBack={true}
          activityId={activityIdSelected}
          listActivityId={[]}
          onCloseActivityDetail={handleCloseActivity} />
        }
      </div>
    )
  }

  if (isViewAsTab(props.viewType)) {
    return <>{renderBodyModal()}</>
  } else {
    return (
      <>
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
          <div className="modal-dialog form-popup">
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    <a className="icon-small-primary icon-return-small" onClick={() => handleClosePopup(DIRTYCHECK_PARTTERN.PARTTERN2)} />
                    <span className="text">{getIconFunction()}
                      {translate('customers.network-map.title')}
                    </span>
                  </div>
                </div>
                <div className="right">
                  <a className="icon-small-primary icon-close-up-small line" onClick={() => handleClosePopup(DIRTYCHECK_PARTTERN.PARTTERN2)} />
                </div>
              </div>
              <div className="modal-body style-3">
                {renderBodyModal()}
                {errorItems?.length > 0 && <BoxMessage
                  messageType={MessageType.Error}
                  message={translate('messages.' + errorItems[0].errorCode)}
                />}
              </div>
              <div className="user-popup-form-bottom">
                {props.isEnableSaving
                  ? <a className="button-blue button-form-register" onClick={onSaveNetworkMap}>{translate('customers.network-map.btn-save')}</a>
                  : <a className="button-blue button-form-register disable">{translate('customers.network-map.btn-save')}</a>
                }
              </div>
            </div>
          </div>
        </div>
        {openAddDepartmentPopup && <AddDepartment
          iconFunction={props.iconFunction}
          customerId={props.customerId}
          // departments={savedDepartments}
          onClosePopupAddDepartment={() => { setOpenAddDepartmentPopup(false) }}
          errorItems={errorItems}
          onSaveDepartment={onSaveDepartment} />
        }
        {openAddBusinessCardPopup &&
          <CreateEditBusinessCard
            customerId={props.customerId}
            customerName={props.customer.customerName}
            iconFunction="ic-sidebar-business-card.svg"
            businessCardActionType={BUSINESS_CARD_ACTION_TYPES.UPDATE}
            businessCardViewMode={BUSINESS_CARD_VIEW_MODES.EDITABLE}
            businessCardId={null}
            isOpenedFromModal={true}
            closePopup={onClosePopupEdit}
          />
        }
        {businessCardIdDetail &&
          <BusinessCardDetail
            key={businessCardIdDetail}
            showModal={true}
            businessCardId={businessCardIdDetail}
            listBusinessCardId={[businessCardIdDetail]}
            toggleClosePopupBusinessCardDetail={() => setBusinessCardIdDetail(null)}
            businessCardList={[]}
          />
        }
      </>
    )
  }
}

const mapStateToProps = ({ addEditNetworkMap, applicationProfile, lastAction }: IRootState) => ({
  companyId: addEditNetworkMap.companyId,
  departments: addEditNetworkMap.departments,
  businessCardDatas: addEditNetworkMap.businessCardDatas,
  employeeDatas: addEditNetworkMap.employeeDatas,
  standDatas: addEditNetworkMap.standDatas,
  motivationDatas: addEditNetworkMap.motivationDatas,
  errorMessage: addEditNetworkMap.errorMessage,
  errorItems: addEditNetworkMap.errorItems,
  customer: addEditNetworkMap.customer,
  tenant: applicationProfile.tenant,
  businessCardNewMapTable: addEditNetworkMap.businessCardNewMapTable,
  departmentListMapTable: addEditNetworkMap.departmentListMapTable,
  actionType: addEditNetworkMap.action,
  msgSuccess: addEditNetworkMap.msgSuccess,
  isEnableSaving: addEditNetworkMap.isEnableSaving,
  getLastAction: lastAction,
  stateAddEditNetworkMap: addEditNetworkMap,
});
const mapDispatchToProps = {
  handleInitializeNetworkMap,
  handleSaveNetworkMap,
  resetNetworkMapModalTable,
  handleGetBusinessCardMapTable,
  handleSaveDepartment,
  startExecuting,
  handleGetDepartmentsByCustomerId,
  onOEditEditBusinessCard,
  handleRemoveBusinessCard,
  handleShowDetail,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEditNetworkMapModeTable);