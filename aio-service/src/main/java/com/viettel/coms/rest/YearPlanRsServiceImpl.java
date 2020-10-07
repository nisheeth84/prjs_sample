/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.YearPlanDTO;
import com.viettel.coms.dto.YearPlanSimpleDTO;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * @author HungLQ9
 */
public class YearPlanRsServiceImpl implements YearPlanRsService {

    protected final Logger log = Logger.getLogger(YearPlanRsServiceImpl.class);
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
    @Context
    HttpServletRequest request;

    @Override
    public Response remove(YearPlanDTO obj) {
        // TODO Auto-generated method stub
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DELETE_YEAR_PLAN");
        objKpiLog.setDescription("Kế hoạch năm");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        yearPlanBusinessImpl.remove(obj);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok().build();
    }
//    hungtd_20181213_start
    @Override
    public Response updateRegistry(YearPlanDTO obj) {
        // TODO Auto-generated method stub
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DELETE_YEAR_PLAN");
        objKpiLog.setDescription("Kế hoạch năm");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        yearPlanBusinessImpl.updateRegistry(obj);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok().build();
    }
//    hungtd_20181213_end
    

    @Override
    public Response add(YearPlanSimpleDTO obj) throws Exception {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("INSERT_YEAR_PLAN");
        objKpiLog.setDescription("Kế hoạch năm");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            obj.setCreatedUserId(objUser.getVpsUserInfo().getSysUserId());
            obj.setStatus("1");
            obj.setCreatedDate(new Date());
            obj.setCreatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
            obj.setSignState("1");
            objKpiLog.setStartTime(new Date());
            Long ids = yearPlanBusinessImpl.add(obj);

            if (ids == 0l) {
                Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
                Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response update(YearPlanSimpleDTO obj) throws Exception {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("UPDATE_YEAR_PLAN");
        objKpiLog.setDescription("Kế hoạch năm");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
            obj.setUpdatedDate(new Date());
            obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
            objKpiLog.setStartTime(new Date());
            Long ids = yearPlanBusinessImpl.updateYearPlan(obj);
            if (ids == 0l) {
                Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
                Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response doSearch(YearPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        //tanqn 20181109 start
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_YEAR_PLAN");
        objKpiLog.setDescription("Kế hoạch năm");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        objKpiLog.setStartTime(dStart);
        
        // tam thoi chua lay theo don vi tao
        DataListDTO data = yearPlanBusinessImpl.doSearch(obj, null);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
      //tanqn 20181109 end
        return Response.ok(data).build();
    }

    @Override
    public Response getById(Long id) throws Exception {
        // TODO Auto-generated method stub
        YearPlanSimpleDTO data = yearPlanBusinessImpl.getById(id);
        return Response.ok(data).build();
    }

    @Override
    public Response getSequence() throws Exception {
        // TODO Auto-generated method stub
        Long seq = yearPlanBusinessImpl.getSequence();
        Long a = seq;
        return Response.ok(seq).build();
    }

    @Override
    public Response exportExcelTemplate() throws Exception {
        // TODO Auto-generated method stub
        try {
            String strReturn = yearPlanBusinessImpl.exportExcelTemplate();
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
        }
        return null;
    }

    //	 @Value("${folder_upload2}")
//		private String folderUpload;
//
//		@Value("${default_sub_folder_upload}")
//		private String defaultSubFolderUpload;
//
//		@Value("${allow.file.ext}")
//		private String allowFileExt;
//		@Value("${allow.folder.dir}")
//		private String allowFolderDir;
//	@Override
//	public Response  exportYearPlan() throws Exception {
//		// TODO Auto-generated method stub
//		try{
//			String strReturn = yearPlanBusinessImpl.exportYearPlan();
//			return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
//		}catch (Exception e) {
//		} 
//		return null;
//	}
    @Override
    public Response exportYearPlan(YearPlanSimpleDTO obj) throws Exception {
    	 KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
         //tanqn 20181109 start
         KpiLogDTO objKpiLog = new KpiLogDTO();
         Date dStart = new Date();
         objKpiLog.setCreateDatetime(dStart);
         objKpiLog.setFunctionCode("EXPORT_EXEL_YEAR_PLAN");
         objKpiLog.setDescription("Kế hoạch năm");
         objKpiLog.setTransactionCode(obj.getCode());
         objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
         objKpiLog.setStartTime(new Date());
        try {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            String strReturn = yearPlanBusinessImpl.exportYearPlan(obj);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        }
        return null;
    }

    @Override
    public Response getAppParamByType(String type) throws Exception {
        // TODO Auto-generated method stub
        List<AppParamDTO> data = yearPlanBusinessImpl.getAppParamByType(type);
        return Response.ok(data).build();
    }

}
