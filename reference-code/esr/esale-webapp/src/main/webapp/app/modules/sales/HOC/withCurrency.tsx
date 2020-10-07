import React, { Component } from 'react';
import { connect } from 'react-redux';

interface IRecipeProps {
  productTradingsByProgress: any;
}

const withCurrency = ComponentArg => {
  class WrapComponent extends Component<IRecipeProps> {
    constructor(props) {
      super(props);
    }

    render() {
      const priceField = this.props.productTradingsByProgress?.fieldInfo?.find(ele => ele.fieldName.toLowerCase() === 'price') || {};
      
      const currency = priceField.currencyUnit || '';
      const decimalPlace = priceField.decimalPlace || null;
      return <ComponentArg {...this.props} currency={currency} decimalPlace={decimalPlace} />;
    }
  }

  const mapStateToProps = state => ({
    productTradingsByProgress: state.salesList.productTradingsByProgress,
  });

  return connect(
    mapStateToProps,
    {}
  )(WrapComponent);
};

export default withCurrency;
