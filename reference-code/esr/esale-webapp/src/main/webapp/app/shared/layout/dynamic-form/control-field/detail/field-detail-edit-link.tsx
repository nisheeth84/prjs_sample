import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react'
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { useId } from 'react-id-generator';
import { translate } from 'react-jhipster';
import { findErrorMessage, toKatakana } from 'app/shared/util/string-utils';
import { LINK_TARGET_IFRAME } from 'app/config/constants';
import { FIELD_MAXLENGTH } from '../../constants';

type IFieldDetailEditLinkProps = IDynamicFieldProps


const FieldDetailEditLink = forwardRef((props: IFieldDetailEditLinkProps, ref) => {
  const [urlType, setUrlType] = useState(1)
  const [defaultValue, setDefaultValue] = useState('')
  const [urlTarget, setUrlTarget] = useState('')
  const [urlText, setUrlText] = useState('')
  const [linkTarget, setLinkTarget] = useState(0)
  const [displayFormat, setDisplayFormat] = useState(1)
  const [iframeHeight, setIframeHeight] = useState('')

  const idAutomatic = useId(2, "field_detail_link_id_");
  const nameAutomatic = useId(1, "field_detail_link_name_");

  const idDisplayFormatAutomatic = useId(2, "field_detail_format_id_");
  const nameDisplayFormatAutomatic = useId(1, "field_detail_format_name_");

  const areaOptionTarget = useRef(null);
  const [showAreaOptionTarget, setShowAreaOptionTarget] = useState(false);

  const ARBITRARY = 1;
  const FIXED = 2;

  const DISPLAY_LINK = 1;
  const DISPLAY_IFRAME = 2;

  useImperativeHandle(ref, () => ({

  }));

  const handleUserMouseDown = (event) => {
    if (areaOptionTarget && areaOptionTarget.current && !areaOptionTarget.current.contains(event.target)) {
      setShowAreaOptionTarget(false);
    }
  };

  const initialize = () => {
    if (props.fieldInfo.urlType) {
      setUrlType(props.fieldInfo.urlType)
    }
    if (props.fieldInfo.defaultValue) {
      setDefaultValue(props.fieldInfo.defaultValue);
    }
    if (props.fieldInfo.urlTarget) {
      setUrlTarget(props.fieldInfo.urlTarget)
    }
    if (props.fieldInfo.urlText) {
      setUrlText(props.fieldInfo.urlText)
    }
    if (props.fieldInfo.linkTarget) {
      setLinkTarget(props.fieldInfo.linkTarget)
      if (props.fieldInfo.linkTarget === LINK_TARGET_IFRAME) {
        setDisplayFormat(DISPLAY_IFRAME);
      } else {
        setDisplayFormat(DISPLAY_LINK);
      }
    }
    if (props.fieldInfo.iframeHeight) {
      setIframeHeight(props.fieldInfo.iframeHeight)
    }
  }

  useEffect(() => {
    if (urlType !== FIXED) {
      setDisplayFormat(DISPLAY_LINK);
    }
  }, [urlType])

  useEffect(() => {
    window.addEventListener('mousedown', handleUserMouseDown);
    initialize()
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, [])

  useEffect(() => {
    if (props.updateStateElement) {
      const params = { urlType, defaultValue, urlTarget, urlText, linkTarget, iframeHeight: parseInt(iframeHeight, 10) }
      if (urlType === 1) {
        params.urlTarget = null
      } else {
        params.defaultValue = null
      }
      if (displayFormat === DISPLAY_IFRAME) {
        params.linkTarget = LINK_TARGET_IFRAME
      } else {
        params.iframeHeight = null
        if (linkTarget === LINK_TARGET_IFRAME) {
          // params.linkTarget = 0;
          setLinkTarget(0);
        }
      }
      props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, params)
    }
  }, [urlType, defaultValue, urlTarget, urlText, linkTarget, iframeHeight, displayFormat])


  const getTargetTypes = () => {
    const targetTypes = [];
    targetTypes.push(translate('dynamic-control.fieldDetail.editLink.targetTypes.newWindow'));
    targetTypes.push(translate('dynamic-control.fieldDetail.editLink.targetTypes.sameScreen'));
    return targetTypes;
  }

  const errUrlTarget = findErrorMessage(props.errorInfos, 'urlTarget');
  const errUrlText = findErrorMessage(props.errorInfos, 'urlText');
  const errDefVal = findErrorMessage(props.errorInfos, 'defaultValue');
  const errIframeHeight = findErrorMessage(props.errorInfos, 'iframeHeight');

  /**
   * handle Change DefaultValue
   * 
   * @param evt
   */
  const onChangeIframeHeight = (evt) => {
    const floatRegExp = new RegExp('^[0-9]*$');
    const { value } = evt.target
    if (value === '' || floatRegExp.test(value)) {
      setIframeHeight(value);
    }
  }

  return (<>
    <div className="form-group">
      <label>{translate('dynamic-control.fieldDetail.layoutLink.optionOrFixed')}</label>
      <div className="wrap-check-radio">
        <p className="radio-item">
          <input type="radio" id={idAutomatic[0]} name={nameAutomatic[0]}
            value={1} checked={urlType === 1} onChange={(e) => setUrlType(+e.target.value)}
          />
          <label htmlFor={idAutomatic[0]}>{translate('dynamic-control.fieldDetail.layoutLink.optionUrlEnterArbitrary')}</label>
        </p>
        <p className="radio-item">
          <input type="radio" id={idAutomatic[1]} name={nameAutomatic[0]}
            value={2} checked={urlType === 2} onChange={(e) => setUrlType(+e.target.value)}
          />
          <label htmlFor={idAutomatic[1]}>{translate('dynamic-control.fieldDetail.layoutLink.optionUrlFixed')}</label>
        </p>
      </div>
    </div>
    <div className="form-group">
      {
        urlType === ARBITRARY &&
        <>
          <label>
          {translate('dynamic-control.fieldDetail.layoutText.label')}&ensp;
          <span className="label-red">{translate('dynamic-control.fieldDetail.common.label.required')}</span>
          </label>
          <div className={`input-common-wrap ${errDefVal ? 'error' : ''}`}>
            <input type="text" className={`input-normal`} placeholder={translate('dynamic-control.fieldDetail.layoutText.placeholder')}
              value={defaultValue} 
              onChange={(e) => (e.target.value.length <= FIELD_MAXLENGTH.defaultValue && setDefaultValue(e.target.value))}
              onBlur={(e) => (e.target.value.length <= FIELD_MAXLENGTH.defaultValue && setDefaultValue(toKatakana(e.target.value)))}
            />
          </div>
          {errDefVal && <span className="messenger-error">{errDefVal}</span>}
        </>
      }
      {
        urlType === FIXED &&
        <>
          <label>
          {translate('dynamic-control.fieldDetail.layoutLink.labelUrlFixed')}&ensp;
          <span className="label-red">{translate('dynamic-control.fieldDetail.common.label.required')}</span>
          </label>
          <div className={`input-common-wrap ${errUrlTarget ? 'error' : ''}`}>
            <input type="text" className={`input-normal`} placeholder={translate('dynamic-control.fieldDetail.layoutLink.placeholder.urlFixed')}
              value={urlTarget}
              onChange={(e) => (e.target.value.length <= FIELD_MAXLENGTH.defaultValue && setUrlTarget(e.target.value))}
              onBlur={(e) => (e.target.value.length <= FIELD_MAXLENGTH.defaultValue && setUrlTarget(toKatakana(e.target.value)))}
            />
          </div>
          {errUrlTarget && <span className="messenger-error">{errUrlTarget}</span>}
        </>
      }
    </div>
    <div className="form-group">
      <label>
      {translate('dynamic-control.fieldDetail.layoutLink.labelUrlText')}&ensp;
      {urlType === FIXED && <span className="label-red">{translate('dynamic-control.fieldDetail.common.label.required')}</span>}
      </label>
      <div className={`input-common-wrap ${errUrlText ? 'error' : ''}`}>
        <input type="text" className={`input-normal`} placeholder={translate('dynamic-control.fieldDetail.layoutLink.placeholder.urlText')}
          value={urlText} 
          onChange={(e) => (e.target.value.length <= FIELD_MAXLENGTH.urlText && setUrlText(e.target.value))}
          onBlur={(e) => (e.target.value.length <= FIELD_MAXLENGTH.defaultValue && setUrlText(toKatakana(e.target.value)))}
        />
      </div>
      {errUrlText && <span className="messenger-error">{errUrlText}</span>}
    </div>
    <div className="form-group">
      <label>{translate('dynamic-control.fieldDetail.layoutLink.displayFormat')}</label>
      <div className="wrap-check-radio">
        <p className="radio-item">
          <input type="radio" id={idDisplayFormatAutomatic[0]} name={nameDisplayFormatAutomatic[0]}
            value={DISPLAY_LINK} checked={displayFormat === DISPLAY_LINK} onChange={(e) => setDisplayFormat(+e.target.value)}
          />
          <label htmlFor={idDisplayFormatAutomatic[0]}>{translate('dynamic-control.fieldDetail.layoutLink.optionLink')}</label>
        </p>
        <p className={`radio-item ${urlType !== FIXED ? 'radio-item-disable' : ''} normal`}>
          <input type="radio" id={idDisplayFormatAutomatic[1]} name={nameDisplayFormatAutomatic[0]} disabled={urlType !== FIXED}
            value={DISPLAY_IFRAME} checked={displayFormat === DISPLAY_IFRAME} onChange={(e) => setDisplayFormat(+e.target.value)}
          />
          <label htmlFor={idDisplayFormatAutomatic[1]}>{translate('dynamic-control.fieldDetail.layoutLink.optionDisplayInIframe')}</label>
        </p>
      </div>
    </div>
    <div className="form-group">
      {
        displayFormat === DISPLAY_LINK &&
        <>
          <label>{translate('dynamic-control.fieldDetail.layoutLink.displayLocation')}</label>
          <div className="select-option w45">
            <button type="button" className="select-text text-left" onClick={() => setShowAreaOptionTarget(!showAreaOptionTarget)}>{getTargetTypes()[linkTarget]}</button>
            {showAreaOptionTarget &&
              <ul className={"drop-down drop-down2"} ref={areaOptionTarget}>
                {getTargetTypes().map((e, idx) =>
                  <li key={idx} className={`item ${idx === linkTarget ? 'active' : ''} smooth`}
                    onClick={() => { setLinkTarget(idx); setShowAreaOptionTarget(false) }}
                  >
                    {e}
                  </li>
                )}
              </ul>
            }
          </div>
        </>
      }
      {
        displayFormat === DISPLAY_IFRAME &&
        <>
          <label>{translate('dynamic-control.fieldDetail.layoutLink.displayHeight')}<span className="ml-2 label-red">{translate('dynamic-control.fieldDetail.common.label.required')}</span></label>
          <div className={`input-common-wrap ${errIframeHeight ? 'error' : ''}`}>
            <input type="text" className={`input-normal`} placeholder={translate('dynamic-control.fieldDetail.layoutLink.placeholder.displayHeight')}
              value={iframeHeight} onChange={onChangeIframeHeight} maxLength={4}
            />
          </div>
          {errIframeHeight && <span className="messenger-error">{errIframeHeight}</span>}
        </>
      }
    </div>
  </>)

});

export default FieldDetailEditLink
