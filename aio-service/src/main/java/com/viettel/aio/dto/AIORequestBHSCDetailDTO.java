package com.viettel.aio.dto;

import com.viettel.aio.bo.AIORequestBHSCDetailBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;

//VietNT_20190913_create
@XmlRootElement(name = "AIO_REQUEST_BHSC_DETAILBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIORequestBHSCDetailDTO extends ComsBaseFWDTO<AIORequestBHSCDetailBO> {

    private Long aioRequestBhscDetailId;
    private Long aioRequestBhscId;
    private Long goodsId;
    private String goodsCode;
    private String goodsName;
    private Double amount;
    private String serial;

    public Long getAioRequestBhscDetailId() {
        return aioRequestBhscDetailId;
    }

    public void setAioRequestBhscDetailId(Long aioRequestBhscDetailId) {
        this.aioRequestBhscDetailId = aioRequestBhscDetailId;
    }

    public Long getAioRequestBhscId() {
        return aioRequestBhscId;
    }

    public void setAioRequestBhscId(Long aioRequestBhscId) {
        this.aioRequestBhscId = aioRequestBhscId;
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

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    @Override
    public AIORequestBHSCDetailBO toModel() {
        AIORequestBHSCDetailBO bo = new AIORequestBHSCDetailBO();
        bo.setAioRequestBhscDetailId(this.getAioRequestBhscDetailId());
        bo.setAioRequestBhscId(this.getAioRequestBhscId());
        bo.setGoodsId(this.getGoodsId());
        bo.setGoodsCode(this.getGoodsCode());
        bo.setGoodsName(this.getGoodsName());
        bo.setAmount(this.getAmount());
        bo.setSerial(this.getSerial());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return aioRequestBhscDetailId;
    }

    @Override
    public String catchName() {
        return aioRequestBhscDetailId.toString();
    }
}
