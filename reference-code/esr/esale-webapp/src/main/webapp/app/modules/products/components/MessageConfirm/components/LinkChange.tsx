import React, { memo } from 'react';
import ArrowChange from './ArrowChange';
import { TimeLineLeft } from './styles';
import CheckBlank from './CheckBlank';
import * as R from 'ramda';
import { blankText } from '../constants';

const LinkChange = ({ fieldLabel, url_target: urlTarget, url_text: urlText, isModalConfirm }) => {
  if (R.equals(urlText, {}) && R.equals(urlTarget, {})) {
    return <></>;
  }

  const isChangeText = R.not(R.equals(urlText.old, urlText.new));
  const isChangeUrl = R.not(R.equals(urlTarget.old, urlTarget.new));

  const getTextUrl = url => (url ? `(${url})` : blankText());

  return (
    <div>
      <TimeLineLeft className="timeline-left" isModalConfirm={isModalConfirm}>
        {fieldLabel}：{isChangeText && (urlText.old || blankText())}{' '}
        {isChangeUrl && getTextUrl(urlTarget.old)}
      </TimeLineLeft>
      <ArrowChange />
      {isChangeText && (urlText.new || blankText())} {isChangeUrl && getTextUrl(urlTarget.new)}
    </div>
  );
};

export default memo(LinkChange);
