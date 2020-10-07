package com.viettel.coms.rest;

import com.viettel.coms.dto.ConstructionDetailDTO;
import com.viettel.coms.dto.RequestGoodsDTO;
import com.viettel.coms.dto.RequestGoodsDetailDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

//VietNT_20190104_created
public interface RequestGoodsRsService {

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(RequestGoodsDTO obj);

    @POST
    @Path("/searchConstruction")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response searchConstruction(ConstructionDetailDTO obj);

    @POST
    @Path("/doSearchDetail")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchDetail(RequestGoodsDetailDTO obj);

    @GET
    @Path("/getCatUnit")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getCatUnit();

    @POST
    @Path("/addNewRequestGoods")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response addNewRequestGoods(RequestGoodsDTO dto);

    @POST
    @Path("/doRequestGoods")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doRequestGoods(List<Long> requestIds);

    @POST
    @Path("/importExcel")
    @Consumes({MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_JSON})
    @Produces(MediaType.APPLICATION_JSON)
    Response importExcel(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/importExcelDetail")
    @Consumes({MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_JSON})
    @Produces(MediaType.APPLICATION_JSON)
    Response importExcelDetail(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/downloadTemplate")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response downloadTemplate(long templateDetail) throws Exception;

    @POST
    @Path("/editRequestGoods")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response editRequestGoods(RequestGoodsDTO dto) throws Exception;

    @POST
    @Path("/getDetailsById")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDetailsById(Long requestGoodsId) throws Exception;

    @POST
    @Path("/deleteRequest")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response deleteRequest(Long requestGoodsId) throws Exception;
}