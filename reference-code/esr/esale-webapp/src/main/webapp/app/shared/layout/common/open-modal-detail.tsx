import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import ProductDetail from 'app/modules/products/product-detail/product-detail';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import { useId } from 'react-id-generator';

type TypeDetail = 'product' | 'customer' | null;

interface IProps {
  type: TypeDetail;
  popout?: boolean;
  id: any;
  noChild?: boolean;

  // case handle visible from parent component
  visible?: boolean;
}

const OpenModalDetail: React.FC<IProps> = forwardRef(
  ({ children, type, id, popout, visible: visibleModal, noChild = false, ...props }, ref) => {
    if (!type) {
      return <>{children}</>;
    }

    const [visible, setVisible] = useState<boolean>(false);
    const customerDetailCtrlId = useId(1, 'openModalDetailCustomerDetailCtrlId_');

    useEffect(() => {
      setVisible(visibleModal);
    }, [visibleModal]);

    const handleOpen = () => {
      setVisible(true);
    };
    const handleClose = () => setVisible(false);

    useImperativeHandle(ref, () => ({
      openModal: handleOpen,
      closeModal: handleClose,
      trigger() {
        // console.log('');
      }
    }),[]);

    const renderModal = () => {
      if (type === 'product') {
        return (
          <ProductDetail
            popout={popout}
            showModal={true}
            productId={id}
            openFromModal={true}
            toggleClosePopupProductDetail={handleClose}
            {...props}
          />
        );
      }
      if (type === 'customer') {
        return (
          <PopupCustomerDetail
            id={customerDetailCtrlId[0]}
            popout={popout}
            showModal={true}
            openFromModal={true}
            customerId={id}
            listCustomerId={[id]}
            toggleClosePopupCustomerDetail={handleClose}
            openFromOtherServices={true}
            {...props}
          />
        );
      }
    };
    return (
      <>
        {visible && renderModal()}

        {// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        !noChild && children(handleOpen)}
      </>
    );
  }
);

export default OpenModalDetail;
