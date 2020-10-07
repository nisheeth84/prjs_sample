import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";

/**
 * Define milestone connection
 */
export interface Connection {
  companyName: string;
  tenantId: string;
  isDisable: boolean;
}
/**
 * Define milestone connection state
 */
export interface ConnectionState {
  connections: Array<Connection>;
  selectedConnectionIndex: number;
}
/**
 * Define milestone update connection payload
 */
export interface UpdateConnectionPayload {
  position: number;
  connection: Connection;
}
/**
 * Define milestone add connection payload
 */
export interface AddConnectionPayload {
  connection: Connection;
}
/**
 * Define milestone delete connection payload
 */
export interface DeleteConnectionPayload {
  position: number;
}

export interface ConnectionReducers
  extends SliceCaseReducers<ConnectionState> { }

const connectionSlice = createSlice<ConnectionState, ConnectionReducers>({
  name: "connection",
  initialState: {
    connections: [],
    selectedConnectionIndex: -1,
  },
  reducers: {
    update(state, { payload }: PayloadAction<UpdateConnectionPayload>) {
      const newList = state.connections;
      newList[payload.position] = payload.connection;
      state.connections = newList;
    },
    add(state, { payload }: PayloadAction<AddConnectionPayload>) {
      const newList = state.connections;
      newList.push(payload.connection);
      state.connections = newList;
    },
    delete(state, { payload }: PayloadAction<DeleteConnectionPayload>) {
      state.connections = state.connections.filter(
        (_, index) => index !== payload.position
      );
    },
    setSelectedConnectionIndex(state, { payload }) {
      state.selectedConnectionIndex = payload.position;
    },
  },
});

export const connectionActions = connectionSlice.actions;
export default connectionSlice.reducer;
