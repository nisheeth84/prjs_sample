/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.TmpnFinanceBusinessImpl;
import com.viettel.coms.dto.TmpnFinanceDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class TmpnFinanceRsServiceImpl implements TmpnFinanceRsService {

    protected final Logger log = Logger.getLogger(TmpnFinanceRsServiceImpl.class);
    @Autowired
    TmpnFinanceBusinessImpl tmpnFinanceBusinessImpl;

    @Override
    public Response getTmpnFinance() {
        List<TmpnFinanceDTO> ls = tmpnFinanceBusinessImpl.getAll();
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
    public Response getTmpnFinanceById(Long id) {
        TmpnFinanceDTO obj = (TmpnFinanceDTO) tmpnFinanceBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateTmpnFinance(TmpnFinanceDTO obj) {
        Long id = tmpnFinanceBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addTmpnFinance(TmpnFinanceDTO obj) {
        Long id = tmpnFinanceBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteTmpnFinance(Long id) {
        TmpnFinanceDTO obj = (TmpnFinanceDTO) tmpnFinanceBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            tmpnFinanceBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
}
