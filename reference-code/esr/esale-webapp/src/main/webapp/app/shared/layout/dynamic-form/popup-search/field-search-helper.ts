import { DEFINE_FIELD_TYPE } from '../constants';
import _ from 'lodash';
import StringUtils from 'app/shared/util/string-utils';
import { FIELD_BELONG, SEARCH_OPTION, SEARCH_TYPE } from 'app/config/constants';
import { translate } from 'react-jhipster';

const getFieldItemsBoolean = (field: any) => {
  const fieldItems = [];
  if (StringUtils.equalPropertyName(field.fieldName, 'is_public')) {
    fieldItems.push({
      itemId: 0,
      itemLabel: translate('tasks.list.isPublic.notPublic'),
      itemOrder: 1,
      isAvailable: true
    });
    fieldItems.push({
      itemId: 1,
      itemLabel: translate('tasks.list.isPublic.public'),
      itemOrder: 2,
      isAvailable: true
    });
  } else if (StringUtils.equalPropertyName(field.fieldName, 'can_modify')) {
    fieldItems.push({
      itemId: 0,
      itemLabel: translate('calendars.form.do_not_allow_to_edit'),
      itemOrder: 1,
      isAvailable: true
    });
    fieldItems.push({
      itemId: 1,
      itemLabel: translate('calendars.form.do_allow_to_edit'),
      itemOrder: 2,
      isAvailable: true
    });
  } else if (StringUtils.equalPropertyName(field.fieldName, 'is_working')) {
    fieldItems.push({
      itemId: 1,
      itemLabel: translate('businesscards.create-edit.isWorking'),
      itemOrder: 1,
      isAvailable: true
    });
    fieldItems.push({
      itemId: 0,
      itemLabel: translate('businesscards.create-edit.notWorking'),
      itemOrder: 2,
      isAvailable: true
    });
  } else {
    fieldItems.push({ itemId: 1, isAvailable: true, itemOrder: 1, itemLabel: field.fieldLabel });
  }
  return fieldItems;
};

