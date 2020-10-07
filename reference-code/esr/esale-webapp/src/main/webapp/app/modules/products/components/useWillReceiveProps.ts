import React, { useState, useEffect } from 'react';
import { countBy } from 'lodash';

const useWillReceiveProps = <T>(dependency: any, cb?) => {
  const [state, setState] = useState<T>(dependency);
  const [prevState, setPrevState] = useState<T>(null);

  useEffect(() => {
    cb && cb(state, dependency);
    setPrevState(state);
    setState(dependency);
  }, [dependency]);

  return [state, prevState];
};

export default useWillReceiveProps;
