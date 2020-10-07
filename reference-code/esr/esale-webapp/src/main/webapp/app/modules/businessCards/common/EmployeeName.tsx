import React, { useState } from 'react';
import styled from 'styled-components';
import PopupEmployeeDetail from 'app/modules/employees/popup-detail/popup-employee-detail';
import _ from 'lodash';

const AvatarDefault = styled.div`
  height: ${props => props.sizeAvatar + 'px'};
  width: ${props => props.sizeAvatar + 'px'};
  line-height: ${props => props.sizeAvatar + 'px'};;
  border-radius: 50%;
  background-color: #8ac891;
  display: inline-block;
  /* justify-content: center;
    align-items: center; */
  font-size: 14;
  vertical-align: middle;
  color: #fff;
  margin: 0 8px;
  text-align: center;
`;

const AvatarReal = styled.img`
 height: ${props => props.sizeAvatar + 'px'};
  width: ${props => props.sizeAvatar + 'px'};
  line-height: ${props => props.sizeAvatar + 'px'};;
  border-radius: 50%;
  vertical-align: middle;
  margin: 0 8px;
  text-align: center;
`

interface IProps {
  userName: string;
  userImage: string;
  employeeId?: any;
  sizeAvatar?: number;
  backdrop?: boolean;
  subCol?: number;
}

const EmployeeName: React.FC<IProps> = ({ userImage, userName = " ", sizeAvatar = 24, ...props }) => {
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);

  return <>
    <div onClick={() => { setOpenPopupEmployeeDetail(true) }} 
      className={props.subCol ? "text-truncate col-" + props.subCol : ""} 
      style={{display: 'inline-block'}} >
      {!_.isEmpty(userImage) ? (
        <AvatarReal className="user ml-2" sizeAvatar={sizeAvatar} src={userImage} alt="" title="" />
      ) : (
          <AvatarDefault sizeAvatar={sizeAvatar}>{!_.isEmpty(userName) ? userName[0].toUpperCase() : " "}</AvatarDefault>
        )}
        <a className="text-blue mr-3" title="">
          {userName}
        </a>
    </div>
    {openPopupEmployeeDetail &&
      <PopupEmployeeDetail
        showModal={true}
        backdrop={props.backdrop}
        openFromModal={true}
        employeeId={props.employeeId}
        listEmployeeId={[props.employeeId]}
        toggleClosePopupEmployeeDetail={() => setOpenPopupEmployeeDetail(false)}
        resetSuccessMessage={() => { }}
      />
    }
  </>;
};

export default EmployeeName;
