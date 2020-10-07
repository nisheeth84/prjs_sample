package com.viettel.aio.business;

import com.viettel.aio.bo.AIOContractBO;
import com.viettel.aio.bo.StockTransDetailBO;
import com.viettel.aio.config.AIOAttachmentType;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.config.AIOSaleChannel;
import com.viettel.aio.config.CacheUtils;
import com.viettel.aio.dao.AIOAcceptanceRecordsDAO;
import com.viettel.aio.dao.AIOContractDAO;
import com.viettel.aio.dao.AIOContractDetailDAO;
import com.viettel.aio.dao.AIOContractPauseDAO;
import com.viettel.aio.dao.AIOContractPerformDateDAO;
import com.viettel.aio.dao.AIOContractServiceMobileDAO;
import com.viettel.aio.dao.AIOCustomerDAO;
import com.viettel.aio.dao.AIOMerEntityDAO;
import com.viettel.aio.dao.AIOPackagePromotionDAO;
import com.viettel.aio.dao.AIOStockTransDetailDAO;
import com.viettel.aio.dao.AIOStockTransDetailSerialDAO;
import com.viettel.aio.dao.AIOSynStockTransDAO;
import com.viettel.aio.dao.SendSmsEmailDAO;
import com.viettel.aio.dto.AIOAcceptanceRecordsDTO;
import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOContractDetailDTO;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOContractMobileResponse;
import com.viettel.aio.dto.AIOContractPauseDTO;
import com.viettel.aio.dto.AIOContractPerformDateDTO;
import com.viettel.aio.dto.AIOCustomerDTO;
import com.viettel.aio.dto.AIOMerEntityDTO;
import com.viettel.aio.dto.AIOPackageDetailDTO;
import com.viettel.aio.dto.AIOPackageGoodsDTO;
import com.viettel.aio.dto.AIOPackagePromotionDTO;
import com.viettel.aio.dto.AIOStockTransDetailSerialDTO;
import com.viettel.aio.dto.AIOSynStockTransDTO;
import com.viettel.aio.dto.AIOSynStockTransDetailDTO;
import com.viettel.aio.dto.ConstructionImageInfo;
import com.viettel.aio.dto.SendSmsEmailDTO;
import com.viettel.aio.dto.SysUserRequest;
import com.viettel.asset.dto.SysGroupDto;
import com.viettel.cat.dto.CatProvinceDTO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.utils.ImageUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;


/**
 * @author HOANM1
 * @version 1.0
 * @since 2019-03-10
 */
