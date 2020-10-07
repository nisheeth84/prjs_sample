/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.google.common.collect.Lists;
import com.mchange.io.FileUtils;
import com.viettel.coms.business.DetailMonthPlanBusinessImpl;
import com.viettel.coms.business.GoodsPlanBusinessImpl;
import com.viettel.coms.business.SignVofficeBusinessImpl;
import com.viettel.coms.business.TotalMonthPlanBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.config.JasperReportConfig;
import com.viettel.coms.dto.*;
import com.viettel.coms.utils.ConverObjectToPDF;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.utils.DateTimeUtils;
import com.viettel.utils.PdfUtils;
import com.viettel.voffice.ws_autosign.service.FileAttachTranfer;
import com.viettel.voffice.ws_autosign.service.FileAttachTranferList;
import com.viettel.wms.business.CommonBusiness;
import com.viettel.wms.business.StockTransBusinessImpl;
import com.viettel.wms.business.UserRoleBusinessImpl;
import com.viettel.wms.constant.Constants;
import com.viettel.wms.dto.StockTransDTO;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRPdfExporterParameter;
import net.sf.jasperreports.engine.export.JRXlsExporterParameter;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.Session;
import org.hibernate.jdbc.Work;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.io.*;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ReportRsServiceImpl implements ReportRsService {

     protected final Logger log = Logger.getLogger(ReportRsServiceImpl.class);
    @Context
    HttpServletRequest request;
    @Autowired
    SignVofficeBusinessImpl signVofficeBusinessImpl;
    @Autowired
    CommonBusiness commonBusiness;
    @Autowired
    StockTransBusinessImpl stockTransBusinessImpl;
    @Autowired
    UserRoleBusinessImpl userRoleBusinessImpl;
    @Autowired
    YearPlanBusinessImpl yearPlanBussinessImpl;
    @Autowired
    TotalMonthPlanBusinessImpl totalMonthPlanBusinessImpl;
    @Autowired
    GoodsPlanBusinessImpl goodsPlanBusinessImpl;
    @Autowired
    DetailMonthPlanBusinessImpl detailMonthPlanBusinessImpl;
    private String KE_HOACH_NAM = "KeHoachNam";
    private String KE_HOACH_THANG_TONG_THE = "KeHoachThangTongThe";
    private String KE_HOACH_THANG_CHI_TIET = "KeHoachThangChiTiet";
    private String BTS = "Công trình BTS";
    private String LE = "Công trình lẻ";
    private String TUYEN = "Công trình tuyến";
    private String GPON = "Công trình GPON";
    private static final int WIDTH = 5000;
    @Context
    HttpServletResponse response;
    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;
    
    @Value("${temp_sub_folder_upload}")
	private String tempFileFolderUpload;
    
    @Override
    public Response exportPdf(CommonDTO obj)
            throws IntrospectionException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {

        if ("BienBanBanGiao".equals(obj.getReportName())) {
            StockTransDTO stockTrans = new StockTransDTO();
            ArrayList<Long> listDeptReceiverId = new ArrayList<Long>();
            for (int i = 0; i < obj.getListStockTransId().size(); i++) {
                stockTrans = stockTransBusinessImpl.getStockTransDetail(obj.getListStockTransId().get(i));
                if (stockTrans.getDeptReceiveId() != null) {
                    listDeptReceiverId.add(stockTrans.getDeptReceiveId());
                    for (int j = 0; j < listDeptReceiverId.size(); j++) {
                        if (stockTrans.getDeptReceiveId() != listDeptReceiverId.get(j)) {
                            ResponseBuilder response = Response.ok(obj.getReportName());
                            response.header("error", "error1");
                            return response.build();
                        }

                    }
                } else {
                    ResponseBuilder response = Response.ok(obj.getReportName());
                    response.header("error", "error2");
                    return response.build();
                }

            }
        }
        String err = validateData(obj);

        if (StringUtils.isNotEmpty(err)) {
            ResponseBuilder response = Response.ok(err);
            response.header("error", err);
            return response.build();

        }

        if (Constants.DASH_BROAD.equals(obj.getReportGroup())) {
            List<Long> list = commonBusiness.getListDomainData(Constants.OperationKey.VIEW,
                    Constants.AdResourceKey.STOCK, request);
            obj.setListStockId(list);
        }

        if (Constants.LISTREPORTNAMESTOCKNULL.contains(obj.getReportName()) && obj.getListStockId().size() == 0) {
            List<Long> list = commonBusiness.getListDomainData(Constants.OperationKey.REPORT,
                    Constants.AdResourceKey.STOCK, request);
            obj.setListStockId(list);
        }

        Session session = signVofficeBusinessImpl.gettDAO().getSessionFactory().openSession();

        HashMap<String, Object> params = new HashMap<String, Object>();
        BeanInfo info = Introspector.getBeanInfo(obj.getClass());
        for (PropertyDescriptor pd : info.getPropertyDescriptors()) {
            Method reader = pd.getReadMethod();
            if (reader != null)
                params.put(pd.getName(), reader.invoke(obj));
        }
        String reportName = obj.getReportName();
        List<String> reportNames = obj.getReportNames();
        try {

            String path = System.getProperty("java.io.tmpdir");
            String prefix = makePrefix(reportName);
            File file = null;
            if ("PDF".equals(obj.getReportType())) {
                file = File.createTempFile(prefix, ".pdf", new File(path));
                generateReport(session, reportName, null, Constants.PDF_REPORT, params, file, "ABC");
            } else if ("EXCEL".equals(obj.getReportType())) {
                file = File.createTempFile(prefix, ".xlsx", new File(path));
                generateReport(session, reportName, null, Constants.EXCEL_REPORT, params, file, "ABC");
            } else if ("EXCEL_MUL".equals(obj.getReportType())) {
                file = File.createTempFile(prefix, ".xlsx", new File(path));
                generateReport2(session, reportNames, null, Constants.EXCEL_REPORT, params, file, "ABC");
            } else {
                file = File.createTempFile(prefix, ".docx", new File(path));
                generateReport(session, reportName, null, Constants.DOC_REPORT, params, file, "ABC");
            }
            session.close();
            if (file.exists()) {
                ResponseBuilder response = Response.ok(file);
                return response.build();
            }

            reportName = null;

            return Response.status(Response.Status.NO_CONTENT).build();
        } catch (Exception e) {
            session.close();
            return Response.status(Response.Status.NO_CONTENT).build();
        }
    }

    private String makePrefix(String name) {
        StringBuffer prefix = new StringBuffer();
        char[] nameArray = name.toCharArray();
        for (char ch : nameArray) {
            if (Character.isLetterOrDigit(ch)) {
                prefix.append(ch);
            } else {
                prefix.append("_");
            }
        }
        return prefix.toString();
    }

    private JasperPrint jasperPrint = null;

    private void generateReport(Session session, String reportName, String filePath, int reportType, HashMap params,
                                File file, String title) {
        session.doWork(new Work() {
            @SuppressWarnings({"unchecked", "unused"})
            public void execute(Connection connection) throws SQLException {
                try {
                    jasperPrint = null;
                    ClassLoader classloader = Thread.currentThread().getContextClassLoader();
                    String reportPath = classloader.getResource("../" + "doc-template").getPath();
                    File fielRe = new File(reportPath + reportName + ".jasper");
                    InputStream reportStream = new FileInputStream(fielRe);

                    if (jasperPrint == null) {
                        System.out.println(" Begin fillReport  ");
                        jasperPrint = JasperFillManager.fillReport(reportStream, params, connection);
                        System.out.println(" END fillReport ");
                        jasperPrint.setProperty("net.sf.jasperreports.export.xls.remove.empty.space.between.rows",
                                "true");

                    }

                    try {
                        connection.close();
                    } catch (SQLException e) {

                        e.printStackTrace();
                        ;
                    }
                    connection = null;

                    switch (reportType) {
                        case Constants.PDF_REPORT:

                            JRPdfExporter exporterpdf = new JRPdfExporter();

                            exporterpdf.setParameter(JRPdfExporterParameter.FORCE_LINEBREAK_POLICY, Boolean.FALSE);
                            // exporterpdf.setParameter(JRPdfExporterParameter.FORCE_SVG_SHAPES,
                            // Boolean.TRUE);
                            exporterpdf.setParameter(JRPdfExporterParameter.IS_COMPRESSED, Boolean.TRUE);
                            exporterpdf.setParameter(JRPdfExporterParameter.METADATA_AUTHOR, "Dang Trang");
                            exporterpdf.setParameter(JRPdfExporterParameter.METADATA_CREATOR, "Dang Trang");
                            exporterpdf.setParameter(JRPdfExporterParameter.METADATA_SUBJECT, "ERP2.0 - VTSoft1");
                            exporterpdf.setParameter(JRPdfExporterParameter.METADATA_TITLE, title);

                            exporterpdf.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
                            exporterpdf.setParameter(JRExporterParameter.CHARACTER_ENCODING, "utf-8");
                            exporterpdf.setParameter(JRExporterParameter.OUTPUT_FILE, file);

                            exporterpdf.exportReport();

                            break;
                        case Constants.EXCEL_REPORT:
                            JRXlsxExporter exporterXLS = new JRXlsxExporter();

                            String[] sheetNames = {"Sheet1"};

                            // Trangdd - 2016/12/16: Remove header except first page
                            // when export to Excel
                            if (jasperPrint == null) {
                                jasperPrint.setProperty("net.sf.jasperreports.export.xls.exclude.origin.band.1",
                                        "pageHeader");
                                // Remove the pageFooter from all the pages
                                jasperPrint.setProperty("net.sf.jasperreports.export.xls.exclude.origin.band.2",
                                        "pageFooter");
                                // Remove the columnHeader from pages except
                                // starting page
                                jasperPrint.setProperty("net.sf.jasperreports.export.xls.exclude.origin.keep.first.band.1",
                                        "columnHeader");
                                jasperPrint.setProperty("net.sf.jasperreports.export.xls.remove.empty.space.between.rows",
                                        "true");
                                jasperPrint.setProperty(
                                        "net.sf.jasperreports.export.xls.remove.empty.space.between.columns", "true");
                            }

                            exporterXLS.setParameter(JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS,
                                    Boolean.TRUE);
                            exporterXLS.setParameter(JRXlsExporterParameter.IS_ONE_PAGE_PER_SHEET, Boolean.FALSE);
                            exporterXLS.setParameter(JRXlsExporterParameter.OFFSET_X, 0);
                            exporterXLS.setParameter(JRXlsExporterParameter.OFFSET_Y, 0);
                            exporterXLS.setParameter(JRXlsExporterParameter.IS_DETECT_CELL_TYPE, Boolean.TRUE);
                            exporterXLS.setParameter(JRXlsExporterParameter.IS_WHITE_PAGE_BACKGROUND, Boolean.FALSE);
                            exporterXLS.setParameter(JRXlsExporterParameter.SHEET_NAMES, sheetNames);

                            exporterXLS.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
                            exporterXLS.setParameter(JRExporterParameter.CHARACTER_ENCODING, "utf-8");
                            exporterXLS.setParameter(JRExporterParameter.OUTPUT_FILE, file);
                            exporterXLS.exportReport();

                            break;
                        case Constants.HTML_REPORT:
                            // JasperExportManager.exportReportToHtmlFile(jasperPrint,
                            // filePath);

                            Integer limitedPages = 80;

                            // JRXhtmlExporter exporter = new JRXhtmlExporter();
                            //
                            // exporter.setParameter(
                            // JRHtmlExporterParameter.IS_OUTPUT_IMAGES_TO_DIR,
                            // Boolean.TRUE);
                            // // trangdd Fix image not show in HTML issue
                            // //
                            // exporter.setParameter(JRHtmlExporterParameter.IMAGES_DIR_NAME,
                            // //
                            // Executions.getCurrent().getDesktop().getSession().getWebApp().getRealPath("/images/"));
                            // // HttpServletRequest request =
                            // //
                            // (HttpServletRequest)Executions.getCurrent().getNativeRequest();
                            // //
                            // exporter.setParameter(JRHtmlExporterParameter.IMAGES_URI,
                            // // request.getContextPath() + "/images/");
                            // // trangdd
                            // exporter.setParameter(
                            // JRHtmlExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS,
                            // Boolean.FALSE);
                            // exporter.setParameter(
                            // JRHtmlExporterParameter.IS_USING_IMAGES_TO_ALIGN,
                            // Boolean.FALSE);
                            // exporter.setParameter(
                            // JRHtmlExporterParameter.FRAMES_AS_NESTED_TABLES,
                            // Boolean.FALSE);
                            // exporter.setParameter(
                            // JRHtmlExporterParameter.IS_WHITE_PAGE_BACKGROUND,
                            // Boolean.FALSE);
                            // exporter.setParameter(
                            // JRHtmlExporterParameter.IS_WRAP_BREAK_WORD,
                            // Boolean.FALSE);
                            // exporter.setParameter(
                            // JRPdfExporterParameter.IS_COMPRESSED, true);
                            //
                            // // trangdd Neu bao cao co so page vuot qua page gioi
                            // han
                            // // (do cau hinh) thi se hien thi so page gioi han
                            // if (jasperPrint.getPages().size() > limitedPages
                            // && limitedPages > 1) {
                            // exporter.setParameter(
                            // JRHtmlExporterParameter.END_PAGE_INDEX,
                            // limitedPages - 1);
                            // }
                            // // End trangdd
                            // exporter.setParameter(JRExporterParameter.JASPER_PRINT,
                            // jasperPrint);
                            // exporter.setParameter(
                            // JRExporterParameter.CHARACTER_ENCODING, "utf-8");
                            // exporter.setParameter(JRExporterParameter.OUTPUT_FILE,
                            // file);
                            //
                            // exporter.exportReport();
                            //
                            // System.out.println(" exportReport done ");
                            // // this.bSign.setVisible(false);

                            break;
                        default:
                            JRDocxExporter exporterDoc = new JRDocxExporter();
                            exporterDoc.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
                            exporterDoc.setParameter(JRExporterParameter.CHARACTER_ENCODING, "utf-8");
                            exporterDoc.setParameter(JRExporterParameter.OUTPUT_FILE, file);

                            exporterDoc.exportReport();

                            break;

                    }

                } catch (JRException e1) {
                    e1.printStackTrace();
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        });
    }

    private void generateReport2(Session session, List<String> reportNames, String filePath, int reportType,
                                 HashMap params, File file, String title) {
        session.doWork(new Work() {
            @SuppressWarnings({"unchecked", "unused"})
            public void execute(Connection connection) throws SQLException {
                try {

                    List<JasperPrint> jasperPrints = Lists.newArrayList();
                    jasperPrint = null;
                    ClassLoader classloader = Thread.currentThread().getContextClassLoader();
                    String reportPath = classloader.getResource("../" + "doc-template").getPath();

                    for (String reportName : reportNames) {

                        File fielRe = new File(reportPath + reportName + ".jasper");

                        InputStream reportStream = new FileInputStream(fielRe);

                        System.out.println(" Begin fillReport  ");
                        jasperPrint = JasperFillManager.fillReport(reportStream, params, connection);
                        System.out.println(" END fillReport ");

                        // when export to Excel
                        if (jasperPrint == null) {
                            jasperPrint.setProperty("net.sf.jasperreports.export.xls.exclude.origin.band.1",
                                    "pageHeader");
                            // Remove the pageFooter from all the pages
                            jasperPrint.setProperty("net.sf.jasperreports.export.xls.exclude.origin.band.2",
                                    "pageFooter");
                            // Remove the columnHeader from pages except
                            // starting
                            // page
                            jasperPrint.setProperty("net.sf.jasperreports.export.xls.exclude.origin.keep.first.band.1",
                                    "columnHeader");
                            jasperPrint.setProperty("net.sf.jasperreports.export.xls.remove.empty.space.between.rows",
                                    "true");
                            jasperPrint.setProperty(
                                    "net.sf.jasperreports.export.xls.remove.empty.space.between.columns", "true");
                        }

                        jasperPrints.add(jasperPrint);

                    }

                    try {
                        connection.close();
                    } catch (SQLException e) {

                        e.printStackTrace();
                        ;
                    }

                    connection = null;
                    String[] sheetNames = {"ThongTinChung_HangHoa", "DinhLuongKyThuat", "DinhGia"};
                    JRXlsxExporter exporterXLS = new JRXlsxExporter();
                    exporterXLS.setParameter(JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS, Boolean.TRUE);
                    exporterXLS.setParameter(JRXlsExporterParameter.IS_ONE_PAGE_PER_SHEET, Boolean.FALSE);
                    exporterXLS.setParameter(JRXlsExporterParameter.OFFSET_X, 0);
                    exporterXLS.setParameter(JRXlsExporterParameter.OFFSET_Y, 0);
                    exporterXLS.setParameter(JRXlsExporterParameter.IS_DETECT_CELL_TYPE, Boolean.TRUE);
                    exporterXLS.setParameter(JRXlsExporterParameter.IS_WHITE_PAGE_BACKGROUND, Boolean.FALSE);
                    exporterXLS.setParameter(JRXlsExporterParameter.SHEET_NAMES, sheetNames);

                    exporterXLS.setParameter(JRExporterParameter.JASPER_PRINT_LIST, jasperPrints);
                    exporterXLS.setParameter(JRExporterParameter.CHARACTER_ENCODING, "utf-8");
                    exporterXLS.setParameter(JRExporterParameter.OUTPUT_FILE, file);
                    exporterXLS.exportReport();

                } catch (JRException e1) {
                    e1.printStackTrace();
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        });
    }

    @Override
    public Response signVoffice(List<CommonDTO> list) throws Exception {
        try {
            // KttsUserSession objUser =
            // userRoleBusinessImpl.getUserSession(request);
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            for (CommonDTO obj : list) {
                String pathReturn = generateLocationFile();
                File udir = new File(folderUpload + pathReturn);
                if (!udir.exists()) {
                    udir.mkdirs();
                }
                // test file co chan ky de ky
                // File file = new File(folderUpload + File.separator
                // + "FileCoNoteDeTrinhKy.pdf");
                File file = new File(folderUpload + pathReturn + File.separator + obj.getReportName());
                generateFile(obj, file);
                PdfUtils.addNoteIntoFile(file, obj.getReportName());
                file = new File(folderUpload + pathReturn + File.separator + obj.getReportName() + ".pdf");
                FileAttachTranfer attach = new FileAttachTranfer();
                if (file.exists()) {
                    byte[] arr = FileUtils.getBytes(file);
                    attach.setAttachBytes(arr);
                    attach.setFileName(obj.getReportName() + ".pdf");
                    attach.setFileSign(1l);
                }
                obj.getLstFileAttach().add(attach);
                if (KE_HOACH_THANG_TONG_THE.equals(obj.getReportName())) {
                    getFileAttachTotalMonth(obj);
                }
                if (KE_HOACH_THANG_CHI_TIET.equals(obj.getReportName())) {
                    // generateAttachFile(obj);
                }
            }
            String err = signVofficeBusinessImpl.signVoffice(list, objUser, request);
            return Response.ok().entity(Collections.singletonMap("error", err)).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    private void getFileAttachTotalMonth(CommonDTO obj) throws Exception {
        // TODO Auto-generated method stub
        List<UtilAttachDocumentDTO> listUtils = totalMonthPlanBusinessImpl.getAppendixFile(obj.getObjectId());
        if (listUtils != null && listUtils.size() > 0)
            for (UtilAttachDocumentDTO utils : listUtils) {
                FileAttachTranfer attach = new FileAttachTranfer();
                File file = new File(folderUpload + UEncrypt.decryptFileUploadPath(utils.getFilePath()));
                if (file.exists()) {
                    byte[] arr = FileUtils.getBytes(file);
                    attach.setAttachBytes(arr);
                    attach.setFileName(utils.getName());
                    attach.setFileSign(1l);
                }
                obj.getLstFileAttach().add(attach);
            }
    }

    private void generateFile(CommonDTO dto, File file) throws Exception {
        // TODO Auto-generated method stub
        if (KE_HOACH_NAM.equals(dto.getReportName())) {
            generateFileYearPlan(dto, file);
        } else if (KE_HOACH_THANG_TONG_THE.equals(dto.getReportName())) {
            generateFileTotalMonthPlan(dto, file);
        } else if (KE_HOACH_THANG_CHI_TIET.equals(dto.getReportName())) {
            generateFileDetailMonthPlan(dto, file);
        }
    }

    private void generateFileDetailMonthPlan(CommonDTO dto, File file) throws Exception {
        // TODO Auto-generated method stub
        if (dto.getObjectId() != null) {
            DetailMonthPlanExportDTO data = detailMonthPlanBusinessImpl.getDataSignForSignVOffice(dto);
            ConcurrentHashMap<String, Object> params = new ConcurrentHashMap<String, Object>();
            ClassLoader classloader = Thread.currentThread().getContextClassLoader();
            String reportPath = classloader.getResource("../" + "doc-template").getPath();
            // JasperCompileManager.compileReportToFile(reportPath +
            // "/KeHoachThangChiTiet.jrxml");
            String filePath = reportPath + "/KeHoachThangChiTiet.jasper";
            // params.put("HK12Param", colectionDataSource);
            JRBeanCollectionDataSource tbl1 = new JRBeanCollectionDataSource(data.getSummaryList());
            JRBeanCollectionDataSource tbl2 = new JRBeanCollectionDataSource(data.getPl1List());
            JRBeanCollectionDataSource tbl3 = new JRBeanCollectionDataSource(data.getPl2List());
            JRBeanCollectionDataSource tbl4 = new JRBeanCollectionDataSource(data.getPl3List());

            params.put("tbl1", tbl1);
            params.put("tbl2", tbl2);
            params.put("tbl3", tbl3);
            params.put("tbl4", tbl4);
            Format formatter = new SimpleDateFormat("dd");
            String dd = formatter.format(new Date());
            formatter = new SimpleDateFormat("MM");
            String mm = formatter.format(new Date());
            formatter = new SimpleDateFormat("yyyy");
            String yyyy = formatter.format(new Date());
            params.put("mm", mm);
            params.put("dd", dd);
            params.put("yyyy", yyyy);
            params.put("year", dto.getYear().toString());
            params.put("month", dto.getMonth().toString());
            params.put("preMonth", (new Long(dto.getMonth().longValue() - 1L)).toString());
            params.put("sysGroupName", dto.getSysName());
            params.put("sysGroupCode", dto.getSysGroupCode());
            if (StringUtils.isNotEmpty(dto.getSysName())) {
                params.put("chiNhanh", dto.getSysName());
                params.put("chiNhanhUpper", dto.getSysName().toUpperCase());
            }
            if (dto.getListSignVoffice() != null && !dto.getListSignVoffice().isEmpty()) {
                List<SignVofficeDTO> list = dto.getListSignVoffice();
                for (SignVofficeDTO d : list) {
                    if ("1".equalsIgnoreCase(d.getSignOrder())) {
                        if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                            params.put("signLabel1", d.getSignLabelName().toUpperCase());
                        }
                    } else if ("2".equalsIgnoreCase(d.getSignOrder())) {
                        if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                            params.put("signLabel2", d.getSignLabelName().toUpperCase());
                        }
                    } else if ("3".equalsIgnoreCase(d.getSignOrder())) {
                        if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                            params.put("signLabel3", d.getSignLabelName().toUpperCase());
                        }
                    }
                }
            }
            JasperPrint jasperPrint = JasperFillManager.fillReport(filePath, params, new JREmptyDataSource());
            jasperPrint.addStyle(JasperReportConfig.getNormalStyle(reportPath));
            JRPdfExporter exporterpdf = new JRPdfExporter();

            exporterpdf.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
            exporterpdf.setParameter(JRExporterParameter.CHARACTER_ENCODING, "UTF-8");
            exporterpdf.setParameter(JRExporterParameter.OUTPUT_FILE, file);

            exporterpdf.exportReport();
        }
    }

    private void generateFileTotalMonthPlan(CommonDTO dto, File file) throws Exception {
        // TODO Auto-generated method stub
        TotalMonthPlanSimpleDTO dataForExport = totalMonthPlanBusinessImpl.getDataForSignVOffice(dto.getObjectId());
        ConcurrentHashMap<String, Object> params = new ConcurrentHashMap<String, Object>();
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String reportPath = classloader.getResource("../" + "doc-template").getPath();
        // JasperCompileManager.compileReportToFile(reportPath + "/" +
        // "KeHoachThangTongThe.jrxml");
        String filePath = reportPath + "/" + "KeHoachThangTongThe.jasper";
        JRBeanCollectionDataSource target = new JRBeanCollectionDataSource(dataForExport.getTmpnTargetDTOList());
        JRBeanCollectionDataSource source = new JRBeanCollectionDataSource(dataForExport.getTmpnSourceDTOList());
        JRBeanCollectionDataSource maintain = new JRBeanCollectionDataSource(
                dataForExport.getTmpnForceMaintainDTOList());
        JRBeanCollectionDataSource bts = new JRBeanCollectionDataSource(dataForExport.getTmpnForceNewBtsDTOList());
        JRBeanCollectionDataSource newLine = new JRBeanCollectionDataSource(dataForExport.getTmpnForceNewLineDTOList());
        JRBeanCollectionDataSource contract = new JRBeanCollectionDataSource(dataForExport.getTmpnContractDTOList());
        JRBeanCollectionDataSource finance = new JRBeanCollectionDataSource(dataForExport.getTmpnFinanceDTOList());
        JRBeanCollectionDataSource material = new JRBeanCollectionDataSource(dataForExport.getTmpnMaterialDTOList());
        params.put("tbl1", target);
        params.put("tbl2", source);
        params.put("tbl3", maintain);
        params.put("tbl4", bts);
        params.put("tbl5", newLine);
        params.put("tbl6", material);
        params.put("tbl7", finance);
        params.put("tbl8", contract);
        Format formatter = new SimpleDateFormat("dd");
        String dd = formatter.format(new Date());
        formatter = new SimpleDateFormat("MM");
        String mm = formatter.format(new Date());
        formatter = new SimpleDateFormat("yyyy");
        String yyyy = formatter.format(new Date());
        params.put("yyyy", yyyy);
        params.put("mm", mm);
        params.put("dd", dd);
        params.put("year", dto.getYear().toString());
        params.put("month", dto.getMonth().toString());
        params.put("preMonth", (new Long(dto.getMonth().longValue() - 1L)).toString());
        if (StringUtils.isNotEmpty(dto.getConclution()))
            params.put("conclution", dto.getConclution());
        if (dto.getListSignVoffice() != null && !dto.getListSignVoffice().isEmpty()) {
            List<SignVofficeDTO> list = dto.getListSignVoffice();
            for (SignVofficeDTO d : list) {
                if ("1".equalsIgnoreCase(d.getSignOrder())) {
                    if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                        params.put("signLabel1", d.getSignLabelName().toUpperCase());
                    }
                } else if ("2".equalsIgnoreCase(d.getSignOrder())) {
                    if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                        params.put("signLabel2", d.getSignLabelName().toUpperCase());
                    }
                } else if ("3".equalsIgnoreCase(d.getSignOrder())) {
                    if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                        params.put("signLabel3", d.getSignLabelName().toUpperCase());
                    }
                } else if ("4".equalsIgnoreCase(d.getSignOrder())) {
                    if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                        params.put("signLabel4", d.getSignLabelName().toUpperCase());
                    }
                }
            }
        }
        JasperPrint jasperPrint = JasperFillManager.fillReport(filePath, params, new JREmptyDataSource());
        jasperPrint.addStyle(JasperReportConfig.getNormalStyle(reportPath));
        JRPdfExporter exporterpdf = new JRPdfExporter();

        exporterpdf.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
        exporterpdf.setParameter(JRExporterParameter.CHARACTER_ENCODING, "UTF-8");
        exporterpdf.setParameter(JRExporterParameter.OUTPUT_FILE, file);

        exporterpdf.exportReport();
    }

    private void generateFileYearPlan(CommonDTO dto, File file) throws Exception {
        // TODO Auto-generated method stub
        List<YearPlanDetailDTO> dataForExport = yearPlanBussinessImpl.getDataForSignVOffice(dto.getObjectId());
        ConcurrentHashMap<String, Object> params = new ConcurrentHashMap<String, Object>();
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String reportPath = classloader.getResource("../" + "doc-template").getPath();
        // JasperCompileManager.compileReportToFile(reportPath + "/" +
        // dto.getReportName() + ".jrxml");
        String filePath = reportPath + "/" + dto.getReportName() + ".jasper";
        JRBeanCollectionDataSource colectionDataSource = new JRBeanCollectionDataSource(dataForExport);
        params.put("tbl2", colectionDataSource);
        Format formatter = new SimpleDateFormat("dd");
        String dd = formatter.format(new Date());
        formatter = new SimpleDateFormat("MM");
        String mm = formatter.format(new Date());
        params.put("mm", mm);
        formatter = new SimpleDateFormat("yyyy");
        String yyyy = formatter.format(new Date());
        params.put("yyyy", yyyy);
        params.put("dd", dd);
        params.put("year", dto.getYear().toString());
        if (dto.getListSignVoffice() != null && !dto.getListSignVoffice().isEmpty()) {
            List<SignVofficeDTO> list = dto.getListSignVoffice();
            for (SignVofficeDTO d : list) {
                if ("1".equalsIgnoreCase(d.getSignOrder())) {
                    if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                        params.put("signLabel1", d.getSignLabelName().toUpperCase());
                    }
                } else if ("2".equalsIgnoreCase(d.getSignOrder())) {
                    if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                        params.put("signLabel2", d.getSignLabelName().toUpperCase());
                    }
                } else if ("3".equalsIgnoreCase(d.getSignOrder())) {
                    if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                        params.put("signLabel3", d.getSignLabelName().toUpperCase());
                    }
                } else if ("4".equalsIgnoreCase(d.getSignOrder())) {
                    if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                        params.put("signLabel4", d.getSignLabelName().toUpperCase());
                    }
                }
            }
        }
        JasperPrint jasperPrint = JasperFillManager.fillReport(filePath, params, new JREmptyDataSource());
        jasperPrint.addStyle(JasperReportConfig.getNormalStyle(reportPath));
        JRPdfExporter exporterpdf = new JRPdfExporter();

        exporterpdf.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
        exporterpdf.setParameter(JRExporterParameter.CHARACTER_ENCODING, "UTF-8");
        exporterpdf.setParameter(JRExporterParameter.OUTPUT_FILE, file);

        exporterpdf.exportReport();
    }

    private String validateData(CommonDTO obj) {
        String err = "";
        if (Constants.LISTREPORTNAME.contains(obj.getReportName())) {
            if (obj.getListStockId().size() > 0) {
                for (Long id : obj.getListStockId()) {
                    if (!VpsPermissionChecker.checkPermissionOnDomainData(Constants.OperationKey.REPORT,
                            Constants.AdResourceKey.STOCK, id, request)) {
                        err = StringUtils.isNotEmpty(err) ? (err + ";" + id)
                                : ("Bạn không có quyền xem báo cáo tại kho " + id);
                    }

                }
            } else if (obj.getStockId() != null) {
                if (!VpsPermissionChecker.checkPermissionOnDomainData(Constants.OperationKey.REPORT,
                        Constants.AdResourceKey.STOCK, obj.getStockId(), request)) {
                    err = StringUtils.isNotEmpty(err) ? (err + ";" + obj.getStockId())
                            : ("Bạn không có quyền xem báo cáo tại kho " + obj.getStockId());
                }
            }
        }

        return err;
    }

    @Override
    public Response previewVoffice(CommonDTO dto) throws Exception {
        // TODO Auto-generated method stub
        if (dto != null) {
            if (KE_HOACH_NAM.equals(dto.getReportName())) {
                return previewYearPlan(dto);
            } else if (KE_HOACH_THANG_TONG_THE.equals(dto.getReportName())) {
                return previewTotalMonthPlan(dto);
            } else if (KE_HOACH_THANG_CHI_TIET.equals(dto.getReportName())) {
                return previewDetailMonthPlan(dto);
            }
        }
        return null;
    }

    private Response previewDetailMonthPlan(CommonDTO dto) throws Exception {
        // TODO Auto-generated method stub
        if (dto.getObjectId() != null) {
            DetailMonthPlanExportDTO data = detailMonthPlanBusinessImpl.getDataSignForSignVOffice(dto);
            ConcurrentHashMap<String, Object> params = new ConcurrentHashMap<String, Object>();
            ClassLoader classloader = Thread.currentThread().getContextClassLoader();
            String reportPath = classloader.getResource("../" + "doc-template").getPath();
            // JasperCompileManager.compileReportToFile(reportPath +
            // "/KeHoachThangChiTiet.jrxml");
            String filePath = reportPath + "/KeHoachThangChiTiet.jasper";
            // params.put("HK12Param", colectionDataSource);
            JRBeanCollectionDataSource tbl1 = new JRBeanCollectionDataSource(data.getSummaryList());
            JRBeanCollectionDataSource tbl2 = new JRBeanCollectionDataSource(data.getPl1List());
            JRBeanCollectionDataSource tbl3 = new JRBeanCollectionDataSource(data.getPl2List());
            JRBeanCollectionDataSource tbl4 = new JRBeanCollectionDataSource(data.getPl3List());

            params.put("tbl1", tbl1);
            params.put("tbl2", tbl2);
            params.put("tbl3", tbl3);
            params.put("tbl4", tbl4);
            Format formatter = new SimpleDateFormat("dd");
            String dd = formatter.format(new Date());
            formatter = new SimpleDateFormat("MM");
            String mm = formatter.format(new Date());
            formatter = new SimpleDateFormat("yyyy");
            String yyyy = formatter.format(new Date());
            params.put("mm", mm);
            params.put("dd", dd);
            params.put("yyyy", yyyy);
            params.put("year", dto.getYear().toString());
            params.put("month", dto.getMonth().toString());
            params.put("preMonth", (new Long(dto.getMonth().longValue() - 1L)).toString());
            params.put("sysGroupName", dto.getSysName());
            params.put("sysGroupCode", dto.getSysGroupCode());
            if (StringUtils.isNotEmpty(dto.getSysName())) {
                params.put("chiNhanh", dto.getSysName());
                params.put("chiNhanhUpper", dto.getSysName().toUpperCase());
            }
            if (dto.getListSignVoffice() != null && !dto.getListSignVoffice().isEmpty()) {
                List<SignVofficeDTO> list = dto.getListSignVoffice();
                for (SignVofficeDTO d : list) {
                    if ("1".equalsIgnoreCase(d.getSignOrder())) {
                        if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                            params.put("signLabel1", d.getSignLabelName().toUpperCase());
                        }
                    } else if ("2".equalsIgnoreCase(d.getSignOrder())) {
                        if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                            params.put("signLabel2", d.getSignLabelName().toUpperCase());
                        }
                    } else if ("3".equalsIgnoreCase(d.getSignOrder())) {
                        if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                            params.put("signLabel3", d.getSignLabelName().toUpperCase());
                        }
                    }
                }
            }
            JasperPrint jasperPrint = JasperFillManager.fillReport(filePath, params, new JREmptyDataSource());
            jasperPrint.addStyle(JasperReportConfig.getNormalStyle(reportPath));
            String pathReturn = generateLocationFile();
            File udir = new File(folderUpload + pathReturn);
            if (!udir.exists()) {
                udir.mkdirs();
            }
            File file = new File(folderUpload + pathReturn + File.separator + "KehoachThangChiTiet.pdf");
            // JasperExportManager.exportReportToPdfFile(jasperPrint,folderUpload+pathReturn
            // +"KehoachThangChiTiet.pdf");
            JRPdfExporter exporterpdf = new JRPdfExporter();

            exporterpdf.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
            exporterpdf.setParameter(JRExporterParameter.CHARACTER_ENCODING, "UTF-8");
            exporterpdf.setParameter(JRExporterParameter.OUTPUT_FILE, file);

            exporterpdf.exportReport();
            if (file.exists()) {
                ResponseBuilder response = Response.ok(file);
                response.header("Content-Disposition", "attachment; filename=\"" + "KehoachThangChiTiet.pdf" + "\"");
                return response.build();
            }
        }
        return null;
    }

    private Response previewTotalMonthPlan(CommonDTO dto) throws Exception {
        // TODO Auto-generated method stub
        if (dto.getObjectId() != null) {
            TotalMonthPlanSimpleDTO dataForExport = totalMonthPlanBusinessImpl.getDataForSignVOffice(dto.getObjectId());
            ConcurrentHashMap<String, Object> params = new ConcurrentHashMap<String, Object>();
            ClassLoader classloader = Thread.currentThread().getContextClassLoader();
            String reportPath = classloader.getResource("../" + "doc-template").getPath();
            // JasperCompileManager.compileReportToFile(reportPath +
            // "/KeHoachThangTongThe.jrxml");
            String filePath = reportPath + "/KeHoachThangTongThe.jasper";
            JRBeanCollectionDataSource target = new JRBeanCollectionDataSource(dataForExport.getTmpnTargetDTOList());
            JRBeanCollectionDataSource source = new JRBeanCollectionDataSource(dataForExport.getTmpnSourceDTOList());
            JRBeanCollectionDataSource maintain = new JRBeanCollectionDataSource(
                    dataForExport.getTmpnForceMaintainDTOList());
            JRBeanCollectionDataSource bts = new JRBeanCollectionDataSource(dataForExport.getTmpnForceNewBtsDTOList());
            JRBeanCollectionDataSource newLine = new JRBeanCollectionDataSource(
                    dataForExport.getTmpnForceNewLineDTOList());
            JRBeanCollectionDataSource contract = new JRBeanCollectionDataSource(
                    dataForExport.getTmpnContractDTOList());
            JRBeanCollectionDataSource finance = new JRBeanCollectionDataSource(dataForExport.getTmpnFinanceDTOList());
            JRBeanCollectionDataSource material = new JRBeanCollectionDataSource(
                    dataForExport.getTmpnMaterialDTOList());
            params.put("tbl1", target);
            params.put("tbl2", source);
            params.put("tbl3", maintain);
            params.put("tbl4", bts);
            params.put("tbl5", newLine);
            params.put("tbl6", material);
            params.put("tbl7", finance);
            params.put("tbl8", contract);
            Format formatter = new SimpleDateFormat("dd");
            String dd = formatter.format(new Date());
            formatter = new SimpleDateFormat("MM");
            String mm = formatter.format(new Date());
            formatter = new SimpleDateFormat("yyyy");
            String yyyy = formatter.format(new Date());
            params.put("mm", mm);
            params.put("dd", dd);
            params.put("yyyy", yyyy);
            params.put("year", dto.getYear().toString());
            params.put("month", dto.getMonth().toString());
            params.put("preMonth", (new Long(dto.getMonth().longValue() - 1L)).toString());
            if (StringUtils.isNotEmpty(dto.getConclution()))
                params.put("conclution", dto.getConclution());
            if (dto.getListSignVoffice() != null && !dto.getListSignVoffice().isEmpty()) {
                List<SignVofficeDTO> list = dto.getListSignVoffice();
                for (SignVofficeDTO d : list) {
                    if ("1".equalsIgnoreCase(d.getSignOrder())) {
                        if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                            params.put("signLabel1", d.getSignLabelName().toUpperCase());
                        }
                    } else if ("2".equalsIgnoreCase(d.getSignOrder())) {
                        if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                            params.put("signLabel2", d.getSignLabelName().toUpperCase());
                        }
                    } else if ("3".equalsIgnoreCase(d.getSignOrder())) {
                        if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                            params.put("signLabel3", d.getSignLabelName().toUpperCase());
                        }
                    } else if ("4".equalsIgnoreCase(d.getSignOrder())) {
                        if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                            params.put("signLabel4", d.getSignLabelName().toUpperCase());
                        }
                    }
                }
            }
            JasperPrint jasperPrint = JasperFillManager.fillReport(filePath, params, new JREmptyDataSource());
            jasperPrint.addStyle(JasperReportConfig.getNormalStyle(reportPath));
            String pathReturn = generateLocationFile();
            File udir = new File(folderUpload + pathReturn);
            if (!udir.exists()) {
                udir.mkdirs();
            }
            File file = new File(folderUpload + pathReturn + File.separator + "KehoachThangTongThe.pdf");
            // JasperExportManager.exportReportToPdfFile(jasperPrint,folderUpload+pathReturn
            // +"KehoachThangChiTiet.pdf");
            JRPdfExporter exporterpdf = new JRPdfExporter();

            exporterpdf.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
            exporterpdf.setParameter(JRExporterParameter.CHARACTER_ENCODING, "UTF-8");
            exporterpdf.setParameter(JRExporterParameter.OUTPUT_FILE, file);

            exporterpdf.exportReport();
            if (file.exists()) {
                ResponseBuilder response = Response.ok(file);
                response.header("Content-Disposition", "attachment; filename=\"" + "KehoachThangTongThe.pdf" + "\"");
                return response.build();
            }
        }
        return Response.ok().entity(Collections.singletonMap("error", "Kế hoạch không tồn tại")).build();
    }

    private Response previewYearPlan(CommonDTO dto) throws Exception {
        // TODO Auto-generated method stub
        if (dto.getObjectId() != null) {
            List<YearPlanDetailDTO> dataForExport = yearPlanBussinessImpl.getDataForSignVOffice(dto.getObjectId());
            ConcurrentHashMap<String, Object> params = new ConcurrentHashMap<String, Object>();
            ClassLoader classloader = Thread.currentThread().getContextClassLoader();
            String reportPath = classloader.getResource("../" + "doc-template").getPath();
            // JasperCompileManager.compileReportToFile(reportPath +
            // "/KeHoachNam.jrxml");
            String filePath = reportPath + "/KeHoachNam.jasper";
            JRBeanCollectionDataSource colectionDataSource = new JRBeanCollectionDataSource(dataForExport);
            params.put("tbl2", colectionDataSource);
            Format formatter = new SimpleDateFormat("dd");
            String dd = formatter.format(new Date());
            formatter = new SimpleDateFormat("MM");
            String mm = formatter.format(new Date());
            formatter = new SimpleDateFormat("yyyy");
            String yyyy = formatter.format(new Date());
            params.put("mm", mm);
            params.put("dd", dd);
            params.put("yyyy", yyyy);
            params.put("year", dto.getYear().toString());
            if (dto.getListSignVoffice() != null && !dto.getListSignVoffice().isEmpty()) {
                List<SignVofficeDTO> list = dto.getListSignVoffice();
                for (SignVofficeDTO d : list) {
                    if ("1".equalsIgnoreCase(d.getSignOrder())) {
                        if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                            params.put("signLabel1", d.getSignLabelName().toUpperCase());
                        }
                    } else if ("2".equalsIgnoreCase(d.getSignOrder())) {
                        if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                            params.put("signLabel2", d.getSignLabelName().toUpperCase());
                        }
                    } else if ("3".equalsIgnoreCase(d.getSignOrder())) {
                        if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                            params.put("signLabel3", d.getSignLabelName().toUpperCase());
                        }
                    } else if ("4".equalsIgnoreCase(d.getSignOrder())) {
                        if (StringUtils.isNotEmpty(d.getSignLabelName())) {
                            params.put("signLabel4", d.getSignLabelName().toUpperCase());
                        }
                    }
                }
            }
            JasperPrint jasperPrint = JasperFillManager.fillReport(filePath, params, new JREmptyDataSource());
            jasperPrint.addStyle(JasperReportConfig.getNormalStyle(reportPath));
            String pathReturn = generateLocationFile();
            File udir = new File(folderUpload + pathReturn);
            if (!udir.exists()) {
                udir.mkdirs();
            }
            File file = new File(folderUpload + pathReturn + File.separator + "KehoachNam.pdf");
            // JasperExportManager.exportReportToPdfFile(jasperPrint,folderUpload+pathReturn
            // +"KehoachThangChiTiet.pdf");
            JRPdfExporter exporterpdf = new JRPdfExporter();

            exporterpdf.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
            exporterpdf.setParameter(JRExporterParameter.CHARACTER_ENCODING, "UTF-8");
            exporterpdf.setParameter(JRExporterParameter.OUTPUT_FILE, file);

            exporterpdf.exportReport();
            if (file.exists()) {
                ResponseBuilder response = Response.ok(file);
                response.header("Content-Disposition", "attachment; filename=\"" + "KehoachThangNam.pdf" + "\"");
                return response.build();
            }

        }
        return Response.ok().entity(Collections.singletonMap("error", "Kế hoạch không tồn tại")).build();
    }

    private String generateLocationFile() {
        Calendar cal = Calendar.getInstance();
        return File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator + cal.get(Calendar.YEAR)
                + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator + cal.get(Calendar.DATE)
                + File.separator + cal.get(Calendar.MILLISECOND);
    }

    @Override
    public Response downloadAttachFile(CommonDTO dto) throws Exception {
        DetailMonthPlanExportDTO data = detailMonthPlanBusinessImpl.getDataAttachForSignVOffice(dto);
        ConcurrentHashMap<String, Object> params = new ConcurrentHashMap<String, Object>();
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String reportPath = classloader.getResource("../" + "doc-template").getPath();
        List<File> attachFileList = new ArrayList<File>();
        // generateListOfAttachFile
        generatePl1File(data.getPl1ExcelList(), attachFileList, reportPath, dto);
        generatePl2File(data, attachFileList, reportPath, dto);
        generatePl3File(data, attachFileList, reportPath, dto);
        generatePl5File(data, attachFileList, reportPath, dto);
        generatePl4File(data.getPl4ExcelList(), attachFileList, reportPath, dto);
        generatePl6File(data.getPl6ExcelList(), attachFileList, reportPath, dto);

        // return zip File
        String pathReturn = generateLocationFile();
        File udir = new File(folderUpload + pathReturn);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        File file = new File(folderUpload + pathReturn + File.separator + "Phuluc.zip");

        ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(file));
        for (File xlsFile : attachFileList) {
            if (!xlsFile.isFile())
                continue;
            ZipEntry zipEntry = new ZipEntry(xlsFile.getName());
            zipOut.putNextEntry(zipEntry);
            zipOut.write(FileUtils.getBytes(xlsFile));
            zipOut.closeEntry();
        }
        zipOut.close();
        if (file.exists()) {
            ResponseBuilder response = Response.ok(file);
            response.header("Content-Disposition", "attachment; filename=\"" + "Phuluc.zip" + "\"");
            return response.build();
        }
        return Response.ok().entity(Collections.singletonMap("error", "Kế hoạch không tồn tại")).build();
    }

    private void generatePl5File(DetailMonthPlanExportDTO data, List<File> attachFileList, String reportPath,
                                 CommonDTO common) throws Exception {
        // TODO Auto-generated method stub
        InputStream inputStream = new BufferedInputStream(new FileInputStream(reportPath + "PL5_KH_dong_tien.xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
        inputStream.close();
        String pathReturn = generateLocationFile();
        File udir = new File(folderUpload + pathReturn);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        File file = new File(folderUpload + pathReturn + File.separator + "PL5_KH_dong_tien.xlsx");
        OutputStream outFile = new FileOutputStream(file);
        XSSFSheet sheet = workbook.getSheetAt(0);
        XSSFCellStyle styleTextNotWrap = ExcelUtils.styleTextNotWrap(sheet);
        int i = 0;
        Row row = sheet.createRow(i++);
        Cell cell = row.createCell(4, CellType.STRING);
        cell.setCellValue("PL5 KẾ HOẠCH DÒNG TIỀN THÁNG " + common.getMonth() + " NĂM " + common.getYear() + " "
                + (common.getSysName() != null ? common.getSysName().toUpperCase() : ""));
        cell.setCellStyle(styleTextNotWrap);
        List<ConstructionTaskDetailDTO> pl5List = data.getPl5ExcelList();
        if (pl5List != null && !pl5List.isEmpty()) {
            i = fillSectionBTSForDT(sheet, data, pl5List, i);
            i = fillSectionGPONForDT(sheet, data, pl5List, i);
            i = fillSectionTuyenForDT(sheet, data, pl5List, i);
            i = fillSectionLeForDT(sheet, data, pl5List, i);

        }
        workbook.write(outFile);
        workbook.close();
        outFile.close();
        attachFileList.add(file);
    }

    private int fillSectionLeForDT(XSSFSheet sheet, DetailMonthPlanExportDTO common,
                                   List<ConstructionTaskDetailDTO> listData, int i) {
        // TODO Auto-generated method stub
        i = fillHeaderForDT(sheet, common.getListWorkItemTypeLe(), i, "4");
        int headerRow = i - 1;
        return fillDataTableForDT(sheet, listData, i, LE, headerRow, common.getListWorkItemTypeLe().size());

    }

    private int fillSectionTuyenForDT(XSSFSheet sheet, DetailMonthPlanExportDTO common,
                                      List<ConstructionTaskDetailDTO> listData, int i) {
        // TODO Auto-generated method stub
        i = fillHeaderForDT(sheet, common.getListWorkItemTypeTuyen(), i, "3");
        int headerRow = i - 1;
        return fillDataTableForDT(sheet, listData, i, TUYEN, headerRow, common.getListWorkItemTypeTuyen().size());

    }

    private int fillSectionGPONForDT(XSSFSheet sheet, DetailMonthPlanExportDTO common,
                                     List<ConstructionTaskDetailDTO> listData, int i) {
        // TODO Auto-generated method stub
        i = fillHeaderForDT(sheet, common.getListWorkItemTypeGPON(), i, "2");
        int headerRow = i - 1;
        return fillDataTableForDT(sheet, listData, i, GPON, headerRow, common.getListWorkItemTypeGPON().size());

    }

    private int fillSectionBTSForDT(XSSFSheet sheet, DetailMonthPlanExportDTO common,
                                    List<ConstructionTaskDetailDTO> listData, int i) {
        // TODO Auto-generated method stub
        i = fillHeaderForDT(sheet, common.getListWorkItemTypeBTS(), i, "1");
        int headerRow = i - 1;
        return fillDataTableForDT(sheet, listData, i, BTS, headerRow, common.getListWorkItemTypeBTS().size());

    }

    private int fillDataTableForDT(XSSFSheet sheet, List<ConstructionTaskDetailDTO> data, int i, String type,
                                   int headerRow, int headerCount) {

        // TODO Auto-generated method stub
        XSSFCellStyle style = ExcelUtils.styleText(sheet);
        XSSFCellStyle styleCurrency = ExcelUtils.styleCurrency(sheet);
        XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
        Row header = sheet.getRow(headerRow);
        if (data != null && !data.isEmpty()) {
            int stt = 1;
            for (ConstructionTaskDetailDTO dto : data) {
                if (type.equalsIgnoreCase(dto.getCatConstructionTypeName())) {
                    Row row = sheet.createRow(i++);
                    Cell cell = row.createCell(0, CellType.STRING);
                    cell.setCellValue("" + (stt++));
                    cell.setCellStyle(style);
                    cell = row.createCell(1, CellType.STRING);
                    cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(2, CellType.STRING);
                    cell.setCellValue((dto.getCatProvinceCode() != null) ? dto.getCatProvinceCode() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(3, CellType.STRING);
                    cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(4, CellType.STRING);
                    cell.setCellValue(type);
                    cell.setCellStyle(style);
                    cell = row.createCell(5, CellType.STRING);
                    cell.setCellValue((dto.getCntContract() != null) ? dto.getCntContract() : "");
                    cell.setCellStyle(style);
                    for (int size = 0; size < headerCount; size++) {
                        cell = row.createCell(6 + size, CellType.NUMERIC);
                        cell.setCellStyle(styleCurrency);
                        Cell headerCell = header.getCell(size + 6);
                        for (WorkItemDetailDTO value : dto.getListWorkItemForExport()) {
                            if (headerCell != null)
                                if (value.getCatWorkItemTypeName().equals(headerCell.getStringCellValue())) {
                                    if (value.getQuantity() != null) {
                                        cell.setCellValue(value.getQuantity());
                                    }

                                    break;
                                }
                        }

                    }
                    double sum = dto.getQuantity() != null ? dto.getQuantity().doubleValue() : 0;
                    double vat = dto.getVat() != null ? dto.getVat().doubleValue() : 0;
                    double amout = sum + vat;
                    cell = row.createCell(6 + headerCount, CellType.NUMERIC);
                    cell.setCellValue(sum);
                    cell.setCellStyle(styleCurrency);
                    cell = row.createCell(7 + headerCount, CellType.NUMERIC);
                    cell.setCellValue(vat);
                    cell.setCellStyle(styleCurrency);
                    cell = row.createCell(8 + headerCount, CellType.NUMERIC);
                    cell.setCellValue(amout);
                    cell.setCellStyle(styleCurrency);
                }

            }
        }
        return i;

    }

    private int fillHeaderForDT(XSSFSheet sheet, List<CatCommonDTO> data, int i, String type) {
        // TODO Auto-generated method stub
        i++;
        int length = data.size();
        String typeName = "";
        if ("1".equalsIgnoreCase(type)) {
            typeName = "1.Loại công trình BTS";
        } else if ("2".equalsIgnoreCase(type)) {
            typeName = "2.Loại công trình GPON";
        } else if ("3".equalsIgnoreCase(type)) {
            typeName = "3.Loại công trình tuyến";
        } else if ("4".equalsIgnoreCase(type)) {
            typeName = "4.Loại công trình lẻ";
        }
        XSSFCellStyle style = ExcelUtils.styleText(sheet);
        XSSFCellStyle styleTextNotWrap = ExcelUtils.styleTextNotWrap(sheet);
        XSSFCellStyle styleHeader = ExcelUtils.styleHeader(sheet);
        Row row = sheet.createRow(i++);
        Cell cell = row.createCell(0, CellType.STRING);
        cell.setCellValue(typeName);
        cell.setCellStyle(styleTextNotWrap);
        row = sheet.createRow(i++);
        cell = row.createCell(0);
        cell.setCellValue("TT");
        cell.setCellStyle(styleHeader);
        cell = row.createCell(1);
        cell.setCellValue("Mã trạm");
        cell.setCellStyle(styleHeader);

        cell = row.createCell(2);
        cell.setCellValue("Mã tỉnh");
        cell.setCellStyle(styleHeader);

        cell = row.createCell(3);
        cell.setCellValue("Mã công trình");
        cell.setCellStyle(styleHeader);

        cell = row.createCell(4);
        cell.setCellValue("Loại công trình");
        cell.setCellStyle(styleHeader);

        cell = row.createCell(5);
        cell.setCellValue("Hợp đồng đầu ra");
        cell.setCellStyle(styleHeader);

        cell = row.createCell(6);
        cell.setCellValue("Giá trị SL");
        cell.setCellStyle(styleHeader);

        for (int m = 7; m < length + 6; m++) {
            cell = row.createCell(m);
            cell.setCellStyle(styleHeader);
            sheet.setColumnWidth(m, WIDTH);
        }
        cell = row.createCell(6 + length);
        cell.setCellValue("Tổng");
        cell.setCellStyle(styleHeader);
        sheet.setColumnWidth(6 + length, WIDTH);
        cell = row.createCell(7 + length);
        cell.setCellValue("VAT");
        cell.setCellStyle(styleHeader);
        sheet.setColumnWidth(7 + length, WIDTH);
        cell = row.createCell(8 + length);
        cell.setCellValue("Thành tiền");
        cell.setCellStyle(styleHeader);
        sheet.setColumnWidth(8 + length, WIDTH);

        row = sheet.createRow(i++);
        int k = 6;
        for (int m = 0; m < 6; m++) {
            cell = row.createCell(m);
            cell.setCellStyle(styleHeader);
        }
        for (CatCommonDTO dt : data) {
            cell = row.createCell(k++);
            cell.setCellValue(dt.getName());
            cell.setCellStyle(styleHeader);
        }
        for (int m = 6 + length; m < length + 9; m++) {
            cell = row.createCell(m);
            cell.setCellStyle(styleHeader);
        }
        for (int j = 0; j < 9 + length; j++) {
            if (j == 6) {
                if (length != 1) {
                    sheet.addMergedRegion(new CellRangeAddress(i - 2, i - 2, j, j + length - 1));
                    j = j + length - 1;
                }
            } else
                sheet.addMergedRegion(new CellRangeAddress(i - 2, i - 1, j, j));
        }
        return i;
    }

    private void generatePl3File(DetailMonthPlanExportDTO data, List<File> attachFileList, String reportPath,
                                 CommonDTO common) throws Exception {
        // TODO Auto-generated method stub
        InputStream inputStream = new BufferedInputStream(new FileInputStream(reportPath + "PL3_KH_doanh_thu.xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
        inputStream.close();
        String pathReturn = generateLocationFile();
        File udir = new File(folderUpload + pathReturn);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        File file = new File(folderUpload + pathReturn + File.separator + "PL3_KH_doanh_thu.xlsx");
        OutputStream outFile = new FileOutputStream(file);
        XSSFSheet sheet = workbook.getSheetAt(0);
        XSSFCellStyle style = ExcelUtils.styleText(sheet);
        XSSFCellStyle styleTextNotWrap = ExcelUtils.styleTextNotWrap(sheet);
        int i = 0;
        Row row = sheet.createRow(i++);
        Cell cell = row.createCell(3, CellType.STRING);
        cell.setCellValue("PL3 KẾ HOẠCH LÊN DOANH THU THÁNG " + common.getMonth() + " NĂM " + common.getYear() + " "
                + (common.getSysName() != null ? common.getSysName().toUpperCase() : ""));
        cell.setCellStyle(styleTextNotWrap);
        List<ConstructionTaskDetailDTO> pl3List = data.getPl3ExcelList();
        if (pl3List != null && !pl3List.isEmpty()) {

            i = fillSectionBTSForLDT(sheet, data, pl3List, i);
            i = fillSectionGPONForLDT(sheet, data, pl3List, i);
            i = fillSectionTuyenForLDT(sheet, data, pl3List, i);
            i = fillSectionLeForLDT(sheet, data, pl3List, i);

        }
        workbook.write(outFile);
        workbook.close();
        outFile.close();
        attachFileList.add(file);
    }

    private int fillSectionLeForLDT(XSSFSheet sheet, DetailMonthPlanExportDTO common,
                                    List<ConstructionTaskDetailDTO> listData, int i) {
        // TODO Auto-generated method stub
        i = fillHeaderForLDT(sheet, common.getListWorkItemTypeLe(), i, "4");
        int headerRow = i - 1;
        return fillDataTableForLDT(sheet, listData, i, LE, headerRow, common.getListWorkItemTypeLe().size());

    }

    private int fillSectionTuyenForLDT(XSSFSheet sheet, DetailMonthPlanExportDTO common,
                                       List<ConstructionTaskDetailDTO> listData, int i) {
        // TODO Auto-generated method stub
        i = fillHeaderForLDT(sheet, common.getListWorkItemTypeTuyen(), i, "3");
        int headerRow = i - 1;
        return fillDataTableForLDT(sheet, listData, i, TUYEN, headerRow, common.getListWorkItemTypeTuyen().size());

    }

    private int fillSectionGPONForLDT(XSSFSheet sheet, DetailMonthPlanExportDTO common,
                                      List<ConstructionTaskDetailDTO> listData, int i) {
        // TODO Auto-generated method stub
        i = fillHeaderForLDT(sheet, common.getListWorkItemTypeGPON(), i, "2");
        int headerRow = i - 1;
        return fillDataTableForLDT(sheet, listData, i, GPON, headerRow, common.getListWorkItemTypeGPON().size());

    }

    private int fillSectionBTSForLDT(XSSFSheet sheet, DetailMonthPlanExportDTO common,
                                     List<ConstructionTaskDetailDTO> listData, int i) {
        // TODO Auto-generated method stub
        i = fillHeaderForLDT(sheet, common.getListWorkItemTypeBTS(), i, "1");
        int headerRow = i - 1;
        return fillDataTableForLDT(sheet, listData, i, BTS, headerRow, common.getListWorkItemTypeBTS().size());

    }

    private int fillDataTableForLDT(XSSFSheet sheet, List<ConstructionTaskDetailDTO> data, int i, String type,
                                    int headerRow, int headerCount) {

        // TODO Auto-generated method stub
        XSSFCellStyle style = ExcelUtils.styleText(sheet);
        XSSFCellStyle styleCurrency = ExcelUtils.styleCurrency(sheet);
        XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
        Row header = sheet.getRow(headerRow);
        if (data != null && !data.isEmpty()) {
            int stt = 1;
            for (ConstructionTaskDetailDTO dto : data) {
                if (type.equalsIgnoreCase(dto.getCatConstructionTypeName())) {
                    Row row = sheet.createRow(i++);
                    Cell cell = row.createCell(0, CellType.STRING);
                    cell.setCellValue("" + (stt++));
                    cell.setCellStyle(style);
                    cell = row.createCell(1, CellType.STRING);
                    cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(2, CellType.STRING);
                    cell.setCellValue((dto.getCatProvinceCode() != null) ? dto.getCatProvinceCode() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(3, CellType.STRING);
                    cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(4, CellType.STRING);
                    cell.setCellValue(type);
                    cell.setCellStyle(style);
                    cell = row.createCell(5, CellType.STRING);
                    cell.setCellValue((dto.getCntContract() != null) ? dto.getCntContract() : "");
                    cell.setCellStyle(style);
                    for (int size = 0; size < headerCount; size++) {
                        cell = row.createCell(7 + size, CellType.NUMERIC);
                        cell.setCellStyle(styleCurrency);
                        Cell headerCell = header.getCell(size + 7);
                        for (WorkItemDetailDTO value : dto.getListWorkItemForExport()) {
                            if (headerCell != null)
                                if (value.getCatWorkItemTypeName().equals(headerCell.getStringCellValue())) {
                                    if (value.getQuantity() != null) {
                                        cell.setCellValue(value.getQuantity());
                                    }

                                    break;
                                }
                        }

                    }

                    cell = row.createCell(6, CellType.NUMERIC);
                    cell.setCellValue(dto.getQuantity() != null ? dto.getQuantity() : 0);
                    cell.setCellStyle(styleCurrency);

                    cell = row.createCell(7 + headerCount, CellType.STRING);
                    cell.setCellValue((dto.getPerformerName() != null) ? dto.getPerformerName().toString() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(8 + headerCount, CellType.STRING);
                    cell.setCellValue((DateTimeUtils.convertDateToString(dto.getStartDate(), "dd/MM/yyyy")));
                    cell.setCellStyle(styleDate);
                    cell = row.createCell(9 + headerCount, CellType.STRING);
                    cell.setCellValue((DateTimeUtils.convertDateToString(dto.getEndDate(), "dd/MM/yyyy")));
                    cell.setCellStyle(styleDate);
                    cell = row.createCell(10 + headerCount, CellType.STRING);
                    cell.setCellValue((dto.getDescription() != null) ? dto.getDescription().toString() : "");
                    cell.setCellStyle(style);
                }

            }
        }
        return i;

    }

    private int fillHeaderForLDT(XSSFSheet sheet, List<CatCommonDTO> data, int i, String type) {
        // TODO Auto-generated method stub
        i++;
        int length = data.size();
        String typeName = "";
        if ("1".equalsIgnoreCase(type)) {
            typeName = "1.Loại công trình BTS";
        } else if ("2".equalsIgnoreCase(type)) {
            typeName = "2.Loại công trình GPON";
        } else if ("3".equalsIgnoreCase(type)) {
            typeName = "3.Loại công trình tuyến";
        } else if ("4".equalsIgnoreCase(type)) {
            typeName = "4.Loại công trình lẻ";
        }
        XSSFCellStyle style = ExcelUtils.styleText(sheet);
        XSSFCellStyle styleTextNotWrap = ExcelUtils.styleTextNotWrap(sheet);
        XSSFCellStyle styleHeader = ExcelUtils.styleHeader(sheet);
        Row row = sheet.createRow(i++);
        Cell cell = row.createCell(0, CellType.STRING);
        cell.setCellValue(typeName);
        cell.setCellStyle(styleTextNotWrap);
        row = sheet.createRow(i++);
        cell = row.createCell(0);
        cell.setCellValue("TT");
        cell.setCellStyle(styleHeader);
        cell = row.createCell(1);
        cell.setCellValue("Mã trạm");
        cell.setCellStyle(styleHeader);

        cell = row.createCell(2);
        cell.setCellValue("Mã tỉnh");
        cell.setCellStyle(styleHeader);

        cell = row.createCell(3);
        cell.setCellValue("Mã công trình");
        cell.setCellStyle(styleHeader);

        cell = row.createCell(4);
        cell.setCellValue("Loại công trình");
        cell.setCellStyle(styleHeader);

        cell = row.createCell(5);
        cell.setCellValue("Hợp đồng đầu ra");
        cell.setCellStyle(styleHeader);

        cell = row.createCell(6);
        cell.setCellValue("Giá trị SL");
        cell.setCellStyle(styleHeader);
        for (int m = 7; m < length + 7; m++) {
            cell = row.createCell(m);
            cell.setCellStyle(styleHeader);
            sheet.setColumnWidth(m, WIDTH);
        }
        cell = row.createCell(7 + length);
        cell.setCellValue("Người thực hiện");
        cell.setCellStyle(styleHeader);
        sheet.setColumnWidth(7 + length, WIDTH);
        cell = row.createCell(8 + length);
        cell.setCellValue("Thời gian bắt đầu doanh thu");
        cell.setCellStyle(styleHeader);
        sheet.setColumnWidth(8 + length, WIDTH);
        cell = row.createCell(9 + length);
        cell.setCellValue("Thời gian hoàn thành doanh thu");
        cell.setCellStyle(styleHeader);
        sheet.setColumnWidth(9 + length, WIDTH);
        cell = row.createCell(10 + length);
        cell.setCellValue("Ghi chú");
        cell.setCellStyle(styleHeader);
        sheet.setColumnWidth(10 + length, WIDTH);
        row = sheet.createRow(i++);
        cell = row.createCell(6);
        cell.setCellValue("Tổng");
        cell.setCellStyle(styleHeader);
        sheet.setColumnWidth(6, WIDTH);
        int k = 7;
        for (int m = 0; m < 6; m++) {
            cell = row.createCell(m);
            cell.setCellStyle(styleHeader);
        }
        for (CatCommonDTO dt : data) {
            cell = row.createCell(k++);
            cell.setCellValue(dt.getName());
            cell.setCellStyle(styleHeader);
        }
        for (int m = 7 + length; m < length + 13; m++) {
            cell = row.createCell(m);
            cell.setCellStyle(styleHeader);
        }
        for (int j = 0; j < 12 + length; j++) {
            if (j == 6) {
                if (length != 0) {
                    sheet.addMergedRegion(new CellRangeAddress(i - 2, i - 2, j, j + length));
                    j = j + length;
                }
            } else
                sheet.addMergedRegion(new CellRangeAddress(i - 2, i - 1, j, j));
        }
        return i;
    }

    private void generatePl2File(DetailMonthPlanExportDTO data, List<File> attachFileList, String reportPath,
                                 CommonDTO common) throws Exception {
        // TODO Auto-generated method stub
        InputStream inputStream = new BufferedInputStream(new FileInputStream(reportPath + "PL2_KH_HSHC.xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
        inputStream.close();
        String pathReturn = generateLocationFile();
        File udir = new File(folderUpload + pathReturn);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        File file = new File(folderUpload + pathReturn + File.separator + "PL2_KH_HSHC.xlsx");
        OutputStream outFile = new FileOutputStream(file);
        XSSFSheet sheet = workbook.getSheetAt(0);
        XSSFCellStyle style = ExcelUtils.styleText(sheet);
        XSSFCellStyle styleTextNotWrap = ExcelUtils.styleTextNotWrap(sheet);
        int i = 0;
        Row row = sheet.createRow(i++);
        Cell cell = row.createCell(3, CellType.STRING);
        cell.setCellValue("PL2 KẾ HOẠCH HỒ SƠ HOÀN CÔNG THÁNG " + common.getMonth() + " NĂM " + common.getYear() + " "
                + (common.getSysName() != null ? common.getSysName().toUpperCase() : ""));
        cell.setCellStyle(styleTextNotWrap);
        List<ConstructionTaskDetailDTO> pl2List = data.getPl2ExcelList();
        if (pl2List != null && !pl2List.isEmpty()) {

            i = fillSectionBTS(sheet, data, pl2List, i);
            i = fillSectionGPON(sheet, data, pl2List, i);
            i = fillSectionTuyen(sheet, data, pl2List, i);
            i = fillSectionLe(sheet, data, pl2List, i);

        }
        workbook.write(outFile);
        workbook.close();
        outFile.close();
        attachFileList.add(file);
    }

    private int fillSectionLe(XSSFSheet sheet, DetailMonthPlanExportDTO common,
                              List<ConstructionTaskDetailDTO> listData, int i) {
        // TODO Auto-generated method stub
        i = fillHeader(sheet, common.getListWorkItemTypeLe(), i, "4");
        int headerRow = i - 1;
        return fillDataTable(sheet, listData, i, LE, headerRow, common.getListWorkItemTypeLe().size());

    }

    private int fillSectionTuyen(XSSFSheet sheet, DetailMonthPlanExportDTO common,
                                 List<ConstructionTaskDetailDTO> listData, int i) {
        // TODO Auto-generated method stub
        i = fillHeader(sheet, common.getListWorkItemTypeTuyen(), i, "3");
        int headerRow = i - 1;
        return fillDataTable(sheet, listData, i, TUYEN, headerRow, common.getListWorkItemTypeTuyen().size());

    }

    private int fillSectionGPON(XSSFSheet sheet, DetailMonthPlanExportDTO common,
                                List<ConstructionTaskDetailDTO> listData, int i) {
        // TODO Auto-generated method stub
        i = fillHeader(sheet, common.getListWorkItemTypeGPON(), i, "2");
        int headerRow = i - 1;
        return fillDataTable(sheet, listData, i, GPON, headerRow, common.getListWorkItemTypeGPON().size());

    }

    private int fillSectionBTS(XSSFSheet sheet, DetailMonthPlanExportDTO common,
                               List<ConstructionTaskDetailDTO> listData, int i) {
        // TODO Auto-generated method stub
        i = fillHeader(sheet, common.getListWorkItemTypeBTS(), i, "1");
        int headerRow = i - 1;
        return fillDataTable(sheet, listData, i, BTS, headerRow, common.getListWorkItemTypeBTS().size());

    }

    private int fillDataTable(XSSFSheet sheet, List<ConstructionTaskDetailDTO> data, int i, String type, int headerRow,
                              int headerCount) {
        // TODO Auto-generated method stub
        XSSFCellStyle style = ExcelUtils.styleText(sheet);
        XSSFCellStyle styleCurrency = ExcelUtils.styleCurrency(sheet);
        XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
        Row header = sheet.getRow(headerRow);
        if (data != null && !data.isEmpty()) {
            int stt = 1;
            for (ConstructionTaskDetailDTO dto : data) {
                if (type.equalsIgnoreCase(dto.getCatConstructionTypeName())) {
                    Row row = sheet.createRow(i++);
                    Cell cell = row.createCell(0, CellType.STRING);
                    cell.setCellValue("" + (stt++));
                    cell.setCellStyle(style);
                    cell = row.createCell(1, CellType.STRING);
                    cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(2, CellType.STRING);
                    cell.setCellValue((dto.getCatProvinceCode() != null) ? dto.getCatProvinceCode() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(3, CellType.STRING);
                    cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(4, CellType.STRING);
                    cell.setCellValue(type);
                    cell.setCellStyle(style);
                    cell = row.createCell(5, CellType.STRING);
                    cell.setCellValue("1".equalsIgnoreCase(dto.getIsObstructed()) ? "Có" : "Không");
                    cell.setCellStyle(style);
                    cell = row.createCell(6, CellType.STRING);
                    cell.setCellValue((dto.getCntContract() != null) ? dto.getCntContract() : "");
                    cell.setCellStyle(style);
                    for (int size = 0; size < headerCount; size++) {
                        cell = row.createCell(8 + size, CellType.NUMERIC);
                        cell.setCellStyle(styleCurrency);
                        Cell headerCell = header.getCell(size + 8);
                        for (WorkItemDetailDTO value : dto.getListWorkItemForExport()) {
                            if (headerCell != null)
                                if (value.getCatWorkItemTypeName().equals(headerCell.getStringCellValue())) {
                                    if (value.getQuantity() != null) {
                                        cell.setCellValue(value.getQuantity());
                                    }

                                    break;
                                }
                        }

                    }

                    cell = row.createCell(7, CellType.NUMERIC);
                    cell.setCellValue(dto.getQuantity() != null ? dto.getQuantity() : 0);
                    cell.setCellStyle(styleCurrency);

                    cell = row.createCell(8 + headerCount, CellType.STRING);
                    cell.setCellValue((dto.getSupervisorName() != null) ? dto.getSupervisorName().toString() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(9 + headerCount, CellType.STRING);
                    cell.setCellValue((dto.getDirectorName() != null) ? dto.getDirectorName().toString() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(10 + headerCount, CellType.STRING);
                    cell.setCellValue((dto.getPerformerName() != null) ? dto.getPerformerName().toString() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(11 + headerCount, CellType.STRING);
                    cell.setCellValue((DateTimeUtils.convertDateToString(dto.getStartDate(), "dd/MM/yyyy")));
                    cell.setCellStyle(styleDate);
                    cell = row.createCell(12 + headerCount, CellType.STRING);
                    cell.setCellValue((DateTimeUtils.convertDateToString(dto.getEndDate(), "dd/MM/yyyy")));
                    cell.setCellStyle(styleDate);
                    cell = row.createCell(13 + headerCount, CellType.STRING);
                    cell.setCellValue((dto.getDescription() != null) ? dto.getDescription().toString() : "");
                    cell.setCellStyle(style);
                }

            }
        }
        return i;
    }

    private int fillHeader(XSSFSheet sheet, List<CatCommonDTO> data, int i, String type) {
        // TODO Auto-generated method stub
        i++;
        int length = data.size();
        String typeName = "";
        if ("1".equalsIgnoreCase(type)) {
            typeName = "1.Loại công trình BTS";
        } else if ("2".equalsIgnoreCase(type)) {
            typeName = "2.Loại công trình GPON";
        } else if ("3".equalsIgnoreCase(type)) {
            typeName = "3.Loại công trình tuyến";
        } else if ("4".equalsIgnoreCase(type)) {
            typeName = "4.Loại công trình lẻ";
        }
        XSSFCellStyle style = ExcelUtils.styleText(sheet);
        XSSFCellStyle styleTextNotWrap = ExcelUtils.styleTextNotWrap(sheet);
        XSSFCellStyle styleHeader = ExcelUtils.styleHeader(sheet);
        Row row = sheet.createRow(i++);
        Cell cell = row.createCell(0, CellType.STRING);
        cell.setCellValue(typeName);
        cell.setCellStyle(styleTextNotWrap);
        row = sheet.createRow(i++);
        cell = row.createCell(0);
        cell.setCellValue("TT");
        cell.setCellStyle(styleHeader);
        cell = row.createCell(1);
        cell.setCellValue("Mã trạm");
        cell.setCellStyle(styleHeader);

        cell = row.createCell(2);
        cell.setCellValue("Mã tỉnh");
        cell.setCellStyle(styleHeader);

        cell = row.createCell(3);
        cell.setCellValue("Mã công trình");
        cell.setCellStyle(styleHeader);

        cell = row.createCell(4);
        cell.setCellValue("Loại công trình");
        cell.setCellStyle(styleHeader);

        cell = row.createCell(5);
        cell.setCellValue("Bị vướng");
        cell.setCellStyle(styleHeader);

        cell = row.createCell(6);
        cell.setCellValue("Hợp đồng đầu ra");
        cell.setCellStyle(styleHeader);

        cell = row.createCell(7);
        cell.setCellValue("Giá trị SL");
        cell.setCellStyle(styleHeader);
        for (int m = 8; m < length + 8; m++) {
            cell = row.createCell(m);
            cell.setCellStyle(styleHeader);
            sheet.setColumnWidth(m, WIDTH);
        }
        cell = row.createCell(8 + length);
        cell.setCellValue("Tỉnh trưởng");
        cell.setCellStyle(styleHeader);
        sheet.setColumnWidth(8 + length, WIDTH);
        cell = row.createCell(9 + length);
        cell.setCellValue("PGĐ chuyên trách");
        cell.setCellStyle(styleHeader);
        sheet.setColumnWidth(9 + length, WIDTH);
        cell = row.createCell(10 + length);
        cell.setCellValue("Người thực hiện");
        cell.setCellStyle(styleHeader);
        sheet.setColumnWidth(10 + length, WIDTH);
        cell = row.createCell(11 + length);
        cell.setCellValue("Thời gian bắt đầu HSHC");
        cell.setCellStyle(styleHeader);
        sheet.setColumnWidth(11 + length, WIDTH);
        cell = row.createCell(12 + length);
        cell.setCellValue("Thời gian hoàn thành HSHC");
        cell.setCellStyle(styleHeader);
        sheet.setColumnWidth(12 + length, WIDTH);
        cell = row.createCell(13 + length);
        cell.setCellValue("Ghi chú");
        cell.setCellStyle(styleHeader);
        sheet.setColumnWidth(13 + length, WIDTH);
        row = sheet.createRow(i++);
        cell = row.createCell(7);
        cell.setCellValue("Tổng");
        cell.setCellStyle(styleHeader);
        sheet.setColumnWidth(7, WIDTH);
        int k = 8;
        for (int m = 0; m < 7; m++) {
            cell = row.createCell(m);
            cell.setCellStyle(styleHeader);
        }
        for (CatCommonDTO dt : data) {
            cell = row.createCell(k++);
            cell.setCellValue(dt.getName());
            cell.setCellStyle(styleHeader);
        }
        for (int m = 8 + length; m < length + 14; m++) {
            cell = row.createCell(m);
            cell.setCellStyle(styleHeader);
        }
        for (int j = 0; j < 15 + length; j++) {
            if (j == 7) {
                if (length != 0) {
                    sheet.addMergedRegion(new CellRangeAddress(i - 2, i - 2, j, j + length));
                    j = j + length;
                }
            } else
                sheet.addMergedRegion(new CellRangeAddress(i - 2, i - 1, j, j));
        }
        return i;
    }

    private void generatePl6File(List<ConstructionTaskDetailDTO> data, List<File> attachFileList, String reportPath,
                                 CommonDTO common) throws IOException {
        // TODO Auto-generated method stub
        InputStream inputStream = new BufferedInputStream(
                new FileInputStream(reportPath + "PL6_KH_cong_viec_khac.xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
        inputStream.close();
        String pathReturn = generateLocationFile();
        File udir = new File(folderUpload + pathReturn);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        File file = new File(folderUpload + pathReturn + File.separator + "PL6_KH_cong_viec_khac.xlsx");
        OutputStream outFile = new FileOutputStream(file);
        XSSFSheet sheet = workbook.getSheetAt(0);
        XSSFCellStyle style = ExcelUtils.styleText(sheet);
        XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);

        Row row = sheet.getRow(0);
        Cell cell = row.getCell(1);
        cell.setCellValue("PL6 KẾ HOẠCH CÔNG VIỆC KHÁC THÁNG " + common.getMonth() + " NĂM " + common.getYear() + " "
                + (common.getSysName() != null ? common.getSysName().toUpperCase() : ""));
        cell.setCellStyle(style);
        if (data != null && !data.isEmpty()) {
            int i = 3;
            int stt = 1;
            for (ConstructionTaskDetailDTO dto : data) {
                row = sheet.createRow(i++);
                cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (stt++));
                cell.setCellStyle(style);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue((dto.getTaskName() != null) ? dto.getTaskName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue((dto.getPerformerName() != null) ? dto.getPerformerName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(3, CellType.STRING);
                cell.setCellValue((dto.getStartDateStr() != null ? dto.getStartDateStr() : ""));
                cell.setCellStyle(styleDate);
                cell = row.createCell(4, CellType.STRING);
                cell.setCellValue((dto.getEndDateStr() != null ? dto.getEndDateStr() : ""));
                cell.setCellStyle(styleDate);
                cell = row.createCell(5, CellType.STRING);
                cell.setCellValue((dto.getDescription() != null) ? dto.getDescription() : "");
                cell.setCellStyle(style);

            }
        }
        workbook.write(outFile);
        workbook.close();
        outFile.close();
        attachFileList.add(file);
    }

    private void generatePl4File(List<DmpnOrderDTO> data, List<File> attachFileList, String reportPath,
                                 CommonDTO common) throws IOException {
        // TODO Auto-generated method stub
        InputStream inputStream = new BufferedInputStream(new FileInputStream(reportPath + "PL4_KH_vat_tu.xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
        inputStream.close();
        String pathReturn = generateLocationFile();
        File udir = new File(folderUpload + pathReturn);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        File file = new File(folderUpload + pathReturn + File.separator + "PL4_KH_vat_tu.xlsx");
        OutputStream outFile = new FileOutputStream(file);
        XSSFSheet sheet = workbook.getSheetAt(0);
        XSSFCellStyle style = ExcelUtils.styleText(sheet);
        XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
        int i = 0;
        Row row = sheet.getRow(0);
        Cell cell = row.getCell(1);
        cell.setCellValue("PL4 KẾ HOẠCH YÊU CẦU VẬT TƯ THÁNG " + common.getMonth() + " NĂM " + common.getYear() + " "
                + (common.getSysName() != null ? common.getSysName().toUpperCase() : ""));
        cell.setCellStyle(style);
        if (data != null && !data.isEmpty()) {
            i = 4;
            int stt = 1;
            for (DmpnOrderDTO dto : data) {
                row = sheet.createRow(i++);
                cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (stt++));
                cell.setCellStyle(style);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue((dto.getGoodsCode() != null) ? dto.getGoodsCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue((dto.getGoodsName() != null) ? dto.getGoodsName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(3, CellType.STRING);
                cell.setCellValue((dto.getUnitName() != null) ? dto.getUnitName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(4, CellType.STRING);
                cell.setCellValue((dto.getQuantity() != null) ? dto.getQuantity().toString() : "");
                cell.setCellStyle(styleNumber);

            }
        }
        workbook.write(outFile);
        workbook.close();
        outFile.close();
        attachFileList.add(file);
    }

    private void generatePl1File(List<ConstructionTaskDetailDTO> data, List<File> attachFileList, String reportPath,
                                 CommonDTO common) throws Exception {
        // TODO Auto-generated method stub
        InputStream inputStream = new BufferedInputStream(new FileInputStream(reportPath + "PL1_KH_san_luong.xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
        inputStream.close();
        String pathReturn = generateLocationFile();
        File udir = new File(folderUpload + pathReturn);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        File file = new File(folderUpload + pathReturn + File.separator + "PL1_KH_san_luong.xlsx");
        OutputStream outFile = new FileOutputStream(file);
        XSSFSheet sheet = workbook.getSheetAt(0);
        XSSFCellStyle style = ExcelUtils.styleText(sheet);
        XSSFCellStyle styleCurrency = ExcelUtils.styleCurrency(sheet);
        XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
        XSSFCellStyle styleTextNotWrap = ExcelUtils.styleTextNotWrap(sheet);
        int i = 0;
        Row row = sheet.createRow(i++);
        Cell cell = row.createCell(3, CellType.STRING);
        cell.setCellValue("PL1 KẾ HOẠCH SẢN LƯỢNG THÁNG " + common.getMonth() + " NĂM " + common.getYear() + " "
                + (common.getSysName() != null ? common.getSysName().toUpperCase() : ""));
        cell.setCellStyle(styleTextNotWrap);
        if (data != null && !data.isEmpty()) {
            i = 4;
            int stt = 1;
            for (ConstructionTaskDetailDTO dto : data) {
                row = sheet.createRow(i++);
                cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (stt++));
                cell.setCellStyle(style);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue((dto.getCatProvinceCode() != null) ? dto.getCatProvinceCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(3, CellType.STRING);
                cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(4, CellType.STRING);
                cell.setCellValue((dto.getWorkItemName() != null) ? dto.getWorkItemName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(5, CellType.STRING);
                cell.setCellValue((dto.getCntContract() != null) ? dto.getCntContract() : "");
                cell.setCellStyle(style);
                cell = row.createCell(6, CellType.NUMERIC);
                cell.setCellValue(dto.getQuantity() != null ? dto.getQuantity().doubleValue() : 0);
                cell.setCellStyle(styleCurrency);
                cell = row.createCell(7, CellType.STRING);
                cell.setCellValue((dto.getSourceType() != null && "1".equalsIgnoreCase(dto.getSourceType()))
                        ? dto.getSourceType().toString()
                        : "");
                cell.setCellStyle(style);
                cell = row.createCell(8, CellType.STRING);
                cell.setCellValue((dto.getSourceType() != null && "2".equalsIgnoreCase(dto.getSourceType()))
                        ? dto.getSourceType().toString()
                        : "");
                cell.setCellStyle(style);
                cell = row.createCell(9, CellType.STRING);
                cell.setCellValue((dto.getDeployType() != null && "1".equalsIgnoreCase(dto.getDeployType()))
                        ? dto.getDeployType().toString()
                        : "");
                cell.setCellStyle(style);
                cell = row.createCell(10, CellType.STRING);
                cell.setCellValue((dto.getDeployType() != null && "2".equalsIgnoreCase(dto.getDeployType()))
                        ? dto.getDeployType().toString()
                        : "");
                cell.setCellStyle(style);
                cell = row.createCell(11, CellType.STRING);
                cell.setCellValue((dto.getSupervisorName() != null) ? dto.getSupervisorName().toString() : "");
                cell.setCellStyle(style);
                cell = row.createCell(12, CellType.STRING);
                cell.setCellValue((dto.getDirectorName() != null) ? dto.getDirectorName().toString() : "");
                cell.setCellStyle(style);
                cell = row.createCell(13, CellType.STRING);
                cell.setCellValue((dto.getPerformerName() != null) ? dto.getPerformerName().toString() : "");
                cell.setCellStyle(style);
                cell = row.createCell(14, CellType.STRING);
                cell.setCellValue((DateTimeUtils.convertDateToString(dto.getStartDate(), "dd/MM/yyyy")));
                cell.setCellStyle(styleDate);
                cell = row.createCell(15, CellType.STRING);
                cell.setCellValue((DateTimeUtils.convertDateToString(dto.getEndDate(), "dd/MM/yyyy")));
                cell.setCellStyle(styleDate);
                cell = row.createCell(16, CellType.STRING);
                cell.setCellValue((dto.getDescription() != null) ? dto.getDescription().toString() : "");
                cell.setCellStyle(style);

            }
        }
        workbook.write(outFile);
        workbook.close();
        outFile.close();
        attachFileList.add(file);
    }

    @Override
    public Response viewSignedDoc(CommonDTO dto) throws Exception {
        // TODO Auto-generated method stub
        byte[] value = null;
        SignVofficeDTO docSign = signVofficeBusinessImpl.getByObjIdAndType(dto.getObjectId(), dto.getType());
        FileAttachTranferList data = signVofficeBusinessImpl.viewSignedDoc(docSign);
        if (data != null) {
            List<FileAttachTranfer> list = data.getLstFileAttachTranfer();
            if (list != null && !list.isEmpty()) {
                FileAttachTranfer attach = list.get(0);
                value = attach.getAttachBytes();
                return Response.ok().entity(value).build();
            }
        }
        return Response.ok().entity(Collections.singletonMap("error", "Có lỗi xảy ra khi lấy dữ liệu từ VOffice!"))
                .build();

    }

    private void generateAttachFile(CommonDTO dto) throws Exception {
        // TODO Auto-generated method stub
        DetailMonthPlanExportDTO data = detailMonthPlanBusinessImpl.getDataAttachForSignVOffice(dto);
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String reportPath = classloader.getResource("../" + "doc-template").getPath();
        List<File> attachFileList = new ArrayList<File>();
        // generateListOfAttachFile
        generatePl1File(data.getPl1ExcelList(), attachFileList, reportPath, dto);
        generatePl2File(data, attachFileList, reportPath, dto);
        generatePl3File(data, attachFileList, reportPath, dto);
        generatePl5File(data, attachFileList, reportPath, dto);
        generatePl4File(data.getPl4ExcelList(), attachFileList, reportPath, dto);
        generatePl6File(data.getPl6ExcelList(), attachFileList, reportPath, dto);

        if (!attachFileList.isEmpty()) {
            for (File file : attachFileList) {
                FileAttachTranfer attach = new FileAttachTranfer();
                if (file.exists()) {
                    byte[] arr = FileUtils.getBytes(file);
                    attach.setAttachBytes(arr);
                    attach.setFileName(file.getName());
                    attach.setFileSign(1l);
                }
                dto.getLstFileAttach().add(attach);
            }
        }
    }
    
    /**hoangnh start 14012019**/
    @Override
    public Response signVofficeKHSXVT(List<CommonDTO> list) throws Exception {
        try {
            // KttsUserSession objUser =
            // userRoleBusinessImpl.getUserSession(request);
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            for (CommonDTO obj : list) {
            	Session session = signVofficeBusinessImpl.gettDAO().getSessionFactory().openSession();
            	log.debug("GoodsPlanId" + obj.getGoodsPlanId());
            	SignVofficeDTO signVofficeDTO = goodsPlanBusinessImpl.getInformationVO(obj.getGoodsPlanId());
            	if(signVofficeDTO != null){
            		if(signVofficeDTO.getSignVofficeId() != null){
                		goodsPlanBusinessImpl.removeSignVO(signVofficeDTO.getSignVofficeId());
                		goodsPlanBusinessImpl.removeSignDetailVO(signVofficeDTO.getSignVofficeId());
                		log.debug("Remove SignVO + SignDetailVo" + signVofficeDTO.getSignVofficeId());
                	}
            	}
            	String reportName = obj.getReportName();
                String pathReturn = generateLocationFile();
                File udir = new File(folderUpload + pathReturn);
                if (!udir.exists()) {
                    udir.mkdirs();
                }
                HashMap<String, Object> params = new HashMap<String, Object>();
    			BeanInfo info = Introspector.getBeanInfo(obj.getClass());

    			for (PropertyDescriptor pd : info.getPropertyDescriptors()) {
    				Method reader = pd.getReadMethod();
    				if (reader != null) {
    					params.put(pd.getName(), reader.invoke(obj));
    				}
    			}
                String path = UFile.getFilePath(folderUpload, "temp");
                String prefix = makePrefix(reportName);
                File file = File.createTempFile(prefix, ".pdf", new File(path));
    			generateReport(session, obj.getReportName(), null, Constants.PDF_REPORT, params, file, reportName);
    			session.close();
    			ConverObjectToPDF.addNoteIntoFile(file, reportName);
    			FileAttachTranfer attach = new FileAttachTranfer();
    			if (file.exists()) {
    				attach.setAttachBytes(FileUtils.getBytes(file));
    				attach.setFileName(reportName + ".pdf");
    				attach.setFileSign(1l);
    			}
    			obj.getLstFileAttach().add(attach);
            }
            String err = signVofficeBusinessImpl.signVoffice(list, objUser, request);
            return Response.ok().entity(Collections.singletonMap("error", err)).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
    
    @Override
	public Response previewSignedDoc(CommonDTO obj) throws Exception {
		Session session = signVofficeBusinessImpl.gettDAO().getSessionFactory().openSession();

		HashMap<String, Object> params = new HashMap<String, Object>();
		BeanInfo info = Introspector.getBeanInfo(obj.getClass());

		for (PropertyDescriptor pd : info.getPropertyDescriptors()) {
			Method reader = pd.getReadMethod();
			if (reader != null)
				params.put(pd.getName(), reader.invoke(obj));
		}

		String reportName = obj.getReportName();
		String path = UFile.getFilePath(folderUpload, tempFileFolderUpload);
		String prefix = makePrefix(reportName);
		File file = File.createTempFile(prefix, ".pdf", new File(path));
		generateReport(session, reportName, null, Constants.PDF_REPORT, params, file, reportName);
		session.close();

		if (file.exists()) {
			ResponseBuilder response = Response.ok(file);
			return response.build();
		}

		return Response.status(Response.Status.NO_CONTENT).build();
	}
}
