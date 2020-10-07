package com.viettel.coms.business;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.activation.DataHandler;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
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
import com.viettel.coms.dao.RpBTSDAO;
import com.viettel.coms.dao.RpGiaCoCotDAO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.RpBTSDTO;
import com.viettel.coms.dto.RpGiaCoCotDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.service.base.utils.StringUtils;
import com.viettel.utils.DateTimeUtils;

@Service("rpGiaCoCotBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RpGiaCoCotBusinessImpl extends BaseFWBusinessImpl<RpGiaCoCotDAO, RpGiaCoCotDTO, WorkItemBO> implements RpGiaCoCotBusiness {

	@Autowired
    private RpGiaCoCotDAO rpGiaCoCotDAO;
	@Value("${folder_upload2}")
	private String folder2Upload;
	@Value("${default_sub_folder_upload}")
	private String defaultSubFolderUpload;
	@Autowired
	UtilAttachDocumentDAO utilAttachDocumentDAO;
	
	public RpGiaCoCotBusinessImpl() {
        tModel = new WorkItemBO();
        tDAO = rpGiaCoCotDAO;
    }

    @Override
    public RpGiaCoCotDAO gettDAO() {
        return rpGiaCoCotDAO;
    }

    

    public DataListDTO doSearchGiaCoCot(RpGiaCoCotDTO obj) {
        List<RpGiaCoCotDTO> ls = rpGiaCoCotDAO.doSearchGiaCoCot(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

	@Override
	public long count() {
		return rpGiaCoCotDAO.count("WorkItemBO", null);
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
			if (cell != null && cell.getCellType() != Cell.CELL_TYPE_BLANK
					&& !StringUtils.isStringNullOrEmpty(cell.toString())) {
				return false;
			}
		}
		return true;
	}
	
	private List<String> getStationCodeLst(InputStream inputStream) throws Exception {
		List<String> stationLst = new ArrayList<String>();
		XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
		XSSFSheet sheet = workbook.getSheetAt(0);
		int count = 0;
		DataFormatter formatter = new DataFormatter();
		int countRowBlank = 0;
		for (Row row : sheet) {
			count++;
			if (count < 4)
				continue;
			if (checkIfRowIsEmpty(row)) {
				countRowBlank++;
				if (countRowBlank >= 3)
					break;
				else
					continue;
			}
			if (countRowBlank >= 3)
				break;
			countRowBlank = 0;
			String code = formatter.formatCellValue(row.getCell(0));
			stationLst.add(code.trim());
		}
		workbook.close();
		return stationLst;
	}
	
	private List<String> getContractCodeLst(InputStream inputStream) throws Exception {
		List<String> contractCodeLst = new ArrayList<String>();
		XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
		XSSFSheet sheet = workbook.getSheetAt(0);
		int count = 0;
		DataFormatter formatter = new DataFormatter();
		int countRowBlank = 0;
		for (Row row : sheet) {
			count++;
			if (count < 4)
				continue;
			if (checkIfRowIsEmpty(row)) {
				countRowBlank++;
				if (countRowBlank >= 3)
					break;
				else
					continue;
			}
			if (countRowBlank >= 3)
				break;
			countRowBlank = 0;
			String code = formatter.formatCellValue(row.getCell(0));
			contractCodeLst.add(code.trim());
		}
		workbook.close();
		return contractCodeLst;
	}
	
	public List<String> readFileStation(Attachment attachments) throws Exception {
		DataHandler dataHandler = attachments.getDataHandler();
		InputStream inputStream = dataHandler.getInputStream();
		return getStationCodeLst(inputStream);
	}
	
	public List<String> readFileContract(Attachment attachments) throws Exception {
		DataHandler dataHandler = attachments.getDataHandler();
		InputStream inputStream = dataHandler.getInputStream();
		return getContractCodeLst(inputStream);
	}
	
	public String exportCompleteProgress(RpGiaCoCotDTO obj) throws Exception {
		obj.setPage(null);
		obj.setPageSize(null);
		Date dateNow = new Date();
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "RpGiaCo_excel.xlsx"));
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
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "RpGiaCo_excel.xlsx");
		List<RpGiaCoCotDTO> data = rpGiaCoCotDAO.doSearchGiaCoCot(obj);
		XSSFSheet sheet = workbook.getSheetAt(0);
		XSSFCellStyle stt = ExcelUtils.styleText(sheet);
		stt.setAlignment(HorizontalAlignment.CENTER);
		Row rowS12 = sheet.createRow(2);
		Cell cellS12 = rowS12.createCell(10, CellType.STRING);
		cellS12.setCellValue("Ngày lập báo cáo:  " + (DateTimeUtils.convertDateToString(dateNow, "dd/MM/yyyy")));
		cellS12.setCellStyle(stt);
		
		Row rowS13 = sheet.getRow(3);
		Cell cellS13 = rowS13.getCell(19);
		cellS13.setCellValue("KH " + obj.getMonth() + "/" + obj.getYear());
		Cell cellS14 =  rowS13.getCell(23);
		cellS14.setCellValue("KẾT QUẢ THỰC HIỆN " + obj.getMonth() + "/" + obj.getYear());
	
		
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			
			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("0"));
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			
			XSSFCellStyle stylePercent = ExcelUtils.styleNumber(sheet);
			stylePercent.setDataFormat(workbook.createDataFormat().getFormat("0.00%"));
			stylePercent.setAlignment(HorizontalAlignment.RIGHT);
			
			XSSFCellStyle styleCenter = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleCenter.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			int i = 5;
			for (RpGiaCoCotDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue(0 + (i - 5));
				cell.setCellStyle(stt);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getDonVi() != null) ? dto.getDonVi() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getProvinceCode() != null) ? dto.getProvinceCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getTongKH() != null) ? dto.getTongKH() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getChuaDuDKnhanBGMB() != null) ? dto.getChuaDuDKnhanBGMB() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getDuDKNhanBGMB() != null) ? dto.getDuDKNhanBGMB() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getDaNhanBGMB() != null) ? dto.getDaNhanBGMB() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getDaTrienKhai() != null) ? dto.getDaTrienKhai() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue((dto.getXongXD() != null) ? dto.getXongXD() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue((dto.getXongLD() != null) ? dto.getXongLD() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue((dto.getDoiDangXD() != null) ? dto.getDoiDangXD() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue((dto.getTong() != null) ? dto.getTong() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(12, CellType.STRING);
				cell.setCellValue((dto.getChuaNhanBGMB() != null) ? dto.getChuaNhanBGMB() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(13, CellType.STRING);
				cell.setCellValue((dto.getNhanMBChuaTk() != null) ? dto.getNhanMBChuaTk() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(14, CellType.STRING);
				cell.setCellValue((dto.getCapLenTinh() != null) ? dto.getCapLenTinh() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(15, CellType.STRING);
				cell.setCellValue((dto.getXongMongChuaCap() != null) ? dto.getXongMongChuaCap() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(16, CellType.STRING);
				cell.setCellValue((dto.getCapNhungChuaXongMong() != null) ? dto.getCapNhungChuaXongMong() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(17, CellType.STRING);
				cell.setCellValue((dto.getCapChuaLap() != null) ? dto.getCapChuaLap() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(18, CellType.STRING);
				cell.setCellValue((dto.getDangCoDoiLap() != null) ? dto.getDangCoDoiLap() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(19, CellType.STRING);
				cell.setCellValue((dto.getKHXayDung() != null) ? dto.getKHXayDung() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(20, CellType.STRING);
				cell.setCellValue((dto.getKHLapDung() != null) ? dto.getKHLapDung() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(21, CellType.STRING);
				cell.setCellValue((dto.getKHDC() != null) ? dto.getKHDC() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(22, CellType.STRING);
				cell.setCellValue((dto.getVatTuDaDamBao() != null) ? dto.getVatTuDaDamBao() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(23, CellType.STRING);
				cell.setCellValue((dto.getKQXayDung() != null) ? dto.getKQXayDung() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(24, CellType.STRING);
				cell.setCellValue((dto.getKQTH1() != null) ? dto.getKQTH1() : 0);
				cell.setCellStyle(stylePercent);
				cell = row.createCell(25, CellType.STRING);
				cell.setCellValue((dto.getLapCot() != null) ? dto.getLapCot() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(26, CellType.STRING);
				cell.setCellValue((dto.getKQTH2() != null) ? dto.getKQTH2() : 0);
				cell.setCellStyle(stylePercent);
			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "RpGiaCo_excel.xlsx");
		return path;
	}

}
