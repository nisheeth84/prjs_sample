package com.viettel.coms.business;

import com.viettel.coms.bo.YearPlanBO;
import com.viettel.coms.dao.DepartmentDAO;
import com.viettel.coms.dao.KpiLogDAO;
import com.viettel.coms.dao.YearPlanDAO;
import com.viettel.coms.dao.YearPlanDetailDAO;
import com.viettel.coms.dto.*;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.service.base.utils.StringUtils;
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
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

//import org.apache.commons.lang3.StringUtils;

@Service("yearPlanBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class YearPlanBusinessImpl extends BaseFWBusinessImpl<YearPlanDAO, YearPlanDTO, YearPlanBO>
        implements YearPlanBusiness {

    @Autowired
    private YearPlanDAO yearPlanDAO;
    @Autowired
    private DepartmentDAO departmentDAO;

    @Autowired
    private YearPlanDetailDAO yearPlanDetailDAO;
    @Autowired
    private KpiLogDAO KpiLogDAO;

    @Value("${folder_upload2}")
    private String folder2Upload;
    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    public YearPlanBusinessImpl() {
        tModel = new YearPlanBO();
        tDAO = yearPlanDAO;
    }

    @Override
    public YearPlanDAO gettDAO() {
        return yearPlanDAO;
    }

    @Override
    public long count() {
        return yearPlanDAO.count("YearPlanBO", null);
    }

    public DataListDTO doSearch(YearPlanSimpleDTO obj, Long sysGroupId) {
        List<YearPlanDTO> ls = yearPlanDAO.doSearch(obj, sysGroupId);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

    public YearPlanSimpleDTO getById(Long id) {
        YearPlanSimpleDTO data = yearPlanDAO.getYeaPlanById(id);
        List<YearPlanDetailDTO> detailList = yearPlanDAO.getYearPlanDetailByParentId(id);
        data.setDetailList(detailList);
        return data;
    }

    public Long add(YearPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
        checkYear(obj.getYear(), null);
        Long yearPlanId = yearPlanDAO.saveObject(obj.toModel());
        if (obj.getDetailList() != null) {
            for (YearPlanDetailDTO dto : obj.getDetailList()) {
                dto.setYearPlanId(yearPlanId);
                dto.setYear(obj.getYear());
                yearPlanDetailDAO.saveObject(dto.toModel());
            }
        }
        return yearPlanId;
    }

    public void addKpiLog(KpiLogDTO obj) {
        Long id = KpiLogDAO.saveObject(obj.toModel());
    }

    public Long updateYearPlan(YearPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
        checkYear(obj.getYear(), obj.getYearPlanId());
        Long status = yearPlanDAO.updateObject(obj.toModel());
        List<Long> yearPlanDetailIdListInDB = yearPlanDAO.getYearPlanDetailIdListInDB(obj.getYearPlanId());
        List<YearPlanDetailDTO> detailList = obj.getDetailList();
        List<YearPlanDetailDTO> detailListInUse = new ArrayList<YearPlanDetailDTO>();
        // add new detail to db
        for (YearPlanDetailDTO detail : detailList) {
            if (detail.getYearPlanDetailId() != null) {
                detailListInUse.add(detail);
                yearPlanDetailDAO.updateObject(detail.toModel());
            } else {
                detail.setYearPlanId(obj.getYearPlanId());
                detail.setYear(obj.getYear());
                yearPlanDetailDAO.saveObject(detail.toModel());
            }
        }
        List<Long> deleteList = new ArrayList<Long>(yearPlanDetailIdListInDB);
        for (Long yId : yearPlanDetailIdListInDB) {
            boolean exist = false;
            for (YearPlanDetailDTO detail : detailListInUse) {
                if (yId.longValue() == detail.getYearPlanDetailId().longValue()) {
                    deleteList.remove(yId);
                    break;
                }
            }
        }
        if (!deleteList.isEmpty())
            yearPlanDAO.deleteYearPlanDetail(deleteList);
        return obj.getYearPlanId();
    }

    public Long getSequence() {
        // TODO Auto-generated method stub
        return yearPlanDAO.getSequence();
    }

    public void remove(YearPlanDTO obj) {
        // TODO Auto-generated method stub
        yearPlanDAO.remove(obj.getYearPlanId());
    }
//    hungtd_20181213_start
    public void updateRegistry(YearPlanDTO obj) {
        // TODO Auto-generated method stub
        yearPlanDAO.updateRegistry(obj.getYearPlanId());
    }
//    hungtd_20181213_end

    public void checkYear(Long year, Long yearPlanId) {
        boolean isExist = yearPlanDAO.checkYear(year, yearPlanId);
        if (isExist)
            throw new IllegalArgumentException("Năm tạo kế hoạch đã tồn tại!");
    }

    public String exportExcelTemplate() throws Exception {
        // TODO Auto-generated method stub
        String folderParam = defaultSubFolderUpload;
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Import_KeHoachNam.xlsx"));
        // String filePath1 = UFile.writeToFileServerATTT2(file,
        // "Import_KeHoachNam.xlsx", folderParam, folder2Upload);
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
        OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "Import_KeHoachNam.xlsx");
        XSSFSheet sheet = workbook.getSheetAt(1);
        // chinhpxn20180619
        List<DepartmentDTO> departmentList = departmentDAO.getAll();
        // chinhpxn20180619
        if (departmentList != null && !departmentList.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            int i = 1;
            for (DepartmentDTO dto : departmentList) {
//				Row row = sheet.createRow(i++);
//				Cell cell = row.createCell(0, CellType.STRING);
//				cell.setCellValue(StringUtils.isNotEmpty(dto
//						.getCode()) ? dto.getCode() : "");
//				cell.setCellStyle(style);
//				cell = row.createCell(1, CellType.STRING);
//				cell.setCellValue(StringUtils.isNotEmpty(dto
//						.getName()) ? dto.getName() : "");
//				cell.setCellStyle(style);
                // chinhpxn20180619
                Row row = sheet.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);

                cell.setCellValue(!StringUtils.isNullOrEmpty(dto.getCode()) ? dto.getCode() : "");
                //
                cell.setCellStyle(style);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue(!StringUtils.isNullOrEmpty(dto.getName()) ? dto.getName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue(!StringUtils.isNullOrEmpty(dto.getGroupNameLevel1()) ? dto.getGroupNameLevel1() : "");
                cell.setCellStyle(style);
                cell = row.createCell(3, CellType.STRING);
                cell.setCellValue(!StringUtils.isNullOrEmpty(dto.getGroupNameLevel2()) ? dto.getGroupNameLevel2() : "");
                cell.setCellStyle(style);
                cell = row.createCell(4, CellType.STRING);
                cell.setCellValue(!StringUtils.isNullOrEmpty(dto.getGroupNameLevel3()) ? dto.getGroupNameLevel3() : "");
                cell.setCellStyle(style);
                // chinhpxn20180619
            }
        }
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Import_KeHoachNam.xlsx");
        return path;
    }

    public List<YearPlanDetailDTO> getDataForSignVOffice(Long yearPlanId) {
        // TODO Auto-generated method stub
        return yearPlanDAO.getDataForSignVOffice(yearPlanId);
    }

    public String exportYearPlan(YearPlanSimpleDTO obj) throws Exception {
//		YearPlanSimpleDTO obj = new YearPlanSimpleDTO();

        obj.setPage(1L);
        obj.setPageSize(100);
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + "KeHoachNam.xlsx"));
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
        OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "KeHoachNam.xlsx");
        List<YearPlanSimpleDTO> data = yearPlanDAO.exportYearPlan(obj);
        DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        XSSFSheet sheet = workbook.getSheetAt(0);
        if (data != null && !data.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
            styleNumber.setAlignment(HorizontalAlignment.RIGHT);
            int i = 2;
            for (YearPlanSimpleDTO dto : data) {
                Row row = sheet.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (i - 2));
                cell.setCellStyle(styleNumber);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue((dto.getCode() != null) ? dto.getCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue((dto.getName() != null) ? dto.getName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(3, CellType.STRING);
                cell.setCellValue((dto.getYear() != null) ? numberFormat(dto.getYear()) : "");
                cell.setCellStyle(styleNumber);
                cell = row.createCell(4, CellType.STRING);
                cell.setCellValue(getStringForSignState(dto.getSignState()));
                cell.setCellStyle(style);
                cell = row.createCell(5, CellType.STRING);
                cell.setCellValue(getStringForStatus(dto.getStatus()));
                cell.setCellStyle(style);

                // thiếu quantity

            }
        }
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "KeHoachNam.xlsx");
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
        } else if ("4".equals(signState)) {
            return "Từ chối ký duyệt";
        }
        return null;
    }

    public List<AppParamDTO> getAppParamByType(String type) {
        // TODO Auto-generated method stub
        return yearPlanDAO.getAppParamByType(type);
    }

}
