package com.viettel.coms.business;

import com.viettel.coms.bo.TmpnTargetBO;
import com.viettel.coms.dao.TmpnTargetDAO;
import com.viettel.coms.dto.ReportPlanDTO;
import com.viettel.coms.dto.TmpnTargetDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.DateTimeUtils;
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
import java.text.DecimalFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service("tmpnTargetBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class TmpnTargetBusinessImpl extends BaseFWBusinessImpl<TmpnTargetDAO, TmpnTargetDTO, TmpnTargetBO>
        implements TmpnTargetBusiness {

    @Autowired
    private TmpnTargetDAO tmpnTargetDAO;
    @Value("${folder_upload2}")
    private String folder2Upload;
    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    public TmpnTargetBusinessImpl() {
        tModel = new TmpnTargetBO();
        tDAO = tmpnTargetDAO;
    }

    @Override
    public TmpnTargetDAO gettDAO() {
        return tmpnTargetDAO;
    }

    @Override
    public long count() {
        return tmpnTargetDAO.count("TmpnTargetBO", null);
    }

    public DataListDTO reportProgress(ReportPlanDTO obj) {
        List<ReportPlanDTO> ls = tmpnTargetDAO.reportProgress(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

    public String exportPlanProgress(ReportPlanDTO obj, String userName) throws Exception {
        obj.setPage(null);
        obj.setPageSize(null);
        obj.setUserName(userName);
        String sysGroupName = tmpnTargetDAO.getSysGroupNameByUserName(obj.getUserName());
        Date dateNow = new Date();
//		obj.setPage(1L);
//		obj.setPageSize(100);
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Bao_cao_ke_hoach_thang.xlsx"));
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
                udir.getAbsolutePath() + File.separator + "Bao_cao_ke_hoach_thang.xlsx");
        List<ReportPlanDTO> data = tmpnTargetDAO.reportProgress(obj);
        XSSFSheet sheet = workbook.getSheetAt(0);
        XSSFCellStyle stt = ExcelUtils.styleText1(sheet);
        stt.setAlignment(HorizontalAlignment.CENTER);
        XSSFCellStyle sttbold = ExcelUtils.styleBold(sheet);
        Row rowS10 = sheet.createRow(1);
        Cell cellS10 = rowS10.createCell(0, CellType.STRING);
        cellS10.setCellValue((sysGroupName != null) ? sysGroupName : "");
        cellS10.setCellStyle(stt);
        cellS10 = rowS10.createCell(7, CellType.STRING);
        cellS10.setCellValue("Độc lập - Tự do - Hạnh phúc");
        cellS10.setCellStyle(sttbold);

        Row rowS12 = sheet.createRow(4);
        Cell cellS12 = rowS12.createCell(0, CellType.STRING);
        cellS12.setCellValue("Ngày lập báo cáo:  " + (DateTimeUtils.convertDateToString(dateNow, "dd/MM/yyyy")));
        cellS12.setCellStyle(stt);
        if (data != null && !data.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            // HuyPQ-17/08/2018-edit-start
            XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
            styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.00"));
            // HuyPQ-17/08/2018-edit-end
            styleNumber.setAlignment(HorizontalAlignment.RIGHT);
            int i = 8;
            Row row ;
            Cell cell;
            for (ReportPlanDTO dto : data) {
            	row = sheet.createRow(i++);
                cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (i - 8));
                cell.setCellStyle(styleNumber);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue((dto.getYear() != null && dto.getMonth() != null)
                        ? "Tháng " + dto.getMonth() + "/" + dto.getYear()
                        : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
                cell.setCellStyle(style);
                // HuyPQ-17/08/2018-edit-start
                cell = row.createCell(3, CellType.NUMERIC);
                cell.setCellValue((dto.getQuantity() != null) ? dto.getQuantity() : 0);
                cell.setCellStyle(styleNumber);
                cell = row.createCell(4, CellType.NUMERIC);
                cell.setCellValue((dto.getCurrentQuantity() != null) ? dto.getCurrentQuantity() : 0);
                cell.setCellStyle(styleNumber);
                cell = row.createCell(5, CellType.STRING);
                cell.setCellValue((dto.getProgressQuantity() != null) ? dto.getProgressQuantity() +"%": 0 +"%");
                cell.setCellStyle(styleNumber);
                cell = row.createCell(6, CellType.NUMERIC);
                cell.setCellValue((dto.getComplete() != null) ? dto.getComplete() : 0);
//                hoanm1_20181211_start
                cell.setCellStyle(styleNumber);
                cell = row.createCell(7, CellType.NUMERIC);
                cell.setCellValue((dto.getCountStationPlan() != null) ? dto.getCountStationPlan() : 0);
                cell.setCellStyle(styleNumber);
                cell = row.createCell(8, CellType.NUMERIC);
                cell.setCellValue((dto.getCompletePlanMonth() != null) ? dto.getCompletePlanMonth() : 0);
                cell.setCellStyle(styleNumber);
                cell = row.createCell(9, CellType.STRING);
                cell.setCellValue((dto.getProgressCompletePlanMonth() != null) ? dto.getProgressCompletePlanMonth() +"%": 0 +"%");
                cell.setCellStyle(styleNumber);
                cell = row.createCell(10, CellType.NUMERIC);
                cell.setCellValue((dto.getCountStation() != null) ? dto.getCountStation() : 0);
//                hoanm1_20181211_end
                cell.setCellStyle(styleNumber);
                cell = row.createCell(11, CellType.NUMERIC);
                cell.setCellValue((dto.getCurrentComplete() != null) ? dto.getCurrentComplete() : 0);
                cell.setCellStyle(styleNumber);
                cell = row.createCell(12, CellType.STRING);
                cell.setCellValue((dto.getProgressComplete() != null) ? dto.getProgressComplete() +"%": 0 +"%");
                cell.setCellStyle(styleNumber);
                cell = row.createCell(13, CellType.NUMERIC);
                cell.setCellValue((dto.getRevenue() != null) ? dto.getRevenue() : 0);
                cell.setCellStyle(styleNumber);
                cell = row.createCell(14, CellType.NUMERIC);
                cell.setCellValue((dto.getCurrentRevenueMonth() != null) ? dto.getCurrentRevenueMonth() : 0);
                cell.setCellStyle(styleNumber);
                cell = row.createCell(15, CellType.STRING);
                cell.setCellValue((dto.getProgressRevenueMonth() != null) ? dto.getProgressRevenueMonth() +"%": 0 +"%");
                cell.setCellStyle(styleNumber);
                // HuyPQ-17/08/2018-edit-end
                // thiếu quantity

            }
//            hoanm_20180928_start
            row = sheet.createRow(i++);
            cell = row.createCell(3, CellType.NUMERIC);
            cell.setCellValue((data.get(0).getQuantityTotal() != null) ? data.get(0).getQuantityTotal() : 0);
            cell.setCellStyle(styleNumber);
            cell = row.createCell(4, CellType.NUMERIC);
            cell.setCellValue((data.get(0).getCurrentQuantityTotal() != null) ? data.get(0).getCurrentQuantityTotal() : 0);
            cell.setCellStyle(styleNumber);
            cell = row.createCell(5, CellType.STRING);
            cell.setCellValue((data.get(0).getProgressQuantityTotal() != null) ? data.get(0).getProgressQuantityTotal() +"%": 0 +"%");
            cell.setCellStyle(styleNumber);
            cell = row.createCell(6, CellType.NUMERIC);
            cell.setCellValue((data.get(0).getCompleteTotal() != null) ? data.get(0).getCompleteTotal() : 0);
//            hoanm1_20181211_start
            cell.setCellStyle(styleNumber);
            cell = row.createCell(7, CellType.NUMERIC);
            cell.setCellValue((data.get(0).getCountStationPlanTotal() != null) ? data.get(0).getCountStationPlanTotal() : 0);
            cell.setCellStyle(styleNumber);
            cell = row.createCell(8, CellType.NUMERIC);
            cell.setCellValue((data.get(0).getCompletePlanTotal() != null) ? data.get(0).getCompletePlanTotal() : 0);
            cell.setCellStyle(styleNumber);
            cell = row.createCell(9, CellType.STRING);
            cell.setCellValue((data.get(0).getProgressCompletePlanTotal() != null) ? data.get(0).getProgressCompletePlanTotal() +"%": 0 +"%");
            cell.setCellStyle(styleNumber);
            cell = row.createCell(10, CellType.NUMERIC);
            cell.setCellValue((data.get(0).getCountStationTotal() != null) ? data.get(0).getCountStationTotal() : 0);
//            hoanm1_20181211_end
            
            cell.setCellStyle(styleNumber);
            cell = row.createCell(11, CellType.NUMERIC);
            cell.setCellValue((data.get(0).getCurrentCompleteTotal() != null) ? data.get(0).getCurrentCompleteTotal() : 0);
            cell.setCellStyle(styleNumber);
            cell = row.createCell(12, CellType.STRING);
            cell.setCellValue((data.get(0).getProgressCompleteTotal() != null) ? data.get(0).getProgressCompleteTotal() +"%": 0 +"%");
            cell.setCellStyle(styleNumber);
            cell = row.createCell(13, CellType.NUMERIC);
            cell.setCellValue((data.get(0).getRevenueTotal() != null) ? data.get(0).getRevenueTotal() : 0);
            cell.setCellStyle(styleNumber);
            cell = row.createCell(14, CellType.NUMERIC);
            cell.setCellValue((data.get(0).getCurrentRevenueTotal() != null) ? data.get(0).getCurrentRevenueTotal() : 0);
            cell.setCellStyle(styleNumber);
            cell = row.createCell(15, CellType.STRING);
            cell.setCellValue((data.get(0).getProgressRevenueTotal() != null) ? data.get(0).getProgressRevenueTotal() +"%": 0 +"%");
            cell.setCellStyle(styleNumber);
        }
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Bao_cao_ke_hoach_thang.xlsx");
        return path;
    }

    private String numberFormat(double value) {
        DecimalFormat myFormatter = new DecimalFormat("###,###.##");
        String output = myFormatter.format(value);
        return output;
    }

    public ReportPlanDTO rpMonthProgressDetaill(ReportPlanDTO dto) {
        dto.setPage(null);
        dto.setPageSize(null);

        ReportPlanDTO data = new ReportPlanDTO();
//		data.setTotal(dto.getTotalRecord());
        List<ReportPlanDTO> reportPlanList = tmpnTargetDAO.reportProgress(dto);

        if (reportPlanList != null && !reportPlanList.isEmpty()) {
            int i = 1;
            for (ReportPlanDTO pl : reportPlanList) {
                pl.setTt((i++) + "");
            }
        }
        String sysGroupName = tmpnTargetDAO.getSysGroupNameByUserName(dto.getUserName());
        data.setSysGroupName(sysGroupName);

        data.setReportPlanList(reportPlanList);

        return data;
    }

}
