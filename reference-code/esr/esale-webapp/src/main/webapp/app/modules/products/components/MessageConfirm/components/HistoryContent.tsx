import React, { useMemo } from 'react';
import {
  HistoryItemDataType,
  FieldInfoType,
  fieldType99,
  FieldType99,
  StatementDataType,
  SpecialDataType
} from '../constants';
import * as R from 'ramda';
import { getFieldLabel } from 'app/shared/util/string-utils';
import StatementChange from './StatementChange';
import { translate } from 'react-jhipster';
import { filterDataNotNull } from 'app/shared/util/utils';
import { findFieldInfo, findComponent } from '../util';

interface IProps {
  data: Partial<HistoryItemDataType>;
  fieldInfo: FieldInfoType[];
  specialData?: SpecialDataType;
  fieldNameExtension?: string;
  isModalConfirm?: boolean;
  // sourceData?: {
  //   [key: string]: any[];
  // };
}


const HistoryContent: React.FC<IProps> = ({
  data,
  fieldInfo: fieldInfos,
  // sourceData,
  specialData,
  fieldNameExtension,
  isModalConfirm
}) => {


  const convertFieldType99ToCorrespondFieldAndValue = (
    fieldInfo: FieldInfoType,
    valueDataChange
  ) => {
    if (!valueDataChange.old && !valueDataChange.new && !R.is(Boolean, valueDataChange.new)) {
      throw new Error('data null');
    }
    const findFieldInfo99 = R.find(R.whereEq({ fieldName: fieldInfo.fieldName }));

    // const findSingleValue = (keyOfId, oldOrNew) =>
    //   R.find(R.whereEq({ [keyOfId]: Number(valueDataChange[oldOrNew]) }));

    const fieldType99Corespond: FieldType99 = findFieldInfo99(fieldType99);
    if (!fieldType99Corespond) {
      throw new Error('fieldType99Corespond not found');
    }

    if (!fieldType99Corespond.sourceProp) {
      return { ...fieldInfo, fieldType: fieldType99Corespond.fieldType };
    }

    // const listSourceData: any[] = sourceData[fieldType99Corespond.sourceProp];

    // const oldData = findSingleValue(fieldType99Corespond.keyOfId, 'old')(listSourceData);
    // const newData = findSingleValue(fieldType99Corespond.keyOfId, 'new')(listSourceData);
 

    return {
      ...fieldInfo,
      fieldType: fieldType99Corespond.fieldType,
      // old: getFieldLabel({ oldValue }, 'oldValue'),
      // new: getFieldLabel({ newValue }, 'newValue')
    };
  };

  // const isNumber = R.is(Number);
  // const isArrayNumber = R.tryCatch(
  //   R.and(R.is(Array), arr => arr.every(isNumber)),
  //   (err, value) => value
  // );

  // const getValuesFromFieldInfo = (itemIds, fieldInfo: FieldInfoType) => {
  //   const getValue = itemId =>
  //     R.compose(
  //       item => getFieldLabel(item, 'itemLabel'),
  //       R.find(R.whereEq({ itemId })),
  //       R.prop('fieldItems')
  //     )(fieldInfo);

  //   if (!fieldInfo.fieldItems || fieldInfo.fieldItems.length === 0) {
  //     return itemIds;
  //   }

  //   if (isNumber(itemIds) || itemIds === String(Number(itemIds))) {
  //     return getValue(Number(itemIds));
  //   }

  //   if (isArrayNumber(itemIds)) {
  //     return R.map(getValue, itemIds);
  //   }

  //   return itemIds;
  // };

  const convertExtendData = extendData => {
    if (!extendData) return [];
    const tmp = Object.entries(extendData).map(([fieldName, valueDataChange]: [string, any]) => {
      try {
        const fieldInfo: FieldInfoType = findFieldInfo(fieldName, fieldInfos);
        // const oldValue = getValuesFromFieldInfo(valueDataChange.old, fieldInfo);
        // const newValue = getValuesFromFieldInfo(valueDataChange.new, fieldInfo);
        const Component = findComponent(fieldInfo.fieldType);
        return {
          Component,
          ...(valueDataChange as object),
          ...fieldInfo,
          // new: newValue,
          // old: oldValue,
          fieldLabel: getFieldLabel(fieldInfo, 'fieldLabel')
        };
      } catch (error) {
        return null;
      }
    });
    return filterDataNotNull(tmp);
  };

  const convertNormalData = normalData => {
    const tmp = Object.entries(normalData).map(([fieldName, valueDataChange]: [string, any]) => {
      try {
        const fieldInfo: FieldInfoType = findFieldInfo(fieldName, fieldInfos);
        if (!fieldInfo) throw new Error('not found field info');

        // if filetype = 99 then convert data
        const newFieldInfoAndValue =
          fieldInfo.fieldType === 99
            ? convertFieldType99ToCorrespondFieldAndValue(fieldInfo, valueDataChange)
            : fieldInfo;

        // const oldValue = getValuesFromFieldInfo(valueDataChange.old, fieldInfo);
        // const newValue = getValuesFromFieldInfo(valueDataChange.new, fieldInfo);

        const Component = findComponent(newFieldInfoAndValue.fieldType);

        // newFieldInfoAndValue will overwrite valueDataChange if fieldType = 99
        return {
          Component,
          ...(valueDataChange as object),
          //
          // old: oldValue,
          // new: newValue,
          //
          ...newFieldInfoAndValue,
          fieldLabel: getFieldLabel(newFieldInfoAndValue, 'fieldLabel')
        };
      } catch (error) {
        return null;
      }
    });

    return filterDataNotNull(tmp);
  };

  const convertStatementData = (rlData: StatementDataType[] = []) => {
    const tmp = rlData.map(_item => {
      const dataNeedConvert = R.omit(['action', 'product_name', 'product_set_data'], _item);
      const statementDataConverted = convertNormalData(dataNeedConvert);
      const extendData = convertExtendData(_item['product_set_data']);

      return {
        action: _item.action,
        productName: _item.product_name,
        contentChange: [...statementDataConverted, ...extendData]
      };
    });

    if (!tmp || tmp.length === 0) {
      return null;
    }

    return {
      Component: StatementChange,
      data: filterDataNotNull(tmp)
    };
  };

  const dataConverted = useMemo(() => {
    const { contentChange } = data;

    const extendData = fieldNameExtension
      ? convertExtendData(contentChange[fieldNameExtension])
      : [];
    // special Data
    const dataStatementConverted = specialData
      ? convertStatementData(specialData.statementData)
      : [];

    const dataChangeOmitExtendData = R.omit([fieldNameExtension], contentChange);
    const normalData = convertNormalData(dataChangeOmitExtendData);

    // filter data not null
    return filterDataNotNull([...normalData, ...extendData, dataStatementConverted]);
  }, [data, fieldInfos]);

  const renderChangedData = () => {
    return dataConverted.map((_item: any) => {
      const Component = _item.Component;
      if (!Component) return <></>;
      const componentProps = R.omit(['Component'], _item);
      return <Component {...componentProps} isModalConfirm={isModalConfirm} key={_item.fieldId} />;
    });
  };

  const renderReasonEdit = () => {
    if (!data.reasonEdit) {
      return <></>;
    }
    return <div>{`${translate('history.reason')}: ${data.reasonEdit}`} </div>;
  };

  return (
    <div className="timeline-content">
      {renderChangedData()}
      {renderReasonEdit()}
    </div>
  );
};

export default React.memo(HistoryContent);
