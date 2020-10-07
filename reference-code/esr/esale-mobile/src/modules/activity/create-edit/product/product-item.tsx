import React, { useState } from "react"
import { View, Image, Text } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { ActivityCreateEditStyle } from "../activity-create-edit-style"
import { Icon } from "../../../../shared/components/icon"
import { theme } from "../../../../config/constants"
import { normalize } from "../../../calendar/common"
import DrawerLeftStyles from "../../drawer/drawer-left-style"
import { TEXT_EMPTY, FIELD_LABLE } from "../../../../config/constants/constants"
import StringUtils from "../../../../shared/util/string-utils"
import { useSelector } from "react-redux"
import { authorizationSelector } from "../../../login/authorization/authorization-selector"
import { ActivityFormat } from "../../detail/activity-detail-reducer"
import ProductSuggestStyles from "./product-suggest-styles"
import { DynamicControlField } from "../../../../shared/components/dynamic-form/control-field/dynamic-control-field"
import { ControlType, DefineFieldType, TypeSelectSuggest, AvailableFlag } from "../../../../config/constants/enum"
import { FieldInfo } from "../../detail/activity-detail-reducer"
import _ from "lodash"
import { ProductTrading } from "../activity-create-edit-repository"
import { CommonUtil } from "../../common/common-util"
import { EmployeeSuggestView } from "../../../../shared/components/suggestions/employee/employee-suggest-view"

/**
 * Define product suggest item view
 */
export interface ProductSuggestionProps {
  productItem: any
  activityFormatId: number
  activityFormatList: Array<ActivityFormat>
  fieldInfoList: Array<FieldInfo>
  removeItem: (removeProduct: ProductTrading) => void
  onChangeInfoItem: (modifiedProduct: ProductTrading) => void
}

/**
 * component for show productTrading info
 * @param ProductSuggestionProps 
 */
