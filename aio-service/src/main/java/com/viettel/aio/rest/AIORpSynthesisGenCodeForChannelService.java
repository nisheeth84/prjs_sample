package com.viettel.aio.rest;

import com.viettel.aio.dto.AIORpSynthesisGenCodeForChannelDTO;
import com.viettel.coms.dto.MerEntitySimpleDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public interface AIORpSynthesisGenCodeForChannelService {

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(AIORpSynthesisGenCodeForChannelDTO obj);

    @POST
    @Path("/exportExcel")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportExcel(AIORpSynthesisGenCodeForChannelDTO dto);
}