import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: ${props => props.joinStatus === 'joined' ? 'green' : (props.joinStatus === 'report' ? 'gray' : 'none')};
  border: 1px solid ${props => props.joinStatus === 'joined' ? 'green' : (props.joinStatus === 'report' ? 'gray' : 'none')};
  color: ${props => props.joinStatus === 'joined' ? 'black' : (props.joinStatus === 'report' ? 'red' : 'none')};
  position: relative;
  .line-status-miss {
    position: absolute;
    top: 50%;
    display: ${props => props.joinStatus === 'miss' ? 'block' : 'none'};
  }
`;
export interface ITimeStatusOfDate {
  time?: string,
  text?: string
}
const TimeStatusOfDate = ({ time = '', text = '' }: ITimeStatusOfDate) => {

  return (
    <Wrapper>
      <span>icon status</span>
      {time && <span>{time}</span>}
      <span>icon status</span>
      {text && <span className="text-">{text}</span>}
      <hr className="line-status-miss" />
    </Wrapper>
  );
};

export default TimeStatusOfDate;
