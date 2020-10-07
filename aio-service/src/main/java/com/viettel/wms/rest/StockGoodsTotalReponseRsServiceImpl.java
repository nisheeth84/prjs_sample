/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.wms.rest;

import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.StockGoodsTotalReponseBusinessImpl;
import com.viettel.wms.dto.StockGoodsTotalReponseDTO;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Collections;

public class StockGoodsTotalReponseRsServiceImpl implements
        StockGoodsTotalReponseRsService {

    // protected final Logger log = Logger.getLogger(UserRsService.class);
    @Autowired
    StockGoodsTotalReponseBusinessImpl stockGoodsTotalReponseBusinessImpl;

    @Context
    HttpServletRequest request;

    // tim kiem bao cao kha nang dap ung tuannb
    @Override
    public Response doSearch(StockGoodsTotalReponseDTO obj) throws Exception {
        DataListDTO data;
        try {
            data = stockGoodsTotalReponseBusinessImpl.doSearch(obj, request);
            return Response.ok(data).build();
        } catch (IllegalArgumentException e) {
            return Response.ok()
                    .entity(Collections.singletonMap("error", e.getMessage()))
                    .build();
        }

    }
    // end tuannb
}
