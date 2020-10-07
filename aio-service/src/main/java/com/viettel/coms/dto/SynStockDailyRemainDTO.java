package com.viettel.coms.dto;

import java.sql.Timestamp;
import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.viettel.coms.bo.SynStockDailyRemainBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;

@XmlRootElement(name = "SYN_STOCK_DAILY_REMAINBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class SynStockDailyRemainDTO extends ComsBaseFWDTO<SynStockDailyRemainBO>{
	
	private Long stockDailyRemainId;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date remainDate;
	private Long sysGroupId;
	private String sysGroupCode;
	private String sysGroupName;
	private Long provinceId;
	private String provinceCode;
	private String provinceName;
	private String catStationCode;
	private String constructionCode;
	private Long goodsId;
	private String goodsCode;
	private String goodsName;
	private String goodsIsSerial;
	private String goodsUnitName;
	private Long goodsUnitId;
	private double amountTotal;
	private double price;
	private double totalMoney;
	private String serial;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Timestamp createDateTime;
	
	private double numberTonDauKy;
	private double totalMoneyTonDauKy;
	private double numberNhapTrongKy;
	private double totalMoneyNhapTrongKy;
	private double numberNghiemThuDoiSoat4A;
	private double totalMoneyNghiemThuDoiSoat4A;
	private double numberTraDenBu;
	private double totalMoneyTraDenBu;
	private double numberTonCuoiKy;
	private double totalMoneyTonCuoiKy;
	
	private double countNumberTonDauKy;
	private double countTotalMoneyTonDauKy;
	private double countNumberNhapTrongKy;
	private double countTotalMoneyNhapTrongKy;
	private double countNumberNghiemThuDoiSoat4A;
	private double countTotalMoneyNghiemThuDoiSoat4A;
	private double countNumberTraDenBu;
	private double countTotalMoneyTraDenBu;
	private double countNumberTonCuoiKy;
	private double countTotalMoneyTonCuoiKy;
	
	private double numberXuatKho;
	private double totalMoneyXuatKho;
	private double numberThucTeThiCong;
	private double totalMoneyThucTeThiCong;
	private double numberThuHoi;
	private double totalMoneyThuHoi;
	private double numberChuaThuHoi;
	private double totalMoneyChuaThuHoi;
	
	private double countNumberXuatKho;
	private double countTotalMoneyXuatKho;
	private double countNumberThucTeThiCong;
	private double countTotalMoneyThucTeThiCong;
	private double countNumberThuHoi;
	private double countTotalMoneyThuHoi;
	private double countNumberChuaThuHoi;
	private double countTotalMoneyChuaThuHoi;
	private String synStockTransCode;
	private String fromSynStockTransCode;
	private Date realIeTransDate;
	
	public Date getRealIeTransDate() {
		return realIeTransDate;
	}
	public void setRealIeTransDate(Date realIeTransDate) {
		this.realIeTransDate = realIeTransDate;
	}
	public String getFromSynStockTransCode() {
		return fromSynStockTransCode;
	}
	public void setFromSynStockTransCode(String fromSynStockTransCode) {
		this.fromSynStockTransCode = fromSynStockTransCode;
	}
	public String getSynStockTransCode() {
		return synStockTransCode;
	}
	public void setSynStockTransCode(String synStockTransCode) {
		this.synStockTransCode = synStockTransCode;
	}

	public double getNumberXuatKho() {
		return numberXuatKho;
	}

	public void setNumberXuatKho(double numberXuatKho) {
		this.numberXuatKho = numberXuatKho;
	}

	public double getTotalMoneyXuatKho() {
		return totalMoneyXuatKho;
	}

	public void setTotalMoneyXuatKho(double totalMoneyXuatKho) {
		this.totalMoneyXuatKho = totalMoneyXuatKho;
	}

	public double getNumberThucTeThiCong() {
		return numberThucTeThiCong;
	}

	public void setNumberThucTeThiCong(double numberThucTeThiCong) {
		this.numberThucTeThiCong = numberThucTeThiCong;
	}

	public double getTotalMoneyThucTeThiCong() {
		return totalMoneyThucTeThiCong;
	}

	public void setTotalMoneyThucTeThiCong(double totalMoneyThucTeThiCong) {
		this.totalMoneyThucTeThiCong = totalMoneyThucTeThiCong;
	}

	public double getNumberThuHoi() {
		return numberThuHoi;
	}

	public void setNumberThuHoi(double numberThuHoi) {
		this.numberThuHoi = numberThuHoi;
	}

	public double getTotalMoneyThuHoi() {
		return totalMoneyThuHoi;
	}

	public void setTotalMoneyThuHoi(double totalMoneyThuHoi) {
		this.totalMoneyThuHoi = totalMoneyThuHoi;
	}

	public double getNumberChuaThuHoi() {
		return numberChuaThuHoi;
	}

	public void setNumberChuaThuHoi(double numberChuaThuHoi) {
		this.numberChuaThuHoi = numberChuaThuHoi;
	}

	public double getTotalMoneyChuaThuHoi() {
		return totalMoneyChuaThuHoi;
	}

	public void setTotalMoneyChuaThuHoi(double totalMoneyChuaThuHoi) {
		this.totalMoneyChuaThuHoi = totalMoneyChuaThuHoi;
	}

	public double getCountNumberXuatKho() {
		return countNumberXuatKho;
	}

	public void setCountNumberXuatKho(double countNumberXuatKho) {
		this.countNumberXuatKho = countNumberXuatKho;
	}

	public double getCountTotalMoneyXuatKho() {
		return countTotalMoneyXuatKho;
	}

	public void setCountTotalMoneyXuatKho(double countTotalMoneyXuatKho) {
		this.countTotalMoneyXuatKho = countTotalMoneyXuatKho;
	}

	public double getCountNumberThucTeThiCong() {
		return countNumberThucTeThiCong;
	}

	public void setCountNumberThucTeThiCong(double countNumberThucTeThiCong) {
		this.countNumberThucTeThiCong = countNumberThucTeThiCong;
	}

	public double getCountTotalMoneyThucTeThiCong() {
		return countTotalMoneyThucTeThiCong;
	}

	public void setCountTotalMoneyThucTeThiCong(double countTotalMoneyThucTeThiCong) {
		this.countTotalMoneyThucTeThiCong = countTotalMoneyThucTeThiCong;
	}

	public double getCountNumberThuHoi() {
		return countNumberThuHoi;
	}

	public void setCountNumberThuHoi(double countNumberThuHoi) {
		this.countNumberThuHoi = countNumberThuHoi;
	}

	public double getCountTotalMoneyThuHoi() {
		return countTotalMoneyThuHoi;
	}

	public void setCountTotalMoneyThuHoi(double countTotalMoneyThuHoi) {
		this.countTotalMoneyThuHoi = countTotalMoneyThuHoi;
	}

	public double getCountNumberChuaThuHoi() {
		return countNumberChuaThuHoi;
	}

	public void setCountNumberChuaThuHoi(double countNumberChuaThuHoi) {
		this.countNumberChuaThuHoi = countNumberChuaThuHoi;
	}

	public double getCountTotalMoneyChuaThuHoi() {
		return countTotalMoneyChuaThuHoi;
	}

	public void setCountTotalMoneyChuaThuHoi(double countTotalMoneyChuaThuHoi) {
		this.countTotalMoneyChuaThuHoi = countTotalMoneyChuaThuHoi;
	}

	public double getCountNumberTonDauKy() {
		return countNumberTonDauKy;
	}

	public void setCountNumberTonDauKy(double countNumberTonDauKy) {
		this.countNumberTonDauKy = countNumberTonDauKy;
	}

	public double getCountTotalMoneyTonDauKy() {
		return countTotalMoneyTonDauKy;
	}

	public void setCountTotalMoneyTonDauKy(double countTotalMoneyTonDauKy) {
		this.countTotalMoneyTonDauKy = countTotalMoneyTonDauKy;
	}

	public double getCountNumberNhapTrongKy() {
		return countNumberNhapTrongKy;
	}

	public void setCountNumberNhapTrongKy(double countNumberNhapTrongKy) {
		this.countNumberNhapTrongKy = countNumberNhapTrongKy;
	}

	public double getCountTotalMoneyNhapTrongKy() {
		return countTotalMoneyNhapTrongKy;
	}

	public void setCountTotalMoneyNhapTrongKy(double countTotalMoneyNhapTrongKy) {
		this.countTotalMoneyNhapTrongKy = countTotalMoneyNhapTrongKy;
	}

	public double getCountNumberNghiemThuDoiSoat4A() {
		return countNumberNghiemThuDoiSoat4A;
	}

	public void setCountNumberNghiemThuDoiSoat4A(double countNumberNghiemThuDoiSoat4A) {
		this.countNumberNghiemThuDoiSoat4A = countNumberNghiemThuDoiSoat4A;
	}

	public double getCountTotalMoneyNghiemThuDoiSoat4A() {
		return countTotalMoneyNghiemThuDoiSoat4A;
	}

	public void setCountTotalMoneyNghiemThuDoiSoat4A(double countTotalMoneyNghiemThuDoiSoat4A) {
		this.countTotalMoneyNghiemThuDoiSoat4A = countTotalMoneyNghiemThuDoiSoat4A;
	}

	public double getCountNumberTraDenBu() {
		return countNumberTraDenBu;
	}

	public void setCountNumberTraDenBu(double countNumberTraDenBu) {
		this.countNumberTraDenBu = countNumberTraDenBu;
	}

	public double getCountTotalMoneyTraDenBu() {
		return countTotalMoneyTraDenBu;
	}

	public void setCountTotalMoneyTraDenBu(double countTotalMoneyTraDenBu) {
		this.countTotalMoneyTraDenBu = countTotalMoneyTraDenBu;
	}

	public double getCountNumberTonCuoiKy() {
		return countNumberTonCuoiKy;
	}

	public void setCountNumberTonCuoiKy(double countNumberTonCuoiKy) {
		this.countNumberTonCuoiKy = countNumberTonCuoiKy;
	}

	public double getCountTotalMoneyTonCuoiKy() {
		return countTotalMoneyTonCuoiKy;
	}

	public void setCountTotalMoneyTonCuoiKy(double countTotalMoneyTonCuoiKy) {
		this.countTotalMoneyTonCuoiKy = countTotalMoneyTonCuoiKy;
	}

	private String text;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date dateFrom;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date dateTo;
	private String description;

	public double getNumberTonDauKy() {
		return numberTonDauKy;
	}

	public void setNumberTonDauKy(double numberTonDauKy) {
		this.numberTonDauKy = numberTonDauKy;
	}

	public double getTotalMoneyTonDauKy() {
		return totalMoneyTonDauKy;
	}

	public void setTotalMoneyTonDauKy(double totalMoneyTonDauKy) {
		this.totalMoneyTonDauKy = totalMoneyTonDauKy;
	}

	public double getNumberNhapTrongKy() {
		return numberNhapTrongKy;
	}

	public void setNumberNhapTrongKy(double numberNhapTrongKy) {
		this.numberNhapTrongKy = numberNhapTrongKy;
	}

	public double getTotalMoneyNhapTrongKy() {
		return totalMoneyNhapTrongKy;
	}

	public void setTotalMoneyNhapTrongKy(double totalMoneyNhapTrongKy) {
		this.totalMoneyNhapTrongKy = totalMoneyNhapTrongKy;
	}

	public double getNumberNghiemThuDoiSoat4A() {
		return numberNghiemThuDoiSoat4A;
	}

	public void setNumberNghiemThuDoiSoat4A(double numberNghiemThuDoiSoat4A) {
		this.numberNghiemThuDoiSoat4A = numberNghiemThuDoiSoat4A;
	}

	public double getTotalMoneyNghiemThuDoiSoat4A() {
		return totalMoneyNghiemThuDoiSoat4A;
	}

	public void setTotalMoneyNghiemThuDoiSoat4A(double totalMoneyNghiemThuDoiSoat4A) {
		this.totalMoneyNghiemThuDoiSoat4A = totalMoneyNghiemThuDoiSoat4A;
	}

	public double getNumberTraDenBu() {
		return numberTraDenBu;
	}

	public void setNumberTraDenBu(double numberTraDenBu) {
		this.numberTraDenBu = numberTraDenBu;
	}

	public double getTotalMoneyTraDenBu() {
		return totalMoneyTraDenBu;
	}

	public void setTotalMoneyTraDenBu(double totalMoneyTraDenBu) {
		this.totalMoneyTraDenBu = totalMoneyTraDenBu;
	}

	public double getNumberTonCuoiKy() {
		return numberTonCuoiKy;
	}

	public void setNumberTonCuoiKy(double numberTonCuoiKy) {
		this.numberTonCuoiKy = numberTonCuoiKy;
	}

	public double getTotalMoneyTonCuoiKy() {
		return totalMoneyTonCuoiKy;
	}

	public void setTotalMoneyTonCuoiKy(double totalMoneyTonCuoiKy) {
		this.totalMoneyTonCuoiKy = totalMoneyTonCuoiKy;
	}

	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Date getDateFrom() {
		return dateFrom;
	}
	public void setDateFrom(Date dateFrom) {
		this.dateFrom = dateFrom;
	}
	public Date getDateTo() {
		return dateTo;
	}
	public void setDateTo(Date dateTo) {
		this.dateTo = dateTo;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}


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
	public String catchName() {
		// TODO Auto-generated method stub
		return getStockDailyRemainId().toString();
	}
	@Override
	public Long getFWModelId() {
		// TODO Auto-generated method stub
		return stockDailyRemainId;
	}
	
	@Override
	public SynStockDailyRemainBO toModel() {
		SynStockDailyRemainBO synStockDailyRemainBO = new SynStockDailyRemainBO();
		synStockDailyRemainBO.setStockDailyRemainId(this.stockDailyRemainId);
		synStockDailyRemainBO.setRemainDate(this.remainDate);
		synStockDailyRemainBO.setSysGroupId(this.sysGroupId);
		synStockDailyRemainBO.setSysGroupCode(this.sysGroupCode);
		synStockDailyRemainBO.setSysGroupName(this.sysGroupName);
		synStockDailyRemainBO.setProvinceId(this.provinceId);
		synStockDailyRemainBO.setProvinceCode(this.provinceCode);
		synStockDailyRemainBO.setProvinceName(this.provinceName);
		synStockDailyRemainBO.setCatStationCode(this.catStationCode);
		synStockDailyRemainBO.setConstructionCode(this.constructionCode);
		synStockDailyRemainBO.setGoodsId(this.goodsId);
		synStockDailyRemainBO.setGoodsCode(this.goodsCode);
		synStockDailyRemainBO.setGoodsName(this.goodsName);
		synStockDailyRemainBO.setGoodsIsSerial(this.goodsIsSerial);
		synStockDailyRemainBO.setGoodsUnitId(this.goodsUnitId);
		synStockDailyRemainBO.setGoodsUnitName(this.goodsUnitName);
		synStockDailyRemainBO.setAmountTotal(this.amountTotal);
		synStockDailyRemainBO.setPrice(this.price);
		synStockDailyRemainBO.setTotalMoney(this.totalMoney);
		synStockDailyRemainBO.setSerial(this.serial);
		synStockDailyRemainBO.setCreateDateTime(this.createDateTime);
		synStockDailyRemainBO.setSynStockTransCode(this.synStockTransCode);
		return synStockDailyRemainBO;
	}
}
