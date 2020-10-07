/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.wms.rest;

import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.AppParamBusinessImpl;
import com.viettel.wms.business.UserRoleBusinessImpl;
import com.viettel.wms.dto.AppParamDTO;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.Date;


public class AppParamRsServiceImpl implements AppParamRsService {

    @Context
    HttpServletRequest request;
    @Autowired
    private UserRoleBusinessImpl userRoleBusinessImpl;
    //    protected final Logger log = Logger.getLogger(UserRsService.class);
    @Autowired
    AppParamBusinessImpl appParamBusinessImpl;

    @Override
    public Response getByUserId(Long userId) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Response doSearch(AppParamDTO obj) {
        DataListDTO data = appParamBusinessImpl.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response remove(AppParamDTO obj) {
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        obj.setUpdatedBy(objUser.getSysUserId());
        obj.setUpdatedDate(new Date());
        obj.setStatus("0");
        Long id = appParamBusinessImpl.deleteAppParam(obj, objUser);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }
    }

    @Override
    public Response add(AppParamDTO obj) throws Exception {
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        try {
            obj.setCreatedBy(objUser.getSysUserId());
            obj.setParType(obj.getParType().toUpperCase());
            obj.setCode(obj.getCode().toUpperCase());
            obj.setStatus("1");
            obj.setCreatedDate(new Date());
            Long ids = appParamBusinessImpl.createAppParam(obj);
            if (ids == 0l) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response update(AppParamDTO obj) throws Exception {
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        try {
            obj.setUpdatedBy(objUser.getSysUserId());
            obj.setParType(obj.getParType().toUpperCase());
            obj.setCode(obj.getCode().toUpperCase());
            obj.setUpdatedDate(new Date());
            Long ids = appParamBusinessImpl.updateAppParam(obj, objUser);
            if (ids == 0l) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }

    }

    @Override
    public Response getAll(AppParamDTO obj) {
        String status = obj.getStatus();
        DataListDTO data = appParamBusinessImpl.getAll(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response getForAutoComplete(AppParamDTO obj) {
        return Response.ok(appParamBusinessImpl.getForAutoComplete(obj)).build();
    }

    @Override
    public Response getForComboBox(AppParamDTO obj) {
        return Response.ok(appParamBusinessImpl.getForComboBox(obj)).build();
    }

    @Override
    public Response getForComboBox1(AppParamDTO obj) {
        return Response.ok(appParamBusinessImpl.getForComboBox1(obj)).build();
    }

    @Override
    public Response getFileDrop() {
        //Hieunn
        //get list filedrop form APP_PARAM with PAR_TYPE = 'SHIPMENT_DOCUMENT_TYPE' and Status=1
        return Response.ok(appParamBusinessImpl.getFileDrop()).build();
    }

}
