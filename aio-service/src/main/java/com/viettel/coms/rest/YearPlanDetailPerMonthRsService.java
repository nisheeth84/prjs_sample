/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.dto.YearPlanDetailPerMonthDTO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * @author HungLQ9
 */
public interface YearPlanDetailPerMonthRsService {

    @GET
    @Path("/yearPlanDetailPerMonth")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getYearPlanDetailPerMonth();

    @GET
    @Path("/yearPlanDetailPerMonth/{id}")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getYearPlanDetailPerMonthById(@PathParam("id") Long id);

    @PUT
    @Path("/yearPlanDetailPerMonth/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateYearPlanDetailPerMonth(YearPlanDetailPerMonthDTO obj);

    @POST
    @Path("/yearPlanDetailPerMonth/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response addYearPlanDetailPerMonth(YearPlanDetailPerMonthDTO obj);

    @DELETE
    @Path("/yearPlanDetailPerMonth/{id}/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response deleteYearPlanDetailPerMonth(@PathParam("id") Long id);
}
