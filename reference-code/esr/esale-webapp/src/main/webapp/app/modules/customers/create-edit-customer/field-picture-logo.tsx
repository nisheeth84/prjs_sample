
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
// import { EMPLOYEE_SPECIAL_FIELD_NAMES as specialFName } from '../constants';
import { translate } from 'react-jhipster';

export interface IFieldPictureLogoProps {
  fieldLabel: string
  onFileChange: (file) => void
  onFileDefaultChange?: (fileDefault) => void
  isRequired?: boolean
  fileDefault?: any
  className?: string
}
/**
 * This component is pending
 * @param props
 */
const FieldPictureLogo = (props: IFieldPictureLogoProps) => {

  return (
    <div className={props.className}>
      <div className="upload-wrap input-file-choose">
        <label htmlFor="uploadFile">{translate('customers.create-edit-modal.msg-customer-logo')}</label>
        <input id="uploadFile" className="f-input" />
        <div className="fileUpload btn btn--browse">
        <span><i className="far fa-plus mr-2" /> {translate('customers.create-edit-modal.btn-drag-drop-image')}</span>
          <p className="file" />
          <button type="button" className="remove hidden"><img src="../../content/images/ic-control.svg"/></button>
          <input id="uploadBtn" type="file" className="upload" multiple />
        </div>
      </div>
    </div>
  );
}

export default FieldPictureLogo
