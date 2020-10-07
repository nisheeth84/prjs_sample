package com.viettel.aio.rest;

import com.viettel.aio.dto.*;
import com.viettel.coms.dto.SynStockDailyImportExportDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

//VietNT_20190313_created
public interface AIOContractManagerRsService {

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(AIOContractDTO obj);

    @POST
    @Path("/getDropDownData")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDropDownData();

    @POST
    @Path("/getContractDetailByContractId")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getContractDetailByContractId(Long id);

    @POST
    @Path("/doSearchCustomer")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchCustomer(AIOCustomerDTO obj);

    @POST
    @Path("/doSearchService")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchService(AIOConfigServiceDTO obj);

    @POST
    @Path("/submitAdd")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response submitAdd(AIOContractDTO obj);

    @POST
    @Path("/submitDeploy")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response submitDeploy(List<AIOContractDTO> list);

    @POST
    @Path("/getUsersInRange")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getUsersInRange(AIOContractDTO obj);

    @POST
    @Path("/getFullContractInfo")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getFullContractInfo(Long id);

    @POST
    @Path("/getListPerformer")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getListPerformer(AIOLocationUserDTO dto);

    @POST
    @Path("/exportExcel")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportExcel(AIOContractDTO dto);

    @POST
    @Path("/disableContract")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response disableContract(Long id);

    @POST
    @Path("/submitEdit")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response submitEdit(AIOContractDTO dto);

    @POST
    @Path("/getListAreaForDropDown")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getListAreaForDropDown(AIOAreaDTO criteria);

    //VietNT_20190528_start
    @GET
    @Path("/hasDeletePermission")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response hasDeletePermission();

    @POST
    @Path("/canDeleteContract")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response canDeleteContract(Long contractId);
    //VietNT_end

    //HuyPQ-start
    @POST
    @Path("/reportInvestoryProvince")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response reportInvestoryProvince(AIOMerEntityDTO obj);

    @POST
    @Path("/exportPDF")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportPDF(AIOMerEntityDTO obj) throws Exception;

    @POST
    @Path("/reportInvestoryDetail")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response reportInvestoryDetail(AIOMerEntityDTO obj);

    //Huy-end
    //VietNT_10/07/2019_start
    @GET
    @Path("/getUserSysGroupInfo")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getUserSysGroupInfo();

    //VietNT_end
    //VietNT_12/07/2019_start
    @GET
    @Path("/hasUpdatePermission")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response hasUpdatePermission();

    @POST
    @Path("/submitEditSeller")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response submitEditSeller(AIOContractDTO dto);

    //VietNT_end
    //VietNT_24/07/2019_start
    @GET
    @Path("/userHasContractUnpaidVTPost")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response userHasContractUnpaidVTPost();

    //VietNT_end
    //VietNT_29/07/2019_start
    @POST
    @Path("/doSearchApproveContract")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchApproveContract(AIOContractDTO dto);

    @POST
    @Path("/getApproveContractInfo")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getApproveContractInfo(Long id);

    @POST
    @Path("/confirmAction")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response confirmAction(AIOContractDTO dto);

    @POST
    @Path("/confirmPayment")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response confirmPayment(AIOContractDTO dto);
    //VietNT_end

    @POST
    @Path("/approvedPauseContract")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response approvedPauseContract(AIOContractPauseDTO pauseDTO);

    @POST
    @Path("/updateReasonOutOfDate")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response updateReasonOutOfDate(AIOContractDTO dto);

    @POST
    @Path("/approveCancel")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response approveCancel(AIOContractDTO dto);

    @POST
    @Path("/getListUserAC")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getListUserAC(AIOSysUserDTO dto);
}
