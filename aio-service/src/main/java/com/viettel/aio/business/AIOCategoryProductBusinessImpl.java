package com.viettel.aio.business;

import com.viettel.aio.bo.AIOCategoryProductBO;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.dao.AIOCategoryProductDAO;
import com.viettel.aio.dao.AIOCategoryProductPriceDAO;
import com.viettel.aio.dto.AIOCategoryProductDTO;
import com.viettel.aio.dto.AIOCategoryProductPriceDTO;
import com.viettel.aio.dto.AIOStaffPlanDetailDTO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
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
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

//StephenTrung__20191105_created
@Service("aioCategoryProductBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOCategoryProductBusinessImpl extends BaseFWBusinessImpl<AIOCategoryProductDAO, AIOCategoryProductDTO, AIOCategoryProductBO> implements AIOCategoryProductBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIOCategoryProductBusinessImpl.class);

    @Autowired
    public AIOCategoryProductBusinessImpl(AIOCategoryProductDAO aioCategoryProductDao, AIOCategoryProductPriceDAO aioCategoryProductPriceDAO, UtilAttachDocumentDAO utilAttachDocumentDAO, CommonServiceAio commonService) {
        this.aioCategoryProductDao = aioCategoryProductDao;
        this.aioCategoryProductPriceDAO = aioCategoryProductPriceDAO;
        this.utilAttachDocumentDAO = utilAttachDocumentDAO;
        this.commonService = commonService;
    }

    private AIOCategoryProductDAO aioCategoryProductDao;
    private AIOCategoryProductPriceDAO aioCategoryProductPriceDAO;
    private UtilAttachDocumentDAO utilAttachDocumentDAO;
    private CommonServiceAio commonService;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Value("${input_image_sub_folder_upload}")
    private String input_image_sub_folder_upload;

    @Context
    HttpServletRequest request;

    private static final String ATTACHMENT_TYPE = "106";

    @Override
    public DataListDTO doSearch(AIOCategoryProductDTO criteria) {
        List<AIOCategoryProductDTO> dtos = aioCategoryProductDao.doSearch(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    @Override
    public AIOCategoryProductDTO getCategoryProductById(Long id) {
        AIOCategoryProductDTO dto = new AIOCategoryProductDTO();
//        AIOCategoryProductDTO dto = aioCategoryProductDao.findById(id);
//        if (dto == null) {
//            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.CATEGORY_PRODUCT.getName());
//        }
        dto.setCategoryProductId(id);
        List<AIOCategoryProductPriceDTO> priceList = aioCategoryProductDao.getListPriceByCategoryProductId(id);
        if (priceList == null || priceList.isEmpty()) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.CATEGORY_PRODUCT_PRICE.getName());
        }

        List<UtilAttachDocumentDTO> listImage = this.getListImageCategoryProduct(id);

        dto.setListAioCategoryProductPriceDTO(priceList);
        dto.setListImage(listImage);

        return dto;
    }



    @Override
    public Long saveCategoryProduct(AIOCategoryProductDTO dto, SysUserCOMSDTO sysUserDto) {
        this.validateRequest(dto, sysUserDto);
        dto.setStatus(1L);
        dto.setCreateUser(sysUserDto.getSysUserId());
        dto.setCreateDate(new Date());
        dto.setCode(this.generateCategoryProductCode());
        Long categoryProductId = aioCategoryProductDao.saveObject(dto.toModel());

        for(AIOCategoryProductPriceDTO dtoPrice : dto.getListAioCategoryProductPriceDTO()) {
            dtoPrice.setAioCategoryProductId(categoryProductId);
            aioCategoryProductPriceDAO.saveObject(dtoPrice.toModel());
        }

        this.saveImages(dto.getListImage(), categoryProductId, sysUserDto.getSysUserId(), sysUserDto.getFullName());
        return categoryProductId;
    }

    private void validateRequest(AIOCategoryProductDTO dto, SysUserCOMSDTO sysUserDto) {
        if (sysUserDto.getSysUserId() == null || StringUtils.isEmpty(sysUserDto.getFullName())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.USER.getName());
        }

        if (dto.getName() == null || StringUtils.isEmpty(dto.getName())
                || StringUtils.isEmpty(dto.getName())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.CATEGORY_PRODUCT.getName());
        }
    }

    private void saveImages(List<UtilAttachDocumentDTO> listImage, Long categoryProductId, Long sysUserId, String userName) {
        for (UtilAttachDocumentDTO dto : listImage) {
            Long idResult;
            try {
                InputStream inputStream = ImageUtil.convertBase64ToInputStream(dto.getBase64String());
                String imagePath = UFile.writeToFileServerATTT2(inputStream, dto.getName(),
                        input_image_sub_folder_upload, folderUpload);
                dto.setFilePath(imagePath);

                dto.setObjectId(categoryProductId);
                dto.setType("106");
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
    private int updateImages(List<UtilAttachDocumentDTO> listImage, Long categoryProductId, Long sysUserId, String userName) {
        for (UtilAttachDocumentDTO dto : listImage) {
            int idResult;
            try {
                InputStream inputStream = ImageUtil.convertBase64ToInputStream(dto.getBase64String());
                String imagePath = UFile.writeToFileServerATTT2(inputStream, dto.getName(),
                        input_image_sub_folder_upload, folderUpload);
                dto.setFilePath(imagePath);

                dto.setObjectId(categoryProductId);
                dto.setType("106");
                dto.setDescription("Ảnh thông tin sản phẩm");
                dto.setStatus("1");
                dto.setCreatedDate(new Date());
                dto.setCreatedUserId(sysUserId);
                dto.setCreatedUserName(userName);
                idResult = aioCategoryProductDao.updateImage(dto);
            } catch (Exception e) {
                e.printStackTrace();
                continue;
            }

            commonService.validateIdCreated(idResult, AIOObjectType.ATTACH_IMAGE.getName());
            return 1;
        }
        return 0;
    }
    public List<UtilAttachDocumentDTO> getListImageCategoryProduct(Long categoryProductId) {
        return commonService.getListImagesByIdAndType(Collections.singletonList(categoryProductId), "106");
    }

    @Override
    public void updateCategoryProduct(AIOCategoryProductDTO obj, SysUserCOMSDTO sysUserDto) {
//        obj.setCreateUser(sysUserId);

        if (obj == null || (obj.getListImage() == null)
                || obj.getName() == null || StringUtils.isEmpty(obj.getName())
                || obj.getListAioCategoryProductPriceDTO() == null
        )
        {
            throw new BusinessException("Không có dữ liệu!");
        }

        int result1 = aioCategoryProductDao.updateCategory(obj);
        int result2 = updatePrice(obj);
        int result3 = 1;
        if (StringUtils.isEmpty(obj.getListImage().get(0).getFilePath())){
            result3 =  this.updateImages(obj.getListImage(), obj.getCategoryProductId(), sysUserDto.getSysUserId(), sysUserDto.getFullName());
        }

        if (result1 < 1 || result2 < 1 || result3 < 1) {
            throw new BusinessException("Lưu dữ liệu thất bại!");
        }

/*        Long id = aioCategoryProductDao.updateObject(obj.toModel());
        aioCategoryProductDao.deleteCategoryProductDetail(obj.getCategoryProductId());
        for(AIOCategoryProductPriceDTO dto : obj.getListAioCategoryProductPriceDTO()) {
            dto.setAioCategoryProductId(obj.getCategoryProductId());
            aioCategoryProductPriceDAO.saveObject(dto.toModel());
        }
        return id;*/
    }

    private int updatePrice(AIOCategoryProductDTO obj) {
        aioCategoryProductDao.deleteCategoryProductDetail(obj.getCategoryProductId());
        int count = 0;
        for (AIOCategoryProductPriceDTO dto : obj.getListAioCategoryProductPriceDTO()) {
            dto.setAioCategoryProductId(obj.getCategoryProductId());
            aioCategoryProductPriceDAO.saveObject(dto.toModel());
            count++;
        }
        return count;
    }

    @Override
    public List<AIOCategoryProductDTO> getAutoCompleteData(AIOCategoryProductDTO dto) {
        return aioCategoryProductDao.getAutoCompleteData( dto);
    }

    @Override
    public void removeCategoryProduct(AIOCategoryProductDTO obj) {
        obj.setStatus(0L);
        aioCategoryProductDao.removeCategoryProduct(obj);
    }

    @Override
    public int checkDuplicateCategoryProductName(String name) {
        return aioCategoryProductDao.checkDuplicateCategoryProductName(name);
    }

    private final String SEQ_NAME = "AIO_CATEGORY_PRODUCT_SEQ";
    private String generateCategoryProductCode() {
        Long id = commonService.getLatestSeqNumber(SEQ_NAME);
        if (id == null) { id = 1L; }
        String nextId = String.format((Locale) null, "%07d", id);

        return "DM" + nextId;
    }

    // mobile
    public List<AIOCategoryProductDTO> getProductsMenu() {
        AIOCategoryProductDTO criteria = new AIOCategoryProductDTO();
        criteria.setStatus(1L);
        List<AIOCategoryProductDTO> data = aioCategoryProductDao.doSearch(criteria);
        Map<Long, AIOCategoryProductDTO> mapData = new HashMap<>();
        List<Long> ids = new ArrayList<>();
        for (AIOCategoryProductDTO dto : data) {
            ids.add(dto.getCategoryProductId());
            dto.setImgSrc(new ArrayList<>());
            dto.setListAioCategoryProductPriceDTO(new ArrayList<>());
            mapData.put(dto.getCategoryProductId(), dto);
        }

        List<UtilAttachDocumentDTO> imgs = commonService.getListAttachmentPathByIdAndType(ids, Collections.singletonList(ATTACHMENT_TYPE));
        for (UtilAttachDocumentDTO img : imgs) {
            if (mapData.containsKey(img.getObjectId())) {
                mapData.get(img.getObjectId()).getImgSrc().add(img.getFilePath());
            }
        }

        List<AIOCategoryProductPriceDTO> priceList = aioCategoryProductDao.getListPriceByCategoryProductId(ids);
        for (AIOCategoryProductPriceDTO price : priceList) {
            if (mapData.containsKey(price.getAioCategoryProductId())) {
                mapData.get(price.getAioCategoryProductId()).getListAioCategoryProductPriceDTO().add(price);
            }
        }

        return new ArrayList<>(mapData.values());
    }
}