@Service("aioContractServiceMobileBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOContractServiceMobileBusinessImpl extends BaseFWBusinessImpl<AIOContractServiceMobileDAO, AIOContractDTO, AIOContractBO>
        implements AIOSynStockTransBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIOContractServiceMobileBusinessImpl.class);

    private static final String SYN_STOCK_TRAIN = "A";

    @Autowired
    public AIOContractServiceMobileBusinessImpl(AIOContractServiceMobileDAO aioContractDAO, AIOContractDAO contractDAO,
                                                AIOContractDetailDAO contractDetailDAO, AIOCustomerDAO aioCustomerDAO,
                                                AIOAcceptanceRecordsDAO aioAcceptanceRecordsDAO,
                                                SendSmsEmailDAO sendSmsEmailDAO, UtilAttachDocumentDAO utilAttachDocumentDAO,
                                                AIOContractPauseDAO aioContractPauseDAO, CommonServiceAio commonService,
                                                AIOContractPerformDateDAO aioContractPerformDateDAO,
                                                AIOPackagePromotionDAO aioPackagePromotionDAO,
                                                AIOSynStockTransDAO aioSynStockTransDAO, AIOMerEntityDAO aioMerEntityDAO,
                                                AIOStockTransDetailDAO aioStockTransDetailDAO,
                                                AIOStockTransDetailSerialDAO aioStockTransDetailSerialDAO,
                                                CacheUtils cacheUtils) {
        tModel = new AIOContractBO();
        tDAO = aioContractDAO;
        this.aioContractDAO = aioContractDAO;
        this.contractDAO = contractDAO;
        this.contractDetailDAO = contractDetailDAO;
        this.aioCustomerDAO = aioCustomerDAO;
        this.aioAcceptanceRecordsDAO = aioAcceptanceRecordsDAO;
        this.sendSmsEmailDAO = sendSmsEmailDAO;
        this.utilAttachDocumentDAO = utilAttachDocumentDAO;
        this.aioContractPauseDAO = aioContractPauseDAO;
        this.commonService = commonService;
        this.aioContractPerformDateDAO = aioContractPerformDateDAO;
        this.aioPackagePromotionDAO = aioPackagePromotionDAO;
        this.aioSynStockTransDAO = aioSynStockTransDAO;
        this.aioStockTransDetailDAO = aioStockTransDetailDAO;
        this.aioMerEntityDAO = aioMerEntityDAO;
        this.aioStockTransDetailSerialDAO = aioStockTransDetailSerialDAO;
        this.cacheUtils = cacheUtils;
    }

    private AIOContractServiceMobileDAO aioContractDAO;
    private AIOContractDAO contractDAO;
    private AIOContractDetailDAO contractDetailDAO;
    private AIOCustomerDAO aioCustomerDAO;
    private AIOAcceptanceRecordsDAO aioAcceptanceRecordsDAO;
    private SendSmsEmailDAO sendSmsEmailDAO;
    private UtilAttachDocumentDAO utilAttachDocumentDAO;
    private AIOContractPauseDAO aioContractPauseDAO;
    private CommonServiceAio commonService;
    private AIOContractPerformDateDAO aioContractPerformDateDAO;
    private AIOPackagePromotionDAO aioPackagePromotionDAO;
    private AIOSynStockTransDAO aioSynStockTransDAO;
    private AIOStockTransDetailDAO aioStockTransDetailDAO;
    private AIOMerEntityDAO aioMerEntityDAO;
    private AIOStockTransDetailSerialDAO aioStockTransDetailSerialDAO;
    private CacheUtils cacheUtils;

    //VietNT_20190125_start
    private final String REJECT_NOTE_PERMISSION = "REJECT NOTE";

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${input_sub_folder_upload}")
    private String inputSubFolderUpload;
    //VietNT_end

    @Value("${folder_upload2}")
    private String folder2Upload;

    @Value("${input_image_sub_folder_upload}")
    private String input_image_sub_folder_upload;

    @Override
    public AIOContractServiceMobileDAO gettDAO() {
        return aioContractDAO;
    }

    @Override
    public long count() {
        return aioContractDAO.count("AIOContractBO", null);
    }

    private final static int SUB_ACTION_TYPE_NONE = 0;
    private final static int SUB_ACTION_TYPE_EXPIRED = 1;
    private final static int SUB_ACTION_TYPE_PAUSE = 2;
    private final static int SUB_ACTION_TYPE_CANCEL = 3;
    private HashMap<String, AIOMerEntityDTO> mapGuarantee = new HashMap<>();

    ////    aio_20190315_start
    public AIOContractDTO countContractService(SysUserRequest request) {
        return aioContractDAO.countContractService(request);
    }

    public List<AIOContractDTO> getListContractServiceTask(SysUserRequest request) {
        return aioContractDAO.getListContractServiceTask(request);
    }

    public List<AIOContractDTO> getListContractServiceTaskDetail(AIOContractMobileRequest request) {
        List<AIOContractDTO> contractInfos = aioContractDAO.getListContractServiceTaskDetail(request);
        if (contractInfos == null || contractInfos.isEmpty()) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.CONTRACT.getName());
        }
        AIOContractDTO contractInfo = contractInfos.get(0);
        List<AIOPackagePromotionDTO> promos = aioPackagePromotionDAO.getListPromotions(contractInfo.getPackageDetailId());
        contractInfo.setPromotionDTOS(promos);
        return contractInfos;
    }

    public List<AIOContractDTO> getListPackageGood(AIOContractMobileRequest request) {
        return aioContractDAO.getListPackageGood(request);
    }

    public List<AIOContractDTO> getListPackageGoodAdd(AIOContractMobileRequest request) {
        return aioContractDAO.getListPackageGoodAdd(request);
    }

    public List<AIOContractDTO> getListPackageGoodAddFull(AIOContractMobileRequest request) {
        return aioContractDAO.getListPackageGoodAddFull(request);
    }

    public List<AIOContractDTO> getListGoodPriceOther(AIOContractMobileRequest request) {
        return aioContractDAO.getListGoodPriceOther(request);
    }

    public List<AIOContractDTO> getListGoodPriceOtherFull(AIOContractMobileRequest request) {
        return aioContractDAO.getListGoodPriceOtherFull(request);
    }

    public List<AIOContractDTO> getListGoodUsed(AIOContractMobileRequest request) {
        return aioContractDAO.getListGoodUsed(request);
    }

    public List<AIOContractDTO> getListGoodUsedAdd(AIOContractMobileRequest request) {
        return aioContractDAO.getListGoodUsedAdd(request);
    }

    public Long startContract(AIOContractMobileRequest dto) {
        return aioContractDAO.startContract(dto);
    }

    public void updateContractHold(AIOContractMobileRequest dto) {
        if (dto.getAioContractDTO() == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        AIOContractDTO updateContract = dto.getAioContractDTO();
        List<Long> detailsStatus = contractDAO.getContractDetailStatus(updateContract.getContractId());

        switch (dto.getAioContractDTO().getSubAction()) {
            case SUB_ACTION_TYPE_EXPIRED:
                if (StringUtils.isEmpty(updateContract.getReasonOutOfDate())) {
                    throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": lý do quá hạn");
                }
                break;
            case SUB_ACTION_TYPE_PAUSE:
                // check detail status done
                if (detailsStatus.contains(AIOContractDTO.STATUS_DONE)) {
                    throw new BusinessException(AIOErrorType.CONTRACT_HAS_DETAIL_COMPLETE.msg);
                }
                // save pause
                AIOContractPauseDTO pauseDTO = updateContract.getContractPauseDTO();
                if (pauseDTO == null) {
                    throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": Tạm dừng");
                }
                pauseDTO.setContractId(updateContract.getContractId());
                pauseDTO.setCreatedDate(new Date());
                pauseDTO.setCreatedUser(dto.getSysUserRequest().getSysUserId());
                pauseDTO.setStatus(AIOContractPauseDTO.STATUS_PENDING);
                aioContractPauseDAO.saveObject(pauseDTO.toModel());

                updateContract.setStatus(AIOContractDTO.STATUS_PROPOSE_PAUSE);
                break;
            case SUB_ACTION_TYPE_CANCEL:
                // check detail status done
                if (detailsStatus.contains(AIOContractDTO.STATUS_DONE)) {
                    throw new BusinessException(AIOErrorType.CONTRACT_HAS_DETAIL_COMPLETE.msg);
                }
                updateContract.setStatus(AIOContractDTO.STATUS_PROPOSE_CANCEL);
                break;
            case SUB_ACTION_TYPE_NONE:
            default:
                throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }

        aioContractDAO.updateContractHold(updateContract);
    }

    public Long endContract(AIOContractMobileRequest dto) {
//    	//VietNT_01/07/2019_start
//		if (contractDAO.checkContractStatus(dto.getAioContractDTO().getContractId(), 4L)) {
//			return -5L;
//		}
//    	//VietNT_end
//		//VietNT_18/06/2019_start
//		if (contractDAO.userHasContractUnpaid(dto.getSysUserRequest().getSysUserId(), dto.getAioContractDTO().getContractId())) {
//			return -3L;
//		}
//    	if (!contractDAO.isContractDetailCorrect(dto)) {
//			return -4L;
//		}
//		//VietNT_end
        //VietNT_29/07/2019_start
        AIOContractDTO contractDTO = dto.getAioContractDTO();
        AIOContractDTO info = contractDAO.getContractInfoEndContract(contractDTO.getContractId(), contractDTO.getContractDetailId());
        this.validateEndContract(contractDTO, info, dto.getSysUserRequest().getSysUserId());

        // set industry scale for validate
        dto.setIndustryScale(info.getIndustryScale());

        if (info.getSaleChannel().equals(AIOSaleChannel.VCC.code)) {
//            this.handlingPayTypeEndContract(info.getPayType(), contractDTO.getPayType(), info.getApprovedPay(), info.getContractId());
            this.handlingPayTypeEndContract(info, contractDTO, dto.getSysUserRequest().getSysUserId());
        }
        //VietNT_end
        if (dto.getLstImage() != null) {
            List<AIOContractDTO> lstPakageImages = saveConstructionImages(dto.getLstImage());

            aioContractDAO.saveImagePathsDao(lstPakageImages,
                    dto.getAioContractDTO().getContractDetailId(), dto.getSysUserRequest());
        }
        return this.finishContractByPayType(dto, info);
    }

    public Long updateLocationUser(AIOContractMobileRequest dto) {
        return aioContractDAO.updateLocationUser(dto);
    }

    public List<ConstructionImageInfo> getImagesByPackageDetailId(AIOContractMobileRequest request) {
        List<ConstructionImageInfo> listImageResponse = new ArrayList<>();
        List<ConstructionImageInfo> listImage = aioContractDAO.getImagesByPackageDetailId(request.getAioContractDTO().getContractDetailId());
        listImageResponse = getPackageDetailImages(listImage);
        return listImageResponse;
    }

    public List<ConstructionImageInfo> getPackageDetailImages(List<ConstructionImageInfo> lstImages) {
        List<ConstructionImageInfo> result = new ArrayList<>();
        for (ConstructionImageInfo packageImage : lstImages) {
            try {
                String fullPath = folder2Upload + File.separator + packageImage.getImagePath();
                String base64Image = ImageUtil.convertImageToBase64(fullPath);
                ConstructionImageInfo obj = new ConstructionImageInfo();
                obj.setImageName(packageImage.getImageName());
                obj.setBase64String(base64Image);
                obj.setImagePath(fullPath);
                obj.setStatus(1L);
                obj.setUtilAttachDocumentId(packageImage.getUtilAttachDocumentId());
                result.add(obj);
            } catch (Exception e) {
                continue;
            }
        }

        return result;
    }

    public List<AIOContractDTO> saveConstructionImages(List<AIOContractDTO> lstImages) {
        List<AIOContractDTO> result = new ArrayList<>();
        for (AIOContractDTO pakageDetailMage : lstImages) {
            if (pakageDetailMage.getStatus() == 0) {
                AIOContractDTO obj = new AIOContractDTO();
                obj.setImageName(pakageDetailMage.getImageName());
                obj.setLatitude(pakageDetailMage.getLatitude());
                obj.setLongtitude(pakageDetailMage.getLongtitude());
                InputStream inputStream = ImageUtil.convertBase64ToInputStream(pakageDetailMage.getBase64String());
                try {
                    String imagePath = UFile.writeToFileServerATTT2(inputStream, pakageDetailMage.getImageName(),
                            input_image_sub_folder_upload, folder2Upload);
                    obj.setImagePath(imagePath);
                } catch (Exception e) {
                    continue;
                }
                result.add(obj);
            }
            if (pakageDetailMage.getStatus() == -1 && pakageDetailMage.getImagePath() != "") {
                aioContractDAO.updateUtilAttachDocumentById(pakageDetailMage.getUtilAttachDocumentId());
            }
        }

        return result;
    }

    public List<AIOContractDTO> getAppAIOVersion() {
        return aioContractDAO.getAppAIOVersion();
    }
//    aio_20190315_end

    //HuyPq-20190503-start
