/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.cat.dao.CatProvinceDAO;
import com.viettel.coms.ConstructionProgressDTO;
import com.viettel.coms.bo.RpHSHCBO;
import com.viettel.coms.business.AssignHandoverBusinessImpl;
import com.viettel.coms.business.ConstructionTaskBusinessImpl;
import com.viettel.coms.business.SysUserCOMSBusinessImpl;
import com.viettel.coms.business.WorkItemBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.config.JasperReportConfig;
import com.viettel.coms.dao.ConstructionTaskDAO;
import com.viettel.coms.dao.RpConstructionHSHCDAO;
import com.viettel.coms.dao.RpHSHCDAO;
import com.viettel.coms.dto.*;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;
import com.viettel.wms.business.UserRoleBusinessImpl;

import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;

import org.apache.commons.lang3.StringUtils;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.log4j.Logger;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import viettel.passport.client.UserToken;

import javax.activation.DataHandler;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.sql.Timestamp;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.*;

/**
 * @author HungLQ9
 */
public class ConstructionTaskRsServiceImpl implements ConstructionTaskRsService {

    protected final Logger log = Logger.getLogger(ConstructionTaskRsServiceImpl.class);
    @Autowired
    ConstructionTaskBusinessImpl constructionTaskBusinessImpl;

    @Autowired
    ConstructionTaskDAO constructionTaskDao;
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
    // chinhpxn20180716_start
    @Autowired
    SysUserCOMSBusinessImpl sysUserCOMSBusinessImpl;

    @Autowired
    WorkItemBusinessImpl workItemBusinessImpl;

    @Autowired
    private UserRoleBusinessImpl userRoleBusinessImpl;

    @Autowired
    private RpConstructionHSHCDAO rpConstructionHSHCDAO;

    @Autowired
    private RpHSHCDAO rpHSHCDAO;

    //VietNT_20181226_start
    @Autowired
    private AssignHandoverBusinessImpl assignHandoverBusinessImpl;
    //VietNT_end

    @Value("${allow.file.ext}")
    private String allowFileExt;
    @Value("${allow.folder.dir}")
    private String allowFolderDir;
    // chinhpxn20180716_end

    @Context
    HttpServletResponse response;
    @Value("${folder_upload2}")
    private String folderUpload;
    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Autowired
    ConstructionTaskBusinessImpl constructionTaskBusiness;
    @Context
    HttpServletRequest request;

    @Override
    public Response getConstructionTask() {
        List<ConstructionProgressDTO> ls = constructionTaskBusinessImpl.getConstructionTaskData();
        return Response.ok(ls).build();
    }

    public Response getConstructionTaskDependencies() {
        List<ConstructionProgressDTO> ls = constructionTaskBusinessImpl.getConstructionTaskData();
        return Response.ok(ls).build();
    }

