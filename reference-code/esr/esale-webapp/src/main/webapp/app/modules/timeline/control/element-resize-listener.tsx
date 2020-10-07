import React, { useRef, RefObject, useCallback, useEffect } from 'react'

type IElementResizeListenerProp = {
  onResize: (event: Event) => void;
}

const ElementResizeListener = (props: IElementResizeListenerProp) => {
  const rafRef = useRef(0);
  const objectRef: RefObject<HTMLObjectElement> = useRef(null);
  const onResizeRef = useRef(props.onResize);

  onResizeRef.current = props.onResize;

  const _onResize = useCallback((e: Event) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      onResizeRef.current(e);
    });
  }, []);

  const onLoad = useCallback(() => {
    const obj = objectRef.current;
    if (obj && obj.contentDocument && obj.contentDocument.defaultView) {
      obj.contentDocument.defaultView.addEventListener('resize', _onResize);
    }
  }, []);

  useEffect(() => {
    return () => {
      const obj = objectRef.current;
      if (obj && obj.contentDocument && obj.contentDocument.defaultView) {
        obj.contentDocument.defaultView.removeEventListener('resize', _onResize);
      }
    }
  }, []);
  
  return (
    <object
      onLoad={onLoad}
      ref={objectRef} tabIndex={-1}
      type={'text/html'}
      data={'about:blank'}
      title={''}
      className='element-resize-listener'
    />
  );
}

export default ElementResizeListener;
