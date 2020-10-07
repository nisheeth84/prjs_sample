import React from 'react';

export interface IProductControlRightProps {
  profile: any;
}

const ProductControlRight = () => {
  return (
    <div className="control-right">
      <ul>
        <li><a href="#" className="button-popup" data-toggle="modal" data-target="#myModal"><img src="/content/images/ic-right-note.svg" alt="" /></a></li>
        <li><a href="#" className="button-popup" data-toggle="modal" data-target="#myModal"><img src="/content/images/ic-right-list.svg" alt="" /></a></li>
      </ul>
      <a className="expand-control-right"><i className="far fa-angle-right" /></a>
    </div>
  );
}

export default ProductControlRight
