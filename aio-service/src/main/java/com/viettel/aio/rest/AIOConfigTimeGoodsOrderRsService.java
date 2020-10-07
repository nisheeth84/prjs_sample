package com.viettel.aio.rest;

import com.viettel.aio.dto.AIOConfigTimeGoodsOrderDTO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

//VietNT_20190604_created
public interface AIOConfigTimeGoodsOrderRsService {

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(AIOConfigTimeGoodsOrderDTO obj);

    @POST
    @Path("/saveConfig")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response saveConfig(AIOConfigTimeGoodsOrderDTO obj);
//
//    @POST
//    @Path("/addNew")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response updateConfig(AIOConfigTimeGoodsOrderDTO obj);

    @POST
    @Path("/deleteConfig")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response deleteConfig(Long id);

    @GET
    @Path("/getTempCode")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getTempCode();
}