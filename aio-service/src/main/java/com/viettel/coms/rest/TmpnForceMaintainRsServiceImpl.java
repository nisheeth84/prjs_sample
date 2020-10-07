/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.TmpnForceMaintainBusinessImpl;
import com.viettel.coms.dto.TmpnForceMaintainDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class TmpnForceMaintainRsServiceImpl implements TmpnForceMaintainRsService {

    protected final Logger log = Logger.getLogger(TmpnForceMaintainRsServiceImpl.class);
    @Autowired
    TmpnForceMaintainBusinessImpl tmpnForceMaintainBusinessImpl;

    @Override
    public Response getTmpnForceMaintain() {
        List<TmpnForceMaintainDTO> ls = tmpnForceMaintainBusinessImpl.getAll();
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
    public Response getTmpnForceMaintainById(Long id) {
        TmpnForceMaintainDTO obj = (TmpnForceMaintainDTO) tmpnForceMaintainBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateTmpnForceMaintain(TmpnForceMaintainDTO obj) {
        Long id = tmpnForceMaintainBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addTmpnForceMaintain(TmpnForceMaintainDTO obj) {
        Long id = tmpnForceMaintainBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteTmpnForceMaintain(Long id) {
        TmpnForceMaintainDTO obj = (TmpnForceMaintainDTO) tmpnForceMaintainBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            tmpnForceMaintainBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
}
