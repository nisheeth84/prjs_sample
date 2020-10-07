package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOProductInfoDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190701_start
@Entity
@Table(name = "AIO_PRODUCT_INFO")
public class AIOProductInfoBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_PRODUCT_INFO_SEQ")})
    @Column(name = "PRODUCT_INFO_ID", length = 10)
    private Long productInfoId;
    @Column(name = "GROUP_PRODUCT_ID", length = 10)
    private Long groupProductId;
    @Column(name = "GROUP_PRODUCT_CODE", length = 50)
    private String groupProductCode;
    @Column(name = "GROUP_PRODUCT_NAME", length = 500)
    private String groupProductName;
    @Column(name = "PRODUCT_CODE", length = 50)
    private String productCode;
    @Column(name = "PRODUCT_NAME", length = 500)
    private String productName;
    @Column(name = "PRODUCT_INFO", length = 500)
    private String productInfo;
    @Column(name = "STATUS", length = 10)
    private Long status;
    @Column(name = "CREATED_USER", length = 10)
    private Long createdUser;
    @Column(name = "CREATED_DATE", length = 22)
    private Date createdDate;
    @Column(name = "IS_HIGHLIGHT", length = 1)
    private Long isHighlight;
    @Column(name = "PRODUCT_PROMOTION", length = 500)
    private String productPromotion;

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
    public BaseFWDTOImpl toDTO() {
        AIOProductInfoDTO dto = new AIOProductInfoDTO();
        dto.setProductInfoId(this.getProductInfoId());
        dto.setGroupProductId(this.getGroupProductId());
        dto.setGroupProductCode(this.getGroupProductCode());
        dto.setGroupProductName(this.getGroupProductName());
        dto.setProductCode(this.getProductCode());
        dto.setProductName(this.getProductName());
        dto.setProductInfo(this.getProductInfo());
        dto.setStatus(this.getStatus());
        dto.setCreatedUser(this.getCreatedUser());
        dto.setCreatedDate(this.getCreatedDate());
        return dto;
    }
}
