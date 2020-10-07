import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react'
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { DEFINE_FIELD_TYPE, FIELD_MAXLENGTH } from '../../constants';
import { Storage, translate } from 'react-jhipster';
import _ from 'lodash';
import { languageCode } from 'app/config/language-code';
import StringUtils, { toKatakana, getDefaultFieldLabel } from 'app/shared/util/string-utils';

type IFieldDetailEditSelectProps = IDynamicFieldProps

const FieldDetailEditSelect = forwardRef((props: IFieldDetailEditSelectProps, ref) => {
  
  const lang = Storage.session.get('locale', 'ja_jp');
  const fieldInfo = props.fieldInfo;
  const fieldType = props.fieldInfo.fieldType && props.fieldInfo.fieldType.toString();
  const isSingle = fieldType === DEFINE_FIELD_TYPE.SINGER_SELECTBOX || fieldType === DEFINE_FIELD_TYPE.RADIOBOX
  const prefix = 'dynamic-control.fieldDetail.layoutSelect.';

  const [languages] = useState([])
  const [listFieldItems, setListFieldItems] = useState([]);
  const [listItemLabelAdding, setListItemLabelAdding] = useState([])
  const [itemErrors, setItemErrors] = useState(null);
  const [showDefaultLabel, setShowDefaultLabel] = useState(true)

  /**
   * Check duplicate of item.
   * @param arrLanguage
   */
  const checkItemForAnOption = (arrLanguage) => {
    arrLanguage.map((item, idx) => {
      if (_.isString(item)) {
        arrLanguage[idx] = JSON.parse(item);
      }
    })
    const fieldLabelError = [];
    const fieldLanguageError = [];
    const indexError = [];
    if (Array.isArray(arrLanguage) && arrLanguage.length > 0) {
      const languageOfField = Object.keys(arrLanguage[0]);
      for (let i = 0; i < arrLanguage.length; i++) {
        languageOfField.forEach((e) => {
          for (let j = (i + 1); j < arrLanguage.length; j++) {
            if (arrLanguage[i][e] === arrLanguage[j][e] && !_.isEmpty(arrLanguage[j][e])) {
              fieldLabelError.push(arrLanguage[j][e]);
              fieldLanguageError.push(e);
              indexError.push(j);
            }
          }
        })
      }
    }
    return { fieldLabelError, fieldLanguageError, indexError }
  }

  const getDefaultLabel = () => {
    let label = "(" + languageCode[0].name + ")";
    languageCode.forEach((item, idx) => {
      if (item.code === lang) {
        label = "(" + item.name + ")";
      }
    })
    if (showDefaultLabel) {
      return label;
    }else {
      return '';
    }
  }

  useImperativeHandle(ref, () => ({
    /**
   * Validate Select
   */
  validate () {
    let isValidateShowLabelSelect = true;
    const tmpValidateShowLabelSelect = {};
    if (_.isNil(listFieldItems) || listFieldItems.length < 1) {
      isValidateShowLabelSelect = false;
      tmpValidateShowLabelSelect['fieldItems'] = translate("messages.ERR_COM_0013")
    } else {
      for (let i = 0; i < listFieldItems.length; i++) {
        let isValidateItem = false;
        // listFieldItems[i].itemLabel.value = _.isString(listFieldItems[i].itemLabel.value) ? JSON.parse(listFieldItems[i].itemLabel.value) : listFieldItems[i].itemLabel.value;
        for (let j = 0; j < listFieldItems[i].itemLabel.length; j++) {
          const label = listFieldItems[i].itemLabel[j];
          if (!_.isNil(label) && !_.isEmpty(label.value) && label.default) {
            isValidateItem = true;
            break;
          }
        }
        if (!isValidateItem) {
          isValidateShowLabelSelect = false;
          tmpValidateShowLabelSelect[`fieldItems_${i}`] = translate("messages.ERR_COM_0013")
        }
      }
      // validate max length
      const arrItemLabel = [];
      for (let i = 0; i < listFieldItems.length; i++) {
        for (let j = 0; j < listFieldItems[i].itemLabel.length; j++) {
          // let itemLabelObj = null;
          // try {
          //   itemLabelObj = _.isString(listFieldItems[i].itemLabel.value) ? JSON.parse(listFieldItems[i].itemLabel.value) : listFieldItems[i].itemLabel.value;
          // } catch (error) {
          // const itemLabelObj = listFieldItems[i].itemLabel[j].value;
          // }
          const itemLabel = listFieldItems[i].itemLabel[j].value;
          if (itemLabel && itemLabel.length > FIELD_MAXLENGTH.itemLabel) {
            isValidateShowLabelSelect = false;
            const maxLength = FIELD_MAXLENGTH.itemLabel;
            tmpValidateShowLabelSelect[`fieldItems_${i}_${listFieldItems[i].itemLabel[j].code}`] = translate("messages.ERR_COM_0025", [maxLength]);
          }
        }
        const objLabel = {}
        const fieldItem = _.cloneDeep(listFieldItems[i]);
        if (fieldItem.itemLabel) {
          fieldItem.itemLabel.forEach((o) => {
          if (o.default) {
            objLabel[o.code] = o.value
          }
        })
        arrItemLabel.push(objLabel);
        }
      }
      const language = checkItemForAnOption(arrItemLabel).fieldLanguageError;
      const labelError = checkItemForAnOption(arrItemLabel).fieldLabelError;
      const indexErrorItem = checkItemForAnOption(arrItemLabel).indexError
      if (language.length > 0) {
        isValidateShowLabelSelect = false;
        for (let k = 0; k < language.length; k++) {
          // tmpValidateShowLabelSelect[`fieldItems_${indexErrorItem[k]}_${language[k]}`] = translate("messages.ERR_COM_0062", { 0: labelError[k] });
          tmpValidateShowLabelSelect[`fieldItems_${indexErrorItem[k]}_${language[k]}`] = StringUtils.translateSpecial('messages.ERR_COM_0062', { 0: labelError[k] });
        }
      }
    }
    setItemErrors(tmpValidateShowLabelSelect);
    return !isValidateShowLabelSelect ? [tmpValidateShowLabelSelect] : []
  },
  }));


  const initialize = () => {
    languageCode.forEach((e, i) => {
      languages.push({ code: e.code, name: e.name, default: e.code === lang, value: '' })
    });
    const nativeIdx = languages.findIndex(e => e.code === lang);
    if (nativeIdx >= 0) {
      const nativeLabel = languages.splice(nativeIdx, 1)[0];
      languages.splice(0, 0, nativeLabel);
    }
    setListItemLabelAdding(_.cloneDeep(languages));
    if (fieldInfo.fieldItems && Array.isArray(fieldInfo.fieldItems) && fieldInfo.fieldItems.length > 0) {
      fieldInfo.fieldItems.forEach((e, idx) => {
        let itemLabel = _.cloneDeep(languages)
        if (e.itemLabel) {
          try {
            const labels = _.isString(e.itemLabel) ? JSON.parse(e.itemLabel) : e.itemLabel;
            itemLabel = getDefaultFieldLabel(labels);
            // for (const label in labels) {
            //   if (!Object.prototype.hasOwnProperty.call(labels, label)) {
            //     continue;
            //   }
            //   const labelIndex = itemLabel.findIndex(o => o.code === label);
            //   if (labelIndex >= 0) {
            //     itemLabel[labelIndex].default = true;
            //     itemLabel[labelIndex].value = labels[label];
            //   }
            // }
          } catch (error) {
            const labelIndex = itemLabel.findIndex(o => o.code === lang);
            if (labelIndex >= 0) {
              itemLabel[labelIndex].default = true;
              itemLabel[labelIndex].value = e.itemLabel;
            }
          }
        }
        if (itemLabel.findIndex(o => o.default) < 0) {
          itemLabel[0].default = true;
        }
        listFieldItems.push({
          itemId: e.itemId,
          fieldId: e.fieldId,
          isDefault: e.isDefault,
          isAvailable: e.isAvailable,
          itemOrder: e.itemOrder,
          itemLabel
        });
      });
      listFieldItems.sort((a, b) => { return (a.itemOrder - b.itemOrder) });
    }
  }
  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    if (props.updateStateElement) {
      const fieldItems = []
      listFieldItems.forEach((e, idx) => {
        const fieldItem = {}
        if (e.itemId) {
          fieldItem['itemId'] = e.itemId
        }
        if (e.fieldId) {
          fieldItem['fieldId'] = e.fieldId
        }
        fieldItem['isAvailable'] = e.isAvailable
        fieldItem['isDefault'] = e.isDefault
        fieldItem['itemOrder'] = e.itemOrder
        const itemLabel = {}
        if (e.itemLabel) {
          e.itemLabel.forEach((o) => {
            if (o.default) {
              itemLabel[o.code] = o.value
            }
          })
        }
        fieldItem['itemLabel'] = itemLabel
        fieldItem['itemOrder'] = idx + 1;
        fieldItems.push(fieldItem)
      })
      props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, { fieldItems })
    }
  }, [listFieldItems])

  const onAddLanguageFieldItemLabel = (fieldIndex: number) => {
    listFieldItems[fieldIndex].itemLabel.forEach(e => {
      e.default = true;
    });
    setListFieldItems(_.cloneDeep(listFieldItems));
  }

  const onRemoveLanguageFieldItemLabel = (fieldIndex: number) => {
    listFieldItems[fieldIndex].itemLabel.forEach(label => {
      if (label.code !== lang) {
        label.default = false;
        // label.value = '';
      }
    });
    setListFieldItems(_.cloneDeep(listFieldItems));
  }

  const onChangeDefaultFieldItem = (ev, fieldIndex: number) => {
    if (fieldIndex >= 0 && fieldIndex < listFieldItems.length) {
      if (!isSingle) {
        listFieldItems[fieldIndex].isDefault = ev.target.checked;
      } else {
        listFieldItems.forEach((e, idx) => {
          if (idx === fieldIndex) {
            listFieldItems[idx].isDefault = ev.target.checked;
          } else {
            listFieldItems[idx].isDefault = !ev.target.checked;
          }
        })
      }
      setListFieldItems(_.cloneDeep(listFieldItems))
    }
  }

  const onChangeAvaiableFieldItem = (ev, fieldIndex: number) => {
    if (fieldIndex >= 0 && fieldIndex < listFieldItems.length) {
      listFieldItems[fieldIndex].isAvailable = ev.target.checked;
      setListFieldItems(_.cloneDeep(listFieldItems))
    }
  }

  const onChangeAvaiableAllFieldItem = (ev) => {
    _.map(listFieldItems, function (o) { _.set(o, 'isAvailable', ev.target.checked) });
    setListFieldItems(_.cloneDeep(listFieldItems))
  }

  const onChangeLabelFieldItem = (ev, idx, jdx) => {
    if (ev.target.value.length <= FIELD_MAXLENGTH.itemLabel) {
    listFieldItems[idx].itemLabel[jdx].value = ev.target.value;
    setListFieldItems(_.cloneDeep(listFieldItems))
    }
  }

  const convertToKatakana = (ev, idx, jdx) => {
    if (ev.target.value.length <= FIELD_MAXLENGTH.itemLabel) {
    listFieldItems[idx].itemLabel[jdx].value = toKatakana(ev.target.value);
    setListFieldItems(_.cloneDeep(listFieldItems))
    }
  }

  const onChangeFieldItemAdding = (ev, idx) => {
    if (ev.target.value.length <= FIELD_MAXLENGTH.itemLabel) {
    listItemLabelAdding[idx].value = ev.target.value;
    setListItemLabelAdding(_.cloneDeep(listItemLabelAdding));
    }
  }

  const convertToKatakanaFieldItemAdding = (ev, idx) => {
    if (ev.target.value.length <= FIELD_MAXLENGTH.itemLabel) {
    listItemLabelAdding[idx].value = toKatakana(ev.target.value);
    setListItemLabelAdding(_.cloneDeep(listItemLabelAdding));
    }
  }

  const onRemoveFieldItem = (idx: number) => {
    listFieldItems.forEach((o, i) => {
      if (itemErrors) {
        Object.keys(itemErrors).forEach((item) => {
          if (item.includes(`fieldItems_${i}`)) {
            delete itemErrors[item];
          }
        })
      }
    })
    listFieldItems.splice(idx, 1);
    if (listFieldItems.length > 0) {
      // if (listFieldItems.findIndex(o => o.isDefault) < 0) {
      //   listFieldItems[0].isDefault = true
      // }
      // This is the function of the future
      // if (listFieldItems.findIndex(o => o.isAvailable) < 0) {
      //   listFieldItems[0].isAvailable = true
      // }
      listFieldItems.forEach((o, i) => {
        if (_.isNil(listFieldItems[i])) {
          listFieldItems[idx].itemOrder = i + 1;
        }
      })
    }
    setListFieldItems(_.cloneDeep(listFieldItems));
    setListItemLabelAdding(_.cloneDeep(listItemLabelAdding));
  }

  const onAddLanguageFieldItemAdding = (ev) => {
    listItemLabelAdding.forEach(e => {
      e.default = true;
    });
    setListItemLabelAdding(_.cloneDeep(listItemLabelAdding));
    setShowDefaultLabel(false);
  }

  const onRemoveLanguageFieldItemAdding = () => {
    listItemLabelAdding.forEach(e => {
      if (e.code !== lang) {
        e.default = false;
        // e.value = '';
      }
    });
    setShowDefaultLabel(true);
    setListItemLabelAdding(_.cloneDeep(listItemLabelAdding));
  }

  const onAddMoreFieldItem = () => {
    listFieldItems.push({
      isDefault: false,
      itemOrder: listFieldItems.length + 1,
      isAvailable: true,
      itemLabel: _.cloneDeep(listItemLabelAdding)
    });
    setListFieldItems(_.cloneDeep(listFieldItems))
    // clear default
    listItemLabelAdding.forEach(e => {
      e.value = '';
    });
    setListItemLabelAdding(_.cloneDeep(listItemLabelAdding));
  }
  
  const ADD_LANGUAGE = 'add'
  const REMOVE_LANGUAGE = 'remove'

  const handleEnterKeyFiled = (event, mode, idx) => {
    if (event.key === 'Enter') {
      if (mode === ADD_LANGUAGE) {
        onAddLanguageFieldItemLabel(idx);
      } else if (mode === REMOVE_LANGUAGE) {
        onRemoveLanguageFieldItemLabel(idx);
      }
    }
  }

  const handleEnterKey = (event, mode) => {
    if (event.key === 'Enter') {
      if (mode === ADD_LANGUAGE) {
        onAddLanguageFieldItemAdding(event);
      } else if (mode === REMOVE_LANGUAGE) {
        onRemoveLanguageFieldItemAdding();
      }
    }
  }

  const renderFieldItems = () => {
    return <>
      {listFieldItems.length > 0 &&
        <div className="layout-input-text">
          <div className=" option-pulldown-header">
            {translate(prefix + 'header')}
            <label className="icon-check mr-0">
              {translate(prefix + 'checkbox.usability')}
              <input type="checkbox"
                checked={listFieldItems.findIndex(o => !o.isAvailable) < 0}
                onChange={onChangeAvaiableAllFieldItem}
              /><i></i>
            </label>
          </div>
        </div>
      }
      <div className="option-pulldown">
        {listFieldItems.map((e, idx) => {
          let isShowOptions = true
          return (
            <>
            {e.itemLabel.map((o, jdx) => {
              if (!o.default) {
                return <></>
              }
              let indexLanguageShowOptions = -1;
              if ((o.value || (!o.value && e.itemLabel.filter(a => a.default === true).length === 1)) && isShowOptions) {
                indexLanguageShowOptions = jdx;
                isShowOptions = false;
              }
              if (e.itemLabel.filter(a => a.default === true).length > 1) {
                indexLanguageShowOptions = 0;
              }
              const isError = itemErrors && (_.get(itemErrors, `fieldItems_${idx}_${o.code}`) || _.get(itemErrors, `fieldItems_${idx}`)) /* && e.itemLabel.filter(el => el.default && !_.isEmpty(el.value) && el.value === o.value).length > 0*/
              return (<>
                <div className="wrap-check-radio" key={idx * 200 + jdx}>
                  {jdx === indexLanguageShowOptions && isSingle &&
                    <p className="radio-item">
                      <input name="FieldDetailSelect" id={`FieldDetailSelect_${idx}`} type="radio" checked={e.isDefault} onChange={(ev) => onChangeDefaultFieldItem(ev, idx)} />
                      <label htmlFor={`FieldDetailSelect_${idx}`}>&nbsp;</label>
                    </p>
                  }
                  {jdx > indexLanguageShowOptions && isSingle &&
                    <p className="radio-item"></p>
                  }
                  {jdx === indexLanguageShowOptions && !isSingle &&
                    <label className="radio-item">
                      <input type="checkbox" checked={e.isDefault} onChange={(ev) => onChangeDefaultFieldItem(ev, idx)} /><i></i>
                    </label>
                  }
                  {jdx > indexLanguageShowOptions && !isSingle &&
                    <label className="radio-item"></label>
                  }
                      <div className={`w60 mb-2 mr-2 input-common-wrap 
                       ${(isError || (_.get(itemErrors, `fieldItems_${idx}`)
                        /* && e.itemLabel.filter(el => el.default && !_.isEmpty(el.value)).length < 1 */)) ? 'error' : ''}`}>
                        <input type="text"
                        className="input-normal w100"
                        placeholder={translate(prefix + 'placeholder.addOption')}
                        onChange={(ev) => onChangeLabelFieldItem(ev, idx, jdx)}
                        value={o.value}
                        onBlur={(ev) => convertToKatakana(ev, idx, jdx)}
                      />
                      {_.get(itemErrors, `fieldItems_${idx}_${o.code}`) && <div><span className="messenger">{_.get(itemErrors, `fieldItems_${idx}_${o.code}`)}</span></div>}
                      </div>
                      <span className="language">{`(${o.name})`}</span>
                  {jdx === indexLanguageShowOptions &&
                    <label className="icon-check ml-auto mr-0">
                      <input type="checkbox" checked={e.isAvailable} onChange={(ev) => onChangeAvaiableFieldItem(ev, idx)} /><i></i>
                    </label>}
                  {jdx === indexLanguageShowOptions && <a  className="icon-small-primary icon-erase-small" onClick={() => onRemoveFieldItem(idx)} />}
                </div>
              </>)
            })}
            {/* {e.itemLabel.filter(o =>!o.default).length > 0 && <div><a className="color-blue underline" onClick={() => onAddLanguageFieldItemLabel(idx)} >{translate(prefix + 'button.addLanguage')}</a></div>} */}
            {_.get(itemErrors, `fieldItems_${idx}`) /* && e.itemLabel.filter(el => el.default && !_.isEmpty(el.value)).length < 1 */ &&
              <span className="messenger-error ml-4">{_.get(itemErrors, `fieldItems_${idx}`)}</span>
            }
            {e.itemLabel.filter(o => o.default).length < e.itemLabel.length ?
              <div className="mb-2"><a role="button" tabIndex={0} onKeyPress={event => handleEnterKeyFiled(event, ADD_LANGUAGE, idx)} className="color-blue underline" onClick={() => onAddLanguageFieldItemLabel(idx)} >{translate(prefix + 'button.addLanguage')}</a></div>
              : <div className="mb-2"><a role="button" tabIndex={0} onKeyPress={event => handleEnterKeyFiled(event, REMOVE_LANGUAGE, idx)} className="color-blue underline" onClick={() => onRemoveLanguageFieldItemLabel(idx)} >{translate(prefix + 'button.removeLanguage')}</a></div>
            }
          </>
          )
        })}
      </div>
    </>
  }

  return (
    <div className="form-group">
      <div className="">{translate(prefix + 'label.item')}<span className="label-red ml-2">{translate('dynamic-control.fieldDetail.common.label.required')}</span></div>
      {renderFieldItems()}
      {listItemLabelAdding.map((e, idx) => {
        if (!e.default) {
          return <></>
        }
        return (
          <div className={`layout-input-text input input-common-wrap ${(_.get(itemErrors, 'fieldItems') && listFieldItems.length < 1) ? "error" : ""}`} key={idx}>
            <input className="input-normal mr-2 w65" type="text"
              placeholder={translate(prefix + 'placeholder.addOption')}
              value={e.value}
              onChange={(ev) => onChangeFieldItemAdding(ev, idx)}
              onBlur={(ev) => convertToKatakanaFieldItemAdding(ev, idx)}
            />
            {getDefaultLabel()}
            {listItemLabelAdding.filter(o => o.default).length < listItemLabelAdding.length ? "" : "(" + e.name + ")"}
            {idx === 0 && <button className="button-blue ml-2" onClick={onAddMoreFieldItem} >{translate(prefix + 'button.addOption')}</button>}
          </div>)
      })}
      {_.get(itemErrors, 'fieldItems') && listFieldItems.length < 1 &&
        <span className="messenger-error">{_.get(itemErrors, 'fieldItems')}</span>
      }
      {listItemLabelAdding.filter(o => o.default).length < listItemLabelAdding.length ?
        <div><a role="button" tabIndex={0} onKeyPress={event => handleEnterKey(event, ADD_LANGUAGE)} className="text-blue text-underline" onClick={onAddLanguageFieldItemAdding} >{translate(prefix + 'button.addLanguage')}</a></div>
        : <div><a role="button" tabIndex={0} onKeyPress={event => handleEnterKey(event, REMOVE_LANGUAGE)} className="text-blue text-underline" onClick={onRemoveLanguageFieldItemAdding} >{translate(prefix + 'button.removeLanguage')}</a></div>
      }
    </div>
  )
});

export default FieldDetailEditSelect
