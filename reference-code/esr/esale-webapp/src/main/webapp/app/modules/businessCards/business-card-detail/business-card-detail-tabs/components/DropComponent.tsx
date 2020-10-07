import React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';

const Wrapper = styled.td`
  min-width: 100px;
`;

const DropComponent = (props) => {

  const [{ canDrop }, drop] = useDrop({
    accept: 'date',
    canDrop: () => console.log('canDrop:', canDrop),
    drop: () => console.log('drop: ', drop),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <Wrapper ref={drop} key={props.key} onClick={props.onClick}>
      {props.children}
    </Wrapper>
  );
};

export default DropComponent;
