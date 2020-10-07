package com.viettel.coms.business;

import com.viettel.coms.bo.YearPlanDetailBO;
import com.viettel.coms.dao.YearPlanDetailDAO;
import com.viettel.coms.dto.ReportPlanDTO;
import com.viettel.coms.dto.YearPlanDetailDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.service.base.utils.StringUtils;
import com.viettel.utils.DateTimeUtils;
import com.viettel.wms.utils.ValidateUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.io.*;
import java.text.DecimalFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service("yearPlanDetailBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class YearPlanDetailBusinessImpl extends
        BaseFWBusinessImpl<YearPlanDetailDAO, YearPlanDetailDTO, YearPlanDetailBO> implements YearPlanDetailBusiness {

    @Autowired
    private YearPlanDetailDAO yearPlanDetailDAO;

    public YearPlanDetailBusinessImpl() {
        tModel = new YearPlanDetailBO();
        tDAO = yearPlanDetailDAO;
    }

    @Override
    public YearPlanDetailDAO gettDAO() {
        return yearPlanDetailDAO;
    }

    @Override
    public long count() {
        return yearPlanDetailDAO.count("YearPlanDetailBO", null);
    }

    @Value("${folder_upload2}")
    private String folder2Upload;
    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    public List<YearPlanDetailDTO> importYearPlanDetail(String fileInput, String path) throws Exception {

        List<YearPlanDetailDTO> workLst = new ArrayList<YearPlanDetailDTO>();
        File f = new File(fileInput);
        XSSFWorkbook workbook = new XSSFWorkbook(f);
        XSSFSheet sheet = workbook.getSheetAt(0);
        List<String> listGroupCode = new ArrayList<String>();
        Map<String, List<Long>> groupMap = new ConcurrentHashMap<String, List<Long>>();
        DataFormatter formatter = new DataFormatter();
        DecimalFormat df = new DecimalFormat("#.###");
        DecimalFormat longf = new DecimalFormat("#");
        boolean isExistError = false;
        List<Integer> listRowIndexsysGorup = new ArrayList<Integer>();
        int count = 0;
        for (Row row : sheet) {
            count++;
            if (count >= 3 && !ValidateUtils.checkIfRowIsEmpty(row)) {
                boolean checkColumn1 = true;
                boolean checkColumn2 = true;
                boolean checkColumn3 = true;
                boolean checkColumn4 = true;
                boolean checkColumn5 = true;
                boolean checkColumn6 = true;
                String sysGroupCode = "";
                StringBuilder errorMesg = new StringBuilder();
                YearPlanDetailDTO newObj = new YearPlanDetailDTO();
                for (int i = 0; i < 7; i++) {
                    Cell cell = row.getCell(i);
                    if (cell != null) {
                        // Check format file exel
                        if (cell.getColumnIndex() == 1) {
                            sysGroupCode = formatter.formatCellValue(cell).trim();
                            // Check sysGroupCode
                            if (!listGroupCode.contains(sysGroupCode)) {
                                listRowIndexsysGorup.add(count);
                                listGroupCode.add(sysGroupCode);
                                groupMap.put(sysGroupCode, new ArrayList<Long>());
                            }
                            checkColumn1 = yearPlanDetailDAO.getSysGroupData(newObj, sysGroupCode);
                            if (!checkColumn1) {
                                isExistError = true;
                                errorMesg.append("Mã đơn vị không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 2) {
                            try {
                                Long month = Long.parseLong(longf.format(row.getCell(2).getNumericCellValue()));
                                List<Long> monthList = groupMap.get(sysGroupCode);
                                if (monthList.contains(month)) {
                                    isExistError = true;
                                    errorMesg.append("Mã đơn vị và tháng đã bị trùng!");
                                } else {
                                    monthList.add(month);
                                }
                                if (month == null || month.longValue() > 12 || month.longValue() < 1)
                                    checkColumn2 = false;
                                else {
                                    newObj.setMonth(month);
                                }
                            } catch (Exception e) {
                                checkColumn2 = false;
                            }
                            if (!checkColumn2) {
                                isExistError = true;
                                errorMesg.append("\nTháng không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 3) {
                            try {
                                if (StringUtils.isStringNullOrEmpty(formatter.formatCellValue(cell))) {
                                    checkColumn3 = false;
                                } else {
                                    if (formatter.formatCellValue(cell).length() > 25)
                                        checkColumn3 = false;
                                    newObj.setSource(
                                            Double.parseDouble(df.format(cell.getNumericCellValue())) * 1000000);
                                }
                            } catch (Exception e) {
                                checkColumn3 = false;
                            }
                            if (!checkColumn3) {
                                isExistError = true;
                                if (formatter.formatCellValue(cell).length() > 25)
                                    errorMesg.append("\nNguồn việc không vượt quá 14 kí tự!");
                                else {
                                    errorMesg.append("\nNguồn việc không hợp lệ!");
                                }
                            }
                        } else if (cell.getColumnIndex() == 4) {
                            try {

                                if (StringUtils.isStringNullOrEmpty(formatter.formatCellValue(cell))) {
                                    checkColumn4 = false;
                                } else {
                                    if (formatter.formatCellValue(cell).length() > 25)
                                        checkColumn4 = false;
                                    newObj.setQuantity(
                                            Double.parseDouble(df.format(cell.getNumericCellValue())) * 1000000);
                                }
                            } catch (Exception e) {
                                checkColumn4 = false;
                            }
                            if (!checkColumn4) {
                                isExistError = true;
                                if (formatter.formatCellValue(cell).length() > 25)
                                    errorMesg.append("\nSản lượng không vượt quá 14 kí tự!");
                                else {
                                    errorMesg.append("\nSản lượng không hợp lệ!");
                                }
                            }
                        } else if (cell.getColumnIndex() == 5) {
                            try {
                                if (StringUtils.isStringNullOrEmpty(formatter.formatCellValue(cell))) {
                                    checkColumn5 = false;
                                } else {
                                    if (formatter.formatCellValue(cell).length() > 25)
                                        checkColumn5 = false;
                                    newObj.setComplete(
                                            Double.parseDouble(df.format(cell.getNumericCellValue())) * 1000000);
                                }
                            } catch (Exception e) {
                                checkColumn5 = false;
                            }
                            if (!checkColumn5) {
                                isExistError = true;
                                if (formatter.formatCellValue(cell).length() > 25)
                                    errorMesg.append("\nHSHC không vượt quá 14 kí tự!");
                                else {
                                    errorMesg.append("\nHSHC không hợp lệ!");
                                }
                            }
                        } else if (cell.getColumnIndex() == 6) {
                            try {

                                if (StringUtils.isStringNullOrEmpty(formatter.formatCellValue(cell))) {
                                    checkColumn6 = false;
                                } else {
                                    if (formatter.formatCellValue(cell).length() > 25)
                                        checkColumn6 = false;
                                    newObj.setRevenue(
                                            Double.parseDouble(df.format(cell.getNumericCellValue())) * 1000000);
                                }
                            } catch (Exception e) {
                                checkColumn6 = false;
                            }
                            if (!checkColumn6) {
                                isExistError = true;
                                if (formatter.formatCellValue(cell).length() > 25)
                                    errorMesg.append("\nDoanh thu không vượt quá 14 kí tự!");
                                else {
                                    errorMesg.append("\nDoanh thu không hợp lệ!");
                                }
                            }
                            Cell cell1 = row.createCell(7);
                            cell1.setCellValue(errorMesg.toString());
                        }
                    }

                }
                if (checkColumn1 && checkColumn2 && checkColumn3 && checkColumn4 && checkColumn5 && checkColumn6) {
                    workLst.add(newObj);
                }

            }
        }
        // Check 1 đơn vị có đủ 12 tháng.
        int n = 0;
        for (String groupCode : listGroupCode) {
            List<Long> monthList = groupMap.get(groupCode);
            if (monthList == null || monthList.size() < 12) {
                Cell cell = sheet.getRow(listRowIndexsysGorup.get(n) - 1).createCell(7);
                cell.setCellValue("Đơn vị " + groupCode + " chưa nhập đủ 12 tháng.");
                isExistError = true;
            }
            n++;

        }
        if (isExistError) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            sheet.setColumnWidth(7, 5000);
            style.setAlignment(HorizontalAlignment.CENTER);
            Cell cell = sheet.getRow(1).createCell(7);
            cell.setCellValue("Cột lỗi");
            cell.setCellStyle(style);
            YearPlanDetailDTO objErr = new YearPlanDetailDTO();
            OutputStream out = new FileOutputStream(f, true);
            workbook.write(out);
            out.close();
            objErr.setErrorFilePath(UEncrypt.encryptFileUploadPath(path));
            workLst.add(objErr);
        }
        workbook.close();
        return workLst;
    }

    public DataListDTO reportProgress(ReportPlanDTO obj) {
        List<ReportPlanDTO> ls = yearPlanDetailDAO.reportProgress(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

    public String exportYearPlanProgress(ReportPlanDTO obj) throws Exception {
        obj.setPage(null);
        obj.setPageSize(null);
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Bao_cao_ke_hoach_nam.xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        file.close();
        Calendar cal = Calendar.getInstance();
        String uploadPath = folder2Upload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
                + File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
                + File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
                + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
                + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        File udir = new File(uploadPath);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        OutputStream outFile = new FileOutputStream(
                udir.getAbsolutePath() + File.separator + "Bao_cao_ke_hoach_nam.xlsx");
        List<ReportPlanDTO> data = yearPlanDetailDAO.reportProgress(obj);
        String sysGroupName = yearPlanDetailDAO.getSysGroupNameByUserName(obj.getUserName());
        Date dateNow = new Date();
        XSSFSheet sheet = workbook.getSheetAt(0);
        XSSFCellStyle stt = ExcelUtils.styleText1(sheet);
        stt.setAlignment(HorizontalAlignment.CENTER);
        XSSFCellStyle sttbold = ExcelUtils.styleBold(sheet);
        Row rowS10 = sheet.createRow(1);
        Cell cellS10 = rowS10.createCell(0, CellType.STRING);
        cellS10.setCellValue((sysGroupName != null) ? sysGroupName : "");
        cellS10.setCellStyle(stt);
        cellS10 = rowS10.createCell(7, CellType.STRING);
        cellS10.setCellValue("Độc lập - Tự do - Hạnh phúc");
        cellS10.setCellStyle(sttbold);

        Row rowS12 = sheet.createRow(4);
        Cell cellS12 = rowS12.createCell(0, CellType.STRING);
        cellS12.setCellValue("Ngày lập báo cáo:  " + (DateTimeUtils.convertDateToString(dateNow, "dd/MM/yyyy")));
        cellS12.setCellStyle(stt);

		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			// HuyPQ-17/08/2018-edit-start
			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			// HuyPQ-17/08/2018-edit-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			int i = 8;
			for (ReportPlanDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 8));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getYear() != null) ? dto.getYear().toString() : "");
				cell.setCellStyle(styleNumber);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.NUMERIC);
				cell.setCellValue((dto.getQuantity() != null) ? dto.getQuantity() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(4, CellType.NUMERIC);
				cell.setCellValue((dto.getCurrentQuantity() != null) ? dto.getCurrentQuantity() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(5, CellType.STRING);
//				cell.setCellValue(
//						(dto.getCurrentQuantity() != null && dto.getQuantity() != null) ? (dto.getCurrentQuantity() / dto.getQuantity()) + "%"
//								: 0 +"%");
				cell.setCellValue((dto.getProgressQuantity() != null) ? dto.getProgressQuantity() + "%" : 0 +"%");
				cell.setCellStyle(styleNumber);
				cell = row.createCell(6, CellType.NUMERIC);
				cell.setCellValue((dto.getComplete() != null) ? dto.getComplete() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(7, CellType.NUMERIC);
				cell.setCellValue((dto.getCurrentComplete() != null) ? dto.getCurrentComplete() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(8, CellType.STRING);
//				cell.setCellValue(
//						(dto.getCurrentComplete() != null && dto.getComplete() != null) ? (dto.getCurrentComplete() / dto.getComplete()) + "%"
//								: 0  +"%");
				cell.setCellValue((dto.getProgressComplete() != null) ? dto.getProgressComplete() + "%" : 0 +"%");
				cell.setCellStyle(styleNumber);
				cell = row.createCell(9, CellType.NUMERIC);
				cell.setCellValue((dto.getRevenue() != null) ? dto.getRevenue() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(10, CellType.NUMERIC);
				cell.setCellValue((dto.getCurrentRevenue() != null) ? dto.getCurrentRevenue() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(11, CellType.STRING);
//				cell.setCellValue(
//						(dto.getCurrentRevenue() != null && dto.getRevenue() != null) ? (dto.getCurrentRevenue() / dto.getRevenue()) + "%"
//								: 0+"%");
				cell.setCellValue((dto.getProgressRevenue() != null) ? dto.getProgressRevenue() + "%" : 0 +"%");
				cell.setCellStyle(styleNumber);

                // thiếu quantity

            }
        }
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Bao_cao_ke_hoach_nam.xlsx");
        return path;
    }

    private String numberFormat(double value) {
        DecimalFormat myFormatter = new DecimalFormat("###,###.##");
        String output = myFormatter.format(value);
        return output;
    }

    public ReportPlanDTO rpYearProgressDetaill(ReportPlanDTO dto) {
        dto.setPage(1L);
        dto.setPageSize(1000);
        ReportPlanDTO data = new ReportPlanDTO();
        List<ReportPlanDTO> reportPlanList = yearPlanDetailDAO.reportProgress(dto);
        if (reportPlanList != null && !reportPlanList.isEmpty()) {
            int i = 1;
            for (ReportPlanDTO pl : reportPlanList) {
                pl.setTt((i++) + "");
            }
        }
        String sysGroupName = yearPlanDetailDAO.getSysGroupNameByUserName(dto.getUserName());
        data.setSysGroupName(sysGroupName);

        data.setReportPlanList(reportPlanList);

        return data;
    }

}
