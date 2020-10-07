package com.viettel.aio.business;

import com.google.common.collect.Lists;
import com.viettel.aio.bo.CntConstrWorkItemTaskBO;
import com.viettel.aio.dao.*;
import com.viettel.aio.dto.*;
import com.viettel.cat.dto.CatTaskDTO;
import com.viettel.coms.dto.WorkItemDTO;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
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

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


@Service("cntConstrWorkItemTaskBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CntConstrWorkItemTaskBusinessImpl extends BaseFWBusinessImpl<CntConstrWorkItemTaskDAO, CntConstrWorkItemTaskDTO, CntConstrWorkItemTaskBO> implements CntConstrWorkItemTaskBusiness {
    static Logger LOGGER = LoggerFactory
            .getLogger(CntConstrWorkItemTaskBusinessImpl.class);
    @Value("${folder_upload}")
    private String folder2Upload;
    @Value("${temp_sub_folder_upload}")
    private String tempFileFolderUpload;
    @Autowired
    private CntConstrWorkItemTaskDAO cntConstrWorkItemTaskDAO;

    @Autowired
    private ConstructionDAO constructionDAO;

//    @Autowired
//    private WorkItemDAO workItemDAO;

    @Autowired
    private CatTaskDAO catTaskDAO;


    @Autowired
    private CntContractDAO cntContractDAO;

    @Autowired
    private AppParamDAO appParamDAO;

    //cột cần bắt validate trong file excel
    int[] validateCol = {1, 4};
    int[] validateColTypeHTCT = {1, 4, 7};

    HashMap<Integer, String> colName = new HashMap();

    {
        colName.put(1, "Mã công trình");
        colName.put(2, "Tên hạng mục");
        colName.put(3, "Tên đầu việc");
        colName.put(4, "Giá tiền");
        colName.put(5, "Đơn vị tính");
        colName.put(6, "Ghi chú");
        colName.put(7, "Mã trạm khách hàng");
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

    public CntConstrWorkItemTaskBusinessImpl() {
        tModel = new CntConstrWorkItemTaskBO();
        tDAO = cntConstrWorkItemTaskDAO;
    }

    @Override
    public CntConstrWorkItemTaskDAO gettDAO() {
        return cntConstrWorkItemTaskDAO;
    }

	@Override
	public CntConstrWorkItemTaskDTO findByIdentityKey(CntConstrWorkItemTaskDTO criteria) {
		return cntConstrWorkItemTaskDAO.findByIdentityKey(criteria);
	}

    public CntConstrWorkItemTaskDTO getIdForCntContractOut(CntConstrWorkItemTaskDTO criteria) {
        return cntConstrWorkItemTaskDAO.getIdForCntContractOut(criteria);
    }

    public List<CntConstrWorkItemTaskDTO> checkConstructionIdForImport(CntConstrWorkItemTaskDTO criteria) {
        return cntConstrWorkItemTaskDAO.checkConstructionIdForImport(criteria);
    }

    @Override
    public List<CntConstrWorkItemTaskDTO> doSearch(CntConstrWorkItemTaskDTO obj) {
        return cntConstrWorkItemTaskDAO.doSearch(obj);
    }

//	@Override
//	public List<CntConstrWorkItemTaskDTO> doSearchForTab(CntConstrWorkItemTaskDTO obj) {
//		return cntConstrWorkItemTaskDAO.doSearchForTab(obj);
//	}

    @Override
    public List<CntConstrWorkItemTaskDTO> getForAutoComplete(CntConstrWorkItemTaskDTO query) {
        return cntConstrWorkItemTaskDAO.getForAutoComplete(query);
    }

    public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
        return cntConstrWorkItemTaskDAO.delete(ids, tableName, tablePrimaryKey);
    }


    public CntConstrWorkItemTaskDTO getById(Long id) {
        return cntConstrWorkItemTaskDAO.getById(id);
    }


    @Override
    public List<CntConstrWorkItemTaskDTO> importCntConstruction(String fileInput, Long contractId, Long cntContractParentId, Long contractType) {


        List<CntConstrWorkItemTaskDTO> workLst = Lists.newArrayList();
        List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();
        String error = "";
        try {
            HashMap<String, String> constructionMap = new HashMap<String, String>();    //to get id
//			HashMap<String, String> constructionMap2 = new HashMap<String, String>();	//to check cong trinh thuoc hop dong dau ra_hoanm1_comment
//			List<ConstructionDTO> constructionLst = constructionDAO.doSearch(new ConstructionDTO()); --Huypq-20190916-comment
            List<ConstructionDTO> constructionLst = constructionDAO.getDataConstructionImport();
            for (ConstructionDTO construction : constructionLst) {
                if (construction.getCode() != null) {
                    constructionMap.put(construction.getCode().toUpperCase().trim(), construction.getConstructionId().toString());
                }
            }
            HashMap<String, String> cntContractMap = new HashMap<String, String>();
            HashMap<String, String> cntContractMap2 = new HashMap<String, String>();
//			hoanm1_20190916_start
            List<Long> constructionIdLst = new ArrayList<Long>();
            if (contractType != 0L) {
//				List<CntContractDTO> cntContractLst = cntContractDAO.doSearch(new CntContractDTO()); --Huypq-20190916-comment
                List<CntContractDTO> cntContractLst = constructionDAO.getDataContractImport(new CntContractDTO());
                for (CntContractDTO cntContract : cntContractLst) {
                    cntContractMap.put(cntContract.getCntContractId().toString(), cntContract.getContractType().toString());
//					cntContractMap2.put(cntContract.getCntContractId().toString(), cntContract.getCode());
                }
                if (Long.parseLong(cntContractMap.get(contractId.toString())) == 1l) {
                    List<ConstructionDTO> constructionLst2 = constructionDAO.checkForImport(new ConstructionDTO());
                    for (ConstructionDTO construction : constructionLst2) {
                        if (construction.getCntContractMapId() != null) {
//							constructionMap2.put(construction.getConstructionId().toString(), construction.getCntContractMapId().toString());
                            if (cntContractParentId.toString().equals(construction.getCntContractMapId()))
                                constructionIdLst.add(construction.getConstructionId());
                        }
                    }
                }
            }

//			hoanm1_20190916_end
            HashMap<String, String> workItemMap = new HashMap<String, String>();    //to get workItemId
            HashMap<String, String> workItemMap2 = new HashMap<String, String>();    //to get catWorkItemTypeId
            HashMap<String, String> workItemMap3 = new HashMap<String, String>();    //to check if name exist
//			List<WorkItemDTO> workItemLst = workItemDAO.doSearch(new WorkItemDTO()); ---Huypq-20190916-comment
            List<WorkItemDTO> workItemLst = constructionDAO.getDataWorkItem();
            for (WorkItemDTO workItem : workItemLst) {
                if (workItem.getConstructionId() != null) {
                    workItemMap.put(workItem.getName() + "|" + workItem.getConstructionId(), workItem.getWorkItemId().toString());
                }
                if (workItem.getConstructionId() != null && workItem.getCatWorkItemTypeId() != null) {
                    workItemMap2.put(workItem.getName() + "|" + workItem.getConstructionId(), workItem.getCatWorkItemTypeId().toString());
                }
            }

            HashMap<String, String> catTaskMap = new HashMap<String, String>();        //to get catTaskId
            HashMap<String, String> catTaskMap2 = new HashMap<String, String>();    //to check if name exist
//			List<CatTaskDTO> catTaskLst = catTaskDAO.doSearch(new CatTaskDTO());
            List<CatTaskDTO> catTaskLst = constructionDAO.getDataCatTask();
            for (CatTaskDTO catTask : catTaskLst) {
                if (catTask.getCatWorkItemTypeId() != null) {
                    catTaskMap.put(catTask.getName().toUpperCase().trim() + "|" + catTask.getCatWorkItemTypeId(), catTask.getCatTaskId().toString());
                }
            }

            HashMap<String, Double> catUnitMap = new HashMap<String, Double>();        //money type: usd or vnd
            AppParamDTO appParamSearch = new AppParamDTO();
            appParamSearch.setParType("MONEY_TYPE");
            List<AppParamDTO> catUnitLst = appParamDAO.doSearch(appParamSearch);
            for (AppParamDTO catUnit : catUnitLst) {
                if (catUnit.getCode() != null && catUnit.getAppParamId() != null)
                    catUnitMap.put(catUnit.getCode().toUpperCase().trim(), Double.parseDouble(catUnit.getAppParamId().toString()));
            }
//			Huypq-20190916-start
//			HashMap<String, String> cntConstrWorkItemTaskMap = new HashMap<String, String>();
//			List<CntConstrWorkItemTaskDTO> cntConstrWorkItemTaskLst = cntConstrWorkItemTaskDAO.doSearch(new CntConstrWorkItemTaskDTO());
//			List<CntConstrWorkItemTaskDTO> cntConstrWorkItemTaskLst = constructionDAO.getDataCntConstrWorkItemTask();
//			for (CntConstrWorkItemTaskDTO cntConstrWorkItemTask : cntConstrWorkItemTaskLst) {
//				String constructionIdTemp = cntConstrWorkItemTask.getConstructionId().toString();
//				String workItemIdTemp = null;
//				String catTaskIdTemp = null;
//				String cntContractIdTemp = null;
//				if(cntConstrWorkItemTask.getWorkItemId() != null)
//					workItemIdTemp = cntConstrWorkItemTask.getWorkItemId().toString();
//				if(cntConstrWorkItemTask.getCatTaskId() != null)
//					catTaskIdTemp = cntConstrWorkItemTask.getCatTaskId().toString();
//				if(cntConstrWorkItemTask.getCntContractId() != null)
//					cntContractIdTemp = cntConstrWorkItemTask.getCntContractId().toString();
//				String keyTemp = constructionIdTemp;
//				if(workItemIdTemp != null) keyTemp = keyTemp + "|" + workItemIdTemp;
//				if(catTaskIdTemp != null) keyTemp = keyTemp + "|" + catTaskIdTemp;
//				if(cntContractIdTemp != null) keyTemp = keyTemp + "|" + cntContractIdTemp;
//				cntConstrWorkItemTaskMap.put(keyTemp, cntConstrWorkItemTask.getCntContractId().toString());
//			}
            //Huy-end
//			huypq30_20190919_start
//			HashMap<String, String> checkConstructionMap = null;
//			if(contractType == 0l) {
//				checkConstructionMap = new HashMap<String, String>();
//				List<CntConstrWorkItemTaskDTO> checkConstructionLst = cntConstrWorkItemTaskDAO.checkConstructionIdForImport(new CntConstrWorkItemTaskDTO());
//				for (CntConstrWorkItemTaskDTO checkObj : checkConstructionLst) {
//					if(checkObj.getCntContractId() != null) {
//						checkConstructionMap.put(checkObj.getConstructionId().toString(), checkObj.getCntContractId().toString());
//					}
//				}
//			}
//			huypq30_20190919_end
            File f = new File(fileInput);
            XSSFWorkbook workbook = new XSSFWorkbook(f);
            XSSFSheet sheet = workbook.getSheetAt(0);

            DataFormatter formatter = new DataFormatter();
            int count = 0;

            for (Row row : sheet) {
                count++;
                if (count >= 3 && checkIfRowIsEmpty(row)) continue;
                CntConstrWorkItemTaskDTO obj = new CntConstrWorkItemTaskDTO();
                if (count >= 3) {
                    String stationHTCT = null;
                    String constructionName = formatter.formatCellValue(row.getCell(1)).toUpperCase().trim();
                    String workItemName = formatter.formatCellValue(row.getCell(2)).toUpperCase().trim();
                    String catTaskName = formatter.formatCellValue(row.getCell(3)).toUpperCase().trim();
                    String catUnitName = formatter.formatCellValue(row.getCell(5)).toUpperCase().trim();
                    Long constructionId = null;
                    Long workItemId = null;
                    Long catTaskId = null;
                    Double catUnitId = null;
                    String price = formatter.formatCellValue(row.getCell(4));
                    String description = formatter.formatCellValue(row.getCell(6));
                    validateRequiredCell(row, errorList); // kiểm tra các ô bắt buộc nhập đã dc nhập chưa
                    Boolean isConstructionValid = true;
                    Boolean isWorkItemValid = true;
                    Boolean isCatTaskValid = true;
                    Boolean isNumberOk = true;

                    CntConstrWorkItemTaskDTO data = new CntConstrWorkItemTaskDTO();

                    try {
                        constructionId = Long.parseLong(constructionMap.get(constructionName));
                        //validate nam trong hop dong dau ra
                        if (contractType == 1l) {
                            if (Long.parseLong(cntContractMap.get(contractId.toString())) == 1l) {
                                Boolean isExistInCntContractOut = false;
                                for (Long id : constructionIdLst) {
                                    if (id.toString().equals(constructionId.toString()))
                                        isExistInCntContractOut = true;
                                }

                                if (!isExistInCntContractOut) {
                                    ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(1), colName.get(1) + " không tồn tại trong hợp đồng đầu ra");
                                    errorList.add(errorDTO);
                                    isConstructionValid = false;
                                }
                            }
                        }
//						huypq30_20190919_start
//						if(contractType == 0l) {
//							if(checkConstructionMap.get(constructionId.toString()) != null) {
//								if(!checkConstructionMap.get(constructionId.toString()).toString().equals(contractId.toString())) {
////									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(1), colName.get(1)+ " đã thuộc hợp đồng đầu ra khác [Code:"+cntContractMap2.get(checkConstructionMap.get(constructionId.toString()).toString())+"]");--Huypq-20190916
//									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(1), colName.get(1)+ " đã thuộc hợp đồng đầu ra khác");
//									errorList.add(errorDTO);
//									isConstructionValid = false;
//								}
//							}
//						}
//						huypq30_20190919_end
                        data.setConstructionId(constructionId);
                    } catch (Exception e) {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(1), colName.get(1) + " không tồn tại hoặc đã tồn tại trong hợp đồng khác ");
                        errorList.add(errorDTO);
                        isConstructionValid = false;
                    }
                    if (validateString(workItemName)) {

                        try {
                            workItemId = Long.parseLong(workItemMap.get(workItemName + "|" + constructionId));
//								Boolean isBelongToConstruction = false;
                            data.setWorkItemId(workItemId);

                        } catch (Exception e) {
                            isWorkItemValid = false;
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(2), colName.get(2) + " không thuộc công trình");
                            errorList.add(errorDTO);
                        }


                    } else isWorkItemValid = false;

                    if (validateString(catTaskName)) {

                        try {
                            String catWorkItemTypeIdTemp = workItemMap2.get(workItemName + "|" + constructionId);
                            catTaskId = Long.parseLong(catTaskMap.get(catTaskName + "|" + catWorkItemTypeIdTemp));
                            data.setCatTaskId(catTaskId);
                        } catch (Exception e) {
                            isCatTaskValid = false;
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3), colName.get(3) + " không thuộc hạng mục");
                            errorList.add(errorDTO);
                        }


                    } else isCatTaskValid = false;

                    //validate bộ khóa đã tồn tại chưa
                    //HuyPq-20190919-start
                    if (isConstructionValid) {
//							String keyTemp = "" + constructionId.toString();
//
//							if(workItemId != null) keyTemp = keyTemp + "|" + workItemId.toString();
//							if(catTaskId != null) keyTemp = keyTemp + "|" + catTaskId.toString();
//							keyTemp = keyTemp + "|" + contractId.toString();
//
//							String isExist = cntConstrWorkItemTaskMap.get(keyTemp);
//							if(isExist != null) {
//								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(1), colName.get(1)+", "+colName.get(2)+", "
//							+colName.get(3)+ " đã cùng tồn tại");
//								errorList.add(errorDTO);
//							} else {
                        obj.setConstructionId(constructionId);
                        obj.setWorkItemId(workItemId);
                        obj.setCatTaskId(catTaskId);
//							}
                    }
                    //Huy-end
                    if (validateString(catUnitName)) {
                        try {
                            String catUnitCode = "1";
                            if (catUnitName.toUpperCase().trim().equals("USD")) {
                                catUnitCode = "2";
                            }
                            catUnitId = catUnitMap.get(catUnitCode);
                            obj.setUnitPrice(catUnitId);
                        } catch (Exception e) {
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5), colName.get(5) + " không tồn tại");
                            errorList.add(errorDTO);
                        }
                    }

                    if (price.length() <= 13) {
                        try {
                            obj.setPrice(Double.parseDouble(price));
                        } catch (Exception e) {
                            isNumberOk = false;
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4), colName.get(4) + " không hợp lệ");
                            errorList.add(errorDTO);
                        }
                    } else {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4), colName.get(4) + " có độ dài quá giới hạn");
                        errorList.add(errorDTO);
                    }

                    if (description.trim().length() <= 2000)
                        obj.setDescription(description.trim());
                    else {
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
                List<CntConstrWorkItemTaskDTO> emptyArray = Lists.newArrayList();
                workLst = emptyArray;
                CntConstrWorkItemTaskDTO errorContainer = new CntConstrWorkItemTaskDTO();
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
            List<CntConstrWorkItemTaskDTO> emptyArray = Lists.newArrayList();
            workLst = emptyArray;
            CntConstrWorkItemTaskDTO errorContainer = new CntConstrWorkItemTaskDTO();
            errorContainer.setErrorList(errorList);
            errorContainer.setMessageColumn(7); // cột dùng để in ra lỗi
            errorContainer.setFilePathError(filePathError);
            workLst.add(errorContainer);
            return workLst;
        }
    }

    //end chinhpxn 10042018


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

    //hienvd: START 9/9/2019
    public boolean validateRequiredCellTypeHTCT(Row row, List<ExcelErrorDTO> errorList) {
        DataFormatter formatter = new DataFormatter();
        boolean result = true;
        for (int colIndex : validateColTypeHTCT) {
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
    //hienvd: END 9/9/2019

/*
	public List<CntConstrWorkItemTaskDTO> getByContractId(Long cntContractId) {
		return cntConstrWorkItemTaskDAO.getByContractId(cntContractId);
	}
*/

//    public int updateConstrWorkItemTask(Long cntContractId, CntConstrWorkItemTaskDTO obj) {
//        return cntConstrWorkItemTaskDAO.updateConstrWorkItemTask(cntContractId, obj);
//    }
//
//    public int insertConstrWorkItemTask(Long cntContractId, CntConstrWorkItemTaskDTO obj) {
//        return cntConstrWorkItemTaskDAO.insertConstrWorkItemTask(cntContractId, obj);
//    }

	public List<CntConstrWorkItemTaskDTO> getConstructionTask(CntConstrWorkItemTaskDTO criteria){
		return cntConstrWorkItemTaskDAO.getConstructionTask(criteria);
	}

    @Override
    public List<CntConstrWorkItemTaskDTO> getConstructionWorkItem(CntConstrWorkItemTaskDTO criteria) {
        return cntConstrWorkItemTaskDAO.getConstructionWorkItem(criteria);
    }

    @Override
    public List<CntConstrWorkItemTaskDTO> getTaskProgress(CntConstrWorkItemTaskDTO criteria) {
        return cntConstrWorkItemTaskDAO.getTaskProgress(criteria);
    }

    public Boolean isExistForMap(Long cntContractId, CntConstrWorkItemTaskDTO data) {
        CntConstrWorkItemTaskDTO obj = cntConstrWorkItemTaskDAO.findByIdentityKeyForMap(cntContractId, data);
        if (obj != null) {
            return true;
        } else {
            return false;
        }
    }

    public Boolean isExist(CntConstrWorkItemTaskDTO data) {
        CntConstrWorkItemTaskDTO obj = cntConstrWorkItemTaskDAO.findByIdentityKey(data);
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

/*	@Override
	public List<CntConstrWorkItemTaskDTO> doSearchContractProgress(
			CntContractDTO cntContractDTO) {
		return cntConstrWorkItemTaskDAO.doSearchContractProgress(cntContractDTO);
	}
	@Override
	public List<CntConstrWorkItemTaskDTO> doSearchContractProgressDetail(
			CntContractDTO cntContractDTO) {
		return cntConstrWorkItemTaskDAO.doSearchContractProgressDetail(cntContractDTO);
	}

	*/

    @Override
    public List<CntConstrWorkItemTaskDTO> getConstructionByContractId(
            CntConstrWorkItemTaskDTO criteria) {
        return cntConstrWorkItemTaskDAO.getConstructionByContractId(criteria);
    }

    /**Hoangnh start 30012019**/
	public List<CntConstrWorkItemTaskDTO> importCntConstructionOS(String fileInput, Long contractId, Long cntContractParentId, Long contractType) {

		List<CntConstrWorkItemTaskDTO> workLst = Lists.newArrayList();
		List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();
		String error = "";
		try {
			HashMap<String, String> constructionMap = new HashMap<String, String>();	//to get id
//			HashMap<String, String> constructionMap2 = new HashMap<String, String>();	//to check cong trinh thuoc hop dong dau ra
//			List<ConstructionDTO> constructionLst = constructionDAO.doSearch(new ConstructionDTO()); ---Huypq-20190916-comment
			List<ConstructionDTO> constructionLst = constructionDAO.getDataConstructionImport();
			for (ConstructionDTO construction : constructionLst) {
				if(construction.getCode() != null) {
					constructionMap.put(construction.getCode().toUpperCase().trim(), construction.getConstructionId().toString());
				}
			}

			HashMap<String, String> cntContractMap = new HashMap<String, String>();
			HashMap<String, String> cntContractMap2 = new HashMap<String, String>();
			CntContractDTO cntContractDTO = new CntContractDTO();
			cntContractDTO.setCheckOS("1");
			List<Long> constructionIdLst = new ArrayList<Long>();
			if(contractType !=0L) {
//				List<CntContractDTO> cntContractLst = cntContractDAO.doSearch(cntContractDTO); ---Huypq-20190916-comment
				List<CntContractDTO> cntContractLst = constructionDAO.getDataContractImport(cntContractDTO);
				for (CntContractDTO cntContract : cntContractLst) {
					cntContractMap.put(cntContract.getCntContractId().toString(), cntContract.getContractType().toString());
//					cntContractMap2.put(cntContract.getCntContractId().toString(), cntContract.getCode());
				}

				if(Long.parseLong(cntContractMap.get(contractId.toString())) == 1l) {
					List<ConstructionDTO> constructionLst2 = constructionDAO.checkForImport(new ConstructionDTO());
					for (ConstructionDTO construction : constructionLst2) {
						if(construction.getCntContractMapId() != null) {
//							constructionMap2.put(construction.getConstructionId().toString(), construction.getCntContractMapId().toString());
							if(cntContractParentId.toString().equals(construction.getCntContractMapId()))
								constructionIdLst.add(construction.getConstructionId());
						}
					}
				}
			}
			HashMap<String, String> workItemMap = new HashMap<String, String>();	//to get workItemId
			HashMap<String, String> workItemMap2 = new HashMap<String, String>();	//to get catWorkItemTypeId
			HashMap<String, String> workItemMap3 = new HashMap<String, String>();	//to check if name exist
//			List<WorkItemDTO> workItemLst = workItemDAO.doSearch(new WorkItemDTO()); ---Huypq-20190916-comment
			List<WorkItemDTO> workItemLst = constructionDAO.getDataWorkItem();
			for (WorkItemDTO workItem : workItemLst) {
				if(workItem.getConstructionId() != null) {
//					hoanm1_20190612_start
//					workItemMap.put(workItem.getName().toUpperCase().trim() + "|" + workItem.getConstructionId(), workItem.getWorkItemId().toString());
					workItemMap.put(workItem.getName() + "|" + workItem.getConstructionId(), workItem.getWorkItemId().toString());
				}
				if(workItem.getConstructionId() != null && workItem.getCatWorkItemTypeId() != null) {
//					workItemMap2.put(workItem.getName().toUpperCase().trim() + "|" + workItem.getConstructionId(), workItem.getCatWorkItemTypeId().toString());
					workItemMap2.put(workItem.getName() + "|" + workItem.getConstructionId(), workItem.getCatWorkItemTypeId().toString());
				}
//				hoanm1_20190612_end
			}

			HashMap<String, String> catTaskMap = new HashMap<String, String>();		//to get catTaskId
			HashMap<String, String> catTaskMap2 = new HashMap<String, String>();	//to check if name exist
//			List<CatTaskDTO> catTaskLst = catTaskDAO.doSearch(new CatTaskDTO()); ---Huypq-20190916-comment
			List<CatTaskDTO> catTaskLst = constructionDAO.getDataCatTask();
			for (CatTaskDTO catTask : catTaskLst) {
				if(catTask.getCatWorkItemTypeId() != null) {
					catTaskMap.put(catTask.getName().toUpperCase().trim() + "|" + catTask.getCatWorkItemTypeId(), catTask.getCatTaskId().toString());
				}
			}

			HashMap<String, Double> catUnitMap = new HashMap<String, Double>();		//money type: usd or vnd
			AppParamDTO appParamSearch = new AppParamDTO();
			appParamSearch.setParType("MONEY_TYPE");
			List<AppParamDTO> catUnitLst = appParamDAO.doSearch(appParamSearch);
			for (AppParamDTO catUnit : catUnitLst) {
				if(catUnit.getCode() != null && catUnit.getAppParamId() != null)
				catUnitMap.put(catUnit.getCode().toUpperCase().trim(), Double.parseDouble(catUnit.getAppParamId().toString()));
			}
//			Huypq-20190919-start
//			HashMap<String, String> cntConstrWorkItemTaskMap = new HashMap<String, String>();
//			List<CntConstrWorkItemTaskDTO> cntConstrWorkItemTaskLst = cntConstrWorkItemTaskDAO.doSearch(new CntConstrWorkItemTaskDTO());---Huypq-20190916-start
//			List<CntConstrWorkItemTaskDTO> cntConstrWorkItemTaskLst = constructionDAO.getDataCntConstrWorkItemTask();
//			for (CntConstrWorkItemTaskDTO cntConstrWorkItemTask : cntConstrWorkItemTaskLst) {
//				String constructionIdTemp = cntConstrWorkItemTask.getConstructionId().toString();
//				String workItemIdTemp = null;
//				String catTaskIdTemp = null;
//				String cntContractIdTemp = null;
//				if(cntConstrWorkItemTask.getWorkItemId() != null)
//					workItemIdTemp = cntConstrWorkItemTask.getWorkItemId().toString();
//				if(cntConstrWorkItemTask.getCatTaskId() != null)
//					catTaskIdTemp = cntConstrWorkItemTask.getCatTaskId().toString();
//				if(cntConstrWorkItemTask.getCntContractId() != null)
//					cntContractIdTemp = cntConstrWorkItemTask.getCntContractId().toString();
//				String keyTemp = constructionIdTemp;
//				if(workItemIdTemp != null) keyTemp = keyTemp + "|" + workItemIdTemp;
//				if(catTaskIdTemp != null) keyTemp = keyTemp + "|" + catTaskIdTemp;
//				if(cntContractIdTemp != null) keyTemp = keyTemp + "|" + cntContractIdTemp;
//				cntConstrWorkItemTaskMap.put(keyTemp, cntConstrWorkItemTask.getCntContractId().toString());
//			}
//			HashMap<String, String> checkConstructionMap = null;
//			if(contractType == 0l) {
//				checkConstructionMap = new HashMap<String, String>();
//				List<CntConstrWorkItemTaskDTO> checkConstructionLst = cntConstrWorkItemTaskDAO.checkConstructionIdForImport(new CntConstrWorkItemTaskDTO());
//				for (CntConstrWorkItemTaskDTO checkObj : checkConstructionLst) {
//					if(checkObj.getCntContractId() != null) {
//						checkConstructionMap.put(checkObj.getConstructionId().toString(), checkObj.getCntContractId().toString());
//					}
//				}
//			}
//			Huypq-20190919-end
			File f = new File(fileInput);
			XSSFWorkbook workbook = new XSSFWorkbook(f);
			XSSFSheet sheet = workbook.getSheetAt(0);

			DataFormatter formatter = new DataFormatter();
			int count = 0;

			for (Row row : sheet) {
				count++;
				if(count >= 3 && checkIfRowIsEmpty(row)) continue;
				CntConstrWorkItemTaskDTO obj = new CntConstrWorkItemTaskDTO();
				if (count >= 3) {

					String constructionName = formatter.formatCellValue(row.getCell(1)).toUpperCase().trim();
					String workItemName = formatter.formatCellValue(row.getCell(2)).toUpperCase().trim();
					String catTaskName = formatter.formatCellValue(row.getCell(3)).toUpperCase().trim();
					String catUnitName = formatter.formatCellValue(row.getCell(5)).toUpperCase().trim();

					Long constructionId = null;
					Long workItemId = null;
					Long catTaskId = null;
					Double catUnitId = null;
					String price = formatter.formatCellValue(row.getCell(4));
					String description = formatter.formatCellValue(row.getCell(6));
					validateRequiredCell(row, errorList); // kiểm tra các ô bắt buộc nhập đã dc nhập chưa
					Boolean isConstructionValid = true;
					Boolean isWorkItemValid = true;
					Boolean isCatTaskValid = true;
					Boolean isNumberOk = true;

					CntConstrWorkItemTaskDTO data = new CntConstrWorkItemTaskDTO();

					try {
						constructionId = Long.parseLong(constructionMap.get(constructionName));
						//validate nam trong hop dong dau ra
						if(contractType == 1l) {
							if(Long.parseLong(cntContractMap.get(contractId.toString())) == 1l) {
								Boolean isExistInCntContractOut = false;
								for (Long id : constructionIdLst) {
									if(id.toString().equals(constructionId.toString()))
										isExistInCntContractOut = true;
								}

								if(!isExistInCntContractOut) {
									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(1), colName.get(1)+ " không tồn tại trong hợp đồng đầu ra");
									errorList.add(errorDTO);
									isConstructionValid = false;
								}
							}
						}
//						Huypq-20190919-start
//						if(contractType == 0l) {
//							if(checkConstructionMap.get(constructionId.toString()) != null) {
//								if(!checkConstructionMap.get(constructionId.toString()).toString().equals(contractId.toString())) {
////									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(1), colName.get(1)+ " đã thuộc hợp đồng đầu ra khác [Code:"+cntContractMap2.get(checkConstructionMap.get(constructionId.toString()).toString())+"]");
//									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(1), colName.get(1)+ " đã thuộc hợp đồng đầu ra khác");
//									errorList.add(errorDTO);
//									isConstructionValid = false;
//								}
//							}
//						}
//						Huypq-20190919-end
						data.setConstructionId(constructionId);
					} catch(Exception e) {
						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(1), colName.get(1)+ " không tồn tại hoặc đã tồn tại trong hợp đồng khác");
						errorList.add(errorDTO);
						isConstructionValid = false;
					}

					if(validateString(workItemName)) {

							try {
								workItemId = Long.parseLong(workItemMap.get(workItemName + "|" + constructionId));
//								Boolean isBelongToConstruction = false;
								data.setWorkItemId(workItemId);

							} catch(Exception e) {
								isWorkItemValid = false;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(2), colName.get(2)+ " không thuộc công trình");
								errorList.add(errorDTO);
							}


					} else isWorkItemValid = false;

					if(validateString(catTaskName)) {

							try {
								String catWorkItemTypeIdTemp = workItemMap2.get(workItemName + "|" + constructionId);
								catTaskId = Long.parseLong(catTaskMap.get(catTaskName + "|" + catWorkItemTypeIdTemp));
								data.setCatTaskId(catTaskId);
							} catch(Exception e) {
								isCatTaskValid = false;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(3), colName.get(3)+ " không thuộc hạng mục");
								errorList.add(errorDTO);
							}


					}else isCatTaskValid = false;

					//validate bộ khóa đã tồn tại chưa
					//Huypq-20190919-start
						if(isConstructionValid) {
//							String keyTemp = "" + constructionId.toString();
//
//							if(workItemId != null) keyTemp = keyTemp + "|" + workItemId.toString();
//							if(catTaskId != null) keyTemp = keyTemp + "|" + catTaskId.toString();
//							keyTemp = keyTemp + "|" + contractId.toString();
//
//							String isExist = cntConstrWorkItemTaskMap.get(keyTemp);
//							if(isExist != null) {
//								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(1), colName.get(1)+", "+colName.get(2)+", "
//							+colName.get(3)+ " đã cùng tồn tại");
//								errorList.add(errorDTO);
//							} else {
								obj.setConstructionId(constructionId);
								obj.setWorkItemId(workItemId);
								obj.setCatTaskId(catTaskId);
//							}
						}
					//Huy-end
						if(validateString(catUnitName)) {
							try {
								String catUnitCode = "1";
								if(catUnitName.toUpperCase().trim().equals("USD")) {
									catUnitCode = "2";
								}
								catUnitId = catUnitMap.get(catUnitCode);
								obj.setUnitPrice(catUnitId);
							} catch(Exception e) {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(5), colName.get(5)+ " không tồn tại");
								errorList.add(errorDTO);
							}
						}

				if(price.length()<=13) {
					try{
						obj.setPrice(Double.parseDouble(price));
					} catch(Exception e){
						isNumberOk = false;
						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4), colName.get(4)+ " không hợp lệ");
						errorList.add(errorDTO);
					}
				} else {
					ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4), colName.get(4)+ " có độ dài quá giới hạn");
					errorList.add(errorDTO);
				}

					if(description.trim().length() <= 2000)
						obj.setDescription(description.trim());
					else {
						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6), colName.get(6)+ " có độ dài quá giới hạn");
						errorList.add(errorDTO);
					}

					if(errorList.size() == 0){
						workLst.add(obj);
					}
				}
			}

			if(errorList.size() > 0){
				String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
				List<CntConstrWorkItemTaskDTO> emptyArray = Lists.newArrayList();
				workLst = emptyArray;
				CntConstrWorkItemTaskDTO errorContainer = new CntConstrWorkItemTaskDTO();
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
			} catch(Exception ex) {
				LOGGER.error(e.getMessage(), e);
				errorDTO = createError(0, "", ex.toString());
				errorList.add(errorDTO);
			}
			List<CntConstrWorkItemTaskDTO> emptyArray = Lists.newArrayList();
			workLst = emptyArray;
			CntConstrWorkItemTaskDTO errorContainer = new CntConstrWorkItemTaskDTO();
			errorContainer.setErrorList(errorList);
			errorContainer.setMessageColumn(7); // cột dùng để in ra lỗi
			errorContainer.setFilePathError(filePathError);
			workLst.add(errorContainer);
			return workLst;
		}
	}
    /**Hoangnh end 30012019**/

    //hienvd: Start 8/7/2019
	@Override
	public List<CntAppendixJobDTO> doSearchAppendixJob(CntAppendixJobDTO criteria) {
		return cntConstrWorkItemTaskDAO.doSearchAppendixJob(criteria);
	}
    //hienvd: End

    @Override
    public String exportExcelTemplate(String fileName) throws Exception {
        // TODO Auto-generated method stub
        String exportPath = UFile.getFilePath(folder2Upload, tempFileFolderUpload);

        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + fileName +".xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        file.close();

        File out = new File(exportPath + File.separatorChar +fileName +".xlsx");

        FileOutputStream outFile = new FileOutputStream(out);
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        String path = UEncrypt.encryptFileUploadPath(exportPath.replace(folder2Upload, "") + File.separatorChar +fileName +".xlsx");
        return path;
    }

    //hienvd: START 9/9/2019
