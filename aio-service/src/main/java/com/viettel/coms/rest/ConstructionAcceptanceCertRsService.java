/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.dto.ConstructionAcceptanceCertDTO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * @author HungLQ9
 */
public interface ConstructionAcceptanceCertRsService {

    @GET
    @Path("/constructionAcceptanceCert")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getConstructionAcceptanceCert();

    @GET
    @Path("/constructionAcceptanceCert/{id}")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getConstructionAcceptanceCertById(@PathParam("id") Long id);

    @PUT
    @Path("/constructionAcceptanceCert/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateConstructionAcceptanceCert(ConstructionAcceptanceCertDTO obj);

    @POST
    @Path("/constructionAcceptanceCert/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response addConstructionAcceptanceCert(ConstructionAcceptanceCertDTO obj);

    @DELETE
    @Path("/constructionAcceptanceCert/{id}/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response deleteConstructionAcceptanceCert(@PathParam("id") Long id);
}
