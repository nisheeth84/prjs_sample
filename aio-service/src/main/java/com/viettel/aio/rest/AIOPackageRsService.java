package com.viettel.aio.rest;

import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOPackageDTO;
import com.viettel.aio.dto.AIOPackageDetailPriceDTO;
import com.viettel.aio.dto.AIOPackageRequest;
import com.viettel.coms.dto.GoodsDTO;
import com.viettel.coms.dto.RequestGoodsDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

//VietNT_20190306_created
public interface AIOPackageRsService {

    @POST
    @Path("/doSearchPackage")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchPackage(AIOPackageDTO obj);

    @GET
    @Path("/getCatUnit")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getCatUnit();

    @POST
    @Path("/addNewPackage")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response addNewPackage(AIOPackageRequest dto);

    @POST
    @Path("/updatePackage")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response updatePackage(AIOPackageRequest dto);

    @POST
    @Path("/getDetailById")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDetailById(Long id);

    @POST
    @Path("/getEngineGoodsLocationList")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getEngineGoodsLocationList();

    @POST
    @Path("/getGoodsList")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getGoodsList(GoodsDTO dto);

    @POST
    @Path("/deletePackage")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response deletePackage(Long id);

    @POST
    @Path("/readFilePackagePrice")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    Response readFilePackagePrice(Attachment attachments);

    @POST
    @Path("/downloadTemplatePackagePrice")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response downloadTemplatePackagePrice(List<AIOPackageDetailPriceDTO> dtos);

    @POST
    @Path("/getListService")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getListService(AIOConfigServiceDTO criteria);
    //VietNT_09/07/2019_start
    @POST
    @Path("/downloadTemplatePackagePriceProvince")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response downloadTemplatePackagePriceProvince(List<AIOPackageDetailPriceDTO> dtos);

    @POST
    @Path("/downloadTemplatePackagePriceCompany")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response downloadTemplatePackagePriceCompany(List<AIOPackageDetailPriceDTO> dtos);

    @POST
    @Path("/readFilePackagePriceProvince")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    Response readFilePackagePriceProvince(Attachment attachments);

    @POST
    @Path("/readFilePackagePriceCompany")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    Response readFilePackagePriceCompany(Attachment attachments);
    //VietNT_end

    @GET
    @Path("/getPermissionCreatePackage")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getPermissionCreatePackage();
}
