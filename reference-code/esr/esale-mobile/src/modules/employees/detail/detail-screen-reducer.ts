import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from '@reduxjs/toolkit';
import { ImageSourcePropType } from 'react-native';
import { Field, TabsInfo, Data } from '../employees-repository';

// customer
export interface Customer {
  name: string;
  address: string;
}

// business card
export interface BusinessCard {
  avatarUrl: any;
  name: string;
  role: string;
}

// calendars
export interface Job {
  name: string;
  time: string;
}

export interface Calendar {
  flag: boolean;
  day: string;
  data: Array<Job>;
}
// task
export interface Task {
  name: string;
  deadline: string;
  customerName: string;
  productName: string;
  personInCharge: string;
}

// trading product
export interface TradingProduct {
  name: string;
  completeDate: string;
  progress: string;
  amount: number;
}

// group
export interface Employee {
  linkAvatar: ImageSourcePropType;
  name: string;
}

interface Group {
  name: string;
  flagStar: boolean;
  title: string;
  createDate: string;
  bgc: string;
  listMember: Array<Employee>;
  isJoin: boolean;
}

// timeline
export interface TaskDetail {
  name: string;
  content?: string;
}
export interface Timeline {
  createdDate: string;
  createdUserImage: any;
  createdUserName: string;
  title: string;
  actionName: string;
  actionDescription: Array<TaskDetail>;
}

export interface EmployeeData {
  fields: Array<Field>;
  data: Data;
  tabsInfo: Array<TabsInfo>;
}

export interface DetailScreenState {
  employeeId: number;
  customers: Array<Customer>;
  cards: Array<BusinessCard>;
  calendars: Array<Calendar>;
  tasks: Array<Task>;
  tradingProducts: Array<TradingProduct>;
  groups: Array<Group>;
  timelines: Array<Timeline>;
  employeeData: EmployeeData;
  userId: number;
  employeeIdsList: Array<number>;
}

export interface SetEmployeeDataPayload {
  fields: Array<Field>;
  data: Data;
  tabsInfo: Array<TabsInfo>;
}

// business card action
export interface UpdateCardPayload {
  position: number;
  connection: BusinessCard;
}

export interface AddCardPayload {
  card: BusinessCard;
}

export interface DeleteCardPayload {
  position: number;
}

// calendars action
export interface ChangeStatusDropdownPayload {
  position: number;
}

// groups action
export interface ChangeStatusStarPayload {
  position: number;
}
export interface EmployeeIdPayload {
  employeeId: number;
}

export interface DetailScreenReducers
  extends SliceCaseReducers<DetailScreenState> { }

