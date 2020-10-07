package com.viettel.aio.business;

import com.viettel.aio.dao.AIOReportDAO;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOPackageDTO;
import com.viettel.aio.dto.AIOReportSalaryDTO;
import com.viettel.aio.dto.enumeration.AIOReportChartEnum;
import com.viettel.aio.dto.report.AIOReportDTO;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;
import com.viettel.utils.DateTimeUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

//VietNT_20190619_created
@Service("aioReportBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOReportBusinessImpl {

    static Logger LOGGER = LoggerFactory.getLogger(AIOReportBusinessImpl.class);

    private AIOReportDAO reportDao;
    private CommonServiceAio commonService;

    @Autowired
    public AIOReportBusinessImpl(AIOReportDAO reportDao, CommonServiceAio commonService) {
        this.reportDao = reportDao;
        this.commonService = commonService;
    }

    @Context
    HttpServletRequest request;

    //VietNT_13/07/2019_start
    private final String TEMPLATE_SALARY_REPORT_NAME = "Bieu_mau_danh_sach_tra_luong.xlsx";
    private final String TEMPLATE_SALARY_DETAIL_REPORT_NAME = "Bieu_mau_chi_tiet_tinh_luong.xlsx";
    //VietNT_end

    public DataListDTO doSearchRpCostPrice(AIOReportDTO criteria) {
        List<AIOReportDTO> dtos = reportDao.doSearchRpCostPrice(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public DataListDTO getListContract(AIOContractDTO criteria) {
        return commonService.getListContract(criteria);
    }

    public DataListDTO getListPackage(AIOPackageDTO criteria) {
        return commonService.getListPackage(criteria);
    }

    //VietNT_27/06/2019_start
    public DataListDTO doSearchRpStock(AIOReportDTO criteria) {
        List<AIOReportDTO> dtos = reportDao.doSearchRpStock(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }
    //VietNT_end

    //VietNT_13/07/2019_start
    // rp salary
    public DataListDTO doSearchRpSalary(AIOReportDTO criteria) {
        List<AIOReportDTO> data = this.processDataRpSalary(criteria);

        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(data);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    private List<AIOReportDTO> processDataRpSalary(AIOReportDTO criteria) {
        List<AIOReportDTO> noSalaryList = reportDao.doSearchRpSalary(criteria);
        if (noSalaryList != null && !noSalaryList.isEmpty()) {
            List<String> userCodes = noSalaryList.stream().map(AIOReportDTO::getSysUserCode).collect(Collectors.toList());

            List<AIOReportDTO> salaryList = reportDao.doSearchRpSalaryWithNumber(criteria, userCodes);
            LinkedHashMap<String, AIOReportDTO> map = new LinkedHashMap<>();

            for (AIOReportDTO dto : salaryList) {
                AIOReportDTO exist = map.get(dto.getSysUserCode().toUpperCase());
                if (exist == null) {
                    exist = dto;
                    this.initDataSalary(exist);
                }
                this.setSalaryByType(exist, dto.getIsProvinceBought(), dto.getType(), dto.getSalary());
                map.put(exist.getSysUserCode().toUpperCase(), exist);
                this.setSumSalary(exist);
            }
            return new ArrayList<>(map.values());
        }
        return noSalaryList;
    }

    private void setSalaryByType(AIOReportDTO dto, Long isProvinceBought, Long type, Double salary) {
        if (isProvinceBought == 1) {
            switch (type.intValue()) {
                case 1:
                    dto.setpSales(dto.getpSales() + salary);
                    break;
                case 2:
                    dto.setpPerformer(dto.getpPerformer() + salary);
                    break;
                case 3:
                    dto.setpStaffAIO(dto.getpStaffAIO() + salary);
                    break;
                case 4:
                    dto.setpManager(dto.getpManager() + salary);
                    break;
                case 5:
                    dto.setpManagerChannels(dto.getpManagerChannels() + salary);
            }
        } else {
            switch (type.intValue()) {
                case 1:
                    dto.setcSales(dto.getcSales() + salary);
                    break;
                case 2:
                    dto.setcPerformer(dto.getcPerformer() + salary);
                    break;
                case 3:
                    dto.setcStaffAIO(dto.getcStaffAIO() + salary);
                    break;
                case 4:
                    dto.setcManager(dto.getcManager() + salary);
                    break;
                case 5:
                    dto.setcManagerChannels(dto.getcManagerChannels() + salary);
            }
        }
    }

    public List<AppParamDTO> getDropDownData() {
        return reportDao.getDropDownData();
    }

    public String exportExcelSalary(AIOReportDTO criteria) throws Exception {
        List<AIOReportDTO> data = this.processDataRpSalary(criteria);

        if (data == null || data.isEmpty()) {
            throw new BusinessException("Không có dữ liệu");
        }

        XSSFWorkbook workbook = commonService.createWorkbook(TEMPLATE_SALARY_REPORT_NAME);
        XSSFSheet sheet = workbook.getSheetAt(0);
        List<CellStyle> styles = this.createCellStyles(workbook, sheet);

        // date
        this.setDateRowRpSalary(sheet, criteria.getStartDate(), criteria.getEndDate(), new int[] {0, 15});

        int rowNum = 6;
        XSSFRow row;
        for (AIOReportDTO dto : data) {
            row = sheet.createRow(rowNum);
            this.createExcelRowRpSalary(dto, row, styles);
            rowNum++;
        }

        String path = commonService.writeToFileOnServer(workbook, TEMPLATE_SALARY_REPORT_NAME);
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

    @SuppressWarnings("Duplicates")
    private void createExcelRowRpSalary(AIOReportDTO dto, XSSFRow row, List<CellStyle> styles) {
        int col = 0;
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(row.getRowNum() - 5);
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(dto.getAreaCode());
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(dto.getProvinceCode());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getGroupNameLv3());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getSysUserCode());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getSysUserName());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getSumSalary());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getcSales());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getcPerformer());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getcManagerChannels());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getcStaffAIO());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getcManager());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getpSales());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getpPerformer());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getpManagerChannels());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getpStaffAIO());
        commonService.createExcelCell(row, col, styles.get(2)).setCellValue(dto.getpManager());
    }

    private void setDateRowRpSalary(XSSFSheet sheet, Date startDate, Date endDate, int[] mergeRegion) {
        XSSFRow rowDate = sheet.createRow(2);
        CellStyle styleHeader = ExcelUtils.styleHeader(sheet);
        commonService.removeCellBorder(styleHeader);

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/YYYY");
        commonService.createExcelCell(rowDate, 0, styleHeader).setCellValue(
                sdf.format(startDate) + " - " + sdf.format(endDate));
        sheet.addMergedRegion(new CellRangeAddress(2, 2, mergeRegion[0], mergeRegion[1]));
    }

    //rp salary detail
    public DataListDTO doSearchRpSalaryDetail(AIOReportDTO criteria) {
//        List<AIOReportDTO> dtos = this.processDataRpSalaryDetail(criteria);
        List<AIOReportDTO> dtos = reportDao.exportReportSalary(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    private void initDataSalary(AIOReportDTO dto) {
        dto.setpSales(dto.getpSales() != null ? dto.getpSales() : 0D);
        dto.setpPerformer(dto.getpPerformer() != null ? dto.getpPerformer() : 0D);
        dto.setpStaffAIO(dto.getpStaffAIO() != null ? dto.getpStaffAIO() : 0D);
        dto.setpManager(dto.getpManager() != null ? dto.getpManager() : 0D);
        dto.setpManagerChannels(dto.getpManagerChannels() != null ? dto.getpManagerChannels() : 0D);
        dto.setpManagerChannels(dto.getSumSalary() != null ? dto.getSumSalary() : 0D);
        dto.setcSales(dto.getcSales() != null ? dto.getcSales() : 0D);
        dto.setcPerformer(dto.getcPerformer() != null ? dto.getcPerformer() : 0D);
        dto.setcStaffAIO(dto.getcStaffAIO() != null ? dto.getcStaffAIO() : 0D);
        dto.setcManager(dto.getcManager() != null ? dto.getcManager() : 0D);
        dto.setcManagerChannels(dto.getcManagerChannels() != null ? dto.getcManagerChannels() : 0D);
    }

//    private List<AIOReportDTO> processDataRpSalaryDetail(AIOReportDTO criteria) {
//        List<AIOReportDTO> noSalaryList = reportDao.doSearchRpSalaryDetail(criteria);
//        Set<Long> detailIds = new HashSet<>();
//        Set<String> userCodes = new HashSet<>();
//
//        if (noSalaryList != null && !noSalaryList.isEmpty()) {
//            noSalaryList.forEach(dto -> {
//                detailIds.add(dto.getContractDetailId());
//                userCodes.add(dto.getSysUserCode());
//            });
//
//            List<AIOReportDTO> salaryList = reportDao.doSearchRpSalaryDetailWithNumber(criteria, userCodes, detailIds);
//            LinkedHashMap<String, AIOReportDTO> map = new LinkedHashMap<>();
//
//            for (AIOReportDTO dto : salaryList) {
//                AIOReportDTO exist = map.get(dto.getSysUserCode().toUpperCase() + dto.getContractDetailId());
//                if (exist == null) {
//                    exist = dto;
//                    this.initDataSalary(exist);
//                }
//                this.setSalaryByType(exist, dto.getIsProvinceBought(), dto.getType(), dto.getSalary());
//                map.put(exist.getSysUserCode().toUpperCase() + dto.getContractDetailId(), exist);
//            }
//            return new ArrayList<>(map.values());
//        }
//
//        return noSalaryList;
//    }

    private void setSumSalary(AIOReportDTO dto) {
        Double sum = dto.getcSales() + dto.getcPerformer() + dto.getcManagerChannels() + dto.getcStaffAIO()
                + dto.getcManager() + dto.getpSales() + dto.getpPerformer() + dto.getpManagerChannels() + dto.getpStaffAIO()
                + dto.getpManager();
        dto.setSumSalary((double) Math.round(sum * 100) / 100);
    }

    public String exportExcelSalaryDetail(AIOReportDTO criteria) throws Exception {
//        List<AIOReportDTO> data = this.processDataRpSalaryDetail(criteria);
        List<AIOReportDTO> data = reportDao.exportReportSalary(criteria);
        if (data.isEmpty()) {
            throw new BusinessException("Không có dữ liệu");
        }

        XSSFWorkbook workbook = commonService.createWorkbook(TEMPLATE_SALARY_DETAIL_REPORT_NAME);
        XSSFSheet sheet = workbook.getSheetAt(0);
        List<CellStyle> styles = this.createCellStyles(workbook, sheet);

        // date
        this.setDateRowRpSalary(sheet, criteria.getStartDate(), criteria.getEndDate(), new int[]{0, 29});

        int rowNum = 7;
        XSSFRow row;
        for (AIOReportDTO dto : data) {
            row = sheet.createRow(rowNum);
            this.createExcelRowRpSalaryDetail(dto, row, styles);
            rowNum++;
        }

        String path = commonService.writeToFileOnServer(workbook, TEMPLATE_SALARY_DETAIL_REPORT_NAME);
        return path;
    }

    @SuppressWarnings("Duplicates")
    private void createExcelRowRpSalaryDetail(AIOReportDTO dto, XSSFRow row, List<CellStyle> styles) {
        int col = 0;
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(row.getRowNum() - 6);
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(dto.getAreaCode());
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(dto.getProvinceCode());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getName());
//        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getSysUserCode());
//        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getSysUserName());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getContractCode());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getQuantity());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getPrice());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getAmount());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getRevenue());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getPackageName());
        if (dto.getIsProvinceBought() == 1L) {
            //hang cong ty cap
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(0D);
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(StringUtils.EMPTY);

            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(0D);
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(StringUtils.EMPTY);

            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(0D);
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(StringUtils.EMPTY);

            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(0D);
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(StringUtils.EMPTY);

            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(0D);
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(StringUtils.EMPTY);

            //tinh mua hang
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSalaryBh());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSysUserCodeBh());

            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSalaryTh());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSysUserCodeTh());

            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSalaryQl());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSysUserCodeQl());

            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSalaryAio());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSysUserCodeAio());

            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSalaryGd());
            commonService.createExcelCell(row, col, styles.get(2)).setCellValue(dto.getSysUserCodeGd());
        } else {
            //hang cong ty cap
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSalaryBh());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSysUserCodeBh());

            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSalaryTh());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSysUserCodeTh());

            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSalaryQl());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSysUserCodeQl());

            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSalaryAio());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSysUserCodeAio());

            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSalaryGd());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getSysUserCodeGd());

            //tinh mua hang
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(0D);
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(StringUtils.EMPTY);

            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(0D);
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(StringUtils.EMPTY);

            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(0D);
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(StringUtils.EMPTY);

            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(0D);
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(StringUtils.EMPTY);

            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(0D);
            commonService.createExcelCell(row, col, styles.get(2)).setCellValue(StringUtils.EMPTY);
        }


