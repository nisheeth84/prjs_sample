import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react'
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { translate } from 'react-jhipster';
import { useId } from 'react-id-generator';
import _ from 'lodash';
import { jsonParse, findErrorMessage } from 'app/shared/util/string-utils';
import { ORG_FORMATS, ORG_TARGET_INDEX} from 'app/config/constants';
import { DEFINE_FIELD_TYPE } from '../../constants';

type IFieldDetailEditSelectOrgProps = IDynamicFieldProps

/**
 * Select Ogranization in setting mode
 *
 * @param props
 */
const FieldDetailEditSelectOrg = forwardRef((props: IFieldDetailEditSelectOrgProps, ref) => {
  const { fieldInfo } = props;
  const [target, setTarget] = useState('');
  const [format, setFormat] = useState(null);
  const idCheck = useId(3, "field_detail_check_org_id_");
  const nameCheck = useId(1, "field_detail_check_org_name_");
  const idRad = useId(2, "field_detail_rad_org_id_");
  const nameRad = useId(1, "field_detail_rad_org_name_");

  useImperativeHandle(ref, () => ({

  }));

  useEffect(() => {
    if (fieldInfo.selectOrganizationData) {
      const orgData = jsonParse(fieldInfo.selectOrganizationData);
      if (orgData && orgData.target) {
        setTarget(orgData.target);
      }
      if (orgData && orgData.format) {
        setFormat(orgData.format);
      }
    } else {
      setTarget('111');
      setFormat(ORG_FORMATS.SINGLE);
    }
  }, []);

  useEffect(() => {
    if (props.updateStateElement) {
      props.updateStateElement(props.fieldInfo, DEFINE_FIELD_TYPE.SELECT_ORGANIZATION, { 
        selectOrganizationData: { target, format: +format }
      });
    }
  }, [target, format]);

  const toggleTargetChange = (idx) => {
    const arrTarget = target.split('');
    arrTarget[idx] = +arrTarget[idx] ? '0' : '1';
    setTarget(arrTarget.join(''));
  }

  const handleFomatChange = (event) => {
    setFormat(event.target.value);
  }

  const error = findErrorMessage(props.errorInfos, 'target');

  return (
    <>
      <div className="form-group">
        <label>{translate('dynamic-control.fieldDetail.editSelectOrg.label.target')}</label>
        <label className="icon-check">
          <input id={idCheck[0]} name={nameCheck[0]} type="checkbox" checked={_.isEqual(target.split('')[ORG_TARGET_INDEX.EMPLOYEE], '1')} 
            onChange={() => toggleTargetChange(ORG_TARGET_INDEX.EMPLOYEE)} />
          <i />{translate('dynamic-control.fieldDetail.editSelectOrg.employee')}
        </label>
        <label className="icon-check">
          <input id={idCheck[1]} name={nameCheck[0]} type="checkbox" checked={_.isEqual(target.split('')[ORG_TARGET_INDEX.DEPARTMENT], '1')} 
            onChange={() => toggleTargetChange(ORG_TARGET_INDEX.DEPARTMENT)} />
          <i />{translate('dynamic-control.fieldDetail.editSelectOrg.department')}
        </label>
        <label className="icon-check">
          <input id={idCheck[2]} name={nameCheck[0]} type="checkbox" checked={_.isEqual(target.split('')[ORG_TARGET_INDEX.GROUP], '1')} 
            onChange={() => toggleTargetChange(ORG_TARGET_INDEX.GROUP)} />
          <i />{translate('dynamic-control.fieldDetail.editSelectOrg.group')}
        </label>
      </div>
      {error && <span className="messenger-error">{error}</span>}
      <div className="form-group">
        <label>{translate('dynamic-control.fieldDetail.editSelectOrg.label.format')}</label>
        <div className="wrap-check-radio">
          <p className="radio-item">
            <input type="radio" id={idRad[0]} name={nameRad[0]} checked={_.toString(format) === ORG_FORMATS.SINGLE} value={ORG_FORMATS.SINGLE} onChange={handleFomatChange} />
            <label htmlFor={idRad[0]}>{translate('dynamic-control.fieldDetail.editSelectOrg.single')}</label>
          </p>
          <p className="radio-item">
            <input type="radio" id={idRad[1]} name={nameRad[0]} checked={_.toString(format) === ORG_FORMATS.MULTI} value={ORG_FORMATS.MULTI} onChange={handleFomatChange} />
            <label htmlFor={idRad[1]}>{translate('dynamic-control.fieldDetail.editSelectOrg.multi')}</label>
          </p>
        </div>
      </div>
    </>
  )

});

export default FieldDetailEditSelectOrg
