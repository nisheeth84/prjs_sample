import { useDrag, useDrop, DragElementWrapper } from 'react-dnd';

interface IProps {
  type: string;
  index: number;
  handleDrop: (sourceIndex: number, targetIndex: number) => any;
  item: any;
}

export const useDndByIndex = ({
  type,
  index,
  handleDrop,
  item
}: IProps): {
  isOver: boolean;
  drop: DragElementWrapper<any>;
  isDragging: boolean;
  sourceIndex: number;
  drag: DragElementWrapper<any>;
} => {
  const [{ isOver }, drop] = useDrop<{ index: number; type: string; id: string }, any, { isOver: boolean }>({
    accept: type,
    drop(_item, monitor) {
      const sourceIndex = _item.index;
      const targetIndex = index;

      if (sourceIndex === targetIndex) {
        return;
      }
      handleDrop(sourceIndex, targetIndex);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });

  const [{ isDragging, sourceIndex }, drag] = useDrag({
    item: { type, ...item },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
      sourceIndex: monitor.getItem() && monitor.getItem().index
    })
  });

  return {
    isOver,
    drop,
    isDragging,
    sourceIndex,
    drag
  };
};
