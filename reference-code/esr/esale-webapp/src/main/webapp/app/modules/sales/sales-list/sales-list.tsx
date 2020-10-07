/* eslint-disable no-irregular-whitespace */
import { FIELD_BELONG, ScreenMode, TIMEOUT_TOAST_MESSAGE, AUTHORITIES, DATETIME_FORMAT, USER_FORMAT_DATE_KEY, APP_DATE_FORMAT, APP_DATE_FORMAT_ES } from 'app/config/constants';
import ProductTradingDisplayCondition from 'app/modules/sales/control/product-tradings-display-condition';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import WarppedDynamicList from '../control/warpped-dynamic-list';
import PopupFieldsSearch from 'app/shared/layout/dynamic-form/popup-search/popup-fields-search';
import PaginationList from 'app/shared/layout/paging/pagination-list';
import { IRootState } from 'app/shared/reducers';
import { startExecuting } from 'app/shared/reducers/action-executing';
import GlobalControlRight from 'app/modules/global/global-tool';
import { RECORD_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import { translate } from 'react-jhipster';
import { useId } from "react-id-generator";
import _ from 'lodash';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import SwitchFieldPanel from '../../../shared/layout/dynamic-form/switch-display/switch-field-panel';
import SwitchFieldPanelCustom from '../components/switch-field-custom/switch-field-panel-custom';
import { customHeaderField, customFieldsInfo } from './special-render/special-render';
import { handleInitLocalMenu } from '../control/sales-control-sidebar-reducer';
import PopupMenuSet from '../../setting/menu-setting';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import {
  SALES_LIST_ID,
  SEARCH_MODE,
  FILTER_MODE,
  MENU_TYPE,
  SHOW_MESSAGE,
  SHARE_GROUP_MODES,
  SHOW_MESSAGE_SUCCESS,
  MY_GROUP_MODES,
  SELECT_TARGET_TYPE,
  orderDefault,
  orderDefaultNested,
  SALES_SPECIAL_FIELD_NAMES,
  SPECIAL_LAST_CONTACT_DATE,
  COLOR_PRODUCT_TRADING
} from '../constants'; // ADD-MY-LIST
import SalesControlRight from '../control/sales-control-right';
import SalesControlSidebar from '../control/sales-control-sidebar';
import SalesControlTop from '../control/sales-control-top';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { isNullOrUndefined } from 'util';
import SalesListView from './sales-list-view';
import {
  FieldInfoType,
  OVER_FLOW_MENU_TYPE,
  DEFINE_FIELD_TYPE,
  FIELD_NAME
} from 'app/shared/layout/dynamic-form/constants';
import SaleMoveToGroupModal from '../group/sale-move-to-group-modal';
import SaleAddToGroupModal from '../group/sale-add-to-group-modal';
import {
  handleUpdateProductTradingByProgress,
  handleDeleteProductTradings,
  getCustomFieldsInfo,
  handleSearchProductTrading,
  changeScreenMode,
  handleInitProductTradingList,
  getProgresses,
  getFieldInfoProgressPersonal,
  updateFieldInfoProgressPersonal,
  handleUpdateFieldInfoProgressPersonal,
  resetMessageSuccess,
  getProductTradingsByProgress,
  handleInitProductTradingListByProgress,
  handleUpdateProductTrading,
  ACTION_TYPES,
  handleGetInitializeListInfo,
  handleDragDropProductTrading,
  reset,
  handleFilterProductTradingsByMenu,
  resetList,
  handleUpdateProductTradingDragDrop,
  handleSearchProductTradingProgress,
  resetErrorItems,
  handleScrollEachProgress,
} from './sales-list.reducer';
import { getFieldInfoPersonals } from 'app/shared/layout/dynamic-form/list/dynamic-list.reducer';
import { resetSharedMessageSuccess } from '../shared-group/shared-group.reducer';
import SalesModalCreateSharedGroup from '../group/sales-modal-create-shared-group';
import SaleCreateMyGroupModal from '../group/sales-modal-create-my-group';
import '../../../../content/css/custom.css';
import './sales-list.scss';
import { REQUEST } from 'app/shared/reducers/action-type.util';
// import ModalSharedGroup from 'app/modules/sales/shared-group/modal-shared-group';

// ADD-MY-LIST
// import ModalSalesMyGroupEdit from 'app/modules/sales/group/add-edit-my-group-modal';
import { resetSidebar } from '../control/sales-control-sidebar-reducer';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';

// temp
import { renderSpecialItemNotEdit, specialDisplayMultiLine } from './special-render/special-render';
import { SALES_SPECIAL_LIST_FIELD } from '../constants';
import OverFlowMenu from 'app/shared/layout/common/overflow-menu';
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from 'app/modules/tasks/constants';
import SpecialEditList from '../special-item/special-edit-list';
import Popover from 'app/shared/layout/common/Popover';
import PopupEmployeeDetail from 'app/modules/employees/popup-detail/popup-employee-detail';
import ProductDetail from 'app/modules/products/product-detail/product-detail';
import ModalCreateEditTask from 'app/modules/tasks/create-edit-task/modal-create-edit-task';
import ModalCreateEditActivity from 'app/modules/activity/create-edit/activity-modal-form';
import StringUtils, { autoFormatNumber, jsonParse } from 'app/shared/util/string-utils';
import useEventListener from 'app/shared/util/use-event-listener';
import {useForceRender} from 'app/shared/util/use-force-render';
// import { FSActionTypeScreen } from '../shared-group/modal-shared-group';
import { WindowActionMessage } from 'app/shared/layout/menu/constants';
import {
  handleUpdateAutoSalesGroup,
  handleAddToFavoriteSalesGroup,
  handleRemoveFromFavoriteSalesGroup,
  handleDeleteSalesGroup,
  resetMessageSuccessSidebar
} from '../control/sales-control-sidebar-reducer';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import HelpPopup from 'app/modules/help/help';
import { CATEGORIES_ID } from 'app/modules/help/constant';
import { useDetectFormChange } from 'app/shared/util/useDetectFormChange';
import { ACTIVITY_VIEW_MODES, ACTIVITY_ACTION_TYPES } from 'app/modules/activity/constants';
import { GetSchedule } from 'app/modules/calendar/models/get-schedule-type';
import CreateEditSchedule from 'app/modules/calendar/popups/create-edit-schedule';
import SalesMySharedListModal, {FSActionTypeScreen} from 'app/modules/sales/my-shared-list/sales-my-shared-list-modal';
import { GROUP_TYPE, GROUP_MODE_SCREEN } from 'app/shared/layout/dynamic-form/group/constants';
import PopupFieldsSearchMulti from 'app/shared/layout/dynamic-form/popup-search/popup-fields-search-multi';
import { getColorTextDynamicList, getColorTextDynamicList2, getItemInFieldColumn } from '../utils';
import { formatDate, utcToTz, DATE_TIME_FORMAT, getDateTimeFormatString, getTimezone, switchFormatDate, TYPE_SWICH_FORMAT, trimTimezoneMark, autoFormatTime, timeUtcToTz } from 'app/shared/util/date-utils';
import moment from 'moment';
import { Storage } from 'react-jhipster';
import OpenModalDetail from 'app/shared/layout/common/open-modal-detail';

let isFirstTime = true;

export const ICON_FUNCION_SALES = "ic-sidebar-sales.svg";
export interface ISalesListProps extends StateProps, DispatchProps, RouteComponentProps<{}> {
  // mode display
  screenMode: any;
  // field info
  fieldInfos: any;
  // custom field info
  customFieldInfos: any;
  // data product trading
  productTradings: any;
  // action type
  actionType: any;
  // error message
  errorMessage: any;
  // error items
  errorItems: any;
  updateProductsTradings: (param) => void;
}

// let timer = null;
let saveProductChangeProgress = [];
const NUMBER_OF_RECORD = 30;
/**
 * component for list product trading
 * @param props
 */

export const SalesList = (props: ISalesListProps) => {
  const isFilterProductTrading = useRef(false);
  const { productTradings, errorItems, customFieldInfos, fieldInfos, fieldInfoSearch, customFieldInfoSearch } = props;
  const salesControlSidebar = useRef(null);

  // Trick to force rerender - use for case re-get data after update
  const [forceRerender, setForceRerender] = useState({});

  // Filter
  const [offset, setOffset] = useState(0);
  const [sidebarCurrentId, setSidebarCurrentId] = useState(null); // null ->
  const [limit, setLimit] = useState(RECORD_PER_PAGE_OPTIONS[1]);
  const [menuType, setMenuType] = useState(MENU_TYPE.ALL_PRODUCT_TRADING);
  const [settingDate, setSettingDate] = useState('');
  const [orderBy, setOrderBy] = useState(orderDefault);
  const [textSearch, setTextSearch] = useState<string>();

  // Filter for list card
  const [offsetCard, setOffsetCard] = useState(0);
  const [justScroll, setJustScroll] = useState(false);
  const [offsetEachProgress, setOffsetEachProgress] = useState([]);

  const [openMoveToGroupModal, setOpenMoveToGroupModal] = useState(false);
  const [openAddToGroupModal, setOpenAddToGroupModal] = useState(false);
  const [saveEditValues, setSaveEditValues] = useState([]);

  // Dynamic List
  const [, setGroupName] = useState(null);
  const [filterConditions, setFilterConditions] = useState([]);
  const [onOpenPopupSetting, setOnOpenPopupSetting] = useState(false);
  const [openPopupSearch, setOpenPopupSearch] = useState(false);
  const [conditionSearch, setConditionSearch] = useState(null);
  const [filterMode, setFilterMode] = useState(FILTER_MODE.OFF);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [searchMode, setSearchMode] = useState(SEARCH_MODE.NONE);
  const [msgErrorBox, setMsgErrorBox] = useState(null);
  const [, setDepartmentIdSelected] = useState(0);
  const [conDisplaySearchDetail, setConDisplaySearchDetail] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(SHOW_MESSAGE_SUCCESS.NONE);
  const tableListRef = useRef(null);
  const [view, setView] = useState(1);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [changeDisplayOn, setChangeDisplay] = useState(false);
  const [showMessage, setShowMessage] = useState(0);
  const [listViewChecked, setListViewChecked] = useState([]);
  const [isCollapse, setIsCollapse] = useState(true);
  // const [listChangeId, setListChangeId] = useState([]);


  // ADD_TO_GROUP
  const [openSalesCreateSharedGroupModal, setOpenSalesCreateSharedGroupModal] = useState(false);
  const [openSalesCreateMyGroup, setOpenSalesCreateMyGroup] = useState(false);
  const [targetType, setTargetType] = useState(SELECT_TARGET_TYPE.ALL_SALES);
  const [selectedTargetId, setSelectTargetId] = useState(0);

  // open group Share
  const [groupMode, setGroupMode] = useState(SHARE_GROUP_MODES.MODE_CREATE_GROUP);
  const [groupId, setGroupId] = useState();
  const [isAutoShareGroup, setIsAutoShareGroup] = useState();
  const [isAutoroup, setIsAutoGroup] = useState();
  const [isOwnerGroup, setIsOwnerGroup] = useState();
  const [groupMember, setGroupMember] = useState([]);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [, setTypeGroup] = useState(MENU_TYPE.MY_GROUP);

  // temp, hover to special render
  const [openOverFlow, setOpenOverFlow] = useState(false);
  const [activeIcon, setActiveIcon] = useState(false);
  const [heightPosition, setHeightPosition] = useState(1);

  const [employeeIdDetail, setEmployeeIdDetail] = useState(null);
  const [openPopUpEmployee, setOpenPopUpEmployee] = useState(false);
  // Open customer
  const [customerIdDetail, setCustomerIdDetail] = useState(null);
  const [openPopUpCustomer, setOpenPopUpCustomer] = useState(false);
  // OPEN PRODUCT
  const [openPopUpProduct, setOpenPopUpProduct] = useState(false);
  const [productIdDetail, setProductIdDetail] = useState(null);
  // ADD-MY-LIST
  const [openAddEditMyGroupModal, setOpenAddEditMyGroupModal] = useState(false);
  const [openSalesCreateSharedGroup, setOpenSalesCreateSharedGroup] = useState(false);

  const [myGroupModalMode, setMyGroupModalMode] = useState(MY_GROUP_MODES.MODE_CREATE_GROUP);
  const [recordCheckList, setRecordCheckList] = useState([]);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]); // check user is admin or not
  const [pulldownOnlySharelist, setPulldownOnlyShareList] = useState(false);
  const [onOpenPopupHelp, setOnOpenPopupHelp] = useState(false);
  const [dataModalTask] = useState({
    showModal: false,
    taskActionType: TASK_ACTION_TYPES.CREATE,
    taskId: null,
    parentTaskId: null,
    taskViewMode: TASK_VIEW_MODES.EDITABLE,
    product: {},
    productTradingIds: null
  });
  const [stateModalCustomer, setStateModalCustomer] = useState(null)
  const [isRender, forceRender] = useForceRender()
  // const firstEmployeesError = parseValidateError().firstErrorEmployees;
  const [fileUploads, setFileUploads] = useState({});
  const [messageDownloadFileError, setMessageDownloadFileError] = useState(null);
  const employeeDetailCtrlId = useId(1, "saleListEmployeeDetail_")
  const customerDetailCtrlId = useId(1, "saleListDetailCustomerDetailCtrlId_");


  const [paramModal] = useState({
    grpMode: 1,
    groupIdInd: 1,
    isOwnerGroupIn: false,
    isAutoGroupIn: false,
    groupMemberIn: []
  });
  const [listMenuType, setListMenuType] = useState({
    isAllSales: true,
    isMyGroup: false,
    isSharedGroup: false,
    isAutoGroup: false,
    isOwner: false
  });

  const [tradingList, setTradingList] = useState([]);
  const [productTradingsByProgress, setProductTradingsByProgress] = useState({});
  // Create task modal
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [arrDataProductTrading, setArrDataProductTrading] = useState([]);

  const [openCreateActivity, setOpenCreateActivity] = useState(false);
  const [openCreateSchedule, setOpenCreateSchedule] = useState(false);
  const [conditionSearchDisplay, setConditionSearchDisplay] = useState([])

  const dumyScheduleData: GetSchedule = {
    participants: {
      employees: [{
        employeeId: 1,
        employeeName: 'erew',
      }, {
        employeeId: 10009,
        employeeName: 'Ngoc Anh',
      }],
      departments: [{
        departmentId: 1,
        departmentName: ''
      }],
      groups: [{
        groupId: 2,
        groupName: 'reere'
      }]
    }
  }

  const getMatrix = () => {
    let isFirstLoadFilter = true;
    let tempTextSearch = textSearch;
    const tempFilterCondition = filterConditions;
    let tempConditionSearch = conditionSearch;
    let tempSelectedTargetId = selectedTargetId
    const tempOrderBy = orderBy;

    // case search text
    if (tempTextSearch) {
      isFirstLoadFilter = false;
      // tempFilterCondition = [];
      tempConditionSearch = [];
      tempSelectedTargetId = 0
    }

    // case search detail
    if (conditionSearch) {
      if (conditionSearch.length > 0) {
        isFirstLoadFilter = false;
        tempTextSearch = null;
        // tempFilterCondition = [];
        tempSelectedTargetId = 0;
      }
    }

    return { isFirstLoadFilter, tempTextSearch, tempSelectedTargetId, tempConditionSearch, tempFilterCondition, tempOrderBy }
  }

  const buildSearchCondition = (params) => {
    // Duy
    const searchConditions = [];
    for (let i = 0; i < params.length; i++) {
      if (!_.isNil(params[i].fieldRelation) || params[i].ignore) {
        continue;
      }
      const isArray = Array.isArray(params[i].fieldValue);
      if (!params[i].isSearchBlank && (!params[i].fieldValue || params[i].fieldValue.length <= 0)) {
        continue;
      }
      let val = null;
      if (params[i].isSearchBlank) {
        val = isArray ? '[]' : '';
      } else if (isArray) {
        // spe
        if (params[i].fieldName === 'is_admin') {
          params[i].fieldValue[0] = false;
          params[i].fieldValue[1] = true;
        }
        let jsonVal = params[i].fieldValue;
        if (
          jsonVal.length > 0 &&
          jsonVal[0] &&
          (Object.prototype.hasOwnProperty.call(jsonVal[0], 'from') || Object.prototype.hasOwnProperty.call(jsonVal[0], 'to'))
        ) {
          jsonVal = jsonVal[0];
        }
        val = JSON.stringify(jsonVal);
      } else {
        val = params[i].fieldValue.toString();
      }
      searchConditions.push({
        // isNested: checkIsNested(params[i]),
        fieldType: params[i].fieldType,
        // fieldId: params[i].fieldId,
        isDefault: `${params[i].isDefault}`,
        fieldName: params[i].fieldName === FIELD_NAME.CONTACT_DATE ? FIELD_NAME.FIELD_NAME_CONTACT_DATE_TO_API: params[i].fieldName ,
        fieldValue: val,
        searchType: params[i].searchType,
        searchOption: params[i].searchOption
      });
    }
    return searchConditions;
  }

  const resetFilter = () => {
    setOrderBy(orderDefault)
    setFilterConditions([])
    tableListRef?.current?.resetState();
  }

  const handleAfterActionCard = () => {
    setForceRerender({});
    setListViewChecked([]);
  }

  useEffect(() => {
    if (props.productTradingsByProgress) {
      setProductTradingsByProgress(props.productTradingsByProgress);
    }
  }, [props.productTradingsByProgress]);

  useEffect(() => {
    if (props.progresses.length > 0) {
      const tempArr = props.progresses.map(el => ({
        productTradingProgressId: el.productTradingProgressId,
        offset: 0,
      }));

      setOffsetEachProgress(tempArr);
    }
  }, [props.progresses]);

  // Watch and update progresses
  useEffect(() => {
    // Re-get progress after updating (add, edit) progresses
    props.getProgresses();
  }, [props.progressesProductTrade]);

  // fix bug 20889
  // Watch when update employee
  useEffect(() => {
    // props.isEmployeeUpdated === -1 is initialState, if it diff -1 meaning employee just updated
    if (props.isEmployeeUpdated !== -1) {
      if (view === 2) {
        handleAfterActionCard();
      }
      if (view === 1) {
        setForceRerender({});
      }
    }

  }, [props.isEmployeeUpdated]);

  // Watch when update customer
  useEffect(() => {
    // props.isCustomerUpdated === -1 is initialState, if it diff -1 meaning customer just updated
    if (props.isCustomerUpdated !== -1) {
      if (view === 2) {
        handleAfterActionCard();
      }
      if (view === 1) {
        setForceRerender({});
      }
    }
  }, [props.isCustomerUpdated]);


  const formId = "product-trading-list-edit-simple-mode"
  const [isChanged, setIsChanged] = useDetectFormChange(formId, [view])

  // Handle matrix search
  // Should handle condition here
  useEffect(() => {
    let isFirstLoadFilter = true;
    let tempTextSearch = textSearch;
    const tempFilterCondition = filterConditions;
    let tempConditionSearch = conditionSearch;
    let tempSelectedTargetId = selectedTargetId
    const tempOrderBy = orderBy;

    // case search text
    if (textSearch) {
      isFirstLoadFilter = false;
      tempConditionSearch = [];
      tempSelectedTargetId = 0
      setSelectTargetId(0)
    }

    // case search detail
    if (conditionSearch && _.isArray(conditionSearch)) {
      if (conditionSearch.length > 0) {
        isFirstLoadFilter = false;
        tempTextSearch = null;
        tempSelectedTargetId = 0;
        setSelectTargetId(0)

        // fix bug 23311
        // conditionSearch is used to save value in popupSearch
        // tempConditionSearch is used to call api search 
        tempConditionSearch = buildSearchCondition(conditionSearch);
      }
    }

    if (view === 2) {
      props.startExecuting(REQUEST(ACTION_TYPES.PRODUCT_TRADING_LIST_BY_PROGRESS_GET));
      props.handleSearchProductTradingProgress(
        offset,
        limit,
        isFirstLoadFilter,
        menuType,
        tempSelectedTargetId,
        tempTextSearch,
        tempConditionSearch,
        tempFilterCondition,
        tempOrderBy,
        settingDate
      );
    }

    if (view === 1) {
      props.startExecuting(REQUEST(ACTION_TYPES.PRODUCT_TRADING_LIST_BY_PROGRESS_GET));
      if (isFirstTime) {
        isFirstTime = false;
        props.handleInitProductTradingList(offset, limit, menuType, selectedTargetId, [], tempOrderBy, settingDate);
      } else {
        if (searchMode !== SEARCH_MODE.TEXT_DEFAULT) {
          tempTextSearch = '';
        }

        if (isFilterProductTrading.current) {
          isFilterProductTrading.current = false;
          props.handleFilterProductTradingsByMenu(
            offset,
            limit,
            conditionSearch,
            menuType,
            tempSelectedTargetId,
            false,
            tempFilterCondition,
            tempOrderBy,
            settingDate,
          );
          return;
        }

        props.handleSearchProductTrading(
          offset,
          limit,
          isFirstLoadFilter,
          menuType,
          tempSelectedTargetId,
          tempTextSearch,
          tempConditionSearch,
          tempFilterCondition,
          tempOrderBy,
          settingDate,
        );
      }
    }
  }, [
    menuType,
    selectedTargetId,
    // textSearch,
    // conditionSearch,
    // filterConditions,
    // orderBy,
    settingDate,
    view,
    forceRerender,
    // fix bug #21988
    limit,
    offset
  ]);

  // const onOpenSalesCreateSharedGroupModal = (grpMode, groupIdIn, isOwnerGroupIn, isAutoGroupIn, groupMemberIn) => {
  //   if (!openSalesCreateSharedGroupModal) {
  //     setParamModal({ grpMode, groupIdInd: groupIdIn, isOwnerGroupIn, isAutoGroupIn, groupMemberIn });
  //     setOpenSalesCreateSharedGroupModal(true);
  //   }
  // };

  /**
   * close modal create share group
   */
  const onCloseSaleCreateSharedGroup = () => {
    setOpenSalesCreateSharedGroup(false);
  };
  /**
   * close modal create my group
   */
  const onCloseSaleCreateMyGroup = () => {
    setOpenSalesCreateMyGroup(false);
  };

  let productTradingList = [];
  let totalCount = null;
  if (productTradings && productTradings.productTradings) {
    productTradingList = productTradings.productTradings;
    if(productTradingList && productTradingList.length > 0) {
      productTradingList.forEach(e => {
        e["product_name"] = e.product?.productName;
        e["product_image_name"] = e.product?.productImageName;
        e["product_image_path"] = e.product?.productImagePath;
        e["product_category_name"] = e.product?.productCategoryName;
        e["memo_product"] = e.product?.memo;
      })
    }
    totalCount = productTradings.total;
  }
  let customFields = [];
  if (customFieldInfos) {
    customFields = customFieldInfos;
  }

  let progresses = [];
  if (productTradings && productTradings.progresses) {
    progresses = productTradings.progresses;
  }

  let fields = [];
  if (fieldInfos && fieldInfos.fieldInfoPersonals) {
    fields = fieldInfos.fieldInfoPersonals;
    // fields.push(SPECIAL_LAST_CONTACT_DATE);
    fields.forEach(x => {
      switch (x.fieldName) {
        case SALES_SPECIAL_FIELD_NAMES.PT_PROGRESS_ID:
          x.fieldItems = [];
          progresses.forEach(progress => {
            x.fieldItems.push({
              itemId: progress.productTradingProgressId,
              itemLabel: progress.progressName,
              isAvailable: 1
            });
          })
          x.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX
          break
        case SALES_SPECIAL_FIELD_NAMES.IS_FINISH:
          x.availableFlag = 3
          x.fieldItems = [
            { itemId: 0, itemLabel: translate('sales.all-status'), isAvailable: 1 },
            { itemId: 1, itemLabel: translate('sales.complete-status'), isAvailable: 1 },
            { itemId: 2, itemLabel: translate('sales.not-complete-status'), isAvailable: 1 }
          ];
          x.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX
          return x;
        case SALES_SPECIAL_FIELD_NAMES.LAST_CONTACT_DATE:
          x.fieldType = DEFINE_FIELD_TYPE.DATE;
          break
        default:
          break
      }
    })
  }

  let fieldSearch = [];
  if (fieldInfoSearch?.fieldInfoPersonals) {
    fieldSearch = fieldInfoSearch.fieldInfoPersonals;
    // fieldSearch.push(SPECIAL_LAST_CONTACT_DATE);
    fieldSearch.forEach(y => {
      switch (y.fieldName) {
        case SALES_SPECIAL_FIELD_NAMES.PT_PROGRESS_ID:
          y.fieldItems = [];
          progresses.forEach(progress => {
            y.fieldItems.push({
              itemId: progress.productTradingProgressId,
              itemLabel: progress.progressName,
              isAvailable: 1
            });
          })
          y.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX
          break;
        case SALES_SPECIAL_FIELD_NAMES.IS_FINISH:
          y.availableFlag = 3;
          y.fieldItems = [
            { itemId: 0, itemLabel: translate('sales.all-status'), isAvailable: 1 },
            { itemId: 1, itemLabel: translate('sales.complete-status'), isAvailable: 1 },
            { itemId: 2, itemLabel: translate('sales.not-complete-status'), isAvailable: 1 }
          ];
          y.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX;
          return y;
        case  SALES_SPECIAL_FIELD_NAMES.LAST_CONTACT_DATE:
          y.fieldType = DEFINE_FIELD_TYPE.DATE
          break;
        case   SALES_SPECIAL_FIELD_NAMES.CONTACT_DATE:
          y.fieldType = DEFINE_FIELD_TYPE.OTHER
          break;
        default:
          break;
      }
    })
  }

  let customFieldSearch = [];
  if (customFieldInfoSearch?.customFieldsInfo) {
    customFieldSearch = customFieldInfoSearch.customFieldsInfo;
    // customFieldSearch.push(SPECIAL_LAST_CONTACT_DATE);
    customFieldSearch.forEach(z => {
      switch (z.fieldName) {
        case SALES_SPECIAL_FIELD_NAMES.PT_PROGRESS_ID:
          z.fieldItems = [];
          progresses.forEach(progress => {
            z.fieldItems.push({
              itemId: progress.productTradingProgressId,
              itemLabel: progress.progressName,
              isAvailable: 1
            });
          })
          z.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX;
          break;
        case SALES_SPECIAL_FIELD_NAMES.IS_FINISH:
          z.availableFlag = 3;
          z.fieldItems = [
            { itemId: 0, itemLabel: translate('sales.all-status'), isAvailable: 1 },
            { itemId: 1, itemLabel: translate('sales.complete-status'), isAvailable: 1 },
            { itemId: 2, itemLabel: translate('sales.not-complete-status'), isAvailable: 1 }
          ];
          z.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX;
          break;
        case  SALES_SPECIAL_FIELD_NAMES.LAST_CONTACT_DATE:
          z.fieldType = DEFINE_FIELD_TYPE.DATE
          break;
          case  SALES_SPECIAL_FIELD_NAMES.CONTACT_DATE:
          z.fieldLabel = translate('sales.contact-date1') + translate('sales.contact-date2');
          z.fieldType = DEFINE_FIELD_TYPE.NUMERIC
          break
        default:
          break;
      }
    })
  }


  const changeSelectedSidebar = obj => {
    setMsgErrorBox('');
    setTargetType(obj.type);
    setSelectTargetId(obj.cardId);
    if (tableListRef.current) {
      tableListRef.current.changeTargetSidebar(obj.type, obj.cardId);
    } else {
      setMenuType(obj.type);
    }

    // reset state

    // clear search local
    setTextSearch("")
    // clear search details: OK
    // clear filter: 
    resetFilter();


    setListViewChecked([]);
    setConditionSearch('');
    setOffset(0);
    setLimit(RECORD_PER_PAGE_OPTIONS[1]);
    // if(employeeControlTopRef && employeeControlTopRef.current){
    //   setConDisplaySearchDetail(false);
    // }
    setConDisplaySearchDetail(false);
  };

  const checkBoxMesSuccess = propsMsg => {
    if (propsMsg !== SHOW_MESSAGE_SUCCESS.NONE) {
      if (!propsMsg) {
        return;
      }

      // hide error message
      setMsgErrorBox('');

      // Fix: don't show msg after delete
      if (propsMsg === SHOW_MESSAGE_SUCCESS.CREATE) {
        setMsgSuccess(SHOW_MESSAGE_SUCCESS.CREATE);
        // return;
      }else if(propsMsg === SHOW_MESSAGE_SUCCESS.DELETE){
        setMsgSuccess(SHOW_MESSAGE_SUCCESS.DELETE);
        // return;
      }else if(propsMsg === SHOW_MESSAGE_SUCCESS.UPDATE){
        setMsgSuccess(SHOW_MESSAGE_SUCCESS.UPDATE);
        // return;
      }else if(propsMsg === SHOW_MESSAGE_SUCCESS.ADD_TO_FAVORITE){
        setMsgSuccess(SHOW_MESSAGE_SUCCESS.CREATE);
        // return;
      }else if(propsMsg === SHOW_MESSAGE_SUCCESS.REMOVE_FROM_FAVORITE){
        setMsgSuccess(SHOW_MESSAGE_SUCCESS.REMOVE_FROM_FAVORITE);
        // return;
      }else if(propsMsg === SHOW_MESSAGE_SUCCESS.DRAG_TO_LIST){
        setMsgSuccess(SHOW_MESSAGE_SUCCESS.DRAG_TO_LIST);
        // return;
      }else{
        setMsgSuccess(SHOW_MESSAGE_SUCCESS.NONE);
      }

      

      // if (timer) {
      //   timer = null;
      // }
      // timer = setTimeout(function () {
      //   setMsgSuccess(SHOW_MESSAGE_SUCCESS.NONE);
      //   // props.resetMessageSuccess();
      //   // props.resetSharedMessageSuccess();
      // }, TIMEOUT_TOAST_MESSAGE);
      setTimeout(function () {
        setMsgSuccess(SHOW_MESSAGE_SUCCESS.NONE);
        // props.resetMessageSuccess();
        // props.resetSharedMessageSuccess();
      }, TIMEOUT_TOAST_MESSAGE);
    }
  };

  

  let tradingListInit = [];

  if (productTradings) {
    tradingListInit = _.cloneDeep(productTradings.productTradings);
  }

  const splitString = (stringValue, characterSplit, index, type) => {
    if(!stringValue) return "";
    const result = stringValue.split(characterSplit)

    if(!result) return "";
    if(type === 1){
      return result[index];
    } else{
      if(result.length < index) return "";
      result.length = index;
      return result.join(characterSplit);
    }
  }
  const convertDateTime = (dateTime) => {
    const userFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
    const timezone = getTimezone();
    const dateTimeUTC = moment.tz(
      _.isString(dateTime) ? dateTime : _.toString(dateTime),
      getDateTimeFormatString(DATE_TIME_FORMAT.Database),
      timezone).utc();
      return dateTimeUTC.format(userFormat + ' HH:mm');
  }

  const confirmInputEdit = () => {
    const arrayChangeValue = []
    const arrayChangeProductTradingId = []
    if (props.screenMode === ScreenMode.DISPLAY || saveEditValues.length <= 0 || tradingListInit.length <= 0 || fields.length <= 0) {
      return arrayChangeValue;
    }

    const groupTrading = saveEditValues.reduce(function (h, obj) {
      h[obj.itemId] = (h[obj.itemId] || []).concat(obj);
      return h;
    }, {});

    for (const prd in groupTrading) {
      if (!Object.prototype.hasOwnProperty.call(groupTrading, prd)) {
        continue;
      }

      const recordIdx = productTradings?.productTradings.findIndex(record => _.toString(record['product_trading_id']) === _.toString(prd));

      for (let i = 0; i < groupTrading[prd].length; i++) {
        const fieldIdx = fields.findIndex(e => e.fieldId.toString() === groupTrading[prd][i].fieldId.toString());
        if (fieldIdx < 0) {
          continue;
        }
        const fieldName = fields[fieldIdx].fieldName;
        const fieldLabel = fields[fieldIdx].fieldLabel;
        const fieldType = fields[fieldIdx].fieldType;
        let newValue = groupTrading[prd][i].itemValue;

        if (tradingListInit[recordIdx] === undefined) {
          continue;
        }
        let oldValue = tradingListInit[recordIdx][fieldName];
        
        if ([
          DEFINE_FIELD_TYPE.MULTI_SELECTBOX, 
          DEFINE_FIELD_TYPE.CHECKBOX, 
          DEFINE_FIELD_TYPE.ADDRESS, 
          DEFINE_FIELD_TYPE.SELECT_ORGANIZATION,
          DEFINE_FIELD_TYPE.FILE,
          DEFINE_FIELD_TYPE.LINK,
        ].includes( _.toString(fieldType))) {
          oldValue = oldValue ? jsonParse(oldValue) : "[]";
        }
        if(_.toString(fieldType) === DEFINE_FIELD_TYPE.LINK ){
          newValue = newValue ? jsonParse(newValue) : "";
        } else if(_.toString(fieldType) === DEFINE_FIELD_TYPE.DATE){
          oldValue = oldValue? switchFormatDate(oldValue, TYPE_SWICH_FORMAT.DEFAULT_TO_USER) : "";
        } else if(_.toString(fieldType) === DEFINE_FIELD_TYPE.TIME){ 
          oldValue = oldValue ? timeUtcToTz(autoFormatTime(oldValue, true)) : "";
          newValue = newValue ? timeUtcToTz(autoFormatTime(newValue, true)) : "";
        }  else if(_.toString(fieldType) === DEFINE_FIELD_TYPE.DATE_TIME){ 
          oldValue = oldValue ? utcToTz(dateFnsParse(trimTimezoneMark(oldValue)), DATE_TIME_FORMAT.User) : "";
          newValue = newValue ? utcToTz(dateFnsParse(trimTimezoneMark(newValue)), DATE_TIME_FORMAT.User) : "";
        } else {
          newValue = newValue ? newValue.toString() : "";
          oldValue = oldValue ? oldValue.toString() : "";
        }

        if (oldValue === "[]") {
          oldValue = ""
        }
        if (newValue === null) {
          newValue = ""
        }
        if (!_.isEqual(newValue, oldValue) && fieldName !== 'created_date' && fieldName !== 'updated_user' && fieldName !== 'updated_date') {
          arrayChangeValue.push({ 
            productTradingId: tradingListInit[recordIdx]["product_trading_id"],
            fieldName,
            fieldLabel,
            fieldType, 
            newValue, 
            oldValue
          })
          if(!arrayChangeProductTradingId.includes(tradingListInit[recordIdx]["product_trading_id"])){
            arrayChangeProductTradingId.push(tradingListInit[recordIdx]["product_trading_id"])
          }
        }
      }
    }
    // console.log("arrayChangeProductTradingId", arrayChangeProductTradingId);
    // setListChangeId(arrayChangeProductTradingId)
    return arrayChangeProductTradingId;
  }

  const handleUpdateProgress = data => {

    const filters = {
      offset,
      limit,
      menuType,
      selectedTargetId,
      conditionSearch,
      orderBy,
      settingDate,
      isFirstLoad: true
    };
    props.startExecuting(REQUEST(ACTION_TYPES.PRODUCT_TRADING_UPDATE));
    props.handleUpdateProductTradingDragDrop(data, filters, view).then(() => {
      // Clear list checked after update
      setListViewChecked([]);
      setRecordCheckList([]);
      tableListRef.current && tableListRef.current.removeSelectedRecord();
    });
  };

  const handleChooseProgress = productTradingProgressId => {
    const listProductTradingChecked = view === 1 ? props.recordCheckList : listViewChecked;

    const parseParam = {
      productTradingIds: listProductTradingChecked.map(ele => ele.productTradingId),
      updateFields: [
        {
          fieldName: 'product_trading_progress_id',
          fieldValue: productTradingProgressId.toString()
        }
      ]
    };
    handleUpdateProgress(parseParam);
  };

  useEffect(() => {
    props.msgSuccessControlSidebar && checkBoxMesSuccess(props.msgSuccessControlSidebar);
  }, [props.msgSuccessControlSidebar, props.timeSideAddToList]);

  // useEffect(() => {
  //   checkBoxMesSuccess(props.myGroupSuccess);
  //   tableListRef.current && tableListRef.current.removeSelectedRecord();
  // }, [props.myGroupSuccess]);

  // useEffect(() => {
  //   checkBoxMesSuccess(props.sharedGroupSalesSuccess);
  //   tableListRef.current && tableListRef.current.removeSelectedRecord();
  // }, [props.sharedGroupSalesSuccess]);
  useEffect(() => {
    checkBoxMesSuccess(props.mySharedSalesSuccess);
    tableListRef.current && tableListRef.current.removeSelectedRecord();
  }, [props.mySharedSalesSuccess]);

  // useEffect(() => {
  //   setOpenGroupModal(false);
  //   setOpenAddEditMyGroupModal(false);
  //   setOpenSalesCreateSharedGroupModal(false);
  //   setOpenSalesCreateSharedGroup(false);
  // }, [props.updatedGroupId]);

  useEffect(() => {
    checkBoxMesSuccess(props.saleListMessage);
    tableListRef.current && tableListRef.current.removeSelectedRecord();
  }, [props.saleListMessage, props.timeAddToList]);

  useEffect(() => {
    setRecordCheckList([]);
    tableListRef.current && tableListRef.current.removeSelectedRecord();
  }, [menuType]);

  // useEffect(() => { checkBoxMesSuccess(props.msgSuccessDepartMent) }, [props.msgSuccessDepartMent])
  // useEffect(() => { checkBoxMesSuccess(props.msgSuccessList) }, [props.msgSuccessList])
  // useEffect(() => { checkBoxMesSuccess(props.msgSuccessManage) }, [props.msgSuccessManage])
  // useEffect(() => { checkBoxMesSuccess(props.msgSuccessControlSidebar) }, [props.msgSuccessControlSidebar])

  /**
   * init screen
   */
  useEffect(() => {
    document.body.className = 'wrap-product-management';
    // props.handleInitProductTradingList(offset, limit, menuType, selectedTargetId, [], orderDefault);
    props.getFieldInfoProgressPersonal();
    props.changeScreenMode(false);
    props.handleGetInitializeListInfo(FIELD_BELONG.PRODUCT_TRADING);
    props.getProgresses();
    setIsFirstLoad(true);
    return () => {
      // props.reset();
    };
  }, [props.employeeSetting]);

  /**
   * Set menu type to all sales
   */
  useEffect(() => {
    if (props.deletedDepartmentId !== null || props.deletedGroupId !== null) {
      setListMenuType({
        isAllSales: true,
        isMyGroup: false,
        isSharedGroup: false,
        isAutoGroup: false,
        isOwner: false
      });
      props.handleInitProductTradingList(offset, limit, menuType, selectedTargetId, [], orderDefault, settingDate);
    }
  }, [props.deletedGroupId, props.deletedDepartmentId, props.timeAddToList]);



  /**
   * search function common for this list
   * @param offsetRecord
   * @param limitRecord
   * @param typeSearch
   */
  const searchProductTradingList = (offsetRecord, limitRecord, typeSearch) => {
    let conditionRecord =
      typeSearch === MENU_TYPE.MY_PRODUCT_TRADING
        ? []
        : conditionSearch
          ? _.cloneDeep(conditionSearch)
          : [];
    if (typeSearch === MENU_TYPE.MY_PRODUCT_TRADING) {
      let employeeCondition = conditionRecord.find(x => x.fieldName === 'employee_id');
      if (
        employeeCondition &&
        employeeCondition.fieldValue &&
        !employeeCondition.fieldValue.include(0)
      ) {
        employeeCondition.fieldValue.push(0);
        conditionRecord = conditionRecord
          .filter(x => x.fieldName !== 'employee_id')
          .push(employeeCondition);
      } else {
        employeeCondition = orderDefaultNested;
        conditionRecord = conditionRecord.push(employeeCondition);
      }
    }

    setOffset(offsetRecord);
    setLimit(limitRecord);
    setMenuType(typeSearch);
    setConditionSearch(conditionRecord);
    setFilterConditions(filterConditions)

    // if (
    //   typeSearch === MENU_TYPE.MY_PRODUCT_TRADING ||
    //   typeSearch === MENU_TYPE.ALL_PRODUCT_TRADING
    // ) {
    //   if (searchMode === SEARCH_MODE.TEXT_DEFAULT) {
    //     filterMode === FILTER_MODE.OFF
    //       ? props.handleSearchProductTrading(
    //           offsetRecord,
    //           limitRecord,
    //           isFirstLoad,
    //           typeSearch,
    //           selectedTargetId,
    //           textSearch,
    //           conditionRecord,
    //           // fix bug #15837
    //           [],
    //           orderBy
    //         )
    //       : props.handleSearchProductTrading(
    //           offsetRecord,
    //           limitRecord,
    //           isFirstLoad,
    //           typeSearch,
    //           selectedTargetId,
    //           textSearch,
    //           conditionRecord,
    //           filterConditions,
    //           orderBy
    //         );
    //   } else {
    //     filterMode === FILTER_MODE.OFF
    //       ? // fix bug #15837
    //         props.handleSearchProductTrading(
    //           offsetRecord,
    //           limitRecord,
    //           isFirstLoad,
    //           typeSearch,
    //           selectedTargetId,
    //           null,
    //           conditionRecord,
    //           [],
    //           orderBy
    //         )
    //       : props.handleSearchProductTrading(
    //           offsetRecord,
    //           limitRecord,
    //           isFirstLoad,
    //           typeSearch,
    //           selectedTargetId,
    //           null,
    //           conditionRecord,
    //           filterConditions,
    //           orderBy
    //         );
    //   }
    // }
  };

  /**
   * dirty check
   * @param action
   * @param cancel
   */
  const executeDirtyCheck = async (
    action: () => void,
    cancel?: () => void,
    patternType?: number
  ) => {
    if (props.screenMode === ScreenMode.DISPLAY) {
      action();
    } else {
      isChanged ? await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: 1 }) : action();
    }
  };

  /**
   * handle action search text
   * @param text
   */
  const enterSearchText = text => {
    resetFilter();
    setConditionSearch(null)
    executeDirtyCheck(
      () => {
        setTextSearch(text);
        setOffset(0);
        setSearchMode(SEARCH_MODE.TEXT_DEFAULT);
        if (props.screenMode === ScreenMode.EDIT) {
          props.changeScreenMode(false);
        }
        setSaveEditValues([]);
        saveProductChangeProgress = [];
      },
      () => {
        setTextSearch('');
      }
    );
    setForceRerender({})
  };

  /**
   * handle action delete records
   * @param ids
   */
  const handleDelete = ids => {
    props.startExecuting(REQUEST(ACTION_TYPES.DELETE_PRODUCT_TRADINGS));
    props.handleDeleteProductTradings(ids).then(() => {
      if (view === 2) {
        handleAfterActionCard();
      }
    });
  };

  /**
   * handle action open popup setting
   */
  const handleOpenPopupSetting = () => {
    setOnOpenPopupSetting(true);
  };

  /**
   * handle close message after 2s
   */
  useEffect(() => {
    if (showMessage !== 0) {
      setTimeout(() => {
        setShowMessage(0)
        props.resetMessageSuccessSidebar();
      }, 2000);
    }
  }, [showMessage]);

  /**
   * handle set error message
   */
  useEffect(() => {
    if (props.errorCodeList && props.errorCodeList.length > 0) {
      setShowMessage(SHOW_MESSAGE.ERROR);
    }
  }, [props.errorCodeList]);
  useEffect(() => {
    if (props.sidebarErrorMessage && props.sidebarErrorMessage.length > 0) {
      setShowMessage(SHOW_MESSAGE.ERROR);
    }
  }, [props.sidebarErrorMessage, props.timeSideAddToList]);

  /**
   * handle event before delete records
   */
  useEffect(() => {
    if (props.deleteProductTradings || props.updatedAutoGroupId) {
      setListViewChecked([]);
      setShowMessage(0);
      props.startExecuting(REQUEST(ACTION_TYPES.PRODUCT_TRADING_LIST_PRODUCTS_GET));
      if (tableListRef && tableListRef.current) tableListRef.current.removeSelectedRecord();
      // start fix bug #20886
      if (props.deleteProductTradings) {
        searchProductTradingList(offset, limit, MENU_TYPE.ALL_PRODUCT_TRADING);
      } else {
        searchProductTradingList(offset, limit, menuType);
      }
      // end fix bug #20886
    }
  }, [props.deleteProductTradings, props.updatedAutoGroupId]);

  /**
   * get error message
   * @param errorCode
   */
  const getErrorMessage = (errorCode, param?) => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
      return errorMessage;
    }
    if (param) {
      return translate('messages.' + errorCode, param);
    } else {
      return translate('messages.' + errorCode);
    }
  };

  /**
   * render error message
   */
  const renderErrorMessage = () => {
    if (showMessage === SHOW_MESSAGE.ERROR) {
      if (props.errorCodeList && props.errorCodeList.length >0) {
        return (
          props.errorCodeList &&
          props.errorCodeList.map((error, index) => {
            return (
              <div key={index}>
                <BoxMessage
                  messageType={MessageType.Error}
                  message={getErrorMessage(error.errorCode)}
                />
              </div>
            );
          })
        );
      } else if (props.sidebarErrorMessage && props.sidebarErrorMessage.length>0) {
        return (
          props.sidebarErrorMessage &&
          props.sidebarErrorMessage.map((error, index) => (
            <div key={index}>
              <BoxMessage
                messageType={MessageType.Error}
                message={getErrorMessage(error.errorCode)} />
            </div>
          ))
        );
      }
    } else {
      return null;
    }
  };

  /**
   * handle action close popup search details
   * @param saveCondition
   */
  const onClosePopupSearch = saveCondition => {
    setOpenPopupSearch(false);
    if (saveCondition && saveCondition.length > 0) {
      setConditionSearch(saveCondition);
    }
  };

  /**
   * handle action search details
   * @param condition
   */
  const handleSearchPopup = condition => {
    setConditionSearchDisplay(condition);
    setConDisplaySearchDetail(true);
    resetFilter()
    setOpenPopupSearch(false);
    setConditionSearch(condition);
    setOffset(0);
    setSearchMode(SEARCH_MODE.CONDITION);
    if (props.screenMode === ScreenMode.EDIT) {
      props.changeScreenMode(false);
    }
    setSaveEditValues([]);
    saveProductChangeProgress = [];
    setForceRerender({})
  };

  /**
   * handle action paging
   * @param offsetRecord
   * @param limitRecord
   */
  const onPageChange = (offsetRecord, limitRecord) => {
    executeDirtyCheck(() => {
      setOffset(offsetRecord);
      setLimit(limitRecord);
      setSaveEditValues([]);
      saveProductChangeProgress = [];
      searchProductTradingList(offsetRecord, limitRecord, menuType);
      if (props.screenMode === ScreenMode.EDIT) {
        props.changeScreenMode(false);
      }
    });
  };

  /**
   * get extension data
   */
  const getExtensionSales = () => {
    const extensionsData = {};
    if (!productTradings) {
      return extensionsData;
    }
    if (
      productTradings.progresses &&
      Array.isArray(productTradings.progresses) &&
      productTradings.progresses.length > 0
    ) {
      const productTradingProgressId = [];
      productTradings.progresses.forEach(element => {
        productTradingProgressId.push({
          itemId: element.productTradingProgressId,
          itemLabel: element.progressName,
          isAvailable: element.isAvailable,
          progressOrder: element.progressOrder
        });
      });
      extensionsData['product_trading_progress_id'] = productTradingProgressId;
    }
    return extensionsData;
  };

  const customFieldsInfoData = (field, type) => {
    return customFieldsInfo(field, type, null);
  };

  /**
   * handle action show field display
   */
  const onShowSwitchDisplay = () => {
    if (!showSwitcher) {
      executeDirtyCheck(() => {
        props.getCustomFieldsInfo();
        setShowSwitcher(true);
        setSaveEditValues([]);
        saveProductChangeProgress = [];
        if (props.screenMode === ScreenMode.EDIT) {
          props.changeScreenMode(false);
        }
      });
    }
  };

  /**
   * handle event before update progress of records
   */

  useEffect(() => {
    if (props.updateProductTradings) {
      if (props.screenMode === ScreenMode.EDIT) {
        props.changeScreenMode(false);
      }
      setShowMessage(0);
      if (tableListRef && tableListRef.current) tableListRef.current.removeSelectedRecord();
      setListViewChecked([]);
      // fix bug not call get product trading
      setForceRerender({});
      // setTimeout(() => searchProductTradingList(offset, limit, menuType), 0);
    }
  }, [props.updateProductTradings]);

  const onShowSwitchDisplayCard = () => {
    if (!changeDisplayOn) {
      executeDirtyCheck(() => {
        setChangeDisplay(true);
        setSaveEditValues([]);
        saveProductChangeProgress = [];
        if (props.screenMode === ScreenMode.EDIT) {
          props.changeScreenMode(false);
        }
      });
    }
  };

  const onOpenMoveToGroupModal = () => {
    if (!openMoveToGroupModal) {
      setOpenMoveToGroupModal(true);
    }
  };

  const onCloseMoveToGroupModal = () => {
    setOpenMoveToGroupModal(false);
  };

  const onOpenAddToGroupModal = () => {
    setOpenAddToGroupModal(true);
  };

  const onCloseAddToGroupModal = () => {
    setOpenAddToGroupModal(false);
  };

  const getGroupName = name => {
    setGroupName(name);
  };

  const reloadScreen = (isReloadNow?) => {
    let conditions = null;
    if (isReloadNow) {
      conditions = null;
    } else if (conditionSearch && conditionSearch.length > 0) {
      conditions = conditionSearch;
    } else {
      conditions = textSearch;
    }
    props.resetList();
    props.handleSearchProductTrading(
      offset,
      limit,
      isFirstLoad,
      targetType,
      selectedTargetId,
      null,
      conditions,
      filterConditions,
      orderBy
    );
    props.getFieldInfoPersonals(
      SALES_LIST_ID,
      FIELD_BELONG.PRODUCT_TRADING,
      1,
      FieldInfoType.Personal,
      targetType,
      selectedTargetId
    );
    tableListRef.current && tableListRef.current.removeSelectedRecord();
  };

  /**
   * handle action open popup search details
   */
  const onOpenPopupSearch = () => {
    if (!openPopupSearch) {
      executeDirtyCheck(() => {
        setTextSearch('');
        if (props.screenMode === ScreenMode.EDIT) {
          props.changeScreenMode(false);
        }
        setOpenPopupSearch(true);
        setTextSearch("");
      });
    }
  };

  /**
   * handle action filter order
   * @param filter
   * @param order
   */
  const onActionFilterOrder = (filter: [], order: []) => {
    setOffset(0);
    setFilterConditions(filter);
    setOrderBy(order);
    if (filter.length <= 0) setFilterMode(FILTER_MODE.OFF);
    else {
      setFilterMode(
        filter.filter(x => x['fieldValue']).length > 0 ? FILTER_MODE.ON : FILTER_MODE.OFF
      );
    }
    if (props.screenMode === ScreenMode.EDIT) {
      props.changeScreenMode(false);
    }

    setSaveEditValues([]);
    saveProductChangeProgress = [];
    let conditionRecord = conditionSearch ? _.cloneDeep(conditionSearch) : [];
    if (menuType === MENU_TYPE.MY_PRODUCT_TRADING) {
      const employeeCondition = conditionRecord.find(x => x.fieldName === 'employee_id');
      if (
        employeeCondition &&
        employeeCondition.fieldValue &&
        !employeeCondition.fieldValue.include(0)
      ) {
        employeeCondition.fieldValue.push(0);
        conditionRecord = conditionRecord
          .filter(x => x.fieldName !== 'employee_id')
          .push(employeeCondition);
      } else {
        conditionRecord = conditionRecord.push(orderDefault);
      }
    }

    setFilterConditions(filter);
    setOrderBy(order);
    setConditionSearch(conditionRecord);
    if (searchMode !== SEARCH_MODE.TEXT_DEFAULT) {
      setTextSearch(null);
    }
    setForceRerender({})
  };

  /** Function Dynamic List */
  /**
   * handle update field value
   * @param itemData
   * @param type
   * @param itemEditValue
   * @param idx
   */
  const onUpdateFieldValue = (itemData, type, itemEditValue, idx) => {
    if (type.toString() === DEFINE_FIELD_TYPE.RELATION) {
      return;
    }
    const itemEditValueCopy = _.cloneDeep(itemEditValue);
    const index = saveEditValues.findIndex(
      e =>
        e.itemId.toString() === itemData.itemId.toString() &&
        e.fieldId.toString() === itemData.fieldId.toString()
    );
    // const fieldInfo = props.fieldInfos.fieldInfoPersonals.filter(field => field.fieldId.toString() === itemData.fieldId.toString());
    // if (fieldInfo && fieldInfo.length > 0 && fieldInfo[0].fieldName === 'employee_icon') {
    //   if (itemEditValueCopy && Array.isArray(itemEditValueCopy)) {
    //     itemEditValueCopy.forEach(e => {
    //       if (!_.isNil(e)) {
    //         delete e['fileUrl'];
    //         delete e['file_url'];
    //       }
    //     });
    //   }
    //   itemEditValueCopy = JSON.stringify(itemEditValue);
    // }

    if (idx) {
      if (index < 0) {
        saveEditValues.push({
          itemId: itemData.itemId,
          fieldId: itemData.fieldId,
          itemValue: [itemEditValueCopy]
        });
      } else {
        saveEditValues.forEach(item => {
          if (item.fieldId === itemData.fieldId && item.itemId === itemData.itemId) {
            if (item.itemValue === '') {
              item.itemValue = [itemEditValueCopy];
            } else {
              item.itemValue[idx - 1] = itemEditValueCopy;
            }
          }
        });
      }
    } else {
      if (index < 0) {
        saveEditValues.push({
          itemId: itemData.itemId,
          fieldId: itemData.fieldId,
          itemValue: itemEditValueCopy
        });
      } else {
        saveEditValues[index] = {
          itemId: itemData.itemId,
          fieldId: itemData.fieldId,
          itemValue: itemEditValueCopy
        };
      }
    }
  };

  // const showMessageFunc = (message, type) => {
  //   setMessageDownloadFileError(message);
  //   setTimeout(() => {
  //     setMessageDownloadFileError(null);
  //   }, 5000);
  // };

  /**
   * handle action select field to display
   * @param srcField
   * @param isSelected
   */
  const onSelectSwitchDisplayField = (srcField, isSelected) => {
    tableListRef.current.handleChooseField(srcField, isSelected);
  };

  /**
   * handle drag field to display
   * @param fieldSrc
   * @param fieldTargetId
   */
  const onDragField = (fieldSrc, fieldTargetId) => {
    tableListRef.current.handleDragField(fieldSrc, fieldTargetId);
  };

  /**
* handle close popup Help
*/
  const dismissDialogHelp = () => {
    setOnOpenPopupHelp(false);
  }

  /**
     * handle action open popup help
     */
  const handleOpenPopupHelp = () => {
    setOnOpenPopupHelp(!onOpenPopupHelp);
  }

  /**
   * Filter employees by local menu
   * @param filter
   * @param selectedTargetTypeProp
   * @param listViewConditions
   */
  const updateFiltersLocalMenu = (filter, selectedTargetTypeProp, listViewConditions) => {
    setRecordCheckList([]);
    tableListRef.current && tableListRef.current.removeSelectedRecord();
    props.startExecuting(REQUEST(ACTION_TYPES.PRODUCT_TRADING_LIST_PRODUCTS_GET));
    const department = filter.find(obj => obj.key === 'department_id');
    // tableListRef.current.resetState();
    if (department) {
      setDepartmentIdSelected(department.value);
    }
    // fix bug #15837
    let arrOrderby = orderDefault;
    if (listViewConditions.orderBy) {
      arrOrderby = listViewConditions.orderBy;
    }
    let defaultFilterConditions = [];
    if (listViewConditions.filterConditions) {
      defaultFilterConditions = listViewConditions.filterConditions;
      defaultFilterConditions.forEach(e => {
        if (!isNullOrUndefined(e.fieldType)) {
          e.fieldType = parseInt(e.fieldType, 10);
        }
        delete e.searchValue;
      });
    }


    isFilterProductTrading.current = true;
    setTargetType(selectedTargetTypeProp);
    setSelectTargetId(filter[0].value);
    setFilterConditions(defaultFilterConditions);
    setOrderBy(arrOrderby);

    if (tableListRef.current && (arrOrderby.length > 0 || defaultFilterConditions.length > 0)) {
      tableListRef.current.setFilterListView(arrOrderby, defaultFilterConditions, props.fields);
    } else {
      tableListRef.current && tableListRef.current.resetState();
    }
  };

  /**
   * handle close popup settings
   */
  const dismissDialog = () => {
    setOnOpenPopupSetting(false);
  };

  /**
   * handle reload when click action My Product Trading or All Product Trading
   * @param type
   */
  const reloadScreenLocalMenu = type => {
    setTextSearch('');
    setConditionSearch([]);
    setFilterConditions([]);
    setOrderBy(orderDefault);
    setOffset(0);
    setLimit(RECORD_PER_PAGE_OPTIONS[1]);
    setFilterMode(FILTER_MODE.OFF);
    setSearchMode(SEARCH_MODE.NONE);
    // const conditionRecord = [];
    let selectedTargetTypes = menuType;
    let targetId = selectedTargetId;
    if (type === MENU_TYPE.MY_PRODUCT_TRADING) {
      // conditionRecord.push(orderDefaultNested);
      targetId = 0;
      selectedTargetTypes = 1;
    }
    if (type === MENU_TYPE.ALL_PRODUCT_TRADING) {
      targetId = 0;
      selectedTargetTypes = 0;
      // fix bug #15837
    }

    setMenuType(selectedTargetTypes);
    setSelectTargetId(targetId);
    // view === 1 &&
    //   props.handleSearchProductTrading(
    //     0,
    //     RECORD_PER_PAGE_OPTIONS[1],
    //     isFirstLoad,
    //     selectedTargetTypes,
    //     targetId,
    //     null,
    //     conditionRecord,
    //     filterConditions,
    //     orderDefault
    //   );
  };

  /**
   * handle action reload when cancel search details
   * @param type
   */
  const reloadScreenControlTop = type => {
    setTextSearch('');
    setConditionSearch([]);
    setSearchMode(SEARCH_MODE.NONE);
    const conditionRecord = [];
    if (type === MENU_TYPE.MY_PRODUCT_TRADING) {
      conditionRecord.push({ key: 'product_trading_id', value: 'ASC', fieldType: '5' });
    }
    if (filterMode === FILTER_MODE.OFF) {
      view === 1 &&
        props.handleSearchProductTrading(
          offset,
          limit,
          isFirstLoad,
          menuType,
          selectedTargetId,
          null,
          conditionRecord
        );
    } else {
      view === 1 &&
        props.handleSearchProductTrading(
          offset,
          limit,
          isFirstLoad,
          menuType,
          selectedTargetId,
          null,
          conditionRecord,
          filterConditions,
          orderBy
        );
    }
  };

  /**
   * Update menu type when clicking on sidebar records
   * @param iconType
   * @param isAutoGroup
   * @param isOwner
   */
  const updateListMenuType = (iconType: number, isAutoGroup, isOwner) => {
    const tmp = {
      isAllSales: false,
      isMyGroup: false,
      isSharedGroup: false,
      isAutoGroup: false,
      isOwner: false
    };
    switch (iconType) {
      case MENU_TYPE.MY_GROUP:
        setListMenuType({ ...tmp, isMyGroup: true, isAutoGroup });
        break;
      case MENU_TYPE.SHARED_GROUP:
        setListMenuType({ ...tmp, isSharedGroup: true, isAutoGroup, isOwner });
        break;
      default:
        setListMenuType({ ...tmp, isAllSales: true });
        break;
    }
  };

  /**
   * TODO
   */

  const getfileUploads = () => {
    const fUploads = [];
    const keyFiles = Object.keys(fileUploads);
    keyFiles.forEach(key => {
      const arrFile = fileUploads[key];
      arrFile.forEach(file => {
        fUploads.push(file);
      });
    });
    return fUploads;
  }

  const handleUpdate = () => {
    /**
     * @param saveEditValues: list value edited
     * @param fields: field info
     * @param productTradingList: list Product Trading
     */
    const listChangeId = confirmInputEdit()

    const arrayChangeValue = saveEditValues.filter(item => listChangeId.includes(item.itemId))
    // changeScreenMode
    if(arrayChangeValue.length > 0){
      props.startExecuting(REQUEST(ACTION_TYPES.PRODUCT_TRADING_UPDATE));
      props.handleUpdateProductTrading(
        arrayChangeValue,
        fields,
        productTradingList,
        saveProductChangeProgress,
        getfileUploads()
      );
      setFileUploads({})
    }else{
      props.changeScreenMode(false)
    }
  
  };

  const onCloseGroupModal = isUpdate => {
    setOpenGroupModal(isUpdate || false);
    // props.handleInitLocalMenu();
  };

  const onOpenAddEditMyGroupModal = (myGroupModalModeIn, sidebarCurrentIdIn, isAutoGroupIn) => {
    setOpenAddEditMyGroupModal(true);
    setMyGroupModalMode(myGroupModalModeIn);
    setSidebarCurrentId(sidebarCurrentIdIn);
    setIsAutoGroup(isAutoGroupIn);
    // setIsOwnerGroup(isOwnerGroupIn);
    // setGroupMember(groupMemberIn);
  };
  const onCloseAddEditMyGroupModal = (isUpdate: boolean) => {
    setOpenAddEditMyGroupModal(isUpdate || false);
    // setMyGroupModalMode(null);
  };

  const changeEditMode = (isEdit: boolean) => {
    if (!isEdit) {
      executeDirtyCheck(
        () => {
          setMsgErrorBox('');
          setSaveEditValues([]);
          setShowSwitcher(false);
          props.changeScreenMode(isEdit);
        },
        null,
        DIRTYCHECK_PARTTERN.PARTTERN1
      );
    } else {
      setSaveEditValues([]);
      setShowSwitcher(false);
      props.changeScreenMode(isEdit);
      setIsChanged(false);
      props.resetErrorItems()
    }
  };
  useEffect(() => {
    return () => {
      props.resetSidebar();
    };
  }, [sidebarCurrentId]);

  // ADD-MY-LIST
  // const handleOpenShareList = () => {
  //   setOpenGroupModal(true);
  // };

  const handleCollapse = useCallback(
    action => {
      switch (action) {
        case 'expand': {
          const newTradingList = _.cloneDeep(tradingList);
          newTradingList.forEach(el => el.customers.forEach(t => (t.expand = true)));

          setTradingList(newTradingList);
          setIsCollapse(false);
          return;
        }

        case 'collapse': {
          const newTradingList = _.cloneDeep(tradingList);
          newTradingList.forEach(el => el.customers.forEach(t => (t.expand = false)));

          setTradingList(newTradingList);
          setIsCollapse(true);
          return;
        }

        default:
          return;
      }
    },
    [tradingList, isCollapse]
  );

  const onOpenGroupModal = (grpMode, groupIdIn, isOwnerGroupIn, isAutoGroupIn, groupMemberIn) => {
    if (!openGroupModal) {
      setGroupMode(grpMode);
      setGroupId(groupIdIn);
      setIsAutoShareGroup(isAutoGroupIn);
      setIsOwnerGroup(isOwnerGroupIn);
      setGroupMember(groupMemberIn);
      setOpenGroupModal(true);
    }
  };

  const actionSetSidebarId = sidebarId => {
    resetFilter()
    setSidebarCurrentId(sidebarId);
  };

  const onSetTypeGroup = type => {
    setTypeGroup(type);
  };

  const renderToastMessage = () => {
    if (msgSuccess !== SHOW_MESSAGE_SUCCESS.NONE) {
      let msgInfoSuccess = '';
      // change if else to switch case
      switch (msgSuccess) {
        case SHOW_MESSAGE_SUCCESS.CREATE:
          msgInfoSuccess = `${translate('messages.INF_COM_0003')}`;
          break;
        case SHOW_MESSAGE_SUCCESS.UPDATE:
          msgInfoSuccess = `${translate('messages.INF_COM_0004')}`;
          break;
        case SHOW_MESSAGE_SUCCESS.DELETE:
          msgInfoSuccess = `${translate('messages.INF_COM_0005')}`;
          break;
        // fix bug #21980
        // case SHOW_MESSAGE_SUCCESS.ADD_TO_FAVORITE:
        //   msgInfoSuccess = `${translate('sales.add-to-favorite', {})}`;
        //   break;
        // case SHOW_MESSAGE_SUCCESS.REMOVE_FROM_FAVORITE:    
        //   msgInfoSuccess = `${translate('sales.remove-to-favorite', {})}`;    
        //   break;
        default:
          msgInfoSuccess = `${translate('messages.INF_TRA_0001', { 0: props.numberOfItem })}`;
          break;
      }
      return (
        <div className="message-area message-area-bottom position-absolute">
          <BoxMessage
            messageType={MessageType.Success}
            message={msgInfoSuccess}
            styleClassMessage="block-feedback block-feedback-green text-left"
            className=" "
          />
        </div>
      );
    }
  };

  const dragSalesToGroup = (sourceRow, targetCategory) => {
    const body = {
      listOfProductTradingId: sourceRow.map(item =>
        item.isChecked ? item.productTradingId : item.product_trading_id
      ),
      idOfNewList: targetCategory.listId,
      idOfOldList: sidebarCurrentId || null
    };
    props.handleDragDropProductTrading(body);
  };

  // const onDragRow = async (sourceRow, targetCategory) => {
  //   if (targetCategory.listId) {
  //     const result = await ConfirmDialog({
  //       title: <>{translate('global.title.confirm')}</>,
  //       // message: translate('messages.WAR_BUS_0002', {
  //       //   0: targetCategory.listName,
  //       //   1: sourceRow.length
  //       // }),
  //       message: translate('messages.WAR_COM_0002', {
  //         // 0: targetCategory.listName,
  //         0: sourceRow.length
  //       }),
  //       confirmText: translate('global.dialog-dirtycheck.parttern2.confirm'),
  //       confirmClass: 'button-blue',
  //       cancelText: translate('global.dialog-dirtycheck.parttern2.cancel'),
  //       cancelClass: 'button-cancel'
  //     });
  //     if (result) {
  //       dragSalesToGroup(sourceRow, targetCategory);
  //     }
  //   }
  // };
  const onDragRow =  (sourceRow, targetCategory) => {
    if (targetCategory.listId) {
        dragSalesToGroup(sourceRow, targetCategory);
    }
  };

  // temp
  // let employeeLayout = [];
  // if (props.employeeLayout) {
  //   employeeLayout = props.employeeLayout;
  // }
  const handleClickPosition = e => {
    setHeightPosition(document.body.clientHeight - e.clientY);
  };

  const modalCustomerRef = useRef<any>(null)

  useEffect(() => {
    stateModalCustomer && modalCustomerRef.current?.openModal()
  },[stateModalCustomer])

  const onClickOverFlowMenu = (idAction, param, dataProductTrading) => {
    const tmpArr = [];
    tmpArr.push(dataProductTrading)
    switch (idAction) {
      case OVER_FLOW_MENU_TYPE.PRODUCTS_TRADING.REGIST_ACTIVITIES:
        if (param) {
          dataModalTask['product'] = param;
        }
        setCustomerIdDetail(param.customerId);
        setOpenCreateActivity(true);
        break;
      case OVER_FLOW_MENU_TYPE.PRODUCTS_TRADING.ACTIVE_HISTORY:

        
        // TODO: wating Schedule
        setStateModalCustomer({
          id: param.customerId,
          type: 'customer',
          noChild: true,
          displayActivitiesTab: true,
          listProductTradingId: [param.productTradingId]
        })

        break;
      case OVER_FLOW_MENU_TYPE.PRODUCTS_TRADING.REGIST_TASK:
        if (param) {
          dataModalTask['product'] = param;
          dataModalTask['productTradingIds'] = tmpArr;
        }
        // setArrDataProductTrading([dataProductTrading])
        setOpenCreateTask(true);
        break;
      case OVER_FLOW_MENU_TYPE.PRODUCTS_TRADING.REGIST_SCHEDULES:
        // TODO: waiting Timlines
        if (param) {
          dataModalTask['product'] = param;
        }
        setCustomerIdDetail(param.customerId);
        setOpenCreateSchedule(true);
        break;
      default:
        break;
    }
  };

  const onOpenPopupProductDetail = productId => {
    if (!openPopUpEmployee && props.screenMode === ScreenMode.DISPLAY) {
      executeDirtyCheck(() => {
        setOpenPopUpProduct(true);
        setProductIdDetail(productId);
        setMsgErrorBox('');
      });
    }
  };

  const onClosePopupProductDetail = () => {
    setProductIdDetail(null);
    setOpenPopUpProduct(false);
  };

  /**
   *
   * @param itemData
   * @param type
   * @param itemEditValue
   * @param rowProductId
   */
  const onUpdateStateField = (itemData, type, itemEditValue, rowProductId) => {
    if (rowProductId && type === DEFINE_FIELD_TYPE.SINGER_SELECTBOX) {
      const indexOfField = _.findIndex(
        saveProductChangeProgress,
        e => e.itemId === rowProductId && e.fieldId === itemData.fieldId
      );
      const newDataObj = {
        ...itemData,
        itemValue: itemEditValue
      };
      if (indexOfField > -1) {
        saveProductChangeProgress[indexOfField] = newDataObj;
      } else {
        saveProductChangeProgress.push(newDataObj);
      }
    }
  };

  const onOpenPopupEmployeeDetail = employeeId => {
    if (!openPopUpEmployee && props.screenMode === ScreenMode.DISPLAY) {
      executeDirtyCheck(() => {
        document.body.classList.add('wrap-employee');
        setOpenPopUpEmployee(true);
        setEmployeeIdDetail(employeeId);
        setMsgErrorBox('');
      });
    }
  };

  const onClosePopupEmployeeDetail = () => {
    document.body.classList.remove('wrap-employee');
    setEmployeeIdDetail(null);
    setOpenPopUpEmployee(false);
  };

  const onOpenPopupCustomerDetail = customerId => {
    // Open popup customer detail
    if (!openPopUpCustomer && props.screenMode === ScreenMode.DISPLAY) {
      executeDirtyCheck(() => {
        setOpenPopUpCustomer(!openPopUpCustomer);
        setCustomerIdDetail(customerId);

        // fix popup-customer-detail remove wrap-product-management class lead to crash layout
        setTimeout(() => {
          document.body.classList.add('wrap-product-management');
        }, 0);
      });
    }
  };

  const onClosePopupCustomerDetail = () => {
    setCustomerIdDetail(null);
    setOpenPopUpCustomer(false);
  };

  const updateFiles = fUploads => {
    const newUploads = {
      ...fileUploads,
      ...fUploads
    };
    setFileUploads(_.cloneDeep(newUploads));
  };

  // const getParam = () => {
  //   if (props.errorItems && props.errorItems[0] && props.errorItems[0].errorCode === 'ERR_EMP_0037') {
  //     const employeeName = sourceEmployee[props.errorItems[0].rowId]['employee_name'];
  //     const employeeSurname = sourceEmployee[props.errorItems[0].rowId]['employee_surname'];
  //     return { 0: `${employeeSurname}${employeeName ? ' ' + employeeName : ''}` };
  //   }
  //   return null;
  // }

  // msg error code
  useEffect(() => {
    setMsgErrorBox('');
    if (props.errorItems && props.errorItems[0]) {
      setMsgErrorBox(getErrorMessage(props.errorItems[0].errorCode));
    }
    if (messageDownloadFileError !== null) {
      setMsgErrorBox(messageDownloadFileError)
    }
  }, [messageDownloadFileError, props.errorItems])

  const parseValidateError = () => {
    let msgError = [];
    let firstErrorRowIndex = null;
    let firstErrorItem = null;
    let firstErrorProductTrading = null;
    if (!errorItems || !Array.isArray(errorItems) || errorItems.length <= 0 || productTradingList.length <= 0) {
      msgError = [];
    } else {
      let count = 0;

      const lstError = _.cloneDeep(props.errorItems);
      for (let i = 0; i < errorItems.length; i++) {
        if (!errorItems[i]) {
          continue;
        }
        if (errorItems && errorItems[i] && !errorItems[i].rowId) {
          return;
        }
        const rowIndex = productTradingList.findIndex(
          e => e['product_trading_id'].toString() === errorItems[i].rowId.toString()
        );
        const field = fields.find(
          e =>
            StringUtils.snakeCaseToCamelCase(e.fieldName) ===
            StringUtils.snakeCaseToCamelCase(errorItems[i].item)
        );
        const fieldOrder = field ? field.fieldOrder : null;
        lstError[i]['rowIndex'] = rowIndex;
        lstError[i]['order'] = fieldOrder;
        const fieldIndex = fields.findIndex(
          e =>
            StringUtils.snakeCaseToCamelCase(e.fieldName) === errorItems[i].item ||
            e.fieldName === errorItems[i].item
        );
        if (rowIndex < 0 || fieldIndex < 0) {
          continue;
        }
        count++;
      }
      let msg = translate('messages.ERR_COM_0052', { count });
      if (
        props.errorItems &&
        props.errorItems[0] &&
        props.errorItems[0].errorCode &&
        props.errorItems[0].errorCode === 'ERR_COM_0050'
      ) {
        msg = translate('messages.ERR_COM_0050');
      }
      if (count > 0 && msg) {
        msgError.push({ msg });
      }
      if (lstError.length > 0) {
        const lstErrorSortByOrder = lstError.sort(function (a, b) {
          return a.rowIndex - b.rowIndex || a.order - b.order;
        });
        if (lstErrorSortByOrder[0]) {
          firstErrorRowIndex = lstErrorSortByOrder[0].rowIndex;
          firstErrorItem = lstErrorSortByOrder[0].item;
          firstErrorProductTrading = lstErrorSortByOrder[0].rowId;
        }
      }
    }
    return { msgError, firstErrorRowIndex, firstErrorItem, firstErrorProductTrading };
  };

  /**
   * Find first item focus in edit mode of list
   * If the item is textbox (field type = 9) or text area (field type = 10) or number (field type = 5) or email (field type = 15) or cellphone (field type = 13)
   * then focus it.
   */
  const findFirstFocusEdit = () => {
    const firstProductTradingShowInList = null;
    let firstItemFocus = null;
    if (!_.isEmpty(fields)) {
      const lstFieldAfterSortByFieldOrder = [...fields].sort(
        StringUtils.compareValues('fieldOrder')
      );
      for (let i = 0; i < lstFieldAfterSortByFieldOrder.length; i++) {
        if (
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.TEXT ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.TEXTAREA ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.NUMERIC ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.EMAIL ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() ===
          DEFINE_FIELD_TYPE.PHONE_NUMBER ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() ===
          DEFINE_FIELD_TYPE.MULTI_SELECTBOX
        ) {
          firstItemFocus = lstFieldAfterSortByFieldOrder[i].fieldName;
          break;
        }
      }
    }
    return { firstProductTradingShowInList, firstItemFocus }
  }

  const validateMsg = parseValidateError()?.msgError;
  // Find first error item
  const firstErrorItemError = parseValidateError()?.firstErrorItem;
  // Find first employee error
  const firstProductTradingError = parseValidateError()?.firstErrorProductTrading;
  // Find first employee ficus when edit list
  const firstProductTradingShowInListFocus = findFirstFocusEdit().firstProductTradingShowInList;
  // Find first item ficus when edit list
  const firstItemInEditListFocus = findFirstFocusEdit().firstItemFocus;

  // msg error code
  useEffect(() => {
    setMsgErrorBox('');
    if (messageDownloadFileError !== null) {
      setMsgErrorBox(messageDownloadFileError);
    }
  }, [messageDownloadFileError]);

  const showMessageUpload = (message, type) => {
    setMessageDownloadFileError(message);
    setTimeout(() => {
      setMessageDownloadFileError(null);
    }, 2000);
  };

  const getCurrentValueOfFieldExtend = (fieldName, rowData) => {
    try {
      const productTradingData = rowData["product_trading_data"]
      const item = productTradingData.find(_item => _item.key === fieldName)
      const value = item.value
      return value
    } catch (error) {
     return '' 
    }
  }

  const getCustomFieldValue = (rowData, fieldColumn, mode) => {
    
   
    if (mode !== ScreenMode.DISPLAY ) {
      return undefined
    }
    const { fieldInfo } = productTradings;

    // Type value price / amount
    if (
     (   fieldColumn.fieldName === SALES_SPECIAL_LIST_FIELD.price ||
        fieldColumn.fieldName === SALES_SPECIAL_LIST_FIELD.amount || 
        fieldColumn.fieldName === SALES_SPECIAL_LIST_FIELD.quantity ||
        fieldColumn.fieldName === SALES_SPECIAL_LIST_FIELD.productTradingId
        ) && rowData[fieldColumn.fieldName]
    ) {
      const strValue = autoFormatNumber(
        rowData[fieldColumn.fieldName].toString(),
        fieldColumn.decimalPlace
      );

      const colorCode = getColorTextDynamicList(fieldInfo, fieldColumn, rowData, fieldColumn.fieldName);
      const currencyUnit = fieldColumn.currencyUnit ? fieldColumn.currencyUnit : '';
      return (
        <span style={{ color: colorCode ? COLOR_PRODUCT_TRADING[colorCode] : '' }}>
          {fieldColumn.typeUnit === 1 ? `${strValue}${currencyUnit}` : `${currencyUnit}${strValue}`}
        </span>
      );
    }

    // Type value time
    if (
       ( fieldColumn.fieldName === SALES_SPECIAL_LIST_FIELD.endPlanDate ||
        fieldColumn.fieldName === SALES_SPECIAL_LIST_FIELD.orderPlanDate) && rowData[fieldColumn.fieldName]
    ) {
      const value = rowData[fieldColumn.fieldName].toString();
  
      const colorCode = getColorTextDynamicList(fieldInfo, fieldColumn, rowData, fieldColumn.fieldName, 'time');
      const valueFormated = formatDate(value);
      return (
        <span style={{ color: colorCode ? COLOR_PRODUCT_TRADING[colorCode] : '' }}>
          {valueFormated}
        </span>
      )
    }
  
    if(SALES_SPECIAL_LIST_FIELD.productTradingProgressId === fieldColumn.fieldName && rowData[fieldColumn.fieldName] ){
      const valueId = rowData[fieldColumn.fieldName].toString();
      if(!valueId){
        return <></>
      }

      const colorCode = getColorTextDynamicList2({fieldInfo,fieldColumn: {...fieldColumn, fieldItems: productTradings.progresses}, rowData, fieldName:fieldColumn.fieldName, currentValue: valueId, typeValue:""});
      const value = getItemInFieldColumn(valueId, fieldColumn)
      return (
      <span style={{ color: colorCode ? COLOR_PRODUCT_TRADING[colorCode] : '' }}>
        {value}
      </span>
      )
    }
    if([SALES_SPECIAL_LIST_FIELD.createdDate, SALES_SPECIAL_LIST_FIELD.updatedDate].includes(fieldColumn.fieldName) && rowData[fieldColumn.fieldName] ){
      const value = rowData[fieldColumn.fieldName].toString();
      const valueFormated = fieldColumn.fieldType.toString() === DEFINE_FIELD_TYPE.DATE ? formatDate(value) : utcToTz(value, DATE_TIME_FORMAT.User)
      if(!valueFormated){
        return <></>
      }

      // const colorCode = getColorTextDynamicList2({fieldInfo,fieldColumn: {...fieldColumn, fieldItems: productTradings.progresses}, rowData, fieldName:fieldColumn.fieldName, currentValue: valueId, typeValue:""});
      // const value = getItemInFieldColumn(valueId, fieldColumn)
      return (
      <span >
        {valueFormated}
      </span>
      )
    }
   
    if( [DEFINE_FIELD_TYPE.SINGER_SELECTBOX, DEFINE_FIELD_TYPE.RADIOBOX].includes(fieldColumn.fieldType.toString()) && ![SALES_SPECIAL_LIST_FIELD.productTradingProgressId].includes(fieldColumn.fieldName) ){
      const valueId = getCurrentValueOfFieldExtend(fieldColumn.fieldName, rowData)
      if(!valueId){
        return <></>
      }
      const colorCode = getColorTextDynamicList2({fieldInfo,fieldColumn, rowData, fieldName:fieldColumn.fieldName, currentValue: valueId, typeValue:""});
      const value = getItemInFieldColumn(valueId, fieldColumn)
      return (
      <span style={{ color: colorCode ? COLOR_PRODUCT_TRADING[colorCode] : '' }}>
        {value}
      </span>
      )
    }

  
    if ([DEFINE_FIELD_TYPE.DATE, DEFINE_FIELD_TYPE.DATE_TIME].includes(fieldColumn.fieldType.toString())) {
      const value = getCurrentValueOfFieldExtend(fieldColumn.fieldName, rowData)
      const colorCode = getColorTextDynamicList2({fieldInfo,fieldColumn, rowData, fieldName:fieldColumn.fieldName, currentValue: value, typeValue:"time"});
      const valueFormated = fieldColumn.fieldType.toString() === DEFINE_FIELD_TYPE.DATE ? formatDate(value) : utcToTz(value, DATE_TIME_FORMAT.User)

      return (
      <span style={{ color: colorCode ? COLOR_PRODUCT_TRADING[colorCode] : '' }}>
        {valueFormated}
      </span>
      )
    }

    if (fieldColumn.fieldType.toString() === DEFINE_FIELD_TYPE.NUMERIC) {
      const strValue = autoFormatNumber(
        getCurrentValueOfFieldExtend(fieldColumn.fieldName, rowData),
        fieldColumn.decimalPlace
      );

      const colorCode = getColorTextDynamicList2({fieldInfo,fieldColumn, rowData, fieldName:fieldColumn.fieldName, currentValue: strValue, typeValue:""});
      const currencyUnit =  fieldColumn.currencyUnit || '';
      return (
        <span style={{ color: colorCode ? COLOR_PRODUCT_TRADING[colorCode] : '' }}>
          {fieldColumn.typeUnit === 1 ? `${strValue}${currencyUnit}` : `${currencyUnit}${strValue}`}
        </span>
      );
     }

    return undefined;
  };

  const customContentField = (fieldColumn: any, rowData, mode, nameKey) => {
    const idxProduct = _.includes([SALES_SPECIAL_LIST_FIELD.productId], fieldColumn.fieldName);
    if (idxProduct) {
      const param: any = {
        productId: rowData.product_id,
        productName: rowData.product_name,
        unitPrice: rowData.price,
        amount: rowData.amount,
        isDisplay: true,
        productImageName: null,
        productImagePath: null,
        productCategoryId: null,
        productCategoryName: null,
        memo: rowData.memo,
        productCategories: null,
        productTradingId: rowData.product_trading_id,
        customerId: rowData.customer_id
      };
      const activeClass = activeIcon || openOverFlow === rowData.product_id ? 'active' : '';
      return (
        rowData.product_name && (
          <div
            className="overflow-menu margin-left-4 pr-0"
            onMouseOut={() => {
              setActiveIcon(false);
            }}
          >
            <a
              className="d-inline-block text-ellipsis max-calc66"
              onClick={() => onOpenPopupProductDetail(rowData.product_id)}
            >
              <Popover x={-20} y={25}>
                {rowData.product_name}
              </Popover>
            </a>
            <a
              title=""
              className="icon-small-primary icon-link-small overflow-menu-item"
              href={`${window.location.origin}/${props.tenant}/product-detail/${rowData.product_id}`}
              target="_blank"
              rel="noopener noreferrer"
            ></a>
            <div
              className={`d-inline position-relative overflow-menu-item ${
                heightPosition < 200 ? 'position-top' : ''
                }`}
              onMouseLeave={() => setOpenOverFlow(null)}
            >
              <a
                id={rowData.product_trading_id}
                title=""
                className={`icon-small-primary icon-sort-small ${activeClass}`}
                onMouseOver={() => setActiveIcon(true)}
                onClick={e => {
                  setOpenOverFlow(rowData.product_trading_id);
                  handleClickPosition(e);
                  e.stopPropagation();
                }}
                onMouseOut={e => e.stopPropagation()}
              ></a>
              {openOverFlow === rowData.product_trading_id && (
                <OverFlowMenu
                  setOpenOverFlow={setOpenOverFlow}
                  fieldBelong={FIELD_BELONG.PRODUCT_TRADING}
                  onClickOverFlowMenu={onClickOverFlowMenu} 
                  param={param}
                // dataProductTrading={rowData}
                />
              )}
            </div>
          </div>
        )
      );
    }
    const idxNotEdit = _.includes(
      [
        SALES_SPECIAL_LIST_FIELD.employeeId,
        SALES_SPECIAL_LIST_FIELD.createdUser,
        SALES_SPECIAL_LIST_FIELD.updatedUser,
        // SALES_SPECIAL_LIST_FIELD.customerId
      ],
      fieldColumn.fieldName
    );
    const customerId = _.includes([SALES_SPECIAL_LIST_FIELD.customerId], fieldColumn.fieldName);
    if (idxNotEdit) {
      return renderSpecialItemNotEdit(fieldColumn, rowData, onOpenPopupEmployeeDetail, mode);
    } else if (customerId) {
      return renderSpecialItemNotEdit(fieldColumn, rowData, onOpenPopupCustomerDetail, mode);
    } else if (mode === ScreenMode.DISPLAY) {
      return specialDisplayMultiLine(fieldColumn, rowData, onOpenPopupCustomerDetail);
    } else {
      return (
        <SpecialEditList
          valueData={rowData}
          itemData={fieldColumn}
          extensionsData={getExtensionSales()}
          updateStateField={onUpdateStateField}
          errorInfos={props.errorItems}
          nameKey={nameKey}
          updateFiles={updateFiles}
          mode={mode}
        />
      );
    }
  };

  const onChooseFieldProgress = (data) => {
    // props.startExecuting(REQUEST(ACTION_TYPES.PRODUCT_TRADING_UPDATE_FIELD_INFO_PROGRESS));
    props.handleUpdateFieldInfoProgressPersonal(data).then(() => handleAfterActionCard());
  }


  const onReceiveMessage = ev => {
    
    if (ev.data.type === FSActionTypeScreen.CreatUpdateSuccess && ev.data.forceCloseWindow) {
      props.handleInitLocalMenu()
      return
    }

    
    if (
      (StringUtils.tryGetAttribute(ev, 'data.type') === FSActionTypeScreen.CloseWindow &&
      StringUtils.tryGetAttribute(ev, 'data.screen') === 'employeeDetail') ||
      StringUtils.tryGetAttribute(ev, 'data.type') === WindowActionMessage.ReloadList
      ) {
        forceRender()
      // tableListRef && tableListRef.current && tableListRef.current.reloadFieldInfo();
      // reloadScreen()
      // return
    }
  };

  useEventListener('message', onReceiveMessage);

  const getSelectedRecord = recordCheck => {
    setRecordCheckList(recordCheck);
  };

  // fix bug #16194
  const handleCloseEdit = isEdit => {
    if (isEdit) {
      executeDirtyCheck(() => {
        setView(1);
        setSaveEditValues([]);
        saveProductChangeProgress = [];
        setShowSwitcher(false);
        props.changeScreenMode(isEdit);
      });
    } else {
      setView(1);
      setSaveEditValues([]);
      saveProductChangeProgress = [];
      setShowSwitcher(false);
      props.changeScreenMode(isEdit);
    }
  };

  const renderErrorBox = () => {
    if (validateMsg && validateMsg?.length > 0) {
      return <BoxMessage messageType={MessageType.Error} messages={_.map(validateMsg, 'msg')} />;
    }
    return <BoxMessage messageType={MessageType.Error} message={msgErrorBox} />;
  };

  const [changeActiveCard, setChangeActiveCard] = useState({});

  const resetValueWhenSwitchDisplay = () => {
    // console.log('unmount');
    // setConDisplaySearchDetail(false);
    // setSearchMode(SEARCH_MODE.NONE);
    // reloadScreenControlTop(menuType);
    setListViewChecked([]);
  };

  const onScrollToEndEachColumn = (progress) => {
    const { productTradingProgressId, customers } = progress;
    let offsetOfCard = offsetEachProgress.find(ele => ele.productTradingProgressId.toString() === productTradingProgressId.toString())?.offset || 0;
    offsetOfCard = offsetOfCard + 1;
 

    if (customers && customers.length === NUMBER_OF_RECORD * offsetOfCard ) {
      const { isFirstLoadFilter, tempTextSearch, tempSelectedTargetId, tempConditionSearch, tempFilterCondition, tempOrderBy } = getMatrix();
      
      
      // Increase offset
      const tempOffsetEachProgress = _.cloneDeep(offsetEachProgress);
      const index = tempOffsetEachProgress.findIndex(el => el.productTradingProgressId.toString() === productTradingProgressId.toString());
      if (index !== -1) {
        tempOffsetEachProgress[index].offset = offsetOfCard;
      }

      props.startExecuting(REQUEST(ACTION_TYPES.PRODUCT_TRADING_LIST_BY_PROGRESS_GET_SCROLL));
      props.handleScrollEachProgress(
        productTradingProgressId,
        offsetOfCard,
        limit,
        isFirstLoadFilter,
        menuType,
        tempSelectedTargetId,
        tempTextSearch,
        tempConditionSearch,
        tempFilterCondition,
        tempOrderBy,
        settingDate
      );

      setOffsetEachProgress(tempOffsetEachProgress);
    }
  }

  // const checkMoveToList = () => {
  // if(menuType === MENU_TYPE.SHARED_GROUP){
  //   setIsOnlyShowShare(true);
  // }
  // }


  const defaultSalesMyListData = {
    listMode: MY_GROUP_MODES.MODE_CREATE_GROUP,
    listId: null,
    isAutoList: false,
    listMembers: []
  }
  const [openSalesMyList, setOpenSalesMyList] = useState(false);
  const [salesMyListData, setSalesMyListData] = useState(defaultSalesMyListData);

  /**
   * State for customer shared list.
   */
  const defaultSalesSharedListData = {
    listMode: SHARE_GROUP_MODES.MODE_CREATE_GROUP,
    listId: null,
    isOwnerList: false,
    isAutoList: false,
    listMembers: null
  }
  const [openSalesSharedList, setOpenSalesSharedList] = useState(false);
  const [salesSharedListData, setSalesSharedListData] = useState(defaultSalesSharedListData);

  const handleOpenSalesMyListModal = (listMode, listId, isAutoList, listMembers) => {
    if (!openSalesMyList) {
      setMsgErrorBox('');
      setSalesMyListData({
        listMode,
        listId,
        isAutoList,
        listMembers
      });
      setOpenSalesMyList(true);
    }
  };


  // const getListIdChecked = () => {
  //   return props.recordCheckList.map(x => x = x.productTradingId)
  // }

  const onOpenSalesCreateMyGroupModal = () => {
    // Duy
    // if (!openSalesCreateSharedGroupModal) {
    //   setOpenSalesCreateMyGroup(true);
    // }
    // const listId = props.recordCheckList.map(x => x = x.productTradingId)
    handleOpenSalesMyListModal(GROUP_MODE_SCREEN.CREATE_LOCAL, null, false, props.recordCheckList)
  };

  /**
   * Handle close customer create or edit my list
   */
  const handleCloseSalesMyListModal = (isSubmitSucess: boolean) => {
    setOpenSalesMyList(false);
    setSalesMyListData(defaultSalesMyListData);
    if (isSubmitSucess) {
      props.handleInitLocalMenu();
    }
  }

  const handleOpenSalesSharedListModal = (
    listMode,
    listId,
    isOwnerList,
    isAutoList,
    listMembers
  ) => {
    if (!openSalesSharedList) {
      setMsgErrorBox('');
      setSalesSharedListData({
        listMode,
        listId,
        isOwnerList,
        isAutoList,
        listMembers
      })
      setOpenSalesSharedList(true);
    }
  }

  
  const onOpenSalesCreateSharedGroup = () => {
    // if (!openSalesCreateMyGroup) {
      // Duy
    // setOpenSalesCreateSharedGroup(true);
    // const listId = props.recordCheckList.map(x => x = x.productTradingId)
    handleOpenSalesSharedListModal(GROUP_MODE_SCREEN.CREATE_LOCAL, null, false, false , props.recordCheckList )
    // }
  };


  /**
   * Handle close customer create or edit shared list
   */
  const handleCloseSalesSharedListModal = (isSubmitSucess: boolean) => {
    setOpenSalesSharedList(false);
    setSalesSharedListData(defaultSalesSharedListData);
    if (isSubmitSucess) {
      props.handleInitLocalMenu();
    }
  }

  const renderSalesControlTop = () => {
    return (
      <SalesControlTop
        recordCheckListView={listViewChecked}
        toggleOpenPopupSetting={handleOpenPopupSetting}
        toggleSwitchDisplay={onShowSwitchDisplay}
        toggleOpenPopupSearch={onOpenPopupSearch}
        handleDeleteProductTradings={handleDelete}
        handleChooseProgress={handleChooseProgress}
        listProductsTrading={productTradingList}
        listprogresses={progresses}
        listProgressesForCard={props.progresses}
        modeDisplay={props.screenMode}
        isCollapse={isCollapse}
        // fix bug #16194
        toggleSwitchEditMode={changeEditMode}
        sidebarCurrentId={sidebarCurrentId}
        // save simple edit
        toggleUpdateInEditMode={handleUpdate}
        view={view}
        setView={setView}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        conDisplaySearchDetail={conDisplaySearchDetail}
        setConDisplaySearchDetail={setConDisplaySearchDetail}
        reloadScreenControlTop={reloadScreenControlTop}
        reloadScreen={reloadScreen}
        enterSearchText={enterSearchText}
        textSearch={textSearch}
        menuType={menuType}
        openSaleCreateShareGroupModal={onOpenSalesCreateSharedGroup}
        openSaleCreateMyGroupModal={onOpenSalesCreateMyGroupModal}
        listMenuType={listMenuType}
        handleCollapse={handleCollapse}
        selectedTargetType={targetType}
        selectedTargetId={selectedTargetId}
        onShowSwitchDisplayCard={onShowSwitchDisplayCard}
        changeDisplayOn={changeDisplayOn}
        // ADD-MY-LIST
        toggleOpenAddEditMyGroupModal={onOpenAddEditMyGroupModal}
        toggleOpenMoveToGroupModal={onOpenMoveToGroupModal}
        toggleOpenAddToGroupModal={onOpenAddToGroupModal}
        fieldInfoHint={
          view === 1
            ? productTradings?.fieldInfo || []
            : (props.productTradingsByProgress && props.productTradingsByProgress.fieldInfo) || []
        }
        // UPDATE-LIST_PROGRESS
        setSettingDate={(selectedDate) => setSettingDate(dateFnsFormat(selectedDate,APP_DATE_FORMAT_ES))}
        // settingDate={settingDate}
        recordCheckLists={recordCheckList}
        // update autogroup in top control
        handleUpdateAutoGroup={props.handleUpdateAutoSalesGroup}
        handleAddToFavorite={props.handleAddToFavoriteSalesGroup}
        handleRemoveFromFavorite={props.handleRemoveFromFavoriteSalesGroup}
        openGroupModal={handleOpenSalesSharedListModal}
        toggleOpenAddEditModal={handleOpenSalesMyListModal}
        handleDeleteGroup={props.handleDeleteSalesGroup}
        handleReloadScreenLocalMenu={reloadScreenLocalMenu}
        setMenuType={setMenuType}
        setSidebarCurrentId={value => {
          actionSetSidebarId(value);
          setSelectTargetId(0);
        }}
        // fix bug #17667
        showSwitcher={showSwitcher}
        toggleOpenHelpPopup={handleOpenPopupHelp}
        // rerender after remove from group view 2
        handleAfterActionCard={handleAfterActionCard}
      />
    )
  }


  

  const getFieldBelongSearchDetail = () => {
    const listFieldBelong = [];
    listFieldBelong.push({ fieldBelong: FIELD_BELONG.CUSTOMER, isMain: false})
    listFieldBelong.push({ fieldBelong: FIELD_BELONG.PRODUCT_TRADING, isMain: true })
    listFieldBelong.push({ fieldBelong: FIELD_BELONG.ACTIVITY, isMain: false, ignoreSearch: true })
    return listFieldBelong;
  }

  const isFieldSearchAvailable = (fieldBelong, field) => {
    if(fieldBelong === FIELD_BELONG.ACTIVITY && field.fieldName !== 'contact_date'){
      return false
    }
    if (FIELD_BELONG.CUSTOMER === fieldBelong && _.toString(field.fieldType) === DEFINE_FIELD_TYPE.RELATION) {
      return false;
    }
    return true
  }


  // render Modal

  const renderModal = () => {
    return (
      <>
        {openCreateTask && (
          <ModalCreateEditTask
            toggleCloseModalTask={() => setOpenCreateTask(false)}
            iconFunction="ic-task-brown.svg"
            {...dataModalTask}
          // productTradingIds={arrDataProductTrading}
          />
        )}
        {openCreateActivity && (
          <ModalCreateEditActivity
            onCloseModalActivity={() => setOpenCreateActivity(false)}
            activityViewMode={ACTIVITY_VIEW_MODES.EDITABLE}
            activityActionType={ACTIVITY_ACTION_TYPES.CREATE}
            customerId={customerIdDetail}
          />
        )}
        {openCreateSchedule && (
          <CreateEditSchedule
            onClosePopup={() => { setOpenCreateSchedule(false) }}
            scheduleDataParam={customerIdDetail}
          />
        )}
        {openPopUpEmployee && (
          <PopupEmployeeDetail
            id={employeeDetailCtrlId[0]}
            showModal={true}
            backdrop={true}
            openFromModal={true}
            employeeId={employeeIdDetail}
            listEmployeeId={[employeeIdDetail]}
            toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
            resetSuccessMessage={() => { }}
          />
        )}
        {openPopUpCustomer && (
          <PopupCustomerDetail
            id={customerDetailCtrlId[0]}
            showModal={true}
            customerId={customerIdDetail}
            listCustomerId={[customerIdDetail]}
            toggleClosePopupCustomerDetail={onClosePopupCustomerDetail}
            resetSuccessMessage={() => { }}
          />
        )}
        {openPopUpProduct && (
          <ProductDetail
            showModal={true}
            backdrop={true}
            openFromModal={true}
            productId={productIdDetail}
            // listProductId={[productIdDetail]}
            toggleClosePopupProductDetail={onClosePopupProductDetail}
            resetSuccessMessage={() => { }}
          />
        )}

        {onOpenPopupSetting && <PopupMenuSet dismissDialog={dismissDialog} />}
        {openPopupSearch && (
          // <PopupFieldsSearch
          //   iconFunction="ic-sidebar-sales.svg"
          //   fieldBelong={FIELD_BELONG.PRODUCT_TRADING}
          //   conditionSearch={conditionSearch}
          //   onCloseFieldsSearch={onClosePopupSearch}
          //   onActionSearch={handleSearchPopup}
          //   conDisplaySearchDetail={conDisplaySearchDetail}
          //   setConDisplaySearchDetail={setConDisplaySearchDetail}
          //   fieldNameExtension="product_trading_data"
          // />
          <PopupFieldsSearchMulti
          iconFunction="ic-sidebar-sales.svg"
          listFieldBelong={getFieldBelongSearchDetail()}
          conditionSearch={conditionSearch}
          onCloseFieldsSearch={onClosePopupSearch}
          onActionSearch={handleSearchPopup}
          // setConDisplaySearchDetail={setConDisplaySearchDetail}
          isFieldAvailable={isFieldSearchAvailable}
        />
        )}

        {/* {openGroupModal && (
          <ModalSharedGroup
            iconFunction="ic-sidebar-sales.svg"
            onCloseModal={onCloseGroupModal}
            groupMode={groupMode}
            groupId={groupId}
            isOwnerGroup={isOwnerGroup}
            isAutoGroup={isAutoShareGroup}
            groupMembers={groupMember}
          />
        )} */}

        {/* ADD-MY-LIST */}
        {/* {openAddEditMyGroupModal && (
          <ModalSalesMyGroupEdit
            onCloseModal={onCloseAddEditMyGroupModal}
            groupMode={myGroupModalMode}
            groupId={sidebarCurrentId}
            isOwnerGroup={isOwnerGroup}
            isAutoGroup={isAutoroup}
            groupMembers={[]}
            iconFunction="ic-sidebar-sales.svg"
          // isOwnerGroup={isOwnerGroup}
          // groupMembers={groupMember}
          />
        )} */}

          {openSalesMyList && salesMyListData &&
           // mở popup common hóa tạo myList
            <SalesMySharedListModal
              iconFunction={ICON_FUNCION_SALES}
              listMode={salesMyListData.listMode}
              listId={salesMyListData.listId}
              isAutoList={salesMyListData.isAutoList}
              listMembers={salesMyListData.listMembers}
              salesLayout={''}
              handleCloseSalesMySharedListModal={handleCloseSalesMyListModal}
              listType={GROUP_TYPE.MY}
              labelTranslate={'sales-my-list-modal'}
            />
          }
          {openSalesSharedList && salesSharedListData &&
          // mở popup common hóa tạo shareList
            <SalesMySharedListModal
              iconFunction={ICON_FUNCION_SALES}
              listMode={salesSharedListData.listMode}
              listId={salesSharedListData.listId}
              isAutoList={salesSharedListData.isAutoList}
              listMembers={salesSharedListData.listMembers}
              salesLayout={''}
              handleCloseSalesMySharedListModal={handleCloseSalesSharedListModal}
              listType={GROUP_TYPE.SHARED}
              labelTranslate={'sales-shared-list-modal'}
            />
          }
{/* 
        {openSalesCreateSharedGroup && (
          // mở popup tạo shareList kiểu cũ
          <SalesModalCreateSharedGroup
            iconFunction="ic-sidebar-sales.svg"
            onCloseModal={onCloseSaleCreateSharedGroup}
            groupMode={paramModal.grpMode}
            groupId={paramModal.groupIdInd}
            isOwnerGroup={paramModal.isOwnerGroupIn}
            isAutoGroup={paramModal.isAutoGroupIn}
            groupMembers={paramModal.groupMemberIn}
            recordCheckList={recordCheckList}
            listViewChecked={listViewChecked}
          />
        )}
        {openSalesCreateMyGroup && (
          <SaleCreateMyGroupModal
            closeCreateMyGroupModal={onCloseSaleCreateMyGroup}
            listViewChecked={listViewChecked}
          />
        )} */}
        {openMoveToGroupModal && (
          <SaleMoveToGroupModal
            toggleCloseMoveToGroupModal={onCloseMoveToGroupModal}
            saleCheckList={view === 2 ? listViewChecked : props.recordCheckList.filter(sale => sale.isChecked === true)}
            sideBarCurrentId={sidebarCurrentId}
            reloadScreen={reloadScreen}
            handleAfterActionCard={handleAfterActionCard}
            view={view}
          // onlyShowShare={menuType === MENU_TYPE.SHARED_GROUP}
          // allList={props.localMenu.}
          />
        )}
        <OpenModalDetail {...stateModalCustomer} ref={modalCustomerRef}/>

        {openAddToGroupModal && (
          <SaleAddToGroupModal
            toggleCloseAddToGroupModal={onCloseAddToGroupModal}
            sideBarCurrentId={sidebarCurrentId}
            reloadScreen={reloadScreen}
            // custom with list card
            listCardChecked={listViewChecked}
            view={view}
          />
        )}

      </>
    )
  }

  // Render
  return (
    <div className="wrap-container">
      <div className="control-esr page-employee resize-content">
        {renderSalesControlTop()}

        <div className={`wrap-control-esr style-3 ${view === 2 ? 'wrap-control-esr-4column style-3' : ''}`}>
          <div className="esr-content wrap-sale-list">
            <SalesControlSidebar
              ref={salesControlSidebar}
              updateFiltersSearch={updateFiltersLocalMenu}
              handleReloadScreenLocalMenu={reloadScreenLocalMenu}
              menuType={menuType}
              resetFilter={resetFilter}
              addToGroup={onOpenAddToGroupModal}
              moveToGroup={onOpenMoveToGroupModal}
              setMenuType={setMenuType}
              openGroupModal={handleOpenSalesSharedListModal}
              sidebarCurrentId={actionSetSidebarId}
              setTypeGroup={onSetTypeGroup}
              // only check dirty check when edit mode
              isChange={props.screenMode === ScreenMode.EDIT && isChanged}
              toggleOpenAddEditMyGroupModal={handleOpenSalesMyListModal}
              toggleOpenModalCreateGroup={handleOpenSalesSharedListModal}
              toggleOpenModalChangeGroupType={handleOpenSalesSharedListModal}
              openAddEditMyGroupModal
              targetId={selectedTargetId}
              getGroupName={getGroupName}
              changeSelectedSidebar={changeSelectedSidebar}
              toggleShowFeaturesIcon={updateListMenuType}
              handleGetInitializeListInfo={() =>
                props.handleGetInitializeListInfo(FIELD_BELONG.PRODUCT_TRADING)
              }
              reloadScreen={reloadScreen}
              changeActiveCard={changeActiveCard}
            />
            <div
              className={
                showSwitcher
                  ? 'esr-content-body esr-content-body2 overflow-x-hidden'
                  : `esr-content-body ${view === 2 ? '' : 'overflow-x-hidden'}`
              }
            >
              <div className="esr-content-body-main" id={formId}>
                {
                  view === 1 && (
                    <div className="pagination-top">
                      {renderErrorMessage()}
                      <div className="esr-pagination">
                        <ProductTradingDisplayCondition
                          conditions={conditionSearchDisplay}
                          filters={filterConditions}
                          searchMode={searchMode}
                        />
                        {fieldInfos && productTradingList.length > 0 && view === 1 && (
                          <PaginationList
                            offset={offset}
                            limit={limit}
                            totalRecords={productTradings.total}
                            onPageChange={onPageChange}
                          />
                        )}
                      </div>
                    </div>
                  )
                }
                {view === 1 && productTradings && isRender &&  (
                  <>
                    {msgErrorBox && renderErrorBox()}
                    <WarppedDynamicList
                      forceRender={forceRender}
                      ref={tableListRef}
                      id={SALES_LIST_ID}
                      records={productTradingList}
                      mode={props.screenMode}
                      checkboxFirstColumn={true}
                      keyRecordId={'productTradingId'}
                      belong={FIELD_BELONG.PRODUCT_TRADING}
                      fieldInfoType={FieldInfoType.Personal}
                      extensionsData={getExtensionSales()}
                      errorRecords={errorItems}
                      onActionFilterOrder={onActionFilterOrder}
                      onUpdateFieldValue={onUpdateFieldValue}
                      tableClass={'table-list table-drop-down table-product-trading '} // table-list-has-show-wrap
                      onDragRow={onDragRow}
                      customContentField={customContentField}
                      totalRecords={totalCount}
                      onSelectedRecord={getSelectedRecord}
                      targetType={targetType}
                      targetId={selectedTargetId}
                      customHeaderField={(field) => customHeaderField(field, props.screenMode)}
                      getCustomFieldValue={getCustomFieldValue}
                      getCustomFieldInfo={customFieldsInfoData}
                      updateFiles={updateFiles}
                      showMessage={showMessageUpload}
                      fieldNameExtension="product_trading_data"
                      firstFocus={errorItems ?
                        { id: firstProductTradingError, item: firstErrorItemError, nameId: 'product_trading_id' } :
                        { id: firstProductTradingShowInListFocus, item: firstItemInEditListFocus, nameId: 'product_trading_id' }}
                      selectedTargetType={menuType}
                      typeMsgEmpty={props.typeMsgEmpty}
                      fields={fields}
                    />
                  </>
                )}

                {view === 2 && (
                  <SalesListView
                    onDrop={handleUpdateProgress}
                    listViewChecked={listViewChecked}
                    setListViewChecked={setListViewChecked}
                    tradingList={tradingList}
                    setTradingList={setTradingList}
                    productTradings={productTradings}
                    fieldInfoProgresses={props.fieldInfoProgresses || {}}
                    productTradingsByProgress={productTradingsByProgress}
                    changeDisplayOn={changeDisplayOn}
                    onOpenPopupEmployeeDetail={onOpenPopupEmployeeDetail}
                    onOpenPopupProductDetail={onOpenPopupProductDetail}
                    onOpenPopupCustomerDetail={onOpenPopupCustomerDetail}
                    onScrollToEndEachColumn={onScrollToEndEachColumn}
                    onUnmountSalesListCard={resetValueWhenSwitchDisplay}
                    // For switch field panel
                    fieldBelong={FIELD_BELONG.PRODUCT_TRADING}
                    progresses={props.progresses}
                    dataSource={customFields}
                    dataTarget={fields}
                    onCloseSwitchDisplay={() => setChangeDisplay(false)}
                    onChooseField={onChooseFieldProgress}
                    onDragField={onDragField}
                    settingDate={settingDate}
                  />
                )}
              </div>
            </div>

            {showSwitcher && view === 1 && (
              <SwitchFieldPanel
                dataSource={customFields}
                dataTarget={fields}
                onCloseSwitchDisplay={() => setShowSwitcher(false)}
                onChooseField={(id, isSelected) => onSelectSwitchDisplayField(id, isSelected)}
                onDragField={onDragField}
                fieldBelong={FIELD_BELONG.PRODUCT_TRADING}
                isAdmin={isAdmin}
              />
            )}

            {/* For sale-list-view-card */}
            {/* Wait test confirm */}
            {/* {changeDisplayOn && view === 2 && (
              <SwitchFieldPanelCustom
                fieldBelong={FIELD_BELONG.PRODUCT_TRADING}
                progresses={props.progresses}
                dataSource={customFields}
                dataTarget={fields}
                onCloseSwitchDisplay={() => setChangeDisplay(false)}
                onChooseField={data => props.handleUpdateFieldInfoProgressPersonal(data)}
                onDragField={onDragField}
                fieldInfoProgresses={props.fieldInfoProgresses}
              />
            )} */}
            {/* <SalesControlRight /> */}
            {/* <GlobalControlRight /> */}
          </div>
        </div>
        {renderToastMessage()}
        <GlobalControlRight />
      </div>
      {renderModal()}
      {/* {  <CreateEdit extendFlag={true} extendHandle={handleDataPass} />} */}
      {onOpenPopupHelp && <HelpPopup currentCategoryId={CATEGORIES_ID.sales} dismissDialog={dismissDialogHelp} />}
    </div>
  );
};
const mapStateToProps = ({
  salesList,
  authentication,
  salesControlSidebar,
  dynamicList,
  // salesGroupModal,
  sharedGroupSales,
  applicationProfile,
  employeeList,
  employeeDetailAction,
  popupFieldsSearch,
  productTrade,
  salesMySharedListState
}: IRootState) => ({
  fieldInfos: dynamicList.data.has(SALES_LIST_ID)
    ? dynamicList.data.get(SALES_LIST_ID).fieldInfos
    : {},
  recordCheckList: dynamicList.data.has(SALES_LIST_ID)
    ? dynamicList.data.get(SALES_LIST_ID).recordCheckList
    : [],
  customFieldInfos: salesList.customFieldInfos,
  authorities: authentication.account.authorities,
  productTradings: salesList.productTradings,
  deleteProductTradings: salesList.deleteProductTradings,
  updateProductTradings: salesList.updateProductTradings,
  errorCodeList: salesList.errorCodeList,
  screenMode: salesList.screenMode,
  progresses: salesList.progresses,
  fieldInfoProgresses: salesList.fieldInfoProgresses,
  productTradingsByProgress: salesList.productTradingsByProgress,
  // myGroupSuccess: salesGroupModal.msgSuccess,
  // sharedGroupSalesSuccess: sharedGroupSales.msgSuccess,
  mySharedSalesSuccess: salesMySharedListState.msgSuccess,
  // salesControlSliber
  fields: salesList.fields,
  msgSuccessControlSidebar: salesControlSidebar.msgSuccess,
  sidebarErrorMessage: salesControlSidebar.errorMessage,
  timeSideAddToList: salesControlSidebar.timeAddToList,
  deleteGroupMsg: salesControlSidebar.deleteGroupMsg,
  deleteDepartmentMsg: salesControlSidebar.deleteDepartmentMsg,
  localMenuMsg: salesControlSidebar.localMenuMsg,
  deletedGroupId: salesControlSidebar.deletedGroupId,
  deletedDepartmentId: salesControlSidebar.deletedDepartmentId,
  updatedAutoGroupId: salesControlSidebar.updatedAutoGroupId,
  timeAddToList: salesList.timeAddToList,
  saleListMessage: salesList.msgSuccess,
  numberOfItem: salesList.numberOfItem,
  tenant: applicationProfile.tenant, // temp
  employeeLayout: employeeList.employeeLayout,
  // updatedGroupId: sharedGroupSales.updatedGroupId,
  employeeSetting: employeeDetailAction.idUpdate,
  typeMsgEmpty: salesList.typeMsgEmpty,
  errorItems: salesList.errorItems,
  fieldInfoSearch: popupFieldsSearch.fieldInfos,
  customFieldInfoSearch: popupFieldsSearch.customField,
  progressesProductTrade: productTrade.progresses,
  isEmployeeUpdated: salesList.isEmployeeUpdated,
  isCustomerUpdated: salesList.isCustomerUpdated,
});

