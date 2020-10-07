package com.viettel.aio.business;

import com.viettel.aio.bo.AIOPackageBO;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.dao.*;
import com.viettel.aio.dto.*;
import com.viettel.cat.dao.CatProvinceDAO;
import com.viettel.cat.dto.CatProvinceDTO;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.aio.dto.ExcelErrorDTO;
import com.viettel.coms.dto.GoodsDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;
import org.apache.commons.lang3.StringUtils;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
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
import java.io.IOException;
import java.util.*;

//VietNT_20190104_created
@Service("aioPackageBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOPackageBusinessImpl extends BaseFWBusinessImpl<AIOPackageDAO, AIOPackageDTO, AIOPackageBO> implements AIOPackageBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIOPackageBusinessImpl.class);

    @Autowired
    public AIOPackageBusinessImpl(AIOPackageDAO aioPackageDAO, AIOPackageDetailDAO aioPackageDetailDAO,
                                  AIOPackageGoodsAddDAO aioPackageGoodsAddDAO, AIOPackageGoodsDAO aioPackageGoodsDAO,
                                  AIOPackageDetailPriceDAO aioPackageDetailPriceDAO, CatProvinceDAO catProvinceDAO,
                                  CommonServiceAio commonService, AIOPackagePromotionDAO aioPackagePromotionDAO,
                                  AIOPackageConfigSalaryDAO aioPackageConfigSalaryDAO) {
        this.aioPackageDAO = aioPackageDAO;
        this.aioPackageDetailDAO = aioPackageDetailDAO;
        this.aioPackageGoodsAddDAO = aioPackageGoodsAddDAO;
        this.aioPackageGoodsDAO = aioPackageGoodsDAO;
        this.aioPackageDetailPriceDAO = aioPackageDetailPriceDAO;
        this.catProvinceDAO = catProvinceDAO;
        this.commonService = commonService;
        this.aioPackagePromotionDAO = aioPackagePromotionDAO;
        this.aioPackageConfigSalaryDAO = aioPackageConfigSalaryDAO;
    }

    private AIOPackageDAO aioPackageDAO;
    private AIOPackageDetailDAO aioPackageDetailDAO;
    private AIOPackageGoodsAddDAO aioPackageGoodsAddDAO;
    private AIOPackageGoodsDAO aioPackageGoodsDAO;
    private AIOPackageDetailPriceDAO aioPackageDetailPriceDAO;
    private CatProvinceDAO catProvinceDAO;
    private CommonServiceAio commonService;
    private AIOPackagePromotionDAO aioPackagePromotionDAO;
    private AIOPackageConfigSalaryDAO aioPackageConfigSalaryDAO;

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

    public static final String ATTACHMENT_TYPE = "104";
    public static final String ATTACHMENT_DESC = "File chủ trương KM";
    private final String TEMPLATE_NAME = "Bieu_mau_don_gia_goi.xlsx";

    //VietNT_09/07/2019_start
    private HashMap<Integer, String> colAlias = new HashMap<>();
    {
        colAlias.put(0, "A");
        colAlias.put(1, "B");
        colAlias.put(2, "C");
        colAlias.put(3, "D");
        colAlias.put(4, "E");
        colAlias.put(5, "F");
        colAlias.put(6, "G");
        colAlias.put(7, "H");
        colAlias.put(8, "I");
    }

    private HashMap<Integer, String> colName = new HashMap<>();
    {
        colName.put(0, "MÃ TỈNH");
        colName.put(1, "ĐƠN GIÁ");
        colName.put(2, "GIAO CNKT");
        colName.put(3, "TỶ LỆ GIAO CNKT");
        colName.put(4, "HÌNH THỨC GIAO NHÂN VIÊN");
        colName.put(5, "BÁN HÀNG");
        colName.put(6, "THỰC HIỆN");
        colName.put(7, "NHÂN VIÊN AIO");
        colName.put(8, "GIÁM ĐỐC CNKT");
    }
    //VietNT_end

    private final String ENGINE_CAPACITY = "ENGINE_CAPACITY";
    private final String GOODS_TYPE = "GOODS_TYPE";
    private final String LOCATION_TYPE = "LOCATION_TYPE";
    private final String SALE_CHANNEL = "SALE_CHANNEL";
    private final Long PACKAGE_TYPE_SERVICE = 1L;
    private final Long PACKAGE_TYPE_SALE = 2L;
    private final Long PROVINCE_BOUGHT = 1L;
    private final Long COMPANY_BOUGHT = 2L;
    private final Double PER_DEPT_ASSIGNMENT_SERVICE = 90D;
    private final Double PER_DEPT_ASSIGNMENT_SALE = 95D;

    public DataListDTO doSearchPackage(AIOPackageDTO criteria) {
        List<AIOPackageDTO> dtos = aioPackageDAO.doSearchPackage(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public AIOPackageResponse getEngineGoodsLocationList() {
        List<AppParamDTO> listAll = aioPackageDAO.getAppParamList(Arrays.asList(ENGINE_CAPACITY, GOODS_TYPE, LOCATION_TYPE, SALE_CHANNEL));

//        List<AppParamDTO> engineCapacityList = new ArrayList<>();
//        List<AppParamDTO> goodsList = new ArrayList<>();
//        List<AppParamDTO> locationList = new ArrayList<>();
//        List<AppParamDTO> saleChannelList = new ArrayList<>();

//        for (AppParamDTO dto: listAll) {
//            if (dto.getParType().equals(ENGINE_CAPACITY)) {
//                engineCapacityList.add(dto);
//            } else if (dto.getParType().equals(GOODS_TYPE)) {
//                goodsList.add(dto);
//            } else if (dto.getParType().equals(LOCATION_TYPE)) {
//                locationList.add(dto);
//            } else {
//                saleChannelList.add(dto);
//            }
//        }

        AIOPackageResponse res = new AIOPackageResponse();
        res.setEngineCapacityList(listAll);
//        res.setGoodsList(goodsList);
//        res.setLocationList(locationList);
//        res.setSaleChannelList(saleChannelList);

        return res;
    }

    public DataListDTO getGoodsList(GoodsDTO criteria) {
        List<GoodsDTO> dtos = aioPackageDAO.getGoodsList(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);

        return dataListDTO;
    }

    private final String EMPTY_REQUEST = "Không có dữ liệu";
    private final String SAVE_PACKAGE_ERROR = "Lưu gói thất bại!";
    private final String DUPLICATE_PACKAGE_CODE_ERROR = "Mã gói đã tồn tại";
    private final String SAVE_PACKAGE_DETAIL_ERROR = "Lưu cấu hình gói thất bại!";
    private final String SAVE_PACKAGE_GOODS_ERROR = "Lưu cấu hình vật tư thất bại!";
    private final String SAVE_PACKAGE_PRICE_ERROR = "Lưu cấu hình giá thất bại!";
    private final String PACKAGE_NOT_FOUND = "Không tìm thấy gói";

    private void validateRequestData(AIOPackageRequest rq) {
        if (rq.getAioPackageDTO() == null || rq.getDetailDTOS() == null) {
            throw new BusinessException(EMPTY_REQUEST);
        }
    }

    public void updatePackage(AIOPackageRequest rq) {
        this.validateRequestData(rq);

        AIOPackageDTO aioPackageDTO = rq.getAioPackageDTO();
        List<AIOPackageDetailDTO> detailDTOS = rq.getDetailDTOS();

        // find by id, expected 1 record
        AIOPackageDTO criteria = new AIOPackageDTO();
        criteria.setAioPackageId(aioPackageDTO.getAioPackageId());
        AIOPackageDTO match = this.getPackageById(criteria);

        // status giong nhau khong phai du bi => return
        if (aioPackageDTO.getStatus().equals(match.getStatus()) && aioPackageDTO.getStatus() != 2) {
            return;
        }

        // status chuyen tu du bi sang hieu luc => add date
        if (match.getStatus() == 2 && aioPackageDTO.getStatus() == 1) {
            Date today = new Date();
//            long hoursToMillis = (long) (aioPackageDTO.getTime() * 3600 * 1000);
            aioPackageDTO.setStartDate(today);
//            aioPackageDTO.setEndDate(new Date(today.getTime() + hoursToMillis));
        }

        Long resultUpdate = aioPackageDAO.updateObject(aioPackageDTO.toModel());
        if (resultUpdate == null || resultUpdate == 0) {
            throw new BusinessException(SAVE_PACKAGE_ERROR);
        }

        // status khong phai du bi thi khong duoc sua detail => return
        if (match.getStatus() == 1 || match.getStatus() == 0) {
            return;
        }

        this.deleteOldPackageInfo(aioPackageDTO.getAioPackageId());

        this.saveListPackageInfo(aioPackageDTO.getAioPackageId(), detailDTOS, aioPackageDTO.getPackageType(), aioPackageDTO.getIsProvinceBought());
    }

    private void deleteOldPackageInfo(Long idPackage) {
        List<AIOPackageDetailDTO> detailsOnDb = aioPackageDAO.getDetailByPackageId(idPackage);
        for (AIOPackageDetailDTO dto : detailsOnDb) {
            aioPackageDetailDAO.delete(dto.toModel());
        }

        List<AIOPackageGoodsDTO> goodsOnDb = aioPackageDAO.getGoodsByPackageId(idPackage);
        for (AIOPackageGoodsDTO dto : goodsOnDb) {
            aioPackageGoodsDAO.delete(dto.toModel());
        }

        List<AIOPackageGoodsAddDTO> goodsAddOnDb = aioPackageDAO.getGoodsAddByPackageId(idPackage);
        for (AIOPackageGoodsAddDTO dto : goodsAddOnDb) {
            aioPackageGoodsAddDAO.delete(dto.toModel());
        }

        List<AIOPackageDetailPriceDTO> priceListOnDb = aioPackageDAO.getPriceListByPackageId(idPackage);
        for (AIOPackageDetailPriceDTO dto : priceListOnDb) {
            aioPackageDetailPriceDAO.delete(dto.toModel());
        }
    }

    public void addNewPackage(AIOPackageRequest rq, SysUserCOMSDTO user) {
        this.validateRequestData(rq);

        AIOPackageDTO aioPackageDTO = rq.getAioPackageDTO();
        List<AIOPackageDetailDTO> detailDTOS = rq.getDetailDTOS();

        // check permission create
        this.checkPermissionCreatePackageCompany(aioPackageDTO);

        // check unique
        int count = aioPackageDAO.countPackageByCode(Collections.singletonList(aioPackageDTO.getCode()));
        if (count > 0) {
            throw new BusinessException(DUPLICATE_PACKAGE_CODE_ERROR);
        }

        // set startDate = sysDate for status = 1
        if (aioPackageDTO.getStatus() == 1) {
            Date today = new Date();
//            long hoursToMillis = (long) (aioPackageDTO.getTime() * 3600 * 1000);
            aioPackageDTO.setStartDate(today);
//            aioPackageDTO.setEndDate(new Date(today.getTime() + hoursToMillis));
        }
        // try save package
        Long idPackage = this.saveAIOPackage(aioPackageDTO);
        if (idPackage == null || idPackage == 0) {
            throw new BusinessException(SAVE_PACKAGE_ERROR);
        }

        commonService.saveAttachment(aioPackageDTO.getListFilePromotion(), idPackage, ATTACHMENT_TYPE, ATTACHMENT_DESC,
                folderUpload, inputSubFolderUpload,
                user.getSysUserId(), user.getFullName());

        // try save detail & goods data
        this.saveListPackageInfo(idPackage, detailDTOS, aioPackageDTO.getPackageType(), aioPackageDTO.getIsProvinceBought());
    }

    private Long saveAIOPackage(AIOPackageDTO dto) {
        return aioPackageDAO.saveObject(dto.toModel());
    }

    private void saveListPackageInfo(Long idPackage, List<AIOPackageDetailDTO> detailDTOS, Long packageType,
                                     //VietNT_08/07/2019_start
                                     Long isProvinceBought) {
                                     //VietNT_end
        Long idDetail;
        List<AIOPackageGoodsDTO> goodsDTOS;
        List<AIOPackageGoodsAddDTO> goodsAddDTOS;
        List<AIOPackageDetailPriceDTO> priceDTOList;
        List<AIOPackagePromotionDTO> promotionDTOS;
        List<AIOPackageConfigSalaryDTO> configs;
        for (AIOPackageDetailDTO detailDTO : detailDTOS) {
            detailDTO.setAioPackageId(idPackage);
            //VietNT_08/07/2019_start
            detailDTO.setIsProvinceBought(isProvinceBought);
            //VietNT_end
            idDetail = aioPackageDetailDAO.saveObject(detailDTO.toModel());
            detailDTO.setAioPackageDetailId(idDetail);
            if (idDetail == null || idDetail == 0) {
                throw new BusinessException(SAVE_PACKAGE_DETAIL_ERROR);
            }

            goodsDTOS = detailDTO.getPackageGoodsData();
            if (goodsDTOS != null && !goodsDTOS.isEmpty()) {
                this.saveListPackageGoods(idPackage, idDetail, goodsDTOS, packageType);
            }

            goodsAddDTOS = detailDTO.getPackageGoodsAddData();
            if (goodsAddDTOS != null && !goodsAddDTOS.isEmpty()) {
                this.saveListPackageGoodsAdd(idPackage, idDetail, goodsAddDTOS);
            }

            priceDTOList = detailDTO.getPriceList();
            if (priceDTOList != null && !priceDTOList.isEmpty()) {
                this.saveListPrice(idPackage, idDetail, priceDTOList, packageType, isProvinceBought);
            } else {
                throw new BusinessException("Chưa nhập đủ ĐƠN GIÁ cho gói");
            }

            promotionDTOS = detailDTO.getPromotionDTOS();
            if (detailDTO.getTypePromotion() != null) {
                this.savePromotionPackage(detailDTO, promotionDTOS);
            }

            configs = detailDTO.getConfigs();
            if (configs != null) {
                this.saveSalaryConfigs(idPackage, idDetail, configs);
            }
        }
    }

    @SuppressWarnings("Duplicates")
    private void saveListPackageGoods(Long idPackage, Long idDetail, List<AIOPackageGoodsDTO> goodsDTOS, Long packageType) {
        Long idGoods;
        for (AIOPackageGoodsDTO dto : goodsDTOS) {
            dto.setAioPackageId(idPackage);
            dto.setAioPackageDetailId(idDetail);
            if (packageType == 2) {
                dto.setType(dto.getRequired() ? 1L : 2L);
            } else {
                dto.setType(1L);
            }

            idGoods = aioPackageGoodsDAO.saveObject(dto.toModel());
            if (idGoods == 0) {
                throw new BusinessException(SAVE_PACKAGE_GOODS_ERROR);
            }
        }
    }

    @SuppressWarnings("Duplicates")
    private void saveListPackageGoodsAdd(Long idPackage, Long idDetail, List<AIOPackageGoodsAddDTO> goodsAddDTOS) {
        Long idGoodsAdd;
        for (AIOPackageGoodsAddDTO dto : goodsAddDTOS) {
            dto.setAioPackageId(idPackage);
            dto.setAioPackageDetailId(idDetail);

            idGoodsAdd = aioPackageGoodsAddDAO.saveObject(dto.toModel());
            if (idGoodsAdd == 0) {
                throw new BusinessException(SAVE_PACKAGE_GOODS_ERROR);
            }
        }
    }

    private void saveListPrice(Long idPackage, Long idDetail, List<AIOPackageDetailPriceDTO> priceList,
                               Long packageType, Long isProvinceBought) {
        Double perDeptAssign = null;
        boolean provinceBought = isProvinceBought.equals(PROVINCE_BOUGHT);
        if (provinceBought) {
            if (packageType.equals(PACKAGE_TYPE_SERVICE)) {
                perDeptAssign = PER_DEPT_ASSIGNMENT_SERVICE;
            } else {
                perDeptAssign = PER_DEPT_ASSIGNMENT_SALE;
            }
        }
        Long id;
        for (AIOPackageDetailPriceDTO dto : priceList) {
            dto.setPackageId(idPackage);
            dto.setPackageDetailId(idDetail);
            if (provinceBought) {
                dto.setPerDepartmentAssignment(perDeptAssign);
            }

            id = aioPackageDetailPriceDAO.saveObject(dto.toModel());
            if (id == 0) {
                throw new BusinessException(SAVE_PACKAGE_PRICE_ERROR);
            }
        }
    }

    private void saveSalaryConfigs(Long idPackage, Long idDetail, List<AIOPackageConfigSalaryDTO> configs) {
        Long id;
        for (AIOPackageConfigSalaryDTO dto : configs) {
            dto.setPackageId(idPackage);
            dto.setPackageDetailId(idDetail);

            id = aioPackageConfigSalaryDAO.saveObject(dto.toModel());
            if (id == 0) {
                throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + AIOObjectType.CONFIG_SALARY.getName());
            }
        }
    }

    private AIOPackageDTO getPackageById(AIOPackageDTO criteria) {
        List<AIOPackageDTO> list = aioPackageDAO.doSearchPackage(criteria);
        if (list == null || list.isEmpty()) {
            throw new BusinessException(PACKAGE_NOT_FOUND);
        }
        return list.get(0);
    }

    @SuppressWarnings("Duplicates")
    public AIOPackageRequest getDetailById(Long id) {
        if (id == null) {
            throw new BusinessException(PACKAGE_NOT_FOUND);
        }
        AIOPackageDTO criteria = new AIOPackageDTO();
        criteria.setAioPackageId(id);
        AIOPackagePromotionDTO obj = new AIOPackagePromotionDTO();
        obj.setPackageId(id);

        AIOPackageDTO dto = this.getPackageById(criteria);
        List<AIOPackageDetailDTO> detailList = aioPackageDAO.getDetailByPackageId(id);
        List<AIOPackageGoodsDTO> goodsList = aioPackageDAO.getGoodsByPackageId(id);
        List<AIOPackageGoodsAddDTO> goodsAddList = aioPackageDAO.getGoodsAddByPackageId(id);
        List<AIOPackageDetailPriceDTO> priceList = aioPackageDAO.getPriceListByPackageId(id);
        List<AIOPackagePromotionDTO> promoList = aioPackagePromotionDAO.getListPromotions(obj);
        List<UtilAttachDocumentDTO> files = commonService.getListAttachmentByIdAndType(Collections.singletonList(id),
                Collections.singletonList(ATTACHMENT_TYPE), 0);
        dto.setListFilePromotion(files);
        List<AIOPackageConfigSalaryDTO> configList = aioPackageConfigSalaryDAO.getListPackageConfigSalaryByPackageId(id);

        Map<Long, List<AIOPackageGoodsDTO>> goodsMap = new HashMap<>();
        goodsList.forEach(goods -> {
            goods.setRequired(goods.getType() != null && goods.getType() == 1);
            if (goodsMap.containsKey(goods.getAioPackageDetailId())) {
                goodsMap.get(goods.getAioPackageDetailId()).add(goods);
            } else {
                goodsMap.put(goods.getAioPackageDetailId(), new ArrayList<>(Collections.singletonList(goods)));
            }
        });

        Map<Long, List<AIOPackageGoodsAddDTO>> goodsAddMap = new HashMap<>();
        goodsAddList.forEach(goods -> {
            if (goodsAddMap.containsKey(goods.getAioPackageDetailId())) {
                goodsAddMap.get(goods.getAioPackageDetailId()).add(goods);
            } else {
                goodsAddMap.put(goods.getAioPackageDetailId(), new ArrayList<>(Collections.singletonList(goods)));
            }
        });

        Map<Long, List<AIOPackageDetailPriceDTO>> priceMap = new HashMap<>();
        priceList.forEach(price -> {
            if (priceMap.containsKey(price.getPackageDetailId())) {
                priceMap.get(price.getPackageDetailId()).add(price);
            } else {
                priceMap.put(price.getPackageDetailId(), new ArrayList<>(Collections.singletonList(price)));
            }
        });

        Map<Long, List<AIOPackagePromotionDTO>> promoMap = new HashMap<>();
        promoList.forEach(p -> {
            if (promoMap.containsKey(p.getPackageDetailId())) {
                promoMap.get(p.getPackageDetailId()).add(p);
            } else {
                promoMap.put(p.getPackageDetailId(), new ArrayList<>(Collections.singletonList(p)));
            }
        });

        Map<Long, List<AIOPackageConfigSalaryDTO>> configMap = new HashMap<>();
        configList.forEach(cfg -> {
            if (configMap.containsKey(cfg.getPackageDetailId())) {
                configMap.get(cfg.getPackageDetailId()).add(cfg);
            } else {
                configMap.put(cfg.getPackageDetailId(), new ArrayList<>(Collections.singletonList(cfg)));
            }
        });

        for (AIOPackageDetailDTO detail : detailList) {
            List<AIOPackageGoodsDTO> goodsDTOS = goodsMap.get(detail.getAioPackageDetailId());
            List<AIOPackageGoodsAddDTO> goodsAddDTOS = goodsAddMap.get(detail.getAioPackageDetailId());
            List<AIOPackageDetailPriceDTO> priceDTOList = priceMap.get(detail.getAioPackageDetailId());
            List<AIOPackagePromotionDTO> promotionDTOS = promoMap.get(detail.getAioPackageDetailId());
            List<AIOPackageConfigSalaryDTO> configs = configMap.get(detail.getAioPackageDetailId());

            List emptyList = new ArrayList();
            detail.setPackageGoodsData(goodsDTOS != null ? goodsDTOS : emptyList);
            detail.setPackageGoodsAddData(goodsAddDTOS != null ? goodsAddDTOS : emptyList);
            detail.setPriceList(priceDTOList != null ? priceDTOList : emptyList);
            detail.setConfigs(configs != null ? configs : emptyList);
            if (promotionDTOS != null && !promotionDTOS.isEmpty()) {
                detail.setTypePromotion(promotionDTOS.get(0).getType());
                detail.setPromotionDTOS(promotionDTOS);
            } else {
                detail.setPromotionDTOS(emptyList);
            }
        }

        AIOPackageRequest res = new AIOPackageRequest();
        res.setAioPackageDTO(dto);
        res.setDetailDTOS(detailList);

        return res;
    }

    public void deletePackage(Long id) {
        if (id == null) {
            throw new BusinessException(PACKAGE_NOT_FOUND);
        }
        AIOPackageDTO criteria = new AIOPackageDTO();
        criteria.setAioPackageId(id);

        AIOPackageDTO dto = this.getPackageById(criteria);
        if (dto == null) {
            throw new BusinessException(PACKAGE_NOT_FOUND);
        }

        if (dto.getStatus() == 1) {
            dto.setEndDate(new Date());
        }
        dto.setStatus(0L);

        aioPackageDAO.updateObject(dto.toModel());
    }

    /**
     * @param option: 0: no package, 1: package provinceBought, 2: package company
     */
    @SuppressWarnings("Duplicates")
    public List<AIOPackageDetailPriceDTO> readFilePackagePrice(Attachment attachment, HttpServletRequest request, int option)
            throws IOException {
        String path = commonService.uploadToServer(attachment, request);
        XSSFWorkbook workbook = null;
        List<AIOPackageDetailPriceDTO> priceDTOS = new ArrayList<>();
        List<ExcelErrorDTO> errorList = new ArrayList<>();

        // get permission
        List<String> provinceIdsPermission = this.getProvinceInPermission(request);
        boolean havePermission = !provinceIdsPermission.isEmpty();

        try {
            File f = new File(path);
            workbook = new XSSFWorkbook(f);

//        InputStream inputStream = attachment.getDataHandler().getInputStream();
//        XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
            XSSFSheet sheet = workbook.getSheetAt(0);

            CatProvinceDTO criteria = new CatProvinceDTO();
            if (havePermission) {
                criteria.setIdList(provinceIdsPermission);
            }
            List<CatProvinceDTO> provinces = catProvinceDAO.doSearch(criteria);
            Map<String, CatProvinceDTO> provincesMap = new HashMap<>();
            List<Long> addedProvinceIds = new ArrayList<>();
            for (CatProvinceDTO province: provinces) {
                provincesMap.put(province.getCode().toUpperCase(), province);
            }

            DataFormatter formatter = new DataFormatter();
            for (Row row: sheet) {
                if (row.getRowNum() == 2) {
                    this.validateFileContent(row, formatter);
                }

                if (row.getRowNum() < 3) {
                    continue;
                }

                if (this.checkEmptyRowSkipFollowing(row, option)) {
                    if (row.getRowNum() == 3) {
                        errorList.add(commonService.createErrorAio(row.getRowNum() + 1, "", "", "Không có dữ liệu"));
                    }
                    break;
                }

                int rowPrintError = row.getRowNum() + 1;
                AIOPackageDetailPriceDTO validated = this.readExcelNotPackage(row, formatter, provincesMap, addedProvinceIds, errorList);
//                if (option == 1) {
//                    int columnData = 3;
//                    String assignmentPercentStr = formatter.formatCellValue(row.getCell(columnData));
//                    Double assignmentPercent = -1D;
//                    if (StringUtils.isNotEmpty(assignmentPercentStr)) {
//                        try {
//                            // check decimal & "," symbol
//                            if (assignmentPercentStr.contains(".") || assignmentPercentStr.contains(",")) {
//                                errorList.add(commonService.createErrorAio(rowPrintError, colAlias.get(columnData), colName.get(columnData), "phải là số nguyên"));
//                            } else {
//                                assignmentPercent = Double.parseDouble(assignmentPercentStr);
//                            }
//
//                            // check > 0
//                            if (assignmentPercent < 0 || assignmentPercent > 100) {
//                                errorList.add(commonService.createErrorAio(rowPrintError, colAlias.get(columnData), colName.get(columnData), "phải nằm trong khoảng 0 - 100"));
//                            }
//
//                        } catch (NumberFormatException e) {
//                            errorList.add(commonService.createErrorAio(rowPrintError, colAlias.get(columnData), colName.get(columnData), "Sai kiểu dữ liệu"));
//                        }
//                    }
//
//                    if (assignmentPercent >= 0) {
//                        validated.setPerDepartmentAssignment(assignmentPercent);
//                    } else {
//                        errorList.add(commonService.createErrorAio(rowPrintError, colAlias.get(columnData),
//                                colName.get(columnData), "Bắt buộc nhập với gói tỉnh mua hàng!"));
//                    }
//                } else
                if (option == 2) {
                    int columnData = 2;
                    String assignmentAmountStr = formatter.formatCellValue(row.getCell(columnData));
                    Double assignmentAmount = -1D;
                    if (StringUtils.isNotEmpty(assignmentAmountStr)) {
                        try {
                            // replace "," from input
                            assignmentAmountStr = StringUtils.removeAll(assignmentAmountStr, ",");

                            // check decimal symbol
                            if (assignmentAmountStr.contains(".")) {
                                errorList.add(commonService.createErrorAio(rowPrintError, colAlias.get(columnData),
                                        colName.get(columnData), "phải là số nguyên"));
                            } else {
                                assignmentAmount = Double.parseDouble(assignmentAmountStr);
                            }

                            // check > 0
                            if (assignmentAmount < 0) {
                                errorList.add(commonService.createErrorAio(rowPrintError, colAlias.get(columnData),
                                        colName.get(columnData), "phải lớn hơn hoặc bằng 0"));
                            }

                        } catch (NumberFormatException e) {
                            errorList.add(commonService.createErrorAio(rowPrintError, colAlias.get(columnData),
                                    colName.get(columnData), "Sai kiểu dữ liệu"));
                        }
                    }

                    if (assignmentAmount >= 0) {
                        validated.setDepartmentAssignment(assignmentAmount);
                    } else {
                        errorList.add(commonService.createErrorAio(rowPrintError, colAlias.get(columnData),
                                colName.get(columnData), "Bắt buộc nhập với gói công ty mua hàng!"));
                    }
                }

//                if (option != 0) {
//                    int columnData = 3;
//                    String assignmentPercentStr = formatter.formatCellValue(row.getCell(columnData));
//                    Double assignmentPercent = -1D;
//                    if (StringUtils.isNotEmpty(assignmentPercentStr)) {
//                        try {
//                            // check decimal & "," symbol
//                            if (assignmentPercentStr.contains(".") || assignmentPercentStr.contains(",")) {
//                                errorList.add(commonService.createErrorAio(rowPrintError, colAlias.get(columnData), colName.get(columnData), "phải là số nguyên"));
//                            } else {
//                                assignmentPercent = Double.parseDouble(assignmentPercentStr);
//                            }
//
//                            // check > 0
//                            if (assignmentPercent < 0 || assignmentPercent > 100) {
//                                errorList.add(commonService.createErrorAio(rowPrintError, colAlias.get(columnData), colName.get(columnData), "phải nằm trong khoảng 0 - 100"));
//                            }
//
//                        } catch (NumberFormatException e) {
//                            errorList.add(commonService.createErrorAio(rowPrintError, colAlias.get(columnData), colName.get(columnData), "Sai kiểu dữ liệu"));
//                        }
//                    }
//
//                    columnData = 2;
//                    String assignmentAmountStr = formatter.formatCellValue(row.getCell(columnData));
//                    Double assignmentAmount = -1D;
//                    if (StringUtils.isNotEmpty(assignmentAmountStr)) {
//                        try {
//                            // replace "," from input
//                            assignmentAmountStr = StringUtils.removeAll(assignmentAmountStr, ",");
//
//                            // check decimal symbol
//                            if (assignmentAmountStr.contains(".")) {
//                                errorList.add(commonService.createErrorAio(rowPrintError, colAlias.get(columnData),
//                                        colName.get(columnData), "phải là số nguyên"));
//                            } else {
//                                assignmentAmount = Double.parseDouble(assignmentAmountStr);
//                            }
//
//                            // check > 0
//                            if (assignmentAmount < 0) {
//                                errorList.add(commonService.createErrorAio(rowPrintError, colAlias.get(columnData),
//                                        colName.get(columnData), "phải lớn hơn hoặc bằng 0"));
//                            }
//
//                        } catch (NumberFormatException e) {
//                            errorList.add(commonService.createErrorAio(rowPrintError, colAlias.get(columnData),
//                                    colName.get(columnData), "Sai kiểu dữ liệu"));
//                        }
//                    }
//
//                    if (assignmentPercent >= 0 && assignmentAmount < 0) {
//                        validated.setPerDepartmentAssignment(assignmentPercent);
//                    } else if (assignmentPercent < 0 && assignmentAmount >= 0) {
//                        validated.setDepartmentAssignment(assignmentAmount);
//                    } else {
//                        errorList.add(commonService.createErrorAio(rowPrintError, colAlias.get(columnData),
//                                colName.get(columnData), "Chỉ nhập 1 trong 2 cột C hoặc D"));
//                    }
//
//                    this.readExcelProvinceBought(row, formatter, validated, errorList);
//                }

                // if no error add dto
                if (errorList.size() == 0) {
                    priceDTOS.add(validated);
                }
            }

            if (errorList.size() > 0) {
                String filePathError = UEncrypt.encryptFileUploadPath(path);
                commonService.doWriteErrorAio(errorList, priceDTOS, filePathError, new AIOPackageDetailPriceDTO(), 4);
            }

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

            commonService.doWriteErrorAio(errorList, priceDTOS, filePathError, new AIOPackageDetailPriceDTO(), 4);
        } finally {
            if (workbook != null) {
                workbook.close();
            }
        }

        return priceDTOS;
    }

    //VietNT_09/07/2019_start
    private boolean checkEmptyRowSkipFollowing(Row row, int option) {
        int countEmpty = 0;
        int[] columnCheck;
        Cell cell;
        switch (option) {
            case 0:
                columnCheck = new int[]{0, 1};
                break;
            case 1:
                columnCheck = new int[]{0, 1, 3};
                break;
            case 2:
                columnCheck = new int[]{0, 1, 2};
                break;
            default:
                return false;
        }

        for (int value : columnCheck) {
            cell = row.getCell(value);
            if (cell == null || cell.getCellType() == Cell.CELL_TYPE_BLANK) {
                countEmpty++;
            }
        }
        return countEmpty == columnCheck.length;
    }

    private AIOPackageDetailPriceDTO readExcelNotPackage(Row row, DataFormatter formatter, Map<String, CatProvinceDTO> provinceMap,
                                     List<Long> addedProvinceIds, List<ExcelErrorDTO> errorList) {
        int rowPrintError = row.getRowNum() + 1;
        String code = formatter.formatCellValue(row.getCell(0));
        String priceStr = formatter.formatCellValue(row.getCell(1));

        AIOPackageDetailPriceDTO validated = new AIOPackageDetailPriceDTO();
        if (this.validateProvinceCode(rowPrintError, code, provinceMap, addedProvinceIds, errorList)) {
            CatProvinceDTO dto = provinceMap.get(code.toUpperCase());

            validated.setProvinceId(dto.getCatProvinceId());
            validated.setProvinceCode(dto.getCode());
            validated.setProvinceName(dto.getName());
        }

        int columnData = 1;
        Double price = this.validateCurrency(rowPrintError, columnData, priceStr, errorList);
        if (price > 0) {
            validated.setPrice(price);
        }

        return validated;
    }

    private void readExcelProvinceBought(Row row, DataFormatter formatter, AIOPackageDetailPriceDTO validated, List<ExcelErrorDTO> errorList) {
        int rowPrintError = row.getRowNum() + 1;
        String typeStr = formatter.formatCellValue(row.getCell(4));
        String saleStr = formatter.formatCellValue(row.getCell(5));
        String performerStr = formatter.formatCellValue(row.getCell(6));
        String aioStaffStr = formatter.formatCellValue(row.getCell(7));
        String managerStr = formatter.formatCellValue(row.getCell(8));
        String colsAlias = new StringJoiner(", ")
                .add(colAlias.get(5))
                .add(colAlias.get(6))
                .add(colAlias.get(7))
                .add(colAlias.get(8)).toString();

        String colsName = new StringJoiner(", ")
                .add(colName.get(5))
                .add(colName.get(6))
                .add(colName.get(7))
                .add(colName.get(8)).toString();

        Long type = this.validateTypeMoney(rowPrintError, typeStr, errorList);
        if (type > 0) {
            validated.setType(Long.parseLong(typeStr));

            if (type == 1) {
                Double sale = this.validatePercent(rowPrintError, 5, saleStr, errorList);
                Double performer = this.validatePercent(rowPrintError, 6, performerStr, errorList);
                Double aioStaff = this.validatePercent(rowPrintError, 7, aioStaffStr, errorList);
                Double manager = this.validatePercent(rowPrintError, 8, managerStr, errorList);
                if (sale >= 0 && performer >= 0 && aioStaff >= 0 && manager >= 0) {
                    if (sale + performer + aioStaff + manager == 100) {
                        validated.setSales(sale);
                        validated.setPerformer(performer);
                        validated.setStaffAio(aioStaff);
                        validated.setManager(manager);
                    } else {
                        errorList.add(commonService.createErrorAio(rowPrintError, colsAlias, colsName
                                , "Tổng lương không = 100%"));
                    }
                }
            } else if (type == 2) {
                Double sale = this.validateCurrency(rowPrintError, 5, saleStr, errorList);
                Double performer = this.validateCurrency(rowPrintError, 6, performerStr, errorList);
                Double aioStaff = this.validateCurrency(rowPrintError, 7, aioStaffStr, errorList);
                Double manager = this.validateCurrency(rowPrintError, 8, managerStr, errorList);

                if (sale >= 0 && performer >= 0 && aioStaff >= 0 && manager >= 0) {
                    if (validated.getDepartmentAssignment() != null) {
                        if ((sale + performer + aioStaff + manager) != validated.getDepartmentAssignment()) {
                            errorList.add(commonService.createErrorAio(rowPrintError, colsAlias, colsName
                                    , "Tổng lương không bằng tiền Giao CNKT"));
                        }
                    }

                    validated.setSales(sale);
                    validated.setPerformer(performer);
                    validated.setStaffAio(aioStaff);
                    validated.setManager(manager);
                }
            }
        }
    }

    // validate
    private boolean validateProvinceCode(int rowCount, String code, Map<String, CatProvinceDTO> provincesMap,
                                         List<Long> addedProvinceIds, List<ExcelErrorDTO> errorList) {
        boolean result = true;
        int columnData = 0;
        if (StringUtils.isNotEmpty(code)) {
            CatProvinceDTO dto = provincesMap.get(code.toUpperCase());
            if (dto == null) {
                errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData), colName.get(columnData), "Không hợp lệ"));
                result = false;
            } else {
                if (addedProvinceIds.contains(dto.getCatProvinceId())) {
                    errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData),
                            colName.get(columnData), "Trùng mã tỉnh: " + code));
                    result = false;
                } else {
                    addedProvinceIds.add(dto.getCatProvinceId());
                }
            }
        } else {
            errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData), colName.get(columnData), "Không được bỏ trống"));
            result = false;
        }
        return result;
    }

    private Double validateCurrency(int rowCount, int columnData, String priceStr, List<ExcelErrorDTO> errorList) {
        Double price = -1D;
        if (StringUtils.isNotEmpty(priceStr)) {
            try {
                // replace "," from input
                priceStr = StringUtils.removeAll(priceStr, ",");

                // check decimal symbol
                if (priceStr.contains(".")) {
//                    priceStr = priceStr.substring(0, index);
                    errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData),
                            colName.get(columnData), "phải là số nguyên"));
                } else {
                    price = Double.parseDouble(priceStr);
                }

                // check > 0
                if (price < 0) {
                    errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData),
                            colName.get(columnData), "phải lớn hơn hoặc bằng 0"));
                }

            } catch (NumberFormatException e) {
                errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData),
                        colName.get(columnData), "Sai kiểu dữ liệu"));
            }
        } else {
            errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData),
                    colName.get(columnData), "Không được bỏ trống"));
        }
        return price;
    }

    private Double validatePercent(int rowCount, int columnData, String percentStr, List<ExcelErrorDTO> errorList) {
        Double percent = -1D;

        if (StringUtils.isNotEmpty(percentStr)) {
            try {
                // check decimal & "," symbol
                if (percentStr.contains(".") || percentStr.contains(",")) {
                    errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData), colName.get(columnData), "phải là số nguyên"));
                } else {
                    percent = Double.parseDouble(percentStr);
                }

                // check > 0
                if (percent < 0 || percent > 100) {
                    errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData), colName.get(columnData), "phải nằm trong khoảng 0 - 100"));
                }

            } catch (NumberFormatException e) {
                errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData), colName.get(columnData), "Sai kiểu dữ liệu"));
            }
        } else {
            errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData), colName.get(columnData), "Không được bỏ trống"));
        }
        return percent;
    }

    private Long validateTypeMoney(int rowCount, String type, List<ExcelErrorDTO> errorList) {
        Long result = -1L;
        int columnData = 4;
        if (StringUtils.isNotEmpty(type)) {
            if (type.equals("1") || type.equals("2")) {
                result = Long.parseLong(type);
            } else {
                errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData), colName.get(columnData), "Sai kiểu dữ liệu"));
            }
        } else {
            errorList.add(commonService.createErrorAio(rowCount, colAlias.get(columnData), colName.get(columnData), "Không được bỏ trống"));
        }
        return result;
    }

    private void validateFileContent(Row row, DataFormatter formatter) {
        String header1 = formatter.formatCellValue(row.getCell(0));
        String header2 = formatter.formatCellValue(row.getCell(1));
        if (!header1.equals(colName.get(0)) || !header2.equals(colName.get(1))) {
            throw new BusinessException("Sai file biểu mẫu!");
        }
    }
    //VietNT_end

    /**
     * Create template with option
     * @param dtos   data list
     * @param option 1: Goi tinh mua - nhap ti le, 2: Goi Cty - nhap gia tri, 0: not package
     * @return String path to file
     * @throws Exception
     */
    public String createTemplatePackagePrice(List<AIOPackageDetailPriceDTO> dtos, int option, HttpServletRequest request) throws Exception {
        XSSFWorkbook workbook = commonService.createWorkbook(TEMPLATE_NAME);
        CellStyle style = workbook.createCellStyle();

        // get permission
        List<String> provinceIdsPermission = this.getProvinceInPermission(request);
        boolean havePermission = !provinceIdsPermission.isEmpty();

        // sheet 1, existing data
        XSSFSheet sheet = workbook.getSheetAt(0);
        //VietNT_09/07/2019_start
        // hide col base on option
        if (option == 2) {
            sheet.setColumnHidden(3, true);
        } else if (option == 1) {
            sheet.setColumnHidden(2, true);
            sheet.setColumnHidden(3, true);
        }

        // hide col by provinceBought
//        int columnSpecial = -1;
        if (option == 0) {
            for (int i = 2; i < 4; i++) {
                sheet.setColumnHidden(i, true);
            }

            // hide row note for option 1 2
//            XSSFRow rowToHide = sheet.createRow(1);
//            rowToHide.getCTRow().setHidden(true);

            // column width to display Note
//            sheet.setColumnWidth(1, 7680);
        }
        //VietNT_end
        CellStyle styleCurrency = ExcelUtils.styleText(sheet);
        styleCurrency.setDataFormat(sheet.getWorkbook().createDataFormat().getFormat("#,##0"));
        styleCurrency.setAlignment(HorizontalAlignment.RIGHT);
        int rowNum = 3;
        for (AIOPackageDetailPriceDTO detailPriceDTO : dtos) {
            XSSFRow row = sheet.createRow(rowNum);
            commonService.createExcelCell(row, 0, style).setCellValue(detailPriceDTO.getProvinceCode());
            commonService.createExcelCell(row, 1, styleCurrency).setCellValue(detailPriceDTO.getPrice());
            if (option == 2) {
                commonService.createExcelCell(row, 2, styleCurrency).setCellValue(detailPriceDTO.getDepartmentAssignment());
            } else if (option == 1) {
                commonService.createExcelCell(row, 3, styleCurrency).setCellValue(detailPriceDTO.getPerDepartmentAssignment());
            }
            //VietNT_09/07/2019_start
//            if (option != 0) {
////                Double assignment = option == 1 ? detailPriceDTO.getDepartmentAssignment() : detailPriceDTO.getPerDepartmentAssignment();
//                commonService.createExcelCell(row, 2, styleCurrency).setCellValue(detailPriceDTO.getDepartmentAssignment());
//                commonService.createExcelCell(row, 3, styleCurrency).setCellValue(detailPriceDTO.getPerDepartmentAssignment());
//                commonService.createExcelCell(row, 4, style).setCellValue(detailPriceDTO.getType());
//                commonService.createExcelCell(row, 5, styleCurrency).setCellValue(detailPriceDTO.getSales());
//                commonService.createExcelCell(row, 6, styleCurrency).setCellValue(detailPriceDTO.getPerformer());
//                commonService.createExcelCell(row, 7, styleCurrency).setCellValue(detailPriceDTO.getStaffAio());
//                commonService.createExcelCell(row, 8, styleCurrency).setCellValue(detailPriceDTO.getManager());
//            }
            //VietNT_end
            rowNum++;
        }

        // prepare unit data

        CatProvinceDTO criteria = new CatProvinceDTO();
        if (havePermission && option != 0) {
            criteria.setIdList(provinceIdsPermission);
        }
        List<CatProvinceDTO> provinces = catProvinceDAO.doSearch(criteria);
        commonService.addCellBorder(style);

        // get sheet 2
        sheet = workbook.getSheetAt(1);
        rowNum = 1;
        for (CatProvinceDTO provinceDTO : provinces) {
            XSSFRow row = sheet.createRow(rowNum);
            commonService.createExcelCell(row, 0, style).setCellValue(provinceDTO.getCode());
            commonService.createExcelCell(row, 1, style).setCellValue(provinceDTO.getName());
            rowNum++;
        }

        String path = commonService.writeToFileOnServer(workbook, TEMPLATE_NAME);
        return path;
    }

    public List<AIOConfigServiceDTO> getListService(AIOConfigServiceDTO criteria) {
        return aioPackageDAO.getListService(criteria);
    }

    public List<String> getProvinceInPermission(HttpServletRequest request) {
        String provinceIdsStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE, Constant.AdResourceKey.PACKAGE, request);
        if (StringUtils.isNotEmpty(provinceIdsStr)) {
            return ConvertData.convertStringToList(provinceIdsStr, ",");
        } else {
            return new ArrayList<>();
        }
    }

    private void savePromotionPackage(AIOPackageDetailDTO detail, List<AIOPackagePromotionDTO> promotionDTOS) {
        if (detail.getTypePromotion() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg, ": loại KM");
        }

        Long id;
        if (!detail.getTypePromotion().equals(AIOPackagePromotionDTO.TYPE_GOODS)) {
            AIOPackagePromotionDTO promotionDTO = new AIOPackagePromotionDTO();
            promotionDTO.setPackageId(detail.getAioPackageId());
            promotionDTO.setPackageDetailId(detail.getAioPackageDetailId());
            promotionDTO.setType(detail.getTypePromotion());
            if (detail.getTypePromotion().equals(AIOPackagePromotionDTO.TYPE_VALUE)
                    || detail.getTypePromotion().equals(AIOPackagePromotionDTO.TYPE_VALUE_GOODS)) {
                promotionDTO.setMoney(detail.getMoneyNum());
            } else if (detail.getTypePromotion().equals(AIOPackagePromotionDTO.TYPE_PERCENT)
                    || detail.getTypePromotion().equals(AIOPackagePromotionDTO.TYPE_PERCENT_GOODS)) {
                promotionDTO.setMoney(detail.getMoneyPercent());
            }
            id = aioPackagePromotionDAO.saveObject(promotionDTO.toModel());
            commonService.validateIdCreated(id, AIOObjectType.PACKAGE_PROMOTION);
        }


        for (AIOPackagePromotionDTO promo : promotionDTOS) {
            promo.setPackageId(detail.getAioPackageId());
            promo.setPackageDetailId(detail.getAioPackageDetailId());
            promo.setType(detail.getTypePromotion());

            id = aioPackagePromotionDAO.saveObject(promo.toModel());
            commonService.validateIdCreated(id, AIOObjectType.PACKAGE_PROMOTION);
        }
    }

    private void checkPermissionCreatePackageCompany(AIOPackageDTO aioPackageDTO) {
        if (!aioPackageDTO.getDomainData().isEmpty() && aioPackageDTO.getIsProvinceBought() == 2) {
            throw new BusinessException(AIOErrorType.NOT_AUTHORIZE.msg + " tạo gói công ty mua");
        }
    }
}
