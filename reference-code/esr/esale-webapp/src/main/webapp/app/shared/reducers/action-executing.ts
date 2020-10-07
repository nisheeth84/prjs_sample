export const ACTION_TYPES = {
  ACTION_EXECUTING: 'executing/ACTION',
  ACTION_EXECUTING_BOTTOM: 'executing/ACTION_BOTTOM'
};

export const LOCATION_EXECUTING = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM'
};

const initialState = {
  actionInfo: {
    executing: false,
    actionId: null
  },
  location: LOCATION_EXECUTING.TOP
};

export type ActionExecutingState = Readonly<typeof initialState>;

export default (state: ActionExecutingState = initialState, action): ActionExecutingState => {
  if (action.type === ACTION_TYPES.ACTION_EXECUTING) {
    // const actionInfo = {executing: false, actionId: null}
    // actionInfo.executing = action.payload.executing
    // actionInfo.actionId = action.payload.actionId
    return {
      actionInfo: action.payload,
      location: LOCATION_EXECUTING.TOP
    };
  } else if (action.type === ACTION_TYPES.ACTION_EXECUTING_BOTTOM) {
    return {
      actionInfo: action.payload,
      location: LOCATION_EXECUTING.BOTTOM
    };
  } else {
    return {
      ...state
    };
  }
};

export const startExecuting = (actionId: string, checkExecuting?: boolean) => ({
  type: ACTION_TYPES.ACTION_EXECUTING,
  payload: { executing: checkExecuting, actionId } // TODO fix not click in detail screen
});

export const endExecuting = (actionId: string) => ({
  type: ACTION_TYPES.ACTION_EXECUTING,
  payload: { executing: false, actionId }
});

export const startExecutingBottom = (actionId: string, checkExecuting?: boolean) => ({
  type: ACTION_TYPES.ACTION_EXECUTING_BOTTOM,
  payload: { executing: checkExecuting, actionId }
});

export const endExecutingBottom = (actionId: string) => ({
  type: ACTION_TYPES.ACTION_EXECUTING_BOTTOM,
  payload: { executing: false, actionId }
});
