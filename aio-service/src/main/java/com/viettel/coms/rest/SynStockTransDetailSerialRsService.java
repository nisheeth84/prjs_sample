/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.dto.SynStockTransDetailSerialDTO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * @author HungLQ9
 */
public interface SynStockTransDetailSerialRsService {

    @GET
    @Path("/synStockTransDetailSerial")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getSynStockTransDetailSerial();

    @GET
    @Path("/synStockTransDetailSerial/{id}")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getSynStockTransDetailSerialById(@PathParam("id") Long id);

    @PUT
    @Path("/synStockTransDetailSerial/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateSynStockTransDetailSerial(SynStockTransDetailSerialDTO obj);

    @POST
    @Path("/synStockTransDetailSerial/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response addSynStockTransDetailSerial(SynStockTransDetailSerialDTO obj);

    @DELETE
    @Path("/synStockTransDetailSerial/{id}/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response deleteSynStockTransDetailSerial(@PathParam("id") Long id);
}
