import React, { useState } from 'react';
import _ from 'lodash';
import HistoryTitle from './HistoryTitle';
import HistoryContent from './HistoryContent';
import {
  HistoryItemDataType,
  HISTORY_TITLE,
  FieldInfoType,
  StatementDataType,
  SpecialDataType
} from '../constants';
import * as R from 'ramda';

interface IProps {
  data: HistoryItemDataType;
  fieldInfo: FieldInfoType[];
  sourceData?: {
    [key: string]: any[];
  };
  specialData: SpecialDataType;
  fieldNameExtension: string;
}

const HistoryItem: React.FC<IProps> = ({ data, ...props }) => {
  // if (!data.contentChange || R.equals(data.contentChange, {})) {
  //   return <></>;
  // }

  const titleStatus: keyof typeof HISTORY_TITLE = data.contentChange ? 'edit' : 'create';

  const [visibleContent, setVisibleContent] = useState(true);

  const toggleContent = () => setVisibleContent(!visibleContent);

  return (
    <>
      <HistoryTitle data={data} status={titleStatus} toggleContent={toggleContent} />
      {visibleContent && data?.contentChange && <HistoryContent data={data} {...props} />}
    </>
  );
};

export default React.memo(HistoryItem);
