/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.ObstructedBusinessImpl;
import com.viettel.coms.dto.ObstructedDetailDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;

/**
 * @author HungLQ9
 */
public class ObstructedRsServiceImpl implements ObstructedRsService {

    protected final Logger log = Logger.getLogger(ObstructedRsServiceImpl.class);
    @Autowired
    ObstructedBusinessImpl obstructedBusinessImpl;

    @Override
    public Response getAttachFileById(Long id) throws Exception {
        // TODO Auto-generated method stub
        ObstructedDetailDTO data = obstructedBusinessImpl.getAttachFileById(id);
        return Response.ok(data).build();
    }

}
