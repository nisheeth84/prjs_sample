import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import {
  handleInitTimelines,
  handleUpdateTimelineFormSearch,
  handleToggleTimelineModal,
  handleSetGroupTimelineDetailId,
  handleGetLocalNavigation,
  handleSetActiveNavigation,
  handleResetIsClickListTimeline,
  handleGetTimelineFilter,
  handleToggleListAttachedFile
} from '../timeline-reducer'
import { handleClearTimelineValueFilter } from '../timeline-common-reducer'
import { translate } from 'react-jhipster';
import LocalNavigationList from './local-navigation-list'
import useDebounce from 'app/shared/util/useDebounce'
import LocalNavigationDepartment from './local-navigation-department'
import TimelineGroupAddEdit from '../timeline-group-add-edit/timeline-group-add-edit'
import { TIMELINE_TYPE, URL_TIMELINE } from '../common/constants'
import { FavoriteGroupType, DepartmentTimelineType, CustomerTimelineType, BusinessCardTimelineType } from '../models/get-local-navigation-model';
import { handleUpdateRecentlyDateClicked, changeScreenMode, handleSetValuePost } from '../timeline-common-reducer'
import { Resizable } from 're-resizable'
import * as R from 'ramda';
import _ from 'lodash';
import DialogDirtyCheckTimeline from '../common/dialog-dirty-check-timeline';
import { useHistory } from 'react-router'
import { ScreenMode } from 'app/config/constants'

type ILocalNavigationProp = StateProps & DispatchProps & {
  screenMode: any;
}

