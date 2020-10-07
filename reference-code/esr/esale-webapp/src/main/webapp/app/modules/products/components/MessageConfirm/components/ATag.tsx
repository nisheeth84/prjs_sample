import React from 'react';

const ATag = ({ isModalConfirm, children, ...props }) => {
  return <a {...(!isModalConfirm && props)}>{children}</a>;
};

export default ATag;
