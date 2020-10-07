package com.viettel.aio.business;

import com.viettel.aio.bo.AIOProductInfoBO;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.dao.AIOProductGoodsDAO;
import com.viettel.aio.dao.AIOProductInfoDAO;
import com.viettel.aio.dao.AIOProductPriceDAO;
import com.viettel.aio.dto.*;
import com.viettel.coms.business.UtilAttachDocumentBusinessImpl;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.ImageUtil;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;

import java.io.InputStream;
import java.util.*;

//VietNT_20190701_created
@Service("aioProductInfoBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOProductInfoBusinessImpl extends BaseFWBusinessImpl<AIOProductInfoDAO, AIOProductInfoDTO, AIOProductInfoBO> implements AIOProductInfoBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIOProductInfoBusinessImpl.class);

    @Autowired
    public AIOProductInfoBusinessImpl(AIOProductInfoDAO aioProductInfoDao, AIOProductPriceDAO aioProductPriceDAO,
                                      CommonServiceAio commonServiceAio, UtilAttachDocumentDAO utilAttachDocumentDAO,
                                      UtilAttachDocumentBusinessImpl utilAttachDocumentBusinessImpl,
                                      AIOProductGoodsDAO aioProductGoodsDAO) {
        this.aioProductInfoDao = aioProductInfoDao;
        this.aioProductPriceDAO = aioProductPriceDAO;
        this.commonService = commonServiceAio;
        this.utilAttachDocumentDAO = utilAttachDocumentDAO;
        this.utilAttachDocumentBusinessImpl = utilAttachDocumentBusinessImpl;
        this.aioProductGoodsDAO = aioProductGoodsDAO;
    }

    private AIOProductGoodsDAO aioProductGoodsDAO;
    private AIOProductInfoDAO aioProductInfoDao;
    private AIOProductPriceDAO aioProductPriceDAO;
    private CommonServiceAio commonService;
    private UtilAttachDocumentDAO utilAttachDocumentDAO;
    private UtilAttachDocumentBusinessImpl utilAttachDocumentBusinessImpl;

    @Value("${input_image_sub_folder_upload}")
    private String input_image_sub_folder_upload;

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

    private static final String ATTACHMENT_TYPE = "100";

    public DataListDTO doSearch(AIOProductInfoDTO criteria) {
        List<AIOProductInfoDTO> dtos = aioProductInfoDao.doSearch(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public List<AppParamDTO> getDropDownData() {
        return aioProductInfoDao.getDropDownData();
    }

    // add
    public void saveProductInfo(AIOProductInfoDTO dto, SysUserCOMSDTO sysUserDto) {
        this.validateRequest(dto, sysUserDto);

        if (aioProductInfoDao.isProductExist(dto.getProductCode())) {
            throw new BusinessException(AIOErrorType.DUPLICATE.msg + ": Mã sản phẩm");
        }

        dto.setStatus(1L);
        dto.setCreatedUser(sysUserDto.getSysUserId());
        dto.setCreatedDate(new Date());
        Long productInfoId = aioProductInfoDao.saveObject(dto.toModel());
        commonService.validateIdCreated(productInfoId, AIOObjectType.PRODUCT);

        this.saveProductGoods(dto.getProductGoodsDTOS(), productInfoId);
        this.savePrice(dto.getPriceList(), productInfoId);
        this.saveImages(dto.getListImage(), productInfoId, sysUserDto.getSysUserId(), sysUserDto.getFullName());
    }

    private void validateRequest(AIOProductInfoDTO dto, SysUserCOMSDTO sysUserDto) {
        if (sysUserDto.getSysUserId() == null || StringUtils.isEmpty(sysUserDto.getFullName())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.USER.getName());
        }

        if (dto.getGroupProductId() == null || StringUtils.isEmpty(dto.getGroupProductCode())
                || StringUtils.isEmpty(dto.getGroupProductName())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.GROUP_PRODUCT.getName());
        }

        if (StringUtils.isEmpty(dto.getProductCode()) || StringUtils.isEmpty(dto.getProductName())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.PRODUCT.getName());
        }

        if (dto.getPriceList() == null || dto.getPriceList().isEmpty()) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.PRICE_LIST.getName());
        }
        if (dto.getProductGoodsDTOS() == null || dto.getProductGoodsDTOS().isEmpty()) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.GOODS.getName());
        }
    }

    private void saveProductGoods(List<AIOProductGoodsDTO> productGoodsDTOS, Long productInfoId) {
        for (AIOProductGoodsDTO dto : productGoodsDTOS) {
            dto.setProductInfoId(productInfoId);

            Long id = aioProductGoodsDAO.saveObject(dto.toModel());
            commonService.validateIdCreated(id, AIOObjectType.PRODUCT);
        }
    }

    private void savePrice(List<AIOProductPriceDTO> priceList, Long productInfoId) {
        for (AIOProductPriceDTO dto : priceList) {
            dto.setProductInfoId(productInfoId);
            Long idResult = aioProductPriceDAO.saveObject(dto.toModel());
            commonService.validateIdCreated(idResult, AIOObjectType.PRICE_LIST);
        }
    }

    private void saveImages(List<UtilAttachDocumentDTO> listImage, Long productInfoId, Long sysUserId, String userName) {
        for (UtilAttachDocumentDTO dto : listImage) {
            Long idResult;
            try {
                InputStream inputStream = ImageUtil.convertBase64ToInputStream(dto.getBase64String());
                String imagePath = UFile.writeToFileServerATTT2(inputStream, dto.getName(),
                        input_image_sub_folder_upload, folderUpload);
                dto.setFilePath(imagePath);

                dto.setObjectId(productInfoId);
                dto.setType(ATTACHMENT_TYPE);
                dto.setDescription("Ảnh thông tin sản phẩm");
                dto.setStatus("1");
                dto.setCreatedDate(new Date());
                dto.setCreatedUserId(sysUserId);
                dto.setCreatedUserName(userName);

                idResult = utilAttachDocumentDAO.saveObject(dto.toModel());
            } catch (Exception e) {
                e.printStackTrace();
                continue;
            }

            commonService.validateIdCreated(idResult, AIOObjectType.ATTACH_IMAGE.getName());
        }
    }

    // view
    public AIOProductInfoDTO getProductInfo(Long id) {
        AIOProductInfoDTO dto = aioProductInfoDao.findById(id);
        if (dto == null) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.PRODUCT.getName());
        }

        List<AIOProductPriceDTO> priceList = aioProductInfoDao.getListPriceByProductId(id);
        if (priceList == null || priceList.isEmpty()) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.PRICE_LIST.getName());
        }

        List<UtilAttachDocumentDTO> listImage = this.getListImageProductInfo(id);

        //VietNT_25/07/2019_start
        List<AIOProductGoodsDTO> productGoods = aioProductInfoDao.getProductGoods(id);
        //VietNT_end

        dto.setPriceList(priceList);
        dto.setListImage(listImage);
        dto.setProductGoodsDTOS(productGoods);

        return dto;
    }

    public List<UtilAttachDocumentDTO> getListImageProductInfo(Long productId) {
        return commonService.getListImagesByIdAndType(Collections.singletonList(productId), "100");
    }

    //VietNT_25/07/2019_start
    public AIOProductMobileResponse getDetailProduct(AIOProductInfoDTO dto) {
        AIOProductMobileResponse res = new AIOProductMobileResponse();
        List<UtilAttachDocumentDTO> listImage = this.getListImageProductInfo(dto.getProductInfoId());
        Double amountStock = aioProductInfoDao.getAmountStockProduct(dto.getProductInfoId(), dto.getProvinceId());

        res.setLstImageInfo(listImage);
        res.setAmountStock(amountStock);
        return res;
    }
    //VietNT_end

    // disable
    public void disableProduct(Long id) {
        if (id == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.PRODUCT.getName());
        }

        int result = aioProductInfoDao.disableProduct(id);
        if (result < 1) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.PRODUCT.getName());
        }
    }
    
    //mobile
    public List<AIOProductInfoDTO> getDataGroupProduct(){
    	return aioProductInfoDao.getDataGroupProduct();
    }
    
    public List<AIOProductInfoDTO> doSeachInfoProduct(AIOProductInfoDTO aioProductInfoDTO){
    	return aioProductInfoDao.doSeachInfoProduct(aioProductInfoDTO);
    }

    public void editProductInfo(AIOProductInfoDTO dto, SysUserCOMSDTO sysUserDto) {
        if (sysUserDto.getSysUserId() == null || StringUtils.isEmpty(sysUserDto.getFullName())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.USER.getName());
        }
        if (dto.getProductGoodsDTOS() == null || dto.getProductGoodsDTOS().isEmpty()) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.GOODS.getName());
        }

        aioProductInfoDao.deleteProductGoods(dto.getProductInfoId());
        this.saveProductGoods(dto.getProductGoodsDTOS(), dto.getProductInfoId());
    }

    public List<AIOProductInfoDTO> getHighlightProducts() {
        AIOProductInfoDTO criteria = new AIOProductInfoDTO();
        criteria.setIsHighlight(1L);
        List<AIOProductInfoDTO> list = aioProductInfoDao.getProducts(criteria);

        list = this.findThenSetProductImgs(list);
        return list;
    }

    public List<AIOProductInfoDTO> getProductsInCategory(AIOProductInfoDTO rq) {
        AIOProductInfoDTO criteria = new AIOProductInfoDTO();
        criteria.setGroupProductId(rq.getGroupProductId());
        List<AIOProductInfoDTO> list = aioProductInfoDao.getProducts(criteria);

        list = this.findThenSetProductImgs(list);
        return list;
    }

    private List<AIOProductInfoDTO> findThenSetProductImgs(List<AIOProductInfoDTO> list) {
        Map<Long, AIOProductInfoDTO> mapData = new HashMap<>();
        List<Long> ids = new ArrayList<>();
        for (AIOProductInfoDTO dto : list) {
            ids.add(dto.getProductInfoId());
            dto.setImgSrc(new ArrayList<>());
            mapData.put(dto.getProductInfoId(), dto);
        }

        List<UtilAttachDocumentDTO> imgs = commonService.getListAttachmentPathByIdAndType(ids, Collections.singletonList(ATTACHMENT_TYPE));
        for (UtilAttachDocumentDTO img : imgs) {
            if (mapData.containsKey(img.getObjectId())) {
                mapData.get(img.getObjectId()).getImgSrc().add(img.getFilePath());
            }
        }

        return new ArrayList<>(mapData.values());
    }

    public AIOProductInfoDTO getAmountStock(Long id) {
//        AIOProductInfoDTO product = aioProductInfoDao.getById(id);
//        if (product == null) {
//            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.PRODUCT.getName());
//        }
        AIOProductInfoDTO product = new AIOProductInfoDTO();
        product.setStockInfo(aioProductInfoDao.getAmountStockEachGroup(id));
        return product;
    }

    public List<AIOPackageDetailDTO> getPackageFromProduct(Long idProduct) {
        return aioProductInfoDao.getPackageFromProduct(idProduct);
    }

    public List<AIOProductInfoDTO> getListProductName() {
        List<AIOProductInfoDTO> list = aioProductInfoDao.getProducts(new AIOProductInfoDTO());

        list = this.findThenSetProductImgs(list);
        return list;
    }
}
