import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import { getFieldInfoProgressAvailable } from '../../utils';
import { SETTING_MENU } from 'app/modules/setting/constant';
import { getJsonBName, checkTwoObj } from 'app/modules/sales/utils';
import { getIconSrc } from 'app/config/icon-loader';
import CommonDialog from 'app/shared/layout/common/commom-dialog';
import PopupMenuSet from '../../../setting/menu-setting';
import { getFieldLabel } from 'app/shared/util/string-utils';

export interface SwitchFieldPanelProps {
  dataSource: any[];
  dataTarget: any[];
  onCloseSwitchDisplay;
  onChooseField: any;
  onDragField: (fieldSourceId: string, fieldTargetId: string) => void;
  fieldBelong?: any;
  isAdmin?: any;
  onOpenModalEmployee?: any;
  progresses?: any;
  fieldInfoProgresses?: any;
}

const SwitchFieldPanel = (props: SwitchFieldPanelProps) => {
  // open define progress popup
  const [openDefineProgressPopup, setOpenDefineProgressPopup] = useState(false);

  const [fieldFilter, setFieldFilter] = useState('');
  const [listField, setListField] = useState([]);
  const [progressesIsChecked, setProgressesIsChecked] = useState([]);

  /** List progress is checked */
  useEffect(() => {
    const tempArr = getFieldInfoProgressAvailable({
      listFieldInfoProgress: props.fieldInfoProgresses,
      listProgress: props.progresses
    });

    setProgressesIsChecked(tempArr);
  }, [props.progresses, props.fieldInfoProgresses]);

  useEffect(() => {
    if (fieldFilter) {
      setListField(props.progresses.filter(progress => getJsonBName(progress.progressName).includes(fieldFilter)));
    } else {
      setListField(props.progresses);
    }
  }, [props.progresses, fieldFilter]);

  /** Function */
  const onSearch = useCallback(
    e => {
      const { value } = e.target;
      setFieldFilter(value.trim());
    },
    [fieldFilter]
  );

  const isChecked = useCallback(
    progress => {
      return progressesIsChecked.reduce((checked, ele) => {
        if (ele.productTradingProgressId === progress.productTradingProgressId && ele.progressOrder === progress.progressOrder) {
          checked = true;
        }
        return checked;
      }, false);
    },
    [progressesIsChecked]
  );

  const onCloseClick = event => {
    props.onCloseSwitchDisplay();
    event.preventDefault();
  };

  const openGroupModal = () => {
    setOpenDefineProgressPopup(true);
  };

  const onCloseGroupModal = () => {
    setOpenDefineProgressPopup(false);
  };

  const onChangeCheckBox = async (productTradingProgressId, progressOrder) => {
    let tempProgressesIsChecked = _.cloneDeep(progressesIsChecked);

    if (tempProgressesIsChecked.some(el => checkTwoObj(el, { productTradingProgressId, progressOrder }))) {
      if (tempProgressesIsChecked.length === 1) {
        await CommonDialog({
          message: translate('messages.WAR_COM_0011'),
          submitText: 'OK'
        });
        return;
      }

      tempProgressesIsChecked = tempProgressesIsChecked.filter(el => el.productTradingProgressId !== productTradingProgressId);
    } else {
      tempProgressesIsChecked = [...tempProgressesIsChecked, { productTradingProgressId, progressOrder }];
    }

    props.onChooseField(tempProgressesIsChecked);
  };

  // const infoUserLogin = decodeUserLogin(); // Get login user info
  // const employeeIdLogin = infoUserLogin['custom:employee_id']; // Get employeeId of login user

  return (
    <Fragment>
      <div className="select-change-display select-change-display-2 width-unset">
        <div className="contents-select fixed-width-262px">
          <div className="title black">{translate('global.button.switch-display')}</div>
          <div className="form-group search-box-left">
            {props.progresses && props.progresses.length > 5 && (
              <div className="search-box-no-button-style">
                <button className="icon-search">
                  <i className="far fa-search"></i>
                </button>
                <input type="text" onChange={onSearch} placeholder={translate('sales.placeholder.find-an-item')} />
              </div>
            )}
          </div>

          <div className="search-cotents">
            <div className="close" onClick={onCloseClick}>
              <i className="far fa-times" />
            </div>
            {listField.map(progress => (
              <div key={progress.productTradingProgressId} className="contents-item">
                <label className="icon-check">
                  <input
                    type="checkbox"
                    checked={isChecked(progress)}
                    onChange={event => onChangeCheckBox(progress.productTradingProgressId, progress.progressOrder)}
                  />
                  <i />
                </label>
                <img src={getIconSrc(props.fieldBelong)} alt="logo" title="logo-sales" />
                <span className="black">{getFieldLabel(progress, 'progressName')}</span>
              </div>
            ))}
          </div>
          <div className="settings">
            <a title="" className="button-primary" onClick={openGroupModal}>
              <img className="mr-2" src="../../../content/images/common/ic-setting.svg" title="" alt="" />
              {translate('global.button.search-all')}
            </a>
          </div>
          <div className="item-select"></div>
        </div>
      </div>

      {openDefineProgressPopup && <PopupMenuSet dismissDialog={onCloseGroupModal} menuType={SETTING_MENU.MENU_PRODUCT_TRADE} />}
    </Fragment>
  );
};

export default SwitchFieldPanel;
