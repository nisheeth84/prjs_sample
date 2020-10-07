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

import com.viettel.coms.business.ConstructionTaskBusinessImpl;
import com.viettel.coms.business.RpRevenueBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dto.ConstructionTaskDetailDTO;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;

public class RpRevenueRsServiceImpl implements RpRevenueRsService{
	
	protected final Logger log = Logger.getLogger(RpRevenueRsServiceImpl.class);
    @Autowired
    RpRevenueBusinessImpl rpRevenueBusinessImpl;
    
    @Value("${allow.file.ext}")
    private String allowFileExt;
    @Value("${allow.folder.dir}")
    private String allowFolderDir;
    // chinhpxn20180716_end

    @Context
    HttpServletResponse response;
    @Value("${folder_upload2}")
    private String folderUpload;
    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
    @Autowired
    ConstructionTaskBusinessImpl constructionTaskBusiness;
    @Context
    HttpServletRequest request;

	@Override
	public Response doSearchForRevenue(ConstructionTaskDetailDTO obj) {
		//tanqn 20181113 start
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_CONSTRUCTION_TASK_DETAIL");
        objKpiLog.setDescription("Chi tiết doanh thu theo ngày");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		DataListDTO data = rpRevenueBusinessImpl.doSearchForRevenue(obj, request);
		Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
	}

	@Override
    public Response exportContructionDT(ConstructionTaskDetailDTO obj) throws Exception {
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_CONSTRUCTION_TASK_DETAIL");
        objKpiLog.setDescription("Chi tiết doanh thu theo ngày");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {

            String strReturn = rpRevenueBusinessImpl.exportContructionDT(obj, request);
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
//tanqn 20181113 end
}
