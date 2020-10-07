package com.viettel.aio.business;

import com.viettel.aio.bo.CntContractBO;
import com.viettel.aio.dao.CntContractDAO;
import com.viettel.aio.dao.ManageQuantityConsXnxdDAO;
import com.viettel.aio.dao.ManageRevenueConsXnxdDAO;
import com.viettel.aio.dto.*;
import com.viettel.cat.constant.Constants;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

@Service("AIOcntContractBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CntContractBusinessImpl extends
		BaseFWBusinessImpl<CntContractDAO, CntContractDTO, CntContractBO>
		implements CntContractBusiness {

	@Autowired
	private CntContractDAO cntContractDAO;
	
	@Autowired
	private ManageQuantityConsXnxdDAO manageQuantityConsXnxdDAO;

	@Autowired
	private ManageRevenueConsXnxdDAO manageRevenueConsXnxdDAO;
	
	@Autowired
	private UtilAttachDocumentDAO utilAttachDocumentDAO;

	@Value("${folder_upload2}")
	private String folder2Upload;
	@Value("${default_sub_folder_upload}")
	private String defaultSubFolderUpload;
	@Value("${input_sub_folder_upload}")
	private String inputFileFolderUpload;
	@Value("${temp_sub_folder_upload}")

	private String tempFileFolderUpload;
	public CntContractBusinessImpl() {
		tModel = new CntContractBO();
		tDAO = cntContractDAO;
	}

	public String exportExcelTemplate(String fileName) throws Exception {
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

	@Override
	public CntContractDAO gettDAO() {
		return cntContractDAO;
	}

	@Override
	public CntContractDTO findByCode(CntContractDTO obj) {
		CntContractDTO contract = cntContractDAO.findByCode(obj);
		// UtilAttachDocumentDTO criteria = new UtilAttachDocumentDTO();
		// if(contract != null && contract.getCntContractId() != null){
		// criteria.setObjectId(contract.getCntContractId());
		// criteria.setType("0");
		// List <UtilAttachDocumentDTO> fileLst
		// =utilAttachDocumentDAO.doSearch(criteria);
		// contract.setFileLst(fileLst);
		// }
		return contract;
	}

	@Override
	public List<CntContractDTO> doSearch(CntContractDTO obj) {
		List<CntContractDTO> result = cntContractDAO.doSearch(obj);
		for (CntContractDTO contract : result) {
			if (contract != null) {
				UtilAttachDocumentDTO criteria = new UtilAttachDocumentDTO();
				criteria.setObjectId(contract.getCntContractId());
				if (Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT
						.equals(obj.getContractType())) {
					criteria.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_OUT);
				} else if (Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN
						.equals(obj.getContractType())) {
					criteria.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_IN);
				}
				else if (Constants.CONTRACT_TYPE.CONTRACT_MATERIAL
						.equals(obj.getContractType())) {
					criteria.setType(Constants.FILETYPE.CONTRACT_MATERIAL);
				}
				else if (Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT
						.equals(obj.getContractType())) {
					criteria.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT);
				}
				else if (Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN
						.equals(obj.getContractType())) {
					criteria.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN);
				}
				//Huypq-20190919-start
				else if(obj.getContractType() == 7l) {
					criteria.setType("HTCT_DR");
				} else if(obj.getContractType() == 8l) {
					criteria.setType("HTCT_DV");
				}
				//Huy-end
				List<UtilAttachDocumentDTO> fileLst = utilAttachDocumentDAO
						.doSearch(criteria);
				List<PurchaseOrderDTO> orderLst = cntContractDAO
						.getOrder(contract.getCntContractId());
				contract.setPurchaseOrderLst(orderLst);
				contract.setFileLst(fileLst);
			}
		}
		return result;
	}
	public List<CntContractDTO> doSearchXNXD(CntContractDTO obj) {
		List<CntContractDTO> result = cntContractDAO.doSearchXNXD(obj);
		for (CntContractDTO contract : result) {
			if (contract != null) {
				UtilAttachDocumentDTO criteria = new UtilAttachDocumentDTO();
				criteria.setObjectId(contract.getCntContractId());
				if (Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT
						.equals(obj.getContractType())) {
					criteria.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_OUT);
				} else if (Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN
						.equals(obj.getContractType())) {
					criteria.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_IN);
				}
				else if (Constants.CONTRACT_TYPE.CONTRACT_MATERIAL
						.equals(obj.getContractType())) {
					criteria.setType(Constants.FILETYPE.CONTRACT_MATERIAL);
				}
				else if (Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT
						.equals(obj.getContractType())) {
					criteria.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT);
				}
				else if (Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN
						.equals(obj.getContractType())) {
					criteria.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN);
				}
				//Huypq-20190919-start
				else if(obj.getContractType() == 7l) {
					criteria.setType("HTCT_DR");
				} else if(obj.getContractType() == 8l) {
					criteria.setType("HTCT_DV");
				}
				//Huy-end
				List<UtilAttachDocumentDTO> fileLst = utilAttachDocumentDAO
						.doSearch(criteria);
				List<PurchaseOrderDTO> orderLst = cntContractDAO
						.getOrder(contract.getCntContractId());
				contract.setPurchaseOrderLst(orderLst);
				contract.setFileLst(fileLst);
			}
		}
		return result;
	}
	
	public List<CntContractReportDTO> doSearchForReport(CntContractReportDTO obj) {
		List<CntContractReportDTO> result = cntContractDAO.doSearchForReport(obj);
		return result;
	}

	@Override
	public List<CntContractDTO> getForAutoComplete(CntContractDTO query) {
		return cntContractDAO.getForAutoComplete(query);
	}

	public String delete(List<Long> ids, String tableName,
			String tablePrimaryKey) {
		return cntContractDAO.delete(ids, tableName, tablePrimaryKey);
	}

	public CntContractDTO getById(Long id) {
		return cntContractDAO.getById(id);
	}

	// hoanm1_20180305_start
	@Override
	public List<CntContractDTO> getListContract(CntContractDTO obj) {
		List<CntContractDTO> result = cntContractDAO.getListContract(obj);
		return result;
	}

	@Override
	public List<CntContractDTO> getListContractKTTS(CntContractDTO obj) {
		List<CntContractDTO> result = cntContractDAO.getListContractKTTS(obj);
		return result;
	}

	@Override
	public List<CntContractDTO> getForAutoCompleteMap(CntContractDTO query) {
		return cntContractDAO.getForAutoCompleteMap(query);
	}

	@Override
	public List<CntContractDTO> getForAutoCompleteKTTS(CntContractDTO query) {
		return cntContractDAO.getForAutoCompleteKTTS(query);
	}

	@Override
	public CntContractDTO findByCodeKTTS(String value) {
		return cntContractDAO.findByCodeKTTS(value);
	}
	// hoanm1_20180305_end
	
	public ContractInformationDTO getCntInformation(Long contractId){
		return cntContractDAO.getCntInformation(contractId);
	}
	
	//Huypq-20181114-start
	@Override
	public DataListDTO doSearchContractOut(CntContractDTO obj) {
		List<CntContractDTO> ls = cntContractDAO.doSearchContractOut(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getTotalRecord());
		data.setStart(1);
		return data;
	}
	//huy-end
	
	/**hoangnh start 03012019**/
	public DataListDTO getForAutoCompleteContract(CntContractDTO obj) {
		List<CntContractDTO> ls = cntContractDAO.getForAutoCompleteContract(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getTotalRecord());
		data.setStart(1);
		return data;
	}
	
	@Override
	public CntContractDTO getIdConstract(String code) {
		return cntContractDAO.getIdConstract(code);
	}
	
	@Override
	public List<CntConstrWorkItemTaskDTO> getDetailById(Long id) {
		return cntContractDAO.getDetailById(id);
	}
	
	public String updateCodeKtts(CntContractDTO obj){
		return cntContractDAO.updateCodeKtts(obj);
	}
	
	public String updateCodeCnt(CntContractDTO obj){
		return cntContractDAO.updateCodeCnt(obj);
	}
	
	public String removeTask(Long id){
		return cntContractDAO.removeTask(id);
	}
	
	public String updateStatusKtts(String code){
		return cntContractDAO.updateStatusKtts(code);
	}
	/**hoangnh end 03012019**/
	
	// HuyPq-20190612-start
	// Check quyền xoá hợp đồng ngoài OS
	public boolean checkDeleteContractOS(HttpServletRequest request) {
		if (!VpsPermissionChecker.hasPermission(Constants.OperationKey.DELETE,
				Constants.AdResourceKey.REMOVE_CONTRACT_OS, request)) {
			return false;
		}
		return true;
	}
	// HuyPq-end
	
	//Huypq-20190927-start
	public boolean checkMapContract(HttpServletRequest request) {
		if (!VpsPermissionChecker.hasPermission(Constants.OperationKey.MAP,
				Constants.AdResourceKey.CONTRACT, request)) {
			return false;
		}
		return true;
	}
	//Huy-end
	
	//Huypq-20191021-start
	public DataListDTO doSearchContractXNXD(ManageQuantityConsXnxdDTO obj) {
		List<ManageQuantityConsXnxdDTO> ls = manageQuantityConsXnxdDAO.doSearchContractXNXD(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setSize(obj.getTotalRecord());
		data.setStart(obj.getPage().intValue());
		data.setTotal(obj.getTotalRecord());
		return data;
	}
	
	public DataListDTO getDataContractTaskXNXD(ManageQuantityConsXnxdDTO obj){
		List<CntContractTaskXNXDDTO> ls = manageQuantityConsXnxdDAO.getDataContractTaskXNXD(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setSize(obj.getTotalRecord());
		data.setStart(obj.getPage().intValue());
		data.setTotal(obj.getTotalRecord());
		return data;
	}
	
	public List<ManageQuantityConsXnxdDTO> getDataQuantityByDate(ManageQuantityConsXnxdDTO obj){
		return manageQuantityConsXnxdDAO.getDataQuantityByDate(obj);
	}
	
	public Long updateQuantityCons(ManageQuantityConsXnxdDTO obj) {
		Long id = null;
		manageQuantityConsXnxdDAO.deleteTaskByDate(obj);
		for(CntContractTaskXNXDDTO dto : obj.getListTaskXnxd()) {
			ManageQuantityConsXnxdDTO manage = new ManageQuantityConsXnxdDTO();
			manage.setCntContractId(obj.getCntContractId());
			manage.setCntContractCode(obj.getCntContractCode());
			manage.setTaskId(dto.getCntContractTaskXNXDId());
			manage.setTaskName(dto.getCatTaskName());
			manage.setTaskMassNow(dto.getTaskMassNow());
			manage.setTaskPrice(dto.getTaskPrice());
			manage.setTotalPriceNow(dto.getTotalPriceNow());
//			manage.setTotalPriceNow(dto.getTaskPrice() * Math.round(dto.getTaskMassNow()));
			manage.setYear(obj.getYear());
			manage.setMonth(obj.getMonth());
			manage.setWeek(obj.getWeek());
			manage.setCoefficient(obj.getCoefficient());
			id = manageQuantityConsXnxdDAO.saveObject(manage.toModel());
		}
		
		return id;
	}
	
	public DataListDTO doSearchRevenueXnxd(ManageRevenueConsXnxdDTO obj) {
		List<ManageRevenueConsXnxdDTO> ls = manageRevenueConsXnxdDAO.doSearchRevenueXnxd(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setSize(obj.getTotalRecord());
		data.setStart(obj.getPage().intValue());
		data.setTotal(obj.getTotalRecord());
		return data;
	}
	
	public Long saveRevenueCons(ManageRevenueConsXnxdDTO obj) {
		ManageRevenueConsXnxdDTO dto = manageRevenueConsXnxdDAO.checkDuplicateYear(obj.getYear(), obj.getCntContractId());
		if(dto!=null) {
			throw new BusinessException("Doanh thu của hợp đồng "+ obj.getCntContractCode() +" năm "+ obj.getYear() + " đã tồn tại");
		}
		Long id = manageRevenueConsXnxdDAO.saveObject(obj.toModel());
		return id;
	}
	
	public Long updateRevenueCons(ManageRevenueConsXnxdDTO obj) {
		Long id=null;
		if(obj.getManageRevenueConsXnxdId() !=null){
			manageRevenueConsXnxdDAO.UpdateContractRevuenue(obj);
			id = manageRevenueConsXnxdDAO.updateObject(obj.toModel());
		}else{
			manageRevenueConsXnxdDAO.UpdateContractRevuenue(obj);
			id = manageRevenueConsXnxdDAO.saveObject(obj.toModel());
		}
		return id;
	}
	
	public String exportQuantityConsXnxd(ManageQuantityConsXnxdDTO obj) throws Exception {
		// WorkItemDetailDTO obj = new WorkItemDetailDTO();
		obj.setPage(null);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "TheoDoiSanLuongCongTrinh.xlsx"));
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
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "TheoDoiSanLuongCongTrinh.xlsx");
		
		List<ManageQuantityConsXnxdDTO> data = manageQuantityConsXnxdDAO.doSearchContractXNXD(obj);
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		
		List<ManageQuantityConsXnxdDTO> dataReport = manageQuantityConsXnxdDAO.doSearchReportQuantity(obj);
		
		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
			// HuyPQ-22/08/2018-start
			XSSFCellStyle styleCenter = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleCenter.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			
			XSSFCellStyle styleCurrency = ExcelUtils.styleNumber(sheet);
			styleCurrency.setDataFormat(workbook.createDataFormat().getFormat("#,##0"));
			styleCurrency.setAlignment(HorizontalAlignment.RIGHT);
			
			XSSFFont font= workbook.createFont();
		    font.setBold(true);
		    font.setItalic(false);
		    font.setFontName("Times New Roman");
			font.setFontHeightInPoints((short)12);
			
			XSSFCellStyle styleYear = ExcelUtils.styleText(sheet);
			styleYear.setAlignment(HorizontalAlignment.CENTER);
			styleYear.setFont(font);
			styleYear.setFillBackgroundColor(IndexedColors.LIGHT_GREEN.getIndex());
//			styleYear.setFillPattern(CellStyle.SOLID_FOREGROUND);
			
			Row rowYear = sheet.getRow(1);
			Cell cellYear = rowYear.getCell(8);
			cellYear.setCellValue("Năm "+ obj.getYear());
			cellYear.setCellStyle(styleYear);
			
			int i = 3;
			for (ManageQuantityConsXnxdDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 3));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getContent() != null) ? dto.getContent() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getCatPartnerName() != null) ? dto.getCatPartnerName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getCntContractCode() != null) ? dto.getCntContractCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getCntContractPrice() != null) ? dto.getCntContractPrice() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getAccumulateYearAgo() != null) ? dto.getAccumulateYearAgo() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getCoefficient() != null) ? dto.getCoefficient() : 0d);
				cell.setCellStyle(style);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getSourceQuantityYearNow() != null) ? dto.getSourceQuantityYearNow() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityMonth1() != null) ? dto.getValueQuantityMonth1() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityMonth2() != null) ? dto.getValueQuantityMonth2() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityMonth3() != null) ? dto.getValueQuantityMonth3() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityMonth4() != null) ? dto.getValueQuantityMonth4() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(12, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityMonth5() != null) ? dto.getValueQuantityMonth5() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(13, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityMonth6() != null) ? dto.getValueQuantityMonth6() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(14, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityMonth7() != null) ? dto.getValueQuantityMonth7() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(15, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityMonth8() != null) ? dto.getValueQuantityMonth8() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(16, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityMonth9() != null) ? dto.getValueQuantityMonth9() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(17, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityMonth10() != null) ? dto.getValueQuantityMonth10() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(18, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityMonth11() != null) ? dto.getValueQuantityMonth11() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(19, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityMonth12() != null) ? dto.getValueQuantityMonth12() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(20, CellType.STRING);
				cell.setCellValue((dto.getTotalQuantityYear() != null) ? dto.getTotalQuantityYear() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(21, CellType.STRING);
				cell.setCellValue((dto.getAccumulateQuantity() != null) ? dto.getAccumulateQuantity() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(22, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityRest() != null) ? dto.getValueQuantityRest() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(23, CellType.STRING);
				cell.setCellValue((dto.getDescriptionXnxd() != null) ? dto.getDescriptionXnxd() : "");
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(24, CellType.STRING);
				cell.setCellValue((dto.getStructureFilter() != null) ? dto.getStructureFilter() : "");
//				if(obj.getStructureFilter()!=null) {
//					if(obj.getStructureFilter()==1l) {
//						cell.setCellValue("Thi công xây dựng trạm");
//					} else if(obj.getStructureFilter()==2l) {
//						cell.setCellValue("Cáp quang, ngầm hóa");
//					} else if(obj.getStructureFilter()==3l) {
//						cell.setCellValue("Thương mại, dịch vụ");
//					} else if(obj.getStructureFilter()==4l) {
//						cell.setCellValue("Xây dựng cơ bản");
//					}
//				} else {
//					cell.setCellValue("");
//				}
				cell.setCellStyle(style);
			}
		}
		
		XSSFSheet sheet1 = workbook.getSheetAt(1);
		if (dataReport != null && !dataReport.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet1);
			XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet1);
			// HuyPQ-22/08/2018-start
			XSSFCellStyle styleCenter = ExcelUtils.styleDate(sheet1);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleCenter.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			
			XSSFFont font= workbook.createFont();
		    font.setBold(true);
		    font.setItalic(false);
		    font.setFontName("Times New Roman");
			font.setFontHeightInPoints((short)12);
			
			XSSFCellStyle styleCurrency = ExcelUtils.styleNumber(sheet);
			styleCurrency.setDataFormat(workbook.createDataFormat().getFormat("#,##0"));
			styleCurrency.setAlignment(HorizontalAlignment.RIGHT);
			
			XSSFCellStyle styleYear = ExcelUtils.styleText(sheet1);
			styleYear.setAlignment(HorizontalAlignment.CENTER);
			styleYear.setFont(font);
			styleYear.setFillBackgroundColor(IndexedColors.LIGHT_GREEN.getIndex());
