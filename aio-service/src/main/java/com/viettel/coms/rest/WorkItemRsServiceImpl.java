/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import java.io.File;
import java.text.DecimalFormat;
import java.text.Format;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import viettel.passport.client.UserToken;

import com.viettel.coms.business.WorkItemBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.config.JasperReportConfig;
import com.viettel.coms.dao.ConstructionTaskDAO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.CNTContractDTO;
import com.viettel.coms.dto.CommonDTO;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.ObstructedDetailDTO;
import com.viettel.coms.dto.SynStockTransDTO;
import com.viettel.coms.dto.SynStockTransDetailDTO;
import com.viettel.coms.dto.SynStockTransDetailSerialDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;

/**
 * @author HungLQ9
 */
public class WorkItemRsServiceImpl implements WorkItemRsService {

    protected final Logger log = Logger.getLogger(WorkItemRsServiceImpl.class);
    @Autowired
    WorkItemBusinessImpl workItemBusinessImpl;
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
    @Autowired
    ConstructionTaskDAO constructionTaskDao;
    @Autowired
    UtilAttachDocumentDAO utilAttachDocumentDAO;
    @Context
    HttpServletRequest request;

    @Context
    HttpServletResponse response;
    @Value("${folder_upload2}")
    private String folderUpload;
    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Override
    public Response remove(WorkItemDetailDTO obj) {
        // TODO Auto-generated method stub
    	//tanqn start 20181115
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
        objKpiLog.setFunctionCode("DELETE_CONSTRUCTION_WORK_ITEM");
        objKpiLog.setTransactionCode(obj.getWorkItemName());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            workItemBusinessImpl.remove(obj);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        } catch (Exception e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
        return Response.ok().build();

    }

