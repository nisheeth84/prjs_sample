package com.viettel.aio.business;

import com.viettel.aio.bo.AIOCustomerBO;
import com.viettel.aio.config.AIOAttachmentType;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.config.AIOSaleChannel;
import com.viettel.aio.config.CacheManager;
import com.viettel.aio.config.DomainDataCache;
import com.viettel.aio.dao.AIOAcceptanceRecordsDAO;
import com.viettel.aio.dao.AIOAcceptanceRecordsDetailDAO;
import com.viettel.aio.dao.AIOConfigServiceDAO;
import com.viettel.aio.dao.AIOContractDAO;
import com.viettel.aio.dao.AIOContractDetailDAO;
import com.viettel.aio.dao.AIOContractPauseDAO;
import com.viettel.aio.dao.AIOContractPerformDateDAO;
import com.viettel.aio.dao.AIOCustomerDAO;
import com.viettel.aio.dao.AIOMerEntityDAO;
import com.viettel.aio.dao.AIOPackageDetailDAO;
import com.viettel.aio.dto.AIOAcceptanceRecordsDTO;
import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOContractDetailDTO;
import com.viettel.aio.dto.AIOContractManagerDTO;
import com.viettel.aio.dto.AIOContractPauseDTO;
import com.viettel.aio.dto.AIOContractPerformDateDTO;
import com.viettel.aio.dto.AIOCustomerDTO;
import com.viettel.aio.dto.AIOLocationUserDTO;
import com.viettel.aio.dto.AIOMerEntityDTO;
import com.viettel.aio.dto.AIOPackageDetailDTO;
import com.viettel.aio.dto.AIOPackageGoodsDTO;
import com.viettel.aio.dto.AIOPackagePromotionDTO;
import com.viettel.aio.dto.AIOSysUserDTO;
import com.viettel.aio.dto.AIOWoGoodsDTO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.DepartmentDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.ConvertData;
import com.viettel.utils.ImageUtil;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.xssf.usermodel.XSSFCreationHelper;
import org.apache.poi.xssf.usermodel.XSSFFont;
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
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

