package com.viettel.aio.business;

import com.viettel.aio.bo.WorkItemQuotaBO;
import com.viettel.aio.dao.WorkItemQuotaDAO;
import com.viettel.aio.dto.WorkItemQuotaDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


@Service("workItemQuotaBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class WorkItemQuotaBusinessImpl extends BaseFWBusinessImpl<WorkItemQuotaDAO, WorkItemQuotaDTO, WorkItemQuotaBO> implements WorkItemQuotaBusiness {

    static Logger LOGGER = LoggerFactory
            .getLogger(WorkItemQuotaBusinessImpl.class);

    @Autowired
    private WorkItemQuotaDAO workItemQuotaDAO;

/*	@Autowired
	private CatConstructionTypeDAO catConstructionTypeDAO;

	@Autowired
	private SysGroupDAO sysGroupDAO;

	@Autowired
	private CatWorkItemTypeDAO catWorkItemTypeDAO;*/

    int[] validateCol = {1, 2, 3, 4, 5};
    int[] validateColMoney = {1, 2, 3, 4};


    HashMap<Integer, String> colName = new HashMap();

    {
        colName.put(1, "Mã đơn vị");
        colName.put(2, "Mã loại công trình");
        colName.put(3, "Mã hạng mục");
        colName.put(4, "Đơn giá đồng bằng");
        colName.put(5, "Ngày công đồng bằng");
        colName.put(6, "Đơn giá hải đảo");
        colName.put(7, "Ngày công hải đảo");
        colName.put(8, "Đơn giá miền núi");
        colName.put(9, "Ngày công miền núi");
        colName.put(10, "Ghi chú");
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

    public WorkItemQuotaBusinessImpl() {
        tModel = new WorkItemQuotaBO();
        tDAO = workItemQuotaDAO;
    }

    @Override
    public WorkItemQuotaDAO gettDAO() {
        return workItemQuotaDAO;
    }


/*	public WorkItemQuotaDTO findByUniqueKey(WorkItemQuotaDTO obj) {
		return workItemQuotaDAO.findByUniqueKey(obj);
	}

	public WorkItemQuotaDTO findByUniqueKeyForMoney(WorkItemQuotaDTO obj) {
		return workItemQuotaDAO.findByUniqueKeyForMoney(obj);
	}*/

    @Override
    public List<WorkItemQuotaDTO> doSearch(WorkItemQuotaDTO obj) {
        if (obj.getQuotaType() == 1l) {
            List<WorkItemQuotaDTO> objLst = workItemQuotaDAO.doSearch(obj);
            WorkItemQuotaDTO aggObj = null;    //gop 3 ban ghi vao mot DTO
            List<Long> workItemQuotaIdLst = new ArrayList<Long>();
            List<WorkItemQuotaDTO> aggObjLst = new ArrayList<WorkItemQuotaDTO>();
            for (WorkItemQuotaDTO data : objLst) {
                workItemQuotaIdLst.add(data.getWorkItemQuotaId());
                if (data.getType() == 3l) {
                    aggObj = new WorkItemQuotaDTO();
                    aggObj = data;
                    aggObj.setPrice3(data.getPrice());
                    aggObj.setWorkDay3(data.getWorkDay());
                }
                if (data.getType() == 2l) {
                    aggObj.setPrice2(data.getPrice());
                    aggObj.setWorkDay2(data.getWorkDay());
                }
                if (data.getType() == 1l) {
                    aggObj.setPrice1(data.getPrice());
                    aggObj.setWorkDay1(data.getWorkDay());
                    aggObj.setWorkItemQuotaIdLst(workItemQuotaIdLst);
                    workItemQuotaIdLst = new ArrayList<Long>();
                    aggObjLst.add(aggObj);
                }
            }
            return aggObjLst;
        } else {
            return workItemQuotaDAO.doSearch(obj);
        }
    }

	/*public List<WorkItemQuotaDTO> doSearchForCheckExist(WorkItemQuotaDTO obj) {
		return workItemQuotaDAO.doSearch(obj);
	}

	public List<WorkItemQuotaDTO> doSearchForDelete(WorkItemQuotaDTO obj) {
		return workItemQuotaDAO.doSearchForDelete(obj);
	}

	public WorkItemQuotaDTO findByUniqueKeyForEdit(WorkItemQuotaDTO obj) {
		List<WorkItemQuotaDTO> objLst = workItemQuotaDAO.findByUniqueKeyForEdit(obj);
		WorkItemQuotaDTO workItemQuotaDTO = objLst.get(objLst.size()-1);
		List<Long> workItemQuotaIdLst = new ArrayList<Long>();
		for (WorkItemQuotaDTO data : objLst) {
			workItemQuotaIdLst.add(data.getWorkItemQuotaId());
			if(data.getType() == 1l) {
				workItemQuotaDTO.setPrice1(data.getPrice());
				workItemQuotaDTO.setWorkDay1(data.getWorkDay());
			}
			if(data.getType() == 2l) {
				workItemQuotaDTO.setPrice2(data.getPrice());
				workItemQuotaDTO.setWorkDay2(data.getWorkDay());
			}
			if(data.getType() == 3l) {
				workItemQuotaDTO.setPrice3(data.getPrice());
				workItemQuotaDTO.setWorkDay3(data.getWorkDay());
			}
		}
		workItemQuotaDTO.setWorkItemQuotaIdLst(workItemQuotaIdLst);
		return workItemQuotaDTO;
	}	

	@Override
	public List<WorkItemQuotaDTO> getForAutoComplete(WorkItemQuotaDTO query) {
		return workItemQuotaDAO.getForAutoComplete(query);
	}

	public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
		return workItemQuotaDAO.delete(ids, tableName, tablePrimaryKey);	
	}


	public WorkItemQuotaDTO getById(Long id) {
		return workItemQuotaDAO.getById(id);
	}




	@Override
	public List<WorkItemQuotaDTO> importWorkItemQuota(String fileInput, Long quotaType) throws Exception{

		List<WorkItemQuotaDTO> workLst = Lists.newArrayList();
		List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();

		try {
			
			HashMap<String, String> sysGroupMap = new HashMap<String, String>();
			HashMap<String, String> catConstructionTypeMap = new HashMap<String, String>();
			HashMap<String, String> catWorkItemTypeMap = new HashMap<String, String>();
			HashMap<String, String> catWorkItemTypeConstrMap = new HashMap<String, String>();
			HashMap<String, String> workItemQuotaMap = new HashMap<String, String>();

			List<SysGroupDTO> sysGroupLst = sysGroupDAO.doSearch(new SysGroupDTO());
			List<CatConstructionTypeDTO> catConstructionTypeLst = catConstructionTypeDAO.doSearch(new CatConstructionTypeDTO());
			List<CatWorkItemTypeDTO> catWorkItemTypeLst = catWorkItemTypeDAO.doSearch(new CatWorkItemTypeDTO());

			WorkItemQuotaDTO searchWorkItemQuotaObj = new WorkItemQuotaDTO();
			searchWorkItemQuotaObj.setStatus(1l);
			searchWorkItemQuotaObj.setQuotaType(1l);
			List<WorkItemQuotaDTO> workItemQuotaLst = doSearchForCheckExist(searchWorkItemQuotaObj);
			for (WorkItemQuotaDTO workItemQuotaDTO : workItemQuotaLst) {
				workItemQuotaMap.put(workItemQuotaDTO.getSysGroupId().toString() + "|"
						+ workItemQuotaDTO.getCatConstructionTypeId().toString() + "|"
						+ workItemQuotaDTO.getCatWorkItemTypeId().toString() + "|"
						+ workItemQuotaDTO.getType().toString(),
						workItemQuotaDTO.getWorkItemQuotaId().toString());
			}


			for (SysGroupDTO sysGroupDTO : sysGroupLst) {
				sysGroupMap.put(sysGroupDTO.getCode(), sysGroupDTO.getSysGroupId().toString());
			}

			for (CatConstructionTypeDTO catConstructionTypeDTO : catConstructionTypeLst) {
				catConstructionTypeMap.put(catConstructionTypeDTO.getCode(), catConstructionTypeDTO.getCatConstructionTypeId().toString());
			}

			for(CatWorkItemTypeDTO catWorkItemTypeDTO : catWorkItemTypeLst) {
				catWorkItemTypeMap.put(catWorkItemTypeDTO.getCode(), catWorkItemTypeDTO.getCatWorkItemTypeId().toString());
				catWorkItemTypeConstrMap.put(catWorkItemTypeDTO.getCatWorkItemTypeId().toString(), catWorkItemTypeDTO.getCatConstructionTypeId().toString());
			}
			
			File f = new File(fileInput);
			XSSFWorkbook workbook = new XSSFWorkbook(f);
			XSSFSheet sheet = workbook.getSheetAt(0);

			DataFormatter formatter = new DataFormatter();
			int count = 0;

			for (Row row : sheet) {
				count++;
				if(count >= 4 && checkIfRowIsEmpty(row)) continue;
				//				boolean isValid = true;
				WorkItemQuotaDTO obj = new WorkItemQuotaDTO();
				if (count >= 4) {
//					if(quotaType ==1l) {
						if(!validateRequiredCell(row, errorList)) continue;
//					}
					// kiểm tra các ô bắt buộc nhập đã dc nhập chưa
//					else {
//						if(!validateRequiredCellMoney(row, errorList)) continue;
//					}

					String sysGroupCode = formatter.formatCellValue(row.getCell(1));
					String catConstructionTypeCode = formatter.formatCellValue(row.getCell(2));
					String catWorkItemTypeCode = formatter.formatCellValue(row.getCell(3));

					Boolean isSysGroupValid = false;
					Boolean isCatConstructionTypeValid = false;
					Boolean isCatWorkItemTypeValid = false;

					String description;
					String workDay;
					List<Double> priceLst = new ArrayList<Double>();
					List<Double> workDayLst = new ArrayList<Double>();

					Long sysGroupId = -1l;
					Long catConstructionTypeId = -1l;
					Long catWorkItemTypeId = -1l;
					WorkItemQuotaDTO data = new WorkItemQuotaDTO();
					//check sysGroup
					if(validateString(sysGroupCode)) {
						try {
							sysGroupId = Long.parseLong(sysGroupMap.get(sysGroupCode));	
							data.setSysGroupId(sysGroupId);
							isSysGroupValid = true;
						} catch(Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(1), colName.get(1)+ " không tồn tại");
							errorList.add(errorDTO);
						}
					}

					if(validateString(catConstructionTypeCode)) {
						try {
							catConstructionTypeId = Long.parseLong(catConstructionTypeMap.get(catConstructionTypeCode));
							data.setCatConstructionTypeId(catConstructionTypeId);
							isCatConstructionTypeValid = true;
						} catch(Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(2), colName.get(2)+ " không tồn tại");
							errorList.add(errorDTO);
						}
					}

					if(validateString(catWorkItemTypeCode)) {
						try {

							catWorkItemTypeId = Long.parseLong(catWorkItemTypeMap.get(catWorkItemTypeCode).toString());

							//validate hang muc thuoc cong trinh
							if(isCatConstructionTypeValid) {
								Boolean isBelongToConstruction = false;
								//								CatWorkItemTypeDTO catWorkItemTypeDTO = new CatWorkItemTypeDTO();
								//								catWorkItemTypeDTO.setCatConstructionTypeId(catConstructionTypeId);
								//								for (CatWorkItemTypeDTO catWorkItemType : catWorkItemTypeDAO.doSearch(catWorkItemTypeDTO)) {
								//									if(catWorkItemTypeId.toString().equals(catWorkItemType.getCatWorkItemTypeId().toString())) 
								//										isBelongToConstruction = true;
								//								}
								if(catConstructionTypeId.toString().equals(catWorkItemTypeConstrMap.get(catWorkItemTypeId.toString()))) {
									isBelongToConstruction = true;
								}
								if(!isBelongToConstruction) {
									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(3), colName.get(3)+ " không thuộc loại công trình");
									errorList.add(errorDTO);

								}else {
									data.setCatWorkItemTypeId(catWorkItemTypeId);
									isCatWorkItemTypeValid = true;
								}
							}

						} catch(Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3), colName.get(3)+ " không tồn tại");
							errorList.add(errorDTO);
						}
					}


					//validate bộ khóa đã tồn tại chưa
					if(isSysGroupValid && isCatConstructionTypeValid && isCatWorkItemTypeValid) {
						String existing = null;
						String checkExist;
						for (Long t = 1l; t <= 3l; t++) {
							checkExist = sysGroupId.toString() + "|" + catConstructionTypeId.toString() + "|"
									+ catWorkItemTypeId.toString() + "|" + t.toString();
							existing = workItemQuotaMap.get(checkExist);
						}

						if(existing != null) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(1), colName.get(1)+", "+colName.get(2)+", "
									+colName.get(3)+ " đã cùng tồn tại");
							errorList.add(errorDTO);
							continue;
						} else {
							obj.setSysGroupId(sysGroupId);
							obj.setCatConstructionTypeId(catConstructionTypeId);
							obj.setCatWorkItemTypeId(catWorkItemTypeId);
						}
					}

					//validate giá trị số
					String price = formatter.formatCellValue(row.getCell(4));
					if(validateString(price)) {
						if(price.length()<=15) {
							try{
								obj.setPrice(Double.parseDouble(price));
								priceLst.add(Double.parseDouble(price));
							} catch(Exception e){
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4), colName.get(4)+ " không hợp lệ");
								errorList.add(errorDTO);
							}
						}else {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4), colName.get(4)+ " có độ dài quá giới hạn");
							errorList.add(errorDTO);
						}
					}

//					if (quotaType == 1l) {
						workDay = formatter.formatCellValue(row.getCell(5));
						if(validateString(workDay)) {
							if(workDay.length() <= 13) {
								try {
									workDayLst.add(Double.parseDouble(workDay));
								} catch(Exception e) {
									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5), colName.get(5)+ " không hợp lệ");
									errorList.add(errorDTO);
								}
							} else {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5), colName.get(5)+ " có độ dài quá giới hạn");
								errorList.add(errorDTO);
							}
						}

						price = formatter.formatCellValue(row.getCell(6));
						if(validateString(price)) {
							if(price.length()<=15) {
								try{
									priceLst.add(Double.parseDouble(price));
								} catch(Exception e){
									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6), colName.get(6)+ " không hợp lệ");
									errorList.add(errorDTO);
								}
							}else {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6), colName.get(6)+ " có độ dài quá giới hạn");
								errorList.add(errorDTO);
							}
						}

						workDay = formatter.formatCellValue(row.getCell(7));
						if(validateString(workDay)) {
							if(workDay.length() <= 13) {
								try {

									workDayLst.add(Double.parseDouble(workDay));
								} catch(Exception e) {
									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(7), colName.get(7)+ " không hợp lệ");
									errorList.add(errorDTO);
								}
							} else {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(7), colName.get(7)+ " có độ dài quá giới hạn");
								errorList.add(errorDTO);
							}
						}

						price = formatter.formatCellValue(row.getCell(8));
						if(validateString(price)) {
							if(price.length()<=15) {
								try{
									priceLst.add(Double.parseDouble(price));
								} catch(Exception e){
									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(8), colName.get(8)+ " không hợp lệ");
									errorList.add(errorDTO);
								}
							}else {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(8), colName.get(8)+ " có độ dài quá giới hạn");
								errorList.add(errorDTO);
							}
						}

						workDay = formatter.formatCellValue(row.getCell(9));
						if(validateString(workDay)) {
							if(workDay.length() <= 13) {
								try {

									workDayLst.add(Double.parseDouble(workDay));
								} catch(Exception e) {
									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(9), colName.get(9)+ " không hợp lệ");
									errorList.add(errorDTO);
								}
							} else {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(9), colName.get(9)+ " có độ dài quá giới hạn");
								errorList.add(errorDTO);
							}
						}

						description = formatter.formatCellValue(row.getCell(10));
						if(priceLst.size() != 3) {
							priceLst.add(0.);
							priceLst.add(0.);
							workDayLst.add(0.);
							workDayLst.add(0.);
						}


						obj.setPriceLst(priceLst);
						obj.setWorkDayLst(workDayLst);
//					}
//					else
//						description = formatter.formatCellValue(row.getCell(5));

					if (validateString(description))
						if(description.trim().length() <= 2000)
							obj.setDescription(description.trim());
						else {
							ExcelErrorDTO errorDTO;
//							if(quotaType == 1l) {
								errorDTO = createError(row.getRowNum() + 1, colAlias.get(10), colName.get(10)+  " có độ dài quá giới hạn");
//							}
//							else {
//								errorDTO = createError(row.getRowNum() + 1, colAlias.get(5), colName.get(5)+ " có độ dài quá giới hạn");
//							}
							errorList.add(errorDTO);
						}


					//					if (quotaType == 2l && validateString(formatter.formatCellValue(row.getCell(6)))) {
					//						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(1), "Sai biểu mẫu");
					//						errorList.add(errorDTO);
					//					}

					if(errorList.size() == 0){
						workLst.add(obj);
					}
				}
			}


			if(errorList.size() > 0){
				String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
				List<WorkItemQuotaDTO> emptyArray = Lists.newArrayList();
				workLst = emptyArray;
				WorkItemQuotaDTO errorContainer = new WorkItemQuotaDTO();
				errorContainer.setErrorList(errorList);
//				if(quotaType == 1l) 
				errorContainer.setMessageColumn(11); // cột dùng để in ra lỗi
//				else errorContainer.setMessageColumn(6);
				errorContainer.setFilePathError(filePathError);
				workLst.add(errorContainer);
			}

			workbook.close();
			return workLst;

		}  catch (Exception e) {
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
			List<WorkItemQuotaDTO> emptyArray = Lists.newArrayList();
			workLst = emptyArray;
			WorkItemQuotaDTO errorContainer = new WorkItemQuotaDTO();
			errorContainer.setErrorList(errorList);
			errorContainer.setMessageColumn(11); // cột dùng để in ra lỗi
			errorContainer.setFilePathError(filePathError);
			workLst.add(errorContainer);
			return workLst;
		}
	}


	private ExcelErrorDTO createError(int row, String column, String detail){
		ExcelErrorDTO err = new ExcelErrorDTO();
		err.setColumnError(column);
		err.setLineError(String.valueOf(row));
		err.setDetailError(detail);
		return err;
	}

	public boolean validateRequiredCell(Row row, List<ExcelErrorDTO> errorList){
		DataFormatter formatter = new DataFormatter();
		boolean result = true;
		for(int colIndex : validateCol){
			if(!validateString(formatter.formatCellValue(row.getCell(colIndex)))){
				ExcelErrorDTO errorDTO = new ExcelErrorDTO();
				errorDTO.setColumnError(colAlias.get(colIndex));
				errorDTO.setLineError(String.valueOf(row.getRowNum() + 1));
				errorDTO.setDetailError(colName.get(colIndex)+" chưa nhập");
				errorList.add(errorDTO);
				result = false;
			}

		}
		return result;
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

	public boolean validateRequiredCellMoney(Row row, List<ExcelErrorDTO> errorList){
		DataFormatter formatter = new DataFormatter();
		boolean result = true;
		for(int colIndex : validateColMoney){
			if(!validateString(formatter.formatCellValue(row.getCell(colIndex)))){
				ExcelErrorDTO errorDTO = new ExcelErrorDTO();
				errorDTO.setColumnError(colAlias.get(colIndex));
				errorDTO.setLineError(String.valueOf(row.getRowNum() + 1));
				errorDTO.setDetailError(colName.get(colIndex)+" chưa nhập");
				errorList.add(errorDTO);
				result = false;
			}

		}
		return result;
	}

	public Boolean isExist(WorkItemQuotaDTO code, Long quotaType) {
		WorkItemQuotaDTO obj = null;
		if(quotaType == 1l) {
			for (long i = 1; i<= 3l; i++) {
				code.setType(i);
				obj = workItemQuotaDAO.findByUniqueKey(code);
				if(obj == null) break;
			}
		}
		else obj = workItemQuotaDAO.findByUniqueKeyForMoney(code);
		if (obj != null) {
			return true;
		} else {
			return false;
		}
	}

	*//**
     * @overview return true if string is not null and not empty
     * @param str
     *//*
	public boolean validateString(String str){
		return (str != null && str.length()>0);
	}

	public boolean validateNumber(Long numb) {
		return (numb != null);
	}*/
}
