import { connect } from 'react-redux';
import React, { useCallback, useMemo } from 'react';
import { Storage, translate } from 'react-jhipster';
import { path, __ } from 'ramda';
import { safeCall } from 'app/shared/helpers';
import { isViewAsModal } from '../constants';
import { urlify, getFieldLabel } from 'app/shared/util/string-utils';
import parser from 'react-html-parser';
import isUrl from 'app/shared/helpers/is-url';
import isEmail from 'app/shared/helpers/is-email';

interface ITooltipPositionNetworkDetailProps extends StateProps, DispatchProps {
  networkStand;
  motivation;
  stand;
  editPositionNetwork: () => void;
  deletePositionNetwork: () => void;
  viewType;
}

const TooltipPositionNetworkDetail = (props: ITooltipPositionNetworkDetailProps) => {
  const editPositionNetwork = useCallback(() => safeCall(props.editPositionNetwork)(), [props.editPositionNetwork]);
  const deletePositionNetwork = useCallback(() => safeCall(props.deletePositionNetwork)(), [props.deletePositionNetwork]);

  const standName = useMemo(() => {
    return getFieldLabel(props.stand, 'masterStandName');
  }, []);

  const motivationName = useMemo(() => {
    return getFieldLabel(props.motivation, 'motivationName');
  }, []);

  const comment = useMemo(() => {
    const arrContent = [];
    const tmp = (props.networkStand?.stands?.comment + '').split(/[\n\r]/g);
    if (tmp.length > 0) {
      tmp.forEach(e => {
        if (isUrl(e)) {
          arrContent.push(parser('<a target="_blank" href="' + (isEmail(e) ? `mailto:${e}` : e) + '">' + e + '</a>'));
        } else {
          arrContent.push(<p className="mb-0">{e}</p>);
        }
      })
    }
    return arrContent;
  }, []);

  return (
    <>
      <div className="box-address">
        <div className="title-box">
          <span>{standName}</span>
          <div>
            {isViewAsModal(props.viewType) && <>
              <a className="icon-small-primary icon-edit-small" onClick={editPositionNetwork} />
              <a className="icon-small-primary icon-erase-small" onClick={deletePositionNetwork} />
            </>
            }
          </div>
        </div>
        <div className="main">
          <div className="motivation">{translate('customers.network-map.tooltip-position-network-detail.motivation')}：
                  {motivationName}</div>
          <div className="content word-break-all">{translate('customers.network-map.tooltip-position-network-detail.memo')}： {comment}</div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = null;

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TooltipPositionNetworkDetail);
