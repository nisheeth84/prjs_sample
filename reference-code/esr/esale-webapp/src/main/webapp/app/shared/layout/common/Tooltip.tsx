import React from 'react';
import _ from 'lodash';

interface IProps {
  text: string;
  style? // prevPageIcon doesn't have style, nextPageIcon has
}

// Notice: Only use for <a> tag
const Tooltip: React.FC<IProps> = ({ text, style }) => {
  if (_.isEmpty(style)) {
    return (
      <label className="tooltip-common">
        <span>{text}</span>
      </label>
    );
  } else {
    return (
      <label className="tooltip-common" style={style}>
        <span>{text}</span>
      </label>
    );
  }
};

export default React.memo(Tooltip);
