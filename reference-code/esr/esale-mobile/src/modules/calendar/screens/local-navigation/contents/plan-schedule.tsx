import React, { useState, useEffect } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../style";
import { Images } from "../../../config";
import CheckBoxCustom from "../../../components/checkbox-custom/checkbox-custom";
import { EquipmentTypesType, ScheduleTypesType } from "../../../api/get-local-navigation-type";
import ComponentSuggest from "./component-suggest";
import { translate } from "../../../../../config/i18n";
import { messages } from "../../../calendar-list-messages";
import { ACTION_LOCAL_NAVIGATION } from "../../../constants";
import { AntDesign } from "@expo/vector-icons";
import { getScheduleTypes } from "../../../calendar-repository";

/**
 * interface plan schedule
 */
type IPlanSchedule = {
  scheduleTypes: Array<ScheduleTypesType>;
  handleUpdateDynamic: (
    data: Array<ScheduleTypesType>
      | Array<EquipmentTypesType>
    , key: ACTION_LOCAL_NAVIGATION) => void;
  task?: any;
  milestone?: any;
  handleUpdateStatic: (flag: boolean, type: ACTION_LOCAL_NAVIGATION) => void
}

/**
 * interface of schedule type
 */
export type IScheduleTypes = {
  scheduleTypeId?: number,
  scheduleTypeName?: any,
  iconType?: number,
  iconName?: string,
  iconPath?: string,
  isAvailable?: true,
  displayOrder?: number,
  isSelected?: any
}

/**
 * component plan schedule
 * @param scheduleTypes
 * @param handleUpdateDynamic
 * @param task
 * @param milestone
 * @param handleUpdateStatic
 * @constructor
 */
