package com.viettel.coms.rest;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.viettel.coms.business.RpBTSBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.RpBTSDTO;

import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;

public class RpBTSRsServiceImpl implements RpBTSRsService{

	protected final Logger log = Logger.getLogger(RpBTSRsServiceImpl.class);
    @Autowired
    RpBTSBusinessImpl rpBTSBusinessImpl;
    @Context
    HttpServletRequest request;
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
	@Override
	public Response doSearchBTS(RpBTSDTO obj) {
		//tanqn start 20181113
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_BTS");
        //objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setDescription("Báo cáo công nợ vật tư");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = rpBTSBusinessImpl.doSearchBTS(obj);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);//TANQN 20181113 END
        return Response.ok(data).build();
	}
	
	@Override
    public Response readFileStationReport(Attachment attachments, HttpServletRequest request) {
        List<String> stationCodeLst = null;
        try {
            stationCodeLst = rpBTSBusinessImpl.readFileStation(attachments);
        } catch (Exception e) {
            return Response.status(Status.BAD_REQUEST).build();
        }
        return Response.ok(Collections.singletonMap("stationCodeLst", stationCodeLst)).build();
    }
	
	@Override
    public Response readFileContractReport(Attachment attachments, HttpServletRequest request) {
        List<String> contractCodeLst = null;
        try {
        	contractCodeLst = rpBTSBusinessImpl.readFileContract(attachments);
        } catch (Exception e) {
            return Response.status(Status.BAD_REQUEST).build();
        }
        return Response.ok(Collections.singletonMap("contractCodeLst", contractCodeLst)).build();
    }

	@Override
    public Response exportCompleteProgressBTS(RpBTSDTO obj) throws Exception {
		//tanqn start 20181113
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_COMPLETE_PROGRESS_BTS");
        //objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setDescription("Báo cáo công nợ vật tư");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            String strReturn = rpBTSBusinessImpl.exportCompleteProgressBTS(obj);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);//TANQN 20181113 END
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);//TANQN 20181113 END
        }
        return null;
    }
}
