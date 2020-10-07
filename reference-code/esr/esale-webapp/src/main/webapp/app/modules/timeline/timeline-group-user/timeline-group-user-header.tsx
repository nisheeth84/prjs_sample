/**
 * Component for show timeline detail
 * @param userMode
 */
import React, { useEffect, useState, useCallback, useRef, useMemo} from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'

import { TimelineGroupType } from '../models/get-timeline-groups-model'
import { handleGetTimelineGroupsOfEmployee, handleGetTimelineGroups, handleToggleAddMemberToGroupModal } from '../timeline-reducer';
import TimelineGroupAddMember from '../timeline-group-detail/timeline-group-add-member';
import { GROUP_TIMELINE_MODE } from '../common/constants'
import { translate } from 'react-jhipster'
import ShowDetailToolTip from '../control/timeline-content/show-detail-tooltip';
import TimelineContentComment from '../control/timeline-content/timeline-content-comment';
import ElementResizeListener from '../control/element-resize-listener';

type ITimelineGroupUserHeaderProp = StateProps & DispatchProps & {
  // data to show group info
  data: TimelineGroupType;
  // user mode
  userMode?: number,
  comment: any;
}

const TimelineGroupUserHeader = (props: ITimelineGroupUserHeaderProp) => {
  // check group have request join
  const [isHaveInvite, setIsHaveInvite] = useState(null);
  const wrapperRef = useRef(null);
  const [getAmountOfIcon, setAmountOfIcon] = useState(null);
  // const [listIconMember, setListIconMember] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(0);

    /**
   * Set icon member in group
   */
  const listIconMember = useMemo(() => {
    if(props?.data?.invites?.length > 0){
      const listMember = [];
      props.data.invites.forEach((item) => {
        if(Number(item.status) === 1){
          listMember.push(item);
        }
      })
      return listMember;
    }
    return [];
  }, [props?.data])

  /**
   * Resize per element
   */
  const handleAdaptResize = (_listIconMember) => {
    if (wrapperRef.current) {
      const elmRect = wrapperRef.current.getBoundingClientRect();
      let amount = null;
      if(props.userMode !== GROUP_TIMELINE_MODE.MANAGER) {
        amount = Math.floor((elmRect.width - 160) / 26);
      } else {
        amount = Math.floor((elmRect.width - 130) / 24);
      }
      if (_listIconMember?.length <= amount) {
        amount = Number(_listIconMember?.length);
      }
      setAmountOfIcon(amount);
    }
  }
  const adaptResize = useCallback(() => {
    handleAdaptResize(listIconMember);
  }, [listIconMember]);

  /**
   * listen change settting
   */
  useEffect(() => {
    if(props.isChangeId) {
      setForceUpdate(forceUpdate+1);
    }
  }, [props.isChangeId])

  /**
   * function check is have request join
   */
  const checkHaveInvite = () => {
    let isInvite = false;
    if (props.listTimelineGroups && props.listTimelineGroups.length > 0 && props.listTimelineGroups[0].invites) {
      props.listTimelineGroups[0].invites.forEach(element => {
        if (element.status === 2) {
          isInvite = true;
        }
      });
      setIsHaveInvite(isInvite);
    }
  }

  // check have request join when change group
  useEffect(() => {
    checkHaveInvite();
    // setIconMemberOfGroup();
  }, [props.listTimelineGroups])

  useEffect(() => {
    handleAdaptResize(listIconMember);
    // setIconMemberOfGroup();
  }, [listIconMember]);

  /**
   * open add member to group modal
   */
  const openAddMemberModal = () => {
    props.handleGetTimelineGroups({ timelineGroupIds: [props.listTimelineGroups[0].timelineGroupId], sortType: 1 });
    props.handleToggleAddMemberToGroupModal(true);
  }

  /**
   * rebder byttib add member
   */
  const renderButtonAddMember = () => {
    return <>
      <button>
        <svg  xmlns="http://www.w3.org/2000/svg" width="24.052" height="24.052" viewBox="0 0 24.052 24.052">
          <g id="Group_2908" data-name="Group 2908" transform="translate(-10418.007 -1861.489)" onClick={() => { openAddMemberModal() }}>
            <circle id="Ellipse_114" data-name="Ellipse 114" cx={12} cy={12} r={12} transform="matrix(1, -0.002, 0.002, 1, 10418.007, 1861.541)" fill="#989898" />
            <g id="Group_2907" data-name="Group 2907">
              <rect id="Rectangle_1890" data-name="Rectangle 1890" width={10} height={2} rx={1} transform="translate(10431.033 1868.514) rotate(90)" fill="#fff" />
              <rect id="Rectangle_1891" data-name="Rectangle 1891" width={10} height={2} rx={1} transform="translate(10425.033 1872.515)" fill="#fff" />
            </g>
          </g>
        </svg>
      </button>
    </>
  }

  /**
   * action render avatar group
   */
  const renderAvatarGroup = () => {
    if (props.data?.imagePath) {
      return <img className="images-timeline-group" src={props.data?.imagePath} onError={(e) => {e.currentTarget.src = "../../../content/images/timeline/noimage.svg"}} />
    } else {
      return <>
        <img className="images-timeline-group" src="../../../content/images/timeline/noimage.svg" alt=" " />
      </>
    }
  }

  const [isFullText, setIsFullText] = useState(true);

  useEffect(() => {
    // on change text => effect display
    setIsFullText(true);
  }, [props.data]);

  /**
   * render comment
   */
  const renderComment = () => {
    return (
      <TimelineContentComment
      data={props.data?.comment ? props.data?.comment.replace(/\n/g, "<br />") : ''}
      isHighlight={false}
      textLabel={translate('timeline.timeline-group.btn-show-comment')}/>
    );
  }

  return <>
    {props.userMode === GROUP_TIMELINE_MODE.NOT_MEMBER && props.statusRequestJoin === true &&
      <div className="block-text-noico block-feedback-blue mb-2">
        {translate('messages.INF_TIM_0019')}
      </div>}
    {props.userMode === GROUP_TIMELINE_MODE.NOT_MEMBER && props.statusRequestJoin === false &&
      <div className="block-text-noico block-feedback-blue mb-2">
        {translate('messages.INF_TIM_0018')}
      </div>}
    {isHaveInvite && props.userMode === GROUP_TIMELINE_MODE.MANAGER &&
      <div className="block-feedback-blue v2 mb-2 p-3">{translate('timeline.timeline-group.have-invite-request', {0: props.data?.timelineGroupName})}
        <a onClick={() => { props.handleGetTimelineGroupsOfEmployee(props.listTimelineGroups[0].timelineGroupId); }}> {translate('timeline.timeline-group.text-request')}</a>
      </div>
    }
    <div className="background-img box_group mb-2" style={{backgroundImage: `url(${props.data?.imagePath ? props.data.imagePath : "../../../content/images/timeline/noimage.svg"})`}}>
      <div className="group-item d-flex">
        <div className="item-title">
          {renderAvatarGroup()}
        </div>
        <div className="item-content pl-2">
          <div className="text-mid">
            <h1 className="font-size-18 color-333 mt-2 mb-2">{props.data?.timelineGroupName}</h1>
          </div>
          <div className="text-bottom">
            {renderComment()}
          </div>
        </div>
      </div>
      <div className="icon-box text-right mt-1" ref={wrapperRef}>
        {/* {props.listTimelineGroups && props.listTimelineGroups[0]?.invites && props.listTimelineGroups[0]?.invites.map((item) => {
          if (item.authority && item.status === 1) {
            return <ShowDetailToolTip data={item} key={item.inviteId} position="right" />
          }
        }
        )} */}
        <ElementResizeListener onResize={adaptResize} />
        {
          listIconMember?.length > 0 && listIconMember.slice(0, getAmountOfIcon).map((item, index) => {
            return <ShowDetailToolTip data={item} key={item.inviteId} position="right" isListEmployee={true}/>
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
                    <li className="item smooth d-flex align-item-center">
                      <ShowDetailToolTip data={e} key={`group_details_${e.inviteId}`} position="right" isListEmployee={true}/>
                      <span className="text-blue ml-1 text-ellipsis text-left-employee">{e.inviteName}</span>
                    </li>
                  </>
                })
              }
              </ul>
            </div>
          </span>
        }

        <button className="mb-1 view-member"
          onClick={() => { props.handleGetTimelineGroupsOfEmployee(props.listTimelineGroups[0].timelineGroupId); }}>
          <img src="../../../content/images/ic-user.svg" />
        </button>
        {props.userMode === GROUP_TIMELINE_MODE.MANAGER && renderButtonAddMember()}
        {props.toggleAddMemberToTimelineGroup && <TimelineGroupAddMember timelineGroupIds={props.listTimelineGroups[0].timelineGroupId} data={props.listTimelineGroups[0].invites} />}
      </div>
    </div>
  </>
}

const mapStateToProps = ({ timelineReducerState, employeeDetailAction }: IRootState) => ({
  toggleAddMemberToTimelineGroup: timelineReducerState.toggleAddMemberToTimelineGroup,
  listTimelineGroups: timelineReducerState.listTimelineGroups,
  statusRequestJoin: timelineReducerState.statusRequestJoin,
  isChangeId: employeeDetailAction.idUpdate
});

const mapDispatchToProps = {
  handleGetTimelineGroupsOfEmployee,
  handleGetTimelineGroups,
  handleToggleAddMemberToGroupModal
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineGroupUserHeader);
