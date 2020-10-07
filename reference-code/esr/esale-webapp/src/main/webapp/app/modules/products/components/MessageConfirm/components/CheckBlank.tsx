import React, { memo } from 'react';
import * as R from 'ramda';
import { translate } from 'react-jhipster';

const CheckBlank = ({ value, children, isNumber = false }) => {
  // if (R.isNil(value) || value === '' || value === false  ) {
  if (isNumber && value === '0') {
    return <>{translate('products.detail.label.content.create')}</>;
  }
  if (!value) {
    return <>{translate('products.detail.label.content.create')}</>;
  }

  return <>{children}</>;
};

export default memo(CheckBlank);
