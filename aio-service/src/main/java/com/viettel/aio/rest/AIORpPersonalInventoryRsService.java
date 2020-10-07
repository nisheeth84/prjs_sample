package com.viettel.aio.rest;

import com.viettel.coms.dto.MerEntitySimpleDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

//VietNT_20190320_created
public interface AIORpPersonalInventoryRsService {

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchPackage(MerEntitySimpleDTO obj);

    @POST
    @Path("/exportExcel")
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    Response exportHandoverNV(MerEntitySimpleDTO dto);
}