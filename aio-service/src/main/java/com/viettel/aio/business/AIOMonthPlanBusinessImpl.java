package com.viettel.aio.business;

import com.viettel.aio.bo.AIOMonthPlanBO;
import com.viettel.aio.dao.AIOMonthPlanDAO;
import com.viettel.aio.dao.AIOMonthPlanDetailDAO;
import com.viettel.aio.dto.AIOMonthPlanDTO;
import com.viettel.aio.dto.AIOMonthPlanDetailDTO;
import com.viettel.aio.dto.report.AIOReportDTO;
import com.viettel.coms.dto.ExcelErrorDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.coms.utils.ValidateUtils;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.openxml4j.util.ZipSecureFile;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service("aioMonthPlanBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOMonthPlanBusinessImpl extends BaseFWBusinessImpl<AIOMonthPlanDAO, AIOMonthPlanDTO, AIOMonthPlanBO> implements AIOMonthPlanBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIOMonthPlanBusinessImpl.class);

    @Autowired
    private AIOMonthPlanDAO aioMonthPlanDAO;

    @Autowired
    private AIOMonthPlanDetailDAO aioMonthPlanDetailDAO;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    public DataListDTO doSearch(AIOMonthPlanDTO criteria) {
        List<AIOMonthPlanDTO> dtos = aioMonthPlanDAO.doSearch(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public String exportFileBM(AIOMonthPlanDTO obj) throws Exception {
        obj.setPage(null);
        obj.setPageSize(null);
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + "BM_ChiTieuThang.xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        file.close();
        Calendar cal = Calendar.getInstance();
        String uploadPath = folderUpload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
                + File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
                + File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
                + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
                + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        File udir = new File(uploadPath);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "BM_ChiTieuThang.xlsx");
        List<AIOMonthPlanDetailDTO> data = aioMonthPlanDAO.getAllSysGroup();
        List<AIOMonthPlanDetailDTO> dataTTKV = aioMonthPlanDAO.getAllDomainData();
        XSSFSheet sheet0 = workbook.getSheetAt(0);
        if (!obj.getIsCreatNew()) {
            List<AIOMonthPlanDetailDTO> dataUpdate = aioMonthPlanDAO.getDetailByMonthPlanId(obj);
            if (dataUpdate != null && !dataUpdate.isEmpty()) {
                int co = 1;
                XSSFCellStyle style = ExcelUtils.styleText(sheet0);
                XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet0);
                styleNumber.setAlignment(HorizontalAlignment.RIGHT);
                for (AIOMonthPlanDetailDTO dto : dataUpdate) {
                    Row row = sheet0.createRow(co++);
                    Cell cell = row.createCell(0, CellType.STRING);
                    cell.setCellValue("" + (co - 1));
                    cell.setCellStyle(styleNumber);
                    cell = row.createCell(1, CellType.STRING);
                    cell.setCellValue((dto.getAreaCode() != null) ? dto.getAreaCode() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(2, CellType.STRING);
                    cell.setCellValue((dto.getSysGroupCode() != null) ? dto.getSysGroupCode() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(3, CellType.STRING);
                    cell.setCellValue((dto.getTargetsMe() != null) ? dto.getTargetsMe() : 0l);
                    cell.setCellStyle(styleNumber);
                    cell = row.createCell(4, CellType.STRING);
                    cell.setCellValue((dto.getTargetsSh() != null) ? dto.getTargetsSh() : 0l);
                    cell.setCellStyle(styleNumber);
                    cell = row.createCell(5, CellType.STRING);
                    cell.setCellValue((dto.getTargetsNlmt() != null) ? dto.getTargetsNlmt() : 0l);
                    cell.setCellStyle(styleNumber);
                    cell = row.createCell(6, CellType.STRING);
                    cell.setCellValue((dto.getTargetsIct() != null) ? dto.getTargetsIct() : 0l);
                    cell.setCellStyle(styleNumber);
                    cell = row.createCell(7, CellType.STRING);
                    cell.setCellValue((dto.getTargetsMs() != null) ? dto.getTargetsMs() : 0l);
                    cell.setCellStyle(styleNumber);
                }
            }
        }

        XSSFSheet sheet1 = workbook.getSheetAt(1);
        if (data != null && !data.isEmpty()) {
            int count = 1;
            XSSFCellStyle style = ExcelUtils.styleText(sheet1);
            XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet1);
            styleNumber.setAlignment(HorizontalAlignment.RIGHT);
            for (AIOMonthPlanDetailDTO dto : dataTTKV) {
                Row row = sheet1.createRow(count++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (count - 1));
                cell.setCellStyle(styleNumber);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue((dto.getSysGroupCode() != null) ? dto.getSysGroupCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
                cell.setCellStyle(style);
            }
        }

        XSSFSheet sheet = workbook.getSheetAt(2);
        if (data != null && !data.isEmpty()) {
            int i = 1;
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
            styleNumber.setAlignment(HorizontalAlignment.RIGHT);
            for (AIOMonthPlanDetailDTO dto : data) {
                Row row = sheet.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (i - 1));
                cell.setCellStyle(styleNumber);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue((dto.getSysGroupCode() != null) ? dto.getSysGroupCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
                cell.setCellStyle(style);
            }
        }
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "BM_ChiTieuThang.xlsx");
        return path;
    }

    public static boolean isRowEmpty(Row row) {
        for (int c = row.getFirstCellNum(); c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c);
            if (cell != null && cell.getCellType() != Cell.CELL_TYPE_BLANK) {
                return false;
            }
        }
        return true;
    }

    private HashMap<Integer, String> colAlias = new HashMap<>();

    {
        colAlias.put(0, "");
        colAlias.put(1, "B");
        colAlias.put(2, "C");
        colAlias.put(3, "D");
        colAlias.put(4, "E");
        colAlias.put(5, "G");
        colAlias.put(6, "G");
        colAlias.put(7, "H");
    }

    private HashMap<Integer, String> colName = new HashMap<>();

    {
        colName.put(0, "");
        colName.put(1, "Mã khu vực");
        colName.put(2, "Mã đơn vị");
        colName.put(3, "Chỉ tiêu M&E(VND)");
        colName.put(4, "Chỉ Smarthome(VND)");
        colName.put(5, "Chỉ tiêu NLMT(VND)");
        colName.put(6, "Chỉ tiêu ICT(VND)");
        colName.put(7, "Chỉ tiêu MS(VND)");
    }

    private ExcelErrorDTO createError(int row, int columnIndex, String detail) {
        ExcelErrorDTO err = new ExcelErrorDTO();
        err.setColumnError(colAlias.get(columnIndex));
        err.setLineError(String.valueOf(row));
        err.setDetailError(colName.get(columnIndex) + " " + detail);
        return err;
    }

    private void doWriteError(List<ExcelErrorDTO> errorList, List<AIOMonthPlanDetailDTO> dtoList, String filePathError, int errColumn) {
        dtoList.clear();

        AIOMonthPlanDetailDTO errorContainer = new AIOMonthPlanDetailDTO();
        errorContainer.setErrorList(errorList);
        errorContainer.setMessageColumn(errColumn); // cột dùng để in ra lỗi
        errorContainer.setFilePathError(filePathError);

        dtoList.add(errorContainer);
    }

    public String convertValue(String value) {
        String val = value.replaceAll(",", "");
        return val;
    }

    public List<AIOMonthPlanDetailDTO> doImportExcel(String filePath) {
        List<AIOMonthPlanDetailDTO> dtoList = new ArrayList<>();
        List<ExcelErrorDTO> errorList = new ArrayList<>();
        HashMap<String, String> mapDuplicate = new HashMap<>();
        try {
            File f = new File(filePath);
            ZipSecureFile.setMinInflateRatio(-1.0d);
            XSSFWorkbook workbook = new XSSFWorkbook(f);
            XSSFSheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();
            Map<String, String> mapGroupCode = new HashMap<>();
            int rowCount = 0;
            for (Row row : sheet) {
                rowCount++;
                if (rowCount >= 2 && !isRowEmpty(row)) {
                    AIOMonthPlanDetailDTO dtoValidated = new AIOMonthPlanDetailDTO();

                    String area = formatter.formatCellValue(row.getCell(1)).trim();
                    String sysGroupCode = formatter.formatCellValue(row.getCell(2)).trim();
//	                String targetsAmount = formatter.formatCellValue(row.getCell(3)).trim();
//	                String targetsAmountDv = formatter.formatCellValue(row.getCell(4)).trim();

                    //tatph-start-25/12/2019
                    String targetsMe = formatter.formatCellValue(row.getCell(3)).trim();
                    String targetsSh = formatter.formatCellValue(row.getCell(4)).trim();
                    String targetsNlmt = formatter.formatCellValue(row.getCell(5)).trim();
                    String targetsIct = formatter.formatCellValue(row.getCell(6)).trim();
                    String targetsMs = formatter.formatCellValue(row.getCell(7)).trim();
                    //tatph-end-25/12/2019

                    int errorCol = 1;

                    if (!StringUtils.isEmpty(area)) {
                        List<AIOMonthPlanDetailDTO> dataTTKV = aioMonthPlanDAO.getAllDomainData();
                        HashMap<String, AIOMonthPlanDetailDTO> mapAreaRef = new HashMap<>();
                        if (dataTTKV != null) {
                            dataTTKV.forEach(r -> mapAreaRef.put(r.getSysGroupCode().toUpperCase(), r));
                        }
                        AIOMonthPlanDetailDTO areaInfo = mapAreaRef.get(area.toUpperCase());
                        if (areaInfo != null) {
                            dtoValidated.setAreaCode(areaInfo.getSysGroupCode());
                        } else {
                            errorList.add(this.createError(rowCount, errorCol, "không tồn tại"));
                        }
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                    }

                    errorCol = 2;
                    if (!StringUtils.isEmpty(sysGroupCode)) {
                        String mapGroup = mapGroupCode.get(sysGroupCode);
                        if (mapGroup != null) {
                            errorList.add(this.createError(rowCount, errorCol, "đã trùng lặp !"));
                        } else {
                            mapGroupCode.put(sysGroupCode, sysGroupCode);
                        }
                        List<AIOMonthPlanDetailDTO> data = aioMonthPlanDAO.getAllSysGroup();
                        HashMap<String, AIOMonthPlanDetailDTO> mapSysGroupRef = new HashMap<>();
                        if (data != null) {
                            data.forEach(r -> mapSysGroupRef.put(r.getSysGroupCode().toUpperCase(), r));
                        }
                        AIOMonthPlanDetailDTO sysGroupInfo = mapSysGroupRef.get(sysGroupCode.toUpperCase());
                        if (sysGroupInfo != null) {
                            if (mapDuplicate.size() == 0) {
                                dtoValidated.setSysGroupId(sysGroupInfo.getSysGroupId());
                                dtoValidated.setSysGroupCode(sysGroupInfo.getSysGroupCode());
                                dtoValidated.setSysGroupName(sysGroupInfo.getSysGroupName());
                                mapDuplicate.put(sysGroupCode.toUpperCase(), area.toUpperCase());
                            } else if (mapDuplicate.get(sysGroupCode.toUpperCase()) != null) {
                                String checkAreaCode = mapDuplicate.get(sysGroupCode.toUpperCase());
                                if (!area.toUpperCase().equals(checkAreaCode)) {
                                    errorList.add(this.createError(rowCount, errorCol, sysGroupCode.toUpperCase() + " không thể thuộc hai khu vực khác nhau"));
                                } else {
                                    dtoValidated.setSysGroupId(sysGroupInfo.getSysGroupId());
                                    dtoValidated.setSysGroupCode(sysGroupInfo.getSysGroupCode());
                                    dtoValidated.setSysGroupName(sysGroupInfo.getSysGroupName());
                                    mapDuplicate.put(sysGroupCode.toUpperCase(), area.toUpperCase());
                                }
                            } else {
                                dtoValidated.setSysGroupId(sysGroupInfo.getSysGroupId());
                                dtoValidated.setSysGroupCode(sysGroupInfo.getSysGroupCode());
                                dtoValidated.setSysGroupName(sysGroupInfo.getSysGroupName());
                                mapDuplicate.put(sysGroupCode.toUpperCase(), area.toUpperCase());
                            }
                        } else {
                            errorList.add(this.createError(rowCount, errorCol, "không tồn tại"));
                        }
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                    }

                    errorCol = 3;
                    String valueTargetsMe = convertValue(targetsMe);
                    if (!StringUtils.isEmpty(targetsMe)) {
                        if (!ValidateUtils.isLong(valueTargetsMe)) {
                            errorList.add(this.createError(rowCount, errorCol, "không đúng định dạng"));

                        } else {
                            if (Long.parseLong(valueTargetsMe) < 0) {
                                errorList.add(this.createError(rowCount, errorCol, "giá trị phải lớn hơn 0"));
                            } else {
                                dtoValidated.setTargetsMe(Long.parseLong(valueTargetsMe));
                            }

                        }
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                    }

                    //Huypq-20190930-start
                    errorCol = 4;
                    String valueTargetsSh = convertValue(targetsSh);
                    if (!StringUtils.isEmpty(targetsSh)) {
                        if (!ValidateUtils.isLong(valueTargetsSh)) {
                            errorList.add(this.createError(rowCount, errorCol, "không đúng định dạng"));

                        } else {
                            if (Long.parseLong(valueTargetsSh) < 0) {
                                errorList.add(this.createError(rowCount, errorCol, "giá trị phải lớn hơn 0"));
                            } else {
                                dtoValidated.setTargetsSh(Long.parseLong(valueTargetsSh));
                            }

                        }
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                    }
                    //Huy-end

                    errorCol = 5;
                    String valueTargetsNlmt = convertValue(targetsNlmt);
                    if (!StringUtils.isEmpty(targetsNlmt)) {
                        if (!ValidateUtils.isLong(valueTargetsNlmt)) {
                            errorList.add(this.createError(rowCount, errorCol, "không đúng định dạng"));

                        } else {
                            if (Long.parseLong(valueTargetsNlmt) < 0) {
                                errorList.add(this.createError(rowCount, errorCol, "giá trị phải lớn hơn 0"));
                            } else {
                                dtoValidated.setTargetsNlmt(Long.parseLong(valueTargetsNlmt));
                            }

                        }
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                    }

                    errorCol = 6;
                    String valueTargetsIct = convertValue(targetsIct);
                    if (!StringUtils.isEmpty(targetsIct)) {
                        if (!ValidateUtils.isLong(valueTargetsIct)) {
                            errorList.add(this.createError(rowCount, errorCol, "không đúng định dạng"));

                        } else {
                            if (Long.parseLong(valueTargetsIct) < 0) {
                                errorList.add(this.createError(rowCount, errorCol, "giá trị phải lớn hơn 0"));
                            } else {
                                dtoValidated.setTargetsIct(Long.parseLong(valueTargetsIct));
                            }

                        }
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                    }

                    errorCol = 7;
                    String valueTargetsMs = convertValue(targetsMs);
                    if (!StringUtils.isEmpty(targetsMs)) {
                        if (!ValidateUtils.isLong(valueTargetsMs)) {
                            errorList.add(this.createError(rowCount, errorCol, "không đúng định dạng"));


                        } else {
                            if (Long.parseLong(valueTargetsMs) < 0) {
                                errorList.add(this.createError(rowCount, errorCol, "giá trị phải lớn hơn 0"));
                            } else {
                                dtoValidated.setTargetsMs(Long.parseLong(valueTargetsMs));
                            }

                        }
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                    }

                    if (errorList.size() == 0) {
                        dtoList.add(dtoValidated);
                    }
                }
            }
            if (errorList.size() > 0) {
                String filePathError = UEncrypt.encryptFileUploadPath(filePath);
                this.doWriteError(errorList, dtoList, filePathError, 8);
            }
            workbook.close();

        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ExcelErrorDTO errorDTO = createError(0, 0, e.toString());
            errorList.add(errorDTO);
            String filePathError = null;

            try {
                filePathError = UEncrypt.encryptFileUploadPath(filePath);
            } catch (Exception ex) {
                LOGGER.error(e.getMessage(), e);
                errorDTO = createError(0, 0, ex.toString());
                errorList.add(errorDTO);
            }
            this.doWriteError(errorList, dtoList, filePathError, 8);
        }

        return dtoList;
    }

    public Long insertMonthPlan(AIOMonthPlanDTO obj) {
        obj.setStatus("1");
        Long id = aioMonthPlanDAO.saveObject(obj.toModel());
        for (AIOMonthPlanDetailDTO dto : obj.getListMonthplanDetail()) {
            dto.setMonthPlanId(id);
            aioMonthPlanDetailDAO.saveObject(dto.toModel());
        }
        return id;
    }

    public DataListDTO getDetailByMonthPlanId(AIOMonthPlanDTO criteria) {
        List<AIOMonthPlanDetailDTO> dtos = aioMonthPlanDAO.getDetailByMonthPlanId(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public Long updateMonthPlan(AIOMonthPlanDTO obj) {
        Long id = aioMonthPlanDAO.updateObject(obj.toModel());
        aioMonthPlanDAO.deleteMonthPlanDetail(obj.getAioMonthPlanId());
        for (AIOMonthPlanDetailDTO dto : obj.getListMonthplanDetail()) {
            dto.setMonthPlanId(obj.getAioMonthPlanId());
            aioMonthPlanDetailDAO.saveObject(dto.toModel());
        }
        return id;
    }

    public List<AIOMonthPlanDetailDTO> getAllSysGroupByName(AIOMonthPlanDetailDTO obj) {
        return aioMonthPlanDAO.getAllSysGroupByName(obj);
    }

    public List<AIOMonthPlanDetailDTO> getAllDomainDataByCode(AIOMonthPlanDetailDTO obj) {
        return aioMonthPlanDAO.getAllDomainDataByCode(obj);
    }

    public void removerMonthPlan(AIOMonthPlanDTO obj) {
        obj.setStatus("0");
        aioMonthPlanDAO.updateObject(obj.toModel());
    }

    public AIOMonthPlanDTO checkDataMonthPlan(AIOMonthPlanDTO obj) {
        return aioMonthPlanDAO.checkDataMonthPlan(obj);
    }

    public List<AIOMonthPlanDetailDTO> doSearchChart(AIOMonthPlanDetailDTO obj) {
        return aioMonthPlanDAO.doSearchChart(obj);
    }

    public List<AIOMonthPlanDetailDTO> getAutoCompleteSysGroupLevel(AIOMonthPlanDetailDTO obj) {
        return aioMonthPlanDAO.getAutoCompleteSysGroupLevel(obj);
    }

    public List<AIOMonthPlanDetailDTO> doSearchChartLine(AIOMonthPlanDetailDTO obj) {
        String monthCur = obj.getMonth() + "/" + obj.getYear();
        List<AIOMonthPlanDetailDTO> objDate = aioMonthPlanDAO.getListDateInMonth(monthCur);
        YearMonth yearMonthObject = YearMonth.of(Integer.parseInt(obj.getYear()), Integer.parseInt(obj.getMonth()));
        int daysInMonth = yearMonthObject.lengthOfMonth();
        AIOMonthPlanDetailDTO plan = aioMonthPlanDAO.getTotalAmountByDay(obj, daysInMonth);
        for (AIOMonthPlanDetailDTO date : objDate) {
            date.setSysGroupId(obj.getSysGroupId());
            AIOMonthPlanDetailDTO perform = aioMonthPlanDAO.getPerformValueByDay(date);
            date.setPlanValue(plan.getPlanValue());
            date.setPerformValue(perform.getPerformValue());
        }

        return objDate;
    }

    public AIOMonthPlanDTO getAioMonthPlanDTO(Long id) {
        return aioMonthPlanDAO.getAioMonthPlanDTO(id);
    }

    public static Date getEndDateOfMonth(String month, String year) throws ParseException {
        String stringInput = "01/" + month + "/" + year;
        Date dateInput = new SimpleDateFormat("dd/MM/yyyy").parse(stringInput);
        Calendar c = Calendar.getInstance();
        c.setTime(dateInput);
        c.set(Calendar.DAY_OF_MONTH, c.getActualMaximum(Calendar.DAY_OF_MONTH));
        return c.getTime();
    }

    public static Date getFirstDateOfMonth(String month, String year) throws ParseException {
        String stringInput = "01/" + month + "/" + year;
        Date dateInput = new SimpleDateFormat("dd/MM/yyyy").parse(stringInput);
        Calendar c = Calendar.getInstance();
        c.setTime(dateInput);
        c.set(Calendar.DAY_OF_MONTH, c.getActualMinimum(Calendar.DAY_OF_MONTH));
        return c.getTime();
    }

    //huypq-20190930-start
    public List<AIOMonthPlanDTO> doSearchChartColumnFailProvince(AIOMonthPlanDTO obj) throws ParseException {
        Date dateFirst = getFirstDateOfMonth(obj.getMonth(), obj.getYear());
        obj.setDateFrom(dateFirst);
        Date dateEnd = getEndDateOfMonth(obj.getMonth(), obj.getYear());
        obj.setDateTo(dateEnd);
        List<AIOMonthPlanDTO> listData = aioMonthPlanDAO.doSearchChartColumnFailProvince(obj);
        HashMap<String, Double> mapOneDay = new HashMap<>();
        HashMap<String, Double> mapTwoDay = new HashMap<>();
        HashMap<String, Double> mapThreeDay = new HashMap<>();

        for (AIOMonthPlanDTO value : listData) {
            mapOneDay.put(value.getSysGroupName(), value.getThucHien1Ngay());
            mapTwoDay.put(value.getSysGroupName(), value.getThucHien2Ngay());
            mapThreeDay.put(value.getSysGroupName(), value.getThucHien3Ngay());
        }

        Map<String, Double> dayOne = mapOneDay.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (oldValue, newValue) -> oldValue, LinkedHashMap::new));

        Map<String, Double> dayTwo = mapTwoDay.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (oldValue, newValue) -> oldValue, LinkedHashMap::new));

        Map<String, Double> dayThree = mapThreeDay.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (oldValue, newValue) -> oldValue, LinkedHashMap::new));


        List<AIOMonthPlanDTO> list = new ArrayList<>();
        int count = 0;
        for (Map.Entry<String, Double> entry : dayOne.entrySet()) {
            AIOMonthPlanDTO data = new AIOMonthPlanDTO();
            data.setSysGroupName(entry.getKey());
            data.setThucHien1Ngay(entry.getValue());
            list.add(data);
            count++;
            if (count == 3) {
                break;
            }
        }
        count = 0;
        for (Map.Entry<String, Double> entry : dayTwo.entrySet()) {
            AIOMonthPlanDTO data = new AIOMonthPlanDTO();
            data.setSysGroupName(entry.getKey());
            data.setThucHien2Ngay(entry.getValue());
            list.add(data);
            count++;
            if (count == 3) {
                break;
            }
        }
        count = 0;
        for (Map.Entry<String, Double> entry : dayThree.entrySet()) {
            AIOMonthPlanDTO data = new AIOMonthPlanDTO();
            data.setSysGroupName(entry.getKey());
            data.setThucHien3Ngay(entry.getValue());
            list.add(data);
            count++;
            if (count == 3) {
                break;
            }
        }
        return list;
    }

    //huy-end
    //tatph-start-16/12/2019
    public List<AIOMonthPlanDTO> doSearchChartColumnFailGroup(AIOReportDTO obj) throws ParseException {
        List<AIOMonthPlanDTO> listData = aioMonthPlanDAO.doSearchChartColumnFailGroup(obj);
        HashMap<String, Double> mapOneDay = new HashMap<>();
        HashMap<String, Double> mapTwoDay = new HashMap<>();
        HashMap<String, Double> mapThreeDay = new HashMap<>();

        for (AIOMonthPlanDTO value : listData) {
            mapOneDay.put(value.getSysGroupName(), value.getThucHien1Ngay());
            mapTwoDay.put(value.getSysGroupName(), value.getThucHien2Ngay());
            mapThreeDay.put(value.getSysGroupName(), value.getThucHien3Ngay());
        }

        Map<String, Double> dayOne = mapOneDay.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (oldValue, newValue) -> oldValue, LinkedHashMap::new));

        Map<String, Double> dayTwo = mapTwoDay.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (oldValue, newValue) -> oldValue, LinkedHashMap::new));

        Map<String, Double> dayThree = mapThreeDay.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (oldValue, newValue) -> oldValue, LinkedHashMap::new));


        List<AIOMonthPlanDTO> list = new ArrayList<>();
        int count = 0;
        for (Map.Entry<String, Double> entry : dayOne.entrySet()) {
            AIOMonthPlanDTO data = new AIOMonthPlanDTO();
            data.setSysGroupName(entry.getKey());
            data.setThucHien1Ngay(entry.getValue());
            list.add(data);
            count++;
            if (count == 3) {
                break;
            }
        }
        count = 0;
        for (Map.Entry<String, Double> entry : dayTwo.entrySet()) {
            AIOMonthPlanDTO data = new AIOMonthPlanDTO();
            data.setSysGroupName(entry.getKey());
            data.setThucHien2Ngay(entry.getValue());
            list.add(data);
            count++;
            if (count == 3) {
                break;
            }
        }
        count = 0;
        for (Map.Entry<String, Double> entry : dayThree.entrySet()) {
            AIOMonthPlanDTO data = new AIOMonthPlanDTO();
            data.setSysGroupName(entry.getKey());
            data.setThucHien3Ngay(entry.getValue());
            list.add(data);
            count++;
            if (count == 3) {
                break;
            }
        }
        return list;
    }
    //tatph-end-16/12/2019
}
