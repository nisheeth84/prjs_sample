import React, { forwardRef, useState, useEffect, useRef } from 'react'
import _ from 'lodash';

import {
  getFieldsInfo,
  getRelationData,
  getServicesInfo,
  reset,
} from 'app/shared/reducers/dynamic-field.reducer';
import { Options, connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import StringUtils, { getFieldLabel, jsonParse } from 'app/shared/util/string-utils';
import { getValueProp } from 'app/shared/util/entity-utils';
import { DEFINE_FIELD_TYPE } from '../../constants';
import { translate } from 'react-jhipster';
import { timeUtcToTz, DATE_TIME_FORMAT, formatDate, utcToTz } from 'app/shared/util/date-utils';
import { ControlType } from 'app/config/constants';
import FieldDetailViewSelectOrg from 'app/shared/layout/dynamic-form/control-field/detail/field-detail-view-select-org';
import FieldDetailViewTextArea from '../detail/field-detail-view-text-area';
import { downloadFile } from 'app/shared/util/file-utils';
import Popover from 'react-tiny-popover';
import useDeepCompareEffect from 'use-deep-compare-effect'

interface IRelationDisplayTabOwnProps {
  id?: any
  listFieldInfo?: any[]
  recordData?: any,
  fieldNameExtension?: string;
  currentTabId?: number,
  isHeader: boolean,
  onChangeTab?: (tabId: number) => void
}

interface IRelationDisplayTabDispatchProps {
  getRelationData,
  getFieldsInfo,
  getServicesInfo,
  reset,
}

interface IRelationDisplayTabStateProps {
  relationData,
  fieldInfo,
  serviceInfo,
}

const RelationDisplayFile = (props: {file}) => {
  const IMAGE_EXT = ['jpg', 'png', 'gif', 'bmp', 'svg', 'jpeg', 'ico'];
  const [showPreviewImage, setShowPreviewImage] = useState(false);
  const previewRef = useRef(null);
  
  const onHandleMouseDown = (ev) => {
    if (previewRef && previewRef.current && previewRef.current.contains(ev.target)) {
      return;
    }
    setShowPreviewImage(false);
  }

  useEffect(() => {
    document.addEventListener('mousedown', onHandleMouseDown);
    return () => {
      document.removeEventListener('mousedown', onHandleMouseDown);
    };
  }, [])

  const handleClickFile = (fileName, link) => {
    let ext = 'xxx';
    if (fileName) {
      ext = fileName.split('.').pop().toLowerCase();
    }
    if (IMAGE_EXT.includes(ext)) {
      setShowPreviewImage(!showPreviewImage);
    } else {
      downloadFile(fileName, link, () => {});
    }
  };

  const renderPreviewImage = () => {
    return (
      <img ref={previewRef} src={getValueProp(props.file, 'file_url')} style={{maxWidth:400, maxHeight:300, objectFit: 'contain'}}/>
    )
  }
  
  return (
    <>
      <Popover
        containerStyle={{ overflow: 'initial', zIndex: '9000' }}
        isOpen={showPreviewImage}
        position={['bottom', 'top', 'left', 'right']}
        content={renderPreviewImage()}
      >
        <a className="file" onClick={evt => handleClickFile(getValueProp(props.file, 'file_name'), getValueProp(props.file, 'file_url'))}>
          {getValueProp(props.file, 'file_name')}
        </a>
      </Popover>
    </>
  )
}

type IRelationDisplayTabProps = IRelationDisplayTabDispatchProps & IRelationDisplayTabStateProps & IRelationDisplayTabOwnProps

const RelationDisplayTab: React.FC<IRelationDisplayTabProps> = forwardRef((props, ref) => {
  const START_INDEX_FIELD_ID = 9000;
  const [fieldRelation, setFieldRelation] = useState([])
  const [fieldInfoBelong, setFieldInfoBelong] = useState([])
  const [recordsRelation, setRecordRelation] = useState(null);

  const isFieldInfoRelationTab = (field) => {
    if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.RELATION) {
      if (field.relationData && field.relationData.displayTab === 1) {
        return true;
      }
    }
    return false;
  }

  const getValueByFieldName = (record: any, fieldName: string, fieldNameExtension: string) => {
    if (_.has(record, _.camelCase(fieldName)) || _.has(record, _.snakeCase(fieldName))) {
      return getValueProp(record, fieldName);
    } else if (_.has(record, _.camelCase(fieldNameExtension)) || _.has(record, _.snakeCase(fieldNameExtension))) {
      const extData = getValueProp(record, fieldNameExtension);
      if (extData) {
        if (_.isArray(extData)) {
          let fValue = null;
          extData.forEach(e => {
            if (StringUtils.equalPropertyName(e['key'], fieldName)) {
              fValue = e['value'];
            }
          });
          return fValue;
        } else {
          return getValueProp(extData, fieldName);
        }
      }
    }
    return null;
  };
  
  const parseRelationIds = (relationIds: any) => {
    const ids = [];
    if (!relationIds) {
      return ids;
    }
    if (_.isString(relationIds)) {
      try {
        const tmp = JSON.parse(relationIds);
        if (_.isArray(tmp)) {
          tmp.forEach(e => {
            if (_.isNumber(e)) {
              ids.push(e);
            } else if (_.isNumber(_.get(e, 'value'))) {
              ids.push(_.get(e, 'value'));
            }
          });
        }
      } catch {
        ids.push(...relationIds.split(/(?:,|;)+/));
      }
    } else if (_.isArray(relationIds)) {
      ids.push(...relationIds);
    }
    return ids.map(x => +x);
  };

  const getRecordIdsRelation = (fields: any[], record: any, fieldNameExtension: string) => {
    const recordIds = [];
    if (!fields || fields.length < 1 || !record) {
      return recordIds;
    }
    for (let i = 0; i < fields.length; i++) {
      if (!_.isEqual(_.toString(fields[i].fieldType), DEFINE_FIELD_TYPE.RELATION)) {
        continue;
      }
      if (!fields[i].relationData || !fields[i].relationData.fieldBelong) {
        continue;
      }
      const belong = fields[i].relationData.fieldBelong;
      if (recordIds.findIndex(e => e.fieldBelong === belong) < 0) {
        recordIds.push({ fieldBelong: belong, ids: [], fields: [] });
      }
      if (fields[i].relationData.displayFields) {
        const recIndex = recordIds.findIndex(e => e.fieldBelong === belong);
        if (recIndex >= 0) {
          fields[i].relationData.displayFields.forEach(field => {
            if (recordIds[recIndex].fields.findIndex(e => e === field.fieldId) < 0) {
              recordIds[recIndex].fields.push(field.fieldId);
            }
          })
        }
      }
      const relationIds = getValueByFieldName(record, fields[i].fieldName, fieldNameExtension);
      const ids = parseRelationIds(relationIds);
      ids.forEach(id => {
        const idx = recordIds.findIndex(e => e.fieldBelong === belong);
        if (recordIds[idx].ids.findIndex(o => o === id) < 0) {
          recordIds[idx].ids.push(id);
        }
      });
    }
    return recordIds;
  };

  useEffect(() => {
    if (props.listFieldInfo) {
      setFieldRelation(props.listFieldInfo.filter(e => isFieldInfoRelationTab(e)));
    }
  }, [props.listFieldInfo])

  useDeepCompareEffect(() => {
    if (!props.isHeader) {
      const relationIds = [];
      if (fieldRelation && props.recordData) {
        relationIds.push(...getRecordIdsRelation(fieldRelation, props.recordData, props.fieldNameExtension));
      }
      const fieldsInfo = [];
      if (relationIds.length > 0) {
        relationIds.forEach((el, idx) => {
          if (el.ids && el.ids.length > 0) {
            props.getRelationData(props.id, el.fieldBelong, el.ids, el.fields);
          }
          if (fieldsInfo.findIndex(field => field === el.fieldBelong) < 0) {
            fieldsInfo.push(el.fieldBelong);
          }
        });
      }
      fieldsInfo.forEach(el => {
        props.getFieldsInfo(props.id, el, null, null);
      })
    }
  }, [props.recordData, fieldRelation])

  useEffect(() => {
    if (props.relationData) {
      let isChange = false;
      let records = null;
      let fieldItems = null;
      if (recordsRelation && _.has(recordsRelation, 'records')) {
        records = _.cloneDeep(_.get(recordsRelation, 'records'))
      } else {
        records = [];
      }
      if (recordsRelation && _.has(recordsRelation, 'fieldItems')) {
        fieldItems = _.cloneDeep(_.get(recordsRelation, 'fieldItems'))
      } else {
        fieldItems = [];
      }
      if (props.relationData.records) { 
        props.relationData.records.forEach(el => {
          const idx = records.findIndex(record => record.fieldBelong === el.fieldBelong && record.recordId === el.recordId)
          if (idx < 0) {
            records.push(el);
            isChange = true;  
          } else if (!_.isEqual(el.dataInfos, records[idx].dataInfos)){
            records[idx].dataInfos = _.cloneDeep(el.dataInfos);
            isChange = true;  
          }
        })
      }
      if (props.relationData.fieldItems) {
        props.relationData.fieldItems.forEach(el => {
          if (fieldItems.findIndex(item => item.itemId === el.itemId) < 0) {
            fieldItems.push(el);
            isChange = true;
          }
        })
      }
      if (isChange) {
        setRecordRelation({records, fieldItems});
      }
    }
  }, [props.relationData])

  useEffect(() => {
    if (props.fieldInfo) {
      setFieldInfoBelong(_.unionWith(fieldInfoBelong, props.fieldInfo, _.isEqual))
    }
  }, [props.fieldInfo])

  useEffect(() => {
    if (props.isHeader) {
      props.getServicesInfo(props.id, null)
    }
    return () => {
      props.reset(props.id);
    }
  },[])

  const makeTabId = (fieldId: number) => {
    if (fieldId < 0) {
      return fieldId - START_INDEX_FIELD_ID
    } else {
      return START_INDEX_FIELD_ID + fieldId
    }
  }

  const getFieldIdFromTab = () => {
    if (props.currentTabId < 0) {
      return props.currentTabId + START_INDEX_FIELD_ID
    } else {
      return props.currentTabId - START_INDEX_FIELD_ID
    }
  }

  const onChangeTab = (tab) => {
    if (props.onChangeTab) {
      props.onChangeTab(makeTabId(tab.fieldId))
    }
  }

  const getFieldLabelDisplayInTab = (field) => {
    const fieldLabel = getFieldLabel(field, 'fieldLabel');
    let serviceName = '';
    if (props.serviceInfo && field.relationData && field.relationData.fieldBelong) {
      const idx = props.serviceInfo.findIndex(e => e.serviceId === field.relationData.fieldBelong);
      if (idx >= 0) {
        serviceName = getFieldLabel(props.serviceInfo[idx], 'serviceName')
      }
    }
    return <>{`${serviceName}(${fieldLabel})`}</>
  }

  const getHeaderRelationField = (field) => {
    if (!field || !fieldInfoBelong) {
      return <></>;
    }
    const idx =  fieldInfoBelong.findIndex( e => e.fieldId === field.fieldId);
    if (idx < 0) {
      return <></>;
    }
    return <>{getFieldLabel(fieldInfoBelong[idx], 'fieldLabel')}</>
  }

  const handleClickFile = (fileName, link) => {
    downloadFile(fileName, link, () => {});
  };

  const getDataRelationField = (recordId: number, displayFieldId: number) => {
    if (!recordsRelation || !recordsRelation.records) {
      return <></>;
    }
    const idx = recordsRelation.records.findIndex( e => e.recordId === recordId)
    if (idx < 0) {
      return <></>;
    }
    if (!recordsRelation.records[idx].dataInfos) {
      return <></>;
    }
    const field = _.find(recordsRelation.records[idx].dataInfos, {fieldId: displayFieldId});
    let valueDisplay = _.get(field, 'value');
    const fType = _.toString(_.get(field, 'fieldType'));
    if (fType === DEFINE_FIELD_TYPE.CHECKBOX ||  fType === DEFINE_FIELD_TYPE.RADIOBOX ||
        fType === DEFINE_FIELD_TYPE.SINGER_SELECTBOX || fType === DEFINE_FIELD_TYPE.MULTI_SELECTBOX) {
      const items = [];
      const itemIds = [];
      try {
        if (_.isString(valueDisplay)) {
          const tmp = JSON.parse(valueDisplay);
          if (_.isArray(tmp)) {
            itemIds.push(...tmp);
          } else {
            itemIds.push(tmp);
          }
        } else if (_.isArray(valueDisplay)) {
          itemIds.push(...valueDisplay);
        } else {
          itemIds.push(valueDisplay);
        }
      } catch (ex) {
        console.log(ex);
        itemIds.push(valueDisplay);
      }
      itemIds.forEach( e => {
        if (recordsRelation.fieldItems) {
          const idxItem = recordsRelation.fieldItems.findIndex(item => _.toString(item.itemId) === _.toString(e))
          if (idxItem >= 0) {
            items.push(getFieldLabel(recordsRelation.fieldItems[idxItem], 'itemLabel'));
          } else {
            items.push(e);
          }
        } else {
          items.push(e);
        }
      });
      valueDisplay = items.join(" ");
    } else if (fType === DEFINE_FIELD_TYPE.ADDRESS) {
      if (!_.isEmpty(valueDisplay)) {
        const dataJson = jsonParse(valueDisplay, {})['address'];
        if (getValueProp(field, 'isLinkedGoogleMap')) {
          return <a href={`http://google.com/maps/search/${dataJson}`}>{translate("dynamic-control.fieldDetail.layoutAddress.lable.postMark")}{dataJson}</a>;
        } else {
          return <a>{translate("dynamic-control.fieldDetail.layoutAddress.lable.postMark")}{dataJson}</a>
        }
      }
    } else if (fType === DEFINE_FIELD_TYPE.LINK) {
      const dataLink = jsonParse(valueDisplay, {});
      if (_.get(field, 'urlType') === 2) {
        dataLink['url_text'] = getValueProp(field, 'urlText');
        dataLink['url_target'] = getValueProp(field, 'urlTarget');
      }
      if (getValueProp(dataLink, 'url_text')) {
        if (getValueProp(dataLink, "url_target")) {
          return <a href={getValueProp(dataLink, 'url_target')} className="text-blue">{getValueProp(dataLink, 'url_text')}</a>
        } else {
          return <>{getValueProp(dataLink, 'url_text')}</>
        }
      } else {
        return <a href={getValueProp(dataLink, 'url_target')} className="text-blue">{getValueProp(dataLink, 'url_target')}</a>
      }
    } else if (fType === DEFINE_FIELD_TYPE.TIME) {
      valueDisplay = timeUtcToTz(valueDisplay)
    } else if (fType === DEFINE_FIELD_TYPE.DATE) {
      valueDisplay = formatDate(valueDisplay);
    } else if (fType === DEFINE_FIELD_TYPE.DATE_TIME) {
      valueDisplay = utcToTz(valueDisplay, DATE_TIME_FORMAT.User);
    } else if (fType === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION) {
      const orgData = jsonParse(valueDisplay, []);
      if (orgData && orgData.length > 0) {
        return <FieldDetailViewSelectOrg 
                  fieldInfo={{...field, fieldBelong: props.listFieldInfo[0].fieldBelong}}
                  controlType={ControlType.DETAIL_VIEW}
                  ogranizationValues={valueDisplay}
                  recordId={recordId}
                />
      } else {
        return <></>
      }
    } else if (fType === DEFINE_FIELD_TYPE.EMAIL) {
      return <a href={`mailto:${valueDisplay}`}>{valueDisplay}</a>
    } else if (fType === DEFINE_FIELD_TYPE.TEXTAREA) {
      return <FieldDetailViewTextArea text={valueDisplay} />
    } else if (fType === DEFINE_FIELD_TYPE.FILE) {
      let files = [];
      try {
        files = _.isString(valueDisplay) ? JSON.parse(valueDisplay) : valueDisplay;
        if (!files || !Array.isArray(files)) {
          files = [];
        }
      } catch (e) {
        files = [];
      }
      return (
        <>
          {files.map((file, index) => (
            <>
              <a className="file" onClick={evt => handleClickFile(getValueProp(file, 'file_name'), getValueProp(file, 'file_url'))}>
                {getValueProp(file, 'file_name')}
              </a>
              {index < files.length - 1 && translate('commonCharacter.comma')}
            </>
          ))}
        </>
      );
    }
    return <>{valueDisplay}</>
  }
  
  const renderTabRelation = () => {
    return (
      <>
      {fieldRelation.map((tab, idx) => {      
        return (
          <li key={idx} className="nav-item">
            <a onClick={() => onChangeTab(tab)} className={`nav-link ${makeTabId(tab.fieldId) === props.currentTabId  ? 'active':''}`} data-toggle="tab">
              {getFieldLabelDisplayInTab(tab)}
            </a>
          </li>
          )
        })
      }
      </>
    )
  }

  const renderContentTab = () => {
    if (!fieldRelation || !props.recordData) {
      return <></>;
    }
    const idx = fieldRelation.findIndex( e => e.fieldId === getFieldIdFromTab())
    if (idx < 0) {
      return <></>;
    }
    const recordIds = getRecordIdsRelation([fieldRelation[idx]], props.recordData, props.fieldNameExtension)
    const fields = []
    if (fieldRelation[idx] && fieldRelation[idx].relationData && fieldRelation[idx].relationData.displayFields) {
      fields.push(...fieldRelation[idx].relationData.displayFields);
    }

    return (
      <>
        <table className="table-default">
          <thead>
            <tr>
              {fields.map(field =>
              <td key={field.fieldId}>{getHeaderRelationField(field)}</td>
              )}
            </tr>
          </thead>
          <tbody>
            {recordIds.length > 0 && recordIds[0].ids && recordIds[0].ids.map(record => {
              return (
              <tr key={record}>
                {fields.map(field =>
                  <td key={`${record}_${field.fieldId}`} className="text-left">{getDataRelationField(record, field.fieldId)}</td>
                )}
              </tr>
              )
            })}
          </tbody>
        </table>
      </>
    );
  }

  if (!fieldRelation || fieldRelation.length < 1) {
    return <></>
  }
  return (
  <>
    {props.isHeader && renderTabRelation()}
    {!props.isHeader && renderContentTab()}
  </>)
});

const mapStateToProps = ({ dynamicField }: IRootState, ownProps: IRelationDisplayTabOwnProps) => {
  const defaultValue = {
    relationData: null,
    fieldInfo: null,
    serviceInfo: null,
  }
  const id = `${ownProps.id}`;
  if (dynamicField && dynamicField.data.has(id)) {
    defaultValue.relationData = dynamicField.data.get(id).relationData
    defaultValue.fieldInfo = dynamicField.data.get(id).fieldInfo
    defaultValue.serviceInfo = dynamicField.data.get(id).serviceInfo
  }
  return defaultValue;
};

const mapDispatchToProps = {
  getRelationData,
  getFieldsInfo,
  getServicesInfo,
  reset,
};

const options = {forwardRef: true};

export default connect<IRelationDisplayTabStateProps, IRelationDisplayTabDispatchProps, IRelationDisplayTabOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(RelationDisplayTab);

