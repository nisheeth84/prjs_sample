

import React, { useState, useRef } from 'react';
import useEventListener from 'app/shared/util/use-event-listener';
import { closest } from 'app/shared/util/dom-element';
import styled from 'styled-components';

const Resizer = styled.span`
  background-color: transparent;
  position: absolute !important;
  top: 0px !important;
  right: 0px !important;
  left: auto !important;
  width: 7px !important;
  height: 100% !important;
  z-index: 99;
  &:hover {
    cursor: col-resize !important;
    background-color: #0f6db5;
  }
`;

export interface IResizeControl {
  onResize?: (width: number) => void;
  isResize?: boolean
}

const ResizeControl: React.FC<IResizeControl> = props => {
  const spanRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseMove = evt => {
    if (!spanRef || !spanRef.current) {
      return;
    }
    const mX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    if (!dragging) {
      return;
    }
    const moveDiff = mX - closest(spanRef.current, 'th').getBoundingClientRect().left;
    if (moveDiff > 10) {
      const el = window.document.getElementById('div-line-id');
      if (el) {
        el.style.left = mX + 'px';
      }
    }
  };

  const startResize = evt => {
    if (!spanRef || !spanRef.current || !props.isResize) {
      return;
    }
    setDragging(true);
    const mX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    setStartX(mX);
    document.body.style.cursor = 'col-resize';
    const lineEl = window.document.getElementById('div-line-id');
    if (!lineEl) {
      const el = window.document.createElement('div');
      const tableHeight = closest(spanRef.current, 'table').clientHeight;
      if (el) {
        el.id = 'div-line-id';
        el.style.width = '1px';
        el.style.height = `${tableHeight}px`;
        el.style.backgroundColor = 'lightgray';
        el.style.display = 'block';
        el.style.position = 'absolute';
        el.style.top = closest(spanRef.current, 'th').getBoundingClientRect().top + 'px';
        el.style.zIndex = '9999';
        el.style.left = mX + 'px';
        window.document.body.appendChild(el);
      }
    } else {
      lineEl.style.left = mX + 'px';
    }
  };

  const endResize = evt => {
    if (!spanRef || !spanRef.current) {
      return;
    }
    if (dragging) {
      const mX = evt.touches ? evt.touches[0].clientX : evt.clientX;
      setDragging(false);
      const lineEl = window.document.getElementById('div-line-id');
      if (lineEl) {
        window.document.body.removeChild(lineEl);
      }
      document.body.style.cursor = '';

      const width = closest(spanRef.current, 'th').getBoundingClientRect().width + (mX - startX);
      if (width < 10) {
        return;
      }

      if (props.onResize) {
        props.onResize(width);
      }
    }
  };

  useEventListener('mousemove', handleMouseMove);
  useEventListener('mouseup', endResize);
  useEventListener('touchmove', handleMouseMove);
  useEventListener('touchend', endResize);

  return <Resizer ref={spanRef} onMouseDown={startResize} onTouchStart={startResize}></Resizer>;
};

export default ResizeControl;
