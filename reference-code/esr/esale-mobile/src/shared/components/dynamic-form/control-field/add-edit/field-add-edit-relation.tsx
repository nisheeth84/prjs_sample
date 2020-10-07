import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { TEXT_EMPTY, FIELD_LABLE } from '../../../../../config/constants/constants';
import StringUtils from '../../../../util/string-utils';
import { useSelector } from 'react-redux';
import { authorizationSelector } from '../../../../../modules/login/authorization/authorization-selector';
import { DefineRelationSuggest, KeySearch } from '../../../../../config/constants/enum';
import { RelationEmployeeSuggest } from './relation/employee/employee-suggest-view';
import { ScrollView } from 'react-native-gesture-handler';
import { RelationCustomerSuggest } from './relation/customer/customer-suggest-view';
import { RelationTaskSuggest } from './relation/task/task-suggest-view';

// Define value props of FieldAddEditRelation component
type IFieldAddEditRelationProps = IDynamicFieldProps;

/**
 * Component for show organization selection fields
 * @param props see IEmployeeSuggestionsProps
 */
export function FieldAddEditRelation(props: IFieldAddEditRelationProps) {
  const { fieldInfo, data, fields } = props;
  const [dataViewSelected, setDataViewSelected] = useState([] as any);
  const authorizationState = useSelector(authorizationSelector);
  const languageCode = authorizationState?.languageCode ? authorizationState?.languageCode : TEXT_EMPTY;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode);
  const relationBelong = props.fieldInfo?.relationData?.fieldBelong ? props.fieldInfo?.relationData?.fieldBelong : TEXT_EMPTY;
  const formatRelation = props.fieldInfo?.relationData?.format ? props.fieldInfo?.relationData?.format : TEXT_EMPTY;

  const handleGetSearchValue = (value: any) => {
    setDataViewSelected(value);
  }

  useEffect(() => {
    const keyObject = { itemId: null, fieldId: fieldInfo.fieldId, fieldName: fieldInfo.fieldName };
    keyObject.itemId = props.elementStatus?.key;
    if (props.updateStateElement) {
      props.updateStateElement(keyObject, fieldInfo?.fieldType, dataViewSelected);
    }
  }, [dataViewSelected]);

  /**
   * Render the organization selection component 
   */
  const renderComponent = () => {
    return (
      <ScrollView>
        {/* 
          {relationBelong === DefineRelationSuggest.CUSTOMER && formatRelation === 2 &&
            <RelationCustomerSuggest
              typeSearch={formatRelation}
              fieldLabel={title}
              updateStateElement={handleGetSearchValue}
              defaultValue={DUMMMY_DEFAULT_VALUE}
            />
          }
          {relationBelong === DefineRelationSuggest.CUSTOMER && formatRelation === 1 &&
            <RelationCustomerSuggest
              typeSearch={formatRelation}
              fieldLabel={title}
              updateStateElement={handleGetSearchValue}
              defaultValue=""
            />
          }
          {relationBelong === DefineRelationSuggest.PRODUCT &&
            <RelationProductSuggest
              typeSearch={formatRelation}
              fieldLabel={title}
              updateStateElement={handleGetSearchValue}
            />
          }
          {relationBelong === DefineRelationSuggest.PRODUCT_TRADING &&
            <RelationProductTradingSuggest
              typeSearch={formatRelation}
              fieldLabel={title}
              updateStateElement={handleGetSearchValue}
            />
          }
          {relationBelong === DefineRelationSuggest.BUSINESS_CARD &&
            <RelationBussinessCardSuggest
              typeSearch={formatRelation}
              fieldLabel={title}
              updateStateElement={handleGetSearchValue}
            />
          }
          {relationBelong === DefineRelationSuggest.TASK &&
            <RelationTaskSuggest
              typeSearch={formatRelation}
              fieldLabel={title}
              updateStateElement={handleGetSearchValue}
            />
          }
          {relationBelong === DefineRelationSuggest.MILE_STONE &&
            <MilestoneSuggestView
              typeSearch={formatRelation}
              fieldLabel={title}
              updateStateElement={handleGetSearchValue}
            />
          } */}
        {relationBelong === DefineRelationSuggest.TASK &&
          <RelationTaskSuggest
            typeSearch={formatRelation}
            fieldLabel={title}
            fields={fields}
            fieldInfo={fieldInfo}
            updateStateElement={handleGetSearchValue}
          />
        }
        {relationBelong === DefineRelationSuggest.CUSTOMER &&
          <RelationCustomerSuggest
            typeSearch={formatRelation}
            fieldLabel={title}
            fields={fields}
            fieldInfo={fieldInfo}
            updateStateElement={handleGetSearchValue}
            initData={data}
          />
        }
        {relationBelong === DefineRelationSuggest.EMPLOYEE &&
          <RelationEmployeeSuggest
            typeSearch={formatRelation}
            groupSearch={KeySearch.EMPLOYEE}
            fieldLabel={title}
            fields={fields}
            updateStateElement={handleGetSearchValue}
            fieldInfo={fieldInfo}
            suggestionsChoice={data}
          />
        }
      </ScrollView>

    );
  }

  return renderComponent();
}