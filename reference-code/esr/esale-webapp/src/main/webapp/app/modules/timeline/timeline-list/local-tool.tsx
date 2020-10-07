import React, { useState, useEffect, useRef } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { translate } from 'react-jhipster';
import {
  handleGetAttachedFiles
  , handleToggleListAttachedFile
  , handleUpdateTimelineFormSearch
  , handleInitTimelines
} from '../timeline-reducer'
import TimelineAddEdit from '../timeline-add-edit/timeline-add-edit'
import useEventListener from 'app/shared/util/use-event-listener';
import LocalToolFilter from './local-tool-filter'
import LocalToolGroupLeft from './local-tool-group-left'
import TimelineFollowedModal from './timeline-followed-modal'
import PopupMenuSet from 'app/modules/setting/menu-setting.tsx';
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { AUTHORITIES } from 'app/config/constants';

type ILocalToolProp = StateProps & DispatchProps & {
  // check is group timeline
  isGroupTimeline?: boolean
  toggleOpenHelpPopup?
  openHelpPopup?: boolean
}
/**
 * component show local tool
 * @param props
 */

const LocalTool = (props: ILocalToolProp) => {
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [labelItem, setLabelItem] = useState('timeline.control.local-tool.sort-update-date');
  // const [valueSort, setValueSort] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false)
  const registerRefSort = useRef(null);
  const registerRefFilter = useRef(null);
  const [isOpenModalFollowed, setIsOpenModalFollowed] = useState(false)
  const [onOpenPopupSetting, setOnOpenPopupSetting] = useState(false);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [focus, setFocus] = useState(false);
  const textSearchRef = useRef<HTMLInputElement>(null);
  const [searchValue1, setSearchValue] = useState(null);

  /**
   * listen change settting
   */
  useEffect(() => {
    if(props.isChangeId) {
      setForceUpdate(forceUpdate+1);
    }
  }, [props.isChangeId])

  /**
   * listen to reset search value text
   */
  useEffect(() => {
    if(props.timelineFormSearch?.searchValue === null) {
      textSearchRef.current.value = '';
      setSearchValue('');
    }
  }, [props.timelineFormSearch])

  // useEffect(() => {
  //   setLabelItem(translate('timeline.control.local-tool.sort-update-date'));
  // }, [])

  const listSortDropDown = [
    { label: 'timeline.control.local-tool.sort-update-date', value: "changedDate" },
    { label: 'timeline.control.local-tool.sort-created-date', value: "createdDate" }
  ]

  // handle show item when sort
  const handleShowItem = (item) => {
    setLabelItem(item.label);
    // setValueSort(item.value);
    props.handleUpdateTimelineFormSearch({ ...props.timelineFormSearch, sort: item.value });
    setToggle1(false);
  }

  // handle search
  const onClickIConSearch = () => {
    const keySearch = searchValue1.trim()
    props.handleUpdateTimelineFormSearch({ ...props.timelineFormSearch, searchValue: keySearch });
  }

  // handle close popup filer
  const handleClickOutsideFilter = (e) => {
    if (registerRefFilter.current && !registerRefFilter.current.contains(e.target)) {
      setToggle2(false);
    }
  }
  useEventListener('click', handleClickOutsideFilter);

  // handle close dropdown sort
  const handleClickOutsideSort = (e) => {
    if (registerRefSort.current && !registerRefSort.current.contains(e.target)) {
      setToggle1(false)
    }
  }
  useEventListener('click', handleClickOutsideSort);

  /**
   * handle close modal when created timeline post
   */
  useEffect(() => {
    if (props.timelineIdPostCreated) {
      setIsOpenModal(false)
    }
  }, [props.timelineIdPostCreated])

  /**
  * handle close popup settings
  */
  const dismissDialog = () => {
    setOnOpenPopupSetting(false);
  }

   /**
  * handle action open popup setting
  */
  const handleOpenPopupSetting = () => {
    setOnOpenPopupSetting(true)
  }


  const handleOnblurTextbox = (event) => {
    event.target.value = (event.target.value || '').trim();
    setFocus(false);
  }

  const renderSortByDate = () => {
    return (<div className="position-relative" ref={registerRefSort}>
      <a role="button" tabIndex={0} className={`button-pull-down ${toggle1 ? "active" : "color-333"}`} onClick={() => { setToggle1(!toggle1) }}>{translate(labelItem)}</a>
      {/* dropdown sort  */}
      {toggle1 &&
        <div className="box-select-option box-select-option-custome">
          <ul>
            {listSortDropDown && listSortDropDown.map((item, index) => {
              return <li key={`sort_${index}`} onClick={() => { handleShowItem(item) }}><a>{translate(item.label)}</a></li>
            })}
          </ul>
        </div>
      }
    </div>)
  }

  return (
    <>
      <div className="control-top" >
        <div className="left">
          <a role="button" className="button-shadow-add button-shadow-timeline" onClick={() => { setIsOpenModal(true) }} tabIndex={0} onMouseDown={e => e.preventDefault()}>{translate('timeline.control.local-tool.add-timeline')}</a>
          {props.isGroupTimeline && <LocalToolGroupLeft />}
        </div>
        <div className="right"  >
          {renderSortByDate()}
          <div className="position-relative" ref={registerRefFilter}>
            <a role="button" tabIndex={0} className={`button-pull-down ml-2 ${toggle2 ? "active" : "color-333"}`} onClick={() => { setToggle2(!toggle2) }}>{translate('timeline.control.local-tool.filter')}</a>
            {/* local tool filter */}
            {toggle2 && <LocalToolFilter isChecked={true} />}
          </div>
          <a role="button" tabIndex={0}  onClick={() => { props.handleGetAttachedFiles(props.timelineFormSearch); props.handleToggleListAttachedFile(true); } }
            className={props.isOpenListAttachedFile ? "icon-primary icon-tag-file ml-2 active" : "icon-primary icon-tag-file ml-2"} />
          {/* search */}

          <div role="button" tabIndex={0} className={`search-box-button-style ${focus ? 'search-box-focus' : ''}`}>
            <button onClick={onClickIConSearch} className="icon-search"><i className="far fa-search" /></button>
            <input type="text" className="pr-4" placeholder={translate('timeline.control.local-tool.search-value')}
              onChange={(e) => setSearchValue(e.target.value)}
              onBlur={handleOnblurTextbox}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onClickIConSearch()
                }
              }}
              onFocus={() => setFocus(true)}
              ref={textSearchRef}
              value={searchValue1}/>
            <a id="open-popup-window" className="icon-fil" data-toggle="modal" />
          </div>

          <a role="button" tabIndex={0} className="button-primary button-simple-edit ml-2 pr-4 color-666" onClick={() => { setIsOpenModalFollowed(true) }} >{translate('timeline.control.local-tool.show-follow')}</a>
          <a role="button" tabIndex={0}  className={"icon-small-primary icon-help-small" + (props.openHelpPopup ? " active" : "")} onClick={props.toggleOpenHelpPopup}/>
          {isAdmin && <a role="button" tabIndex={0} className={`icon-small-primary icon-setting-small ${isAdmin ? "" : "disable"} `} onMouseDown={e => e.preventDefault()} onClick={() => { handleOpenPopupSetting() }} />}
          {onOpenPopupSetting &&
            <PopupMenuSet dismissDialog={dismissDialog} />
          }
        </div>
      </div>
      {/* modal add timeline */}
      {isOpenModal && <TimelineAddEdit closeModal={() => { setIsOpenModal(false) }} />}
      {/* modal follower */}
      {isOpenModalFollowed && <TimelineFollowedModal closeModal={() => { setIsOpenModalFollowed(false) }} />}
    </>

  );
}

const mapStateToProps = ({ timelineReducerState, authentication, employeeDetailAction }: IRootState) => ({
  timelineFormSearch: timelineReducerState.getTimelineFormSearch,
  isOpenListAttachedFile: timelineReducerState.isOpenListAttachedFile,
  toggleTimelineModal: timelineReducerState.toggleTimelineModal,
  timelineIdPostCreated: timelineReducerState.timelineIdPostCreated,
  authorities: authentication.account.authorities,
  isChangeId: employeeDetailAction.idUpdate
});

const mapDispatchToProps = {
  handleGetAttachedFiles,
  handleToggleListAttachedFile,
  handleUpdateTimelineFormSearch,
  handleInitTimelines
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalTool);