//VietNT_20190313_created
@Service("aioContractManagerBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOContractManagerBusinessImpl extends BaseFWBusinessImpl<AIOCustomerDAO, AIOCustomerDTO, AIOCustomerBO> implements AIOContractManagerBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIOContractManagerBusinessImpl.class);

    @Autowired
    public AIOContractManagerBusinessImpl(AIOCustomerDAO customerDAO, AIOAcceptanceRecordsDAO acceptanceRecordsDAO,
                                          AIOAcceptanceRecordsDetailDAO acceptanceRecordsDetailDAO,
                                          AIOConfigServiceDAO configServiceDAO, AIOContractDAO contractDAO,
                                          AIOContractDetailDAO contractDetailDAO, CommonServiceAio commonService,
                                          UtilAttachDocumentDAO utilAttachDocumentDAO, AIOContractPerformDateDAO aioContractPerformDateDAO,
                                          AIOContractPauseDAO aioContractPauseDAO, AIOPackageDetailDAO aioPackageDetailDAO,
                                          AIOWoGoodsBusinessImpl woGoodsBusiness) {
        this.customerDAO = customerDAO;
        this.acceptanceRecordsDAO = acceptanceRecordsDAO;
        this.acceptanceRecordsDetailDAO = acceptanceRecordsDetailDAO;
        this.configServiceDAO = configServiceDAO;
        this.contractDAO = contractDAO;
        this.contractDetailDAO = contractDetailDAO;
        this.commonService = commonService;
        this.utilAttachDocumentDAO = utilAttachDocumentDAO;
        this.aioContractPerformDateDAO = aioContractPerformDateDAO;
        this.aioContractPauseDAO = aioContractPauseDAO;
        this.aioPackageDetailDAO = aioPackageDetailDAO;
        this.cacheManager = new CacheManager();
        this.woGoodsBusiness = woGoodsBusiness;
    }

    private AIOCustomerDAO customerDAO;
    private AIOAcceptanceRecordsDAO acceptanceRecordsDAO;
    private AIOAcceptanceRecordsDetailDAO acceptanceRecordsDetailDAO;
    private AIOConfigServiceDAO configServiceDAO;
    private AIOContractDAO contractDAO;
    private AIOContractDetailDAO contractDetailDAO;
    private CommonServiceAio commonService;
    private UtilAttachDocumentDAO utilAttachDocumentDAO;
    private AIOContractPerformDateDAO aioContractPerformDateDAO;
    private AIOContractPauseDAO aioContractPauseDAO;
    private AIOPackageDetailDAO aioPackageDetailDAO;
    private CacheManager cacheManager;
    private AIOWoGoodsBusinessImpl woGoodsBusiness;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Value("${input_sub_folder_upload}")
    private String inputSubFolderUpload;

    @Context
    HttpServletRequest request;

    //HuyPQ-start
    @Autowired
    private AIOMerEntityDAO aioMerEntityDAO;
    //Huy-end
    
    private final String EMPTY_REQUEST = "Không có dữ liệu!";
    private final String USER_NO_INFO = "Không có thông tin người dùng!";
    private final String SAVE_CUSTOMER_ERROR = "Lưu Khách hàng thất bại!";
    private final String SAVE_CONTRACT_ERROR = "Lưu HĐ thất bại!";
    private final String SAVE_RECORD_ERROR = "Lưu bản ghi thất bại!";
    private final String SAVE_CONTRACT_DETAIL_ERROR = "Lưu chi tiết HĐ thất bại!";
    private final String SEND_SMS_EMAIL_ERROR = "Gửi tin nhắn/ email thất bại";
    private final String DELETE_CONTRACT_DETAIL_ERROR = "Xóa chi tiết HĐ thất bại!";
    private final String DELETE_RECORD_ERROR = "Xóa bản ghi thất bại!";
    private final String NO_PERMISSION = "Không có quyền xóa bản ghi!";
    private final String REPEAT_PACKAGE_ERROR = "Gói lặp không đủ thông tin!";

    private static ConcurrentHashMap<Long, DomainDataCache<Long>> sysGroupCache;

    public DataListDTO doSearch(AIOContractDTO criteria, String sysGroupIdStr) {
    	List<String> groupIdList = ConvertData.convertStringToList(sysGroupIdStr, ",");
        List<AIOContractDTO> dtos = contractDAO.doSearch(criteria, groupIdList);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public AIOContractManagerDTO getDropDownData() {
        List<AIOConfigServiceDTO> list = contractDAO.getDropDownData();
        Long contractId = contractDAO.getLastestSeqNumber();

        AIOContractManagerDTO res = new AIOContractManagerDTO();
        res.setContractId(contractId);
        res.setDdData(list);

        return res;
    }

    public List<AIOContractDetailDTO> getContractDetailByContractId(Long contractId) {
        List<AIOContractDetailDTO> dtos = contractDAO.getContractDetailByContractId(contractId);
        return dtos;
    }

    public DataListDTO doSearchCustomer(AIOCustomerDTO criteria) {
        List<AIOCustomerDTO> dtos = customerDAO.doSearchCustomer(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public DataListDTO doSearchService(AIOConfigServiceDTO criteria) {
        List<AIOContractDetailDTO> dtos = configServiceDAO.doSearchService(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public AIOCustomerDTO createNewCustomer(AIOCustomerDTO customerDTO, Long sysUserId, Long sysGroupId) {
        String customerCode = this.generateCustomerCode(customerDTO.getType());
        customerDTO.setCode(customerCode);
        customerDTO.setCreatedDate(new Date());
        customerDTO.setCreatedUser(sysUserId);
        customerDTO.setCreatedGroupId(sysGroupId);

        Long idCustomer = customerDAO.saveObject(customerDTO.toModel());
        if (idCustomer < 1) {
            throw new BusinessException(SAVE_CUSTOMER_ERROR);
        }
        customerDTO.setCustomerId(idCustomer);
        return customerDTO;
    }

    public void submitAdd(AIOContractDTO dto, SysUserCOMSDTO sysUser) {
        if (dto == null || dto.getDetailDTOS() == null || dto.getCustomerDTO() == null || dto.getPerformerId() == null) {
            throw new BusinessException(EMPTY_REQUEST);
        }
        Long sysGroupId = sysUser.getSysGroupId();
        Long sysUserId = sysUser.getSysUserId();
        String saleChannel = sysUser.getSaleChannel();
        if (sysGroupId == null || sysUserId == null || StringUtils.isEmpty(saleChannel)) {
            throw new BusinessException(USER_NO_INFO);
        }

        // goi noi bo
        validateInternalContract(dto, commonService);

        List<AIOContractDetailDTO> detailDTOS = dto.getDetailDTOS();
        AIOCustomerDTO customerDTO = dto.getCustomerDTO();

        // getUser sysgroup lv 2
        Long sysGroupIdLv2 = contractDAO.getUserSysGroupLevel2(sysGroupId);
        Date today = new Date();

        // try insert customer
        if (customerDTO.getCustomerId() == null) {
            customerDTO = this.createNewCustomer(customerDTO, sysUserId, sysGroupId);

            dto.setCustomerId(customerDTO.getCustomerId());
            dto.setCustomerCode(customerDTO.getCode());
        }

        // set data contract
        dto.setCreatedDate(today);
        dto.setCreatedUser(sysUserId);
        dto.setCreatedGroupId(sysGroupIdLv2);

        Long performerGroupLv2Id = contractDAO.getUserSysGroupLevel2ByUserId(dto.getPerformerId());
        dto.setPerformerGroupId(performerGroupLv2Id);

        // try insert contract
        // contract code
//        Long contractId = contractDAO.getLastestContractId();
//        String contractCode = contractDTO.getContractCode();
//        String leadZerosId = String.format((Locale) null, "%07d", contractId + 1);
//        contractDTO.setContractCode(contractCode.substring(0, contractCode.lastIndexOf("_") + 1) + leadZerosId);
        String contractCode = dto.getContractCode();
        String leadZerosId = String.format((Locale) null, "%07d", contractDAO.getNextContractCodeId());
        dto.setContractCode(contractCode.substring(0, contractCode.lastIndexOf("_") + 1) + leadZerosId);

        //VietNT_23/07/2019_start
        // luong thanh toan ko qua vtpay
        if (saleChannel.equals(AIOSaleChannel.VCC.code)) {
            setDataForPayType(dto);
        }
        //VietNT_end
        //VietNT_24/07/2019_start
        // luong tao HD VTPost
        if (saleChannel.equals(AIOSaleChannel.VTPOST.code)) {
            setDataForThuHo(dto, today);
        }
        //VietNT_end

        Long idContract = contractDAO.saveObject(dto.toModel());
        dto.setContractId(idContract);
        if (idContract < 1) {
            throw new BusinessException(SAVE_CONTRACT_ERROR);
        }

        //VietNT_22/07/2019_start
        // insert file attachment Contract
        this.saveAttachment(dto.getListFile(), idContract, sysUserId);
        //VietNT_end

        // save perform date contract
        this.savePerformDateContract(idContract);

        // not yet deployed => set today = null => no start, end date
//        if (contractDTO.getStatus() != 1) {
//            today = null;
//        }

        List<AIOPackageGoodsDTO> listGoodsToCreateOrder = new ArrayList<>();
        for (AIOContractDetailDTO detailDTO: detailDTOS) {
            // validate stock before add
            List<AIOPackageGoodsDTO> listMissingQuantity = this.validateStockGoodsBeforeCreate(detailDTO.getPackageDetailId(), detailDTO.getQuantity().longValue(), performerGroupLv2Id);
            if (!listMissingQuantity.isEmpty()) {
                listGoodsToCreateOrder.addAll(listMissingQuantity);
                continue;
            }

            if (detailDTO.getIsRepeat() != null && detailDTO.getIsRepeat() == 1) {
                this.insertNewContractDetailRepeat(dto, detailDTO, today);
            } else {
                this.insertNewContractDetail(dto, detailDTO, today);
            }

//            this.sendSms(detailDTO, dto, sysUserId, packageNameList);
//            if (contractDTO.getStatus() == 1) {
//                this.sendSms(detailDTO, contractDTO, sysUserId, packageNameList);
//            }
        }

        if (!listGoodsToCreateOrder.isEmpty()) {
            throw new BusinessException(
                    AIOErrorType.INSUFFICIENT_GOODS_IN_STOCK.msg + ". Đã tạo yêu cầu hàng hóa với mã ",
                    dto, listGoodsToCreateOrder);
        }

        // send sms hd
        this.sendSms(dto, sysUserId);

        /**Hoangnh start 16042019 -- update table AIO_ORDERS**/
        if (dto.getAioOrdersId() != null) {
            contractDAO.updateAIOOrder(dto.getAioOrdersId(), idContract);
        }
        /**Hoangnh end 16042019**/
    }

    private void saveAcceptanceRecords(AIOContractDTO dto, AIOContractDetailDTO detailDTO) {
        AIOAcceptanceRecordsDTO acceptanceRecordsDTO = this.toAcceptanceRecordsDTO(dto, detailDTO);
        Long idRecord;
        if (detailDTO.getAcceptanceRecordsId() != null) {
        	acceptanceRecordsDTO.setAcceptanceRecordsId(detailDTO.getAcceptanceRecordsId());
        	idRecord = acceptanceRecordsDAO.updateObject(acceptanceRecordsDTO.toModel());
        } else {
        	idRecord = acceptanceRecordsDAO.saveObject(acceptanceRecordsDTO.toModel());
        }
        
        if (idRecord < 1) {
            throw new BusinessException(SAVE_RECORD_ERROR);
        }
    }

    private AIOAcceptanceRecordsDTO toAcceptanceRecordsDTO(AIOContractDTO contractDTO, AIOContractDetailDTO detailDTO) {
        AIOAcceptanceRecordsDTO dto = new AIOAcceptanceRecordsDTO();
        dto.setContractId(contractDTO.getContractId());
        dto.setPackageId(detailDTO.getPackageId());
        dto.setPackageDetailId(detailDTO.getPackageDetailId());

        dto.setCustomerId(contractDTO.getCustomerId());
        dto.setCustomerCode(contractDTO.getCustomerCode());
        dto.setCustomerName(contractDTO.getCustomerName());
        dto.setCustomerPhone(contractDTO.getCustomerPhone());
        dto.setCustomerAddress(contractDTO.getCustomerAddress());

        dto.setPerformerId(contractDTO.getPerformerId());
//        contractDTO.setStartDate(detailDTO.getStartDate());
//        contractDTO.setEndDate(detailDTO.getEndDate());
        dto.setType(contractDTO.getType());
//        contractDTO.setAmount(detailDTO.getAmount());
        dto.setContractDetailId(detailDTO.getContractDetailId());
        return dto;
    }

    private final String[] CUSTOMER_TYPE_STR = new String[]{"", "KHCN", "KHDN"};
    private final int CUSTOMER_CODE_NUM_LENGTH = 11;

    private String generateCustomerCode(Long type) {
//        String latest = customerDAO.getLatestCodeByType(type);
//        String id = String.valueOf((latest == null ? 0 : Long.parseLong(latest)) + 1);
        String id = String.valueOf(contractDAO.getNextCustomerCodeId());
        StringBuilder sb = new StringBuilder(CUSTOMER_TYPE_STR[type.intValue()]);
        for (int j = 0; j < CUSTOMER_CODE_NUM_LENGTH; j++) {
            if (sb.length() + id.length() < CUSTOMER_CODE_NUM_LENGTH) {
                sb.append(0);
            } else {
                sb.append(id);
                break;
            }
        }
        return sb.toString();
    }

    public List<AIOLocationUserDTO> getUsersInRange(AIOContractDTO criteria) {
        List<AIOLocationUserDTO> users = contractDAO.getUsersInRange(criteria);
        return users;
    }

    public void submitDeploy(List<AIOContractDTO> contracts, Long sysUserId, Long sysGroupId) {
        if (contracts == null || contracts.isEmpty()) {
            throw new BusinessException(EMPTY_REQUEST);
        }
        if (sysGroupId == null || sysUserId == null) {
            throw new BusinessException(USER_NO_INFO);
        }

        Long sysGroupIdLv2 = contractDAO.getUserSysGroupLevel2(sysGroupId);
        Date today = new Date();
        for (AIOContractDTO contract : contracts) {
            //VietNT_29/06/2019_start
            // check if contract has detail complete
            Long count = contractDAO.countContractDetailWithStatuses(contract.getContractId(), Collections.singletonList(3L));
            if (count != null && count > 0) {
                throw new BusinessException(AIOErrorType.CONTRACT_HAS_DETAIL_COMPLETE.msg);
            }
            //VietNT_end
            contract.setPerformerGroupId(contractDAO.getUserSysGroupLevel2ByUserId(contract.getPerformerId()));
            int result = contractDAO.updateContractDeploy(today, contract, sysUserId, sysGroupIdLv2);
            if (result < 1) {
                throw new BusinessException(SAVE_CONTRACT_ERROR);
            }

            List<AIOContractDetailDTO> detailDTOS = contractDAO.getContractDetailByContractIdWithRepeat(contract.getContractId());
            List<String> packageNameList = new ArrayList<>();
            List<Long> packageDetailIdRepeat = new ArrayList<>();
            Date startDateRepeat = today;
            long timeAsMillis = 0;
            long intervalAsMillis = 0;

            for (AIOContractDetailDTO detailDTO : detailDTOS) {
                // is repeat package
                if (detailDTO.getIsRepeat() != null && detailDTO.getIsRepeat() == 1) {
                    if (packageDetailIdRepeat.contains(detailDTO.getPackageDetailId())) {
                        startDateRepeat = new Date(startDateRepeat.getTime() + intervalAsMillis);
                        this.updateDetailDeploy(contract, detailDTO, startDateRepeat, timeAsMillis);
                    } else {
                        // first record, init startdate & timeAsMillis
                        packageDetailIdRepeat.add(detailDTO.getPackageDetailId());
                        startDateRepeat = today;
                        timeAsMillis = (long) (detailDTO.getTime() * TimeUnit.HOURS.toMillis(1));
                        intervalAsMillis = (long) (detailDTO.getRepeatInterval() * TimeUnit.DAYS.toMillis(1));

                        // update detail & save acceptance records
                        this.updateDetailDeploy(contract, detailDTO, startDateRepeat, timeAsMillis);
                    }
                } else { // normal package
                    timeAsMillis = (long) (detailDTO.getTime() * TimeUnit.HOURS.toMillis(1));
                    this.updateDetailDeploy(contract, detailDTO, today, timeAsMillis);
                }
            }

            this.sendSms(contract, sysUserId);
//            this.sendRedeploySms(contract, sysUserId, packageNameList, today);
        }
    }

    private void updateDetailDeploy(AIOContractDTO contractDTO, AIOContractDetailDTO detailDTO, Date today, long timeAsMillis) {
        // start end date for sending email
        detailDTO.setStartDate(today);
        detailDTO.setEndDate(new Date(today.getTime() + timeAsMillis));
        // --

        int resultDetail = contractDAO.updateContractDetailDeploy(today, new Date(today.getTime() + timeAsMillis), detailDTO.getContractDetailId());
        if (resultDetail < 1) {
            throw new BusinessException(SAVE_CONTRACT_DETAIL_ERROR);
        }

        this.saveAcceptanceRecords(contractDTO, detailDTO);
    }

    public AIOContractManagerDTO getFullContractInfo(Long id) {
        AIOContractManagerDTO dto = new AIOContractManagerDTO();
        AIOContractDTO contractDTO = contractDAO.getContractById(id);
        List<AIOContractDetailDTO> detailDTOS = contractDAO.getContractDetailByContractId(id);
        List<AIOContractPauseDTO> pauseDTOS = aioContractPauseDAO.getListByContractId(id);

        if (contractDTO == null || detailDTOS.isEmpty()) {
            throw new BusinessException(EMPTY_REQUEST);
        }

        contractDTO.setIsBill(detailDTOS.get(0).getIsBill());
        contractDTO.setPauseDTOS(pauseDTOS);
//        List<Long> detailIds = detailDTOS.stream().map(AIOContractDetailDTO::getContractDetailId).collect(Collectors.toList());
        List<Long> detailIds = new ArrayList<>();
        detailDTOS.forEach(d -> {
            detailIds.add(d.getContractDetailId());
            if (d.getType() != null) {
                AIOPackagePromotionDTO promo = new AIOPackagePromotionDTO();
                promo.setType(d.getType());
                promo.setMoney(d.getMoney());
                d.setPromotionDTOS(Collections.singletonList(promo));
            }
        });

        AIOCustomerDTO criteria = new AIOCustomerDTO();
        criteria.setCustomerId(contractDTO.getCustomerId());
        List<AIOCustomerDTO> customerDTOS = customerDAO.doSearchCustomer(criteria);

        if (customerDTOS == null || customerDTOS.isEmpty()) {
            throw new BusinessException(EMPTY_REQUEST);
        }

        criteria = customerDTOS.get(0);

        List<UtilAttachDocumentDTO> imageDTOS = this.getListImageContract(detailIds, id);

        dto.setContractDTO(contractDTO);
        dto.setDetailDTOS(detailDTOS);
        dto.setCustomerDTOS(criteria);
        dto.setImageDTOS(imageDTOS);

        return dto;
    }

    public DataListDTO getListPerformer(AIOLocationUserDTO criteria, Long sysUserId) {
        Long sysGroupLv2 = contractDAO.getUserSysGroupLevel2ByUserId(sysUserId);
        List<AIOLocationUserDTO> dtos = contractDAO.getListSysUser(criteria, sysGroupLv2);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    static final String subjectEmail = "Thông báo nhận công việc AIO";
    static final String contentEmail = "Bạn được giao thực hiện dịch vụ \"%s\" - \"%s\" cho khách hàng \"%s\" - SĐT: %s. " +
            "Thời gian thực hiện từ \"%s\" đến \"%s\"";
    private static final String subjectEmailRedeploy = "Thông báo điều chuyển công việc AIO";
    private static final String contentEmailRedeploy =
            "Hợp đồng \"%s\" - gói \"%s\" của bạn đã được chuyển sang cho nhân viên \"%s\"";

    private void sendSms(AIOContractDTO contractDTO, Long userId) {
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm dd/MM/yyyy");
        String content;

        content = String.format(contentEmail,
                contractDTO.getContractCode(),
                contractDTO.getServiceCode(),
                contractDTO.getCustomerName(),
                contractDTO.getCustomerPhone(),
                sdf.format(contractDTO.getCreatedDate()),
                sdf.format(new Date(contractDTO.getCreatedDate().getTime() + TimeUnit.HOURS.toMillis(72))));

        int result = commonService.insertIntoSmsTable(subjectEmail, content, contractDTO.getPerformerId(), userId, new Date());
        if (result < 1) {
            LOGGER.error(SEND_SMS_EMAIL_ERROR);
        }
    }

    private void sendRedeploySms(AIOContractDTO contractDTO, Long userId, List<String> packageNameList, Date today) {
        if (StringUtils.isNotEmpty(contractDTO.getLastPerformerName())) {
            int result = commonService.insertIntoSmsTable(subjectEmailRedeploy,
                    String.format(contentEmailRedeploy, contractDTO.getContractCode(), StringUtils.join(packageNameList, "\", \""), contractDTO.getPerformerName()),
                    contractDTO.getLastPerformerId(), userId, today);
            if (result < 1) {
                LOGGER.error(SEND_SMS_EMAIL_ERROR);
            }
        }
    }

    // excel
    private final String LIST_CONTRACT_AIO = "Danh_sach_HD_AIO.xlsx";

    public String exportExcel(AIOContractDTO criteria, String sysGroupIdStr) throws Exception {
        List<String> groupIdList = ConvertData.convertStringToList(sysGroupIdStr, ",");
        List<AIOContractDTO> data = contractDAO.doSearchExcelExport(criteria, groupIdList);

        if (data == null || data.isEmpty()) {
            throw new BusinessException("Không có dữ liệu");
        }

//        XSSFWorkbook workbook = commonService.createWorkbook(LIST_CONTRACT_AIO);
//        XSSFSheet sheet = workbook.getSheetAt(0);

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
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-YYYY");
        for (AIOContractDTO dto : data) {
            row = sheet.createRow(rowNo);
            this.createExcelRow(dto, row, styles, sdf);
            rowNo++;
        }

        String path = commonService.writeToFileOnServer(workbook, LIST_CONTRACT_AIO);
        return path;
    }

    //VietNT_05/08/2019_start
    private void createHeaderRow(XSSFSheet sheet, XSSFWorkbook workbook) {
        final ColumnProfile[] COL_PROPS = new ColumnProfile[] {
                new ColumnProfile(1462, "STT"),
                new ColumnProfile(2742, "KHU VỰC"),
                new ColumnProfile(2742, "TỈNH"),
                new ColumnProfile(3364, "NGÀNH HÀNG"),
                new ColumnProfile(2742, "DỊCH VỤ"),
                new ColumnProfile(7862, "MÃ HỢP ĐỒNG"),
                new ColumnProfile(10422, "NỘI DUNG HỢP ĐỒNG"),
                new ColumnProfile(10422, "TÊN GÓI"),
                new ColumnProfile(4278, "NGÀY KÝ"),
                new ColumnProfile(4278, "NGÀY TẠO HĐ"),
                new ColumnProfile(4278, "GIỜ TẠO HĐ"),
                new ColumnProfile(3364, "MÃ NHÂN VIÊN BÁN HÀNG"),
                new ColumnProfile(5961, "NHÂN VIÊN BÁN HÀNG"),
                new ColumnProfile(5961, "CỤM ĐỘI NHÂN VIÊN BÁN HÀNG"),
                new ColumnProfile(5961, "NGƯỜI BÁN CÙNG"),
                new ColumnProfile(4278, "GIÁ TRỊ HỢP ĐỒNG"),
                new ColumnProfile(4278, "SỐ LƯỢNG"),
                new ColumnProfile(6070, "TÊN KHÁCH HÀNG"),
                new ColumnProfile(3254, "SỐ ĐIỆN THOẠI"),
                new ColumnProfile(10422, "ĐỊA CHỈ"),
                new ColumnProfile(4278, "MÃ SỐ THUẾ"),
                new ColumnProfile(4278, "GIÁ TRỊ THU TIỀN KHÁCH HÀNG"),
                new ColumnProfile(4278, "SỐ TIỀN PHẢI THU"),
                new ColumnProfile(4864, "ĐÃ NỘP TIỀN"),
                new ColumnProfile(4864, "NGÀY NỘP"),
                new ColumnProfile(5156, "HÌNH THỨC THANH TOÁN"),
                new ColumnProfile(5156, "SỐ NGÀY ĐƯỢC PHÉP THANH TOÁN"),
                new ColumnProfile(4278, "GIÁ TRỊ CHIẾT KHẤU NV"),
                new ColumnProfile(5266, "HĐ TỈNH TỰ MUA"),
                new ColumnProfile(3364, "MÃ NGƯỜI THỰC HIỆN"),
                new ColumnProfile(6070, "TÊN NGƯỜI THỰC HIỆN"),
                new ColumnProfile(5961, "CỤM ĐỘI NGƯỜI THỰC HIỆN"),
                new ColumnProfile(6070, "NGƯỜI LÀM CÙNG"),
                new ColumnProfile(3328, "THỜI GIAN GIAO VIỆC"),
                new ColumnProfile(3364, "THỜI GIAN BẮT ĐẦU THỰC HIỆN"),
                new ColumnProfile(3364, "THỜI GIAN ĐÓNG VIỆC"),
                new ColumnProfile(3364, "GIỜ ĐÓNG VIỆC"),
                new ColumnProfile(2742, "CÓ NHẬN HÓA ĐƠN KHÔNG"),
                new ColumnProfile(6070, "TÊN KHÁCH HÀNG XUẤT HÓA ĐƠN"),
                new ColumnProfile(10422, "ĐỊA CHỈ XUẤT HÓA ĐƠN"),
                new ColumnProfile(4278, "MÃ SỐ THUẾ XUẤT HÓA ĐƠN"),
                new ColumnProfile(10422, "GHI CHÚ"),
                new ColumnProfile(5120, "TRẠNG THÁI"),
                new ColumnProfile(3218, "KÊNH BÁN"),
                new ColumnProfile(3218, "KÊNH TIẾP XÚC"),
                new ColumnProfile(5120, "XẾP HẠNG KH")
        };

        // set header row
        XSSFRow rowHeader = sheet.createRow(0);
        rowHeader.setHeightInPoints(50);
        XSSFFont headerFont = workbook.createFont();
        headerFont.setFontName("Calibri");
        headerFont.setFontHeightInPoints((short) 11);
        headerFont.setBold(true);

        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        headerStyle.setAlignment(HorizontalAlignment.CENTER);
        headerStyle.setFont(headerFont);
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setFillForegroundColor(IndexedColors.LIME.index);
        headerStyle.setWrapText(true);

        for (int i = 0; i < COL_PROPS.length; i++) {
            Cell cell = rowHeader.createCell(i);
            cell.setCellStyle(headerStyle);
            cell.setCellValue(COL_PROPS[i].title);
            sheet.setColumnWidth(i, COL_PROPS[i].width);
        }
    }
    //VietNT_end

    private static final String XLS_YES = "Có";
    private static final String XLS_NO = "Không";
    private static final String XLS_COMPANY_BOUGHT = "Công ty mua hàng";
    private static final String XLS_PROVINCE_BOUGHT = "Tỉnh tự mua hàng";
    private static final String XLS_NOT_AVAILABLE = "N/A";
    private static final String XLS_PAY_TYPE_VTPAY = "ViettelPay";
    private static final String XLS_PAY_TYPE_NON_VTPAY = "Không qua ViettelPay";
    private static final String XLS_CONTACT_CHANNEL_DIRECT = "Trực tiếp";
    private static final String XLS_IS_NOT_PAY = "Chưa nộp tiền";
    private static final String XLS_STATUS_NO_PERFORMER = "Chưa có nhân viên";
    private static final String XLS_STATUS_NOT_START = "Chưa thực hiện";
    private static final String XLS_STATUS_DOING = "Đang thực hiện";
    private static final String XLS_STATUS_DONE = "Đã hoàn thành";
    private static final String XLS_STATUS_CANCEL = "Hết hiệu lực";
    private static final String XLS_STATUS_PROPOSE_PAUSE = "Đề xuất tạm dừng";
    private static final String XLS_STATUS_PROPOSE_CANCEL = "Đề xuất hủy";

    private void createExcelRow(AIOContractDTO dto, XSSFRow row, List<CellStyle> styles, SimpleDateFormat sdf) {
        double amount = dto.getAmount() == null ? 0 : dto.getAmount();

        int col = 0;
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(row.getRowNum());

        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(dto.getAreaName());
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(dto.getCatProvinceCode());
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(dto.getIndustryCode());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getWorkName());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getContractCode());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getContractContent());

        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getPackageName());
        commonService.createExcelCell(row, col++, styles.get(4)).setCellValue(dto.getSignDate());
        commonService.createExcelCell(row, col++, styles.get(4)).setCellValue(dto.getCreatedDate());
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(dto.getCreatedDateStr());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getSellerCode());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getSellerName());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getSellerGroupLv3());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(
                StringUtils.isEmpty(dto.getSalesTogether())
                        ? StringUtils.EMPTY
                        : dto.getSalesTogether());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getContractAmount() == null ? 0 : dto.getContractAmount());

        commonService.createExcelCell(row, col++, styles.get(3)).setCellValue(dto.getQuantity() == null ? 0 : dto.getQuantity());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getCustomerName());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getCustomerPhone());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getCustomerAddress());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getCustomerTaxCode());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(amount);
        //VietNT_01/07/2019_start
        if (dto.getThuHo() != null) {
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getThuHo());
        } else {
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(XLS_NOT_AVAILABLE);
        }
        if (dto.getIsPay() != null && dto.getIsPay() == 1) {
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getThuHo() != null ? dto.getThuHo() : amount);
        } else {
            commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(XLS_IS_NOT_PAY);
        }
        commonService.createExcelCell(row, col++, styles.get(4)).setCellValue(dto.getPayDate());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(
                dto.getPayType() == null
                        ? XLS_NOT_AVAILABLE
                        : (dto.getPayType() == 1 ? XLS_PAY_TYPE_VTPAY : XLS_PAY_TYPE_NON_VTPAY));
        //VietNT_end
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getNumberPay()==null ? "":dto.getNumberPay().toString());
        commonService.createExcelCell(row, col++, styles.get(2)).setCellValue(dto.getDiscountStaff() == null ? 0 : dto.getDiscountStaff());
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(
                dto.getIsProvinceBought() != null
                        ? (dto.getIsProvinceBought() == 1 ? XLS_PROVINCE_BOUGHT : XLS_COMPANY_BOUGHT)
                        : StringUtils.EMPTY);
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getPerformerCode());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getPerformerName());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getPerformerGroupLv3());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getText());
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(
                dto.getEndDateFrom() != null && dto.getEndDateTo() != null
                        ? sdf.format(dto.getEndDateFrom()) + " - " + sdf.format(dto.getEndDateTo())
                        : StringUtils.EMPTY);
        commonService.createExcelCell(row, col++, styles.get(4)).setCellValue(dto.getStartDate());
        commonService.createExcelCell(row, col++, styles.get(4)).setCellValue(dto.getEndDate());
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(dto.getEndDateStr());

        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getIsBill() == 1 ? XLS_YES : XLS_NO);
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getCustomerNameBill());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getCustomerAddressBill());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getTaxCodeBill());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(dto.getDescription());

        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(
                dto.getStatus() != null
                        ? this.convertStatus(dto.getStatus())
                        : StringUtils.EMPTY);
        commonService.createExcelCell(row, col++, styles.get(1)).setCellValue(
                StringUtils.isEmpty(dto.getSaleChannel())
                        ? XLS_NOT_AVAILABLE
                        : dto.getSaleChannel());
        commonService.createExcelCell(row, col++, styles.get(0)).setCellValue(
                StringUtils.isEmpty(dto.getContactChannel())
                        ? XLS_CONTACT_CHANNEL_DIRECT
                        : dto.getContactChannel());
        commonService.createExcelCell(row, col, styles.get(1)).setCellValue(dto.getName());
    }

    private String convertStatus(Long status) {
    	switch (status.intValue()) {
            case 0: return XLS_STATUS_NO_PERFORMER;
            case 1: return XLS_STATUS_NOT_START;
            case 2: return XLS_STATUS_DOING;
            case 3: return XLS_STATUS_DONE;
            case 4: return XLS_STATUS_CANCEL;
            case 5: return XLS_STATUS_PROPOSE_PAUSE;
            case 6: return XLS_STATUS_PROPOSE_CANCEL;
            default: return StringUtils.EMPTY;
        }
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

    // get contract images
    private final String ATTACHMENT_TYPE = "97";
    private List<UtilAttachDocumentDTO> getListImageContract(List<Long> detailIds, Long contractId) {
//        List<UtilAttachDocumentDTO> images = commonService.getListImagesByIdAndType(detailIds, ATTACHMENT_TYPE);
        detailIds.add(contractId);
        List<UtilAttachDocumentDTO> images = commonService.getListAttachmentByIdAndType(detailIds,
                Arrays.asList(AIOAttachmentType.CONTRACT_IMAGE.code, AIOAttachmentType.CONTRACT_ATTACHMENT.code), 0);
        return images;
    }

    // disable contract
    public void disableContract(Long id, Long sysUserId, Long sysGroupId) {
        if (sysGroupId == null || sysUserId == null) {
            throw new BusinessException(USER_NO_INFO);
        }

        Long sysGroupIdLv2 = contractDAO.getUserSysGroupLevel2(sysGroupId);
        int result = contractDAO.disableContract(id, sysUserId, sysGroupIdLv2);
        if (result < 1) {
            throw new BusinessException(SAVE_CONTRACT_ERROR);
        }
    }

    //VietNT_20190528_start
    public boolean canDeleteContract(Long contractId) {
        List<Long> statuses = contractDAO.getContractDetailStatus(contractId);
        return !statuses.contains(3L);
    }
    //VietNT_end

    public void submitEdit(AIOContractDTO contractDTO, Long sysUserId, Long sysGroupId) {
        if (contractDTO == null || contractDTO.getDetailDTOS() == null || contractDTO.getCustomerDTO() == null) {
            throw new BusinessException(EMPTY_REQUEST);
        }
        if (sysGroupId == null || sysUserId == null) {
            throw new BusinessException(USER_NO_INFO);
        }
        Long checkStatus = contractDAO.getContractStatus(contractDTO.getContractId());
        if (checkStatus == 3) {
            throw new BusinessException(AIOErrorType.CONTRACT_FINISHED.msg);
        }
        if (checkStatus == 4) {
            throw new BusinessException("Hợp đồng đã hết hiệu lực, không thể sửa");
        }

        // goi noi bo
        validateInternalContract(contractDTO, commonService);

        List<AIOContractDetailDTO> detailDTOS = contractDTO.getDetailDTOS();
        List<AIOContractDetailDTO> deleteDTOS = contractDTO.getDeleteDTOS();
        AIOCustomerDTO customerDTO = contractDTO.getCustomerDTO();

        // getUser sysgroup lv 2
        Long sysGroupIdLv2 = contractDAO.getUserSysGroupLevel2(sysGroupId);
        Date today = new Date();

        boolean isDeploy = (contractDTO.getLastPerformerId() != null && contractDTO.getPerformerId() != null
                && !contractDTO.getLastPerformerId().equals(contractDTO.getPerformerId()));
        if (isDeploy) {
            Long performerGroupLv2Id = contractDAO.getUserSysGroupLevel2ByUserId(contractDTO.getPerformerId());
            contractDTO.setPerformerGroupId(performerGroupLv2Id);
        }

        // set customer info
        contractDTO.setCustomerId(customerDTO.getCustomerId());
        contractDTO.setCustomerName(customerDTO.getName());
        contractDTO.setCustomerPhone(customerDTO.getPhone());
        contractDTO.setCustomerAddress(customerDTO.getAddress());
        contractDTO.setCustomerTaxCode(customerDTO.getTaxCode());

        // try insert customer
        if (customerDTO.getCode().equals(contractDTO.getCustomerCode())) {
            contractDAO.updateCustomerEdit(customerDTO);
        } else {
            contractDTO.setCustomerCode(customerDTO.getCode());
        }

        // set data contract
        contractDTO.setUpdatedDate(today);
        contractDTO.setUpdatedUser(sysUserId);
        contractDTO.setUpdatedGroupId(sysGroupIdLv2);

        // not passed completed detail => if detailList empty = contractComplete
        if (detailDTOS.isEmpty()) {
            contractDTO.setStatus(3L);
        }

        //VietNT_04/06/2019_start
//        if (contractDTO.getStatus() == 0) {
//            today = null;
//        }
        //VietNT_end
        List<String> packageNameList = new ArrayList<>();

        // delete details & records not complete
        this.deleteIncompleteDetailAndRecord(contractDTO.getContractId());

        // delete performing contract
        for (AIOContractDetailDTO detailDTO: deleteDTOS) {
            if (detailDTO.getStatus() != null && detailDTO.getStatus() == 2) {
                //VietNT_01/07/2019_start
                if (!contractDAO.isContractDetailStatusCorrect(detailDTO)) {
                    throw new BusinessException(AIOErrorType.DETAIL_MISMATCH.msg);
                }
                //VietNT_end
                this.deletePerforming(detailDTO);
            }
        }

        // insert new or update performing contract
        long contractStatus = 1L;
        for (AIOContractDetailDTO detailDTO: detailDTOS) {
            if (detailDTO.getStatus() != null && detailDTO.getStatus() == 2) {
                //VietNT_01/07/2019_start
                if (!contractDAO.isContractDetailStatusCorrect(detailDTO)) {
                    throw new BusinessException(AIOErrorType.DETAIL_MISMATCH.msg);
                }
                //VietNT_end
                contractStatus = 2L;
                // do update
                this.updatePerformingContractDetailAndRecord(contractDTO, detailDTO, isDeploy);
            } else {
                detailDTO.setContractDetailId(null);
                detailDTO.setAcceptanceRecordsId(null);

                if (detailDTO.getIsRepeat() != null && detailDTO.getIsRepeat() == 1) {
                    this.insertNewContractDetailRepeat(contractDTO, detailDTO, today);
                } else {
                    this.insertNewContractDetail(contractDTO, detailDTO, today);
                }
            }
        }

        if (isDeploy) {
            this.sendSms(contractDTO, sysUserId);
//            this.sendRedeploySms(contractDTO, sysUserId, packageNameList, today);
        }

        //VietNT_04/06/2019_start

        // determine status contract
        //  detailDTOS.isEmpty() => contract completed (3L),
        //  contractStatus == 2 => 1 detail doing => contract doing (2L)
        //  contractStatus == 1 => no detail doing => contract in wait (1L)
        contractStatus = detailDTOS.isEmpty() ? 3L : contractStatus;
        contractDTO.setStatus(contractStatus);

        // try update contract
        int idContract = contractDAO.updateContractEdit(contractDTO, isDeploy);
        if (idContract < 1) {
            throw new BusinessException(SAVE_CONTRACT_ERROR);
        }
        //VietNT_end
    }

    private void updatePerformingContractDetailAndRecord(AIOContractDTO contractDTO, AIOContractDetailDTO detailDTO, boolean isDeploy) {
        int result = contractDAO.updateContractDetail(detailDTO, isDeploy);
        if (result < 1) {
            throw new BusinessException(SAVE_CONTRACT_DETAIL_ERROR);
        }
        result = contractDAO.updateAcceptanceRecord(this.toAcceptanceRecordsDTO(contractDTO, detailDTO));
        if (result < 1) {
            throw new BusinessException(SAVE_RECORD_ERROR);
        }
    }

    private void deletePerforming(AIOContractDetailDTO detailDTO) {
        String table = "AIO_CONTRACT_DETAIL";
        String field = "CONTRACT_DETAIL_ID";
        contractDAO.deleteById(table, field, detailDTO.getContractDetailId());

        table = "AIO_ACCEPTANCE_RECORDS";
        field = "ACCEPTANCE_RECORDS_ID";
        contractDAO.deleteById(table, field, detailDTO.getAcceptanceRecordsId());
    }

    private void deleteIncompleteDetailAndRecord(Long contractId) {
        contractDAO.deleteIncompleteRecordByContractId(contractId); 
        contractDAO.deleteIncompleteDetailByContractId(contractId);
    }

    private void insertNewContractDetail(AIOContractDTO contractDTO, AIOContractDetailDTO detail, Date today) {
        detail.setContractId(contractDTO.getContractId());
        detail.setStatus(1L);
        detail.setIsBill(contractDTO.getIsBill());

        //VietNT_04/06/2019_start
//        if (today != null) {
        long hoursToMillis = (long) (detail.getTime() * TimeUnit.HOURS.toMillis(1));
        detail.setStartDate(today);
        detail.setEndDate(new Date(today.getTime() + hoursToMillis));
//        }
        //VietNT_end

        Long idDetail = contractDetailDAO.saveObject(detail.toModel());
        detail.setContractDetailId(idDetail);
        if (idDetail < 1) {
            throw new BusinessException(SAVE_CONTRACT_DETAIL_ERROR);
        }

        this.saveAcceptanceRecords(contractDTO, detail);
    }

    private void insertNewContractDetailRepeat(AIOContractDTO contractDTO, AIOContractDetailDTO detail, Date today) {
        Long idDetail;
        Long idRecord;

        detail.setContractId(contractDTO.getContractId());
        detail.setStatus(1L);
        detail.setIsBill(contractDTO.getIsBill());

        long timeAsMillis = (long) (detail.getTime() * TimeUnit.HOURS.toMillis(1));
        long intervalAsMillis = (long) (detail.getRepeatInterval() * TimeUnit.DAYS.toMillis(1));

        AIOAcceptanceRecordsDTO acceptanceRecordsDTO = this.toAcceptanceRecordsDTO(contractDTO, detail);

        for (int i = 0; i < detail.getRepeatNumber(); i++) {
            //VietNT_04/06/2019_start
//            if (today != null) {
            detail.setStartDate(new Date(today.getTime() + intervalAsMillis * i));
            detail.setEndDate(new Date(detail.getStartDate().getTime() + timeAsMillis));
//            }
            //VietNT_end
            if (i > 0) {
                detail.setAmount(0D);
            }

            idDetail = contractDetailDAO.saveObject(detail.toModel());
            detail.setContractDetailId(idDetail);
            if (idDetail < 1) {
                throw new BusinessException(SAVE_CONTRACT_DETAIL_ERROR);
            }

            acceptanceRecordsDTO.setContractDetailId(idDetail);
            idRecord = acceptanceRecordsDAO.saveObject(acceptanceRecordsDTO.toModel());
            if (idRecord < 1) {
                throw new BusinessException(SAVE_RECORD_ERROR);
            }
        }
    }
    //VietNT_end

    //VietNT_20190502_start
    public List<AIOAreaDTO> getListAreaForDropDown(AIOAreaDTO criteria) {
        return contractDAO.getListAreaForDropDown(criteria);
    }
    //VietNT_end
    
    //HuyPQ-20190508-start
    public DataListDTO reportInvestoryProvince(AIOMerEntityDTO obj) {
    	List<AIOMerEntityDTO> ls = aioMerEntityDAO.reportInvestoryProvince(obj);
    	DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(ls);
        dataListDTO.setTotal(obj.getTotalRecord());
        dataListDTO.setSize(obj.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }
    
    public String exportPDF(AIOMerEntityDTO criteria) throws Exception {
		criteria.setPage(null);
		criteria.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		String sourceFileName = null;
		List<AIOMerEntityDTO> ls = aioMerEntityDAO.reportInvestoryProvince(criteria);
		sourceFileName = filePath + "/Bao_cao_hang_ton_kho_tinh.jasper";
		if (!new File(sourceFileName).exists()) {
			return null;
		}
		String fileName = "Bao_cao_hang_ton_kho_tinh";
		JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(ls);

		String fileNameEncrypt = null;
		try {
			String jasperPrint = JasperFillManager.fillReportToFile(sourceFileName, null, beanColDataSource);
			if (jasperPrint != null) {
				String exportPath = UFile.getFilePath(folderUpload, defaultSubFolderUpload);

				String destFileName = exportPath + File.separatorChar + fileName + ".pdf";
				JasperExportManager.exportReportToPdfFile(jasperPrint, destFileName);

				fileNameEncrypt = UEncrypt.encryptFileUploadPath(
						exportPath.replace(folderUpload, "") + File.separatorChar + fileName + ".pdf");
				return fileNameEncrypt;
			}
		} catch (JRException e) {
			e.printStackTrace();
		}
		return null;
	}
    
    public DataListDTO reportInvestoryDetail(AIOMerEntityDTO obj) {
    	List<AIOMerEntityDTO> ls = aioMerEntityDAO.reportInvestoryDetail(obj);
    	DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(ls);
        dataListDTO.setTotal(obj.getTotalRecord());
        dataListDTO.setSize(obj.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }
    //Huy-end
    //VietNT_10/07/2019_start
    public DepartmentDTO getSysGroupById(Long id) {
        return commonService.getSysGroupById(id);
    }

    public void submitEditSeller(AIOContractDTO contractDTO, Long sysUserId, Long sysGroupId) {
        if (StringUtils.isEmpty(contractDTO.getSellerCode()) || StringUtils.isEmpty(contractDTO.getSellerName())
                || contractDTO.getContractId() == null || contractDTO.getSellerId() == null) {
//                || StringUtils.isEmpty(contractDTO.getSalesTogether())) {
            throw new BusinessException(EMPTY_REQUEST);
        }
        if (sysGroupId == null || sysUserId == null) {
            throw new BusinessException(USER_NO_INFO);
        }
        if (contractDAO.isContractFinished(contractDTO.getContractId())) {
            throw new BusinessException(AIOErrorType.CONTRACT_FINISHED.msg);
        }
        Long count = contractDAO.countContractDetailWithStatuses(contractDTO.getContractId(), Collections.singletonList(3L));
        if (count != null && count > 0) {
            throw new BusinessException(AIOErrorType.CONTRACT_HAS_DETAIL_COMPLETE.msg);
        }

        Long sysGroupLv2 = contractDAO.getUserSysGroupLevel2(sysGroupId);
        int result = contractDAO.updateContractSeller(contractDTO, sysUserId, sysGroupLv2);
        if (result < 1) {
            throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + AIOObjectType.CONTRACT.getName());
        }
    }
    //VietNT_end
    //VietNT_22/07/2019_start
    @SuppressWarnings("Duplicates")
    public void saveAttachment(List<UtilAttachDocumentDTO> filesAttach, Long contractId, Long sysUserId) {
        for (UtilAttachDocumentDTO fileAttach : filesAttach) {
            Long idResult;
            try {
                InputStream inputStream = ImageUtil.convertBase64ToInputStream(fileAttach.getBase64String());
                String filePath = UFile.writeToFileServerATTT2(inputStream, fileAttach.getName(),
                        inputSubFolderUpload, folderUpload);
                fileAttach.setFilePath(filePath);
                fileAttach.setObjectId(contractId);
                fileAttach.setType(AIOAttachmentType.CONTRACT_ATTACHMENT.code);
                fileAttach.setDescription("Bản scan hợp đồng để phê duyệt");
                fileAttach.setStatus("1");
                fileAttach.setCreatedDate(new Date());
                fileAttach.setCreatedUserId(sysUserId);
                fileAttach.setCreatedUserName(null);

                idResult = utilAttachDocumentDAO.saveObject(fileAttach.toModel());
            } catch (Exception e) {
                e.printStackTrace();
                continue;
            }

            commonService.validateIdCreated(idResult, AIOObjectType.ATTACH_IMAGE.getName());
        }
    }
    //VietNT_end
    //VietNT_24/07/2019_start
    // check can create contract
    public boolean userHasContractUnpaidVTPost(Long sysUserId) {
        return contractDAO.userHasContractUnpaidVTPost(sysUserId);
    }

    public static void setDataForPayType(AIOContractDTO dto) {
        // ko co vtpay
        if (dto.getPayType() != null) {
            if (dto.getPayType() == 1) {
                dto.setNumberPay(1L);
                dto.setApprovedPay(1L);
                dto.setListFile(new ArrayList<>());
            } else {
                dto.setApprovedPay(0L);
                if (dto.getListFile() == null || dto.getListFile().isEmpty()) {
                    dto.setListFile(new ArrayList<>());
                }
            }
        } else {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": Phương thức thanh toán");
        }
    }

    public static void setDataForThuHo(AIOContractDTO dto, Date date) {
        if (dto.getThuHo() != null && dto.getThuHo() >= 0) {
            // mac dinh
            dto.setPayType(1L);
            dto.setNumberPay(1L);

            // thu ho == 0
            if (dto.getThuHo() == 0) {
                dto.setIsPay(1L);
                dto.setAmountPay(0D);
                dto.setPayDate(date);
            }
        } else {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": Thu hộ");
        }
    }
    //VietNT_end

    private void savePerformDateContract(Long contractId) {
        AIOContractPerformDateDTO dto = new AIOContractPerformDateDTO();
        dto.setContractId(contractId);
        dto.setStartDate(new Date());

        aioContractPerformDateDAO.saveObject(dto.toModel());
    }

    public void approvedPauseContract(AIOContractPauseDTO pauseDTO, SysUserCOMSDTO user) {
        if (pauseDTO == null || pauseDTO.getContractId() == null ||
                pauseDTO.getContractPauseId() == null || pauseDTO.getStatus() == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }

        int result = aioContractPauseDAO.updateStatus(pauseDTO.getContractPauseId(), pauseDTO.getStatus(), user.getSysUserId());
        commonService.validateIdCreated(result, "Cập nhật trạng thái thất bại");

        if (pauseDTO.getStatus().equals(AIOContractPauseDTO.STATUS_APPROVED)) {
            this.updatePerformDate(pauseDTO);
        }

        Long sysGroupLv2 = commonService.getSysGroupLevelByUserId(user.getSysUserId(), 2);
        result = contractDAO.updateContractStatus(pauseDTO.getContractId(), AIOContractDTO.STATUS_DOING, user.getSysUserId(), sysGroupLv2);
        commonService.validateIdCreated(result, "Cập nhật trạng thái HĐ thất bại");
    }

    private void updatePerformDate(AIOContractPauseDTO pauseDTO) {
        List<AIOContractPerformDateDTO> dtos = aioContractPerformDateDAO.getListByContractId(pauseDTO.getContractId());
        if (dtos == null || dtos.isEmpty()) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + " thông tin thực hiện hợp đồng");
        }
        int result;
        if (dtos.size() > 1) {
            for (AIOContractPerformDateDTO dto : dtos) {
                if (dto.getEndDate() == null) {
                    result = aioContractPerformDateDAO.updateStartDate(dto.getContractPerformDateId(), pauseDTO.getAppointmentDate());
                    commonService.validateIdCreated(result, "Cập nhật thông tin thực hiện HĐ thất bại!");
                    break;
                }
            }
        } else {
            result = aioContractPerformDateDAO.updateEndDate(dtos.get(0).getContractPerformDateId(), pauseDTO.getCreatedDate());
            commonService.validateIdCreated(result, "Cập nhật thông tin dừng HĐ thất bại!");

            AIOContractPerformDateDTO dto = new AIOContractPerformDateDTO();
            dto.setContractId(dtos.get(0).getContractId());
            dto.setStartDate(pauseDTO.getAppointmentDate());
            Long idPerformDate = aioContractPerformDateDAO.saveObject(dto.toModel());
            commonService.validateIdCreated(idPerformDate, AIOErrorType.SAVE_ERROR.msg + ": thông tin thực hiện HĐ");
        }
    }

    public void updateReasonOutOfDate(AIOContractDTO contractDTO, SysUserCOMSDTO user) {
         if (contractDTO == null || contractDTO.getContractId() == null || StringUtils.isEmpty(contractDTO.getReasonOutOfDate())) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }

        Long sysGroupLv2 = commonService.getSysGroupLevelByUserId(user.getSysUserId(), 2);
        int result = contractDAO.updateReasonOutOfDate(contractDTO.getContractId(), contractDTO.getReasonOutOfDate(), user.getSysUserId(), sysGroupLv2);
        commonService.validateIdCreated(result, "Cập nhật lý do quá hạn thất bại");
    }

    public void approveCancel(AIOContractDTO contractDTO, SysUserCOMSDTO user) {
        if (contractDTO == null || contractDTO.getContractId() == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }

        Long status = contractDAO.getContractStatus(contractDTO.getContractId());
        if (status == null || !status.equals(AIOContractDTO.STATUS_PROPOSE_CANCEL)) {
            throw new BusinessException(AIOErrorType.WRONG_STATUS.msg);
        }

        int result;
        Long sysGroupLv2 = commonService.getSysGroupLevelByUserId(user.getSysUserId(), 2);
        if (contractDTO.getStatus().equals(AIOContractDTO.STATUS_CANCEL)) {
            result = contractDAO.updateContractStatus(contractDTO.getContractId(), AIOContractDTO.STATUS_CANCEL, user.getSysUserId(), sysGroupLv2);
        } else if (contractDTO.getStatus().equals(AIOContractDTO.STATUS_DOING)) {
            result = contractDAO.updateContractStatus(contractDTO.getContractId(), AIOContractDTO.STATUS_DOING, user.getSysUserId(), sysGroupLv2);
        } else {
            throw new BusinessException(AIOErrorType.WRONG_STATUS.msg);
        }

        commonService.validateIdCreated(result, "Phê duyệt hủy thất bại");
    }

    public void submitEditMobile(AIOContractDTO contractDTO, Long sysUserId, Long sysGroupId) {
        if (contractDTO == null || contractDTO.getDetailDTOS() == null || contractDTO.getCustomerDTO() == null) {
            throw new BusinessException(EMPTY_REQUEST);
        }
        if (sysGroupId == null || sysUserId == null) {
            throw new BusinessException(USER_NO_INFO);
        }
        Long checkStatus = contractDAO.getContractStatus(contractDTO.getContractId());
        if (checkStatus == 3) {
            throw new BusinessException(AIOErrorType.CONTRACT_FINISHED.msg);
        }
        if (checkStatus == 4) {
            throw new BusinessException("Hợp đồng đã hết hiệu lực, không thể sửa");
        }

        List<AIOContractDetailDTO> detailDTOS = contractDTO.getDetailDTOS();
        List<AIOContractDetailDTO> deleteDTOS = contractDTO.getDeleteDTOS();
        AIOCustomerDTO customerDTO = contractDTO.getCustomerDTO();

        // getUser sysgroup lv 2
        Long sysGroupIdLv2 = contractDAO.getUserSysGroupLevel2(sysGroupId);
        Date today = new Date();

        boolean isDeploy = (contractDTO.getLastPerformerId() != null && contractDTO.getPerformerId() != null
                && !contractDTO.getLastPerformerId().equals(contractDTO.getPerformerId()));
        if (isDeploy) {
            Long performerGroupLv2Id = contractDAO.getUserSysGroupLevel2ByUserId(contractDTO.getPerformerId());
            contractDTO.setPerformerGroupId(performerGroupLv2Id);
        }

        // set customer info
        contractDTO.setCustomerId(customerDTO.getCustomerId());
        contractDTO.setCustomerName(customerDTO.getName());
        contractDTO.setCustomerPhone(customerDTO.getPhone());
        contractDTO.setCustomerAddress(customerDTO.getAddress());
        contractDTO.setCustomerTaxCode(customerDTO.getTaxCode());

        // try insert customer
        if (customerDTO.getCode().equals(contractDTO.getCustomerCode())) {
            contractDAO.updateCustomerEditMobile(customerDTO);
        } else {
            contractDTO.setCustomerCode(customerDTO.getCode());
        }

        // set data contract
        contractDTO.setUpdatedDate(today);
        contractDTO.setUpdatedUser(sysUserId);
        contractDTO.setUpdatedGroupId(sysGroupIdLv2);

        // not passed completed detail => if detailList empty = contractComplete
        if (detailDTOS.isEmpty()) {
            contractDTO.setStatus(3L);
        }

        //VietNT_04/06/2019_start
//        if (contractDTO.getStatus() == 0) {
//            today = null;
//        }
        //VietNT_end
        List<String> packageNameList = new ArrayList<>();

        // delete details & records not complete
        this.deleteIncompleteDetailAndRecord(contractDTO.getContractId());

        // delete performing contract
        for (AIOContractDetailDTO detailDTO: deleteDTOS) {
            if (detailDTO.getStatus() != null && detailDTO.getStatus() == 2) {
                //VietNT_01/07/2019_start
                if (!contractDAO.isContractDetailStatusCorrect(detailDTO)) {
                    throw new BusinessException(AIOErrorType.DETAIL_MISMATCH.msg);
                }
                //VietNT_end
                this.deletePerforming(detailDTO);
            }
        }

        // insert new or update performing contract
        long contractStatus = 1L;
        for (AIOContractDetailDTO detailDTO: detailDTOS) {
            // set data package
            this.setDetailPackageData(detailDTO);

            if (detailDTO.getStatus() != null && detailDTO.getStatus() == 2) {
                //VietNT_01/07/2019_start
                if (!contractDAO.isContractDetailStatusCorrect(detailDTO)) {
                    throw new BusinessException(AIOErrorType.DETAIL_MISMATCH.msg);
                }
                //VietNT_end
                contractStatus = 2L;
                // do update
                this.updatePerformingContractDetailAndRecord(contractDTO, detailDTO, isDeploy);
            } else {
                detailDTO.setContractDetailId(null);
                detailDTO.setAcceptanceRecordsId(null);

                if (detailDTO.getIsRepeat() != null && detailDTO.getIsRepeat() == 1) {
                    this.insertNewContractDetailRepeat(contractDTO, detailDTO, today);
                } else {
                    this.insertNewContractDetail(contractDTO, detailDTO, today);
                }
            }
        }


        if (isDeploy) {
            this.sendSms(contractDTO, sysUserId);
//            this.sendRedeploySms(contractDTO, sysUserId, packageNameList, today);
        }

        //VietNT_04/06/2019_start

        // determine status contract
        //  detailDTOS.isEmpty() => contract completed (3L),
        //  contractStatus == 2 => 1 detail doing => contract doing (2L)
        //  contractStatus == 1 => no detail doing => contract in wait (1L)
        contractStatus = detailDTOS.isEmpty() ? 3L : contractStatus;
        contractDTO.setStatus(contractStatus);

        // try update contract
        int idContract = contractDAO.updateContractEdit(contractDTO, isDeploy);
        if (idContract < 1) {
            throw new BusinessException(SAVE_CONTRACT_ERROR);
        }
        //VietNT_end
    }

    private void setDetailPackageData(AIOContractDetailDTO detailDTO) {
        AIOPackageDetailDTO dataPackage = aioPackageDetailDAO.getById(detailDTO.getPackageDetailId());
        if (dataPackage == null) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + " thông tin gói!");
        }

