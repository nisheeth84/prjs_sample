import React, { useState, useRef, useEffect } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { useId } from "react-id-generator";
import { handleGetSuggestionTimeline, clearListSuggestionTimeline } from '../../timeline-reducer';
import useEventListener from 'app/shared/util/use-event-listener';
import { CommonUtil } from '../../common/CommonUtil';
import { TARGET_TYPE } from '../../common/constants';
import ModalCreateEditEmployee from '../../../../modules/employees/create-edit/modal-create-edit-employee';
import PopupFieldsSearch from 'app/shared/layout/dynamic-form/popup-search/popup-fields-search'
import { FIELD_BELONG } from 'app/config/constants';
import { EMPLOYEE_ACTION_TYPES, EMPLOYEE_VIEW_MODES } from 'app/modules/employees/constants';
import { translate } from 'react-jhipster'
import FieldsSearchResults from '../../../../shared/layout/common/suggestion/list-result/fields-search-result'
import {TagAutoCompleteType, TagAutoCompleteMode} from 'app/shared/layout/common/suggestion/constants'
import { Modal } from 'reactstrap';
import { PositionScreen } from '../../models/suggest-timeline-group-name-model';
import {
  handleGetEmployeeList
} from '../../../../shared/layout/common/suggestion/tag-auto-complete.reducer';
import { handleSetIsScrolling } from '../../timeline-common-reducer';


interface ITagAutoCompleteDispatchProps {
  handleGetEmployeeList
}

type ITimelineTargetDeliverPulldownProp = StateProps & DispatchProps & {
  // to call back to pass item choose
  onChooseItem?: (item: any) => void,
  // to send API to get target deliver
  timelineGroupId: number
  // class to append
  classAppend?: string
  // list item choose
  listItemChoose?: any
  // on Push Multi
  onPushMulti?: (listItem: any[]) => void
  // common Mode
  isCommonMode?: boolean
}

