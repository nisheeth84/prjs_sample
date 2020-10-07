import React, { memo } from 'react';
import { RelationChangeWrapper } from './styles';
import * as R from 'ramda';
import { translate } from 'react-jhipster';

 
const labelActions = ['products.detail.label.title.delete', 'products.detail.label.title.insert', 'products.detail.label.title.updateSet'];

const StatementChange = ({ data, isModalConfirm }) => {
  const renderChangedData = dataChange => {
    return dataChange?.map((_item: any) => {
      const Component = _item.Component;
      if (!Component) return <></>;
      const componentProps = R.omit(['Component'], _item);
      return <Component {...componentProps} isModalConfirm={isModalConfirm} key={_item.fieldId} />;
    });
  };

  return (
    <RelationChangeWrapper>
      {data?.map((_item, _idx) => {
        const childData = renderChangedData(_item.contentChange);
        if ((_item.action !== 2 && (!childData || childData.length === 0))) {
          return <></>;
        }

        return (
          <div key={_idx}>
            {_item.productName + translate(labelActions[_item.action])}
            <div className="ml-3"> {childData}</div>
          </div>
        );
      })}
    </RelationChangeWrapper>
  );
};

export default memo(StatementChange);
