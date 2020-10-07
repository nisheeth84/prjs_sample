package com.viettel.coms.rest;

import java.util.Collections;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import com.viettel.coms.business.MaterialDebtReportBusinessImpl;
import com.viettel.coms.business.RpQuantityBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.MaterialDebtReportDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;

public class MaterialDebtReportRsServiceImpl implements MaterialDebtReportRsService{

	protected final Logger log = Logger.getLogger(MaterialDebtReportRsServiceImpl.class);
	@Autowired
	RpQuantityBusinessImpl rpQuantityBusinessImpl;
	@Autowired
	MaterialDebtReportBusinessImpl materialDebtReportBusinessImpl;
	@Context
    HttpServletRequest request;
	@Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
    @Context
    HttpServletResponse response;
    @Value("${folder_upload2}")
    private String folderUpload;
    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

	
	@Override
	public Response doSearchDetailForReport(WorkItemDetailDTO obj) {
		DataListDTO data = rpQuantityBusinessImpl.doSearchQuantity(obj, request);
        return Response.ok(data).build();
	}

	@Override
	public Response doSearchForReport(MaterialDebtReportDTO obj) throws Exception {
		//tanqn start 20181113
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_FOR_REPORT");
        objKpiLog.setDescription("Báo cáo công nợ vaath tư");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		try {
			DataListDTO data = materialDebtReportBusinessImpl.doSearchForReport(obj, request);
			Date dEnd = new Date();
	        objKpiLog.setEndTime(dEnd);
	        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
	        objKpiLog.setStatus("1");
	        yearPlanBusinessImpl.addKpiLog(objKpiLog);
	        return Response.ok(data).build();
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
	
	@Override
	public Response exportReport(MaterialDebtReportDTO obj) throws Exception {
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_FOR_REPORT");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setDescription("Báo cáo công nợ vật tư");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		try {
            String strReturn = materialDebtReportBusinessImpl.exportReport(obj, request);
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
	
	@Override
	public Response exportDetailReport(MaterialDebtReportDTO obj) throws Exception {
		try {
            String strReturn = materialDebtReportBusinessImpl.exportDetailReport(obj, request);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
		return null;
	}

}
