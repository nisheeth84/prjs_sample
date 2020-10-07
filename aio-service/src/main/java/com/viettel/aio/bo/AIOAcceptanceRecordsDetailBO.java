package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOAcceptanceRecordsDetailDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

//VietNT_20190313_start
@Entity
@Table(name = "AIO_ACCEPTANCE_RECORDS_DETAIL")
public class AIOAcceptanceRecordsDetailBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_ACCEPTANCE_RECORDS_DETAIL_SEQ")})
    @Column(name = "ACCEPTANCE_RECORDS_DETAIL_ID", length = 10)
    private Long acceptanceRecordsDetailId;
    @Column(name = "ACCEPTANCE_RECORDS_ID", length = 10)
    private Long acceptanceRecordsId;
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
    @Column(name = "PRICE", length = 15)
    private Double price;
    @Column(name = "AMOUNT", length = 15)
    private Double amount;
    @Column(name = "SERIAL", length = 50)
    private String serial;
//    aio_20190320_start
    @Column(name = "TYPE", length = 50)
    private Long type;
//    aio_20190320_end
    //VietNT_06/08/2019_start
    @Column(name = "STOCK_TRANS_CODE", length = 200)
    private String stockTransCode;
    //VietNT_end
    //VietNT_07/08/2019_start
    @Column(name = "GUARANTEE_TYPE", length = 200)
    private Long guaranteeType;
    @Column(name = "GUARANTEE_TYPE_NAME", length = 200)
    private String guaranteeTypeName;
    @Column(name = "GUARANTEE_TIME", length = 200)
    private Long guaranteeTime;
    //VietNT_end

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOAcceptanceRecordsDetailDTO dto = new AIOAcceptanceRecordsDetailDTO();
        dto.setAcceptanceRecordsDetailId(this.getAcceptanceRecordsDetailId());
        dto.setAcceptanceRecordsId(this.getAcceptanceRecordsId());
        dto.setGoodsId(this.getGoodsId());
        dto.setGoodsCode(this.getGoodsCode());
        dto.setGoodsName(this.getGoodsName());
        dto.setGoodsUnitId(this.getGoodsUnitId());
        dto.setGoodsUnitName(this.getGoodsUnitName());
        dto.setQuantity(this.getQuantity());
        dto.setPrice(this.getPrice());
        dto.setAmount(this.getAmount());
        dto.setSerial(this.getSerial());
//        aio_20190320_start
        dto.setType(this.getType());
//        aio_20190320_end
        dto.setStockTransCode(this.getStockTransCode());
        dto.setGuaranteeType(this.getGuaranteeType());
        dto.setGuaranteeTypeName(this.getGuaranteeTypeName());
        dto.setGuaranteeTime(this.getGuaranteeTime());
        return dto;
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
    //aio_20190320_start
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
