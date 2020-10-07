/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.TmpnMaterialBusinessImpl;
import com.viettel.coms.dto.TmpnMaterialDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class TmpnMaterialRsServiceImpl implements TmpnMaterialRsService {

    protected final Logger log = Logger.getLogger(TmpnMaterialRsServiceImpl.class);
    @Autowired
    TmpnMaterialBusinessImpl tmpnMaterialBusinessImpl;

    @Override
    public Response getTmpnMaterial() {
        List<TmpnMaterialDTO> ls = tmpnMaterialBusinessImpl.getAll();
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
    public Response getTmpnMaterialById(Long id) {
        TmpnMaterialDTO obj = (TmpnMaterialDTO) tmpnMaterialBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateTmpnMaterial(TmpnMaterialDTO obj) {
        Long id = tmpnMaterialBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addTmpnMaterial(TmpnMaterialDTO obj) {
        Long id = tmpnMaterialBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteTmpnMaterial(Long id) {
        TmpnMaterialDTO obj = (TmpnMaterialDTO) tmpnMaterialBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            tmpnMaterialBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
}
