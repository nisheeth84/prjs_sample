package com.viettel.aio.business;

import com.viettel.aio.bo.AIOAreaBO;
import com.viettel.aio.dao.AIOAreaDAO;
import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.coms.dto.ExcelErrorDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.format.CellFormat;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFRow;
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
import javax.ws.rs.core.Context;
import java.io.File;
import java.util.*;

//VietNT_20190506_created
@Service("aioAreaBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOAreaBusinessImpl extends BaseFWBusinessImpl<AIOAreaDAO, AIOAreaDTO, AIOAreaBO> implements AIOAreaBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIOAreaBusinessImpl.class);

    @Autowired
    private AIOAreaDAO aioAreaDao;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Autowired
    private CommonServiceAio commonServiceAio;

    @Context
    HttpServletRequest request;

    private final String FILE_IMPORT_NAME = "Bieu_mau_NV_phu_trach_khu_vuc.xlsx";
    private HashMap<Integer, String> colAlias = new HashMap<>();
    {
        colAlias.put(0, "");
        colAlias.put(3, "D");
        colAlias.put(4, "E");
        colAlias.put(5, "F");
    }

    private HashMap<Integer, String> colName = new HashMap<>();
    {
        colName.put(0, "");
        colName.put(3, "Mã nhân viên phụ trách HĐ dịch vụ");
        colName.put(4, "Mã nhân viên phụ trách HĐ bán hàng");
        colName.put(5, "");
    }

    public DataListDTO doSearch(AIOAreaDTO criteria) {
        List<AIOAreaDTO> dtos = aioAreaDao.doSearch(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }


    public DataListDTO doSearchTree(AIOAreaDTO criteria) {
        List<AIOAreaDTO> dtos = aioAreaDao.doSearchTree(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    private final String EMPTY_REQUEST = "Không có dữ liệu!";
    private final String SAVE_FAILED = "Lưu dữ liệu thất bại!";

    public void updatePerformer(AIOAreaDTO areaDTO) {
        if (areaDTO == null || (areaDTO.getAreaIds() == null || areaDTO.getAreaIds().isEmpty())
                || areaDTO.getSysUserId() == null || StringUtils.isEmpty(areaDTO.getFullName())
                || StringUtils.isEmpty(areaDTO.getEmployeeCode())
                //VietNT_12/08/2019_start
                || (areaDTO.getTypePerformer() != 1 && areaDTO.getTypePerformer() != 2)) {
                //VietNT_end
            throw new BusinessException(EMPTY_REQUEST);
        }

        int result = aioAreaDao.updatePerformer(areaDTO);
        if (result < 1) {
            throw new BusinessException(SAVE_FAILED);
        }
    }

    public void updateListPerformer(List<AIOAreaDTO> areaDTOs) {
        for (AIOAreaDTO dto : areaDTOs) {
            int result = aioAreaDao.updatePerformerBoth(dto);
            if (result < 1) {
                throw new BusinessException(SAVE_FAILED);
            }
        }
    }

    public List<AIOAreaDTO> doImportExcel(String path) {
        List<AIOAreaDTO> dtoList = new ArrayList<>();
        List<ExcelErrorDTO> errorList = new ArrayList<>();
        int errColumn = 6;

        try {
            File f = new File(path);
            XSSFWorkbook workbook = new XSSFWorkbook(f);
            XSSFSheet sheet = workbook.getSheetAt(0);

            DataFormatter formatter = new DataFormatter();

            int rowCount = 0;
            Map<String, List<Long>> mapPerformers = new HashMap<>();
            Map<String, SysUserCOMSDTO> mapUserInfo = new HashMap<>();
            SysUserCOMSDTO criteria = new SysUserCOMSDTO();
            String key;

            for (Row row : sheet) {
                rowCount++;
                // data start from row 3
                if (rowCount < 4) {
                    continue;
                }

                String employeeCode = formatter.formatCellValue(row.getCell(3)).trim();
                String saleEmployeeCode = formatter.formatCellValue(row.getCell(4)).trim();
                String areaIdStr = formatter.formatCellValue(row.getCell(5)).trim();

                int errorCol = 5;
                Long areaId = 0L;
                if (StringUtils.isNotEmpty(areaIdStr)) {
                    try {
                        areaId = Long.parseLong(areaIdStr);
                        if (aioAreaDao.checkIdExist(areaId) < 1) {
                            errorList.add(commonServiceAio.createError(rowCount, colAlias.get(errorCol), colName.get(errorCol),
                                    "Mã khu vực không hợp lệ, sử dụng biểu mẫu để import!"));
                        }
                    } catch (NumberFormatException e) {
                        errorList.add(commonServiceAio.createError(rowCount, colAlias.get(errorCol), colName.get(errorCol),
                                "Mã khu vực không hợp lệ, sử dụng biểu mẫu để import!"));
                    }
                } else {
                    errorList.add(commonServiceAio.createError(rowCount, colAlias.get(errorCol), colName.get(errorCol),
                            "Mã khu vực không hợp lệ, sử dụng biểu mẫu để import!"));
                }

                errorCol = 3;
                boolean checkPerformer = this.validatePerformer(errorList, rowCount, mapPerformers, mapUserInfo, employeeCode, errorCol);

                errorCol = 4;
                boolean checkSalePerformer = this.validatePerformer(errorList, rowCount, mapPerformers, mapUserInfo, saleEmployeeCode, errorCol);

                key = employeeCode.toUpperCase() + "_" + saleEmployeeCode.toUpperCase();
                if (checkPerformer && checkSalePerformer) {
                    if (!mapPerformers.containsKey(key)) {
                        mapPerformers.put(key, new ArrayList<>());
                    }
                }

                if (errorList.size() == 0) {
                    // add id to employee code
                    mapPerformers.get(key).add(areaId);
                }
            }

            if (errorList.size() > 0) {
                String filePathError = UEncrypt.encryptFileUploadPath(path);
                commonServiceAio.doWriteError(errorList, dtoList, filePathError, new AIOAreaDTO(), errColumn);
            } else {
                AIOAreaDTO validDTO;
                for (Map.Entry<String, List<Long>> entry : mapPerformers.entrySet()) {
                    String[] codes = StringUtils.split(entry.getKey(), "_");
                    SysUserCOMSDTO performer = mapUserInfo.get(codes[0].toUpperCase());
                    SysUserCOMSDTO salePerformer = mapUserInfo.get(codes[1].toUpperCase());

                    validDTO = new AIOAreaDTO();
                    validDTO.setEmployeeCode(performer.getEmployeeCode());
                    validDTO.setSysUserId(performer.getSysUserId());
                    validDTO.setFullName(performer.getFullName());

                    validDTO.setSaleEmployeeCode(salePerformer.getEmployeeCode());
                    validDTO.setSaleSysUserId(salePerformer.getSysUserId());
                    validDTO.setSaleFullName(salePerformer.getFullName());

                    validDTO.setAreaIds(entry.getValue());

                    dtoList.add(validDTO);
                }
            }
            workbook.close();

        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ExcelErrorDTO errorDTO = commonServiceAio.createError(3, StringUtils.EMPTY, StringUtils.EMPTY, e.toString());
            errorList.add(errorDTO);
            String filePathError = null;

            try {
                filePathError = UEncrypt.encryptFileUploadPath(path);
            } catch (Exception ex) {
                LOGGER.error(ex.getMessage(), ex);
                errorDTO = commonServiceAio.createError(3, StringUtils.EMPTY, StringUtils.EMPTY, ex.toString());
                errorList.add(errorDTO);
            }
            commonServiceAio.doWriteError(errorList, dtoList, filePathError, new AIOAreaDTO(), errColumn);
        }

        return dtoList;
    }

    private boolean validatePerformer(List<ExcelErrorDTO> errorList, int rowCount, Map<String, List<Long>> mapPerformers,
                                   Map<String, SysUserCOMSDTO> mapUserInfo, String employeeCode, int errorCol) {
        boolean result = false;
        if (StringUtils.isNotEmpty(employeeCode)) {
            List<Long> areaIds = mapPerformers.get(employeeCode.toUpperCase());
            if (areaIds == null) {
                // check user exist
                if (mapUserInfo.containsKey(employeeCode.toUpperCase())) {
                    result = true;
                } else {
                    SysUserCOMSDTO criteria = new SysUserCOMSDTO();
                    criteria.setEmployeeCode(employeeCode);
                    SysUserCOMSDTO user = commonServiceAio.getUserByCodeOrId(criteria);
                    if (user != null) {
                        mapUserInfo.put(employeeCode.toUpperCase(), user);
                        result = true;
                    } else {
                        errorList.add(commonServiceAio.createError(rowCount, colAlias.get(errorCol), colName.get(errorCol),
                                "không hợp lệ"));
                    }
                }
            }
        } else {
            errorList.add(commonServiceAio.createError(rowCount, colAlias.get(errorCol), colName.get(errorCol),
                    "không được bỏ trống"));
        }
        return result;
    }

    public String downloadTemplate(AIOAreaDTO obj) throws Exception {
        XSSFWorkbook workbook = commonServiceAio.createWorkbook(FILE_IMPORT_NAME);

        List<AIOAreaDTO> dtos = aioAreaDao.doSearch(obj);
        if (dtos == null || dtos.isEmpty()) {
            throw new BusinessException(EMPTY_REQUEST);
        }

        CellStyle style = workbook.createCellStyle();
        DataFormat dataFormat = workbook.createDataFormat();
        style.setDataFormat(dataFormat.getFormat("@"));

        // sheet 1, existing data
        XSSFSheet sheet = workbook.getSheetAt(0);
        int rowNum = 3;
        int column;

        for (AIOAreaDTO areaDTO : dtos) {
            column = 0;
            XSSFRow row = sheet.createRow(rowNum);
            commonServiceAio.createExcelCell(row, column++, style).setCellValue(areaDTO.getAreaNameLevel2());
            commonServiceAio.createExcelCell(row, column++, style).setCellValue(areaDTO.getAreaNameLevel3());
            commonServiceAio.createExcelCell(row, column++, style).setCellValue(areaDTO.getName());
            commonServiceAio.createExcelCell(row, column++, style).setCellValue(areaDTO.getEmployeeCode());
            commonServiceAio.createExcelCell(row, column++, style).setCellValue(areaDTO.getSaleEmployeeCode());
            commonServiceAio.createExcelCell(row, column, style).setCellValue(areaDTO.getAreaId());
            rowNum++;
        }

        String path = commonServiceAio.writeToFileOnServer(workbook, FILE_IMPORT_NAME);
        return path;
    }
}
