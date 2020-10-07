package com.viettel.aio.business;


import com.viettel.aio.bo.AIOWoGoodsBO;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.dao.AIOWoGoodsDAO;
import com.viettel.aio.dao.AIOWoGoodsDetailDAO;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOPackageGoodsDTO;
import com.viettel.aio.dto.AIOSysUserDTO;
import com.viettel.aio.dto.AIOWoGoodsDTO;
import com.viettel.aio.dto.AIOWoGoodsDetailDTO;
import com.viettel.aio.dto.AppParamDTO;
import com.viettel.coms.dto.SysUserDetailCOMSDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.ConvertData;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;


@Service("aioWoGoodsBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOWoGoodsBusinessImpl extends BaseFWBusinessImpl<AIOWoGoodsDAO, AIOWoGoodsDTO, AIOWoGoodsBO> implements AIOWoGoodsBusiness {

    @Autowired
    public AIOWoGoodsBusinessImpl(AIOWoGoodsDAO aioWoGoodsDAO, AIOWoGoodsDetailDAO aioWoGoodsDetailDAO,
                                  CommonServiceAio commonService, MochaBusiness mochaBusiness) {
        this.aioWoGoodsDAO = aioWoGoodsDAO;
        this.aioWoGoodsDetailDAO = aioWoGoodsDetailDAO;
        this.commonService = commonService;
        this.mochaBusiness = mochaBusiness;
    }

    private AIOWoGoodsDAO aioWoGoodsDAO;
    private AIOWoGoodsDetailDAO aioWoGoodsDetailDAO;
    private CommonServiceAio commonService;
    private MochaBusiness mochaBusiness;

    public DataListDTO doSearch(AIOWoGoodsDTO criteria, String sysGroupIdStr) {
        List<String> groupIdList = ConvertData.convertStringToList(sysGroupIdStr, ",");
        List<AIOWoGoodsDTO> dtos = aioWoGoodsDAO.doSearch(criteria, groupIdList);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public DataListDTO getWODetailById(AIOWoGoodsDTO id) {
        if (id.getWoGoodsId() == null) {
            return new DataListDTO();
        }
        List<AIOWoGoodsDetailDTO> dtos = aioWoGoodsDAO.getWODetailById(id);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(id.getTotalRecord());
        dataListDTO.setSize(id.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public void submitApprove(AIOWoGoodsDTO dto) {
        dto.setStatus(2L);
        int result = aioWoGoodsDAO.updateWoGoods(dto);
        commonService.validateIdCreated(result, AIOErrorType.ACTION_FAILED.msg);

        String MSG_CONTENT_TEMPLATE_APPROVE = "Yêu cầu đảm bảo hàng hóa \"%s\" \n" +
                "cho khách hàng %s tại địa chỉ: %s đã được đảm bảo. \n" +
                "Đề nghị thực hiện tạo hợp đồng";
        this.sendMochaNotifyCreatedUser(dto.getCreatedUser(), MSG_CONTENT_TEMPLATE_APPROVE,
                dto.getCode(), dto.getCustomerName(), dto.getCustomerAddress());
    }

    public void submitReject(AIOWoGoodsDTO dto) {
        dto.setStatus(3L);
        int result = aioWoGoodsDAO.updateWoGoods(dto);
        commonService.validateIdCreated(result, AIOErrorType.SAVE_ERROR.msg);

        String MSG_CONTENT_TEMPLATE_REJECT = "Yêu cầu đảm bảo hàng hóa \"%s\" \n" +
                "cho khách hàng %s tại địa chỉ: %s đã bị từ chối.\n Lí do: \"%s\"";
        this.sendMochaNotifyCreatedUser(dto.getCreatedUser(), MSG_CONTENT_TEMPLATE_REJECT,
                dto.getCode(), dto.getCustomerName(), dto.getCustomerAddress(), dto.getReason());
    }

    private void sendMochaNotifyCreatedUser(Long createdUserId, String template, String... params) {
        String phone = aioWoGoodsDAO.getSysUserPhone(createdUserId);
        mochaBusiness.sendMochaSms(phone, String.format(template, params));
    }

    public List<AIOConfigServiceDTO> getConfigService(AIOWoGoodsDTO obj) {
        return aioWoGoodsDAO.getConfigService(obj);
    }

    public List<AppParamDTO> getAppParam() {
        return aioWoGoodsDAO.getAppParam();
    }

    public List<SysUserDetailCOMSDTO> searchPerformer(AIOWoGoodsDTO obj) {
        return aioWoGoodsDAO.doSearchPerformer(obj);
    }

    // excel
    private final String LIST_MANAGE_GUARANTEE = "Danh_sach_quanly_yeucau_dambao.xlsx";

    public String exportExcel(AIOWoGoodsDTO criteria, String sysGroupIdStr) throws Exception {
        List<String> groupIdList = ConvertData.convertStringToList(sysGroupIdStr, ",");
        List<AIOWoGoodsDTO> data = aioWoGoodsDAO.doSearch(criteria, groupIdList);

        if (data == null || data.isEmpty()) {
            throw new BusinessException("Không có dữ liệu");
        }

        XSSFWorkbook workbook = commonService.createWorkbook(LIST_MANAGE_GUARANTEE);
        XSSFSheet sheet = workbook.getSheetAt(0);
        List<CellStyle> styles = this.createCellStyles(workbook, sheet);

        int rowNum = 1;
        XSSFRow row;
        for (AIOWoGoodsDTO dto : data) {
            row = sheet.createRow(rowNum);
            this.createExcelRow(dto, row, styles);
            rowNum++;
        }

        String path = commonService.writeToFileOnServer(workbook, LIST_MANAGE_GUARANTEE);
        return path;
    }

    private List<CellStyle> createCellStyles(XSSFWorkbook workbook, XSSFSheet sheet) {
        CellStyle style = ExcelUtils.styleText(sheet);

        CellStyle styleCurrency = ExcelUtils.styleText(sheet);
        styleCurrency.setDataFormat(sheet.getWorkbook().createDataFormat().getFormat("#,##0"));
        styleCurrency.setAlignment(HorizontalAlignment.RIGHT);

        CellStyle styleCenter = ExcelUtils.styleText(sheet);
        styleCenter.setAlignment(HorizontalAlignment.CENTER);

        return Arrays.asList(style, styleCenter, styleCurrency);
    }

    private void createExcelRow(AIOWoGoodsDTO dto, XSSFRow row, List<CellStyle> styles) {
        int col = 0;
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(row.getRowNum());
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(dto.getPerformerGroupCode());
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(dto.getCode());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getIndustryName());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getCreatedUserText());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getPhoneNumber());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getCustomerName());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getCustomerAddress());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(this.formatDate(dto.getStartDate()) + "-" + this.formatDate(dto.getEndDate()));
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(this.convertStatus(dto.getStatus()));
        commonService.createExcelCell(row, col, styles.get(0)).setCellValue(dto.getReason());
    }

    private String convertStatus(Long status) {
        if (status == 1L) {
            return "Mới tạo";
        } else if (status == 2L) {
            return "Xác nhận";
        } else if (status == 3L) {
            return "Từ chối";
        } else {
            return "";
        }
    }

    private String formatDate(Date date) {
        DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        return dateFormat.format(date);
    }

    // mã yêu cầu sinh theo luật YCDB/Mã tỉnh/số tự tăng (tối thiểu ban đầu 3 số)
    // mã tỉnh lấy theo province_code trong bảng sys_group của nhân viên tạo hđ
    private String genCodeWoGoods(Long id, String provinceCode) {
        String nextId = String.format((Locale) null, "%07d", id);
        return "YCDB/" + provinceCode + "/" + nextId;
    }

    public String createWorkOrderGoods(AIOContractDTO contractDTO, List<AIOPackageGoodsDTO> listGoodsToCreateOrder) {
        Long id = commonService.getNextId(AIOWoGoodsDTO.SEQUENCE_NAME);
        AIOSysUserDTO createdUserInfo = aioWoGoodsDAO.getUserNameAndProvinceCode(contractDTO.getCreatedUser());
        contractDTO.setCreatedUserName(createdUserInfo.getFullName());
        String code = this.genCodeWoGoods(id, createdUserInfo.getText());
        this.createWorkOrderGoods(contractDTO, id, code);
        this.createWoGoodsDetails(id, listGoodsToCreateOrder);

        String template = "Có yêu cầu hàng hóa từ nhân viên " +
                createdUserInfo.getEmployeeCode() + "-" + createdUserInfo.getFullName() +
                "\nMã yêu cầu " + code +
                "\nTruy cập hệ thống AIO để xem thông tin chi tiết";
        mochaBusiness.sendMochaSms(contractDTO.getPerformerPhone(), template);

        return code;
    }

    private void createWorkOrderGoods(AIOContractDTO contractDTO, Long idWoGoods, String codeWoGoods) {
        AIOConfigServiceDTO industryInfo = aioWoGoodsDAO.getIndustryByCode(contractDTO.getIndustryCode());
        AIOSysUserDTO performerWo = aioWoGoodsDAO.getPerformerWOGoods(contractDTO.getPerformerGroupId());
        Date now = new Date();
        Date endDate = new Date(now.getTime() + (long) (TimeUnit.DAYS.toMillis(1L) * industryInfo.getTimePerform()));

        AIOWoGoodsDTO dto = new AIOWoGoodsDTO();
        dto.setWoGoodsId(idWoGoods);
        dto.setCode(codeWoGoods);
        dto.setIndustryId(industryInfo.getIndustryId());
        dto.setIndustryCode(industryInfo.getIndustryCode());
        dto.setIndustryName(industryInfo.getIndustryName());
        dto.setPerformerId(performerWo.getSysUserId());
        dto.setPerformerGroupId(contractDTO.getPerformerGroupId());
        dto.setPerformerGroupCode(performerWo.getSysGroupLv2Code());
        dto.setPhoneNumber(performerWo.getPhoneNumber());
        dto.setCustomerName(contractDTO.getCustomerName());
        dto.setCustomerAddress(contractDTO.getCustomerAddress());
        dto.setStartDate(now);
        dto.setEndDate(endDate);
//        dto.setActualEndDate();
        dto.setStatus(AIOWoGoodsDTO.STATUS_NEW);
        dto.setKpi(industryInfo.getTimePerform().longValue());
        dto.setCreatedUser(contractDTO.getCreatedUser());
        dto.setCreatedUserName(contractDTO.getCreatedUserName());
        dto.setCreatedDate(now);
        Long result = aioWoGoodsDAO.saveObject(dto.toModel());
        commonService.validateIdCreated(result, AIOObjectType.WO_GOODS);

        contractDTO.setPerformerPhone(performerWo.getPhoneNumber());
    }

    private void createWoGoodsDetails(Long idWoGoods, List<AIOPackageGoodsDTO> listGoodsToCreateOrder) {
        Long result;
        for (AIOPackageGoodsDTO goods : listGoodsToCreateOrder) {
            AIOWoGoodsDetailDTO detailDTO = new AIOWoGoodsDetailDTO();
            detailDTO.setWoGoodsId(idWoGoods);
            detailDTO.setGoodsId(goods.getGoodsId());
            detailDTO.setGoodsCode(goods.getGoodsCode());
            detailDTO.setGoodsName(goods.getGoodsName());

            if (goods.getQttOrder() != null) {
                detailDTO.setQuantity(goods.getQuantity());
                detailDTO.setQuantityOrder(goods.getQttOrder());
                detailDTO.setQuantityRemain(goods.getQttRemain());
            } else {
                detailDTO.setQuantity(goods.getQuantity());
                detailDTO.setQuantityOrder(goods.getQuantity());
                detailDTO.setQuantityRemain(0D);
            }

            result = aioWoGoodsDetailDAO.saveObject(detailDTO.toModel());
            commonService.validateIdCreated(result, AIOObjectType.WO_GOODS_DETAIL);
        }
    }
}
