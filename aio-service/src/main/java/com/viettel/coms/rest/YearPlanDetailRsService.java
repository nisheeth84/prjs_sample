/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.dto.ReportPlanDTO;
import com.viettel.coms.dto.YearPlanDetailDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * @author HungLQ9
 */
public interface YearPlanDetailRsService {

    @GET
    @Path("/yearPlanDetail")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getYearPlanDetail();

    @GET
    @Path("/yearPlanDetail/{id}")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getYearPlanDetailById(@PathParam("id") Long id);

    @PUT
    @Path("/yearPlanDetail/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateYearPlanDetail(YearPlanDetailDTO obj);

    @POST
    @Path("/yearPlanDetail/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response addYearPlanDetail(YearPlanDetailDTO obj);

    @DELETE
    @Path("/yearPlanDetail/{id}/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response deleteYearPlanDetail(@PathParam("id") Long id);

    @POST
    @Path("/yearPlanDetail/importYearPlanDetail")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importYearPlanDetail(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/yearPlanDetail/reportProgress")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response reportProgress(ReportPlanDTO obj);

    @POST
    @Path("/exportYearPlanProgress")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportYearPlanProgress(ReportPlanDTO obj) throws Exception;

    @POST
    @Path("/rpYearProgress")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_OCTET_STREAM})
    public Response rpYearProgress(ReportPlanDTO dto) throws Exception;
}
