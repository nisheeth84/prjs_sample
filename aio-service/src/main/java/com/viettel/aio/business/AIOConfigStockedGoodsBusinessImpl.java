package com.viettel.aio.business;

import com.viettel.aio.bo.AIOConfigStockedGoodsBO;
import com.viettel.aio.dao.AIOConfigStockedGoodsDAO;
import com.viettel.aio.dto.AIOConfigStockedGoodsDTO;
import com.viettel.aio.dto.ExcelErrorDTO;
import com.viettel.coms.dto.DepartmentDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.dao.GoodsDAO;
import com.viettel.coms.dto.GoodsDTO;
import org.apache.commons.lang3.StringUtils;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
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
import java.text.DecimalFormat;
import java.util.*;

//VietNT_20190530_created
@Service("aioConfigStockedGoodsBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOConfigStockedGoodsBusinessImpl extends BaseFWBusinessImpl<AIOConfigStockedGoodsDAO, AIOConfigStockedGoodsDTO, AIOConfigStockedGoodsBO> implements AIOConfigStockedGoodsBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIOConfigStockedGoodsBusinessImpl.class);

    @Autowired
    private AIOConfigStockedGoodsDAO aioConfigStockedGoodsDao;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Context
    HttpServletRequest request;

    @Autowired
    private CommonServiceAio commonService;

    @Autowired
    private GoodsDAO goodsDAO;

    private final String FILE_IMPORT_NAME = "Bieu_mau_cau_hinh_hang_ton_kho.xlsx";

    public DataListDTO doSearch(AIOConfigStockedGoodsDTO criteria) {
        List<AIOConfigStockedGoodsDTO> dtos = aioConfigStockedGoodsDao.doSearch(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public void updateConfig(AIOConfigStockedGoodsDTO criteria, Long sysUserId) {
        int result = aioConfigStockedGoodsDao.updateConfig(criteria, sysUserId);
    }

    public void deleteConfig(AIOConfigStockedGoodsDTO criteria) {
        int result = aioConfigStockedGoodsDao.deleteConfig(criteria);
    }

    @SuppressWarnings("unchecked")
    public String downloadTemplate() throws Exception {
        XSSFWorkbook workbook = commonService.createWorkbook(FILE_IMPORT_NAME);

        CellStyle style = workbook.createCellStyle();

        List<DepartmentDTO> listGroup =
                commonService.getListSysGroup(new DepartmentDTO(), Collections.singletonList("2")).getData();

        // sheet 2, ref data
        XSSFSheet sheet = workbook.getSheetAt(1);
        int rowNum = 1;

        for (DepartmentDTO dto : listGroup) {
            XSSFRow row = sheet.createRow(rowNum);
            commonService.createExcelCell(row, 0, style).setCellValue(dto.getCode());
            commonService.createExcelCell(row, 1, style).setCellValue(dto.getName());
            rowNum++;
        }

        String path = commonService.writeToFileOnServer(workbook, FILE_IMPORT_NAME);
        return path;
    }

    public void addNewConfig(List<AIOConfigStockedGoodsDTO> dtos) {
        for (AIOConfigStockedGoodsDTO dto : dtos) {
            Long result = aioConfigStockedGoodsDao.saveObject(dto.toModel());
            if (result < 1) {
                throw new BusinessException("Lưu cấu hình thất bại!");
            }
        }
    }

    private HashMap<Integer, String> colAlias = new HashMap<>();

    {
        colAlias.put(0, "A");
        colAlias.put(1, "B");
        colAlias.put(2, "C");
        colAlias.put(3, "D");
        colAlias.put(4, "E");
        colAlias.put(5, "F");
    }

    private HashMap<Integer, String> colName = new HashMap<>();

    {
        colName.put(0, "ĐƠN VỊ");
        colName.put(1, "MÃ VẬT TƯ");
        colName.put(2, "SỐ LƯỢNG MIN");
        colName.put(3, "SỐ LƯỢNG MAX");
        colName.put(4, "THỜI GIAN TỒN KHO ( NGÀY)");
    }

    public List<AIOConfigStockedGoodsDTO> doImportExcel(Attachment attachments, HttpServletRequest request, Long sysUserId) {
        String filePath = commonService.uploadToServer(attachments, request);
        List<AIOConfigStockedGoodsDTO> results = this.readFileAndValidate(filePath, sysUserId);
        return results;
    }

    private List<AIOConfigStockedGoodsDTO> readFileAndValidate(String path, Long sysUserId) {
        List<AIOConfigStockedGoodsDTO> dtoList = new ArrayList<>();
        List<ExcelErrorDTO> errorList = new ArrayList<>();
        int errColumn = 6;
        Date today = new Date();

        try {
            File f = new File(path);
            XSSFWorkbook workbook = new XSSFWorkbook(f);
            XSSFSheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();

            Map<String, DepartmentDTO> mapSysGroups = new HashMap<>();
            Map<String, GoodsDTO> mapGoods = new HashMap<>();
            Map<String, AIOConfigStockedGoodsDTO> mapUnit = new HashMap<>();

            Map<String, AIOConfigStockedGoodsDTO> mapResult = new HashMap<>();

            int rowCount = 0;
            for (Row row : sheet) {
                rowCount++;
                // data start from row 3
                if (rowCount < 3) {
                    continue;
                }

                String sysGroupCode = formatter.formatCellValue(row.getCell(0)).trim();
                String goodsCode = formatter.formatCellValue(row.getCell(1)).trim();
                String minStr = formatter.formatCellValue(row.getCell(2)).trim();
                String maxStr = formatter.formatCellValue(row.getCell(3)).trim();
                String timeStr = formatter.formatCellValue(row.getCell(4)).trim();

                AIOConfigStockedGoodsDTO validated = new AIOConfigStockedGoodsDTO();

                if (this.validateSysGroupCode(rowCount, sysGroupCode, mapSysGroups, errorList)) {
                    DepartmentDTO dto = mapSysGroups.get(sysGroupCode.toUpperCase());
                    validated.setSysGroupId(dto.getSysGroupId());
                    validated.setSysGroupName(dto.getName());
                }

                if (this.validateGoodsCode(rowCount, goodsCode, mapGoods, errorList)) {
                    GoodsDTO dto = mapGoods.get(goodsCode.toUpperCase());
                    validated.setGoodsId(dto.getGoodsId());
                    validated.setGoodsCode(dto.getCode());
                    validated.setGoodsName(dto.getName());
                    validated.setCatUnitId(dto.getUnitType());
                    validated.setCatUnitName(dto.getUnitTypeName());
                }

                Double[] minMax = this.validateMinMax(rowCount, minStr, maxStr, errorList);
                if (minMax[0] > 0 && minMax[1] > 0) {
                    validated.setMinQuantity(minMax[0]);
                    validated.setMaxQuantity(minMax[1]);
                }

                Double timeStock = this.validateQuantity(rowCount, timeStr, 4, errorList);
                if (timeStock > 0) {
                    validated.setTimeStocked(timeStock);
                }

                if (!aioConfigStockedGoodsDao.checkUnique(validated.getGoodsCode(), validated.getSysGroupId())) {
                    errorList.add(commonService.createErrorAio(rowCount, colAlias.get(1), colName.get(1),
                            "đã tồn tại với đơn vị \"" + validated.getSysGroupName() + "\""));
                }

                if (errorList.size() == 0) {
                    validated.setCreatedDate(today);
                    validated.setCreatedUser(sysUserId);

                    String key = (sysGroupCode + "_" + goodsCode).toUpperCase();
                    mapResult.put(key, validated);
                }
            }

            if (errorList.size() > 0) {
                String filePathError = UEncrypt.encryptFileUploadPath(path);
                commonService.doWriteErrorAio(errorList, dtoList, filePathError, new AIOConfigStockedGoodsDTO(), errColumn);
            } else {
                dtoList = new ArrayList<>(mapResult.values());
            }
            workbook.close();

        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ExcelErrorDTO errorDTO = commonService.createErrorAio(4, StringUtils.EMPTY, StringUtils.EMPTY, e.toString());
            errorList.add(errorDTO);
            String filePathError = null;

            try {
                filePathError = UEncrypt.encryptFileUploadPath(path);
            } catch (Exception ex) {
                LOGGER.error(ex.getMessage(), ex);
                errorDTO = commonService.createErrorAio(4, StringUtils.EMPTY, StringUtils.EMPTY, ex.toString());
                errorList.add(errorDTO);
            }

            commonService.doWriteErrorAio(errorList, dtoList, filePathError, new AIOConfigStockedGoodsDTO(), errColumn);
        }

        return dtoList;
    }

    private boolean validateSysGroupCode(int rowCount, String sysGroupCode, Map<String, DepartmentDTO> mapGroups, List<ExcelErrorDTO> errorList) {
        boolean result = true;
        int columnData = 0;
        if (StringUtils.isNotEmpty(sysGroupCode)) {
            DepartmentDTO dto = mapGroups.get(sysGroupCode) != null
                    ? mapGroups.get(sysGroupCode)
                    : commonService.getSysGroupByCode(sysGroupCode);

            if (dto == null) {
                errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData), colName.get(columnData), "Không tồn tại"));
                result = false;
            } else {
                mapGroups.put(dto.getCode().toUpperCase(), dto);
            }
        } else {
            errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData), colName.get(columnData), "Không được bỏ trống"));
            result = false;
        }
        return result;
    }

    private boolean validateGoodsCode(int rowCount, String goodsCode, Map<String, GoodsDTO> mapGoods, List<ExcelErrorDTO> errorList) {
        boolean result = true;
        int columnData = 1;
        if (StringUtils.isNotEmpty(goodsCode)) {
            GoodsDTO dto = mapGoods.get(goodsCode) != null
                    ? mapGoods.get(goodsCode)
                    : commonService.getGoodsByCode(goodsCode);

            if (dto == null) {
                errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData), colName.get(columnData), "Không tồn tại"));
                result = false;
            } else {
                mapGoods.put(dto.getCode().toUpperCase(), dto);
            }
        } else {
            errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData), colName.get(columnData), "Không được bỏ trống"));
            result = false;
        }
        return result;
    }

    private Double[] validateMinMax(int rowCount, String minStr, String maxStr, List<ExcelErrorDTO> errorList) {
//        Double[] result = new Double[] {-1D, -1D};
        Double min = this.validateQuantity(rowCount, minStr, 2, errorList);
        Double max = this.validateQuantity(rowCount, maxStr, 3, errorList);

        int columnData = 2;
        if (min >= max) {
            errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData), colName.get(columnData),
                    "phải nhỏ hơn " + colName.get(3)));
        }

        return new Double[] {min, max};
    }

    private Double validateQuantity(int rowCount, String qttStr, int columnData, List<ExcelErrorDTO> errorList) {
        Double quantity = -1D;

        if (StringUtils.isNotEmpty(qttStr)) {
            try {
                int index = qttStr.indexOf(".");
                if (index >= 0) {
                    qttStr = qttStr.substring(0, index + 3);
                }
                quantity = Double.parseDouble(qttStr);
                if (quantity <= 0) {
                    errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData), colName.get(columnData), "phải lớn hơn 0"));
                }
            } catch (NumberFormatException e) {
                errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData), colName.get(columnData), "Sai kiểu dữ liệu"));
            }
        } else {
            errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData), colName.get(columnData), "Không được bỏ trống"));
        }
        return quantity;
    }
}
