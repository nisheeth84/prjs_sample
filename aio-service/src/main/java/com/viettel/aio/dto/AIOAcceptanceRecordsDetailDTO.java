package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOAcceptanceRecordsDetailBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

//VietNT_20190313_create
@XmlRootElement(name = "AIO_ACCEPTANCE_RECORDS_DETAILBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOAcceptanceRecordsDetailDTO extends ComsBaseFWDTO<AIOAcceptanceRecordsDetailBO> {

    private Long acceptanceRecordsDetailId;
    private Long acceptanceRecordsId;
    private Long goodsId;
    private String goodsCode;
    private String goodsName;
    private Long goodsUnitId;
    private String goodsUnitName;
    private Double quantity;
    private Double price;
    private Double amount;
    private String serial;
    private String stockTransCode;

    //VietNT_07/08/2019_start
    private Long guaranteeType;
    private String guaranteeTypeName;
    private Long guaranteeTime;
    //VietNT_end

    // dto only
    private String customerName;

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    @Override
    public AIOAcceptanceRecordsDetailBO toModel() {
        AIOAcceptanceRecordsDetailBO bo = new AIOAcceptanceRecordsDetailBO();
        bo.setAcceptanceRecordsDetailId(this.getAcceptanceRecordsDetailId());
        bo.setAcceptanceRecordsId(this.getAcceptanceRecordsId());
        bo.setGoodsId(this.getGoodsId());
        bo.setGoodsCode(this.getGoodsCode());
        bo.setGoodsName(this.getGoodsName());
        bo.setGoodsUnitId(this.getGoodsUnitId());
        bo.setGoodsUnitName(this.getGoodsUnitName());
        bo.setQuantity(this.getQuantity());
        bo.setPrice(this.getPrice());
        bo.setAmount(this.getAmount());
        bo.setSerial(this.getSerial());
        bo.setType(this.getType());
        bo.setStockTransCode(this.getStockTransCode());
        bo.setGuaranteeType(this.getGuaranteeType());
        bo.setGuaranteeTypeName(this.getGuaranteeTypeName());
        bo.setGuaranteeTime(this.getGuaranteeTime());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return acceptanceRecordsDetailId;
    }

    @Override
    public String catchName() {
        return acceptanceRecordsDetailId.toString();
    }

    public Long getAcceptanceRecordsDetailId() {
        return acceptanceRecordsDetailId;
    }

    public void setAcceptanceRecordsDetailId(Long acceptanceRecordsDetailId) {
        this.acceptanceRecordsDetailId = acceptanceRecordsDetailId;
    }

    public Long getAcceptanceRecordsId() {
        return acceptanceRecordsId;
    }

    public void setAcceptanceRecordsId(Long acceptanceRecordsId) {
        this.acceptanceRecordsId = acceptanceRecordsId;
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

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
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
//    aio_20190320_start
    private Long type;
	public Long getType() {
		return type;
	}

	public void setType(Long type) {
		this.type = type;
	}
//	aio_20190320_end

    public String getStockTransCode() {
        return stockTransCode;
    }

    public void setStockTransCode(String stockTransCode) {
        this.stockTransCode = stockTransCode;
    }

    public Long getGuaranteeType() {
        return guaranteeType;
    }

    public void setGuaranteeType(Long guaranteeType) {
        this.guaranteeType = guaranteeType;
    }

    public String getGuaranteeTypeName() {
        return guaranteeTypeName;
    }

    public void setGuaranteeTypeName(String guaranteeTypeName) {
        this.guaranteeTypeName = guaranteeTypeName;
    }

    public Long getGuaranteeTime() {
        return guaranteeTime;
    }

    public void setGuaranteeTime(Long guaranteeTime) {
        this.guaranteeTime = guaranteeTime;
    }
}
