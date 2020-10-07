import {
  getFullListReaction,
  getRecentReactions,
  updateTimelineReaction
} from '../../common/service';
import { CommonUtil } from '../../common/CommonUtil';
import { ACTION_TYPES } from '../../common/constants';
import { GetRecentReactions } from '../../models/get-recent-reactions-model';
import { ReactionsType } from '../../models/get-user-timelines-type';
import _ from 'lodash';

const initialState = {
  listFullReaction: [],
  listRecentlyReactionStore: null,
  mapTimelineReaction: new Map<number, Map<string, ReactionsType[]>>(),
  checkLoadFull: false
};
export type TimelineReactionReducerState = {
  listFullReaction: any[];
  listRecentlyReactionStore: GetRecentReactions;
  mapTimelineReaction: Map<number, Map<string, ReactionsType[]>>;
  checkLoadFull: boolean;
};

export const actionGetNewMapReaction = (
  mapOld: Map<number, Map<string, ReactionsType[]>>,
  key: number,
  value: Map<string, ReactionsType[]>
) => {
  const mapTimelineReactionTemp = _.cloneDeep(mapOld);
  if (mapTimelineReactionTemp.has(key)) {
    mapTimelineReactionTemp.delete(key);
  }
  if (value.size > 0) {
    mapTimelineReactionTemp.set(key, value);
  }
  return mapTimelineReactionTemp;
};

export const getGroupUpdateReaction = (
  mapOld: Map<number, Map<string, ReactionsType[]>>,
  reaction: ReactionsType
) => {
  const mapTimelineReactionTemp = mapOld;
  let group = new Map<string, ReactionsType[]>();
  if (mapTimelineReactionTemp.has(reaction.timelineId)) {
    group = mapTimelineReactionTemp.get(reaction.timelineId);
  }
  let list: ReactionsType[] = [];
  if (group.has(reaction.reactionType)) {
    list = group.get(reaction.reactionType);
    group.delete(reaction.reactionType);
  }
  if (reaction.status === 1) {
    list.push(reaction);
  } else {
    const index = list.findIndex(
      x => x.employeeId === reaction.employeeId && x.reactionType === reaction.reactionType
    );
    list.splice(index, 1);
  }
  if (list.length !== 0) {
    group.set(reaction.reactionType, list);
  }
  return group;
};

export default (
  state: TimelineReactionReducerState = initialState,
  action
): TimelineReactionReducerState => {
  let result;

  // load full reaction
  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_FULL_LIST_REACTION,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        listFullReaction: response.data,
        checkLoadFull: false
      };
    }
  );
  if (result) return result;

  // load recent reaction
  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_RECENT_REACTIONS,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        listRecentlyReactionStore: response.data
      };
    }
  );
  if (result) return result;

  // update reaction
  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_UPDATE_TIMELINE_REACTION,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      const lstReaction: ReactionsType[] = response.data.reactionReaction;
      const groupNew = getGroupUpdateReaction(state.mapTimelineReaction, lstReaction[0]);
      return {
        ...state,
        mapTimelineReaction: actionGetNewMapReaction(
          state.mapTimelineReaction,
          lstReaction[0].timelineId,
          groupNew
        )
      };
    }
  );
  if (result) return result;

  /** handle synchronized action */
  if (action.type === ACTION_TYPES.TIMELINE_REACTION_UPDATE_MAP) {
    return {
      ...state,
      mapTimelineReaction: actionGetNewMapReaction(
        state.mapTimelineReaction,
        action.payload.timelineId,
        action.payload.reactions
      )
    };
  } else {
    return state;
  }
};

export const handleGetFullListReaction = () => async (dispatch, getState) => {
  if (
    !getState().timelineReactionReducerState.checkLoadFull &&
    (!getState().timelineReactionReducerState.listFullReaction ||
      (getState().timelineReactionReducerState.listFullReaction &&
        getState().timelineReactionReducerState.listFullReaction.length === 0))
  ) {
    await dispatch(getFullListReaction());
  }
};

export const handleGetRecentlyListReaction = () => async dispatch => {
  await dispatch(getRecentReactions(CommonUtil.getUserLogin().employeeId));
};

export const handleUpdateTimelinesReaction = (
  timelineId: number,
  rootId: number,
  reactionType: string
) => async dispatch => {
  await dispatch(updateTimelineReaction(timelineId, rootId, reactionType));
};

export const handleUpdateMapReaction = (
  _timelineId: number,
  _reactions?: Map<string, ReactionsType[]>
) => ({
  type: ACTION_TYPES.TIMELINE_REACTION_UPDATE_MAP,
  payload: {
    timelineId: _timelineId,
    reactions: _reactions
  }
});