    @Override
    public Response getConstructionTaskById(Long id) {
        ConstructionTaskDTO obj = (ConstructionTaskDTO) constructionTaskBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateConstructionTask(ConstructionTaskDTO obj) {
    	//tanqn 20181113 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("REMOVE_CONSTRUCTION_TASK");
        objKpiLog.setDescription("Quản lý HSHC");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
    	try {
        Long id = constructionTaskBusinessImpl.update(obj);
        if (id == 0l) {
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
            return Response.ok().build();
        }
    	} catch (Exception e) {
    		return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}//end
    }

    @Override
    public Response addConstructionTask(ConstructionTaskDTO obj) {
    	//tanqn 20181113 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("INSERT_CONSTRUCTION_TASK");
        objKpiLog.setDescription("Thông tin tiến độ công trình");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        Long id = constructionTaskBusinessImpl.save(obj);
        if (id == 0l) {
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
        }//end
    }

    @Override
    public Response deleteConstructionTask(Long id) {
    	//tanqn 20181113 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DELETE_CONSTRUCTION_TASK");
        objKpiLog.setDescription("Thông tin tiến độ công trình");
        
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        ConstructionTaskDTO obj = (ConstructionTaskDTO) constructionTaskBusinessImpl.getOneById(id);
        if (obj == null) {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            constructionTaskBusinessImpl.delete(obj);
            Date dEnd = new Date();
            objKpiLog.setTransactionCode(obj.getConstructionCode());
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }

    @Override
    public Response doSearchForReport(ConstructionTaskDetailDTO obj) {
        DataListDTO data = constructionTaskBusinessImpl.doSearchForReport(obj);
        return Response.ok(data).build();
    }
   
    @Override
    public Response exportConstructionTask(ConstructionTaskDetailDTO obj) throws Exception {
    	//tanqn 20181113 start
    	KttsUserSession objUsers = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_CONSTRUCTION_TASK");
        objKpiLog.setDescription("Thông tin tiến độ công trình");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUsers.getVpsUserInfo().getSysUserId());
        try {
            UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
            String strReturn = constructionTaskBusinessImpl.exportConstructionTask(obj, objUser.getUserName());
            Date dEnd = new Date();
            objKpiLog.setTransactionCode(obj.getConstructionCode());
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setTransactionCode(obj.getConstructionCode());
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        }
        return null;
    }
    @Override
    public Response doSearchForConsManager(ConstructionTaskDetailDTO obj) {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_CONSTRUCCTION_TASK");
        objKpiLog.setDescription("Quản lý HSHC");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = constructionTaskBusinessImpl.doSearchForConsManager(obj, request);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
    }

    @Override
    public Response approveRevenue(ConstructionDetailDTO obj) {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("ACCEPT_CONSTRUCCTION_TASK");
        objKpiLog.setDescription("Quản lý doanh thu");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            Long id = constructionTaskBusinessImpl.approveRevenue(obj.getListConsTask(), objUser.getSysUserId(),
                    request);
            if (id == 0l) {
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
    
  //TungTT_20181129_Strat
    @Override
    public Response approveHSHC (ConstructionDetailDTO obj) {
        // TODO Auto-generated method stub
        try {
        	constructionTaskBusinessImpl.approveHSHC(obj, request);
            return Response.ok(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
    
    @Override
    public Response UpdateUndoHshc (ConstructionDetailDTO obj) {
        // TODO Auto-generated method stub
        try {
        	constructionTaskBusinessImpl.UpdateUndoHshc(obj, request);
            return Response.ok(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
  //TungTT_20181129_End
    @Override
    public Response callbackConstrRevenue(ConstructionDetailDTO obj) throws Exception {
        try {
            Long id = constructionTaskBusinessImpl.callbackConstrRevenue(obj, request);
            if (id == 0l) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }

    }

    @Override
    public Response rejectionRevenue(ConstructionDetailDTO obj) {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        try {
            Long id = constructionTaskBusinessImpl.rejectionRevenue(obj.getListConsTask(),
                    objUser.getVpsUserInfo().getSysUserId(), request);
            if (id == 0l) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }

    }

    @Override
    public Response doSearchForRevenue(ConstructionTaskDetailDTO obj) {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_CONSTRUCCTION_TASK");
        objKpiLog.setDescription("Quản lý doanh thu");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = constructionTaskBusinessImpl.doSearchForRevenue(obj, request);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        
        return Response.ok(data).build();
    }

    @Override
    public Response getDataForGrant(GranttDTO granttSearch) {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();

        // long startTime = System.nanoTime();
        List<ConstructionTaskGranttDTO> lstDto = constructionTaskBusinessImpl.getDataForGrant(granttSearch, sysGroupId,
                request);
        // long endTime = System.nanoTime();
        //
        // long duration = (endTime - startTime); // divide by 1000000 to get
        // milliseconds.
        // System.out.println("TIME RS SERVICE: " + duration);
        return Response.ok(lstDto).build();
    }

    @Override
    public Response exportContructionHSHC(ConstructionTaskDetailDTO obj) throws Exception {
    	//tanqn 20181113 start
    	KttsUserSession objUsers = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_CONSTRUCTION_HSHC");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setDescription("Quản lý HSHC");
        objKpiLog.setCreateUserId(objUsers.getVpsUserInfo().getSysUserId());
        try {
            String strReturn = constructionTaskBusinessImpl.exportContructionHSHC(obj, request);
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
    public Response exportContructionDT(ConstructionTaskDetailDTO obj) throws Exception {
    	//tanqn 20181113 start
    	KttsUserSession objUsers = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_CONSTRUCTION_HSHC");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setDescription("Quản lý HSHC");
        objKpiLog.setCreateUserId(objUsers.getVpsUserInfo().getSysUserId());
        try {

            String strReturn = constructionTaskBusinessImpl.exportContructionDT(obj, request);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
        }
        return null;
    }

    @Override
    public Response getDataResources() {
        return Response.ok(constructionTaskBusinessImpl.getDataResources()).build();
    }

    @Override
    public Response getDataAssignments(GranttDTO granttSearch) {

        return Response.ok(constructionTaskBusinessImpl.getDataAssignments(granttSearch)).build();
    }

    @Override
    public Response updateCompletePercent(ConstructionTaskGranttDTO dto) {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        int result = 1;
        try {
            result = constructionTaskBusinessImpl.updateCompletePercent(dto, objUser);
            if (result == -1L) {
                throw new IllegalArgumentException(
                        "Ngày bắt đầu của công việc phải lớn hơn hoặc bằng ngày khởi công của công trình");
            } else if (result == -2L) {
                throw new IllegalArgumentException(
                        "Ngày kết thúc của công việc phải nhỏ hơn hoặc bằng ngày kết thúc của công trình");
            }
            return Response.ok(result).build();
        } catch (IllegalArgumentException e) {
            return Response.ok(result).build();
        }
    }

    @Override
    public Response deleteGrantt(ConstructionTaskGranttDTO dto) {
        return Response.ok(constructionTaskBusinessImpl.deleteGrantt(dto)).build();
    }

    @Override
    public Response createTask(ConstructionTaskGranttDTO dto) {
        return Response.ok(constructionTaskBusinessImpl.createTask(dto)).build();
    }

    @Override
    public Response getDataConstructionGrantt(GranttDTO granttSearch) {
        List<ConstructionTaskGranttDTO> lstDto = constructionTaskBusinessImpl.getDataConstructionGrantt(granttSearch);
        return Response.ok(lstDto).build();
    }

    @Override
    public Response removeComplete(List<String> listId) throws Exception {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("REMOVE_COMPLETE_CONSTRUCTION_TASK");
        objKpiLog.setDescription("Quản lý HSHC");
        //objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
//		hungtd_20181207_start
            Long id = constructionTaskBusinessImpl.removeComplete(listId, request,objUser.getVpsUserInfo().getSysUserId());
//		hungtd_20181207_end
            if (id == 0l) {
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
    public Response removeHSHC(ConstructionDetailDTO obj) throws Exception {
        try {
            Long id = constructionTaskBusinessImpl.removeHSHC(obj, request);
            if (id == 0l) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }

    }

    @Override
    public Response addConstructionTask(ConstructionTaskDetailDTO obj) throws Exception {
        try {

            UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
            SysUserRequest sysRequest = new SysUserRequest();
            // sysRequest.setDepartmentId(objUser.getDeptId());
            // sysRequest.setSysGroupId(objUser.getDeptId().toString());

            // TienTH_20180329 START
            sysRequest.setSysUserId(objUser.getUserID());
            sysRequest.setDepartmentId(Long.parseLong(constructionTaskDao.getSysGroupId(objUser.getUserName())));
            sysRequest.setSysGroupId(constructionTaskDao.getSysGroupId(objUser.getUserName()));
            // TienTH_20180329 END

            Long result = constructionTaskBusiness.insertCompleteRevenueTaskOther(obj, sysRequest,
                    Long.parseLong(sysRequest.getSysGroupId()));
            if (result == -1L) {
                throw new IllegalArgumentException("Không thể tạo công việc do chưa tồn tại kế hoạch tháng!");
            } else if (result == -5L) {
                throw new IllegalArgumentException("Không thể tạo thêm công việc cho hạng mục đã hoàn thành");
            } else if (result == -2L) {
                throw new IllegalArgumentException("Công việc gán cho người thực hiện đã tồn tại");
            } else if (result == -3L) {
                throw new IllegalArgumentException("Công việc làm HSHC/Doanh thu cho công trình đã tồn tại");
            } else if (result == -4L) {
                throw new IllegalArgumentException("Công việc khác đã tồn tại");
            }
            // hoanm1_20180530_start
            else if (result == -7L) {
                throw new IllegalArgumentException(
                        "Ngày bắt đầu của công việc phải lớn hơn hoặc bằng ngày khởi công của công trình");
            } else if (result == -8L) {
                throw new IllegalArgumentException(
                        "Ngày kết thúc của công việc phải nhỏ hơn hoặc bằng ngày kết thúc của công trình");
            } else if (result == -10L) {
                throw new IllegalArgumentException("Hạng mục chưa được định nghĩa đơn giá");
            }
            // hoanm1_20180530_end
            else {
                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    public Response addConstructionTaskTC(ConstructionTaskDetailDTO obj) throws Exception {
    	//tanqn 20181112 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("ADD_CONSTRUCTION_TASK_TC");
        objKpiLog.setDescription("Thông tin thực hiện");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        //tanqn 20181112 end 
        try {

            // UserToken objUser = (UserToken)
            // request.getSession().getAttribute(
            // "vsaUserToken");
            // chinhpxn_20180713_start
            SysUserRequest sysRequest = new SysUserRequest();
            //KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            sysRequest.setSysUserId(objUser.getVpsUserInfo().getSysUserId());
            sysRequest.setDepartmentId(objUser.getVpsUserInfo().getSysGroupId());
            sysRequest.setSysGroupId(String.valueOf(objUser.getVpsUserInfo().getSysGroupId()));
            // chinhpxn_20180713_end

            // sysRequest.setDepartmentId(objUser.getDeptId());
            // sysRequest.setSysGroupId(objUser.getDeptId().toString());

            // TienTH_20180329 START
            // sysRequest.setSysUserId(objUser.getUserID());
            // sysRequest.setDepartmentId(Long.parseLong(constructionTaskDao
            // .getSysGroupId(objUser.getUserName())));
            // sysRequest.setSysGroupId(constructionTaskDao.getSysGroupId(objUser
            // .getUserName()));
            // TienTH_20180329 END

            // chinhpxn20180711_start
            Long sysGroupId = -1L;
            if (obj.getSysGroupIdTC() != null) {
                sysGroupId = obj.getSysGroupIdTC();
            } else {
                String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                        Constant.AdResourceKey.WORK_PROGRESS, request);
                List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
                if (groupIdList.isEmpty()) {
                	Date dEnd = new Date();
                    objKpiLog.setEndTime(dEnd);
                    objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                    objKpiLog.setStatus("0");
                    objKpiLog.setReason("Không thể tạo công việc do người dùng chưa được phân quyền miền dữ liệu!");
                    yearPlanBusinessImpl.addKpiLog(objKpiLog);
                    throw new IllegalArgumentException(
                            "Không thể tạo công việc do người dùng chưa được phân quyền miền dữ liệu!");
                } else if (groupIdList.size() > 1) {
                	Date dEnd = new Date();
                    objKpiLog.setEndTime(dEnd);
                    objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                    objKpiLog.setStatus("0");
                    objKpiLog.setReason("Không thể tạo công việc do người dùng được phân quyền nhiều miền dữ liệu!");
                    yearPlanBusinessImpl.addKpiLog(objKpiLog);
                    throw new IllegalArgumentException(
                            "Không thể tạo công việc do người dùng được phân quyền nhiều miền dữ liệu!");
                } else {
                    sysGroupId = Long.parseLong(groupIdList.get(0));
                }
            }

            Long result = constructionTaskBusiness.insertCompleteRevenueTaskOtherTC(obj, sysRequest, sysGroupId,
                    objUser);
            // chinhpxn20180711_end

            if (result == -1L) {
            	//tanqn start 20181112
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                objKpiLog.setReason("Không thể tạo công việc do chưa tồn tại kế hoạch tháng!");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                throw new IllegalArgumentException("Không thể tạo công việc do chưa tồn tại kế hoạch tháng!");
            } else if (result == -5L) {
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                objKpiLog.setReason("Không thể tạo thêm công việc cho hạng mục đã hoàn thành");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                throw new IllegalArgumentException("Không thể tạo thêm công việc cho hạng mục đã hoàn thành");
            } else if (result == -3L) {
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                objKpiLog.setReason("Công việc làm HSHC/Doanh thu cho công trình đã tồn tại");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                throw new IllegalArgumentException("Công việc làm HSHC/Doanh thu cho công trình đã tồn tại");
            } else if (result == -4L) {
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                objKpiLog.setReason("Công việc khác đã tồn tại");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                throw new IllegalArgumentException("Công việc khác đã tồn tại");
            }
            // hoanm1_20180530_start
            else if (result == -7L) {
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                objKpiLog.setReason("Ngày bắt đầu của công việc phải lớn hơn hoặc bằng ngày khởi công của công trình");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                throw new IllegalArgumentException(
                        "Ngày bắt đầu của công việc phải lớn hơn hoặc bằng ngày khởi công của công trình");
            } else if (result == -8L) {
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                objKpiLog.setReason("Ngày kết thúc của công việc phải nhỏ hơn hoặc bằng ngày kết thúc của công trình");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                throw new IllegalArgumentException(
                        "Ngày kết thúc của công việc phải nhỏ hơn hoặc bằng ngày kết thúc của công trình");
            }
            // else if (result == -10L){
            // throw new
            // IllegalArgumentException("Hạng mục chưa được định nghĩa đơn giá");
            // }
            // hoanm1_20180530_end
            // hoanm1_20180614_start
            else if (result == -11L) {
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                objKpiLog.setReason("Hạng mục đã tồn tại trong kế hoạch tháng của đơn vị");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                throw new IllegalArgumentException("Hạng mục đã tồn tại trong kế hoạch tháng của đơn vị");
            }
            // hoanm1_20180614_end

            else {
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                //VietNT_20181226_start
                // if add success, update assignHandover.deliveryConstructionDate = sysDate
                if (obj.getAssignHandoverId() != null) {
                    assignHandoverBusinessImpl.updateDeliveryConstructionDate(obj.getAssignHandoverId(), objUser.getVpsUserInfo().getSysUserId());
                }
                //VietNT_end
                return Response.ok(Response.Status.CREATED).build();
            }
            //tanqn 20181112 end 
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
    
    @Override
    public Response saveListTaskFromImport(ConstructionTaskDetailDTO obj) throws Exception {
        try {
            SysUserRequest sysRequest = new SysUserRequest();
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            sysRequest.setSysUserId(objUser.getVpsUserInfo().getSysUserId());
            sysRequest.setDepartmentId(objUser.getVpsUserInfo().getSysGroupId());
            sysRequest.setSysGroupId(String.valueOf(objUser.getVpsUserInfo().getSysGroupId()));
            Long sysGroupId = -1L;
            if (obj.getSysGroupIdTC() != null) {
                sysGroupId = obj.getSysGroupIdTC();
            } else {
                String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                        Constant.AdResourceKey.WORK_PROGRESS, request);
                List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
                if (groupIdList.isEmpty()) {
                    throw new IllegalArgumentException(
                            "Không thể tạo công việc do người dùng chưa được phân quyền miền dữ liệu!");
                } else if (groupIdList.size() > 1) {
                    throw new IllegalArgumentException(
                            "Không thể tạo công việc do người dùng được phân quyền nhiều miền dữ liệu!");
                } else {
                    sysGroupId = Long.parseLong(groupIdList.get(0));
                }
            }

            Long result = constructionTaskBusiness.saveListTaskFromImport(obj, sysRequest, sysGroupId,
                    objUser);
            if (result == -1L) {
                throw new IllegalArgumentException("Không thể tạo công việc do chưa tồn tại kế hoạch tháng!");
            } else if (result == -5L) {
                throw new IllegalArgumentException("Không thể tạo thêm công việc cho hạng mục đã hoàn thành");
            } else if (result == -3L) {
                throw new IllegalArgumentException("Công việc làm HSHC/Doanh thu cho công trình đã tồn tại");
            } else if (result == -4L) {
                throw new IllegalArgumentException("Công việc khác đã tồn tại");
            } else if (result == -7L) {
                throw new IllegalArgumentException(
                        "Ngày bắt đầu của công việc phải lớn hơn hoặc bằng ngày khởi công của công trình");
            } else if (result == -8L) {
                throw new IllegalArgumentException(
                        "Ngày kết thúc của công việc phải nhỏ hơn hoặc bằng ngày kết thúc của công trình");
            }
            else if (result == -11L) {
                throw new IllegalArgumentException("Hạng mục đã tồn tại trong kế hoạch tháng của đơn vị");
            }  else if (result == 0L) {
                throw new IllegalArgumentException("Import thất bại");
            }

            else {
                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response searchConstruction(ConstructionDetailDTO obj) throws Exception {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
        return Response.ok(constructionTaskBusinessImpl.searchConstruction(obj, sysGroupId, request)).build();
    }

    @Override
    public Response rpDailyTConstruction(ConstructionDetailDTO obj) throws Exception {
        DataListDTO results = constructionTaskBusinessImpl.rpDailyTaskConstruction(obj);
        return Response.ok(results).build();
    }

    @Override
    public Response searchConstructionDSTH(ConstructionDetailDTO obj) throws Exception {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
        return Response.ok(constructionTaskBusinessImpl.searchConstructionDSTH(obj, sysGroupId, request)).build();
    }

    @Override
    public Response searchWorkItems(WorkItemDetailDTO obj) throws Exception {
        return Response.ok(constructionTaskBusinessImpl.searchWorkItems(obj)).build();
    }

    @Override
    public Response rpDailyTaskWorkItems(WorkItemDetailDTO obj) throws Exception {
        DataListDTO results = constructionTaskBusinessImpl.rpDailyTaskWorkItems(obj);
        return Response.ok(results).build();
    }

    @Override
    public Response searchCatTask(WorkItemDetailDTO obj) throws Exception {
        return Response.ok(constructionTaskBusinessImpl.searchCatTask(obj)).build();
    }

    @Override
    public Response searchPerformer(SysUserDetailCOMSDTO obj) throws Exception {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        return Response.ok(
                constructionTaskBusinessImpl.searchPerformer(obj, objUser.getVpsUserInfo().getSysGroupId(), request))
                .build();
    }

    @Override
    public Response updatePerfomer(ConstructionTaskDTO obj) throws Exception {
        try {
            Long ids = constructionTaskBusinessImpl.updatePerfomer(obj);
            KttsUserSession user = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");

            constructionTaskBusinessImpl.createSendSmsEmail(obj, user);
            constructionTaskBusinessImpl.createSendSmsEmailToConvert(obj, user);
            constructionTaskBusinessImpl.createSendSmsEmailToOperator(obj, user);
            if (ids == 0l) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {

                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (Exception e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response exportPdfService(ConstructionTaskDetailDTO obj) throws Exception {
        /*
         * UserToken objUser = (UserToken) request.getSession().getAttribute(
         * "vsaUserToken");
         */
        KttsUserSession objSec = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        obj.setPage(null);
        obj.setPageSize(null);
        List<ConstructionTaskDetailDTO> ls = constructionTaskBusinessImpl.getDataForExport(obj);
        if (ls != null & !ls.isEmpty()) {
            long count = 1;
            for (ConstructionTaskDetailDTO dto : ls) {
                dto.setStt(count++);
            }
        }
        ConcurrentHashMap<String, Object> params = new ConcurrentHashMap<String, Object>();
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String reportPath = classloader.getResource("../" + "doc-template").getPath();
        // JasperCompileManager.compileReportToFile(reportPath +
        // "/KeHoachThangChiTiet.jrxml");
        String filePath = reportPath + "/DanhSachCongViecPdfMoi.jasper";
        // params.put("HK12Param", colectionDataSource);
        JRBeanCollectionDataSource tbl1 = new JRBeanCollectionDataSource(ls);
        params.put("tbl1", tbl1);
        Format formatter = new SimpleDateFormat("dd");
        String dd = formatter.format(new Date());
        formatter = new SimpleDateFormat("MM");
        String mm = formatter.format(new Date());
        formatter = new SimpleDateFormat("yyyy");
        String yyyy = formatter.format(new Date());
        params.put("mm", mm);
        params.put("dd", dd);
        params.put("yyyy", yyyy);
        params.put("sysGroupName", objSec.getVpsUserInfo().getDepartmentName());

        JasperPrint jasperPrint = JasperFillManager.fillReport(filePath, params, new JREmptyDataSource());
        jasperPrint.addStyle(JasperReportConfig.getNormalStyle(reportPath));
        String pathReturn = generateLocationFile();
        File udir = new File(folderUpload + pathReturn);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        File file = new File(folderUpload + pathReturn + File.separator + "DanhSachCongViecPdadas.pdf");
        // JasperExportManager.exportReportToPdfFile(jasperPrint,folderUpload+pathReturn
        // +"KehoachThangChiTiet.pdf");
        JRPdfExporter exporterpdf = new JRPdfExporter();

        exporterpdf.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
        exporterpdf.setParameter(JRExporterParameter.CHARACTER_ENCODING, "UTF-8");
        exporterpdf.setParameter(JRExporterParameter.OUTPUT_FILE, file);

        exporterpdf.exportReport();
        if (file.exists()) {
            ResponseBuilder response = Response.ok(file);
            response.header("Content-Disposition", "attachment; filename=\"" + "DanhSachCongViecPdadas.pdf" + "\"");
            return response.build();
        }
        return null;
    }

    private String generateLocationFile() {
        Calendar cal = Calendar.getInstance();
        return File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator + cal.get(Calendar.YEAR)
                + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator + cal.get(Calendar.DATE)
                + File.separator + cal.get(Calendar.MILLISECOND);
    }

    @Override
    public Response getCountConstruction(GranttDTO obj) throws Exception {

        // TODO Auto-generated method stub
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("getCountConstruction");
        objKpiLog.setTransactionCode(obj.getKeySearch());
        objKpiLog.setDescription("Thông tin tiến độ công trình");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        constructionTaskBusinessImpl.getCountConstruction(obj,
                objUser.getVpsUserInfo().getSysGroupId(), request);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(Response.Status.CREATED).build();
    }

    @Override
    public Response getCountConstructionForTc(GranttDTO obj) throws Exception {
        // TODO Auto-generated method stub
        return Response.ok(constructionTaskBusinessImpl.getCountConstructionForTc(obj)).build();
    }

    // chinhpxn20180714_start
    @Override
    public Response downloadFileForConstructionTask(HttpServletRequest request) throws Exception {
        String filePath = UEncrypt.decryptFileUploadPath(request.getQueryString());

        File file = new File(filePath);
        InputStream ExcelFileToRead = new FileInputStream(filePath);

        if (!file.exists()) {
            file = new File(filePath);
            if (!file.exists()) {
                // logger.warn("File {} is not found", fileName);
                return Response.status(Response.Status.BAD_REQUEST).build();
            }
        }

        XSSFWorkbook wb = new XSSFWorkbook(ExcelFileToRead);
        XSSFSheet sheet = wb.getSheetAt(1);

        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.WORK_PROGRESS, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");

        List<SysUserCOMSDTO> userLst = sysUserCOMSBusinessImpl.usersFillter(groupIdList);
        List<WorkItemDTO> workItemLst = workItemBusinessImpl.GetListData();

        if (userLst != null && !userLst.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            int i = 1;
            for (SysUserCOMSDTO dto : userLst) {
                Row row = sheet.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (i - 1));
                cell.setCellStyle(style);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getEmployeeCode()) ? dto.getEmployeeCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getLoginName()) ? dto.getLoginName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(3, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getFullName()) ? dto.getFullName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(4, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getEmail()) ? dto.getEmail() : "");
                cell.setCellStyle(style);
                cell = row.createCell(5, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getSysGroupName()) ? dto.getSysGroupName() : "");
                cell.setCellStyle(style);

            }
        }

        // //get data for sheet 2
        sheet = wb.getSheetAt(2);

        if (workItemLst != null && !workItemLst.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            int i = 1;
            for (WorkItemDTO dto : workItemLst) {
                Row row = sheet.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (i - 1));
                cell.setCellStyle(style);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getName()) ? dto.getName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getCode()) ? dto.getCode() : "");
                cell.setCellStyle(style);
            }
        }

        FileOutputStream fileOut = new FileOutputStream(file);
        // write this workbook to an Outputstream.
        wb.write(fileOut);
        wb.close();
        fileOut.flush();
        fileOut.close();
        String fileName = file.getName();
        int lastIndex = fileName.lastIndexOf(File.separatorChar);
        String fileNameReturn = fileName.substring(lastIndex + 1);

        return Response.ok((Object) file)
                .header("Content-Disposition", "attachment; filename=\"" + fileNameReturn + "\"").build();
    }

    private boolean isFolderAllowFolderSave(String folderDir) {
        return UString.isFolderAllowFolderSave(folderDir, allowFolderDir);
    }

    private boolean isExtendAllowSave(String fileName) {
        return UString.isExtendAllowSave(fileName, allowFileExt);
    }

    @Override
    public Response importConstructionTask(Attachment attachments, HttpServletRequest request) throws Exception {
    	//tanqn 2018112 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("importConstructionTask");
        objKpiLog.setDescription("Import công trình");
       // objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        //tanqn 20181112 end
        String folderParam = UString.getSafeFileName(request.getParameter("folder"));
        Long month = Long.parseLong(UString.getSafeFileName(request.getParameter("month")));
        Long year = Long.parseLong(UString.getSafeFileName(request.getParameter("year")));
        Long actionType = Long.parseLong(UString.getSafeFileName(request.getParameter("actionType")));
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

        if (!isExtendAllowSave(fileName)) {
            throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
        }

        // write & upload file to server
        try (InputStream inputStream = dataHandler.getInputStream();) {
            filePath = UFile.writeToFileServerATTT(inputStream, fileName, folderParam, folderUpload);
            filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
        } catch (Exception ex) {
            throw new BusinessException("Loi khi save file", ex);
        }

        Long sysGroupId = -1L;
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.WORK_PROGRESS, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        if (groupIdList.isEmpty()) {
            return Response.ok().entity(Response.Status.UNAUTHORIZED).build();
        } else if (groupIdList.size() > 1) {
            return Response.ok().entity(Response.Status.NOT_ACCEPTABLE).build();
        } else {
            sysGroupId = Long.parseLong(groupIdList.get(0));
        }

        try {

            try {
                java.util.List<ConstructionTaskDetailDTO> result = constructionTaskBusinessImpl
                        .importConstructionTask(filePath, request, month, year, actionType, sysGroupId);
                if (result != null && !result.isEmpty()
                        && (result.get(0).getErrorList() == null || result.get(0).getErrorList().size() == 0)) {
                    if (actionType == 1) {
                        result = constructionTaskBusinessImpl.updateListConstructionTaskPerformer(result, month, year,
                                filePath, actionType, sysGroupId, objUser);
                    } else {
                        Long detailMonthPlanId = constructionTaskDao.getDetailMonthPlan(month, year, sysGroupId);
                        if (detailMonthPlanId < 0) {
                            return Response.ok().entity(Response.Status.METHOD_NOT_ALLOWED).build();
                        } else {
                            result = constructionTaskBusinessImpl.addListConstructionTask(objUser, result, month, year,
                                    filePath, actionType, sysGroupId, detailMonthPlanId);
                        }
                    }
                    return Response.ok(result).build();
                } else if (result == null || result.isEmpty()) {
                	Date dEnd = new Date();
                    objKpiLog.setEndTime(dEnd);
                    objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                    objKpiLog.setStatus("0");
                    yearPlanBusinessImpl.addKpiLog(objKpiLog);
                    return Response.ok().entity(Response.Status.NO_CONTENT).build();
                } else {
                	Date dEnd = new Date();
                    objKpiLog.setEndTime(dEnd);
                    objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                    objKpiLog.setStatus("1");
                    yearPlanBusinessImpl.addKpiLog(objKpiLog);
                    return Response.ok(result).build();
                }
            } catch (Exception e) {
                return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
            }

        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    // chinhpxn20180714_end

    @Override
    public Response checkPermissions(ConstructionDetailDTO obj) {
        try {
            IllegalArgumentException e;
            // TODO Auto-generated method stub
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            Long id = constructionTaskBusinessImpl.checkPermissions(obj, sysGroupId, request);
            return Response.ok(id).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
    
    @Override
    public Response checkPermissionsApproved(ConstructionDetailDTO obj) {
        // TODO Auto-generated method stub
        try {
            // TODO Auto-generated method stub
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            return Response.ok(constructionTaskBusinessImpl.checkPermissionsApproved(obj, sysGroupId, request)).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
    
    //Tungtt20181203_ start
    @Override
    public Response checkPermissionsApprovedHSHC(ConstructionDetailDTO obj) {
        // TODO Auto-generated method stub
        try {
            // TODO Auto-generated method stub
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            return Response.ok(constructionTaskBusinessImpl.checkPermissionsApprovedHSHC(obj, sysGroupId, request)).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
    
    @Override
    public Response checkPermissionsUndo(ConstructionDetailDTO obj) {
        try {
            IllegalArgumentException e;
            // TODO Auto-generated method stub
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            Long id = constructionTaskBusinessImpl.checkPermissionsUndo(obj, sysGroupId, request);
            return Response.ok(id).build();
//            ConstructionDetailDTO constructionDetailDTO = constructionTaskBusinessImpl.getUserUpdate(obj.getRpHshcId());
//            if(constructionDetailDTO.getCompleteUserUpdate() == objUser.getVpsUserInfo().getSysUserId()) {
//            
//            }
            
            //return Response.ok(objUser.getVpsUserInfo().getSysUserId() ).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
    //Tungtt20181203_ end
    @Override
    public Response getListImageById(ConstructionTaskDTO obj) throws Exception {
        return Response.ok(constructionTaskBusinessImpl.getListImageById(obj)).build();
    }

    @Override
    public Response rpSumTask(ConstructionTaskDTO obj) {
    	//tanqn start 20181113
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("RP_SUM_TASK");
        objKpiLog.setDescription("Báo cáo tổng thể hạ tầng");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        //tanqn 20181113 end
//		hoanm1_20180815_start
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.DATA, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
//		hoanm1_20180815_end
        List<ConstructionTaskDTO> ls = constructionTaskBusinessImpl.rpSumTask(obj, groupIdList);
        if (ls == null) {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            DataListDTO data = new DataListDTO();
            data.setData(ls);
            data.setTotal(obj.getTotalRecord());
            data.setSize(ls.size());
            data.setStart(1);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(data).build();
        }//TANQN 20181113 end
    }

    @Override
    public Response exportExcelRpSumTask(ConstructionTaskDTO obj) throws Exception {
    	//tanqn start 20181113
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_EXCEL_RP_SUM_TASK");
        objKpiLog.setDescription("Báo cáo tổng thể hạ tầng");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Collections.singletonMap("fileName",
                    constructionTaskBusinessImpl.exportExcelRpSumTask(obj, request))).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        }//tanqn 20181113 end
        return null;
    }

    @Override
    public Response getWorkItemForAssign(WorkItemDetailDTO obj) throws Exception {
        List<WorkItemDetailDTO> result = constructionTaskBusinessImpl.getWorkItemForAssign(obj);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(result).build();
        }
    }

    @Override
    public Response getWorkItemForAddingTask(WorkItemDetailDTO obj) {
        List<WorkItemDTO> result = constructionTaskBusinessImpl.getWorkItemForAddingTask(obj);
        DataListDTO data = new DataListDTO();
        data.setData(result);
        data.setTotal(result.size());
//		data.setSize(obj.getPageSize());
        data.setStart(1);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(data).build();
        }
    }

    //tìm kiếm công trình khi thay đổi người thực hiện
    @Override
    public Response getConstrForChangePerformer(ConstructionTaskDTO obj) {
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.WORK_PROGRESS, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        if (groupIdList.isEmpty()) {
            throw new IllegalArgumentException(
                    "Không thể tạo công việc do người dùng chưa được phân quyền miền dữ liệu!");
        } else if (groupIdList.size() > 1) {
            throw new IllegalArgumentException(
                    "Không thể tạo công việc do người dùng được phân quyền nhiều miền dữ liệu!");
        } else {
            obj.setSysGroupId(Long.parseLong(groupIdList.get(0)));
        }

        List<ConstructionDTO> result = constructionTaskBusinessImpl.getConstrForChangePerformer(obj);
        DataListDTO data = new DataListDTO();
        data.setData(result);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(data).build();
        }
    }

    //tìm kiếm công trình khi thay đổi người thực hiện
    @Override
    public Response getForChangePerformerAutocomplete(ConstructionTaskDTO obj) {
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.WORK_PROGRESS, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        if (groupIdList.isEmpty()) {
            throw new IllegalArgumentException(
                    "Không thể tạo công việc do người dùng chưa được phân quyền miền dữ liệu!");
        } else if (groupIdList.size() > 1) {
            throw new IllegalArgumentException(
                    "Không thể tạo công việc do người dùng được phân quyền nhiều miền dữ liệu!");
        } else {
            obj.setSysGroupId(Long.parseLong(groupIdList.get(0)));
        }

        List<ConstructionDTO> result = constructionTaskBusinessImpl.getForChangePerformerAutocomplete(obj);
        return Response.ok(result).build();
    }

    //tìm kiếm người thực hiện khi thay đổi người thực hiện
    @Override
    public Response getPerformerAutocomplete(ConstructionTaskDTO obj) {
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.WORK_PROGRESS, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        List<SysUserDTO> result = constructionTaskBusinessImpl.getForChangePerformerAutocomplete(obj, groupIdList);
        return Response.ok(result).build();
    }

    //tìm kiếm người thực hiện khi thay đổi người thực hiện
    @Override
    public Response getPerformerForChanging(ConstructionTaskDTO obj) {
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.WORK_PROGRESS, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        List<SysUserDTO> result = constructionTaskBusinessImpl.getPerformerForChanging(obj, groupIdList);
        DataListDTO data = new DataListDTO();
        data.setData(result);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(data).build();
        }
    }

    @Override
    public Response findForChangePerformer(ConstructionTaskDTO obj) {
        DataListDTO result = constructionTaskBusinessImpl.findForChangePerformer(obj);
        return Response.ok(result).build();
    }

    @Override
    public Response updatePerformer(ConstructionTaskDetailDTO obj) {
    	//tanqn start 20181112
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("updatePerformer");
        objKpiLog.setDescription("Cập nhật thực hiện công trình");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        int result = constructionTaskBusinessImpl.updatePerformer(obj,objUser);
        if (result == -1) {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok().entity(Collections.singletonMap("error", "Cập nhật thất bại")).build();
        }else {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(result).build();
    }
    }//tanqn end 20181112
    //Huypq-20181017-start
    @Override
    public Response exportConstructionTaskSlow(GranttDTO granttSearch) throws Exception {
    	//tanqn 2018 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("exportConstructionTaskSlow");
        objKpiLog.setDescription("Thông tin tiến độ công trình");
        objKpiLog.setTransactionCode(granttSearch.getKeySearch());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            String strReturn = constructionTaskBusinessImpl.exportConstructionTaskSlow(granttSearch, sysGroupId,request);
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
    //Huypq-end
    
    @Override
    public Response importLDT(Attachment attachments, HttpServletRequest request) throws Exception {
    	String filePath = writeFileToServer(attachments, request);
    	 Long month = Long.parseLong(UString.getSafeFileName(request.getParameter("month")));
         Long year = Long.parseLong(UString.getSafeFileName(request.getParameter("year")));
         Long sysGroupId = -1L;
         String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                 Constant.AdResourceKey.WORK_PROGRESS, request);
         List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
         if (groupIdList.isEmpty()) {
             return Response.ok().entity(Response.Status.UNAUTHORIZED).build();
         } else if (groupIdList.size() > 1) {
             return Response.ok().entity(Response.Status.NOT_ACCEPTABLE).build();
         } else {
             sysGroupId = Long.parseLong(groupIdList.get(0));
         }
        try {
        	//tanqn 2018 start
        	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            KpiLogDTO objKpiLog = new KpiLogDTO();
            Date dStart = new Date();
            objKpiLog.setStartTime(dStart);
            objKpiLog.setCreateDatetime(dStart);
            objKpiLog.setFunctionCode("IMPORT_LDT");
            objKpiLog.setDescription("Thông tin tiến độ công trình");
            objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
            try {
            	 List<ConstructionTaskDetailDTO> result = constructionTaskBusinessImpl.importLDT(folderUpload + filePath,folderUpload + filePath, month, year,sysGroupId);
            	 Date dEnd = new Date();
                 objKpiLog.setEndTime(dEnd);
                 objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                 objKpiLog.setStatus("1");
                 yearPlanBusinessImpl.addKpiLog(objKpiLog);
            	 return Response.ok(result).build();
               
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
    
    @Override
    public Response importHSHC(Attachment attachments, HttpServletRequest request) throws Exception {
        String filePath = writeFileToServer(attachments, request);
        Long month = Long.parseLong(UString.getSafeFileName(request.getParameter("month")));
        Long year = Long.parseLong(UString.getSafeFileName(request.getParameter("year")));
        Long sysGroupId = -1L;
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.WORK_PROGRESS, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        if (groupIdList.isEmpty()) {
            return Response.ok().entity(Response.Status.UNAUTHORIZED).build();
        } else if (groupIdList.size() > 1) {
            return Response.ok().entity(Response.Status.NOT_ACCEPTABLE).build();
        } else {
            sysGroupId = Long.parseLong(groupIdList.get(0));
        }
        try {
        	//tanqn 2018 start
        	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            KpiLogDTO objKpiLog = new KpiLogDTO();
            Date dStart = new Date();
            objKpiLog.setStartTime(dStart);
            objKpiLog.setCreateDatetime(dStart);
            objKpiLog.setFunctionCode("IMPORT_HSHC");
            objKpiLog.setDescription("Thông tin tiến độ công trình");
            objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
            try {
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                return Response.ok(constructionTaskBusinessImpl.importHSHC(folderUpload + filePath,folderUpload + filePath, month, year,sysGroupId)).build();
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
    
  //Huypq_20181025-start-chart
	@Override
	public Response getDataChart(ConstructionTaskDTO obj){
		List<ConstructionTaskDTO> result = constructionTaskBusinessImpl.getDataChart(obj);
		
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(result).build();
        }
	}
	
	@Override
	public Response getDataChartAcc(ConstructionTaskDTO obj){
		List<ConstructionTaskDTO> result = constructionTaskBusinessImpl.getDataChartAcc(obj);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(result).build();
        }
	}
	//Huypq_20181025-end-chart


    //VietNT_20181128_start
    @Override
    @SuppressWarnings("Duplicates")
    public Response importConstructionHSHC(Attachment attachments, HttpServletRequest request) throws Exception {
        KttsUserSession userSession = userRoleBusinessImpl.getUserSession(request);
        Long sysUserId = userSession.getSysUserId();
        String folderParam = this.getFolderParam(request);
        String filePath = this.uploadToServer(attachments, folderParam);

        try {
            ConstructionHSHCDTOHolder res = constructionTaskBusinessImpl.doImportConstructionHSHC(filePath, sysUserId);
            List<RpHSHCDTO> result = res.getRpHSHCDTOS();
            if (result != null && !result.isEmpty()
                    && (result.get(0).getErrorList() == null || result.get(0).getErrorList().size() == 0)) {
                constructionTaskBusinessImpl.doUpdateHSHC(result, res.getConstructionDTOS());

                return Response.ok(result).build();
            } else if (result == null || result.isEmpty()) {
                return Response.ok().entity(Response.Status.NO_CONTENT).build();
            } else {
                return Response.ok(result).build();
            }
        } catch (IllegalArgumentException ex) {
            return Response.ok().entity(Collections.singletonMap("error", ex.getMessage())).build();
        }
    }

    @SuppressWarnings("Duplicates")
    private String getFolderParam(HttpServletRequest request) {
        String folderParam = UString.getSafeFileName(request.getParameter("folder"));
        if (UString.isNullOrWhitespace(folderParam)) {
            folderParam = defaultSubFolderUpload;
        } else {
            if (!isFolderAllowFolderSave(folderParam)) {
                throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
            }
        }
        return folderParam;
    }

    @SuppressWarnings("Duplicates")
    private String uploadToServer(Attachment attachments, String folderParam) {
        DataHandler dataHandler = attachments.getDataHandler();

        // get filename to be uploaded
        MultivaluedMap<String, String> multivaluedMap = attachments.getHeaders();
        String fileName = UFile.getFileName(multivaluedMap);

        if (!isExtendAllowSave(fileName)) {
            throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
        }

        // write & upload file to server
        try (InputStream inputStream = dataHandler.getInputStream()) {
            // upload to server, return file path
            return UFile.writeToFileServerATTT(inputStream, fileName, folderParam, folderUpload);
        } catch (Exception ex) {
            throw new BusinessException("Loi khi save file", ex);
        }
    }

    
    @Override
	public Response downloadTemplateFileHSHC(ConstructionTaskDetailDTO dto) throws Exception {
        try {
            String filePath = constructionTaskBusinessImpl.makeTemplateHSHC(dto);
            return Response.ok(Collections.singletonMap("fileName", filePath)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }
//
//    public Response downloadTemplateFileHSHC(HttpServletRequest request) throws Exception {
//        String filePath = constructionTaskBusinessImpl.makeTemplateHSHC();
//        return Response.ok(Collections.singletonMap("fileName", filePath)).build();
//    }

    //VietNT_end
    //VietNT_20181207_start
    @Override
    public Response getConstructionByStationId(ConstructionDTO criteria) throws Exception {
        DataListDTO results;
//        if (null != criteria.getCatStationId()) {
            results = constructionTaskBusinessImpl.getConstructionByStationId(criteria);
            return Response.ok(results).build();
//        }

//        results = new DataListDTO();
//        results.setData(new ArrayList());
//        return Response.ok(results).build();
    }
    //VietNT_end
}
