import React, { useState, useEffect, useRef } from 'react';
import PopupFieldCard from '../popup-search/popup-field-card';
import { Storage, translate } from 'react-jhipster';
import _ from 'lodash';
import { getFieldLabel } from 'app/shared/util/string-utils';
import useEventListener from 'app/shared/util/use-event-listener';
import { getValueProp } from 'app/shared/util/entity-utils';
import FieldCardDragLayer from '../popup-search/field-card-drag-layer';

import { FIELD_BELONG } from 'app/config/constants';

import { convertSpecialField } from 'app/shared/util/special-item';

export interface ICheckBoxArea {
  handleCloseSettingField: () => void;
  handleUpdateSettingField: () => void;
  changeListFieldChosen: (listFieldSearch: any) => void;
  customFieldsInfo: any;
  listFieldSearch: any;
  iconFunction?: string;
  fieldBelong: number;
  employeeLayout?: any;
  searchConditionInputPlaceholder?;
}

const DynamicSearchConditionListComponent = (props: ICheckBoxArea) => {
  const [fieldFilter, setFieldFilter] = useState('');
  const [listField, setListField] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [showPanel, setShowPanel] = useState(true);
  const [searchConditionPlaceHolder, setSearchConditionPlaceHolder] = useState('');
  const { listFieldSearch } = props;
  const optionRef = useRef(null);

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

  const isItemSelected = item => {
    const matchList = listFieldSearch.filter(e => e.fieldId.toString() === item.fieldId.toString());
    return matchList.length > 0;
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

  const changeSelectFieldSetting = (type: number) => {
    const listFields = props.customFieldsInfo.filter(e => isMatchFilter(e) && e.availableFlag);
    const objectFieldInfos = _.cloneDeep(listFieldSearch);
    for (let i = 0; i < listFields.length; i++) {
      const existIndex = objectFieldInfos.findIndex(e => e.fieldId.toString() === listFields[i].fieldId.toString());
      if (type === 0) {
        if (existIndex >= 0) {
          objectFieldInfos.splice(existIndex, 1);
        }
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
        const fieldItems = getFieldItems(sourceField);
        objectFieldInfos.push({
          fieldId: sourceField.fieldId,
          fieldName: sourceField.fieldName,
          fieldType: sourceField.fieldType,
          fieldLabel: sourceField.fieldLabel,
          searchType: sourceField.searchType ? sourceField.searchType : null,
          searchOption: sourceField.searchOption ? sourceField.searchOption : null,
          fieldItems
        });
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
    if(props.searchConditionInputPlaceholder) {
      setSearchConditionPlaceHolder(props.searchConditionInputPlaceholder);
    }
  }, [props.searchConditionInputPlaceholder])

  useEffect(() => {
    if (props.customFieldsInfo) {
      const _fields = convertSpecialField(props.customFieldsInfo, props.employeeLayout, props.fieldBelong)
      setListField(_fields.filter(e => isMatchFilter(e)).filter(field => [1, 3].includes(field.availableFlag)));
      setFilteredList(_fields.filter(e => isMatchFilter(e)).filter(field => [1, 3].includes(field.availableFlag)));

    } else {
      setListField([]);
    }
  }, [props.customFieldsInfo]);

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
              placeholder={searchConditionPlaceHolder ? searchConditionPlaceHolder :translate('employees.group.setting-search-condition.textbox-search-placeholder')}
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
          <div className="wrap-checkbox margin-top-20">
            <FieldCardDragLayer fieldBelong={props.fieldBelong} />
            {filteredList.map((item, idx) => (
              !item.disableDisplaySearch &&
              <PopupFieldCard
                key={idx}
                text={getFieldLabel(item, 'fieldLabel')}
                // text={getTextItemField(item, 'fieldLabel')}
                fieldBelong={props.fieldBelong}
                fieldInfo={item}
                isChecked={isItemSelected(item)}
                onSelectField={onSelectField}
                onDragDropField={onDragDropField}
                iconSrc={`/content/images/${props.iconFunction}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DynamicSearchConditionListComponent;
