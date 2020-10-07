const initialState = {
  screenMoveInfo: {
    screenType: null,
    objectId: null,
    fieldBelong: null
  }
};

export const ACTION_TYPES = {
  MOVE_SCREEN: 'MOVE_SCREEN',
  RESET: 'RESET'
};

export type ScreenMoveState = Readonly<typeof initialState>;

export default (state: ScreenMoveState = initialState, action): ScreenMoveState => {
  switch (action.type) {
    case ACTION_TYPES.MOVE_SCREEN:
      return { screenMoveInfo: action.payload };
    case ACTION_TYPES.RESET:
      return initialState;
    default:
      return state;
  }
};

export const moveToScreen = (screenType, objectId, fieldBelong?: number) => ({
  type: ACTION_TYPES.MOVE_SCREEN,
  payload: { screenType, objectId, fieldBelong }
});

export const moveScreenReset = () => ({
  type: ACTION_TYPES.RESET
});
