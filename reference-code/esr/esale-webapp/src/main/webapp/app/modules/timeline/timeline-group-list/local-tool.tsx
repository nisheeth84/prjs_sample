import React, { useState, useEffect } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux';
import { handleGetTimelineGroups, updateSortType } from '../timeline-reducer';
import SearchGroupControl from '../control/local-tool/search-group-control';
import { CommonUtil } from '../common/CommonUtil';
import DropdowlistBasicControl from '../control/local-tool/dropdowlist-basic-control';
import { translate } from 'react-jhipster';
import TimelineAddEdit from '../timeline-add-edit/timeline-add-edit';
import { LIST_SORT_DROPDOWN } from '../common/constants'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { AUTHORITIES } from 'app/config/constants';
import PopupMenuSet from 'app/modules/setting/menu-setting.tsx';

type ILocalToolProp = StateProps & DispatchProps & {
  toggleOpenHelpPopup?
  openHelpPopup?: boolean
}

const LocalTool = (props: ILocalToolProp) => {
  const [showItems, setShowItems] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [onOpenPopupSetting, setOnOpenPopupSetting] = useState(false);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);

  useEffect(() => {
    props.updateSortType(1);
  }, [])
  /**
   * @param value
   * @param obj
   * Handle when change value in combobox
   */
  const doSearch = (value) => {
    if (props.listTimelineGroups) {
      const param = {
        timeLineGroupIds: CommonUtil.NVL(CommonUtil.GET_ARRAY_VALUE_PROPERTIES(props.listTimelineGroups, 'timeLineGroupId'), []),
        sortType: value
      }
      props.updateSortType(value);
      props.handleGetTimelineGroups(param);
    }
  }

  /**
  * handle action open popup setting
  */
  const handleOpenPopupSetting = () => {
    setOnOpenPopupSetting(true)
  }

  /**
  * handle close popup settings
  */
  const dismissDialog = () => {
    setOnOpenPopupSetting(false);
  }

  /**
   * handle close modal when created timeline post
   */
  useEffect(() => {
    if (props.timelineIdPostCreated) {
      setIsOpenModal(false)
    }
  }, [props.timelineIdPostCreated])

  return (
    <>
      <div className="control-top">
        <div className="left">
          <button className="button-shadow-add button-shadow-timeline" onClick={() => { setIsOpenModal(true) }} onMouseDown={e => e.preventDefault()}>{translate('timeline.group.new-post')}</button>
        </div>
        <div className="right">
          <div className="form-group mb-0">
            <div className="select-option" onClick={() => setShowItems(!showItems)}>
              <DropdowlistBasicControl
                listItem={LIST_SORT_DROPDOWN as []}
                label="label"
                value="value"
                defaultValue={1}
                onSelectedChange={doSearch}
              />
            </div>
          </div>
          <div className="form-group mb-0 ml-2">
            <SearchGroupControl />
          </div>
          <button tabIndex={0} className={`icon-small-primary icon-help-small ${props.openHelpPopup ? 'active' : ''}`} onClick={props.toggleOpenHelpPopup}/>
          {isAdmin && <a role="button" tabIndex={0} className={`icon-small-primary icon-setting-small ${isAdmin ? "" : "disable"} `} onMouseDown={e => e.preventDefault()} onClick={() => { handleOpenPopupSetting() }} />}
          {onOpenPopupSetting &&
            <PopupMenuSet dismissDialog={dismissDialog} />
          }
        </div>
      </div>
      {isOpenModal && <TimelineAddEdit closeModal={() => { setIsOpenModal(false) }} />}
    </>
  );
}
const mapStateToProps = ({ timelineReducerState, authentication }: IRootState) => ({
  listTimelines: timelineReducerState.listTimelines,
  listTimelineGroups: timelineReducerState.listTimelineGroups,
  authorities: authentication.account.authorities,
  timelineIdPostCreated: timelineReducerState.timelineIdPostCreated
});

const mapDispatchToProps = {
  handleGetTimelineGroups,
  updateSortType
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalTool);
