import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect, Options } from 'react-redux'
import TimelineFormControl from '../control/timeline-content/timeline-form-control'
import TimelineItemControl from '../control/timeline-content/timeline-item-control'
import { TimelinesType } from '../models/get-user-timelines-type'
import { handleInitExtTimelines,
  handleInitExtTimelinesScroll,
  handleInnitGetExtTimelineFilter,
  handleUpdateExtTimelineFormSearch,
  handleClearCacheTimeline,
  handleSetIsScrolling,
  handleSetActiveStack,
 } from '../timeline-common-reducer'
import { handleClearSuggestTimelineGroupName, TimelineAction, handleClearListCommentCommon } from '../timeline-reducer'
import { handleGetFullListReaction } from '../control/reaction/timeline-reaction-reducer'
import LocalToolFilterCommon from './local-tool-filter-common'
import { translate } from 'react-jhipster';
import ConfirmPopup from '../control/timeline-content/confirm-popup'
import TimelineMessageInfo from '../control/message-info/timeline-message-info'
import { SERVICE_TYPE_MAP, MODE_EXT_TIMELINE, TIMELINE_TYPE, LIMIT_EXT, TIMELINE_SERVICE_TYPES, TYPE_DETAIL_MODAL_HEADER } from '../common/constants'
import { TargetDeliver } from '../models/timeline-form-search'
import TimelineDetailOthers  from '../timeline-list/timeline-detail-orthers'
import { ObjectDetail } from '../models/get-followeds-model'
import TimelineDetailEmployee from '../timeline-list/timeline-detail-employee'
import _ from 'lodash';
import TimelineDetail from '../control/timeline-content/timeline-detail'

type ITimelineCommonControlProp = {
  serviceType: number,
  objectId: number[],
  hasLoginUser?: boolean,
  targetDeliversForSearch?: TargetDeliver[],
  isHiddenFormCreate?: boolean
  isDataChange?: (isChange: boolean) => void,
  isFullHeight?: boolean,
  // call back when click same other type detail
  callAgain?: (idDetail: number) => void
}

