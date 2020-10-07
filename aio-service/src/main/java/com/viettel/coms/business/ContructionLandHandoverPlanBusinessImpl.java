package com.viettel.coms.business;

import com.viettel.cat.dto.CatPartnerDTO;
import com.viettel.coms.bo.ContructionLandHandoverPlanBO;
import com.viettel.coms.dao.ContructionLandHandoverPlanDAO;
import com.viettel.coms.dao.DepartmentDAO;
import com.viettel.coms.dao.KpiLogDAO;
import com.viettel.coms.dto.*;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;
import com.viettel.wms.utils.ValidateUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.*;
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
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service("contructionLandHandoverPlanBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ContructionLandHandoverPlanBusinessImpl extends
        BaseFWBusinessImpl<ContructionLandHandoverPlanDAO, ContructionLandHandoverPlanDTO, ContructionLandHandoverPlanBO>
        implements ContructionLandHandoverPlanBusiness {
    @Autowired
    private DepartmentDAO departmentDAO;
    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;
    @Value("${folder_upload2}")
    private String folder2Upload;
    @Autowired
    private ContructionLandHandoverPlanDAO contructionLandHandoverPlanDAO;
    @Autowired
    private KpiLogDAO KpiLogDAO;

    public ContructionLandHandoverPlanBusinessImpl() {
        tModel = new ContructionLandHandoverPlanBO();
        tDAO = contructionLandHandoverPlanDAO;
    }

    @Override
    public ContructionLandHandoverPlanDAO gettDAO() {
        return contructionLandHandoverPlanDAO;
    }

    @Override
    public long count() {
        return contructionLandHandoverPlanDAO.count("ContructionLandHandoverPlanBO", null);
    }

    public List<CatStationDTO> getCatStation(CatStationDTO obj, HttpServletRequest request) {
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE,
                Constant.AdResourceKey.LAND_HANDOVER_PLAN, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        if (groupIdList != null && !groupIdList.isEmpty())
            return contructionLandHandoverPlanDAO.getCatStation(obj, groupIdList);
        return null;
    }

    public List<ConstructionDTO> getLstConstruction(String code) {
        List<ConstructionDTO> lst = contructionLandHandoverPlanDAO.getLstConstruction(code);
        return lst;
    }

    public DataListDTO doSearchPartner(CatPartnerDTO obj) {
        List<CatPartnerDTO> lst = contructionLandHandoverPlanDAO.doSearchPartner(obj);
        DataListDTO data = new DataListDTO();
        data.setData(lst);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

    public Long add(ContructionLandHandoverPlanDTO obj, HttpServletRequest request) {
        checkMonthYear(obj.getMonth(), obj.getYear(), obj.getCatStationId(), obj.getConstructionId(), null);
//		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE,
//				Constant.AdResourceKey.CONSTRUCTION, request)) {
//			throw new IllegalArgumentException(
//					"Bạn không có quyền tạo mới thông tin kế hoạch GPMB");
//		}
//		long provinceId = contructionLandHandoverPlanDAO
//				.getProvinceIdByCatStation(obj.getCatStationId());
        /*
         * if (!VpsPermissionChecker.checkPermissionOnDomainData(
         * Constant.OperationKey.CREATE, Constant.AdResourceKey.CONSTRUCTION,
         * provinceId, request)) { throw new IllegalArgumentException(
         * "Bạn không có quyền tạo kế hoạch GPMB") ; }
         */
        Date groundPlanDate = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
        String strDate = formatter.format(groundPlanDate);

        obj.setName("Tháng " + obj.getMonth() + "/" + obj.getYear());

        Long contructionLandHanPlanId = contructionLandHandoverPlanDAO.saveObject(obj.toModel());

        return contructionLandHanPlanId;
    }

    public void checkMonthYear(Long month, Long year, Long catStationId, Long constructionId,
                               Long contructionLandHanPlanId) {
        boolean isExist = contructionLandHandoverPlanDAO.checkMonthYear(month, year, catStationId, constructionId,
                contructionLandHanPlanId);
        if (isExist)
            throw new IllegalArgumentException("Tháng,năm,Mã Trạm hoặc Mã Công Trình tạo kế hoạch BGMB đã tồn tại!");
    }

    public void checkImport(Long month, Long year, Long catStationId, Long constructionId) {
        boolean isExist = contructionLandHandoverPlanDAO.checkImport(month, year, catStationId, constructionId);
        if (isExist)
            throw new IllegalArgumentException("Tháng,năm,Mã Trạm hoặc Mã Công Trình tạo kế hoạch BGMB đã tồn tại!");
    }

    public Long aaddImportdd(ContructionLandHandoverPlanDtoSearch obj, HttpServletRequest request) {
        if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE, Constant.AdResourceKey.CONSTRUCTION,
                request)) {
            throw new IllegalArgumentException("Bạn không có quyền tạo mới thông tin kế hoạch GPMB");
        }
        long provinceId = contructionLandHandoverPlanDAO.getProvinceIdByCatStation(obj.getCatStationId());

        /*
         * ContructionLandHandoverPlanDtoSearch dtoId=new
         * ContructionLandHandoverPlanDtoSearch();
         *
         * dtoId=contructionLandHandoverPlanDAO.getDtoId(obj);
         */
        /*
         * if (!VpsPermissionChecker.checkPermissionOnDomainData(
         * Constant.OperationKey.CREATE, Constant.AdResourceKey.CONSTRUCTION,
         * provinceId, request)) { throw new IllegalArgumentException(
         * "Bạn không có quyền tạo kế hoạch GPMB") ; }
         */

        obj.setName("Tháng " + obj.getMonth() + "/" + obj.getYear());

        Long contructionLandHanPlanId = contructionLandHandoverPlanDAO.saveObject(obj.toModel());

        return contructionLandHanPlanId;
    }

    /*
     * public void checkNameCode(String code, Long contructionLandHanPlanId) {
     * boolean isExist = contructionLandHandoverPlanDAO.checkNameCode(code,
     * contructionLandHanPlanId); if (isExist) throw new
     * IllegalArgumentException("Mã công trình đã tồn tại!"); }
     */

    public DataListDTO doSearch(ContructionLandHandoverPlanDtoSearch obj, HttpServletRequest request) {
        List<ContructionLandHandoverPlanDtoSearch> ls = new ArrayList<ContructionLandHandoverPlanDtoSearch>();
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.DATA, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        if (groupIdList != null && !groupIdList.isEmpty()) {
            ls = contructionLandHandoverPlanDAO.doSearch(obj, groupIdList);
        }
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

    public ContructionLandHandoverPlanDTO getById(Long id) throws Exception {
        ContructionLandHandoverPlanDTO data = contructionLandHandoverPlanDAO.getConstructionById(id);
        return data;
    }

    public Long updateConstruction(ContructionLandHandoverPlanDTO obj, HttpServletRequest request) {
        checkMonthYear(obj.getMonth(), obj.getYear(), obj.getCatStationId(), obj.getConstructionId(),
                obj.getContructionLandHanPlanId());
        if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE, Constant.AdResourceKey.LAND_HANDOVER_PLAN,
                request)) {
            throw new IllegalArgumentException("Bạn không có quyền chỉnh sửa thông tin kế hoạch BGMB");
        }
        long provinceId = contructionLandHandoverPlanDAO.getProvinceIdByCatStation(obj.getCatStationId());
        obj.setName("Tháng " + obj.getMonth() + "/" + obj.getYear());

        Long status = contructionLandHandoverPlanDAO.updateConstruction(obj.toModel());
        return status;

    }

    public void remove(ContructionLandHandoverPlanDTO obj) {
        // TODO Auto-generated method stub
        contructionLandHandoverPlanDAO.remove(obj.getContructionLandHanPlanId());
    }

    public String exportExcelTemplate() throws Exception {
        String folderParam = defaultSubFolderUpload;
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Import_Kehoach_BGMB.xlsx"));
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
        OutputStream outFile = new FileOutputStream(
                udir.getAbsolutePath() + File.separator + "Import_Kehoach_BGMB.xlsx");
        XSSFSheet sheet = workbook.getSheetAt(5);
        List<DepartmentDTO> departmentList = departmentDAO.getAllLevel12();
        if (departmentList != null && !departmentList.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            int i = 1;
            for (DepartmentDTO dto : departmentList) {
                Row row = sheet.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getCode()) ? dto.getCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getName()) ? dto.getName() : "");
                cell.setCellStyle(style);
            }
        }
        XSSFSheet sheet3 = workbook.getSheetAt(3);
        List<CatStationDTO> catStationList = departmentDAO.getCatStation();
        if (catStationList != null && !catStationList.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet3);
            int i = 1;
            for (CatStationDTO dto : catStationList) {
                Row row = sheet3.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getCode()) ? dto.getCode() : "");
                cell.setCellStyle(style);
            }
        }
        XSSFSheet sheet4 = workbook.getSheetAt(4);
        List<ConstructionDTO> constructionList = departmentDAO.getConstructiontation();
        if (constructionList != null && !constructionList.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet4);
            int k = 1;
            for (ConstructionDTO dto : constructionList) {
                Row row = sheet4.createRow(k++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getCode()) ? dto.getCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getName()) ? dto.getName() : "");
                cell.setCellStyle(style);
            }
        }
        XSSFSheet sheet6 = workbook.getSheetAt(6);
        List<CatPartnerDTO> catPartnerList = departmentDAO.getCatpartner();
        if (catPartnerList != null && !catPartnerList.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet6);
            int l = 1;
            for (CatPartnerDTO dto : catPartnerList) {
                Row row = sheet6.createRow(l++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getCode()) ? dto.getCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getName()) ? dto.getName() : "");
                cell.setCellStyle(style);
            }
        }
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Import_Kehoach_BGMB.xlsx");
        return path;
    }

    public String exportHanPlan(ContructionLandHandoverPlanDtoSearch obj) throws Exception {
        // YearPlanSimpleDTO obj = new YearPlanSimpleDTO();

        obj.setPage(1L);
        obj.setPageSize(100);
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + "KeHoachBGMB.xlsx"));
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
        OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "KeHoachBGMB.xlsx");
        List<ContructionLandHandoverPlanDtoSearch> data = contructionLandHandoverPlanDAO.exportHanPlan(obj);
        XSSFSheet sheet = workbook.getSheetAt(0);
        if (data != null && !data.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
            // HuyPQ-22/08/2018-edit-start
            XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
            XSSFCreationHelper createHelper = workbook.getCreationHelper();
            styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd-MM-yyyy"));
            // HuyPQ-end
            styleNumber.setAlignment(HorizontalAlignment.RIGHT);
            int i = 2;
            for (ContructionLandHandoverPlanDtoSearch dto : data) {
                Row row = sheet.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (i - 2));
                cell.setCellStyle(styleNumber);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue((dto.getName() != null) ? dto.getName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(3, CellType.STRING);
                cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : "");
                cell.setCellStyle(styleNumber);
                cell = row.createCell(4, CellType.STRING);
                cell.setCellValue((dto.getContructionCode() != null) ? dto.getContructionCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(5, CellType.STRING);
                cell.setCellValue((dto.getCatPartnerCode() != null) ? dto.getCatPartnerCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(6, CellType.STRING);
                cell.setCellValue((dto.getGroundPlanDate() != null) ? dto.getGroundPlanDate() : null);
                cell.setCellStyle(styleDate);
                cell = row.createCell(7, CellType.STRING);
                cell.setCellValue((dto.getDescription() != null) ? dto.getDescription() : "");
                cell.setCellStyle(style);

                // thiếu quantity

            }
        }
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "KeHoachBGMB.xlsx");
        return path;
    }

    @SuppressWarnings({"deprecation", "null"})
    public List<ContructionLandHandoverPlanDtoSearch> importHanPlanDetail(String fileInput, String path, Long sysId)
            throws Exception {
        List<ContructionLandHandoverPlanDtoSearch> workLst = new ArrayList<ContructionLandHandoverPlanDtoSearch>();
        File f = new File(fileInput);
        XSSFWorkbook workbook = new XSSFWorkbook(f);
        XSSFSheet sheet = workbook.getSheetAt(0);
        List<String> listGroupCode = new ArrayList<String>();
        Map<String, Map<String, List<String>>> groupMap = new ConcurrentHashMap<String, Map<String, List<String>>>();
        DataFormatter formatter = new DataFormatter();
        DecimalFormat df = new DecimalFormat("#.###");
        DecimalFormat longf = new DecimalFormat("#");
        DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        boolean isExistError = false;
        int count = 0;
        for (Row row : sheet) {
            count++;
            if (count >= 3 && !ValidateUtils.checkIfRowIsEmpty(row)) {
                boolean checkColumn1 = true;
                boolean checkColumn2 = true;
                boolean checkColumn3 = true;
                boolean checkColumn4 = true;
                boolean checkColumn5 = true;
                boolean checkColumn6 = true;
                boolean checkColumn7 = true;
                boolean checkColumn8 = true;
                String sysGroupCode = "";
                StringBuilder errorMesg = new StringBuilder();
                ContructionLandHandoverPlanDtoSearch newObj = new ContructionLandHandoverPlanDtoSearch();
                for (int i = 0; i < 9; i++) {
                    Cell cell = row.getCell(i);
                    if (cell != null) {
                        // Check format file exel
                        if (cell.getColumnIndex() == 1) {// Tháng
                            try {
                                String monthStr = formatter.formatCellValue(cell).toLowerCase().replaceAll("tháng", "")
                                        .trim();
                                Long month = Long.parseLong(monthStr);
                                if (month == null || month.longValue() > 12 || month.longValue() < 0)
                                    checkColumn1 = false;
                                else {
                                    newObj.setMonth(month);
                                }
                            } catch (Exception e) {
                                checkColumn1 = false;
                            }
                            if (!checkColumn1) {
                                isExistError = true;
                                errorMesg.append("Tháng không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 2) {// Năm
                            try {
                                Long year = Long.parseLong(longf.format(row.getCell(2).getNumericCellValue()));
                                if (year == null || year.longValue() < 0)
                                    checkColumn2 = false;
                                else {
                                    newObj.setYear(year);
                                }
                            } catch (Exception e) {
                                checkColumn2 = false;
                            }
                            if (!checkColumn2) {
                                isExistError = true;
                                errorMesg.append("\nNăm không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 3) {// Mã trạm
                            try {
                                String catStationCode = formatter.formatCellValue(cell);
                                List<CatStationDTO> catStationList = departmentDAO.getCatStation();
                                if (!StringUtils.isNotEmpty(catStationCode)) {
                                    checkColumn3 = false;
                                } else {
                                    checkColumn3 = contructionLandHandoverPlanDAO.getCatstationData(newObj,
                                            catStationCode);
                                    Long idMaTram = contructionLandHandoverPlanDAO.getIdMaTram(catStationCode);
                                    newObj.setCatStationId(idMaTram);
                                    newObj.setCatStationCode(catStationCode);
                                }
                            } catch (Exception e) {
                                checkColumn3 = false;
                            }
                            if (!checkColumn3) {
                                isExistError = true;
                                errorMesg.append("\nMã trạm không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 4) {// Mã đơn vị
                            /*
                             * sysGroupCode = formatter.formatCellValue(cell); if
                             * (!listGroupCode.contains(sysGroupCode)) { listGroupCode.add(sysGroupCode);
                             * groupMap.put(sysGroupCode, new ConcurrentHashMap<String,List<String>>()); }
                             * checkColumn4 = contructionLandHandoverPlanDAO .getSysGroupData(newObj,
                             * sysGroupCode); Long idDonvi =
                             * contructionLandHandoverPlanDAO.getIdDonvi(sysGroupCode);
                             * newObj.setSysGroupId(idDonvi); newObj.setSysGroupCode(sysGroupCode); if
                             * (!checkColumn4) { isExistError = true;
                             * errorMesg.append("\nMã đơn vị nhận bàn giao không hợp lệ!"); }
                             */
                            try {
                                sysGroupCode = formatter.formatCellValue(cell);
                                sysGroupCode = formatter.formatCellValue(cell);
                                if (!listGroupCode.contains(sysGroupCode)) {
                                    listGroupCode.add(sysGroupCode);
                                    groupMap.put(sysGroupCode, new ConcurrentHashMap<String, List<String>>());
                                } else {
                                    listGroupCode.add(sysGroupCode);
                                }
                                checkColumn4 = contructionLandHandoverPlanDAO.getSysGroupData(newObj, sysGroupCode);
                                Long idDonvi = contructionLandHandoverPlanDAO.getIdDonvi(sysGroupCode);
                                newObj.setSysGroupId(idDonvi);
                                newObj.setSysGroupCode(sysGroupCode);

                                if (!checkColumn4) {
                                    isExistError = true;
                                    errorMesg.append("\nMã đơn vị nhận bàn giao không hợp lệ!");
                                }
                            } catch (Exception e) {
                                isExistError = true;
                                errorMesg.append("\nMã đơn vị nhận bàn giao không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 5) {
                            try {
                                String contructionCode = formatter.formatCellValue(cell);
                                if (!StringUtils.isNotEmpty(contructionCode)) {
                                    checkColumn5 = false;
                                } else {
                                    checkColumn5 = contructionLandHandoverPlanDAO
                                            .getContructionData(newObj.getCatStationCode(), contructionCode.trim());
                                    Long idMaCongTrinh = contructionLandHandoverPlanDAO
                                            .getIdMaCongTrinh(contructionCode.trim());
                                    newObj.setConstructionId(idMaCongTrinh);
//									newObj.setContructionCode(contructionCode);
                                }
                            } catch (Exception e) {
                                checkColumn5 = false;
                            }
                            if (!checkColumn5) {
                                isExistError = true;
                                errorMesg.append("\nMã công trình không hợp lệ hoặc không thuộc Mã Trạm!");
                            }
                        } else if (cell.getColumnIndex() == 6) {
                            try {
                                String gpDate = formatter.formatCellValue(cell);
                                if (!StringUtils.isNotEmpty(gpDate)) {
                                    checkColumn6 = false;
                                } else {
//									checkColumn6 = dateFormat(gpDate);
                                    Date groundPlanDate = dateFormat.parse(gpDate);
                                    newObj.setGroundPlanDate(groundPlanDate);
                                }
                            } catch (Exception e) {
                                checkColumn6 = false;
                            }
                            if (!checkColumn6) {
                                isExistError = true;
                                errorMesg.append("\nNgày bàn giao không hợp lệ!");
                            }

                        } else if (cell.getColumnIndex() == 7) {
                            try {
                                String catPartnerCode = formatter.formatCellValue(cell);
                                if (!StringUtils.isNotEmpty(catPartnerCode)) {
                                    checkColumn7 = false;
                                } else {
                                    checkColumn7 = contructionLandHandoverPlanDAO.getCatpartnerData(newObj,
                                            catPartnerCode);
                                    Long idMaDoiTac = contructionLandHandoverPlanDAO.getIdMaDoiTac(catPartnerCode);
                                    newObj.setCatPartnerId(idMaDoiTac);
                                    // newObj.setCatPartnerCode(catPartnerCode);
                                }
                            } catch (Exception e) {
                                checkColumn7 = false;
                            }
                            if (!checkColumn7) {
                                isExistError = true;
                                errorMesg.append("\nĐơn vị bàn giao(Đối tác)không hợp lệ!");
                            }
//							Cell cell1 = row.createCell(8);
//							cell1.setCellValue(errorMesg.toString());
                        } else if (cell.getColumnIndex() == 8) {// Ghi chu
                            String description = formatter.formatCellValue(cell);
                            if (!StringUtils.isNotEmpty(description)) {
                                checkColumn8 = false;
                            } else {
                                newObj.setDescription(description);
                            }
                        }
                        Cell cell1 = row.createCell(9);
                        cell1.setCellValue(errorMesg.toString());
                    }

                }
                if (checkColumn1 && checkColumn2 && checkColumn3 && checkColumn4 && checkColumn5 && checkColumn6
                        && checkColumn7 && checkColumn8) {
                    workLst.add(newObj);
                    newObj.setCreateUser(sysId);
                    newObj.setCreateDate(new Date());
                    newObj.setName("Tháng " + newObj.getMonth() + "/" + newObj.getYear());
                    checkImport(newObj.getMonth(), newObj.getYear(), newObj.getCatStationId(),
                            newObj.getConstructionId());
                    contructionLandHandoverPlanDAO.saveObject(newObj.toModel());
                }

            }
        }
        if (isExistError) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            sheet.setColumnWidth(8, 5000);
            style.setAlignment(HorizontalAlignment.CENTER);
            Cell cell = sheet.getRow(1).createCell(8);
            cell.setCellValue("Cột lỗi");
            cell.setCellStyle(style);
            ContructionLandHandoverPlanDtoSearch objErr = new ContructionLandHandoverPlanDtoSearch();
            OutputStream out = new FileOutputStream(f, true);
            workbook.write(out);
            out.close();
            objErr.setErrorFilePath(UEncrypt.encryptFileUploadPath(path));
            workLst.add(objErr);
        }
        /*
         * for (ContructionLandHandoverPlanDtoSearch dto : workLst) {
         * dto.setMonth(dto.getMonth()); dto.setYear(dto.getYear());
         * dto.setCatStationId(dto.getCatStationId());
         * dto.setSysGroupId(dto.getSysGroupId());
         * dto.setContructionCode(dto.getContructionCode());
         * dto.setGroundPlanDate(dto.getGroundPlanDate());
         * dto.setCatPartnerCode(dto.getCatPartnerCode()); dto.setName("Tháng " +
         * dto.getMonth() + "/" + dto.getYear());
         * contructionLandHandoverPlanDAO.saveObject(dto.toModel()); }
         */
        workbook.close();
        return workLst;
    }

    /*
     * private boolean dateF(String gpDate) { // TODO Auto-generated method stub
     * return false; }
     */

    public Long checkPermissionsAdd(ContructionLandHandoverPlanDTO obj, Long sysGroupId, HttpServletRequest request) {

        if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE, Constant.AdResourceKey.LAND_HANDOVER_PLAN,
                request)) {
            throw new IllegalArgumentException("Bạn không có quyền tạo mới kế hoạch BGMB");
        }
        try {
            return 0l;
        } catch (Exception e) {
            return 1l;
        }
    }

    public Long checkImport(ContructionLandHandoverPlanDTO obj, Long sysGroupId, HttpServletRequest request) {

        if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE, Constant.AdResourceKey.LAND_HANDOVER_PLAN,
                request)) {
            throw new IllegalArgumentException("Bạn không có quyền Import kế hoạch BGMB");
        }
        try {
            return 0l;
        } catch (Exception e) {
            return 1l;
        }
    }

    public void addKpiLog(KpiLogDTO obj) {
        Long id = KpiLogDAO.saveObject(obj.toModel());
    }

    public String getConstructionName(Long constructionId) {
        // TODO Auto-generated method stub

        String conStructionCode = contructionLandHandoverPlanDAO.getConstructionCode(constructionId);
        return conStructionCode;
    }
}
