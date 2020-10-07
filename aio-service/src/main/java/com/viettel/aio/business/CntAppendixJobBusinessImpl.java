package com.viettel.aio.business;

import com.google.common.collect.Lists;
import com.viettel.aio.bo.CntAppendixJobBO;
import com.viettel.aio.dao.*;
import com.viettel.aio.dto.*;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import java.io.*;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;


@Service("CntAppendixJobBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CntAppendixJobBusinessImpl extends BaseFWBusinessImpl<CntConstrWorkItemHCQTTaskDAO, CntAppendixJobDTO, CntAppendixJobBO> implements CntAppendixJobBusiness {
    static Logger LOGGER = LoggerFactory
            .getLogger(CntAppendixJobBusinessImpl.class);
    @Autowired
    private CntConstrWorkItemHCQTTaskDAO cntConstrWorkItemHCQTTaskDAO;
    @Context
    HttpServletRequest request;

    //    @Autowired
//    private UserRoleBusinessImpl userRoleBusinessImpl;
    @Autowired
    private CntContractDAO cntContractDAO;
    @Autowired
    private ConstructionDAO constructionDAO;
    @Autowired
    private CatTaskHCQTDAO catTaskHCQTDAO;
    @Autowired
    private WorkItemTypeHCQTDAO workItemTypeHCQTDAO;
    @Autowired
    private WorkItemHCQTDAO workItemHCQTDAO;
    @Autowired
    private CatUnitDAO catUnitDAO;

    @Value("${folder_upload}")
    private String folder2Upload;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${folder_upload}")
    private String folderTemp;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    //cột cần bắt validate trong file excel
    int[] validateCol = {1, 4};
    HashMap<Integer, String> colName = new HashMap();

    {
        colName.put(1, "Tên loại hạng mục");
        colName.put(2, "Tên hạng mục");
        colName.put(3, "Tên công việc");
        colName.put(4, "Đơn vị tính");
        colName.put(5, "Khối lượng");
        colName.put(6, "Đơn giá");
    }

    HashMap<Integer, String> colAlias = new HashMap();

    {
        colAlias.put(1, "B");
        colAlias.put(2, "C");
        colAlias.put(3, "D");
        colAlias.put(4, "E");
        colAlias.put(5, "F");
        colAlias.put(6, "G");
        colAlias.put(7, "H");
        colAlias.put(8, "I");
        colAlias.put(9, "J");
        colAlias.put(10, "K");
        colAlias.put(11, "L");
        colAlias.put(12, "M");
        colAlias.put(13, "N");
    }

    public CntAppendixJobBusinessImpl() {
        tModel = new CntAppendixJobBO();
        tDAO = cntConstrWorkItemHCQTTaskDAO;
    }

    @Override
    public CntConstrWorkItemHCQTTaskDAO gettDAO() {
        return cntConstrWorkItemHCQTTaskDAO;
    }


    @Override
    public List<CntAppendixJobDTO> doSearchAppendixJob(CntAppendixJobDTO criteria) {
        return cntConstrWorkItemHCQTTaskDAO.doSearchAppendixJob(criteria);
    }

    public List<CntAppendixJobDTO> checkValidate(CntAppendixJobDTO criteria) {
        return cntConstrWorkItemHCQTTaskDAO.checkValidateHCQT(criteria);
    }

    private ExcelErrorDTO createError(int row, String column, String detail) {
        ExcelErrorDTO err = new ExcelErrorDTO();
        err.setColumnError(column);
        err.setLineError(String.valueOf(row));
        err.setDetailError(detail);
        return err;
    }

    @SuppressWarnings("deprecation")
    private boolean checkIfRowIsEmpty(Row row) {
        if (row == null) {
            return true;
        }
        if (row.getLastCellNum() <= 0) {
            return true;
        }
        for (int cellNum = row.getFirstCellNum(); cellNum < row.getLastCellNum(); cellNum++) {
            Cell cell = row.getCell(cellNum);
            if (cell != null && cell.getCellType() != Cell.CELL_TYPE_BLANK && StringUtils.isNotBlank(cell.toString())) {
                return false;
            }
        }
        return true;
    }

    public boolean validateRequiredCell(Row row, List<ExcelErrorDTO> errorList) {
        DataFormatter formatter = new DataFormatter();
        boolean result = true;
        for (int colIndex : validateCol) {
            if (!validateString(formatter.formatCellValue(row.getCell(colIndex)))) {

                ExcelErrorDTO errorDTO = new ExcelErrorDTO();
                errorDTO.setColumnError(colAlias.get(colIndex));
                errorDTO.setLineError(String.valueOf(row.getRowNum() + 1));
                errorDTO.setDetailError(colName.get(colIndex) + " chưa nhập");
                errorList.add(errorDTO);
                result = false;
            }
        }
        return result;
    }

    public Boolean isCodeExist(String code, HashMap<String, String> bidSpace) {
        String obj = bidSpace.get(code);
        if (obj != null) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param str
     * @overview return true if string is not null and not empty
     */
    public boolean validateString(String str) {
        return (str != null && str.length() > 0);
    }

    public List<CntAppendixJobDTO> importCntJobPackage(String fileInput, Long cntContractIdIp) {
        List<CntAppendixJobDTO> workLst = Lists.newArrayList();
        List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();
        try {
            File f = new File(fileInput);
            XSSFWorkbook workbook = new XSSFWorkbook(f);
            XSSFSheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();
            int count = 0;

            HashMap<String, String> taskWorkItemType = new HashMap<String, String>(); //hienvd: check and get id workItemType
            HashMap<String, String> taskWorkItemId = new HashMap<>(); // hienvd: check and get id workItem
            HashMap<String, String> taskWorkItemCode = new HashMap<>(); //hienvd: get code workItem
            HashMap<String, String> checkCatTaskId = new HashMap<>(); //hienvd: check and get cat Task id
            HashMap<String, String> checkGetTaskCode = new HashMap<>(); //hienvd: get cat Task Code
            HashMap<String, String> getContractCode = new HashMap<>(); //hienvd: get contract code
            HashMap<String, String> catUnitCheck = new HashMap<>(); //hienvd: check and get cat Unit Id
            HashMap<String, String> checkWorkInWorkItem = new HashMap<>(); //hienvd: check workItem in workItemType
            HashMap<String, String> checkCatTaskInWork = new HashMap<>(); //hienvd: check cat Task in WorkItem

            //hienvd: Get workItemTypeName and workItemTypeId
            List<WorkItemTypeHCQTDTO> workItemTypeHCQTDTOList = workItemTypeHCQTDAO.doSearch(new WorkItemTypeHCQTDTO());
            for (WorkItemTypeHCQTDTO workItemTypeDTO : workItemTypeHCQTDTOList) {
                if (workItemTypeDTO.getWorkItemTypeName() != null) {
                    taskWorkItemType.put(
                            workItemTypeDTO.getWorkItemTypeName().replaceAll("\\s", "").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim(),
                            workItemTypeDTO.getWorkItemTypeId().toString());
                }
            }

            //hienvd: Get workItemId and workItemCode
            List<WorkItemHCQTDTO> listWorkItem = workItemHCQTDAO.doSearch(new WorkItemHCQTDTO());
            for (WorkItemHCQTDTO workItemHCQTDTO : listWorkItem) {
                if (workItemHCQTDTO.getWorkItemName() != null) {
                    taskWorkItemId.put(
                            workItemHCQTDTO.getWorkItemName().replaceAll("\\s", "").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim(),
                            workItemHCQTDTO.getWorkItemId().toString());
                }
                if (workItemHCQTDTO.getWorkItemId() != null) {
                    taskWorkItemCode.put(workItemHCQTDTO.getWorkItemId().toString(), workItemHCQTDTO.getWorkItemCode());
                }
            }

            //hienvd: Get catTaskId to catTaskName
            List<CatTaskHCQTDTO> catTaskHCQTDTOList = catTaskHCQTDAO.doSearch(new CatTaskHCQTDTO());
            for (CatTaskHCQTDTO catTaskHCQTDTO : catTaskHCQTDTOList) {
                if (catTaskHCQTDTO.getCatTaskName() != null && catTaskHCQTDTO.getCatTaskId() != null) {
                    checkCatTaskId.put(
                            catTaskHCQTDTO.getCatTaskName().replaceAll("\\s", "").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim(),
                            catTaskHCQTDTO.getCatTaskId().toString());
                }

                if (catTaskHCQTDTO.getCatTaskId() != null) {
                    checkGetTaskCode.put(catTaskHCQTDTO.getCatTaskId().toString(), catTaskHCQTDTO.getCatTaskCode().toString());
                }
            }
            //hienvd: getContractCode
            List<CntContractDTO> cntContractDTOList = cntContractDAO.doSearch(new CntContractDTO());
            for (CntContractDTO cntContractDTO : cntContractDTOList) {
                if (cntContractDTO.getCntContractId() != null) {
                    getContractCode.put(cntContractDTO.getCntContractId().toString(), cntContractDTO.getCode().toString());
                }
            }

            //hienvd: Get Id catUnitCheck
            List<CatUnitDTO> catUnitDTOList = catUnitDAO.doSearch(new CatUnitDTO());
            for (CatUnitDTO catUnitDTO : catUnitDTOList) {
                if (catUnitDTO.getName() != null) {
                    catUnitCheck.put(
                            catUnitDTO.getName().replaceAll("\\s", "").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim(),
                            catUnitDTO.getCatUnitId().toString());
                }
            }
            //hienvd: check exit
            List<CntAppendixJobDTO> appendixJobDTOList = cntConstrWorkItemHCQTTaskDAO.doSearch();

            //hienvd: check workItem in workItemType
            List<WorkItemHCQTDTO> workItemHCQTDTOList = cntConstrWorkItemHCQTTaskDAO.checkValidateWorkInWorkType();
            for (WorkItemHCQTDTO workItemHCQTDTO : workItemHCQTDTOList) {
                if (workItemHCQTDTO.getWorkItemName() != null) {
                    checkWorkInWorkItem.put(
                            workItemHCQTDTO.getWorkItemName().toUpperCase().trim(),
                            workItemHCQTDTO.getWorkItemId().toString());
                }
            }

            //hienvd: check catTask in workItem
            List<CatTaskHCQTDTO> catTaskInWorkItemList = cntConstrWorkItemHCQTTaskDAO.checkValidateCatInWorkItem();
            for (CatTaskHCQTDTO catTaskHCQTDTO : catTaskInWorkItemList) {
                if (catTaskHCQTDTO.getCatTaskName() != null) {
                    checkCatTaskInWork.put(catTaskHCQTDTO.getCatTaskName().toUpperCase().trim(), catTaskHCQTDTO.getCatTaskId().toString());
                }
            }

            for (Row row : sheet) {
                count++;
                if (count >= 3 && checkIfRowIsEmpty(row)) continue;
                if (count >= 3) {
                    String workItemTypeName = formatter.formatCellValue(row.getCell(1));
                    workItemTypeName = workItemTypeName.trim().replaceAll("\\s{2,}", " ");
                    String workItemName = formatter.formatCellValue(row.getCell(2));
                    workItemName = workItemName.trim().replaceAll("\\s{2,}", " ");
                    String catTaskName = formatter.formatCellValue(row.getCell(3));
                    catTaskName = catTaskName.trim().replaceAll("\\s{2,}", " ");
                    String catUnitName = formatter.formatCellValue(row.getCell(4));
                    catUnitName = catUnitName.trim();
                    String quantity = formatter.formatCellValue(row.getCell(5));
                    quantity = quantity.trim();
                    String price = formatter.formatCellValue(row.getCell(6));
                    price = price.trim();
                    validateRequiredCell(row, errorList);
                    CntAppendixJobDTO obj = new CntAppendixJobDTO();
                    obj.setWorkItemTypeName(workItemTypeName);
                    obj.setWorkItemName(workItemName);
                    obj.setCatTaskName(catTaskName);
                    obj.setCatUnitName(catUnitName);

                    //valide check du lieu ten loai hang muc ton tai trong bang loai hang muc
                    if (taskWorkItemType.get(
                            workItemTypeName.replaceAll("\\s", "").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim()) == null) {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(1), colName.get(1) + " không tồn tại");
                        errorList.add(errorDTO);
                    } else {
                        Long workItemTypeId = Long.parseLong(taskWorkItemType.get(workItemTypeName.replaceAll("\\s", "").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim()));
                        obj.setWorkItemTypeId(workItemTypeId);
                    }

                    //validate check du lieu neu khong ton tai trong bang hạng mục và nằm trong bảng loại hạng mục
                    if (taskWorkItemId.get(workItemName.replaceAll("\\s", "").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim()) == null) {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(2), colName.get(2) + " không tồn tại");
                        errorList.add(errorDTO);
                    } else {
                        Long workItemId = Long.parseLong(
                                taskWorkItemId.get(workItemName.replaceAll("\\s", "").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim()));
                        String workItemCode = taskWorkItemCode.get(workItemId.toString());
                        if (workItemId != null && workItemCode != null) {
                            obj.setWorkItemId(workItemId);
                            obj.setWorkItemCode(workItemCode);
                        } else {
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(2), colName.get(2) + " không tồn tại");
                            errorList.add(errorDTO);
                        }
                        String checkWorkInWorkItemType = workItemTypeName + "/" + workItemName;
                        //check ton tai hang muc co thuoc trong loai hang muc
                        if (checkWorkInWorkItem.get(checkWorkInWorkItemType.toUpperCase().trim()) == null) {
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(2), colName.get(2) + " không thuộc loại hạng mục");
                            errorList.add(errorDTO);
                        }

                    }

                    //validate check du lieu ten cong viec ton tai trong cong viec
                    if (checkCatTaskId.get(catTaskName.replaceAll("\\s", "").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim()) == null) {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3), colName.get(3) + " không tồn tại");
                        errorList.add(errorDTO);
                    } else {
                        Long catTaskId = Long.parseLong(
                                checkCatTaskId.get(catTaskName.replaceAll("\\s", "").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim()));
                        String catTaskCode = checkGetTaskCode.get(catTaskId.toString());
                        if (catTaskId != null && catTaskCode != null) {
                            obj.setCatTaskId(catTaskId);
                            obj.setCatTaskCode(catTaskCode);
                        } else {
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3), colName.get(3) + " không tồn tại");
                            errorList.add(errorDTO);
                        }
                        String catTaskCheck = (workItemName + "/" + catTaskName).toUpperCase().trim();

                        //check cong viec co ton tai trong hang muc
                        if (checkCatTaskInWork.get(catTaskCheck.toUpperCase().trim()) == null) {
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3), colName.get(3) + " không thuộc hạng mục");
                            errorList.add(errorDTO);
                        }
                    }
                    //validate check ma don vi
                    if (catUnitCheck.get(catUnitName.replaceAll("\\s", "").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim()) == null) {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4), colName.get(4) + " không tồn tại");
                        errorList.add(errorDTO);
                    } else {
                        Long catUnitId = Long.parseLong(
                                catUnitCheck.get(catUnitName.replaceAll("\\s", "").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim()));
                        obj.setCatUnitId(catUnitId);
                    }
                    //get ma hop dong contract code
                    if (cntContractIdIp != null) {
                        obj.setCntContractId(cntContractIdIp);
                        if (getContractCode.get(cntContractIdIp.toString()) != null) {
                            String cntContractCode = getContractCode.get(cntContractIdIp.toString());
                            obj.setCntContractCode(cntContractCode);
                        }
                    }

                    //check exit data
                    for (CntAppendixJobDTO cntAppendixJobDTO : appendixJobDTOList) {
                        if (obj.getCntContractId() != null &&
                                obj.getWorkItemTypeId() != null &&
                                obj.getWorkItemId() != null &&
                                obj.getCatTaskId() != null &&
                                cntAppendixJobDTO.getCntContractId() != null &&
                                cntAppendixJobDTO.getWorkItemTypeId() != null &&
                                cntAppendixJobDTO.getWorkItemId() != null &&
                                cntAppendixJobDTO.getCatTaskId() != null) {
                            if (
                                    Long.parseLong(cntAppendixJobDTO.getCntContractId().toString()) == Long.parseLong(obj.getCntContractId().toString()) &&
                                            Long.parseLong(cntAppendixJobDTO.getWorkItemTypeId().toString()) == Long.parseLong(obj.getWorkItemTypeId().toString()) &&
                                            Long.parseLong(cntAppendixJobDTO.getWorkItemId().toString()) == Long.parseLong(obj.getWorkItemId().toString()) &&
                                            Long.parseLong(cntAppendixJobDTO.getCatTaskId().toString()) == Long.parseLong(obj.getCatTaskId().toString())) {
                                ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(1), " Dữ liệu dòng " + (row.getRowNum() + 1) + " đã có không thể tạo mới");
                                errorList.add(errorDTO);
                                break;
                            }
                        }
                    }

                    //validate số lượng
                    if (validateString(quantity)) {
                        if (quantity.length() <= 20) {
                            try {
                                if (Double.parseDouble(quantity) < 0) {
                                    ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5), colName.get(5) + " nhỏ hơn 0");
                                    errorList.add(errorDTO);
                                } else
                                    obj.setQuantity(Double.parseDouble(quantity));
                            } catch (Exception e) {
                                ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5), colName.get(5) + " không hợp lệ");
                                errorList.add(errorDTO);
                            }
                        } else {
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5), colName.get(5) + " có độ dài quá giới hạn");
                            errorList.add(errorDTO);
                        }
                    } else {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5), colName.get(5) + " bị bỏ trống");
                        errorList.add(errorDTO);
                    }
                    //validate giá
                    if (validateString(price)) {
                        price = price.replace(",", "");
                    } else {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6), colName.get(6) + " bị bỏ trống");
                        errorList.add(errorDTO);
                    }

                    if (price.length() <= 30) {
                        try {
                            if (Double.parseDouble(price) < 0) {
                                ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6), colName.get(6) + " nhỏ hơn 0");
                                errorList.add(errorDTO);
                            } else
                                obj.setPrice(Double.parseDouble(price));
                        } catch (Exception e) {
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6), colName.get(6) + " không hợp lệ");
                            errorList.add(errorDTO);
                        }
                    } else {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6), colName.get(6) + " có độ dài quá giới hạn");
                        errorList.add(errorDTO);
                    }


                    if (errorList.size() == 0) {
                        workLst.add(obj);
                    }
                }
            }

            if (errorList.size() > 0) {
                String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
                List<CntAppendixJobDTO> emptyArray = Lists.newArrayList();
                workLst = emptyArray;
                CntAppendixJobDTO errorContainer = new CntAppendixJobDTO();
                errorContainer.setErrorList(errorList);
                errorContainer.setMessageColumn(7); // cột dùng để in ra lỗi
                errorContainer.setFilePathError(filePathError);
                workLst.add(errorContainer);
            }
            workbook.close();
            return workLst;

        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ExcelErrorDTO errorDTO = createError(0, "", e.toString());
            errorList.add(errorDTO);
            String filePathError = null;
            try {
                filePathError = UEncrypt.encryptFileUploadPath(fileInput);
            } catch (Exception ex) {
                LOGGER.error(e.getMessage(), e);
                errorDTO = createError(0, "", ex.toString());
                errorList.add(errorDTO);
            }
            List<CntAppendixJobDTO> emptyArray = Lists.newArrayList();
            workLst = emptyArray;
            CntAppendixJobDTO errorContainer = new CntAppendixJobDTO();
            errorContainer.setErrorList(errorList);
            errorContainer.setMessageColumn(7); // cột dùng để in ra lỗi
            errorContainer.setFilePathError(filePathError);
            workLst.add(errorContainer);
            return workLst;
        }
    }

    public CntContractDTO getInfoContract(CntAppendixJobDTO obj) {
        return cntConstrWorkItemHCQTTaskDAO.getInfoContract(obj);
    }

    //Huypq-20190827-start

    public String exportContentHCQT(CntAppendixJobDTO obj, HttpServletRequest request) throws Exception {
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + "BieuMauHCQT.xlsx"));
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
        OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "BieuMauHCQT.xlsx");
        List<CntAppendixJobDTO> data = cntConstrWorkItemHCQTTaskDAO.getDataExportFileTemplate();
        List<CatUnitDTO> dataUnit = cntConstrWorkItemHCQTTaskDAO.getAllCatUnit();
        XSSFSheet sheet = workbook.getSheetAt(1);
        if ((data != null && !data.isEmpty())) { // huy-edit
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            // HuyPQ-17/08/2018-edit-start
            XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
            styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.00"));
            XSSFCellStyle styleNumber2 = ExcelUtils.styleNumber(sheet);
            styleNumber2.setDataFormat(workbook.createDataFormat().getFormat("0"));
            // HuyPQ-17/08/2018-edit-end
            styleNumber.setAlignment(HorizontalAlignment.RIGHT);
            int i = 1;
            for (CntAppendixJobDTO dto : data) {
                Row row = sheet.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (i - 1));
                cell.setCellStyle(styleNumber);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue((dto.getWorkItemTypeName() != null) ? dto.getWorkItemTypeName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue((dto.getWorkItemName() != null) ? dto.getWorkItemName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(3, CellType.STRING);
                cell.setCellValue((dto.getCatTaskName() != null) ? dto.getCatTaskName() : "");
                cell.setCellStyle(style);
            }
        }

        XSSFSheet sheetUnit = workbook.getSheetAt(2);
        if ((dataUnit != null && !dataUnit.isEmpty())) { // huy-edit
            XSSFCellStyle style = ExcelUtils.styleText(sheetUnit);
            // HuyPQ-17/08/2018-edit-start
            XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheetUnit);
            styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.00"));
            XSSFCellStyle styleNumber2 = ExcelUtils.styleNumber(sheetUnit);
            styleNumber2.setDataFormat(workbook.createDataFormat().getFormat("0"));
            // HuyPQ-17/08/2018-edit-end
            styleNumber.setAlignment(HorizontalAlignment.RIGHT);
            int i = 1;
            for (CatUnitDTO dto : dataUnit) {
                Row row = sheetUnit.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (i - 1));
                cell.setCellStyle(styleNumber);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue((dto.getCode() != null) ? dto.getCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue((dto.getName() != null) ? dto.getName() : "");
                cell.setCellStyle(style);
            }
        }

        workbook.write(outFile);
        workbook.close();
        outFile.close();
        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "BieuMauHCQT.xlsx");
        return path;
    }
    //Huy-end

}

