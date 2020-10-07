package com.viettel.aio.business;

import java.text.SimpleDateFormat;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.StringJoiner;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;

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

import com.viettel.aio.bo.AIOOrderRequestBO;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.dao.AIOOrderBranchDAO;
import com.viettel.aio.dao.AIOOrderBranchDetailDAO;
import com.viettel.aio.dao.AIOOrderBranchDetailRequestDAO;
import com.viettel.aio.dao.AIOOrderCompanyDAO;
import com.viettel.aio.dao.AIOOrderCompanyDetailDAO;
import com.viettel.aio.dao.AIOOrderGoodsManageDAO;
import com.viettel.aio.dao.AIOOrderRequestDAO;
import com.viettel.aio.dao.AIOOrderRequestDetailDAO;
import com.viettel.aio.dao.CommonDAO;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOOrderBranchDTO;
import com.viettel.aio.dto.AIOOrderBranchDetailDTO;
import com.viettel.aio.dto.AIOOrderBranchDetailRequestDTO;
import com.viettel.aio.dto.AIOOrderCompanyDTO;
import com.viettel.aio.dto.AIOOrderCompanyDetailDTO;
import com.viettel.aio.dto.AIOOrderRequestDTO;
import com.viettel.aio.dto.AIOOrderRequestDetailDTO;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.DepartmentDTO;
import com.viettel.coms.dto.GoodsDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;

