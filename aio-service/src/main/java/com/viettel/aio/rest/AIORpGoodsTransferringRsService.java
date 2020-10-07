package com.viettel.aio.rest;

import com.viettel.aio.dto.AIOSynStockTransDTO;
import com.viettel.wms.dto.StockDTO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

//VietNT_20190524_created
public interface AIORpGoodsTransferringRsService {

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(AIOSynStockTransDTO obj);

    @POST
    @Path("/getStockForAutoComplete")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getStockForAutoComplete(StockDTO obj);
}