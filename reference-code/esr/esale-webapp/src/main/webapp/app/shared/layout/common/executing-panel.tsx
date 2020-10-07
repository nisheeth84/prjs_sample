import React, { useState, forwardRef, useEffect, ReactElement, useRef, useImperativeHandle } from 'react';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import _ from 'lodash';
import styled from 'styled-components';
import { SHOW_PROGRESS_ACTION } from 'app/config/constants';
import {LOCATION_EXECUTING} from 'app/shared/reducers/action-executing'

const GlassWrap = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  z-index: 99999
`;

interface IExecutingPanelStateProps {
  actionInfo: {
    executing,
    actionId,
  },
  location
}

type IExecutingPanelProps = IExecutingPanelStateProps;

const ExecutingPanel = (props: IExecutingPanelProps) => {
  const [process, setProcess] = useState([]);

  useEffect(() => {
    if (props.actionInfo.executing) {
      if (process.findIndex(e => e === props.actionInfo.actionId) < 0) {
        process.push(props.actionInfo.actionId)
        setProcess(_.cloneDeep(process));
      }
    } else {
      const idx = process.findIndex(e => e === props.actionInfo.actionId)
      if (idx >= 0) {
        process.splice(idx, 1)
        setProcess(_.cloneDeep(process));
      }
    }
  }, [props.actionInfo])

  if (process.length < 1) {
    return <></>
  } else {
    return (
      <GlassWrap>
        <div className={`${props.location === LOCATION_EXECUTING.BOTTOM ? "position-absolute w100" : 'form-inline h100'} `} style={props.location === LOCATION_EXECUTING.BOTTOM ? { bottom: 0 } : {}} >
          <div className="sk-fading-circle">
            <div className="sk-circle1 sk-circle"></div>
            <div className="sk-circle2 sk-circle"></div>
            <div className="sk-circle3 sk-circle"></div>
            <div className="sk-circle4 sk-circle"></div>
            <div className="sk-circle5 sk-circle"></div>
            <div className="sk-circle6 sk-circle"></div>
            <div className="sk-circle7 sk-circle"></div>
            <div className="sk-circle8 sk-circle"></div>
            <div className="sk-circle9 sk-circle"></div>
            <div className="sk-circle10 sk-circle"></div>
            <div className="sk-circle11 sk-circle"></div>
            <div className="sk-circle12 sk-circle"></div>
          </div>
        </div>
      </GlassWrap >
    )
  }
};

const mapStateToProps = ({ actionExecuting }: IRootState) => ({
  actionInfo: actionExecuting.actionInfo,
  location: actionExecuting.location
});

export default connect<IExecutingPanelStateProps, any, any>(
  mapStateToProps,
)(ExecutingPanel);
