/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.ConstructionTaskBusinessImpl;
import com.viettel.coms.business.DetailMonthPlanBusinessImpl;
import com.viettel.coms.business.DmpnOrderBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dto.*;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import viettel.passport.client.UserToken;

import javax.activation.DataHandler;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * @author HungLQ9
 */
public class DetailMonthPlanRsServiceImpl implements DetailMonthPlanRsService {

    protected final Logger log = Logger.getLogger(DetailMonthPlanRsServiceImpl.class);
    @Autowired
    DetailMonthPlanBusinessImpl detailMonthPlanBusinessImpl;
    @Autowired
    ConstructionTaskBusinessImpl constructionTaskBusinessImpl;
    @Autowired
    DmpnOrderBusinessImpl dmpnOrderBusinessImpl;
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
    @Context
    HttpServletRequest request;
    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Override
    public Response doSearch(DetailMonthPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
    	//tanqn start 20181113
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_DETAIL_MONTH_PLAN");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setDescription("Kế hoạch tháng chi tiết");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = detailMonthPlanBusinessImpl.doSearch(obj, request);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
    }

    @Override
    public Response add(DetailMonthPlanSimpleDTO obj) throws Exception {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("INSERT_DETAIL_MONTH_PLAN");
        objKpiLog.setDescription("Kế hoạch tháng chi tiết");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
//			hoanm1_20180607_start
            String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE,
                    Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request);
            List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
            if (!groupIdList.contains(obj.getSysGroupId().toString())) {
                throw new IllegalArgumentException("Bạn không có quyền tạo kế hoạch tháng chi tiết cho đơn vị này");
            }
//			hoanm1_20180607_end
            obj.setCreatedUserId(objUser.getVpsUserInfo().getSysUserId());
            obj.setStatus("1");
            obj.setCreatedDate(new Date());
            obj.setCreatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
            obj.setSignState("1");
            Long ids = detailMonthPlanBusinessImpl.add(obj, request);
            if (ids == 0l) {
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response update(DetailMonthPlanSimpleDTO obj) throws Exception {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("UPDATE_MONTH_PLAN");
        objKpiLog.setDescription("Kế hoạch tháng chi tiết");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
    	try {
//			hoanm1_20180607_start
            String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE,
                    Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request);
            List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
            if (!groupIdList.contains(obj.getSysGroupId().toString())) {
//				return Response.ok(2L).build();
                throw new IllegalArgumentException("Bạn không có quyền sửa kế hoạch tháng chi tiết cho đơn vị này");
            }
//			hoanm1_20180607_end
            obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
            obj.setStatus("1");
            obj.setUpdatedDate(new Date());
            obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
            Long ids = detailMonthPlanBusinessImpl.updateMonth(obj, request);
            if (ids == 0l) {
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response getById(Long id) throws Exception {
        // TODO Auto-generated method stub
        DetailMonthPlanSimpleDTO data = detailMonthPlanBusinessImpl.getById(id);
        return Response.ok(data).build();
    }

    @Override
    public Response getSequence() throws Exception {
        // TODO Auto-generated method stub
        Long seq = detailMonthPlanBusinessImpl.getSequence();
        return Response.ok(seq).build();
    }

    @Override
    public Response remove(DetailMonthPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
//		hoanm1_20180607_start
        try {
            String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE,
                    Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request);
            List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
            if (!groupIdList.contains(obj.getSysGroupId().toString())) {
                throw new IllegalArgumentException("Bạn không có quyền xóa kế hoạch tháng chi tiết cho đơn vị này");
            }
//		hoanm1_20180607_end
            detailMonthPlanBusinessImpl.remove(obj);
            return Response.ok().build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
//hungtd_20181213_start
    @Override
    public Response updateRegistry(DetailMonthPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
        try {
            String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE,
                    Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request);
            List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
            if (!groupIdList.contains(obj.getSysGroupId().toString())) {
                throw new IllegalArgumentException("Bạn không có quyền trình ký kế hoạch tháng chi tiết cho đơn vị này");
            }
            detailMonthPlanBusinessImpl.updateRegistry(obj);
            return Response.ok().build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
//    hungtd_2018_1213_end
    @Override
    public Response updateListTC(DetailMonthPlanSimpleDTO obj) throws Exception {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        //tanqn 20181109 start
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("updateListTC_MONTH_PLAN");
        objKpiLog.setDescription("Kế hoạch tháng chi tiết");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        objKpiLog.setStartTime(dStart);
        detailMonthPlanBusinessImpl.updateListTC(obj, objUser);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
      //tanqn 20181109 end
        return Response.ok().build();
    }

    @Override
    public Response updateListHSHC(DetailMonthPlanSimpleDTO obj) throws Exception {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        detailMonthPlanBusinessImpl.updateListHSHC(obj, objUser);
        return Response.ok().build();
    }

    @Override
    public Response updateListLDT(DetailMonthPlanSimpleDTO obj) throws Exception {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        detailMonthPlanBusinessImpl.updateListLDT(obj, objUser);
        return Response.ok().build();
    }

    @Override
    public Response updateListDT(DetailMonthPlanSimpleDTO obj) throws Exception {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        detailMonthPlanBusinessImpl.updateListDT(obj, objUser);
        return Response.ok().build();
    }

    @Override
    public Response updateListCVK(DetailMonthPlanSimpleDTO obj) throws Exception {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        detailMonthPlanBusinessImpl.updateListCVK(obj, objUser);
        return Response.ok().build();
    }

    @Override

    public Response exportTemplateListTC(SysUserDetailCOMSDTO obj) throws Exception {
        try {
            String strReturn = detailMonthPlanBusinessImpl.exportTemplateListTC(obj.getSysGroupId(), request);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override

    public Response exportTemplateListHSHC(SysUserDetailCOMSDTO obj) throws Exception {
        try {
            String strReturn = detailMonthPlanBusinessImpl.exportTemplateListHSHC(obj.getSysGroupId(), request);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override

    public Response exportTemplateListLDT(SysUserDetailCOMSDTO obj) throws Exception {
        try {
            String strReturn = detailMonthPlanBusinessImpl.exportTemplateListLDT(obj.getSysGroupId(), request);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override

    public Response exportTemplateListCVK(SysUserDetailCOMSDTO obj) throws Exception {
        try {
            String strReturn = detailMonthPlanBusinessImpl.exportTemplateListCVK(obj.getSysGroupId(), request);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response importTC(Attachment attachments, HttpServletRequest request) throws Exception {
        String filePath = writeFileToServer(attachments, request);
        try {
            try {
                return Response.ok(detailMonthPlanBusinessImpl.importTC(folderUpload + filePath, filePath)).build();
            } catch (Exception e) {
                // TODO Auto-generated catch block
            	e.printStackTrace();
                return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
            }
        } catch (IllegalArgumentException e) {
        	e.printStackTrace();
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response importHSHC(Attachment attachments, HttpServletRequest request) throws Exception {
        String filePath = writeFileToServer(attachments, request);
        try {
            try {
                return Response.ok(detailMonthPlanBusinessImpl.importHSHC(folderUpload + filePath, filePath)).build();
            } catch (Exception e) {
                // TODO Auto-generated catch block
                return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response importLDT(Attachment attachments, HttpServletRequest request) throws Exception {
        String filePath = writeFileToServer(attachments, request);
        try {
            try {
            	 long startTime = System.nanoTime();
            	 List<ConstructionTaskDetailDTO> result = detailMonthPlanBusinessImpl.importLDT(folderUpload + filePath, filePath);
            	 long endTime = System.nanoTime();
            	 System.out.println("total execution time:"+ (endTime - startTime));
                return Response.ok(result).build();
               
            } catch (Exception e) {
                // TODO Auto-generated catch block
                return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response importCVK(Attachment attachments, HttpServletRequest request) throws Exception {
        String filePath = writeFileToServer(attachments, request);
        try {
            try {
                return Response.ok(detailMonthPlanBusinessImpl.importCVK(folderUpload + filePath, filePath)).build();
            } catch (Exception e) {
                // TODO Auto-generated catch block
                return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    private String writeFileToServer(Attachment attachments, HttpServletRequest request2) {
        // TODO Auto-generated method stub
        String folderParam = UString.getSafeFileName(request.getParameter("folder"));
        if (UString.isNullOrWhitespace(folderParam)) {
            folderParam = defaultSubFolderUpload;
        } else {
            if (!isFolderAllowFolderSave(folderParam)) {
                throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
            }
        }

        DataHandler dataHandler = attachments.getDataHandler();

        // get filename to be uploaded
        MultivaluedMap<String, String> multivaluedMap = attachments.getHeaders();
        String fileName = UFile.getFileName(multivaluedMap);
        fileName = "file_loi_" + fileName;
        if (!isExtendAllowSave(fileName)) {
            throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
        }
        // write & upload file to server
        try (InputStream inputStream = dataHandler.getInputStream();) {
            return UFile.writeToFileServerATTT2(inputStream, fileName, folderParam, folderUpload);
        } catch (Exception ex) {
            throw new BusinessException("Loi khi save file", ex);
        }

    }

    private boolean isFolderAllowFolderSave(String folderDir) {
        return UString.isFolderAllowFolderSave(folderDir, allowFolderDir);
    }

    private boolean isExtendAllowSave(String fileName) {
        return UString.isExtendAllowSave(fileName, allowFileExt);
    }

    public Response getYearPlanDetailTarget(DetailMonthPlanSimpleDTO obj) throws Exception {
        // TODO Auto-generated method stub
        List<TmpnTargetDetailDTO> data = new ArrayList<TmpnTargetDetailDTO>();
        if (obj.getMonth() != null && obj.getYear() != null && obj.getSysGroupId() != null)
            data = detailMonthPlanBusinessImpl.getYearPlanDetailTarget(obj);
        return Response.ok(data).build();

    }

    public Response getWorkItemDetail(DetailMonthPlanSimpleDTO obj) throws Exception {
        // TODO Auto-generated method stub
        List<WorkItemDetailDTO> data = new ArrayList<WorkItemDetailDTO>();
        if (obj.getConstructionCode() != null)
            data = detailMonthPlanBusinessImpl.getWorkItemDetail(obj);
        return Response.ok(data).build();

    }

    @Override
    public Response doSearchConsTask(ConstructionTaskDetailDTO obj) throws Exception {
        DataListDTO data = constructionTaskBusinessImpl.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response exportTemplateListDT(SysUserDetailCOMSDTO obj) throws Exception {
        try {
            String strReturn = detailMonthPlanBusinessImpl.exportExcelTemplate("Import_dongtien_thang_chitiet.xlsx",
                    obj.getSysGroupId());
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response exportTemplateListYCVT(SysUserDetailCOMSDTO obj) throws Exception {
        try {
            UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
            String strReturn = detailMonthPlanBusinessImpl.exportExcelTemplate("Import_vattu_thang_chitiet.xlsx",
                    obj.getSysGroupId());
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response importDT(Attachment attachments, HttpServletRequest request) throws Exception {
        String filePath = writeFileToServer(attachments, request);
        try {
            try {
                return Response.ok(detailMonthPlanBusinessImpl.importDT(folderUpload + filePath, filePath)).build();
            } catch (Exception e) {
                // TODO Auto-generated catch block
                return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response doSearchMaterial(ConstructionTaskDetailDTO obj) throws Exception {
        // TODO Auto-generated method stub
        DataListDTO data = dmpnOrderBusinessImpl.doSearchForDetailMonth(obj);
        return Response.ok(data).build();

    }

    @Override
    public Response importYCVT(Attachment attachments, HttpServletRequest request) throws Exception {
        String filePath = writeFileToServer(attachments, request);
        try {
            try {
                return Response.ok(detailMonthPlanBusinessImpl.importYCVT(folderUpload + filePath, filePath)).build();
            } catch (Exception e) {
                // TODO Auto-generated catch block
                return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response updateListDmpnOrder(DetailMonthPlanSimpleDTO obj) throws Exception {
        UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
        detailMonthPlanBusinessImpl.updateListDmpnOrder(obj, objUser);
        return Response.ok().build();
    }

    @Override
    public Response exportDetailMonthPlan(DetailMonthPlanSimpleDTO obj) throws Exception {
        try {
            String strReturn = detailMonthPlanBusinessImpl.exportDetailMonthPlan(obj);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response exportDetailMonthPlanTab1(ConstructionTaskDetailDTO obj) throws Exception {
    	//tanqn 20181109 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_DETAIL_MONTH_PLAN_TAB1");
        objKpiLog.setDescription("Kế hoạch tháng chi tiết");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        objKpiLog.setStartTime(dStart);
        try {
            String strReturn = constructionTaskBusinessImpl.exportDetailMonthPlanTab1(obj);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        }//end
        return null;
    }

    @Override
    public Response exportDetailMonthPlanTab2(ConstructionTaskDetailDTO obj) throws Exception {
    	//tanqn 20181109 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_DETAIL_MONTH_PLAN_TAB2");
        objKpiLog.setDescription("Kế hoạch tháng chi tiết");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        objKpiLog.setStartTime(dStart);
        try {
            String strReturn = constructionTaskBusinessImpl.exportDetailMonthPlanTab2(obj);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        }
        return null;
    }

    @Override
    public Response exportDetailMonthPlanTab3(ConstructionTaskDetailDTO obj) throws Exception {
    	//tanqn 20181109 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_DETAIL_MONTH_PLAN_TAB3");
        objKpiLog.setDescription("Kế hoạch tháng chi tiết");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        objKpiLog.setStartTime(dStart);
        try {
            String strReturn = constructionTaskBusinessImpl.exportDetailMonthPlanTab3(obj);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        }
        return null;
    }

    @Override
    public Response exportDetailMonthPlanTab5(ConstructionTaskDetailDTO obj) throws Exception {
    	//tanqn 20181109 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_DETAIL_MONTH_PLAN_TAB5");
        objKpiLog.setDescription("Kế hoạch tháng chi tiết");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        objKpiLog.setStartTime(dStart);
        try {
            String strReturn = constructionTaskBusinessImpl.exportDetailMonthPlanTab5(obj);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        }
        return null;
    }

    @Override
    public Response exportDetailMonthPlanTab6(ConstructionTaskDetailDTO obj) throws Exception {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_DETAIL_MONTH_PLAN_TAB6");
        objKpiLog.setDescription("Kế hoạch tháng chi tiết");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        objKpiLog.setStartTime(dStart);
        try {
            String strReturn = constructionTaskBusinessImpl.exportDetailMonthPlanTab6(obj);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        }
        return null;
    }

    @Override
    public Response exportDetailMonthPlanBTS(ConstructionTaskDetailDTO obj) throws Exception {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_DETAIL_MONTH_PLAN_BTS");
        objKpiLog.setDescription("Kế hoạch tháng chi tiết");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        objKpiLog.setStartTime(dStart);
        try {
            String strReturn = dmpnOrderBusinessImpl.exportDetailMonthPlanBTS(obj);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        }
        return null;
    }

    @Override
    public Response checkPermissionsAdd() {
        try {
            // TODO Auto-generated method stub
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            return Response.ok(detailMonthPlanBusinessImpl.checkPermissionsAdd(sysGroupId, request)).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response checkPermissionsCopy() {
        try {
            // TODO Auto-generated method stub
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            return Response.ok(detailMonthPlanBusinessImpl.checkPermissionsCopy(sysGroupId, request)).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response checkPermissionsDelete(DetailMonthPlanSimpleDTO obj) {
        try {
            // TODO Auto-generated method stub
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            return Response.ok(detailMonthPlanBusinessImpl.checkPermissionsDelete(sysGroupId, request, obj)).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response checkPermissionsRegistry() {
        try {
            // TODO Auto-generated method stub
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            return Response.ok(detailMonthPlanBusinessImpl.checkPermissionsRegistry(sysGroupId, request)).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response checkPermissionsUpdate(DetailMonthPlanSimpleDTO obj) {
        try {
            // TODO Auto-generated method stub
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            Long id = detailMonthPlanBusinessImpl.checkPermissionsUpdate(sysGroupId, request, obj);
            return Response.ok(id).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
    //tanqn start 20181108
	@Override
	public Response removeRow(ConstructionTaskDTO obj) {
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        //tanqn 20181109 start
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DELETE_DETAIL_YEAR_PLAN");
        objKpiLog.setDescription("Kế hoạch tháng chi tiết");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        objKpiLog.setStartTime(new Date());
		try {
//            String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE,
//                    Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request);
//            List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
//            if (!groupIdList.contains(obj.getSysGroupId().toString())) {
//                throw new IllegalArgumentException("Bạn không có quyền xóa kế hoạch tháng chi tiết cho đơn vị này");
//            }

            detailMonthPlanBusinessImpl.removeRow(obj);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok().build();
        } catch (IllegalArgumentException e) {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)dEnd.getSeconds() - (long)dStart.getSeconds());
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
	}
	//tanqn end 20181108
}