const LocalNavigation = (props: ILocalNavigationProp) => {
  const [textValue, setTextValue] = useState('');
  const [textValueSearch, setTextValueSearch] = useState('');
  const debouncedTextValue = useDebounce(textValue, 500);
  const debouncedTextValueSearch = useDebounce(textValueSearch, 500);
  const [listFavoriteGroup, setListFavoriteGroup] = useState([]);
  const [listJoinedGroup, setListJoinedGroup] = useState([]);
  const [listRequestToJoinGroup, setListRequestToJoinGroup] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [countNewMyTimeline, setCountNewMyTimeline] = useState(props.listCountNew?.counter.myTimeline)
  const [countNewFavoriteTimeline, setCountNewFavoriteTimeline] = useState(props.listCountNew?.counter.favoriteTimeline)
  const [amountTotal, setAmountTotal] = useState(0)
  const [amountDepartment, setAmountDepartment] = useState(0)
  const resizeRef = useRef(null);
  const [showShadowTop, setShowShadowTop] = useState<boolean>(false);
  const [showShadowBottom, setShowShadowBottom] = useState<boolean>(false);
  const [width, setWidth] = useState(216);
  const innerListRef = useRef(null);
  const [listCustomerTimeline, setListCustomerTimeline] = useState([]);
  const [listBusinessCardTimeline, setListBusinessCardTimeline] = useState([]);
  const [listDepartmentTimeline, setDistDepartmentTimeline] = useState([]);
  const resizableSize = useMemo(() => ({ width, height: '100%' }), []);
  const toggleSidebar = useCallback(() => setShowSidebar(!showSidebar), [showSidebar, setShowSidebar]);
  const sidebarIconStyle = useMemo(() => `far ${showSidebar ? 'fa-angle-left' : 'fa-angle-right'}  `, [showSidebar]);
  const history = useHistory();
  const  [urlWindow] = useState(window.location.pathname);
  const [mapCountNewDepartment, setMapCountNewDepartment] = useState<Map<number, number>>()
  const [forceUpdate, setForceUpdate] = useState(0);
  const [onMouseIn, setOnMouseIn] = useState(false);

  /**
   * listen change settting
   */
  useEffect(() => {
    if(props.isChangeId) {
      setForceUpdate(forceUpdate+1);
    }
  }, [props.isChangeId])

  const onResizeStop = useCallback(
    (e, direction, ref, d) =>
      R.compose(
        setWidth,
        R.add(width),
        R.prop('width')
      )(d),
    [setWidth, width]
  );
  const sidebarStyle = useMemo(
    () => `button-collapse-sidebar-product ${showShadowTop && showSidebar ? 'shadow-local-navigation-top ' : ''}`,
    [showShadowTop, showSidebar]
  );

  useEffect(() => {
    showSidebar && setShowShadowTop(false);
  }, [showSidebar]);

  useEffect(() => {
    showSidebar && setShowShadowBottom(innerListRef.current.clientHeight < innerListRef.current.scrollHeight);
  }, [showSidebar]);

  const handleActiveDefault = () => {
    if (urlWindow.includes("/channel/detail/")) {
      const list = urlWindow.split("/");
      return TIMELINE_TYPE.GROUP_TIMELINE + "_" + list[list.length - 1]
    } else if (urlWindow.includes("/channel")) {
      return TIMELINE_TYPE.GROUP + "";
    } else if (urlWindow.includes("/timeline/list")) {
      return TIMELINE_TYPE.ALL_TIMELINE + ""
    }
  }

  const countTotalDepartment = (departments: DepartmentTimelineType[]) => {
    let total = 0;
    if (departments?.length <= 0) {
      return total;
    }
    departments.forEach(item => {
      total++;
      if (item.childDepartments?.length > 0) {
        total += countTotalDepartment(item.childDepartments);
      }
    })
    return total;
  }

  useEffect(() => {
    setListJoinedGroup(props.localNavigation?.localNavigation?.groupTimeline?.joinedGroup);
    setListFavoriteGroup(props.localNavigation?.localNavigation?.groupTimeline?.favoriteGroup);
    setListRequestToJoinGroup(props.localNavigation?.localNavigation?.groupTimeline?.requestToJoinGroup);
    setListCustomerTimeline(props.localNavigation?.localNavigation?.customerTimeline)
    setListBusinessCardTimeline(props.localNavigation?.localNavigation?.businessCardTimeline)
    setDistDepartmentTimeline(props.localNavigation?.localNavigation?.departmentTimeline)
    setAmountTotal((props.localNavigation?.localNavigation?.groupTimeline?.joinedGroup?.length || 0) +
      (props.localNavigation?.localNavigation?.groupTimeline?.favoriteGroup?.length || 0) +
      (props.localNavigation?.localNavigation?.groupTimeline?.requestToJoinGroup?.length || 0)
    )
    if (props.localNavigation?.localNavigation?.departmentTimeline?.length > 0) {
      setAmountDepartment(countTotalDepartment(props.localNavigation?.localNavigation?.departmentTimeline));
    }

    !props.activeNavigation && props.handleSetActiveNavigation(handleActiveDefault());
  }, [props.localNavigation])

  /**
   * innit data when go to timeline list
   */
  useEffect(() => {
    if (!props.isClickListTimeline) {
      const url = window.location.pathname;
      if (url.includes("/timeline/list")) {
        props.handleGetTimelineFilter();
        props.handleClearTimelineValueFilter();
        props.handleSetActiveNavigation(TIMELINE_TYPE.ALL_TIMELINE + "");
      }
    }
    return () => props.handleResetIsClickListTimeline()

  }, [])
  /**
  * Return the departments which have departmentName including the searchText
  * @param departments list of departments
  * @param searchText searchText
  */
  const getMatchingDepartments = (departments, searchText) => {
    const getDepartWithChild = (department, valueChild) => {
      return _.set(_.cloneDeep(department), 'childDepartments', valueChild);
    }
    const list = [];
    if (searchText) {
      departments.forEach(e => {
        if (e.childDepartments && e.childDepartments?.length > 0) {
          const matchingChildList = getMatchingDepartments(e.childDepartments, searchText);
          if (matchingChildList && matchingChildList?.length > 0) {
            list.push(getDepartWithChild(e, matchingChildList));
          } else if (e.departmentName?.toLowerCase()?.includes(searchText.toLowerCase())) {
            list.push(getDepartWithChild(e, null));
          }
        } else if (e.departmentName?.toLowerCase()?.includes(searchText.toLowerCase())) {
          list.push(getDepartWithChild(e, null));
        }
      });
    } else {
      return departments;
    }
    return list;
  }

  // handle search group area
  useEffect(() => {
    if (props.localNavigation?.localNavigation?.groupTimeline?.joinedGroup) {
      setListJoinedGroup(props.localNavigation?.localNavigation?.groupTimeline?.joinedGroup.filter(obj => { const text = obj['groupName']?.toLowerCase() as string; return text?.includes(textValue.trim().toLowerCase()) }));
    }
    if (props.localNavigation?.localNavigation?.groupTimeline?.favoriteGroup) {
      setListFavoriteGroup(props.localNavigation?.localNavigation?.groupTimeline?.favoriteGroup.filter(obj => { const text = obj['groupName']?.toLowerCase() as string; return text?.includes(textValue.trim().toLowerCase()) }));
    }
    if (props.localNavigation?.localNavigation?.groupTimeline?.requestToJoinGroup) {
      setListRequestToJoinGroup(props.localNavigation?.localNavigation?.groupTimeline?.requestToJoinGroup.filter(obj => { const text = obj['groupName']?.toLowerCase() as string; return text?.includes(textValue.trim().toLowerCase()) }));
    }
  }, [debouncedTextValue])

  useEffect(() => {
    if (props.localNavigation?.localNavigation?.departmentTimeline) {
      const departmentsField = getMatchingDepartments(props.localNavigation?.localNavigation?.departmentTimeline, textValueSearch);
      setDistDepartmentTimeline(departmentsField);
    }
  }, [debouncedTextValueSearch])

  useEffect(() => {

    if (props.listCountNew?.counter?.groupTimeline?.length > 0 && props.localNavigation?.localNavigation?.groupTimeline?.joinedGroup?.length > 0) {
      const listDataFavorite: FavoriteGroupType[] = props.localNavigation?.localNavigation?.groupTimeline?.joinedGroup
      const listDataCoutNew: FavoriteGroupType[] = props.listCountNew?.counter?.groupTimeline
      for (let i = 0; i < listDataFavorite.length; i++) {
        for (let j = 0; j < listDataCoutNew.length; j++) {
          if (listDataFavorite[i].groupId === listDataCoutNew[j].groupId) {
            listDataFavorite[i] = { ...listDataFavorite[i], newItem: listDataCoutNew[j].newItem }
          }
        }
        setListJoinedGroup(listDataFavorite)
      }
    }

    if (props.listCountNew?.counter?.groupTimeline?.length > 0 && props.localNavigation?.localNavigation?.groupTimeline?.favoriteGroup?.length > 0) {
      const listDataFavorite: FavoriteGroupType[] = props.localNavigation.localNavigation.groupTimeline.favoriteGroup;
      const listDataCoutNew: FavoriteGroupType[] = props.listCountNew.counter.groupTimeline;
      for (let i = 0; i < listDataFavorite.length; i++) {
        for (let j = 0; j < listDataCoutNew.length; j++) {
          if (listDataFavorite[i].groupId === listDataCoutNew[j].groupId) {
            listDataFavorite[i] = { ...listDataFavorite[i], newItem: listDataCoutNew[j].newItem }
          }
        }
        setListFavoriteGroup(listDataFavorite)
      }
    }

    if (props.listCountNew?.counter?.groupTimeline?.length > 0 && props.localNavigation?.localNavigation?.groupTimeline?.requestToJoinGroup?.length > 0) {
      const listDataFavorite: FavoriteGroupType[] = props.localNavigation?.localNavigation?.groupTimeline?.requestToJoinGroup
      const listDataCoutNew: FavoriteGroupType[] = props.listCountNew?.counter?.groupTimeline
      for (let i = 0; i < listDataFavorite.length; i++) {
        for (let j = 0; j < listDataCoutNew.length; j++) {
          if (listDataFavorite[i].groupId === listDataCoutNew[j].groupId) {
            listDataFavorite[i] = { ...listDataFavorite[i], newItem: listDataCoutNew[j].newItem }
          }
        }
        setListRequestToJoinGroup(listDataFavorite)
      }
    }
    // count new customer
    if (props.listCountNew?.counter?.customerTimeline?.length > 0 && props.localNavigation?.localNavigation?.customerTimeline?.length > 0) {
      const listCustomerTimelines: CustomerTimelineType[] = props.localNavigation?.localNavigation?.customerTimeline
      const listDataCoutNew: CustomerTimelineType[] = props.listCountNew?.counter?.customerTimeline
      for (let i = 0; i < listCustomerTimelines?.length; i++) {
        for (let j = 0; j < listDataCoutNew?.length; j++) {
          if (listCustomerTimelines[i].listId === listDataCoutNew[j].listId) {
            listCustomerTimelines[i] = { ...listCustomerTimelines[i], newItem: listDataCoutNew[j].newItem }
          }
        }
        setListCustomerTimeline(listCustomerTimelines)
      }
    }
    // count new businessCardTimeline
    if (props.listCountNew?.counter?.bizcardTimeline?.length > 0 && props.localNavigation?.localNavigation?.businessCardTimeline?.length > 0) {
      const listCustomerTimelines: BusinessCardTimelineType[] = props.localNavigation?.localNavigation?.businessCardTimeline
      const listDataCoutNew: BusinessCardTimelineType[] = props.listCountNew?.counter?.bizcardTimeline
      for (let i = 0; i < listCustomerTimelines?.length; i++) {
        for (let j = 0; j < listDataCoutNew?.length; j++) {
          if (listCustomerTimelines[i].listId === listDataCoutNew[j].listId) {
            listCustomerTimelines[i] = { ...listCustomerTimelines[i], newItem: listDataCoutNew[j].newItem }
          }
        }
        setListBusinessCardTimeline(listCustomerTimelines)
      }
    }

    // set map count new department
    if(props.listCountNew?.counter?.departmentTimeline?.length > 0){
      const mapDepartments = new Map<number, number>();
      props.listCountNew?.counter?.departmentTimeline.forEach(item =>{
        mapDepartments.set(item.departmentId, item.newItem);
      })
      setMapCountNewDepartment(mapDepartments);
    }

    setCountNewMyTimeline(props.listCountNew?.counter.myTimeline);
    setCountNewFavoriteTimeline(props.listCountNew?.counter.favoriteTimeline)
  }, [props.listCountNew])
  // handle active

  const handleActive = (paramActionType, paramListId?) => {
    const back = paramListId ? ("_" + paramListId) : "";
    const linkCode = paramActionType + back;
    props.handleSetActiveNavigation(linkCode);
  }

  const handleClickMenu = (paramActionType, paramListId?) => {

    props.changeScreenMode(false);
    setTimeout(() => {
      switch (paramActionType) {
        case TIMELINE_TYPE.GROUP:
          props.handleSetValuePost("");
          history.push(URL_TIMELINE.TIMELINE_CHANNEL);
          break;
        case TIMELINE_TYPE.GROUP_TIMELINE:
          props.handleSetValuePost("");
          history.push( URL_TIMELINE.TIMELINE_CHANNEL_DETAIL + "/" + paramListId);
          break;
        default:{
          history.push(URL_TIMELINE.TIMELINE_LIST);
          break;
        }
      }
    }, 500);

    handleActive(paramActionType, paramListId);

    //  bien luu tru chuoi updateRecentCLick.
    const param = {
      ...props.timelineFormSearch,
      searchValue: null,
      listType: paramActionType,
      listId: Number(paramListId)
    }
    // props.handleUpdateRecentlyDateClicked(paramActionType, paramListId);
    props.handleToggleListAttachedFile(false);
    if (paramActionType !== TIMELINE_TYPE.GROUP_TIMELINE && paramActionType !== TIMELINE_TYPE.GROUP  ) {
      props.handleUpdateTimelineFormSearch(param, true);
    }
  }

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setTextValue(value);
  }
  const onTextChangeSearchDepartment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setTextValueSearch(value);
  }

  const handleScroll = (e) => {
    const element = e.target;
    if (element.scrollTop > 0) {
      setShowShadowTop(true);
    } else {
      setShowShadowTop(false);
    }
    if (element.scrollHeight > element.clientHeight && element.scrollHeight - element.scrollTop !== element.clientHeight) {
      setShowShadowBottom(true);
    } else {
      setShowShadowBottom(false);
    }
  }
    /**
   * dirty check timeline comment
   */   
  const executeDirtyCheck = async (action: () => void, _link: string) => {
    const onCancel = () => {};
    const url = urlWindow.split("/" + props.tenant)
    if(url[1] === _link){
      action();
    }else {
      if(props.valuePost?.length > 0 && ( props.screenMode === ScreenMode.EDIT ||  url[1] !== _link)  ){
        await DialogDirtyCheckTimeline({
          onLeave: action, onStay: onCancel,
          ok: translate('timeline.dirty-check.button-ok'),
          cancel: translate('timeline.dirty-check.button-cancel'),
          content: translate('timeline.dirty-check.content'),
          title: translate('timeline.dirty-check.title')
        });
      }else{
        action();
      }
    }
  };
  // KienPT end
  return (
    <>
      {showSidebar &&
        <Resizable
          ref={resizeRef}
          size={resizableSize}
          onResizeStop={onResizeStop}
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          }}
          className={`${showShadowTop && 'shadow-local-navigation-top'} ${showShadowBottom && 'shadow-local-navigation-bottom-inset'} esr-content-sidebar list-category esr-content-sidebar-timeline no-background v2 style-3`}
        >
          <div className={`esr-content-sidebar-outer px-3 ${onMouseIn ? 'overflow-auto' : 'overflow-y-hidden'}`}
            ref={innerListRef}
            onScroll={handleScroll}
            onMouseEnter={() => setOnMouseIn(true)}
            onMouseLeave={() => setOnMouseIn(false)}
          >
            <div className="list-group">
              <a role="button" tabIndex={0} className={props.activeNavigation === TIMELINE_TYPE.ALL_TIMELINE.toString() ? "active" : ""}
                onClick={() => {  executeDirtyCheck(()=> { handleClickMenu(TIMELINE_TYPE.ALL_TIMELINE) }, URL_TIMELINE.TIMELINE_LIST )} } >
                <span className="text-ellipsis">{translate('timeline.control.sidebar.all-timeline')}</span>
              </a>
              <ul>
                <li className={props.activeNavigation === TIMELINE_TYPE.MY_TIMELINE.toString() ? "active" : ""} >
                  <a role="button" tabIndex={0} className="text-ellipsis"
                    onClick={() => { executeDirtyCheck(()=> { handleClickMenu(TIMELINE_TYPE.MY_TIMELINE) } , URL_TIMELINE.TIMELINE_LIST) }} >
                    {translate('timeline.control.sidebar.my-timeline')}
                  </a>
                  {countNewMyTimeline > 0 && props.activeNavigation !== TIMELINE_TYPE.MY_TIMELINE.toString() && <span className="number">{countNewMyTimeline}</span>}
                </li>

                <li className={props.activeNavigation === TIMELINE_TYPE.FAV_TIMELINE.toString() ? "active" : ""} >
                  <a role="button" tabIndex={0} className="text-ellipsis"
                    onClick={() => { executeDirtyCheck(() => { handleClickMenu(TIMELINE_TYPE.FAV_TIMELINE) }, URL_TIMELINE.TIMELINE_LIST ) }} >
                    {translate('timeline.control.sidebar.favorite-timeline')}
                  </a>
                  {countNewFavoriteTimeline > 0 && props.activeNavigation !== TIMELINE_TYPE.FAV_TIMELINE.toString() && <span className="number">{countNewFavoriteTimeline}</span>}
                </li>
              </ul>
            </div>
            <div className="divider" />
            {/* group start */}
            <div className="list-group">
              <a className="text-ellipsis" role="button" tabIndex={0} onClick={() => { props.handleToggleTimelineModal({ flag: true }) }}>{translate('timeline.control.sidebar.group-add-timeline')}<span className="plus-blue" />   </a>
            </div>
            <div className="list-group" >
              <a role="button" tabIndex={0} className={props.activeNavigation === TIMELINE_TYPE.GROUP.toString() ? "active" : ""}
                onClick={() => { executeDirtyCheck(() => { handleClickMenu(TIMELINE_TYPE.GROUP) }, URL_TIMELINE.TIMELINE_CHANNEL) }} >
                {translate('timeline.control.sidebar.all-group')}
              </a>
            </div>
            {amountTotal >= 5 &&
              <div className="search-box-no-button-style">
                <button className="icon-search"><i className="far fa-search" /></button>
                <input type="text" placeholder={translate('timeline.control.sidebar.search-group')} onChange={onTextChange} />
              </div>
            }

            {/* favoriteGroup start */}
            {listFavoriteGroup &&
              <LocalNavigationList
                listItems={listFavoriteGroup as []}
                classActiveId={props.activeNavigation}
                listType={TIMELINE_TYPE.GROUP_TIMELINE}
                link="/timeline/channel/detail"
                optionLabel="groupName"
                optionId="groupId"
                haveParam={true}
                title={translate('timeline.control.sidebar.favorite-group')}
                extraValueNumber="newItem"
                onSelectOption={(objectValue: any) => { executeDirtyCheck(() => { handleClickMenu(TIMELINE_TYPE.GROUP_TIMELINE, objectValue.groupId) }, URL_TIMELINE.TIMELINE_CHANNEL_DETAIL) }}
              />
            }
            {/* favoriteGroup end */}

            {/* joinedGroup start */}
            {listJoinedGroup &&
              <LocalNavigationList listItems={listJoinedGroup as []}
                classActiveId={props.activeNavigation}
                listType={TIMELINE_TYPE.GROUP_TIMELINE}
                link="/timeline/channel/detail"
                optionLabel="groupName"
                optionId="groupId"
                haveParam={true}
                title={translate('timeline.control.sidebar.joined-group')}
                extraValueNumber="newItem"
                onSelectOption={(objectValue: any) => { executeDirtyCheck(() => { handleClickMenu(TIMELINE_TYPE.GROUP_TIMELINE, objectValue.groupId) }, URL_TIMELINE.TIMELINE_CHANNEL_DETAIL) }}
              />
            }
            {/* joinedGroup end */}

            {/* requestToJoinGroup start */}
            {listRequestToJoinGroup &&
              <LocalNavigationList
                listItems={listRequestToJoinGroup as []}
                classActiveId={props.activeNavigation}
                listType={TIMELINE_TYPE.GROUP_TIMELINE}
                link="/timeline/channel/detail"
                optionLabel="groupName"
                optionId="groupId"
                haveParam={true}
                title={translate('timeline.control.sidebar.request-to-join-group')}
                extraValueNumber="newItem"
                onSelectOption={(objectValue: any) => { executeDirtyCheck(() => { handleClickMenu(TIMELINE_TYPE.GROUP_TIMELINE, objectValue.groupId) }, URL_TIMELINE.TIMELINE_CHANNEL_DETAIL) }}
              />
            }

            {/* requestToJoinGroup start */}

            <div className="divider" />
            <div className="list-group">
              <a className="text-ellipsis" >{translate('timeline.control.sidebar.department')}</a>
            </div>
            {amountDepartment >= 5 &&
              <div className="search-box-no-button-style">
                <button className="icon-search"><i className="far fa-search" /></button>
                <input type="text" placeholder={translate('timeline.control.sidebar.search-box')} onChange={onTextChangeSearchDepartment} />
              </div>
            }
            {listDepartmentTimeline?.length > 0 &&
              <LocalNavigationDepartment
                listType={TIMELINE_TYPE.DEPARTMENT_TIMELINE}
                classActiveId={props.activeNavigation}
                listDepartment={listDepartmentTimeline as []}
                mapCountnewDepartment = {mapCountNewDepartment}
                optionLabel="listName"
                title={translate('timeline.control.sidebar.department')}
                extraValueNumber="newItem"
                onSelectOption={(objectValue: DepartmentTimelineType) =>  {  executeDirtyCheck(() => { handleClickMenu(TIMELINE_TYPE.DEPARTMENT_TIMELINE, objectValue.departmentId) }, URL_TIMELINE.TIMELINE_LIST) }}
              />
            }
            {/* department */}

            <div className="divider" />
            {/* customerTimeline start  */}
            {listCustomerTimeline?.length > 0 &&
              <LocalNavigationList
                listItems={listCustomerTimeline as []}
                link="/timeline/list"
                optionLabel="listName"
                placeholderSearchBox={translate('timeline.control.sidebar.search-customer-timeline')}
                title={translate('timeline.control.sidebar.customer-timeline')}
                extraValueNumber="newItem"
                optionId="listId"
                classActiveId={props.activeNavigation}
                searchLocal={true}
                onSelectOption={(objectValue: any) => { executeDirtyCheck(() => { handleClickMenu(TIMELINE_TYPE.CUSTOMER_TIMELINE, objectValue.listId) }, URL_TIMELINE.TIMELINE_LIST) }}
              />
            }

            {/* customerTimeline end */}
            {/* businessCardTimeline start  */}
            {listBusinessCardTimeline?.length > 0 &&
              < LocalNavigationList
                listItems={listBusinessCardTimeline as []}
                link="/timeline/list"
                optionLabel="listName"
                optionId="listId"
                placeholderSearchBox={translate('timeline.control.sidebar.search-business-card-timeline')}
                listType={TIMELINE_TYPE.FAV_BIZCARD_TIMELINE}
                classActiveId={props.activeNavigation}
                title={translate('timeline.control.sidebar.business-card-timeline')}
                extraValueNumber="newItem"
                searchLocal={true}
                onSelectOption={(objectValue: any) => {  executeDirtyCheck(() => { handleClickMenu(TIMELINE_TYPE.FAV_BIZCARD_TIMELINE, objectValue.listId) }, URL_TIMELINE.TIMELINE_LIST) }}
              />
            }
            {/* businessCardTimeline end */}
          </div>
        </Resizable>
      }
      <div className={sidebarStyle} onClick={toggleSidebar}>
        <a role="button" tabIndex={0} className="expand">
          <i className={sidebarIconStyle} />
        </a>
      </div>
      {props.toggleTimelineModal && <TimelineGroupAddEdit />}
    </>
  );
}


const mapStateToProps = ({ timelineReducerState,timelineCommonReducerState, employeeDetailAction, applicationProfile }: IRootState) => ({
  timelineFormSearch: timelineReducerState.getTimelineFormSearch,
  localNavigation: timelineReducerState.localNavigation,
  toggleTimelineModal: timelineReducerState.toggleTimelineModal,
  listCountNew: timelineReducerState.listCountNew,
  activeNavigation: timelineReducerState.activeNavigation,
  isClickListTimeline: timelineReducerState.isClickListTimeline,
  screenMode: timelineCommonReducerState.screenMode,
  valuePost: timelineCommonReducerState.valuePost,
  tenant: applicationProfile.tenant,
  isChangeId: employeeDetailAction.idUpdate
});

const mapDispatchToProps = {
  changeScreenMode,
  handleInitTimelines,
  handleUpdateRecentlyDateClicked,
  handleUpdateTimelineFormSearch,
  handleToggleTimelineModal,
  handleSetGroupTimelineDetailId,
  handleGetLocalNavigation,
  handleSetActiveNavigation,
  handleResetIsClickListTimeline,
  handleGetTimelineFilter,
  handleToggleListAttachedFile,
  handleSetValuePost,
  handleClearTimelineValueFilter
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalNavigation);
