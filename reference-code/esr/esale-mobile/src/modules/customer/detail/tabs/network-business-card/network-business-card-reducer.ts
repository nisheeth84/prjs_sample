import { SliceCaseReducers, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DepartmentData,
  BusinessCardData,
  EmployeeData,
  MotivationData,
  TradingProductData,
  StandData,
  NetworkStandData,
  StandDataDepartment,
  ExtendDepartment
} from "./network-business-card-repository"
import { PositionType } from "../../enum";

export interface NetworkBusinessCardState {
  companyId: number;
  departments: Array<DepartmentData>;
  businessCardDatas: Array<BusinessCardData>;
  employeeDatas: Array<EmployeeData>;
  standDatas: Array<StandData>;
  motivationDatas: Array<MotivationData>;
  tradingProductDatas: Array<TradingProductData>;
  positionType: PositionType,
  networkStandDetail: NetworkStandData,
  extendDepartments: Array<ExtendDepartment>;
  motivationBusinessCard?: MotivationData;
}

export interface departmentsPayload {
  departments: Array<DepartmentData>
}

export interface businessCardDatasPayload {
  businessCarDatas: Array<BusinessCardData>
}

export interface EmployeeDatasPayload {
  employeeDatas: Array<EmployeeData>
}

export interface StandDatasPayload {
  standDatas: Array<StandData>
}

export interface MotivationDatasPayload {
  motivationDatas: Array<MotivationData>
}

export interface TradingProductDatasPayload {
  tradingProductDatas: Array<TradingProductData>
}

export interface DeleteNetworkStandDataPayload {
  departmentId: number;
  businessCardId: number;
}

export interface UpdateNetworkStandDataPayload {
  departmentId: number;
  businessCardId: number;
  stands: StandDataDepartment
}

export interface CreateNetworkStandDataPayload {
  departmentId: number;
  businessCardId: number;
  stands: StandDataDepartment
}

export interface updateExtendedDepartmentPayload {
  position: number
}

export interface motivationBusinessCardPayload {
  motivationId?: number
}

export interface NetworkBusinessCardReducer extends  SliceCaseReducers<NetworkBusinessCardState> {}

const networkBusinessCardSlice = createSlice<NetworkBusinessCardState, NetworkBusinessCardReducer>({
  name: "networkBusinessCard",
  initialState: {
    companyId: 0,
    departments: [],
    businessCardDatas: [],
    standDatas: [],
    employeeDatas: [], 
    motivationDatas: [],
    tradingProductDatas: [],
    positionType: PositionType.NOT_POSITION,
    networkStandDetail: {
      businessCardId: -1,
      stands: null
    },
    extendDepartments: []
  },
  reducers: {
    setCompanyId(state, { payload }: PayloadAction<number>) {
      state.companyId = payload;
    },
    setDepartments(state, { payload }: PayloadAction<departmentsPayload>) {
      state.departments = payload.departments;
    },
    setBusinessCarDatas(state, { payload }: PayloadAction<businessCardDatasPayload>) {
      state.businessCardDatas = payload.businessCarDatas;
    },
    setEmployeeDatas(state, { payload }: PayloadAction<EmployeeDatasPayload>) {
      state.employeeDatas = payload.employeeDatas;
    },
    setStandDatas(state, { payload }: PayloadAction<StandDatasPayload>) {
      state.standDatas = payload.standDatas;
    },
    setMotivationDatas(state, { payload }: PayloadAction<MotivationDatasPayload>) {
      state.motivationDatas = payload.motivationDatas;
    },
    setTradingProductDatas(state, { payload }: PayloadAction<TradingProductDatasPayload>) {
      state.tradingProductDatas = payload.tradingProductDatas;
    },
    deleteNetworkStandData(state, { payload }: PayloadAction<DeleteNetworkStandDataPayload>) {
      state.departments = state.departments.map((department) => {
        if (department.departmentId === payload.departmentId) {
          department.networkStands.forEach((networkStand) => {
            if (networkStand.businessCardId === payload.businessCardId) {
              networkStand.stands = null;
            }

            return networkStand;
          })
        }
        
        return department;
      });
    },
    updateOrAddNetworkStandData(state, { payload }: PayloadAction<any>) {
      state.departments = state.departments.map((department) => {
        if (department.departmentId === payload.departmentId) {
          department.networkStands.forEach((networkStand) => {
            if (networkStand.businessCardId === payload.businessCardId) {
              networkStand.stands = payload.stands;
            }
            return networkStand;
          })
        }
        return department;
      });
    },
    setPositionType(state, { payload }: PayloadAction<PositionType>) {
      state.positionType = payload;
    },
    setNetworkStandDetail(state, { payload }: PayloadAction<NetworkStandData>) {
      state.networkStandDetail = payload;
    },
    setExtendDepartments(state, { payload }: PayloadAction<departmentsPayload>) {
      state.extendDepartments = payload.departments.map((item) => {
        return {
          departmentId: item.departmentId,
          extended: true
        }
      })
    },
    handleDepartmentExtend(state, { payload }: PayloadAction<updateExtendedDepartmentPayload>) {
      let temp = state.extendDepartments[payload.position];
      temp.extended = !temp.extended;
      state.extendDepartments[payload.position] = temp;
    },
    setMotivationBusinessCard(state, { payload }: PayloadAction<motivationBusinessCardPayload>) {
      const motivationsList = state.motivationDatas.filter((motivation) => {
        return payload.motivationId === motivation.motivationId
      });
      state.motivationBusinessCard = motivationsList.length > 0 ? motivationsList[0] : undefined;
    }
  }
})

export const networkBusinessCardActions = networkBusinessCardSlice.actions;

export default networkBusinessCardSlice.reducer;
