/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.erp.rest;

import com.viettel.erp.dto.ConstructionAcceptanceDTO;
import com.viettel.erp.dto.EstimatesWorkItemsDTO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public interface ConstructionAcceptanceRsService {

    @GET
    @Path("/constructionAcceptance")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getConstructionAcceptance();

    @GET
    @Path("/constructionAcceptance/findByConstructId/{id}")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response findByConstructId(@PathParam("id") Long constructId);

    @GET
    @Path("/constructionAcceptance/{id}")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getConstructionAcceptanceById(@PathParam("id") Long id);

    @POST
    @Path("/constructionAcceptance/put/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateConstructionAcceptance(ConstructionAcceptanceDTO obj);

    @POST
    @Path("/constructionAcceptance/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response addConstructionAcceptance(ConstructionAcceptanceDTO obj) throws Exception;

    @POST
    @Path("/constructionAcceptance/addFileCalculate")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response addFileCalculate(ConstructionAcceptanceDTO obj) throws Exception;

    @DELETE
    @Path("/constructionAcceptance/{id}/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response deleteConstructionAcceptance(@PathParam("id") Long id) throws Exception;

    @POST
    @Path("/constructionAcceptance/getWorkItem/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getWorkItem(EstimatesWorkItemsDTO obj);


    @POST
    @Path("/constructionAcceptance/exportFile")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportFileConstructionAcceptance(Long id) throws Exception;

    @POST
    @Path("/constructionAcceptance/exportFiledoc")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportFileDocConstructionAcceptance(Long id) throws Exception;

    @POST
    @Path("/constructionAcceptance/exportPdfList")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportFiledoc(List<Long> data);

    @POST
    @Path("/constructionAcceptance/exportWordList")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportListConstructionAcceptance(List<Long> data);

    @POST
    @Path("/constructionAcceptance/byConstruct")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getConstructionAcceptancebyConstruct(ConstructionAcceptanceDTO obj);


    @POST
    @Path("/constructionAcceptance/CheckCA")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response CheckCA(ConstructionAcceptanceDTO obj);

    @POST
    @Path("/constructionAcceptance/updateIsActive")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateIsActive(Long constrAcceptanceId);

    @GET
    @Path("/constructionAcceptance/folder")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getFolder();


}
