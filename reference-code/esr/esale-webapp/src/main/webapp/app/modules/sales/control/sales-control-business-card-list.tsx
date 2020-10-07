// import React, { useState, useEffect } from 'react';
import React from 'react';
// import { IRootState } from 'app/shared/reducers';
// import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
export interface IBusinessCardListProps {
  lstBusinessCard?: any;
}
const BusinessCardList = (props: IBusinessCardListProps) => {
  return (
    <div className="form-group search-box-left">
      <div className="search-box-button-style disable">
        <button className="icon-search"><i className="far fa-search" /></button>
        <input type="text" placeholder={translate("sales.sidebar.place-holder.searchBusinessCard")} />
      </div>
      <div className="text-select">
        <div className="title-lf">
          <a>リストA</a>
        </div>
        <div className="title-lf">
          <a>リストB</a>
        </div>
      </div>
    </div>
  );
}
export default BusinessCardList;