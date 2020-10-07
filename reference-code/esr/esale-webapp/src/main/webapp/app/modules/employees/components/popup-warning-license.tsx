import React, { useState, useEffect } from 'react';
import { translate } from 'react-jhipster';

interface IProps {
  license: {
    isInvalidLicense: boolean;
    packages: any;
  };
}

const PopupWarningLicense: React.FC<IProps> = React.memo(({ license }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const { packageName, usedPackageNumber, availablePackageNumber } = license.packages || {};

  useEffect(() => {
    setVisible(!license.isInvalidLicense);
  }, [license]);

  const handleClosePopup = () => setVisible(false);

  if (!visible) return <></>;
  return (
    <div className="popup-esr2 popup-esr3 style-3">
      <div className="popup-esr2-content">
        <div className="popup-esr2-body ">
          <h4 className="title">
            <strong>{translate("employees.popup-warning.title")}</strong>
          </h4>
          <div>
          {translate("employees.popup-warning.warning-1")}
          </div>
          <div>{translate("employees.popup-warning.warning-2")}</div>
          <div>・{`${packageName}：${usedPackageNumber}/${availablePackageNumber}`}</div>
          {/* <div>・ライセンス名：7/5</div> */}
          <div className="button align-center margin-top-20">
            <a title="" className="button-blue" onClick={handleClosePopup}>
              追加
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

export { PopupWarningLicense };
