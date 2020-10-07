package com.viettel.coms.business;

import com.viettel.coms.bo.UtilAttachDocumentBO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.Calendar;
import java.util.List;

@Service("utilAttachDocumentBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class UtilAttachDocumentBusinessImpl
        extends BaseFWBusinessImpl<UtilAttachDocumentDAO, UtilAttachDocumentDTO, UtilAttachDocumentBO>
        implements UtilAttachDocumentBusiness {

    @Autowired
    private UtilAttachDocumentDAO utilAttachDocumentDAO;

    public UtilAttachDocumentBusinessImpl() {
        tModel = new UtilAttachDocumentBO();
        tDAO = utilAttachDocumentDAO;
    }

    @Override
    public UtilAttachDocumentDAO gettDAO() {
        return utilAttachDocumentDAO;
    }

    @Override
    public long count() {
        return utilAttachDocumentDAO.count("UtilAttachDocumentBO", null);
    }

    @Override
    public List<UtilAttachDocumentDTO> doSearch(UtilAttachDocumentDTO obj) {
        return utilAttachDocumentDAO.doSearch(obj);
    }
    

	//VietNT_20190225_start
    // export excel helper
    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    /**
     * Create excel workbook from template
     * @param fileName  template file's name
     * @return workbook from template
     * @throws Exception
     *      java.io.FileNotFoundException: if template not exist
     *      java.io.IOException: if create workbook failed
     */
    public XSSFWorkbook createWorkbook(String fileName) throws Exception {
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + fileName));
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        file.close();
        return workbook;
    }

    /**
     * Write to file on server
     * @param workbook  Excel workbook
     * @param fileName  file name return
     * @return  encrypted path to file created on server
     * @throws Exception
     *      java.io.FileNotFoundException: if template not exist
     *      java.lang.Exception: if encrypted failed
     */
    public String writeToFileOnServer(XSSFWorkbook workbook, String fileName) throws Exception {
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
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        return UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + fileName);
    }

    /**
     * Create excel cell
     * @param row       row, from 0
     * @param column    column, from 0
     * @param style     CellStyle
     * @return XSSFCell to chain method setValue
     */
    public XSSFCell createExcelCell(XSSFRow row, int column, CellStyle style) {
        XSSFCell cell = row.createCell(column);
        cell.setCellStyle(style);
        return cell;
    }

    /**
     * Add all border for CellStyle
     */
    public void addCellBorder(CellStyle style) {
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
    }

    /**
     * Remove all border for CellStyle
     */
    public void removeCellBorder(CellStyle style) {
        style.setBorderTop(BorderStyle.NONE);
        style.setBorderLeft(BorderStyle.NONE);
        style.setBorderBottom(BorderStyle.NONE);
        style.setBorderRight(BorderStyle.NONE);
    }

    /**
     * Update attributes of POI Font
     * @param font      Font
     * @param name      font's name(Ex: "Times News Roman")
     * @param bold      true is bold
     * @param italic    true is italic
     * @param height    font size
     */
    public void updateFontConfig(Font font, String name, boolean bold, boolean italic, int height) {
        font.setFontName(name);
        font.setBold(bold);
        font.setItalic(italic);
        font.setFontHeightInPoints((short) height);
    }

    public void updateFontConfig(Font font, boolean bold, boolean italic, int height) {
        this.updateFontConfig(font, "Times New Roman", bold, italic, height);
    }

    public void updateFontConfig(Font font, int height) {
        this.updateFontConfig(font, "Times New Roman", false, false, height);
    }

    public void updateFontConfig(Font font, boolean bold, boolean italic) {
        this.updateFontConfig(font, "Times New Roman", false, false, 11);
    }
	//VietNT_end
}
