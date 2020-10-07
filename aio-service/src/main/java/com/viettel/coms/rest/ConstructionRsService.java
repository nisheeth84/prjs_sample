/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.dto.*;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import java.text.ParseException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import com.viettel.coms.dto.CatStationDTO;
import com.viettel.coms.dto.CommonDTO;
import com.viettel.coms.dto.ConstructionDTO;
import com.viettel.coms.dto.ConstructionDetailDTO;
import com.viettel.coms.dto.ConstructionMerchandiseDTO;
import com.viettel.coms.dto.ConstructionTaskDetailDTO;
import com.viettel.coms.dto.ObstructedDetailDTO;
import com.viettel.coms.dto.SynStockTransDTO;
import com.viettel.coms.dto.SysUserDetailCOMSDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;

/**
 * @author HungLQ9
 */
public interface ConstructionRsService {

    @POST
    @Path("/remove")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response remove(ConstructionDetailDTO obj);

    @POST
    @Path("/add")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response add(ConstructionDTO obj) throws Exception;

    @POST
    @Path("/update")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response update(ConstructionDTO obj) throws Exception;
    
    @POST
    @Path("/updateIsBuildingPermit")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateIsBuildingPermit(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/getById")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getById(Long id) throws Exception;

    @POST
    @Path("/construction/getCatConstructionType")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getCatConstructionType();

    @POST
    @Path("/construction/getCatConstructionDeploy")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getCatConstructionDeploy();

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearch(ConstructionDetailDTO obj);

    @POST
    @Path("/doSearchDSTH")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchDSTH(ConstructionDetailDTO obj);

    @POST
    @Path("/construction/getCatStation")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getCatStation(CatStationDTO obj);

    @POST
    @Path("/exportExcelHm")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportExcelHm(WorkItemDetailDTO obj) throws Exception;

    @POST
    @Path("/construction/workItem/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchWorkItem(ConstructionDetailDTO obj);

    @POST
    @Path("/construction/workItem/add")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response addWorkItem(WorkItemDetailDTO obj) throws Exception;

    @POST
    @Path("/construction/workItem/update")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateWorkItem(WorkItemDetailDTO obj) throws Exception;

    @POST
    @Path("/construction/getAppParamByType")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getAppParamByType(String type);

    @POST
    @Path("/updateVuongItem")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateVuongItem(ObstructedDetailDTO obj) throws Exception;

    @POST
    @Path("/getWorkItemType")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getWorkItemType(Long ida);

    @POST
    @Path("/updateBGMBItem")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateBGMBItem(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/updateStartItem")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateStartItem(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/updateMerchandiseItem")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateMerchandiseItem(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/updateHSHCItem")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateHSHCItem(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/updateDTItem")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateDTItem(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/updateDTItemApproved")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateDTItemApproved(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/construction/getConstructionHSHCById")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getConstructionHSHCById(ConstructionTaskDetailDTO obj) throws Exception;

    @POST
    @Path("/construction/getStockStrans")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getStockStrans(Long id);

    @POST
    @Path("/construction/saveMerchandise")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response saveMerchandise(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/confirmPkx")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response confirmPkx(SynStockTransDTO obj);

    @POST
    @Path("/detaillPhieu")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response detaillPhieu(SynStockTransDTO obj);

    @POST
    @Path("/exportExcelConstruction")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportExcelConstruction(ConstructionDetailDTO dto) throws Exception;

    @POST
    @Path("/searchMerchandise")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response searchMerchandise(ConstructionDetailDTO obj);

    // chinhpxn20180620
    @POST
    @Path("/searchMerchandiseForSave")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response searchMerchandiseForSave(ConstructionDetailDTO obj);

    // chinhpxn20180620

    @POST
    @Path("/getDataSign")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getDataSign(Long sysStockId);

    @POST
    @Path("/noSerial")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_OCTET_STREAM})
    public Response NoSerial(CommonDTO dto) throws Exception;

    @POST
    @Path("/yesSerial")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_OCTET_STREAM})
    public Response YesSerial(CommonDTO dto) throws Exception;

    @POST
    @Path("/doSearchCatTask")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getLisCatTask(WorkItemDetailDTO obj);

    @POST
    @Path("/doSearchPerformer")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchPerformer(SysUserDetailCOMSDTO obj);

    @POST
    @Path("/exportConstruction")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_OCTET_STREAM})
    public Response exportConstruction(ConstructionDetailDTO dto) throws Exception;

    @POST
    @Path("/downloadFileImportTP")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response downloadFileImportTP() throws Exception;

    @POST
    @Path("/importFileThauPhu")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importFileThauPhu(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/getconstructionStatus")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_OCTET_STREAM})
    public Response getconstructionStatus(Long id) throws Exception;

    @POST
    @Path("/saveThauPhu")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response saveThauPhu(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/getCatProvinCode")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getCatProvinCode(Long id);

    @POST
    @Path("/cancelThauPhu")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response cancelThauPhu(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/checkPermissionsApproved")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response checkPermissionsApproved(ConstructionDetailDTO obj);

    @POST
    @Path("/checkPermissionsCancel")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response checkPermissionsCancel(ConstructionDetailDTO obj);

    @POST
    @Path("/checkPermissionsUndo")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response checkPermissionsUndo(ConstructionDetailDTO obj);

    @POST
    @Path("/check")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response check(ConstructionDetailDTO obj);

    // chinhpxn 20180605 start
    @POST
    @Path("/getSysGroupInfo")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getSysGroupInfo(Long id);

    // chinhpxn 2018 20180605 end

    @POST
    @Path("/reportConstruction")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response reportConstruction(ConstructionDetailDTO obj);

    @POST
    @Path("/exportExcelConstructionReport")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportExcelConstructionReport(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/exportPDFConstructionReport")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportPDFConstructionReport(ConstructionDetailDTO criteria) throws Exception;

    // chinhpxn 20180607 start
    @POST
    @Path("/importWorkItem")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importWorkItem(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @GET
    @Path("/downloadFile")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadFile(@Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/importConstruction")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importConstruction(Attachment attachments, @Context HttpServletRequest request) throws Exception;
    
    //Huypq-20181010-start
    @POST
    @Path("/importConstructionGPXD")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importConstructionGPXD(Attachment attachments, @Context HttpServletRequest request) throws Exception;
    //Huypq-20181010-end
    @GET
    @Path("/downloadFileForConstruction")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadFileForConstruction(@Context HttpServletRequest request) throws Exception;

    // chinhpxn 20180607 end
    //Huypq-20181010-start
    
    @POST
    @Path("/readFileConstruction")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    Response readFileConstruction(Attachment attachments, @Context HttpServletRequest request);
    
    @POST
    @Path("/getCheckCodeList")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getCheckCodeList(ConstructionDetailDTO obj);
    
    //TungTT24/1/2019 start
    @POST
    @Path("/getDataUpdate")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getDataUpdate(ConstructionDTO obj);
  //TungTT24/1/2019 end
    @GET
    @Path("/downloadFileForConstructionGPXD")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadFileForConstructionGPXD(@Context HttpServletRequest request) throws Exception;
    //Huypq-20181010-end
    @POST
    @Path("/checkPermissions")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response checkPermissions(ConstructionDetailDTO obj);

    @POST
    @Path("/checkAdd")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response checkAdd(ConstructionDetailDTO obj);

    @POST
    @Path("/readFileStationReport")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    Response readFileStationReport(Attachment attachments, @Context HttpServletRequest request);

    @POST
    @Path("/doSearchTTTDCT")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchTTTDCT(ConstructionDetailDTO obj);

    @POST
    @Path("/updateDayHshc")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateDayHshc(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/getStationForAutoComplete")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getStationForAutoComplete(CatStationDTO cons);

    @POST
    @Path("/updateConstrLicence")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	Response updateConstrLicence(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/updateConstrDesign")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	Response updateConstrDesign(ConstructionDetailDTO obj) throws Exception;
    
    
    @POST
    @Path("/UpdateConstructionTask")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response UpdateConstructionTask(ConstructionDTO obj) throws ParseException;

    //VietNT_20181207_start
    @POST
    @Path("/getStationHouseForAutoComplete")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getStationHouseForAutoComplete(CatStationDTO cons);

    @POST
    @Path("/getStationByStationHouseIdForAutoComplete")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getStationByStationHouseIdForAutoComplete(CatStationDTO cons);
    //VietNT_end
    //HuyPQ-start
    @POST
    @Path("/doSearchAcceptance")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchAcceptance(ConstructionDetailDTO obj);
    
    @POST
    @Path("/construction/listDataDSVTA")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response listDataDSA(ConstructionDetailDTO obj);
    
    @POST
    @Path("/getWorkItemByMerchandise")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getWorkItemByMerchandise(ConstructionDetailDTO obj);
    
    @POST
    @Path("/getWorkItemByMerchandiseB")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getWorkItemByMerchandiseB(ConstructionDetailDTO obj);
    
    @POST
    @Path("/getDataNotIn")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getDataNotIn(ConstructionDetailDTO obj);
    
    @POST
    @Path("/updateWorkItemMerchan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateWorkItemMerchan(List<ConstructionMerchandiseDTO> obj) throws Exception;
    
    @POST
    @Path("/updateConstructionAcceptance")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Long updateConstructionAcceptance(ConstructionDetailDTO obj);
    
    @POST
    @Path("/deleteConstructionMerchanse")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public void deleteConstructionMerchanse(ConstructionDetailDTO obj);
    
    @POST
    @Path("/updateWorkItemMerchanB")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateWorkItemMerchanB(List<ConstructionMerchandiseDTO> obj) throws Exception;
    
    @POST
    @Path("/getSynStockTransBySerial")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getSynStockTransBySerial(ConstructionDetailDTO obj);
    
    @POST
    @Path("/getWorkItemByConsId")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getWorkItemByConsId(ConstructionDetailDTO obj);
    
    @POST
    @Path("/getConstructionAcceptanceByConsId")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getConstructionAcceptanceByConsId(ConstructionDetailDTO obj);
    
    @POST
    @Path("/getConstructionAcceptanceByConsIdTBB")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getConstructionAcceptanceByConsIdTBB(ConstructionDetailDTO obj);
    
//    @POST
//    @Path("/getDataMerByGoodsId")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    public Response getDataMerByGoodsId(ConstructionDetailDTO obj);
//    
	@POST
    @Path("/getConstructionAcceptanceByConsIdCheck")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getConstructionAcceptanceByConsIdCheck(ConstructionDetailDTO obj);

    @POST
    @Path("/getSysGroupCheck")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getSysGroupCheck(DepartmentDTO obj);
    //HuyPQ-end
}