//			styleYear.setFillPattern(CellStyle.SOLID_FOREGROUND);
			
			Row rowYear = sheet1.getRow(0);
			Cell cellYear = rowYear.getCell(0);
			cellYear.setCellValue("BÁO CÁO CƠ CẤU SẢN LƯỢNG NĂM "+ obj.getYear());
			cellYear.setCellStyle(styleYear);
			
			int z = 2;
			for (ManageQuantityConsXnxdDTO dto : dataReport) {
				Row row = sheet1.createRow(z++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (z - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getStructureFilter() != null) ? dto.getStructureFilter() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getCntContractPrice() != null) ? dto.getCntContractPrice() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getAccumulateYearAgo() != null) ? dto.getAccumulateYearAgo() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getSourceQuantityYearNow() != null) ? dto.getSourceQuantityYearNow() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getTotalQuantityYear() != null) ? dto.getTotalQuantityYear() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getAccumulateQuantity() != null) ? dto.getAccumulateQuantity() : 0d);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityRest() != null) ? dto.getValueQuantityRest() : 0l);
				cell.setCellStyle(styleCurrency);
			}
		}
		
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "TheoDoiSanLuongCongTrinh.xlsx");
		return path;
	}
	
	public String exportRevenueConsXnxd(ManageRevenueConsXnxdDTO obj) throws Exception {
		// WorkItemDetailDTO obj = new WorkItemDetailDTO();
		obj.setPage(null);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "TheoDoiDoanhThuCongTrinh.xlsx"));
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
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "TheoDoiDoanhThuCongTrinh.xlsx");
		List<ManageRevenueConsXnxdDTO> data = manageRevenueConsXnxdDAO.doSearchRevenueXnxd(obj);
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		
		List<ManageRevenueConsXnxdDTO> dataReport = manageRevenueConsXnxdDAO.doSearchReportRevenue(obj);
		
		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
			// HuyPQ-22/08/2018-start
			XSSFCellStyle styleCenter = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleCenter.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			
			XSSFCellStyle styleCurrency = ExcelUtils.styleNumber(sheet);
			styleCurrency.setDataFormat(workbook.createDataFormat().getFormat("#,##0"));
			styleCurrency.setAlignment(HorizontalAlignment.RIGHT);
			
			XSSFFont font= workbook.createFont();
		    font.setBold(true);
		    font.setItalic(false);
		    font.setFontName("Times New Roman");
			font.setFontHeightInPoints((short)12);
			
			CellStyle styleYear = ExcelUtils.styleText(sheet);
			styleYear.setAlignment(HorizontalAlignment.CENTER);
			styleYear.setFont(font);
			styleYear.setFillBackgroundColor(IndexedColors.LIGHT_GREEN.getIndex());