export const ProductItem: React.FC<ProductSuggestionProps> = ({
  productItem,
  activityFormatId,
  activityFormatList,
  fieldInfoList,
  removeItem,
  onChangeInfoItem
}) => {
  // Status of collapse info of product
  const [isCollapse, setCollapse] = useState(false)

  /**
  * languageCode
  */
  const authorizationState = useSelector(authorizationSelector)
  const languageCode = authorizationState?.languageCode ?? TEXT_EMPTY

  /**
   * field info product trading list
   */
  const fieldInfoProductTrading = fieldInfoList
  /**
   * Check display for dynamic field
   */
  const isDisplayFieldInfo = (field: any): boolean => {
    if (!activityFormatId) {
      if (field.availableFlag < AvailableFlag.AVAILABLE_IN_APP) {
        return false
      } else {
        return true
      }
    } else {
      if (!field) {
        return false
      }
      if (field.fieldType === DefineFieldType.OTHER) {
        return false
      }
      let isDisplay: boolean = false
      activityFormatList.forEach((format: any) => {
        if (format.activityFormatId === activityFormatId) {
          if (format.productTradingFieldUse) {
            const data = JSON.parse(format.productTradingFieldUse)
            Object.keys(data).forEach(key => {
              if (Number(key) === field.fieldId && data[key] === 1) {
                isDisplay = true
              }
            })
          }
        }
      })
      return isDisplay
    }
  }

  /**
   * get default data 
   * @param item 
   */
  const getDataStatusControl = (item: any) => {
    if (!item) {
      return null
    }
    if (productItem) {
      let fieldValue
      if (item.isDefault) {
        fieldValue = productItem[StringUtils.snakeCaseToCamelCase(item.fieldName)]
      } else if (productItem["productTradingData"] !== undefined) {
        // extend field is in node "productTradingData"
        fieldValue = getExtendFieldValue(productItem["productTradingData"], item.fieldName)
      }

      if (fieldValue !== undefined) {
        const dataStatus = { ...item }
        dataStatus.fieldValue = fieldValue
        return dataStatus
      }
    }
    return null
  }

  /**
   * get extend field value
   * @param extendFieldList 
   * @param fieldName 
   */
  const getExtendFieldValue = (extendFieldList: any, fieldName: any) => {
    if (!extendFieldList) {
      return undefined
    }
    let retField: any = null
    extendFieldList.map((field: any) => {
      if (field.key === fieldName) {
        retField = field
      }
    })
    if (retField) {
      return retField.value
    }
    return undefined
  }

  /**
   * create new data field extend
   * @param item 
   * @param val 
   */
  const createExtItem = (item: any, val: any) => {
    const isArray = Array.isArray(val)
    const itemValue = isArray || (typeof val === "object") ? JSON.stringify(val) : val ? val.toString() : TEXT_EMPTY
    return {
      fieldType: item.fieldType.toString(),
      key: item.fieldName,
      value: itemValue
    }
  }

  /**
   * add extend field to list extend field
   * @param item 
   * @param val 
   * @param saveData 
   */
  const addExtendField = (item: any, val: any, saveData: any) => {
    let addItem: any = null
    if (item.fieldType.toString() === DefineFieldType.LOOKUP) {
      addItem = []
      let arrVal = []
      try {
        arrVal = _.isString(val) ? JSON.parse(val) : val
      } catch (e) {
        arrVal = []
      }
      arrVal.forEach((obj: any) => {
        addItem.push(createExtItem(obj.fieldInfo, obj.value))
      })
    } else {
      addItem = createExtItem(item, val)
    }
    if (Array.isArray(addItem)) {
      addItem.forEach(addIt => {
        addToProductTradingData(addIt, saveData)
      })
    } else {
      addToProductTradingData(addItem, saveData)
    }
  }

  /**
   * save data extend field list
   * @param addItem 
   * @param saveData 
   */
  const addToProductTradingData = (addItem: any, saveData: any) => {
    if (saveData["productTradingData"]) {
      let notInArray = true
      saveData["productTradingData"].map((e: any, index: number) => {
        if (e.key === addItem.key) {
          notInArray = false
          saveData["productTradingData"][index] = addItem
        }
      })
      if (notInArray) {
        saveData["productTradingData"].push(addItem)
      }
    } else {
      saveData["productTradingData"] = [addItem]
    }
  }

  /**
   * update value of dynamic field
   * @param item 
   * @param type 
   * @param val 
   */
  const updateStateField = (item: any, type: any, val: any) => {
    let fieldInfo: any = null
    fieldInfoProductTrading.forEach((field: any) => {
      if (field.fieldId.toString() === item.fieldId.toString()) {
        fieldInfo = field
      }
    })
    if (fieldInfo) {
      if (fieldInfo.fieldType.toString() === DefineFieldType.DATE || fieldInfo.fieldType.toString() === DefineFieldType.DATE_TIME) {
        val = CommonUtil.toTimeStamp(val)
      }
      if (_.isEqual(DefineFieldType.LOOKUP, _.toString(type))) {
        const valueLookup = _.isArray(val) ? val : _.toArray(val)
        valueLookup.forEach(e => {
          const idx = fieldInfoProductTrading.findIndex((o: FieldInfo) => o.fieldId === e.fieldInfo.fieldId)
          if (idx >= 0) {
            let field: any = fieldInfoProductTrading[idx]
            if (field.isDefault) {
              productItem[fieldInfoProductTrading[idx].fieldName] = e.value
            } else {
              addExtendField(field, e.value, productItem)
            }
          }
        })
      } else if (fieldInfo.isDefault) {
        productItem[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = forceNullIfEmptyString(fieldInfo, val)
      } else if (!fieldInfo.isDefault) {
        addExtendField(fieldInfo, val, productItem)
      }
    }
    onChangeInfoItem(productItem)
  }

  /**
   * languageId and timezoneId is Long
   * 
   * @param field 
   * @param val 
   */
  const forceNullIfEmptyString = (field: any, val: any) => {
    if (val === TEXT_EMPTY &&
      (field.fieldName === "language_id"
        || field.fieldName === "timezone_id"
        || field.fieldName === "telephone_number"
        || field.fieldName === "cellphone_number"
      )
    ) {
      return null
    }
    return val
  }

  const handleChangeEmployeeId = (value: any) => {
    productItem["employeeId"] = value
    onChangeInfoItem(productItem)
  }

  return (
    <View style={[ActivityCreateEditStyle.ActivityExtends, ActivityCreateEditStyle.Shopping]}>
      <View style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
        <TouchableOpacity style={[ActivityCreateEditStyle.CloseExtends]}
          onPress={() => { removeItem(productItem) }}>
          <Icon
            style={[ActivityCreateEditStyle.CloseImages]}
            name="close"
          />
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: normalize(10) }}>
        <View style={[ActivityCreateEditStyle.ShoppingTop]}>
          <View style={[ActivityCreateEditStyle.ShoppingImage]}>
            <Image
              source={{ uri: productItem?.productImagePath ? productItem?.productImagePath : TEXT_EMPTY }}
              style={{
                flex: 1,
                marginRight: theme.space[2],
              }}
            />
          </View>
          <View style={[ActivityCreateEditStyle.ShoppingInfo]}>
            <Text style={[ActivityCreateEditStyle.ShoppingText, ActivityCreateEditStyle.ShoppingTextSmall]}>
              {StringUtils.getFieldLabel(productItem, "productCategoryName", languageCode)}
            </Text>
            <Text style={[ActivityCreateEditStyle.ShoppingText, ActivityCreateEditStyle.ShoppingTextLarge, ActivityCreateEditStyle.colorActive]}>
              {productItem?.productName}
            </Text>
            <Text style={[ActivityCreateEditStyle.ShoppingText, ActivityCreateEditStyle.ShoppingTextSmall]}>
              {productItem?.memoProduct}
            </Text>
          </View>
        </View>
      </View>
      {(isCollapse &&
        <View style={[ActivityCreateEditStyle.ShoppingList]}>
          {
            fieldInfoProductTrading.map(field => {
              if (isDisplayFieldInfo(field)) {
                if (field.fieldName === "employee_id") {
                  return (
                    <View style={[ActivityCreateEditStyle.ShoppingItemNoFlexDirection]} key={field.fieldId}>
                      <EmployeeSuggestView
                        typeSearch={TypeSelectSuggest.SINGLE}
                        updateStateElement={(searchValue) => handleChangeEmployeeId(searchValue[0].employee.employeeId || null)}
                        fieldLabel={StringUtils.getFieldLabel(field, FIELD_LABLE, languageCode)}
                      />
                    </View>
                  )
                } else {
                  return (
                    <View style={[ActivityCreateEditStyle.ShoppingItemNoFlexDirection]} key={field.fieldId}>
                      <DynamicControlField
                        controlType={ControlType.ADD_EDIT}
                        fieldInfo={field}
                        updateStateElement={updateStateField}
                        elementStatus={getDataStatusControl(field)}
                      />
                    </View>
                  )
                }
              } else {
                return null
              }
            })
          }
        </View>
      )}
      <View >
        <TouchableOpacity style={ProductSuggestStyles.ExpandButton} onPress={() => setCollapse(!isCollapse)}>
          <Icon
            name={isCollapse ? "arrowUp" : "arrowDown"}
            style={DrawerLeftStyles.iconUpDown}
          ></Icon>
        </TouchableOpacity>
      </View>
    </View>
  )
}