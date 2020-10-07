package com.viettel.aio.rest;

import com.viettel.aio.dto.GoodsPriceDTO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

//VietNT_20190306_created
public interface GoodPriceRsService {

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(GoodsPriceDTO obj);

//    @GET
//    @Path("/getCatUnit")
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response getCatUnit();
//
    @POST
    @Path("/addNew")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response addNew(GoodsPriceDTO dto);


    @POST
    @Path("/submitEdit")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response submitEdit(GoodsPriceDTO dto);
//
//    @POST
//    @Path("/getDetailById")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response getDetailById(Long id);
//
//    @POST
//    @Path("/getEngineGoodsLocationList")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response getEngineGoodsLocationList();
//
//    @POST
//    @Path("/getGoodsList")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response getGoodsList(GoodsDTO dto);
//
    @POST
    @Path("/deleteGoodsPrice")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response deleteGoodsPrice(Long id);

    @POST
    @Path("/getGpById")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getGpById(Long id);
}