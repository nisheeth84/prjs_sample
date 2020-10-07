import React from 'react';
import ArrowChange from './ArrowChange';
import { TimeLineLeft } from './styles';
import { Categories } from '../constants';
import * as R from 'ramda';
import CheckBlank from './CheckBlank';
import { translate } from 'react-jhipster';
import ATag from './ATag';

const TextChange = ({ fieldLabel, old, new: newValue, fieldType, fieldName, isModalConfirm }) => {
  const isDisplay = fieldType === 4 && fieldName === 'is_display';
  const isMail = fieldType === Categories.mail;
  const isNumber = fieldType === Categories.number;

  if (!old && !newValue && !isDisplay) {
    return <></>;
  }

  if (R.is(Object, old) || R.is(Object, newValue)) {
    return <></>;
  }

  let oldContent = old;
  let newContent = newValue;

  if (isMail) {
    oldContent = (
      <ATag isModalConfirm={isModalConfirm} href={`mailto:${old}`}>
        {old}
      </ATag>
    );
    newContent = (
      <ATag isModalConfirm={isModalConfirm} href={`mailto:${newValue}`}>
        {newValue}
      </ATag>
    );
  }

  if (isDisplay) {
    const newValueBoolean = R.equals('true', String(newValue));
    const oldValueBoolean = !newValueBoolean;
    const getTextIsDisplay = R.ifElse(
      R.equals(true),
      () => translate('history.is_display.true'),
      () => translate('history.is_display.false')
    );

    oldContent = getTextIsDisplay(oldValueBoolean);
    newContent = getTextIsDisplay(newValueBoolean);
  }

  if (isNumber && (!oldContent || oldContent === '0') && (!newContent || newContent === '0')) {
    return <></>;
  }

  return (
    <div>
      <TimeLineLeft isModalConfirm>
        {fieldLabel}：
        <CheckBlank isNumber={isNumber} value={isDisplay ? true : old}>
          {oldContent}
        </CheckBlank>
      </TimeLineLeft>
      <ArrowChange />{' '}
      <CheckBlank isNumber={isNumber} value={isDisplay ? true : newValue}>
        {newContent}
      </CheckBlank>
    </div>
  );
};

export default TextChange;
