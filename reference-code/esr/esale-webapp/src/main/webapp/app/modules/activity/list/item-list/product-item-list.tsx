import React from 'react'
import { connect } from 'react-redux'
import { ProductTradingsType } from '../../models/get-activity-type'
import { getFieldLabel } from 'app/shared/util/string-utils'
import _ from 'lodash';

import styled from 'styled-components';


const AvatarDefault = styled.div`
  height: ${props => props.sizeAvatar + 'px'};
  width: ${props => props.sizeAvatar + 'px'};
  line-height: ${props => props.sizeAvatar + 'px'};;
  border-radius: 50%;
  background-color: #8ac891;
  display: inline-block;
  /* justify-content: center;
    align-items: center; */
  font-size: 14;
  vertical-align: middle;
  color: #fff;
  text-align: center;
  margin-right: 0.25rem !important;
`;

const AvatarReal = styled.img`
 height: ${props => props.sizeAvatar + 'px'};
  width: ${props => props.sizeAvatar + 'px'};
  line-height: ${props => props.sizeAvatar + 'px'};;
  border-radius: 50%;
  vertical-align: middle;
  text-align: center;
  margin-right: 0.25rem !important;
`

type IProductTradingItemListProp = StateProps & DispatchProps & {
  productTrading: ProductTradingsType
  onClick?: () => void
}

/**
 * component for show list business card and detail
 * @param props
 */
const ProductTradingItemList = (props: IProductTradingItemListProp) => {
  const onClickDetal = (e) => {
    if (!e) e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    if (props.onClick) props.onClick();
  }

  return (<li onClick={onClickDetal} className="item smooth d-flex  align-items-center">
    <div className={`mr-3 image_table ${props.productTrading?.productImagePath ? '' : 'no_image_table'}`}>
      <img className="max-width-130" src={props.productTrading?.productImagePath || "../../content/images/noimage.png"} alt="" title="" />
    </div>
    <div className="w65">
      <div className="text text1 font-size-12 color-666">{props.productTrading?.customerName}</div>
      <div className="text text2">{props.productTrading?.productName || props.productTrading?.productTradingName} {props.productTrading?.progressName ? `(${getFieldLabel(props.productTrading, 'progressName')})` : ''} </div>
      <div className="text text1 font-size-12">
        {!_.isEmpty(props.productTrading?.employee?.employeePhoto?.fileUrl) ? (
          <AvatarReal className="user" sizeAvatar={30} src={props.productTrading?.employee?.employeePhoto?.fileUrl} alt="" title="" />
        ) : (
            <AvatarDefault sizeAvatar={30}>{(props.productTrading?.employee?.employeeSurname || " ")[0].toUpperCase()}</AvatarDefault>
          )}
        {(props.productTrading?.employee?.employeeSurname || "") + " " + (props.productTrading?.employee?.employeeName || "")}
      </div>
    </div>
  </li>);
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductTradingItemList);
