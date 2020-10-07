import React,{useEffect} from 'react';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { reset } from '../employee-detail-setting.reducer';
 export interface IMenuDatal extends StateProps, DispatchProps {
    switchMenu
 }
const MenuDatail = (props : IMenuDatal) => {

  useEffect(() => {
    props.reset();
  }, []);

    return (
        <div className="modal-body style-3">
            <div className="popup-content  style-3">
                <div className="choose-settings-member">
                    <div className="items" onClick={() => props.switchMenu(1)}>
                        <img src="../../../content/images/setting/Group 5.svg" />
                        <p className="name">{translate("employees.settings.icon-change-password")}</p>
                    </div>
                    <div className="items" onClick={() => props.switchMenu(2)}>
                        <img src="../../../content/images/setting/Group 10.svg" />
                        <p className="name">{translate("employees.settings.icon-language-timezone")}</p>
                    </div>
                    <div className="items" onClick={() => props.switchMenu(3)}>
                        <img src="../../../content/images/setting/iconBell.svg" />
                        <p className="name">{translate("employees.settings.icon-notify")}</p>
                    </div>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = ({ employeeDetailAction  }: IRootState) => ({
});

const mapDispatchToProps = {
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuDatail);