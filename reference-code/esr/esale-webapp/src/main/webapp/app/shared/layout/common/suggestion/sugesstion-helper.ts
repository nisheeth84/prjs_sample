import _ from 'lodash';
import { DEFINE_FIELD_TYPE } from '../../dynamic-form/constants';
import { FIELD_BELONG } from 'app/config/constants';

export const getSuggestCss = (fieldType, props) => {
  const css = {
    wrapInput: 'input-common-wrap',
    input: 'input-normal',
    icDelete: 'icon-delete',
    wrapSuggest: 'drop-down w100 overflow-hidden',
    ulSuggest: 'dropdown-item style-3',
    liSuggest: 'item smooth'
  };
  try {
    const type = _.toString(fieldType);
    switch (type) {
      case DEFINE_FIELD_TYPE.LOOKUP:
        css.wrapInput = 'input-common-wrap delete';
        css.input = `input-normal ${props.isDisabled ? 'disable' : ''}`;
        break;
      case DEFINE_FIELD_TYPE.RELATION:
        if (props.formatResult === 1) {
          css.wrapInput = `input-common-wrap tag ${props.errorInfo ? 'error' : 'delete'} ${
            props.selected ? 'pl-12' : ''
          } ${props.isDisabled ? 'disable' : ''}`;
          css.input = `input-normal pl-12 ${props.errorInfo ? 'error' : ''} ${
            props.isDisabled ? 'disable' : ''
          }`;
        } else if (props.formatResult === 2) {
          css.wrapInput = `input-common-wrap delete ${props.isDisabled ? 'disable' : ''}`;
          css.input = `input-normal ${props.errorInfo ? 'error' : ''} ${
            props.isDisabled ? 'disable' : ''
          }`;
        }
        css.icDelete = 'icon-delete d-none';
        css.liSuggest =
          props.fieldBelong === FIELD_BELONG.ACTIVITY ? 'item smooth' : 'item smooth d-flex';
        break;
      case DEFINE_FIELD_TYPE.SELECT_ORGANIZATION:
        css.wrapInput = `input-common-wrap delete ${props.hasTag ? 'tag' : ''} ${
          props.msg ? 'error' : ''
        }`;
        css.input = `input-normal ${props.isDisabled ? 'disable' : ''}`;
        css.wrapSuggest = 'drop-down w100 h-auto pb-5 overflow-hidden';
        css.liSuggest = `item ${props.isActive ? 'active' : ''} smooth`;
        break;
      default:
        break;
    }
    return css;
  } catch {
    return css;
  }
};
