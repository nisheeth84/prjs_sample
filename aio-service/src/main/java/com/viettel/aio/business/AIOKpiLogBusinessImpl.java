package com.viettel.aio.business;

import com.viettel.aio.bo.AIOKpiLogBO;
import com.viettel.aio.config.FunctionCodeLog;
import com.viettel.aio.dao.AIOKpiLogDAO;
import com.viettel.aio.dto.AIOKpiLogDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.Date;

//VietNT_20200213_created
@Service("aioKpiLogBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOKpiLogBusinessImpl extends BaseFWBusinessImpl<AIOKpiLogDAO, AIOKpiLogDTO, AIOKpiLogBO> implements AIOKpiLogBusiness {

    static Logger logger = LoggerFactory.getLogger(AIOKpiLogBusinessImpl.class);

    @Autowired
    public AIOKpiLogBusinessImpl(AIOKpiLogDAO aioKpiLogDao) {
        this.aioKpiLogDao = aioKpiLogDao;
    }

    private AIOKpiLogDAO aioKpiLogDao;

    /**
     * Luu log access function vao db
     * @param functionCode  ma function
     * @param sysUserId     user dang nhap
     * @param employeeCode  code user dang nhap
     * @param employeeName  ten user dang nhap
     * @param sysGroupId    gia tri sys group user nhao
     * @param desc          chi tiet
     */
    @Override
    public void createGenericLog(FunctionCodeLog functionCode, Long sysUserId, String employeeCode, String employeeName,
                                 Long sysGroupId, String desc) {
        AIOKpiLogDTO log = new AIOKpiLogDTO();
        log.setFunctionCode(functionCode.name());
        log.setSysUserId(sysUserId);
        log.setEmployeeCode(employeeCode);
        log.setFullName(employeeName);
        log.setSysGroupId(sysGroupId);
        log.setDescription(desc);
        log.setTimeDate(new Date());

        aioKpiLogDao.saveObject(log.toModel());
    }

    @Override
    public void createGenericLog(FunctionCodeLog functionCode, SysUserCOMSDTO user, String desc) {
        this.createGenericLog(functionCode, user.getSysUserId(), user.getEmployeeCode(), user.getFullName(), null, desc);
    }

    @Override
    public void createGenericLog(FunctionCodeLog functionCode, SysUserCOMSDTO user, Long sysGroupId) {
        this.createGenericLog(functionCode, user.getSysUserId(), user.getEmployeeCode(), user.getFullName(), sysGroupId, null);
    }

    @Override
    public void createGenericLog(FunctionCodeLog functionCode, SysUserCOMSDTO user, Long sysGroupId, String desc) {
        this.createGenericLog(functionCode, user.getSysUserId(), user.getEmployeeCode(), user.getFullName(), sysGroupId, desc);
    }

    @Override
    public void createGenericLog(FunctionCodeLog functionCode, SysUserCOMSDTO user) {
        this.createGenericLog(functionCode, user.getSysUserId(), user.getEmployeeCode(), null, null, null);
    }
}
