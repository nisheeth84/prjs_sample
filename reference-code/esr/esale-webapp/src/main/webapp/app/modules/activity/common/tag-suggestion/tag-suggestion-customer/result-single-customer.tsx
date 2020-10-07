import React from 'react'
import { connect } from 'react-redux'

type IResultSingleCustomerProp = StateProps & DispatchProps & {
  tags: any;
  hovered: boolean;
  headerHoverOn: any;
  headerHoverOff: any;
  onRemoveTag: any;
  isDisable?: boolean;
}

const ResultSingleCustomer  = (props: IResultSingleCustomerProp) => {
  return (
    <>
      {props.tags.map((e: {}, idx) => {
        return (
          <div key={`customer_${idx}`} className={`wrap-tag wrapper-width-ellip ${props.isDisable ? 'cursor-df' : ''}`}>
            <div className="tag text-ellipsis" onMouseEnter={props.headerHoverOn} onMouseLeave={props.headerHoverOff}>
              {`${e['parentCustomerName'] ? e['parentCustomerName'] + ' - ' : ''}${e['customerName']}`}
              <button className="close" onClick={() => props.onRemoveTag(idx)}>×</button>
            </div>
            {props.hovered &&
              <div className="drop-down h-auto w100">
                <ul className="dropdown-item">
                  <li className="item smooth">
                    <div className="item2">
                      <div className="content">
                        <div className="text text1 font-size-12">{e['parentCustomerName']}</div>
                        <div className="text text2">{e['customerName']}</div>
                        <div className="text text3">{e['address']}</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            }
          </div>
        )

      })}
    </>
  );
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
)(ResultSingleCustomer );
