/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.ConstructionTaskDailyBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dto.ConstructionTaskDailyDTO;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import java.util.Date;
import java.util.List;

/**
 * @author HungLQ9
 */
public class ConstructionTaskDailyRsServiceImpl implements ConstructionTaskDailyRsService {

    protected final Logger log = Logger.getLogger(ConstructionTaskDailyBusinessImpl.class);
    @Autowired
    ConstructionTaskDailyBusinessImpl constructionTaskDailyBusinessImpl;
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
    @Context
    HttpServletRequest request;

    @Override
    public Response getConstructionTaskDaily() {
        List<ConstructionTaskDailyDTO> ls = constructionTaskDailyBusinessImpl.getAll();
        if (ls == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            DataListDTO data = new DataListDTO();
            data.setData(ls);
            data.setTotal(ls.size());
            data.setSize(ls.size());
            data.setStart(1);
            return Response.ok(data).build();
        }
    }

    @Override
    public Response getConstructionTaskDailyById(Long id) {
        ConstructionTaskDailyDTO obj = (ConstructionTaskDailyDTO) constructionTaskDailyBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateConstructionTaskDaily(ConstructionTaskDailyDTO obj) {
        Long id = constructionTaskDailyBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addConstructionTaskDaily(ConstructionTaskDailyDTO obj) {
        Long id = constructionTaskDailyBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteConstructionTaskDaily(Long id) {
        ConstructionTaskDailyDTO obj = (ConstructionTaskDailyDTO) constructionTaskDailyBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            constructionTaskDailyBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
    
    @Override
    public Response doSearch(ConstructionTaskDailyDTO obj) {
    	KttsUserSession objUsers = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_CONSTRUCTION_TASK_DAILY");
        objKpiLog.setDescription("Phê duyệt sản lượng ngoài OS theo ngày");
        objKpiLog.setCreateUserId(objUsers.getVpsUserInfo().getSysUserId());
        DataListDTO data = constructionTaskDailyBusinessImpl.doSearch(obj);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();//end
    }

}
