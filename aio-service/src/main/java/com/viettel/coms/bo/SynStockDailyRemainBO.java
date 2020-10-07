package com.viettel.coms.bo;

import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import com.viettel.coms.dto.SynStockDailyRemainDTO;
import com.viettel.service.base.model.BaseFWModelImpl;

@Entity
@Table(name = "SYN_STOCK_DAILY_REMAIN")
public class SynStockDailyRemainBO extends BaseFWModelImpl{
	
	@Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "SYN_STOCK_DAILY_REMAIN_SEQ")})
    @Column(name = "STOCK_DAILY_REMAIN_ID", length = 10)
	private Long stockDailyRemainId;
	@Column(name = "REMAIN_DATE")
	private Date remainDate;
	@Column(name = "SYS_GROUP_ID", length = 10)
	private Long sysGroupId;
	@Column(name = "SYS_GROUP_CODE")
	private String sysGroupCode;
	@Column(name = "SYS_GROUP_NAME")
	private String sysGroupName;
	@Column(name = "PROVINCE_ID", length = 10)
	private Long provinceId;
	@Column(name = "PROVINCE_CODE")
	private String provinceCode;
	@Column(name = "PROVINCE_NAME")
	private String provinceName;
	@Column(name = "CAT_STATION_CODE")
	private String catStationCode;
	@Column(name = "CONSTRUCTION_CODE")
	private String constructionCode;
	@Column(name = "GOODS_ID", length = 10)
	private Long goodsId;
	@Column(name = "GOODS_CODE")
	private String goodsCode;
	@Column(name = "GOODS_NAME")
	private String goodsName;
	@Column(name = "GOODS_IS_SERIAL")
	private String goodsIsSerial;
	@Column(name = "GOODS_UNIT_NAME")
	private String goodsUnitName;
	@Column(name = "GOODS_UNIT_ID", length = 10)
	private Long goodsUnitId;
	@Column(name = "AMOUNT_TOTAL")
	private double amountTotal;
	@Column(name = "PRICE")
	private double price;
	@Column(name = "TOTAL_MONEY")
	private double totalMoney;
	@Column(name = "SERIAL")
	private String serial;
	@Column(name = "CREATE_DATE_TIME")
	private Timestamp createDateTime;

    //VietNT_20190215_start
	@Column(name = "SYN_STOCK_TRANS_CODE")
	private String synStockTransCode;

	public String getSynStockTransCode() {
		return synStockTransCode;
	}

	public void setSynStockTransCode(String synStockTransCode) {
		this.synStockTransCode = synStockTransCode;
	}
    //VietNT_end
	public Long getStockDailyRemainId() {
		return stockDailyRemainId;
	}

	public void setStockDailyRemainId(Long stockDailyRemainId) {
		this.stockDailyRemainId = stockDailyRemainId;
	}

	public Date getRemainDate() {
		return remainDate;
	}

	public void setRemainDate(Date remainDate) {
		this.remainDate = remainDate;
	}

	public Long getSysGroupId() {
		return sysGroupId;
	}

	public void setSysGroupId(Long sysGroupId) {
		this.sysGroupId = sysGroupId;
	}

	public String getSysGroupCode() {
		return sysGroupCode;
	}

	public void setSysGroupCode(String sysGroupCode) {
		this.sysGroupCode = sysGroupCode;
	}

	public String getSysGroupName() {
		return sysGroupName;
	}

	public void setSysGroupName(String sysGroupName) {
		this.sysGroupName = sysGroupName;
	}

	public Long getProvinceId() {
		return provinceId;
	}

	public void setProvinceId(Long provinceId) {
		this.provinceId = provinceId;
	}

	public String getProvinceCode() {
		return provinceCode;
	}

	public void setProvinceCode(String provinceCode) {
		this.provinceCode = provinceCode;
	}

	public String getProvinceName() {
		return provinceName;
	}

	public void setProvinceName(String provinceName) {
		this.provinceName = provinceName;
	}

	public String getCatStationCode() {
		return catStationCode;
	}

	public void setCatStationCode(String catStationCode) {
		this.catStationCode = catStationCode;
	}

	public String getConstructionCode() {
		return constructionCode;
	}

	public void setConstructionCode(String constructionCode) {
		this.constructionCode = constructionCode;
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

	public String getGoodsIsSerial() {
		return goodsIsSerial;
	}

	public void setGoodsIsSerial(String goodsIsSerial) {
		this.goodsIsSerial = goodsIsSerial;
	}

	public String getGoodsUnitName() {
		return goodsUnitName;
	}

	public void setGoodsUnitName(String goodsUnitName) {
		this.goodsUnitName = goodsUnitName;
	}

	public Long getGoodsUnitId() {
		return goodsUnitId;
	}

	public void setGoodsUnitId(Long goodsUnitId) {
		this.goodsUnitId = goodsUnitId;
	}

	public double getAmountTotal() {
		return amountTotal;
	}

	public void setAmountTotal(double amountTotal) {
		this.amountTotal = amountTotal;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public double getTotalMoney() {
		return totalMoney;
	}

	public void setTotalMoney(double totalMoney) {
		this.totalMoney = totalMoney;
	}

	public String getSerial() {
		return serial;
	}

	public void setSerial(String serial) {
		this.serial = serial;
	}

	public Timestamp getCreateDateTime() {
		return createDateTime;
	}

	public void setCreateDateTime(Timestamp createDateTime) {
		this.createDateTime = createDateTime;
	}

	@Override
	public SynStockDailyRemainDTO toDTO() {
		SynStockDailyRemainDTO synStockDailyRemainDTO = new SynStockDailyRemainDTO();
		synStockDailyRemainDTO.setStockDailyRemainId(this.stockDailyRemainId);
		synStockDailyRemainDTO.setRemainDate(this.remainDate);
		synStockDailyRemainDTO.setSysGroupId(this.sysGroupId);
		synStockDailyRemainDTO.setSysGroupCode(this.sysGroupCode);
		synStockDailyRemainDTO.setSysGroupName(this.sysGroupName);
		synStockDailyRemainDTO.setProvinceId(this.provinceId);
		synStockDailyRemainDTO.setProvinceCode(this.provinceCode);
		synStockDailyRemainDTO.setProvinceName(this.provinceName);
		synStockDailyRemainDTO.setCatStationCode(this.catStationCode);
		synStockDailyRemainDTO.setConstructionCode(this.constructionCode);
		synStockDailyRemainDTO.setGoodsId(this.goodsId);
		synStockDailyRemainDTO.setGoodsCode(this.goodsCode);
		synStockDailyRemainDTO.setGoodsName(this.goodsName);
		synStockDailyRemainDTO.setGoodsIsSerial(this.goodsIsSerial);
		synStockDailyRemainDTO.setGoodsUnitId(this.goodsUnitId);
		synStockDailyRemainDTO.setGoodsUnitName(this.goodsUnitName);
		synStockDailyRemainDTO.setAmountTotal(this.amountTotal);
		synStockDailyRemainDTO.setPrice(this.price);
		synStockDailyRemainDTO.setTotalMoney(this.totalMoney);
		synStockDailyRemainDTO.setSerial(this.serial);
		synStockDailyRemainDTO.setCreateDateTime(this.createDateTime);
		return synStockDailyRemainDTO;
	}

}