//VietNT_20190819_created
@Service("aioOrderGoodsManageBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOOrderGoodsManageBusinessImpl extends BaseFWBusinessImpl<AIOOrderGoodsManageDAO, AIOOrderRequestDTO, AIOOrderRequestBO> {

    static Logger LOGGER = LoggerFactory.getLogger(AIOOrderGoodsManageBusinessImpl.class);

    @Autowired
    public AIOOrderGoodsManageBusinessImpl(AIOOrderGoodsManageDAO aioOrderGoodsManageDao, CommonDAO commonDAO,
                                           AIOOrderRequestDAO aioOrderRequestDAO, AIOOrderRequestDetailDAO aioOrderRequestDetailDAO,
                                           AIOOrderBranchDAO aioOrderBranchDAO, AIOOrderBranchDetailDAO aioOrderBranchDetailDAO,
                                           AIOOrderCompanyDAO aioOrderCompanyDAO, AIOOrderCompanyDetailDAO aioOrderCompanyDetailDAO,
                                           CommonServiceAio commonService) {
        this.aioOrderGoodsManageDao = aioOrderGoodsManageDao;
        this.aioOrderRequestDAO = aioOrderRequestDAO;
        this.aioOrderRequestDetailDAO = aioOrderRequestDetailDAO;
        this.aioOrderBranchDAO = aioOrderBranchDAO;
        this.aioOrderBranchDetailDAO = aioOrderBranchDetailDAO;
        this.aioOrderCompanyDAO = aioOrderCompanyDAO;
        this.aioOrderCompanyDetailDAO = aioOrderCompanyDetailDAO;
        this.commonService = commonService;
    }

    private AIOOrderGoodsManageDAO aioOrderGoodsManageDao;
    private AIOOrderRequestDAO aioOrderRequestDAO;
    private AIOOrderRequestDetailDAO aioOrderRequestDetailDAO;
    private CommonServiceAio commonService;
    private AIOOrderBranchDAO aioOrderBranchDAO;
    private AIOOrderBranchDetailDAO aioOrderBranchDetailDAO;
    private AIOOrderCompanyDAO aioOrderCompanyDAO;
    private AIOOrderCompanyDetailDAO aioOrderCompanyDetailDAO;
    @Autowired
    private AIOOrderBranchDetailRequestDAO aioOrderBranchDetailRequestDAO;

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
    private final int TYPE_CODE_STAFF = 1;
    private final int TYPE_CODE_BRANCH = 2;
    private final int TYPE_CODE_COMPANY = 3;
    private final String COMPANY_CODE = "VCC";

    private Map<Long, String> STATUS_ORDER_REQUEST = Stream.of(
            new AbstractMap.SimpleImmutableEntry<>(0L, "Chờ duyệt"),
            new AbstractMap.SimpleImmutableEntry<>(1L, "CNKT đã xét duyệt"),
            new AbstractMap.SimpleImmutableEntry<>(2L, "Công ty đã xét duyệt"))
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

    private Map<Long, String> STATUS_ORDER_BRANCH = Stream.of(
            new AbstractMap.SimpleImmutableEntry<>(0L, "Hủy"),
            new AbstractMap.SimpleImmutableEntry<>(1L, "Chờ duyệt"),
            new AbstractMap.SimpleImmutableEntry<>(2L, "Đã duyệt"))
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

    private final String TEMPLATE_NAME = "DS_YC_nhan_vien.xlsx";
    private final String TEMPLATE_NAME_ORDER_BRANCH = "DS_YC_chi_nhanh.xlsx";
    private final Long STATUS_ORDER_REQUEST_WAIT = 0L;
    private final Long STATUS_ORDER_REQUEST_BRANCH_APPROVED = 1L;
    private final Long STATUS_ORDER_REQUEST_COMPANY_APPROVED = 2L;

    private final Long STATUS_ORDER_REQUEST_DETAIL_WAIT = 0L;
    private final Long STATUS_ORDER_REQUEST_DETAIL_BRANCH_APPROVED = 1L;
    private final Long STATUS_ORDER_REQUEST_DETAIL_COMPANY_APPROVED = 2L;
    private final Long STATUS_ORDER_REQUEST_DETAIL_IMPORTING = 3L;
    private final Long STATUS_ORDER_REQUEST_DETAIL_IMPORTED = 4L;

    private final Long STATUS_ORDER_BRANCH_WAIT = 1L;
    private final Long STATUS_ORDER_BRANCH_APPROVED = 2L;
    private final Long STATUS_ORDER_BRANCH_CANCEL = 0L;

    private final Long STATUS_ORDER_BRANCH_DETAIL_IMPORTING = 0L;
    private final Long STATUS_ORDER_BRANCH_DETAIL_IMPORTED = 1L;

    private final String TBL_ORDER_REQUEST = "AIO_ORDER_REQUEST_DETAIL";
    private final String TBL_ORDER_BRANCH = "AIO_ORDER_BRANCH_DETAIL";
    private final String TBL_ORDER_COMPANY = "AIO_ORDER_COMPANY_DETAIL";

    private void validateRqGetOrderRequest(AIOContractMobileRequest rq) {
        if (rq.getSysUserRequest() == null || rq.getOrderRequest() == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
    }

    public List<AIOOrderRequestDTO> getListOrderGoods(AIOContractMobileRequest rq) {
//        this.validateRqGetOrderRequest(rq);
        if (rq.getSysUserRequest() == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        return aioOrderGoodsManageDao.getListOrderGoods(rq.getOrderRequest(), rq.getSysUserRequest().getSysUserId());
    }

    public List<AIOOrderRequestDetailDTO> getOrderDetail(AIOContractMobileRequest rq) {
        this.validateRqGetOrderRequest(rq);
        if (rq.getOrderRequest().getOrderRequestId() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": id yêu cầu");
        }
        return aioOrderGoodsManageDao.getOrderDetail(rq.getOrderRequest().getOrderRequestId());
    }

    public AIOOrderRequestDTO getDataAddOrder(AIOContractMobileRequest rq) {
        List<AIOOrderRequestDetailDTO> goodsList = aioOrderGoodsManageDao.getGoodsList();
        DepartmentDTO sysGroupLv2 = aioOrderGoodsManageDao.getSysGroupLv2(rq.getSysUserRequest().getSysUserId());
        String requestCode = this.genOrderRequestCode(sysGroupLv2.getCode(), TYPE_CODE_STAFF);
        List<AIOOrderRequestDetailDTO> unitList = aioOrderGoodsManageDao.getUnitList();

        AIOOrderRequestDTO dto = new AIOOrderRequestDTO();
        dto.setGoodsList(goodsList);
        dto.setRequestCode(requestCode);
        dto.setSysGroupName(sysGroupLv2.getName());
        dto.setUnitList(unitList);
        return dto;
    }

    /**
     * Generate request code by type
     * @param sysGroupCode  sysGroupCode lv2 of logged user, default to "VCC" if type = 3
     * @param type          1: staff - YCNV
     *                      2: branch - YCCN
     *                      3: company - YCCT
     * @return code with format [type_str]/[sysGroupCode]/[2 digit year]/unique seq number
     */
    private String genOrderRequestCode(String sysGroupCode, int type) {
        StringJoiner joiner = new StringJoiner("/");
        String seqCode;
        switch (type) {
            case TYPE_CODE_STAFF:
                joiner.add("YCNV");
                seqCode = "AIO_ORDER_REQUEST_SEQ";
                break;
            case TYPE_CODE_BRANCH:
                joiner.add("YCCN");
                seqCode = "AIO_ORDER_BRANCH_SEQ";
                break;
            case TYPE_CODE_COMPANY:
                joiner.add("YCCN");
                seqCode = "AIO_ORDER_COMPANY_SEQ";
                break;
            default:
                throw new BusinessException("Không rõ loại yêu cầu");
        }

        Long id = commonService.getLatestSeqNumber(seqCode);
        if (id == null) { id = 1L; }
        String nextId = String.format((Locale) null, "%07d", id);
        SimpleDateFormat sdf = new SimpleDateFormat("yy");
        String year = sdf.format(new Date());

        return joiner.add(sysGroupCode).add(year).add(nextId).toString();
    }

    public void saveOrderRequest(AIOContractMobileRequest rq) {
        this.validateRqGetOrderRequest(rq);
        AIOOrderRequestDTO orderData = rq.getOrderRequest();
        List<AIOOrderRequestDetailDTO> details = orderData.getRequestDetails();
        if (orderData.getRequestDetails() == null || orderData.getRequestDetails().isEmpty()) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }

        DepartmentDTO sysGroupLv2 = aioOrderGoodsManageDao.getSysGroupLv2(rq.getSysUserRequest().getSysUserId());
        String code = this.genOrderRequestCode(sysGroupLv2.getCode(), TYPE_CODE_STAFF);
        orderData.setRequestCode(code);

        Long sysGroupLv3 = commonService.getSysGroupLevelByUserId(rq.getSysUserRequest().getSysUserId(), 3);
        orderData.setSysGroupLevel3(sysGroupLv3);
        orderData.setStatus(STATUS_ORDER_REQUEST_WAIT);
        orderData.setSysGroupId(sysGroupLv2.getSysGroupId());
        orderData.setCreatedDate(new Date());
        orderData.setCreateBy(rq.getSysUserRequest().getSysUserId());
        Long orderRqId = aioOrderRequestDAO.saveObject(orderData.toModel());
        commonService.validateIdCreated(orderRqId, AIOObjectType.ORDER_REQUEST);

        for (AIOOrderRequestDetailDTO detail : details) {
            detail.setOrderRequestId(orderRqId);
            detail.setStatus(STATUS_ORDER_REQUEST_DETAIL_WAIT);
//            detail.setOrderRequestCode(code);
            Long idDetail = aioOrderRequestDetailDAO.saveObject(detail.toModel());
            commonService.validateIdCreated(idDetail, AIOObjectType.ORDER_REQUEST);
        }
    }

    // order request NV
    // approve denied
    public DataListDTO doSearchOrderRequestNV(AIOOrderRequestDTO criteria, String sysGroupIdStr) {
        List<String> groupIdList = ConvertData.convertStringToList(sysGroupIdStr, ",");
        List<AIOOrderRequestDTO> dtos = aioOrderGoodsManageDao.doSearchOrderRequestNV(criteria, groupIdList);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public List<AIOOrderRequestDetailDTO> getDetails(Long id) {
        return aioOrderGoodsManageDao.getOrderDetail(id);
    }

    public void updateStatusOrder(AIOOrderRequestDTO rq) {
        if (rq == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        int result;
        if (rq.getOrderRequestId() == null || rq.getRequestDetails() == null || rq.getRequestDetails().isEmpty()) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " yêu cầu");
        }

        for (AIOOrderRequestDetailDTO detail : rq.getRequestDetails()) {
            detail.setUpdateUser(rq.getCreateBy());
            result = aioOrderGoodsManageDao.updateApproveOrderRequestDetail(detail);
            commonService.validateIdCreated(result, AIOObjectType.ORDER_REQUEST_DETAIL.getName());
        }

        result = aioOrderGoodsManageDao.updateStatusOrderRequest(rq.getOrderRequestId(), STATUS_ORDER_REQUEST_BRANCH_APPROVED);
        commonService.validateIdCreated(result, AIOObjectType.ORDER_REQUEST.getName());
    }

    public String exportExcel(AIOOrderRequestDTO criteria, String sysGroupIdStr) throws Exception {
        List<String> groupIdList = ConvertData.convertStringToList(sysGroupIdStr, ",");
        criteria.setMessageColumn(1);
        List<AIOOrderRequestDTO> data = aioOrderGoodsManageDao.doSearchOrderRequestNV(criteria, groupIdList);

        if (data == null || data.isEmpty()) {
            throw new BusinessException("Không có dữ liệu");
        }

        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet();
        sheet.setDefaultRowHeightInPoints(21);

        // set header row
        this.createHeaderRow(sheet, workbook);

        // prepare cell style
        List<CellStyle> styles = this.createCellStyles(workbook, sheet);

        // start from
        int rowNo = 1;
        XSSFRow row;
        double sum = 0;
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/YYYY");
        for (AIOOrderRequestDTO dto : data) {
            row = sheet.createRow(rowNo);
            this.createExcelRow(dto, row, styles, sdf);
            sum += dto.getAmount();
            rowNo++;
        }

        row = sheet.createRow(rowNo);
        this.createFooterRow(row, styles, sum);

        String path = commonService.writeToFileOnServer(workbook, TEMPLATE_NAME);
        return path;
    }

    private void createExcelRow(AIOOrderRequestDTO dto, XSSFRow row, List<CellStyle> styles, SimpleDateFormat sdf) {
        String createdDateStr = dto.getCreatedDateStr() + " - " + sdf.format(dto.getCreatedDate());
        String statusStr = StringUtils.EMPTY;
        if (dto.getStatus() != null) {
            statusStr = STATUS_ORDER_REQUEST.get(dto.getStatus());
        }
        int col = 0;
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(row.getRowNum());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getSysGroupName());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getSysGroupNameLevel3());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getSysUserName());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(createdDateStr);
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(statusStr);
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getGoodsCode());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getGoodsName());
        commonService.createExcelCell(row, col++, styles.get(3)).setCellValue(dto.getAmount() != null
                ? dto.getAmount() : 0);
        commonService.createExcelCell(row, col, styles.get(3)).setCellValue(dto.getAmountApproved() != null
                ? dto.getAmountApproved() : 0);
    }

    private void createHeaderRow(XSSFSheet sheet, XSSFWorkbook workbook) {
        final ColumnProfile[] COL_PROPS = new ColumnProfile[] {
                new ColumnProfile(1462, "STT"),
                new ColumnProfile(5961, "Đơn vị yêu cầu"),
                new ColumnProfile(5961, "Cụm đội yêu cầu"),
                new ColumnProfile(5961, "Nhân viên yêu cầu"),
                new ColumnProfile(4864, "Ngày tạo"),
                new ColumnProfile(4864, "Trạng thái"),
                new ColumnProfile(4864, "Mã vật tư"),
                new ColumnProfile(10422, "Tên vật tư"),
                new ColumnProfile(4278, "Số lượng"),
                new ColumnProfile(4278, "Số lượng duyệt")
        };

        commonService.createExcelHeaderRow(sheet, workbook, COL_PROPS);
    }

    private void createFooterRow(XSSFRow row, List<CellStyle> styles, double sum) {
        commonService.createExcelCell(row, 7, styles.get(0)).setCellValue("Tổng");
        commonService.createExcelCell(row, 8, styles.get(3)).setCellValue(sum);
    }

    private List<CellStyle> createCellStyles(XSSFWorkbook workbook, XSSFSheet sheet) {
        Font size11Font = workbook.createFont();
        commonService.updateFontConfig(size11Font, 11);

        CellStyle left = ExcelUtils.styleText(sheet);
        left.setFont(size11Font);

        CellStyle center = ExcelUtils.styleText(sheet);
        center.setAlignment(HorizontalAlignment.CENTER);
        center.setFont(size11Font);

        CellStyle currency = ExcelUtils.styleText(sheet);
        currency.setDataFormat(sheet.getWorkbook().createDataFormat().getFormat("#,##0"));
        currency.setAlignment(HorizontalAlignment.RIGHT);
        currency.setFont(size11Font);

        CellStyle number = ExcelUtils.styleNumber(sheet);
        number.setFont(size11Font);

        CellStyle styleDate = ExcelUtils.styleDate(sheet);
        XSSFCreationHelper createHelper = workbook.getCreationHelper();
        styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
        styleDate.setAlignment(HorizontalAlignment.CENTER);

        return Arrays.asList(left, center, currency, number, styleDate);
    }

    // order branch manage
    public DataListDTO doSearchOrderBranch(AIOOrderBranchDTO criteria, HttpServletRequest request) {
    	List<AIOOrderBranchDTO> dtos = new ArrayList<AIOOrderBranchDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.ORDER_BRANCH, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty()) {
			dtos = aioOrderBranchDAO.doSearchOrderBranch(criteria, groupIdList);
		}
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public AIOOrderRequestDTO getDataForAddView(Long userId, int type) {
        AIOOrderRequestDTO res = new AIOOrderRequestDTO();
        DepartmentDTO sysGroupLv2 = aioOrderGoodsManageDao.getSysGroupLv2(userId);
        res.setRequestCode(this.genOrderRequestCode(sysGroupLv2.getCode(), type));
        res.setCreatedDate(new Date());

        return res;
    }

    public DataListDTO getRequestApprovedGoodsList(AIOOrderRequestDTO obj) {
        List<AIOOrderBranchDetailDTO> dtos = aioOrderBranchDAO.getRequestGoodsList(obj);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(obj.getTotalRecord());
        dataListDTO.setSize(obj.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public List<AppParamDTO> getListSupplier() {
        return aioOrderGoodsManageDao.getListSupplier();
    }

    private void validateRequestCreateOrderBranch(AIOOrderBranchDTO dto, SysUserCOMSDTO user) {
        if (user == null) {
            throw new BusinessException(AIOErrorType.USER_NOT_LOGGED_IN.msg);
        }
        if (dto == null || dto.getBranchDetailDTOS() == null || dto.getBranchDetailDTOS().isEmpty()
                || dto.getIdList() == null || dto.getIdList().isEmpty()) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
    }

    public void submitAddOrderBranch(AIOOrderBranchDTO dto, SysUserCOMSDTO user) {
//        this.validateRequestCreateOrderBranch(dto, user);

        DepartmentDTO sysGroupLv2 = aioOrderGoodsManageDao.getSysGroupLv2(user.getSysUserId());
        String code = this.genOrderRequestCodeNew(sysGroupLv2.getCode(), TYPE_CODE_BRANCH);
        if (dto.getIsProvinceBought()==1){
            dto.setStatus(2L);
        }
        else {
            dto.setStatus(1L);
        }
        dto.setOrderBranchCode(code);
        dto.setCreatedDate(new Date());
        dto.setCreatedId(user.getSysUserId());
        dto.setSysGroupId(sysGroupLv2.getSysGroupId());
        dto.setSysGroupName(sysGroupLv2.getName());
        dto.setSignState(1l);
        Long idOrderBranch = aioOrderBranchDAO.saveObject(dto.toModel());
//        commonService.validateIdCreated(idOrderBranch, AIOObjectType.ORDER_BRANCH);

        // check detail is already in another request
//        List<Long> idList = aioOrderBranchDAO.checkDetailsIsInRequest(dto.getIdList());
//        if (idList != null && !idList.isEmpty()) {
//            // has any -> throw error
//            StringBuilder errorMsg = new StringBuilder("Sản phẩm đã ở trong yêu cầu chi nhánh khác: ");
//            int count = 0;
//            for (AIOOrderBranchDetailDTO detail : dto.getBranchDetailDTOS()) {
//                if (idList.contains(detail.getOrderRequestDetailId())) {
//                    errorMsg.append(detail.getRequestCode()).append("-").append(detail.getGoodsName());
//                    count++;
//                    if (count == idList.size()) {
//                        break;
//                    }
//                }
//            }
//
//            throw new BusinessException(errorMsg.toString());
//        }
        saveDetailData(dto,idOrderBranch);
    }

    public AIOOrderBranchDTO getDetailOrderBranch(Long idOrderBranch) {
        if (idOrderBranch == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }

        List<AIOOrderBranchDetailDTO> detailDTOS = aioOrderBranchDAO.getDetailOrderBranch(idOrderBranch);
        AIOOrderBranchDTO res = new AIOOrderBranchDTO();
        res.setBranchDetailDTOS(detailDTOS);

        return res;
    }

    public void updateBranchOrderDate(AIOOrderBranchDTO dto) {
        if (dto == null || dto.getBranchDetailDTOS() == null || dto.getBranchDetailDTOS().isEmpty()) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        for (AIOOrderBranchDetailDTO detail : dto.getBranchDetailDTOS()) {
            int result = aioOrderBranchDAO.updateBranchOrderDate(detail);
            commonService.validateIdCreated(result, AIOErrorType.SAVE_ERROR.msg + AIOObjectType.ORDER_BRANCH_DETAIL.getName());
        }
    }

    // order request branch
    public DataListDTO doSearchOrderRequestBranch(AIOOrderBranchDTO criteria, String sysGroupStr) {
        List<AIOOrderBranchDTO> dtos = aioOrderBranchDAO.doSearchOrderRequestBranch(criteria, new ArrayList<>());
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public List<AIOOrderBranchDetailDTO> getBranchDetails(Long id) {
        return aioOrderBranchDAO.getBranchDetails(id);
    }

    public void updateStatusOrderBranch(AIOOrderBranchDTO rq) {
        if (rq == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        int result;
        if (rq.getOrderBranchId() == null || rq.getBranchDetailDTOS() == null || rq.getBranchDetailDTOS().isEmpty()) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " yêu cầu");
        }

        for (AIOOrderBranchDetailDTO detail : rq.getBranchDetailDTOS()) {
            detail.setUpdateUser(rq.getCreatedId());
            result = aioOrderBranchDAO.updateApproveOrderBranchDetail(detail);
            commonService.validateIdCreated(result, AIOObjectType.ORDER_BRANCH_DETAIL.getName());
        }

        result = aioOrderBranchDAO.updateStatusOrderBranch(rq.getOrderBranchId(), STATUS_ORDER_BRANCH_APPROVED);
        commonService.validateIdCreated(result, AIOObjectType.ORDER_BRANCH.getName());
    }

    public String exportExcelOrderBranch(AIOOrderBranchDTO criteria, String sysGroupIdStr) throws Exception {
        List<String> groupIdList = ConvertData.convertStringToList(sysGroupIdStr, ",");
        criteria.setMessageColumn(1);
        List<AIOOrderBranchDTO> data = aioOrderBranchDAO.doSearchOrderRequestBranch(criteria, groupIdList);

        if (data == null || data.isEmpty()) {
            throw new BusinessException("Không có dữ liệu");
        }

        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet();
        sheet.setDefaultRowHeightInPoints(21);

        // set header row
        this.createOrderBranchHeaderRow(sheet, workbook);

        // prepare cell style
        List<CellStyle> styles = this.createCellStyles(workbook, sheet);

        // start from
        int rowNo = 1;
        XSSFRow row;
        double sum = 0;
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/YYYY");
        for (AIOOrderBranchDTO dto : data) {
            row = sheet.createRow(rowNo);
            this.createOrderBranchExcelRow(dto, row, styles, sdf);
            sum += dto.getAmount() == null ? 0 : dto.getAmount();
            rowNo++;
        }

        row = sheet.createRow(rowNo);
        this.createOrderBranchFooterRow(row, styles, sum);

        String path = commonService.writeToFileOnServer(workbook, TEMPLATE_NAME_ORDER_BRANCH);
        return path;
    }

    private void createOrderBranchExcelRow(AIOOrderBranchDTO dto, XSSFRow row, List<CellStyle> styles, SimpleDateFormat sdf) {
        String createdDateStr = dto.getCreatedDateStr() + " - " + sdf.format(dto.getCreatedDate());
        String statusStr = StringUtils.EMPTY;
        if (dto.getStatus() != null) {
            statusStr = STATUS_ORDER_BRANCH.get(dto.getStatus());
        }
        int col = 0;
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(row.getRowNum());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getSysGroupName());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getSysUserName());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(createdDateStr);
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(statusStr);
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getGoodsCode());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getGoodsName());
        commonService.createExcelCell(row, col++, styles.get(3)).setCellValue(dto.getAmount() != null
                ? dto.getAmount() : 0);
        commonService.createExcelCell(row, col, styles.get(3)).setCellValue(dto.getAmountApproved() != null
                ? dto.getAmountApproved() : 0);
    }

    private void createOrderBranchHeaderRow(XSSFSheet sheet, XSSFWorkbook workbook) {
        final ColumnProfile[] COL_PROPS = new ColumnProfile[] {
                new ColumnProfile(1462, "STT"),
                new ColumnProfile(5961, "Đơn vị yêu cầu"),
                new ColumnProfile(5961, "Nhân viên yêu cầu"),
                new ColumnProfile(4864, "Ngày tạo"),
                new ColumnProfile(4864, "Trạng thái"),
                new ColumnProfile(4864, "Mã vật tư"),
                new ColumnProfile(10422, "Tên vật tư"),
                new ColumnProfile(4278, "Số lượng"),
                new ColumnProfile(4278, "Số lượng duyệt")
        };

        commonService.createExcelHeaderRow(sheet, workbook, COL_PROPS);
    }

    private void createOrderBranchFooterRow(XSSFRow row, List<CellStyle> styles, double sum) {
        commonService.createExcelCell(row, 6, styles.get(0)).setCellValue("Tổng");
        commonService.createExcelCell(row, 7, styles.get(3)).setCellValue(sum);
    }

    // manage order company
    public DataListDTO getBranchApprovedGoodsList(AIOOrderCompanyDTO obj) {
        List<AIOOrderBranchDetailDTO> dtos = aioOrderCompanyDAO.getBranchApprovedGoodsList(obj);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(obj.getTotalRecord());
        dataListDTO.setSize(obj.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public DataListDTO doSearchOrderCompany(AIOOrderCompanyDTO obj, String sysGroupIds) {
        List<AIOOrderCompanyDTO> dtos = aioOrderCompanyDAO.doSearchOrderCompany(obj);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(obj.getTotalRecord());
        dataListDTO.setSize(obj.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    private void validateRequestCreateOrderCompany(AIOOrderCompanyDTO dto, SysUserCOMSDTO user) {
        if (user == null) {
            throw new BusinessException(AIOErrorType.USER_NOT_LOGGED_IN.msg);
        }
        if (dto == null || dto.getDetailDTOS() == null || dto.getDetailDTOS().isEmpty()
                || dto.getIdList() == null || dto.getIdList().isEmpty()) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
    }

    public void submitAddOrderCompany(AIOOrderCompanyDTO dto, SysUserCOMSDTO user) {
//        this.validateRequestCreateOrderCompany(dto, user);

//        DepartmentDTO sysGroupLv2 = aioOrderGoodsManageDao.getSysGroupLv2(user.getSysUserId());
        String code = this.genOrderRequestCodeNew(COMPANY_CODE, TYPE_CODE_COMPANY);

        dto.setOrderCompanyCode(code);
        dto.setStatus(1L);
        dto.setCreatedDate(new Date());
        dto.setCreatedUser(user.getSysUserId());
        dto.setSignState(1l);

        Long id = aioOrderCompanyDAO.saveObject(dto.toModel());
//        commonService.validateIdCreated(id, AIOObjectType.ORDER_COMPANY);

        // check detail is already in another request
//        List<Long> idList = aioOrderCompanyDAO.checkDetailsIsInRequest(dto.getIdList());
//        if (idList != null && !idList.isEmpty()) {
//            // has any -> throw error
//            StringBuilder errorMsg = new StringBuilder("Sản phẩm đã ở trong yêu cầu khác: ");
//            int count = 0;
//            for (AIOOrderCompanyDetailDTO detail : dto.getDetailDTOS()) {
//                if (idList.contains(detail.getOrderRequestDetailId())) {
//                    errorMsg.append(detail.getOrderBranchCode()).append("-").append(detail.getGoodsName());
//                    count++;
//                    if (count == idList.size()) {
//                        break;
//                    }
//                }
//            }
//
//            throw new BusinessException(errorMsg.toString());
//        }

        // none -> insert detail
        for (AIOOrderCompanyDetailDTO detail : dto.getDetailDTOS()) {
            detail.setOrderCompanyId(id);
            detail.setStatus(0L);
//            detail.setOrderBranchCode(code);
//            detail.setOrderRequestCode(detail.getRequestCode());
//                detail.setInRequest(1L);
            detail.setIsProvinceBought(2l);
            if(detail.getTotalAmount()!=null) {
            	detail.setAmountTotal(detail.getTotalAmount());
            }
            Long idDetail = aioOrderCompanyDetailDAO.saveObject(detail.toModel());
//            commonService.validateIdCreated(idDetail, AIOObjectType.ORDER_COMPANY_DETAIL);
        }

//        int result = aioOrderBranchDAO.updateOrderInRequest(dto.getIdList(), TBL_ORDER_BRANCH);
//        commonService.validateIdCreated(result, "Cập nhật yêu cầu thất bại");
    }

    public AIOOrderCompanyDTO getDetailOrderCompany(Long id) {
        if (id == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }

        List<AIOOrderCompanyDetailDTO> detailDTOS = aioOrderCompanyDAO.getDetailOrderCompany(id);
        AIOOrderCompanyDTO res = new AIOOrderCompanyDTO();
        res.setDetailDTOS(detailDTOS);

        return res;
    }

    public void updateCompanyOrderDate(AIOOrderCompanyDTO dto) {
        if (dto == null || dto.getDetailDTOS() == null || dto.getDetailDTOS().isEmpty()) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        for (AIOOrderCompanyDetailDTO detail : dto.getDetailDTOS()) {
            int result = aioOrderCompanyDAO.updateCompanyOrderDate(detail);
            commonService.validateIdCreated(result, AIOErrorType.SAVE_ERROR.msg + AIOObjectType.ORDER_COMPANY_DETAIL.getName());
        }
    }
    
    //huypq-20190922-start
    public DataListDTO getDataGoodsOrderBranch(GoodsDTO obj) {
        List<AIOOrderBranchDetailDTO> dtos = aioOrderBranchDAO.getDataGoodsOrderBranch(obj);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(obj.getTotalRecord());
        dataListDTO.setSize(obj.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }
    
    public DataListDTO getDataRequestOrder(AIOOrderBranchDetailDTO obj) {
        List<AIOOrderBranchDetailDTO> dtos = aioOrderBranchDAO.getDataRequestOrder(obj);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(obj.getTotalRecord());
        dataListDTO.setSize(obj.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }
    
    public List<AIOOrderBranchDetailDTO> getDataBranchWhenEdit(Long id){
    	return aioOrderBranchDAO.getDataBranchWhenEdit(id);
    }
    
    public void updateOrderBranch(AIOOrderBranchDTO dto, SysUserCOMSDTO user) {
//      this.validateRequestCreateOrderBranch(dto, user);

      DepartmentDTO sysGroupLv2 = aioOrderGoodsManageDao.getSysGroupLv2(user.getSysUserId());
      String code = this.genOrderRequestCode(sysGroupLv2.getCode(), TYPE_CODE_BRANCH);

      dto.setOrderBranchCode(code);
      dto.setStatus(1L);
//      dto.setCreatedDate(new Date());
//      dto.setCreatedId(user.getSysUserId());
      dto.setSysGroupId(sysGroupLv2.getSysGroupId());
      dto.setSysGroupName(sysGroupLv2.getName());
      dto.setSignState(1l);
      Long idOrderBranch = aioOrderBranchDAO.updateObject(dto.toModel());
      
      aioOrderBranchDAO.deleteOrderBranch(dto.getOrderBranchId());

      saveDetailData(dto,dto.getOrderBranchId());

  }
    
    public void saveDetailData(AIOOrderBranchDTO dto, Long idOrderBranch) {
    	HashMap<String, Long> maps = new HashMap<>();
        // none -> insert detail
  		for (AIOOrderBranchDetailDTO detail : dto.getBranchDetailDTOS()) {
  			detail.setOrderBranchId(idOrderBranch);
  			detail.setIsProvinceBought(dto.getIsProvinceBought());
  			detail.setStatus(0L);

  			Long idDetail = aioOrderBranchDetailDAO.saveObject(detail.toModel());
  			maps.put(detail.getGoodsName(), idDetail);
  		}
  		
  		for (AIOOrderBranchDetailDTO request : dto.getListDataRequest()) {
  			AIOOrderBranchDetailRequestDTO branchRequest = new AIOOrderBranchDetailRequestDTO();
  			branchRequest.setOrderBranchId(idOrderBranch);
  			branchRequest.setOrderBranchDetailId(maps.get(request.getGoodsName()));
  			branchRequest.setAmount(request.getAmount());
  			branchRequest.setOrderRequestId(request.getOrderRequestId());
  			branchRequest.setOrderRequestDetailId(request.getOrderRequestDetailId());
  			if (request.getTotalAmount() != null) {
  				branchRequest.setTotalAmount(Double.parseDouble(String.valueOf(request.getTotalAmount())));
  			}
  			branchRequest.setGoodsId(request.getGoodsId());
  			aioOrderBranchDetailRequestDAO.saveObject(branchRequest.toModel());
  		}
    }
    
    public List<String> checkRoleCreate(HttpServletRequest request) {
    	String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATED,
				Constant.AdResourceKey.ORDER_BRANCH, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		return groupIdList;
    }
    
    public DataListDTO getDataCompanyGoods(AIOOrderBranchDetailDTO obj) {
        List<AIOOrderBranchDetailDTO> dtos = aioOrderBranchDAO.getDataCompanyGoods(obj);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(obj.getTotalRecord());
        dataListDTO.setSize(obj.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }
    
    private String genOrderRequestCodeNew(String sysGroupCode, int type) {
        StringJoiner joiner = new StringJoiner("/");
        String seqCode;
        switch (type) {
            case TYPE_CODE_BRANCH:
                joiner.add("YCMHCN");
                seqCode = "AIO_ORDER_BRANCH_SEQ";
                break;
            case TYPE_CODE_COMPANY:
                joiner.add("YCMHCT");
                seqCode = "AIO_ORDER_COMPANY_SEQ";
                break;
            default:
                throw new BusinessException("Không rõ loại yêu cầu");
        }

        Long id = commonService.getLatestSeqNumber(seqCode);
        if (id == null) { id = 1L; }
        String nextId = String.format((Locale) null, "%06d", id);
        SimpleDateFormat sdf = new SimpleDateFormat("yy");
        String year = sdf.format(new Date());
        if(type==3) {
        	return joiner.add(year).add(nextId).toString();
        } else {
        	return joiner.add(sysGroupCode).add(year).add(nextId).toString();
        }
        
    }
    
    public AIOOrderRequestDTO getDataForAddViewNew(Long userId, int type) {
        AIOOrderRequestDTO res = new AIOOrderRequestDTO();
        DepartmentDTO sysGroupLv2 = aioOrderGoodsManageDao.getSysGroupLv2(userId);
        res.setRequestCode(this.genOrderRequestCodeNew(sysGroupLv2.getCode(), type));
        res.setCreatedDate(new Date());

        return res;
    }
    
    public void updateOrderCompany(AIOOrderCompanyDTO dto, SysUserCOMSDTO user) {
    	
    	aioOrderBranchDAO.deleteOrderCompany(dto.getOrderCompanyId(),user.getSysUserId());
    	
    	for (AIOOrderCompanyDetailDTO detail : dto.getDetailDTOS()) {
            detail.setOrderCompanyId(dto.getOrderCompanyId());
            detail.setStatus(0L);
            detail.setIsProvinceBought(2l);
            if(detail.getTotalAmount()!=null) {
            	detail.setAmountTotal(detail.getTotalAmount());
            }
            Long idDetail = aioOrderCompanyDetailDAO.saveObject(detail.toModel());
        }

    }
    
    public List<AIOOrderCompanyDetailDTO> getDataCompanyWhenEdit(Long id){
    	return aioOrderBranchDAO.getDataCompanyWhenEdit(id);
    }
    
    public List<AIOOrderBranchDetailDTO> groupDataCountGoods(List<AIOOrderBranchDetailDTO> listData){
    	HashMap<String, AIOOrderBranchDetailDTO> maps = new HashMap<>();
    	List<AIOOrderBranchDetailDTO> listDataReturn = new ArrayList<AIOOrderBranchDetailDTO>();
    	for(AIOOrderBranchDetailDTO obj : listData) {
    		String code = obj.getGoodsCode()+"*"+obj.getGoodsName();
    		if (maps.containsKey(code)) {
    			AIOOrderBranchDetailDTO dto = maps.get(code);
    			dto.setAmount(dto.getAmount() + obj.getAmount());
    			dto.setTotalAmount(dto.getTotalAmount() + obj.getTotalAmount());
    		} else {
    			maps.put(code, obj);
    		}
//    		
//    		if(maps.size()==0) {
//    			maps.put(code, obj);
//    			listDataReturn.add(obj);
//    		} else {
//    			if(maps.get(code)==null) {
//    				maps.put(code, obj);
//    				listDataReturn.add(obj);
//    			} else { 
////    				AIOOrderBranchDetailDTO value = maps.get(code);
//    				for(AIOOrderBranchDetailDTO dto : listDataReturn) {
//    					if(code.equals(dto.getGoodsCode()+"*"+dto.getGoodsName())) {
//    						dto.setAmount(maps.get(code).getAmount() + dto.getAmount());
//    						dto.setTotalAmount(maps.get(code).getTotalAmount() + dto.getTotalAmount());
//    					}
//    				}
//    			}
//    		}
    	}
    	
    	listDataReturn = new ArrayList(maps.values());
    	return listDataReturn;
    }
    //huy-end
}
