/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.TmpnSourceBusinessImpl;
import com.viettel.coms.dto.TmpnSourceDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class TmpnSourceRsServiceImpl implements TmpnSourceRsService {

    protected final Logger log = Logger.getLogger(TmpnSourceRsServiceImpl.class);
    @Autowired
    TmpnSourceBusinessImpl tmpnSourceBusinessImpl;

    @Override
    public Response getTmpnSource() {
        List<TmpnSourceDTO> ls = tmpnSourceBusinessImpl.getAll();
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
    public Response getTmpnSourceById(Long id) {
        TmpnSourceDTO obj = (TmpnSourceDTO) tmpnSourceBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateTmpnSource(TmpnSourceDTO obj) {
        Long id = tmpnSourceBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addTmpnSource(TmpnSourceDTO obj) {
        Long id = tmpnSourceBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteTmpnSource(Long id) {
        TmpnSourceDTO obj = (TmpnSourceDTO) tmpnSourceBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            tmpnSourceBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
}
