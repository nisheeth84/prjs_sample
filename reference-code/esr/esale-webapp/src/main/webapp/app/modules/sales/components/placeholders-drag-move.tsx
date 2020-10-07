import React from 'react';

const PlaceholderDrag = ({ placeholderProps }) => {

  return (
    <div
      className="drag-move contents-items sale-list-card__placeholder z-index-1 position-absolute"
      style={{
        top: placeholderProps.clientY,
        height: placeholderProps.clientHeight,
        width: placeholderProps.clientWidth
      }}
    />
  )
}

export default React.memo(PlaceholderDrag);