    @Override
    public Response add(WorkItemDetailDTO obj) throws Exception {
//		UserToken objUser = (UserToken) request.getSession().getAttribute(
//				"vsaUserToken");
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        //tanqn start 20181115
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
        objKpiLog.setFunctionCode("INSERT_WORK_ITEM");
        objKpiLog.setTransactionCode(obj.getWorkItemName());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            obj.setCreatedUserId(objUser.getVpsUserInfo().getSysUserId());
            obj.setStatus("1");
            obj.setCreatedDate(new Date());
            obj.setCreatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
            Long ids = workItemBusinessImpl.addWorkItem(obj);
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
    public Response update(WorkItemDetailDTO obj) throws Exception {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Response getById(WorkItemDetailDTO obj) throws Exception {
        // TODO Auto-generated method stub
        WorkItemDetailDTO data = workItemBusinessImpl.getById(obj);
        return Response.ok(data).build();

    }

    @Override
    public Response doSearch(WorkItemDetailDTO obj) {
        // Tienth_20180329 Start
//		UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
//		obj.setSysGroupId(Long.parseLong(constructionTaskDao.getSysGroupId(objUser.getUserName())));
        // hàlv
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        //tanqn 20181113 start
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_CONSTRUCTION_WORKITEM");
        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        obj.setSysGroupId(objUser.getVpsUserInfo().getSysGroupId());
        // Haflv end
        // Tienth_20180329 END
        DataListDTO data = workItemBusinessImpl.doSearch(obj);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        //tanqn 20181113 end
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchComplete(WorkItemDetailDTO obj) {
        DataListDTO data = workItemBusinessImpl.doSearchComplete(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchQuantity(WorkItemDetailDTO obj) {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_WORKITEM");
        objKpiLog.setDescription("Quản lý sản lượng");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = workItemBusinessImpl.doSearchQuantity(obj, request);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dStart.getSeconds()- dEnd.getSeconds()));
        objKpiLog.setStatus("0");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchCompleteDate(WorkItemDetailDTO obj) {
        DataListDTO data = workItemBusinessImpl.doSearchCompleteDate(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchCovenant(CNTContractDTO obj) {
        DataListDTO data = workItemBusinessImpl.doSearchCovenant(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchContractInput(CNTContractDTO obj) {
        DataListDTO data = workItemBusinessImpl.doSearchContractInput(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response approveWorkItem(WorkItemDetailDTO obj) {
        // TODO Auto-generated method stub
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_WORKITEM");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            workItemBusinessImpl.approveWorkItem(obj, request);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dStart.getSeconds()- dEnd.getSeconds()));
            objKpiLog.setStatus("0");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response approveCompleteWorkItem(WorkItemDetailDTO obj) {
        // TODO Auto-generated method stub
        try {
            workItemBusinessImpl.approveCompleteWorkItem(obj, request);
            return Response.ok(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response saveCancelConfirmPopup(WorkItemDetailDTO obj) {
        try {
            // TODO Auto-generated method stub
            workItemBusinessImpl.saveCancelConfirmPopup(obj, request);
            return Response.ok().build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response doSearchDeliveryBill(SynStockTransDTO obj) {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_DELEVERY_BILL");
        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
        objKpiLog.setTransactionCode(obj.getOrderCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = workItemBusinessImpl.doSearchDeliveryBill(obj);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchEntangled(ObstructedDetailDTO obj) {
    	//tanqn 20181113 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_DELEVERY_BILL");
        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = workItemBusinessImpl.doSearchEntangled(obj);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
        //tanqn 20181113 end
    }

    public Response doSearchForReport(WorkItemDetailDTO obj) {
    	//tanqn 20181113 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_WORK_ITEM_DETAIL");
        objKpiLog.setDescription("Sản lượng theo ngày");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = workItemBusinessImpl.doSearchForReport(obj);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
        //tanqn 20181113 end
    }

    @Override
    public Response doSearchDetailForReport(WorkItemDetailDTO obj) {
        DataListDTO data = workItemBusinessImpl.doSearchDetailForReport(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response exportCompleteProgress(WorkItemDetailDTO obj) throws Exception {
        try {
            String strReturn = workItemBusinessImpl.exportCompleteProgress(obj);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response GoodsListTable(SynStockTransDetailDTO obj) {
        DataListDTO data = workItemBusinessImpl.GoodsListTable(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response GoodsListDetail(SynStockTransDetailSerialDTO obj) {
        DataListDTO data = workItemBusinessImpl.GoodsListDetail(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response updateInConstruction(WorkItemDetailDTO obj) throws Exception {
    	//tanqn 20181113 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("UPDATE_WORK_ITEM_DETAIL");
        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
        objKpiLog.setTransactionCode(obj.getWorkItemName());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
            obj.setUpdatedDate(new Date());
            obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
            Long ids = workItemBusinessImpl.updateInConstruction(obj);
            if (ids == 0l) {
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                objKpiLog.setReason("Lỗi  khi cập nhật");
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

    public Response removeFillterWorkItem(WorkItemDetailDTO obj) throws Exception {
        try {
            Long id = workItemBusinessImpl.removeFillterWorkItem(obj.getWorkItemDetailList(),
                    obj.getApproveDescription(), request);
            if (id == 0l) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }

    }

    public Response exportCovenantProgress(CNTContractDTO obj) throws Exception {
    	//tanqn 20181113 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_COVENANT_PROGRESS");
        objKpiLog.setDescription("Thông tin đầu ra");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            String strReturn = workItemBusinessImpl.exportCovenantProgress(obj);
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
        //tanqn 20181113 end
        return null;
    }

    @Override
    public Response getListImageById(CommonDTO obj) throws Exception {
        return Response.ok(workItemBusinessImpl.getListImageById(obj)).build();
    }

    @Override
    public Response getListImageWorkItemId(Long id) throws Exception {
        return Response.ok(workItemBusinessImpl.getListImageWorkItemId(id)).build();
    }

    @Override
    public Response exportWorkItemServiceTask(WorkItemDetailDTO obj) throws Exception {
    	//tanqn 20181113 start
    	KttsUserSession objUsers = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_WORK_ITEM_DETAIL");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setDescription("Xuất excel quản lý sản lượng");
        objKpiLog.setCreateUserId(objUsers.getVpsUserInfo().getSysUserId());
        try {
            String strReturn = workItemBusinessImpl.exportWorkItemServiceTask(obj, request);
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
    public Response exportSLTN(WorkItemDetailDTO obj) throws Exception {
    	//tanqn 20181113 start
    	KttsUserSession objUsers = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_DETAIL_MONTH_PLAN");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setDescription("Sản lượng theo ngày");
        objKpiLog.setCreateUserId(objUsers.getVpsUserInfo().getSysUserId());
        try {
            UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
            obj.setUserName(objUser.getUserName());
            String strReturn = workItemBusinessImpl.exportSLTN(obj);
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
    }//tanqn 20181113 end

    private String numberFormat(double value) {
        DecimalFormat myFormatter = new DecimalFormat("###,###.####");
        String percentageEN = myFormatter.format(value);

        return percentageEN;
    }

    @Override
    public Response exportPdfSLTN(WorkItemDetailDTO obj) throws Exception {
        UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
        KttsUserSession objSec = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        objSec.getVpsUserInfo().getDepartmentName();
        obj.setPage(null);
        obj.setPageSize(null);
        List<WorkItemDetailDTO> ls = workItemBusinessImpl.getDataForExport(obj);
        if (ls != null & !ls.isEmpty()) {
            long count = 1;
            for (WorkItemDetailDTO dto : ls) {
                dto.setStt(count++);
                if (dto.getQuantity() != null) {
                    NumberFormat numberFormatter = new DecimalFormat("###,###.####");
                    String result = numberFormatter.format(dto.getQuantity());
                    dto.setSanLuongP(result);
                } else {
                    dto.setSanLuongP("");
                }
            }
        }
        ConcurrentHashMap<String, Object> params = new ConcurrentHashMap<String, Object>();
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String reportPath = classloader.getResource("../" + "doc-template").getPath();
        // JasperCompileManager.compileReportToFile(reportPath +
        // "/KeHoachThangChiTiet.jrxml");
        String filePath = reportPath + "/SanLuongTheoNgay.jasper";
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
        params.put("year", yyyy);
        if (obj.getDateBD() != null) {
            String strDateBD = new SimpleDateFormat("dd-MM-yyyy").format(obj.getDateBD());
            params.put("dateBD", strDateBD);
        }
        if (obj.getDateKT() != null) {
            String strDateKT = new SimpleDateFormat("dd-MM-yyyy").format(obj.getDateKT());
            params.put("dateKT", strDateKT);
        }
        String sysGroupName = objSec.getVpsUserInfo().getDepartmentName();
        params.put("sysGroupName", sysGroupName);
        JasperPrint jasperPrint = JasperFillManager.fillReport(filePath, params, new JREmptyDataSource());
        jasperPrint.addStyle(JasperReportConfig.getNormalStyle(reportPath));
        String pathReturn = generateLocationFile();
        File udir = new File(folderUpload + pathReturn);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        File file = new File(folderUpload + pathReturn + File.separator + "SanLuongTheoNgay1.pdf");
        // JasperExportManager.exportReportToPdfFile(jasperPrint,folderUpload+pathReturn
        // +"KehoachThangChiTiet.pdf");
        JRPdfExporter exporterpdf = new JRPdfExporter();

        exporterpdf.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
        exporterpdf.setParameter(JRExporterParameter.CHARACTER_ENCODING, "UTF-8");
        exporterpdf.setParameter(JRExporterParameter.OUTPUT_FILE, file);

        exporterpdf.exportReport();
        if (file.exists()) {
            ResponseBuilder response = Response.ok(file);
            response.header("Content-Disposition", "attachment; filename=\"" + "SanLuongTheoNgay1.pdf" + "\"");
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
    public Response exportPdfSLTNCT(WorkItemDetailDTO obj) throws Exception {
        UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
        KttsUserSession objSec = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        objSec.getVpsUserInfo().getDepartmentName();
        obj.setPage(null);
        obj.setPageSize(null);
        List<WorkItemDetailDTO> ls = workItemBusinessImpl.getDataForExportDetail(obj);
        if (ls != null & !ls.isEmpty()) {
            long count = 1;
            for (WorkItemDetailDTO dto : ls) {
                dto.setStt(count++);
                if (dto.getApproveQuantity() != null) {
                    NumberFormat numberFormatter = new DecimalFormat("###,###.####");
                    String result = numberFormatter.format(dto.getApproveQuantity());
                    dto.setSanLuongP(result);
                } else {
                    dto.setSanLuongP("");
                }

            }
        }
        Date dateNow = new Date();
        ConcurrentHashMap<String, Object> params = new ConcurrentHashMap<String, Object>();
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String reportPath = classloader.getResource("../" + "doc-template").getPath();
        // JasperCompileManager.compileReportToFile(reportPath +
        // "/KeHoachThangChiTiet.jrxml");
        String filePath = reportPath + "/SanLuongTheoNgayChiTiet.jasper";
        // params.put("HK12Param", colectionDataSource);
        JRBeanCollectionDataSource tbl1 = new JRBeanCollectionDataSource(ls);
        params.put("tbl1", tbl1);
        Format formatter = new SimpleDateFormat("dd");
        String dd = formatter.format(new Date());
        formatter = new SimpleDateFormat("MM");
        String mm = formatter.format(new Date());
        formatter = new SimpleDateFormat("yyyy");
        String yyyy = formatter.format(new Date());
        String strDateNow = new SimpleDateFormat("dd-MM-yyyy").format(dateNow);
        params.put("dateNow", strDateNow);
        if (obj.getDateBD() != null) {
            String strDateBD = new SimpleDateFormat("dd-MM-yyyy").format(obj.getDateBD());
            params.put("dateBD", strDateBD);
        }
        if (obj.getDateKT() != null) {
            String strDateKT = new SimpleDateFormat("dd-MM-yyyy").format(obj.getDateKT());
            params.put("dateKT", strDateKT);
        }
        String sysGroupName = objSec.getVpsUserInfo().getDepartmentName();
        params.put("sysGroupName", sysGroupName);
        JasperPrint jasperPrint = JasperFillManager.fillReport(filePath, params, new JREmptyDataSource());
        jasperPrint.addStyle(JasperReportConfig.getNormalStyle(reportPath));
        String pathReturn = generateLocationFile();
        File udir = new File(folderUpload + pathReturn);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        File file = new File(folderUpload + pathReturn + File.separator + "SanLuongTheoNgayChitiet.pdf");
        // JasperExportManager.exportReportToPdfFile(jasperPrint,folderUpload+pathReturn
        // +"KehoachThangChiTiet.pdf");
        JRPdfExporter exporterpdf = new JRPdfExporter();

        exporterpdf.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
        exporterpdf.setParameter(JRExporterParameter.CHARACTER_ENCODING, "UTF-8");
        exporterpdf.setParameter(JRExporterParameter.OUTPUT_FILE, file);

        exporterpdf.exportReport();
        if (file.exists()) {
            ResponseBuilder response = Response.ok(file);
            response.header("Content-Disposition", "attachment; filename=\"" + "SanLuongTheoNgayChitiet.pdf" + "\"");
            return response.build();
        }
        return null;
    }

    @Override
    public Response exportVuongFile(ObstructedDetailDTO obj) throws Exception {
    	//tanqn 20181113 start 
    	KttsUserSession objUsers = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_VƯỚNG_FILE");
        objKpiLog.setDescription("Xuất exportVuongFile");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUsers.getVpsUserInfo().getSysUserId());
        try {
            UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            String strReturn = workItemBusinessImpl.exportVuongFile(obj);
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
        //tanqn 20181113 end
    }

    @Override
    public Response doSearchForTask(WorkItemDetailDTO obj) {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        obj.setSysGroupId(objUser.getVpsUserInfo().getSysGroupId());
        DataListDTO data = workItemBusinessImpl.doSearchForTask(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response exportDeliveryBill(SynStockTransDTO obj) throws Exception {
    	//tanqn 20181113 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_DELIVERY_BILL");
        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            String strReturn = workItemBusinessImpl.exportDeliveryBill(obj);
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
        //tanqn 20181113 end
    }

    @Override
    public Response checkPermissionsCancelConfirm(WorkItemDetailDTO obj) {
        try {
            // TODO Auto-generated method stub
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            Long id = workItemBusinessImpl.checkPermissionsCancelConfirm(obj, sysGroupId, request);
            return Response.ok(id).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response checkPermissionsApproved(WorkItemDetailDTO obj) {
        // TODO Auto-generated method stub
        try {
            // TODO Auto-generated method stub
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            return Response.ok(workItemBusinessImpl.checkPermissionsApproved(obj, sysGroupId, request)).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

}
