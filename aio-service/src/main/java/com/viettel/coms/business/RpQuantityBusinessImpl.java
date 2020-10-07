package com.viettel.coms.business;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFCreationHelper;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import com.viettel.coms.bo.WorkItemBO;
import com.viettel.coms.dao.RpQuantityDAO;
import com.viettel.coms.dto.RpConstructionDTO;
import com.viettel.coms.dto.WorkItemDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;
import com.viettel.coms.dto.couponExportDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.coms.utils.PermissionUtils;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;

@Service("rpQuantityBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RpQuantityBusinessImpl extends BaseFWBusinessImpl<RpQuantityDAO, WorkItemDTO, WorkItemBO> implements RpQuantityBusiness{
	
	@Autowired
	private RpQuantityDAO rpQuantityDAO;
	
	@Value("${folder_upload2}")
	private String folder2Upload;
	@Value("${default_sub_folder_upload}")
	private String defaultSubFolderUpload;
	
	public RpQuantityBusinessImpl() {
		tModel = new WorkItemBO();
		tDAO = rpQuantityDAO;
	}

	@Override
	public RpQuantityDAO gettDAO() {
		return rpQuantityDAO;
	}
	
	public DataListDTO doSearchQuantity(WorkItemDetailDTO obj, HttpServletRequest request) {
		List<WorkItemDetailDTO> ls = new ArrayList<WorkItemDetailDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty()) {
			ls = rpQuantityDAO.doSearchQuantity(obj, groupIdList);
		}
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
//	hungtd_20181217_start
	public DataListDTO doSearch(RpConstructionDTO obj, HttpServletRequest request) {
		List<RpConstructionDTO> ls = new ArrayList<RpConstructionDTO>();
		ls = rpQuantityDAO.doSearch(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
	//NHAN_BGMB
	public DataListDTO doSearchNHAN(RpConstructionDTO obj, HttpServletRequest request) {
		List<RpConstructionDTO> ls = new ArrayList<RpConstructionDTO>();
		ls = rpQuantityDAO.doSearchNHAN(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
	//KC
	public DataListDTO doSearchKC(RpConstructionDTO obj, HttpServletRequest request) {
		List<RpConstructionDTO> ls = new ArrayList<RpConstructionDTO>();
		ls = rpQuantityDAO.doSearchKC(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
	//TONTHICON
	public DataListDTO doSearchTONTC(RpConstructionDTO obj, HttpServletRequest request) {
		List<RpConstructionDTO> ls = new ArrayList<RpConstructionDTO>();
		ls = rpQuantityDAO.doSearchTONTC(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
	public DataListDTO doSearchHSHC(RpConstructionDTO obj, HttpServletRequest request) {
		List<RpConstructionDTO> ls = new ArrayList<RpConstructionDTO>();
		ls = rpQuantityDAO.doSearchHSHC(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
	public String export(RpConstructionDTO obj, HttpServletRequest request) throws Exception {
		obj.setPage(1L);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Export_Danh_sach_thong_tin_BGMB_detail.xlsx"));
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
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "Export_Danh_sach_thong_tin_BGMB_detail.xlsx");
		List provinceListId = PermissionUtils.getListIdInDomainData(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<RpConstructionDTO> data = new ArrayList<RpConstructionDTO>();
		if (provinceListId != null && !provinceListId.isEmpty()) {
			data = rpQuantityDAO.doSearchNHAN(obj);
		}
		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			// HuyPQ-17/08/2018-edit-start
			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			// HuyPQ-17/08/2018-edit-end
			// HuyPQ-22/08/2018-edit-start
			XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			styleDate.setAlignment(HorizontalAlignment.CENTER);
			int i = 2;
			RpConstructionDTO objCount = null;
			for (RpConstructionDTO dto : data) {
				if (i == 2) {
					objCount = dto;
				}
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getSysgroupname() != null) ? dto.getSysgroupname() : "");
				cell.setCellStyle(styleDate);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getCatprovincecode() != null) ? dto.getCatprovincecode() : "");
				cell.setCellStyle(style);
//				hoanm1_20181011_start
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getCatstattionhousecode() != null) ? dto.getCatstattionhousecode() : "");
				cell.setCellStyle(style);
//				hoanm1_20181011_end
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getCntContractCodeBGMB() != null) ? dto.getCntContractCodeBGMB() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getCompanyassigndate() != null) ? dto.getCompanyassigndate() : "");
				cell.setCellStyle(style);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getHeightTM() != null) ? dto.getHeightTM() : 0);
				cell.setCellStyle(style);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getNumberCoTM() != null) ? dto.getNumberCoTM() : 0);
				cell.setCellStyle(style);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue((dto.getHouseTypeNameTM() != null) ? dto.getHouseTypeNameTM() : "");
				cell.setCellStyle(style);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue((dto.getHeightDD() != null) ? dto.getHeightDD() : 0);
				cell.setCellStyle(style);
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue((dto.getNumberCoDD() != null) ? dto.getNumberCoDD() : 0);
				cell.setCellStyle(style);
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue((dto.getHouseTypeNameDD() != null) ? dto.getHouseTypeNameDD() : "");
				cell.setCellStyle(style);
				cell = row.createCell(12, CellType.STRING);
				cell.setCellValue((dto.getGroundingTypeName() != null) ? dto.getGroundingTypeName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(13, CellType.STRING);
				cell.setCellValue((dto.getDescription() != null) ? dto.getDescription() : "");
				cell.setCellStyle(style);
			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();
		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Export_Danh_sach_thong_tin_BGMB_detail.xlsx");
		return path;
	}
