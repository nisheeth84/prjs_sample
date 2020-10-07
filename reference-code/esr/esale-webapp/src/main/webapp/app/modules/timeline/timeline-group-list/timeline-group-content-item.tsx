import React, { useState, useRef, useCallback, useEffect } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { translate } from 'react-jhipster';
import {
  handleToggleGroupDetail,
  handleGetTimelineGroupsOfEmployee,
  handleToggleGroupDetailOwner,
  handleAddFavoriteTimelineGroup,
  handleDeleteFavoriteTimelineGroup,
  handleGetTimelineGroups
} from '../timeline-reducer';
import { handleAddRequestToJoinGroup, handleDeleteRequestToJoinGroup } from '../timeline-common-reducer'
import ElementResizeListener from '../control/element-resize-listener';
import { TimelineGroupType } from '../models/get-timeline-groups-model';
import ShowDetailTooltip from '../control/timeline-content/show-detail-tooltip';
import { CommonUtil } from '../common/CommonUtil';
import { Link } from 'react-router-dom';
import { INVITE_TYPE } from '../common/constants'
import Popover from 'app/shared/layout/common/Popover';


type ITimelineGroupContentItemProp = StateProps & DispatchProps & {
  data: TimelineGroupType,
  isFavorite: boolean,
  isEnableShowDialog?: boolean,
  isFromModal?: boolean,
  isFromEmployeeDetail: boolean
}

