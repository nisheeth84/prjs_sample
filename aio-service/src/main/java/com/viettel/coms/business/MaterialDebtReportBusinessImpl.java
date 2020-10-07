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
import com.viettel.coms.dao.MaterialDebtReportDAO;
import com.viettel.coms.dao.RpQuantityDAO;
import com.viettel.coms.dto.MaterialDebtReportDTO;
import com.viettel.coms.dto.RpConstructionDTO;
import com.viettel.coms.dto.WorkItemDTO;
import com.viettel.coms.dto.MaterialDebtReportDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.coms.utils.PermissionUtils;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;

@Service("materialDebtReportBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class MaterialDebtReportBusinessImpl extends BaseFWBusinessImpl<MaterialDebtReportDAO, WorkItemDTO, WorkItemBO> implements RpQuantityBusiness{
	
	@Autowired
	private RpQuantityDAO rpQuantityDAO;
	
	@Autowired
	private MaterialDebtReportDAO materialDebtReportDAO;
	
	@Value("${folder_upload2}")
	private String folder2Upload;
	@Value("${default_sub_folder_upload}")
	private String defaultSubFolderUpload;
	
	public MaterialDebtReportBusinessImpl() {
		tModel = new WorkItemBO();
		tDAO = materialDebtReportDAO;
	}

	@Override
	public MaterialDebtReportDAO gettDAO() {
		return materialDebtReportDAO;
	}
	
	public DataListDTO doSearchDetailForReport(MaterialDebtReportDTO obj, HttpServletRequest request) {
		List<MaterialDebtReportDTO> ls = new ArrayList<MaterialDebtReportDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty()) {
			ls = materialDebtReportDAO.doSearchQuantity(obj, groupIdList);
		}
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
	
	public DataListDTO doSearchForReport(MaterialDebtReportDTO obj, HttpServletRequest request) {
		List<MaterialDebtReportDTO> ls = new ArrayList<MaterialDebtReportDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty()) {
			ls = materialDebtReportDAO.doSearchQuantity(obj, groupIdList);
		}
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
	
	public String exportReport(MaterialDebtReportDTO obj, HttpServletRequest request) throws Exception {
		obj.setPage(1L);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Bao_cao_tong_hop_cong_no_vat_tu .xlsx"));
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
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "Bao_cao_tong_hop_cong_no_vat_tu .xlsx");
		List provinceListId = PermissionUtils.getListIdInDomainData(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<MaterialDebtReportDTO> data = new ArrayList<MaterialDebtReportDTO>();
		if (provinceListId != null && !provinceListId.isEmpty()) {
			data = materialDebtReportDAO.doSearchQuantity(obj, provinceListId);
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
			int i = 7;
			MaterialDebtReportDTO objCount = null;
			for (MaterialDebtReportDTO dto : data) {
				if (i == 7) {
					objCount = dto;
				}
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
				cell.setCellStyle(styleDate);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getProvinceName() != null) ? dto.getProvinceName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getSysUserName() != null) ? dto.getSysUserName() : "");
//				cell.setCellValue((dto.getSourceType() != null) ? dto.getSourceType() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getSourceType() != null) ? dto.getSourceType() : "");
				cell.setCellStyle(style);
				// HuyPQ-17/08/2018-edit-start
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getGoodsCode() != null) ? dto.getGoodsCode() : "");
				cell.setCellStyle(styleNumber);
				// HuyPQ-17/08/2018-edit-end
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getGoodsName() != null) ? dto.getGoodsName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue(dto.getState() != null ? dto.getState() : "");
				cell.setCellStyle(style);
				cell = row.createCell(9, CellType.NUMERIC);
				cell.setCellValue(dto.getAmount() != null ? dto.getAmount() : 0);
				cell.setCellStyle(style);
				// HuyPQ-22/08/2018-edit-start
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue(dto.getCatUnitName() != null ? dto.getCatUnitName() : "");
				cell.setCellStyle(styleDate);
				// HuyPQ-17/08/2018-edit-start
				cell = row.createCell(11, CellType.NUMERIC);
				cell.setCellValue(dto.getTotalMoney() != null ? dto.getTotalMoney() : 0);
				cell.setCellStyle(styleNumber);
			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();
		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Bao_cao_tong_hop_cong_no_vat_tu .xlsx");
		return path;
	}
	
	public String exportDetailReport(MaterialDebtReportDTO obj, HttpServletRequest request) throws Exception {
		obj.setPage(1L);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Bao_cao_chi_tiet_cong_no_vat_tu.xlsx"));
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
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "Bao_cao_chi_tiet_cong_no_vat_tu.xlsx");
		List provinceListId = PermissionUtils.getListIdInDomainData(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<MaterialDebtReportDTO> data = new ArrayList<MaterialDebtReportDTO>();
		if (provinceListId != null && !provinceListId.isEmpty()) {
			data = materialDebtReportDAO.doSearchQuantity(obj, provinceListId);
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
			int i = 7;
			MaterialDebtReportDTO objCount = null;
			for (MaterialDebtReportDTO dto : data) {
				if (i == 7) {
					objCount = dto;
				}
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getSysUserName() != null) ? dto.getSysUserName() : "");
				cell.setCellStyle(styleDate);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getProvinceName() != null) ? dto.getProvinceName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getSysUserName() != null) ? dto.getSysUserName() : "");
				cell.setCellValue((dto.getSourceType() != null) ? dto.getSourceType() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getSourceType() != null) ? dto.getSourceType() : "");
				cell.setCellStyle(style);
				// HuyPQ-17/08/2018-edit-start
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getGoodsCode() != null) ? dto.getGoodsCode() : "");
				cell.setCellStyle(styleNumber);
				// HuyPQ-17/08/2018-edit-end
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue(getStringForStatus(dto.getGoodsName()));
				cell.setCellStyle(style);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue(dto.getState());
				cell.setCellStyle(style);
				cell = row.createCell(9, CellType.NUMERIC);
				cell.setCellValue(dto.getAmount());
				cell.setCellStyle(style);
				// HuyPQ-22/08/2018-edit-start
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue(dto.getCatUnitName());
				cell.setCellStyle(styleDate);
				// HuyPQ-17/08/2018-edit-start
				cell = row.createCell(11, CellType.NUMERIC);
				cell.setCellValue(dto.getTotalMoney());
				cell.setCellStyle(styleNumber);
			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();
		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Bao_cao_chi_tiet_cong_no_vat_tu.xlsx");
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

}
