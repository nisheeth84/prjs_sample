package com.viettel.aio.business;

import com.viettel.aio.bo.AIOStaffPlanBO;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.dao.AIOStaffPlanDAO;
import com.viettel.aio.dao.AIOStaffPlanDetailDAO;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOStaffPlainDTO;
import com.viettel.aio.dto.AIOStaffPlanDetailDTO;
import com.viettel.coms.dto.DepartmentDTO;
import com.viettel.coms.dto.ExcelErrorDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.coms.utils.ValidateUtils;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.ConvertData;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.openxml4j.util.ZipSecureFile;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

@Service("aioEmployeeManagerBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOEmployeeManagerBusinessImpl extends BaseFWBusinessImpl<AIOStaffPlanDAO, AIOStaffPlainDTO, AIOStaffPlanBO> implements AIOEmployeeManagerBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIOEmployeeManagerBusinessImpl.class);

    @Autowired
    public AIOEmployeeManagerBusinessImpl(AIOStaffPlanDAO aioStaffPlanDAO, AIOStaffPlanDetailDAO aioStaffPlanDetailDAO,
                                          CommonServiceAio commonServiceAio) {
        this.aioStaffPlanDAO = aioStaffPlanDAO;
        this.aioStaffPlanDetailDAO = aioStaffPlanDetailDAO;
        this.commonServiceAio = commonServiceAio;
    }

    private AIOStaffPlanDAO aioStaffPlanDAO;
    private AIOStaffPlanDetailDAO aioStaffPlanDetailDAO;
    private CommonServiceAio commonServiceAio;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;


    public static boolean isRowEmpty(Row row) {
        for (int c = row.getFirstCellNum(); c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c);
            if (cell != null && cell.getCellType() != Cell.CELL_TYPE_BLANK) {
                return false;
            }
        }
        return true;
    }

    private HashMap<Integer, String> colAlias = new HashMap<>();

    {
        colAlias.put(0, "");
        colAlias.put(1, "B");
        colAlias.put(2, "C");
        colAlias.put(3, "D");
        colAlias.put(4, "E");
        colAlias.put(5, "F");
        colAlias.put(6, "G");
        colAlias.put(7, "H");
    }

    private HashMap<Integer, String> colName = new HashMap<>();

    {
        colName.put(0, "");
        colName.put(1, "Mã cụm đội");
        colName.put(2, "Mã nhân viên");
        colName.put(3, "Chỉ tiêu M&E(VND)");
        colName.put(4, "Chỉ Smarthome(VND)");
        colName.put(5, "Chỉ tiêu NLMT(VND)");
        colName.put(6, "Chỉ tiêu ICT(VND)");
        colName.put(7, "Chỉ tiêu MS(VND)");

    }

    private ExcelErrorDTO createError(int row, int columnIndex, String detail) {
        ExcelErrorDTO err = new ExcelErrorDTO();
        err.setColumnError(colAlias.get(columnIndex));
        err.setLineError(String.valueOf(row));
        err.setDetailError(colName.get(columnIndex) + " " + detail);
        return err;
    }

    private void doWriteError(List<ExcelErrorDTO> errorList, List<AIOStaffPlanDetailDTO> dtoList, String filePathError, int errColumn) {
        dtoList.clear();
        AIOStaffPlanDetailDTO errorContainer = new AIOStaffPlanDetailDTO();
        errorContainer.setErrorList(errorList);
        errorContainer.setMessageColumn(errColumn); // cột dùng để in ra lỗi
        errorContainer.setFilePathError(filePathError);
        dtoList.add(errorContainer);
    }

    public String convertValue(String value) {
        String val = value.replaceAll(",", "");
        return val;
    }

    public DataListDTO doSearch(AIOStaffPlainDTO obj, String sysGroupIdStr) {
        List<String> groupIdList = ConvertData.convertStringToList(sysGroupIdStr, ",");
        List<AIOStaffPlainDTO> dtos = aioStaffPlanDAO.doSearch(obj, groupIdList);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(obj.getTotalRecord());
        dataListDTO.setSize(obj.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }


    public DataListDTO exportDetailToExcel(AIOStaffPlainDTO obj, String sysGroupIdStr) {
        List<String> groupIdList = ConvertData.convertStringToList(sysGroupIdStr, ",");
        List<AIOStaffPlainDTO> dtos = aioStaffPlanDAO.exportDetailToExcel(obj, groupIdList);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(obj.getTotalRecord());
        dataListDTO.setSize(obj.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public DataListDTO getMonthlyTargetsByStaffId(AIOStaffPlainDTO obj, String sysGroupIdStr) {
        List<AIOStaffPlanDetailDTO> dtos = aioStaffPlanDAO.getMonthlyTargetsByStaffId(obj, sysGroupIdStr);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(obj.getTotalRecord());
        dataListDTO.setSize(obj.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    @Override
    public void insertMonthPlan(AIOStaffPlainDTO obj, Long sysUserId) {
        Long sysGroupLv2Id = Long.parseLong(obj.getSysGroupIdsPermission().get(0));

        DepartmentDTO departmentDTO = commonServiceAio.getSysGroupById(sysGroupLv2Id);
        obj.setSysGroupId(sysGroupLv2Id);
        obj.setSysGroupCode(departmentDTO.getCode());
        obj.setSysGroupName(departmentDTO.getName());
        obj.setStatus(1L);
        obj.setCreatedUser(sysUserId);
        obj.setCreatedDate(new Date());

        if (aioStaffPlanDAO.checkExistInsert(sysGroupLv2Id, obj.getMonth(), obj.getYear())) {
            throw new BusinessException(AIOErrorType.DUPLICATE.msg + " chỉ tiêu tháng " + obj.getMonth() + " cho " + departmentDTO.getName());
        }

        // sum target of month's group level 2
        Long targetMonth = aioStaffPlanDAO.getSumTargetPlanOfMonth(obj.getYear(), obj.getMonth(), obj.getSysGroupId());
        if (targetMonth == 0) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + " kế hoạch tháng " + obj.getMonth());
        }

        // save info staffPlan
        Long id = aioStaffPlanDAO.saveObject(obj.toModel());
        commonServiceAio.validateIdCreated(id, AIOErrorType.SAVE_ERROR.msg + " chỉ tiêu NV");

        //check sum total target with target plan month
        Long totalTarget = 0L; // sum target of staff in group level 2

        // save info staffPlanDetail
        Long idDetail;
        for (AIOStaffPlanDetailDTO dto : obj.getListStaffPlanDetail()) {
            dto.setAioStaffPlanId(id);
            dto.setTargetsMe(dto.getTargetsMe() == null ? 0 : dto.getTargetsMe());
            dto.setTargetsNlmt(dto.getTargetsNlmt() == null ? 0 : dto.getTargetsNlmt());
            dto.setTargetsSh(dto.getTargetsSh() == null ? 0 : dto.getTargetsSh());
            dto.setTargetsIct(dto.getTargetsIct() == null ? 0 : dto.getTargetsIct());
            dto.setTargetsMs(dto.getTargetsMs() == null ? 0 : dto.getTargetsMs());
            idDetail = aioStaffPlanDetailDAO.saveObject(dto.toModel());
            commonServiceAio.validateIdCreated(idDetail, AIOErrorType.SAVE_ERROR.msg + " chi tiết chỉ tiêu NV ");

            totalTarget += (dto.getTargetsMe() + dto.getTargetsNlmt() + dto.getTargetsSh() + dto.getTargetsIct() + dto.getTargetsMs());
        }

        if (totalTarget < targetMonth) {
            throw new BusinessException("Tổng chỉ tiêu nhân viên nhỏ hơn chỉ tiêu tháng của đơn vị [" + totalTarget + "<" + targetMonth + "]");
        }
    }

    public AIOStaffPlainDTO checkDataMonthPlan(AIOStaffPlainDTO obj) {
        return aioStaffPlanDAO.checkDataMonthPlan(obj);
    }


    public String exportFileBM(AIOStaffPlainDTO obj, HttpServletRequest request) throws Exception {
//        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
//        String[] pathId = objUser.getVpsUserInfo().getPath().split("/");
//        Long sysGroupLevel2 = Long.parseLong(pathId[2]);

        obj.setPage(null);
        obj.setPageSize(null);
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + "BM_ChiTieuNhanVien.xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        file.close();
        Calendar cal = Calendar.getInstance();
        String uploadPath = folderUpload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
                + File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
                + File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
                + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
                + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        File udir = new File(uploadPath);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "BM_ChiTieuNhanVien.xlsx");

        //Trung start 29/10/2019
        XSSFSheet sheet0 = workbook.getSheetAt(0);
        if (!obj.getIsCreatNew()) {
            List<AIOStaffPlanDetailDTO> dataUpdate = aioStaffPlanDAO.getDetailByStaffPlanId(obj);
            if (dataUpdate != null && !dataUpdate.isEmpty()) {
                int co = 1;
                XSSFCellStyle style = ExcelUtils.styleText(sheet0);
                XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet0);
                styleNumber.setAlignment(HorizontalAlignment.RIGHT);
                for (AIOStaffPlanDetailDTO dto : dataUpdate) {
                    Row row = sheet0.createRow(co++);
                    Cell cell = row.createCell(0, CellType.STRING);
                    cell.setCellValue("" + (co - 1));
                    cell.setCellStyle(styleNumber);
                    cell = row.createCell(1, CellType.STRING);
                    cell.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupCode() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(2, CellType.STRING);
                    cell.setCellValue((dto.getSysUserCode() != null) ? dto.getSysUserCode() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(3, CellType.STRING);
                    cell.setCellValue((dto.getTargetsMe() != null) ? dto.getTargetsMe() : 0L);
                    cell.setCellStyle(styleNumber);
                    cell = row.createCell(4, CellType.STRING);
                    cell.setCellValue((dto.getTargetsSh() != null) ? dto.getTargetsSh() : 0L);
                    cell.setCellStyle(styleNumber);
                    cell = row.createCell(5, CellType.STRING);
                    cell.setCellValue((dto.getTargetsNlmt() != null) ? dto.getTargetsNlmt() : 0L);
                    cell.setCellStyle(styleNumber);
                    cell = row.createCell(6, CellType.STRING);
                    cell.setCellValue((dto.getTargetsIct() != null) ? dto.getTargetsIct() : 0L);
                    cell.setCellStyle(styleNumber);
                    cell = row.createCell(7, CellType.STRING);
                    cell.setCellValue((dto.getTargetsMs() != null) ? dto.getTargetsMs() : 0L);
                    cell.setCellStyle(styleNumber);
                }
            }
        }


        List<AIOStaffPlanDetailDTO> dataSysGroup = aioStaffPlanDAO.getAllSysGroup(obj.getSysGroupIdsPermission());
        XSSFSheet sheet1 = workbook.getSheetAt(1);
        if (dataSysGroup != null && !dataSysGroup.isEmpty()) {
            int count = 1;
            XSSFCellStyle style = ExcelUtils.styleText(sheet1);
            XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet1);
            styleNumber.setAlignment(HorizontalAlignment.RIGHT);
            for (AIOStaffPlanDetailDTO dtoSysGroup : dataSysGroup) {
                Row row = sheet1.createRow(count++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (count - 1));
                cell.setCellStyle(styleNumber);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue((dtoSysGroup.getSysGroupCode() != null) ? dtoSysGroup.getSysGroupCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue((dtoSysGroup.getSysGroupName() != null) ? dtoSysGroup.getSysGroupName() : "");
                cell.setCellStyle(style);
            }
        }

        List<AIOStaffPlanDetailDTO> dataSysUser = aioStaffPlanDAO.getAllSysUser(obj.getSysGroupIdsPermission());
        XSSFSheet sheet = workbook.getSheetAt(2);
        if (dataSysUser != null && !dataSysUser.isEmpty()) {
            int i = 1;
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
            styleNumber.setAlignment(HorizontalAlignment.RIGHT);
            for (AIOStaffPlanDetailDTO dtoSysUser : dataSysUser) {
                Row row = sheet.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (i - 1));
                cell.setCellStyle(styleNumber);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue((dtoSysUser.getSysUserCode() != null) ? dtoSysUser.getSysUserCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue((dtoSysUser.getSysUserName() != null) ? dtoSysUser.getSysUserName() : "");
                cell.setCellStyle(style);
            }
        }

        //Trung end 29/10/2019
        workbook.write(outFile);
        workbook.close();
        outFile.close();
        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "BM_ChiTieuNhanVien.xlsx");
        return path;
    }

    public DataListDTO getDetailByMonthPlanId(AIOStaffPlainDTO criteria) {
        List<AIOStaffPlanDetailDTO> dtos = aioStaffPlanDAO.getDetailByMonthPlanId(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public DataListDTO getDetailByStaffPlanId(AIOStaffPlainDTO criteria) {
        List<AIOStaffPlanDetailDTO> dtos = aioStaffPlanDAO.getDetailByStaffPlanId(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }


    public DataListDTO searchColumnsConfigService() {
        List<AIOConfigServiceDTO> dtos = aioStaffPlanDAO.searchColumnsConfigService();
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        return dataListDTO;
    }

    public AIOStaffPlainDTO getAioMonthPlanDTO(Long id) {
        return aioStaffPlanDAO.getAioMonthPlanDTO(id);
    }

    public void updateMonthPlan(AIOStaffPlainDTO obj, Long sysUserId) {
        Long sysGroupLv2Id = Long.parseLong(obj.getSysGroupIdsPermission().get(0));
        if (aioStaffPlanDAO.checkExistUpdate(obj.getAioStaffPlanId(), sysGroupLv2Id) == null) {
            throw new BusinessException(AIOErrorType.NOT_AUTHORIZE.msg + " sửa chỉ tiêu");
        }

        obj.setUpdateUser(sysUserId);
        int result = aioStaffPlanDAO.updateStaffPlan(obj);
        commonServiceAio.validateIdCreated(result, AIOErrorType.SAVE_ERROR.msg + " chỉ tiêu NV");

        result = aioStaffPlanDAO.deleteStaffPlanDetail(obj.getAioStaffPlanId());
        commonServiceAio.validateIdCreated(result, AIOErrorType.ACTION_FAILED.msg + " chi tiết chỉ tiêu NV");

        Long id;
        for (AIOStaffPlanDetailDTO dto : obj.getListStaffPlanDetail()) {
            dto.setAioStaffPlanId(obj.getAioStaffPlanId());
            dto.setTargetsMe(dto.getTargetsMe() == null ? 0 : dto.getTargetsMe());
            dto.setTargetsNlmt(dto.getTargetsNlmt() == null ? 0 : dto.getTargetsNlmt());
            dto.setTargetsSh(dto.getTargetsSh() == null ? 0 : dto.getTargetsSh());
            dto.setTargetsIct(dto.getTargetsIct() == null ? 0 : dto.getTargetsIct());
            dto.setTargetsMs(dto.getTargetsMs() == null ? 0 : dto.getTargetsMs());
            id = aioStaffPlanDetailDAO.saveObject(dto.toModel());
            commonServiceAio.validateIdCreated(id, AIOErrorType.SAVE_ERROR.msg + " chi tiết chỉ tiêu NV");
        }
    }

    public void removerStaffPlan(AIOStaffPlainDTO obj) {
        obj.setStatus(0l);
        aioStaffPlanDAO.removeStaffPlan(obj);
//        aioStaffPlanDAO.updateObject(obj.toModel());
    }

    public List<AIOStaffPlanDetailDTO> doImportExcel(String filePath, List<String> sysGroupIdsPermission, HttpServletRequest request) {
//        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
//        String[] pathId = objUser.getVpsUserInfo().getPath().split("/");
//        Long sysGroupLevel2 = Long.parseLong(pathId[2]);

        List<AIOStaffPlanDetailDTO> dtoList = new ArrayList<>();
        List<ExcelErrorDTO> errorList = new ArrayList<>();
        HashMap<String, String> mapDuplicate = new HashMap<>();
        HashSet<String> userSet = new HashSet<>();

        Map<String, Integer> mapValidatedUserCode = new HashMap<>();

        // ds cum duoc tao chi tieu
        List<AIOStaffPlanDetailDTO> dataCumDoi = aioStaffPlanDAO.getAllSysGroup(sysGroupIdsPermission);
        HashMap<String, AIOStaffPlanDetailDTO> mapSysGroupRef = new HashMap<>();
        if (dataCumDoi != null) {
            dataCumDoi.forEach(r -> mapSysGroupRef.put(r.getSysGroupCode().toUpperCase(), r));
        }

        List<AIOStaffPlanDetailDTO> dataUser = aioStaffPlanDAO.getAllSysUser(sysGroupIdsPermission);
        HashMap<String, AIOStaffPlanDetailDTO> mapSysUserRef = new HashMap<>();
        if (dataUser != null) {
            dataUser.forEach(r -> mapSysUserRef.put(r.getSysUserCode().toUpperCase(), r));
        }

        try {
            File f = new File(filePath);
            ZipSecureFile.setMinInflateRatio(-1.0d);
            XSSFWorkbook workbook = new XSSFWorkbook(f);
            XSSFSheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();
            int rowCount = 0;

            for (Row row : sheet) {
                rowCount++;
                if (rowCount >= 2 && !isRowEmpty(row)) {
                    AIOStaffPlanDetailDTO dtoValidated = new AIOStaffPlanDetailDTO();
                    String sysGroupCode = formatter.formatCellValue(row.getCell(1)).trim();
                    String sysUserCode = formatter.formatCellValue(row.getCell(2)).trim();
                    //tatph-start-25/12/2019
                    String targetsMe = formatter.formatCellValue(row.getCell(3)).trim();
                    String targetsSh = formatter.formatCellValue(row.getCell(4)).trim();
                    String targetsNlmt = formatter.formatCellValue(row.getCell(5)).trim();
                    String targetsIct = formatter.formatCellValue(row.getCell(6)).trim();
                    String targetsMs = formatter.formatCellValue(row.getCell(7)).trim();
                    //tatph-end-25/12/2019
                    int errorCol = 1;

                    if (!StringUtils.isEmpty(sysGroupCode)) {
                        AIOStaffPlanDetailDTO sysGroupInfo = mapSysGroupRef.get(sysGroupCode.toUpperCase());
                        if (sysGroupInfo != null) {
                            dtoValidated.setSysGroupCode(sysGroupInfo.getSysGroupCode());
                            dtoValidated.setSysGroupId(sysGroupInfo.getSysGroupId());
                            dtoValidated.setSysGroupName(sysGroupInfo.getSysGroupName());
                        } else {
                            errorList.add(this.createError(rowCount, errorCol, "không tồn tại"));
                        }

                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                    }

                    errorCol = 2;
                    if (!StringUtils.isEmpty(sysUserCode)) {
                        AIOStaffPlanDetailDTO sysUserInfo = mapSysUserRef.get(sysUserCode.toUpperCase());
                        if (sysUserInfo != null) {
                            if (!mapSysGroupRef.containsKey(sysUserInfo.getSysGroupCode().toUpperCase())) {
                                errorList.add(this.createError(rowCount, errorCol, sysUserCode.toUpperCase() + " không thuộc cụm đội " + sysGroupCode.toUpperCase()));
                            }

                            if (mapDuplicate.containsKey(sysUserCode.toUpperCase())) {
                                errorList.add(this.createError(rowCount, errorCol, sysUserCode.toUpperCase() + " đã tồn tại"));
                            } else {
                                dtoValidated.setSysUserId(sysUserInfo.getSysUserId());
                                dtoValidated.setSysUserCode(sysUserInfo.getSysUserCode());
                                dtoValidated.setSysUserName(sysUserInfo.getSysUserName());
                                mapDuplicate.put(sysUserCode.toUpperCase(), sysGroupCode.toUpperCase());
                            }
                        } else {
                            errorList.add(this.createError(rowCount, errorCol, "không tồn tại"));
                        }
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                    }

                    errorCol = 3;
                    String valueTargetsMe = convertValue(targetsMe);
                    if (!StringUtils.isEmpty(targetsMe)) {
                        if (!ValidateUtils.isLong(valueTargetsMe)) {
                            errorList.add(this.createError(rowCount, errorCol, "không đúng định dạng"));

                        } else {
                            if (Long.parseLong(valueTargetsMe) < 0) {
                                errorList.add(this.createError(rowCount, errorCol, "giá trị phải lớn hơn 0"));
                            } else {
                                dtoValidated.setTargetsMe(Long.parseLong(valueTargetsMe));
                            }

                        }
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                    }

                    errorCol = 4;
                    String valueTargetsSh = convertValue(targetsSh);
                    if (!StringUtils.isEmpty(targetsSh)) {
                        if (!ValidateUtils.isLong(valueTargetsSh)) {
                            errorList.add(this.createError(rowCount, errorCol, "không đúng định dạng"));

                        } else {
                            if (Long.parseLong(valueTargetsSh) < 0) {
                                errorList.add(this.createError(rowCount, errorCol, "giá trị phải lớn hơn 0"));
                            } else {
                                dtoValidated.setTargetsSh(Long.parseLong(valueTargetsSh));
                            }

                        }
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                    }

                    errorCol = 5;
                    String valueTargetsNlmt = convertValue(targetsNlmt);
                    if (!StringUtils.isEmpty(targetsNlmt)) {
                        if (!ValidateUtils.isLong(valueTargetsNlmt)) {
                            errorList.add(this.createError(rowCount, errorCol, "không đúng định dạng"));

                        } else {
                            if (Long.parseLong(valueTargetsNlmt) < 0) {
                                errorList.add(this.createError(rowCount, errorCol, "giá trị phải lớn hơn 0"));
                            } else {
                                dtoValidated.setTargetsNlmt(Long.parseLong(valueTargetsNlmt));
                            }

                        }
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                    }

                    errorCol = 6;
                    String valueTargetsIct = convertValue(targetsIct);
                    if (!StringUtils.isEmpty(targetsIct)) {
                        if (!ValidateUtils.isLong(valueTargetsIct)) {
                            errorList.add(this.createError(rowCount, errorCol, "không đúng định dạng"));

                        } else {
                            if (Long.parseLong(valueTargetsIct) < 0) {
                                errorList.add(this.createError(rowCount, errorCol, "giá trị phải lớn hơn 0"));
                            } else {
                                dtoValidated.setTargetsIct(Long.parseLong(valueTargetsIct));
                            }

                        }
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                    }

                    errorCol = 7;
                    String valueTargetsMs = convertValue(targetsMs);
                    if (!StringUtils.isEmpty(targetsMs)) {
                        if (!ValidateUtils.isLong(valueTargetsMs)) {
                            errorList.add(this.createError(rowCount, errorCol, "không đúng định dạng"));

                        } else {
                            if (Long.parseLong(valueTargetsMs) < 0) {
                                errorList.add(this.createError(rowCount, errorCol, "giá trị phải lớn hơn 0"));
                            } else {
                                dtoValidated.setTargetsMs(Long.parseLong(valueTargetsMs));
                            }

                        }
                    } else {
                        errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                    }

                    if (errorList.size() == 0) {
                        dtoList.add(dtoValidated);
                        mapValidatedUserCode.put(dtoValidated.getSysUserCode(), rowCount);
                    }
                }
            }

//            AIOStaffPlainDTO criteria = new AIOStaffPlainDTO();
//            String[] dateArr = monthYear.split("/");
//            criteria.setMonth(dateArr[0]);
//            criteria.setYear(dateArr[1]);
//            criteria.setSysUserCodes(new ArrayList<>(mapValidatedUserCode.keySet()));
//            List<AIOStaffPlanDetailDTO> duplicates = aioStaffPlanDAO.checkDuplicateStaffPlan(criteria);
//            if (duplicates.size() > 0) {
//                for (AIOStaffPlanDetailDTO exist : duplicates) {
//                    errorList.add(this.createError(mapValidatedUserCode.get(exist.getSysUserCode()), 2,
//                            "Chỉ tiêu cho Mã NV " + exist.getSysUserCode() + " đã tồn tại" ));
//                }
//            }

            if (errorList.size() > 0) {
                String filePathError = UEncrypt.encryptFileUploadPath(filePath);
                this.doWriteError(errorList, dtoList, filePathError, 8);
            }
            workbook.close();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ExcelErrorDTO errorDTO = createError(0, 0, e.toString());
            errorList.add(errorDTO);
            String filePathError = null;
            try {
                filePathError = UEncrypt.encryptFileUploadPath(filePath);
            } catch (Exception ex) {
                LOGGER.error(e.getMessage(), e);
                errorDTO = createError(0, 0, ex.toString());
                errorList.add(errorDTO);
            }
            this.doWriteError(errorList, dtoList, filePathError, 8);
        }
        return dtoList;
    }

    @Override
    public List<AIOStaffPlanDetailDTO> getAllSysGroupByCode(AIOStaffPlanDetailDTO obj, HttpServletRequest request) {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        String[] pathId = objUser.getVpsUserInfo().getPath().split("/");
        Long sysGroupLevel2 = Long.parseLong(pathId[2]);
        return aioStaffPlanDAO.getAllSysGroupByCode(obj, sysGroupLevel2);
    }

    @Override
    public List<AIOStaffPlanDetailDTO> getAllSysUserByName(AIOStaffPlanDetailDTO obj, HttpServletRequest request) {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        String[] pathId = objUser.getVpsUserInfo().getPath().split("/");
        Long sysGroupLevel2 = Long.parseLong(pathId[2]);
        return aioStaffPlanDAO.getAllSysUserByName(obj, sysGroupLevel2);
    }

    @Override
    public int validateNewEdit(AIOStaffPlanDetailDTO obj) {
        return aioStaffPlanDAO.validateNewEdit(obj);
    }


}
