import React from 'react';

interface IProps {
  text: string;
}

// Lưu ý chỉ dùng cho thẻ a
const Tooltip: React.FC<IProps> = ({ text }) => {
  return (
    <label className="tooltip-common">
      <span>{text}</span>
    </label>
  );
};

export default React.memo(Tooltip);
