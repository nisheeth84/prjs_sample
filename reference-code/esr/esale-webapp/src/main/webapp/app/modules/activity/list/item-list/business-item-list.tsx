import React  from 'react'
import { connect } from 'react-redux'
import { BusinessCardsType } from '../../models/get-activity-type'
type IBusinessCardItemListProp = StateProps & DispatchProps & {
  businessCard: BusinessCardsType
  onClick?: () => void
}

/**
 * component for show list business card and detail
 * @param props
 */
const BusinessCardItemList = (props: IBusinessCardItemListProp) => {
  return (<li onClick={() => {if(props.onClick) props.onClick()}} className="item smooth d-flex  align-items-center">
      <div className={`mr-3 border image_table ${ props.businessCard?.businessCardImagePath ? '' : 'no_image_table'}`}>
        <img className="max-width-130" src={props.businessCard?.businessCardImagePath || "../../content/images/noimage.png"} alt="" title=""/>
      </div>
      <div className="w65">
        <div className="text text1 font-size-12 color-666 font-weight-400">{props.businessCard.customerName}&nbsp;{props.businessCard.position}</div>
        <div className="text text2">{props.businessCard.firstName}&nbsp;{props.businessCard.lastName}&nbsp;{props.businessCard.departmentName}</div>
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
)(BusinessCardItemList);
