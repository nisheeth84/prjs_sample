/**
 *
 */
package com.viettel.erp.rest;


import com.viettel.coms.dto.ExcelErrorDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author Huy
 */
public interface IFileService {

    @POST
    @Path("/uploadATTT")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadATTT(List<Attachment> attachments, @Context HttpServletRequest request);

    @POST
    @Path("/uploadATTTInput")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadATTTInput(List<Attachment> attachments, @Context HttpServletRequest request);


    @POST
    @Path("/uploadATTT2")
//    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadATTT2(@RequestParam("multipartFile") MultipartFile multipartFile, @Context HttpServletRequest request);

    @POST
    @Path("/uploadTemp")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadTemp(List<Attachment> attachments, @Context HttpServletRequest request);


    @GET
    @Path("/downloadImport")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadFileImport(@Context HttpServletRequest request) throws Exception;


    @GET
    @Path("/downloadFileATTT")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadFileATTT(@Context HttpServletRequest request) throws Exception;

    //chinhpxn 20180608 start
    @POST
    @Path("/exportExcelError")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportExcelError(ExcelErrorDTO errorList);
    //chinhpxn 20180608 end

}
