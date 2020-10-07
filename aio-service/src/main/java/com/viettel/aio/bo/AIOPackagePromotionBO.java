package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOPackagePromotionDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

//VietNT_20190930_start
@Entity
@Table(name = "AIO_PACKAGE_PROMOTION")
public class AIOPackagePromotionBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_PACKAGE_PROMOTION_SEQ")})
    @Column(name = "PACKAGE_PROMOTION_ID", length = 10)
    private Long packagePromotionId;
    @Column(name = "PACKAGE_ID", length = 10)
    private Long packageId;
    @Column(name = "PACKAGE_DETAIL_ID", length = 10)
    private Long packageDetailId;
    @Column(name = "GOODS_ID", length = 10)
    private Long goodsId;
    @Column(name = "GOODS_CODE", length = 100)
    private String goodsCode;
    @Column(name = "GOODS_NAME", length = 500)
    private String goodsName;
    @Column(name = "GOODS_UNIT_ID", length = 10)
    private Long goodsUnitId;
    @Column(name = "GOODS_UNIT_NAME", length = 100)
    private String goodsUnitName;
    @Column(name = "GOODS_IS_SERIAL", length = 1)
    private Long goodsIsSerial;
    @Column(name = "QUANTITY", length = 30)
    private Double quantity;
    @Column(name = "MONEY", length = 30)
    private Double money;
    @Column(name = "TYPE", length = 1)
    private Long type;

    public Long getPackagePromotionId() {
        return packagePromotionId;
    }

    public void setPackagePromotionId(Long packagePromotionId) {
        this.packagePromotionId = packagePromotionId;
    }

    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public Long getPackageDetailId() {
        return packageDetailId;
    }

    public void setPackageDetailId(Long packageDetailId) {
        this.packageDetailId = packageDetailId;
    }

    public Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(Long goodsId) {
        this.goodsId = goodsId;
    }

    public String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(String goodsCode) {
        this.goodsCode = goodsCode;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public Long getGoodsUnitId() {
        return goodsUnitId;
    }

    public void setGoodsUnitId(Long goodsUnitId) {
        this.goodsUnitId = goodsUnitId;
    }

    public String getGoodsUnitName() {
        return goodsUnitName;
    }

    public void setGoodsUnitName(String goodsUnitName) {
        this.goodsUnitName = goodsUnitName;
    }

    public Long getGoodsIsSerial() {
        return goodsIsSerial;
    }

    public void setGoodsIsSerial(Long goodsIsSerial) {
        this.goodsIsSerial = goodsIsSerial;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getMoney() {
        return money;
    }

    public void setMoney(Double money) {
        this.money = money;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOPackagePromotionDTO dto = new AIOPackagePromotionDTO();
        dto.setPackagePromotionId(this.getPackagePromotionId());
        dto.setPackageId(this.getPackageId());
        dto.setPackageDetailId(this.getPackageDetailId());
        dto.setGoodsId(this.getGoodsId());
        dto.setGoodsCode(this.getGoodsCode());
        dto.setGoodsName(this.getGoodsName());
        dto.setGoodsUnitId(this.getGoodsUnitId());
        dto.setGoodsUnitName(this.getGoodsUnitName());
        dto.setGoodsIsSerial(this.getGoodsIsSerial());
        dto.setQuantity(this.getQuantity());
        dto.setMoney(this.getMoney());
        dto.setType(this.getType());
        return dto;
    }
}
