package com.viettel.aio.business;

import com.viettel.aio.bo.AIOProductInfoBO;
import com.viettel.aio.bo.AIORequestBHSCBO;
import com.viettel.aio.config.AIOAttachmentType;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.dao.AIOProductInfoDAO;
import com.viettel.aio.dao.AIORequestBHSCDAO;
import com.viettel.aio.dao.AIORequestBHSCDetailDAO;
import com.viettel.aio.dto.*;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.ImageUtil;

import org.apache.commons.collections.map.HashedMap;
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

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//VietNT_20190913_created
@Service("aioTvbhBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOTvbhBusinessImpl extends BaseFWBusinessImpl<AIOProductInfoDAO, AIOProductInfoDTO, AIOProductInfoBO> {

    static Logger LOGGER = LoggerFactory.getLogger(AIOTvbhBusinessImpl.class);

    @Autowired
    public AIOTvbhBusinessImpl(AIOProductInfoDAO aioProductInfoDAO, CommonServiceAio commonService) {
        this.aioProductInfoDAO = aioProductInfoDAO;
        this.commonService = commonService;
    }

    private AIOProductInfoDAO aioProductInfoDAO;
    private CommonServiceAio commonService;

    public List<UtilAttachDocumentDTO> getCategory() {
        List<UtilAttachDocumentDTO> data = null;
        List<AIOCategoryProductDTO> lstCategory = aioProductInfoDAO.getCategory();
        Map<Long, AIOCategoryProductDTO> mapCategory = new HashMap<>();
        for (AIOCategoryProductDTO dto : lstCategory) {
            mapCategory.put(dto.getCategoryProductId(), dto);
        }
        if (mapCategory.size() > 0) {
            data = commonService.getListAttachmentPathByIdAndType(new ArrayList<>(mapCategory.keySet()),
                    Collections.singletonList(AIOAttachmentType.CATEGORY_PRODUCT_IMAGE.code));
            for (UtilAttachDocumentDTO utilAttach : data) {
                AIOCategoryProductDTO aioCategory = mapCategory.get(utilAttach.getObjectId());
                utilAttach.setName(aioCategory.getName());
            }
        }

        return data;
    }

    public List<AIOProductInfoDTO> getHightLightProduct(AIOProductInfoDTO aioProductInfoDTO) {
        List<AIOProductInfoDTO> lstProduct = aioProductInfoDAO.getHightLightProduct(aioProductInfoDTO);
        List<AIOProductInfoDTO> lstProductV2 = this.mapListProductImageV2(lstProduct);
        return lstProductV2;
    }

    public List<AIOProductInfoDTO> doSearchProductInfo(AIOProductInfoDTO criteria) {
        return aioProductInfoDAO.getProductStockRemain(criteria);
    }

    public List<AIOCategoryProductPriceDTO> getDaiGia(AIOCategoryProductDTO criteria) {
        List<AIOCategoryProductPriceDTO> result = new ArrayList<>();
        AIOCategoryProductPriceDTO aio = new AIOCategoryProductPriceDTO();
        List<AIOCategoryProductPriceDTO> res = aioProductInfoDAO.getDaiGia(criteria);
        if (res != null && res.size() > 0) {
            res.forEach(dto -> {
                if (dto.getType() == 1L) {
                    aio.setValueFrom(dto.getValueFrom());
                } else if (dto.getType() == 2L) {
                    aio.setValueTo(dto.getValueFrom());
                } else if (dto.getType() == 3L) {
                    aio.setValueFromV2(dto.getValueFrom());
                    aio.setValueToV2(dto.getValueTo());
                }
            });

        }
        aio.setAioCategoryProductId(res.get(0).getAioCategoryProductId() != null ? res.get(0).getAioCategoryProductId() : 1L);
        result.add(aio);
        return result;
    }

    public List<AIOProductInfoDTO> getProductByCategory(AIOProductInfoDTO aioProductInfoDTO) {

        List<AIOProductInfoDTO> lstProduct = aioProductInfoDAO.getProductByCategory(aioProductInfoDTO);
        List<AIOProductInfoDTO> lstProductV2 = this.mapListProductImageV2(lstProduct);
        if(lstProductV2.size() > 0){
            if (aioProductInfoDTO.getFilter() != null) {
                if ("2".equals(aioProductInfoDTO.getFilter())) {
                    lstProductV2.sort(Comparator.comparing(AIOProductInfoDTO::getPrice).reversed());
                } else if ("3".equals(aioProductInfoDTO.getFilter())) {
                    lstProductV2.sort(Comparator.comparing(AIOProductInfoDTO::getPrice));
                }
            }
            return lstProduct;
        }
        return new ArrayList<>();


    }

    public List<UtilAttachDocumentDTO> getProductById(AIOProductInfoDTO aioProductInfoDTO) {
        List<AIOProductInfoDTO> dtos = aioProductInfoDAO.getProductById(aioProductInfoDTO);
        return this.mapListProductImage(dtos);
    }

    //get image category with type = 106
    public List<UtilAttachDocumentDTO> getListImage(List<Long> productId) {
        return commonService.getListImagesByIdAndType(productId, AIOAttachmentType.CATEGORY_PRODUCT_IMAGE.code);
    }

    private List<UtilAttachDocumentDTO> mapListProductImage(List<AIOProductInfoDTO> products) {
        Map<Long, AIOProductInfoDTO> mapProduct = new HashMap<>();
        for (AIOProductInfoDTO dto : products) {
            mapProduct.put(dto.getProductInfoId(), dto);
        }
        if (mapProduct.size() > 0) {
            List<UtilAttachDocumentDTO> data = commonService.getListAttachmentPathByIdAndType(
                    new ArrayList<>(mapProduct.keySet()), Collections.singletonList(AIOAttachmentType.PRODUCT_INFO_IMAGE.code));
            Long key = 0L;
            for (UtilAttachDocumentDTO d : data) {
                AIOProductInfoDTO dio = mapProduct.get(d.getObjectId());
                d.setProductName(dio.getProductName());
                d.setProductPrice(dio.getPrice());
                d.setGroupProductId(dio.getGroupProductId());
                d.setProductInfo(dio.getProductInfo());
                d.setProductPromotion(dio.getProductPromotion());
                d.setProductCode(dio.getProductCode());
                d.setKey(key);
                key++;
            }
            return data;
        }
        return new ArrayList<>();
    }

    private List<AIOProductInfoDTO> mapListProductImageV2(List<AIOProductInfoDTO> products) {
        Map<Long, AIOProductInfoDTO> mapProduct = new HashMap<>();
        Map<Long, UtilAttachDocumentDTO> mapImage = new HashMap<>();
        for (AIOProductInfoDTO dto : products) {
            mapProduct.put(dto.getProductInfoId(), dto);
        }
        if (mapProduct.size() > 0) {
            List<UtilAttachDocumentDTO> data = commonService.getListAttachmentPathByIdAndType(
                    new ArrayList<>(mapProduct.keySet()), Collections.singletonList(AIOAttachmentType.PRODUCT_INFO_IMAGE.code));
            data.forEach( dto -> {
                mapImage.put(dto.getObjectId(),dto);
            });
            products.forEach(dto ->{
                UtilAttachDocumentDTO image = mapImage.get(dto.getProductInfoId());
                dto.setFilePath(image.getFilePath());
            });
            return products;
        }
        return new ArrayList<>();
    }

    public List<AIOProductInfoDTO> autoSearchProduct(String keySearch) {
        return aioProductInfoDAO.autoSearchProduct(keySearch);
    }
}
