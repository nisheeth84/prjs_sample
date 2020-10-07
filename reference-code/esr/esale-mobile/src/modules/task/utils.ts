
import { translate } from "../../config/i18n";
import { messages } from "./task-detail/task-detail-messages";
import { Task, FieldInfo } from "./task-repository";
import {
    StatusBar,
    Platform,
    Dimensions,
    Clipboard,
    Alert
} from "react-native";
import { EnumLanguage } from "../../config/constants/enum-language";
import { SpaceLanguage } from "../../config/constants/space-language";
import { EnumFmDate } from "../../config/constants/enum-fm-date";
import { checkEmptyString } from "../../shared/util/app-utils";
import { TEXT_EMPTY } from "../../config/constants/constants";

export enum EnumTaskStatus {
    notStart,
    doing,
    done
}

/**
 * check task status
 * @param status 
 */

export const checkTaskStatus = (status: number) => {
    switch (status) {
        case 1:
            return EnumTaskStatus.notStart
        case 2:
            return EnumTaskStatus.doing
        case 3:
            return EnumTaskStatus.done
        default:
            return EnumTaskStatus.notStart;
    }
}

/**
 * get task status string
 * @param status 
 */

export const getTaskStatusString = (status: number) => {
    switch (status) {
        case 1:
            return translate(messages.taskNotStart);
        case 2:
            return translate(messages.taskDoing);
        case 3:
            return translate(messages.taskDone);
        default:
            return translate(messages.taskNotStart);
    }
}

/**
 * get task public string
 * @param status 
 */

export const getTaskPublicString = (isPublic: number) => {
    switch (isPublic) {
        case 1:
            return translate(messages.taskPublic);
        case 2:
            return translate(messages.taskNotPublic);
        default:
            return translate(messages.taskNotPublic);
    }
}

/**
 * get first
 */

export const getFirstItem = (arr: Array<any>) => {
    return (arr || []).length > 0 ? arr[0] : undefined;
}

/**
 * Check task and all subtask complete
 * @param task, isCheckTaskComplete
 */

export const checkTaskAndSubTaskComplete = (task: any, isCheckTaskComplete: boolean) => {

    let check = true;

    if (task == undefined) {
        check = false;
    }

    if (isCheckTaskComplete && checkTaskStatus(task.statusTaskId) != EnumTaskStatus.done) {
        check = false;
    }

    if ((task.subtasks || []).length > 0) {
        task.subtasks.forEach((value: any) => {
            if (!checkTaskAndSubTaskComplete(value, true)) {
                check = false;
            }
        });
    }

    return check;
}

export interface Change {
    new: any,
    old: any,
}

export interface ChangeHistory {
    id: number,
    name: string,
    change: Change,
}

export interface ParentChangeHistory {
    changeHistory: Array<ChangeHistory>,
    maxLength: number,
}


/**
 * get space language
 * @param language 
 */
export const getSpaceLanguage = (language: EnumLanguage = EnumLanguage.japanese) => {
    switch (language) {
        case EnumLanguage.japanese:
            return SpaceLanguage.spaceJP;
        case EnumLanguage.english:
            return SpaceLanguage.normalSpace;
        default:
            return SpaceLanguage.spaceJP;
    }
}

/**
 * get format data history
 * @param data , language
 */

export const formatDataHistory = (data: string, fieldInfoArray: Array<FieldInfo>, language: EnumLanguage = EnumLanguage.japanese) => {
    let changeHistory: Array<ChangeHistory> = [];
    let maxLength = 0;
    let count = 0;
    data = JSON.parse(data);
    Object.entries(data).forEach((value: any) => {
        let fieldInfo = getFieldInfo(fieldInfoArray, value[0]);
        let name = getFieldLabelFormat(fieldInfo.fieldLabel, language);
        if (name?.length > maxLength) {
            maxLength = name?.length;
        }
        changeHistory.push({
            id: count++,
            name: name,
            change: value[1]
        });
    });
    // let space = getSpaceLanguage(language);
    // changeHistory = changeHistory.map((value) => {
    //     let rpString = repeatString(space, maxLength - value?.name?.length)
    //     return {
    //         id: value?.id,
    //         name: value?.name + rpString,
    //         change: value?.change
    //     }
    // });
    let result: ParentChangeHistory = {
        changeHistory: changeHistory,
        maxLength: maxLength
    }
    return result
}

/**
 * get status bar height
 */

export const getStatusBarHeight = () => {
    return (Platform.OS === 'android' && StatusBar != undefined) ? (StatusBar.currentHeight ? -StatusBar.currentHeight : 0) : 0;
}

/**
 * get screen width
 */
export const getScreenWidth = () => {
    return Dimensions.get('window').width
}

/**
 * get screen height
 */
export const getScreenHeight = () => {
    return Dimensions.get('window').height
}

/**
 * get field info
 * @param fieldInfoArray 
 * @param fieldName 
 */

const getFieldInfo = (fieldInfoArray: Array<FieldInfo>, fieldName: string) => {
    let result: FieldInfo = {
        fieldId: 0,
        fieldName: fieldName,
        fieldLabel: fieldName,
        fieldType: 0,
        fieldOrder: 0
    };
    fieldInfoArray.forEach((value) => {
        if (fieldName == value.fieldName) {
            result = value;
            return;
        }
    });
    return result;
}

/**
 * get field label format
 * @param input, language 
 */

export const getFieldLabelFormat = (input: string, language: EnumLanguage = EnumLanguage.japanese) => {
    let name;

    try {
        const inputObject = JSON.parse(input);
        switch (language) {
            case EnumLanguage.japanese:
                name = inputObject.ja_jp;
                break;
            case EnumLanguage.english:
                name = inputObject.en_us;
                break;
            default:
                name = inputObject.ja_jp;
                break;
        }

    } catch (error) {
        name = input;
    }

    return name;
}

