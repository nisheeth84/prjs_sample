import pick from 'lodash/pick';
import StringUtils from './string-utils';
import { CUSTOMER_SPECIAL_LIST_FIELD } from 'app/modules/customers/constants';
import _ from 'lodash';
import { translate } from 'react-jhipster';

/**
 * Removes fields with an 'id' field that equals ''.
 * This function was created to prevent entities to be sent to
 * the server with relationship fields with empty an empty id and thus
 * resulting in a 500.
 *
 * @param entity Object to clean.
 */
export const cleanEntity = entity => {
  const keysToKeep = Object.keys(entity).filter(
    k => !(entity[k] instanceof Object) || (entity[k]['id'] !== '' && entity[k]['id'] !== -1)
  );

  return pick(entity, keysToKeep);
};

/**
 * Simply map a list of element to a list a object with the element as id.
 *
 * @param idList Elements to map.
 * @returns The list of objects with mapped ids.
 */
export const mapIdList = (idList: ReadonlyArray<any>) =>
  idList.filter((entityId: any) => entityId !== '').map((entityId: any) => ({ id: entityId }));

export const getValueProp = (entity, prop) => {
  if (Object.prototype.hasOwnProperty.call(entity, StringUtils.snakeCaseToCamelCase(prop))) {
    return entity[StringUtils.snakeCaseToCamelCase(prop)];
  }
  if (Object.prototype.hasOwnProperty.call(entity, StringUtils.camelCaseToSnakeCase(prop))) {
    return entity[StringUtils.camelCaseToSnakeCase(prop)];
  }
  return entity[prop];
};

export const getPhotoFilePath = fieldName => {
  if (fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_LOGO) {
    return 'fileUrl';
  }
};

export const getFullAddress = (addressObject: any, alternateRecord) => {
  if (addressObject) {
    let zipCode;
    let addressName;
    let buildingName;
    try {
      const addressParsed = _.isString(addressObject) ? JSON.parse(addressObject) : addressObject;
      zipCode = getValueProp(addressParsed, 'zipCode');
      addressName = getValueProp(addressParsed, 'addressName');
      buildingName = getValueProp(addressParsed, 'buildingName');
    } catch {
      if (alternateRecord) {
        zipCode = _.has(alternateRecord, 'zipCode') ? getValueProp(alternateRecord, 'zipCode') : '';
        addressName = _.toString(addressObject);
        if (_.has(alternateRecord, 'buildingName')) {
          buildingName = getValueProp(alternateRecord, 'buildingName');
        } else if (_.has(alternateRecord, 'building')) {
          buildingName = getValueProp(alternateRecord, 'building');
        }
      }
    }

    let text = `${
      zipCode ? translate('dynamic-control.fieldDetail.layoutAddress.lable.postMark') + zipCode : ''
    }`;
    text = text.concat(`${addressName ? (text ? ' ' + addressName : addressName) : ''}`);
    text = text.concat(`${buildingName ? (text ? ' ' + buildingName : buildingName) : ''}`);
    return text;
  } else {
    return null;
  }
};
