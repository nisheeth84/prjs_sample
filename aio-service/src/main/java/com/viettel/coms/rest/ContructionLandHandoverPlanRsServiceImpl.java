/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.cat.dto.CatPartnerDTO;
import com.viettel.coms.business.ContructionLandHandoverPlanBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dto.*;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
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
import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * @author HungLQ9
 */

public class ContructionLandHandoverPlanRsServiceImpl implements ContructionLandHandoverPlanRsService {

    protected final Logger log = Logger.getLogger(ContructionLandHandoverPlanRsServiceImpl.class);
    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;
    @Value("${allow.folder.dir}")
    private String allowFolderDir;
    @Autowired
    ContructionLandHandoverPlanBusinessImpl contructionLandHandoverPlanBusinessImpl;
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
    @Autowired
    private UserRoleBusinessImpl userRoleBusinessImpl;

    @Override
    public Response getContructionLandHandoverPlan() {
        List<ContructionLandHandoverPlanDTO> ls = contructionLandHandoverPlanBusinessImpl.getAll();
        if (ls == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            DataListDTO data = new DataListDTO();
            data.setData(ls);
            data.setTotal(ls.size());
            data.setSize(ls.size());
            data.setStart(1);
            return Response.ok(data).build();
        }
    }

    @Override
    public Response update(ContructionLandHandoverPlanDTO obj) throws Exception {
    	//tanqn 20181112 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("UPDATE_CONSTRUCTION_LAND_HANDOVER_PLAN");
        objKpiLog.setDescription("Quản lý kế hoạch BGMB");
        objKpiLog.setTransactionCode(obj.getContructionLandHanPlanId().toString());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            obj.setUpdateUser(objUser.getVpsUserInfo().getSysUserId());
            obj.setUpdateDate(new Date());
            Long ids = contructionLandHandoverPlanBusinessImpl.updateConstruction(obj, request);
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
    //tanqn 20181112 end

    @Override
    public Response doSearch(ContructionLandHandoverPlanDtoSearch obj) {
        // TODO Auto-generated method stub
    	//tanqn 20181112 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_CONSTRUCTION_LAND_HANDOVER_PLAN");
        objKpiLog.setDescription("Quản lý kế hoạch BGMB");
        objKpiLog.setTransactionCode("");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        // tam thoi chua lay theo don vi tao
        DataListDTO data = contructionLandHandoverPlanBusinessImpl.doSearch(obj, request);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
    }
  //tanqn 20181112 end

    @Override
    public Response doSearchPartner(CatPartnerDTO obj) {
        DataListDTO lst = contructionLandHandoverPlanBusinessImpl.doSearchPartner(obj);
        return Response.ok(lst).build();
    }

    @Override
    public Response getContructionLandHandoverPlanById(Long id) {
        ContructionLandHandoverPlanDTO obj = (ContructionLandHandoverPlanDTO) contructionLandHandoverPlanBusinessImpl
                .getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateContructionLandHandoverPlan(ContructionLandHandoverPlanDTO obj) {
        Long id = contructionLandHandoverPlanBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response getCatStation(CatStationDTO obj) {
        return Response.ok(contructionLandHandoverPlanBusinessImpl.getCatStation(obj, request)).build();
    }

    @Override
    public Response addContructionLandHandoverPlan(ContructionLandHandoverPlanDTO obj) {
        Long id = contructionLandHandoverPlanBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteContructionLandHandoverPlan(Long id) {
        ContructionLandHandoverPlanDTO obj = (ContructionLandHandoverPlanDTO) contructionLandHandoverPlanBusinessImpl
                .getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            contructionLandHandoverPlanBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }

    @Override
    public Response getLstConstruction(String code) {
        List<ConstructionDTO> lst = contructionLandHandoverPlanBusinessImpl.getLstConstruction(code);
        return Response.ok(lst).build();
    }

    @Context
    HttpServletRequest request;

    @Override
    public Response add(ContructionLandHandoverPlanDTO obj) {
        UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
        // hoanm1_20180305_start
        KttsUserSession s = userRoleBusinessImpl.getUserSession(request);
        // hoanm1_20180305_end
        KttsUserSession objUser1 = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        String ConstructionName = contructionLandHandoverPlanBusinessImpl.getConstructionName(obj.getConstructionId());
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("INSERT_LAND_HAND_OVER_PLAN");
        objKpiLog.setTransactionCode(ConstructionName);
        objKpiLog.setCreateUserId(objUser1.getVpsUserInfo().getSysUserId());
        objKpiLog.setDescription("Quản lý kế hoạch BGMB");
        try {
            // hoanm1_20180305_start
            Long sysUserId = s.getVpsUserInfo().getSysUserId();
            Long sysGroupId = s.getVpsUserInfo().getSysGroupId();
            // hoanm1_20180305_end
            // obj.setSysGroupId(objUser.getDeptId().toString());
            obj.setCreateUser(objUser.getUserID());
            obj.setCreateDate(new Date());
            Long ids = contructionLandHandoverPlanBusinessImpl.add(obj, request);
            if (ids == 0l) {
                Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                contructionLandHandoverPlanBusinessImpl.addKpiLog(objKpiLog);
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
                Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                contructionLandHandoverPlanBusinessImpl.addKpiLog(objKpiLog);
                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }

    }

    @Override
    public Response aaddImportdd(ContructionLandHandoverPlanDtoSearch obj) {
        UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
        // hoanm1_20180305_start
        KttsUserSession s = userRoleBusinessImpl.getUserSession(request);
        // hoanm1_20180305_end
        try {
            // hoanm1_20180305_start
            Long sysUserId = s.getVpsUserInfo().getSysUserId();
            Long sysGroupId = s.getVpsUserInfo().getSysGroupId();
            // hoanm1_20180305_end
            // obj.setSysGroupId(objUser.getDeptId().toString());
            Long ids = contructionLandHandoverPlanBusinessImpl.aaddImportdd(obj, request);
            if (ids == 0l) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response getById(Long id) throws Exception {
        // TODO Auto-generated method stub
        ContructionLandHandoverPlanDTO data = contructionLandHandoverPlanBusinessImpl.getById(id);
        return Response.ok(data).build();
    }

    @Override
    public Response remove(ContructionLandHandoverPlanDTO obj) {
        // TODO Auto-generated method stub
    	//tanqn 20181113 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DELETE_CONSTRUCTION_LAND_HANDOVER_PLAN");
        obj.setDescription("Quản lý kế hoạch BGMB");
        objKpiLog.setTransactionCode(obj.getContructionLandHanPlanId().toString());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        contructionLandHandoverPlanBusinessImpl.remove(obj);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok().build();
        //tanqn 20181113 end
    }

    @Override
    public Response exportExcelTemplate() throws Exception {
        // TODO Auto-generated method stub
        try {
            String strReturn = contructionLandHandoverPlanBusinessImpl.exportExcelTemplate();
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
        }
        return null;
    }

    @Override
    public Response exportHanPlan(ContructionLandHandoverPlanDtoSearch obj) throws Exception {
    	//tanqn 20181113 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_CONSTRUCTION_LAND_HANDOVER_PLAN");
        objKpiLog.setDescription("Quản lý kế hoạch BGMB");
        objKpiLog.setTransactionCode("");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            String strReturn = contructionLandHandoverPlanBusinessImpl.exportHanPlan(obj);
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
    public Response importHanPlanDetail(Attachment attachments, HttpServletRequest request) throws Exception {
        UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
        Long sysId = objUser.getUserID();

        // TODO Auto-generated method stub
        String folderParam = UString.getSafeFileName(request.getParameter("folder"));
        String filePathReturn;
        String filePath;
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
            filePath = UFile.writeToFileServerATTT2(inputStream, fileName, folderParam, folderUpload);
            filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
        } catch (Exception ex) {
            throw new BusinessException("Loi khi save file", ex);
        }

        try {
        	//tanqn 20181113 start
        	KttsUserSession objUsers = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            KpiLogDTO objKpiLog = new KpiLogDTO();
            Date dStart = new Date();
            objKpiLog.setStartTime(dStart);
            objKpiLog.setCreateDatetime(dStart);
            objKpiLog.setFunctionCode("EXPORT_CONSTRUCTION_LAND_HANDOVER_PLAN_DETAIL");
            objKpiLog.setDescription("Quản lý kế hoạch BGMB");
            objKpiLog.setTransactionCode("");
            objKpiLog.setCreateUserId(objUsers.getVpsUserInfo().getSysUserId());

            try {
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                return Response.ok(contructionLandHandoverPlanBusinessImpl.importHanPlanDetail(folderUpload + filePath,
                        filePath, sysId)).build();
            } catch (Exception e) {
                // TODO Auto-generated catch block
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                objKpiLog.setReason(e.toString());
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
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
    public Response checkPermissionsAdd(ContructionLandHandoverPlanDTO obj) {
        try {
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            return Response.ok(contructionLandHandoverPlanBusinessImpl.checkPermissionsAdd(obj, sysGroupId, request))
                    .build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response checkImport(ContructionLandHandoverPlanDTO obj) {
        try {
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            return Response.ok(contructionLandHandoverPlanBusinessImpl.checkImport(obj, sysGroupId, request)).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
}
