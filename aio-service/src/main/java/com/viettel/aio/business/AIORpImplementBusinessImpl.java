package com.viettel.aio.business;

import com.viettel.aio.dao.AIORpImplementDAO;
import com.viettel.aio.dto.report.AIORpImplementDTO;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.io.*;

import java.text.SimpleDateFormat;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service("aioRpImplementBusiness")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIORpImplementBusinessImpl implements AIORpImplementBusiness {

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;


    @Autowired
    private AIORpImplementDAO aioRpImplementDAO;

    @Autowired
    public AIORpImplementBusinessImpl(AIORpImplementDAO dao) {
        aioRpImplementDAO = dao;
    }

    @Override
    public List<AIORpImplementDTO> implementByProvince(AIORpImplementDTO obj) {
        return aioRpImplementDAO.implementByProvince(obj);
    }

    @Override
    public List<AIORpImplementDTO> implementByGroup(AIORpImplementDTO obj) {
        return aioRpImplementDAO.implementByGroup(obj);
    }

    @Override
    public List<AIORpImplementDTO> implementByArea(AIORpImplementDTO obj) {
        return aioRpImplementDAO.implementByArea(obj);
    }

    @Override
    public AIORpImplementDTO implementTotal(AIORpImplementDTO obj) {
        AIORpImplementDTO dto = aioRpImplementDAO.implementTotal(obj);
        dto.setAreaCode("TQ");
        dto.setProvinceCode("TQ");
        return dto;
    }

    @Override
    public String doExport(AIORpImplementDTO obj) throws Exception {
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../doc-template").getPath();
        String fileName = "bao_cao_trien_khai_tinh.xlsx";
        switch (obj.getRpLevel()) {
            case 1:
                fileName = "bao_cao_trien_khai_tinh.xlsx";
                break;
            case 2:
                fileName = "bao_cao_trien_khai_cum.xlsx";
                break;
        }
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + fileName));
        XSSFWorkbook wb = new XSSFWorkbook(file);
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
        OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + fileName);

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        Row row;
        Cell cell;
        Sheet sheet = wb.getSheetAt(0);
        CellStyle textLeft = creatCellStyle(wb, HorizontalAlignment.LEFT);
        CellStyle textCenter = creatCellStyle(wb, HorizontalAlignment.CENTER);
        CellStyle textRight = creatCellStyle(wb, HorizontalAlignment.RIGHT);

        short df = wb.createDataFormat().getFormat("0.00%");
        CellStyle percent = creatCellStyle(wb, HorizontalAlignment.CENTER, df);

        row = sheet.getRow(2);
        cell = getCell(row, 2);
        cell.setCellValue("Từ ngày: " + sdf.format(obj.getStartDate()));
        cell = getCell(row, 7);
        cell.setCellValue("Đến ngày: " + sdf.format(obj.getEndDate()));

        List<AIORpImplementDTO> data = new ArrayList<>();

        if (AIORpImplementDTO.LEVEL_PROVINCE == obj.getRpLevel()) {
            data.addAll(implementByProvince(obj));
        }
        if (AIORpImplementDTO.LEVEL_GROUP == obj.getRpLevel()) {
            data.addAll(implementByGroup(obj));
        }

        int startRow = 8;
        int j;
        AIORpImplementDTO item;

        for (int i = 0; i < data.size(); i++) {
            item = data.get(i);
            j = 0;
            row = sheet.getRow(startRow + i);
            if (row == null) row = sheet.createRow(startRow + i);
            cell = getCell(row, j++);
            cell.setCellValue(i + 1);
            cell.setCellStyle(textCenter);
            cell = getCell(row, j++);
            setCellValue(cell, item.getAreaCode(), textCenter);
            cell = getCell(row, j++);
            setCellValue(cell, item.getProvinceName(), textCenter);
            cell = getCell(row, j++);
            if (AIORpImplementDTO.LEVEL_PROVINCE == obj.getRpLevel()) {
                setCellValue(cell, item.getProvinceCode(), textCenter);
            } else {
                setCellValue(cell, item.getGroupName(), textLeft);
            }
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getTyleTONG1(), percent);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getSoTT1(), percent);
            cell = getCell(row, j++);
            setCellValue(cell, item.getRankTT1() == null ? "-" : String.valueOf(item.getRankTT1()), textCenter);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getTyleTM1(), percent);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getSoTTM1(), percent);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getTyleDV1(), percent);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getSoTDV1(), percent);

            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getTyleTONG2(), percent);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getSoTT2(), percent);
            cell = getCell(row, j++);
            setCellValue(cell, item.getRankTT2() == null ? "-" : String.valueOf(item.getRankTT2()), textCenter);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getTyleTM2(), percent);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getSoTTM2(), percent);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getTyleDV2(), percent);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getSoTDV2(), percent);

            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getTyleTONG3(), percent);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getSoTT3(), percent);
            cell = getCell(row, j++);
            setCellValue(cell, item.getRankTT3() == null ? "-" : String.valueOf(item.getRankTT3()), textCenter);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getTyleTM3(), percent);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getSoTTM3(), percent);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getTyleDV3(), percent);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getSoTDV3(), percent);
        }

        wb.write(outFile);
        wb.close();
        outFile.close();
        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + fileName);
        return path;

    }

    private Cell getCell(Row row, int cellNum) {
        Cell cell = row.getCell(cellNum);
        return cell == null ? row.createCell(cellNum) : cell;
    }

    private void setCellValue(Cell cell, String value, CellStyle cellStyle) {
        cell.setCellValue(value);
        cell.setCellStyle(cellStyle);
    }

    private void setCellValuePercent(Cell cell, Double value, CellStyle cellStyle) {
        if (value == null)
            cell.setCellValue("-");
        else
            cell.setCellValue(value/100);
        cell.setCellStyle(cellStyle);
    }

    private CellStyle creatCellStyle(Workbook wb, HorizontalAlignment ha, short df) {
        CellStyle style = wb.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(ha);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setWrapText(true);
        style.setDataFormat(df);
        return style;
    }

    private CellStyle creatCellStyle(Workbook wb, HorizontalAlignment ha) {
        CellStyle style = wb.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(ha);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setWrapText(true);
        return style;
    }

}
