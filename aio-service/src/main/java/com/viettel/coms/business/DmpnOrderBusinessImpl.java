package com.viettel.coms.business;

import com.viettel.coms.bo.DmpnOrderBO;
import com.viettel.coms.dao.DmpnOrderDAO;
import com.viettel.coms.dto.ConstructionTaskDetailDTO;
import com.viettel.coms.dto.DmpnOrderDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.io.*;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

@Service("dmpnOrderBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class DmpnOrderBusinessImpl extends BaseFWBusinessImpl<DmpnOrderDAO, DmpnOrderDTO, DmpnOrderBO>
		implements DmpnOrderBusiness {

	@Autowired
	private DmpnOrderDAO dmpnOrderDAO;

	@Value("${folder_upload2}")
	private String folder2Upload;
	@Value("${default_sub_folder_upload}")
	private String defaultSubFolderUpload;

	public DmpnOrderBusinessImpl() {
		tModel = new DmpnOrderBO();
		tDAO = dmpnOrderDAO;
	}

	@Override
	public DmpnOrderDAO gettDAO() {
		return dmpnOrderDAO;
	}

	@Override
	public long count() {
		return dmpnOrderDAO.count("DmpnOrderBO", null);
	}

	public DataListDTO doSearchForDetailMonth(ConstructionTaskDetailDTO obj) {
		List<DmpnOrderDTO> ls = dmpnOrderDAO.doSearchForDetailMonth(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public String exportDetailMonthPlanBTS(ConstructionTaskDetailDTO obj) throws Exception {

		obj.setPage(1L);
		obj.setPageSize(100);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(
				new FileInputStream(filePath + "Export_yeucauvattu_thang_chitiet.xlsx"));
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
		OutputStream outFile = new FileOutputStream(
				udir.getAbsolutePath() + File.separator + "Export_yeucauvattu_thang_chitiet.xlsx");

		List<DmpnOrderDTO> data = dmpnOrderDAO.doSearchForDetailMonth(obj);
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			// HuyPQ-17/08/2018-edit-start
			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			// HuyPQ-17/08/2018-edit-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			int i = 2;
			for (DmpnOrderDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getGoodsCode() != null) ? dto.getGoodsCode() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getGoodsName() != null) ? dto.getGoodsName() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getUnitName() != null) ? dto.getUnitName() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.NUMERIC);
				cell.setCellValue((dto.getQuantity() != null) ? dto.getQuantity() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getDescription() != null) ? dto.getDescription() : " ");
				cell.setCellStyle(style);

			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt
				.encryptFileUploadPath(uploadPathReturn + File.separator + "Export_yeucauvattu_thang_chitiet.xlsx");
		return path;
	}

	private String numberFormat(double value) {
		DecimalFormat myFormatter = new DecimalFormat("###.###");
		String output = myFormatter.format(value);
		return output;
	}

	private String getStringForStatus(String status) {
		// TODO Auto-generated method stub
		if ("0".equals(status)) {
			return "Hết hiệu lực";
		} else if ("1".equals(status)) {
			return "Hiệu lực";
		}
		return null;
	}

	private String getStringForSignState(String signState) {
		// TODO Auto-generated method stub
		if ("1".equals(signState)) {
			return "Chưa trình ký";
		} else if ("2".equals(signState)) {
			return "Đã trình ký";
		} else if ("3".equals(signState)) {
			return "Đã ký duyệt";
		}
		return null;
	}

}