const TimelineTargetDeliverPulldown = (props: ITimelineTargetDeliverPulldownProp) => {
  const [isShowPulldown, setIsShowPulldown] = useState(null);
  const registerRefPullGroup = useRef(null);
  const refButton = useRef<HTMLButtonElement>(null);

  const [openModalEmployee, setOpenModalEmployee] = useState(false);
  const [openPopupSearch, setOpenPopupSearch] = useState(false);
  const [conditionSearch, setConditionSearch] = useState(null);
  const [conDisplaySearchDetail, setConDisplaySearchDetail] = useState(false);
  const [listItemChoice, setListItemChoice] = useState([]);
  const [openPopupSearchResult, setOpenPopupSearchResult] = useState(false);
  const [iconFunction, setIconFunction] = useState('');
  const [listEmployeeSelect, setListEmployeeSelect] = useState([])
  const itemLogin = {idChoice: CommonUtil.getUserLogin().employeeId, searchType: 2}
  const [isActive, setIsActive] = useState(false)
  const [isLocation, setIsLocation] = useState(false)
  const [position, setPosition] = useState<PositionScreen>(null)
  const employeeEditCtrlId = useId(1, "timelineEmployeeEditCtrlId_");

   /**
   * listen close pulldown when scroll for timeline common
   * @param e
   */
  useEffect(()=> {
    if(props.isScrolling && props.isCommonMode){
      setIsShowPulldown(false);
    }
  }, [props.isScrolling])

  /**
   * listen change of list chose
   * @param e
   */
  useEffect(()=> {
    const newListChoice = [];
    newListChoice.push(itemLogin);
    if(props.listItemChoose){
      props.listItemChoose.forEach(element => {
        if(element.targetType === TARGET_TYPE.DEPARTMENT) {
          newListChoice.push({idChoice: element.targetId, searchType: 1});
        } else if (element.targetType === TARGET_TYPE.EMPLOYEE) {
          newListChoice.push({idChoice: element.targetId, searchType: 2});
        }
      });
    }
    setListItemChoice(newListChoice);
  }, [props.listItemChoose])

  /**
   * handle close dropdown when click out
   * @param e
   */
  const handleClickOutsidePulldown = (e) => {
    if (registerRefPullGroup.current && !registerRefPullGroup.current.contains(e.target)) {
      setIsShowPulldown(false)
      setIsLocation(false);
    }
  }
  useEventListener('mousedown', handleClickOutsidePulldown);

  const onMouseEnter = () => {
    const _top = registerRefPullGroup.current.getBoundingClientRect().bottom;
    const _bot = registerRefPullGroup.current.getBoundingClientRect().top;
    const space = window.innerHeight - _bot;
    if(space < 270) {
      setIsLocation(!isLocation);
    }
    if(props.isCommonMode) {
      if(space >= 270) {
        setPosition({top: _top, left: refButton.current.getBoundingClientRect().right - 550});
      } else {
        setPosition({bottom: space, left: refButton.current.getBoundingClientRect().right - 550});
      }
    }
  }
  /**
   * toggle pull down
   */
  const togglePulldown = () => {
    onMouseEnter();
    setIsShowPulldown(!isShowPulldown)
    props.clearListSuggestionTimeline();
    if (!isShowPulldown) {
      props.handleGetSuggesstionTimeline("", props.timelineGroupId, listItemChoice);
    }
    if(props.isCommonMode){
      props.handleSetIsScrolling(false);
    }
  }

  /**
   * reset value when change keyWord
   * @param event
   */
  let timeout = null;
  const onChangeKeyWord = (event) => {
    const keyWord = event.target.value;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      props.handleGetSuggesstionTimeline(keyWord, props.timelineGroupId, listItemChoice);
    }, 500);
  }

  /**
   * action when choose a item
   * @param item
   */
  const onChooseTarget = (item) => {
    setIsShowPulldown(false);
    props.clearListSuggestionTimeline();
    if (props.onChooseItem) {
      props.onChooseItem(item);
    }
  }

  /**
   * action open model employee
   * @param e
   */
  const onActionRight = () => {
    setOpenModalEmployee(true);
    setIsActive(true);
  }

  /**
   * action close modal employee
   */
  const onCloseModalEmployee = (param) => {
    if (param) {
      props.handleGetEmployeeList("employeeId", [param.employeeId]);
    } else {
      setIsActive(false);
    }
    setOpenModalEmployee(false);
  }
  /**
   * action onclose popup search
   * @param saveCondition
   */
  const onClosePopupSearch = (saveCondition) => {
    setOpenPopupSearch(false);
    // if (saveCondition && saveCondition.length > 0) {
    //   setConditionSearch(saveCondition);
    // }
  }

  /**
   * action search popup
   * @param condition
   */
  const handleSearchPopup = (condition) => {
    setOpenPopupSearch(false);
    setConditionSearch(condition);
    setOpenPopupSearchResult(true);
    setIsActive(true);
  }

  const onCloseFieldsSearchResults = () => {
    setIsActive(false);
    setOpenPopupSearchResult(false);
  }

  const onBackFieldsSearchResults = () => {
    setOpenPopupSearch(true);
    setTimeout(() => {
      setOpenPopupSearchResult(false);
    }, 1000);
  }

  const onActionSelectSearch = (listRecordChecked) => {
    if (listRecordChecked) {
      const listEmployeeId = [];
      listRecordChecked.forEach(element => {
        listEmployeeId.push(element.employeeId);
      });
      props.handleGetEmployeeList("employeeId", listEmployeeId);
    }
    setOpenPopupSearchResult(false);
  }

  useEffect(() => {
    if(isActive && props.employees && props.employees.length > 0) {
      setListEmployeeSelect(CommonUtil.convertSuggestionTimeline({employees: props.employees}));
      setIsActive(false);
    }
  }, [props.employees])

  useEffect(() => {
    props.clearListSuggestionTimeline();
    if (props.onPushMulti) {
      props.onPushMulti(listEmployeeSelect);
    }
  }, [listEmployeeSelect])

  const renderPulldownTargetDeliver = () => {
    return (
      <div className = {`drop-down w550 z-index-999 ${isLocation && !props.isCommonMode ? 'location-b0' : ''} ${isLocation && props.isCommonMode ? 'top-initial' : ''} ${props.classAppend? props.classAppend: ''} ${props.isCommonMode? 'position-fixed overflow-hidden': 'location-right'}`}
          style={position}>
        <ul className={`dropdown-item style-3 ${props.isCommonMode ? 'max-height-205' : ''}`}>
          {/* send all */}
          { !props.timelineGroupId &&
            <li className="item smooth" onClick={() => onChooseTarget({ targetType: TARGET_TYPE.ALL, targetId: -100, targetName: "全員" })}>
            <div className="item2">
              <div className="name">
                <img src="../../../content/images/ic-user10.svg" alt="" title="" />
              </div>
              <div className="content">
                <div className="text text2">{translate('timeline.common.target-all')}</div>
              </div>
            </div>
          </li>
          }
          {props.listSuggestionTimeline && props.listSuggestionTimeline.length > 0 && props.listSuggestionTimeline.map(item => {
            return <li key={`${item.targetId}${item.targetType === TARGET_TYPE.EMPLOYEE ? 'e' : 'd'}`} className="item smooth"
              onClick={() => onChooseTarget(item)}>
              <div className="item2">
                {item.targetAvartar ?
                  <div className="name"><img src={item.targetAvartar} alt="" title="" /></div>
                  : <div className={"name " + item.targetAvartarRandom}>{CommonUtil.getFirstCharacter(item.targetName)}</div>}
                <div className="content">
                  <div className="text1 text-blue font-size-12 text-ellipsis" title={item.targetNameUp}>{item.targetNameUp}</div>
                  <div className="text2 text-blue text-ellipsis" title={item.targetNameDown}>{item.targetNameDown}</div>
                </div>
              </div>
            </li>
          })}
        </ul>
        <div className="form-group search mb-0">
          <button className="submit pointer-none" disabled type="button"></button>
          <input onChange={() => { onChangeKeyWord(event) }} type="text" placeholder={translate('dynamic-control.suggestion.search')} />
          <a title="" className="button-primary button-add-new add" onClick={onActionRight}>{translate('dynamic-control.suggestion.add')}</a>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={isShowPulldown? 'position-relative form-group mb-0 overflow-visible' : ''} ref={registerRefPullGroup} >
        <button ref={refButton} type="button" title="" className={`icon-text no-underline font-size-18 ml-2 button-focus color-333 ${isShowPulldown ? 'active' : ''}`} onMouseDown={e => e.preventDefault()} onClick={() => {togglePulldown() }} >@</button>
        {isShowPulldown && renderPulldownTargetDeliver()}
      </div>
      {openModalEmployee &&
        <ModalCreateEditEmployee
          id={employeeEditCtrlId[0]}
          toggleCloseModalEmployee={onCloseModalEmployee}
          iconFunction="ic-sidebar-employee.svg"
          employeeActionType={EMPLOYEE_ACTION_TYPES.CREATE}
          employeeViewMode={EMPLOYEE_VIEW_MODES.EDITABLE}
        />
      }
      {openPopupSearch &&
        <PopupFieldsSearch
          iconFunction="ic-sidebar-employee.svg"
          fieldBelong={FIELD_BELONG.EMPLOYEE}
          conditionSearch={conditionSearch}
          onCloseFieldsSearch={onClosePopupSearch}
          onActionSearch={handleSearchPopup}
          conDisplaySearchDetail={conDisplaySearchDetail}
          setConDisplaySearchDetail={setConDisplaySearchDetail}
          fieldNameExtension="employee_data"
          // do not change
          hiddenShowNewTab={true}
          isOpenedFromModal={true}
          selectedTargetType={0}
          selectedTargetId={0}
          // layoutData={props.employeeLayout}
        />
      }
      {openPopupSearchResult &&
      <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} id="popup-field-search" autoFocus={true} zIndex="auto">
        <FieldsSearchResults
          iconFunction={iconFunction}
          condition={conditionSearch}
          onCloseFieldsSearchResults={onCloseFieldsSearchResults}
          onBackFieldsSearchResults={onBackFieldsSearchResults}
          type={TagAutoCompleteType.Employee}
          modeSelect={TagAutoCompleteMode.Multi}
          onActionSelectSearch={onActionSelectSearch}
        />
        </Modal>
      }
    </>
  )
}

const mapStateToProps = ({ timelineReducerState, tagAutoCompleteState, timelineCommonReducerState }: IRootState) => ({
  listSuggestionTimeline: timelineReducerState.listSuggestionTimeline,
  isScrolling: timelineCommonReducerState.isScrolling,
  employees: (!tagAutoCompleteState || !tagAutoCompleteState.data.has("employeeId")) ? [] : tagAutoCompleteState.data.get("employeeId").employees
});

const mapDispatchToProps = {
  handleGetSuggesstionTimeline: handleGetSuggestionTimeline,
  clearListSuggestionTimeline,
  handleGetEmployeeList,
  handleSetIsScrolling
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineTargetDeliverPulldown);
