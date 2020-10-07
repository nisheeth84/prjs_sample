package com.viettel.aio.rest;
import com.viettel.aio.dto.*;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

public interface AIOReglectRsService {

	@POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(AIOReglectDTO obj);

    @POST
    @Path("/getReglectDetail")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getReglectDetail(Long id);

    @POST
    @Path("/getListContractCustomer")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getListContractCustomer(Long idCustomer);

    @POST
    @Path("/submitAdd")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response submitAdd(AIOReglectDTO obj);

    @POST
    @Path("/updatePerformer")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response updatePerformer(AIOReglectDetailDTO obj);

    @GET
    @Path("/getDataAddForm")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDataAddForm();

    @POST
    @Path("/getListCustomer")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getListCustomer(AIOCustomerDTO dto);
}
