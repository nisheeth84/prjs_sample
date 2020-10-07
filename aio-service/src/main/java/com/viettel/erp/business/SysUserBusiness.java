package com.viettel.erp.business;

import com.viettel.erp.dto.SysUserDTO;

import java.util.List;

public interface SysUserBusiness {

    long count();

    List<SysUserDTO> getForAutoComplete(SysUserDTO query);
}