//	public List<AIOConfigServiceDTO> getCodeAioConfigService(){
//		return aioContractDAO.getCodeAioConfigService();
//	}
    //VietNT_26/07/2019_start
    public AIOContractMobileResponse getCodeAioConfigService(AIOContractMobileRequest rq) {
        List<AIOConfigServiceDTO> data = aioContractDAO.getCodeAioConfigService();
        SysGroupDto sys = this.getInfoUser(rq.getSysUserId());
        boolean canCreateContract = !contractDAO.userHasContractUnpaidVTPost(rq.getSysUserId());

        AIOContractMobileResponse res = new AIOContractMobileResponse();
        res.setAioConfigServiceMobileDTO(data);
        res.setSysGroupDto(sys);
        res.setCanCreateContract(canCreateContract);

        return res;
    }
    //VietNT_end

    public List<AppParamDTO> getSpeciesAppParam() {
        return aioContractDAO.getSpeciesAppParam();
    }

    public List<AppParamDTO> getAreaAppParam() {
        return aioContractDAO.getAreaAppParam();
    }

    public List<CatProvinceDTO> getListProvinceByAreaCode(CatProvinceDTO obj) {
        return aioContractDAO.getListProvinceByAreaCode(obj.getCode());
    }

    public List<AIOAreaDTO> getDataProvinceCity() {
        return aioContractDAO.getDataProvinceCity();
    }

    public List<AIOAreaDTO> getDataDistrict(AIOAreaDTO obj) {
        return aioContractDAO.getDataDistrict(obj.getParentId());
    }

    public List<AIOAreaDTO> getDataWard(AIOAreaDTO obj) {
        return aioContractDAO.getDataWard(obj.getParentId());
    }

    public List<AIOPackageDetailDTO> getDataPackageDetail(AIOAreaDTO obj) {
        List<AIOPackageDetailDTO> packageDetails = aioContractDAO.getDataPackageDetail(obj);
        if (!packageDetails.isEmpty()) {
            List<Long> detailIds = new ArrayList<>();
            HashMap<Long, List<AIOPackagePromotionDTO>> promoMap = new HashMap<>();
            packageDetails.forEach(d -> {
                detailIds.add(d.getAioPackageDetailId());
                promoMap.put(d.getAioPackageDetailId(), new ArrayList<>());
            });

            AIOPackagePromotionDTO criteria = new AIOPackagePromotionDTO();
            criteria.setIdList(detailIds);
            List<AIOPackagePromotionDTO> promos = aioPackagePromotionDAO.getListPromotions(criteria);
            promos.forEach(promo -> promoMap.get(promo.getPackageDetailId()).add(promo));

            packageDetails.forEach(pd -> pd.setPromotionDTOS(promoMap.get(pd.getAioPackageDetailId())));
        }

        return packageDetails;
    }

    public List<AIOCustomerDTO> getDataCustomer(AIOCustomerDTO obj) {
        return aioContractDAO.getDataCustomer(obj);
    }

    private Double calculateDiscount(Long quantity, Double price, Double quantityDiscount, Double amountDiscount, Double percentDiscount) {
        Double afterDiscount = Double.parseDouble(String.valueOf(quantity)) * price;
        if (quantityDiscount != null) {
            if (quantity > quantityDiscount) {
                if (amountDiscount != null) {
                    afterDiscount -= amountDiscount;
                } else if (percentDiscount != null) {
                    afterDiscount *= (1 - percentDiscount / 100);
                }
            }
        }
        return afterDiscount;
    }

    @SuppressWarnings("Duplicates")
    private void saveAttachment(List<UtilAttachDocumentDTO> filesAttach, Long contractId, Long sysUserId) {
        for (UtilAttachDocumentDTO fileAttach : filesAttach) {
            Long idResult;
            try {
                InputStream inputStream = ImageUtil.convertBase64ToInputStream(fileAttach.getBase64String());
                String filePath = UFile.writeToFileServerATTT2(inputStream, fileAttach.getImageName(),
                        inputSubFolderUpload, folderUpload);
                fileAttach.setFilePath(filePath);
                fileAttach.setObjectId(contractId);
                fileAttach.setType(AIOAttachmentType.CONTRACT_ATTACHMENT.code);
                fileAttach.setDescription("Bản scan hợp đồng để phê duyệt");
                fileAttach.setStatus("1");
                fileAttach.setCreatedDate(new Date());
                fileAttach.setCreatedUserId(sysUserId);
                fileAttach.setCreatedUserName(null);
                fileAttach.setName(fileAttach.getImageName());

                idResult = utilAttachDocumentDAO.saveObject(fileAttach.toModel());
            } catch (Exception e) {
                e.printStackTrace();
                continue;
            }

            commonService.validateIdCreated(idResult, AIOObjectType.ATTACH_IMAGE.getName());
        }
    }

    private AIOContractDetailDTO toContractDetailDto(AIOContractDTO packageInfo, Long contractId, AIOPackageDetailDTO packageDetail,
                                                     Date endDate, String workName, Long isBill) {
        AIOContractDetailDTO contractDetail = new AIOContractDetailDTO();
        if (packageInfo != null) {
            contractDetail.setIsProvinceBought(packageInfo.getIsProvinceBought());
            contractDetail.setSaleChannel(packageInfo.getSaleChannel());
        }
        //VietNT_end
        contractDetail.setContractId(contractId);
        contractDetail.setPackageId(packageDetail.getAioPackageId());
        contractDetail.setPackageName(packageDetail.getAioPackageName());
        contractDetail.setPackageDetailId(packageDetail.getAioPackageDetailId());
        contractDetail.setEngineCapacityId(packageDetail.getEngineCapacityId());
        contractDetail.setEngineCapacityName(packageDetail.getEngineCapacityName());
        contractDetail.setGoodsId(packageDetail.getGoodsId());
        contractDetail.setGoodsName(packageDetail.getGoodsName());
        contractDetail.setAmount(this.calculateDiscount(packageDetail.getQuantity(), packageDetail.getPrice(),
                packageDetail.getQuantityDiscount(), packageDetail.getAmountDiscount(), packageDetail.getPercentDiscount()));
        contractDetail.setStartDate(new Date());
        contractDetail.setEndDate(endDate);
        contractDetail.setWorkName(workName);
        contractDetail.setQuantity(Double.parseDouble(String.valueOf(packageDetail.getQuantity())));
        contractDetail.setStatus(1L);
        contractDetail.setIsBill(isBill);

        return contractDetail;
    }

    private AIOAcceptanceRecordsDTO toAcceptanceRecordsDto(Long contractId, AIOPackageDetailDTO packageDetail, Long typeService,
                                                           AIOCustomerDTO checkCustomer, Long performerId, Long contractDetailId) {
        AIOAcceptanceRecordsDTO acceptanceRecord = new AIOAcceptanceRecordsDTO();
        acceptanceRecord.setContractId(contractId);
        acceptanceRecord.setPackageId(packageDetail.getAioPackageId());
        acceptanceRecord.setCustomerId(checkCustomer.getCustomerId());
        acceptanceRecord.setCustomerCode(checkCustomer.getCode());
        acceptanceRecord.setCustomerName(checkCustomer.getName());
        acceptanceRecord.setCustomerPhone(checkCustomer.getPhone());
        acceptanceRecord.setCustomerAddress(checkCustomer.getAddress());
        acceptanceRecord.setPerformerId(performerId);
        acceptanceRecord.setPackageDetailId(packageDetail.getAioPackageDetailId());
        acceptanceRecord.setContractDetailId(contractDetailId);
        acceptanceRecord.setType(typeService);

        return acceptanceRecord;
    }

    private void setInfoCustomerInContract(AIOContractDTO dto, AIOCustomerDTO customerDTO) {
        dto.setCustomerId(customerDTO.getCustomerId());
        dto.setCustomerCode(customerDTO.getCode());
        dto.setCustomerName(customerDTO.getName());
        dto.setCustomerPhone(customerDTO.getPhone());
        dto.setCustomerAddress(customerDTO.getAddress());
    }

    private SendSmsEmailDTO toSmsDTO(String packageName, String customerName, String startDate, String endDate,
                                     SysUserCOMSDTO performer, Long sysUserId, Long sysGroupId) {
        SendSmsEmailDTO sendSmsEmailDTO = new SendSmsEmailDTO();
        sendSmsEmailDTO.setSubject("Thông báo nhận công việc AIO");
//            	if(checkCustomer==null) {
        sendSmsEmailDTO.setContent("Bạn được giao thực hiện gói \"" +
                packageName +
                "\" cho khách hàng \"" +
                customerName +
                "\"%s\". Thời gian thực hiện từ " +
                startDate +
                " đến " +
                endDate);

        sendSmsEmailDTO.setStatus("0");
        sendSmsEmailDTO.setReceivePhoneNumber(performer.getPhoneNumber());
        sendSmsEmailDTO.setReceiveEmail(performer.getEmail());
        sendSmsEmailDTO.setCreatedDate(new Date());
        sendSmsEmailDTO.setCreatedUserId(sysUserId);
        sendSmsEmailDTO.setCreatedGroupId(sysGroupId);
//		sendSmsEmailDAO.saveObject(sendSmsEmailDTO.toModel());
        return sendSmsEmailDTO;
    }

    //Tạo mới hợp đồng
    public Long saveNewContract(AIOContractMobileRequest obj) {
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm dd/MM/yyyy");
        AIOContractDTO contract = obj.getAioContractDTO();
        int month;
        Long cusId = null;
//    	String customerCode=null;
        Long perSys = null;
        SysUserDTO sys = aioCustomerDAO.getDetailUserBySysUserId(obj.getSysUserRequest().getSysUserId()); //user đăng nhập
        //VietNT_14/08/2019_start
//    	SysUserDTO per = aioCustomerDAO.getSysUserIdByAreaId(obj.getAioAreaDTO().getAreaId()); // user theo xã
        if (obj.getAioContractDTO().getPerformerId() == null) {
            throw new BusinessException("Chưa chọn người thực hiện!");
        }
        SysUserCOMSDTO criteria = new SysUserCOMSDTO();
        criteria.setSysUserId(obj.getAioContractDTO().getPerformerId());
        SysUserCOMSDTO per = commonService.getUserByCodeOrId(criteria);
        //VietNT_end
        if (per != null) {
            perSys = contractDAO.getUserSysGroupLevel2ByUserId(per.getSysUserId());
        } else {
            throw new BusinessException("Không tìm thấy người thực hiện!");
        }
        String saleChannel = sys.getSaleChannel();
        //Insert customer
        AIOCustomerDTO checkCustomer = aioContractDAO.checkCustomer(obj.getAioCustomerDTO());
        if (checkCustomer == null) {
            checkCustomer = obj.getAioCustomerDTO();
            String cusCode = obj.getAioContractDTO().getContractCode().split("_")[0];
            String leadAddId = String.format((Locale) null, "%07d", contractDAO.getNextCustomerCodeId());
            obj.getAioCustomerDTO().setCode(cusCode + leadAddId);
//			customerCode = cusCode + leadAddId;
            if (StringUtils.isNotEmpty(obj.getAioCustomerDTO().getTaxCode())) {
                checkCustomer.setType(2L);
                contract.setCustomerTaxCode(obj.getAioCustomerDTO().getTaxCode());
            } else {
                checkCustomer.setType(1L);
            }
            checkCustomer.setAioAreaId(obj.getAioAreaDTO().getAreaId());
            checkCustomer.setCreatedDate(new Date());
            checkCustomer.setCreatedUser(obj.getSysUserRequest().getSysUserId());
            checkCustomer.setCreatedGroupId(sys.getSysGroupId());
            cusId = aioCustomerDAO.saveObject(checkCustomer.toModel());
            commonService.validateIdCreated(cusId, ": Thông tin khách hàng");

            checkCustomer.setCustomerId(cusId);
        } else {
            checkCustomer.setName(obj.getAioCustomerDTO().getName());
            checkCustomer.setPhone(obj.getAioCustomerDTO().getPhone());
            checkCustomer.setAddress(obj.getAioCustomerDTO().getAddress());
        }

        this.setInfoCustomerInContract(contract, checkCustomer);

        // goi noi bo
        AIOContractManagerBusinessImpl.validateInternalContract(contract, commonService);

        String contractCode = obj.getAioContractDTO().getContractCode();
        String leadZerosId = String.format((Locale) null, "%07d", contractDAO.getNextContractCodeId());
        contract.setContractCode(contractCode.substring(0, contractCode.lastIndexOf("_") + 1) + obj.getCatProvinceDTO().getCode() + "_" + leadZerosId);
//    	if(per!=null) {
        contract.setPerformerId(per.getSysUserId());
//    	}
        contract.setStatus(1L);
        contract.setType(obj.getAioContractDTO().getType());
        contract.setSpeciesId(obj.getAppParam().getSpeciesId());
        contract.setSpeciesName(obj.getAppParam().getSpeciesName());
        contract.setAreaId(obj.getAppParam().getAreaId());
        contract.setAreaName(obj.getAppParam().getAreaName());
        contract.setCatProvinceId(obj.getCatProvinceDTO().getCatProvinceId());
        contract.setCatProvinceCode(obj.getCatProvinceDTO().getCode());
        contract.setIsMoney(0L);
        contract.setServiceCode(obj.getAioContractDTO().getServiceCode());
        contract.setCreatedDate(new Date());
        contract.setCreatedUser(obj.getSysUserRequest().getSysUserId());
        contract.setCreatedGroupId(sys.getSysGroupIdLv2());
        contract.setSellerId(sys.getSysUserId());
        contract.setSellerCode(sys.getEmployeeCode());
        contract.setSellerName(sys.getFullName());
        contract.setIsInvoice(obj.getAioAreaDTO().getIsInvoice());
//    	if(per!=null) {
        contract.setPerformerCode(per.getEmployeeCode());
        contract.setPerformerName(per.getFullName());
        contract.setPerformerGroupId(perSys);
//    	}
        contract.setSignDate(new Date());
        contract.setSignPlace(obj.getAioCustomerDTO().getAddress());
        //thangtv24 on 110719 - start
//		if (StringUtils.isNotEmpty(obj.getListEmployee())) {
//			String[] toArray = obj.getListEmployee().split(";");
//			StringJoiner salesTogether = new StringJoiner(";");
//			for (String text : toArray) {
//				if (!text.contains(sys.getEmployeeCode())) {
//					salesTogether.add(text);
//				}
//			}
//			contract.setSalesTogether(salesTogether.toString());
//		}
        contract.setSalesTogether(obj.getListEmployee());
        //thangtv24 on 110719 - end
        //VietNT_26/07/2019_start
        if (saleChannel.equals(AIOSaleChannel.VCC.code)) {
            AIOContractManagerBusinessImpl.setDataForPayType(contract);
        }

        // HĐ VTPOST
        if (saleChannel.equals(AIOSaleChannel.VTPOST.code)) {
            AIOContractManagerBusinessImpl.setDataForThuHo(contract, new Date());
        }

        //VietNT_end
        Long contractId = contractDAO.saveObject(contract.toModel());
        commonService.validateIdCreated(contractId, AIOObjectType.CONTRACT);

        // save file HD
        this.saveAttachment(contract.getListFile(), contractId, obj.getSysUserRequest().getSysUserId());

        // save perform date contract
        this.savePerformDateContract(contractId);

        // update order if contract create from order
        if (contract.getAioOrdersId() != null) {
            contractDAO.updateAIOOrder(contract.getAioOrdersId(), contractId);
        }

        List<AIOPackageGoodsDTO> listGoodsToCreateOrder = new ArrayList<>();
        for (AIOPackageDetailDTO packageDetail : obj.getLstAIOPackageDetail()) {
            // validate stock before add
            List<AIOPackageGoodsDTO> listMissingQuantity = AIOContractManagerBusinessImpl.validateStockGoodsBeforeCreate(
                    packageDetail.getAioPackageDetailId(),
                    packageDetail.getQuantity(),
                    perSys,
                    contractDAO);
            if (!listMissingQuantity.isEmpty()) {
                listGoodsToCreateOrder.addAll(listMissingQuantity);
                continue;
            }

            //VietNT_20190523_start
//			Long isProvinceBought = contractDAO.isProvinceBoughtPackage(packageDetail.getAioPackageDetailId()) ? 1L : null;
            //VietNT_end
            //VietNT_03/07/2019_start
            AIOContractDTO packageInfo = contractDAO.getPackageSaleChannelAndProvinceBought(packageDetail.getAioPackageDetailId());
            //VietNT_end
            if (packageDetail.getRepeatNumber() == null) {
                Calendar cal = new GregorianCalendar();
                cal.setTime(new Date());
                cal.add(Calendar.HOUR_OF_DAY, Integer.parseInt(String.valueOf(packageDetail.getAioPackageTime())));

                // save detail
                AIOContractDetailDTO contractDetail = this.toContractDetailDto(packageInfo, contractId, packageDetail,
                        cal.getTime(), packageInfo.getWorkName(), obj.getAioAreaDTO().getIsInvoice());
                Long conDetailId = contractDetailDAO.saveObject(contractDetail.toModel());
                commonService.validateIdCreated(conDetailId, ": chi tiết HĐ");

                // save records
                AIOAcceptanceRecordsDTO acceptanceRecord = this.toAcceptanceRecordsDto(contractId, packageDetail, contract.getType(),
                        checkCustomer, per.getSysUserId(), conDetailId);
                aioAcceptanceRecordsDAO.saveObject(acceptanceRecord.toModel());
                commonService.validateIdCreated(conDetailId, ": chi tiết thanh toán HĐ");
            } else {
                //Gói lặp
                Calendar calStart1 = new GregorianCalendar();
                calStart1.setTime(new Date());
                Calendar calEnd1 = new GregorianCalendar();
                for (int a = 0; a < packageDetail.getRepeatNumber(); a++) {
                    AIOContractDetailDTO contractDetail = new AIOContractDetailDTO();
                    AIOAcceptanceRecordsDTO acceptanceRecord = new AIOAcceptanceRecordsDTO();
                    int i = Integer.parseInt(String.valueOf(packageDetail.getRepeatInterval()));
                    int pTime = Integer.parseInt(String.valueOf(packageDetail.getAioPackageTime()));
                    if (a == 0) {
                        Calendar cal = new GregorianCalendar();
                        cal.setTime(new Date());
                        cal.add(Calendar.HOUR_OF_DAY, pTime);

                        // save detail
                        contractDetail = this.toContractDetailDto(packageInfo, contractId, packageDetail,
                                cal.getTime(), packageInfo.getWorkName(), obj.getAioAreaDTO().getIsInvoice());
                        contractDetail.setIsRepeat(1L);
                        Long conDetailId = contractDetailDAO.saveObject(contractDetail.toModel());
                        commonService.validateIdCreated(conDetailId, ": chi tiết HĐ");

                        // save records
                        acceptanceRecord = this.toAcceptanceRecordsDto(contractId, packageDetail, contract.getType(),
                                checkCustomer, per.getSysUserId(), conDetailId);
                        aioAcceptanceRecordsDAO.saveObject(acceptanceRecord.toModel());
                        commonService.validateIdCreated(conDetailId, ": chi tiết thanh toán HĐ");

                    } else {
                        calStart1.setTime(calStart1.getTime());
                        calStart1.add(Calendar.DAY_OF_MONTH, i);

                        calEnd1.setTime(calStart1.getTime());
                        calEnd1.add(Calendar.HOUR_OF_DAY, pTime);

                        // save detail
                        contractDetail = this.toContractDetailDto(packageInfo, contractId, packageDetail,
                                calEnd1.getTime(), packageInfo.getWorkName(), obj.getAioAreaDTO().getIsInvoice());
                        contractDetail.setAmount(0d);
                        contractDetail.setStartDate(calStart1.getTime());
                        contractDetail.setIsRepeat(1L);
                        Long conDetailId = contractDetailDAO.saveObject(contractDetail.toModel());
                        commonService.validateIdCreated(conDetailId, ": chi tiết HĐ");

                        // save records
                        acceptanceRecord = this.toAcceptanceRecordsDto(contractId, packageDetail, contract.getType(),
                                checkCustomer, per.getSysUserId(), conDetailId);
                        aioAcceptanceRecordsDAO.saveObject(acceptanceRecord.toModel());
                        commonService.validateIdCreated(conDetailId, ": chi tiết thanh toán HĐ");
                    }
                }
            }

        }

        if (!listGoodsToCreateOrder.isEmpty()) {
            throw new BusinessException(AIOErrorType.INSUFFICIENT_GOODS_IN_STOCK.msg + ".\nĐã tạo yêu cầu hàng hóa với mã ",
                    contract, listGoodsToCreateOrder);
        }

        // send sms hd
        this.sendSms(contract, obj.getSysUserRequest().getSysUserId());

        return contractId;
    }

    private void sendSms(AIOContractDTO contractDTO, Long userId) {
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm dd/MM/yyyy");
        String content;

        content = String.format(AIOContractManagerBusinessImpl.contentEmail,
                contractDTO.getContractCode(),
                contractDTO.getServiceCode(),
                contractDTO.getCustomerName(),
                contractDTO.getCustomerPhone(),
                sdf.format(contractDTO.getCreatedDate()),
                sdf.format(new Date(contractDTO.getCreatedDate().getTime() + TimeUnit.HOURS.toMillis(72))));

        int result = commonService.insertIntoSmsTable(AIOContractManagerBusinessImpl.subjectEmail, content, contractDTO.getPerformerId(), userId, new Date());
        if (result < 1) {
            LOGGER.error(AIOErrorType.SEND_SMS_EMAIL_ERROR.msg);
        }
    }

    // TODO: 16-Oct-19 redo query
    public List<AIOContractDTO> getContractOfPerformer(Long id) {

        List<AIOContractDTO> data = aioContractDAO.getContractOfPerformer(id);
//    	for(AIOContractDTO dto : data) {
//    		List<AIOPackageDetailDTO> getListPackageDetail = aioContractDAO.getListPackageDetail(dto);
//    		dto.setListPackageDetail(getListPackageDetail);
//    	}

        return data;
    }

    //HuyPq-end
    //VietNT_17/06/2019_start
    public List<AIOContractDTO> getContractsUnpaid(AIOContractMobileRequest rq) {
        Long sysUserId = rq.getSysUserRequest() != null && rq.getSysUserRequest().getSysUserId() != 0
                ? rq.getSysUserRequest().getSysUserId() : null;
        if (sysUserId == null) {
            throw new BusinessException("Thiếu thông tin");
        }
        return aioContractDAO.getContractsUnpaid(sysUserId);
    }
    //VietNT_end

    //Thangtv24-110719-start
    public SysGroupDto getInfoUser(Long sysUserId) {
        return aioContractDAO.getInfoSysGroup(sysUserId);
    }

    //VietNT_27/07/2019_start
    public void updatePayTypeContract(AIOContractMobileRequest rq) {
        SysUserDTO sysUser;
        if (rq.getSysUserRequest() != null && rq.getSysUserRequest().getSysUserId() > 0) {
            sysUser = aioCustomerDAO.getDetailUserBySysUserId(rq.getSysUserRequest().getSysUserId());
            if (sysUser == null) {
                throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.USER.getName());
            }

            if (!sysUser.getSaleChannel().equals(AIOSaleChannel.VCC.code)) {
                throw new BusinessException(AIOErrorType.NOT_VALID.msg + ": kênh bán");
            }
        } else {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.USER.getName());
        }

        AIOContractDTO dto = rq.getAioContractDTO();
        if (dto == null || dto.getContractId() == null) {
//				|| dto.getPayType() == null || dto.getPayType() != 2) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }

        List<UtilAttachDocumentDTO> attachDocumentDTOS = dto.getListFile();
        if (attachDocumentDTOS == null || attachDocumentDTOS.isEmpty()) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": ảnh hợp đồng");
        }

        AIOContractDTO contractDTO = contractDAO.getContractById(dto.getContractId());
        if (contractDTO.getPayType() != 1) {
            throw new BusinessException("Phương thức thanh toán không hợp lệ");
        }

        int result = contractDAO.updatePayTypeContract(contractDTO.getContractId(), 2L);
        commonService.validateIdCreated(result, AIOErrorType.SAVE_ERROR.msg);

        this.saveAttachment(Collections.singletonList(attachDocumentDTOS.get(0)),
                contractDTO.getContractId(), sysUser.getSysUserId());
    }

    void validateEndContract(AIOContractDTO contractDTO, AIOContractDTO info, Long sysUserId) {
        if (!contractDAO.isContractDetailCorrect(contractDTO.getContractId(), contractDTO.getContractDetailId(), contractDTO.getQuantity())) {
            throw new BusinessException(AIOErrorType.DETAIL_MISMATCH.msg);
        }
        if (contractDTO.getPayType() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": hình thức thanh toán");
        }
        if (info != null) {
            if (StringUtils.isEmpty(info.getSaleChannel())) {
                throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": kênh bán");
            }
            if (info.getPayType() == null) {
                throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " thanh toán");
            }
            if (info.getStatus().equals(4L)) {
                throw new BusinessException(AIOErrorType.DETAIL_MISMATCH.msg);
            }
            if (info.getStatus().equals(6L)) {
                throw new BusinessException("HĐ đang đề xuất hủy, không thể nghiệm thu");
            }
            if (contractDAO.userHasContractUnpaid(sysUserId, contractDTO.getContractId())) {
//            	, info.getNumberPay()
                throw new BusinessException("Tồn tại hợp đồng chưa nộp tiền nên không thể kết thúc hợp đồng!");
            }
        } else {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.CONTRACT.getName());
        }
    }

    //    void handlingPayTypeEndContract(Long payTypeDb, Long payTypeRq, Long approvePay, Long contractId) {
    void handlingPayTypeEndContract(AIOContractDTO info, AIOContractDTO contractDTO, Long sysUserId) {
        Long payTypeDb = info.getPayType();
        Long approvePay = info.getApprovedPay();
        Long contractId = info.getContractId();
        Long payTypeRq = contractDTO.getPayType();

        // ghep paytype in db va paytype in request de switch
        String payTypeCode = payTypeDb.toString() + "_" + payTypeRq;
        switch (payTypeCode) {
            case "1_1":
                break;
            case "1_2":
                this.saveAttachment(contractDTO.getListFile(), contractId, sysUserId);
                throw new BusinessException("HĐ chuyển hình thức thanh toán phải chờ phê duyệt");
            case "2_1":
                contractDAO.updatePayTypeContract(contractId, 1L);
                break;
            case "2_2":
                if (approvePay != 1) {
                    throw new BusinessException("HĐ chưa được phê duyệt hình thức thanh toán");
                }
                break;
            default:
                throw new BusinessException(AIOErrorType.NOT_VALID.msg + ": hình thức thanh toán");
        }

    }

    //VietNT_13/08/2019_start
    public AIOContractDTO getDefaultPerformer(AIOAreaDTO obj) {
        if (obj.getAreaId() == null || obj.getType() == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        SysUserCOMSDTO defaultPerformer = contractDAO.getDefaultPerformer(obj.getAreaId(), obj.getType());
        if (defaultPerformer == null) {
            throw new BusinessException(AIOErrorType.NOT_VALID.msg + " area_id");
        }
        AIOContractDTO performer = new AIOContractDTO();
        performer.setPerformerId(defaultPerformer.getSysUserId());
        performer.setPerformerName(defaultPerformer.getFullName());
        performer.setPerformerCode(defaultPerformer.getEmployeeCode());

        return performer;
    }
    //VietNT_end

    private void savePerformDateContract(Long contractId) {
        AIOContractPerformDateDTO dto = new AIOContractPerformDateDTO();
        dto.setContractId(contractId);
        dto.setStartDate(new Date());

        aioContractPerformDateDAO.saveObject(dto.toModel());
    }

    public void updateContractPerformDateEndDate(Long contractId) {
//    	List<Long> detailStatus = contractDAO.getContractDetailStatus(contractId);
//    	long completed = detailStatus.stream().filter(d -> d == 3L).count();
//		if (completed != detailStatus.size()) {
//			return;
//		}

        List<AIOContractPerformDateDTO> performDateDTOS = aioContractPerformDateDAO.getListPerformDate(contractId);
        int size = performDateDTOS.size();
        int result;
        if (size == 1) {
            result = aioContractPerformDateDAO.updateEndDate(performDateDTOS.get(0).getContractPerformDateId(), new Date());
            commonService.validateIdCreated(result, "Cập nhật thông tin thực hiện hợp đồng thất bại");
        } else if (size == 2) {
            result = aioContractPerformDateDAO.updateEndDate(performDateDTOS.get(0).getContractPerformDateId(), new Date());
            commonService.validateIdCreated(result, "Cập nhật thông tin thực hiện hợp đồng thất bại");
            result = aioContractPerformDateDAO.deletePerformDateInvalid(performDateDTOS.get(1).getContractPerformDateId());
            commonService.validateIdCreated(result, "Xóa thông tin thực hiện hợp đồng thất bại");
        } else {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + " thông tin thực hiện hợp đồng");
        }
    }

    public List<String> getReasonAppParam() {
        return aioContractDAO.getReasonOutOfDate();
    }

    public void updateCustomerPoint(Long contractId, Long packageDetailId) {
        aioCustomerDAO.updateCustomerPoint(contractId, packageDetailId);
    }

    public void finishPackageInContract(AIOContractMobileRequest dto) {
        AIOContractDTO stock = aioContractDAO.getStock(dto.getSysUserRequest().getSysUserId());
        AIOSynStockTransDTO stockTransDto = this.createStockTrans(dto, stock);
        this.createStockTransDetail(dto, stockTransDto.getStockTransId(), stock);
        this.updateEndContract(dto, stockTransDto.getCode());
        this.updateCustomerPoint(dto.getAioContractDTO().getContractId(), dto.getAioContractDTO().getPackageDetailId());
    }

    public void createStockTransExportEndContract(AIOContractMobileRequest obj) {
//		AIOContractDTO stock = aioContractDAO.getStock(obj.getSysUserRequest().getSysUserId());
//
//		AIOSynStockTransDTO stockTransDto = this.createStockTrans(obj, stock);
//		this.createStockTransDetail(obj, stockTransDto.getStockTransId(), stock);
//
//		aioContractDAO.updateEndContract(obj, createdStockTransCode);
    }

    private AIOSynStockTransDTO createStockTrans(AIOContractMobileRequest obj, AIOContractDTO stock) {
        String userName = aioContractDAO.getUserName(obj.getSysUserRequest().getSysUserId());
        String GroupName = aioContractDAO.getGroupName(obj.getSysUserRequest().getDepartmentId());

        AIOSynStockTransDTO stockTransDto = new AIOSynStockTransDTO();
        Long sequence = aioContractDAO.getSequenceStock();
        stockTransDto.setCode("PXK_" + stock.getStockCode() + "/19/" + sequence);
        stockTransDto.setType("2");
        stockTransDto.setStockId(stock.getStockId());
        stockTransDto.setStockCode(stock.getStockCode());
        stockTransDto.setStockName(stock.getStockName());
        stockTransDto.setStatus("2");
        stockTransDto.setSignState("3");
        stockTransDto.setDescription("Xuất kho bán hàng");
        stockTransDto.setCreatedByName(userName);
        stockTransDto.setCreatedDeptId(obj.getSysUserRequest().getDepartmentId());
        stockTransDto.setCreatedDeptName(GroupName);
        stockTransDto.setRealIeTransDate(new Date());
        stockTransDto.setRealIeUserId(String.valueOf(obj.getSysUserRequest().getSysUserId()));
        stockTransDto.setRealIeUserName(userName);
        stockTransDto.setContractCode(obj.getAioContractDTO().getContractCode());
        stockTransDto.setCreatedBy(obj.getSysUserRequest().getSysUserId());
        stockTransDto.setCreatedDate(new Date());
        stockTransDto.setBusinessTypeName("Xuất bán cho khách hàng");
        stockTransDto.setDeptReceiveName(GroupName);
        stockTransDto.setDeptReceiveId(obj.getSysUserRequest().getDepartmentId());
        stockTransDto.setBussinessType("11");
        stockTransDto.setCustId(obj.getAioContractDTO().getCustomerId());
        Long stockTransId = aioSynStockTransDAO.saveObject(stockTransDto.toModel());
        stockTransDto.setStockTransId(stockTransId);

        return stockTransDto;
    }

    public void createStockTransDetail(AIOContractMobileRequest obj, Long stockTransId, AIOContractDTO stock) {
        if (obj.getLstAIOContractMobileDTO() == null || obj.getLstAIOContractMobileDTO().isEmpty()) {
            return;
        }

//		List<AIOSynStockTransDetailDTO> stockTransDetailList = new ArrayList<>();
        for (AIOContractDTO detail : obj.getLstAIOContractMobileDTO()) {
            if (detail.getQuantity() != 0) {
                Double totalPrice = 0D;
                Double stockPrice = 0D;

                AIOSynStockTransDetailDTO dto = new AIOSynStockTransDetailDTO();
                dto.setStockTransId(stockTransId);
                dto.setGoodsId(detail.getGoodsId());
                dto.setGoodsCode(detail.getGoodsCode());
                dto.setGoodsName(detail.getGoodsName());
                dto.setGoodsIsSerial(detail.getGoodsIsSerial().toString());
                dto.setGoodsUnitId(detail.getGoodsUnitId());
                dto.setGoodsUnitName(detail.getGoodsUnitName());
                dto.setAmountReal(detail.getQuantity());
                dto.setAmountOrder(detail.getQuantity());
                dto.setGoodsState("1");
                dto.setGoodsStateName("Bình thường");
                dto.setGoodsType(detail.getGoodType());
                AIOSynStockTransDetailDTO goodType = aioSynStockTransDAO.getGoodTypeName(detail.getGoodsId());
                dto.setGoodsTypeName(goodType.getGoodsTypeName());
                StockTransDetailBO stockTransDetailBO = dto.toModel();
                Long idDetail = aioStockTransDetailDAO.saveObject(stockTransDetailBO);
                dto.setSynStockTransDetailId(idDetail);

//				stockTransDetailList.add(dto);

                List<String> serialList = detail.getTypeSerial() == 1 ? detail.getLstSerial() : detail.getLstSerialText();
                if (serialList != null && !serialList.isEmpty()) {
                    // create detail serial
                    for (int i = 0; i < serialList.size(); i++) {
                        AIOMerEntityDTO mer = new AIOMerEntityDTO();
                        mer.setSerial(serialList.get(i));
                        mer.setStockId(stock.getStockId());
                        mer.setGoodsId(detail.getGoodsId());
                        mer.setState("1");
                        AIOMerEntityDTO merEntityDto = aioContractDAO.findBySerial(mer);
                        if (merEntityDto != null) {
                            // map serial to mer, to get guarantee
                            String key = detail.getGoodsId() + "_" + serialList.get(i);
                            mapGuarantee.put(key, merEntityDto);
                            //VietNT_end
                            merEntityDto.setStatus("5");
                            if (merEntityDto.getExportDate() == null) {
                                merEntityDto.setExportDate(new Date());
                            }
                            aioMerEntityDAO.update(merEntityDto.toModel());
                            AIOStockTransDetailSerialDTO detailSerial = aioContractDAO.createFromMerEntity(merEntityDto, stockTransId, idDetail);
                            totalPrice = totalPrice + detailSerial.getQuantity() *
                                    (detailSerial.getPrice() != null ? detailSerial.getPrice() : 0);
                            Long idDetailSerial = aioStockTransDetailSerialDAO.saveObject(detailSerial.toModel());
                        } else {
                            throw new BusinessException(AIOErrorType.GOODS_NOT_IN_STOCK.msg);
                        }
                        // tong gia von
                        stockPrice += merEntityDto.getApplyPrice();
                    }
                } else {
                    List<AIOMerEntityDTO> availableGoods = aioContractDAO.findByGoodsForExport(detail.getGoodsId(), "1", stock.getStockId());
                    if (availableGoods == null || availableGoods.size() == 0) {
                        throw new BusinessException(AIOErrorType.GOODS_NOT_IN_STOCK.msg);
                    }

                    //VietNT_08/08/2019_start
                    // map serial to mer, to get guarantee
                    String key = detail.getGoodsId() + "";
                    mapGuarantee.put(key, availableGoods.get(0));
                    //VietNT_end

                    AIOMerEntityDTO currentEntity = null;
                    Double exportAmount = detail.getQuantity();
//                    Double amountSum = aioContractDAO.findByGoodsForExportSum(detail.getGoodsId(), "1", stock.getStockId());
                    Double amountSum = availableGoods.stream().mapToDouble(AIOMerEntityDTO::getAmount).sum();
                    if (exportAmount - amountSum > 0) {
                        throw new BusinessException(AIOErrorType.INSUFFICIENT_GOODS_IN_STOCK.msg);
                    }
                    // tong gia von
                    stockPrice += availableGoods.get(0).getApplyPrice() * detail.getQuantity();

                    for (AIOMerEntityDTO goods : availableGoods) {
                        if (exportAmount - goods.getAmount() < 0) {
                            currentEntity = goods;
                            break;
                        }
                        exportAmount = (double) Math.round((exportAmount - goods.getAmount()) * 1000) / 1000;
                        goods.setStatus("5");
                        if (goods.getExportDate() == null) {
                            goods.setExportDate(new Date());
                        }
                        aioMerEntityDAO.update(goods.toModel());

                        AIOStockTransDetailSerialDTO detailSerial = aioContractDAO.createFromMerEntity(goods, stockTransId, idDetail);
                        if (detailSerial.getPrice() == null) {
                            detailSerial.setPrice(0d);
                        }
                        totalPrice = totalPrice + detailSerial.getQuantity() * detailSerial.getPrice();
                        Long idDetailSerial = aioStockTransDetailSerialDAO.saveObject(detailSerial.toModel());
                    }
                    if (exportAmount > 0) {
                        Long currentId = currentEntity.getMerEntityId();
                        Long parentMerEntityId = currentEntity.getParentMerEntityId();
                        Double remainAmount = currentEntity.getAmount() - exportAmount;
                        Long currentOrderId = currentEntity.getOrderId();
                        Date currentExportDate = currentEntity.getExportDate();
                        // tach mer entity moi
                        AIOMerEntityDTO newEntity = currentEntity;
                        newEntity.setId(null);
                        newEntity.setMerEntityId(0l);
                        newEntity.setAmount(exportAmount);
                        newEntity.setParentMerEntityId(currentId);
                        // newEntity.setOrderId(obj.getOrderId());
                        newEntity.setStatus("5");
                        if (newEntity.getExportDate() == null) {
                            newEntity.setExportDate(new Date());
                        }
                        Long idMerInsert = aioMerEntityDAO.saveObject(newEntity.toModel());
                        // hoanm1_20190504_comment_start
                        // aioMerEntityDAO.update(newEntity.toModel());
                        // hoanm1_20190504_comment_end
                        newEntity.setMerEntityId(idMerInsert);
                        // luu stock trans detail serial
                        AIOStockTransDetailSerialDTO detailSerial = aioContractDAO.createFromMerEntity(newEntity, stockTransId, idDetail);
                        Double price = detailSerial.getPrice() != null ? detailSerial.getPrice() : 0;
                        totalPrice = totalPrice + detailSerial.getQuantity() * price;
                        Long idDetailSerial = aioStockTransDetailSerialDAO.saveObject(detailSerial.toModel());

                        // update lai thong tin mer entity goc
                        currentEntity.setAmount(remainAmount);
                        currentEntity.setStatus("4");
                        currentEntity.setMerEntityId(currentId);
                        currentEntity.setParentMerEntityId(parentMerEntityId);
                        currentEntity.setOrderId(currentOrderId);
                        currentEntity.setExportDate(currentExportDate);
                        aioMerEntityDAO.update(currentEntity.toModel());
                    }
                }

                if (stockPrice * obj.getIndustryScale() > (obj.getAioContractDTO().getAmount() / 1.1)) {
                    throw new BusinessException(AIOErrorType.STOCK_PRICE_BELOW_SALE_PRICE.msg);
                }

                stockTransDetailBO.setTotalPrice(totalPrice);
                aioStockTransDetailDAO.update(stockTransDetailBO);

                detail.setPriceRecordDetail((double) Math.round((totalPrice / detail.getQuantity()) * 100) / 100);
                AIOSynStockTransDTO stockTotal = aioContractDAO.getStockGoodTotal(stock.getStockId(), detail.getGoodsId());
                if (stockTotal != null) {
                    aioContractDAO.updateStockGoodsTotal(stockTotal, detail.getQuantity());
                }
            }
        }
    }

    void updateEndContract(AIOContractMobileRequest request, String stockTransCode) {
        int resultUpdate = aioContractDAO.updateContractDetail(request.getAioContractDTO());
        if (resultUpdate < 1) {
            throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + " CONTRACT_DETAIL");
        }

        resultUpdate = aioContractDAO.updateAcceptanceRecords(request.getAioContractDTO(), request.getPerformTogether());
        if (resultUpdate < 1) {
            throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + " ACCEPTANCE_RECORDS");
        }

        resultUpdate = aioContractDAO.updateStatusContract(request.getAioContractDTO());
        if (resultUpdate < 1) {
            throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + " CONTRACT");
        }

        if (request.getLstAIOContractMobileDTO() != null && !request.getLstAIOContractMobileDTO().isEmpty()) {
            aioContractDAO.createAcceptanceRecordsDetails(request.getLstAIOContractMobileDTO(),
                    request.getAioContractDTO().getAcceptanceRecordsId(),
                    stockTransCode);
        }
    }

    public void sendSmsEndContract(AIOContractDTO contractDTO) {
        String content = "Hợp đồng " + contractDTO.getContractCode() +
                " cho khách hàng " + contractDTO.getCustomerNameBill() + ", " + contractDTO.getCustomerAddressBill()
                + " đã hoàn thành";
        String subject = "Thông hoàn thành công việc AIO";

        aioContractDAO.sendSmsEndContract(subject, content, contractDTO.getContractId());
    }

    String createKeyEndContract(Long sysUserId, AIOContractDTO dto) {
        return cacheUtils.createKey(
                String.valueOf(sysUserId),
                dto.getContractId().toString(),
                dto.getContractDetailId().toString(),
                dto.getPackageDetailId().toString());
    }

    String createKeyEndContract(Long sysUserId, Long contractId, Long contractDetailId, Long packageDetailId) {
        return cacheUtils.createKey(
                String.valueOf(sysUserId),
                contractId.toString(),
                contractDetailId.toString(),
                packageDetailId.toString());
    }

    private void saveRequestEndContract(AIOContractMobileRequest rq) {
        String key = this.createKeyEndContract(rq.getSysUserRequest().getSysUserId(), rq.getAioContractDTO());
        cacheUtils.saveCacheObject(cacheUtils.REPO_END_CONTRACT_RQ, key, rq);
    }

    private void validateInStockGoodsBeforeEnd(AIOContractMobileRequest rq, Long isProvinceBought) {
        AIOContractDTO stock = aioContractDAO.getStock(rq.getSysUserRequest().getSysUserId());
        Double stockPrice = 0D;
        for (AIOContractDTO detail : rq.getLstAIOContractMobileDTO()) {
            List<String> serialList = detail.getTypeSerial() == 1 ? detail.getLstSerial() : detail.getLstSerialText();
            if (serialList != null && !serialList.isEmpty()) {
                for (String serial : serialList) {
                    AIOMerEntityDTO mer = new AIOMerEntityDTO();
                    mer.setSerial(serial);
                    mer.setStockId(stock.getStockId());
                    mer.setGoodsId(detail.getGoodsId());
                    mer.setState("1");
                    AIOMerEntityDTO merEntityDto = aioContractDAO.findBySerial(mer);
                    if (merEntityDto == null) {
                        throw new BusinessException(AIOErrorType.GOODS_NOT_IN_STOCK.msg);
                    }
                    stockPrice += merEntityDto.getApplyPrice();
                }
            } else {
                List<AIOMerEntityDTO> availableGoods = aioContractDAO.findByGoodsForExport(detail.getGoodsId(), "1", stock.getStockId());
                if (availableGoods == null || availableGoods.size() == 0) {
                    throw new BusinessException(AIOErrorType.GOODS_NOT_IN_STOCK.msg);
                }

                Double exportAmount = detail.getQuantity();
//                Double amountSum = aioContractDAO.findByGoodsForExportSum(detail.getGoodsId(), "1", stock.getStockId());
                Double amountSum = availableGoods.stream().mapToDouble(AIOMerEntityDTO::getAmount).sum();
                if (exportAmount - amountSum > 0) {
                    throw new BusinessException(AIOErrorType.INSUFFICIENT_GOODS_IN_STOCK.msg);
                }
                stockPrice += availableGoods.get(0).getApplyPrice() * detail.getQuantity();
            }
        }

        if (isProvinceBought.equals(1L)) {
            if (stockPrice * rq.getIndustryScale() > (rq.getAioContractDTO().getAmount() / 1.1)) {
                throw new BusinessException(AIOErrorType.STOCK_PRICE_BELOW_SALE_PRICE.msg);
            }
        }
    }

    Long finishContractByPayType(AIOContractMobileRequest dto, AIOContractDTO info) {
        // payType = 1 vtpay, tt luong moi
        // paytype = 2 ko qua vtpay, tt nhu bt
        if (dto.getAioContractDTO().getPayType() == 2) {
            this.finishPackageInContract(dto);
            this.updateContractPerformDateEndDate(info.getContractId());
            return 2L;
        } else {
            AIOContractDTO countDetail = contractDAO.countContractDetail(info.getContractId());
            if (countDetail != null && countDetail.getTotal() - countDetail.getDone() == 1) {
                // check province bought
                this.validateInStockGoodsBeforeEnd(dto, info.getIsProvinceBought());
                this.saveRequestEndContract(dto);
                return 1L;
            } else {
                this.finishPackageInContract(dto);
                return 2L;
            }
        }
    }
}
