/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.DmpnOrderBusinessImpl;
import com.viettel.coms.dto.DmpnOrderDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class DmpnOrderRsServiceImpl implements DmpnOrderRsService {

    protected final Logger log = Logger.getLogger(DmpnOrderRsServiceImpl.class);
    @Autowired
    DmpnOrderBusinessImpl dmpnOrderBusinessImpl;

    @Override
    public Response getDmpnOrder() {
        List<DmpnOrderDTO> ls = dmpnOrderBusinessImpl.getAll();
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
    public Response getDmpnOrderById(Long id) {
        DmpnOrderDTO obj = (DmpnOrderDTO) dmpnOrderBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateDmpnOrder(DmpnOrderDTO obj) {
        Long id = dmpnOrderBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addDmpnOrder(DmpnOrderDTO obj) {
        Long id = dmpnOrderBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteDmpnOrder(Long id) {
        DmpnOrderDTO obj = (DmpnOrderDTO) dmpnOrderBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            dmpnOrderBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
}