const TimelineGroupContentItem = (props: ITimelineGroupContentItemProp) => {
  const [isFavorite, setIsFavorite] = useState(null);
  const wrapperRef = useRef(null);
  const [getAmountOfIcon, setAmountOfIcon] = useState(null);
  const [listIconMember, setListIconMember] = useState(null);
  const [flagRequest, setFlagRequest] = useState(false);
  // get userLoginId
  const userLoginId = CommonUtil.getUserLogin().employeeId;
  const imgRef = [];

  /**
   * setDefaultFlagRequest
   */
  const setDefaultFlagRequest = () => {
    let isActive = false
    if (props.data?.invites?.length > 0) {
      for (let index = 0; index < props.data?.invites.length; index++) {
        const e = props.data?.invites[index];
        if (e.inviteId === Number(userLoginId) && e.inviteType === 2 && e.status === 2) {
          isActive = true;
          break;
        }
        else if (e.inviteId !== Number(userLoginId)) {
          isActive = false;
        }
      }
    }
    setFlagRequest(isActive)
  }

  /**
   * Set icon member in group
   */
  const setIconMemberOfGroup = () => {
    if (props.data?.invites?.length > 0) {
      const listMember = [];
      props.data.invites.forEach((item) => {
        if (Number(item.status) === 1) {
          listMember.push(item);
        }
      })
      setListIconMember(listMember);
    }
  }

  /**
   * Resize per element
   */
  const handleAdaptResize = () => {
    if (wrapperRef.current) {
      const elmRect = wrapperRef.current.getBoundingClientRect();
      let amount = Math.floor((elmRect.width - 150) / 24);
      if (listIconMember?.length <= amount) {
        amount = Number(listIconMember?.length);
      }
      setAmountOfIcon(amount);
    }
  }

  const adaptResize = useCallback(() => {
    handleAdaptResize();
  }, []);

  useEffect(() => {
    handleAdaptResize();
    setIconMemberOfGroup();
    setDefaultFlagRequest();
  }, []);

  useEffect(() => {
    setIconMemberOfGroup();
    setDefaultFlagRequest();
  }, [props.data]);

  useEffect(() => {
    if (props.isFavorite === true) {
      setIsFavorite(!isFavorite);
    }
  }, []);

  /**
   * Handle set favorite group
   */
  const setFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      props.handleAddFavoriteTimelineGroup(props.data.timelineGroupId);
    }
    else {
      props.handleDeleteFavoriteTimelineGroup(props.data.timelineGroupId);
    }
  }

  /**
   * action render avatar group
   */
  const renderAvatarGroup = () => {
    if (props.data.imagePath) {
      return <>
        <img className="images-timeline-group" src={props.data.imagePath} alt=" " />
      </>
    } else {
      return <>
        <img className="images-timeline-group" src="../../../content/images/timeline/noimage.svg" alt=" " />
      </>
    }
  }

  /**
   * hide/show button add request
   */
  const displayOfButtonAddRequest = () => {
    let isShow = false
    if (props.data?.invites?.length > 0) {
      for (let index = 0; index < props.data?.invites.length; index++) {
        const e = props.data?.invites[index];
        if (e.inviteId === Number(userLoginId) && e.inviteType === 2 && e.status === 1) {
          return false;
        }
        else if (e.inviteType === 1 && e?.departments) {
          for (let i = 0; i < e.departments['employeeId'].length; i++) {
            const employeesOfDepartment = e.departments['employeeId'][i];
            if (employeesOfDepartment === Number(userLoginId)) {
              return false;
            }
          }
        }
        else {
          isShow = true;
        }
      }
    }
    return isShow;
  }

  useEffect(() => {
    if (props.dataListAddRequest.has(props.data.timelineGroupId)) {
      props.handleGetTimelineGroups({ sortType: props.sortType, timelineGroupIds: [] });
      setFlagRequest(true)
    }
  }, [props.countAddRequest])

  useEffect(() => {
    if (props.dataListDeleteRequest.has(props.data.timelineGroupId)) {
      setFlagRequest(false);
    }
  }, [props.countDeleteRequest])

  const handleClickButtonRequest = () => {
    if (flagRequest) {
      props.handleDeleteRequestToJoinGroup({ timelineGroupId: props.data.timelineGroupId, inviteId: Number(userLoginId), inviteType: INVITE_TYPE.EMPLOYEE });
    } else {
      props.handleAddRequestToJoinGroup(props.data.timelineGroupId);
    }
  }

  useEffect(() => {
    handleGetTimelineGroups({ sortType: props.sortType, timelineGroupIds: [] });
  }, [props.listEmployeeOfTimelineGroups])

  return (
    <div className="bg-white box_group" ref={wrapperRef}>
      <ElementResizeListener onResize={adaptResize} />
      <div className="group-item v2 d-flex">
        <div className="item-title">
          {renderAvatarGroup()}
        </div>
        <div className="item-content pl-2">
          <div className="text-top flex-wrap">
            {props.sortType === 1 &&
              <p className="font-size-12 mb-0">{translate('timeline.group.post-date')}: <span className="date">{CommonUtil.getJustDateTimeZone(props.data.changedDate)}</span></p>
            }
            {props.sortType !== 1 &&
              <p className="font-size-12 mb-0">{translate('timeline.group.registration-date')}: <span className="date">{CommonUtil.getJustDateTimeZone(props.data.createdDate)}</span></p>
            }

            {/* button favorite group */}
            {<button className="pb-2"
              onClick={() => setFavorite()}>
              {!isFavorite && <a className={`icon-small-primary icon-start`} />}
              {isFavorite && <a className={`icon-small-primary icon-start active`} />}
            </button>}

            {/* button add request to group */}
            {displayOfButtonAddRequest() &&
              <button className={`button-primary button-activity-registration font-size-12 color: #666 ${flagRequest ? 'active' : ''}`}
                onClick={() => { handleClickButtonRequest() }} onMouseDown={e => e.preventDefault()}>
                {translate('timeline.group.participate')}
              </button>
            }
          </div>
          {/* timeline group name */}
          <div className="text-mid">

            {<h1 className=" font-size-18 text-blue text-over text-ellipsis overflow-menu mb-0">
              <Link className="d-inline-block text-ellipsis max-calc66" to={`/timeline/channel/detail/${props.data.timelineGroupId}`}>
                <Popover x={-20} y={25}>
                  {props.data.timelineGroupName}
                </Popover>
              </Link>
            </h1>
            }
          </div>
          {/* comment in group */}
          <div className="text-bottom mt-2">
            <p className="color-333 font-size-12 text-over text-ellipsis">
              <Popover x={-20} y={25}>
                {props.data.comment}
              </Popover>
            </p>
          </div>
        </div>
      </div>

      {/* icon member + click = view member */}
      <div className="icon-box text-right mt-1 item">
        {
          listIconMember?.length > 0 && listIconMember.slice(0, getAmountOfIcon).map((item, index) => {
            return <ShowDetailTooltip data={item} key={`tooltip_detail_${props.data.timelineGroupId}_${item.inviteId}_${index}`} position="left" isModal={props.isFromModal} />
          })
        }
        {/* hover to show info of member not display in list icon member */}
        {listIconMember?.length > getAmountOfIcon &&
          <span className="more-user show-list-item mr-1">
            {listIconMember.length - getAmountOfIcon + "+"}
            <div className="form-group">
              <ul className="drop-down width-200 location-r0 mr-n4 pb-0">
                {listIconMember?.length > 0 && listIconMember.slice(getAmountOfIcon, listIconMember.length).map((e, _idx) => {
                  return <>
                    <li className="item smooth d-flex align-item-center" key={`tooltip_details_${e.inviteId}_${_idx}`}>
                      <ShowDetailTooltip data={e} position="right" isListEmployee={true} isModal={props.isFromModal} />
                      <span className="text-blue ml-1 text-ellipsis text-left-employee">{e.inviteName}</span>
                    </li>
                  </>
                })
                }
              </ul>
            </div>
          </span>
        }
        {!props.isFromEmployeeDetail &&
          <button className="view-member"
            onClick={() => { if (props.isEnableShowDialog) props.handleGetTimelineGroupsOfEmployee(props.data.timelineGroupId); }}>
            <img className="mb-1" src="../../../content/images/ic-user.svg" />
          </button>
        }
      </div>
    </div>
  );
}

const mapStateToProps = ({ timelineReducerState, timelineCommonReducerState, applicationProfile }: IRootState) => ({
  sortType: timelineReducerState.sortType,
  toggleViewGroupDetail: timelineReducerState.toggleViewGroupDetail,
  timelineGroupInviteId: timelineReducerState.timelineGroupInviteId,
  dataListAddRequest: timelineCommonReducerState.dataListAddRequest,
  countAddRequest: timelineCommonReducerState.countAddRequest,
  dataListDeleteRequest: timelineCommonReducerState.dataListDeleteRequest,
  countDeleteRequest: timelineCommonReducerState.countDeleteRequest,
  tenant: applicationProfile.tenant,
  listEmployeeOfTimelineGroups: timelineReducerState.listEmployeeOfTimelineGroups
});

const mapDispatchToProps = {
  handleToggleGroupDetail,
  handleGetTimelineGroupsOfEmployee,
  handleToggleGroupDetailOwner,
  handleAddFavoriteTimelineGroup,
  handleDeleteFavoriteTimelineGroup,
  handleAddRequestToJoinGroup,
  handleDeleteRequestToJoinGroup,
  handleGetTimelineGroups
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineGroupContentItem);
