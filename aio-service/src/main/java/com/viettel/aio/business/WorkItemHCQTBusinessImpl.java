package com.viettel.aio.business;

import com.viettel.aio.bo.WorkItemHCQTBO;
import com.viettel.aio.dao.WorkItemHCQTDAO;
import com.viettel.aio.dao.WorkItemTypeHCQTDAO;
import com.viettel.aio.dto.WorkItemHCQTDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;


@Service("workItemHCQTBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class WorkItemHCQTBusinessImpl extends BaseFWBusinessImpl<WorkItemHCQTDAO, WorkItemHCQTDTO, WorkItemHCQTBO> implements WorkItemHCQTBusiness {

    @Autowired
    private WorkItemHCQTDAO workItemHCQTDAO;

	@Autowired
	private WorkItemTypeHCQTDAO workItemTypeHCQTDAO;

	//cột cần bắt validate trong file excel
	int [] validateCol = {1,2,3};

	static Logger LOGGER = LoggerFactory
			.getLogger(CntAppendixJobBusinessImpl.class);

	HashMap<Integer, String> colName = new HashMap();
	{
		colName.put(1,"Mã hạng mục");
		colName.put(2,"Tên hạng mục");
		colName.put(3,"Tên loại hạng mục");
	}

	HashMap<Integer, String>colAlias  = new HashMap();
	{
		colAlias.put(1,"B");
		colAlias.put(2,"C");
		colAlias.put(3, "D");

	}

	//huypq-20190827-start
	@Value("${folder_upload2}")
	private String folder2Upload;
	@Value("${default_sub_folder_upload}")
	private String defaultSubFolderUpload;
	//huy-end
	
    public WorkItemHCQTBusinessImpl() {
        tModel = new WorkItemHCQTBO();
        tDAO = workItemHCQTDAO;
    }

    @Override
    public WorkItemHCQTDAO gettDAO() {
        return workItemHCQTDAO;
    }

    @Override
    public List<WorkItemHCQTDTO> getForAutoComplete(WorkItemHCQTDTO query) {
        return workItemHCQTDAO.getForAutoComplete(query);
    }

    public List<WorkItemHCQTDTO> doSearch(WorkItemHCQTDTO obj) {
        return workItemHCQTDAO.doSearch(obj);
    }

//	public DataListDTO doSearchWorkItem(WorkItemHCQTDTO obj) {
//		// TODO Auto-generated method stub
//		List<WorkItemHCQTDTO> ls = workItemHCQTDAO.doSearchWorkItem(obj);
//		DataListDTO data = new DataListDTO();
//		data.setData(ls);
//		data.setTotal(obj.getTotalRecord());
//		data.setSize(obj.getPageSize());
//		data.setStart(1);
//		return data;
//	}
//
//	public Long saveWorkItem(WorkItemHCQTDTO obj) {
//		obj.setStatus(1l);
//		return workItemHCQTDAO.saveObject(obj.toModel());
//	}
//
//	public Long updateWorkItem(WorkItemHCQTDTO obj) {
//		return workItemHCQTDAO.updateObject(obj.toModel());
//	}
//
//	public Long deleteWorkItem(WorkItemHCQTDTO obj) {
//		obj.setStatus(0l);
//		return workItemHCQTDAO.updateObject(obj.toModel());
//	}
//
//	public List<WorkItemHCQTDTO> getAutoCompleteWorkItem(WorkItemHCQTDTO obj) {
//		return workItemHCQTDAO.getAutoCompleteWorkItem(obj);
//	}
//
//    public List<WorkItemHCQTDTO> checkWorkItemExit(WorkItemHCQTDTO obj) {
//		return workItemHCQTDAO.checkWorkItemExit(obj);
//    }
//
////	@Override
////	public List<WorkItemHCQTDTO> getForAutoComplete(WorkItemHCQTDTO query) {
////		// TODO Auto-generated method stub
////		return null;
////	}
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
//	public List<WorkItemHCQTDTO> importWorkItemHCQTPackage(String fileInput) {
//		List<WorkItemHCQTDTO> workLst = Lists.newArrayList();
//		List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();
//		try {
//			File f = new File(fileInput);
//			XSSFWorkbook workbook = new XSSFWorkbook(f);
//			XSSFSheet sheet = workbook.getSheetAt(0);
//			DataFormatter formatter = new DataFormatter();
//			int count = 0;
//			HashMap<String, String> taskWorkItemType = new HashMap<String, String>();//hienvd: check and get id workItemTypeName
//			HashMap<String, String> taskWorkItem = new HashMap<String, String>();//hienvd: check and get id workItem
//			HashMap<String, String> taskWorkItemTypeCode = new HashMap<String, String>();//hienvd: check and get code workItemTypeCode
//
//			HashMap<String, String> mapCheckDup = new HashMap<String, String>(); //Huypq-20190827-add
//
//			//hienvd: Get workItemTypeName and workItemTypeId
//			List<WorkItemTypeHCQTDTO> workItemTypeHCQTDTOList = workItemTypeHCQTDAO.doSearch(new WorkItemTypeHCQTDTO());
//			for (WorkItemTypeHCQTDTO workItemTypeDTO : workItemTypeHCQTDTOList) {
//				if(workItemTypeDTO.getWorkItemTypeName() != null) {
//					taskWorkItemType.put(
//							workItemTypeDTO.getWorkItemTypeName().replaceAll("\\s","").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim(),
//							workItemTypeDTO.getWorkItemTypeId().toString());
//					taskWorkItemTypeCode.put(
//							workItemTypeDTO.getWorkItemTypeId().toString(),
//							workItemTypeDTO.getWorkItemTypeCode());
//				}
//			}
//
//			//hienvd: Get workItemCode and workItemId
//			List<WorkItemHCQTDTO> workItemHCQTDTOList = workItemHCQTDAO.doSearch(new WorkItemHCQTDTO());
//			for (WorkItemHCQTDTO workItemDTO : workItemHCQTDTOList) {
//				if(workItemDTO.getWorkItemCode() != null) {
//					taskWorkItem.put(
//							workItemDTO.getWorkItemCode().replaceAll("\\s","")
//									.replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim(),
//							workItemDTO.getWorkItemId().toString());
//				}
//			}
//
//			//Huypq-20190827-start
//			List<WorkItemHCQTDTO> data = workItemHCQTDAO.doSearchWorkItem(new WorkItemHCQTDTO());
//			for(WorkItemHCQTDTO dto : data) {
//				mapCheckDup.put(dto.getWorkItemName().toUpperCase(), dto.getWorkItemTypeName().toUpperCase());
//			}
//			//Huypq-end
//
//			for (Row row : sheet) {
//				count++;
//				if(count >= 3 && checkIfRowIsEmpty(row)) continue;
//				if (count >= 3) {
//					String workItemCode = formatter.formatCellValue(row.getCell(1));
//					workItemCode = workItemCode.trim().replaceAll("\\s{2,}", " ");
//					String workItemName = formatter.formatCellValue(row.getCell(2));
//					workItemName = workItemName.trim().replaceAll("\\s{2,}", " ");
//					String workItemTypeName = formatter.formatCellValue(row.getCell(3));
//					workItemTypeName = workItemTypeName.trim().replaceAll("\\s{2,}", " ");
//					validateRequiredCell(row, errorList);
//					WorkItemHCQTDTO obj = new WorkItemHCQTDTO();
//
//
//					if(taskWorkItem.get(
//							workItemCode.replaceAll("\\s","").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim()) == null) {
//						//Huypq-20190827-start
//						String checkName = mapCheckDup.get(workItemName.toUpperCase());
//						if(checkName!=null) {
//							if(checkName.equals(workItemTypeName.toUpperCase())) {
//								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(2), colName.get(2) + " đã tồn tại đối với loại hạng mục: "+ workItemTypeName);
//								errorList.add(errorDTO);
//							} else {
//								obj.setWorkItemCode(workItemCode);
//								obj.setWorkItemName(workItemName);
//							}
//						} else {
//							obj.setWorkItemCode(workItemCode);
//							obj.setWorkItemName(workItemName);
//						}
//						//Huy-end
//					}else {
//						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(1), colName.get(1) + " đã tồn tại");
//						errorList.add(errorDTO);
//					}
//
//					if(taskWorkItemType.get(
//							workItemTypeName.replaceAll("\\s","").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim()) == null) {
//						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3), colName.get(3) + " không tồn tại trong bảng loại hạng mục");
//						errorList.add(errorDTO);
//					}else {
//						String workItemTypeId = taskWorkItemType.get(
//								workItemTypeName.replaceAll("\\s","").replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase().trim());
//						String workItemTypeCode = taskWorkItemTypeCode.get(workItemTypeId); //hienvd: get workItemTypeCode to workItemTypeId
//						obj.setWorkItemTypeName(workItemTypeName);
//						obj.setWorkItemTypeId(Long.parseLong(workItemTypeId));
//						obj.setWorkItemTypeCode(workItemTypeCode);
//					}
//					if(errorList.size() == 0){
//						workLst.add(obj);
//					}
//				}
//			}
//			if(errorList.size() > 0){
//				String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
//				List<WorkItemHCQTDTO> emptyArray = Lists.newArrayList();
//				workLst = emptyArray;
//				WorkItemHCQTDTO errorContainer = new WorkItemHCQTDTO();
//				errorContainer.setErrorList(errorList);
//				errorContainer.setMessageColumn(4); // cột dùng để in ra lỗi
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
//			List<WorkItemHCQTDTO> emptyArray = Lists.newArrayList();
//			workLst = emptyArray;
//			WorkItemHCQTDTO errorContainer = new WorkItemHCQTDTO();
//			errorContainer.setErrorList(errorList);
//			errorContainer.setMessageColumn(4); // cột dùng để in ra lỗi
//			errorContainer.setFilePathError(filePathError);
//			workLst.add(errorContainer);
//			return workLst;
//		}
//	}
//
//	//Huypq-20190827-start
//	public String exportWorkItemTypeHCQT(WorkItemHCQTDTO obj, HttpServletRequest request) throws Exception {
//		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
//		String filePath = classloader.getResource("../" + "doc-template").getPath();
//		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "BieuMauHangMucHCQT.xlsx"));
//		XSSFWorkbook workbook = new XSSFWorkbook(file);
//		file.close();
//		Calendar cal = Calendar.getInstance();
//		String uploadPath = folder2Upload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
//				+ File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
//				+ File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
//		String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
//				+ cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
//				+ cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
//		File udir = new File(uploadPath);
//		if (!udir.exists()) {
//			udir.mkdirs();
//		}
//		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "BieuMauHangMucHCQT.xlsx");
//		WorkItemTypeHCQTDTO typ = new WorkItemTypeHCQTDTO();
//		typ.setStatus(1l);
//		List<WorkItemTypeHCQTDTO> data = workItemTypeHCQTDAO.doSearchWorkItemType(typ);
//		XSSFSheet sheet = workbook.getSheetAt(1);
//		if ((data != null && !data.isEmpty())) { // huy-edit
//			XSSFCellStyle style = ExcelUtils.styleText(sheet);
//			// HuyPQ-17/08/2018-edit-start
//			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
//			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.00"));
//			XSSFCellStyle styleNumber2 = ExcelUtils.styleNumber(sheet);
//			styleNumber2.setDataFormat(workbook.createDataFormat().getFormat("0"));
//			// HuyPQ-17/08/2018-edit-end
//			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
//			int i = 1;
//			for (WorkItemTypeHCQTDTO dto : data) {
//				Row row = sheet.createRow(i++);
//				Cell cell = row.createCell(0, CellType.STRING);
//				cell.setCellValue("" + (i - 1));
//				cell.setCellStyle(styleNumber);
//				cell = row.createCell(1, CellType.STRING);
//				cell.setCellValue((dto.getWorkItemTypeCode() != null) ? dto.getWorkItemTypeCode() : "");
//				cell.setCellStyle(style);
//				cell = row.createCell(2, CellType.STRING);
//				cell.setCellValue((dto.getWorkItemTypeName() != null) ? dto.getWorkItemTypeName() : "");
//				cell.setCellStyle(style);
//			}
//		}
//
//		workbook.write(outFile);
//		workbook.close();
//		outFile.close();
//		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "BieuMauHangMucHCQT.xlsx");
//		return path;
//	}
//	//Huy-end
}
