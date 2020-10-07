/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.business.YearPlanDetailBusinessImpl;
import com.viettel.coms.config.JasperReportConfig;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.ReportPlanDTO;
import com.viettel.coms.dto.YearPlanDetailDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;
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
import javax.ws.rs.core.Response.ResponseBuilder;
import java.io.File;
import java.io.InputStream;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author HungLQ9
 */
public class YearPlanDetailRsServiceImpl implements YearPlanDetailRsService {

    protected final Logger log = Logger.getLogger(YearPlanDetailRsServiceImpl.class);
    @Autowired
    YearPlanDetailBusinessImpl yearPlanDetailBusinessImpl;
    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;
    @Value("${allow.folder.dir}")
    private String allowFolderDir;
    @Context
    HttpServletRequest request;
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
    @Override
    public Response getYearPlanDetail() {
        List<YearPlanDetailDTO> ls = yearPlanDetailBusinessImpl.getAll();
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
    public Response getYearPlanDetailById(Long id) {
        YearPlanDetailDTO obj = (YearPlanDetailDTO) yearPlanDetailBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateYearPlanDetail(YearPlanDetailDTO obj) {
        Long id = yearPlanDetailBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addYearPlanDetail(YearPlanDetailDTO obj) {
        Long id = yearPlanDetailBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteYearPlanDetail(Long id) {
        YearPlanDetailDTO obj = (YearPlanDetailDTO) yearPlanDetailBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            yearPlanDetailBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }

    @Override
    public Response importYearPlanDetail(Attachment attachments, HttpServletRequest request) throws Exception {

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

            try {

                return Response.ok(yearPlanDetailBusinessImpl.importYearPlanDetail(folderUpload + filePath, filePath))
                        .build();
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
    public Response reportProgress(ReportPlanDTO obj) {
    	//tanqn 20181113 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("REPORT_PROGRESS_REPORT_PLAN");
        //objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setDescription("Tiến độ KH năm");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = yearPlanDetailBusinessImpl.reportProgress(obj);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
    }//tanqn 20181113 end

    @Override
    public Response exportYearPlanProgress(ReportPlanDTO obj) throws Exception {
    	KttsUserSession objUserS = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_DETAIL_MONTH_PLAN");
        //objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setDescription("Tiến độ KH năm");
        objKpiLog.setCreateUserId(objUserS.getVpsUserInfo().getSysUserId());
        try {
            UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
            obj.setUserName(objUser.getUserName());
            String strReturn = yearPlanDetailBusinessImpl.exportYearPlanProgress(obj);
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
    public Response rpYearProgress(ReportPlanDTO dto) throws Exception {
        if (dto != null) {
            return rpYearProgressDetaill(dto);
        }
        return null;
    }

    private Response rpYearProgressDetaill(ReportPlanDTO dto) throws Exception {
        UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
        dto.setUserName(objUser.getUserName());
        ReportPlanDTO data = yearPlanDetailBusinessImpl.rpYearProgressDetaill(dto);

        ConcurrentHashMap<String, Object> params = new ConcurrentHashMap<String, Object>();
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String reportPath = classloader.getResource("../" + "doc-template").getPath();
        String filePath = reportPath + "/Tien_Do_Ke_Hoach_Nam.jasper";
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
        File file = new File(folderUpload + pathReturn + File.separator + "Export_Tien_Do_Ke_Hoach_Nam.pdf");
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
            response.header("Content-Disposition",
                    "attachment; filename=\"" + "Export_Tien_Do_Ke_Hoach_Nam.pdf" + "\"");
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
