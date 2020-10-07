import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { ReactionsType } from '../../models/get-user-timelines-type';
import { handleUpdateMapReaction, handleUpdateTimelinesReaction, handleGetFullListReaction } from './timeline-reaction-reducer'
import { IRootState } from 'app/shared/reducers';
import { CommonUtil } from 'app/modules/activity/common/common-util';
import ReactionItemChoose from './reaction-item-choose';

type IReactionListChoose = StateProps & DispatchProps & {
  reactionsSelecteds?: ReactionsType[];
  objectId: number,
  rootId: number
}

type GroupIcon = {
  reactionType: string;
  listEmployee: ReactionsType[];
}

const ReactionListChoose = (props: IReactionListChoose) => {
  const [mapListReaction, setMapListReaction] = useState<GroupIcon[]>([])
  // load deafult list reaction
  useEffect(() => {
    if (props.reactionsSelecteds && props.reactionsSelecteds.length > 0) {
      const mapReaction = new Map<string, ReactionsType[]>();
      props.reactionsSelecteds.forEach(x => {
        const list = mapReaction.get(x.reactionType) || [];
        list.push(x);
        mapReaction.set(x.reactionType, list);
      })
      props.handleGetFullListReaction();
      props.handleUpdateMapReaction(props.objectId, mapReaction);
    }
  }, [props.reactionsSelecteds])

  // listen map reaction change
  useEffect(() => {
    if (props.mapTimelineReaction) {
      const mapReaction = props.mapTimelineReaction.get(props.objectId);
      const listGroupIcon = [];
      if (mapReaction) {
        mapReaction.forEach((value, key) => {
          listGroupIcon.push({
            reactionType: key,
            listEmployee: value
          })
        })
      }
      setMapListReaction(listGroupIcon);
    }
  }, [props.mapTimelineReaction])

  const checkUserInList = (listemp: ReactionsType[])=> {
    const employeeId = CommonUtil.getUserLogin().employeeId;
    return listemp.findIndex(x => x.employeeId.toString() === employeeId.toString()) >= 0;
  }

  // double click reaction
  let timeout = null;
  const handleClickCancelReaction = (listemp: ReactionsType[], icon) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (checkUserInList(listemp)) {
        props.handleUpdateTimelinesReaction(props.objectId, props.rootId, icon);
      }
    }, 500);
  }

  const getGroupIcon = (icon) => {
    for (let i = 0; i < props.listReactionStore.length; i++) {
      const lst = props.listReactionStore[i].listEmoji.filter(item => item.id === icon);
      if (lst && lst.length > 0) {
        return lst[0]['type']
      }
    }
    return '';
  }

  const renderItemReaction = () => {
    return (
      <div className="list-emotion pt-2 flex-wrap-wrap">
      {
        mapListReaction.map((item) => {
          return <ReactionItemChoose item={item} reactionGroup={getGroupIcon(item.reactionType)} callBackCancelReaction={handleClickCancelReaction} key={`groupicon${item.reactionType}`} />
        })
      }
      </div>
    )
  }

  return (
    mapListReaction.length > 0 && renderItemReaction()
  );
}

const mapStateToProps = ({ timelineReactionReducerState }: IRootState) => ({
  listReactionStore: timelineReactionReducerState.listFullReaction,
  mapTimelineReaction: timelineReactionReducerState.mapTimelineReaction
})

const mapDispatchToProps = {
  handleUpdateMapReaction,
  handleUpdateTimelinesReaction,
  handleGetFullListReaction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactionListChoose);
