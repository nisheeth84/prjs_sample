import React from 'react';
import { useDrag } from 'react-dnd';

const DragComponent = (props) => {

  const [, drag] = useDrag({
    item: { type: 'date' },

    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} key={props.key}>
      {props.children}
    </div>
  );
};

export default DragComponent;