const PlanSchedule = ({ scheduleTypes, handleUpdateDynamic, task, milestone, handleUpdateStatic }: IPlanSchedule) => {
  /**
   * status show or hidden of component
   */
  const [isShow, setIsShow] = useState(true);
  /**
   * status check or unCheck 
   */
  const [isCheckedParent, setCheckedParent] = useState(true);
  /**
   * data input from form
   */
  const [schedule, setSchedule] = useState('');
  /**
   * list data
   */
  const [listData, setListData] = useState<any>();
  /**
   * locale
   */
  const localeDraft = 'ja_jp';
  /**
   * scheduleTypes
   */
  const [scheduleTypesIn, setScheduleTypes] = useState([])
  /**
   * load schedule type
   */
  useEffect(() => {
    getScheduleTypes().then((response) => {
      setScheduleTypes(response.data.scheduleTypes)
    })
  }, [])
  /**
   * handle check or unCheck checkbox in search Dynamic data
   * @param flag
   * @param ScheduleType
   */
  const handleChecked = (flag: boolean, ScheduleType: ScheduleTypesType | undefined) => {
    const draftScheduleTypes = JSON.parse(JSON.stringify(scheduleTypes));
    if (ScheduleType === undefined) {
      setCheckedParent(flag);
      draftScheduleTypes.forEach((item: ScheduleTypesType) => {
        if (flag) {
          item.isSelected = 1;
        }
        else if (!flag) {
          item.isSelected = 0;
        }
      })
    }
    else {
      let checkAll = true;
      draftScheduleTypes.forEach((item: ScheduleTypesType) => {
        if (item.scheduleTypeId === ScheduleType.scheduleTypeId)
          if (flag) {
            item.isSelected = 1;
          }
          else if (!flag) {
            item.isSelected = 0;
          }
        if (!item.isSelected)
          checkAll = false;
      })
      setCheckedParent(checkAll);
    }

    handleUpdateDynamic(draftScheduleTypes, ACTION_LOCAL_NAVIGATION.SCHEDULE);
  }

  /**
   * remove item 
   * @param index
   */
  const handleCloseItem = (index: number) => {
    const draftScheduleTypes = JSON.parse(JSON.stringify(scheduleTypes));
    draftScheduleTypes.splice(index, 1);
    handleUpdateDynamic(draftScheduleTypes, ACTION_LOCAL_NAVIGATION.SCHEDULE);
  }

  /**
   *  handle check or unCheck checkbox in search Static
   * @param flag
   * @param type
   */
  const handleCheckStatic = (flag: boolean, type: ACTION_LOCAL_NAVIGATION) => {
    handleUpdateStatic(flag, type);
  }

  // const { locale, changeLocale } = useI18N();
  /**
   * handle change input data
   * @param dataInput
   */
  const handleChangeInput = (dataInput: string) => {
    if (dataInput) {
      setSchedule(dataInput);
      const CALL_API_SUCCESS = true;
      if (CALL_API_SUCCESS) {
        scheduleTypesIn.forEach((item: IScheduleTypes) => {
          if (typeof item.scheduleTypeName === 'string')
            item.scheduleTypeName = JSON.parse(item.scheduleTypeName);
        });
        const response = scheduleTypesIn.filter((item: IScheduleTypes) => {
          if (typeof item.scheduleTypeName === 'object') {
            const check = item.scheduleTypeName[localeDraft].indexOf(dataInput);
            if (check >= 0)
              return item;
          }
          return null;
        }).map((item: IScheduleTypes) => {
          return {
            ...item,
            scheduleTypeName: item?.scheduleTypeName[localeDraft],
          }
        });
        response.length ? setListData(response) : setListData('');
      } else {
        setListData('CALL API ERROR');
      }
    } else {
      setSchedule('');
      setListData('');
    }
  }

  /**
   * insert item when select item
   * @param item
   */
  const insertItem = (item: IScheduleTypes | EquipmentTypesType) => {
    setListData(undefined);
    setSchedule('');
    const draftScheduleTypes = JSON.parse(JSON.stringify(scheduleTypes));
    draftScheduleTypes.push(item);
    handleUpdateDynamic(draftScheduleTypes, ACTION_LOCAL_NAVIGATION.SCHEDULE)
  }



  useEffect(() => {
    const result_zero = scheduleTypes.filter((type) => type.isSelected == 0);
    const result_false = scheduleTypes.filter((typeS) => !typeS.isSelected);
    if (scheduleTypes.length == 0) {
      setCheckedParent(true)
    }
    else if (result_zero.length == 0 && result_false.length == 0) {
      setCheckedParent(true)
    }
  }, [])

  return <View style={styles.content_checkbox}>
    <TouchableOpacity onPress={() => setIsShow(!isShow)}>
      <View style={styles.boxArrow}>
        <Image
          source={isShow ? Images.localNavigation.ic_up : Images.localNavigation.ic_down}
          style={styles.icon_up_down}
        />
        <Text style={[styles.textFontSize, styles.textBoxArrow]}>
          {translate(messages.typeSchedule)}
        </Text>
      </View>
    </TouchableOpacity>
    {isShow &&
      <View style={styles.ContentSmall}>
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              style={schedule.length > 0 ? styles.inputSearchTextData : styles.inputSearchText}
              placeholder="種別を追加"
              placeholderTextColor="#989898"
              defaultValue={schedule}
              onChangeText={(dataInput) => handleChangeInput(dataInput)}
            />
            <View style={styles.textSearchContainer}>
              {schedule.length > 0 && (
                <TouchableOpacity onPress={() => {
                  setSchedule('');
                  setListData('');
                }}>
                  <AntDesign name="closecircle" style={styles.iconDelete} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <ComponentSuggest
            listData={listData}
            typeComponent={ACTION_LOCAL_NAVIGATION.SCHEDULE}
            insertItem={insertItem}
            dataScreen={scheduleTypes} />
        </View>
        <View>
          <View style={styles.checkboxParent}>
            <CheckBoxCustom
              background={'#0F6EB5'}
              borderColor={'#0F6EB5'}
              active={isCheckedParent}
              isParent={true}
              handleCheck={handleChecked}
            />
            <Text style={[styles.textFontSize, styles.textCheckBox]}>
              {translate(messages.addNewItemSchedule)}
            </Text>
          </View>



          <View style={styles.checkBoxChild}>
            {
              Array.isArray(scheduleTypes) && scheduleTypes.map((item, idx) => {
                
                let require = <Image
                  source={Images.localNavigation.ic_chair}
                  style={styles.ic_checkbox}
                />
                const checkType = (data: any) => {
                  switch (data.iconType) {
                    case '0':
                      return null
                    case '1':
                      return <Image
                        source={Images.localNavigation.ic_person_red}
                        style={styles.ic_checkbox}
                      />
                    case '2':
                      return <Image
                        source={Images.localNavigation.ic_group_user}
                        style={styles.ic_checkbox}
                      />
                    case '3':
                      return <Image
                        source={Images.localNavigation.ic_phone}
                        style={styles.ic_checkbox}
                      />
                    case '4':
                      return <Image
                        source={Images.localNavigation.ic_bag}
                        style={styles.ic_checkbox}
                      />
                    case '5':
                      return <Image
                        source={Images.localNavigation.ic_chart}
                        style={styles.ic_checkbox}
                      />

                    case '6':
                      return <Image
                        source={Images.localNavigation.ic_chair}
                        style={styles.ic_checkbox}
                      />

                    case '7':
                      return <Image
                        source={Images.localNavigation.ic_text}
                        style={styles.ic_checkbox}
                      />
                    default:
                      return require;
                  }
                }
                return <View style={[styles.flexD_row, styles.boxChild]} key={`schedule_${idx}`}>
                  <View style={styles.flexD_row}>
                    <CheckBoxCustom
                      background={'#0F6EB5'}
                      borderColor={'#0F6EB5'}
                      active={true}
                      handleCheck={handleChecked}
                      item={item}
                    />
                    {/* <Image
                      source={Images.localNavigation.ic_person_red}
                      style={styles.ic_checkbox}
                    /> */}
                    {checkType(item)}
                    <Text style={[styles.textFontSize, styles.marL, styles.numberL]}>
                      {((item.scheduleTypeName).length > 20) ?
                        (((item.scheduleTypeName).substring(0, 20 - 3)) + '...') :
                        item.scheduleTypeName}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleCloseItem(idx)}>
                    <Image
                      source={Images.localNavigation.ic_close}
                      style={styles.ic_checkbox}
                    />
                  </TouchableOpacity>
                </View>
              })
            }
          </View>

          <View style={styles.checkboxParent}>
            <CheckBoxCustom
              background={'#0F6EB5'}
              borderColor={'#0F6EB5'}
              active={task === null ? true : !!task}
              type={ACTION_LOCAL_NAVIGATION.TASK}
              handleCheckStatic={handleCheckStatic}
            />
            <Image
              source={Images.localNavigation.ic_checklist}
              style={styles.ic_checkbox}
            />
            <Text style={[styles.textFontSize, styles.marL]}>{translate(messages.task)}</Text>
          </View>
          <View style={styles.checkboxParent}>
            <CheckBoxCustom
              background={'#0F6EB5'}
              borderColor={'#0F6EB5'}
              active={milestone === null ? true : !!milestone}
              type={ACTION_LOCAL_NAVIGATION.MILESTONE}
              handleCheckStatic={handleCheckStatic}
            />
            <Image
              source={Images.localNavigation.ic_flag}
              style={styles.ic_checkbox}
            />
            <Text style={[styles.textFontSize, styles.marL]}>{translate(messages.mileStone)}</Text>
          </View>
        </View>
      </View>
    }
  </View>
}

export default PlanSchedule;


// 6 : ic_chair
// 7 : ic_text