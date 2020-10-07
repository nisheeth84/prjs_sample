/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.TmpnTargetBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.config.JasperReportConfig;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.ReportPlanDTO;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
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

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import java.io.File;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author HungLQ9
 */
public class TmpnTargetRsServiceImpl implements TmpnTargetRsService {

    protected final Logger log = Logger.getLogger(TmpnTargetRsServiceImpl.class);
    @Autowired
    TmpnTargetBusinessImpl tmpnTargetBusinessImpl;
    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;
    @Value("${allow.folder.dir}")
    private String allowFolderDir;
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
    @Context
    HttpServletRequest request;

    @Override
    public Response reportProgress(ReportPlanDTO obj) {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("REPORT_PROGRESS");
        objKpiLog.setDescription("Tiến độ KH tháng");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = tmpnTargetBusinessImpl.reportProgress(obj);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        
        return Response.ok(data).build();
    }

    @Override
    public Response exportPlanProgress(ReportPlanDTO obj) throws Exception {
    	KttsUserSession objUserS = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_PLAN_PROGRESS");
        objKpiLog.setDescription("Tiến độ KH tháng");
        objKpiLog.setCreateUserId(objUserS.getVpsUserInfo().getSysUserId());
        try {
        	
            UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
            String strReturn = tmpnTargetBusinessImpl.exportPlanProgress(obj, objUser.getUserName());
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
    public Response rpMonthProgress(ReportPlanDTO dto) throws Exception {
        if (dto != null) {
            return rpMonthProgressDetaill(dto);
        }
        return null;
    }

    private Response rpMonthProgressDetaill(ReportPlanDTO dto) throws Exception {
        UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
        dto.setUserName(objUser.getUserName());
        ReportPlanDTO data = tmpnTargetBusinessImpl.rpMonthProgressDetaill(dto);

        ConcurrentHashMap<String, Object> params = new ConcurrentHashMap<String, Object>();
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String reportPath = classloader.getResource("../" + "doc-template").getPath();
        String filePath = reportPath + "/Tien_Do_Ke_Hoach_Thang.jasper";
        JRBeanCollectionDataSource tbl1 = new JRBeanCollectionDataSource(data.getReportPlanList());
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
        params.put("sysGroupName", data.getSysGroupName());
//			params.put("totalMonney", data.getTotalMonney());
//			if(dto.getNameDVYC()!= null){
//				params.put("nameDVYC", dto.getNameDVYC());
//			}
//			if(dto.getNamePetitioner()!=null){
//				params.put("namePetitioner", dto.getNamePetitioner());
//			}
//			if(dto.getShipper()!=null){
//				params.put("shipper", dto.getShipper());
//			}
        JasperPrint jasperPrint = JasperFillManager.fillReport(filePath, params, new JREmptyDataSource());
        jasperPrint.addStyle(JasperReportConfig.getNormalStyle(reportPath));
        String pathReturn = generateLocationFile();
        File udir = new File(folderUpload + pathReturn);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        File file = new File(folderUpload + pathReturn + File.separator + "Tien_Do_Ke_Hoach_Thang.pdf");
        // JasperExportManager.exportReportToPdfFile(jasperPrint,folderUpload+pathReturn
        // +"KehoachThangChiTiet.pdf");
//			  JRDocxExporter exporter = new JRDocxExporter();
//			  exporter.setParameter(JRExporterParameter.CHARACTER_ENCODING,
//						"UTF-8");
//		      exporter.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
//		      exporter.setParameter(JRExporterParameter.OUTPUT_FILE, file);
//		      exporter.exportReport();

        JRPdfExporter exporterpdf = new JRPdfExporter();

        exporterpdf.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
        exporterpdf.setParameter(JRExporterParameter.CHARACTER_ENCODING, "UTF-8");
        exporterpdf.setParameter(JRExporterParameter.OUTPUT_FILE, file);

        exporterpdf.exportReport();
        if (file.exists()) {
            ResponseBuilder response = Response.ok(file);
            response.header("Content-Disposition", "attachment; filename=\"" + "Tien_Do_Ke_Hoach_Thang.pdf" + "\"");
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

}
