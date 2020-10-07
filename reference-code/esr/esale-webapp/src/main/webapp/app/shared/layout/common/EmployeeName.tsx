import React, { useState } from 'react';
import styled from 'styled-components';
import PopupEmployeeDetail from 'app/modules/employees/popup-detail/popup-employee-detail';
import _ from 'lodash';
import { useId } from "react-id-generator";
import Popover from 'app/shared/layout/common/Popover';

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

export interface IEmployeeNameProps {
  userName: string;
  userImage?: string;
  employeeId?: any;
  sizeAvatar?: number;
  backdrop?: boolean;
  subCol?: number;
  width?: number
  isHideAva? : boolean
}

const EmployeeName: React.FC<IEmployeeNameProps> = ({ userImage, userName = " ", sizeAvatar = 24, width, isHideAva =false ,  ...props}) => {
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const employeeDetailCtrlId = useId(1, "commonEmployeeNameEmployeeDetail_")

  return <>
    <div className={props.subCol ? "d-flex text-truncate col-" + props.subCol : "d-flex"}
      style={{ ...width && { width } }} >
        {!isHideAva && 
             <div>
             {!_.isEmpty(userImage) ? (
               <AvatarReal className="user ml-2" sizeAvatar={sizeAvatar} src={userImage} alt="" title="" onClick={() => { setOpenPopupEmployeeDetail(true) }} />
             ) : (
                 <AvatarDefault sizeAvatar={sizeAvatar} onClick={() => { setOpenPopupEmployeeDetail(true) }} >{!_.isEmpty(userName) ? userName[0].toUpperCase() : " "}</AvatarDefault>
               )}
           </div>
           }
 
      {!width ?
        <div className="align-self-center">
          <a className="text-blue mr-3" title="" onClick={() => { setOpenPopupEmployeeDetail(true) }}   >
            {userName}
          </a>
        </div>
        :
        <div className="align-self-center" style={{ ...width && { width: width - sizeAvatar * 2 - 4 } }}>
          <Popover x={-20} y={25} >
            <a className="text-blue mr-3" title="" onClick={() => { setOpenPopupEmployeeDetail(true) }}   >
              {userName}
            </a>
          </Popover>
        </div>
      }
      {/* <div className="align-self-center" style={{ ...width && { width: width - sizeAvatar * 2 - 4 } }}>
        <Popover x={-20} y={25} >
          <a className="text-blue mr-3" title="" onClick={() => { setOpenPopupEmployeeDetail(true) }}   >
            {userName}
          </a>
        </Popover>
      </div> */}
    </div>
    {openPopupEmployeeDetail && props.employeeId &&
      <PopupEmployeeDetail
        id={employeeDetailCtrlId[0]}
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
