import React, { useState, useCallback } from 'react';
import { Modal } from 'reactstrap';
import { NETWORK_MAP_VIEW_TYPE, NETWORK_MAP_MODE } from '../../constants';
import AddEditNetworkMapModeTree from '../../network-map-modal/add-edit-network-map-mode-tree/index';
import AddEditNetworkMapModeTable from '../../network-map-modal/add-edit-network-map-mode-table';
import { ICON_FUNCION_CUSTOMERS } from '../../list/customer-list';

export interface INetworkMapTab {
  customerId: number;
  mode?: number;
}

const TabNetworkMap = (props: INetworkMapTab) => {
  const [networkMapMode, setNetworkMapMode] = useState(NETWORK_MAP_MODE.TREE);
  const [isShowModal, setIsShowModal] = useState(false);
  const [customerIdMapTable, setCustomerIdMapTable] = useState(props.customerId);
  const onOpenModal = useCallback(() => {
    setIsShowModal(true);
  }, [setIsShowModal]);

  const onCloseModal = useCallback(() => {
    setIsShowModal(false);
  }, [setIsShowModal]);

  const changeNetworkMapMode = (mode, customerId) => {
    setNetworkMapMode(mode);
    if (customerId) {
      setCustomerIdMapTable(customerId);
    }
  }

  const renderModal = exAttrs => (
    <>
      {networkMapMode === NETWORK_MAP_MODE.TREE &&
        <AddEditNetworkMapModeTree
          customerId={customerIdMapTable}
          customerOriginId={props.customerId}
          changeNetworkMapMode={changeNetworkMapMode}
          {...exAttrs}
        />
      }
      {networkMapMode === NETWORK_MAP_MODE.TABLE &&
        <AddEditNetworkMapModeTable
          customerId={customerIdMapTable}
          changeNetworkMapMode={changeNetworkMapMode}
          {...exAttrs}
        />
      }
    </>
  )

  return (
    <>    
      {!isShowModal && (
        <div className="tab-pane active h-100">
          {renderModal({
            iconFunction: ICON_FUNCION_CUSTOMERS,
            viewType: NETWORK_MAP_VIEW_TYPE.TAB,
            onOpenModal
          })}
        </div>
      )}
      {isShowModal && (
        <Modal isOpen={isShowModal} fade toggle={() => { }} backdrop id="network-map" zIndex="auto">
          {renderModal({
            iconFunction: ICON_FUNCION_CUSTOMERS,
            viewType: NETWORK_MAP_VIEW_TYPE.MODAL,
            onCloseModal
          })}
        </Modal>
      )}
    </>
  );
};

export default TabNetworkMap;
