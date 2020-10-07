import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { ControlType, DefineFieldType, DefineRelationSuggest } from '../../../../../config/constants/enum';
import { authorizationSelector } from '../../../../../modules/login/authorization/authorization-selector';
import StringUtils from '../../../../util/string-utils';
import { DynamicControlField } from '../dynamic-control-field';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { FieldSearchRelationStyles } from './field-search-styles';
import { Icon } from '../../../icon/icon';
import _ from 'lodash';

// Define value props of FieldSearchRelation component
type IFieldSearchTextProps = IDynamicFieldProps;

/**
 * Component for searching text fields
 * @param props see IDynamicFieldProps
 */
export function FieldSearchRelation(props: IFieldSearchTextProps) {
  const { fieldInfo } = props;
  const authorizationState = useSelector(authorizationSelector);
  const languageCode = authorizationState?.languageCode ? authorizationState?.languageCode : TEXT_EMPTY;
  const listFieldInfo = props?.listFieldInfo ? props?.listFieldInfo : [];
  const relationData = fieldInfo?.relationData;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode);
  const [listConditions, setListCondition] = useState<any[]>([]);
  /**
 * Get icon parameter 'fieldBelong'
 * @param belong fieldBelong
 */
  const getRelationIconSrc = (belong: number) => {
    let iconName;
    if (!belong) {
      belong = 0;
    }
    switch (belong) {
      case DefineRelationSuggest.CUSTOMER:
        iconName = "customer";
        break;
      case DefineRelationSuggest.EMPLOYEE:
        iconName = "employees";
        break;
      case DefineRelationSuggest.PRODUCT_TRADING:
        iconName = "productTrading";
        break;
      case DefineRelationSuggest.BUSINESS_CARD:
        iconName = "businessCard";
        break;
      case DefineRelationSuggest.PRODUCT:
        iconName = "commodity";
        break;
      case DefineRelationSuggest.TASK:
        iconName = "task";
        break;
      case DefineRelationSuggest.MILE_STONE:
        iconName = "milestoneRelation";
        break;
      default:
        break;
    }
    return iconName;
  };

  const checkEmptyValue = (value: any, isSearchBlank: boolean) => {
    return !isSearchBlank && _.isEmpty(value);
  };

  /**
   * Set value of props handleGetSearchValue
   */
  const handleGetSearchValue = (fieldInfo: any, _fileType: any, conditions: any) => {
    const currentFieldId = conditions.fieldId;
    const indexSearch = listConditions.findIndex((item: any) => {
      return item?.fieldId === currentFieldId;
    });
    if (indexSearch < 0) {
      if(!checkEmptyValue(conditions.fieldValue,conditions.isSearchBlank)) {
        listConditions.push(conditions);
      }
    } else {
      listConditions[indexSearch] = conditions;
    }
    if (props.updateStateElement) {
      if(listConditions.length > 0) {
        props.updateStateElement(fieldInfo, DefineFieldType.RELATION, listConditions);
      }
      setListCondition(listConditions);
    }
  }

  /**
   * Render the text component in search case
   */
  const renderSearchRelation = () => {
    const iconName = getRelationIconSrc(fieldInfo?.relationData?.fieldBelong);
    return (
      <View style={FieldSearchRelationStyles.relationDriver}>
        <View style={FieldSearchRelationStyles.relationLabelContainer}>
          <View style={FieldSearchRelationStyles.itemRelation}>
            <Icon name={iconName}
              style={FieldSearchRelationStyles.iconRelation} />
            <Text style={FieldSearchRelationStyles.relationLabel}>{title}</Text>
          </View>
        </View>
        <View >
          {
            listFieldInfo?.map((item: any, index: number) => {
              return (
                <View style={FieldSearchRelationStyles.relationItem} key={index}>
                  <DynamicControlField
                    controlType={ControlType.SEARCH}
                    fieldInfo={item}
                    updateStateElement={handleGetSearchValue} />
                </View>
              )
            })
          }
        </View>
      </View>
    );
  }
  return relationData ? renderSearchRelation() : <></>;
}

