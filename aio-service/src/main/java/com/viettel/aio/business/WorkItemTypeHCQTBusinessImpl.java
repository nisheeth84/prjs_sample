package com.viettel.aio.business;

import com.google.common.collect.Lists;
import com.viettel.aio.bo.WorkItemTypeHCQTBO;
import com.viettel.aio.dao.WorkItemTypeHCQTDAO;
import com.viettel.aio.dto.ExcelErrorDTO;
import com.viettel.aio.dto.WorkItemTypeHCQTDTO;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


@Service("workItemTypeHCQTBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class WorkItemTypeHCQTBusinessImpl extends BaseFWBusinessImpl<WorkItemTypeHCQTDAO, WorkItemTypeHCQTDTO, WorkItemTypeHCQTBO> implements WorkItemTypeHCQTBusiness{

	static Logger LOGGER = LoggerFactory
			.getLogger(CntAppendixJobBusinessImpl.class);

	@Autowired
	private WorkItemTypeHCQTDAO workItemTypeHCQTDAO;

	//cột cần bắt validate trong file excel
	int [] validateCol = {1,2};

	HashMap<Integer, String> colName = new HashMap();
	{
		colName.put(1,"Mã loại hạng mục");
		colName.put(2,"Tên loại hạng mục");
	}

	HashMap<Integer, String>colAlias  = new HashMap();
	{
		colAlias.put(1,"B");
		colAlias.put(2,"C");

	}

	/**
	 * @overview return true if string is not null and not empty
	 * @param str
	 */
	public boolean validateString(String str){
		return (str != null && str.length()>0);
	}

	@Override
	public WorkItemTypeHCQTDAO gettDAO() {
		return workItemTypeHCQTDAO;
	}
	
	public WorkItemTypeHCQTBusinessImpl() {
		tModel = new WorkItemTypeHCQTBO();
		tDAO = workItemTypeHCQTDAO;
	}

	@Override
	public List<WorkItemTypeHCQTDTO> getForAutoComplete(WorkItemTypeHCQTDTO query) {
		return workItemTypeHCQTDAO.getForAutoComplete(query);
	}

    public List<WorkItemTypeHCQTDTO> doSearch(WorkItemTypeHCQTDTO obj) {
		return workItemTypeHCQTDAO.doSearch(obj);
    }

	public DataListDTO doSearchWorkItemType(WorkItemTypeHCQTDTO obj) {
		// TODO Auto-generated method stub
		List<WorkItemTypeHCQTDTO> ls = workItemTypeHCQTDAO.doSearchWorkItemType(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
	
	public Long saveWorkItemType(WorkItemTypeHCQTDTO obj) {
		obj.setStatus(1l);
		return workItemTypeHCQTDAO.saveObject(obj.toModel());
	}
	
	public Long updateWorkItemType(WorkItemTypeHCQTDTO obj) {
		return workItemTypeHCQTDAO.updateObject(obj.toModel());
	}
	
	public Long deleteWorkItemType(WorkItemTypeHCQTDTO obj) {
		obj.setStatus(0l);
		return workItemTypeHCQTDAO.updateObject(obj.toModel());
	}
	
	public List<WorkItemTypeHCQTDTO> getAutoCompleteWorkItemType(WorkItemTypeHCQTDTO obj) {
		return workItemTypeHCQTDAO.getAutoCompleteWorkItemType(obj);
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

//	@Override
//	public List<WorkItemTypeHcqtDTO> getForAutoComplete(WorkItemTypeHcqtDTO query) {
//		return workItemTypeHcqtDAO.getForAutoComplete(query);
//	}
//
//    public List<WorkItemTypeHcqtDTO> doSearch(WorkItemTypeHcqtDTO obj) {
//		return workItemTypeHcqtDAO.doSearch(obj);
//    }

	public List<WorkItemTypeHCQTDTO> checkValidateWorkItemType(WorkItemTypeHCQTDTO obj) {
		return workItemTypeHCQTDAO.checkValidateWorkItemType(obj);
	}

	private ExcelErrorDTO createError(int row, String column, String detail){
		ExcelErrorDTO err = new ExcelErrorDTO();
		err.setColumnError(column);
		err.setLineError(String.valueOf(row));
		err.setDetailError(detail);
		return err;
	}

	public List<WorkItemTypeHCQTDTO> importWorkItemTypeHCQTPackage(String fileInput) {
		List<WorkItemTypeHCQTDTO> workLst = Lists.newArrayList();
		List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();
		try {
			File f = new File(fileInput);
			XSSFWorkbook workbook = new XSSFWorkbook(f);
			XSSFSheet sheet = workbook.getSheetAt(0);
			DataFormatter formatter = new DataFormatter();
			int count = 0;
			HashMap<String, String> taskWorkItemType = new HashMap<String, String>();//hienvd: check and get id workItemTypeCode

			//hienvd: Get workItemTypeCode and workItemTypeId
			List<WorkItemTypeHCQTDTO> workItemTypeHCQTDTOList = workItemTypeHCQTDAO.doSearch(new WorkItemTypeHCQTDTO());
			for (WorkItemTypeHCQTDTO workItemTypeDTO : workItemTypeHCQTDTOList) {
				if(workItemTypeDTO.getWorkItemTypeCode() != null) {
					taskWorkItemType.put(
							workItemTypeDTO.getWorkItemTypeCode().replaceAll("\\s","")
									.replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim(),
							workItemTypeDTO.getWorkItemTypeId().toString());
				}
			}

			for (Row row : sheet) {
				count++;
				if(count >= 3 && checkIfRowIsEmpty(row)) continue;
				if (count >= 3) {
					String workItemTypeCode = formatter.formatCellValue(row.getCell(1));
					workItemTypeCode = workItemTypeCode.trim().replaceAll("\\s{2,}", " ");
					String workItemTypeName = formatter.formatCellValue(row.getCell(2));
					workItemTypeName = workItemTypeName.trim().replaceAll("\\s{2,}", " ");
					validateRequiredCell(row, errorList);
					WorkItemTypeHCQTDTO obj = new WorkItemTypeHCQTDTO();
					//valide check du lieu ten loai hang muc ton tai trong bang loai hang muc
					if(taskWorkItemType.get(
							workItemTypeCode.replaceAll("\\s","").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim()) == null) {
						obj.setWorkItemTypeCode(workItemTypeCode);
						obj.setWorkItemTypeName(workItemTypeName);
					}else {
						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(1), colName.get(1) + " đã tồn tại");
						errorList.add(errorDTO);
					}
					if(errorList.size() == 0){
						workLst.add(obj);
					}
				}
			}
			if(errorList.size() > 0){
				String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
				List<WorkItemTypeHCQTDTO> emptyArray = Lists.newArrayList();
				workLst = emptyArray;
				WorkItemTypeHCQTDTO errorContainer = new WorkItemTypeHCQTDTO();
				errorContainer.setErrorList(errorList);
				errorContainer.setMessageColumn(3); // cột dùng để in ra lỗi
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
			List<WorkItemTypeHCQTDTO> emptyArray = Lists.newArrayList();
			workLst = emptyArray;
			WorkItemTypeHCQTDTO errorContainer = new WorkItemTypeHCQTDTO();
			errorContainer.setErrorList(errorList);
			errorContainer.setMessageColumn(3); // cột dùng để in ra lỗi
			errorContainer.setFilePathError(filePathError);
			workLst.add(errorContainer);
			return workLst;
		}
	}
}
