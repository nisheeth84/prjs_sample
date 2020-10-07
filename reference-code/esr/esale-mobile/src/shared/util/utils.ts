import { EnumLanguage } from "../../config/constants/enum-language";
import { SpaceLanguage } from "../../config/constants/space-language";
import { Platform, Dimensions, StatusBar } from "react-native";

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
    case EnumLanguage.vietnam:
      return SpaceLanguage.normalSpace;
    default:
      return SpaceLanguage.spaceJP;
  }
}

/**
* get format data history
* @param data , language
*/

export const formatDataHistory = (data: string, fieldInfoArray: Array<any>, language: EnumLanguage = EnumLanguage.japanese) => {
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
  //   let rpString = repeatString(space, maxLength - value?.name?.length)
  //   return {
  //     id: value?.id,
  //     name: value?.name + rpString,
  //     change: value?.change
  //   }
  // });
  let result: ParentChangeHistory = {
    changeHistory: changeHistory,
    maxLength: maxLength
  }
  return result;
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

const getFieldInfo = (fieldInfoArray: Array<any>, fieldName: string) => {
  let result: any = {};
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
    return "";
  }
  let str = new Array(count + 1).join(c);
  return str;
}
