package com.viettel.aio.business;

import com.viettel.aio.dao.AIORpBacklogContractDAO;
import com.viettel.aio.dto.report.AIORpBacklogContractDTO;
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
import java.util.Date;
import java.util.List;

@Service("aioRpBacklogContractBusiness")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIORpBacklogContractBusinessImpl implements AIORpBacklogContractBusiness {

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Autowired
    private AIORpBacklogContractDAO aioRpBacklogContractDAO;

    @Autowired
    public AIORpBacklogContractBusinessImpl(AIORpBacklogContractDAO dao) {
        aioRpBacklogContractDAO = dao;
    }

    @Override
    public List<AIORpBacklogContractDTO> rpBacklogContractByArea(AIORpBacklogContractDTO obj) {
        return aioRpBacklogContractDAO.rpBacklogContractByArea(obj);
    }

    @Override
    public List<AIORpBacklogContractDTO> rpBacklogContractByProvince(AIORpBacklogContractDTO obj) {
        return aioRpBacklogContractDAO.rpBacklogContractByProvince(obj);
    }

    @Override
    public List<AIORpBacklogContractDTO> rpBacklogContractByGroup(AIORpBacklogContractDTO obj) {
        return aioRpBacklogContractDAO.rpBacklogContractByGroup(obj);
    }

    @Override
    public AIORpBacklogContractDTO rpBacklogContractTotal(AIORpBacklogContractDTO obj) {
        return aioRpBacklogContractDAO.rpBacklogContractTotal(obj);
    }

    @Override
    public String doExport(AIORpBacklogContractDTO obj) throws Exception {
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../doc-template").getPath();
        String fileName = "bao_cao_hop_dong_ton_tinh.xlsx";
        switch (obj.getRpLevel()) {
            case 1:
                fileName = "bao_cao_hop_dong_ton_tinh.xlsx";
                break;
            case 2:
                fileName = "bao_cao_hop_dong_ton_cum.xlsx";
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

        row = sheet.getRow(2);
        cell = getCell(row, 6);
        cell.setCellValue("Đến ngày: " + sdf.format(new Date()));

        List<AIORpBacklogContractDTO> data = new ArrayList<>();
        if (AIORpBacklogContractDTO.LEVEL_PROVINCE == obj.getRpLevel()) {
            data.addAll(rpBacklogContractByProvince(obj));
        }
        if (AIORpBacklogContractDTO.LEVEL_GROUP == obj.getRpLevel()) {
            data.addAll(rpBacklogContractByGroup(obj));
        }

        int startRow = 6;
        int j = 0;
        AIORpBacklogContractDTO item;
        for (int i = 0; i < data.size(); i++) {
            item = data.get(i);
            j = 0;
            row = sheet.getRow(startRow + i);
            if (row == null) row = sheet.createRow(startRow + i);

            cell = getCell(row, j++);
            setCellValue(cell, item.getAreaCode(), textCenter);
            if (AIORpBacklogContractDTO.LEVEL_PROVINCE == obj.getRpLevel()) {
                cell = getCell(row, j++);
                setCellValue(cell, item.getProvinceName(), textCenter);
                cell = getCell(row, j++);
                setCellValue(cell, item.getProvinceCode(), textCenter);
            } else {
                cell = getCell(row, j++);
                setCellValue(cell, item.getProvinceCode(), textCenter);
                cell = getCell(row, j++);
                setCellValue(cell, item.getGroupName(), textLeft);
            }

            cell = getCell(row, j++);
            setCellValue(cell, item.getTongTon(), textCenter);
            cell = getCell(row, j++);
            setCellValue(cell, item.getTon1Ngay(), textCenter);
            cell = getCell(row, j++);
            setCellValue(cell, item.getTon2Ngay(), textCenter);
            cell = getCell(row, j++);
            setCellValue(cell, item.getTon3Ngay(), textCenter);
            cell = getCell(row, j++);
            setCellValue(cell, item.getTonQua3Ngay(), textCenter);
            cell = getCell(row, j++);
            setCellValue(cell, item.getChoHuy(), textCenter);
            cell = getCell(row, j++);
            setCellValue(cell, item.getHdmTrongNgay(), textCenter);
            cell = getCell(row, j++);
            setCellValue(cell, item.getHdntTrongNgay(), textCenter);
        }

        wb.write(outFile);
        wb.close();
        outFile.close();
        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + fileName);
        return path;

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

    private void setCellValue(Cell cell, String value, CellStyle cellStyle) {
        cell.setCellValue(value);
        cell.setCellStyle(cellStyle);
    }

    private void setCellValue(Cell cell, long value, CellStyle cellStyle) {
        cell.setCellValue(value);
        cell.setCellStyle(cellStyle);
    }

    private Cell getCell(Row row, int cellNum) {
        Cell cell = row.getCell(cellNum);
        return cell == null ? row.createCell(cellNum) : cell;
    }

}
