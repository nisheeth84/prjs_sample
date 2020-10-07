import styled from 'styled-components';

export const TimeLineLeft = styled.div`
  min-width: ${props => (props.isModalConfirm ? 0 : '317px')};
  display: inline-block;
`;

export const RuleArrow = styled.img`
  margin: 0 10px 0 20px;
`;

export const FileChangeWrapper = styled.div`
  .min-width-90 {
    min-width: ${props => (props.isModalConfirm ? 0 : '90px')};
    display: inline-block;
  }

  .min-width-110 {
    min-width: ${props => (props.isModalConfirm ? 0 : '110px')};
    display: inline-block;
  }
`;

export const RelationChangeWrapper = styled(FileChangeWrapper)``;

export const ShowImageWrap = styled.div`
  display: flex;
  img {
    width: calc(100% - 24px);
    /* margin-top: 24px; */
  }
  a {
    margin-top: -24px;
  }
`;

export const PlaceHolderCircel = styled.div`
  position: absolute;
  color: red;
  width: 35px;
  height: 35px;
  left: -45px;
  overflow: hidden;
  background: transparent;
  z-index: 3px;
  cursor: pointer;
`;
