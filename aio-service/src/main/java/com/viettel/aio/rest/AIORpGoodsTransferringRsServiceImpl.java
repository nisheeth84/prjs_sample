package com.viettel.aio.rest;

import com.viettel.aio.business.AIORpGoodsTransferringBusinessImpl;
import com.viettel.aio.dto.AIOSynStockTransDTO;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import com.viettel.wms.dto.StockDTO;
import com.viettel.wms.dto.StockTransDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.List;

//VietNT_20190524_create
public class AIORpGoodsTransferringRsServiceImpl implements AIORpGoodsTransferringRsService {

    protected final Logger log = Logger.getLogger(AIORpGoodsTransferringRsServiceImpl.class);

    @Autowired
    private AIORpGoodsTransferringBusinessImpl aioRpGoodsTransferringBusiness;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(AIOSynStockTransDTO obj) {
        DataListDTO data = aioRpGoodsTransferringBusiness.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response getStockForAutoComplete(StockDTO obj) {
        List<StockDTO> list = aioRpGoodsTransferringBusiness.getStockForAutoComplete(obj);
        return Response.ok(list).build();
    }
}