/*
	public List<CntConstrWorkItemTaskDTO> importCntConstructionOSTypeHTCT(String fileInput, Long contractId, Long cntContractParentId, Long contractType) {
		List<CntConstrWorkItemTaskDTO> workLst = Lists.newArrayList();
		List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();
		String error = "";
		try {
			HashMap<String, String> constructionMap = new HashMap<String, String>();	//to get id
			HashMap<String, String> constructionMap2 = new HashMap<String, String>();	//to check cong trinh thuoc hop dong dau ra
			List<ConstructionDTO> constructionLst = constructionDAO.doSearch(new ConstructionDTO());
			for (ConstructionDTO construction : constructionLst) {
				if(construction.getCode() != null) {
					constructionMap.put(construction.getCode().toUpperCase().trim(), construction.getConstructionId().toString());
				}
			}
			HashMap<String, String> cntContractMap = new HashMap<String, String>();
			HashMap<String, String> cntContractMap2 = new HashMap<String, String>();
			CntContractDTO cntContractDTO = new CntContractDTO();
			cntContractDTO.setCheckOS("1");
			List<CntContractDTO> cntContractLst = cntContractDAO.doSearch(cntContractDTO);
			for (CntContractDTO cntContract : cntContractLst) {
				cntContractMap.put(cntContract.getCntContractId().toString(), cntContract.getContractType().toString());
				cntContractMap2.put(cntContract.getCntContractId().toString(), cntContract.getCode());
			}

			List<Long> constructionIdLst = new ArrayList<Long>();		//to get construction thuoc hop dong dau ra
			if(Long.parseLong(cntContractMap.get(contractId.toString())) == 1l) {
				List<ConstructionDTO> constructionLst2 = constructionDAO.checkForImport(new ConstructionDTO());
				for (ConstructionDTO construction : constructionLst2) {
					if(construction.getCntContractMapId() != null) {
						constructionMap2.put(construction.getConstructionId().toString(), construction.getCntContractMapId().toString());
						if(cntContractParentId.toString().equals(construction.getCntContractMapId().toString()))
							constructionIdLst.add(construction.getConstructionId());
					}
				}
			}

			HashMap<String, String> workItemMap = new HashMap<String, String>();	//to get workItemId
			HashMap<String, String> workItemMap2 = new HashMap<String, String>();	//to get catWorkItemTypeId
			HashMap<String, String> workItemMap3 = new HashMap<String, String>();	//to check if name exist
			List<WorkItemDTO> workItemLst = workItemDAO.doSearch(new WorkItemDTO());
			for (WorkItemDTO workItem : workItemLst) {
				if(workItem.getConstructionId() != null) {
					workItemMap.put(workItem.getName() + "|" + workItem.getConstructionId(), workItem.getWorkItemId().toString());
				}
				if(workItem.getConstructionId() != null && workItem.getCatWorkItemTypeId() != null) {
					workItemMap2.put(workItem.getName() + "|" + workItem.getConstructionId(), workItem.getCatWorkItemTypeId().toString());
				}
			}

			HashMap<String, String> catTaskMap = new HashMap<String, String>();		//to get catTaskId
			HashMap<String, String> catTaskMap2 = new HashMap<String, String>();	//to check if name exist
			List<CatTaskDTO> catTaskLst = catTaskDAO.doSearch(new CatTaskDTO());
			for (CatTaskDTO catTask : catTaskLst) {
				if(catTask.getCatWorkItemTypeId() != null) {
					catTaskMap.put(catTask.getName().toUpperCase().trim() + "|" + catTask.getCatWorkItemTypeId(), catTask.getCatTaskId().toString());
				}
			}
			HashMap<String, Double> catUnitMap = new HashMap<String, Double>();		//money type: usd or vnd
			AppParamDTO appParamSearch = new AppParamDTO();
			appParamSearch.setParType("MONEY_TYPE");
			List<AppParamDTO> catUnitLst = appParamDAO.doSearch(appParamSearch);
			for (AppParamDTO catUnit : catUnitLst) {
				if(catUnit.getCode() != null && catUnit.getAppParamId() != null)
					catUnitMap.put(catUnit.getCode().toUpperCase().trim(), Double.parseDouble(catUnit.getAppParamId().toString()));
			}

			HashMap<String, String> cntConstrWorkItemTaskMap = new HashMap<String, String>();
			List<CntConstrWorkItemTaskDTO> cntConstrWorkItemTaskLst = cntConstrWorkItemTaskDAO.doSearch(new CntConstrWorkItemTaskDTO());
			for (CntConstrWorkItemTaskDTO cntConstrWorkItemTask : cntConstrWorkItemTaskLst) {
				String constructionIdTemp = cntConstrWorkItemTask.getConstructionId().toString();
				String workItemIdTemp = null;
				String catTaskIdTemp = null;
				String cntContractIdTemp = null;
				if(cntConstrWorkItemTask.getWorkItemId() != null)
					workItemIdTemp = cntConstrWorkItemTask.getWorkItemId().toString();
				if(cntConstrWorkItemTask.getCatTaskId() != null)
					catTaskIdTemp = cntConstrWorkItemTask.getCatTaskId().toString();
				if(cntConstrWorkItemTask.getCntContractId() != null)
					cntContractIdTemp = cntConstrWorkItemTask.getCntContractId().toString();
				String keyTemp = constructionIdTemp;
				if(workItemIdTemp != null) keyTemp = keyTemp + "|" + workItemIdTemp;
				if(catTaskIdTemp != null) keyTemp = keyTemp + "|" + catTaskIdTemp;
				if(cntContractIdTemp != null) keyTemp = keyTemp + "|" + cntContractIdTemp;
				cntConstrWorkItemTaskMap.put(keyTemp, cntConstrWorkItemTask.getCntContractId().toString());
			}

			HashMap<String, String> checkConstructionMap = null;
			if(contractType == 0l) {
				checkConstructionMap = new HashMap<String, String>();
				List<CntConstrWorkItemTaskDTO> checkConstructionLst = cntConstrWorkItemTaskDAO.checkConstructionIdForImport(new CntConstrWorkItemTaskDTO());
				for (CntConstrWorkItemTaskDTO checkObj : checkConstructionLst) {
					if(checkObj.getCntContractId() != null) {
						checkConstructionMap.put(checkObj.getConstructionId().toString(), checkObj.getCntContractId().toString());
					}
				}
			}



			File f = new File(fileInput);
			XSSFWorkbook workbook = new XSSFWorkbook(f);
			XSSFSheet sheet = workbook.getSheetAt(0);
			DataFormatter formatter = new DataFormatter();
			int count = 0;

			for (Row row : sheet) {
				count++;
				if(count >= 3 && checkIfRowIsEmpty(row)) continue;
				CntConstrWorkItemTaskDTO obj = new CntConstrWorkItemTaskDTO();
				if (count >= 3) {
					String constructionName = formatter.formatCellValue(row.getCell(1)).toUpperCase().trim();
					String workItemName = formatter.formatCellValue(row.getCell(2)).toUpperCase().trim();
					String catTaskName = formatter.formatCellValue(row.getCell(3)).toUpperCase().trim();
					String catUnitName = formatter.formatCellValue(row.getCell(5)).toUpperCase().trim();
					String stationHTCT = formatter.formatCellValue(row.getCell(7)).toUpperCase().trim();

					Long constructionId = null;
					Long workItemId = null;
					Long catTaskId = null;
					Double catUnitId = null;
					String price = formatter.formatCellValue(row.getCell(4));
					String description = formatter.formatCellValue(row.getCell(6));
					validateRequiredCellTypeHTCT(row, errorList); // kiểm tra các ô bắt buộc nhập đã dc nhập chưa

					Boolean isConstructionValid = true;
					Boolean isWorkItemValid = true;
					Boolean isCatTaskValid = true;
					Boolean isNumberOk = true;
					CntConstrWorkItemTaskDTO data = new CntConstrWorkItemTaskDTO();
					try {
						constructionId = Long.parseLong(constructionMap.get(constructionName));
						if(Long.parseLong(cntContractMap.get(contractId.toString())) == 1l) {
							Boolean isExistInCntContractOut = false;
							for (Long id : constructionIdLst) {
								if(id.toString().equals(constructionId.toString()))
									isExistInCntContractOut = true;
							}

							if(!isExistInCntContractOut) {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(1), colName.get(1)+ " không tồn tại trong hợp đồng đầu ra");
								errorList.add(errorDTO);
								isConstructionValid = false;
							}
						}

						if(contractType == 0l) {
							if(checkConstructionMap.get(constructionId.toString()) != null) {
								if(!checkConstructionMap.get(constructionId.toString()).toString().equals(contractId.toString())) {
									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(1), colName.get(1)+ " đã thuộc hợp đồng đầu ra khác [Code:"+cntContractMap2.get(checkConstructionMap.get(constructionId.toString()).toString())+"]");
									errorList.add(errorDTO);
									isConstructionValid = false;
								}
							}
						}

						data.setConstructionId(constructionId);
					} catch(Exception e) {
						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(1), colName.get(1)+ " không tồn tại");
						errorList.add(errorDTO);
						isConstructionValid = false;
					}

					//hienvd: START 9/9/2019
					if(stationHTCT.toString().replaceAll("\\s+","").equals("")) {
						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(7), colName.get(7) + " không được bỏ trống");
						errorList.add(errorDTO);
					}else {
						obj.setStationHTCT(stationHTCT);
					}
					//hienvd: END 9/9/2019

					if(validateString(workItemName)) {
						try {
							workItemId = Long.parseLong(workItemMap.get(workItemName + "|" + constructionId));
							data.setWorkItemId(workItemId);
						} catch(Exception e) {
							isWorkItemValid = false;
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(2), colName.get(2)+ " không thuộc công trình");
							errorList.add(errorDTO);
						}

					} else isWorkItemValid = false;
					if(validateString(catTaskName)) {
						try {
							String catWorkItemTypeIdTemp = workItemMap2.get(workItemName + "|" + constructionId);
							catTaskId = Long.parseLong(catTaskMap.get(catTaskName + "|" + catWorkItemTypeIdTemp));
							data.setCatTaskId(catTaskId);
						} catch(Exception e) {
							isCatTaskValid = false;
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(3), colName.get(3)+ " không thuộc hạng mục");
							errorList.add(errorDTO);
						}
					}else isCatTaskValid = false;
					if(isConstructionValid) {
						String keyTemp = "" + constructionId.toString();
						if(workItemId != null) keyTemp = keyTemp + "|" + workItemId.toString();
						if(catTaskId != null) keyTemp = keyTemp + "|" + catTaskId.toString();
						keyTemp = keyTemp + "|" + contractId.toString();
						String isExist = cntConstrWorkItemTaskMap.get(keyTemp);
						if(isExist != null) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(1), colName.get(1)+", "+colName.get(2)+", "
									+colName.get(3)+ " đã cùng tồn tại");
							errorList.add(errorDTO);
						} else {
							obj.setConstructionId(constructionId);
							obj.setWorkItemId(workItemId);
							obj.setCatTaskId(catTaskId);
						}
					}

					if(validateString(catUnitName)) {
						try {
							String catUnitCode = "1";
							if(catUnitName.toUpperCase().trim().equals("USD")) {
								catUnitCode = "2";
							}
							catUnitId = catUnitMap.get(catUnitCode);
							obj.setUnitPrice(catUnitId);
						} catch(Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(5), colName.get(5)+ " không tồn tại");
							errorList.add(errorDTO);
						}
					}
					if(price.length()<=13) {
						try{
							obj.setPrice(Double.parseDouble(price));
						} catch(Exception e){
							isNumberOk = false;
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4), colName.get(4)+ " không hợp lệ");
							errorList.add(errorDTO);
						}
					} else {
						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4), colName.get(4)+ " có độ dài quá giới hạn");
						errorList.add(errorDTO);
					}
					if(description.trim().length() <= 2000)
						obj.setDescription(description.trim());
					else {
						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6), colName.get(6)+ " có độ dài quá giới hạn");
						errorList.add(errorDTO);
					}



					if(errorList.size() == 0){
						workLst.add(obj);
					}
				}
			}
			if(errorList.size() > 0){
				String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
				List<CntConstrWorkItemTaskDTO> emptyArray = Lists.newArrayList();
				workLst = emptyArray;
				CntConstrWorkItemTaskDTO errorContainer = new CntConstrWorkItemTaskDTO();
				errorContainer.setErrorList(errorList);
				errorContainer.setMessageColumn(8); // cột dùng để in ra lỗi
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
			} catch(Exception ex) {
				LOGGER.error(e.getMessage(), e);
				errorDTO = createError(0, "", ex.toString());
				errorList.add(errorDTO);
			}
			List<CntConstrWorkItemTaskDTO> emptyArray = Lists.newArrayList();
			workLst = emptyArray;
			CntConstrWorkItemTaskDTO errorContainer = new CntConstrWorkItemTaskDTO();
			errorContainer.setErrorList(errorList);
			errorContainer.setMessageColumn(8); // cột dùng để in ra lỗi
			errorContainer.setFilePathError(filePathError);
			workLst.add(errorContainer);
			return workLst;
		}
	}
*/

    //HuyPQ-20190919-start
