import React, { useState, useCallback, useEffect } from 'react';
import { compose, add, subtract, when } from 'ramda';
import {
  isLessThanMaxScale,
  isGreaterThanMinScale,
  SCALE_CHANGE_RANGE,
  MAX_VALUE_SCALE,
  MIN_VALUE_SCALE
} from '../../constants';
import { getTargetValue, safeCall } from 'app/shared/helpers';

interface IScaleControllerProps {
  onScaleChange?: (scale: number) => void;
}

export const ScaleController = (props: IScaleControllerProps) => {
  const [scale, setScale] = useState(MIN_VALUE_SCALE);

  const scaleUp = useCallback(
    _ =>
      compose(
        when(isLessThanMaxScale, setScale),
        add(scale)
      )(SCALE_CHANGE_RANGE),
    [scale]
  );

  const scaleDown = useCallback(
    _ =>
      compose(
        when(isGreaterThanMinScale, setScale),
        subtract(scale)
      )(SCALE_CHANGE_RANGE),
    [scale]
  );

  const scaleChange = useCallback(
    event =>
      compose(
        setScale,
        parseFloat,
        getTargetValue
      )(event),
    []
  );

  useEffect(() => {
    safeCall(props.onScaleChange)(scale);
  }, [scale]);

  return (
    <div className="min-width-200">
      <div className="time-bar">
        <button className={`${isGreaterThanMinScale(scale) ? '' : 'disable'} icon-primary reduction`}  onClick={scaleDown} />
        <div className="slidecontainer">
          <input type="range" min={MIN_VALUE_SCALE} max={MAX_VALUE_SCALE} step={SCALE_CHANGE_RANGE}  value={scale} onChange={scaleChange} />
        </div>
        <button className={`${isLessThanMaxScale(scale) ? '' : 'disable'} icon-primary increase`}  onClick={scaleUp} />
      </div>
    </div>
  );
};
