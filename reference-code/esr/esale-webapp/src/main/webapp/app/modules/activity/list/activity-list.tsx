import React, { useEffect, useState, useRef } from 'react'
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import ActivityControlTop from '../control/activity-control-top';
import ActivityControlSidebar from '../control/activity-control-sidebar';
import ActivityListContent from './activity-list-content';
import ActivityModalForm from '../create-edit/activity-modal-form';
import {
  handleInitActivities,
  handleGetActivities,
  toggleConfirmPopup,
  handleGetLazyActivities,
  handleShowModalActivityDetail,
  handleUpdateActivityFromSearch,
  changeScreenMode,
  getActivitiesDraft,
  getLazyActivitiesDraft,
  resetScroll,
  handleShowDetail,
  clearShowDetail,
  toogleModalDetail,
  clearMessage
} from './activity-list-reducer';
import ActivityDetail from '../detail/activity-modal-detail';
import ConfirmPopup from 'app/modules/activity/control/confirm-popup';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { MENU_TYPE, ACTIVITY_ACTION_TYPES, ACTIVITY_VIEW_MODES, FSActionTypeScreen } from '../constants';
import { showModalDetail } from "app/modules/calendar/modal/calendar-modal.reducer";
import useEventListener from 'app/shared/util/use-event-listener';
import { translate } from 'react-jhipster';
import { GetActivitiesForm } from '../models/get-activities-type';
import { ScreenMode, FIELD_BELONG, TIMEOUT_TOAST_MESSAGE } from 'app/config/constants';
import PopupFieldsSearchMulti from 'app/shared/layout/dynamic-form/popup-search/popup-fields-search-multi';
import _ from 'lodash';
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from 'app/modules/tasks/constants';
import ModalCreateEditTask from 'app/modules/tasks/create-edit-task/modal-create-edit-task';
import ShowDetail from '../common/show-detail';
import { CommonUtil, makeConditionSearchDefault, getErrorMessage } from '../common/common-util';
import  HelpPopup  from 'app/modules/help/help';
import {CATEGORIES_ID} from 'app/modules/help/constant';
import GlobalControlRight from 'app/modules/global/global-tool';
import { RouteComponentProps } from 'react-router';
import { TYPE_SEARCH } from './../constants';
import { WindowActionMessage } from 'app/shared/layout/menu/constants';
import StringUtils from 'app/shared/util/string-utils';
import ActivityDisplayCondition from '../control/activity-display-condition';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';

export interface IListActivity extends StateProps, DispatchProps, RouteComponentProps<{}> {
  screenMode: any;
}

const LIMIT = 30;


/**
 * component for show list activities
 * @param props
 */
