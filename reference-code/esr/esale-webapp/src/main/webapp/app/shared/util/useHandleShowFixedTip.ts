import { useEffect, CSSProperties, useState } from 'react';

const useHandleShowFixedTip = ({ inputRef, overlayRef, isFixedTip }, deps = []): [CSSProperties, () => void, (css: CSSProperties) => void] => {
  const [customStyle, setCustomStyle] = useState<CSSProperties>({});
  const [trigger, setTrigger] = useState<any>({})

  useEffect(() => {
    if (inputRef?.current && overlayRef?.current && isFixedTip) {
      const left = inputRef.current.getBoundingClientRect().left;
      const top = inputRef.current.getBoundingClientRect().top;
      const height = inputRef.current.getBoundingClientRect().height;
      const heightOverlay = overlayRef.current.getBoundingClientRect().height;
      // const heightOverlay = overlayRef.current.children[0].getClientRects()[0].height;
      const space = window.innerHeight - top;
      const style: CSSProperties = {
        position: 'fixed',
        zIndex: 9999
      };

      if (space < heightOverlay) {
        style['left'] = `${left}px`;
        style['top'] = `${top - heightOverlay - 1}px`;
      } else {
        style['top'] = `${top + height}px`;
        style['left'] = `${left}px`;
      }
      console.log("style", style)

      setCustomStyle(style);
    }
  }, [trigger, inputRef, overlayRef, ...deps]);

  const triggerCalc = () => {
    isFixedTip && setTrigger({})
  }

  const overrideCustomStyle = (css: CSSProperties) => {
    setCustomStyle(prevCss => ({ ...prevCss, ...css }))
  }

  return [customStyle, triggerCalc, overrideCustomStyle];
};

export default useHandleShowFixedTip;