/*	public List<CntConstrWorkItemTaskDTO> importCntConstructionHTCT(String fileInput, Long contractId, Long cntContractParentId, Long contractType, Long typeHTCT) {



		List<CntConstrWorkItemTaskDTO> workLst = Lists.newArrayList();
		List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();
		String error = "";
		try {
			HashMap<String, String> constructionMap = new HashMap<String, String>();	//to get id
			List<ConstructionDTO> constructionLst = constructionDAO.getDataConstructionImport();
			for (ConstructionDTO construction : constructionLst) {
				if(construction.getCode() != null) {
					constructionMap.put(construction.getCode().toUpperCase().trim(), construction.getConstructionId().toString());
				}
			}
			HashMap<String, String> cntContractMap = new HashMap<String, String>();
			HashMap<String, String> cntContractMap2 = new HashMap<String, String>();
			List<Long> constructionIdLst = new ArrayList<Long>();
			if(contractType == 8l) {
				List<CntContractDTO> cntContractLst = constructionDAO.getDataContractImportHTCT(new CntContractDTO());
				for (CntContractDTO cntContract : cntContractLst) {
					cntContractMap.put(cntContract.getCntContractId().toString(), cntContract.getContractType().toString());
				}
				if(Long.parseLong(cntContractMap.get(contractId.toString())) == 8l) {
					List<ConstructionDTO> constructionLst2 = constructionDAO.checkForImportHTCT(new ConstructionDTO());
					for (ConstructionDTO construction : constructionLst2) {
						if(construction.getCntContractMapId() != null) {
							if(cntContractParentId.toString().equals(construction.getCntContractMapId()))
								constructionIdLst.add(construction.getConstructionId());
						}
					}
				}
			}

			HashMap<String, String> workItemMap = new HashMap<String, String>();	//to get workItemId
			HashMap<String, String> workItemMap2 = new HashMap<String, String>();	//to get catWorkItemTypeId
			HashMap<String, String> workItemMap3 = new HashMap<String, String>();	//to check if name exist
			List<WorkItemDTO> workItemLst = constructionDAO.getDataWorkItem();
			for (WorkItemDTO workItem : workItemLst) {
				if(workItem.getConstructionId() != null) {
					workItemMap.put(workItem.getName() + "|" + workItem.getConstructionId(), workItem.getWorkItemId().toString());
				}
				if(workItem.getConstructionId() != null && workItem.getCatWorkItemTypeId() != null) {
					workItemMap2.put(workItem.getName() + "|" + workItem.getConstructionId(), workItem.getCatWorkItemTypeId().toString());
				}

			}

			HashMap<String, String> catTaskMap = new HashMap<String, String>();		//to get catTaskId
			HashMap<String, String> catTaskMap2 = new HashMap<String, String>();	//to check if name exist
			List<CatTaskDTO> catTaskLst = constructionDAO.getDataCatTask();
			for (CatTaskDTO catTask : catTaskLst) {
				if(catTask.getCatWorkItemTypeId() != null) {
					catTaskMap.put(catTask.getName().toUpperCase().trim() + "|" + catTask.getCatWorkItemTypeId(), catTask.getCatTaskId().toString());
				}
			}

			HashMap<String, Double> catUnitMap = new HashMap<String, Double>();		//money type: usd or vnd
			AppParamDTO appParamSearch = new AppParamDTO();
			appParamSearch.setParType("MONEY_TYPE");
			List<AppParamDTO> catUnitLst = appParamDAO.doSearch(appParamSearch);
			for (AppParamDTO catUnit : catUnitLst) {
				if(catUnit.getCode() != null && catUnit.getAppParamId() != null)
				catUnitMap.put(catUnit.getCode().toUpperCase().trim(), Double.parseDouble(catUnit.getAppParamId().toString()));
			}

			File f = new File(fileInput);
			XSSFWorkbook workbook = new XSSFWorkbook(f);
			XSSFSheet sheet = workbook.getSheetAt(0);

			DataFormatter formatter = new DataFormatter();
			int count = 0;

			for (Row row : sheet) {
				count++;
				if(count >= 3 && checkIfRowIsEmpty(row)) continue;
				CntConstrWorkItemTaskDTO obj = new CntConstrWorkItemTaskDTO();
				if (count >= 3) {
					String stationHTCT = null;
					String constructionName = formatter.formatCellValue(row.getCell(1)).toUpperCase().trim();
					String workItemName = formatter.formatCellValue(row.getCell(2)).toUpperCase().trim();
					String catTaskName = formatter.formatCellValue(row.getCell(3)).toUpperCase().trim();
					String catUnitName = formatter.formatCellValue(row.getCell(5)).toUpperCase().trim();
					if(typeHTCT!=0l) {  //check import hạ tầng cho thuê
						stationHTCT = formatter.formatCellValue(row.getCell(7)).toUpperCase().trim();
					}
					Long constructionId = null;
					Long workItemId = null;
					Long catTaskId = null;
					Double catUnitId = null;
					String price = formatter.formatCellValue(row.getCell(4));
					String description = formatter.formatCellValue(row.getCell(6));
					validateRequiredCell(row, errorList); // kiểm tra các ô bắt buộc nhập đã dc nhập chưa
					Boolean isConstructionValid = true;
					Boolean isWorkItemValid = true;
					Boolean isCatTaskValid = true;
					Boolean isNumberOk = true;

					CntConstrWorkItemTaskDTO data = new CntConstrWorkItemTaskDTO();

					try {
						constructionId = Long.parseLong(constructionMap.get(constructionName));
						//validate nam trong hop dong dau ra
						if(contractType == 1l) {
							if(Long.parseLong(cntContractMap.get(contractId.toString())) == 1l) {
								Boolean isExistInCntContractOut = false;
								for (Long id : constructionIdLst) {
									if(id.toString().equals(constructionId.toString()))
										isExistInCntContractOut = true;
								}

								if(!isExistInCntContractOut) {
									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(1), colName.get(1)+ " không tồn tại trong hợp đồng đầu ra");
									errorList.add(errorDTO);
									isConstructionValid = false;
								}
							}
						}

						data.setConstructionId(constructionId);
					} catch(Exception e) {
						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(1), colName.get(1)+ " không tồn tại hoặc đã tồn tại trong hợp đồng khác");
						errorList.add(errorDTO);
						isConstructionValid = false;
					}
					if(typeHTCT!=0l) {
						if(stationHTCT.toString().replaceAll("\\s+","").equals("")) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(7), colName.get(7) + " không được bỏ trống");
							errorList.add(errorDTO);
						}else {
							obj.setStationHTCT(stationHTCT);
						}
					}
					if(validateString(workItemName)) {

							try {
								workItemId = Long.parseLong(workItemMap.get(workItemName + "|" + constructionId));
								data.setWorkItemId(workItemId);

							} catch(Exception e) {
								isWorkItemValid = false;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(2), colName.get(2)+ " không thuộc công trình");
								errorList.add(errorDTO);
							}


					} else isWorkItemValid = false;

					if(validateString(catTaskName)) {

							try {
								String catWorkItemTypeIdTemp = workItemMap2.get(workItemName + "|" + constructionId);
								catTaskId = Long.parseLong(catTaskMap.get(catTaskName + "|" + catWorkItemTypeIdTemp));
								data.setCatTaskId(catTaskId);
							} catch(Exception e) {
								isCatTaskValid = false;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(3), colName.get(3)+ " không thuộc hạng mục");
								errorList.add(errorDTO);
							}


					}else isCatTaskValid = false;

					//validate bộ khóa đã tồn tại chưa
						if(isConstructionValid) {
								obj.setConstructionId(constructionId);
								obj.setWorkItemId(workItemId);
								obj.setCatTaskId(catTaskId);
						}

						if(validateString(catUnitName)) {
							try {
								String catUnitCode = "1";
								if(catUnitName.toUpperCase().trim().equals("USD")) {
									catUnitCode = "2";
								}
								catUnitId = catUnitMap.get(catUnitCode);
								obj.setUnitPrice(catUnitId);
							} catch(Exception e) {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(5), colName.get(5)+ " không tồn tại");
								errorList.add(errorDTO);
							}
						}

				if(price.length()<=13) {
					try{
						obj.setPrice(Double.parseDouble(price));
					} catch(Exception e){
						isNumberOk = false;
						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4), colName.get(4)+ " không hợp lệ");
						errorList.add(errorDTO);
					}
				} else {
					ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4), colName.get(4)+ " có độ dài quá giới hạn");
					errorList.add(errorDTO);
				}

					if(description.trim().length() <= 2000)
						obj.setDescription(description.trim());
					else {
						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6), colName.get(6)+ " có độ dài quá giới hạn");
						errorList.add(errorDTO);
					}

					if(errorList.size() == 0){
						workLst.add(obj);
					}
				}
			}

			if(errorList.size() > 0){
				String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
				List<CntConstrWorkItemTaskDTO> emptyArray = Lists.newArrayList();
				workLst = emptyArray;
				CntConstrWorkItemTaskDTO errorContainer = new CntConstrWorkItemTaskDTO();
				errorContainer.setErrorList(errorList);
				errorContainer.setMessageColumn(8);
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
			} catch(Exception ex) {
				LOGGER.error(e.getMessage(), e);
				errorDTO = createError(0, "", ex.toString());
				errorList.add(errorDTO);
			}
			List<CntConstrWorkItemTaskDTO> emptyArray = Lists.newArrayList();
			workLst = emptyArray;
			CntConstrWorkItemTaskDTO errorContainer = new CntConstrWorkItemTaskDTO();
			errorContainer.setErrorList(errorList);
			if(typeHTCT!=0l) {
				errorContainer.setMessageColumn(8);
			} else {
				errorContainer.setMessageColumn(7); // cột dùng để in ra lỗi
			}
			errorContainer.setFilePathError(filePathError);
			workLst.add(errorContainer);
			return workLst;
		}
	}*/
    //Huy-end

    //Huypq-20190919-start
	/*public DataListDTO doSearchReportHTCT(CntConstrWorkItemTaskDTO obj) {
		List<CntConstrWorkItemTaskDTO> ls = cntConstrWorkItemTaskDAO.doSearchReportHTCT(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getTotalRecord());
		data.setStart(1);
		return data;
	}*/

/*
	public CntConstrWorkItemTaskDTO getIdForCntContractOutHTCT(CntConstrWorkItemTaskDTO criteria) {
		return cntConstrWorkItemTaskDAO.getIdForCntContractOutHTCT(criteria);
	}
*/
    //huy-end
}
