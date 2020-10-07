package com.viettel.aio.rest;

import com.viettel.aio.dto.WorkItemTypeHCQTDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * @author HIENVD
 */

public interface WorkItemTypeHCQTRsService {

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(WorkItemTypeHCQTDTO obj);

    @POST
    @Path("/getForAutoComplete")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response findByAutoComplete(WorkItemTypeHCQTDTO obj);

    @POST
    @Path("/doSearchWorkItemType")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchWorkItemType(WorkItemTypeHCQTDTO obj);

    @POST
    @Path("/saveWorkItemType")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response saveWorkItemType(WorkItemTypeHCQTDTO obj);

    @POST
    @Path("/updateWorkItemType")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response updateWorkItemType(WorkItemTypeHCQTDTO obj);

    @POST
    @Path("/deleteWorkItemType")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response deleteWorkItemType(WorkItemTypeHCQTDTO obj);

    @POST
    @Path("/getAutoCompleteWorkItemType")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getAutoCompleteWorkItemType(WorkItemTypeHCQTDTO obj);

    @POST
    @Path("/checkValidateWorkItemType")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response checkValidateWorkItemType(WorkItemTypeHCQTDTO obj);

    @GET
    @Path("/downloadFile")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    Response downloadFile(@Context HttpServletRequest request)
            throws Exception;

    @POST
    @Path("/importWorkItemTypeHCQT")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    Response importWorkItemTypeHCQT(Attachment attachments, @Context HttpServletRequest request) throws Exception;
}
