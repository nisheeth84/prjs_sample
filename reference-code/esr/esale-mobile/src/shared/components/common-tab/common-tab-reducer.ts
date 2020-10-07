import _ from 'lodash';
import { FieldInfo } from './interface';
import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";

export interface FieldInfosList {
  key: string,
  fieldInfos: FieldInfo[]
}

export interface CommonTabState {
  fieldInfosList: FieldInfosList[],
  extensionData:any
}

export interface CommonTabReducers extends SliceCaseReducers<CommonTabState> { }

const commonTabSlice = createSlice<CommonTabState, CommonTabReducers>({
  name: "commonTab",
  initialState: {
    fieldInfosList: [],
    extensionData:""
  },
  reducers: {
    setFieldInfos(state, { payload }: PayloadAction<{ key: string, fieldInfos: FieldInfo[] }>) {
      if (payload.fieldInfos.length > 0) {
        let tmp = _.cloneDeep(state.fieldInfosList)
        tmp.push({ key: payload.key, fieldInfos: payload.fieldInfos })
        const tmp2 = tmp.find(item => item.key === payload.key)
        if (tmp2) {
          tmp = tmp.filter(item => item.key !== payload.key)
          tmp.push({ key: payload.key, fieldInfos: payload.fieldInfos })
        } else {
          tmp.push({ key: payload.key, fieldInfos: payload.fieldInfos })
        }
        state.fieldInfosList = _.cloneDeep(tmp)
      } else {
        const tmp = _.cloneDeep(state.fieldInfosList).filter(item => item.key !== payload.key)
        state.fieldInfosList = _.cloneDeep(tmp)
      }
    },
    setExtensionData(state, { payload }: PayloadAction<{ extensionData: string}>) {
      if(payload.extensionData){
        state.extensionData = payload.extensionData;
      }

    }
  },

});

export const commonTabActions = commonTabSlice.actions;
export default commonTabSlice.reducer;