//			styleYear.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			
			Row rowTitle = sheet.getRow(0);
			Cell cellTitle = rowTitle.getCell(0);
			cellTitle.setCellValue("BẢNG TỔNG HỢP DOANH THU NĂM " + obj.getYear());
			cellTitle.setCellStyle(styleYear);
			
			Row rowTitle2 = sheet.getRow(1);
			Cell cellTitle2 = rowTitle2.getCell(8);
			cellTitle2.setCellValue("Kế hoạch lên doanh thu năm " + obj.getYear());
			cellTitle2.setCellStyle(styleYear);
			
			Row rowYear = sheet.getRow(2);
			Cell cellYear = rowYear.getCell(8);
			cellYear.setCellValue("Năm "+ obj.getYear());
			cellYear.setCellStyle(styleYear);
			
			int i = 4;
			for (ManageRevenueConsXnxdDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 4));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getContent() != null) ? dto.getContent() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getCatPartnerName() != null) ? dto.getCatPartnerName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getCntContractCode() != null) ? dto.getCntContractCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getCntContractPrice() != null) ? dto.getCntContractPrice() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getAccumulateYearAgo() != null) ? dto.getAccumulateYearAgo() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getCoefficient() != null) ? dto.getCoefficient() : 0d);
				cell.setCellStyle(style);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getSourceRevenueRest() != null) ? dto.getSourceRevenueRest() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue((dto.getMonth1() != null) ? dto.getMonth1() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue((dto.getMonth2() != null) ? dto.getMonth2() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue((dto.getMonth3() != null) ? dto.getMonth3() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue((dto.getMonth4() != null) ? dto.getMonth4() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(12, CellType.STRING);
				cell.setCellValue((dto.getMonth5() != null) ? dto.getMonth5() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(13, CellType.STRING);
				cell.setCellValue((dto.getMonth6() != null) ? dto.getMonth6() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(14, CellType.STRING);
				cell.setCellValue((dto.getMonth7() != null) ? dto.getMonth7() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(15, CellType.STRING);
				cell.setCellValue((dto.getMonth8() != null) ? dto.getMonth8() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(16, CellType.STRING);
				cell.setCellValue((dto.getMonth9() != null) ? dto.getMonth9() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(17, CellType.STRING);
				cell.setCellValue((dto.getMonth10() != null) ? dto.getMonth10() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(18, CellType.STRING);
				cell.setCellValue((dto.getMonth11() != null) ? dto.getMonth11() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(19, CellType.STRING);
				cell.setCellValue((dto.getMonth12() != null) ? dto.getMonth12() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(20, CellType.STRING);
				cell.setCellValue((dto.getTotalQuantityYear() != null) ? dto.getTotalQuantityYear() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(21, CellType.STRING);
				cell.setCellValue((dto.getAccumulateRevenue() != null) ? dto.getAccumulateRevenue() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(22, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityNotRevenue() != null) ? dto.getValueQuantityNotRevenue() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(23, CellType.STRING);
				cell.setCellValue((dto.getDescription() != null) ? dto.getDescription() : "");
				cell.setCellStyle(style);
				cell = row.createCell(24, CellType.STRING);
				cell.setCellValue((dto.getProfitRate() != null) ? dto.getProfitRate() : 0d);
				cell.setCellStyle(style);
				cell = row.createCell(25, CellType.STRING);
				cell.setCellValue((dto.getProfit() != null) ? dto.getProfit() : 0d);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(26, CellType.STRING);
				cell.setCellValue((dto.getStructureFilter() != null) ? dto.getStructureFilter() : "");
//				if(obj.getStructureFilter()!=null) {
//					if(obj.getStructureFilter()==1l) {
//						cell.setCellValue("Thi công xây dựng trạm");
//					} else if(obj.getStructureFilter()==2l) {
//						cell.setCellValue("Cáp quang, ngầm hóa");
//					} else if(obj.getStructureFilter()==3l) {
//						cell.setCellValue("Thương mại, dịch vụ");
//					} else if(obj.getStructureFilter()==4l) {
//						cell.setCellValue("Xây dựng cơ bản");
//					}
//				} else {
//					cell.setCellValue("");
//				}
				cell.setCellStyle(style);
			}
		}
		
		XSSFSheet sheet1 = workbook.getSheetAt(1);
		if (dataReport != null && !dataReport.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet1);
			XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet1);
			// HuyPQ-22/08/2018-start
			XSSFCellStyle styleCenter = ExcelUtils.styleDate(sheet1);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleCenter.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			
			XSSFFont font= workbook.createFont();
		    font.setBold(true);
		    font.setItalic(false);
		    font.setFontName("Times New Roman");
			font.setFontHeightInPoints((short)12);
			
			XSSFCellStyle styleCurrency = ExcelUtils.styleNumber(sheet);
			styleCurrency.setDataFormat(workbook.createDataFormat().getFormat("#,##0"));
			styleCurrency.setAlignment(HorizontalAlignment.RIGHT);
			
			XSSFCellStyle styleYear = ExcelUtils.styleText(sheet1);
			styleYear.setAlignment(HorizontalAlignment.CENTER);
			styleYear.setFont(font);
			styleYear.setFillBackgroundColor(IndexedColors.LIGHT_GREEN.getIndex());
//			styleYear.setFillPattern(CellStyle.SOLID_FOREGROUND);
			
			Row rowYear = sheet1.getRow(0);
			Cell cellYear = rowYear.getCell(0);
			cellYear.setCellValue("BÁO CÁO CƠ CẤU DOANH THU NĂM "+ obj.getYear());
			cellYear.setCellStyle(styleYear);
			
			int z = 2;
			for (ManageRevenueConsXnxdDTO dto : dataReport) {
				Row row = sheet1.createRow(z++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (z - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getStructureFilter() != null) ? dto.getStructureFilter() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getCntContractPrice() != null) ? dto.getCntContractPrice() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getAccumulateYearAgo() != null) ? dto.getAccumulateYearAgo() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getSourceRevenueRest() != null) ? dto.getSourceRevenueRest() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getTotalQuantityYear() != null) ? dto.getTotalQuantityYear() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getAccumulateRevenue() != null) ? dto.getAccumulateRevenue() : 0d);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityNotRevenue() != null) ? dto.getValueQuantityNotRevenue() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue((dto.getProfit() != null) ? dto.getProfit() : 0l);
				cell.setCellStyle(styleCurrency);
			}
		}
		
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "TheoDoiDoanhThuCongTrinh.xlsx");
		return path;
	}
	
	//Export file Báo cáo sản lượng doanh thu
	public String exportQuantityRevenueConsXnxd(ManageQuantityConsXnxdDTO obj) throws Exception {
		// WorkItemDetailDTO obj = new WorkItemDetailDTO();
		obj.setPage(null);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "BM_Theo_doi_san_luong_doanh_thu.xlsx"));
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
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "BM_Theo_doi_san_luong_doanh_thu.xlsx");
		List<ManageQuantityConsXnxdDTO> data = manageQuantityConsXnxdDAO.doSearchQuantityRevenue(obj);
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		
		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
			// HuyPQ-22/08/2018-start
			XSSFCellStyle styleCenter = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleCenter.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			
			XSSFCellStyle styleCurrency = ExcelUtils.styleNumber(sheet);
			styleCurrency.setDataFormat(workbook.createDataFormat().getFormat("#,##0"));
			styleCurrency.setAlignment(HorizontalAlignment.RIGHT);
			
			XSSFFont font= workbook.createFont();
		    font.setBold(true);
		    font.setItalic(false);
		    font.setFontName("Times New Roman");
			font.setFontHeightInPoints((short)12);
			
			CellStyle styleYear = ExcelUtils.styleText(sheet);
			styleYear.setAlignment(HorizontalAlignment.CENTER);
			styleYear.setFont(font);
			styleYear.setFillBackgroundColor(IndexedColors.LIGHT_GREEN.getIndex());
