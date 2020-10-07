/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.wms.rest;

import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.KpiStorageAmountBusinessImpl;
import com.viettel.wms.business.KpiStorageTimeBusinessImpl;
import com.viettel.wms.dto.KpiStorageAmountDTO;
import com.viettel.wms.dto.KpiStorageTimeDTO;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Collections;


public class StockGoodsKpiRsServiceImpl implements StockGoodsKpiRsService {

    //    protected final Logger log = Logger.getLogger(UserRsService.class);
    @Context
    HttpServletRequest request;
    @Autowired
    KpiStorageTimeBusinessImpl kpiStorageTimeBusinessImpl;
    @Autowired
    KpiStorageAmountBusinessImpl kpiStorageAmountBusinessImpl;

    //Hàm tìm kiếm kpi theo thời gian
    @Override
    public Response doSearchKpiTime(KpiStorageTimeDTO obj) throws Exception {
        DataListDTO data;
        try {
            data = kpiStorageTimeBusinessImpl.doSearchKpiTime(obj, request);
            return Response.ok(data).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    //End
    //Hàm tìm kiếm Kpi theo số lượng
    @Override
    public Response doSearchKpiAmount(KpiStorageAmountDTO obj) throws Exception {
        DataListDTO data;
        try {
            data = kpiStorageAmountBusinessImpl.doSearchKpiAmount(obj, request);
            return Response.ok(data).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }

    }
    //End


}