const mapDispatchToProps = {
  startExecuting,
  handleSearchProductTrading,
  handleSearchProductTradingProgress,
  handleScrollEachProgress,
  handleDeleteProductTradings,
  getCustomFieldsInfo,
  changeScreenMode,
  handleInitProductTradingList,
  handleUpdateProductTradingByProgress,
  getProgresses,
  getFieldInfoProgressPersonal,
  updateFieldInfoProgressPersonal,
  handleUpdateFieldInfoProgressPersonal,
  handleUpdateProductTradingDragDrop,
  resetMessageSuccess,
  // resetSharedMessageSuccess,
  getProductTradingsByProgress,
  handleInitProductTradingListByProgress,
  handleUpdateProductTrading,
  handleGetInitializeListInfo,
  handleDragDropProductTrading,
  // ADD-MY-LIST
  resetSidebar,
  reset,
  handleFilterProductTradingsByMenu,
  getFieldInfoPersonals,
  resetList,
  handleInitLocalMenu,
  // upadte auto list in top control
  handleUpdateAutoSalesGroup,
  handleAddToFavoriteSalesGroup,
  handleRemoveFromFavoriteSalesGroup,
  handleDeleteSalesGroup,
  resetMessageSuccessSidebar,
  resetErrorItems
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(SalesList, (prevProps, currentProps) => {
  return _.isEqual(prevProps, currentProps)
}));