//        detailDTO.setContractDetailId(dataPackage.getContractDetailId());
//        detailDTO.setContractId(dataPackage.getContractId());
        detailDTO.setWorkName(dataPackage.getWorkName());
//        detailDTO.setPackageId(dataPackage.getAioPackageId());
        detailDTO.setPackageName(dataPackage.getPackageName());
//        detailDTO.setPackageDetailId(dataPackage.getAioPackageDetailId());
        detailDTO.setEngineCapacityId(dataPackage.getEngineCapacityId());
        detailDTO.setEngineCapacityName(dataPackage.getEngineCapacityName());
        detailDTO.setGoodsId(dataPackage.getGoodsId());
        detailDTO.setGoodsName(dataPackage.getGoodsName());
//        detailDTO.setQuantity(dataPackage.getQuantity());
//        detailDTO.setAmount(dataPackage.getAmount());
//        detailDTO.setStartDate(dataPackage.getStartDate());
//        detailDTO.setEndDate(dataPackage.getEndDate());
//        detailDTO.setStatus(dataPackage.getStatus());
//        detailDTO.setIsBill(dataPackage.getIsBill());
//        detailDTO.setCustomerName(dataPackage.getCustomerName());
//        detailDTO.setCustomerAddress(dataPackage.getCustomerAddress());
//        detailDTO.setTaxCode(dataPackage.getTaxCode());
        detailDTO.setTime(dataPackage.getTime());
        detailDTO.setIsRepeat(dataPackage.getIsRepeat());
        detailDTO.setRepeatNumber(dataPackage.getRepeatNumber());
        detailDTO.setRepeatInterval(dataPackage.getRepeatInterval() != null ? dataPackage.getRepeatInterval().doubleValue() : 0);
        detailDTO.setIsProvinceBought(dataPackage.getIsProvinceBought());
        detailDTO.setSaleChannel(dataPackage.getSaleChannel());
    }

    public Long getUserGroupLv2(Long sysUserId) {
        if (sysGroupCache == null) {
            sysGroupCache = new ConcurrentHashMap<>();
        }
        Long sysGroupLv2 = cacheManager.getDomainDataCache(sysUserId, sysGroupCache);
        if (sysGroupLv2 == null) {
            sysGroupLv2 = commonService.getSysGroupLevelByUserId(sysUserId, 2);
            cacheManager.saveDomainDataCache(sysUserId, sysGroupLv2, sysGroupCache);
        }
        return sysGroupLv2;
    }

    public List<AIOSysUserDTO> getListUserAC(AIOSysUserDTO criteria, Long sysUserId) {
        Long sysGroupLv2 = this.getUserGroupLv2(sysUserId);
        return contractDAO.getListUserAC(criteria, sysGroupLv2);
    }

    static void validateInternalContract(AIOContractDTO dto, CommonServiceAio commonService) {
        if (dto.getIsInternal() != null) {
            if (StringUtils.isEmpty(dto.getStaffCode())) {
                throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " Mã NV nội bộ");
            }
            SysUserCOMSDTO condition = new SysUserCOMSDTO();
            condition.setEmployeeCode(dto.getStaffCode());
            condition = commonService.getUserByCodeOrId(condition);
            if (condition == null) {
                throw new BusinessException(AIOErrorType.NOT_FOUND.msg + " Mã NV nội bộ");
            }
        }
    }

    private List<AIOPackageGoodsDTO> validateStockGoodsBeforeCreate(Long packageDetailId, Long packageQuantity, Long provinceGroupId) {
        return validateStockGoodsBeforeCreate(packageDetailId, packageQuantity, provinceGroupId, contractDAO);
    }

    static List<AIOPackageGoodsDTO> validateStockGoodsBeforeCreate(Long packageDetailId, Long packageQuantity, Long provinceGroupId, AIOContractDAO contractDAO) {
        List<AIOPackageGoodsDTO> listQttUsed = contractDAO.getPackageGoodsQuantityUsed(packageDetailId, packageQuantity.doubleValue());
        // ko co hang => tra ve list rong
        if (listQttUsed.isEmpty()) {
            return listQttUsed;
        }

        // lay goodsId query so luong ton kho, ko co ton kho => tra ve list yeu cau
        List<Long> goodsIds = listQttUsed.stream().map(AIOPackageGoodsDTO::getGoodsId).collect(Collectors.toList());
        List<AIOPackageGoodsDTO> listStockQuantity = contractDAO.getStockQuantityOfProvinceGroup(provinceGroupId, goodsIds);
        if (listStockQuantity.isEmpty()) {
            return listQttUsed;
        }

        // check qtt yc va qtt stock => tra ve list voi qtt yc > qtt stock
        List<AIOPackageGoodsDTO> notEnoughQtt = new ArrayList<>();
        for (AIOPackageGoodsDTO qttUsed : listQttUsed) {
            for (AIOPackageGoodsDTO stockQtt : listStockQuantity) {
                if (qttUsed.getGoodsId().equals(stockQtt.getGoodsId())) {
                    if (qttUsed.getQuantity() > stockQtt.getQuantity()) {
                        double qttOrder = qttUsed.getQuantity();
                        qttUsed.setQuantity(stockQtt.getQuantity() <= 0
                                ? qttUsed.getQuantity()
                                : qttUsed.getQuantity() - stockQtt.getQuantity());
                        qttUsed.setQttOrder(qttOrder);
                        qttUsed.setQttRemain(stockQtt.getQuantity());
                        notEnoughQtt.add(qttUsed);
                    }
                    break;
                }
            }
        }

        return notEnoughQtt;
    }
}
