import { useEffect } from 'react';

export default (refPar, handler: any) => {
  const handleClickOutside = event => {
    if (!refPar.current) {
      return;
    }

    // To handle in case Parent is TRIGGERED > children is TRIGGERED
    if (refPar.current.children.length > 0) {
      refPar.current.children.forEach(node => {
        node.addEventListener('click', e => e.stopPropagation());
      });
    }

    if (refPar.current.contains(event.target)) {
      return;
    }

    handler(event);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [refPar, handleClickOutside]);
};
