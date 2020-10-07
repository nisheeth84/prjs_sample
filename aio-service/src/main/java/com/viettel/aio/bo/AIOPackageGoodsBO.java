package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOPackageGoodsDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190308_create
@Entity
@Table(name = "AIO_PACKAGE_GOODS")
public class AIOPackageGoodsBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_PACKAGE_GOODS_SEQ")})
    @Column(name = "AIO_PACKAGE_GOODS_ID", length = 10)
    private Long aioPackageGoodsId;
    @Column(name = "AIO_PACKAGE_ID", length = 10)
    private Long aioPackageId;
    @Column(name = "AIO_PACKAGE_DETAIL_ID", length = 10)
    private Long aioPackageDetailId;
    @Column(name = "GOODS_ID", length = 10)
    private Long goodsId;
    @Column(name = "GOODS_CODE", length = 50)
    private String goodsCode;
    @Column(name = "GOODS_NAME", length = 50)
    private String goodsName;
    @Column(name = "GOODS_UNIT_ID", length = 10)
    private Long goodsUnitId;
    @Column(name = "GOODS_UNIT_NAME", length = 50)
    private String goodsUnitName;
    @Column(name = "QUANTITY", length = 15)
    private Double quantity;
    @Column(name = "GOODS_IS_SERIAL", length = 1)
    private Long goodsIsSerial;
    @Column(name = "TYPE", length = 1)
    private Long type;

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOPackageGoodsDTO dto = new AIOPackageGoodsDTO();
        dto.setAioPackageGoodsId(this.getAioPackageGoodsId());
        dto.setAioPackageId(this.getAioPackageId());
        dto.setAioPackageDetailId(this.getAioPackageDetailId());
        dto.setGoodsId(this.getGoodsId());
        dto.setGoodsCode(this.getGoodsCode());
        dto.setGoodsName(this.getGoodsName());
        dto.setGoodsUnitId(this.getGoodsUnitId());
        dto.setGoodsUnitName(this.getGoodsUnitName());
        dto.setQuantity(this.getQuantity());
        dto.setGoodsIsSerial(this.getGoodsIsSerial());
        dto.setType(this.getType());
        return dto;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public Long getAioPackageGoodsId() {
        return aioPackageGoodsId;
    }

    public void setAioPackageGoodsId(Long aioPackageGoodsId) {
        this.aioPackageGoodsId = aioPackageGoodsId;
    }

    public Long getAioPackageId() {
        return aioPackageId;
    }

    public void setAioPackageId(Long aioPackageId) {
        this.aioPackageId = aioPackageId;
    }

    public Long getAioPackageDetailId() {
        return aioPackageDetailId;
    }

    public void setAioPackageDetailId(Long aioPackageDetailId) {
        this.aioPackageDetailId = aioPackageDetailId;
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

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Long getGoodsIsSerial() {
        return goodsIsSerial;
    }

    public void setGoodsIsSerial(Long goodsIsSerial) {
        this.goodsIsSerial = goodsIsSerial;
    }
}
