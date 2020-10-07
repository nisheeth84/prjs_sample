package com.viettel.aio.business;

import com.google.common.collect.Lists;
import com.viettel.aio.bo.CntContractTaskXNXDBO;
import com.viettel.aio.dao.*;
import com.viettel.aio.dto.*;
import com.viettel.aio.dao.CatUnitDAO;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
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
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


@Service("CntContractTaskXNXDBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CntContractTaskXNXDBusinessImpl extends BaseFWBusinessImpl<CntContractTaskXNXDDAO, CntContractTaskXNXDDTO, CntContractTaskXNXDBO> implements CntContractTaskXNXDBusiness {
    static Logger LOGGER = LoggerFactory
            .getLogger(CntContractTaskXNXDBusinessImpl.class);
    @Autowired
    private CntContractTaskXNXDDAO cntContractTaskXNXDDAO;
    @Context
    HttpServletRequest request;

    @Autowired
    private UserRoleBusinessImpl userRoleBusinessImpl;
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
        colName.put(3, "Công việc");
        colName.put(4, "Đơn vị tính");
        colName.put(5, "Khối lượng");
        colName.put(6, "Đơn giá");
        colName.put(7, "Thành tiền");
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

    public CntContractTaskXNXDBusinessImpl() {
        tModel = new CntContractTaskXNXDBO();
        tDAO = cntContractTaskXNXDDAO;
    }

    @Override
    public CntContractTaskXNXDDAO gettDAO() {
        return cntContractTaskXNXDDAO;
    }


    public List<CntContractTaskXNXDDTO> doSearchPLHD(CntContractTaskXNXDDTO criteria) {
        return cntContractTaskXNXDDAO.doSearchPLHD(criteria);
    }

//    public boolean checkValidatePLHD(CntContractTaskXNXDDTO criteria) {
//
//        Long count =  cntContractTaskXNXDDAO.checkExitPLHD(criteria);
//        if(count != null && count != 0) {
//        	return true;
//        }
//        return false;
//    }
//
    private ExcelErrorDTO createError(int row, String column, String detail){
        ExcelErrorDTO err = new ExcelErrorDTO();
        err.setColumnError(column);
        err.setLineError(String.valueOf(row));
        err.setDetailError(detail);
        return err;
    }

    public void addPLHD(CntContractTaskXNXDDTO cntContractTaskXNXDDTO) {
    	cntContractTaskXNXDDTO.setTaskMass(Double.parseDouble(cntContractTaskXNXDDTO.getTaskMass().toString()));
    	cntContractTaskXNXDDTO.setTaskPrice(cntContractTaskXNXDDTO.getTaskPrice());
    	cntContractTaskXNXDDTO.setTotalMoney(cntContractTaskXNXDDTO.getTotalMoney());
    	cntContractTaskXNXDDAO.addPLHD(cntContractTaskXNXDDTO);
    }
//
//    public void updatePLHD(CntContractTaskXNXDDTO cntContractTaskXNXDDTO) {
//    	cntContractTaskXNXDDTO.setTaskMass(Double.parseDouble(cntContractTaskXNXDDTO.getTaskMass().toString()));
//    	cntContractTaskXNXDDTO.setTaskPrice(cntContractTaskXNXDDTO.getTaskPrice());
//    	cntContractTaskXNXDDTO.setTotalMoney(cntContractTaskXNXDDTO.getTotalMoney());
//    	cntContractTaskXNXDDAO.updatePLHD(cntContractTaskXNXDDTO);
//    }
//
//    public void removePLHD(CntContractTaskXNXDDTO cntContractTaskXNXDDTO) {
//    	cntContractTaskXNXDDAO.removePLHD(cntContractTaskXNXDDTO);
//    }
//
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

//    public boolean validateRequiredCell(Row row, List<ExcelErrorDTO> errorList){
//        DataFormatter formatter = new DataFormatter();
//        boolean result = true;
//        for(int colIndex : validateCol){
//            if(!validateString(formatter.formatCellValue(row.getCell(colIndex)))){
//
//                ExcelErrorDTO errorDTO = new ExcelErrorDTO();
//                errorDTO.setColumnError(colAlias.get(colIndex));
//                errorDTO.setLineError(String.valueOf(row.getRowNum() + 1));
//                errorDTO.setDetailError(colName.get(colIndex)+" chưa nhập");
//                errorList.add(errorDTO);
//                result = false;
//            }
//        }
//        return result;
//    }

    public Boolean isCodeExist(String code, HashMap<String, String> bidSpace) {
        String obj = bidSpace.get(code);
        if (obj != null) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @overview return true if string is not null and not empty
     * @param str
     */
    public boolean validateString(String str){
        return (str != null && str.length()>0);
    }

    public List<CntContractTaskXNXDDTO> importCntJobPLHDPackage(String fileInput, Long cntContractIdIp) {
        List<CntContractTaskXNXDDTO> workLst = Lists.newArrayList();
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
            List<CntContractTaskXNXDDTO> appendixJobDTOList = cntContractTaskXNXDDAO.doSearchPLHD2(cntContractIdIp);

            //hienvd: check workItem in workItemType
            List<WorkItemHCQTDTO> workItemHCQTDTOList = cntContractTaskXNXDDAO.checkValidateWorkInWorkType();
            for (WorkItemHCQTDTO workItemHCQTDTO : workItemHCQTDTOList) {
                if (workItemHCQTDTO.getWorkItemName() != null) {
                    checkWorkInWorkItem.put(
                            workItemHCQTDTO.getWorkItemName().toUpperCase().trim(),
                            workItemHCQTDTO.getWorkItemId().toString());
                }
            }

            //hienvd: check catTask in workItem
            List<CatTaskHCQTDTO> catTaskInWorkItemList = cntContractTaskXNXDDAO.checkValidateCatInWorkItem();
            for (CatTaskHCQTDTO catTaskHCQTDTO : catTaskInWorkItemList) {
                if (catTaskHCQTDTO.getCatTaskName() != null) {
                    checkCatTaskInWork.put(catTaskHCQTDTO.getCatTaskName().toUpperCase().trim(), catTaskHCQTDTO.getCatTaskId().toString());
                }
            }

            for (Row row : sheet) {
                count++;
                if (count >= 3 && checkIfRowIsEmpty(row)) continue;
                if (count >= 3) {
                    String catTaskName = formatter.formatCellValue(row.getCell(1));
                    catTaskName = catTaskName.trim().replaceAll("\\s{2,}", " ");
                    String catUnitName = formatter.formatCellValue(row.getCell(2));
                    catUnitName = catUnitName.trim();
                    String taskMass = formatter.formatCellValue(row.getCell(3));
                    taskMass = taskMass.trim();
                    String taskPrice = formatter.formatCellValue(row.getCell(4));
                    taskPrice = taskPrice.trim();
                    String totalMoney = formatter.formatCellValue(row.getCell(5));
                    totalMoney = totalMoney.trim();
//                    validateRequiredCell(row, errorList);
                    CntContractTaskXNXDDTO obj = new CntContractTaskXNXDDTO();
                    obj.setCntContractId(cntContractIdIp);


                    //validate số lượng
                    if (validateString(taskMass)) {
                        if (taskMass.length() <= 20) {
                            try {
                                if (Double.parseDouble(taskMass) < 0) {
                                    ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3), colName.get(5) + " nhỏ hơn 0");
                                    errorList.add(errorDTO);
                                } else
                                    obj.setTaskMass(Double.parseDouble(taskMass));
                            } catch (Exception e) {
                                ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3), colName.get(5) + " chỉ được nhập số");
                                errorList.add(errorDTO);
                            }
                        } else {
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3), colName.get(5) + " có độ dài quá giới hạn");
                            errorList.add(errorDTO);
                        }
                    } else {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3), colName.get(5) + " bị bỏ trống");
                        errorList.add(errorDTO);
                    }
