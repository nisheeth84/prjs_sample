import React from 'react';
import { connect } from 'react-redux';

type IActivityControlRightProp = StateProps & DispatchProps

/**
 * component for show right control
 * @param props
 */
const ActivityControlRight = (props: IActivityControlRightProp) => {
  return <>
    <div className="control-right">
      <ul>
          <li>
              <a className="button-popup button-right-note">
                  <img src="../../../content/images/ic-right-note.svg" />
              </a>
          </li>
          <li>
              <a className="button-popup button-right-list">
                  <img src="../../../content/images/ic-right-list.svg" />
              </a>
          </li>
      </ul>
      <a href="javascript:;" className="expand-control-right">
          <i className="far fa-angle-right" />
      </a>
    </div>
  </>
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
mapStateToProps,
mapDispatchToProps
)(ActivityControlRight);
