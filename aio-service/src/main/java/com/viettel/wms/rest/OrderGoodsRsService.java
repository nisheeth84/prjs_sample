/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.wms.rest;

import com.viettel.wms.dto.GoodsDTO;
import com.viettel.wms.dto.OrderGoodsDTO;
import com.viettel.wms.dto.OrderGoodsDetailDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public interface OrderGoodsRsService {

    @GET
    @Path("/orderGoods")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getOrderGoods();

    @GET
    @Path("/orderGoods/{id}")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getOrderGoodsById(@PathParam("id") Long id);

    @PUT
    @Path("/orderGoods/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateOrderGoods(OrderGoodsDTO obj);

    @POST
    @Path("/orderGoods/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response addOrderGoods(OrderGoodsDTO obj);

    @POST
    @Path("/orderGoods/deleteorderGood")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response deleteOrderGoods(Long id);

    @POST
    @Path("/orderGoods/doSearchGoodsForImportReq")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchGoodsForImportReq(OrderGoodsDTO obj);

    @POST
    @Path("/orderGoods/importCells/{orderId}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importCells(Attachment attachments, @Context HttpServletRequest request, @PathParam("orderId") Long id) throws Exception;


    @POST
    @Path("/orderGoods/saveGoods")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response saveGoods(List<OrderGoodsDTO> orderGoods) throws Exception;


    @POST
    @Path("/orderGoods/importGoods")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importGoods(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/orderGoods/importOrderGood")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importOrderGood(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/orderGoods/doSearchGoodsForExportOrder")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchGoodsForExportOrder(OrderGoodsDTO obj);

    @POST
    @Path("/orderGoods/getForAutoComplete")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getForAutoComplete(GoodsDTO obj);

    @POST
    @Path("/orderGoods/getGoodsDetailByOrderId")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getGoodDetail(Long orderId);

    @POST
    @Path("/orderGoods/exportExcelError")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportExcelError(OrderGoodsDetailDTO errorObj);

    @POST
    @Path("/orderGoods/exportExcelTemplate")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportExcelTemplate(OrderGoodsDTO obj) throws Exception;
}
