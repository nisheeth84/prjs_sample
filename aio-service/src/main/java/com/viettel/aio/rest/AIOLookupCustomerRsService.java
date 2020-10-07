package com.viettel.aio.rest;

import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOCustomerDTO;
import com.viettel.aio.dto.AIORequestBHSCDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public interface AIOLookupCustomerRsService {
	@POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(AIOContractDTO obj);

	@POST
    @Path("/viewDetail")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response viewDetail(Long id);


    @POST
    @Path("/doSearchContractDetail")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchContractDetail(AIOCustomerDTO obj);

    @POST
    @Path("/doSearchVTTBDetail")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchVTTBDetail(AIOCustomerDTO obj);

    @POST
    @Path("/viewDetailVTTB")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response viewDetailVTTB(AIOCustomerDTO obj);

    @POST
    @Path("/createRequestWarranty")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response createRequestWarranty(AIORequestBHSCDTO obj);
}
