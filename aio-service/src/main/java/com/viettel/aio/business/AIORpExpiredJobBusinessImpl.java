package com.viettel.aio.business;

import com.viettel.aio.dao.AIORpExpiredJobDAO;
import com.viettel.aio.dto.AIOOrdersDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

//StephenTrung__4_12_2019_created
@Service("AIORpExpiredJobBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIORpExpiredJobBusinessImpl implements AIORpExpiredJobBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIORpExpiredJobBusinessImpl.class);

    @Autowired
    private AIORpExpiredJobDAO aioRpExpiredJobDAO;

    @Autowired
    private CommonServiceAio commonServiceAio;


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

    public DataListDTO doSearch(AIOOrdersDTO criteria) {
        List<AIOOrdersDTO> dtos = new ArrayList<>();
        if (criteria.getIsDetail() == 0){
            dtos = aioRpExpiredJobDAO.doSearch(criteria);
        }else if (criteria.getIsDetail() == 1){
            dtos = aioRpExpiredJobDAO.doSearchDetail(criteria);
        }
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }
    private final String RP_REQUEST_NOK = "Bao_cao_khao_sat_cong_viec_qua_han.xlsx";

    @Override
    public String exportExcel(AIOOrdersDTO criteria) throws Exception {
        List<AIOOrdersDTO> dtos = aioRpExpiredJobDAO.doSearch(criteria);
        XSSFWorkbook workbook = commonServiceAio.createWorkbook(RP_REQUEST_NOK);
        XSSFSheet sheet = workbook.getSheetAt(0);

        List<CellStyle> styles = this.prepareCellStyles(sheet);

        int rowNo = 6;
        XSSFRow row;
        for (AIOOrdersDTO dto : dtos) {
            row = sheet.createRow(rowNo);
            this.convertNullData(dto);
            this.createRowExcel(dto, row, styles);
            rowNo++;
        }

//        sheet.setColumnHidden(8, criteria.getIsDetail() != 1);

        String path = commonServiceAio.writeToFileOnServer(workbook, RP_REQUEST_NOK);
        return path;
    }

    private void convertNullData(AIOOrdersDTO dto) {
        dto.setAreaCode(StringUtils.isNotEmpty(dto.getAreaCode()) ? dto.getAreaCode() : StringUtils.EMPTY);
        dto.setProvinceCode(StringUtils.isNotEmpty(dto.getProvinceCode()) ? dto.getProvinceCode() : StringUtils.EMPTY);
//        dto.setTong(dto.getTong().equals(null) ? dto.getTong() : StringUtils.EMPTY);
//        dto.setNok(StringUtils.isNotEmpty(dto.getSysUserName()) ? dto.getSysUserName() : StringUtils.EMPTY);
//        dto.setPercent(StringUtils.isNotEmpty(dto.getSysUserPhone()) ? dto.getSysUserPhone() : StringUtils.EMPTY);

//        dto.setEmployeeCTVCode(StringUtils.isNotEmpty(dto.getEmployeeCTVCode()) ? dto.getEmployeeCTVCode() : StringUtils.EMPTY);
//        dto.setEmployeeCTVName(StringUtils.isNotEmpty(dto.getEmployeeCTVName()) ? dto.getEmployeeCTVName() : StringUtils.EMPTY);
//        dto.setEmployeeCTVPhone(StringUtils.isNotEmpty(dto.getEmployeeCTVPhone()) ? dto.getEmployeeCTVPhone() : StringUtils.EMPTY);
//        dto.setTaxCode(StringUtils.isNotEmpty(dto.getTaxCode()) ? dto.getTaxCode() : StringUtils.EMPTY);
//        dto.setAddress(StringUtils.isNotEmpty(dto.getAddress()) ? dto.getAddress() : StringUtils.EMPTY);
////        dto.setCreatedDate(dto.getCreatedDate() == null ? dto.getCreatedDate() : null);
//        dto.setContractCode(StringUtils.isNotEmpty(dto.getContractCode()) ? dto.getContractCode() : StringUtils.EMPTY);
//        dto.setTaxCodeUser(StringUtils.isNotEmpty(dto.getTaxCodeUser()) ? dto.getTaxCodeUser() : StringUtils.EMPTY);
//        dto.setAccountNumber(StringUtils.isNotEmpty(dto.getAccountNumber()) ? dto.getAccountNumber() : StringUtils.EMPTY);
//        dto.setBank(StringUtils.isNotEmpty(dto.getBank()) ? dto.getBank() : StringUtils.EMPTY);
//        dto.setBankBranch(StringUtils.isNotEmpty(dto.getBankBranch()) ? dto.getBankBranch() : StringUtils.EMPTY);
//        dto.setCompanyPartner(StringUtils.isNotEmpty(dto.getCompanyPartner()) ? dto.getCompanyPartner() : StringUtils.EMPTY);
    }

    private void createRowExcel(AIOOrdersDTO dto, XSSFRow row, List<CellStyle> styles) {
        commonServiceAio.createExcelCell(row, 0, styles.get(1)).setCellValue(row.getRowNum() - 5);
        commonServiceAio.createExcelCell(row, 2, styles.get(0)).setCellValue(dto.getAreaCode());
        commonServiceAio.createExcelCell(row, 1, styles.get(0)).setCellValue(dto.getProvinceCode());
        commonServiceAio.createExcelCell(row, 3, styles.get(0)).setCellValue(dto.getTong());
        commonServiceAio.createExcelCell(row, 4, styles.get(0)).setCellValue(dto.getNok());
        commonServiceAio.createExcelCell(row, 5, styles.get(0)).setCellValue(dto.getPercent());
//        commonServiceAio.createExcelCell(row, 6, styles.get(0)).setCellValue(dto.getEmployeeCTVCode());
//        commonServiceAio.createExcelCell(row, 7, styles.get(0)).setCellValue(dto.getEmployeeCTVName());
//        commonServiceAio.createExcelCell(row, 8, styles.get(0)).setCellValue(dto.getEmployeeCTVPhone());
//        commonServiceAio.createExcelCell(row, 9, styles.get(0)).setCellValue(dto.getTaxCode());
//        commonServiceAio.createExcelCell(row, 10, styles.get(0)).setCellValue(dto.getAddress());
//        commonServiceAio.createExcelCell(row, 11, styles.get(4)).setCellValue(dto.getCreatedDate());
//        commonServiceAio.createExcelCell(row, 12, styles.get(0)).setCellValue(dto.getContractCode());
//        commonServiceAio.createExcelCell(row, 13, styles.get(0)).setCellValue(dto.getTaxCodeUser());
//        commonServiceAio.createExcelCell(row, 14, styles.get(0)).setCellValue(dto.getAccountNumber());
//        commonServiceAio.createExcelCell(row, 15, styles.get(0)).setCellValue(dto.getBank());
//        commonServiceAio.createExcelCell(row, 16, styles.get(0)).setCellValue(dto.getBankBranch());
//        commonServiceAio.createExcelCell(row, 17, styles.get(0)).setCellValue(dto.getCompanyPartner());
    }

    private List<CellStyle> prepareCellStyles(XSSFSheet sheet) {
        CellStyle styleText = ExcelUtils.styleText(sheet);
        CellStyle styleTextCenter = ExcelUtils.styleText(sheet);
        styleTextCenter.setAlignment(HorizontalAlignment.CENTER);

        CellStyle styleNumber = ExcelUtils.styleNumber(sheet);

        CellStyle currency = ExcelUtils.styleText(sheet);
        currency.setDataFormat(sheet.getWorkbook().createDataFormat().getFormat("#,##0"));
        currency.setAlignment(HorizontalAlignment.RIGHT);


        CellStyle dateFormat = ExcelUtils.styleText(sheet);
        dateFormat.setDataFormat(sheet.getWorkbook().createDataFormat().getFormat("dd/MM/yyyy"));
        dateFormat.setAlignment(HorizontalAlignment.CENTER);

        return Arrays.asList(styleText, styleTextCenter, styleNumber, currency, dateFormat);
    }
}
