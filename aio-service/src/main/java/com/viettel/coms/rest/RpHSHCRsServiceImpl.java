package com.viettel.coms.rest;

import java.util.Collections;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.viettel.coms.business.RpHSHCBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dto.ConstructionTaskDetailDTO;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;

public class RpHSHCRsServiceImpl implements RpHSHCRsService{
	
	protected final Logger log = Logger.getLogger(RpHSHCRsServiceImpl.class);
    @Autowired
    RpHSHCBusinessImpl rpHSHCBusinessImpl;
    
    @Context
    HttpServletRequest request;
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;

	@Override
	public Response doSearchForConsManager(ConstructionTaskDetailDTO obj) {
		//tanqn 20181113 start
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSERACH_CONSTRUCTION_TASK_DETAIL");
        objKpiLog.setDescription("Chi tiết hoàn công theo ngày");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		
		DataListDTO data = rpHSHCBusinessImpl.doSearchForConsManager(obj, request);
		Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
	}

	@Override
    public Response exportContructionHSHC(ConstructionTaskDetailDTO obj) throws Exception {
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_CONSTRUCTION_TASK_DETAIL");
        objKpiLog.setDescription("Chi tiết hoàn côngtheo ngày");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            String strReturn = rpHSHCBusinessImpl.exportContructionHSHC(obj, request);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        }
        return null;
    }

	
}
