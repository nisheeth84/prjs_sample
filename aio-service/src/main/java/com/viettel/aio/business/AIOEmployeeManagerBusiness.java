package com.viettel.aio.business;

import com.viettel.aio.dto.AIOMonthPlanDetailDTO;
import com.viettel.aio.dto.AIOStaffPlainDTO;
import com.viettel.aio.dto.AIOStaffPlanDetailDTO;
import com.viettel.aio.response.ResponseMsg;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface AIOEmployeeManagerBusiness {

    List<AIOStaffPlanDetailDTO> getAllSysGroupByCode(AIOStaffPlanDetailDTO obj, HttpServletRequest request);

    List<AIOStaffPlanDetailDTO> getAllSysUserByName(AIOStaffPlanDetailDTO obj, HttpServletRequest request);
    void insertMonthPlan(AIOStaffPlainDTO obj, Long sysUserId);

    int validateNewEdit(AIOStaffPlanDetailDTO obj);

}
