package com.viettel.aio.business;

import com.viettel.aio.dao.AIORevenueReportDAO;
import com.viettel.aio.dto.AIORevenueDailyDTO;
import com.viettel.aio.dto.AIORevenueReportDTO;
import com.viettel.aio.dto.AIORevenueReportSearchDTO;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.BufferedInputStream;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service("aioRevenueReportBussiness")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIORevenueReportBussinessImpl implements AIORevenueReportBussiness {

    @Autowired
    private AIORevenueReportDAO aioRevenueReportDAO;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    private DecimalFormat df = new DecimalFormat("#,##0");

    @Override
    public List<AIORevenueReportDTO> revenueByArea(AIORevenueReportSearchDTO obj) {
        List<AIORevenueReportDTO> dtos = aioRevenueReportDAO.revenueByArea(obj);
        double kht = 0;
        double tht = 0;
        double khtm = 0;
        double thtm = 0;
        double khdv = 0;
        double thdv = 0;
        double dt = 0;
        double dl = 0;
        double dgd = 0;
        double tbnl = 0;
        double tbnn = 0;
        double dv = 0;
        for (AIORevenueReportDTO dto : dtos) {
            dto.setProvinceCode(dto.getAreaCode());
            dto.setName(dto.getProvinceCode());
            kht += dto.getKht();
            tht += dto.getTht();
            khtm += dto.getKhtm();
            thtm += dto.getThtm();
            khdv += dto.getKhdv();
            thdv += dto.getThdv();
            dt += dto.getDt();
            dl += dto.getDl();
            dgd += dto.getDgd();
            tbnl += dto.getTbnl();
            tbnn += dto.getTbnn();
            dv += dto.getDv();
        }
        AIORevenueReportDTO total = new AIORevenueReportDTO();
        total.setProvinceCode("Toàn quốc");
        total.setName("Toàn quốc");
        total.setDgd(dgd);
        total.setDl(dl);
        total.setDt(dt);
        total.setKhdv(khdv);
        total.setKht(kht);
        total.setKhtm(khtm);
        total.setDv(dv);
        total.setTbnl(tbnl);
        total.setTbnn(tbnn);
        total.setThdv(thdv);
        total.setTht(tht);
        total.setThtm(thtm);
        total.setTldv(khdv == 0 ? 0 : Math.round(thdv / khdv * (double) 10000) / (double) 100);
        total.setTltm(khtm == 0 ? 0 : Math.round(thtm / khtm * (double) 10000) / (double) 100);
        total.setTlt(kht == 0 ? 0 : Math.round(tht / kht * (double) 10000) / (double) 100);
        List<AIORevenueReportDTO> rs = new ArrayList<>();
        rs.add(total);
        rs.addAll(dtos);
        return rs;
    }

    @Override
    public List<AIORevenueReportDTO> revenueByGroup(AIORevenueReportSearchDTO obj) {
        return aioRevenueReportDAO.revenueByGroup(obj);
    }

    @Override
    public List<AIORevenueReportDTO> revenueByProvince(AIORevenueReportSearchDTO obj) {
        return aioRevenueReportDAO.revenueByProvince(obj);
    }

    @Override
    public List<AIORevenueReportDTO> revenueByStaff(AIORevenueReportSearchDTO obj) {
        return aioRevenueReportDAO.revenueByStaff(obj);
    }

    @Override
    public List<AIORevenueDailyDTO> revenueDaily(AIORevenueReportSearchDTO obj) {
        return aioRevenueReportDAO.revenueDaily(obj);
    }

    @Override
    public List<AIORevenueReportSearchDTO> searchAreas(AIORevenueReportSearchDTO obj) {
        return aioRevenueReportDAO.searchAreas(obj);
    }

    public List<AIORevenueDailyDTO> revenueDailyByArea(AIORevenueReportSearchDTO obj) {
        return aioRevenueReportDAO.revenueDailyByArea(obj);
    }

    @Override
    public String exportRevenue(AIORevenueReportSearchDTO obj) throws Exception {
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../doc-template").getPath();
        String fileName = "bao_cao_doanh_thu_tinh.xlsx";
        switch (obj.getType()) {
            case 1:
                fileName = "bao_cao_doanh_thu_tinh.xlsx";
                break;
            case 2:
                fileName = "bao_cao_doanh_thu_cum.xlsx";
                break;
            case 3:
                fileName = "bao_cao_doanh_thu_nhan_vien.xlsx";
                break;
            case 4:
                fileName = "bao_cao_doanh_thu_theo_ngay.xlsx";
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
        CellStyle cellStyle = wb.createCellStyle();
        cellStyle.setBorderBottom(BorderStyle.THIN);
        cellStyle.setBorderTop(BorderStyle.THIN);
        cellStyle.setBorderLeft(BorderStyle.THIN);
        cellStyle.setBorderRight(BorderStyle.THIN);
        cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        cellStyle.setWrapText(true);
        CellStyle cellStyleNum = wb.createCellStyle();
        cellStyleNum.setBorderBottom(BorderStyle.THIN);
        cellStyleNum.setBorderTop(BorderStyle.THIN);
        cellStyleNum.setBorderLeft(BorderStyle.THIN);
        cellStyleNum.setBorderRight(BorderStyle.THIN);
        cellStyleNum.setAlignment(HorizontalAlignment.RIGHT);
        cellStyleNum.setVerticalAlignment(VerticalAlignment.CENTER);
        if (Arrays.asList(1, 2, 3).contains(obj.getType())) {
            row = sheet.getRow(2);
            cell = getCell(row, 4);
            cell.setCellValue("Từ ngày: " + sdf.format(obj.getFromDate()));
            cell = getCell(row, 9);
            cell.setCellValue("Đến ngày: " + sdf.format(obj.getToDate()));

            List<AIORevenueReportDTO> data = new ArrayList<>();
            List<AIORevenueReportDTO> dtos = new ArrayList<>();
            
            if (AIORevenueReportSearchDTO.TYPE_BY_PROVINCE == obj.getType()) {
                dtos = revenueByProvince(obj);
            }
            if (AIORevenueReportSearchDTO.TYPE_BY_GROUP == obj.getType()) {
                dtos = revenueByGroup(obj);
            }
            if (AIORevenueReportSearchDTO.TYPE_BY_STAFF == obj.getType()) {
                dtos = revenueByStaff(obj);
            }

            data.addAll(dtos);
            int j;
            int startRow = 7;

            for (int i = 0; i < data.size(); i++) {
                AIORevenueReportDTO item = data.get(i);
                row = sheet.getRow(startRow + i);
                if (row == null) 
                    row = sheet.createRow(startRow + i);

                j = 0;
                cell = getCell(row, j++);
                setCellValue(cell, item.getAreaCode(), cellStyle);
                cell.setCellStyle(cellStyle);

                cell = getCell(row, j++);
                setCellValue(cell, item.getProvinceCode(), cellStyle);
                if (AIORevenueReportSearchDTO.TYPE_BY_PROVINCE != obj.getType()) {
                    cell = getCell(row, j++);
                    setCellValue(cell, item.getName(), cellStyle);
                }
                if (AIORevenueReportSearchDTO.TYPE_BY_STAFF == obj.getType()) {
                    cell = getCell(row, j++);
                    setCellValue(cell, item.getStaffName(), cellStyle);
                }

                cell = getCell(row, j++);
                setCellValue(cell, toString(item.getKht()), cellStyleNum);
                cell = getCell(row, j++);
                setCellValue(cell, toString(item.getTht()), cellStyleNum);
                cell = getCell(row, j++);
                setCellValue(cell, String.format("%.2f", item.getTlt()) + "%", cellStyleNum);
                cell = getCell(row, j++);
                setCellValue(cell, toString(item.getRank()), cellStyleNum);
                //NLMT
                cell = getCell(row, j++);
                setCellValue(cell, toString(item.getKhnlmt()), cellStyleNum);
                cell = getCell(row, j++);
                setCellValue(cell, toString(item.getThnlmt()), cellStyleNum);
                cell = getCell(row, j++);
                setCellValue(cell, String.format("%.2f", item.getTlnlmt()) + "%", cellStyleNum);
                
                //Smarthome
                cell = getCell(row, j++);
                setCellValue(cell, toString(item.getKhsh()), cellStyleNum);
                cell = getCell(row, j++);
                setCellValue(cell, toString(item.getThsh()), cellStyleNum);
                cell = getCell(row, j++);
                setCellValue(cell, String.format("%.2f", item.getTlsh()) + "%", cellStyleNum);
                
                //M&E
                cell = getCell(row, j++);
                setCellValue(cell, toString(item.getKhme()), cellStyleNum);
                cell = getCell(row, j++);
                setCellValue(cell, toString(item.getThme()), cellStyleNum);
                cell = getCell(row, j++);
                setCellValue(cell, String.format("%.2f", item.getTlme()) + "%", cellStyleNum);
                
                //ICT
                cell = getCell(row, j++);
                setCellValue(cell, toString(item.getKhict()), cellStyleNum);
                cell = getCell(row, j++);
                setCellValue(cell, toString(item.getThict()), cellStyleNum);
                cell = getCell(row, j++);
                setCellValue(cell, String.format("%.2f", item.getTlict()) + "%", cellStyleNum);
                
                //MS
                cell = getCell(row, j++);
                setCellValue(cell, toString(item.getKhms()), cellStyleNum);
                cell = getCell(row, j++);
                setCellValue(cell, toString(item.getThms()), cellStyleNum);
                cell = getCell(row, j++);
                setCellValue(cell, String.format("%.2f", item.getTlms()) + "%", cellStyleNum);
                
            }
        }


        if (AIORevenueReportSearchDTO.TYPE_DAILY == obj.getType()) {
            int j = 0;
            int startRow = 3;
            int startCol = 3;
            //set date header
            Calendar c = Calendar.getInstance();
            c.setTime(obj.getFromDate());
            c.set(Calendar.HOUR_OF_DAY, 0);
            c.set(Calendar.MINUTE, 0);
            c.set(Calendar.SECOND, 0);
            c.set(Calendar.MILLISECOND, 0);
            Calendar cTo = Calendar.getInstance();
            cTo.setTime(obj.getToDate());
            cTo.set(Calendar.MILLISECOND, 1);
            row = sheet.getRow(startRow);
            if (row == null)
                row = sheet.createRow(startRow);
            List<String> dates = new ArrayList<>();
            while (c.getTime().before(cTo.getTime())) {
                String date = sdf.format(c.getTime());
                dates.add(date);
                cell = getCell(row, startCol + j);
                setCellValue(cell, date, cellStyle);
                j++;
                c.add(Calendar.DATE, 1);
            }

            startRow = 4;

            //group detail row
            List<AIORevenueDailyDTO> dtos = revenueDaily(obj);
            List<AIORevenueDailyDTO> details = new ArrayList<>();
            for (AIORevenueDailyDTO item : dtos) {
                Optional<AIORevenueDailyDTO> ckItem = details.stream()
                        .filter(i -> i.getProvinceCode().equals(item.getProvinceCode()))
                        .findFirst();
                if (ckItem.isPresent()) continue;
                details.add(item);
            }

            for (int i = 0; i < details.size(); i++) {
                AIORevenueDailyDTO detail = details.get(i);
                row = sheet.getRow(startRow + i);
                if (row == null)
                    row = sheet.createRow(startRow + i);

                cell = getCell(row, 0);
                setCellValue(cell, detail.getAreaCode(), cellStyle);
                cell = getCell(row, 1);
                setCellValue(cell, detail.getName(), cellStyle);
                cell = getCell(row, 2);
                setCellValue(cell, detail.getProvinceCode(), cellStyle);

                for (j = 0; j < dates.size(); j++) {
                    String date = dates.get(j);

                    Optional<AIORevenueDailyDTO> ckItem = dtos.stream()
                            .filter(item -> item.getEndDate() != null
                                    && item.getProvinceCode().equals(detail.getProvinceCode())
                                    && date.equals(sdf.format(item.getEndDate())))
                            .findFirst();
                    double value = 0;
                    if (ckItem.isPresent()) {
                        value = ckItem.get().getTht();
                    }
                    cell = getCell(row, startCol + j);
                    setCellValue(cell, toString(value), cellStyleNum);
                }
            }
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

    private String toString(Number num) {
        if (num == null) return "0";
        return df.format(num);
    }

}
