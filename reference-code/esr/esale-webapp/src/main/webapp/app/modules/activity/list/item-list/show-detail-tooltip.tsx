import React, { useState } from 'react'
import { connect } from 'react-redux'

const ShowDetailTooltip = () => {
  const [hover, setHover] = useState(false);

  const renderTooltip = () => {
    if (hover) {
      return (
        <div className="box-user">
          <div className="box-user-status">
            <a className="active">
              <div className="box-user-status-header">
                <img className="avatar" src="../../../content/images/common/ic-avatar-status.svg" alt="" />
                <div className="font-size-12">営業部部長</div>
                <div className="text-blue">
                  <p>えいぎょうたろう</p>
                  <p>社員太郎</p>
                </div>
                <div className="status busy">離席</div>
              </div>
            </a>
            <div className="box-user-group font-size-12">
              <a className="active">
              </a>
              <a><img src="../../../content/images/common/ic-call.svg" alt="" /> 090-1234-5678</a>
              <a><img src="../../../content/images/common/ic-phone.svg" alt="" /> 090-1234-5678</a>
              <a className="text-blue"><img src="../../../content/images/common/ic-mail.svg" alt="" /> mail@example.com</a>
            </div>
            <div className="box-user-status-bottom">
              <a className="button-blue">追加</a>
            </div>
          </div>
        </div>
      )
    } else {
      return <></>
    }
  }
  return (
    <div className="show-list-item" onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} >
      <img className="user" src={"../../../content/images/ic-user1.svg"} alt="" />
      {renderTooltip()}
    </div>
  );
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowDetailTooltip);
