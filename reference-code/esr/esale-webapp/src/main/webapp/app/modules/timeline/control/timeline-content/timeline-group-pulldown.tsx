import React, { useState, useRef, useEffect } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { handleSuggestTimelineGroupName, handleClearSuggestTimelineGroupName } from '../../timeline-reducer';
import { DataType } from '../../models/suggest-timeline-group-name-model';
import useEventListener from 'app/shared/util/use-event-listener';
import { CommonUtil } from '../../common/CommonUtil';
import { translate } from 'react-jhipster'

type ITimelineGroupPulldownProp = StateProps & DispatchProps & {
  chooseGroup?: (item: DataType) => void
  // to display icon of group
  defaultValue?: DataType
  // to disable when click
  isDisabled?: boolean
  // to disable when click
  isPrivateGroup?: boolean
  // class to append
  classAppend?: string
  // reset channel
  isResetChannel?: boolean
  // common mode
  isCommonMode?: boolean
}

const TimelineGroupPulldown = (props: ITimelineGroupPulldownProp) => {
  const [isShowPulldown, setIsShowPulldown] = useState(false);
  const [isChooseGroup, setIsChooseGroup] = useState(false);
  const [groupValue, setGroupValue] = useState<DataType>(null);
  const registerRefPullGroup = useRef(null);

  /**
   * clear channel when create Suggest
   */
  useEffect(() => {
    if(props.isResetChannel) {
      setGroupValue(props.defaultValue);
    }
  },[props.isResetChannel])

  /**
   * set value when start
   */
  useEffect(() => {
    setGroupValue(props.defaultValue)
  },[props.defaultValue])

  /**
   * clear list timeline group when innit and destroy component
   */
  useEffect(() => {
    props.handleClearSuggestTimelineGroupName();
    return () => props.handleClearSuggestTimelineGroupName();
  },[])

  /**
   * to close pulldown when click out
   * @param e
   */
  const handleClickOutsidePulldown = (e) => {
    if (registerRefPullGroup.current && !registerRefPullGroup.current.contains(e.target)) {
      setIsShowPulldown(false)
    }
  }
  useEventListener('mousedown', handleClickOutsidePulldown);

  let timeout = null;
  /**
   * action search with timeout
   * @param event
   */
  const actionSearchSuggestGroupName = (event) => {
    const keyWord = event.target.value;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      props.handleSuggestTimelineGroupName(keyWord.trim(), 2);
    }, 500);
  }

  /**
   * action toggle pulldown
   */
  const togglePullDown = () => {
    setIsShowPulldown(!isShowPulldown);
    if(!isShowPulldown && !props.isDisabled && !props.isPrivateGroup) props.handleSuggestTimelineGroupName("", 2);
  }

  /**
   * action choose a item in pulldown
   * @param item
   */
  const choseGroup = (item: DataType) => {
    setIsShowPulldown(false);
    setIsChooseGroup(true);
    if (props.chooseGroup) {
      props.chooseGroup((item));
    }
  }

  const renderPulldownChannel = () => {
    return (
      <div className={`drop-down w260 mh242 pb-0 z-index-999 ${(props.listSuggestTimeGroupName && props.listSuggestTimeGroupName.data.length > 5) ? '' : 'drop-down2 d-block bg-white w260'} ${props.classAppend ? props.classAppend : ''} ${props.isCommonMode ? 'location-r0' : ''}`}>
        <div className="p-2 input-bore">
          <input type="text" className={`input-normal v2 mh-auto ${props.isCommonMode ? 'br-12' : ''}`} placeholder={translate('timeline.pulldown-channel.place-holder')} onChange={(e) => actionSearchSuggestGroupName(e)}/>
        </div>
        <ul>
          {props.listSuggestTimeGroupName && props.listSuggestTimeGroupName.data && props.listSuggestTimeGroupName.data.map((item: DataType) => {
            return (
              <li key={item.timelineGroupId} className="p-2 pl-3 item-select">
                <div onClick={() => {choseGroup(item); setGroupValue(item);   }} className="text text2 item p-0 text-ellipsis">
                  {item.imagePath ? <img className="user" src={item.imagePath} alt="" title="" />
                                  : <span className={`more-user mr-2 ${CommonUtil.getColorIndex(item.color)} ${props.isCommonMode ? 'pt-0' : ''}`}>{CommonUtil.getFirstCharacter(item.timelineGroupName)}</span>}
                  {item.timelineGroupName}
                </div>
              </li>
            )
          })
          }
        </ul>
      </div>
    )
  }

  return (
    <>
      <div className={isShowPulldown? 'position-relative form-group mb-0 overflow-visible' : ''} ref={registerRefPullGroup}>
        { ((!isChooseGroup && !props.isPrivateGroup && !(groupValue && groupValue.timelineGroupId)) || (isChooseGroup && !(groupValue && groupValue.timelineGroupId))) &&
          <button type="button" title="" className={`icon-text no-underline font-size-14 icon-textch color-333 ${isShowPulldown ? 'active' : ''}`} onMouseDown={e => e.preventDefault()} onClick={() => { if (props.isDisabled) return false; else {togglePullDown();}}}>
            ch
          </button>
        }
        {(groupValue && groupValue.timelineGroupId) && (groupValue.imagePath ? <a onClick={() => togglePullDown()} className="item"><img className="user mr-0" src={groupValue.imagePath} alt="" title="" /></a> :
          <a className= {` more-user  ${CommonUtil.getColorIndex(groupValue.color)? CommonUtil.getColorIndex(groupValue.color): 'green'}`} onClick={() => togglePullDown()}>
            {CommonUtil.getFirstCharacter((groupValue ? groupValue.timelineGroupName : '')) }
          </a>)
        }
        {isShowPulldown && !props.isDisabled && !props.isPrivateGroup && renderPulldownChannel()}
      </div>
    </>
  )
}

const mapStateToProps = ({ timelineReducerState }: IRootState) => ({
  listSuggestTimeGroupName: timelineReducerState.listSuggestTimeGroupName,
});

const mapDispatchToProps = {
  handleSuggestTimelineGroupName,
  handleClearSuggestTimelineGroupName,
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineGroupPulldown);
