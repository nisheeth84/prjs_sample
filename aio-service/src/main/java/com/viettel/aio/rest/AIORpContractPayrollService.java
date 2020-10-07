package com.viettel.aio.rest;

import com.viettel.aio.dto.AIORpContractPayrollDTO;
import com.viettel.aio.dto.AIOSynStockTransDTO;
import com.viettel.wms.dto.StockDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public interface AIORpContractPayrollService {

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(AIORpContractPayrollDTO obj);

}