/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.TmpnContractBusinessImpl;
import com.viettel.coms.dto.TmpnContractDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class TmpnContractRsServiceImpl implements TmpnContractRsService {

    protected final Logger log = Logger.getLogger(TmpnContractRsServiceImpl.class);
    @Autowired
    TmpnContractBusinessImpl tmpnContractBusinessImpl;

    @Override
    public Response getTmpnContract() {
        List<TmpnContractDTO> ls = tmpnContractBusinessImpl.getAll();
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
    public Response getTmpnContractById(Long id) {
        TmpnContractDTO obj = (TmpnContractDTO) tmpnContractBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateTmpnContract(TmpnContractDTO obj) {
        Long id = tmpnContractBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addTmpnContract(TmpnContractDTO obj) {
        Long id = tmpnContractBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteTmpnContract(Long id) {
        TmpnContractDTO obj = (TmpnContractDTO) tmpnContractBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            tmpnContractBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
}
