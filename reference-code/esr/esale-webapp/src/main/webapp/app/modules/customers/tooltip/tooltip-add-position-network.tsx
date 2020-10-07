import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Storage, translate } from 'react-jhipster';
import { safeMapWithIndex } from 'app/shared/helpers/safe-map-with-index';
import { path } from 'ramda'
import useEventListener from 'app/shared/util/use-event-listener';
import { isMouseOnRef } from 'app/shared/util/utils';
import { compose } from 'redux';
import {handleUpdatePosition}  from '../network-map-modal/add-edit-network-map.reducer';
import { trim } from 'lodash';
import { getFieldLabel, jsonParse } from 'app/shared/util/string-utils';

interface ITooltipAddPositionNetworkProps extends StateProps, DispatchProps {
  currentPosition: any;
  useRefButtonCancel: any;
  useRefButtonOK: any;
  onCloseTooltip: () => void;
  departmentId: any;
}

const TooltipAddPositionNetwork = (props: ITooltipAddPositionNetworkProps) => {
  const isEdit = !!props.currentPosition?.masterStandId || !!props.currentPosition?.motivationId || !!props.currentPosition?.comment;
  const [isVisibleDropdownPosition, setVisibleDropdownPosition] = useState(false);
  const [isVisibleDropdownMotivation, setVisibleDropdownMotivation] = useState(false);
  const toolTipPositionRef = useRef(null);
  const toolTipMotivationRef = useRef(null);
  const buttonPositionRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(props.currentPosition);
  const [comment, setComment] = useState(currentPosition ? currentPosition.comment : '');

  const cancelCurrentNetwork = () => {
    props.onCloseTooltip();
  };

  const changeCurrentNetwork = () => {
    currentPosition.comment = trim(comment);
    props.handleUpdatePosition(props.departmentId, currentPosition);
    props.onCloseTooltip();
  };

  const language = useMemo(() => {
    return Storage.session.get('locale', 'ja_jp');
  }, [])

  const handleMouseDownListView = (e) => {
    if (!isMouseOnRef(toolTipPositionRef, e)) {
      setVisibleDropdownPosition(false);
    }
    if (!isMouseOnRef(toolTipMotivationRef, e)) {
      setVisibleDropdownMotivation(false);
    }
  }
  useEventListener('mousedown', handleMouseDownListView);

  const getTitleStand = () => {
    let standResult;
    if (props.standDatas) {
      standResult = props.standDatas.find(stand => stand.masterStandId === currentPosition.masterStandId);
    }
    if (standResult) {
      return jsonParse(standResult.masterStandName)[language];
    }
    return "";
  }

  const getTitleMotivation = () => {
    let motivationResult;
    if (props.motivationDatas) {
      motivationResult = props.motivationDatas.find(motivation => motivation.motivationId === currentPosition.motivationId);
    }
    if (motivationResult) {
      return jsonParse(motivationResult.motivationName)[language];
    }
    return "";
  }

  const setStand = (masterStandId) => {
    currentPosition['masterStandId'] = masterStandId;
    setCurrentPosition(currentPosition);
    setVisibleDropdownPosition(false);
  }

  const setMotivation = (motivationId) => {
    currentPosition['motivationId'] = motivationId;
    setCurrentPosition(currentPosition);
    setVisibleDropdownMotivation(false);
  }

  useEffect(()=>{
    if (buttonPositionRef && buttonPositionRef.current) {
      buttonPositionRef.current.focus();
    }
  },[])

  return (
    <>
      <div className="box-address table-tooltip-box mb-3">
        <div className="table-tooltip-box-body">
          <div className="form-group text-left mb-2">
            <label>{translate('customers.network-map.tooltip-add-position.position')}</label>
            <button className="select-option" onClick={() => setVisibleDropdownPosition(true)} ref={buttonPositionRef}>
              <span className="select-text">{getTitleStand()}</span>
            </button>
            {isVisibleDropdownPosition && <ul className="drop-down drop-down2" ref={toolTipPositionRef}>
              {props.standDatas && props.standDatas.map(
                (stand, index) => (
                  <li className="item smooth" key={index} onSelect={() => setStand(stand.masterStandId)} onClick={()=>setStand(stand.masterStandId)}>
                    <div className="text text2">
                      {getFieldLabel(jsonParse(stand), 'masterStandName')}{'\u00A0'}
                    </div>
                  </li>
                )
              )}
            </ul>}
          </div>
          <div className="form-group text-left mb-2">
            <label>{translate('customers.network-map.tooltip-add-position.motivation')}</label>
            <button className="select-option" onClick={() => setVisibleDropdownMotivation(true)}>
              <span className="select-text">{getTitleMotivation()}</span>
            </button>
            {isVisibleDropdownMotivation && <ul className="drop-down drop-down2" ref={toolTipMotivationRef}>
              {props.motivationDatas && props.motivationDatas.map(
                (motivation, index) => (
                  <li className="item smooth" key={index} onSelect={()=>setMotivation(motivation.motivationId)} onClick={()=>setMotivation(motivation.motivationId)}>
                    <div className="text text2">
                      {getFieldLabel(jsonParse(motivation), 'motivationName')}{'\u00A0'}
                    </div>
                  </li>
                )
              )}
            </ul>}
          </div>
          <div className="form-group text-left mb-0">
            <label>{translate('customers.network-map.tooltip-add-position.memo')}</label>
            <textarea
              typeof="text"
              className="input-normal font-size-10"
              placeholder={translate('customers.network-map.tooltip-add-position.memo-placeholder')}
              value={comment}
              onChange={e => setComment(e.target.value)}
              defaultValue={''}
            />
          </div>
        </div>
        <div className="table-tooltip-box-footer">
          <button className="button-cancel" ref={props.useRefButtonCancel} onClick={() => cancelCurrentNetwork()}>
            {translate('customers.network-map.tooltip-add-position.button-cancel')}
          </button>
          <button className="button-blue" ref={props.useRefButtonOK} onClick={() => changeCurrentNetwork()}>
            {`${isEdit ? translate('customers.network-map.tooltip-add-position.button-edit') :
              translate('customers.network-map.tooltip-add-position.button-add')}`}
          </button>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ addEditNetworkMap }: IRootState) => ({
  standDatas: addEditNetworkMap.standDatas,
  motivationDatas: addEditNetworkMap.motivationDatas
});

const mapDispatchToProps = {
  handleUpdatePosition
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TooltipAddPositionNetwork);