const ActivityList = (props: IListActivity) => {
  const [msgError, setMsgError] = useState(null);
  const [msgSuccess, setMsgSuccess] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const localNavigationRef = useRef(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [resetLocalNavigation, setResetLocalNavigation] = useState(0);
  const [sortField, setSortField] = useState("updated_date");
  const [openPopupSearch, setOpenPopupSearch] = useState(false);
  const [conditionSearch, setConditionSearch] = useState(null);
  const [conDisplaySearchDetail, setConDisplaySearchDetail] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [dataModalTask,] = useState({ showModal: false, taskActionType: TASK_ACTION_TYPES.CREATE, taskId: null, parentTaskId: null, taskViewMode: TASK_VIEW_MODES.EDITABLE });
  const [isDraft, setDraft] = useState(false);
  const [showModalActivity, setShowModalActivity] = useState(false);
  const [activityActionType, setActivityActionType] = useState(ACTIVITY_ACTION_TYPES.CREATE)
  const [activityViewMode, setActivityViewMode] = useState(ACTIVITY_VIEW_MODES.EDITABLE);
  const [activityId, setActivityId] = useState(null);
  const [activityDraftId, setActivityDraftId] = useState(null);
  const [showActivityDetail, setShowActivityDetail] = useState(false);
  const [onOpenPopupHelp, setOnOpenPopupHelp] = useState(false);
  const [activeFilter, setActiveFilter] = useState<number>(1);
  const [activeSort, setActiveSort] = useState<number>(1);
  const {fieldInfoSearch, customFieldInfoSearch } = props;
  const controlTopRef = useRef(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [searchType, setSearchType] = useState(null);

  useEffect(() => {
    props.handleInitActivities(makeConditionSearchDefault());
    return () => props.clearShowDetail();
  }, []);

  let customFieldSearch = [];
  if (customFieldInfoSearch?.customFieldsInfo) {
    customFieldSearch = customFieldInfoSearch.customFieldsInfo;
    // customFieldSearch.forEach(z => {
    //   if (z.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productCategoryId) {
    //     z.fieldItems = [];
    //     productCategoryListAll.forEach(cate => {
    //       z.fieldItems.push({ itemId: cate.productCategoryId, itemLabel: cate.productCategoryName, isAvailable: 1 });
    //     });
    //     z.fieldType = 1;
    //   }
    // })
  }



  useEffect(() => {
    setMsgError(props.errorMessage);
    setMsgSuccess(props.successMessage);
    setToastMessage({ message: props.successMessage, type: MessageType.Success });
  }, [props.errorMessage, props.successMessage]);


  useEffect(()=>{
    if(props.listActivities){
      setMsgSuccess(null);
      setMsgError(null);
    }
  }, [props.listActivities])
  /**
   * handleScroll
   * @param e
   */
  const handleScroll = (e) => {
    const element = e.target;
    if (element.className.includes("esr-content-body-main style-3 mt-2")) {
      if (props.canScrollActivityList) {
        if (props.listActivities && (element.scrollTop + element.offsetHeight) >= element.scrollHeight) {
          const _offset = props.listActivities?.length || 0;
          if (isDraft) {
            const _param = {
              filterConditions: props.activityFormSearch?.filterConditions || [],
              orderBy: props.activityFormSearch?.orderBy || [],
              limit: LIMIT,
              offset: _offset
            }
            props.handleUpdateActivityFromSearch(_param);
            props.getLazyActivitiesDraft(_param);
          } else {
            const _param = { ...props.activityFormSearch, limit: LIMIT, offset: _offset };
            props.handleUpdateActivityFromSearch(_param);
            props.handleGetLazyActivities(_param);
          }
        }
      }
    }
  }


  const renderToastMessage = () => {
    if (toastMessage === null) {
      return <></>;
    }
    return (
      <BoxMessage
        messageType={toastMessage.type}
        message={getErrorMessage(toastMessage.message)}
        className="message-area-bottom position-absolute"
      />
    )
  }

  const actionOnCanDownload = () => {
    setMsgError(translate('messages.ERR_COM_0013'));
    setMsgSuccess(null);
  }

  const displayMessage = () => {
    if ((!msgError || msgError.length <= 0) || (msgSuccess && msgSuccess.length >= 0)) {
      return <></>;
    }
    const myDiv = document.getElementById('activity-body');
    myDiv.scrollTop = 0;
    return (
      <div className="row">
        <div className="col-10 offset-1 mb-3">
          <BoxMessage
            className="max-width-720 m-auto"
            messageType={msgError && msgError.length > 0 ? MessageType.Error : MessageType.Success}
            message={msgError && msgError.length > 0 ? msgError : msgSuccess}
          />
        </div>
      </div>
    )
  }


  const onClickDetailPopup = (objectId, type) => {
    if (objectId) {
      props.handleShowDetail(objectId, type, `ActivityList`);
    }
  }

  const handleClickOutside = (e) => {
    if (filterRef.current && !filterRef.current.contains(e.target)) {
      setShowFilter(false);
    }
    if (sortRef.current && !sortRef.current.contains(e.target)) {
      setShowSort(false);
    }
  }

  /**
   * clear filter
   */
  const clearFilter = () => {
    setActiveFilter(1);
    setSearchFilter("");
    setShowFilter(false);
    if (isDraft) {
      const _param = {
        filterConditions: props.activityFormSearch?.filterConditions || [],
        orderBy: props.activityFormSearch?.orderBy || [],
        limit: LIMIT,
        offset: 0
      }
      props.handleUpdateActivityFromSearch(_param);
      props.getLazyActivitiesDraft(_param);
    } else {
      setResetLocalNavigation(resetLocalNavigation + 1);
      props.handleUpdateActivityFromSearch(makeConditionSearchDefault());
      props.handleGetActivities(makeConditionSearchDefault());
      localNavigationRef.current.resetLocalNavigation();
    }
  }

  /**
   * config filter
   */
  const configFilter = () => {
    setSearchType(TYPE_SEARCH.FILTER);
    setActiveFilter(2);
    setShowFilter(false);
    const filterConditions = [];
    if(searchFilter && searchFilter.trim().length > 0){
      filterConditions.push({
        "fieldType": 99,
        "fieldName": "product_name",
        "fieldValue": searchFilter,
        "searchType": 1,
        "searchOption": 1
      });
    }
    if(isDraft) {
      const param: GetActivitiesForm = {
        offset: 0,
        limit: LIMIT,
        filterConditions,
        orderBy: []
      }
      props.handleUpdateActivityFromSearch(param);
      props.getActivitiesDraft(param);
    } else {
      const param: GetActivitiesForm = {
        ...props.activityFormSearch,
        offset: 0,
        limit: LIMIT,
        filterConditions
      }
      setResetLocalNavigation(resetLocalNavigation + 1);
      props.handleUpdateActivityFromSearch(param);
      props.handleGetActivities(param);
    }
  }

  /**
   * on change sort field
   * @param e 
   */
  const changeSortField = (e) => {
    setSortField(e.target.value);
  }

  /**
   * handle sort
   * @param _value 
   */
  const handleSort = (_value) => {
    if (_value === "ASC")
      setActiveSort(1);
    else
      setActiveSort(2);
    setShowSort(false);
    const _orderBy = {
      key: sortField,
      value: _value
    };
    const param: GetActivitiesForm = {
      ...props.activityFormSearch,
      orderBy: [_orderBy]
    }
    props.handleUpdateActivityFromSearch(param);
    if (isDraft) {
      props.getActivitiesDraft(param);
    } else {
      props.handleGetActivities(param);
    }

  }

  useEventListener('click', handleClickOutside);


  const buildSearchCondition = (params) => {
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
        fieldName: params[i].fieldName,
        fieldValue: val,
        searchType: params[i].searchType,
        searchOption: params[i].searchOption
      });
    }
    return searchConditions;
  }

  /**
   * handle search detail
   * @param condition
   */
  const handleSearchPopup = (condition) => {
    props.resetScroll();
    setSearchType(TYPE_SEARCH.DETAIL);
    setOpenPopupSearch(false);
    setConditionSearch(condition);
    setSearchFilter("");
    setConDisplaySearchDetail(true);
    controlTopRef?.current?.setTextSearch && controlTopRef?.current?.setTextSearch("");
    setResetLocalNavigation(resetLocalNavigation + 1);
    if (props.screenMode === ScreenMode.EDIT) {
      props.changeScreenMode(false);
    }
    const param: GetActivitiesForm = {
      offset: 0,
      limit: LIMIT,
      searchConditions: buildSearchCondition(condition)
    }
    props.handleUpdateActivityFromSearch(param);
    props.handleGetActivities(param);
  }


  const onClosePopupSearch = (saveCondition) => {
    setOpenPopupSearch(false);
    if (saveCondition && saveCondition.length > 0) {
      setConditionSearch(saveCondition);
    }
  }

  const onOpenPopupSearch = () => {
    if (!openPopupSearch) {
      setOpenPopupSearch(true);
      setTextSearch("");
    }
  }

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
   * handle search local
   * @param text
   */
  const enterSearchText = (text) => {
    setSearchType(TYPE_SEARCH.LOCAL);
    setTextSearch(text);
    setResetLocalNavigation(resetLocalNavigation + 1);
    setSearchFilter("");
    setConditionSearch(null);
    if (props.screenMode === ScreenMode.EDIT) {
      props.changeScreenMode(false);
    }
    const param: GetActivitiesForm = {
      offset: 0,
      limit: LIMIT,
      searchLocal: text
    }
    props.handleUpdateActivityFromSearch(param);
    props.handleGetActivities(param);
  }

  const clearSearchOnChangeLocalNavigation = () => {
    controlTopRef?.current?.setTextSearch && controlTopRef?.current?.setTextSearch("");
    setConditionSearch(null);
    setSearchFilter("");
    setConDisplaySearchDetail(false);
    setActiveSort(1);
  }

  /**
   * get activites when change menu on local navigation
   * @param card
   */
  const onChangeLocalNavigation = (card) => {
      let type = null;
      let _param = null;
      switch (card.type) {
        case MENU_TYPE.ALL_ACTIVITY:
          setDraft(false);
          type = 0;
          break;
        case MENU_TYPE.MY_ACTIVITY:
          setDraft(false);
          type = 1;
          break;
        case MENU_TYPE.DRAFT_ACTIVITY:
          setDraft(true);
          _param = {
            filterConditions: [],
            orderBy: [],
            limit: LIMIT,
            offset: 0
          }
          props.handleUpdateActivityFromSearch(_param);
          props.getActivitiesDraft(_param);
          clearSearchOnChangeLocalNavigation();
          break;
        default:
          setDraft(false);
          clearSearchOnChangeLocalNavigation();
          break;
      }
      if (type != null && card.isSearch) {
        setSearchType(TYPE_SEARCH.NAVIGATION);
        const param = {
          ...makeConditionSearchDefault(),
          selectedTargetType: type,
          selectedTargetId: 0,
          isUpdateListView: true
        }
        props.handleUpdateActivityFromSearch(param);
        props.handleGetActivities(param);
        clearSearchOnChangeLocalNavigation();
      } else if(card.isSearch){
        clearSearchOnChangeLocalNavigation();
      }
      // clear search condition
      // if(searchType !== ScreenActionSearch.SearchLocal && searchType !== ScreenActionSearch.SearchDetail) {
        
      // }
  }

  useEffect(() => {
    if (props.deleteActivityIds) {
      if(isDraft) {
        const _param = {
          filterConditions: [],
          orderBy: [],
          limit: LIMIT,
          offset: 0
        }
        props.handleUpdateActivityFromSearch(_param);
        props.getActivitiesDraft(_param);
      } else {
        const _param = {
          ...props.activityFormSearch,
          limit: LIMIT,
          offset: 0
        }
        props.handleGetActivities(_param);
      }
    }
  }, [props.deleteActivityIds])
  

  useEffect(() => {
    // open details activity from other screen
    const { state } = props.location;
    if (state && state.openDetail && state.recordId) {
      props.handleShowModalActivityDetail(true);
      setActivityId(state.recordId);
      const stateCopy = { ...state };
      delete stateCopy.openDetail;
      delete stateCopy.recordId;
      props.history.replace({ state: stateCopy });
    }
  }, [props.location]);

  /**
   * onClickCreateEditActivity
   * @param activityId 
   * @param actionType 
   * @param viewMode 
   */
  const onClickCreateEditActivity = (_activityId, _activityDraftId, actionType, viewMode) => {
    if (!showModalActivity) {
      setActivityViewMode(viewMode);
      setActivityActionType(actionType);
      setActivityId(_activityId);
      setActivityDraftId(_activityDraftId);
      setShowModalActivity(true);
    }
  }

  /**
   * onSaveSussecc
   * @param id 
   */
  const onSaveSussecc = (isDraftData, id) => {
    setShowModalActivity(false);

    setTimeout(() => {
      props.clearMessage();
    }, TIMEOUT_TOAST_MESSAGE)

    let _param = {};
    if (isDraft) {
      _param = {
        filterConditions: [],
        orderBy: [],
        limit: LIMIT,
        offset: 0
      }
      props.getActivitiesDraft(_param);
    } else {
      _param = {
        ...props.activityFormSearch,
        limit: LIMIT,
        offset: 0
      }
      props.handleGetActivities(_param);
    }

    props.handleUpdateActivityFromSearch(_param);

    if (!isDraftData) {
      setActivityId(id);
      setShowActivityDetail(true);
      setResetLocalNavigation(resetLocalNavigation + 1);
      props.toogleModalDetail(true);
    }

  }

  /**
   * onClickDetailActivity
   * @param id 
   * @param idx 
   */
  const onClickDetailActivity = (id) => {
    setActivityId(id);
    setShowActivityDetail(true);
    props.toogleModalDetail(true);
  }

  useEffect(() => {
    props.toogleModalDetail(showActivityDetail);
  }, [showActivityDetail])

  const getFieldBelongSearchDetail = () => {
    const listFieldBelong = [];
    listFieldBelong.push({ fieldBelong: FIELD_BELONG.CUSTOMER, isMain: false })
    listFieldBelong.push({ fieldBelong: FIELD_BELONG.PRODUCT_TRADING, isMain: false })
    listFieldBelong.push({ fieldBelong: FIELD_BELONG.ACTIVITY, isMain: true })
    return listFieldBelong;
  }

  const isFieldSearchAvailable = (fieldBelong: number, field: any) => {
    if (FIELD_BELONG.CUSTOMER === fieldBelong && _.toString(field.fieldType) === DEFINE_FIELD_TYPE.RELATION) {
      return false;
    }
    if (FIELD_BELONG.PRODUCT_TRADING === fieldBelong && StringUtils.equalPropertyName(field.fieldName, 'customer_id')) {
      return false;
    }
    return true
  }

  const onDeleleSuccess = () => {
    const _param = {
      ...props.activityFormSearch,
      limit: LIMIT,
      offset: 0
    }
    props.handleUpdateActivityFromSearch(_param);
    props.handleGetActivities(_param);
  }

  const onReceiveMessage = (ev) => {
    if (!ev?.data) return
    const { type } = ev.data;
    if (type === FSActionTypeScreen.DeleteSuccess || StringUtils.tryGetAttribute(ev, "data.type") === WindowActionMessage.ReloadList) {
      onDeleleSuccess()
    }
  }

  const resetConditionSearch = () => {
    setConDisplaySearchDetail(false);
    setConditionSearch("");
    // reloadScreen(true);
    const _param = makeConditionSearchDefault();
    props.handleUpdateActivityFromSearch(_param);
    props.handleGetLazyActivities(_param);
  }

  useEventListener('message', onReceiveMessage);

  return <>
    <div className='control-esr page-employee resize-content'>
      <ActivityControlTop
        ref={controlTopRef}
        actionOnCanDownload={actionOnCanDownload}
        isDraft ={isDraft} 
        toggleOpenPopupSearch={onOpenPopupSearch} 
        textSearch={textSearch} 
        enterSearchText={enterSearchText} 
        onClickCreateActivity={onClickCreateEditActivity} 
        toggleOpenHelpPopup={handleOpenPopupHelp}
        modeDisplay={props.screenMode}
        setConDisplaySearchDetail={resetConditionSearch}
        conDisplaySearchDetail={conDisplaySearchDetail}
      />
      <div className="wrap-control-esr style-3">
        <div className="esr-content">
          <ActivityControlSidebar resetLocalNavigation={resetLocalNavigation} ref={localNavigationRef} onChangeLocalNavigation={onChangeLocalNavigation} />

          <div className="esr-content-body" id="activity-body">
            <div className="d-flex justify-content-end position-relative z-index-4 mt-2 pr-3">
              <ActivityDisplayCondition conditions={conditionSearch} ></ActivityDisplayCondition>
              <div className="position-relative" ref={filterRef}>
                <a className={`button-pull-down-small ${showFilter ? "active" : ""} `} onClick={() => { setShowFilter(!showFilter) }}>{translate('activity.control.top.filter')}</a>
                {showFilter &&
                  <div className="box-select-option pupop-top-right pl-3 pr-3 pb-4">
                    <input type="text"
                      className="input-normal bg-white"
                      defaultValue={searchFilter}
                      placeholder={translate('activity.control.top.filter-placeholder')}
                      onChange={(e) => { setSearchFilter(e.target.value) }} />
                    <div className="d-flex justify-content-between mt-3">
                      <button className={`button-primary button-activity-registration w47 ${activeFilter === 1 ? 'active' : ''}`} onClick={clearFilter}>{translate('activity.control.top.clear')}</button>
                      <button className={`button-primary button-activity-registration w47 ${activeFilter === 2 ? 'active' : ''}`} onClick={configFilter}>{translate('activity.control.top.config')}</button>
                    </div>
                  </div>
                }
              </div>
              <div className="position-relative ml-2" ref={sortRef}>
                <a className={`button-pull-down-small ${showSort ? "active" : ""} `} onClick={() => { setShowSort(!showSort) }}>{translate('activity.control.top.sort')}</a>
                {showSort &&
                  <div className="box-select-option pupop-top-right pl-3 pr-3 pb-4">
                    <div className="d-flex justify-content-between">
                      <button className={`button-primary button-activity-registration w47 ${activeSort === 1 ? 'active' : ''}`} onClick={() => { handleSort("ASC") }}>{translate('activity.control.top.asc')}</button>
                      <button className={`button-primary button-activity-registration w47 ${activeSort === 2 ? 'active' : ''}`} onClick={() => { handleSort("DESC") }}>{translate('activity.control.top.desc')}</button>
                    </div>
                    <div className="mt-3">
                      <p className="radio-item normal">
                        <input type="radio" id="radio7" name="radio-group4" defaultChecked onChange={changeSortField} value={"updated_date"} />
                        <label htmlFor="radio7" className="pl-4">{translate('activity.control.top.report-date-time')}</label>
                      </p>
                    </div>
                  </div>
                }
              </div>
            </div>
            <div className="esr-content-body-main style-3 mt-2" onScroll={handleScroll} >
              {displayMessage()}
              <ActivityListContent 
                onClickDetailPopup={onClickDetailPopup} 
                isDraft={isDraft} 
                searchType={searchType}
                onClickEdit={onClickCreateEditActivity}
                onClickDetailActivity={onClickDetailActivity} />
            </div>

          </div>
        </div>
      </div>
      <div className="message-success">{renderToastMessage()}</div>
      <GlobalControlRight />


      {openPopupSearch &&
        <PopupFieldsSearchMulti
          iconFunction="ic-sidebar-activity.svg"
          listFieldBelong={getFieldBelongSearchDetail()}
          conditionSearch={conditionSearch}
          onCloseFieldsSearch={onClosePopupSearch}
          onActionSearch={handleSearchPopup}
          isFieldAvailable={isFieldSearchAvailable}
        />
      }
    </div>
    {openCreateTask &&
      <ModalCreateEditTask
        toggleCloseModalTask={() => setOpenCreateTask(false)}
        iconFunction="ic-task-brown.svg"
        {...dataModalTask}
        canBack={true} />
    }

    {!props.openModalDetail && <ShowDetail idCaller={`ActivityList`} cleanClosePopup={true}/>}

    {showModalActivity &&
      <ActivityModalForm popout={false}
        activityActionType={activityActionType}
        activityViewMode={activityViewMode}
        activityId={activityId}
        activityDraftIdInput={activityDraftId}
        onSaveSussecc={onSaveSussecc}
        onCloseModalActivity={() => setShowModalActivity(false)}
      />
    }

    {props.openModalDetail &&
      <ActivityDetail popout={false}
        activityId={activityId}
        listActivityId={CommonUtil.GET_ARRAY_VALUE_PROPERTIES(props.listActivities, 'activityId')}
        onDeleleSuccess={onDeleleSuccess}
        onCloseActivityDetail={() => setShowActivityDetail(false)} />
    }

    {props.openConfirmPopup && <ConfirmPopup infoObj={props.confirmPopupItem} />}
    {onOpenPopupHelp && <HelpPopup currentCategoryId={CATEGORIES_ID.activity} dismissDialog={dismissDialogHelp} />}

  </>;
}

