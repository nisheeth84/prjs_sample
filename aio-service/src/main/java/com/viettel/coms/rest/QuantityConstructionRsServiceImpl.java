package com.viettel.coms.rest;

import com.viettel.coms.business.QuantityConstructionBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;
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
 * @author hungnx
 * @since 20180627
 */
public class QuantityConstructionRsServiceImpl implements QuantityConstructionRsService {

    protected final Logger log = Logger.getLogger(QuantityConstructionRsServiceImpl.class);
    @Autowired
    private QuantityConstructionBusinessImpl quantityConstructionBusinessImpl;
    
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
    @Context
    HttpServletRequest request;

    @Override
    public Response doSearch(WorkItemDetailDTO obj) {
    	//tanqn 20181113 start
    	KttsUserSession objUsers = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSERACH_DETAIL_MONTH_PLAN");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setDescription("Phê duyệt sản lượng theo ngày");
        objKpiLog.setCreateUserId(objUsers.getVpsUserInfo().getSysUserId());
        DataListDTO data = quantityConstructionBusinessImpl.doSearch(obj, request);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();//end
    }

    @Override
    public Response approveQuantityByDay(WorkItemDetailDTO obj) {
        // TODO Auto-generated method stub
    	
        try {
            quantityConstructionBusinessImpl.approveQuantityByDay(obj, request);
           
            return Response.ok(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response cancelApproveQuantityByDay(WorkItemDetailDTO obj) {
        try {
            // TODO Auto-generated method stub
            quantityConstructionBusinessImpl.cancelApproveQuantityByDay(obj, request);
            return Response.ok().build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response approveQuantityDayChecked(List<WorkItemDetailDTO> lstObj) {
    	//tanqn 20181113 start
    	KttsUserSession objUsers = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("ACCEPT_DETAIL_MONTH_PLAN");
        objKpiLog.setDescription("Phê duyệt sản lượng theo ngày");
        objKpiLog.setCreateUserId(objUsers.getVpsUserInfo().getSysUserId());
        try {
            for (WorkItemDetailDTO obj : lstObj) {
                quantityConstructionBusinessImpl.approveQuantityByDay(obj, request);
            }
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response exportConstructionTaskDaily(WorkItemDetailDTO obj) throws Exception {
    	//tanqn 20181113 start
    	KttsUserSession objUsers = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_WORK_ITEM_DETAIL");
        objKpiLog.setDescription("Phê duyệt sản lượng theo ngày");
        objKpiLog.setCreateUserId(objUsers.getVpsUserInfo().getSysUserId());
        try {
            String strReturn = quantityConstructionBusinessImpl.exportConstructionTaskDaily(obj, request);
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
    public Response checkPermissionsCancelConfirm(WorkItemDetailDTO obj) {
        try {
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            Long id = quantityConstructionBusinessImpl.checkPermissionsCancelConfirm(obj, sysGroupId, request);
            return Response.ok(id).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response checkPermissionsApproved(WorkItemDetailDTO obj) {
        try {
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            return Response.ok(quantityConstructionBusinessImpl.checkPermissionsApproved(obj, sysGroupId, request))
                    .build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response getListImage(WorkItemDetailDTO obj) throws Exception {
        return Response.ok(quantityConstructionBusinessImpl.getListImage(obj)).build();
    }

    @Override
    public Response rejectQuantityByDay(WorkItemDetailDTO obj) {
        try {
            quantityConstructionBusinessImpl.rejectQuantityByDay(obj, request);
            return Response.ok().build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response validPriceConstruction(WorkItemDetailDTO obj) {
        try {
            quantityConstructionBusinessImpl.validPriceConstruction(obj);
            return Response.ok().build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response getDetailTaskDaily(WorkItemDetailDTO obj) {
        return Response.ok(quantityConstructionBusinessImpl.getDetailTaskDaily(obj)).build();
    }
}
