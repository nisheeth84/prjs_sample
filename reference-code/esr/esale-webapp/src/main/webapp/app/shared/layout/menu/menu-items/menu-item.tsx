import React, { useRef, useEffect, useState } from 'react';
import { getJsonBName } from 'app/modules/setting/utils';
import { Link } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd';
import { changeOrderServicesInfo } from '../sidebar-menu-left.reducer';
import { connect } from 'react-redux';
import { useLocation } from 'react-router';


interface IMenuItem extends DispatchProps {
  componentDisplay: string;
  ser: any;
  index: number;
}

const type = 'MENU_ITEM';

const MenuItem: React.FC<IMenuItem> = ({ componentDisplay, ser, index, ...props }) => {
  const [ urlActive, setUrlActive ] = useState('');
  const location = useLocation();
  useEffect(()=>{
    setUrlActive(location.pathname.split('/')[1]);
  }, [location]);

  const [{ isOver }, drop] = useDrop<{ index: number, type: string, id: string }, any, { isOver: boolean }>({
    accept: type,
    drop(item, monitor) {
      const sourceIndex = item.index;
      const targetIndex = index;

      if (sourceIndex === targetIndex) {
        return;
      }
      props.changeOrderServicesInfo(sourceIndex, targetIndex);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });

  const [{ isDragging, sourceIndex }, drag] = useDrag({
    item: {
      type,
      id: ser.serviceId,
      index
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
      sourceIndex: monitor.getItem()?.index
    })
  });
  // drag((ref));
  
  return (
    <li ref={drop} className={`${urlActive && ser.servicePath.toLowerCase().includes(urlActive) ? 'active' : ''}`} id={ser.servicePath.split('/')[1]}>
      {sourceIndex > index && isOver && <div className="underline" />}
      <Link to={ser.servicePath ? ser.servicePath : ''} className={`alert-link ${isDragging && 'is-drag'} `} draggable={false} >
        <span className="icon">
          <img src={ser.iconPath} />
        </span>
        <span className="text" ref={drag}>{getJsonBName(ser.serviceName)}</span>
      </Link>
      {sourceIndex < index && isOver && <div className="underline" />}
    </li>
  );
};

const mapDispatchToProps = {
  changeOrderServicesInfo
};
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  null,
  mapDispatchToProps
)(MenuItem);
