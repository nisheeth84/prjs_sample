import { faSort } from '@fortawesome/free-solid-svg-icons/faSort';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync';
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faHdd } from '@fortawesome/free-solid-svg-icons/faHdd';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faList } from '@fortawesome/free-solid-svg-icons/faList';
import { faTasks } from '@fortawesome/free-solid-svg-icons/faTasks';
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faThList } from '@fortawesome/free-solid-svg-icons/faThList';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import { faWrench } from '@fortawesome/free-solid-svg-icons/faWrench';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons/faAsterisk';
import { faFlag } from '@fortawesome/free-solid-svg-icons/faFlag';
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faRoad } from '@fortawesome/free-solid-svg-icons/faRoad';
import { faCloud } from '@fortawesome/free-solid-svg-icons/faCloud';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FIELD_BELONG } from './constants';

export const loadIcons = () => {
  library.add(
    faSort,
    faEye,
    faSync,
    faBan,
    faTrash,
    faArrowLeft,
    faSave,
    faPlus,
    faPencilAlt,
    faUser,
    faTachometerAlt,
    faHeart,
    faList,
    faTasks,
    faBook,
    faHdd,
    faLock,
    faSignInAlt,
    faSignOutAlt,
    faWrench,
    faThList,
    faUserPlus,
    faAsterisk,
    faFlag,
    faBell,
    faHome,
    faRoad,
    faCloud,
    faTimesCircle,
    faSearch
  );
};

/**
 * Get icon via parameter 'fieldBelong'
 * @param belong fieldBelong
 */
export const getIconSrc = belong => {
  let iconSrc = '';
  switch (belong) {
    case FIELD_BELONG.CUSTOMER:
      iconSrc = '/content/images/common/ic-sidebar-customer.svg';
      break;
    case FIELD_BELONG.EMPLOYEE:
      iconSrc = '/content/images/ic-sidebar-employee.svg';
      break;
    case FIELD_BELONG.ACTIVITY:
      iconSrc = '/content/images/ic-sidebar-activity.svg';
      break;
    case FIELD_BELONG.BUSINESS_CARD:
      iconSrc = '/content/images/ic-sidebar-business-card.svg';
      break;
    case FIELD_BELONG.PRODUCT:
      iconSrc = '/content/images/ic-sidebar-product.svg';
      break;
    case FIELD_BELONG.TASK:
      iconSrc = '/content/images/task/ic-time1.svg';
      break;
    case FIELD_BELONG.MILE_STONE:
      iconSrc = '/content/images/task/ic-flag-brown.svg';
      break;
    case FIELD_BELONG.PRODUCT_TRADING:
      iconSrc = '/content/images/ic-sidebar-sales.svg';
      break;
    case FIELD_BELONG.SCHEDULE:
      iconSrc = '/content/images/ic-sidebar-calendar.svg';
      break;
    default:
      break;
  }
  return iconSrc;
};
