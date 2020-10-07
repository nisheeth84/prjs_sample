package com.viettel.aio.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

/**
 *
 * @author chinhpxn
 */
@SuppressWarnings("serial")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CntContractReportDTO extends CntContractDTO {
	private Long statusTC;
	private Long statusHSHC;
	private Long statusDT;
	private Double quantityChuaTC;
	private Double priceChuaTC;
	private Double quantityTCdodang;
	private Double priceTCdodang;
	private Double quantityTCxong;
	private Double priceTCxong;
	private Double quantityHuy;
	private Double priceHuy;
	private Double totalPriceSL;
	private Double quantityCoHSHC;
	private Double priceCoHSHC;
	private Double quantityChuaCoHSHC;
	private Double priceChuaCoHSHC;
	private Double quantityDaQT;
	private Double priceDaQT;
	private Double quantityChuaQT;
	private Double priceChuaQT;
	private Double quantityLDT;
	private Double priceLDT;
	private Double quantityChuaLDT;
	private Double priceChuaLDT;
	private Double priceSLdieuchinh;
	private Double slDoDang;
	private Long isExport;
	
	public Long getIsExport() {
		return isExport;
	}
	public void setIsExport(Long isExport) {
		this.isExport = isExport;
	}
	public Long getStatusTC() {
		return statusTC;
	}
	public void setStatusTC(Long statusTC) {
		this.statusTC = statusTC;
	}
	public Long getStatusHSHC() {
		return statusHSHC;
	}
	public void setStatusHSHC(Long statusHSHC) {
		this.statusHSHC = statusHSHC;
	}
	public Long getStatusDT() {
		return statusDT;
	}
	public void setStatusDT(Long statusDT) {
		this.statusDT = statusDT;
	}
	public Double getQuantityChuaTC() {
		return quantityChuaTC;
	}
	public void setQuantityChuaTC(Double quantityChuaTC) {
		this.quantityChuaTC = quantityChuaTC;
	}
	public Double getPriceChuaTC() {
		return priceChuaTC;
	}
	public void setPriceChuaTC(Double priceChuaTC) {
		this.priceChuaTC = priceChuaTC;
	}
	public Double getQuantityTCdodang() {
		return quantityTCdodang;
	}
	public void setQuantityTCdodang(Double quantityTCdodang) {
		this.quantityTCdodang = quantityTCdodang;
	}
	public Double getPriceTCdodang() {
		return priceTCdodang;
	}
	public void setPriceTCdodang(Double priceTCdodang) {
		this.priceTCdodang = priceTCdodang;
	}
	public Double getQuantityTCxong() {
		return quantityTCxong;
	}
	public void setQuantityTCxong(Double quantityTCxong) {
		this.quantityTCxong = quantityTCxong;
	}
	public Double getPriceTCxong() {
		return priceTCxong;
	}
	public void setPriceTCxong(Double priceTCxong) {
		this.priceTCxong = priceTCxong;
	}
	public Double getQuantityHuy() {
		return quantityHuy;
	}
	public void setQuantityHuy(Double quantityHuy) {
		this.quantityHuy = quantityHuy;
	}
	public Double getPriceHuy() {
		return priceHuy;
	}
	public void setPriceHuy(Double priceHuy) {
		this.priceHuy = priceHuy;
	}
	public Double getTotalPriceSL() {
		return totalPriceSL;
	}
	public void setTotalPriceSL(Double totalPriceSL) {
		this.totalPriceSL = totalPriceSL;
	}
	public Double getQuantityCoHSHC() {
		return quantityCoHSHC;
	}
	public void setQuantityCoHSHC(Double quantityCoHSHC) {
		this.quantityCoHSHC = quantityCoHSHC;
	}
	public Double getPriceCoHSHC() {
		return priceCoHSHC;
	}
	public void setPriceCoHSHC(Double priceCoHSHC) {
		this.priceCoHSHC = priceCoHSHC;
	}
	public Double getQuantityChuaCoHSHC() {
		return quantityChuaCoHSHC;
	}
	public void setQuantityChuaCoHSHC(Double quantityChuaCoHSHC) {
		this.quantityChuaCoHSHC = quantityChuaCoHSHC;
	}
	public Double getPriceChuaCoHSHC() {
		return priceChuaCoHSHC;
	}
	public void setPriceChuaCoHSHC(Double priceChuaCoHSHC) {
		this.priceChuaCoHSHC = priceChuaCoHSHC;
	}
	public Double getQuantityDaQT() {
		return quantityDaQT;
	}
	public void setQuantityDaQT(Double quantityDaQT) {
		this.quantityDaQT = quantityDaQT;
	}
	public Double getPriceDaQT() {
		return priceDaQT;
	}
	public void setPriceDaQT(Double priceDaQT) {
		this.priceDaQT = priceDaQT;
	}
	public Double getQuantityChuaQT() {
		return quantityChuaQT;
	}
	public void setQuantityChuaQT(Double quantityChuaQT) {
		this.quantityChuaQT = quantityChuaQT;
	}
	public Double getPriceChuaQT() {
		return priceChuaQT;
	}
	public void setPriceChuaQT(Double priceChuaQT) {
		this.priceChuaQT = priceChuaQT;
	}
	public Double getQuantityLDT() {
		return quantityLDT;
	}
	public void setQuantityLDT(Double quantityLDT) {
		this.quantityLDT = quantityLDT;
	}
	public Double getPriceLDT() {
		return priceLDT;
	}
	public void setPriceLDT(Double priceLDT) {
		this.priceLDT = priceLDT;
	}
	public Double getQuantityChuaLDT() {
		return quantityChuaLDT;
	}
	public void setQuantityChuaLDT(Double quantityChuaLDT) {
		this.quantityChuaLDT = quantityChuaLDT;
	}
	public Double getPriceChuaLDT() {
		return priceChuaLDT;
	}
	public void setPriceChuaLDT(Double priceChuaLDT) {
		this.priceChuaLDT = priceChuaLDT;
	}
	public Double getPriceSLdieuchinh() {
		return priceSLdieuchinh;
	}
	public void setPriceSLdieuchinh(Double priceSLdieuchinh) {
		this.priceSLdieuchinh = priceSLdieuchinh;
	}
	public Double getSlDoDang() {
		return slDoDang;
	}
	public void setSlDoDang(Double slDoDang) {
		this.slDoDang = slDoDang;
	}

}
