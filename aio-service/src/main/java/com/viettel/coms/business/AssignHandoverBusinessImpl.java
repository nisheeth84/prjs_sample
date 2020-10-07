package com.viettel.coms.business;

import com.viettel.coms.bo.AssignHandoverBO;
import com.viettel.coms.dao.AssignHandoverDAO;
import com.viettel.coms.dao.ConstructionDAO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.*;
import com.viettel.coms.rest.ReportRsServiceImpl;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.ImageUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFCreationHelper;
import org.apache.poi.xssf.usermodel.XSSFRow;
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
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;

import org.apache.poi.openxml4j.util.ZipSecureFile;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
//VietNT_20181210_created
@Service("assignHandoverBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AssignHandoverBusinessImpl extends BaseFWBusinessImpl<AssignHandoverDAO, AssignHandoverDTO, AssignHandoverBO> implements AssignHandoverBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AssignHandoverBusinessImpl.class);

    @Autowired
    private AssignHandoverDAO assignHandoverDAO;

    @Autowired
    private UtilAttachDocumentBusinessImpl utilAttachDocumentBusinessImpl;

    @Autowired
    private ConstructionDAO constructionDAO;

    @Autowired
    private UtilAttachDocumentDAO utilAttachDocumentDAO;

    @Autowired
    private UtilAttachDocumentBusinessImpl utilBusiness;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;
    @Context
    HttpServletRequest request;

    private final String MAIL_SUBJECT = "Thông báo nhận BGMB";
    private final String MAIL_CONTENT_CN = "TTHT giao cho chi nhánh nhận BGMB công trình ";
    private final String MAIL_CONTENT_NV = "Bạn được giao nhận BGMB công trình ";
    private final String ATTACH_DOCUMENT_TYPE_HANDOVER = "57";

    private HashMap<Integer, String> colAlias = new HashMap<>();

    {
        colAlias.put(0, "");
        colAlias.put(1, "B");
        colAlias.put(2, "C");
        colAlias.put(3, "D");
    }

    private HashMap<Integer, String> colName = new HashMap<>();

    {
        colName.put(0, "");
//        colName.put(1, "STT");
        colName.put(1, "ĐƠN VỊ");
        colName.put(2, "MÃ CÔNG TRÌNH");
        colName.put(3, "THIẾT KẾ");
    }

    private final int[] requiredCol = new int[]{1, 2, 3};


    //VietNT_20190109_start
    @Override
    public DataListDTO doSearch(AssignHandoverDTO criteria) {
        List<AssignHandoverDTO> dtos = assignHandoverDAO.doSearch(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    @Override
    public Long addNewAssignHandover(AssignHandoverDTO dto) throws Exception {
        // validate construction_id exist in table cnt_constr_work_item_task
        List<AssignHandoverDTO> results = assignHandoverDAO.findConstructionContractRef(dto.getConstructionId());
        AssignHandoverDTO ref = null;
        if (results != null && !results.isEmpty()) {
            ref = results.get(0);
        }
        if (null == ref || null == ref.getCntContractId()) {
            throw new Exception("Công trình chưa thuộc hợp đồng nào. " +
                    "Thực hiện gán công trình vào hợp đồng trước khi giao việc cho CN/ TTKT");
        }

        // do insert assign handover to table
        // ma nha tram, ma tram, ma cong trinh. don vi, design
        //VietNT_20190122_start
        /*
        if (null == dto.getCatStationHouseId() || null == dto.getCatStationId()) {
            dto.setCatStationHouseId(ref.getCatStationHouseId());
            dto.setCatStationHouseCode(ref.getCatStationHouseCode());
            dto.setCatStationId(ref.getCatStationId());
            dto.setCatStationCode(ref.getCatStationCode());
        }
        dto.setCatProvinceId(ref.getCatProvinceId());
        dto.setCatProvinceCode(ref.getCatProvinceCode());
        */
        //VietNT_end

        dto.setCntContractId(ref.getCntContractId());
        dto.setCntContractCode(ref.getCntContractCode());

        Long resultId = assignHandoverDAO.saveObject(dto.toModel());
        try {
            if (resultId != 0L) {
                // Import file đính kèm thực hiện lưu dữ liệu vào bảng UTIL_ATTACH_DOCUMENT với object_id = Assign_Handover_id và type = 57
                this.importAttachDocument(dto.getFileDesign(), resultId);

                // insert dữ liệu vào bảng RP_STATION_COMPLETE nếu cặp khóa mã hợp đồng và mã nhà trạm chưa tồn tại trong bảng:
                this.insertIntoRpStationComplete(dto);

                // insert dữ liệu vào bảng SEND_SMS_EMAIL với các điều kiện xác định RECEIVE_PHONE_NUMBER, RECEIVE_EMAIL
                this.sendSms(dto);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return resultId;
    }

    private void importAttachDocument(UtilAttachDocumentDTO attachDocument, Long assignHandoverId) throws Exception {
        if (attachDocument == null) {
            return;
        }

        attachDocument.setObjectId(assignHandoverId);
        attachDocument.setType(ATTACH_DOCUMENT_TYPE_HANDOVER);
        attachDocument.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        attachDocument.setFilePath(UEncrypt.decryptFileUploadPath(attachDocument.getFilePath()));
        utilAttachDocumentBusinessImpl.save(attachDocument);
    }

    private void insertIntoRpStationComplete(AssignHandoverDTO dto) throws Exception {
        if (!assignHandoverDAO.checkContractCatStationHouseExist(dto.getCatStationHouseId(), dto.getCntContractId())) {
            assignHandoverDAO.insertIntoRpStationComplete(dto);
        }
    }

    /*
    private void sendSms(Long sysGroupId, String constructionCode, Long createdUserId) throws Exception {
        List<SysUserDTO> users = assignHandoverDAO.findUsersReceiveMail(sysGroupId);
    	
//        List<SysUserDTO> users = new ArrayList<>();
        if (null == users || users.isEmpty()) {
            return;
        }

        String subject = "Thông báo nhận BGMB";
        String content = "TTHT giao cho chi nhánh nhận BGMB công trình " + constructionCode;
        Date createdDate = new Date();

        for (SysUserDTO user : users) {
            assignHandoverDAO.insertIntoSendSmsEmailTable(user, subject, content, createdUserId, createdDate);
        }
    }
    */

    private void sendSms(AssignHandoverDTO dto) throws Exception {
        List<SysUserDTO> users = assignHandoverDAO.findUsersReceiveMail(dto.getSysGroupId());

//        List<SysUserDTO> users = new ArrayList<>();
        if (null == users || users.isEmpty()) {
            return;
        }

        for (SysUserDTO user : users) {
            assignHandoverDAO.insertIntoSendSmsEmailTable(
                    user,
                    MAIL_SUBJECT,
                    MAIL_CONTENT_CN + dto.getConstructionCode(),
                    dto.getCreateUserId(),
                    dto.getCreateDate());
        }
    }

    @Override
    public List<AssignHandoverDTO> doImportExcel(String filePath, Long sysUserId) {
        List<AssignHandoverDTO> dtoList = new ArrayList<>();
        List<ExcelErrorDTO> errorList = new ArrayList<>();

        try {
            File f = new File(filePath);
            ZipSecureFile.setMinInflateRatio(-1.0d);
            XSSFWorkbook workbook = new XSSFWorkbook(f);
            XSSFSheet sheet = workbook.getSheetAt(0);

            DataFormatter formatter = new DataFormatter();
            int rowCount = 0;

            // prepare data for validate
            //VietNT_20190122_start
            // construction info: province, station, stationHouse
            List<ConstructionDetailDTO> consInfos = constructionDAO.getConstructionByStationId(new ConstructionDTO());
            HashMap<String, ConstructionDetailDTO> consInfoRef = new HashMap<>();
            if (consInfos != null) {
                consInfos.forEach(info -> consInfoRef.put(info.getCode().toUpperCase(), info));
            }
            //VietNT_end

            // cntContract
            List<AssignHandoverDTO> ref = assignHandoverDAO.findConstructionContractRef(null);
            HashMap<String, AssignHandoverDTO> mapConstructionRef = new HashMap<>();
            if (ref != null) {
                ref.forEach(r -> mapConstructionRef.put(r.getConstructionCode().toUpperCase(), r));
            }

            List<AssignHandoverDTO> sysGroupInfos = assignHandoverDAO.getListSysGroupCode();
            HashMap<String, AssignHandoverDTO> mapSysGroupRef = new HashMap<>();
            if (sysGroupInfos != null) {
                sysGroupInfos.forEach(r -> mapSysGroupRef.put(r.getSysGroupCode().toUpperCase(), r));
            }

            AssignHandoverDTO activeConstructionCriteria = new AssignHandoverDTO();
            activeConstructionCriteria.setStatus(1L);
            List<AssignHandoverDTO> exist = assignHandoverDAO.doSearch(activeConstructionCriteria);
            HashMap<String, String> consCodeSysGroupMapRef = new HashMap<>();
            if (exist != null && !exist.isEmpty()) {
                exist.forEach(dto -> consCodeSysGroupMapRef.put(dto.getConstructionCode().toUpperCase(), dto.getSysGroupName()));
            }

            for (Row row : sheet) {
                rowCount++;
                // data start from row 3
                if (rowCount < 6) {
                    continue;
                }

                // check required field empty
                //if (!this.isRequiredDataExist(row, errorList, formatter)) {
                //    continue;
                //}
                this.isRequiredDataExist(row, errorList, formatter);

                AssignHandoverDTO dtoValidated = new AssignHandoverDTO();
                String sysGroupCode = formatter.formatCellValue(row.getCell(1)).trim();
                String constructionCode = formatter.formatCellValue(row.getCell(2)).trim();
                String isDesignStr = formatter.formatCellValue(row.getCell(3)).trim();

                int errorCol = 1;
                if (!StringUtils.isEmpty(sysGroupCode)) {
                    AssignHandoverDTO sysGroupInfo = mapSysGroupRef.get(sysGroupCode.toUpperCase());
                    if (sysGroupInfo != null) {
                        dtoValidated.setSysGroupCode(sysGroupInfo.getSysGroupCode());
                        dtoValidated.setSysGroupId(sysGroupInfo.getSysGroupId());
                        dtoValidated.setSysGroupName(sysGroupInfo.getSysGroupName());
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không tồn tại"));
                    }
                } else {
                    errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                }

                errorCol = 2;
                if (!StringUtils.isEmpty(constructionCode)) {
                    // check exist
                    String assignedGroupName = consCodeSysGroupMapRef.get(constructionCode.toUpperCase());
                    if (StringUtils.isEmpty(assignedGroupName)) {
                        // check info catStation, catStationHouse, catProvince
                        ConstructionDetailDTO consInfo = consInfoRef.get(constructionCode.toUpperCase());
                        if (consInfo != null) {
                            // check info contract
                            AssignHandoverDTO consContractInfo = mapConstructionRef.get(constructionCode.toUpperCase());
                            if (consContractInfo != null) {
                                dtoValidated.setConstructionCode(consContractInfo.getConstructionCode());
                                dtoValidated.setConstructionId(consContractInfo.getConstructionId());
                                dtoValidated.setCntContractId(consContractInfo.getCntContractId());
                                dtoValidated.setCntContractCode(consContractInfo.getCntContractCode());

                                dtoValidated.setCatProvinceId(consInfo.getCatProvinceId());
                                dtoValidated.setCatProvinceCode(consInfo.getCatProvinceCode());
                                dtoValidated.setCatStationHouseId(consInfo.getCatStationHouseId());
                                dtoValidated.setCatStationHouseCode(consInfo.getCatStationHouseCode());
                                dtoValidated.setCatStationId(consInfo.getCatStationId());
                                dtoValidated.setCatStationCode(consInfo.getCatStationCode());

                                if (StringUtils.isNotEmpty(dtoValidated.getSysGroupName())) {
                                    consCodeSysGroupMapRef.put(constructionCode.toUpperCase(), dtoValidated.getSysGroupName());
                                }
                            } else {
                                errorList.add(this.createError(rowCount, errorCol, "chưa thuộc hợp đồng nào. Thực hiện gán công trình vào hợp đồng trước khi giao việc cho CN/ TTKT"));
                            }
                        } else {
                            errorList.add(this.createError(rowCount, errorCol, "không thuộc tỉnh, nhà trạm hoặc mã nhà trạm"));
                        }
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, constructionCode.toUpperCase() + " đã được giao cho chi nhánh: " + assignedGroupName));
                    }
                } else {
                    errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                }

                errorCol = 3;
                if (StringUtils.isEmpty(isDesignStr)) {
                    errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                } else if (!isDesignStr.equals("0") && !isDesignStr.equals("1")) {
                    errorList.add(this.createError(rowCount, errorCol, "Sai kiểu dữ liệu"));
                } else {
                    dtoValidated.setIsDesign(Long.parseLong(isDesignStr));
                    if (isDesignStr.equals("0")) {
                        dtoValidated.setCompanyAssignDate(new Date());
                    }
                }

                if (errorList.size() == 0) {
                    dtoValidated.setStatus(1L);
                    dtoValidated.setReceivedStatus(1L);
                    dtoValidated.setCreateDate(new Date());
                    dtoValidated.setCreateUserId(sysUserId);
                    dtoList.add(dtoValidated);
                }
            }

            if (errorList.size() > 0) {
                String filePathError = UEncrypt.encryptFileUploadPath(filePath);
                this.doWriteError(errorList, dtoList, filePathError, 5);
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
            this.doWriteError(errorList, dtoList, filePathError, 5);
        }

        return dtoList;
    }

    public void addNewAssignHandoverImport(List<AssignHandoverDTO> dtos) throws Exception {
        List<String> exist = assignHandoverDAO.findUniqueRpStationComplete();
        String search = "";
        for (AssignHandoverDTO dto : dtos) {
            assignHandoverDAO.saveObject(dto.toModel());
            if (dto.getCatStationHouseId() != null && dto.getCntContractId() != null) {
                search = dto.getCatStationHouseId().toString().toUpperCase() + "_" + dto.getCntContractId().toString().toUpperCase();
            }
            // not found insert
            if (exist.indexOf(search) < 0) {
                assignHandoverDAO.insertIntoRpStationComplete(dto);
            }
            this.sendSms(dto);
        }
    }

    private void doWriteError(List<ExcelErrorDTO> errorList, List<AssignHandoverDTO> dtoList, String filePathError, int errColumn) {
        dtoList.clear();

        AssignHandoverDTO errorContainer = new AssignHandoverDTO();
        errorContainer.setErrorList(errorList);
        errorContainer.setMessageColumn(errColumn); // cột dùng để in ra lỗi
        errorContainer.setFilePathError(filePathError);

        dtoList.add(errorContainer);
    }

    private boolean isRequiredDataExist(Row row, List<ExcelErrorDTO> errorList, DataFormatter formatter) {
        int errCount = 0;
        for (int colIndex : requiredCol) {
            if (StringUtils.isEmpty(formatter.formatCellValue(row.getCell(colIndex)))) {
                ExcelErrorDTO errorDTO = this.createError(row.getRowNum() + 1, colIndex, "chưa nhập");
                errorList.add(errorDTO);
                errCount++;
            }
        }
        return errCount == 0;
    }

    private ExcelErrorDTO createError(int row, int columnIndex, String detail) {
        ExcelErrorDTO err = new ExcelErrorDTO();
        err.setColumnError(colAlias.get(columnIndex));
        err.setLineError(String.valueOf(row));
        err.setDetailError(colName.get(columnIndex) + " " + detail);
        return err;
    }

    @Override
    public String downloadTemplate() throws Exception {
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String fileName = "GiaoViecChoCN.xlsx";
        String filePath = classloader.getResource("../" + "doc-template").getPath() + fileName;
        InputStream file = new BufferedInputStream(new FileInputStream(filePath));
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
        OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + fileName);

        workbook.write(outFile);
        workbook.close();
        outFile.close();
        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + fileName);
        return path;
    }

    @Override
    public DataListDTO getAttachFile(Long id) throws Exception {
        List<UtilAttachDocumentDTO> attachFileList = utilAttachDocumentDAO.getByTypeAndObjectTC(id, ATTACH_DOCUMENT_TYPE_HANDOVER);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(attachFileList);
        dataListDTO.setTotal(1);
        dataListDTO.setSize(1);
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    @Override
    public Long updateAttachFileDesign(AssignHandoverDTO dto) throws Exception {
        if (dto.getFileDesign() == null) {
            return 0L;
        } else {
            AssignHandoverDTO assignHandoverDTO = assignHandoverDAO.findById(dto.getAssignHandoverId());
            if (assignHandoverDTO == null) {
                return 0L;
            }

            Date today = new Date();
            Long id;
            List<UtilAttachDocumentDTO> attachFileList = utilAttachDocumentDAO.getByTypeAndObjectTC(dto.getAssignHandoverId(), ATTACH_DOCUMENT_TYPE_HANDOVER);
            UtilAttachDocumentDTO file = dto.getFileDesign();
            file.setObjectId(dto.getAssignHandoverId());
            file.setType(ATTACH_DOCUMENT_TYPE_HANDOVER);
            file.setFilePath(UEncrypt.decryptFileUploadPath(file.getFilePath()));
            file.setCreatedDate(today);
            if (attachFileList != null && !attachFileList.isEmpty()) {
                //found, update current file (same id)
                file.setUtilAttachDocumentId(attachFileList.get(0).getUtilAttachDocumentId());
                id = utilAttachDocumentBusinessImpl.update(file);
            } else {
                id = utilAttachDocumentBusinessImpl.save(file);
            }

            // setCompanyAssignDate = sysDate when update design
            assignHandoverDTO.setCompanyAssignDate(today);
            assignHandoverDAO.updateObject(assignHandoverDTO.toModel());
            return id;
        }
    }

    @Override
    public Long removeAssignHandover(Long assignHandoverId, Long sysUserId) {
        try {
            AssignHandoverDTO match = assignHandoverDAO.findById(assignHandoverId);
            if (match == null || match.getPerformentId() != null) {
                return 0L;
            }

            match.setStatus(0L);
            match.setUpdateDate(new Date());
            match.setUpdateUserId(sysUserId);
            return assignHandoverDAO.updateObject(match.toModel());
        } catch (Exception e) {
            e.printStackTrace();
            return 0L;
        }
    }

    //VietNT_20181218_start
    public DataListDTO doSearchNV(AssignHandoverDTO criteria, String sysGroupId) {
        List<AssignHandoverDTO> dtos = assignHandoverDAO.doSearchNV(criteria, sysGroupId);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public Long doAssignHandover(AssignHandoverDTO updateInfo, Long sysUserId) {
        List<AssignHandoverDTO> handoverDtos = assignHandoverDAO.findByIdList(updateInfo.getAssignHandoverIdList());
        if (handoverDtos == null || handoverDtos.isEmpty()) {
            return 0L;
        }
        Date today = new Date();
        handoverDtos.forEach(dto -> {
            dto.setUpdateUserId(sysUserId);
            dto.setUpdateDate(today);
            dto.setDepartmentAssignDate(today);
            dto.setPerformentId(updateInfo.getPerformentId());

            assignHandoverDAO.updateObject(dto.toModel());
            this.sendSmsPerformer(
                    dto.getConstructionCode(),
                    updateInfo.getEmail(),
                    updateInfo.getPhoneNumber(),
                    sysUserId,
                    today);
        });

        return 1L;
    }

    private void sendSmsPerformer(String constructionCode, String email, String phoneNum, Long createdUserId, Date createdDate) {
        assignHandoverDAO.insertIntoSendSmsEmailTable(
                MAIL_SUBJECT,
                MAIL_CONTENT_NV + constructionCode,
                email,
                phoneNum,
                createdUserId,
                createdDate);
    }

    public List<UtilAttachDocumentDTO> getListImageHandover(Long handoverId) throws Exception {
        List<UtilAttachDocumentDTO> imageList = utilAttachDocumentDAO.getByTypeAndObjectTC(handoverId, "56");
        this.convertImageToBase64(imageList);

        return imageList;
    }

    private void convertImageToBase64(List<UtilAttachDocumentDTO> imageList) {
        imageList.forEach(img -> {
            try {
                String fullPath = folderUpload + File.separator + UEncrypt.decryptFileUploadPath(img.getFilePath());
                String base64Image = ImageUtil.convertImageToBase64(fullPath);
                img.setBase64String(base64Image);
//                img.setFilePath(fullPath);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    public ConstructionDetailDTO getConstructionProvinceByCode(String constructionCode) {
        return constructionDAO.getConstructionByCode(constructionCode);
    }

    public void updateDeliveryConstructionDate(Long assignHandoverId, Long updateUserId) {
        try {
            AssignHandoverDTO dto = assignHandoverDAO.findById(assignHandoverId);
            if (dto != null && dto.getDeliveryConstructionDate() == null) {
                Date today = new Date();
                dto.setDeliveryConstructionDate(today);
                dto.setUpdateDate(today);
                dto.setUpdateUserId(updateUserId);
                assignHandoverDAO.updateObject(dto.toModel());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public DataListDTO getForSysUserAutoComplete(SysUserCOMSDTO obj) {
        List<SysUserCOMSDTO> dtos = assignHandoverDAO.getForSysUserAutoComplete(obj);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(obj.getTotalRecord());
        dataListDTO.setSize(obj.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public Long updateWorkItemConstructor(ConstructionTaskDetailDTO dto) {
        try {
            Long result = 1L;
            if (null == dto || null == dto.getWorkItemId() || null == dto.getConstructorId()) {
                result = -1L;
            } else {
                assignHandoverDAO.updateWorkItemConstructor(dto.getWorkItemId(), dto.getConstructorId());
            }
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return -1L;
        }
    }
    //VietNT_end
    //VietNT_20190225_start
    private final String HANDOVER_NV_LIST = "Danh_sach_giao_viec_cho_NV.xlsx";

    public String exportHandoverNV(AssignHandoverDTO criteria, String sysGroupIdStr) throws Exception {
    	List<AssignHandoverDTO> dtos = assignHandoverDAO.doSearchNV(criteria, sysGroupIdStr);
        XSSFWorkbook workbook = utilBusiness.createWorkbook(HANDOVER_NV_LIST);
        XSSFSheet sheet = workbook.getSheetAt(0);

        // prepare cell style
        List<CellStyle> styles = this.prepareCellStyles(workbook, sheet);

        // start from
        int rowNo = 1;
        int[] sumValue = new int[] {0, 0, 0};
        XSSFRow row;
        for (AssignHandoverDTO dto : dtos) {
            row = sheet.createRow(rowNo);
            this.createRowHandoverNV(dto, row, styles);
            if (dto.getReceivedObstructDate() != null) {
                sumValue[0]++;
            }
            if (dto.getReceivedGoodsDate() != null) {
                sumValue[1]++;
            }
            if (dto.getReceivedDate() != null) {
                sumValue[2]++;
            }
            rowNo++;
        }

        // create row sum
        int[] colIndex = new int[] {7, 8, 9};
        row = sheet.createRow(rowNo);
        this.createRowSum(row, styles, colIndex, sumValue);

        String path = utilBusiness.writeToFileOnServer(workbook, HANDOVER_NV_LIST);
        return path;
    }

    private void createRowSum(XSSFRow row, List<CellStyle> styles, int[] colIndex, int[] sumValue) {
        for (int i = 0; i < 19; i++) {
            utilBusiness.createExcelCell(row, i, styles.get(0));
        }
        utilBusiness.createExcelCell(row, colIndex[0] - 1, styles.get(0)).setCellValue("Tổng: ");
        for (int i = 0; i < colIndex.length; i++) {
            utilBusiness.createExcelCell(row, colIndex[i], styles.get(0)).setCellValue(sumValue[i]);
        }
    }
    
    private final String[] CONS_STATUS_CONVERT = new String[] {StringUtils.EMPTY, "Chưa thi công", "Đang thi công", "Thi công xong"}; 

    private void createRowHandoverNV(AssignHandoverDTO dto, XSSFRow row, List<CellStyle> styles) {
    	utilBusiness.createExcelCell(row, 0, styles.get(0)).setCellValue(row.getRowNum());
    	utilBusiness.createExcelCell(row, 1, styles.get(1)).setCellValue(dto.getCompanyAssignDate());
        utilBusiness.createExcelCell(row, 2, styles.get(0)).setCellValue(dto.getConstructionCode() != null ? dto.getConstructionCode() : "");
        String design = dto.getIsDesign() == 1L ? "Có thiết kế" : "Không có thiết kế";
        utilBusiness.createExcelCell(row, 3, styles.get(0)).setCellValue(design);
        utilBusiness.createExcelCell(row, 4, styles.get(0)).setCellValue(dto.getFullName() != null ? dto.getFullName() : "");
        utilBusiness.createExcelCell(row, 5, styles.get(1)).setCellValue(dto.getDepartmentAssignDate());
        utilBusiness.createExcelCell(row, 6, styles.get(0)).setCellValue(dto.getOutOfDateReceived() != null ? dto.getOutOfDateReceived() : 0);
        utilBusiness.createExcelCell(row, 7, styles.get(1)).setCellValue(dto.getReceivedObstructDate());
        utilBusiness.createExcelCell(row, 8, styles.get(1)).setCellValue(dto.getReceivedGoodsDate());
        utilBusiness.createExcelCell(row, 9, styles.get(1)).setCellValue(dto.getReceivedDate());
        utilBusiness.createExcelCell(row, 10, styles.get(1)).setCellValue(dto.getDeliveryConstructionDate());
        utilBusiness.createExcelCell(row, 11, styles.get(0)).setCellValue(dto.getPerformentConstructionName() != null ? dto.getPerformentConstructionName() : "");
        utilBusiness.createExcelCell(row, 12, styles.get(0)).setCellValue(dto.getSupervisorConstructionName() != null ? dto.getSupervisorConstructionName() : "");
        utilBusiness.createExcelCell(row, 13, styles.get(1)).setCellValue(dto.getStartingDate());
        utilBusiness.createExcelCell(row, 14, styles.get(0)).setCellValue(dto.getOutOfDateStartDate() != null ? dto.getOutOfDateStartDate() : 0);
        String consStatus = dto.getConstructionStatus() != null ? CONS_STATUS_CONVERT[dto.getConstructionStatus().intValue()] : ""; 
        utilBusiness.createExcelCell(row, 15, styles.get(0)).setCellValue(consStatus);
        utilBusiness.createExcelCell(row, 16, styles.get(0)).setCellValue(dto.getCatStationHouseCode() != null ? dto.getCatStationHouseCode() : "");
        utilBusiness.createExcelCell(row, 17, styles.get(0)).setCellValue(dto.getCntContractCode() != null ? dto.getCntContractCode() : "");
        utilBusiness.createExcelCell(row, 18, styles.get(0)).setCellValue(dto.getPartnerName() != null ? dto.getPartnerName() : "");
    }
   
    
    private List<CellStyle> prepareCellStyles(XSSFWorkbook workbook, XSSFSheet sheet) {
    	CellStyle styleText = ExcelUtils.styleText(sheet);
		CellStyle styleDate = ExcelUtils.styleDate(sheet);

		XSSFCreationHelper createHelper = workbook.getCreationHelper();
		styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
		styleDate.setAlignment(HorizontalAlignment.CENTER);
		
		return Arrays.asList(styleText, styleDate);
    }
    //VietNT_end
}
