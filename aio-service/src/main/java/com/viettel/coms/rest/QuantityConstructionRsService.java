package com.viettel.coms.rest;

import com.viettel.coms.dto.WorkItemDetailDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

public interface QuantityConstructionRsService {
    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearch(WorkItemDetailDTO obj);

    @POST
    @Path("/approveQuantityByDay")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response approveQuantityByDay(WorkItemDetailDTO obj);

    @POST
    @Path("/cancelApproveQuantityByDay")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response cancelApproveQuantityByDay(WorkItemDetailDTO obj);

    @POST
    @Path("/approveQuantityDayChecked")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response approveQuantityDayChecked(List<WorkItemDetailDTO> lstObj);

    @POST
    @Path("/exportConstructionTaskDaily")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportConstructionTaskDaily(WorkItemDetailDTO obj) throws Exception;

    @POST
    @Path("/checkPermissionsApproved")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response checkPermissionsApproved(WorkItemDetailDTO obj);

    @POST
    @Path("/checkPermissionsCancelConfirm")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response checkPermissionsCancelConfirm(WorkItemDetailDTO obj);

    @POST
    @Path("/getListImage")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getListImage(WorkItemDetailDTO obj) throws Exception;

    @POST
    @Path("/rejectQuantityByDay")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response rejectQuantityByDay(WorkItemDetailDTO obj);

    @POST
    @Path("/validPriceConstruction")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response validPriceConstruction(WorkItemDetailDTO obj);

    @POST
    @Path("/getDetailTaskDaily")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDetailTaskDaily(WorkItemDetailDTO obj);
}
