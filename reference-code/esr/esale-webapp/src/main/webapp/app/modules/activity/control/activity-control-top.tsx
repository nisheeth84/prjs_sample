import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect, Options } from 'react-redux';
import useEventListener from 'app/shared/util/use-event-listener';
import { translate } from 'react-jhipster';
import {
  onclickShowConfirmRestoreDraft,
  handleTogglePopupSearchCondition,
  onclickShowModalActivityForm,
  handleInitDataActivityLayout,
  handleDownloadActivities
} from '../list/activity-list-reducer'
import PopupMenuSet from 'app/modules/setting/menu-setting.tsx';
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { AUTHORITIES, ScreenMode } from 'app/config/constants'
import { ACTIVITY_VIEW_MODES, ACTIVITY_ACTION_TYPES } from '../constants';
import { CommonUtil } from '../common/common-util';
import _ from 'lodash';
type IActivityControlTopProp = {
  toggleOpenPopupSearch,
  textSearch?: string,
  enterSearchText?: (text) => void,
  toggleOpenHelpPopup
  onClickCreateActivity: (activityId: number, activityDraftId: number, actionType: any, viewMode: any) => void
  isDraft?: boolean,
  modeDisplay?: ScreenMode;
  setConDisplaySearchDetail: () => void,
  conDisplaySearchDetail: boolean
  actionOnCanDownload?: () => any;
}

/**
 * component for show local tool
 * @param props
 */
const ActivityControlTop = forwardRef((props: IActivityControlTopProp & StateProps & DispatchProps, ref) => {

  const [isToggleModalFormActivity, setShowRegistrationOption] = useState(false);
  const registerRef = useRef(null);
  const [valueTextSearch, setValueTextSearch] = useState(props.textSearch);
  const [valueTextSearchOld, setValueTextSearchOld] = useState(props.textSearch);
  const [onOpenPopupSetting, setOnOpenPopupSetting] = useState(false);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);

  useImperativeHandle(ref, () => ({
    setTextSearch(text) {
      setValueTextSearch(text);
    }
  }));

  const onClickOpenModalCreateActivity = (event) => {
    setShowRegistrationOption(false);
    // props.handleInitDataActivityLayout();
    props.onClickCreateActivity(null, null, ACTIVITY_ACTION_TYPES.CREATE, ACTIVITY_VIEW_MODES.EDITABLE);
    event.preventDefault();
  }

  const onBlurTextSearch = () => {
    if (props.enterSearchText && valueTextSearchOld !== valueTextSearch.trim()) {
      setValueTextSearchOld(valueTextSearch.trim());
      props.enterSearchText(valueTextSearch.trim());
    }
  }
  const onClickIConSearch = () => {
    if (props.enterSearchText) {
      setValueTextSearchOld(valueTextSearch.trim());
      props.enterSearchText(valueTextSearch.trim());
    }
  }

  const renderRegistrationOption = () => {
    return (
      <div className="box-select-option activity">
        <ul>
          <li><a onClick={onClickOpenModalCreateActivity}>{translate('activity.control.top.create-activity')}</a></li>
          <li><a>{translate('activity.control.top.import-activity')}</a></li>
        </ul>
      </div>
    )
  }

  const handleClickOutsideRegistration = (e) => {
    if (registerRef.current && !registerRef.current.contains(e.target)) {
      setShowRegistrationOption(false);
    }
  }

  const onClickOpenPopupSearch = (event) => {
    props.toggleOpenPopupSearch();
    event.preventDefault();
  };

  useEventListener('click', handleClickOutsideRegistration);

  /**
   * handle download activities
   */
  const onClickDownloadActivities = () => {
    const listId = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(props.listActivities, 'activityId');
    if(_.isNil(listId) || listId.length <= 0) {
      props.actionOnCanDownload && props.actionOnCanDownload();
    } else {
      props.handleDownloadActivities(props.listActivities);
    }
  }


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

  // const checkDisable = () => {
  //   if (props.modeDisplay === ScreenMode.DISPLAY) {
  //     return '';
  //   } else {
  //     return 'disable';
  //   }
  // };

  return <>
    <div className="control-top height-88">
      <div className="left">
        <div className="button-shadow-add-select-wrap" ref={registerRef}>
          {/* <button className="button-shadow-add-select" onClick={onClickOpenModalCreateActivity}>{translate('activity.control.top.create-activity')}</button> */}
          <a className={`button-shadow-add-select`} onClick={onClickOpenModalCreateActivity}>{translate('activity.control.top.create-activity')}</a>
          <span className="button-arrow" onClick={() => setShowRegistrationOption(!isToggleModalFormActivity)}></span>
          {isToggleModalFormActivity && renderRegistrationOption()}
        </div>
        {!props.isDraft &&
          <a className="icon-primary icon-import ml-4" onClick={onClickDownloadActivities} />
        }
      </div>
      <div className="right">
        {props.conDisplaySearchDetail ? (
          <div className="search-box-button-style">
            <button className="icon-search"><i className="far fa-search" /></button>
            <input type="text" placeholder={translate('activity.control.top.filter-condition')} />
            <button className="icon-fil" onClick={onClickOpenPopupSearch} />
            <div className="tag">
              {translate('activity.control.top.searching')}
              <button className="close" onClick={() => { setValueTextSearch(''); props.setConDisplaySearchDetail() }}>×</button>
            </div>
          </div>
        ) : (
            <div className="search-box-button-style">
              <button className="icon-search" onClick={onClickIConSearch}><i className="far fa-search" /></button>
              <input type="text" placeholder={translate('activity.control.top.filter-condition')}
                onBlur={onBlurTextSearch}
                onChange={(e) => setValueTextSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onClickIConSearch()
                  }
                }}
                value={valueTextSearch}
              />
              <button className="icon-fil" onClick={onClickOpenPopupSearch} />
            </div>)
        }
        <a className="icon-small-primary icon-help-small" onClick={props.toggleOpenHelpPopup} />
        {isAdmin && <a className={`icon-small-primary icon-setting-small ${isAdmin ? "" : "disable"} `} onClick={() => { handleOpenPopupSetting() }} />}
        {onOpenPopupSetting &&
          <PopupMenuSet dismissDialog={dismissDialog} />
        }
      </div>
    </div>
  </>
})

const mapStateToProps = ({ activityListReducerState, authentication }: IRootState) => ({
  openModalFormActivity: activityListReducerState.openModalFormActivity,
  openModalConfirmRestoreDraff: activityListReducerState.openModalConfirmRestoreDraff,
  listActivities: activityListReducerState.listActivities,
  authorities: authentication.account.authorities
});

const mapDispatchToProps = {
  onclickShowConfirmRestoreDraft,
  handleTogglePopupSearchCondition,
  onclickShowModalActivityForm,
  handleInitDataActivityLayout,
  handleDownloadActivities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

const options = { forwardRef: true };
export default connect<StateProps, DispatchProps, IActivityControlTopProp>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(ActivityControlTop);

