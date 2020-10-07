package com.viettel.coms.business;

import com.viettel.coms.bo.RequestGoodsBO;
import com.viettel.coms.bo.RequestGoodsDetailBO;
import com.viettel.coms.dao.RequestGoodsDAO;
import com.viettel.coms.dao.RequestGoodsDetailDAO;
import com.viettel.coms.dto.*;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.commons.lang3.StringUtils;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCell;
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

import javax.activation.DataHandler;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import java.io.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

//VietNT_20190104_created
@Service("requestGoodsBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestGoodsBusinessImpl extends BaseFWBusinessImpl<RequestGoodsDAO, RequestGoodsDTO, RequestGoodsBO> implements RequestGoodsBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(RequestGoodsBusinessImpl.class);

    @Autowired
    private RequestGoodsDAO requestGoodsDAO;

    @Autowired
    private RequestGoodsDetailDAO requestGoodsDetailDAO;

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

    private HashMap<Integer, String> colAlias = new HashMap<>();

    {
        colAlias.put(0, "");
        colAlias.put(1, "B");
        colAlias.put(2, "C");
        colAlias.put(3, "D");
        colAlias.put(4, "E");
        colAlias.put(5, "F");
        colAlias.put(6, "G");
    }

    private HashMap<Integer, String> colName = new HashMap<>();

    {
        colName.put(0, "");
//        colName.put(1, "STT");
        colName.put(1, "Mã công trình");
        colName.put(2, "Tên vật tư thiết bị");
        colName.put(3, "Ngày đề nghị cấp");
        colName.put(4, "Đơn vị tính");
        colName.put(5, "Số lượng");
        colName.put(6, "Ghi chú");
    }

    private final int[] requiredCol = new int[]{1, 2, 4, 5};
    private final int WRITE_ERROR_COLUMN = 7;

    public DataListDTO doSearch(RequestGoodsDTO criteria, List<String> sysGroupId) {
        List<RequestGoodsDTO> dtos = requestGoodsDAO.doSearch(criteria, sysGroupId);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public DataListDTO searchConstruction(ConstructionDetailDTO obj, String sysGroupId) {
        List<ConstructionDetailDTO> dtos = requestGoodsDAO.searchConstruction(obj, sysGroupId);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(obj.getTotalRecord());
        dataListDTO.setSize(obj.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public DataListDTO doSearchDetail(RequestGoodsDetailDTO obj) {
        DataListDTO dataListDTO = new DataListDTO();
        if (null != obj.getRequestGoodsId()) {
            List<RequestGoodsDetailDTO> dtos = requestGoodsDAO.doSearchDetail(obj);
            dataListDTO.setData(dtos);
            dataListDTO.setTotal(obj.getTotalRecord());
            dataListDTO.setSize(obj.getPageSize());
        } else {
            dataListDTO.setData(new ArrayList());
            dataListDTO.setTotal(0);
            dataListDTO.setSize(obj.getPageSize());
        }
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public List<RequestGoodsDetailDTO> getCatUnit() {
        return requestGoodsDAO.getCatUnit();
    }

    private Date getConsReceivedDate(AssignHandoverDTO consInfo) {
        Date consReceivedDate = null;
        if (consInfo.getReceivedDate() != null) {
            consReceivedDate = consInfo.getReceivedDate();
        }

        if (consInfo.getReceivedGoodsDate() != null) {
            if (consReceivedDate != null) {
                consReceivedDate = consReceivedDate.before(consInfo.getReceivedGoodsDate())
                        ? consReceivedDate
                        : consInfo.getReceivedGoodsDate();
            } else {
                consReceivedDate = consInfo.getReceivedGoodsDate();
            }
        }

        if (consInfo.getReceivedObstructDate() != null) {
            if (consReceivedDate != null) {
                consReceivedDate = consReceivedDate.before(consInfo.getReceivedObstructDate())
                        ? consReceivedDate
                        : consInfo.getReceivedObstructDate();
            } else {
                consReceivedDate = consInfo.getReceivedObstructDate();
            }
        }

        return consReceivedDate;
    }

    public void addNewRequestGoods(RequestGoodsDTO dto, Long sysUserId) throws Exception {
        Date today = new Date();
        dto.setCreatedUserId(sysUserId);
        dto.setCreatedDate(today);

        //Các thông tin tỉnh, hợp đồng, công trình, ngày nhận BGMB, đường dẫn file thiết kế lấy theo thông tin công trình
        AssignHandoverDTO consInfo = requestGoodsDAO.getConstructionDetailInfo(dto.getConstructionId());
        if (consInfo == null) {
            throw new Exception("Không tìm thấy công trình");
        }

        //Lưu dữ liệu vào bảng Request_goods, Request_goods_detail theo mô tả với status = 0, is_order = null
        //update request goods
//        Long sysGroupId = consInfo.getSysGroupId() != null ? Long.parseLong(consInfo.getSysGroupId()) : null;
        dto.setSysGroupId(consInfo.getSysGroupId());

        dto.setCntContractId(consInfo.getCntContractId());
        dto.setCntContractCode(consInfo.getCntContractCode());
        dto.setObjectId(consInfo.getAssignHandoverId());
        dto.setReceiveDate(this.getConsReceivedDate(consInfo));
        dto.setStatus(0L);
        dto.setIsOrder(null);

        this.insertNewRequestGoodsToDb(dto);
    }

    private void insertNewRequestGoodsToDb(RequestGoodsDTO dto) throws Exception {
        Long result = requestGoodsDAO.saveObject(dto.toModel());
        if (result > 0) {
            if (dto.getRequestGoodsDetailList() != null && !dto.getRequestGoodsDetailList().isEmpty()) {
                List<RequestGoodsDetailBO> listBos = new ArrayList<>();
//                dto.getRequestGoodsDetailList().forEach(detail -> {
//                    detail.setRequestGoodsId(result);
//                    listBos.add(detail.toModel());
//                });
                for (RequestGoodsDetailDTO detail : dto.getRequestGoodsDetailList()) {
                    detail.setRequestGoodsId(result);
                    listBos.add(detail.toModel());
                }
                requestGoodsDetailDAO.saveList(listBos);
            }
        } else {
            throw new Exception("Xảy ra lỗi khi lưu yêu cầu");
        }
    }

    /*
    private ConstructionDetailDTO getConstructionInfo(Long constructionId) {
        List<Long> constructionIds = new ArrayList<>(Collections.singletonList(constructionId));
        List<ConstructionDetailDTO> consInfos = requestGoodsDAO.getConstructionDetailInfo(constructionIds);
        if (consInfos != null && !consInfos.isEmpty()) {
            return consInfos.get(0);
        }
        return null;
    }
    */

    public void doRequestGoods(List<Long> requestGoodsIds, Long sysUserId) throws Exception {
        List<RequestGoodsDTO> requestGoodsDTOS = requestGoodsDAO.findByIdList(requestGoodsIds);
        if (requestGoodsDTOS == null || requestGoodsDTOS.isEmpty()) {
            throw new Exception("Không tìm thấy yêu cầu vật tư");
        }

        Date today = new Date();
        //Khi xác nhận cập nhật dữ liệu status = 1, send_date = sysdate
        requestGoodsDTOS.forEach(dto -> {
            dto.setStatus(1L);
            dto.setSendDate(today);
            dto.setUpdateUserId(sysUserId);
            dto.setUpdateDate(today);

            requestGoodsDAO.updateObject(dto.toModel());
        });
    }


    private String getFolderParam(HttpServletRequest request) {
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

    private <T extends ComsBaseFWDTO> void doWriteError(List<ExcelErrorDTO> errorList, List<T> dtoList, String filePathError, T errorContainer) {
        dtoList.clear();

        errorContainer.setErrorList(errorList);
        errorContainer.setMessageColumn(WRITE_ERROR_COLUMN);
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

    private ExcelErrorDTO createError(int row, int columnIndex, String detail, int offSetColumnAlias, int offSetColumnName) {
        ExcelErrorDTO err = new ExcelErrorDTO();
        err.setColumnError(colAlias.get(columnIndex - offSetColumnAlias));
        err.setLineError(String.valueOf(row));
        err.setDetailError(colName.get(columnIndex - offSetColumnName) + " " + detail);
        return err;
    }

    @SuppressWarnings("Duplicates")
    public List<RequestGoodsDTO> doImportExcel(String filePath, Long sysUserId, String sysGroupIdStr) {
        List<RequestGoodsDTO> dtoList = new ArrayList<>();
        List<ExcelErrorDTO> errorList = new ArrayList<>();
//        Date max = new Date(System.currentTimeMillis() + ((3600*24*1000) * 365L * 2));

        try {
            File f = new File(filePath);
            XSSFWorkbook workbook = new XSSFWorkbook(f);
            XSSFSheet sheet = workbook.getSheetAt(0);

            DataFormatter formatter = new DataFormatter();
            formatter.addFormat("m/d/yy", new SimpleDateFormat("M/d/yyyy"));
            int rowCount = 0;
            Date today = new Date();

            // prepare data for validate
            ConstructionDetailDTO sysGroupInfo = requestGoodsDAO.getSysGroupNameById(sysGroupIdStr);
            String sysGroupName = "";
            if (sysGroupInfo != null) {
                sysGroupName = sysGroupInfo.getSysGroupName();
            }
            // Mã công trình thỏa mãn điều kiện construction.sys_group_id = theo miền dữ liệu của quyền REQUEST GOODS
            List<RequestGoodsDTO> dtos = requestGoodsDAO.findConstructionInSysGroup(sysGroupIdStr);
            List<String> constructionCodeInSysGroup = new ArrayList<>();
            if (dtos != null && !dtos.isEmpty()) {
                constructionCodeInSysGroup = dtos.stream()
                        .map(RequestGoodsDTO::getConstructionCode)
                        .map(String::toUpperCase)
                        .collect(Collectors.toList());
            }

            HashMap<String, RequestGoodsDetailDTO> catUnitRef = new HashMap<>();
            List<RequestGoodsDetailDTO> catUnitList = requestGoodsDAO.getCatUnit();
            catUnitList.forEach(catUnit -> catUnitRef.put(catUnit.getCatUnitCode().toUpperCase(), catUnit));

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
//                this.isRequiredDataExist(row, errorList, formatter);

                // required 1, 2, 4, 5
//                RequestGoodsDTO dtoValidated = new RequestGoodsDTO();
                RequestGoodsDetailDTO detailDTOValidated = new RequestGoodsDetailDTO();

                String constructionCode = formatter.formatCellValue(row.getCell(1)).trim();
                String goodsName = formatter.formatCellValue(row.getCell(2)).trim();
                String suggestDateStr = formatter.formatCellValue(row.getCell(3)).trim();
                String catUnitCode = formatter.formatCellValue(row.getCell(4)).trim();
                String quantity = formatter.formatCellValue(row.getCell(5)).trim();
                String description = formatter.formatCellValue(row.getCell(6)).trim();

                // constructionCode - required
                int errorCol = 1;
                if (StringUtils.isNotEmpty(constructionCode)) {
                    /*
                    if (constructionCodeInSysGroup.indexOf(constructionCode.toUpperCase()) >= 0) {
                        dtoValidated.setConstructionCode(constructionCode);
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không tồn tại hoặc không thuộc đơn vị " + sysGroupName));
                    }
                    */
                    if (constructionCodeInSysGroup.indexOf(constructionCode.toUpperCase()) < 0) {
                        errorList.add(this.createError(rowCount, errorCol, "không tồn tại hoặc không thuộc đơn vị " + sysGroupName));
                    }
                } else {
                    errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                }

                // goodsName - required
                errorCol = 2;
                if (StringUtils.isNotEmpty(goodsName)) {
                    detailDTOValidated.setGoodsName(goodsName);
                } else {
                    errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                }

                // suggestDate
                errorCol = 3;
                if (StringUtils.isNotEmpty(suggestDateStr)) {
                    SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
                    sdf.setLenient(false);
                    Date suggestDate;
                    try {
                        suggestDate = sdf.parse(suggestDateStr);
//                        if (suggestDate.after(max)) {
//                        	suggestDate = null;
//                        }
                        detailDTOValidated.setSuggestDate(suggestDate);
                    } catch (ParseException e) {
                        errorList.add(this.createError(rowCount, errorCol, "không đúng kiểu dữ liệu"));
                    }
                }

                // catUnitCode - required
                errorCol = 4;
                if (StringUtils.isNotEmpty(catUnitCode)) {
                    RequestGoodsDetailDTO catUnit = catUnitRef.get(catUnitCode.toUpperCase());
                    if (catUnit != null) {
                        detailDTOValidated.setCatUnitId(catUnit.getCatUnitId());
                        detailDTOValidated.setCatUnitName(catUnit.getCatUnitName());
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không tồn tại"));
                    }

                } else {
                    errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                }

                // quantity - required
                errorCol = 5;
                if (StringUtils.isNotEmpty(quantity)) {
                    try {
                        Double qtt = Double.parseDouble(quantity);
                        detailDTOValidated.setQuantity(qtt);
                    } catch (NumberFormatException e) {
                        errorList.add(this.createError(rowCount, errorCol, "không đúng kiểu dữ liệu"));
                    }
                } else {
                    errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                }

                // description
//                errorCol = 6;
                detailDTOValidated.setDescription(description);

                if (errorList.size() == 0) {
                    RequestGoodsDTO dtoValidated = dtoList.stream()
                            .filter(dto -> dto.getConstructionCode().equals(constructionCode))
                            .findFirst().orElse(null);

                    if (dtoValidated != null) {
                        dtoValidated.getRequestGoodsDetailList().add(detailDTOValidated);
                    } else {
                        // get contruction info
                        ConstructionDetailDTO consInfo = requestGoodsDAO.findConstructionInfoByCodeForImport(constructionCode, sysGroupIdStr);

                        dtoValidated = new RequestGoodsDTO();
                        dtoValidated.setCreatedUserId(sysUserId);
                        dtoValidated.setCreatedDate(today);
                        dtoValidated.setSysGroupId(Long.parseLong(sysGroupIdStr));
                        dtoValidated.setConstructionCode(constructionCode);

                        dtoValidated.setCatProvinceId(consInfo.getCatProvinceId());
                        dtoValidated.setConstructionId(consInfo.getConstructionId());
                        dtoValidated.setCntContractId(consInfo.getCntContractId());
                        dtoValidated.setCntContractCode(consInfo.getCntContractCode());
                        dtoValidated.setObjectId(consInfo.getObjectId());
                        dtoValidated.setReceiveDate(consInfo.getReceivedDate());
                        dtoValidated.setStatus(0L);
                        dtoValidated.setIsOrder(null);

                        dtoValidated.setRequestGoodsDetailList(new ArrayList<>());
                        dtoValidated.getRequestGoodsDetailList().add(detailDTOValidated);

                        dtoList.add(dtoValidated);
                    }
                }
            }

            if (errorList.size() > 0) {
                String filePathError = UEncrypt.encryptFileUploadPath(filePath);
                this.doWriteError(errorList, dtoList, filePathError, new RequestGoodsDTO());
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
            this.doWriteError(errorList, dtoList, filePathError, new RequestGoodsDTO());
        }

        return dtoList;
    }

    @SuppressWarnings("Duplicates")
    public List<RequestGoodsDetailDTO> readExcelImportDetail(String filePath) {
        List<RequestGoodsDetailDTO> dtoList = new ArrayList<>();
        List<ExcelErrorDTO> errorList = new ArrayList<>();
//        Date max = new Date(System.currentTimeMillis() + ((3600*24*1000) * 365L * 2));

        try {
            File f = new File(filePath);
            XSSFWorkbook workbook = new XSSFWorkbook(f);
            XSSFSheet sheet = workbook.getSheetAt(0);

            DataFormatter formatter = new DataFormatter();
            formatter.addFormat("m/d/yy", new SimpleDateFormat("M/d/yyyy"));
            int rowCount = 0;

            HashMap<String, RequestGoodsDetailDTO> catUnitRef = new HashMap<>();
            List<RequestGoodsDetailDTO> catUnitList = requestGoodsDAO.getCatUnit();
            catUnitList.forEach(catUnit -> catUnitRef.put(catUnit.getCatUnitCode().toUpperCase(), catUnit));

            for (Row row : sheet) {
                rowCount++;
                if (rowCount < 6) {
                    continue;
                }

                // required 1, 2, 4, 5
                RequestGoodsDetailDTO detailDTOValidated = new RequestGoodsDetailDTO();

//                String constructionCode = formatter.formatCellValue(row.getCell(1)).trim();
                String goodsName = formatter.formatCellValue(row.getCell(1)).trim();
                String suggestDateStr = formatter.formatCellValue(row.getCell(2)).trim();
                String catUnitCode = formatter.formatCellValue(row.getCell(3)).trim();
                String quantity = formatter.formatCellValue(row.getCell(4)).trim();
                String description = formatter.formatCellValue(row.getCell(5)).trim();

                // goodsName - required
                int errorCol = 2;
                if (StringUtils.isNotEmpty(goodsName)) {
                    detailDTOValidated.setGoodsName(goodsName);
                } else {
                    errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống", -1, 0));
                }

                // suggestDate
                errorCol = 3;
                if (StringUtils.isNotEmpty(suggestDateStr)) {
                    SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
                    sdf.setLenient(false);
                    Date suggestDate;
                    try {
                        suggestDate = sdf.parse(suggestDateStr);
//                        if (suggestDate.after(max)) {
//                        	suggestDate = null;
//                        }
                        detailDTOValidated.setSuggestDate(suggestDate);
                    } catch (ParseException e) {
                        errorList.add(this.createError(rowCount, errorCol, "không đúng kiểu dữ liệu", -1, 0));
                    }
                }

                // catUnitCode - required
                errorCol = 4;
                if (StringUtils.isNotEmpty(catUnitCode)) {
                    RequestGoodsDetailDTO catUnit = catUnitRef.get(catUnitCode.toUpperCase());
                    if (catUnit != null) {
                        detailDTOValidated.setCatUnitId(catUnit.getCatUnitId());
                        detailDTOValidated.setCatUnitName(catUnit.getCatUnitName());
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không tồn tại", -1, 0));
                    }

                } else {
                    errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống", -1, 0));
                }

                // quantity - required
                errorCol = 5;
                if (StringUtils.isNotEmpty(quantity)) {
                    try {
                        Double qtt = Double.parseDouble(quantity);
                        detailDTOValidated.setQuantity(qtt);
                    } catch (NumberFormatException e) {
                        errorList.add(this.createError(rowCount, errorCol, "không đúng kiểu dữ liệu", -1, 0));
                    }
                } else {
                    errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống", -1, 0));
                }

                // description
//                errorCol = 6;
                detailDTOValidated.setDescription(description);

                if (errorList.size() == 0) {
                    dtoList.add(detailDTOValidated);
                }
            }

            if (errorList.size() > 0) {
                String filePathError = UEncrypt.encryptFileUploadPath(filePath);
                this.doWriteError(errorList, dtoList, filePathError, new RequestGoodsDetailDTO());
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
            this.doWriteError(errorList, dtoList, filePathError, new RequestGoodsDetailDTO());
        }

        return dtoList;
    }

    public void addNewRequestGoodsImport(List<RequestGoodsDTO> dtos) throws Exception {
        for (RequestGoodsDTO rg : dtos) {
            this.insertNewRequestGoodsToDb(rg);
        }
    }

    public String downloadTemplate(long templateDetail) throws Exception {
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String fileName = templateDetail == 1 ? "Import_YeucausanxuatVT.xlsx" : "YeucausanxuatVT.xlsx";
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

        // prepare unit data
        List<RequestGoodsDetailDTO> catUnitList = requestGoodsDAO.getCatUnit();

        CellStyle style = workbook.createCellStyle(); // Create new style
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);

        // get sheet 2
        XSSFSheet sheet = workbook.getSheetAt(1);
        int rowNum = 1;
        for (RequestGoodsDetailDTO catUnit : catUnitList) {
            XSSFRow row = sheet.createRow(rowNum);

            XSSFCell cell = row.createCell(0);
            cell.setCellStyle(style);
            cell.setCellValue(catUnit.getCatUnitCode());

            cell = row.createCell(1);
            cell.setCellStyle(style);
            cell.setCellValue(catUnit.getCatUnitName());

            rowNum++;
        }

        OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + fileName);
        workbook.write(outFile);
        workbook.close();
        outFile.close();
        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + fileName);
        return path;
    }

    public void editRequestGoods(RequestGoodsDTO dto, Long sysUserId) throws Exception {
        Long requestGoodsId = dto.getRequestGoodsId();
        RequestGoodsDTO requestGoodsDTO = this.findById(requestGoodsId);
        if (null != requestGoodsDTO) {
            Date today = new Date();

            requestGoodsDTO.setRequestContent(dto.getRequestContent());
            requestGoodsDTO.setUpdateUserId(sysUserId);
            requestGoodsDTO.setUpdateDate(today);

            if (dto.getStatus() != null && dto.getStatus() == 1) {
                requestGoodsDTO.setStatus(1L);
                requestGoodsDTO.setSendDate(today);
            }

            Long result = requestGoodsDAO.updateObject(requestGoodsDTO.toModel());
            if (result == 0) {
                throw new Exception("Cập nhật thất bại");
            }
        } else {
            throw new Exception("Không tìm thấy yêu cầu vật tư");
        }

        /*
        List<RequestGoodsDetailDTO> incoming = dto.getRequestGoodsDetailList();
        for (RequestGoodsDetailDTO detail : incoming) {
            if (null != detail.getRequestGoodsDetailId()) {
                requestGoodsDetailDAO.updateObject(detail.toModel());
            } else {
                detail.setRequestGoodsId(requestGoodsId);
                requestGoodsDetailDAO.saveObject(detail.toModel());
            }
        }
        */
        // delete current
        List<RequestGoodsDetailDTO> onDb = requestGoodsDAO.doSearchDetail(requestGoodsId);
        for (RequestGoodsDetailDTO detail : onDb) {
        	requestGoodsDetailDAO.delete(detail.toModel());
        }
        
        // insert new
        List<RequestGoodsDetailDTO> incoming = dto.getRequestGoodsDetailList();
		for (RequestGoodsDetailDTO detail : incoming) {
			detail.setRequestGoodsId(requestGoodsId);
			requestGoodsDetailDAO.saveObject(detail.toModel());
		}
    }

    public DataListDTO getDetailsById(Long requestGoodsId) {
        DataListDTO dataListDTO = new DataListDTO();
        List<RequestGoodsDetailDTO> dtos = requestGoodsDAO.doSearchDetail(requestGoodsId);
        if (dtos != null && !dtos.isEmpty()) {
            dataListDTO.setData(dtos);
        } else {
            dataListDTO.setData(new ArrayList());
        }
        ;
        return dataListDTO;
    }

    private RequestGoodsDTO findById(Long requestGoodsId) {
        List<Long> tempIdList = Collections.singletonList(requestGoodsId);
        List<RequestGoodsDTO> requestGoodsDTOS = requestGoodsDAO.findByIdList(tempIdList);
        if (requestGoodsDTOS == null || requestGoodsDTOS.isEmpty()) {
            return null;
        }
        return requestGoodsDTOS.get(0);
    }

    public void deleteRequest(Long requestGoodsId) throws Exception {
        RequestGoodsDTO dto = this.findById(requestGoodsId);
        if (null == dto) {
            throw new Exception("Không tìm thấy chi tiết yêu cầu vật tư");
        }

        RequestGoodsDetailDTO criteria = new RequestGoodsDetailDTO();
        criteria.setRequestGoodsId(dto.getRequestGoodsId());
        List<RequestGoodsDetailDTO> detailDTOS = requestGoodsDAO.doSearchDetail(criteria);

        String result = requestGoodsDAO.delete(dto.toModel());
        if (result.equals("SUCCESS") && detailDTOS != null && !detailDTOS.isEmpty()) {
            for (RequestGoodsDetailDTO detailDTO : detailDTOS) {
                requestGoodsDetailDAO.delete(detailDTO.toModel());
            }
        } else {
            throw new Exception("Xóa thất bại");
        }
    }
}
