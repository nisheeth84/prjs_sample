package com.viettel.aio.business;

import com.viettel.aio.dao.CommonDAO;
import com.viettel.aio.dto.AIOConfigStockedGoodsDTO;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOPackageDTO;
import com.viettel.aio.dto.report.AIOReportDTO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.*;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ImageUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.SQLQuery;
import org.hibernate.type.LongType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.activation.DataHandler;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.MultivaluedMap;
import java.io.*;
import java.math.BigDecimal;
import java.util.*;

//VietNT_20190404_created
@Service("commonServiceAio")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CommonServiceAio {

    static Logger LOGGER = LoggerFactory.getLogger(CommonServiceAio.class);

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Value("${input_image_sub_folder_upload}")
    private String input_image_sub_folder_upload;

    @Value("${input_sub_folder_upload}")
    private String inputSubFolderUpload;

    @Autowired
    public CommonServiceAio(UtilAttachDocumentDAO utilAttachDocumentDAO, CommonDAO commonDAO) {
        this.utilAttachDocumentDAO = utilAttachDocumentDAO;
        this.commonDAO = commonDAO;
    }

    private CommonDAO commonDAO;
    private UtilAttachDocumentDAO utilAttachDocumentDAO;

    public int insertIntoSmsTable(String subject, String content, String email,
                                  String phoneNum, Long createdUserId, Date createdDate) {
        return commonDAO.insertIntoSmsTable(subject, content, email, phoneNum, createdUserId, createdDate);
    }

    public int insertIntoSmsTable(String subject, String content, Long receiverId, Long createdUserId, Date createdDate) {
        return commonDAO.insertIntoSmsTable(subject, content, receiverId, createdUserId, createdDate);
    }

    // export excel helper
    // ========== ===== ========== ===== ==========

    /**
     * Create excel workbook from template
     *
     * @param fileName template file's name
     * @return workbook from template
     * @throws Exception java.io.FileNotFoundException: if template not exist
     *                   java.io.IOException: if create workbook failed
     */
    public XSSFWorkbook createWorkbook(String fileName) throws IOException {
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + fileName));
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        file.close();
        return workbook;
    }

    /**
     * Write to file on server
     *
     * @param workbook Excel workbook
     * @param fileName file name return
     * @return encrypted path to file created on server
     * @throws Exception java.io.FileNotFoundException: if template not exist
     *                   java.lang.Exception: if encrypted failed
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
     *
     * @param row    row, from 0
     * @param column column, from 0
     * @param style  CellStyle
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
     *
     * @param font   Font
     * @param name   font's name(Ex: "Times News Roman")
     * @param bold   true is bold
     * @param italic true is italic
     * @param height font size
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

    public ExcelErrorDTO createError(int row, String colAlias, String colName, String detail) {
        ExcelErrorDTO err = new ExcelErrorDTO();
        err.setColumnError(colAlias);
        err.setLineError(String.valueOf(row));
        err.setDetailError(colName + " " + detail);
        return err;
    }

    public <T extends ComsBaseFWDTO> void doWriteError(List<ExcelErrorDTO> errorList, List<T> dtoList,
                                                       String filePathError, T errorContainer, int errColumn) {
        dtoList.clear();

        errorContainer.setErrorList(errorList);
        errorContainer.setMessageColumn(errColumn);
        errorContainer.setFilePathError(filePathError);

        dtoList.add(errorContainer);
    }

    public com.viettel.aio.dto.ExcelErrorDTO createErrorAio(int row, String colAlias, String colName, String detail) {
        com.viettel.aio.dto.ExcelErrorDTO err = new com.viettel.aio.dto.ExcelErrorDTO();
        err.setColumnError(colAlias);
        err.setLineError(String.valueOf(row));
        err.setDetailError(colName + " " + detail);
        return err;
    }

    public <T extends ComsBaseFWDTO> void doWriteErrorAio(List<com.viettel.aio.dto.ExcelErrorDTO> errorList, List<T> dtoList,
                                                          String filePathError, T errorContainer, int errColumn) {
        dtoList.clear();

        errorContainer.setErrorList(errorList);
        errorContainer.setMessageColumn(errColumn);
        errorContainer.setFilePathError(filePathError);

        dtoList.add(errorContainer);
    }

    public void createExcelHeaderRow(XSSFSheet sheet, XSSFWorkbook workbook, ColumnProfile[] colProps) {
        // set header row
        XSSFRow rowHeader = sheet.createRow(0);
        rowHeader.setHeightInPoints(50);
        XSSFFont headerFont = workbook.createFont();
        headerFont.setFontName("Calibri");
        headerFont.setFontHeightInPoints((short) 11);
        headerFont.setBold(true);

        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        headerStyle.setAlignment(HorizontalAlignment.CENTER);
        headerStyle.setFont(headerFont);
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setFillForegroundColor(IndexedColors.LIME.index);
        headerStyle.setWrapText(true);

        for (int i = 0; i < colProps.length; i++) {
            Cell cell = rowHeader.createCell(i);
            cell.setCellStyle(headerStyle);
            cell.setCellValue(colProps[i].title);
            sheet.setColumnWidth(i, colProps[i].width);
        }
    }
    // ============================================

    // file upload/download
    // ========== ===== ========== ===== ==========
    public String getFolderParam(HttpServletRequest request) {
        String folderParam = UString.getSafeFileName(request.getParameter("folder"));
        if (UString.isNullOrWhitespace(folderParam)) {
            folderParam = defaultSubFolderUpload;
        } else {
            if (!UString.isFolderAllowFolderSave(folderParam, allowFolderDir)) {
                throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
            }
        }
        return folderParam;
    }

    public String uploadToServer(Attachment attachments, HttpServletRequest request) {
        String folderParam = this.getFolderParam(request);
        DataHandler dataHandler = attachments.getDataHandler();

        // get filename to be uploaded
        MultivaluedMap<String, String> multivaluedMap = attachments.getHeaders();
        String fileName = UFile.getFileName(multivaluedMap);

        if (!UString.isExtendAllowSave(fileName, allowFileExt)) {
            throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
        }

        // write & upload file to server
        try (InputStream inputStream = dataHandler.getInputStream()) {
            // upload to server, return file path
            return UFile.writeToFileServerATTT(inputStream, fileName, folderParam, folderUpload);
        } catch (Exception ex) {
            throw new BusinessException("Loi khi save file", ex);
        }
    }
    // ============================================

    // user and group func
    // ========== ===== ========== ===== ==========
    public List<String> getDomainDataOfUserPermission(String opKey, String adKey, Long sysUserId) {
        return commonDAO.getDomainDataOfUserPermission(opKey, adKey, sysUserId);
    }

    public List<String> getDomainDataOfUserPermission(String permission, Long sysUserId) {
        String[] permissionArr = permission.split(StringUtils.SPACE);
        return commonDAO.getDomainDataOfUserPermission(permissionArr[0], permissionArr[1], sysUserId);
    }

    public SysUserCOMSDTO getUserByCodeOrId(SysUserCOMSDTO criteria) {
        return commonDAO.getUserByCodeOrId(criteria);
    }

    public String getUserProvinceCode(Long sysUserId) {
        List<String> list = commonDAO.getUserProvinceCodes(Collections.singletonList(sysUserId));
        if (!list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    public List<String> getUserProvinceCodes(List<Long> sysUserIds) {
        return commonDAO.getUserProvinceCodes(sysUserIds);
    }

    public Long getSysGroupLevelByUserId(Long sysUserId, int level) {
        if (level < 1 || level > 4) {
            return null;
        }
        return commonDAO.getSysGroupLevelByUserId(sysUserId, level);
    }

    //VietNT_10/06/2019_start
    public SysUserCOMSDTO getUserByPhone(String phoneNum) {
        return commonDAO.getUserByPhone(phoneNum);
    }
    //VietNT_end

    public List<SysUserCOMSDTO> getListUser(SysUserCOMSDTO criteria) {
        return commonDAO.getListUser(criteria);
    }

    public DataListDTO getListSysGroup(DepartmentDTO criteria, List<String> levelList) {
        boolean isCount = StringUtils.isNotEmpty(criteria.getCustomField())
                && criteria.getCustomField().equalsIgnoreCase("count");

        List<DepartmentDTO> data = commonDAO.getListSysGroup(criteria, levelList, isCount);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(data);
        dataListDTO.setStart(1);
        if (isCount) {
            dataListDTO.setTotal(criteria.getTotalRecord());
            dataListDTO.setSize(criteria.getPageSize());
        }
        return dataListDTO;
    }

    public DataListDTO getListSysGroup(DepartmentDTO criteria) {
        return this.getListSysGroup(criteria, null);
    }

    public DepartmentDTO getSysGroupByCode(String code) {
        DepartmentDTO criteria = new DepartmentDTO();
        criteria.setCode(code);
        List<DepartmentDTO> data = commonDAO.getListSysGroup(criteria, null, false);
        if (!data.isEmpty()) {
            return data.get(0);
        }
        return null;
    }

    //VietNT_10/07/2019_start
    public DepartmentDTO getSysGroupById(Long id) {
        DepartmentDTO criteria = new DepartmentDTO();
        criteria.setSysGroupId(id);
        List<DepartmentDTO> data = commonDAO.getListSysGroup(criteria, null, false);
        if (!data.isEmpty()) {
            return data.get(0);
        }
        return null;
    }
    //VietNT_end
    // ============================================

    // util document
    // ========== ===== ========== ===== ==========
    /**
     * Get list attachment by ids and types
     *
     * @param idList   list of object id
     * @param types    list of type
     * @param fileType file type, img = 0
     * @return list of encrypted path attachments
     */
    public List<UtilAttachDocumentDTO> getListAttachmentByIdAndType(List<Long> idList, List<String> types, int fileType) {
        try {
            List<UtilAttachDocumentDTO> dtos = commonDAO.getListAttachmentByIdAndType(idList, types);
            for (UtilAttachDocumentDTO dto : dtos) {
                if (fileType == 0) {
                    String fullPath = folderUpload + File.separator + dto.getFilePath();
                    String base64Image = ImageUtil.convertImageToBase64(fullPath);
                    dto.setBase64String(base64Image);
                }
                dto.setFilePath(UEncrypt.encryptFileUploadPath(dto.getFilePath()));
            }
            return dtos;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<UtilAttachDocumentDTO> getListImagesByIdAndType(List<Long> idList, String type) {
        return this.getListAttachmentByIdAndType(idList, Collections.singletonList(type), 0);
    }

    public int deleteById(String tableName, String fieldId, Long id) {
        return commonDAO.deleteById(tableName, fieldId, id);
    }

    public void saveImages(List<UtilAttachDocumentDTO> listImage, Long objectId, String type, String desc,
                           Long createdUserId, String createdUserName) {
        this.saveAttachment(listImage, objectId, type, desc, folderUpload, input_image_sub_folder_upload,
                createdUserId, createdUserName);
    }

    public void saveAttachment(List<UtilAttachDocumentDTO> filesAttach, Long objectId, String type, String desc,
                               String folderUpload, String subFolder,
                               Long createdUserId, String createdUserName) {
        for (UtilAttachDocumentDTO fileAttach : filesAttach) {
            Long idResult;
            try {
                InputStream inputStream = ImageUtil.convertBase64ToInputStream(fileAttach.getBase64String());
                String filePath = UFile.writeToFileServerATTT2(inputStream, fileAttach.getName(), subFolder, folderUpload);
                fileAttach.setFilePath(filePath);
                fileAttach.setObjectId(objectId);
                fileAttach.setType(type);
                fileAttach.setDescription(desc);
                fileAttach.setStatus("1");
                fileAttach.setCreatedDate(new Date());
                fileAttach.setCreatedUserId(createdUserId);
                fileAttach.setCreatedUserName(createdUserName);

                idResult = utilAttachDocumentDAO.saveObject(fileAttach.toModel());
            } catch (Exception e) {
                e.printStackTrace();
                continue;
            }

            this.validateIdCreated(idResult, AIOObjectType.ATTACH_IMAGE.getName());
        }
    }

    public List<UtilAttachDocumentDTO> getListAttachmentPathByIdAndType(List<Long> idList, List<String> types) {
        return commonDAO.getListAttachmentPathByIdAndType(idList, types);
    }

    public List<UtilAttachDocumentDTO> getListAttachmentByIdAndType(Long objectId, String type) {
        try {
            List<UtilAttachDocumentDTO> dtos = commonDAO.getListAttachmentByIdAndType(Collections.singletonList(objectId), Collections.singletonList(type));
            for (UtilAttachDocumentDTO dto : dtos) {
                String base64Image = ImageUtil.convertImageToBase64(dto.getFilePath());
                dto.setBase64String(base64Image);
                dto.setFilePath(UEncrypt.encryptFileUploadPath(dto.getFilePath()));
            }
            return dtos;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    // ============================================

    // validate
    // ========== ===== ========== ===== ==========
    public void validateIdCreated(Long id, String msgError) {
        if (id < 1) {
            throw new BusinessException(msgError);
        }
    }

    public void validateIdCreated(Long id, AIOObjectType objectType) {
        String msgError = AIOErrorType.SAVE_ERROR.msg + objectType.getName();
        this.validateIdCreated(id, msgError);
    }

    public void validateIdCreated(int id, String msgError) {
        if (id < 1) {
            throw new BusinessException(msgError);
        }
    }

    //VietNT_30/07/2019_start
    public void validateUserLogin(SysUserCOMSDTO user) {
        if (user == null || user.getSysUserId() == null || StringUtils.isEmpty(user.getFullName())) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.USER.getName());
        }
    }
    //VietNT_end
    // ============================================

    // list obj
    // ========== ===== ========== ===== ==========
    //VietNT_19/06/2019_start
    public DataListDTO getListContract(AIOContractDTO criteria) {
        boolean isCount = StringUtils.isNotEmpty(criteria.getCustomField())
                && criteria.getCustomField().equalsIgnoreCase("count");
        List<AIOContractDTO> data = commonDAO.getListContract(criteria, isCount);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(data);
        dataListDTO.setStart(1);
        if (isCount) {
            dataListDTO.setTotal(criteria.getTotalRecord());
            dataListDTO.setSize(criteria.getPageSize());
        }
        return dataListDTO;
    }

    public DataListDTO getListPackage(AIOPackageDTO criteria) {
        boolean isCount = StringUtils.isNotEmpty(criteria.getCustomField())
                && criteria.getCustomField().equalsIgnoreCase("count");
        List<AIOPackageDTO> data = commonDAO.getListPackage(criteria, isCount);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(data);
        dataListDTO.setStart(1);
        if (isCount) {
            dataListDTO.setTotal(criteria.getTotalRecord());
            dataListDTO.setSize(criteria.getPageSize());
        }
        return dataListDTO;
    }

    public DataListDTO getListCatUnit(AIOConfigStockedGoodsDTO criteria) {
        boolean isCount = StringUtils.isNotEmpty(criteria.getCustomField())
                && criteria.getCustomField().equalsIgnoreCase("count");
        List<AIOConfigStockedGoodsDTO> data = commonDAO.getListCatUnit(criteria, isCount);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(data);
        dataListDTO.setStart(1);
        if (isCount) {
            dataListDTO.setTotal(criteria.getTotalRecord());
            dataListDTO.setSize(criteria.getPageSize());
        }
        return dataListDTO;
    }

    public AIOConfigStockedGoodsDTO getCatUnitByCode(String code) {
        AIOConfigStockedGoodsDTO criteria = new AIOConfigStockedGoodsDTO();
        criteria.setCatUnitCode(code);
        List<AIOConfigStockedGoodsDTO> data = commonDAO.getListCatUnit(criteria, false);
        if (!data.isEmpty()) {
            return data.get(0);
        }
        return null;
    }

    public DataListDTO getListGoods(GoodsDTO criteria) {
        boolean isCount = StringUtils.isNotEmpty(criteria.getCustomField())
                && criteria.getCustomField().equalsIgnoreCase("count");
        List<GoodsDTO> data = commonDAO.getListGoods(criteria, isCount);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(data);
        dataListDTO.setStart(1);
        if (isCount) {
            dataListDTO.setTotal(criteria.getTotalRecord());
            dataListDTO.setSize(criteria.getPageSize());
        }
        return dataListDTO;
    }

    public GoodsDTO getGoodsByCode(String code) {
        GoodsDTO criteria = new GoodsDTO();
        criteria.setCode(code);
        List<GoodsDTO> data = commonDAO.getListGoods(criteria, false);
        if (!data.isEmpty()) {
            return data.get(0);
        }
        return null;
    }
    // ============================================

    // sequence
    // ========== ===== ========== ===== ==========
    public Long getLatestSeqNumber(String sequence) {
        return commonDAO.getLatestSeqNumber(sequence);
    }

    public Long getNextId(String sequence) {
        return commonDAO.getNextId(sequence);
    }
    // ============================================
}