const DetailSlice = createSlice<DetailScreenState, DetailScreenReducers>({
  name: 'detail screen',
  // dummy data
  initialState: {
    userId: 1102,
    employeeId: 15,
    customers: [
      {
        name: '顧客A',
        address: '〒000-0000 東京都杉並区荻窪1-1-1 荻窪ビル5F',
      },
      {
        name: '顧客A',
        address: '〒000-0000 東京都杉並区荻窪1-1-1 荻窪ビル5F',
      },
      {
        name: '顧客A',
        address: '〒000-0000 東京都杉並区荻窪1-1-1 荻窪ビル5F',
      },
    ],
    cards: [
      {
        avatarUrl: require('../../../../assets/frame.png'),
        name: '顧客 A / 顧客 A',
        role: '田中 太郎',
      },
      {
        avatarUrl: require('../../../../assets/frame.png'),
        name: '顧客 A / 顧客 A',
        role: '田中 太郎',
      },
      {
        avatarUrl: require('../../../../assets/frame.png'),
        name: '顧客 A / 顧客 A',
        role: '田中 太郎',
      },
    ],
    calendars: [
      {
        flag: true,
        day: '6月4日（月)',
        data: [
          {
            name: '顧客A 定期訪問',
            time: '10:00〜11:00',
          },
          {
            name: '顧客A 定期訪問',
            time: '11:00〜12:00',
          },
        ],
      },
      {
        flag: true,
        day: '6月5日（火）',
        data: [
          {
            name: '顧客A 定期訪問',
            time: '10:00〜11:00',
          },
          {
            name: '顧客A 定期訪問',
            time: '11:00〜12:00',
          },
        ],
      },
      {
        flag: true,
        day: '6月7日（木）',
        data: [
          {
            name: '顧客A 定期訪問',
            time: '10:00〜11:00',
          },
          {
            name: '顧客A 定期訪問',
            time: '11:00〜12:00',
          },
        ],
      },
    ],
    tasks: [
      {
        name: 'タスクA',
        deadline: '2019/10/10',
        customerName: '顧客A',
        productName: '商品A',
        personInCharge: '社員X',
      },
      {
        name: 'タスクA',
        deadline: '2019/10/10',
        customerName: '顧客A',
        productName: '商品A',
        personInCharge: '社員X',
      },
      {
        name: 'タスクA',
        deadline: '2019/10/10',
        customerName: '顧客A',
        productName: '商品A',
        personInCharge: '社員X',
      },
    ],
    tradingProducts: [
      {
        name: '商品A',
        completeDate: '2019/10/10',
        progress: 'アプローチ',
        amount: 50000,
      },
      {
        name: '商品A',
        completeDate: '2019/10/10',
        progress: 'アプローチ',
        amount: 50000,
      },
    ],
    groups: [
      {
        name: 'Group A',
        flagStar: true,
        title: 'グループA',
        createDate: '2020/05/01',
        bgc: '#ABE2C7',
        listMember: [
          {
            linkAvatar: require('../../../../assets/avatar_boss.png'),
            name: '1',
          },
          {
            linkAvatar: require('../../../../assets/avatar_boss.png'),
            name: '1',
          },
          {
            linkAvatar: require('../../../../assets/avatar_boss.png'),
            name: '1',
          },
          {
            linkAvatar: require('../../../../assets/avatar_boss.png'),
            name: '1',
          },
        ],
        isJoin: true,
      },
      {
        name: 'Group B',
        flagStar: false,
        title: 'グループB',
        createDate: '2020/05/01',
        bgc: '#ABE2C7',
        listMember: [
          {
            linkAvatar: require('../../../../assets/avatar_boss.png'),
            name: '1',
          },
          {
            linkAvatar: require('../../../../assets/avatar_boss.png'),
            name: '1',
          },
          {
            linkAvatar: require('../../../../assets/avatar_boss.png'),
            name: '1',
          },
          {
            linkAvatar: require('../../../../assets/avatar_boss.png'),
            name: '1',
          },
        ],
        isJoin: false,
      },
    ],
    timelines: [
      {
        createdDate: '2020/02/05 13:00',
        createdUserImage: require('../../../../assets/avatar_boss.png'),
        createdUserName: '営業 花子',
        title: 'Event 1',
        actionName: '顧客名を変更しました。',
        actionDescription: [
          {
            name: '株式会社サンプル → サンプル株式会社',
          },
        ],
      },
      {
        createdDate: '2020/02/04 12:00',
        createdUserImage: require('../../../../assets/avatar_boss.png'),
        createdUserName: '営業 花子',
        title: 'Event 1',
        actionName: '顧客名を変更しました。',
        actionDescription: [
          {
            name: 'eセールスマネージャーRemixを変更しました。',
            content:
              '単価：3,000 → 4,000 \nメモ：空白 → メモの内容が入ります。',
          },
          {
            name: '商品Aを変更しました。',
            content: '単価：3,000 → 4,000\nメモ：空白 → メモの内容が入ります。',
          },
        ],
      },
      {
        createdDate: '2020/02/04 12:00',
        createdUserImage: require('../../../../assets/avatar_boss.png'),
        createdUserName: '営業 花子',
        title: 'Event 1',
        actionName: '顧客名を変更しました。',
        actionDescription: [
          {
            name: 'eセールスマネージャーRemixを変更しました。',
            content:
              '単価：3,000 → 4,000 \nメモ：空白 → メモの内容が入ります。',
          },
          {
            name: '商品Aを変更しました。',
            content: '単価：3,000 → 4,000\nメモ：空白 → メモの内容が入ります。',
          },
        ],
      },
    ],
    employeeData: {
      fields: [],
      data: {
        employeeIcon: {
          fileName: 'test15',
          filePath: '',
          fileUrl: ''
        },
        employeeDepartments: [],
        employeeSurname: 'Fujiixxx123 test',
        employeeName: 'Aikoyyy',
        employeeSurnameKana: 'カナ',
        employeeNameKana: 'アイコ 123456',
        email: 'test15@gmail.com',
        telephoneNumber: '08-444-5555',
        cellphoneNumber: '444-555555',
        employeeManagers: [],
        employeeSubordinates: [],
        employeeStatus: 0,
        userId: '',
        languageId: 0,
        timezoneId: 0,
        updatedDate: '2020-04-21T04:40:02.492312Z',
        createDate: '2020-04-21T04:40:02.492312Z',
        formatDateId: 1,
        isAdmin: true,
        employeeData: [],
        employeePackages: [{
          packageId: 1,
          packageName: "abcdef"
        }],
      },
      tabsInfo: [],
    },
    employeeIdsList: [],
  },
  reducers: {
    setEmployeeId(state, { payload }: PayloadAction<EmployeeIdPayload>) {
      state.employeeId = payload.employeeId;
    },
    setEmplpoyeeData(
      state,
      { payload }: PayloadAction<SetEmployeeDataPayload>
    ) {
      const temp = state.employeeData;
      temp.data = payload.data;
      temp.fields = payload.fields;
      temp.tabsInfo = payload.tabsInfo;
      state.employeeData = temp;
    },
    updateCard(state, { payload }: PayloadAction<UpdateCardPayload>) {
      const newList = state.cards;
      newList[payload.position] = payload.connection;
      state.cards = newList;
    },
    addCard(state, { payload }: PayloadAction<AddCardPayload>) {
      const newList = state.cards;
      newList.push(payload.card);
      state.cards = newList;
    },
    deleteCard(state, { payload }: PayloadAction<DeleteCardPayload>) {
      state.cards = state.cards.filter(
        (_, index) => index !== payload.position
      );
    },
    changeStatusDropdown(
      state,
      { payload }: PayloadAction<ChangeStatusDropdownPayload>
    ) {
      const newList = state.calendars;
      newList[payload.position].flag = !newList[payload.position].flag;
      state.calendars = newList;
    },
    changeStatusStar(
      state,
      { payload }: PayloadAction<ChangeStatusStarPayload>
    ) {
      const newList = state.groups;
      newList[payload.position].flagStar = !newList[payload.position].flagStar;
      state.groups = newList;
    },
    addEmployeeIds(state, {payload}: PayloadAction<number>) {
      state.employeeIdsList.push(payload);
    },
    removeEmployeeIds(state, {payload}: PayloadAction<number>) {
      state.employeeIdsList = state.employeeIdsList.filter((item) => {
        return item != payload;
      })
    }
  },
});

export const DetailScreenActions = DetailSlice.actions;
export default DetailSlice.reducer;