const TimelineCommonControl = forwardRef((props: ITimelineCommonControlProp & StateProps & DispatchProps, ref) => {
  const [currentPage, setCurrentPage] = useState(0);
  const registerRefFilter = useRef(null);
  const registerRefFilter1 = useRef(null);
  const [toggle2, setToggle2] = useState(false);
  const [isLoadFirst, setIsLoadFirst] = useState(true);
  const [dataPopupDetail, setDataPopupDetail] = useState<ObjectDetail>(null)
  const [activePos, setActivePos] = useState<number>(null)
  const [listExtTime, setListExtTime] = useState<TimelinesType[]>([])
  // 
  const [dataDetailTimeline, setDataDetailTimeline] = useState<TimelinesType>(null)

  /**
   * handle get full list emoji
   */
  useEffect(() => {
    props.handleGetFullListReaction();
  }, [])

  /**
   * Innit get extra timeline
   */
  useEffect (() => {
    setIsLoadFirst(false);
    // set post to load data
    const listActiveStack = props.activeStack;
    const activeCurrentPost = listActiveStack.length + 1;
    setActivePos(activeCurrentPost);
    listActiveStack.push(activeCurrentPost)
    props.handleSetActiveStack(listActiveStack)
    //
    props.handleClearSuggestTimelineGroupName();
    const timelineFormSearch = props.mapExtTimelineFormSearch.get(activeCurrentPost);
    const formSearch = { ...timelineFormSearch, filters: { filterOptions: props.extTimelineFilters,
      isOnlyUnreadTimeline: false },
      limit: 5,
      offset: 0,
      listType: TIMELINE_TYPE.ALL_TIMELINE,
      sort: "changedDate",
      targetDelivers: props.targetDeliversForSearch? props.targetDeliversForSearch: [],
      idObject: props.objectId,
      serviceType: props.serviceType,
      mode: MODE_EXT_TIMELINE.DETAIL,
      hasLoginUser: props.hasLoginUser? props.hasLoginUser: false,
    };
    // check is have filter and form create
    if(props.isHiddenFormCreate){ // if don't have filter ==> get all
      props.handleUpdateExtTimelineFormSearch({...formSearch, filters: { isOnlyUnreadTimeline: false, filterOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}});
    } else {
      props.handleInnitGetExtTimelineFilter(formSearch);
    }
    return () => props.handleClearCacheTimeline(listActiveStack.slice(0, -1));
  }, [])


  const handleSearchExtTimeline = () => {
    const timelineFormSearch = props.mapExtTimelineFormSearch.get(activePos);
    const formSearch = {
      timelineFormSearch, filters: {
        filterOptions: props.extTimelineFilters,
        isOnlyUnreadTimeline: false
      },
      limit: 5,
      offset: 0,
      listType: TIMELINE_TYPE.ALL_TIMELINE,
      sort: "changedDate",
      targetDelivers: props.targetDeliversForSearch ? props.targetDeliversForSearch : [],
      idObject: props.objectId,
      serviceType: props.serviceType,
      mode: MODE_EXT_TIMELINE.DETAIL,
      hasLoginUser: props.hasLoginUser ? props.hasLoginUser : false,
    };
    props.handleUpdateExtTimelineFormSearch(formSearch);
  }


  useEffect (() => {
    if(!isLoadFirst) {
      handleSearchExtTimeline();
    }
  }, [props.hasLoginUser, props.targetDeliversForSearch])

  /**
   * listen list ext
   */
  useEffect (() => {
    if(activePos === props.activeStack[props.activeStack.length - 1] || props.activeStack.length === 1){
      setListExtTime(props.listExtTimelines);
      if(props.activeStack.length === 1){
        setActivePos(1); // value start in timeline common reducer
      }
    }
  }, [props.listExtTimelines])

  /**
   * listen list ext new when scroll
   */
  useEffect (() => {
    if(activePos === props.activeStack[props.activeStack.length - 1] || props.activeStack.length === 1){
      if(props.listExtTimelinesScroll?.length > 0){
        setListExtTime(listExtTime.concat(props.listExtTimelinesScroll))
      }
    }
  }, [props.listExtTimelinesScroll])

  /**
   * get create position from service type
   */
  const getCreatePosition = () => {
    const item = SERVICE_TYPE_MAP.find(i => i.serviceType === props.serviceType)
    return item? item.createPosition: null
  }

  /**
   * get default target create timeline from service type and object id
   */
  const getDefaultTargetCreateTimeline = () => {
    const item = SERVICE_TYPE_MAP.find(i => i.serviceType === props.serviceType)
    const _targetType = item? item.targetType: null
    const _targetIds = [];
    if(props.objectId) {
      props.objectId.forEach(element => {
        _targetIds.push(element);
      });
    }
    return {targetType: _targetType, targetId: _targetIds};
  }

  /**
   * handle close popup filer
   * @param event
   */
  const handleClickOutside = (event) => {
    if (registerRefFilter.current && !registerRefFilter.current.contains(event.target)
      && (registerRefFilter1.current && !registerRefFilter1.current.contains(event.target))
    ) {
     setToggle2(false);
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, []);


  /**
   * reset curent page when search again
   */
  useEffect(() => {
    if(listExtTime?.length <= LIMIT_EXT){
      setCurrentPage(0);
    }
    props.handleClearListCommentCommon();
  }, [listExtTime])

   /**
   *  handle scroll list timeline
   * @param e
   */
  const handleScroll = (e) => {
    const element = e.target;
    if (element.className.includes("box-share-list style-3")) {
      if(props.canScrollExtTimeline) {
        if (element.scrollTop > 0 && (element.scrollTop + element.offsetHeight) >= element.scrollHeight) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          const timelineFormSearch = props.mapExtTimelineFormSearch.get(activePos);
          props.handleInitExtTimelinesScroll({
            ...timelineFormSearch,
            targetDelivers: props.targetDeliversForSearch? props.targetDeliversForSearch: [],
            hasLoginUser: props.hasLoginUser ? props.hasLoginUser : false,
            limit: LIMIT_EXT, offset: nextPage*LIMIT_EXT });
        }
      }
      if(!props.isScrolling){
        props.handleSetIsScrolling(true);
      }
    }
  }

 /**
 * Render message no record
 */
  const rederNoDaTaList = () => {
    return (
      <div className="mt-5 pt-5 text-center">
        <div className="align-center">
          <img className="images-group-16" src={"../../../content/images/setting/ic-check-list-pink.svg"} alt="" />
          <div>{translate("messages.INF_COM_0013")}</div>
        </div>
      </div>)
  }

  const callBackShowDetail = (objectData: ObjectDetail) => {
    if (props.serviceType === TIMELINE_SERVICE_TYPES.BUSSINESS_CARD && objectData.objectType === TYPE_DETAIL_MODAL_HEADER.CARD) 
      {
        if(props.callAgain){
          props.callAgain(objectData.objectId)
        }
        return;
      }
    setDataPopupDetail(objectData)
  }

  const render = () => {
    return <>
      <TimelineMessageInfo isModal={false} />
      {!props.isHiddenFormCreate && <> <div className="popup-common-right-top  mb-2 pb-2 popup-common-right-top-gray">
        <TimelineFormControl isDataChange={(_isChange: boolean) => { if (props.isDataChange) props.isDataChange(_isChange) }}
          createPost={true}
          defaultTargetCreateTimeline={getDefaultTargetCreateTimeline()}
          createPosition={getCreatePosition()} isCommonMode={true} />
        </div>
          <div className="button-pull-down-parent d-flexjustify-content-end">
            {/* <a className="button-pull-down-small set-button-pull-down-small">フィルタ</a> */}
            <div className="position-relative">
              <div className="text-right">
                <button ref={registerRefFilter} type="button" className="button-pull-down-small set-button-pull-down-small" onClick={() => { setToggle2(!toggle2) }}>{translate('timeline.control.local-tool.filter')}</button>
              </div>
              {/* local tool filter */}
              <div ref={registerRefFilter1}>
                {toggle2 && <LocalToolFilterCommon activePos={activePos} setToggle2={setToggle2}/>}
              </div>
            </div>
          </div>
          { (!listExtTime || listExtTime.length === 0) &&
            rederNoDaTaList()
          }
      </>
      }
      <div className={`box-share-list style-3 overflow-y-hover ${props.isFullHeight ? 'h-100' : 'max-height-calc-160'}`} onScroll={handleScroll}>
        {listExtTime && listExtTime.length > 0 && listExtTime.map((t: TimelinesType, index: number) => {
          return (
            <TimelineItemControl callBackShowDetail = {callBackShowDetail} 
            setDataDetailTimeline={(data: TimelinesType) => setDataDetailTimeline(data)}
            defaultTargetCreateTimeline={getDefaultTargetCreateTimeline()} 
            isCommon={true} data={t} isLast={listExtTime.length - 1 === index} 
            key={'common_timeline'+'_'+props.activeStack?.length+'_'+t.timelineId} />
          )
        })
        }
      </div>
      {props.openConfirmPopup && <ConfirmPopup infoObj={props.confirmPopupItem} isCommon={true}/>}
      <TimelineDetailOthers classBodyCurrent={document.body.className} dataPopupDetail={dataPopupDetail}/>
      {!(props.listTimelines?.length > 0) && (activePos === props.activeStack[props.activeStack.length - 1] || props.activeStack.length === 1) && <TimelineDetailEmployee/>}
    {/* show detail timeline */}
      {dataDetailTimeline &&
        <TimelineDetail
        isCommon={true}
        data={dataDetailTimeline} closeModal={() => {setDataDetailTimeline(null)}} />}
      </>
  }

  /**
  * reference function
 */
  useImperativeHandle(ref, () => ({
    refHandleSearchExtTimeline() {
      handleSearchExtTimeline()
    }
  }));

  return <>
    {render()}
  </>
})

