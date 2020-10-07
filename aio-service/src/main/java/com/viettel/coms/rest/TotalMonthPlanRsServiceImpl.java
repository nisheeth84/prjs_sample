/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.TotalMonthPlanBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dto.*;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import javax.activation.DataHandler;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import java.io.InputStream;
import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * @author HungLQ9
 */
public class TotalMonthPlanRsServiceImpl implements TotalMonthPlanRsService {

    protected final Logger log = Logger.getLogger(TotalMonthPlanRsServiceImpl.class);
    @Autowired
    TotalMonthPlanBusinessImpl totalMonthPlanBusinessImpl;
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
    public Response doSearch(TotalMonthPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
    	//tanstart 20181112 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_MONTH_TOTAL_PLAN");
        objKpiLog.setDescription("Kế hoạch tháng tổng thể");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = totalMonthPlanBusinessImpl.doSearch(obj);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
    }

    @Override
    public Response add(TotalMonthPlanSimpleDTO obj) throws Exception {
    	//tanstart 20181112 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("INSERT_MONTH_TOTAL_PLAN");
        objKpiLog.setDescription("Kế hoạch tháng tổng thể");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            obj.setCreatedUserId(objUser.getVpsUserInfo().getSysUserId());
            obj.setStatus("1");
            obj.setCreatedDate(new Date());
            obj.setCreatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
            obj.setCreatedUserId(objUser.getVpsUserInfo().getSysUserId());
            obj.setSignState("1");
            Long ids = totalMonthPlanBusinessImpl.add(obj, objUser.getVpsUserInfo().getFullName(),
                    objUser.getVpsUserInfo().getSysUserId(), request);
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
//end 20181112 by tanqn
    @Override
    public Response update(TotalMonthPlanSimpleDTO obj) throws Exception {
        //tanstart 20181112 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("UPDATE_MONTH_TOTAL_PLAN");
        objKpiLog.setDescription("Kế hoạch tháng tổng thể");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
            obj.setStatus("1");
            obj.setUpdatedDate(new Date());
            obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
            Long ids = totalMonthPlanBusinessImpl.updateMonth(obj, objUser.getVpsUserInfo().getFullName(), request);
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
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
//tanqn 20181112 end
    @Override
    public Response getById(Long id) throws Exception {
        // TODO Auto-generated method stub
        TotalMonthPlanSimpleDTO data = totalMonthPlanBusinessImpl.getById(id);
        return Response.ok(data).build();
    }

    @Override
    public Response getByIdCopy(Long id) throws Exception {
        // TODO Auto-generated method stub
        TotalMonthPlanSimpleDTO data = totalMonthPlanBusinessImpl.getByIdCopy(id);
        return Response.ok(data).build();
    }

    @Override
    public Response getSequence() throws Exception {
        // TODO Auto-generated method stub
        Long seq = totalMonthPlanBusinessImpl.getSequence();
        return Response.ok(seq).build();
    }

    @Override
    public Response remove(TotalMonthPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
        try {
            totalMonthPlanBusinessImpl.remove(obj, request);
            return Response.ok().build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
//    hungtd_20181213_start
    @Override
    public Response updateRegistry(TotalMonthPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
        try {
            totalMonthPlanBusinessImpl.updateRegistry(obj, request);
            return Response.ok().build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
//    hungtd_20181213_end
    

    @Override
    public Response exportExcelTemplateTarget() throws Exception {
        // TODO Auto-generated method stub
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportExcelTemplate("Import_Chitieu_thang_tongthe.xlsx");
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response exportExcelTemplateSource() throws Exception {
        // TODO Auto-generated method stub
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportExcelTemplate("Import_nguonviec_thang_tongthe.xlsx");
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response exportExcelTemplateForceMaintain() throws Exception {
        // TODO Auto-generated method stub
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportExcelTemplate("Import_giaco_thang_tongthe.xlsx");
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response exportExcelTemplateForceNewBts() throws Exception {
        // TODO Auto-generated method stub
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportExcelTemplate("Import_bts_thang_tongthe.xlsx");
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response exportExcelTemplateForceNewLine() throws Exception {
        // TODO Auto-generated method stub
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportExcelTemplate("Import_ngamhoa_thang_tongthe.xlsx");
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response exportExcelTemplateMaterial() throws Exception {
        // TODO Auto-generated method stub
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportExcelTemplate("Import_vattu_thang_tongthe.xlsx");
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response exportExcelTemplateFinance() throws Exception {
        // TODO Auto-generated method stub
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportExcelTemplate("Import_taichinh_thang_tongthe.xlsx");
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response exportExcelTemplateContract() throws Exception {
        // TODO Auto-generated method stub
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportExcelTemplate("Import_hopdong_thang_tongthe.xlsx");
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response importTarget(Attachment attachments, HttpServletRequest request) throws Exception {

        // TODO Auto-generated method stub
        String filePath = writeFileToServer(attachments, request);
        try {

            try {

                return Response.ok(totalMonthPlanBusinessImpl.importTarget(folderUpload + filePath, filePath)).build();
            } catch (Exception e) {
                // TODO Auto-generated catch block
                return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
            }

        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }

    }

    private boolean isExtendAllowSave(String fileName) {
        return UString.isExtendAllowSave(fileName, allowFileExt);
    }

    private boolean isFolderAllowFolderSave(String folderDir) {
        return UString.isFolderAllowFolderSave(folderDir, allowFolderDir);
    }

    @Override
    public Response fillterAllActiveCatConstructionType(TotalMonthPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
        List<TotalMonthPlanSimpleDTO> data = totalMonthPlanBusinessImpl.fillterAllActiveCatConstructionType(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response fillterAllActiveCatConstructionDeploy(TotalMonthPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
        List<TotalMonthPlanSimpleDTO> data = totalMonthPlanBusinessImpl.fillterAllActiveCatConstructionDeploy(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response saveTarget(TotalMonthPlanSimpleDTO obj) throws Exception {
    	//tan start 20181112
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("Target_INSERT_MONTH_PLAN");
        objKpiLog.setDescription("Kế hoạch tháng tổng thể");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
        	totalMonthPlanBusinessImpl.saveTarget(obj);
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
        	e.printStackTrace();
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response saveSource(TotalMonthPlanSimpleDTO obj) throws Exception {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("Source_INSERT_MONTH_TOTAL_PLAN");
        objKpiLog.setDescription("Kế hoạch tháng tổng thể");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            totalMonthPlanBusinessImpl.saveSource(obj);
            return Response.ok(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
        	e.printStackTrace();
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response saveContract(TotalMonthPlanSimpleDTO obj) throws Exception {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("Contract_INSERT_MONTH_TOTAL_PLAN");
        objKpiLog.setDescription("Kế hoạch tháng tổng thể");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            totalMonthPlanBusinessImpl.saveContract(obj);
            return Response.ok(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
        	
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                objKpiLog.setReason(e.toString());
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response saveFinance(TotalMonthPlanSimpleDTO obj) throws Exception {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("Finace_INSERT_MONTH_TOTAL_PLAN");
        objKpiLog.setDescription("Kế hoạch tháng tổng thể");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            totalMonthPlanBusinessImpl.saveFinance(obj);
            return Response.ok(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response saveMaterial(TotalMonthPlanSimpleDTO obj) throws Exception {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("Material_INSERT_MONTH_TOTAL_PLAN");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setDescription("Kế hoạch tháng tổng thể");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            totalMonthPlanBusinessImpl.saveMaterial(obj);
            return Response.ok(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response saveForceNewBTS(TotalMonthPlanSimpleDTO obj) throws Exception {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("ForceNewBTS_INSERT_MONTH_TOTAL_PLAN");
        objKpiLog.setDescription("Kế hoạch tháng tổng thể");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            totalMonthPlanBusinessImpl.saveForceNewBTS(obj);
            return Response.ok(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response saveForceNew(TotalMonthPlanSimpleDTO obj) throws Exception {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("ForceNew_INSERT_MONTH_TOTAL_PLAN");
        obj.setDescription("Kế hoạch tháng tổng thể");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            totalMonthPlanBusinessImpl.saveForceNew(obj);
            return Response.ok(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response saveForceMaintain(TotalMonthPlanSimpleDTO obj) throws Exception {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("ForceMaintain_INSERT_MONTH_PLAN");
        objKpiLog.setDescription("Kế hoạch tháng tổng thể");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            totalMonthPlanBusinessImpl.saveForceMaintain(obj);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
//tanqn 20181112 end
    @Override
    public Response importSource(Attachment attachments, HttpServletRequest request) throws Exception {

        // TODO Auto-generated method stub

        String filePath = writeFileToServer(attachments, request);
        try {
            try {

                return Response.ok(totalMonthPlanBusinessImpl.importSource(folderUpload + filePath, filePath)).build();
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

    @Override
    public Response importForceMaintain(Attachment attachments, HttpServletRequest request) throws Exception {

        // TODO Auto-generated method stub

        String filePath = writeFileToServer(attachments, request);
        try {
            try {

                return Response.ok(totalMonthPlanBusinessImpl.importForceMaintain(folderUpload + filePath, filePath))
                        .build();
            } catch (Exception e) {
                // TODO Auto-generated catch block
                return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
            }

        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }

    }

    @Override
    public Response importForceNewBts(Attachment attachments, HttpServletRequest request) throws Exception {

        // TODO Auto-generated method stub

        String filePath = writeFileToServer(attachments, request);
        try {
            try {

                return Response.ok(totalMonthPlanBusinessImpl.importForceNewBts(folderUpload + filePath, filePath))
                        .build();
            } catch (Exception e) {
                // TODO Auto-generated catch block
                return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
            }

        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }

    }

    @Override
    public Response importForceNewLine(Attachment attachments, HttpServletRequest request) throws Exception {

        // TODO Auto-generated method stub

        String filePath = writeFileToServer(attachments, request);
        try {
            try {

                return Response.ok(totalMonthPlanBusinessImpl.importForceNewLine(folderUpload + filePath, filePath))
                        .build();
            } catch (Exception e) {
                // TODO Auto-generated catch block
                return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
            }

        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }

    }

    @Override
    public Response importMaterial(Attachment attachments, HttpServletRequest request) throws Exception {

        // TODO Auto-generated method stub

        String filePath = writeFileToServer(attachments, request);
        try {
            try {

                return Response.ok(totalMonthPlanBusinessImpl.importMaterial(folderUpload + filePath, filePath))
                        .build();
            } catch (Exception e) {
                // TODO Auto-generated catch block
                return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
            }

        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }

    }

    @Override
    public Response importFinance(Attachment attachments, HttpServletRequest request) throws Exception {

        // TODO Auto-generated method stub

        String filePath = writeFileToServer(attachments, request);
        try {
            try {

                return Response.ok(totalMonthPlanBusinessImpl.importFinance(folderUpload + filePath, filePath)).build();
            } catch (Exception e) {
                // TODO Auto-generated catch block
                return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
            }

        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }

    }

    @Override
    public Response importContract(Attachment attachments, HttpServletRequest request) throws Exception {

        // TODO Auto-generated method stub

        String filePath = writeFileToServer(attachments, request);
        try {
            try {

                return Response.ok(totalMonthPlanBusinessImpl.importContract(folderUpload + filePath, filePath))
                        .build();
            } catch (Exception e) {
                // TODO Auto-generated catch block
                return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
            }

        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }

    }

    @Override
    public Response getYearPlanDetail(TotalMonthPlanSimpleDTO obj) throws Exception {
        // TODO Auto-generated method stub
        YearPlanDetailDTO data = totalMonthPlanBusinessImpl.getYearPlanDetail(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response exportTotalMonthPlan(TotalMonthPlanSimpleDTO obj) throws Exception {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_TOTAL_MONTH_PLAN");
        objKpiLog.setDescription("Xuất excel tháng tổng thể");
        //objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportTotalMonthPlan(obj);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        }
        return null;
    }

    @Override
    public Response getByIdTarget(TotalMonthPlanSimpleDTO obj) throws Exception {
        // TODO Auto-generated method stub
        return Response.ok(totalMonthPlanBusinessImpl.getByIdTarget(obj.getMonth(), obj.getYear(), obj.getSysGroupId()))
                .build();
    }

    @Override
    public Response exportDetailTargetTotalMonthPlan(TmpnTargetDTO obj) throws Exception {
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportDetailTargetTotalMonthPlan(obj);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response exportDetailSourceTotalMonthPlan(TmpnSourceDTO obj) throws Exception {
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportDetailSourceTotalMonthPlan(obj);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response exportDetailForceMaintainTotalMonthPlan(TmpnForceMaintainDTO obj) throws Exception {
    	//tan start 20181112
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_DETAIL_FORCE_MAINTAIN_TOTAL_MONTH_PLAN");
        objKpiLog.setDescription("Xuất excel chi tiết lực lượng tổng kế hoạch tháng");
        //objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportDetailForceMaintainTotalMonthPlan(obj);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        }
        return null;
    }

    @Override
    public Response exportDetailMaterialTotalMonthPlan(TmpnMaterialDTO obj) throws Exception {
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportDetailMaterialTotalMonthPlan(obj);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response exportDetailFinanceTotalMonthPlan(TmpnFinanceDTO obj) throws Exception {
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportDetailFinanceTotalMonthPlan(obj);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response exportDetailContractTotalMonthPlan(TmpnContractDTO obj) throws Exception {
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportDetailContractTotalMonthPlan(obj);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response getLKBySysList(TotalMonthPlanSimpleDTO obj) throws Exception {
        // TODO Auto-generated method stub
        return Response
                .ok(totalMonthPlanBusinessImpl.getLKBySysList(obj.getMonth(), obj.getYear(), obj.getSysGroupIdList()))
                .build();
    }

    @Override
    public Response saveAppendixFile(TotalMonthPlanSimpleDTO obj) throws Exception {
    	//tanqn 20181112 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("INSERT_APPENDIXFILE");
        objKpiLog.setDescription("Thêm mới kế hoạch phụ lục tháng tổng thể");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            totalMonthPlanBusinessImpl.saveAppendixFile(obj, objUser.getVpsUserInfo().getSysUserId());
            return Response.ok(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
        	
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                objKpiLog.setReason(e.toString());
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
//tanqn 20181112 end
    @Override
    public Response getFileAppendixParam() throws Exception {
        // TODO Auto-generated method stub
        return Response.ok(totalMonthPlanBusinessImpl.getFileAppendixParam()).build();
    }

    @Override
    public Response exportDetailBTSGTotalMonthPlan(Long id) throws Exception {
    	//tanqn 20181112 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_DETAIL_BTSG_TOTAL_MONTH_PLAN");
        objKpiLog.setDescription("Xuất excel chi tiết BTSG tháng tổng thể");
        objKpiLog.setTransactionCode(id.toString());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportDetailBTSGTotalMonthPlan(id);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        }
        return null;
    }

    @Override
    public Response exportDetailForceNewTotalMonthPlan(Long id) throws Exception {
    	//tanqn 20181112 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_DETAIL_FORCE_NEW_TOTAL_MONTH_PLAN");
        objKpiLog.setDescription("Xuất excel chi tiết lực lượng mới của tháng tổng thể");
        objKpiLog.setTransactionCode(id.toString());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            String strReturn = totalMonthPlanBusinessImpl.exportDetailForceNewTotalMonthPlan(id);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        }
        return null;
    }

    @Override
    public Response doSearchTarget(TotalMonthPlanSimpleDTO obj) throws Exception {
        DataListDTO data = totalMonthPlanBusinessImpl.doSearchTarget(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchSource(TotalMonthPlanSimpleDTO obj) throws Exception {
        DataListDTO data = totalMonthPlanBusinessImpl.doSearchSource(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchForcemaintain(TotalMonthPlanSimpleDTO obj) throws Exception {
        DataListDTO data = totalMonthPlanBusinessImpl.doSearchForcemaintain(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchBTS(TotalMonthPlanSimpleDTO obj) throws Exception {
        DataListDTO data = totalMonthPlanBusinessImpl.doSearchBTS(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchForceNew(TotalMonthPlanSimpleDTO obj) throws Exception {
        DataListDTO data = totalMonthPlanBusinessImpl.doSearchForceNew(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchMaterial(TotalMonthPlanSimpleDTO obj) throws Exception {
        DataListDTO data = totalMonthPlanBusinessImpl.doSearchMaterial(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchFinance(TotalMonthPlanSimpleDTO obj) throws Exception {
        DataListDTO data = totalMonthPlanBusinessImpl.doSearchFinance(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchContract(TotalMonthPlanSimpleDTO obj) throws Exception {
        DataListDTO data = totalMonthPlanBusinessImpl.doSearchContract(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchAppendix(TotalMonthPlanSimpleDTO obj) throws Exception {
        DataListDTO data = totalMonthPlanBusinessImpl.doSearchAppendix(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response checkPermissionsAdd() {
        try {
            // TODO Auto-generated method stub
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            return Response.ok(totalMonthPlanBusinessImpl.checkPermissionsAdd(sysGroupId, request)).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response checkPermissionsCopy() {
        // TODO Auto-generated method stub
        try {
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            return Response.ok(totalMonthPlanBusinessImpl.checkPermissionsCopy(sysGroupId, request)).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }

    }

    @Override
    public Response checkPermissionsDelete() {
        // TODO Auto-generated method stub
        try {
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            return Response.ok(totalMonthPlanBusinessImpl.checkPermissionsDelete(sysGroupId, request)).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response checkPermissionsRegistry() {
        // TODO Auto-generated method stub
        try {
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            return Response.ok(totalMonthPlanBusinessImpl.checkPermissionsRegistry(sysGroupId, request)).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response checkPermissionsUpdate() {
        // TODO Auto-generated method stub
        try {
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            Long id = totalMonthPlanBusinessImpl.checkPermissionsUpdate(sysGroupId, request);
            return Response.ok(id).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

}
