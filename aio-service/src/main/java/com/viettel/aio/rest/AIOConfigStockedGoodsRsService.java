package com.viettel.aio.rest;

import com.viettel.aio.dto.AIOConfigStockedGoodsDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

//VietNT_20190530_created
public interface AIOConfigStockedGoodsRsService {

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(AIOConfigStockedGoodsDTO obj);

    @POST
    @Path("/updateConfig")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response updateConfig(AIOConfigStockedGoodsDTO obj);

    @POST
    @Path("/deleteConfig")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response deleteConfig(AIOConfigStockedGoodsDTO obj);

    @POST
    @Path("/downloadTemplate")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response downloadTemplate();

    @POST
    @Path("/importExcel")
    @Consumes({MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_JSON})
    @Produces(MediaType.APPLICATION_JSON)
    Response importExcel(Attachment attachments, @Context HttpServletRequest request) throws Exception;
}