/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.IssueBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dto.IssueDetailDTO;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.Date;

/**
 * @author HungLQ9
 */
public class IssueRsServiceImpl implements IssueRsService {

    protected final Logger log = Logger.getLogger(IssueRsServiceImpl.class);
    @Autowired
    IssueBusinessImpl issueBusinessImpl;
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
    
    @Context
    HttpServletRequest request;

    @Override
    public Response doSearch(IssueDetailDTO obj) {
        // TODO Auto-generated method stub
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_ISSUEdETAIL");
        objKpiLog.setDescription("Quản lý phản ánh");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = issueBusinessImpl.doSearch(obj, request);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
    }

    @Override
    public Response save(IssueDetailDTO obj) {
        // TODO Auto-generated method stub
    	
        try {
        	//tanqn 20181113 start
        	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            KpiLogDTO objKpiLog = new KpiLogDTO();
            Date dStart = new Date();
            objKpiLog.setStartTime(dStart);
            objKpiLog.setCreateDatetime(dStart);
            objKpiLog.setFunctionCode("INSERT_ISSUEDETAIL");
            objKpiLog.setDescription("Quản lý phản ánh");
            objKpiLog.setTransactionCode(obj.getConstructionCode());
            objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
            Long ids = issueBusinessImpl.save(obj, request);
            if (ids < 0l) {
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
                //tanqn 20181113 end
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response getIssueDiscuss(IssueDetailDTO obj) {
        // TODO Auto-generated method stub
        return Response.ok().entity(issueBusinessImpl.getIssueDiscuss(obj)).build();
    }

    @Override
    public Response getIssueHistory(IssueDetailDTO obj) {
        // TODO Auto-generated method stub
        return Response.ok().entity(issueBusinessImpl.getIssueHistory(obj)).build();
    }
}
