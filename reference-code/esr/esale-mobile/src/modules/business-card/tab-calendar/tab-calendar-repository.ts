import { AxiosRequestConfig } from "axios";
import { getDataForCalendarUrl, CALENDARS_API } from "../../../config/constants/api";
import { apiClient } from "../../../config/clients/api-client";

export interface DateList {
    date: string;
    perpetualCalendar: string;
    isHoliday: boolean;
    holidayName: string;
    isCompanyHoliday: boolean;
    companyHolidayName: string;
}
export interface EmployeeIds {
    employeeId: number;
}
export interface Customers {
    customerId: number;
    customerName: string;
}
export interface ProductTradings {
    productTradingId: number;
    productName: string;
}
export interface BusinessCards {
    businessCardId: number;
    businessCardName: string;
}
export interface ItemList {
    itemType: number;
    itemId: number;
    itemName: string;
    employeeIds: Array<EmployeeIds>;
    startDate: string;
    finishDate: string;
    itemIcon: string;
    isFullDay: boolean;
    isOverDay: boolean;
    isRepeat: boolean;
    scheduleRepeatId: number;
    scheduleTypeId: number;
    isPublic: boolean;
    isReportActivity: boolean;
    isParticipantUser: boolean;
    isDuplicate: boolean;
    milestoneStatus: string;
    taskStatus: string;
    participationDivision: string;
    attendanceDivision: string;
    customers: Array<Customers>;
    productTradings: Array<ProductTradings>;
    businessCards: Array<BusinessCards>;
    address: string;
}
export interface DataCalendarByList {
    dateFromData: string;
    dateToData: string;
    isGetMoreData: boolean;
    dateList: Array<DateList>;
    itemList: Array<ItemList>;
    countSchedule: number;
}
export interface CalendarByList {
    businessCardIds: Array<number>;
}
export interface CalendarByListResponse {
    data: DataCalendarByList;
    status: number;
}
export const getDataForCalendarByList = async (
    payload: CalendarByList,
    config?: AxiosRequestConfig
): Promise<CalendarByListResponse> => {
    try {
        const response = await apiClient.post(
            CALENDARS_API.getDataForCalendarByList,
            payload,
            config
        );
        return response;
    } catch (error) {
        return error.response;
    }
};

// api getDataForCalendarByDay
export interface DataForCalendarByDayPayload {
    businessCardIds: Array<number>;
}

export interface DataForCalendarByDayDataResponse {
  itemList: any[];
}

export interface DataForCalendarByDayResponse {
    data: DataForCalendarByDayDataResponse;
    status: number;
}

export const getDataForCalendarByDay = async (
    payload: DataForCalendarByDayPayload,
    config?: AxiosRequestConfig
): Promise<DataForCalendarByDayResponse> => {
    try {
        const response = await apiClient.post(
            CALENDARS_API.getDataForCalendarByDay,
            payload,
            config
        );
        return response;
    } catch (error) {
        return error.response;
    }
};
