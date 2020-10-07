/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.UtilAttachDocumentBusinessImpl;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class UtilAttachDocumentRsServiceImpl implements UtilAttachDocumentRsService {

    protected final Logger log = Logger.getLogger(UtilAttachDocumentRsServiceImpl.class);
    @Autowired
    UtilAttachDocumentBusinessImpl utilAttachDocumentBusinessImpl;

    @Override
    public Response getUtilAttachDocument() {
        List<UtilAttachDocumentDTO> ls = utilAttachDocumentBusinessImpl.getAll();
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
    public Response getUtilAttachDocumentById(Long id) {
        UtilAttachDocumentDTO obj = (UtilAttachDocumentDTO) utilAttachDocumentBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateUtilAttachDocument(UtilAttachDocumentDTO obj) {
        Long id = utilAttachDocumentBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addUtilAttachDocument(UtilAttachDocumentDTO obj) {
        Long id = utilAttachDocumentBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteUtilAttachDocument(Long id) {
        UtilAttachDocumentDTO obj = (UtilAttachDocumentDTO) utilAttachDocumentBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            utilAttachDocumentBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
}
