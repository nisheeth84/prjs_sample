import _ from 'lodash';
import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';

export interface Timezone {
  timezoneId: number,
  timezoneShortName: string,
  timezoneName: string,
}

export interface Language {
  languageId: number,
  languageName: string,
  languageCode: string,
}

export interface InitializeFieldState {
  timezones : Timezone[],
  languages : Language[],
}

export interface InitializeFieldReducers extends SliceCaseReducers<InitializeFieldState> { }

export const initializeFieldSlice = createSlice<InitializeFieldState, InitializeFieldReducers>({
  name: 'initializeField',
  initialState: {
    timezones : [],
    languages : []
  },
  reducers: {
    setInitializeField(state, { payload }: PayloadAction<InitializeFieldState>) {
      state.timezones = payload.timezones;
      state.languages = payload.languages;
    }
  }
})

export const initializeFieldActions = initializeFieldSlice.actions;
export default initializeFieldSlice.reducer;