//        //tinh tu mua hang
//        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getpSales() != null ?dto.getpSales() :0D);
//        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getpPerformer() != null ? dto.getpPerformer() : 0D);
//        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getpStaffAIO() != null ? dto.getpStaffAIO() : 0D);
//        commonService.createExcelCell(row, col, styles.get(2)).setCellValue(dto.getpManager() != null ? dto.getpManager() : 0D);
    }
    //VietNT_end

    public List<AIOReportDTO> getAutoCompleteSysGroupLevel(AIOReportDTO dto, HttpServletRequest request) {
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE,
                Constant.AdResourceKey.CONTRACT, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");

        return reportDao.getAutoCompleteSysGroupLevel(dto, groupIdList);
    }

    public Map<String, List<AIOReportDTO>> doSearchDataChart(AIOReportDTO dto) {
        Map<String, List<AIOReportDTO>> dataMap = new HashMap<>();
        List<AIOReportDTO> data = new ArrayList<>();

        String startDate = getSearchDate(dto, true);
        String endDate = getSearchDate(dto, false);

        List<String> chartList = dto.getChartList();
        for (String chartName : chartList) {
            AIOReportChartEnum e = AIOReportChartEnum.get(chartName);
            switch (e) {
                case PROGRESS_DAY:

                    break;
                case CUMULATIVE_REVENUE:

                    break;
                case CUMULATIVE_REVENUE_INDUSTRY:
                    data = reportDao.doSearchCumulativeRevenueIndustryChart(dto.getPerformerGroupId(), startDate, endDate);
                    break;
                case DEPLOYMENT:
                    data = reportDao.doSearchDevelopmentChart(dto.getPerformerGroupId(), startDate, endDate);
                    break;
                case REVENUE_PROPORTION:
                    data = reportDao.doSearchRevenueProportionChart(dto.getPerformerGroupId(), startDate, endDate);
                    break;
                case CUSTOMER_REUSE:
                    data = reportDao.doSearchCustomerReuseChart(dto.getPerformerGroupId(), startDate, endDate);
                    break;
                case TOP_THREE_CITIES:
                    data = reportDao.doSearchTopThreeCitiesChart(dto, startDate, endDate);

                    try {
                        data = generateTopData(data);
                    } catch (Exception ex) {
                        LOGGER.error("generateTopData error: ", ex);
                    }
                    break;
                case TOP_THREE_GROUPS:
                    data = reportDao.doSearchTopThreeGroupChart(dto, startDate, endDate);

                    try {
                        data = generateTopData(data);
                    } catch (Exception ex) {
                        LOGGER.error("generateTopData error: ", ex);
                    }
                    break;
            }
            dataMap.put(e.getName(), data);
        }

        return dataMap;
    }

    public List<AIOReportDTO> doSearchDataExport(AIOReportDTO dto) {
        List<AIOReportDTO> data = new ArrayList<>();

        String startDate = getSearchDate(dto, true);
        String endDate = getSearchDate(dto, false);

        List<String> chartList = dto.getChartList();
        AIOReportChartEnum e = AIOReportChartEnum.get(chartList.get(0));
        switch (e) {
            case CUMULATIVE_REVENUE_INDUSTRY:
                data = reportDao.doSearchRevenueExport(dto.getPerformerGroupId(), startDate, endDate);
                break;
            case REVENUE_PROPORTION:
                data = reportDao.doSearchRevenueProportionExport(dto.getPerformerGroupId(), startDate, endDate);
                break;
        }

        return data;
    }

    private String getSearchDate(AIOReportDTO dto, boolean isStartDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DateTimeUtils.DATE_DD_MM_YYYY);
        LocalDate date = LocalDate.of(dto.getYear(), dto.getMonth(), 1);

        return isStartDate ? date.format(formatter) : date.withDayOfMonth(date.lengthOfMonth()).format(formatter);
    }

    private List<AIOReportDTO> generateTopData(List<AIOReportDTO> data) {
        List<AIOReportDTO> retList = new LinkedList<>();
        List<AIOReportDTO> goodList = new LinkedList<>();
        List<AIOReportDTO> badList = new LinkedList<>();

        if (data != null & !data.isEmpty()) {
            if (data.size() >= 6) {
                // set top good cities
                goodList.add(data.get(0));
                goodList.add(data.get(1));
                goodList.add(data.get(2));

                // set top bad cities
                badList.add(data.get(data.size() - 3));
                badList.add(data.get(data.size() - 2));
                badList.add(data.get(data.size() - 1));
            } else {
                AIOReportDTO dto;
                for (int i = 0; i < 6; i++) {
                    if (i < data.size()) {
                        dto = data.get(i);
                        if (i < 3) { // set top good cities
                            goodList.add(dto);
                        } else { // set top bad cities
                            badList.add(dto);
                        }
                    } else {
                        dto = new AIOReportDTO();
                        dto.setGoodCityAmount(BigDecimal.valueOf(0));
                        dto.setPointName("N/A");
                        badList.add(dto);
                    }
                }
            }

            goodList.forEach(dto -> dto.setBadCityAmount(BigDecimal.valueOf(0)));
            badList.forEach(dto -> {
                dto.setBadCityAmount(dto.getGoodCityAmount());
                dto.setGoodCityAmount(BigDecimal.valueOf(0));
            });

            retList.addAll(goodList);
            retList.addAll(badList);
        }

        return retList;
    }

    public DataListDTO doSearchAIORpSalary(AIOReportDTO criteria) {
        List<AIOReportSalaryDTO> dtos = reportDao.doSearchAIORpSalary(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    private List<AIOReportSalaryDTO> processDataAIORpSalaryDetail(AIOReportDTO criteria) {
        List<AIOReportSalaryDTO> noSalaryList = reportDao.doSearchAIORpSalary(criteria);
        return noSalaryList;
    }

    public String exportExcelAIOSalaryDetail(AIOReportDTO criteria) throws Exception {
        List<AIOReportSalaryDTO> data = this.processDataAIORpSalaryDetail(criteria);

        if (data == null || data.isEmpty()) {
            throw new BusinessException("Không có dữ liệu");
        }

        XSSFWorkbook workbook = commonService.createWorkbook(TEMPLATE_SALARY_DETAIL_REPORT_NAME);
        XSSFSheet sheet = workbook.getSheetAt(0);
        List<CellStyle> styles = this.createCellStyles(workbook, sheet);

        // date
        this.setDateRowRpSalary(sheet, criteria.getStartDate(), criteria.getEndDate(), new int[]{0, 29});

        int rowNum = 7;
        XSSFRow row;
        for (AIOReportSalaryDTO dto : data) {
            row = sheet.createRow(rowNum);
            this.createExcelRowRpAIOSalaryDetail(dto, row, styles);
            rowNum++;
        }

        String path = commonService.writeToFileOnServer(workbook, TEMPLATE_SALARY_DETAIL_REPORT_NAME);
        return path;
    }

    @SuppressWarnings("Duplicates")
    private void createExcelRowRpAIOSalaryDetail(AIOReportSalaryDTO dto, XSSFRow row, List<CellStyle> styles) {
        int col = 0;
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(row.getRowNum() - 6);
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(dto.getAreaCode());
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(dto.getProvinceCode());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getName());
        //commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getMaGd());
        //commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getTenGd());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getContractCode());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getQuantity());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getPrice());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getAmount());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getRevenue());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getPackageName());
        if (dto.getIsProvinceBought() == 2) {
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaBh());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getBh());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaTh());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getTh());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaQlk());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getQlk());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaAio());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getAio());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaGd());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getGd());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaBh());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue("-");
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaTh());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue("-");
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaQlk());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue("-");
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaAio());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue("-");
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaGd());
            commonService.createExcelCell(row, col, styles.get(2)).setCellValue("-");


        } else if (dto.getIsProvinceBought() == 1) {
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaBh());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue("-");
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaTh());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue("-");
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaQlk());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue("-");
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaAio());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue("-");
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaGd());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue("-");
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaBh());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getBh());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaTh());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getTh());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaQlk());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getQlk());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaAio());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getAio());
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getMaGd());
            commonService.createExcelCell(row, col, styles.get(2)).setCellValue(dto.getGd());

        }

    }

}
