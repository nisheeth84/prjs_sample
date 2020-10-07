/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.TmpnForceNewBtsBusinessImpl;
import com.viettel.coms.dto.TmpnForceNewBtsDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class TmpnForceNewBtsRsServiceImpl implements TmpnForceNewBtsRsService {

    protected final Logger log = Logger.getLogger(TmpnForceNewBtsRsServiceImpl.class);
    @Autowired
    TmpnForceNewBtsBusinessImpl tmpnForceNewBtsBusinessImpl;

    @Override
    public Response getTmpnForceNewBts() {
        List<TmpnForceNewBtsDTO> ls = tmpnForceNewBtsBusinessImpl.getAll();
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
    public Response getTmpnForceNewBtsById(Long id) {
        TmpnForceNewBtsDTO obj = (TmpnForceNewBtsDTO) tmpnForceNewBtsBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateTmpnForceNewBts(TmpnForceNewBtsDTO obj) {
        Long id = tmpnForceNewBtsBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addTmpnForceNewBts(TmpnForceNewBtsDTO obj) {
        Long id = tmpnForceNewBtsBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteTmpnForceNewBts(Long id) {
        TmpnForceNewBtsDTO obj = (TmpnForceNewBtsDTO) tmpnForceNewBtsBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            tmpnForceNewBtsBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
}
