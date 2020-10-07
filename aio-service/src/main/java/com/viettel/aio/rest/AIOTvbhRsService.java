package com.viettel.aio.rest;

import com.viettel.aio.dto.AIOCategoryProductDTO;
import com.viettel.aio.dto.AIOLocationUserDTO;
import com.viettel.aio.dto.AIOProductInfoDTO;
import com.viettel.aio.dto.AIORequestBHSCDTO;

import java.util.List;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public interface AIOTvbhRsService {
    @POST
    @Path("/getCategory")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getCategory();
    
    @POST
    @Path("/doSearchProductInfo")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchProductInfo(AIOProductInfoDTO aioProductInfoDTO);
    
    @POST
    @Path("/getProductByCategory")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getProductByCategory(AIOProductInfoDTO aioProductInfoDTO);
    
    @POST
    @Path("/getDaiGia")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDaiGia(AIOCategoryProductDTO aioProductInfoDTO);
    
    @POST
    @Path("/getProductById")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getProductById(AIOProductInfoDTO aioProductInfoDTO);
    
    
    @POST
    @Path("/getHightLightProduct")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getHightLightProduct(AIOProductInfoDTO aioProductInfoDTO);
    
    @POST
    @Path("/getListImage")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getListImage(List<Long> listId);
    
    @POST
	@Path("/autoSearchProduct")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response autoSearchProduct(String code);

}
