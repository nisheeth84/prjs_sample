package com.viettel.aio.rest;

import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOErrorDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public interface AIOErrorCommonRsService {
    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(AIOErrorDTO obj);

    @POST
    @Path("/saveErrorCommon")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response saveErrorCommon(AIOErrorDTO obj);

    @POST
    @Path("/getErrorCommonById")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getErrorCommonById(Long id);

    @POST
    @Path("/updateErrorCommon")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response updateCategoryProduct(AIOErrorDTO obj);

//    @POST
//    @Path("/getAutoCompleteData")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response getAutoCompleteData(AIOConfigServiceDTO dto);

    @POST
    @Path("/removeErrorCommon")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response removeErrorCommon(AIOErrorDTO dto);

    @POST
    @Path("/approveErrorCommon")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response approveErrorCommon(AIOErrorDTO obj);

    @POST
    @Path("/getForAutoCompleteConfigService")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getForAutoCompleteConfigService(AIOConfigServiceDTO obj);

    @GET
    @Path("/getDropDownData")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDropDownData();

    @GET
    @Path("/hasPermissionManageError")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response hasPermissionManageError();
}
