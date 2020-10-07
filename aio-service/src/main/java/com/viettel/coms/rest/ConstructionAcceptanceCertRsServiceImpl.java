/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.ConstructionAcceptanceCertBusinessImpl;
import com.viettel.coms.dto.ConstructionAcceptanceCertDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class ConstructionAcceptanceCertRsServiceImpl implements ConstructionAcceptanceCertRsService {

    protected final Logger log = Logger.getLogger(ConstructionAcceptanceCertRsServiceImpl.class);
    @Autowired
    ConstructionAcceptanceCertBusinessImpl constructionAcceptanceCertBusinessImpl;

    @Override
    public Response getConstructionAcceptanceCert() {
        List<ConstructionAcceptanceCertDTO> ls = constructionAcceptanceCertBusinessImpl.getAll();
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
    public Response getConstructionAcceptanceCertById(Long id) {
        ConstructionAcceptanceCertDTO obj = (ConstructionAcceptanceCertDTO) constructionAcceptanceCertBusinessImpl
                .getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateConstructionAcceptanceCert(ConstructionAcceptanceCertDTO obj) {
        Long id = constructionAcceptanceCertBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addConstructionAcceptanceCert(ConstructionAcceptanceCertDTO obj) {
        Long id = constructionAcceptanceCertBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteConstructionAcceptanceCert(Long id) {
        ConstructionAcceptanceCertDTO obj = (ConstructionAcceptanceCertDTO) constructionAcceptanceCertBusinessImpl
                .getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            constructionAcceptanceCertBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
}
