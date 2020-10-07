/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.TmpnForceNewLineBusinessImpl;
import com.viettel.coms.dto.TmpnForceNewLineDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class TmpnForceNewLineRsServiceImpl implements TmpnForceNewLineRsService {

    protected final Logger log = Logger.getLogger(TmpnForceNewLineRsServiceImpl.class);
    @Autowired
    TmpnForceNewLineBusinessImpl tmpnForceNewLineBusinessImpl;

    @Override
    public Response getTmpnForceNewLine() {
        List<TmpnForceNewLineDTO> ls = tmpnForceNewLineBusinessImpl.getAll();
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
    public Response getTmpnForceNewLineById(Long id) {
        TmpnForceNewLineDTO obj = (TmpnForceNewLineDTO) tmpnForceNewLineBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateTmpnForceNewLine(TmpnForceNewLineDTO obj) {
        Long id = tmpnForceNewLineBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addTmpnForceNewLine(TmpnForceNewLineDTO obj) {
        Long id = tmpnForceNewLineBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteTmpnForceNewLine(Long id) {
        TmpnForceNewLineDTO obj = (TmpnForceNewLineDTO) tmpnForceNewLineBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            tmpnForceNewLineBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
}
