package com.viettel.aio.business;

import com.google.common.collect.Lists;
import com.viettel.aio.bo.CatTaskHCQTBO;
import com.viettel.aio.dao.CatTaskHCQTDAO;
import com.viettel.aio.dao.WorkItemHCQTDAO;
import com.viettel.aio.dao.WorkItemTypeHCQTDAO;
import com.viettel.aio.dto.CatTaskHCQTDTO;
import com.viettel.aio.dto.ExcelErrorDTO;
import com.viettel.aio.dto.WorkItemHCQTDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
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
import java.io.*;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;


@Service("catTaskHCQTBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CatTaskHCQTBusinessImpl extends BaseFWBusinessImpl<CatTaskHCQTDAO, CatTaskHCQTDTO, CatTaskHCQTBO> implements CatTaskHCQTBusiness{
	@Autowired
	private CatTaskHCQTDAO catTaskHCQTDAO;

	@Autowired
	private WorkItemHCQTDAO workItemHCQTDAO;
	public CatTaskHCQTBusinessImpl() {
		tModel = new CatTaskHCQTBO();
		tDAO = catTaskHCQTDAO;
	}

	@Autowired
	private WorkItemTypeHCQTDAO workItemTypeHCQTDAO;

	//cột cần bắt validate trong file excel
	int [] validateCol = {1,2,3};

	static Logger LOGGER = LoggerFactory
			.getLogger(CntAppendixJobBusinessImpl.class);

	HashMap<Integer, String> colName = new HashMap();
	{
		colName.put(1,"Mã công việc");
		colName.put(2,"Tên công việc");
		colName.put(3,"Tên hạng mục");
	}

	HashMap<Integer, String>colAlias  = new HashMap();
	{
		colAlias.put(1,"B");
		colAlias.put(2,"C");
		colAlias.put(3, "D");

	}

	// huypq-20190827-start
	@Value("${folder_upload2}")
	private String folder2Upload;
	@Value("${default_sub_folder_upload}")
	private String defaultSubFolderUpload;
	// huy-end
	
	@Override
	public CatTaskHCQTDAO gettDAO() {
		return catTaskHCQTDAO;
	}

	@Override
	public List<CatTaskHCQTDTO> getForAutoComplete(CatTaskHCQTDTO query) {
		return catTaskHCQTDAO.getForAutoComplete(query);
	}

    public List<CatTaskHCQTDTO> doSearch(CatTaskHCQTDTO obj) {
		return catTaskHCQTDAO.doSearch(obj);
    }

//	public DataListDTO doSearchCatTask(CatTaskHCQTDTO obj) {
//		// TODO Auto-generated method stub
//		List<CatTaskHCQTDTO> ls = catTaskHCQTDAO.doSearchCatTask(obj);
//		DataListDTO data = new DataListDTO();
//		data.setData(ls);
//		data.setTotal(obj.getTotalRecord());
//		data.setSize(obj.getPageSize());
//		data.setStart(1);
//		return data;
//	}
//
//	public Long saveWorkItemTask(CatTaskHCQTDTO obj) {
//		obj.setStatus(1l);
//		return catTaskHCQTDAO.saveObject(obj.toModel());
//	}
//
//	public Long updateWorkItemTask(CatTaskHCQTDTO obj) {
//		return catTaskHCQTDAO.updateObject(obj.toModel());
//	}
//
//	public Long deleteWorkItemTask(CatTaskHCQTDTO obj) {
//		obj.setStatus(0l);
//		return catTaskHCQTDAO.updateObject(obj.toModel());
//	}
//
//	private ExcelErrorDTO createError(int row, String column, String detail){
//		ExcelErrorDTO err = new ExcelErrorDTO();
//		err.setColumnError(column);
//		err.setLineError(String.valueOf(row));
//		err.setDetailError(detail);
//		return err;
//	}
//
//	@SuppressWarnings("deprecation")
//	private boolean checkIfRowIsEmpty(Row row) {
//		if (row == null) {
//			return true;
//		}
//		if (row.getLastCellNum() <= 0) {
//			return true;
//		}
//		for (int cellNum = row.getFirstCellNum(); cellNum < row.getLastCellNum(); cellNum++) {
//			Cell cell = row.getCell(cellNum);
//			if (cell != null && cell.getCellType() != Cell.CELL_TYPE_BLANK && StringUtils.isNotBlank(cell.toString())) {
//				return false;
//			}
//		}
//		return true;
//	}
//
//	/**
//	 * @overview return true if string is not null and not empty
//	 * @param str
//	 */
//	public boolean validateString(String str){
//		return (str != null && str.length()>0);
//	}
//
//	public boolean validateRequiredCell(Row row, List<ExcelErrorDTO> errorList){
//		DataFormatter formatter = new DataFormatter();
//		boolean result = true;
//		for(int colIndex : validateCol){
//			if(!validateString(formatter.formatCellValue(row.getCell(colIndex)))){
//				ExcelErrorDTO errorDTO = new ExcelErrorDTO();
//				errorDTO.setColumnError(colAlias.get(colIndex));
//				errorDTO.setLineError(String.valueOf(row.getRowNum() + 1));
//				errorDTO.setDetailError(colName.get(colIndex)+" chưa nhập");
//				errorList.add(errorDTO);
//				result = false;
//			}
//		}
//		return result;
//	}
//
//    public List<CatTaskHCQTDTO> checkCatTaskExit(CatTaskHCQTDTO obj) {
//		return catTaskHCQTDAO.checkCatTaskExit(obj);
//    }
//
//	public List<CatTaskHCQTDTO> importCatTaskHCQTPackage(String fileInput) {
//		List<CatTaskHCQTDTO> workLst = Lists.newArrayList();
//		List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();
//		try {
//			File f = new File(fileInput);
//			XSSFWorkbook workbook = new XSSFWorkbook(f);
//			XSSFSheet sheet = workbook.getSheetAt(0);
//			DataFormatter formatter = new DataFormatter();
//			int count = 0;
//
//			HashMap<String, String> taskCatTask = new HashMap<String, String>();//hienvd: check and get id catTaskName
//			HashMap<String, String> taskWorkItemId = new HashMap<String, String>();//hienvd: check and get code workItemName
//
//			HashMap<String, String> mapCheckDup = new HashMap<String, String>(); //huypq-20190827-add
//
////			//hienvd: Get catTaskCode and catTaskId
//			List<CatTaskHCQTDTO> catTaskHCQTDTOList = catTaskHCQTDAO.doSearch(new CatTaskHCQTDTO());
//			for (CatTaskHCQTDTO catTaskHCQTDTO : catTaskHCQTDTOList) {
//				if(catTaskHCQTDTO.getCatTaskCode() != null) {
//					taskCatTask.put(
//							catTaskHCQTDTO.getCatTaskCode().replaceAll("\\s","").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim(),
//							catTaskHCQTDTO.getCatTaskId().toString());
//				}
//			}
////
//			//hienvd: Get workItemCode and workItemId
//			List<WorkItemHCQTDTO> workItemHCQTDTOList = workItemHCQTDAO.doSearch(new WorkItemHCQTDTO());
//			for (WorkItemHCQTDTO workItemDTO : workItemHCQTDTOList) {
//				if(workItemDTO.getWorkItemCode() != null) {
//					taskWorkItemId.put(
//							workItemDTO.getWorkItemName().replaceAll("\\s","")
//									.replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim(),
//							workItemDTO.getWorkItemId().toString());
//				}
//			}
//
//			//Huypq-20190827-start
//			List<CatTaskHCQTDTO> data = catTaskHCQTDAO.doSearchCatTask(new CatTaskHCQTDTO());
//			for(CatTaskHCQTDTO dto : data) {
//				mapCheckDup.put(dto.getCatTaskName().toUpperCase(), dto.getWorkItemName().toUpperCase());
//			}
//			//huy-end
//
//			for (Row row : sheet) {
//				count++;
//				if(count >= 3 && checkIfRowIsEmpty(row)) continue;
//				if (count >= 3) {
//					String catTaskCode = formatter.formatCellValue(row.getCell(1));
//					catTaskCode = catTaskCode.trim().replaceAll("\\s{2,}", " ");
//					String catTaskName = formatter.formatCellValue(row.getCell(2));
//					catTaskName = catTaskName.trim().replaceAll("\\s{2,}", " ");
//					String workItemName = formatter.formatCellValue(row.getCell(3));
//					workItemName = workItemName.trim().replaceAll("\\s{2,}", " ");
//					//Huypq-20190815-start
//					String priorityTask = formatter.formatCellValue(row.getCell(4));
//					priorityTask = priorityTask.trim().replaceAll("\\s{2,}", " ");
//					//Huy-end
//					validateRequiredCell(row, errorList);
//
//					CatTaskHCQTDTO obj = new CatTaskHCQTDTO();
//
//					if(taskCatTask.get(
//							catTaskCode.replaceAll("\\s","").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim()) == null) {
//						String nameDup = mapCheckDup.get(catTaskName.toUpperCase());
//						if(nameDup!=null) {
//							if(nameDup.equals(workItemName.toUpperCase())) {
//								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(2), colName.get(2) + " đã tồn tại đối với hạng mục: "+ workItemName);
//								errorList.add(errorDTO);
//							} else {
//								obj.setCatTaskCode(catTaskCode);
//								obj.setCatTaskName(catTaskName);
//							}
//						} else {
//							obj.setCatTaskCode(catTaskCode);
//							obj.setCatTaskName(catTaskName);
//						}
//					}else {
//						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(1), colName.get(1) + " đã tồn tại");
//						errorList.add(errorDTO);
//					}
//
//					if(taskWorkItemId.get(
//							workItemName.replaceAll("\\s","").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim()) == null) {
//						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3), colName.get(3) + " không tồn tại trong bảng hạng mục");
//						errorList.add(errorDTO);
//					}else {
//						String workItemId = taskWorkItemId.get(
//								workItemName.replaceAll("\\s","").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim());
//						Long workItemIdCat = Long.parseLong(workItemId);
//						obj.setWorkItemId(workItemIdCat);
//					}
//					obj.setPriorityTask(priorityTask);
//					if(errorList.size() == 0){
//						workLst.add(obj);
//					}
//				}
//			}
//			if(errorList.size() > 0){
//				String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
//				List<CatTaskHCQTDTO> emptyArray = Lists.newArrayList();
//				workLst = emptyArray;
//				CatTaskHCQTDTO errorContainer = new CatTaskHCQTDTO();
//				errorContainer.setErrorList(errorList);
//				errorContainer.setMessageColumn(5); // cột dùng để in ra lỗi
//				errorContainer.setFilePathError(filePathError);
//				workLst.add(errorContainer);
//			}
//			workbook.close();
//			return workLst;
//
//		}  catch (Exception e) {
//			LOGGER.error(e.getMessage(), e);
//			ExcelErrorDTO errorDTO = createError(0, "", e.toString());
//			errorList.add(errorDTO);
//			String filePathError = null;
//			try {
//				filePathError = UEncrypt.encryptFileUploadPath(fileInput);
//			} catch(Exception ex) {
//				LOGGER.error(e.getMessage(), e);
//				errorDTO = createError(0, "", ex.toString());
//				errorList.add(errorDTO);
//			}
//			List<CatTaskHCQTDTO> emptyArray = Lists.newArrayList();
//			workLst = emptyArray;
//			CatTaskHCQTDTO errorContainer = new CatTaskHCQTDTO();
//			errorContainer.setErrorList(errorList);
//			errorContainer.setMessageColumn(5); // cột dùng để in ra lỗi
//			errorContainer.setFilePathError(filePathError);
//			workLst.add(errorContainer);
//			return workLst;
//		}
//	}
//
//	//Huypq-20190827-start
//		public String exportTaskHCQT(CatTaskHCQTDTO obj, HttpServletRequest request) throws Exception {
//			ClassLoader classloader = Thread.currentThread().getContextClassLoader();
//			String filePath = classloader.getResource("../" + "doc-template").getPath();
//			InputStream file = new BufferedInputStream(new FileInputStream(filePath + "BieuMauCongViecHCQT.xlsx"));
//			XSSFWorkbook workbook = new XSSFWorkbook(file);
//			file.close();
//			Calendar cal = Calendar.getInstance();
//			String uploadPath = folder2Upload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
//					+ File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
//					+ File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
//			String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
//					+ cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
//					+ cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
//			File udir = new File(uploadPath);
//			if (!udir.exists()) {
//				udir.mkdirs();
//			}
//			OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "BieuMauCongViecHCQT.xlsx");
//			WorkItemHCQTDTO typ = new WorkItemHCQTDTO();
//			typ.setStatus(1l);
//			List<WorkItemHCQTDTO> data = workItemHCQTDAO.doSearchWorkItem(typ);
//			XSSFSheet sheet = workbook.getSheetAt(1);
//			if ((data != null && !data.isEmpty())) { // huy-edit
//				XSSFCellStyle style = ExcelUtils.styleText(sheet);
//				// HuyPQ-17/08/2018-edit-start
//				XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
//				styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.00"));
//				XSSFCellStyle styleNumber2 = ExcelUtils.styleNumber(sheet);
//				styleNumber2.setDataFormat(workbook.createDataFormat().getFormat("0"));
//				// HuyPQ-17/08/2018-edit-end
//				styleNumber.setAlignment(HorizontalAlignment.RIGHT);
//				int i = 1;
//				for (WorkItemHCQTDTO dto : data) {
//					Row row = sheet.createRow(i++);
//					Cell cell = row.createCell(0, CellType.STRING);
//					cell.setCellValue("" + (i - 1));
//					cell.setCellStyle(styleNumber);
//					cell = row.createCell(1, CellType.STRING);
//					cell.setCellValue((dto.getWorkItemCode() != null) ? dto.getWorkItemCode() : "");
//					cell.setCellStyle(style);
//					cell = row.createCell(2, CellType.STRING);
//					cell.setCellValue((dto.getWorkItemName() != null) ? dto.getWorkItemName() : "");
//					cell.setCellStyle(style);
//				}
//			}
//
//			workbook.write(outFile);
//			workbook.close();
//			outFile.close();
//			String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "BieuMauCongViecHCQT.xlsx");
//			return path;
//		}
//		//Huy-end
}
