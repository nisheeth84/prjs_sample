import StringUtils from "./string-utils";

/**
  * Get value in JSON base on language code
  */
const getValueProp = (entity: any, prop: any) => {
  if (Object.prototype.hasOwnProperty.call(entity, StringUtils.snakeCaseToCamelCase(prop))) {
    return entity[StringUtils.snakeCaseToCamelCase(prop)];
  }
  if (Object.prototype.hasOwnProperty.call(entity, StringUtils.camelCaseToSnakeCase(prop))) {
    return entity[StringUtils.camelCaseToSnakeCase(prop)];
  }
  return entity[prop];
};

/**
  * clone object
  */
const clone = (object: any) => {
  return JSON.parse(JSON.stringify(object));
}

const EntityUtils = {
  getValueProp,
  clone
};



export default EntityUtils;