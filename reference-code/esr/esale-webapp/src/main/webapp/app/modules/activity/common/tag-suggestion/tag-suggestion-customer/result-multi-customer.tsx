import React from 'react'
import { connect } from 'react-redux'
import ResultMultiCustomerItem from './result-multi-customer-item'

type IResultMultiCustomerProp = StateProps & DispatchProps & {
  tags?: any;
  listActionOption?: any,
  isDisabled?: boolean,
  onActionOption?: any,
  onRemoveTag?: any,
}

const ResultMultiCustomer = (props: IResultMultiCustomerProp) => {
  return (
    <div className={props.listActionOption ? "show-wrap2 width-1100" : "chose-many"}>
      {props.tags.map((tag, idx) => {
        return (
          <ResultMultiCustomerItem
            key={idx}
            idx={idx}
            tag={tag}
            isDisabled={props.isDisabled}
            listActionOption={props.listActionOption}
            onActionOption={props.onActionOption}
            onRemoveTag={props.onRemoveTag} />
        )

      })}
    </div>

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
)(ResultMultiCustomer);
