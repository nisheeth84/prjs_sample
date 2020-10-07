import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import styles from "./style";
import { Images } from "../../config";
import CheckBoxCustom from "../../components/checkbox-custom/checkbox-custom";
import NavigationTop from "./contents/navigation-top";
import { EquipmentTypesType, ScheduleTypesType } from "../../api/get-local-navigation-type";
import { IScheduleTypes } from "./contents/plan-schedule";
import ComponentSuggest from "./contents/component-suggest";
import { translate } from "../../../../config/i18n";
import { messages } from "../../calendar-list-messages";
import { ACTION_LOCAL_NAVIGATION } from "../../constants";
import { AntDesign } from "@expo/vector-icons";
import { getEquipmentTypes } from "../../calendar-repository";
import { LanguageCode } from "../../../../config/constants/enum";

/**
 * interface IEquipment
 */
type IEquipment = {
  layout: number;
  handleLayout: (layout: number) => void;
  equipmentTypes: Array<EquipmentTypesType>;
  handleUpdateDynamic: (data: Array<ScheduleTypesType> | Array<EquipmentTypesType>, key: ACTION_LOCAL_NAVIGATION) => void;
}
/**
 * Equipment Tab component
 * @param layout
 * @param handleLayout
 * @param equipmentTypes
 * @param handleUpdateDynamic
 * @constructor
 */
