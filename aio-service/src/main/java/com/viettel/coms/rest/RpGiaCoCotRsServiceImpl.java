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

import com.viettel.coms.business.RpGiaCoCotBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.RpGiaCoCotDTO;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;

public class RpGiaCoCotRsServiceImpl implements RpGiaCoCotRsService{

	protected final Logger log = Logger.getLogger(RpGiaCoCotRsServiceImpl.class);
    @Autowired
    RpGiaCoCotBusinessImpl rpGiaCoCotBusinessImpl;
    @Context
    HttpServletRequest request;
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
	@Override
	public Response doSearchGiaCoCot(RpGiaCoCotDTO obj) {
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		//tanqn 20181116 start
		KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEACH_GIA_CO_COT");
        //objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setDescription("Báo cáo giá cố cột");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = rpGiaCoCotBusinessImpl.doSearchGiaCoCot(obj);
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
            stationCodeLst = rpGiaCoCotBusinessImpl.readFileStation(attachments);
        } catch (Exception e) {
            return Response.status(Status.BAD_REQUEST).build();
        }
        return Response.ok(Collections.singletonMap("stationCodeLst", stationCodeLst)).build();
    }
	
	@Override
    public Response readFileContractReport(Attachment attachments, HttpServletRequest request) {
        List<String> contractCodeLst = null;
        try {
        	contractCodeLst = rpGiaCoCotBusinessImpl.readFileContract(attachments);
        } catch (Exception e) {
            return Response.status(Status.BAD_REQUEST).build();
        }
        return Response.ok(Collections.singletonMap("contractCodeLst", contractCodeLst)).build();
    }

	@Override
    public Response exportCompleteProgress(RpGiaCoCotDTO obj) throws Exception {
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		//tanqn 20181116 start
		KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_GIA_CO_COT");
        //objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setDescription("Báo cáo giá cố cột");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            String strReturn = rpGiaCoCotBusinessImpl.exportCompleteProgress(obj);
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
