package com.viettel.aio.business;

import com.viettel.aio.config.FunctionCodeLog;
import com.viettel.coms.dto.SysUserCOMSDTO;

public interface AIOKpiLogBusiness {

    void createGenericLog(FunctionCodeLog functionCode, Long sysUserId, String employeeCode, String employeeName,
                          Long sysGroupId, String desc);

    void createGenericLog(FunctionCodeLog functionCode, SysUserCOMSDTO user);

    void createGenericLog(FunctionCodeLog functionCode, SysUserCOMSDTO user, String desc);

    void createGenericLog(FunctionCodeLog functionCode, SysUserCOMSDTO user, Long sysGroupId);

    void createGenericLog(FunctionCodeLog functionCode, SysUserCOMSDTO user, Long sysGroupId, String desc);
}