const EquipmentScreen = ({ layout, handleLayout, equipmentTypes, handleUpdateDynamic }: IEquipment) => {
  /**
   * status check and action set check of component Equipment
   */
  const [isCheckEquipments, setCheckEquipments] = useState(true);
  /**
   * value equipment in form input
   */
  const [equipment, setEquipment] = useState('');
  /**
   * list Data of Component Suggest
   */
  const [listData, setListData] = useState<any>();

  const [equipmentTypesIn, setEquipmentTypes] = useState([])
  /**
   * get Equipment Types
   */
  useEffect(() => {
    getEquipmentTypes(false).then((response: any) => {
      setEquipmentTypes(response.data.equipmentTypes)
    }).catch((error)=>{console.log(error);
    })
  },[])
  /**
   * handle check button
   * @param flag
   * @param equipment
   */
  const handleCheck = (flag: boolean, equipment_: EquipmentTypesType | undefined) => {
    const draftEquipmentTypes = JSON.parse(JSON.stringify(equipmentTypes));
    if (equipment_ === undefined) {
      setCheckEquipments(flag);
      draftEquipmentTypes.forEach((item: EquipmentTypesType) => {
        item.isSelected = flag;
      })
    } else {
      let checkAll = true;
      draftEquipmentTypes.forEach((item: EquipmentTypesType) => {
        if (item.equipmentTypeId === equipment_.equipmentTypeId)
          if(flag){
            item.isSelected = 1;
          }
          else if(!flag){
            item.isSelected = 0;
          }
        if (!item.isSelected)
          checkAll = false;
      })
      setCheckEquipments(checkAll);
    }
    handleUpdateDynamic(draftEquipmentTypes, ACTION_LOCAL_NAVIGATION.EQUIPMENT)
  }

  /**
   * handle remove item equipment
   * @param index
   */
  const handleCloseItem = (index: number) => {
    const draftEquipmentTypes = JSON.parse(JSON.stringify(equipmentTypes));
    draftEquipmentTypes.splice(index, 1);
    handleUpdateDynamic(draftEquipmentTypes, ACTION_LOCAL_NAVIGATION.EQUIPMENT);
  }

  /**
   * handle change input data
   * @param dataInput
   */
  const handleChangeInput = (dataInput: string) => {
    const localeDraft = LanguageCode.JA_JP;
    if (dataInput) {
      setEquipment(dataInput);
      if (equipmentTypesIn) {
        const draftData = JSON.parse(JSON.stringify(equipmentTypesIn));
        draftData.forEach((item: EquipmentTypesType) => {
          if (typeof item.equipmentTypeName === 'string')
            item.equipmentTypeName = JSON.parse(item.equipmentTypeName);
        });
        const response = draftData.filter((item: EquipmentTypesType) => {
          if (typeof item.equipmentTypeName === 'object') {
            const check = item.equipmentTypeName[localeDraft]?.indexOf(dataInput);
            if (check >= 0)
              return item;
          }
          return null;
        }).map((item: EquipmentTypesType) => {
          return {
            ...item,
            equipmentTypeName: item?.equipmentTypeName[localeDraft],
          }
        });
        response.length ? setListData(response) : setListData('');
      } else {
        setListData('CALL API ERROR');
      }
    } else {
      setEquipment('');
      setListData('');
    }
  }

  /**
   * insert item when select item
   * @param item
   */
  const insertItem = (item: EquipmentTypesType | IScheduleTypes) => {
    setListData(undefined);
    setEquipment('');
    const draftEquipmentsTypes = JSON.parse(JSON.stringify(equipmentTypes));
    draftEquipmentsTypes.push(item);
    handleUpdateDynamic(draftEquipmentsTypes, ACTION_LOCAL_NAVIGATION.EQUIPMENT);
  }

  useEffect(()=>{
    const filter_zero = equipmentTypes.filter(arr => arr.isSelected === 0)
    const filter_false = equipmentTypes.filter(arr => !arr.isSelected)
    if(equipmentTypes.length === 0){
      setCheckEquipments(true)
    }
    else if(filter_zero.length === 0 && filter_false.length === 0 ){
      setCheckEquipments(true)
    }
  },[])
  return (
    <View style={styles.content_navigation}>
      <NavigationTop handleLayout={handleLayout} layout={layout} />
      <View style={styles.content_checkbox}>
        <View style={styles.ContentSmall}>
            <View style={styles.inputContainer}>
              <TextInput
                style={equipment.length > 0 ? styles.inputSearchTextData : styles.inputSearchText}
                placeholder="会議室・設備を追加"
                placeholderTextColor="#989898"
                defaultValue={equipment}
                onChangeText={(dataInput) => handleChangeInput(dataInput)}
              />
              <View style={styles.textSearchContainer}>
                {equipment.length > 0 && (
                  <TouchableOpacity onPress={() => {
                    setEquipment("");
                    setListData("");
                  }}>
                    <AntDesign name="closecircle" style={styles.iconDelete} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <ComponentSuggest
              listData={listData}
              typeComponent={ACTION_LOCAL_NAVIGATION.EQUIPMENT}
              insertItem={insertItem}
              dataScreen={equipmentTypes} />
            <View style={styles.checkboxParent}>
              <CheckBoxCustom
                background="#0F6EB5"
                borderColor="#0F6EB5"
                active={isCheckEquipments}
                isParent={true}
                handleCheck={handleCheck}
              />
              <Text style={[styles.textFontSize, styles.textCheckBox]}>
                {translate(messages.allEquipment)}
              </Text>
            </View>

            <View style={styles.checkBoxChild}>
              {
                Array.isArray(equipmentTypes) &&
                equipmentTypes.map((item, idx) => {
                  return <View style={[styles.flexD_row, styles.boxChild]} key={`equipment_${idx}`}>
                    <View style={styles.flexD_row}>
                      <CheckBoxCustom
                        background={"#0F6EB5"}
                        borderColor={"#0F6EB5"}
                        active={true}
                        handleCheck={handleCheck}
                        item={item}
                      />
                      <Text style={[styles.textFontSize, styles.marL]}>
                        {/* {item.equipmentTypeName} */}
                        {((item.equipmentTypeName).length > 20) ? (((item.equipmentTypeName).substring(0, 20 - 3)) + '...') : item.equipmentTypeName}
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
        </View>
      </View>
    </View>
  );
}

export default EquipmentScreen;