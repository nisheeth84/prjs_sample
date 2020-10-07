package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOPackageGoodsBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

//VietNT_20190308_create
@XmlRootElement(name = "AIO_PACKAGE_GOODSBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOPackageGoodsDTO extends ComsBaseFWDTO<AIOPackageGoodsBO> {

    private Long aioPackageGoodsId;
    private Long aioPackageId;
    private Long aioPackageDetailId;
    private Long goodsId;
    private String goodsCode;
    private String goodsName;
    private Long goodsUnitId;
    private String goodsUnitName;
    private Double quantity;
    private Long goodsIsSerial;

    private Long type;
    private boolean required;
    private Double qttOrder;
    private Double qttRemain;

    @Override
    public AIOPackageGoodsBO toModel() {
        AIOPackageGoodsBO bo = new AIOPackageGoodsBO();
        bo.setAioPackageGoodsId(this.getAioPackageGoodsId());
        bo.setAioPackageId(this.getAioPackageId());
        bo.setAioPackageDetailId(this.getAioPackageDetailId());
        bo.setGoodsId(this.getGoodsId());
        bo.setGoodsCode(this.getGoodsCode());
        bo.setGoodsName(this.getGoodsName());
        bo.setGoodsUnitId(this.getGoodsUnitId());
        bo.setGoodsUnitName(this.getGoodsUnitName());
        bo.setQuantity(this.getQuantity());
        bo.setGoodsIsSerial(this.getGoodsIsSerial());
        bo.setType(this.getType());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return aioPackageGoodsId;
    }

    @Override
    public String catchName() {
        return aioPackageGoodsId.toString();
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public boolean getRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
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

    public Double getQttOrder() {
        return qttOrder;
    }

    public void setQttOrder(Double qttOrder) {
        this.qttOrder = qttOrder;
    }

    public Double getQttRemain() {
        return qttRemain;
    }

    public void setQttRemain(Double qttRemain) {
        this.qttRemain = qttRemain;
    }
}
