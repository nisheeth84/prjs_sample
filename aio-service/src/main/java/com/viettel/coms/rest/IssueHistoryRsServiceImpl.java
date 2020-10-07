/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.IssueHistoryBusinessImpl;
import com.viettel.coms.dto.IssueHistoryDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class IssueHistoryRsServiceImpl implements IssueHistoryRsService {

    protected final Logger log = Logger.getLogger(IssueHistoryRsServiceImpl.class);
    @Autowired
    IssueHistoryBusinessImpl issueHistoryBusinessImpl;

    @Override
    public Response getIssueHistory() {
        List<IssueHistoryDTO> ls = issueHistoryBusinessImpl.getAll();
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
    public Response getIssueHistoryById(Long id) {
        IssueHistoryDTO obj = (IssueHistoryDTO) issueHistoryBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateIssueHistory(IssueHistoryDTO obj) {
        Long id = issueHistoryBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addIssueHistory(IssueHistoryDTO obj) {
        Long id = issueHistoryBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteIssueHistory(Long id) {
        IssueHistoryDTO obj = (IssueHistoryDTO) issueHistoryBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            issueHistoryBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
}
