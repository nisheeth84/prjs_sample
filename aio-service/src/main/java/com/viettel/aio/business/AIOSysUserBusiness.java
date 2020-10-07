package com.viettel.aio.business;

import com.viettel.aio.bo.AIOSysUserBO;
import com.viettel.aio.dto.AIOSysUserDTO;
import com.viettel.service.base.business.BaseFWBusiness;
import com.viettel.service.base.dto.DataListDTO;

public interface AIOSysUserBusiness extends BaseFWBusiness<AIOSysUserDTO, AIOSysUserBO> {

    DataListDTO doSearch(AIOSysUserDTO criteria);

    DataListDTO searchParentUsers(AIOSysUserDTO criteria);

    void doApproveAccount(AIOSysUserDTO obj);

    void doDeleteAccount(AIOSysUserDTO obj);

    void doRejectAccount(AIOSysUserDTO obj);

    void doResetPassword(AIOSysUserDTO obj);

}
