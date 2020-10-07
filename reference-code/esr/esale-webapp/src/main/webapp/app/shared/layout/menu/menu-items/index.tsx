import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { getJsonBName } from 'app/modules/setting/utils';
import { Link } from 'react-router-dom';
import MenuItem from './menu-item';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import _ from 'lodash';

export interface IMenuItems extends StateProps, DispatchProps {
  componentDisplay: string;
}

const MenuItems: React.FC<IMenuItems> = ({ componentDisplay, servicesInfoOrder, servicesInfo }) => {
  let serviceData = [];
  if (servicesInfoOrder && servicesInfo) {
    if ('data' in servicesInfoOrder && Array.isArray(servicesInfoOrder['data'])) {
      if (servicesInfoOrder['data'].length > 0 && servicesInfo.length > 0) {
        servicesInfoOrder['data'].forEach(e => {
          let tmpItemService = null;
          tmpItemService = servicesInfo.find(ele => ele.serviceId === e['serviceId']);
          tmpItemService['serviceOrder'] = e.serviceOrder;
          tmpItemService['updatedDate'] = e.updatedDate;
          serviceData.push(tmpItemService);
        })
      }
      else {
        serviceData = servicesInfo
      }
    }
  }
  return (
    <DndProvider backend={Backend}>
      {serviceData && serviceData.map((ser, index) => (
        <MenuItem componentDisplay={componentDisplay} ser={ser} key={ser.serviceId} index={index} />
      ))}
    </DndProvider>
  );
};

const mapStateToProps = ({ menuLeft }: IRootState) => ({
  servicesInfoOrder: menuLeft.servicesOrder || [],
  servicesInfo: menuLeft.servicesInfo || [],
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuItems);