export const getFieldItemsSpecial = (field, servicesLayout: any[]) => {
  const fieldItems = [];
  if (
    _.toString(field.fieldType) === DEFINE_FIELD_TYPE.CHECKBOX &&
    (_.startsWith(field.fieldName, 'is_') || _.startsWith(field.fieldName, 'can_'))
  ) {
    fieldItems.push(...getFieldItemsBoolean(field));
  } else if (
    (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.CHECKBOX ||
      _.toString(field.fieldType) === DEFINE_FIELD_TYPE.RADIOBOX ||
      _.toString(field.fieldType) === DEFINE_FIELD_TYPE.SINGER_SELECTBOX ||
      _.toString(field.fieldType) === DEFINE_FIELD_TYPE.MULTI_SELECTBOX) &&
    (!field.fieldItems || field.fieldItems.length < 1)
  ) {
    let layout = _.find(servicesLayout, { fieldBelong: field.fieldBelong });
    if (!layout && field.fieldBelong === FIELD_BELONG.PRODUCT_TRADING) {
      // for special
      layout = _.find(servicesLayout, { fieldBelong: FIELD_BELONG.ACTIVITY as any });
    }
    if (_.isNil(layout) || _.isNil(layout.data)) {
      return fieldItems;
    }
    if (
      (StringUtils.equalPropertyName('employee_packages', field.fieldName) ||
        StringUtils.equalPropertyName('employee_departments', field.fieldName) ||
        StringUtils.equalPropertyName('employee_positions', field.fieldName)) &&
      _.find(layout.data, { fieldId: field.fieldId })
    ) {
      fieldItems.push(_.get(_.find(layout.data, { fieldId: field.fieldId }), 'fieldItems'));
    } else if (
      StringUtils.equalPropertyName('activity_format_id', field.fieldName) &&
      _.has(layout, 'data.dataInfo.activitiesFormats') &&
      _.isArray(layout.data.dataInfo.activitiesFormats)
    ) {
      layout.data.dataInfo.activitiesFormats.forEach(e => {
        fieldItems.push({
          itemId: e.activityFormatId,
          isAvailable: e.isAvailable,
          itemOrder: e.displayOrder,
          itemLabel: e.name
        });
      });
    } else if (
      StringUtils.equalPropertyName('product_category_id', field.fieldName) &&
      _.has(layout, 'data.dataInfo.productCategories') &&
      _.isArray(layout.data.dataInfo.productCategories)
    ) {
      layout.data.dataInfo.productCategories.forEach(e => {
        fieldItems.push({
          itemId: e.productCategoryId,
          isAvailable: true,
          itemOrder: e.displayOrder,
          itemLabel: e.productCategoryName
        });
      });
    } else if (
      StringUtils.equalPropertyName('product_type_id', field.fieldName) &&
      _.has(layout, 'data.dataInfo.productTypes') &&
      _.isArray(layout.data.dataInfo.productTypes)
    ) {
      layout.data.dataInfo.productTypes.forEach(e => {
        fieldItems.push({
          itemId: e.productTypeId,
          isAvailable: e.isAvailable,
          itemOrder: e.displayOrder,
          itemLabel: e.productTypeName
        });
      });
    } else if (
      StringUtils.equalPropertyName('business_main_id', field.fieldName) &&
      _.find(layout.data, { fieldId: field.fieldId })
    ) {
      _.toArray(_.get(_.find(layout.data, { fieldId: field.fieldId }), 'listFieldsItem')).forEach(
        e => {
          fieldItems.push({
            itemId: e.itemId,
            isAvailable: e.isAvailable,
            itemOrder: e.itemOrder,
            itemLabel: e.itemLabel
          });
        }
      );
      _.toArray(
        _.get(_.find(layout.data, { fieldName: 'business_sub_id' }), 'listFieldsItem')
      ).forEach(e => {
        if (fieldItems.findIndex(i => i.itemId === e.itemId) < 0) {
          fieldItems.push({
            itemId: e.itemId,
            isAvailable: e.isAvailable,
            itemOrder: e.itemOrder,
            itemLabel: e.itemLabel
          });
        }
      });
    } else if (
      StringUtils.equalPropertyName('product_trading_progress_id', field.fieldName) &&
      _.has(layout, 'data.progresses') &&
      _.isArray(layout.data.progresses)
    ) {
      layout.data.progresses.forEach(e => {
        fieldItems.push({
          itemId: e.productTradingProgressId,
          isAvailable: e.isAvailable,
          itemOrder: e.progressOrder,
          itemLabel: e.progressName
        });
      });
    } else if (
      StringUtils.equalPropertyName('schedule_type_id', field.fieldName) &&
      _.has(layout, 'data') &&
      _.isArray(_.get(layout, 'data'))
    ) {
      layout.data.forEach(e => {
        fieldItems.push({
          itemId: e.scheduleTypeId,
          isAvailable: e.isAvailable,
          itemOrder: e.displayOrder,
          itemLabel: e.scheduleTypeName
        });
      });
    }
  }
  return fieldItems;
};
export const buildAdditionConditionBelong = (
  mainBelong: number,
  subBelong: number,
  conditions: any[],
  customFieldsInfo: any[]
) => {
  if (mainBelong === FIELD_BELONG.BUSINESS_CARD && subBelong === FIELD_BELONG.PRODUCT_TRADING) {
    const cIdx = conditions.findIndex(e =>  StringUtils.equalPropertyName(e.fieldName, 'activity_id'));
    const fIdx = customFieldsInfo.findIndex(
      e =>
        e.fieldBelong === FIELD_BELONG.ACTIVITY &&
        StringUtils.equalPropertyName(e.fieldName, 'activity_id')
    );
    if (cIdx >= 0) {
      const cond = {
        fieldType: DEFINE_FIELD_TYPE.CHECKBOX,
        fieldId: fIdx >= 0 ? customFieldsInfo[fIdx].fieldId : null,
        isDefault: 'true',
        fieldName: 'activity_id',
        fieldValue: conditions[cIdx].fieldValue,
        searchType: SEARCH_TYPE.LIKE,
        searchOption: SEARCH_OPTION.OR
      };
      return { fieldBelong: FIELD_BELONG.ACTIVITY, condition: cond };
    }
  }
  return null;
};
