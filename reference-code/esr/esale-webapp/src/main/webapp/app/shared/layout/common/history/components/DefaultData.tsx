import React from 'react';
import {
  getFieldLabeByLanguage,
  renderEmptyData,
  isEqualsOrBothEmpty,
  getTextIsDisplay,
  getValueFromSourceData,
  findFieldInfo
} from '../utils';
import ArrowChange from './ArrowChange';
import { getFieldLabel } from 'app/shared/util/string-utils';

const DefaultData = ({ title, oldValue, newValue, fieldInfo: fieldInfos, sourceData }) => {
  if (isEqualsOrBothEmpty(oldValue, newValue)) {
    return <></>;
  }

  const fieldInfo = findFieldInfo(title, fieldInfos);

  const { oldContent, newContent } = getValueFromSourceData(
    { oldValue, newValue },
    fieldInfo,
    sourceData
  );

  return (
    <div className="mission-wrap">
      <p className="type-mission">
        {getFieldLabel(fieldInfo, 'fieldLabel')}:{' '}
        <span dangerouslySetInnerHTML={{ __html: renderEmptyData(oldContent) }} /> <ArrowChange />
        <span dangerouslySetInnerHTML={{ __html: renderEmptyData(newContent) }} />
      </p>
    </div>
  );
};

export default DefaultData;
