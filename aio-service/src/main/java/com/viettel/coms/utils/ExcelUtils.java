package com.viettel.coms.utils;

import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFDataFormat;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;

import java.io.*;
import java.util.Calendar;
import java.util.List;

public class ExcelUtils {


    /*
     * Export excl
     */
    public static String exportExcel(String FILE_NAME, List<Object> lstDataExport) throws IOException {
        InputStream excelFileToRead;
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../").getPath();
        excelFileToRead = new FileInputStream(filePath + "/doc-template" + File.separatorChar + FILE_NAME);
        // init file to export
        HSSFWorkbook wb = new HSSFWorkbook(excelFileToRead);

        // bind data to sheet Invest plan Item
        HSSFSheet sheet0 = wb.getSheetAt(0);

        bindingDataForExcel(lstDataExport, sheet0);


        return null;
    }

    public static void bindingDataForExcel(List<Object> lstDataExport, HSSFSheet sheet) {
        Cell cell;
        Row row;
        int rowNum = 0;
        int i = 1;
        for (Object object : lstDataExport) {
            row = sheet.createRow(rowNum++);
            bindDataForOneRow(object, i, row, sheet);
            i++;
        }

    }

    private static void bindDataForOneRow(Object dataExport, int sttt, Row row, HSSFSheet sheet) {
//		HSSFCellStyle style = styleText(sheet);
//		HSSFCellStyle styleNumber = styleNumber(sheet);
//		HSSFCellStyle styleDate = styleDate(sheet);
//		Cell cell;
//		
//		cell = row.createCell(0, CellType.STRING);
//		cell.setCellValue(String.valueOf(sttt));
//		cell.setCellStyle(style);
//		
//		cell = row.createCell(1, CellType.STRING);
//		cell.setCellValue(String.valueOf(sttt));
//		cell.setCellStyle(style);

    }

    /**
     * create file
     */
    public static String customUpload(HSSFWorkbook wb, String fileName, String subFolder, String folder) throws Exception {

        String safeFileName = UString.getSafeFileName(fileName);
        Calendar cal = Calendar.getInstance();
        String uploadPath = folder + File.separator + UFile.getSafeFileName(subFolder) + File.separator
                + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
                + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        String uploadPathReturn = File.separator + UFile.getSafeFileName(subFolder) + File.separator
                + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
                + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        File udir = new File(uploadPath);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        try (OutputStream out = new FileOutputStream(udir.getAbsolutePath() + File.separator + safeFileName)) {
            wb.write(out);
            out.close();
        }
        return uploadPathReturn + File.separator + safeFileName;

    }


    /*
     * create style for data export
     */
    public static XSSFCellStyle styleText(XSSFSheet sheet) {
        XSSFFont font = sheet.getWorkbook().createFont();
        font.setFontName("Times New Roman");
        font.setFontHeight((short) 240);
        XSSFCellStyle style = sheet.getWorkbook().createCellStyle();
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setFont(font);
        style.setWrapText(true);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        XSSFDataFormat fmt = sheet.getWorkbook().createDataFormat();
        style.setDataFormat(fmt.getFormat("@"));

        return style;
    }

    public static XSSFCellStyle styleTextNotWrap(XSSFSheet sheet) {
        XSSFFont font = sheet.getWorkbook().createFont();
        font.setFontName("Times New Roman");
        font.setFontHeight((short) 240);
        XSSFCellStyle style = sheet.getWorkbook().createCellStyle();
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setFont(font);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        XSSFDataFormat fmt = sheet.getWorkbook().createDataFormat();
        style.setDataFormat(fmt.getFormat("@"));

        return style;
    }

    public static XSSFCellStyle styleHeader(XSSFSheet sheet) {
        XSSFFont font = sheet.getWorkbook().createFont();
        font.setFontName("Times New Roman");
        font.setFontHeight((short) 240);
        font.setBoldweight(XSSFFont.BOLDWEIGHT_BOLD);
        XSSFCellStyle style = sheet.getWorkbook().createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setFont(font);
        style.setWrapText(true);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        XSSFDataFormat fmt = sheet.getWorkbook().createDataFormat();
        style.setDataFormat(fmt.getFormat("@"));

        return style;
    }

    public static XSSFCellStyle styleNumber(XSSFSheet sheet) {
        XSSFFont font = sheet.getWorkbook().createFont();
        font.setFontName("Times New Roman");
        font.setFontHeight((short) 240);
        XSSFCellStyle style = sheet.getWorkbook().createCellStyle();
        style.setAlignment(HorizontalAlignment.RIGHT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setFont(font);
        style.setWrapText(true);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        return style;
    }

    public static XSSFCellStyle styleCurrency(XSSFSheet sheet) {
        XSSFFont font = sheet.getWorkbook().createFont();
        font.setFontName("Times New Roman");
        font.setFontHeight((short) 240);
        XSSFCellStyle style = sheet.getWorkbook().createCellStyle();
        style.setAlignment(HorizontalAlignment.RIGHT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setFont(font);
        style.setWrapText(true);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setDataFormat(sheet.getWorkbook().createDataFormat().getFormat("#,###.000"));
        return style;
    }

    public static XSSFCellStyle styleDate(XSSFSheet sheet) {
        XSSFFont font = sheet.getWorkbook().createFont();
        font.setFontName("Times New Roman");
        font.setFontHeight((short) 240);
        XSSFCellStyle style = sheet.getWorkbook().createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setFont(font);
        style.setWrapText(true);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        return style;
    }

    public static XSSFCellStyle styleText1(XSSFSheet sheet) {
        XSSFFont font = sheet.getWorkbook().createFont();
        font.setFontName("Times New Roman");
        font.setFontHeight((short) 240);
        XSSFCellStyle style = sheet.getWorkbook().createCellStyle();
        style.setFont(font);
        style.setWrapText(true);
        XSSFDataFormat fmt = sheet.getWorkbook().createDataFormat();
        style.setDataFormat(fmt.getFormat("@"));
        return style;
    }

    public static XSSFCellStyle styleBold(XSSFSheet sheet) {
        XSSFFont font = sheet.getWorkbook().createFont();
        font.setFontName("Times New Roman");
        font.setFontHeight((short) 240);
        font.setBold(true);
        XSSFCellStyle style = sheet.getWorkbook().createCellStyle();
        style.setFont(font);
        style.setWrapText(true);
        style.setAlignment(HorizontalAlignment.CENTER);
        XSSFDataFormat fmt = sheet.getWorkbook().createDataFormat();
        style.setDataFormat(fmt.getFormat("@"));
        return style;
    }

}
