package com.viettel.aio.rest;

import com.viettel.aio.dto.WorkItemHCQTDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * @author HIENVD
 */

public interface WorkItemHCQTRsService {

//    //hienvd: Start 8/7/2019
    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(WorkItemHCQTDTO criteria);

    @POST
    @Path("/getForAutoComplete")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response findByAutoComplete(WorkItemHCQTDTO obj);

//    @POST
//    @Path("/doSearchWorkItem")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response doSearchWorkItem(WorkItemHCQTDTO obj);
//
//    @POST
//    @Path("/saveWorkItem")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response saveWorkItem(WorkItemHCQTDTO obj);
//
//    @POST
//    @Path("/updateWorkItem")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response updateWorkItem(WorkItemHCQTDTO obj);
//
//    @POST
//    @Path("/deleteWorkItem")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response deleteWorkItem(WorkItemHCQTDTO obj);
//
//    @POST
//    @Path("/getAutoCompleteWorkItem")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response getAutoCompleteWorkItem(WorkItemHCQTDTO obj);
//
//    @POST
//    @Path("/checkWorkItemExit")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response checkWorkItemExit(WorkItemHCQTDTO obj);
//
//    @GET
//    @Path("/downloadFile")
//    @Produces(MediaType.APPLICATION_OCTET_STREAM)
//    Response downloadFile(@Context HttpServletRequest request)
//            throws Exception;
//
//    @POST
//    @Path("/importWorkItemHCQT")
//    @Consumes(MediaType.MULTIPART_FORM_DATA)
//    @Produces(MediaType.APPLICATION_JSON)
//    Response importWorkItemHCQT(Attachment attachments, @Context HttpServletRequest request) throws Exception;
//
//    //Huypq-20190827-start
//    @POST
//    @Path("/exportWorkItemTypeHCQT")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response exportWorkItemTypeHCQT(WorkItemHCQTDTO obj) throws Exception;
//    //Huy-end
}
