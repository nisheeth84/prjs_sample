import { useState, useEffect } from 'react';

export const useForceRender = (): [boolean, () => void] => {
  const [isRender, setRender] = useState<boolean>(true);

  useEffect(() => {
    !isRender && setRender(true);
  }, [isRender]);

  const forceRender = () => {
    setRender(false);
  };

  return [isRender, forceRender];
};
