package com.viettel.aio.business;

import com.viettel.aio.dao.AIORpSynthesisPaySaleFeeDAO;
import com.viettel.aio.dto.AIORpSynthesisGenCodeForChannelDTO;
import com.viettel.aio.dto.AIORpSynthesisPaySaleFeeDTO;
import com.viettel.coms.business.UtilAttachDocumentBusinessImpl;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.business.BaseFWBusinessImpl;
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
import java.util.*;

//StephenTrung__20191112_created
@Service("aioRpSynthesisPaySaleFeeBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIORpSynthesisPaySaleFeeBusinessImpl implements AIORpSynthesisPaySaleFeeBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIORpSynthesisPaySaleFeeBusinessImpl.class);

    @Autowired
    private AIORpSynthesisPaySaleFeeDAO aioRpSynthesisPaySaleFeeDao;

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

    @Override
    public DataListDTO doSearch(AIORpSynthesisPaySaleFeeDTO criteria) {
        List<AIORpSynthesisPaySaleFeeDTO> dtos = aioRpSynthesisPaySaleFeeDao.doSearch(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    private final String RP_SYNTHESIS_PAY_SALE_FEE = "Bao_cao_tong_hop_thanh_toan_chi_phi_ban_hang.xlsx";

    @Override
    public String exportExcel(AIORpSynthesisPaySaleFeeDTO criteria) throws Exception {
        List<AIORpSynthesisPaySaleFeeDTO> dtos = aioRpSynthesisPaySaleFeeDao.doSearch(criteria);
        XSSFWorkbook workbook = commonServiceAio.createWorkbook(RP_SYNTHESIS_PAY_SALE_FEE);
        XSSFSheet sheet = workbook.getSheetAt(0);

        List<CellStyle> styles = this.prepareCellStyles(sheet);

        int rowNo = 6;
        XSSFRow row;
        for (AIORpSynthesisPaySaleFeeDTO dto : dtos) {
            row = sheet.createRow(rowNo);
            this.convertNullData(dto);
            this.createRowExcel(dto, row, styles);
            rowNo++;
        }

//        sheet.setColumnHidden(8, criteria.getIsDetail() != 1);

        String path = commonServiceAio.writeToFileOnServer(workbook, RP_SYNTHESIS_PAY_SALE_FEE);
        return path;
    }

    private void convertNullData(AIORpSynthesisPaySaleFeeDTO dto) {
        dto.setAreaCode(StringUtils.isNotEmpty(dto.getAreaCode()) ? dto.getAreaCode() : StringUtils.EMPTY);
        dto.setProvinceCode(StringUtils.isNotEmpty(dto.getProvinceCode()) ? dto.getProvinceCode() : StringUtils.EMPTY);
        dto.setEmployeeCode(StringUtils.isNotEmpty(dto.getEmployeeCode()) ? dto.getEmployeeCode() : StringUtils.EMPTY);
        dto.setSysUserName(StringUtils.isNotEmpty(dto.getSysUserName()) ? dto.getSysUserName() : StringUtils.EMPTY);
        dto.setSysUserPhone(StringUtils.isNotEmpty(dto.getSysUserPhone()) ? dto.getSysUserPhone() : StringUtils.EMPTY);
        dto.setEmailQL(StringUtils.isNotEmpty(dto.getEmailQL()) ? dto.getEmailQL() : StringUtils.EMPTY);
        dto.setEmployeeCodeCTV(StringUtils.isNotEmpty(dto.getEmployeeCodeCTV()) ? dto.getEmployeeCodeCTV() : StringUtils.EMPTY);
        dto.setNameCTV(StringUtils.isNotEmpty(dto.getNameCTV()) ? dto.getNameCTV() : StringUtils.EMPTY);
        dto.setTaxCodeCTV(StringUtils.isNotEmpty(dto.getTaxCodeCTV()) ? dto.getTaxCodeCTV() : StringUtils.EMPTY);
        dto.setAmount(null != dto.getAmount() ? dto.getAmount() : 0);
        dto.setSalary(null != dto.getSalary() ? dto.getSalary() : 0);
        dto.setTaxSalary(null != dto.getTaxSalary() ? dto.getTaxSalary() : 0);
        dto.setRealSalary(null != dto.getRealSalary() ? dto.getRealSalary() : 0);
    }

    private void createRowExcel(AIORpSynthesisPaySaleFeeDTO dto, XSSFRow row, List<CellStyle> styles) {
        commonServiceAio.createExcelCell(row, 0, styles.get(1)).setCellValue(row.getRowNum() - 5);
        commonServiceAio.createExcelCell(row, 1, styles.get(0)).setCellValue(dto.getAreaCode());
        commonServiceAio.createExcelCell(row, 2, styles.get(0)).setCellValue(dto.getProvinceCode());
        commonServiceAio.createExcelCell(row, 3, styles.get(0)).setCellValue(dto.getEmployeeCode());
        commonServiceAio.createExcelCell(row, 4, styles.get(0)).setCellValue(dto.getSysUserName());
        commonServiceAio.createExcelCell(row, 5, styles.get(0)).setCellValue(dto.getSysUserPhone());
        commonServiceAio.createExcelCell(row, 6, styles.get(0)).setCellValue(dto.getEmailQL());
        commonServiceAio.createExcelCell(row, 7, styles.get(0)).setCellValue(dto.getEmployeeCodeCTV());
        commonServiceAio.createExcelCell(row, 8, styles.get(0)).setCellValue(dto.getNameCTV());
        commonServiceAio.createExcelCell(row, 9, styles.get(2)).setCellValue(dto.getTaxCodeCTV());
        commonServiceAio.createExcelCell(row, 10, styles.get(3)).setCellValue(dto.getAmount());
        commonServiceAio.createExcelCell(row, 11, styles.get(3)).setCellValue(dto.getSalary());
        commonServiceAio.createExcelCell(row, 12, styles.get(3)).setCellValue(dto.getTaxSalary());
        commonServiceAio.createExcelCell(row, 13, styles.get(3)).setCellValue(dto.getRealSalary());
        commonServiceAio.createExcelCell(row, 14, styles.get(0)).setCellValue(StringUtils.EMPTY);
    }

    private List<CellStyle> prepareCellStyles(XSSFSheet sheet) {
        CellStyle styleText = ExcelUtils.styleText(sheet);
        CellStyle styleTextCenter = ExcelUtils.styleText(sheet);
        styleTextCenter.setAlignment(HorizontalAlignment.CENTER);

        CellStyle styleNumber = ExcelUtils.styleNumber(sheet);

        CellStyle currency = ExcelUtils.styleText(sheet);
        currency.setDataFormat(sheet.getWorkbook().createDataFormat().getFormat("#,##0"));
        currency.setAlignment(HorizontalAlignment.RIGHT);

        return Arrays.asList(styleText, styleTextCenter, styleNumber, currency);
    }
}
