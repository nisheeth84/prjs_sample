package com.viettel.aio.business;

import com.viettel.aio.dao.AIORpPersonalInventoryDAO;
import com.viettel.coms.business.UtilAttachDocumentBusinessImpl;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.MerEntitySimpleDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.xssf.usermodel.XSSFCreationHelper;
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

//VietNT_20190320_created
@Service("aioRpPersonalInventoryBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIORpPersonalInventoryBusinessImpl extends BaseFWBusinessImpl<AIORpPersonalInventoryDAO, ComsBaseFWDTO, BaseFWModelImpl> implements AIORpPersonalInventoryBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIORpPersonalInventoryBusinessImpl.class);

    @Autowired
    private AIORpPersonalInventoryDAO aioRpPersonalInventoryDao;

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

    public DataListDTO doSearch(MerEntitySimpleDTO criteria) {
        List<MerEntitySimpleDTO> dtos = aioRpPersonalInventoryDao.doSearch(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    private final String RP_PERSONAL_INVENTORY = "Bao_cao_ton_kho_NV.xlsx";

    public String exportExcel(MerEntitySimpleDTO criteria) throws Exception {
        List<MerEntitySimpleDTO> dtos = aioRpPersonalInventoryDao.doSearch(criteria);
        XSSFWorkbook workbook = commonServiceAio.createWorkbook(RP_PERSONAL_INVENTORY);
        XSSFSheet sheet = workbook.getSheetAt(0);

        List<CellStyle> styles = this.prepareCellStyles(sheet);

        int rowNo = 6;
        XSSFRow row;
        for (MerEntitySimpleDTO dto : dtos) {
            row = sheet.createRow(rowNo);
            this.convertNullData(dto);
            this.createRowExcel(dto, row, styles);
            rowNo++;
        }

        sheet.setColumnHidden(8, criteria.getIsDetail() != 1);

        String path = commonServiceAio.writeToFileOnServer(workbook, RP_PERSONAL_INVENTORY);
        return path;
    }

    private void convertNullData(MerEntitySimpleDTO dto) {
        dto.setSysGroupName(StringUtils.isNotEmpty(dto.getSysGroupName()) ? dto.getSysGroupName() : StringUtils.EMPTY);
        dto.setCum(StringUtils.isNotEmpty(dto.getCum()) ? dto.getCum() : StringUtils.EMPTY);
        dto.setUserName(StringUtils.isNotEmpty(dto.getUserName()) ? dto.getUserName() : StringUtils.EMPTY);
        dto.setGoodsCode(StringUtils.isNotEmpty(dto.getGoodsCode()) ? dto.getGoodsCode() : StringUtils.EMPTY);
        dto.setGoodsName(StringUtils.isNotEmpty(dto.getGoodsName()) ? dto.getGoodsName() : StringUtils.EMPTY);
        dto.setCatUnitName(StringUtils.isNotEmpty(dto.getCatUnitName()) ? dto.getCatUnitName() : StringUtils.EMPTY);
        dto.setAmount(null != dto.getAmount() ? dto.getAmount() : 0);
        //VietNT_18/07/2019_start
        dto.setApplyPrice(null != dto.getApplyPrice() ? dto.getApplyPrice() : 0);
        //VietNT_end
        dto.setSerial(StringUtils.isNotEmpty(dto.getSerial()) ? dto.getSerial() : StringUtils.EMPTY);
    }

    private void createRowExcel(MerEntitySimpleDTO dto, XSSFRow row, List<CellStyle> styles) {
        commonServiceAio.createExcelCell(row, 0, styles.get(1)).setCellValue(row.getRowNum() - 5);
        commonServiceAio.createExcelCell(row, 1, styles.get(0)).setCellValue(dto.getSysGroupName());
        commonServiceAio.createExcelCell(row, 2, styles.get(1)).setCellValue(dto.getCum());
        commonServiceAio.createExcelCell(row, 3, styles.get(1)).setCellValue(dto.getUserName());
        commonServiceAio.createExcelCell(row, 4, styles.get(1)).setCellValue(dto.getGoodsCode());
        commonServiceAio.createExcelCell(row, 5, styles.get(0)).setCellValue(dto.getGoodsName());
        commonServiceAio.createExcelCell(row, 6, styles.get(1)).setCellValue(dto.getCatUnitName());
        commonServiceAio.createExcelCell(row, 7, styles.get(2)).setCellValue(dto.getAmount());
        //VietNT_18/07/2019_start
        commonServiceAio.createExcelCell(row, 8, styles.get(3)).setCellValue(dto.getApplyPrice());
        //VietNT_end
        commonServiceAio.createExcelCell(row, 9, styles.get(0)).setCellValue(dto.getSerial());
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