const mapStateToProps = ({ timelineCommonReducerState, timelineReducerState }: IRootState) => ({
  listExtTimelines: timelineCommonReducerState.listExtTimelines,
  extTimelineFilters: timelineCommonReducerState.extTimelineFilters,
  canScrollExtTimeline: timelineCommonReducerState.canScrollExtTimeline,
  openConfirmPopup: timelineReducerState.openConfirmPopup,
  confirmPopupItem: timelineReducerState.confirmPopupItem,
  listTimelines: timelineReducerState.listTimelines,
  actionTimelineCommon: timelineCommonReducerState.action,
  isScrolling: timelineCommonReducerState.isScrolling,
  activeStack: timelineCommonReducerState.activeStack,
  mapExtTimelineFormSearch: timelineCommonReducerState.mapExtTimelineFormSearch,
  listExtTimelinesScroll: timelineCommonReducerState.listExtTimelinesScroll
});

const mapDispatchToProps = {
  handleInitExtTimelines,
  handleInitExtTimelinesScroll,
  handleInnitGetExtTimelineFilter,
  handleClearSuggestTimelineGroupName,
  handleUpdateExtTimelineFormSearch,
  handleClearCacheTimeline,
  handleSetIsScrolling,
  handleSetActiveStack,
  handleGetFullListReaction,
  handleClearListCommentCommon
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

const options = { forwardRef: true };
export default connect<StateProps, DispatchProps, ITimelineCommonControlProp>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(TimelineCommonControl);
