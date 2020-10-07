/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.erp.rest;

import com.viettel.erp.dto.AMaterialHandoverDTO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/*import com.viettel.erp.dto.BienBanBanGiaoAcapDTO;*/

/**
 * @author HungLQ9
 */
public interface AMaterialHandoverRsService {

    @POST
    @Path("/getThoiGianBanGiao/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getThoiGianBanGiao(AMaterialHandoverDTO dto);

    @POST
    @Path("/export/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response export(AMaterialHandoverDTO data);

    @POST
    @Path("/exportDoc/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportDoc(AMaterialHandoverDTO data);

    @POST
    @Path("/exportList/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportList(List<Long> data);

    @POST
    @Path("/exportListDoc/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportListDoc(List<Long> data);


    @POST
    @Path("/addListAMaterial/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response addListAMaterial(List<AMaterialHandoverDTO> listBTVT);


    @POST
    @Path("/deleteAMaterial/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response deleteAMaterialHandoverByCode(List<String> listCode);

    @POST
    @Path("/listMaterial/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getAMaterialHandoverByCongTrinh(AMaterialHandoverDTO obj);

    @GET
    @Path("/aMaterialHandover")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getAMaterialHandover();

    @GET
    @Path("/aMaterialHandover/{id}")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getAMaterialHandoverById(@PathParam("id") Long id);

    @POST
    @Path("/aMaterialHandover/put/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateAMaterialHandover(AMaterialHandoverDTO obj);

    @POST
    @Path("/aMaterialHandover/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response addAMaterialHandover(AMaterialHandoverDTO obj);

    @DELETE
    @Path("/aMaterialHandover/{id}/")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response deleteAMaterialHandover(@PathParam("id") Long id);

    @POST
    @Path("/aMaterialHandover/getAmaterialhandoverforcontruction")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getAmaterialhandoverforcontruction(AMaterialHandoverDTO obj);


}
