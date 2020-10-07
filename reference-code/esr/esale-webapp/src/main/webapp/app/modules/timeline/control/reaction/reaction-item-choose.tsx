import React, { useState } from 'react'
import { ReactionsType } from '../../models/get-user-timelines-type';
import { translate } from 'react-jhipster';
import { CommonUtil } from '../../common/CommonUtil';

type GroupIcon = {
  reactionType: string;
  listEmployee: ReactionsType[];
}

type IReactionItemChoose = {
  item: GroupIcon,
  reactionGroup: string,
  callBackCancelReaction:(listemp: ReactionsType[], icon)=> void
}

const ReactionItemChoose = (props: IReactionItemChoose) => {
  const [showReaction, setShowReaction] = useState(false)

  const handleClickCancelReaction = (listemp: ReactionsType[], icon) => {
    props.callBackCancelReaction(listemp, icon);
  }

  const checkUserInList = (listemp: ReactionsType[])=> {
    const employeeId = CommonUtil.getUserLogin().employeeId;
    return listemp.findIndex(x => x.employeeId.toString() === employeeId.toString()) >= 0;
  }
  
  const renderListEmployee = (list: ReactionsType[]) => {
    if (!showReaction) return <></>
    return (
      <div className="box-select-option box-select-option-custome box-select-option-user-choose-reaction width-200">
        <ul>
          {checkUserInList(list) &&
            (
              <li>
                <a>
                  <span className="font-size-10 color-333 mb-1">
                    {translate('timeline.reaction.clickFunction')}
                    <br />
                    {translate('timeline.reaction.cancel')}
                  </span>
                </a>
              </li>
            )
          }
          {list.map(item => {
            return (
              <li key={`employee${item.employeeId}`}>
                <a>
                  <div className="mission-wrap">
                    <div className="item d-flex">
                      {item.employeePhoto ? (<div className="avatar-thumb flex-24"><img className="object-fit-cover user" src={item.employeePhoto} alt=' ' /></div>) 
                      : (<div className="no-avatar green"> {item.employeeName ? item.employeeName.charAt(0) : ''} </div>) }
                      <span className="font-size-12 text-blue pr-2 text-ellipsis">{item.employeeName}</span>
                    </div>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  const renderItemReaction = () => {
    return (
      <div onClick={() => { handleClickCancelReaction(props.item.listEmployee, props.item.reactionType) }} key={`groupicon${props.item.reactionType}`} className="item-emotion position-relative mb-1" onMouseOver={() => { setShowReaction(true) }} onMouseOut={() => { setShowReaction(false); }}>
        <div className="image-emotion" >
          {props.reactionGroup !== '' && <img className="face" src={`../../../content/images/timeline/reaction/${props.reactionGroup}/${props.item.reactionType}.png`} />}
        </div>
        <span className="number-emotion">{props.item.listEmployee.length}</span>
        {renderListEmployee(props.item.listEmployee)}
      </div>
    )
  }

  return (
    renderItemReaction()
  );
}

export default ReactionItemChoose;
