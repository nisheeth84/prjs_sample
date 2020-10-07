/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.SynStockTransBusinessImpl;
import com.viettel.coms.dto.SynStockTransDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * @author HungLQ9
 */
public class SynStockTransRsServiceImpl implements SynStockTransRsService {

    protected final Logger log = Logger.getLogger(SynStockTransBusinessImpl.class);
    @Autowired
    SynStockTransBusinessImpl synStockTransBusinessImpl;

    @Autowired
    private UserRoleBusinessImpl userRoleBusiness;

    @Context
    private HttpServletRequest request;

    @Override
    public Response getSynStockTrans() {
        List<SynStockTransDTO> ls = synStockTransBusinessImpl.getAll();
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
    public Response getSynStockTransById(Long id) {
        SynStockTransDTO obj = (SynStockTransDTO) synStockTransBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateSynStockTrans(SynStockTransDTO obj) {
        Long id = synStockTransBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addSynStockTrans(SynStockTransDTO obj) {
        Long id = synStockTransBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteSynStockTrans(Long id) {
        SynStockTransDTO obj = (SynStockTransDTO) synStockTransBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            synStockTransBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }

    //VietNT_20190116_start
    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(SynStockTransDTO obj) {
        DataListDTO dataListDTO = synStockTransBusinessImpl.doSearch(obj);
        return Response.ok(dataListDTO).build();
    }

    @Override
    public Response doForwardGroup(SynStockTransDTO dto) {
        KttsUserSession session = userRoleBusiness.getUserSession(request);
        Long sysUserId = session.getVpsUserInfo().getSysUserId();

        try {
            synStockTransBusinessImpl.doForwardGroup(dto, sysUserId);
            return Response.ok(Response.Status.OK).build();
        } catch (BusinessException e) {
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    //VietNT_end
}
