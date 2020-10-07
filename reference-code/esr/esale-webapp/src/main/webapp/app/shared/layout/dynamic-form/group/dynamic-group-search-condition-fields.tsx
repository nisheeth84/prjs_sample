import React, { useState, useEffect, useRef } from 'react';
import PopupFieldCard from '../popup-search/popup-field-card';
import { Storage, translate } from 'react-jhipster';
import _ from 'lodash';
import { getFieldLabel } from 'app/shared/util/string-utils';
import useEventListener from 'app/shared/util/use-event-listener';
import { getValueProp } from 'app/shared/util/entity-utils';
import FieldCardDragLayer from '../popup-search/field-card-drag-layer';

import { FIELD_BELONG, AVAILABLE_FLAG } from 'app/config/constants';

import { convertSpecialField } from 'app/shared/util/special-item';
import { DEFINE_FIELD_TYPE, SPECIAL_HIDE_RELATION_SEARCH } from '../constants';

import {getIconSrc} from 'app/config/icon-loader.ts';

export interface ICheckBoxArea {
  handleCloseSettingField: () => void;
  handleUpdateSettingField: () => void;
  changeListFieldChosen: (listFieldSearch: any) => void;
  customFieldsInfo: any;
  listFieldSetting: any;
  listFieldSearch: any;
  iconFunction?: string;
  fieldBelong: number;
  layoutData?: any;
  searchConditionInputPlaceholder?;
  serviceInfo?
  placeHolder?: string
}

