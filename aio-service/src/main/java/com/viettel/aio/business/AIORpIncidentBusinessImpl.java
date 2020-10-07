package com.viettel.aio.business;

import com.viettel.aio.dao.AIORpIncidentDAO;
import com.viettel.aio.dto.report.AIORpImplementDTO;
import com.viettel.aio.dto.report.AIORpIncidentDTO;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import com.viettel.utils.DateTimeUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.io.*;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.List;

/**
 * Created by HaiND on 9/26/2019 9:34 PM.
 */
@Service("aioRpIncidentBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIORpIncidentBusinessImpl extends BaseFWBusinessImpl<AIORpIncidentDAO, AIORpIncidentDTO, BaseFWModelImpl> {

    @Autowired
    private AIORpIncidentDAO aioRpIncidentDAO;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    public List<AIORpIncidentDTO> doSearchArea(AIORpIncidentDTO dto) {
        return aioRpIncidentDAO.doSearchArea(dto);
    }

    public List<AIORpIncidentDTO> doSearchGroup(AIORpIncidentDTO dto) {
        return aioRpIncidentDAO.doSearchGroup(dto);
    }

    public DataListDTO doSearch(AIORpIncidentDTO dto) {

        List<AIORpIncidentDTO> dtoList;
        if (dto.getIsCluster() == 0) {
            dtoList = aioRpIncidentDAO.doSearchProvince(dto);
        } else {
            dtoList = aioRpIncidentDAO.doSearchCluster(dto);
        }

        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtoList);
        dataListDTO.setTotal(dto.getTotalRecord());
        dataListDTO.setSize(dto.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public String doExport(AIORpIncidentDTO obj) throws Exception {
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../doc-template").getPath();
        String fileName = "bao_cao_xu_ly_su_co_tinh.xlsx";
        switch (obj.getIsCluster()) {
            case 0:
                fileName = "bao_cao_xu_ly_su_co_tinh.xlsx";
                break;
            case 1:
                fileName = "bao_cao_xu_ly_su_co_cum.xlsx";
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

        List<AIORpIncidentDTO> data = new ArrayList<>();
        if (0 == obj.getIsCluster()) {
            data.addAll(aioRpIncidentDAO.doSearchProvince(obj));
        }
        if (1 == obj.getIsCluster()) {
            data.addAll(aioRpIncidentDAO.doSearchCluster(obj));
        }

        int startRow = 6;
        int j = 0;
        AIORpIncidentDTO item;

        for (int i = 0; i < data.size(); i++) {
            item = data.get(i);
            j = 0;
            row = sheet.getRow(startRow + i);
            if (row == null) row = sheet.createRow(startRow + i);
            cell = getCell(row, j++);
            setCellValue(cell, String.valueOf(i + 1), textCenter);
            cell = getCell(row, j++);
            setCellValue(cell, item.getAreaCode(), textCenter);
            cell = getCell(row, j++);
            setCellValue(cell, item.getProvinceName(), textCenter);
            cell = getCell(row, j++);
            if (0 == obj.getIsCluster()) {
                setCellValue(cell, item.getProvinceCode(), textCenter);
            } else {
                setCellValue(cell, item.getClusterName(), textLeft);
            }
            cell = getCell(row, j++);
            setCellValue(cell, item.getIncidentNo() ==  null ? "-" : String.valueOf(item.getIncidentNo()), textCenter);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getPerform12h(), percent);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getSoTarget12h(), percent);
            cell = getCell(row, j++);
            setCellValue(cell, item.getRank12h() ==  null ? "-" : String.valueOf(item.getRank12h()), textCenter);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getPerform24h(), percent);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getSoTarget24h(), percent);
            cell = getCell(row, j++);
            setCellValue(cell, item.getRank24h() ==  null ? "-" : String.valueOf(item.getRank24h()), textCenter);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getPerform48h(), percent);
            cell = getCell(row, j++);
            setCellValuePercent(cell, item.getSoTarget48h(), percent);
            cell = getCell(row, j++);
            setCellValue(cell, item.getRank48h() ==  null ? "-" : String.valueOf(item.getRank48h()), textCenter);
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
        {
            cell.setCellValue("-");
        } else {
            cell.setCellValue(value/100);
        }
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
