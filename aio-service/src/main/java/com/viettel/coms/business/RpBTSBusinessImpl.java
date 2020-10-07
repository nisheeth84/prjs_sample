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
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.RpBTSDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.service.base.utils.StringUtils;
import com.viettel.utils.DateTimeUtils;

@Service("rpBTSBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RpBTSBusinessImpl extends BaseFWBusinessImpl<RpBTSDAO, RpBTSDTO, WorkItemBO> implements RpBTSBusiness {

	@Autowired
    private RpBTSDAO rpBTSDAO;
	@Value("${folder_upload2}")
	private String folder2Upload;
	@Value("${default_sub_folder_upload}")
	private String defaultSubFolderUpload;
	@Autowired
	UtilAttachDocumentDAO utilAttachDocumentDAO;
	
	public RpBTSBusinessImpl() {
        tModel = new WorkItemBO();
        tDAO = rpBTSDAO;
    }

    @Override
    public RpBTSDAO gettDAO() {
        return rpBTSDAO;
    }

    

    public DataListDTO doSearchBTS(RpBTSDTO obj) {
        List<RpBTSDTO> ls = rpBTSDAO.doSearchBTS(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

	@Override
	public long count() {
		return rpBTSDAO.count("RpBTSBO", null);
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
	
	public String exportCompleteProgressBTS(RpBTSDTO obj) throws Exception {
		obj.setPage(null);
		obj.setPageSize(null);
		Date dateNow = new Date();
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "RpBTS_excel.xlsx"));
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
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "RpBTS_excel.xlsx");
		List<RpBTSDTO> data = rpBTSDAO.doSearchBTS(obj);
		XSSFSheet sheet = workbook.getSheetAt(0);
		XSSFCellStyle stt = ExcelUtils.styleText(sheet);
		stt.setAlignment(HorizontalAlignment.CENTER);
		Row rowS12 = sheet.createRow(2);
		Cell cellS12 = rowS12.createCell(11, CellType.STRING);
		cellS12.setCellValue("Ngày lập báo cáo:  " + (DateTimeUtils.convertDateToString(dateNow, "dd/MM/yyyy")));
		cellS12.setCellStyle(stt);

		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("0"));
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			XSSFCellStyle styleCenter = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleCenter.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			int i = 5;
			for (RpBTSDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue(0 + (i - 5));
				cell.setCellStyle(stt);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getChiNhanh() != null) ? dto.getChiNhanh() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getProvinceCode() != null) ? dto.getProvinceCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getXDTongTram() != null) ? dto.getXDTongTram() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getXDDaCoMb() != null) ? dto.getXDDaCoMb() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getXDCanGPXD() != null) ? dto.getXDCanGPXD() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getXDDaCoGPXD() != null) ? dto.getXDDaCoGPXD() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getXDChuaCo() != null) ? dto.getXDChuaCo() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue((dto.getXDDuDKNhanBGMB() != null) ? dto.getXDDuDKNhanBGMB() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue((dto.getXDDaNhanBGMB() != null) ? dto.getXDDaNhanBGMB() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue((dto.getXDDuDKChuaDiNhan() != null) ? dto.getXDDuDKChuaDiNhan() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue((dto.getXDDaVaoTK() != null) ? dto.getXDDaVaoTK() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(12, CellType.STRING);
				cell.setCellValue((dto.getXDNhanChuaTK() != null) ? dto.getXDNhanChuaTK() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(13, CellType.STRING);
				cell.setCellValue((dto.getXDDangTKXDDoDang() != null) ? dto.getXDDangTKXDDoDang() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(14, CellType.STRING);
				cell.setCellValue((dto.getXDTCQuaHan() != null) ? dto.getXDTCQuaHan() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(15, CellType.STRING);
				cell.setCellValue((dto.getCDNhanBGDiemDauNoi() != null) ? dto.getCDNhanBGDiemDauNoi() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(16, CellType.STRING);
				cell.setCellValue((dto.getCDVuong() != null) ? dto.getCDVuong() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(17, CellType.STRING);
				cell.setCellValue((dto.getCDDangTK() != null) ? dto.getCDDangTK() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(18, CellType.STRING);
				cell.setCellValue((dto.getCDChuaTK() != null) ? dto.getCDChuaTK() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(19, CellType.STRING);
				cell.setCellValue((dto.getCDTCXongDien() != null) ? dto.getCDTCXongDien() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(20, CellType.STRING);
				cell.setCellValue((dto.getLDDuDKChuaCap() != null) ? dto.getLDDuDKChuaCap() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(21, CellType.STRING);
				cell.setCellValue((dto.getLDCapChuaLap() != null) ? dto.getLDCapChuaLap() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(22, CellType.STRING);
				cell.setCellValue((dto.getLDVuongLD() != null) ? dto.getLDVuongLD() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(23, CellType.STRING);
				cell.setCellValue((dto.getLDDangLap() != null) ? dto.getLDDangLap() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(24, CellType.STRING);
				cell.setCellValue((dto.getLDTCXongLapDung() != null) ? dto.getLDTCXongLapDung() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(25, CellType.STRING);
				cell.setCellValue((dto.getBTSDuDKChuaCapBTS() != null) ? dto.getBTSDuDKChuaCapBTS() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(26, CellType.STRING);
				cell.setCellValue((dto.getBTSCapChuaLap() != null) ? dto.getBTSCapChuaLap() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(27, CellType.STRING);
				cell.setCellValue((dto.getBTSDangLap() != null) ? dto.getBTSDangLap() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(28, CellType.STRING);
				cell.setCellValue((dto.getBTSTCXongBTS() != null) ? dto.getBTSTCXongBTS() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(29, CellType.STRING);
				cell.setCellValue((dto.getTramXongDB() != null) ? dto.getTramXongDB() : 0);
				cell.setCellStyle(styleNumber);
			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "RpBTS_excel.xlsx");
		return path;
	}
}