const DynamicGroupSearchConditionField = (props: ICheckBoxArea) => {
  const [fieldFilter, setFieldFilter] = useState('');
  const [listField, setListField] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [showPanel, setShowPanel] = useState(true);
  const [optionRelation, setOptionRelation] = useState([]);
  const [searchConditionPlaceHolder, setSearchConditionPlaceHolder] = useState('');
  const { listFieldSearch } = props;
  const optionRef = useRef(null);
  const [placeholderOfInputSearch,] = useState(props.placeHolder ? props.placeHolder : "employees.group.setting-search-condition.textbox-search-placeholder");


  const lang = Storage.session.get('locale', 'ja_jp');
  const getTextItemField = (item, fieldLabel) => {
    if (!item) {
      return '';
    }
    if (Object.prototype.hasOwnProperty.call(item, fieldLabel)) {
      try {
        const labels = _.isString(item[fieldLabel]) ? JSON.parse(item[fieldLabel]) : item[fieldLabel];
        if (labels && Object.prototype.hasOwnProperty.call(labels, lang)) {
          return getValueProp(labels, lang);
        }
      } catch (e) {
        return item[fieldLabel];
      }
    }
    return '';
  };
  const isMatchFilter = item => {
    if (fieldFilter.length <= 0) {
      return true;
    }
    const textField = getTextItemField(item, 'fieldLabel');
    if (textField.length <= 0) {
      return false;
    }
    return textField.includes(fieldFilter);
  };

  /**
   * Return formatted fieldItems
   * @param field
   */
  const getFieldItems = field => {
    const fieldItems = [];
    if (field.fieldItems && Array.isArray(field.fieldItems) && field.fieldItems.length > 0) {
      field.fieldItems.forEach(e => {
        fieldItems.push({
          itemId: e.itemId,
          itemLabel: e.itemLabel,
          itemOrder: e.itemOrder,
          isDefault: e.isDefault
        });
      });
    }
    return fieldItems;
  };
  const isAvailable = flag => {
    return flag === AVAILABLE_FLAG.WEB_APP_AVAILABLE;
  };

  const isMatchFilterRelation = (item, belong, isRelation) => {
    const LINK_FIXED = 2
    if (
      _.toString(item.fieldType) === DEFINE_FIELD_TYPE.TAB ||
      _.toString(item.fieldType) === DEFINE_FIELD_TYPE.TITLE ||
      _.toString(item.fieldType) === DEFINE_FIELD_TYPE.LOOKUP ||
      (_.toString(item.fieldType) === DEFINE_FIELD_TYPE.LINK && item.urlType === LINK_FIXED) ||
      !isAvailable(item.availableFlag) ||
      item.fieldBelong !== belong
    ) {
      return false;
    }
    if (isRelation && _.toString(item.fieldType) === DEFINE_FIELD_TYPE.RELATION) {
      return false;
    } else if (!isRelation && _.toString(item.fieldType) === DEFINE_FIELD_TYPE.RELATION) {
      if (_.get(item, 'relationData.asSelf') === 1) {
        return false;
      }
      return true;
    }
    if (fieldFilter.length <= 0) {
      return true;
    }
    const textField = getFieldLabel(item, 'fieldLabel');
    if (textField.length <= 0) {
      return false;
    }
    return textField.includes(fieldFilter);
  };

  const isFieldEqual = (field1: any, field2: any) => {
    if (_.isEqual(field1.fieldId, field2.fieldId) && _.isEqual(field1.relationFieldId, field2.relationFieldId)) {
      return true;
    }
    return false;
  };

  const isItemSelected = item => {
    const matchList = listFieldSearch.filter(e => isFieldEqual(e, item));
    return matchList.length > 0;
  };

  const changeSelectFieldSetting = (type: number) => {
    const listFields = props.listFieldSetting.filter(e => isMatchFilterRelation(e, props.fieldBelong, false) && isAvailable(e.availableFlag));
    const listFieldRelation = props.customFieldsInfo.filter(e => isMatchFilterRelation(e, props.fieldBelong, false)
      && (_.isNil(e.relationFieldId) || e.relationFieldId <= 0) && e.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION)
    listFieldRelation.forEach(fieldRelation => {
      props.customFieldsInfo
        .filter(field => isMatchFilterRelation(field, fieldRelation.relationData.fieldBelong, true))
        .forEach(el => {
          const fieldInfo = _.cloneDeep(el);
          fieldInfo.relationFieldId = fieldRelation.fieldId;
          listFields.push(fieldInfo);
        });
    });
    const objectFieldInfos = _.cloneDeep(listFieldSearch);
    for (let i = 0; i < listFields.length; i++) {
      const existIndex = objectFieldInfos.findIndex(e => isFieldEqual(e, listFields[i]));
      if (type === 0) {
        if (existIndex >= 0) {
          objectFieldInfos.splice(existIndex, 1);
        }
        continue;
      }

      if (listFields[i].fieldType.toString() === DEFINE_FIELD_TYPE.OTHER || listFields[i].fieldType.toString() === DEFINE_FIELD_TYPE.RELATION ||
        !_.isNil(SPECIAL_HIDE_RELATION_SEARCH.find(elx => elx === listFields[i].fieldName))) {
        continue;
      }
      const fieldItems = getFieldItems(listFields[i]);
      const fieldInfo = {
        fieldId: listFields[i].fieldId,
        fieldName: listFields[i].fieldName,
        fieldType: listFields[i].fieldType,
        fieldLabel: listFields[i].fieldLabel,
        searchType: listFields[i].searchType ? listFields[i].searchType : null,
        searchOption: listFields[i].searchOption ? listFields[i].searchOption : null,
        relationFieldId: listFields[i].relationFieldId ? listFields[i].relationFieldId : undefined,
        fieldItems
      };
      if (type === 1 && existIndex < 0) {
        objectFieldInfos.push(fieldInfo);
      } else if (type === -1 && existIndex < 0) {
        objectFieldInfos.push(fieldInfo);
      } else if (type === -1 && existIndex >= 0) {
        objectFieldInfos.splice(existIndex, 1);
      }
    }
    props.changeListFieldChosen(objectFieldInfos);
  };

  const onSelectField = (sourceField, isChecked) => {
    const objectFieldInfos = _.cloneDeep(listFieldSearch);
    if (objectFieldInfos) {
      if (isChecked) {
        let fieldItems = [];
        if (sourceField.fieldItems && Array.isArray(sourceField.fieldItems) && sourceField.fieldItems.length > 0) {
          fieldItems = getFieldItems(sourceField);
        }
        const newField = _.cloneDeep(sourceField);
        newField['fieldItems'] = fieldItems;
        objectFieldInfos.push(newField);
      } else {
        const fieldIndex = objectFieldInfos.findIndex(e => e.fieldId.toString() === sourceField.fieldId.toString());
        if (fieldIndex >= 0) {
          objectFieldInfos.splice(fieldIndex, 1);
        }
      }
      for (let i = 0; i < objectFieldInfos.length; i++) {
        objectFieldInfos[i].fieldOrder = i + 1;
      }
      props.changeListFieldChosen(objectFieldInfos);
    }
  };

  const onDragDropField = (fieldSrc, fieldTargetId) => {
    if (!fieldSrc) {
      return;
    }
    const fieldItems = getFieldItems(fieldSrc);
    const newField = {
      fieldId: fieldSrc.fieldId,
      fieldName: fieldSrc.fieldName,
      fieldType: fieldSrc.fieldType,
      fieldLabel: fieldSrc.fieldLabel,
      searchType: fieldSrc.searchType ? fieldSrc.searchType : null,
      searchOption: fieldSrc.searchOption ? fieldSrc.searchOption : null,
      fieldItems
    };
    const objectFieldInfos = _.cloneDeep(listFieldSearch);
    if (!fieldTargetId) {
      if (listFieldSearch.findIndex(e => e.fieldId.toString() === fieldSrc.fieldId.toString()) < 0) {
        objectFieldInfos.push(newField);
        props.changeListFieldChosen(objectFieldInfos);
      }
      return;
    }
    if (objectFieldInfos && objectFieldInfos.length > 0) {
      let targetId = null;
      if (fieldTargetId.constructor === ({}).constructor) {
        targetId = _.get(fieldTargetId, "fieldId");
      } else {
        targetId = fieldTargetId;
      }
      const fieldIndex = objectFieldInfos.findIndex(e => _.toString(e.fieldId) === _.toString(targetId));
      const existedFieldIndex = objectFieldInfos.findIndex(e => e.fieldId.toString() === fieldSrc.fieldId.toString());
      if (fieldIndex >= 0) {
        if (fieldIndex === existedFieldIndex) {
          return;
        }
        if (existedFieldIndex < 0) {
          objectFieldInfos.splice(fieldIndex, 0, newField);
        } else {
          const tempObject = objectFieldInfos.splice(fieldIndex, 1, objectFieldInfos[existedFieldIndex])[0]; // get the item from the array
          objectFieldInfos.splice(existedFieldIndex, 1, tempObject);
        }
      }
      for (let i = 0; i < objectFieldInfos.length; i++) {
        objectFieldInfos[i].fieldOrder = i + 1;
      }
      props.changeListFieldChosen(objectFieldInfos);
    }
  };

  /**
   * Handle when clicking outside
   * @param event
   */
  const handleClickOutside = event => {
    if (optionRef.current && !optionRef.current.contains(event.target)) {
      setFilteredList(listField.filter(field => field.availableFlag).filter(item => isMatchFilter(item)));
    }
  };

  useEventListener('click', handleClickOutside);

  useEffect(() => {
    if (props.searchConditionInputPlaceholder) {
      setSearchConditionPlaceHolder(props.searchConditionInputPlaceholder);
    }
  }, [props.searchConditionInputPlaceholder])

  useEffect(() => {
    if (props.customFieldsInfo) {
      const _fields = convertSpecialField(props.customFieldsInfo, props.layoutData, props.fieldBelong)
      setListField(_fields.filter(e => isMatchFilter(e)).filter(field => [1, 3].includes(field.availableFlag)));
      setFilteredList(_fields.filter(e => isMatchFilter(e)).filter(field => [1, 3].includes(field.availableFlag)));

    } else {
      setListField([]);
    }
  }, [props.customFieldsInfo]);

  const getRelationFieldName = (belong: number, field) => {
    let serviceName = '';
    if (props.serviceInfo) {
      const idx = props.serviceInfo.findIndex(e => e.serviceId === belong);
      if (idx >= 0) {
        serviceName = getFieldLabel(props.serviceInfo[idx], 'serviceName');
      }
    }
    return `${serviceName} (${getFieldLabel(field, 'fieldLabel')})`;
  }

  const setDisplayRelationOption = (idx) => {
    const optionArr = _.cloneDeep(optionRelation);
    optionArr[idx] = !optionArr[idx];
    setOptionRelation(optionArr);
  }

  const renderSelectAndDragFields = () => {
    const customsFieldInfo = _.cloneDeep(props.customFieldsInfo);
    const listFieldSelect = customsFieldInfo.filter(e => isMatchFilterRelation(e, props.fieldBelong, false) && (_.isNil(e.relationFieldId) || e.relationFieldId <= 0));  
    return <>
      <div className="wrap-checkbox margin-top-20">
        <FieldCardDragLayer fieldBelong={props.fieldBelong} />
        {listFieldSelect.map((item, idx) => {
          if (_.toString(item.fieldType) === DEFINE_FIELD_TYPE.RELATION && !item.disableDisplaySearch) {
            return (<div className="overflow-hidden">
              <button className={optionRelation[idx] ? "select-option select-option-relation arrow-up" : "select-option select-option-relation"} onClick={() => setDisplayRelationOption(idx)}>
                <span className="select-text">{getRelationFieldName(item.relationData.fieldBelong, item)}</span>
              </button>
              {optionRelation[idx] &&
                <ul className="drop-down drop-down2 select-option-search-common">
                  {props.customFieldsInfo
                    .filter(e => isMatchFilterRelation(e, item.relationData.fieldBelong, true))
                    .map(el => {
                      const fieldInfo = _.cloneDeep(el);
                      fieldInfo.relationFieldId = item.fieldId;
                      return (
                        _.isNil(SPECIAL_HIDE_RELATION_SEARCH.find(elx => elx === fieldInfo.fieldName)) &&
                        el.fieldType.toString() !== DEFINE_FIELD_TYPE.OTHER &&
                        <li className="item smooth" key={el.fieldId}>
                          <PopupFieldCard
                            key={el.fieldId}
                            text={getFieldLabel(el, 'fieldLabel')}
                            fieldBelong={item.relationData.fieldBelong}
                            fieldInfo={fieldInfo}
                            isChecked={isItemSelected(fieldInfo)}
                            onSelectField={onSelectField}
                            onDragDropField={onDragDropField}
                            // iconSrc={`/content/images/${props.iconFunction}`}
                            iconSrc={getIconSrc(item.relationData.fieldBelong)}
                          />
                        </li>
                      );
                    })}
                </ul>
              }
            </div>
            );
          } else {
            return (
              !item.disableDisplaySearch &&
              <PopupFieldCard
                key={idx}
                fieldBelong={props.fieldBelong}
                text={getFieldLabel(item, 'fieldLabel')}
                fieldInfo={item}
                isChecked={isItemSelected(item)}
                onSelectField={onSelectField}
                onDragDropField={onDragDropField}
                iconSrc={`/content/images/${props.iconFunction}`}
              />
            );
          }
        })}
      </div>
    </>
  }

  return (
    <div className={showPanel ? "wrap-list style-3 wrap-list-common" : "wrap-list style-3"}>
      <a className="button-open-wrap-list" style={{ zIndex: 1 }}>
        <i className="fas fa-chevron-double-left" onClick={() => setShowPanel(!showPanel)} />
      </a>
      <div className="d-flex justify-content-end">
        <a onClick={props.handleCloseSettingField} className="button-primary button-activity-registration button-cancel">
          {translate('employees.group.setting-search-condition.cancel')}
        </a>
        <a onClick={props.handleUpdateSettingField} className="button-blue button-activity-registration">
          {translate('employees.group.setting-search-condition.save-search-condition')}
        </a>
      </div>
      {showPanel && (
        <>
          <div className="search-box-button-style margin-y-20 w100" ref={optionRef}>
            <button className="icon-search" style={{ cursor: 'pointer' }} onClick={() => {
              const newFilter = listField.filter(field => field.availableFlag).filter(item => isMatchFilter(item));
              setFilteredList(newFilter);
            }}>
              <i className="far fa-search" />
            </button>
            <input
              type="text"
              placeholder={searchConditionPlaceHolder ? searchConditionPlaceHolder : translate(`${placeholderOfInputSearch}`)}
              onChange={event => {
                setFieldFilter(event.target.value.trim());
              }}
              value={fieldFilter}
              onBlur={e => {
                const newFilter = listField.filter(field => field.availableFlag).filter(item => isMatchFilter(item));
                setFilteredList(newFilter);
              }}
            />
          </div>
          <a onClick={e => changeSelectFieldSetting(1)} className="button-primary button-activity-registration mr-1">
            {translate('employees.group.setting-search-condition.checkbox-select-all')}
          </a>
          <a onClick={e => changeSelectFieldSetting(0)} className="button-primary button-activity-registration mr-1">
            {translate('employees.group.setting-search-condition.checkbox-deselect')}
          </a>
          <a onClick={e => changeSelectFieldSetting(-1)} className="button-primary button-activity-registration">
            {translate('employees.group.setting-search-condition.checkbox-select-inversion')}
          </a>
          {renderSelectAndDragFields()}
        </>
      )}
    </div>
  );
};

export default DynamicGroupSearchConditionField;
