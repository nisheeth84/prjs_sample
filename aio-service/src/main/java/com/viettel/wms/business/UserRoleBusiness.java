package com.viettel.wms.business;

import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.dto.UserRoleDTO;

import java.util.List;

public interface UserRoleBusiness {

    long count();

    DataListDTO doSearchUserRole(UserRoleDTO obj);

    List<UserRoleDTO> doSearchUserRoleData(UserRoleDTO obj);

    DataListDTO doSearchRole(UserRoleDTO obj);

    boolean deleteUserRoleData(UserRoleDTO obj);

    boolean insertUserRoleData(List<UserRoleDTO> obj);

    boolean insertRole(List<UserRoleDTO> obj);

}
