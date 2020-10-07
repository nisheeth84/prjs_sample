import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { ConnectionState } from "./connection-reducer";

export const connectionsSelector = createSelector(
  (state: RootState) => state.connection,
  (connection: ConnectionState) => connection
);