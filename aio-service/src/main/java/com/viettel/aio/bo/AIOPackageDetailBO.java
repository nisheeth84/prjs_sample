package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOPackageDetailDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190308_create
@Entity
@Table(name = "AIO_PACKAGE_DETAIL")
public class AIOPackageDetailBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_PACKAGE_DETAIL_SEQ")})
    @Column(name = "AIO_PACKAGE_DETAIL_ID", length = 10)
    private Long aioPackageDetailId;
    @Column(name = "AIO_PACKAGE_ID", length = 10)
    private Long aioPackageId;
    @Column(name = "ENGINE_CAPACITY_ID", length = 10)
    private Long engineCapacityId;
    @Column(name = "ENGINE_CAPACITY_NAME", length = 50)
    private String engineCapacityName;
    @Column(name = "QUANTITY_DISCOUNT", length = 15)
    private Double quantityDiscount;
    @Column(name = "AMOUNT_DISCOUNT", length = 15)
    private Double amountDiscount;
    @Column(name = "PERCENT_DISCOUNT", length = 5)
    private Double percentDiscount;
    @Column(name = "GOODS_ID", length = 10)
    private Long goodsId;
    @Column(name = "GOODS_NAME", length = 50)
    private String goodsName;
    @Column(name = "LOCATION_ID", length = 10)
    private Long locationId;
    @Column(name = "LOCATION_NAME", length = 50)
    private String locationName;
    @Column(name = "PERCENT_DISCOUNT_STAFF", length = 5)
    private Double percentDiscountStaff;
    @Column(name = "PRICE", length = 15)
    private Double price;
    @Column(name = "IS_PROVINCE_BOUGHT", length = 1)
    private Long isProvinceBought;

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOPackageDetailDTO dto = new AIOPackageDetailDTO();
        dto.setAioPackageDetailId(this.getAioPackageDetailId());
        dto.setAioPackageId(this.getAioPackageId());
        dto.setEngineCapacityId(this.getEngineCapacityId());
        dto.setEngineCapacityName(this.getEngineCapacityName());
        dto.setQuantityDiscount(this.getQuantityDiscount());
        dto.setAmountDiscount(this.getAmountDiscount());
        dto.setPercentDiscount(this.getPercentDiscount());
        dto.setGoodsId(this.getGoodsId());
        dto.setGoodsName(this.getGoodsName());
        dto.setLocationId(this.getLocationId());
        dto.setLocationName(this.getLocationName());
        dto.setPercentDiscountStaff(this.getPercentDiscountStaff());
        dto.setPrice(this.getPrice());
        dto.setIsProvinceBought(this.getIsProvinceBought());
        return dto;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Long getAioPackageDetailId() {
        return aioPackageDetailId;
    }

    public void setAioPackageDetailId(Long aioPackageDetailId) {
        this.aioPackageDetailId = aioPackageDetailId;
    }

    public Long getAioPackageId() {
        return aioPackageId;
    }

    public void setAioPackageId(Long aioPackageId) {
        this.aioPackageId = aioPackageId;
    }

    public Long getEngineCapacityId() {
        return engineCapacityId;
    }

    public void setEngineCapacityId(Long engineCapacityId) {
        this.engineCapacityId = engineCapacityId;
    }

    public String getEngineCapacityName() {
        return engineCapacityName;
    }

    public void setEngineCapacityName(String engineCapacityName) {
        this.engineCapacityName = engineCapacityName;
    }

    public Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(Long goodsId) {
        this.goodsId = goodsId;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public Double getQuantityDiscount() {
        return quantityDiscount;
    }

    public void setQuantityDiscount(Double quantityDiscount) {
        this.quantityDiscount = quantityDiscount;
    }

    public Double getAmountDiscount() {
        return amountDiscount;
    }

    public void setAmountDiscount(Double amountDiscount) {
        this.amountDiscount = amountDiscount;
    }

    public Double getPercentDiscount() {
        return percentDiscount;
    }

    public void setPercentDiscount(Double percentDiscount) {
        this.percentDiscount = percentDiscount;
    }

    public Double getPercentDiscountStaff() {
        return percentDiscountStaff;
    }

    public void setPercentDiscountStaff(Double percentDiscountStaff) {
        this.percentDiscountStaff = percentDiscountStaff;
    }

    public Long getIsProvinceBought() {
        return isProvinceBought;
    }

    public void setIsProvinceBought(Long isProvinceBought) {
        this.isProvinceBought = isProvinceBought;
    }
}
