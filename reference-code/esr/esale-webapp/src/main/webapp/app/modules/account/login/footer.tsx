import React from 'react';
import { translate } from 'react-jhipster';
import './login.scss';

export const Footer = () => {
  return (
    <div className="login-footer">
      <ul>
        <li>
          <a title="" onClick={() => window.open('https://www.softbrain.co.jp/privacypolicy/')}>
            {translate('global.footer.private.policy')}
          </a>
        </li>
        <li>
          <a title="" onClick={() => window.open('https://www.e-sales-support.jp/app/home/p/2')}>
            {translate('global.footer.term.service')}
          </a>
        </li>
      </ul>
      <div className="copyright">{translate('global.footer.copyright')}</div>
    </div>
  );
};

export default Footer;
