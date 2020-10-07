package com.viettel.coms.dto;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.viettel.coms.bo.WorkItemBO;

@XmlRootElement(name = "RP_GIACOCOTBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class RpGiaCoCotDTO extends ComsBaseFWDTO<WorkItemBO>{

	private java.lang.String DonVi;
	private java.lang.Long TongKH;
	private java.lang.Long ChuaDuDKnhanBGMB;
	private java.lang.Long DuDKNhanBGMB;
	private java.lang.Long DaNhanBGMB;
	private java.lang.Long DaTrienKhai;
	private java.lang.Long XongXD;
	private java.lang.Long XongLD;
	private java.lang.Long DoiDangXD;
	private java.lang.Long Tong;
	private java.lang.Long ChuaNhanBGMB;
	private java.lang.Long NhanMBChuaTk;
	private java.lang.Long CapLenTinh;
	private java.lang.Long XongMongChuaCap;
	private java.lang.Long CapNhungChuaXongMong;
	private java.lang.Long CapChuaLap;
	private java.lang.Long DangCoDoiLap;
	private java.lang.Long KHXayDung;
	private java.lang.Long KHLapDung;
	private java.lang.Long KHDC;
	private java.lang.Long VatTuDaDamBao;
	private java.lang.Long KQXayDung;
	private java.lang.Double KQTH1;
	private java.lang.Long LapCot;
	private java.lang.Double KQTH2;
	private List<String> stationCodeLst;
	private List<String> contractCodeLst;
	private java.lang.Long month;
	private java.lang.Long year;
	private java.lang.String provinceCode;
	
	
	
	public java.lang.String getDonVi() {
		return DonVi;
	}

	public void setDonVi(java.lang.String donVi) {
		DonVi = donVi;
	}

	public List<String> getStationCodeLst() {
		return stationCodeLst;
	}

	public void setStationCodeLst(List<String> stationCodeLst) {
		this.stationCodeLst = stationCodeLst;
	}

	public List<String> getContractCodeLst() {
		return contractCodeLst;
	}

	public void setContractCodeLst(List<String> contractCodeLst) {
		this.contractCodeLst = contractCodeLst;
	}

	public java.lang.String getProvinceCode() {
		return provinceCode;
	}

	public void setProvinceCode(java.lang.String provinceCode) {
		this.provinceCode = provinceCode;
	}

	public java.lang.Long getMonth() {
		return month;
	}

	public void setMonth(java.lang.Long month) {
		this.month = month;
	}

	public java.lang.Long getYear() {
		return year;
	}

	public void setYear(java.lang.Long year) {
		this.year = year;
	}

	public java.lang.Long getTongKH() {
		return TongKH;
	}

	public void setTongKH(java.lang.Long tongKH) {
		TongKH = tongKH;
	}

	public java.lang.Long getChuaDuDKnhanBGMB() {
		return ChuaDuDKnhanBGMB;
	}

	public void setChuaDuDKnhanBGMB(java.lang.Long chuaDuDKnhanBGMB) {
		ChuaDuDKnhanBGMB = chuaDuDKnhanBGMB;
	}

	public java.lang.Long getDuDKNhanBGMB() {
		return DuDKNhanBGMB;
	}

	public void setDuDKNhanBGMB(java.lang.Long duDKNhanBGMB) {
		DuDKNhanBGMB = duDKNhanBGMB;
	}

	public java.lang.Long getDaNhanBGMB() {
		return DaNhanBGMB;
	}

	public void setDaNhanBGMB(java.lang.Long daNhanBGMB) {
		DaNhanBGMB = daNhanBGMB;
	}

	public java.lang.Long getDaTrienKhai() {
		return DaTrienKhai;
	}

	public void setDaTrienKhai(java.lang.Long daTrienKhai) {
		DaTrienKhai = daTrienKhai;
	}

	public java.lang.Long getXongXD() {
		return XongXD;
	}

	public void setXongXD(java.lang.Long xongXD) {
		XongXD = xongXD;
	}

	public java.lang.Long getXongLD() {
		return XongLD;
	}

	public void setXongLD(java.lang.Long xongLD) {
		XongLD = xongLD;
	}

	public java.lang.Long getDoiDangXD() {
		return DoiDangXD;
	}

	public void setDoiDangXD(java.lang.Long doiDangXD) {
		DoiDangXD = doiDangXD;
	}

	public java.lang.Long getTong() {
		return Tong;
	}

	public void setTong(java.lang.Long tong) {
		Tong = tong;
	}

	public java.lang.Long getChuaNhanBGMB() {
		return ChuaNhanBGMB;
	}

	public void setChuaNhanBGMB(java.lang.Long chuaNhanBGMB) {
		ChuaNhanBGMB = chuaNhanBGMB;
	}

	public java.lang.Long getNhanMBChuaTk() {
		return NhanMBChuaTk;
	}

	public void setNhanMBChuaTk(java.lang.Long nhanMBChuaTk) {
		NhanMBChuaTk = nhanMBChuaTk;
	}

	public java.lang.Long getCapLenTinh() {
		return CapLenTinh;
	}

	public void setCapLenTinh(java.lang.Long capLenTinh) {
		CapLenTinh = capLenTinh;
	}

	public java.lang.Long getXongMongChuaCap() {
		return XongMongChuaCap;
	}

	public void setXongMongChuaCap(java.lang.Long xongMongChuaCap) {
		XongMongChuaCap = xongMongChuaCap;
	}

	public java.lang.Long getCapNhungChuaXongMong() {
		return CapNhungChuaXongMong;
	}

	public void setCapNhungChuaXongMong(java.lang.Long capNhungChuaXongMong) {
		CapNhungChuaXongMong = capNhungChuaXongMong;
	}

	public java.lang.Long getCapChuaLap() {
		return CapChuaLap;
	}

	public void setCapChuaLap(java.lang.Long capChuaLap) {
		CapChuaLap = capChuaLap;
	}

	public java.lang.Long getDangCoDoiLap() {
		return DangCoDoiLap;
	}

	public void setDangCoDoiLap(java.lang.Long dangCoDoiLap) {
		DangCoDoiLap = dangCoDoiLap;
	}

	public java.lang.Long getKHXayDung() {
		return KHXayDung;
	}

	public void setKHXayDung(java.lang.Long kHXayDung) {
		KHXayDung = kHXayDung;
	}

	public java.lang.Long getKHLapDung() {
		return KHLapDung;
	}

	public void setKHLapDung(java.lang.Long kHLapDung) {
		KHLapDung = kHLapDung;
	}

	public java.lang.Long getKHDC() {
		return KHDC;
	}

	public void setKHDC(java.lang.Long kHDC) {
		KHDC = kHDC;
	}

	public java.lang.Long getVatTuDaDamBao() {
		return VatTuDaDamBao;
	}

	public void setVatTuDaDamBao(java.lang.Long vatTuDaDamBao) {
		VatTuDaDamBao = vatTuDaDamBao;
	}

	public java.lang.Long getKQXayDung() {
		return KQXayDung;
	}

	public void setKQXayDung(java.lang.Long kQXayDung) {
		KQXayDung = kQXayDung;
	}

	public java.lang.Double getKQTH1() {
		return KQTH1;
	}

	public void setKQTH1(java.lang.Double kQTH1) {
		KQTH1 = kQTH1;
	}

	public java.lang.Long getLapCot() {
		return LapCot;
	}

	public void setLapCot(java.lang.Long lapCot) {
		LapCot = lapCot;
	}

	public java.lang.Double getKQTH2() {
		return KQTH2;
	}

	public void setKQTH2(java.lang.Double kQTH2) {
		KQTH2 = kQTH2;
	}

	@Override
	public String catchName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Long getFWModelId() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public WorkItemBO toModel() {
		// TODO Auto-generated method stub
		return null;
	}

}
