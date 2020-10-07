package com.viettel.aio.bo;

import com.viettel.aio.dto.AIORequestBHSCDetailDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

//VietNT_20190913_start
@Entity
@Table(name = "AIO_REQUEST_BHSC_DETAIL")
public class AIORequestBHSCDetailBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_REQUEST_BHSC_DETAIL_SEQ")})
    @Column(name = "AIO_REQUEST_BHSC_DETAIL_ID", length = 10)
    private Long aioRequestBhscDetailId;
    @Column(name = "AIO_REQUEST_BHSC_ID", length = 10)
    private Long aioRequestBhscId;
    @Column(name = "GOODS_ID", length = 10)
    private Long goodsId;
    @Column(name = "GOODS_CODE", length = 50)
    private String goodsCode;
    @Column(name = "GOODS_NAME", length = 1000)
    private String goodsName;
    @Column(name = "AMOUNT", length = 10)
    private Double amount;
    @Column(name = "SERIAL", length = 20)
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
    public BaseFWDTOImpl toDTO() {
        AIORequestBHSCDetailDTO dto = new AIORequestBHSCDetailDTO();
        dto.setAioRequestBhscDetailId(this.getAioRequestBhscDetailId());
        dto.setAioRequestBhscId(this.getAioRequestBhscId());
        dto.setGoodsId(this.getGoodsId());
        dto.setGoodsCode(this.getGoodsCode());
        dto.setGoodsName(this.getGoodsName());
        dto.setAmount(this.getAmount());
        dto.setSerial(this.getSerial());
        return dto;
    }
}
