package com.viettel.aio.rest;

import com.viettel.aio.dto.AIOProductInfoDTO;
import com.viettel.wms.dto.GoodsDTO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

//VietNT_20190701_created
public interface AIOProductInfoRsService {

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(AIOProductInfoDTO obj);

    @GET
    @Path("/getDropDownData")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDropDownData();

    @POST
    @Path("/saveProductInfo")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response saveProductInfo(AIOProductInfoDTO dto);

    @POST
    @Path("/getProductInfo")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getProductInfo(Long id);

    @POST
    @Path("/disableProduct")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response disableProduct(Long id);

    @POST
    @Path("/editProductInfo")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response editProductInfo(AIOProductInfoDTO dto);
}