/**
 * repeat string
 * @param c 
 * @param count 
 */
export const repeatString = (c: string, count: number) => {
    if (count < 0) {
        return TEXT_EMPTY;
    }
    let str = new Array(count + 1).join(c);
    return str;
}


/**
 * get format date string 
 * @param input 
 */
export const getFormatDateTaskDetail = (input: string, format: EnumFmDate = EnumFmDate.YEAR_MONTH_DAY_JP) => {
    let moment = require("moment");

    if (checkEmptyString(input)) {
        return TEXT_EMPTY;
    }

    let data = moment(input).format(format);

    if (data == undefined || data == "Invalid date") {
        return TEXT_EMPTY;
    }
    return data;
}

/**
 * get week days
 * @param dayInput 
 */

export const getWeekdays = (dayInput: string) => {

    if (dayInput == undefined) {
        return TEXT_EMPTY;
    }

    let moment = require("moment");
    const dow = moment(dayInput, "YYYY-MM-DD hh:mm:ss").day();

    switch (dow) {
        case 0:
            return translate(messages.sunday);
        case 1:
            return translate(messages.monday);
        case 2:
            return translate(messages.tuesday);
        case 3:
            return translate(messages.wednesday);
        case 4:
            return translate(messages.thursday);
        case 5:
            return translate(messages.friday);
        case 6:
            return translate(messages.saturday);
        default:
            return translate(messages.sunday);
    }
}

export const convertYearMonthDayToSeconds = (input: string) => {
    let inputDate = new Date(input);
    let date = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    return date.getTime();
}

/**
 * check out of date
 * @param input 
 */
export const checkOutOfDate = (input: string) => {

    let inputDate = convertYearMonthDayToSeconds(input);
    let today = convertYearMonthDayToSeconds((new Date()).toDateString());

    return inputDate - today < 0;
}

/**
 * check task of milestone complete
 * @param array 
 */

export const checkTasKOfMilestoneComplete = (array: Array<Task>) => {
    let ok = true;
    (array || []).forEach(value => {
        if (checkTaskStatus(value.status) != EnumTaskStatus.done) {
            ok = false;
        }
    });
    return ok;
}

export const fieldTypeDetail: any = {
    "task_id": 5,
    "task_name": 9,
    "task_memo": 10,
    "task_operators.operator_id": 18,
    "task_employees.employee_name": 99,
    "start_date": 6,
    "finish_date": 6,
    "task_customer_id": null,
    "task_customer_name ": 99,
    "task_product_tradings.product_trading_id": null,
    "task_product_tradings.product_name": 99,
    "task_milestone_id": null,
    "task_milestone_name": 99,
    "task_files.file_name": 99,
    "task_status": 2,
    "is_public": 3,
    "subtasks.subtask_name": 99,
    "task_created_date": 7,
    "task_created_user": 99,
    "task_created_user_name": null,
    "task_updated_date": 7,
    "task_updated_user": 99,
    "task_updated_user_name": null,
}

export const fieldTypeAdd: any = {
    "task_id": 5,
    "task_name": 9,
    "task_memo": 10,
    "task_operators.operator_id": 18,
    "task_employees.employee_name": 99,
    "start_date": 6,
    "finish_date": 6,
    "task_customer_id": null,
    "task_customer_name ": 99,
    "task_product_tradings.product_trading_id": null,
    "task_product_tradings.product_name": 99,
    "task_milestone_id": null,
    "task_milestone_name": 99,
    "task_files.file_name": 99,
    "task_status": 2,
    "is_public": 3,
    "subtasks.subtask_name": 99,
    "task_created_date": 7,
    "task_created_user": 99,
    "task_created_user_name": null,
    "task_updated_date": 7,
    "task_updated_user": 99,
    "task_updated_user_name": null,
}

export const fieldTypeList: any = {
    "task_id": 99,
    "task_name": 99,
    "task_memo": 10,
    "task_operators.operator_id": 18,
    "task_employees.employee_name": 99,
    "start_date": 6,
    "finish_date": 6,
    "task_customer_id": 99,
    "task_customer_name ": 99,
    "task_product_tradings.product_trading_id": 99,
    "task_product_tradings.product_name": 99,
    "task_milestone_id": 99,
    "task_milestone_name": 99,
    "task_files.file_name": 99,
    "task_status": 2,
    "is_public": 3,
    "subtasks.subtask_name": 9,
    "task_created_date": 7,
    "task_created_user": 9,
    "task_created_user_name": 99,
    "task_updated_date": 7,
    "task_updated_user": 9,
    "task_updated_user_name": 99,
}

export const fieldTypeSearch: any = {
    "task_id": 5,
    "task_name": 9,
    "task_memo": 10,
    "task_operators.operator_id": 18,
    "task_employees.employee_name": 9,
    "start_date": 6,
    "finish_date": 6,
    "task_customer_id": 5,
    "task_customer_name ": 9,
    "task_product_tradings.product_trading_id": 5,
    "task_product_tradings.product_name": 9,
    "task_milestone_id": 17,
    "task_milestone_name": 17,
    "task_files.file_name": 11,
    "task_status": 2,
    "is_public": 3,
    "subtasks.subtask_name": 9,
    "task_created_date": 7,
    "task_created_user": 9,
    "task_created_user_name": null,
    "task_updated_date": 7,
    "task_updated_user": 9,
    "task_updated_user_name": null,
}