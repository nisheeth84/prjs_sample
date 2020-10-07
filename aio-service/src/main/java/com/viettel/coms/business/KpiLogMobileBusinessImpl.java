package com.viettel.coms.business;

import com.viettel.coms.bo.KpiLogMobileBO;
import com.viettel.coms.dao.KpiLogMobileDAO;
import com.viettel.coms.dto.CatConstructionTypeDTO;
import com.viettel.coms.dto.KpiLogMobileDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;
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

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service("kpiLogMobileBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class KpiLogMobileBusinessImpl extends BaseFWBusinessImpl<KpiLogMobileDAO, KpiLogMobileDTO, KpiLogMobileBO>
        implements KpiLogMobileBusiness {

    @Autowired
    private KpiLogMobileDAO kpiLogMobileDAO;

    @Value("${folder_upload2}")
    private String folder2Upload;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    public KpiLogMobileBusinessImpl() {
        tModel = new KpiLogMobileBO();
        tDAO = kpiLogMobileDAO;
    }

    @Override
    public KpiLogMobileDAO gettDAO() {
        return kpiLogMobileDAO;
    }

    //hoanm1_20180815_start
//	@Override
    public List<KpiLogMobileDTO> rpDailyTask(KpiLogMobileDTO dto, List<String> groupIdList) {
        return kpiLogMobileDAO.rpDailyTask(dto, groupIdList);
    }
//	hoanm1_20180815_end

    public DataListDTO getConstructionTypeForAutoComplete(CatConstructionTypeDTO obj) {
        List<CatConstructionTypeDTO> ls = kpiLogMobileDAO.getConstructionTypeForAutoComplete(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

    public String exportExcel(KpiLogMobileDTO obj, HttpServletRequest request) throws Exception {
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Export_congviec_theongay.xlsx"));
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
                udir.getAbsolutePath() + File.separator + "Export_congviec_theongay.xlsx");
//		hoanm1_20180815_start
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.DATA, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        List<KpiLogMobileDTO> data = new ArrayList<KpiLogMobileDTO>();
        data = kpiLogMobileDAO.rpDailyTask(obj, groupIdList);
//		hoanm1_20180815_end
        XSSFSheet sheet = workbook.getSheetAt(0);
        if (data != null && !data.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
            // HuyPQ-22/08/2018-start
            XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
            XSSFCreationHelper createHelper = workbook.getCreationHelper();
            styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
//			styleDate.setDataFormat(workbook.createDataFormat().getFormat("dd-MMM-yy"));
            // HuyPQ-end
            styleNumber.setAlignment(HorizontalAlignment.RIGHT);
            styleDate.setAlignment(HorizontalAlignment.CENTER);
            int i = 2;
            for (KpiLogMobileDTO dto : data) {
               	Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getFullname() != null) ? dto.getFullname() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getPhonenumber() != null) ? dto.getPhonenumber() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getEmail() != null) ? dto.getEmail() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getProvincecode() != null) ? dto.getProvincecode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getStationcode() != null) ? dto.getStationcode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getConstructiontypename() != null) ? dto.getConstructiontypename() : "");
				cell.setCellStyle(style);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue((dto.getWorkItemName() != null) ? dto.getWorkItemName() : "");
				cell.setCellStyle(style);
				// HuyPQ-22/08/2018-start
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue(
						(dto.getUpdateTime() != null) ? dto.getUpdateTime()
								: null);
				cell.setCellStyle(styleDate);
				// HuyPQ-end
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue((dto.getCatTaskName() != null) ? dto.getCatTaskName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue((dto.getLuyKeThucHien() != null) ? dto.getLuyKeThucHien() : "");
				cell.setCellStyle(style);
				cell = row.createCell(12, CellType.STRING);
				cell.setCellValue((dto.getDescription() != null) ? dto.getDescription() : "");
				cell.setCellStyle(style);
            }
        }
        workbook.write(outFile);
        workbook.close();
        outFile.close();
        String path = UEncrypt
                .encryptFileUploadPath(uploadPathReturn + File.separator + "Export_congviec_theongay.xlsx");
        return path;
    }

}
