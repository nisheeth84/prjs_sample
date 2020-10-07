import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

export type IHomeProp = StateProps & DispatchProps & RouteComponentProps;

export const Home = (props: IHomeProp) => {
  return (
    <div>
      <div className="link-top">
        <span>This is HomePage</span>``
        <br />
        <br />
        <br />
        <Link to="/account/password" className="alert-link">
          Change password
        </Link>{' '}
        |{' '}
        <Link to="/account/logout" className="alert-link">
          Logout
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account
});

const mapDispatchToProps = { getSession };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps)(Home);
