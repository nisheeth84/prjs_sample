/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.SynStockTransDetailSerialBusinessImpl;
import com.viettel.coms.dto.SynStockTransDetailSerialDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class SynStockTransDetailSerialRsServiceImpl implements SynStockTransDetailSerialRsService {

    protected final Logger log = Logger.getLogger(SynStockTransDetailSerialRsServiceImpl.class);
    @Autowired
    SynStockTransDetailSerialBusinessImpl synStockTransDetailSerialBusinessImpl;

    @Override
    public Response getSynStockTransDetailSerial() {
        List<SynStockTransDetailSerialDTO> ls = synStockTransDetailSerialBusinessImpl.getAll();
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
    public Response getSynStockTransDetailSerialById(Long id) {
        SynStockTransDetailSerialDTO obj = (SynStockTransDetailSerialDTO) synStockTransDetailSerialBusinessImpl
                .getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateSynStockTransDetailSerial(SynStockTransDetailSerialDTO obj) {
        Long id = synStockTransDetailSerialBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addSynStockTransDetailSerial(SynStockTransDetailSerialDTO obj) {
        Long id = synStockTransDetailSerialBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteSynStockTransDetailSerial(Long id) {
        SynStockTransDetailSerialDTO obj = (SynStockTransDetailSerialDTO) synStockTransDetailSerialBusinessImpl
                .getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            synStockTransDetailSerialBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
}
