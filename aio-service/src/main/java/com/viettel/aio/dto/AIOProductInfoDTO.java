package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOProductInfoBO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

//VietNT_20190701_create
@XmlRootElement(name = "AIO_PRODUCT_INFOBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOProductInfoDTO extends ComsBaseFWDTO<AIOProductInfoBO> {

    private Long productInfoId;
    private Long groupProductId;
    private String groupProductCode;
    private String groupProductName;
    private String productCode;
    private String productName;
    private String productInfo;
    private Long status;
    private Long createdUser;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createdDate;
    private Long isHighlight;
    private String productPromotion;
    private String provinceCode;
    private Long countByProvinceCode;
    //dto only
    private String sysUserName;
    private String email;
    private Long provinceId;
    private Double priceMin;
    private Double priceMax;
    private Double amountStock;
    private String sysGroupCode;

    private List<UtilAttachDocumentDTO> listImage;
    private List<AIOProductPriceDTO> priceList;

    private List<AIOProductGoodsDTO> productGoodsDTOS;
    private List<String> imgSrc;
    private List<AIOProductInfoDTO> stockInfo;

    //tatph-start-11/12/2019
    private UtilAttachDocumentDTO image;
    private Long valueFrom;
    private Long valueTo;
    private String filter;
    private String filePath;

    //tatph-end-11/12/2019


    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(String provinceCode) {
        this.provinceCode = provinceCode;
    }

    public Long getCountByProvinceCode() {
        return countByProvinceCode;
    }

    public void setCountByProvinceCode(Long countByProvinceCode) {
        this.countByProvinceCode = countByProvinceCode;
    }

    public List<AIOProductInfoDTO> getStockInfo() {
        return stockInfo;
    }

    public void setStockInfo(List<AIOProductInfoDTO> stockInfo) {
        this.stockInfo = stockInfo;
    }

    public String getSysGroupCode() {
        return sysGroupCode;
    }

    public void setSysGroupCode(String sysGroupCode) {
        this.sysGroupCode = sysGroupCode;
    }

    public List<String> getImgSrc() {
        return imgSrc;
    }

    public void setImgSrc(List<String> imgSrc) {
        this.imgSrc = imgSrc;
    }

    public Double getAmountStock() {
        return amountStock;
    }

    public void setAmountStock(Double amountStock) {
        this.amountStock = amountStock;
    }

    public Long getIsHighlight() {
        return isHighlight;
    }

    public void setIsHighlight(Long isHighlight) {
        this.isHighlight = isHighlight;
    }

    public String getProductPromotion() {
        return productPromotion;
    }

    public void setProductPromotion(String productPromotion) {
        this.productPromotion = productPromotion;
    }

    public List<AIOProductPriceDTO> getPriceList() {
        return priceList;
    }

    public void setPriceList(List<AIOProductPriceDTO> priceList) {
        this.priceList = priceList;
    }


    public List<UtilAttachDocumentDTO> getListImage() {
        return listImage;
    }

    public void setListImage(List<UtilAttachDocumentDTO> listImage) {
        this.listImage = listImage;
    }

    public Double getPriceMin() {
        return priceMin;
    }

    public void setPriceMin(Double priceMin) {
        this.priceMin = priceMin;
    }

    public Double getPriceMax() {
        return priceMax;
    }

    public void setPriceMax(Double priceMax) {
        this.priceMax = priceMax;
    }

    public Long getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(Long provinceId) {
        this.provinceId = provinceId;
    }

    public String getSysUserName() {
        return sysUserName;
    }

    public void setSysUserName(String sysUserName) {
        this.sysUserName = sysUserName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getProductInfoId() {
        return productInfoId;
    }

    public void setProductInfoId(Long productInfoId) {
        this.productInfoId = productInfoId;
    }

    public Long getGroupProductId() {
        return groupProductId;
    }

    public void setGroupProductId(Long groupProductId) {
        this.groupProductId = groupProductId;
    }

    public String getGroupProductCode() {
        return groupProductCode;
    }

    public void setGroupProductCode(String groupProductCode) {
        this.groupProductCode = groupProductCode;
    }

    public String getGroupProductName() {
        return groupProductName;
    }

    public void setGroupProductName(String groupProductName) {
        this.groupProductName = groupProductName;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductInfo() {
        return productInfo;
    }

    public void setProductInfo(String productInfo) {
        this.productInfo = productInfo;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(Long createdUser) {
        this.createdUser = createdUser;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    @Override
    public AIOProductInfoBO toModel() {
        AIOProductInfoBO bo = new AIOProductInfoBO();
        bo.setProductInfoId(this.getProductInfoId());
        bo.setGroupProductId(this.getGroupProductId());
        bo.setGroupProductCode(this.getGroupProductCode());
        bo.setGroupProductName(this.getGroupProductName());
        bo.setProductCode(this.getProductCode());
        bo.setProductName(this.getProductName());
        bo.setProductInfo(this.getProductInfo());
        bo.setStatus(this.getStatus());
        bo.setCreatedUser(this.getCreatedUser());
        bo.setCreatedDate(this.getCreatedDate());
        bo.setIsHighlight(this.getIsHighlight());
        bo.setProductPromotion(this.getProductPromotion());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return productInfoId;
    }

    @Override
    public String catchName() {
        return productInfoId.toString();
    }

    //thangtv24 - start 050719
    private Double price;
    private long catProvinceId;

    public long getCatProvinceId() {
        return catProvinceId;
    }

    public void setCatProvinceId(long catProvinceId) {
        this.catProvinceId = catProvinceId;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public List<AIOProductGoodsDTO> getProductGoodsDTOS() {
        return productGoodsDTOS;
    }

    public void setProductGoodsDTOS(List<AIOProductGoodsDTO> productGoodsDTOS) {
        this.productGoodsDTOS = productGoodsDTOS;
    }

    public String getFilter() {
        return filter;
    }

    public void setFilter(String filter) {
        this.filter = filter;
    }

    public Long getValueFrom() {
        return valueFrom;
    }

    public void setValueFrom(Long valueFrom) {
        this.valueFrom = valueFrom;
    }

    public Long getValueTo() {
        return valueTo;
    }

    public void setValueTo(Long valueTo) {
        this.valueTo = valueTo;
    }

    public UtilAttachDocumentDTO getImage() {
        return image;
    }

    public void setImage(UtilAttachDocumentDTO image) {
        this.image = image;
    }
}
