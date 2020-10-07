package com.viettel.coms.business;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;

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

import com.viettel.coms.bo.ConstructionTaskBO;
import com.viettel.coms.dao.RpHSHCDAO;
import com.viettel.coms.dto.ConstructionTaskDTO;
import com.viettel.coms.dto.ConstructionTaskDetailDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.coms.utils.PermissionUtils;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;
import com.viettel.utils.DateTimeUtils;

@Service("rpHSHCBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RpHSHCBusinessImpl extends BaseFWBusinessImpl<RpHSHCDAO, ConstructionTaskDTO, ConstructionTaskBO>
implements RpHSHCBusiness {

	@Autowired
    private RpHSHCDAO rpHSHCDAO;
	
	@Value("${folder_upload2}")
    private String folder2Upload;
    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Context
    HttpServletResponse response;
    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${input_image_sub_folder_upload}")
    private String input_image_sub_folder_upload;

	
	public DataListDTO doSearchForConsManager(ConstructionTaskDetailDTO obj, HttpServletRequest request) {
		List<ConstructionTaskDetailDTO> ls = new ArrayList<ConstructionTaskDetailDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty())
			ls = rpHSHCDAO.doSearchForConsManager(obj, groupIdList);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
	
	 public String exportContructionHSHC(ConstructionTaskDetailDTO obj, HttpServletRequest request) throws Exception {
	        obj.setPage(1L);
	        obj.setPageSize(null);
	        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
	        String filePath = classloader.getResource("../" + "doc-template").getPath();
	        InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Bao_cao_quan_li_HSHC.xlsx"));
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
	                udir.getAbsolutePath() + File.separator + "Bao_cao_quan_li_HSHC.xlsx");
	        List provinceListId = PermissionUtils.getListIdInDomainData(Constant.OperationKey.VIEW,
	                Constant.AdResourceKey.DATA, request);
	        List<ConstructionTaskDetailDTO> data = new ArrayList<ConstructionTaskDetailDTO>();
	        if (provinceListId != null && !provinceListId.isEmpty())
	            data = rpHSHCDAO.doSearchForConsManager(obj, provinceListId);
	        XSSFSheet sheet = workbook.getSheetAt(0);
	        if (data != null && !data.isEmpty()) {
	            Date dateNow = new Date();
	            XSSFCellStyle style = ExcelUtils.styleText(sheet);

	            // HuyPQ-17/08/2018-start
	            XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
	            styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));

	            XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
	            XSSFCreationHelper createHelper = workbook.getCreationHelper();
	            styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
	            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yy");
	            // HuyPQ-20/08/2018-end

	            styleNumber.setAlignment(HorizontalAlignment.RIGHT);
	            Row rowS12 = sheet.createRow(4);
	            Cell cellS12 = rowS12.createCell(0, CellType.STRING);
	            cellS12.setCellValue("Ngày lập báo cáo:  " + (DateTimeUtils.convertDateToString(dateNow, "dd/MM/yyyy")));
	            cellS12.setCellStyle(styleDate);
	            int i = 7;
	            for (ConstructionTaskDetailDTO dto : data) {
	                Row row = sheet.createRow(i++);
	                Cell cell = row.createCell(0, CellType.STRING);
	                cell.setCellValue("" + (i - 7));
	                cell.setCellStyle(styleDate);
	                // HuyPQ-21/08/2018-edit-start
	                cell = row.createCell(1, CellType.STRING);
	                Date dateComplete = dateFormat.parse(dto.getDateComplete());
	                cell.setCellValue((dateComplete != null) ? dateComplete : null);
	                cell.setCellStyle(styleDate);
	                // HuyPQ-21/08/2018-edit-end
	                cell = row.createCell(2, CellType.STRING);
	                cell.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
	                cell.setCellStyle(style);
	                cell = row.createCell(3, CellType.STRING);
					 cell.setCellValue((dto.getCatProvinceCode() != null) ? dto.getCatProvinceCode() : "");
	                 cell.setCellStyle(style);
	                 cell = row.createCell(4, CellType.STRING);//trạm
	                cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : "");
	                cell.setCellStyle(style);
	                cell = row.createCell(5, CellType.STRING);
	                cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
	                cell.setCellStyle(style);
	                cell = row.createCell(6, CellType.STRING);
	                cell.setCellValue((dto.getCntContract() != null) ? dto.getCntContract() : "");
	                cell.setCellStyle(style);
	                // HuyPQ-17/08/2018-start
	                cell = row.createCell(7, CellType.NUMERIC);
					Float completeValue = dto.getCompleteValue() != null ? Float.parseFloat(dto.getCompleteValue()) : 0;
	                cell.setCellValue((completeValue != null) ? completeValue/1000000 : 0);
	                cell.setCellStyle(styleNumber);
	                // HuyPQ-17/08/2018-end
	                cell = row.createCell(8, CellType.STRING);
	                cell.setCellValue((dto.getStatus() != null) ? getStringForStatusConstr(dto.getStatus()) : "");
	                cell.setCellStyle(style);
					cell = row.createCell(9, CellType.STRING);//workitem 
	                 cell.setCellValue((dto.getWorkItemCode() != null) ? dto.getWorkItemCode() : "");
	                 cell.setCellStyle(style);
	                 cell = row.createCell(10, CellType.STRING);//ngày nhận
	                 String receiveDate = "";
	                 SimpleDateFormat fullDateFormat = new SimpleDateFormat("dd/MM/yyyy");
	                 if(dto.getReceiveRecordsDate() != null)
	                 	receiveDate = fullDateFormat.format(dto.getReceiveRecordsDate());
	                 cell.setCellValue(dto.getReceiveRecordsDate() != null ? fullDateFormat.parse(receiveDate) : null);
	                 cell.setCellStyle(styleDate);
	                // thiếu quantity
//	 				hoanm1_20181203_start
	 				cell = row.createCell(11, CellType.STRING);
	 				cell.setCellValue((dto.getCatStationHouseCode() != null) ? dto.getCatStationHouseCode() : "");
	 				cell.setCellStyle(style);
	 				cell = row.createCell(12, CellType.STRING);
	 				cell.setCellValue((dto.getApproveCompleteDescription() != null) ? dto.getApproveCompleteDescription() : "");
	 				cell.setCellStyle(style);
//	 				hoanm1_20181203_end

	            }
	        }
	        workbook.write(outFile);
	        workbook.close();
	        outFile.close();

	        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Bao_cao_quan_li_HSHC.xlsx");
	        return path;
	    }
	 private String getStringForStatusConstr(String status) {
			// TODO Auto-generated method stub
			if ("0".equals(status)) {
				return "Đã hủy";
			} else if ("1".equals(status)) {
				return "Chờ bàn giao mặt bằng";
			} else if ("2".equals(status)) {
				return "Chờ khởi công";
			} else if ("3".equals(status)) {
				return "Đang thực hiện";
			} else if ("4".equals(status)) {
				return "Đã tạm dừng";
			} else if ("5".equals(status)) {
				return "Đã hoàn thành";
			} else if ("6".equals(status)) {
				return "Đã nghiệm thu";
			} else if ("7".equals(status)) {
				return "Đã hoàn công quyết toán";
			}
			return null;
		}
}
