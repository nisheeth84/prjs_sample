import React, { useState } from 'react'
import { connect } from 'react-redux'

type IResultMultiCustomerItemProp = StateProps & DispatchProps & {
  idx?: number,
  tag: any,
  className?: string,
  tagNames?: string[],
  listActionOption?: { id, name }[],
  isDisabled?: boolean,
  onActionOption?: (idx: number, ev) => void,
  onRemoveTag?: (idx: number) => void
}

const ResultMultiCustomerItem = (props: IResultMultiCustomerItemProp) => {
  const [isHovered, setHover] = useState(null);


  const renderItemListOption = () => {
    return <>
      <div key={`tag_businessCard_${props.idx}`} className="tag-result position-relative mt-1 w32">
        {/* <div className="drop-down w100 h-auto background-color-86"> */}
        <div
          className={`item item-big ${props.listActionOption ? "width-calc" : ""}`}
          onMouseOver={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className="content">
            <div className="text text1 font-size-12">{props.tag.parentCustomerName}</div>
            <div className="text text2">{props.tag.customerName}</div>
            <div className="text text3">{props.tag.address}</div>
          </div>
          <button type="button" className="close"><a onClick={() => props.onRemoveTag(props.idx)}>×</a></button>
        </div>
        {/* </div> */}

        {isHovered &&
          <div className="drop-down child h-auto  hover-tag">
            <ul className="dropdown-item">
              <li className="item smooth">
                <div className="item2">
                  <div className="content">
                    <div className="text text1 font-size-12">{props.tag.parentCustomerName}</div>
                    <div className="text text2">{props.tag.customerName}</div>
                    <div className="text text3">{props.tag.address}</div>
                  </div>
                </div>
                <button className="close">×</button>
              </li>
            </ul>
          </div>
        }
      </div>
    </>
  }


  const renderItem = () => {
    return (
      <>
        <ul className="dropdown-item">
          <li className="item smooth">
            <div className="item2">
              <div className="content">
                <div className="text text1 font-size-12">{props.tag?.parentCustomerName}</div>
                <div className="text text2">{props.tag?.customerName}</div>
                <div className="text text3">{props.tag?.address}</div>
              </div>
            </div>
            <button type="button" className="close"><a onClick={() => props.onRemoveTag(props.idx)}>×</a></button>
          </li>
        </ul>
      </>
    );
  }

  if (props.listActionOption) {
    return renderItemListOption();
  } else {
    return (
      <div className="w48 position-relative" >
        <div className="drop-down w100 h-auto position-relative z-index-4">
          {renderItem()}
        </div>
        <div className="drop-down child h-auto">
          {renderItem()}
        </div>
      </div>
    )
  }


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
)(ResultMultiCustomerItem);
