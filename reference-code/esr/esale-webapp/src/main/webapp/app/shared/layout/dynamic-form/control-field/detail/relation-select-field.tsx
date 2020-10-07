import React, { useState, useEffect } from 'react'
import { Modal } from 'reactstrap';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import { useId } from 'react-id-generator';
import { DEFINE_FIELD_TYPE } from '../../constants';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';

interface IRelationSelectFieldProps {
  fieldIdTarget?: number,
  isMultiSelect: boolean,
  displayTab: any,
  displayFieldId: any,
  displayFields: any[],
  listField: any[],
  fieldSubRelation: any[],
  onCloseRelationSelectField: () => void
  onSaveRelationSelectField: (params: {displayTab, displayFieldId, displayFields}) => void
}

const RelationSelectField = (props: IRelationSelectFieldProps) => {
  const [displayTab, setDisplayTab] = useState(2);
  const [displayFieldId, setDisplayFieldId] = useState(null);
  const [displayFields, setDisplayFields] = useState([]);

  const idAutomatic = useId(2, "field_detail_relation_id_");
  const nameAutomatic = useId(1, "field_detail_relation_name_");

  useEffect(() => {
    setDisplayTab(props.displayTab)
    setDisplayFieldId(props.displayFieldId)
    if (!_.isNil(props.displayFields)) {
      setDisplayFields(props.displayFields);
    }
  }, [])

  const onChangeSelectFields = (ev, fieldIdRelation: number) => {
    const value = _.toNumber(ev.target.value)
    if (ev.target.checked) {
      let field = null;
      if (fieldIdRelation > 0 && props.fieldSubRelation) {
        field = _.find(props.fieldSubRelation, (e) => { return e.fieldId === value});
      } else if (props.listField) {
        field = _.find(props.listField, (e) => { return e.fieldId === value});
      }
      if (displayFields.findIndex( o => o.fieldId === value) < 0) {
        if (!_.isNil(field)) {
          if (fieldIdRelation > 0) {
            if (displayFields.findIndex( o => o.fieldId === fieldIdRelation) < 0) {
              const fieldRelation = _.find(props.listField, (e) => { return e.fieldId === fieldIdRelation});
              displayFields.push({ fieldId: fieldIdRelation, fieldName: fieldRelation ? fieldRelation.fieldName : null})
            }
            displayFields.push({ fieldId: field.fieldId, fieldName: field.fieldName, relationId: fieldIdRelation, fieldBelong: field.fieldBelong})
          } else {
            displayFields.push({ fieldId: field.fieldId, fieldName: field.fieldName})
          }
        }
      }
    } else {
      const idx = displayFields.findIndex( o => o.fieldId === value)
      if (idx >= 0) {
        displayFields.splice(idx, 1);
        if (fieldIdRelation > 0) {
          const isExist = displayFields.findIndex(e => e.relationId === fieldIdRelation) >= 0;
          if (!isExist) {
            _.remove(displayFields, (e) => {return e.fieldId === fieldIdRelation})
          }
        }
      }
    }
    setDisplayFields(_.cloneDeep(displayFields));
  }

  const isAvaiableFieldRelation = (field: any, isTab) => {
    const type = _.toString(field.fieldType)
    if (isTab) {
      return (type !== DEFINE_FIELD_TYPE.TAB &&
        type !== DEFINE_FIELD_TYPE.TITLE &&
        type !== DEFINE_FIELD_TYPE.OTHER &&
        type !== DEFINE_FIELD_TYPE.LOOKUP &&
        type !== DEFINE_FIELD_TYPE.RELATION && // TODO phase 2 get relation level 2
        props.fieldIdTarget !== field.fieldId)
    } else {
      return (type !== DEFINE_FIELD_TYPE.FILE &&
        type !== DEFINE_FIELD_TYPE.LINK &&
        type !== DEFINE_FIELD_TYPE.RELATION &&
        type !== DEFINE_FIELD_TYPE.LOOKUP &&
        type !== DEFINE_FIELD_TYPE.TAB &&
        type !== DEFINE_FIELD_TYPE.TITLE &&
        type !== DEFINE_FIELD_TYPE.OTHER &&
        props.fieldIdTarget !== field.fieldId)
    }
  }

  const isFieldDisplaySelected = (field) => {
    return displayFields.findIndex(  e => e.fieldId === field.fieldId) >= 0;
  }

  const getFieldsSubRelation = (fieldRelation) => {
    const tmp = [];
    if (fieldRelation.fieldType.toString() !== DEFINE_FIELD_TYPE.RELATION) {
      return tmp;
    }
    if (props.fieldSubRelation) {
      tmp.push(...props.fieldSubRelation.filter( e => e.fieldBelong === fieldRelation.fieldBelong 
        && e.fieldType.toString() !== DEFINE_FIELD_TYPE.TAB
        && e.fieldType.toString() !== DEFINE_FIELD_TYPE.TITLE
        && e.fieldType.toString() !== DEFINE_FIELD_TYPE.OTHER
        && e.fieldType.toString() !== DEFINE_FIELD_TYPE.RELATION
        && props.listField.findIndex( o => o.fieldId === e.fieldId) < 0))
    }
    return tmp;
  }

  const renderSubRelation = (field) => {
    if (field.fieldType.toString() !== DEFINE_FIELD_TYPE.RELATION) {
      return <></>;
    }
    const subListField = getFieldsSubRelation(field);
    if (subListField.length < 1) {
      return <></>;
    }
    return (
      <>
      <tr key={field.fieldId}>
        <td align="center"></td>
        <td><label>{getFieldLabel(field, 'fieldLabel')}</label></td>
      </tr>
      {subListField.map((e) => 
      <tr key={e.fieldId}>
        <td align="center">
          <div className="wrap-check-radio width-20">
            <label className="icon-check">
              <input type="checkbox"
                value={field.fieldId}
                checked={isFieldDisplaySelected(field)}
                onChange={(ev) => onChangeSelectFields(ev, e)}
              /><i></i>
            </label>
          </div>
        </td>
        <td><label>{StringUtils.escapeSpaceHtml(getFieldLabel(field, 'fieldLabel'))}</label></td>
      </tr>
      )}
      </>
    )

  }

  return (
    <Modal isOpen={true} fade={true} toggle={() => {}} backdrop={true} autoFocus={true} zIndex="9999">
      <div className="popup-esr2 popup-esr3" id="popup-detail-select-field">
        <div className="popup-esr2-content">
          <div className="modal-header no-border">
            <div className="left">
              <div className="popup-button-back"><span className="text no-icon">{translate('dynamic-control.fieldDetail.displayTargetSetting.title')}</span></div>
            </div>
            <div className="right">
              <a onClick={props.onCloseRelationSelectField} className="icon-small-primary icon-close-up-small "></a>
            </div>
          </div>
          <div className="popup-esr2-body max-height-calc-100 style-3 pb-0 pt-0 mb-3 mt-3">
            <div className="form-group mb-0">
              <label>{translate('dynamic-control.fieldDetail.displayTargetSetting.label')}</label>
              <table className="table-default">
                <thead>
                  <tr>
                    <td align="center" style={{width: "100px"}}>{translate('dynamic-control.fieldDetail.displayTargetSetting.label.radio')}</td>
                    <td>{translate('dynamic-control.fieldDetail.displayTargetSetting.label.itemName')}</td>
                  </tr>
                </thead>
                <thead></thead>
                <tbody>
                  {props.listField.filter(e => isAvaiableFieldRelation(e, false)).map((e, idx) =>
                  <tr key={idx}>
                    <td align="center" className="middle">
                      <div className="wrap-check-radio width-20">
                        <p className="radio-item m-0">
                          <input type="radio"
                            id={`setting-select-relation-${idx}`}
                            name="setting-select-relation"
                            value={e.fieldId}
                            checked={e.fieldId === displayFieldId}
                            onChange={(ev) => setDisplayFieldId(_.toNumber(ev.target.value))}
                          />
                          <label className="m-0" htmlFor={`setting-select-relation-${idx}`}></label>
                        </p>
                      </div>
                    </td>
                    <td><label className="mb-0">{StringUtils.escapeSpaceHtml(getFieldLabel(e, 'fieldLabel'))}</label></td>
                  </tr>)}
                </tbody>
              </table>
              {props.isMultiSelect && <>
              <div className="mt-4 mb-2">{translate('dynamic-control.fieldDetail.displayTargetSetting.labelTab')}</div>
              <div className="bg-blue-line">
                {translate('dynamic-control.fieldDetail.displayTargetSetting.info.displayTargetSetting')}
              </div>
              <div className="wrap-check-radio d-flex">
                <p className="radio-item">
                  <input type="radio" id={idAutomatic[0]} name={nameAutomatic[0]} value={1} checked={displayTab === 1} onChange={(e) => setDisplayTab(_.toNumber(e.target.value))}/>
                  <label htmlFor={idAutomatic[0]}>{translate('dynamic-control.fieldDetail.displayTargetSetting.radio.indicate')}</label>
                </p>
                <p className="radio-item">
                  <input type="radio" id={idAutomatic[1]} name={nameAutomatic[0]} value={2} checked={displayTab === 2} onChange={(e) => setDisplayTab(_.toNumber(e.target.value))}/>
                  <label htmlFor={idAutomatic[1]}>{translate('dynamic-control.fieldDetail.displayTargetSetting.radio.doNotShow')}</label>
                </p>
              </div>
              {displayTab === 1 && <table className="table-default">
                <thead>
                  <tr>
                    <td align="center" style={{width: "100px"}}>{translate('dynamic-control.fieldDetail.displayTargetSetting.label.radio')}</td>
                    <td>{translate('dynamic-control.fieldDetail.displayTargetSetting.label.itemName')}</td>
                  </tr>
                </thead>
                <tbody>
                {props.listField.filter(e => isAvaiableFieldRelation(e, true)).map((e, idx) =>
                <>
                  {!_.isEqual(_.toString(e.fieldType), DEFINE_FIELD_TYPE.RELATION) &&
                  <tr key={idx}>
                    <td align="center">
                      <div className="wrap-check-radio width-20">
                        {!_.isEqual(_.toString(e.fieldType), DEFINE_FIELD_TYPE.RELATION) &&
                        <label className="icon-check">
                          <input type="checkbox"
                            value={e.fieldId}
                            checked={isFieldDisplaySelected(e)}
                            onChange={(ev) => onChangeSelectFields(ev, null)}
                          /><i></i>
                        </label>
                        }
                      </div>
                    </td>
                    <td><label>{StringUtils.escapeSpaceHtml(getFieldLabel(e, 'fieldLabel'))}</label></td>
                  </tr>
                  }
                  {_.isEqual(_.toString(e.fieldType), DEFINE_FIELD_TYPE.RELATION) && renderSubRelation(e)}
                </> 
                )}
                </tbody>
              </table>}
              </>}
            </div>
          </div>
          <div className="text-center mb-3">
            <a className="button-blue small" onClick={() => props.onSaveRelationSelectField({displayFieldId, displayFields: displayTab === 1 ? displayFields : [], displayTab})}>
              {translate('dynamic-control.fieldDetail.displayTargetSetting.button.ok')}
            </a>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default RelationSelectField;
