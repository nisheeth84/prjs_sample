import React, { memo } from 'react';
import ArrowChange from './ArrowChange';
import { TimeLineLeft } from './styles';
import * as R from 'ramda';
import CheckBlank from './CheckBlank';
import { blankText } from '../constants';
const MultiDataChange = ({ fieldLabel, old = [], new: newValue = [] }) => {
  const convertArrayDataToText = R.tryCatch(R.join(', '),() => blankText());

  return (
    <div>
      <TimeLineLeft isModalConfirm>
        {fieldLabel}：<CheckBlank value={!!old.length}>{convertArrayDataToText(old)}</CheckBlank>
      </TimeLineLeft>
      <ArrowChange />
      <CheckBlank value={!!newValue.length}> {convertArrayDataToText(newValue)}</CheckBlank>
    </div>
  );
};

export default memo(MultiDataChange);
