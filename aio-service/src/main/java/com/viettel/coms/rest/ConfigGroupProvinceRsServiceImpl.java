/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.ConfigGroupProvinceBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dto.ConfigGroupProvinceDTO;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.confingDto;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import java.util.Date;
import java.util.List;

/**
 * @author HungLQ9
 */
public class ConfigGroupProvinceRsServiceImpl implements ConfigGroupProvinceRsService {

    protected final Logger log = Logger.getLogger(ConfigGroupProvinceBusinessImpl.class);
    @Autowired
    ConfigGroupProvinceBusinessImpl configGroupProvinceBusinessImpl;
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
    
    @Context
    HttpServletRequest request;

    @Override
    public Response getConfigGroupProvince() {
        List<ConfigGroupProvinceDTO> ls = configGroupProvinceBusinessImpl.getAll();
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
    public Response getConfigGroupProvinceById(Long id) {
        ConfigGroupProvinceDTO obj = (ConfigGroupProvinceDTO) configGroupProvinceBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateConfigGroupProvince(ConfigGroupProvinceDTO obj) {
        Long id = configGroupProvinceBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addConfigGroupProvince(ConfigGroupProvinceDTO obj) {
        Long id = configGroupProvinceBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteConfigGroupProvince(Long id) {
        ConfigGroupProvinceDTO obj = (ConfigGroupProvinceDTO) configGroupProvinceBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            configGroupProvinceBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }

    @Override
    public Response getCatProvince() {
        List<ConfigGroupProvinceDTO> data = configGroupProvinceBusinessImpl.getCatProvince();
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchCatprovince(ConfigGroupProvinceDTO obj) {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_DETAIL_MONTH_PLAN");
        objKpiLog.setTransactionCode(obj.getCatProvinceCode());
        objKpiLog.setDescription("Cấu hình đơn vị tỉnh");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = configGroupProvinceBusinessImpl.doSearchCatprovince(obj,request);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
    }

    @Override
    public Response saveCatProvince(confingDto obj) {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("INSERT_CAT_PROVINCE");
        objKpiLog.setTransactionCode(obj.getCatProvinceCode());
        objKpiLog.setDescription("Cấu hình đơn vị tỉnh");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        configGroupProvinceBusinessImpl.saveCatProvince(obj);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        
        return Response.status(Status.CREATED).build();
    }

    @Override
    public Response removeCat(Long id) {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DELETE_CAT_PROVINCE");
        objKpiLog.setTransactionCode(id.toString());
        objKpiLog.setDescription("Cấu hình đơn vị tỉnh");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(configGroupProvinceBusinessImpl.removeCat(id)).build();
    }

    @Override
    public Response getListCode(Long id) {
        List<ConfigGroupProvinceDTO> ls = configGroupProvinceBusinessImpl.getListCode(id);
        return Response.ok(ls).build();
    }
}
