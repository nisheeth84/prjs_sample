/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.MerEntityBusinessImpl;
import com.viettel.coms.dto.MerEntitySimpleDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class MerEntityRsServiceImpl implements MerEntityRsService {

    protected final Logger log = Logger.getLogger(MerEntityRsServiceImpl.class);
    @Autowired
    MerEntityBusinessImpl merEntityBusinessImpl;

    @Override
    public Response getMerEntity() {
        List<MerEntitySimpleDTO> ls = merEntityBusinessImpl.getAll();
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
    public Response getMerEntityById(Long id) {
        MerEntitySimpleDTO obj = (MerEntitySimpleDTO) merEntityBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateMerEntity(MerEntitySimpleDTO obj) {
        Long id = merEntityBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addMerEntity(MerEntitySimpleDTO obj) {
        Long id = merEntityBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteMerEntity(Long id) {
        MerEntitySimpleDTO obj = (MerEntitySimpleDTO) merEntityBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            merEntityBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
}
