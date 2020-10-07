package com.viettel.wms.business;

import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.dto.SysRoleDTO;

public interface SysRoleBusiness {

    long count();

    DataListDTO doSearchSysRole(SysRoleDTO obj);

}