const mapStateToProps = ({ activityListReducerState, dataModalSchedule, popupFieldsSearch }: IRootState) => ({
  activityInfo: activityListReducerState.activityInfo,
  activityDetail: activityListReducerState.activityDetail,
  listActivities: activityListReducerState.listActivities,
  openModalFormActivity: activityListReducerState.openModalFormActivity,
  openModalDetail: activityListReducerState.openModalDetail,
  openPopupSearch: activityListReducerState.openPopupSearch,
  activityFormSearch: activityListReducerState.activityFormSearch,
  openConfirmPopup: activityListReducerState.openConfirmPopup,
  confirmPopupItem: activityListReducerState.confirmPopupItem,
  errorMessage: activityListReducerState.errorMessage,
  successMessage: activityListReducerState.successMessage,
  errorValidates: activityListReducerState.errorItems,
  modalDetail: dataModalSchedule.modalDetailCalendar,
  detailObjectId: activityListReducerState.detailObjectId,
  detailType: activityListReducerState.detailType,
  screenMode: activityListReducerState.screenMode,
  idss: activityListReducerState.activityId,
  canScrollActivityList: activityListReducerState.canScrollActivityList,
  action: activityListReducerState.action,
  fieldInfoSearch: popupFieldsSearch.fieldInfos,
  customFieldInfoSearch: popupFieldsSearch.customField,
  deleteActivityIds: activityListReducerState.deleteActivityIds
});

const mapDispatchToProps = {
  handleInitActivities,
  handleGetActivities,
  toggleConfirmPopup,
  handleGetLazyActivities,
  showModalDetail,
  handleShowModalActivityDetail,
  handleUpdateActivityFromSearch,
  changeScreenMode,
  getActivitiesDraft,
  getLazyActivitiesDraft,
  resetScroll,
  handleShowDetail,
  clearShowDetail,
  toogleModalDetail,
  clearMessage
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityList);