//                    validate giá
                    if (validateString(taskPrice)) {
                        if (taskPrice.length() <= 20) {
                            try {
                                if (Double.parseDouble(taskPrice) < 0) {
                                    ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4), colName.get(6) + " nhỏ hơn 0");
                                    errorList.add(errorDTO);
                                } else
                                    obj.setTaskPrice(Long.parseLong(taskPrice));
                            } catch (Exception e) {
                                ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4), colName.get(6) + " chỉ được nhập số");
                                errorList.add(errorDTO);
                            }
                        } else {
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4), colName.get(6) + " có độ dài quá giới hạn");
                            errorList.add(errorDTO);
                        }
                    } else {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4), colName.get(6) + " bị bỏ trống");
                        errorList.add(errorDTO);
                    }

                    //validate thanh tien
                    if (validateString(totalMoney)) {
                        if (totalMoney.length() <= 30) {
                            try {
                                if (Double.parseDouble(totalMoney) < 0) {
                                    ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5), colName.get(7) + " nhỏ hơn 0");
                                    errorList.add(errorDTO);
                                } else
                                    obj.setTotalMoney(Long.parseLong(totalMoney));

                            } catch (Exception e) {
                                ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5), colName.get(7) + " chỉ được nhập số");
                                errorList.add(errorDTO);
                            }
                        } else {
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5), colName.get(7) + " có độ dài quá giới hạn");
                            errorList.add(errorDTO);
                        }
                    } else {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5), colName.get(7) + " bị bỏ trống");
                        errorList.add(errorDTO);
                    }


                    //validate cong viec
                    if (validateString(catTaskName)) {
                        obj.setCatTaskName(catTaskName);
                    } else {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(1), colName.get(3) + " bị bỏ trống");
                        errorList.add(errorDTO);
                    }
                    //validate don vi tinh
                    if (validateString(catUnitName)) {
                        obj.setCatUnitName(catUnitName);
                    } else {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(2), colName.get(4) + " bị bỏ trống");
                        errorList.add(errorDTO);
                    }

                    //check exit data
                    for (CntContractTaskXNXDDTO cntAppendixJobDTO : appendixJobDTOList) {
                        if (obj.getCntContractId() != null &&
                                obj.getCatTaskName() != null &&
                                cntAppendixJobDTO.getCntContractId() != null &&
                                cntAppendixJobDTO.getCatTaskName() != null) {
                            if (
                                    Long.parseLong(cntAppendixJobDTO.getCntContractId().toString()) == Long.parseLong(obj.getCntContractId().toString()) &&
                                            cntAppendixJobDTO.getCatTaskName().toString().equals(obj.getCatTaskName().toString())) {
                                ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(1), " Dữ liệu dòng " + (row.getRowNum() + 1) + ": Tên công việc đã tồn tại");
                                errorList.add(errorDTO);
                                break;
                            }
                        }
                    }


                    if (errorList.size() == 0) {
                        workLst.add(obj);
                    }
                }
            }

            if (errorList.size() > 0) {
                String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
                List<CntContractTaskXNXDDTO> emptyArray = Lists.newArrayList();
                workLst = emptyArray;
                CntContractTaskXNXDDTO errorContainer = new CntContractTaskXNXDDTO();
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
            List<CntContractTaskXNXDDTO> emptyArray = Lists.newArrayList();
            workLst = emptyArray;
            CntContractTaskXNXDDTO errorContainer = new CntContractTaskXNXDDTO();
            errorContainer.setErrorList(errorList);
            errorContainer.setMessageColumn(7); // cột dùng để in ra lỗi
            errorContainer.setFilePathError(filePathError);
            workLst.add(errorContainer);
            return workLst;
        }
    }


//  //tatph-10/10/2019-start
//  	public String exportContentPLHD(CntContractTaskXNXDDTO obj, HttpServletRequest request) throws Exception {
//  		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
//  		String filePath = classloader.getResource("../" + "doc-template").getPath();
//  		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "BieuMauPLHD.xlsx"));
//  		XSSFWorkbook workbook = new XSSFWorkbook(file);
//  		file.close();
//  		Calendar cal = Calendar.getInstance();
//  		String uploadPath = folder2Upload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
//  				+ File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
//  				+ File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
//  		String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
//  				+ cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
//  				+ cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
//  		File udir = new File(uploadPath);
//  		if (!udir.exists()) {
//  			udir.mkdirs();
//  		}
//  		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "BieuMauPLHD.xlsx");
//
//
//  		workbook.write(outFile);
//  		workbook.close();
//  		outFile.close();
//  		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "BieuMauPLHD.xlsx");
//  		return path;
//  	}
////  	Huy-end

}

