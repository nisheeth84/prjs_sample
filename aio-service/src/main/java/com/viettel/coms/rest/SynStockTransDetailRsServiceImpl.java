/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.SynStockTransDetailBusinessImpl;
import com.viettel.coms.dto.SynStockTransDetailDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class SynStockTransDetailRsServiceImpl implements SynStockTransDetailRsService {

    protected final Logger log = Logger.getLogger(SynStockTransDetailRsServiceImpl.class);
    @Autowired
    SynStockTransDetailBusinessImpl synStockTransDetailBusinessImpl;

    @Override
    public Response getSynStockTransDetail() {
        List<SynStockTransDetailDTO> ls = synStockTransDetailBusinessImpl.getAll();
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
    public Response getSynStockTransDetailById(Long id) {
        SynStockTransDetailDTO obj = (SynStockTransDetailDTO) synStockTransDetailBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateSynStockTransDetail(SynStockTransDetailDTO obj) {
        Long id = synStockTransDetailBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addSynStockTransDetail(SynStockTransDetailDTO obj) {
        Long id = synStockTransDetailBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteSynStockTransDetail(Long id) {
        SynStockTransDetailDTO obj = (SynStockTransDetailDTO) synStockTransDetailBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            synStockTransDetailBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
}
