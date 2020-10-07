import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from '@reduxjs/toolkit';

export interface Employees {
  employeeId: number;
  employeeName: string;
  employeeNameKana: string;
  employeeSurname: string;
  employeeSurnameKana: string;
  photoFileName: string;
  photoFilePath: string;
  participantType: string;
}

export interface ListMember {
  listMember: Employees[];
}

export interface ListMemberState {
  listMember: Employees[];
  initializeGroupModal: InitializeGroupModal | null;
}

export interface ListMemberPayload {
  listMember: ListMember[] | null;
}

export interface ListMemberReducers
  extends SliceCaseReducers<ListMemberState> {}

export interface ParticipantType {
  title: string;
  positionSelectParticipantType: number;
  dataMember: Employees[];
}

export interface Member {
  position: number;
}

export interface InitializeGroupModal {
  customFields: any;
  group: any;
  groupParticipants: any;
  groups: any;
  searchConditions: any;
}

const ListMemberSlice = createSlice<ListMemberState, ListMemberReducers>({
  name: 'group-add-list-member',
  initialState: {
    listMember: [],
    initializeGroupModal: {
      customFields: null,
      group: null,
      groupParticipants: null,
      groups: [],
      searchConditions: null,
    },
  },
  reducers: {
    setInitializeGroupModal(
      state,
      { payload }: PayloadAction<InitializeGroupModal>
    ) {
      if (payload) {
        state.initializeGroupModal = payload;
      }
    },
    setListMember(state, { payload }: PayloadAction<ListMember>) {
      const data = payload.listMember;
      if (data) {
        state.listMember = [...data];
      }
    },
    setParticipantType(state, { payload }: PayloadAction<ParticipantType>) {
      const data = state.listMember;
      data[payload.positionSelectParticipantType].participantType =
        payload.title;
      if (data) {
        state.listMember = [...data];
      }
    },
    removeMember(state, { payload }: PayloadAction<Member>) {
      const data = state.listMember;
      data.splice(payload.position, 1);
      if (data) {
        state.listMember = [...data];
      }
    },
  },
});

export const listMemberActions = ListMemberSlice.actions;
export default ListMemberSlice.reducer;