//	hungtd_20181217_end
	
	public String exportWorkItemServiceTask(WorkItemDetailDTO obj, HttpServletRequest request) throws Exception {
		obj.setPage(1L);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Export_sanluong_detail.xlsx"));
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
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "Export_sanluong_detail.xlsx");
		List provinceListId = PermissionUtils.getListIdInDomainData(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<WorkItemDetailDTO> data = new ArrayList<WorkItemDetailDTO>();
		if (provinceListId != null && !provinceListId.isEmpty()) {
			data = rpQuantityDAO.doSearchQuantity(obj, provinceListId);
		}
		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			// HuyPQ-17/08/2018-edit-start
			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			// HuyPQ-17/08/2018-edit-end
			// HuyPQ-22/08/2018-edit-start
			XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			styleDate.setAlignment(HorizontalAlignment.CENTER);
			int i = 2;
			WorkItemDetailDTO objCount = null;
			for (WorkItemDetailDTO dto : data) {
				if (i == 2) {
					objCount = dto;
				}
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getDateComplete() != null) ? dto.getDateComplete() : "");
				cell.setCellStyle(styleDate);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getConstructorName() != null) ? dto.getConstructorName() : "");
				cell.setCellStyle(style);
//				hoanm1_20181011_start
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getConstructorName1() != null) ? dto.getConstructorName1() : "");
				cell.setCellStyle(style);
//				hoanm1_20181011_end
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getCatstationCode() != null) ? dto.getCatstationCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getName() != null) ? dto.getName() : "");
				cell.setCellStyle(style);
				// HuyPQ-17/08/2018-edit-start
				cell = row.createCell(7, CellType.NUMERIC);
				cell.setCellValue((dto.getQuantity() != null) ? dto.getQuantity() : 0);
				cell.setCellStyle(styleNumber);
				// HuyPQ-17/08/2018-edit-end
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue(getStringForStatus(dto.getStatus()));
				cell.setCellStyle(style);
//				cell = row.createCell(8, CellType.STRING);
//				cell.setCellValue((dto.getCatProvinceCode() != null) ? dto.getCatProvinceCode() : "");
//				cell.setCellStyle(style);
//				cell = row.createCell(9, CellType.STRING);
//				cell.setCellValue((dto.getPerformerName() != null) ? dto.getPerformerName() : "");
//				cell.setCellStyle(style);
//				// HuyPQ-22/08/2018-edit-start
//				cell = row.createCell(10, CellType.STRING);
//				cell.setCellValue((dto.getCompleteDate() != null) ? dto.getCompleteDate() : null);
//				cell.setCellStyle(styleDate);
				// HuyPQ-end
			}
			Row row = sheet.createRow(i++);
			Cell cell = row.createCell(1, CellType.STRING);
			cell.setCellValue(objCount == null ? 0 : objCount.getCountDateComplete());
			cell.setCellStyle(styleNumber);
			Cell cellCat = row.createCell(4, CellType.STRING);
			cellCat.setCellValue(objCount == null ? 0 : objCount.getCountCatstationCode());
			cellCat.setCellStyle(styleNumber);
			Cell cellConstr = row.createCell(5, CellType.STRING);
			cellConstr.setCellValue(objCount == null ? 0 : objCount.getCountConstructionCode());
			cellConstr.setCellStyle(styleNumber);
			Cell cellWI = row.createCell(6, CellType.STRING);
			cellWI.setCellValue(objCount == null ? 0 : objCount.getCountWorkItemName());
			cellWI.setCellStyle(styleNumber);
			Cell cellQ = row.createCell(7, CellType.STRING);
			cellQ.setCellValue(objCount == null ? "0" : numberFormat(objCount.getTotalQuantity()));
			cellQ.setCellStyle(styleNumber);
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();
		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Export_sanluong_detail.xlsx");
		return path;
	}
	
	private String numberFormat(double value) {
		DecimalFormat myFormatter = new DecimalFormat("###,###.####");
//		NumberFormat numEN = NumberFormat.getPercentInstance();
		String percentageEN = myFormatter.format(value);
		
		return percentageEN;
	}

	private String getStringForStatus(String status) {
		// TODO Auto-generated method stub
		if ("1".equals(status)) {
			return "Chưa thực hiện";
		} else if ("2".equals(status)) {
			return "Đang thực hiện";
		} else if ("3".equals(status)) {
			return "Đã hoàn thành";
		}
		return null;
	}

	@Override
	public List<RpConstructionDTO> doSearch(RpConstructionDTO obj) {
		// TODO Auto-generated method stub
		return null;
	}
//	hungtd_20192101_start
	public DataListDTO doSearchCoupon(couponExportDTO obj, HttpServletRequest request) {
		List<couponExportDTO> ls = new ArrayList<couponExportDTO>();
		ls = rpQuantityDAO.doSearchCoupon(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
//	hungtd_20192101_end
//	hungtd_20192101_start
	public DataListDTO doSearchPopup(couponExportDTO obj, HttpServletRequest request) {
		List<couponExportDTO> ls = new ArrayList<couponExportDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty()) {
			ls = rpQuantityDAO.doSearchPopup(obj);
		}
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
//	hungtd_20192101_end
}