//			styleYear.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			
			Row rowTitle = sheet.getRow(0);
			Cell cellTitle = rowTitle.getCell(0);
			cellTitle.setCellValue("BÁO CÁO THEO DÕI SẢN LƯỢNG DOANH THU NĂM " + obj.getYear());
			cellTitle.setCellStyle(styleYear);
			
			int i = 2;
			for (ManageQuantityConsXnxdDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getContent() != null) ? dto.getContent() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getCatPartnerName() != null) ? dto.getCatPartnerName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getCntContractCode() != null) ? dto.getCntContractCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getCntContractPrice() != null) ? dto.getCntContractPrice() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getTotalQuantityYear() != null) ? dto.getTotalQuantityYear() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getAccumulateQuantity() != null) ? dto.getAccumulateQuantity() : 0d);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getTotalQuantityYearDt() != null) ? dto.getTotalQuantityYearDt() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue((dto.getAccumulateRevenue() != null) ? dto.getAccumulateRevenue() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityRest() != null) ? dto.getValueQuantityRest() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue((dto.getValueQuantityNotRevenue() != null) ? dto.getValueQuantityNotRevenue() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue((dto.getValueRevenueRest() != null) ? dto.getValueRevenueRest() : 0l);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(12, CellType.STRING);
				cell.setCellValue((dto.getDescriptionXnxd() != null) ? dto.getDescriptionXnxd() : "");
				cell.setCellStyle(style);
				cell = row.createCell(13, CellType.STRING);
				cell.setCellValue((dto.getStructureFilter() != null) ? dto.getStructureFilter() : "");
				cell.setCellStyle(style);
			}
		}
		
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "BM_Theo_doi_san_luong_doanh_thu.xlsx");
		return path;
	}
	
	
	public DataListDTO doSearchReportQuantity(ManageQuantityConsXnxdDTO obj) {
		List<ManageQuantityConsXnxdDTO> ls = manageQuantityConsXnxdDAO.doSearchReportQuantity(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setSize(obj.getTotalRecord());
		data.setStart(obj.getPage().intValue());
		data.setTotal(obj.getTotalRecord());
		return data;
	}
	
	public DataListDTO doSearchReportRevenue(ManageRevenueConsXnxdDTO obj) {
		List<ManageRevenueConsXnxdDTO> ls = manageRevenueConsXnxdDAO.doSearchReportRevenue(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setSize(obj.getTotalRecord());
		data.setStart(obj.getPage().intValue());
		data.setTotal(obj.getTotalRecord());
		return data;
	}
	
	public DataListDTO doSearchQuantityRevenue(ManageQuantityConsXnxdDTO obj) {
		List<ManageQuantityConsXnxdDTO> ls = manageQuantityConsXnxdDAO.doSearchQuantityRevenue(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setSize(obj.getTotalRecord());
		data.setStart(obj.getPage().intValue());
		data.setTotal(obj.getTotalRecord());
		return data;
	}
	//Huy-end
}
